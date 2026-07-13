# フォントソース

## KosugiMaru-Regular.ttf

- 取得元: `https://fonts.gstatic.com/s/kosugimaru/v17/0nksC9PgP_wGh21A2KeqGiTq.ttf`(Google Fonts CDN、**v17**固定URL。2026-07-13取得)
- ライセンス: Apache License 2.0(LICENSE.txt)。著作者: Motoya Font(AUTHORS.txt)
- 公式リポジトリ: https://github.com/googlefonts/kosugi-maru

`scripts/generate-font-subset.mjs` がこのTTFからサイト実使用文字のサブセットwoff2を生成する。

## 差し替え時の注意

- `src/styles/globals.css` のフォールバック(`Kosugi Maru Fallback`)のsize-adjust系メトリクス
  (ascent-override 78.45% / descent-override 10.71% / size-adjust 112.16%)は
  **このv17のメトリクスに対するCLSパリティ実績値**。TTFのバージョンを変える場合は
  メトリクスの再検証が必要(和欧混植での再調整は難しいため原則固定を推奨)
- `src/lib/ogFont.ts`(OG画像生成)も同じv17 URLをピン留めしている。差し替え時は揃えること
