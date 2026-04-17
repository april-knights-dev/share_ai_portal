# AI Portal

Google ChatスペースからAI関連のリンクを自動収集し、美しいポータルサイトとして表示するWebアプリケーションです。

## 🌟 特徴

- **自動データ収集**: Google ChatスペースからURLを自動抽出
- **AI自動分類**: Google Gemini APIを使用してコンテンツを自動カテゴリ分類
- **リアルタイム検索**: タイトル、説明、タグでのインクリメンタル検索
- **カテゴリフィルタ**: LLM、画像/動画、開発/コード、リサーチ、ツール、ニュースで絞り込み
- **レスポンシブデザイン**: モダンでプレミアムなUIデザイン
- **自動デプロイ**: GitHub Actionsによる自動ビルド・デプロイ
- **定期更新**: 6時間ごとにGoogle Chatから新しい投稿を自動取得

## 🚀 技術スタック

- **フロントエンド**: React 19 + TypeScript + Vite
- **スタイリング**: Vanilla CSS (カスタムデザインシステム)
- **データ取得**: Google Chat API + Open Graph Protocol
- **AI分類**: Google Gemini API (gemini-2.5-flash-lite)
- **デプロイ**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📋 前提条件

- Node.js 20以上
- npm
- Google Chat Access Token
- Google Gemini API Key (オプション、なくてもキーワードベース分類で動作)

## 🔧 セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd ai-portal
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`をコピーして`.env`を作成し、必要な値を設定します。

```bash
cp .env.example .env
```

`.env`ファイルを編集:

```env
GOOGLE_CHAT_ACCESS_TOKEN=your_google_chat_access_token
GOOGLE_CHAT_SPACE=spaces/AAAAAAAAAAA
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Google Chat Access Tokenの取得方法

1. Google Cloud ConsoleでGoogle Chat APIを有効化
2. OAuth 2.0クライアント（またはサービスアカウント）を作成
3. `https://www.googleapis.com/auth/chat.messages.readonly` 権限を付与
4. 取得したアクセストークンを `GOOGLE_CHAT_ACCESS_TOKEN` に設定

#### Google Chat Spaceの取得方法

1. Google Chatで対象スペースを開く
2. スペースのURLやAPIレスポンスから `spaces/AAAAAAAAAAA` 形式のIDを確認
3. 確認した値を `GOOGLE_CHAT_SPACE` に設定

#### Gemini API Keyの取得方法

