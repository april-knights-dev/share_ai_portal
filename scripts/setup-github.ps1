# AI Portal - GitHub Setup Script (PowerShell)
# このスクリプトはGitHubリポジトリのセットアップを自動化します

Write-Host "🚀 AI Portal GitHub Setup" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# 1. GitHub CLIがインストールされているか確認
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) がインストールされていません" -ForegroundColor Red
    Write-Host "   インストール方法: winget install --id GitHub.cli" -ForegroundColor Yellow
    exit 1
}

# 2. GitHub認証確認
Write-Host "📝 GitHub認証を確認中..." -ForegroundColor Yellow
# gh auth status returns 0 when authenticated, non‑zero otherwise
$authOk = gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 GitHub認証が必要です" -ForegroundColor Yellow
    gh auth login
}


# 3. リポジトリ名の設定
$REPO_NAME = "share_ai_webapp"
Write-Host ""
Write-Host "📦 リポジトリ名: $REPO_NAME" -ForegroundColor Green

# 4. リモートリポジトリの作成
Write-Host ""
Write-Host "🌐 GitHubリポジトリを作成中..." -ForegroundColor Yellow
gh repo create $REPO_NAME --public --source=. --remote=origin --push 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  リポジトリが既に存在する可能性があります" -ForegroundColor Yellow
    Write-Host "   既存のリポジトリに接続します..." -ForegroundColor Yellow
    
    # ユーザー名を取得
    $USERNAME = gh api user -q .login
    git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git" 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   リモートは既に設定されています" -ForegroundColor Gray
    }
}

# 5. Secretsの設定
Write-Host ""
Write-Host "🔑 GitHub Secretsを設定中..." -ForegroundColor Yellow
Write-Host "   SLACK_BOT_TOKEN を入力してください:" -ForegroundColor Cyan
$SLACK_BOT_TOKEN = Read-Host -AsSecureString
$SLACK_BOT_TOKEN_Plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SLACK_BOT_TOKEN)
)
gh secret set SLACK_BOT_TOKEN --body $SLACK_BOT_TOKEN_Plain

Write-Host "   SLACK_CHANNEL_ID を入力してください:" -ForegroundColor Cyan
$SLACK_CHANNEL_ID = Read-Host
gh secret set SLACK_CHANNEL_ID --body $SLACK_CHANNEL_ID

# 6. GitHub Pagesの有効化
Write-Host ""
Write-Host "📄 GitHub Pagesを有効化中..." -ForegroundColor Yellow
$USERNAME = gh api user -q .login
gh api -X POST "/repos/$USERNAME/$REPO_NAME/pages" `
    -f source[branch]=main `
    -f source[path]=/dist 2>&1 | Out-Null

# 7. 初回コミットとプッシュ
Write-Host ""
Write-Host "📤 初回コミットとプッシュ..." -ForegroundColor Yellow
git add .
git commit -m "Initial commit: AI Portal setup" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   変更がないか、既にコミット済みです" -ForegroundColor Gray
}
git branch -M main
git push -u origin main

# 8. 完了メッセージ
Write-Host ""
Write-Host "✅ セットアップ完了!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 次のステップ:" -ForegroundColor Cyan
Write-Host "   1. GitHubリポジトリの Settings > Pages で GitHub Pages が有効になっていることを確認"
Write-Host "   2. Settings > Pages > Build and deployment で 'GitHub Actions' を選択"
Write-Host "   3. Actions タブで自動デプロイの進行状況を確認"
Write-Host "   4. デプロイ完了後、以下のURLでアクセス可能:"
Write-Host "      https://$USERNAME.github.io/$REPO_NAME/" -ForegroundColor Green
Write-Host ""
