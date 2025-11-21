---
description: Update data fetching script and fix UI layout
---

# データ更新スクリプトの改善とUI修正

## 1. データ管理とスクリプトの改修
- [ ] `src/data/posts.json` から初期のMockデータ（IDが1桁のもの）を削除する。
- [ ] `scripts/fetch-slack-posts.ts` を改修する。
    - [ ] コマンドライン引数で取得期間（日数）を指定できるようにする（デフォルトは1日）。
    - [ ] タイトルが "No Title" の場合、または取得に失敗した場合はデータを保存しないようにする。
- [ ] `package.json` に期間指定実行用のスクリプト（例: `npm run update-data:history`）を追加する。

## 2. UIレイアウトの修正
- [ ] `src/components/LinkCard.tsx` のカテゴリ表示を修正する。
    - [ ] 画像内オーバーレイをやめ、コンテンツエリア（タイトルや日付の近く）に配置するデザインに変更して崩れを防ぐ。
    - [ ] カテゴリと日付の並びや余白（padding/margin）を調整し、視認性を高める。

## 3. 動作確認
- [ ] `npm run update-data` を実行し、データが正しくフィルタリングされるか確認。
- [ ] ビルドして表示を確認。