1. [Google AI Studio](https://aistudio.google.com/app/apikey)にアクセス
2. 「Create API Key」をクリック
3. 生成されたAPIキーをコピー

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

## 📝 使い方

### データの更新

#### 過去1日分の投稿を取得

```bash
npm run update-data
```

#### 過去30日分の投稿を取得（初回セットアップ時）

```bash
npm run update-data:history
```

#### 重複データの削除

```bash
npm run deduplicate
```

### ビルド

```bash
npm run build
```

ビルド結果は`dist`ディレクトリに出力されます。

### プレビュー

```bash
npm run preview
```

## 🚢 デプロイ

### GitHub Pagesへのデプロイ

#### 自動セットアップ（推奨）

```bash
# Windows
.\scripts\setup-github.ps1

# Linux/Mac
./scripts/setup-github.sh
```

このスクリプトは以下を自動で実行します:
- GitHub Secretsの設定（GOOGLE_CHAT_ACCESS_TOKEN, GOOGLE_CHAT_SPACE, GEMINI_API_KEY）
- GitHub Pagesの有効化
- 初回デプロイのトリガー

#### 手動セットアップ

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」を開く
2. 以下のシークレットを追加:
   - `GOOGLE_CHAT_ACCESS_TOKEN`
   - `GOOGLE_CHAT_SPACE`
   - `GEMINI_API_KEY`
3. 「Settings」→「Pages」を開く
4. 「Build and deployment」で「GitHub Actions」を選択
5. `main`ブランチにプッシュすると自動デプロイされます

### デプロイURLの確認

```bash
npm run get-url
```

## 🔄 自動更新の仕組み

GitHub Actionsにより、以下のワークフローが自動実行されます:

### デプロイワークフロー (`.github/workflows/deploy.yml`)

- **トリガー**: `main`ブランチへのプッシュ
- **処理**: ビルド → GitHub Pagesへデプロイ

### データ更新ワークフロー (`.github/workflows/update-data.yml`)

- **トリガー**: 6時間ごと（cron: `0 */6 * * *`）または手動実行
- **処理**: 
  1. Google Chatから新しい投稿を取得
  2. OGP情報の抽出
  3. Gemini APIでカテゴリ分類
  4. `src/data/posts.json`を更新
  5. 変更をコミット・プッシュ（自動デプロイがトリガーされる）

## 📁 プロジェクト構造

```
ai-portal/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # デプロイワークフロー
│       └── update-data.yml     # データ更新ワークフロー
├── public/                     # 静的ファイル
├── scripts/
│   ├── fetch-google-chat-posts.ts   # Google Chat投稿取得スクリプト
│   ├── deduplicate-data.ts    # 重複削除スクリプト
│   ├── get-url.ts             # デプロイURL取得スクリプト
│   ├── setup-github.ps1       # GitHub自動セットアップ (Windows)
│   └── setup-github.sh        # GitHub自動セットアップ (Linux/Mac)
├── src/
│   ├── components/
│   │   ├── Header.tsx         # ヘッダーコンポーネント
│   │   ├── Hero.tsx           # ヒーローセクション
│   │   ├── FilterBar.tsx      # カテゴリフィルター
│   │   ├── LinkCard.tsx       # リンクカード
│   │   └── Footer.tsx         # フッター
│   ├── data/
│   │   ├── mockData.ts        # モックデータ（開発用）
│   │   └── posts.json         # 実データ（自動生成）
│   ├── App.tsx                # メインアプリケーション
│   ├── index.css              # グローバルスタイル
│   └── main.tsx               # エントリーポイント
├── .env.example               # 環境変数テンプレート
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 カテゴリ

アプリケーションは以下のカテゴリで投稿を分類します:

- **LLM**: ChatGPT、Claude、Gemini等の大規模言語モデル
- **画像/動画**: Midjourney、Runway等の生成AI
- **開発/コード**: GitHub、開発ツール、プログラミング関連
- **リサーチ**: 研究論文、arXiv、学術研究
- **ツール**: AIツール、アプリケーション
- **ニュース**: AI業界ニュース、その他

## 🔍 データ取得の仕組み

1. **Google Chat投稿の取得**: Google Chat APIで指定スペースのメッセージ履歴を取得
2. **URL抽出**: 正規表現でURLを抽出
3. **OGP取得**: `open-graph-scraper`でタイトル、説明、画像を取得
4. **AI分類**: Gemini APIでカテゴリとタグを自動生成
5. **重複排除**: 既存URLはスキップ
6. **データ保存**: JSON形式で保存

## 🛠️ トラブルシューティング

### Google Chat APIエラー

```
Google Chat API error (401): Request had invalid authentication credentials
```

→ `GOOGLE_CHAT_ACCESS_TOKEN` と `GOOGLE_CHAT_SPACE` が正しいか確認してください。

### Gemini APIエラー

```
AI categorization failed, using fallback
```

→ `GEMINI_API_KEY`が設定されていない場合、キーワードベースの分類にフォールバックします。

### GitHub Pagesが表示されない

1. リポジトリの「Settings」→「Pages」で設定を確認
2. 「Actions」タブでデプロイが成功しているか確認
3. `npm run get-url`でURLを確認

### データが更新されない

1. GitHub Actionsの「Update Data」ワークフローが有効か確認
2. Secretsが正しく設定されているか確認
3. 手動で`npm run update-data`を実行してエラーを確認

## 📄 ライセンス

MIT

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📧 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。