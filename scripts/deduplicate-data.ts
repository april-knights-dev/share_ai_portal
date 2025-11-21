import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

try {
    if (fs.existsSync(DATA_FILE_PATH)) {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        const posts: LinkItem[] = JSON.parse(fileContent);

        const uniquePosts: LinkItem[] = [];
        const seenUrls = new Set<string>();

        // 重複を排除（URLをキーにする）
        for (const post of posts) {
            // URLの正規化（末尾のスラッシュ削除など）も考慮できるが、今回は完全一致で判定
            if (!seenUrls.has(post.url)) {
                seenUrls.add(post.url);
                uniquePosts.push(post);
            }
        }

        const removedCount = posts.length - uniquePosts.length;

        if (removedCount > 0) {
            fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(uniquePosts, null, 2), 'utf-8');
            console.log(`Successfully removed ${removedCount} duplicate items from posts.json.`);
        } else {
            console.log('No duplicate items found.');
        }
    } else {
        console.error('posts.json not found.');
    }
} catch (error) {
    console.error('Error deduplicating data:', error);
}
