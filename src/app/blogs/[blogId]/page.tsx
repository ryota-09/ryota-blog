import ArticleBody from "@/components/ArticleBody";

const data = {
  "id": "eaunlqvag",
  "createdAt": "2024-05-01T12:08:36.633Z",
  "updatedAt": "2024-05-02T00:42:06.665Z",
  "publishedAt": "2024-05-01T12:08:36.633Z",
  "revisedAt": "2024-05-02T00:42:06.665Z",
  "title": "（サンプル）まずはこの記事を開きましょう",
  "content": "<h2 id=\"hdb41525ba7\">ブログテンプレートから作成されました🎉</h2><p>ブログテンプレートからAPIを作成しました。<br>おつかれさまでした🎉</p><p></p><h3 id=\"h0aa20d164d\">見出し３見出し３見出し３見出し３</h3><h2 id=\"hf45076424a\">APIプレビューを試そう🚀</h2><p>最初に「APIプレビュー」をしてみましょう。</p><p>入稿したコンテンツはAPI経由で取得し、Viewに繋ぎ込みます。<br>APIプレビューでは実際のAPIレスポンスを確認でき、あなたの開発を加速させます。</p><p>👇まずはここをクリックします。</p><figure><img src=\"https://images.microcms-assets.io/assets/4626924a681346e9a0fcabe5478eb9fa/79a5384c2f9b4062998a5eb65d7630d3/blog-template-description1.png\" alt=\"\" width=\"2490\" height=\"1652\"></figure><p>APIプレビュー画面が開いたら、<strong>「取得」</strong>ボタンでリクエストを試してみましょう。</p><figure><img src=\"https://images.microcms-assets.io/assets/4626924a681346e9a0fcabe5478eb9fa/2505a640ce8e45ba9bdeba8623322554/blog-template-description2.png\" alt=\"\" width=\"2492\" height=\"1648\"></figure><p>この記事の内容がAPIで取得できていることがわかります。</p><figure><img src=\"https://images.microcms-assets.io/assets/4626924a681346e9a0fcabe5478eb9fa/92cb71b419f94f0aa7c722684bcd58d8/blog-template-description3.png\" alt=\"\" width=\"1592\" height=\"1246\"></figure><h2 id=\"h88398f2fb7\">次にやること🏃</h2><p>APIプレビューで確認したレスポンスを参考に、あなた自身のWebサイトを構築しましょう。<br>microCMSはAPIでコンテンツを取得するため、お好きな言語・フレームワークで画面を構築できます。</p><ul><li><a href=\"https://document.microcms.io/tutorial/javascript/javascript-top\" target=\"_blank\" rel=\"noopener noreferrer nofollow\"><u>JavaScript SDK</u></a></li><li><a href=\"https://document.microcms.io/tutorial/nuxt/nuxt-top\" target=\"_blank\" rel=\"noopener noreferrer nofollow\"><u>Nuxt SDK</u></a></li><li><a href=\"https://document.microcms.io/tutorial/gatsby/gatsby-top\" target=\"_blank\" rel=\"noopener noreferrer nofollow\"><u>Gatsby SDK</u></a></li></ul><p>その他に<a href=\"https://microcms.io/features/sdk\" target=\"_blank\" rel=\"noopener noreferrer nofollow\"><u>サーバーサイドSDK（PHP / Go / Ruby）やモバイルSDK（iOS / Android）</u></a>もございます。</p><p>お困りなことや疑問点などございましたらお気軽にご連絡ください。<br>サポート窓口：<a href=\"mailto:support@microcms.io\">support@microcms.io</a><br>よくある質問：<a href=\"https://help.microcms.io/ja/knowledge\"><u>https://help.microcms.io/ja/knowledge</u></a></p>",
  "eyecatch": {
    "url": "https://images.microcms-assets.io/assets/4626924a681346e9a0fcabe5478eb9fa/14771409f63a44c59ada888239050237/blog-template.png",
    "height": 630,
    "width": 1200
  },
  "category": {
    "id": "ow5uxvw0a9",
    "createdAt": "2024-05-01T12:08:35.377Z",
    "updatedAt": "2024-05-01T12:08:35.377Z",
    "publishedAt": "2024-05-01T12:08:35.377Z",
    "revisedAt": "2024-05-01T12:08:35.377Z",
    "name": "更新情報"
  }
}

const Page = async () => {
  // const data = await getArticleList();
  return (
    <>
      <div className="max-w-[1028px] mx-auto">
        <p className="text-3xl font-bold mt-8">（サンプル）まずはこの記事を開きましょう</p>
        <ArticleBody data={data} />
      </div>
    </>
  );
}
export default Page;