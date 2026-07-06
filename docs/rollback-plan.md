# ロールバック手順書(microCMS → ファイルベース移行、Issue #242関連)

作成日: 2026-07-06(JST)
対象: `feat/242-parity-switch`(および一連のmicroCMS脱却PR群、Issue #233-#244)を`develop`/`main`にマージした後、本番で問題が発生した場合の切り戻し手順。

本ドキュメントは3段階のロールバック手段を切迫度に応じて使い分ける構成になっている。**まずは(1)Cloudflare Workersのバージョン巻き戻しを試す**。これが最速(数十秒〜数分)でユーザー影響を止められる。根本的なコード修正が必要な場合のみ(2)のgitレベルの切り戻しに進む。

---

## 0. 前提: microCMSは解約していない

- 本移行はコンテンツのデータソースをmicroCMS(headless CMS)からリポジトリ内MDXファイル(Velite管理)へ切り替えるものだが、**移行後もmicroCMSのプロジェクト・データ自体は解約せず保持している**。
- そのため、マージ前の`main`ブランチのコード(旧microCMS版)をそのままデプロイし直せば、追加のデータ復元作業なしに旧実装がそのまま動作する。
- `backup-before-rollback`ブランチに移行直前の状態が保存されている(要:マージ前時点での内容確認、下記1.3参照)。
- 加えて、移行元データ(記事・カテゴリ・アセット)のスナップショットはGitHub Release **`microcms-backup-2026-07-06`**としてリポジトリに保存されている。`backup-before-rollback`ブランチやmicroCMS本体が万一失われた場合の最終手段として、このReleaseから復元できる。

### 0.1 Issue #243(コード撤去)後の注意

- Issue #243で`src/lib/microcms.ts` / `src/types/microcms.ts`等の旧microCMS呼び出しコード自体をリポジトリから削除した。そのため**#243マージ後のコミットに対しては、本ドキュメントの「1. Cloudflare Workersの前バージョンへの巻き戻し」または「2.2 backup-before-rollbackブランチの利用」のみが有効**であり、「#243時点のコードにmicroCMS用環境変数を注入して再デプロイする」という手段は使えない(該当コード自体が存在しないため)。
- #243以降にmicroCMS版コードへ戻す必要が生じた場合は、`backup-before-rollback`ブランチ、または`microcms-backup-2026-07-06` Releaseのデータと、#243より前のコミット(旧`src/lib/microcms.ts`が存在する時点)を組み合わせて復元する。

---

## 1. Cloudflare Workersの前バージョンへの巻き戻し(最速・第一選択)

Cloudflare Workersは デプロイのたびに新しいバージョンを作成し、過去バージョンを保持している。コード変更なしに、直前の正常稼働バージョンへ即座に切り戻せる。

### 1.1 CLIでのロールバック(wrangler rollback)

```bash
# 1. 直近のデプロイ履歴を確認し、ロールバック対象のversion-idを特定する
npx wrangler deployments list --config wrangler.prd.jsonc

# 2. 問題発生前の正常なversion-idへロールバックする
npx wrangler rollback <version-id> --config wrangler.prd.jsonc --message "移行後の不具合によりロールバック(Issue #242関連)"

# 3. ロールバック後の状態を確認する
npx wrangler deployments status --config wrangler.prd.jsonc
```

- `--name`でWorker名を明示することも可能(`wrangler.prd.jsonc`の`name`フィールド = `ryota-blog-prd`)。
- `wrangler rollback`は「トラフィックのルーティング先を過去バージョンに切り替える」操作であり、コード自体を書き換えるものではない。次回`main`への通常デプロイが走ると、再び新しいコードがデプロイされる点に注意(恒久対処ではなく応急処置)。

### 1.2 ダッシュボードでのロールバック(CLIが使えない場合)

1. Cloudflareダッシュボード → Workers & Pages → 対象Worker(`ryota-blog-prd`)を選択
2. 「Deployments」タブを開く
3. 問題発生前の正常なデプロイメントを選択し、「Rollback to this deployment」を実行
4. 確認ダイアログで実行

### 1.3 stg環境での確認

本番へロールバックする前に、可能であれば同じ手順をstg(`ryota-blog-stg` / `wrangler.stg.jsonc`)で試し、意図通りの旧バージョンに切り替わることを確認しておくと安全。

```bash
npx wrangler deployments list --config wrangler.stg.jsonc
```

---

## 2. gitレベルの巻き戻し(恒久対処が必要な場合)

Workersのバージョンロールバックは「今すぐ止血する」ための一時措置。コード自体に恒久的な修正が必要な場合(例: 次回デプロイでまた問題のあるコードが展開されるのを防ぎたい)は、git上でも`main`/`develop`をマージ前の状態に戻す。

### 2.1 ревert(推奨: 履歴を残す)

マージコミットをrevertする(マージがsquashでない前提。マージ方法に応じて調整):

```bash
git checkout main
git pull origin main

# マージコミットのrevert(-mでどちらの親を正とするか指定。通常は1=マージ先ブランチ側)
git revert -m 1 <マージコミットのSHA>

# 動作確認後、push
git push origin main
```

`develop`側も同様に:

```bash
git checkout develop
git pull origin develop
git revert -m 1 <マージコミットのSHA>
git push origin develop
```

revert後、`.github/workflows/deploy-cloudflare.yml`により`main`へのpushで自動的に本番(prd)へ再デプロイされる。

### 2.2 backup-before-rollbackブランチの利用(revertが複雑な場合)

複数PRにまたがる変更で単純なrevertが難しい場合、移行直前の状態を保持している`backup-before-rollback`ブランチを使う:

```bash
git fetch origin backup-before-rollback
git log backup-before-rollback -5   # 内容が移行直前の想定と一致するか必ず確認

# 内容を確認した上で、mainをそのコミットに戻す(force-pushは影響が大きいため、
# チーム内合意の上で実施すること。安易な--forceは避け、まずrevertを検討する)
```

**注意**: `backup-before-rollback`は移行作業の初期段階で作られたスナップショットであり、その後に本番へマージされた無関係な修正(セキュリティ・SEO等)が含まれていない可能性がある。このブランチを使う場合は、必ず`git log`でコミット内容を確認し、失われる変更がないか事前チェックすること。

### 2.3 環境変数・シークレットの確認

ロールバック後、`.github/workflows/deploy-cloudflare.yml`が参照するシークレット(`MICROCMS_SERVICE_DOMAIN`, `MICROCMS_API_KEY`, `NEXT_PUBLIC_BASE_URL`等)がGitHub Secretsに残っていることを確認する(移行完了に伴い削除していた場合は復元が必要)。今回の検証(H項目)ではmicroCMSキー無しでもビルド自体は成功する状態になっているため、旧実装のビルドにはこれらのシークレットが必須である点に注意。

---

## 3. microCMS側の状態

- microCMSのプロジェクト・APIキー・コンテンツは**解約・削除しておらず、現状のまま利用可能**。
- そのため、上記1または2の手順でコードを旧バージョンに戻せば、追加のデータ移行やAPIキー再発行なしに、旧実装(microCMS版)がそのまま正常に動作する見込み。
- ただし、移行後に本番でmicroCMS側のコンテンツを更新した場合(通常運用として記事を追加・編集した場合)、ロールバック後はその期間の更新内容が「ファイルベース側にのみ存在し、microCMS側には反映されていない」状態になり得る。ロールバック実施前に、移行後に行った本番のコンテンツ更新有無を確認すること。

---

## 4. 監視ポイント

ロールバック要否の判断、および実施後の効果確認のために以下を監視する。

### 4.1 Cloudflareエラーレート
- Cloudflareダッシュボード → Workers & Pages → 対象Worker → 「Metrics」タブ
- 確認項目: リクエスト数、エラー率(5xx)、CPU時間、サブリクエスト数
- 異常の目安: エラー率が平常時(概ね0%近辺)から明確に上昇(数%以上)している場合は要調査

### 4.2 Search Console
- Google Search Console → 対象プロパティ(ryotablog.jp)
- 確認項目:
  - カバレッジ(インデックス登録状況): 404急増、noindexページの意図しない増加がないか
  - サイトマップの送信状況・エラー
  - Core Web Vitals(LCP/CLS/INP)のフィールドデータ悪化がないか
  - 手動対策・セキュリティの問題が発生していないか
- 移行直後は特に、旧URL(`/blogs/{slug}`形式)からのリダイレクトが正しく機能しているか、404が急増していないかを重点的に確認する(本検証のA・B項目で網羅性は確認済みだが、実トラフィックでのロングテールURLに漏れがないか本番運用で継続監視が必要)。

### 4.3 その他
- RSSフィード(`/ja/feed`, `/en/feed`)を購読しているツール・読者からのフィードバック
- もしもアフィリエイト管理画面での成果計測に断絶がないか(msmaflinkウィジェットの表示崩れ等、本検証のE・F項目でDOM構造は確認済み)
- 広告(AdRevenueLabel等)の表示状況

### 4.4 判断基準の目安
以下のいずれかに該当する場合はロールバックを検討する:
- 5xxエラー率が平常時から明確に(数%以上)上昇し、かつ即時修正が困難
- 主要ページ(トップ・一覧・人気記事)で表示崩れやコンテンツ欠落が広範囲に発生
- Search Consoleでインデックス登録数が急減、または大量の404を検出
- Core Web Vitalsが大幅に悪化(本検証のG項目基準: スコア-10超、LCP+1秒超)し、かつ原因がすぐに特定できない

---

## 関連ドキュメント
- `docs/migration-parity-report.md` — 移行前後パリティ検証の全結果(Issue #242)
- `scripts/migration/verify-parity.mjs`(および`check-a`〜`check-g-*.mjs`) — 再検証用スクリプト群
- GitHub Release `microcms-backup-2026-07-06` — 移行元microCMSデータ(記事・カテゴリ・アセット)のスナップショット
