#!/usr/bin/env node

/**
 * GitHub Pages URL取得スクリプト
 * デプロイされたサイトのURLを取得して表示します
 */

import { execSync } from 'child_process';

function getGitHubPagesUrl() {
    try {
        // GitHub CLIがインストールされているか確認
        try {
            execSync('gh --version', { stdio: 'ignore' });
        } catch {
            console.error('❌ GitHub CLI (gh) がインストールされていません');
            console.error('   インストール方法: https://cli.github.com/');
            process.exit(1);
        }

        // リポジトリ情報を取得
        const repoInfo = execSync('gh repo view --json nameWithOwner,name', { encoding: 'utf-8' });
        const { nameWithOwner, name } = JSON.parse(repoInfo);
        const [owner] = nameWithOwner.split('/');

        // GitHub Pages情報を取得
        try {
            const pagesInfo = execSync(`gh api repos/${nameWithOwner}/pages`, { encoding: 'utf-8' });
            const pages = JSON.parse(pagesInfo);

            console.log('');
            console.log('🌐 GitHub Pages 情報');
            console.log('==================');
            console.log('');
            console.log(`📍 URL: ${pages.html_url}`);
            console.log(`📊 Status: ${pages.status || 'unknown'}`);
            console.log(`🔧 Source: ${pages.source?.branch || 'unknown'}/${pages.source?.path || ''}`);
            console.log('');

            if (pages.status === 'built') {
                console.log('✅ サイトは正常にデプロイされています!');
                console.log(`   アクセスURL: ${pages.html_url}`);
            } else {
                console.log('⚠️  デプロイ中または設定が必要です');
                console.log('   GitHub Actions タブでデプロイ状況を確認してください');
            }

            return pages.html_url;
        } catch (error) {
            console.log('');
            console.log('⚠️  GitHub Pagesが有効化されていません');
            console.log('');
            console.log('予想されるURL:');
            console.log(`   https://${owner}.github.io/${name}/`);
            console.log('');
            console.log('📝 GitHub Pagesを有効化するには:');
            console.log('   1. GitHubリポジトリの Settings > Pages を開く');
            console.log('   2. Build and deployment で "GitHub Actions" を選択');
            console.log('   3. mainブランチにプッシュすると自動デプロイされます');
            console.log('');

            return `https://${owner}.github.io/${name}/`;
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ エラーが発生しました:', errorMessage);
        process.exit(1);
    }
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
    getGitHubPagesUrl();
}

export { getGitHubPagesUrl };
