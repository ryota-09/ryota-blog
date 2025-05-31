import TOCItem from "@/components/ArticleBody/TOCList/TOCItem";
import { CheckCircle, Code, GitBranchIcon, Globe, MessageCircle, Users } from "lucide-react"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "即戦力として活躍できる人材のご紹介！",
  description: "【企業様向け】新人エンジニアの育成を行っており、フロントエンドのエンジニアとしての基礎から応用までを学んだ優秀な人材をご紹介しています。このページでは、今後の活躍が期待されるエンジニアを求める企業様向けに、スキルや経験をご紹介いたします。"
};

export default function Page() {
  return (
    <div className="min-h-screen white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-[#2F8F9D]">優秀な新人エンジニアをお探しの企業様へ</h1>
        <p className="mt-4 text-xl text-center text-[#383838]">即戦力として活躍できる人材をご紹介します！</p>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-24">
        <section className="text-left">
          <p className="max-w-3xl mx-auto text-lg text-[#383838]">
            新人エンジニアの育成を行っており、エンジニアとしての基礎から応用までを学んだ優秀な人材をご紹介しています。このページでは、今後の活躍が期待されるエンジニアを求める企業様向けに、スキルや経験をご紹介いたします。
          </p>
          <div className="flex justify-center mt-8">
            <TOCItem id="contact" className="bg-[#2F8F9D] hover:bg-[#3BACB6] text-white font-semibold py-3 px-16 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
              お問い合わせ
            </TOCItem>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-center text-[#2F8F9D] mb-8">対応可能な領域</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Globe className="h-8 w-8 text-[#3BACB6]" />, title: "TypeScriptを使ったWebアプリケーション開発" },
              { icon: <Code className="h-8 w-8 text-[#3BACB6]" />, title: "Reactを使用したモダンなフロントエンド開発" },
              { icon: <GitBranchIcon className="h-8 w-8 text-[#3BACB6]" />, title: "Gitを使用した開発フロー" },
              { icon: <Users className="h-8 w-8 text-[#3BACB6]" />, title: "チーム開発に必要なコミュニケーション能力" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 border rounded-lg shadow-md">
                {item.icon}
                <h3 className="mt-4 font-semibold text-[#383838]">{item.title}</h3>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-center text-[#2F8F9D] mb-8">育成プログラムの内容</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "TypeScript入門",
              "データベース基礎",
              "HTML&CSS",
              "React入門",
              "Git(PR作成、レビュー体験)",
              "ソフトウェアテスト入門",
              "【実践】ブログアプリ作成",
              "【実践】ECサイト作成",
              "リーダブルコードの輪読",
            ].map((item, index) => (
              <div key={index} className="flex items-center p-4 border rounded-lg shadow-md">
                <CheckCircle className="h-6 w-6 text-[#2F8F9D] mr-4" />
                <p className="font-medium text-[#383838]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-8 border border-[#82DBD8]">
          <h2 className="text-3xl font-semibold text-center text-[#2F8F9D] mb-8">育成プログラムとメンターの役割</h2>
          <p className="text-lg text-[#383838] mb-6">
            プログラムでは、プログラミングの基礎から応用、データベース管理、Reactフレームワークなどの項目に加えて、メンターは特に以下のような実践的な指導を行っています。
          </p>
          <ul className="space-y-4">
            {[
              { icon: <Code className="h-6 w-6 text-[#3BACB6]" />, title: "コードレビュー", description: "一人一人のコードを詳細にレビューし、改善点を具体的にフィードバック。" },
              { icon: <MessageCircle className="h-6 w-6 text-[#3BACB6]" />, title: "問題解決", description: "実際のプロジェクトで遭遇する問題にどう対応するか、解決策を一緒に考えます。自走力の向上。" },
              { icon: <Users className="h-6 w-6 text-[#3BACB6]" />, title: "ベストプラクティスの共有", description: "エンジニアとしてのベストプラクティスを共有し、効率的な開発方法を指導。" },
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                {item.icon}
                <div className="ml-4">
                  <h3 className="font-semibold text-[#383838]">{item.title}</h3>
                  <p className="text-[#383838]">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-center text-[#2F8F9D] mb-8">採用までのステップ</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12">
            {[
              { number: 1, title: "お問い合わせ", description: "カジュアル面談を希望する旨と対応できる日程をいくつか教えてください" },
              { number: 2, title: "本人とカジュアル面談", description: "エンジニア本人とカジュアル面談をします" },
              { number: 3, title: "採用フロー", description: "以降、本人の意志があれば貴社の採用フローに従う" },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center w-1/3 text-center">
                <div className="w-16 h-16 rounded-full bg-[#3BACB6] flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#383838]">{step.title}</h3>
                <p className="text-[#383838] min-h-12">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-center text-[#2F8F9D] mb-8">よくあるご質問</h2>
          <div className="space-y-6">
            {[
              { question: "コードレビューはどのように行っていますか？", answer: "個々のエンジニアのコードを詳細に分析し、改善点やベストプラクティスを具体的に指導しています。" },
              { question: "プログラムの期間はどのくらいですか？", answer: "６ヶ月の期間で研修を行っています。" },
            ].map((item, index) => (
              <div key={index} className="rounded-lg shadow-md border overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-[#383838]">Q: {item.question}</h3>
                </div>
                <div className="p-4">
                  <p className="text-[#383838]">A: {item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold text-[#2F8F9D] mb-4">お問い合わせ</h2>
          <p className="text-lg text-[#383838] mb-8 max-w-3xl mx-auto">
            もし、即戦力のエンジニアをお探しであれば、ぜひお問い合わせください。
          </p>
          <div className="flex justify-center">
            <iframe id="contact" src="https://docs.google.com/forms/d/e/1FAIpQLScRnrm5cduh8rsULQCGz1fDLydw2o0Yb5er5j1uIQN9rrNDsQ/viewform?embedded=true" width="640" height="1300">読み込んでいます…</iframe>
          </div>
        </section>
      </div>
    </div>
  )
}