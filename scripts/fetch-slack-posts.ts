import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import ogs from 'open-graph-scraper';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ESモジュールでの__dirnameの代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 環境変数の読み込み
dotenv.config();

const token = process.env.SLACK_BOT_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID;
const geminiApiKey = process.env.GEMINI_API_KEY;

// データファイルのパス
const DATA_FILE_PATH = path.join(__dirname, '../src/data/posts.json');

interface LinkItem {
    id: string;
    url: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    date: string;
    imageUrl: string;
}

// Gemini AIを使ったカテゴリ分類
async function categorizeWithAI(title: string, description: string): Promise<{ category: string; tags: string[] }> {
    if (!geminiApiKey) {
        console.warn('GEMINI_API_KEY not set, using fallback categorization');
        return fallbackCategorization(title, description);
    }

    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

        const prompt = `以下のタイトルと説明文から、最も適切なカテゴリを1つ選択し、関連するタグを3-5個提案してください。

タイトル: ${title}
説明: ${description}

カテゴリは以下から1つ選択:
- LLM: 大規模言語モデル、ChatGPT、Claude、Gemini等
- 画像/動画: 画像生成、動画生成、Midjourney、Runway等
- 開発/コード: プログラミング、GitHub、開発ツール等
- リサーチ: 研究論文、arXiv、学術研究等
- ツール: AIツール、アプリケーション等
- ニュース: AI業界ニュース、その他

JSON形式で以下のように回答してください:
{
  "category": "選択したカテゴリ",
  "tags": ["タグ1", "タグ2", "タグ3"]
}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // JSONを抽出（マークダウンのコードブロックを除去）
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                category: parsed.category || 'ニュース',
                tags: Array.isArray(parsed.tags) ? parsed.tags : ['AI', 'Tech']
            };
        }

        throw new Error('Failed to parse AI response');
    } catch (error) {
        console.error('AI categorization failed, using fallback:', error);
        return fallbackCategorization(title, description);
    }
}

// フォールバック用のキーワードベース分類
function fallbackCategorization(title: string, description: string): { category: string; tags: string[] } {
    let category = 'ニュース';
    const tags = ['AI', 'Tech'];

    const lowerTitle = title.toLowerCase();
    const lowerDesc = description.toLowerCase();

    if (lowerTitle.includes('gpt') || lowerTitle.includes('llm') || lowerTitle.includes('gemini') || lowerTitle.includes('claude')) {
        category = 'LLM';
        tags.push('LLM');
    } else if (lowerTitle.includes('image') || lowerTitle.includes('video') || lowerTitle.includes('midjourney') || lowerTitle.includes('runway')) {
        category = '画像/動画';
        tags.push('Generative Media');
    } else if (lowerTitle.includes('github') || lowerTitle.includes('code') || lowerTitle.includes('dev')) {
        category = '開発/コード';
        tags.push('Development');
    } else if (lowerTitle.includes('paper') || lowerTitle.includes('arxiv') || lowerTitle.includes('research')) {
        category = 'リサーチ';
        tags.push('Research');
    } else if (lowerTitle.includes('tool') || lowerTitle.includes('app')) {
        category = 'ツール';
        tags.push('Tool');
    }

    return { category, tags };
}

async function fetchSlackPosts() {
    if (!token || !channelId) {
        console.error('Error: SLACK_BOT_TOKEN and SLACK_CHANNEL_ID must be set in .env file.');
        process.exit(1);
    }

    const client = new WebClient(token);

    try {
        // コマンドライン引数から日数を取得（デフォルトは1日）
        const args = process.argv.slice(2);
        const daysArg = args.find(arg => arg.startsWith('--days='));
        const days = daysArg ? parseInt(daysArg.split('=')[1], 10) : 1;

        console.log(`Fetching posts for the last ${days} day(s)...`);

        // 取得期間の計算
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const oldest = (startDate.getTime() / 1000).toString();

        // Slackからメッセージを取得
        const result = await client.conversations.history({
            channel: channelId,
            limit: 100, // 多めに取得
            oldest: oldest
        });

        if (!result.messages) {
            console.log('No messages found.');
            return;
        }

        console.log(`Fetched ${result.messages.length} messages.`);

        // 既存データの読み込み
        let posts: LinkItem[] = [];
        if (fs.existsSync(DATA_FILE_PATH)) {
            const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
            posts = JSON.parse(fileContent);
        }

        const newPosts: LinkItem[] = [];
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        for (const message of result.messages) {
            // Botの投稿はスキップ（必要に応じて）
            // if (message.bot_id) continue;

            // メッセージのリストを作成（親メッセージ + スレッド返信）
            // Slack APIの型定義が厳密でない場合があるため、anyで回避しつつ必要なプロパティにアクセス
            let messagesToProcess: any[] = [message];

            // スレッドがある場合は返信を取得
            if (message.thread_ts) {
                try {
                    const replies = await client.conversations.replies({
                        channel: channelId,
                        ts: message.thread_ts
                    });
                    if (replies.messages) {
                        // replies.messagesには親メッセージも含まれるため、そのまま使用
                        messagesToProcess = replies.messages;
                    }
                } catch (e) {
                    console.error(`Failed to fetch replies for thread ${message.thread_ts}:`, e);
                }
            }

            for (const msg of messagesToProcess) {
                const text = msg.text || '';
                const urls = text.match(urlRegex);

                if (urls) {
                    for (const url of urls) {
                        // 既に登録済みのURLはスキップ
                        if (posts.some(p => p.url === url) || newPosts.some(p => p.url === url)) {
                            // console.log(`Skipping existing URL: ${url}`);
                            continue;
                        }

                        // URLのクリーニング（末尾の>などを削除）
                        const cleanUrl = url.replace(/[>)]$/, '');

                        console.log(`Processing URL: ${cleanUrl}`);

                        try {
                            const { result: ogsResult } = await ogs({ url: cleanUrl });

                            if (!ogsResult.success) {
                                console.error(`Failed to fetch OGP for ${cleanUrl}`);
                                continue;
                            }

                            const title = ogsResult.ogTitle || ogsResult.twitterTitle;

                            // タイトルがない、または "No Title" の場合はスキップ
                            if (!title || title === 'No Title') {
                                console.log(`Skipping URL due to missing title: ${cleanUrl}`);
                                continue;
                            }

                            const description = ogsResult.ogDescription || ogsResult.twitterDescription || 'No description available.';
                            let imageUrl = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800'; // デフォルト画像

                            if (ogsResult.ogImage && ogsResult.ogImage.length > 0) {
                                imageUrl = ogsResult.ogImage[0].url;
                            } else if (ogsResult.twitterImage && ogsResult.twitterImage.length > 0) {
                                imageUrl = ogsResult.twitterImage[0].url;
                            }

                            // 日付のフォーマット (YYYY-MM-DD)
                            const date = new Date(parseFloat(msg.ts!) * 1000).toISOString().split('T')[0];

                            // AIを使ったカテゴリ分類
                            console.log(`Categorizing with AI: ${title}`);
                            const { category, tags } = await categorizeWithAI(title, description);

                            const newItem: LinkItem = {
                                id: Math.random().toString(36).substr(2, 9),
                                url: cleanUrl,
                                title: title,
                                description: description,
                                category: category,
                                tags: tags,
                                date: date,
                                imageUrl: imageUrl
                            };

                            newPosts.push(newItem);
                            console.log(`Added: ${title}`);

                        } catch (error) {
                            console.error(`Error processing URL ${cleanUrl}:`, error);
                        }
                    }
                }
            }
        }

        if (newPosts.length > 0) {
            // 新しい投稿を先頭に追加
            const updatedPosts = [...newPosts, ...posts];
            fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedPosts, null, 2), 'utf-8');
            console.log(`Successfully added ${newPosts.length} new posts.`);
        } else {
            console.log('No new posts to add.');
        }

    } catch (error) {
        console.error('Error fetching history:', error);
    }
}

fetchSlackPosts();
