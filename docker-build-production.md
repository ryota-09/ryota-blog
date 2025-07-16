# 本番環境でのDockerビルド手順

## 概要
このドキュメントでは、本番環境での正しいDockerビルドとデプロイ手順を説明します。

## 環境変数の設定

### 本番環境での環境変数

本番環境では以下の環境変数を設定する必要があります：

```bash
# 基本設定
NEXT_PUBLIC_BASE_URL=https://ryotablog.jp
MICROCMS_SERVICE_DOMAIN=1donhll6oz
MICROCMS_API_KEY=yKLtYb6jSnCd37IHT3qSsDUaeuQ2fOEeySyK

# Google Analytics & Tag Manager（本番環境用）
NEXT_PUBLIC_GA_ID=G-C24RQ7DHD4
NEXT_PUBLIC_GTM_ID=GTM-KF8S23HZ

# その他の設定
NEXT_PUBLIC_GUEST_ROLE_ARN=your_role_arn
NEXT_PUBLIC_IDENTITY_POOL_ID=your_identity_pool_id
NEXT_PUBLIC_APPLICATION_ID=your_application_id
```

## Dockerビルドコマンド

### 本番環境でのビルド

```bash
docker build \
  --build-arg NEXT_PUBLIC_BASE_URL=https://ryotablog.jp \
  --build-arg MICROCMS_SERVICE_DOMAIN=1donhll6oz \
  --build-arg MICROCMS_API_KEY=yKLtYb6jSnCd37IHT3qSsDUaeuQ2fOEeySyK \
  --build-arg NEXT_PUBLIC_GA_ID=G-C24RQ7DHD4 \
  --build-arg NEXT_PUBLIC_GTM_ID=GTM-KF8S23HZ \
  --build-arg NEXT_PUBLIC_GUEST_ROLE_ARN=your_role_arn \
  --build-arg NEXT_PUBLIC_IDENTITY_POOL_ID=your_identity_pool_id \
  --build-arg NEXT_PUBLIC_APPLICATION_ID=your_application_id \
  -t ryota-blog:production .
```

### 開発環境でのビルド

```bash
docker build \
  --build-arg NEXT_PUBLIC_BASE_URL=http://localhost:3006 \
  --build-arg MICROCMS_SERVICE_DOMAIN=1donhll6oz \
  --build-arg MICROCMS_API_KEY=yKLtYb6jSnCd37IHT3qSsDUaeuQ2fOEeySyK \
  --build-arg NEXT_PUBLIC_GA_ID=G-MR035BNF4W \
  --build-arg NEXT_PUBLIC_GTM_ID=GTM-PXKZSH82 \
  --build-arg NEXT_PUBLIC_GUEST_ROLE_ARN=your_role_arn \
  --build-arg NEXT_PUBLIC_IDENTITY_POOL_ID=your_identity_pool_id \
  --build-arg NEXT_PUBLIC_APPLICATION_ID=your_application_id \
  -t ryota-blog:development .
```

## 実行コマンド

```bash
# 本番環境での実行
docker run -p 3000:3000 ryota-blog:production

# 開発環境での実行
docker run -p 3000:3000 ryota-blog:development
```

## 問題の説明

### 以前の問題
- 本番環境でGoogle Analytics ID（`G-C24RQ7DHD4`）とGoogle Tag Manager ID（`GTM-KF8S23HZ`）がDockerビルド時に設定されていませんでした
- そのため、本番環境でGoogle Tag Managerが正しく動作せず、一覧ページと詳細ページで異なる動作が発生していました

### 解決策
- DockerfileにGoogle Analytics IDとGoogle Tag Manager IDの環境変数を追加
- 本番環境用の`.env.production`ファイルを作成
- 適切な環境変数を使用してビルドとデプロイを実行

## 検証方法

本番環境でのデプロイ後、以下を確認してください：

1. **ページソースの確認**
   ```
   https://www.googletagmanager.com/gtag/js?id=G-C24RQ7DHD4
   ```
   が正しく読み込まれることを確認

2. **開発者ツールのNetwork tab**
   - Google Tag Manager（GTM-KF8S23HZ）
   - Google Analytics（G-C24RQ7DHD4）
   のリクエストが正しく送信されることを確認

3. **一覧ページと詳細ページの両方で動作確認**
   - 一覧ページ：`https://ryotablog.jp/ja/blogs`
   - 詳細ページ：`https://ryotablog.jp/ja/blogs/[category]/[id]`