#!/bin/bash

# AI Portal - GitHub Setup Script
# このスクリプトはGitHubリポジトリのセットアップを自動化します

echo "🚀 AI Portal GitHub Setup"
echo "=========================="
echo ""

# 1. GitHub CLIがインストールされているか確認
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) がインストールされていません"
    echo "   インストール方法: https://cli.github.com/"
    exit 1
fi

# 2. GitHub認証確認
echo "📝 GitHub認証を確認中..."
if ! gh auth status &> /dev/null; then
    echo "🔐 GitHub認証が必要です"
    gh auth login
fi

# 3. リポジトリ名の設定
REPO_NAME="share_ai_webapp"
echo ""
echo "📦 リポジトリ名: $REPO_NAME"

# 4. リモートリポジトリの作成
echo ""
echo "🌐 GitHubリポジトリを作成中..."
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push || {
    echo "⚠️  リポジトリが既に存在する可能性があります"
    echo "   既存のリポジトリに接続します..."
    
    # ユーザー名を取得
    USERNAME=$(gh api user -q .login)
    git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git" 2>/dev/null || {
        echo "   リモートは既に設定されています"
    }
}

# 5. Secretsの設定
echo ""
echo "🔑 GitHub Secretsを設定中..."
echo "   SLACK_BOT_TOKEN を入力してください:"
read -s SLACK_BOT_TOKEN
gh secret set SLACK_BOT_TOKEN --body "$SLACK_BOT_TOKEN"

echo "   SLACK_CHANNEL_ID を入力してください:"
read SLACK_CHANNEL_ID
gh secret set SLACK_CHANNEL_ID --body "$SLACK_CHANNEL_ID"

# 6. GitHub Pagesの有効化
echo ""
echo "📄 GitHub Pagesを有効化中..."
gh api -X PUT "/repos/:owner/$REPO_NAME/pages" \
  -f source[branch]=gh-pages \
  -f source[path]=/

# 7. 初回コミットとプッシュ
echo ""
echo "📤 初回コミットとプッシュ..."
git add .
git commit -m "Initial commit: AI Portal setup" || echo "   変更がないか、既にコミット済みです"
git branch -M main
git push -u origin main

# 8. 完了メッセージ
echo ""
echo "✅ セットアップ完了!"
echo ""
echo "📊 次のステップ:"
echo "   1. GitHubリポジトリの Settings > Pages で GitHub Pages が有効になっていることを確認"
echo "   2. Actions タブで自動デプロイの進行状況を確認"
echo "   3. デプロイ完了後、以下のURLでアクセス可能:"
USERNAME=$(gh api user -q .login)
echo "      https://$USERNAME.github.io/$REPO_NAME/"
echo ""
