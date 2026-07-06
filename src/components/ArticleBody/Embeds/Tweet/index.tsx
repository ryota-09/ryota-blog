import { Tweet as ReactTweet } from "react-tweet";

type TweetProps = {
  id: string;
  // MDX側の呼び出し互換のため受け取るが、react-tweetはidのみでツイートを解決するため未使用
  url?: string;
};

// react-tweet(RSC対応)によるサーバーサイドレンダリングのツイート埋め込み。
// ダークモードは react-tweet/theme.css が .dark 祖先クラスに自動追従するため、
// 本コンポーネント側での明示的なテーマ切り替えは不要(src/styles/globals.cssでimport済み)。
const Tweet = ({ id }: TweetProps) => {
  return (
    <aside className="max-w-[85vw] sm:max-w-[80%] md:max-w-auto sm:mx-auto overflow-x-hidden my-4 flex justify-center">
      <ReactTweet id={id} />
    </aside>
  );
};

export default Tweet;
