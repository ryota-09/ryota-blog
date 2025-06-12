import { AUTHOR_NAME } from "@/static/blogs";
import Image from "next/image";

type ThumbnailCardProps = {
  /**
   *  記事のタイトル
   */
  title: string;
};

const ThumbnailCard = ({ title }: ThumbnailCardProps) => {
  return (
    <div className="flex flex-col justify-between rounded-3xl border-[12px] border-secondary md:w-full md:border-[32px]">
      <h1 className="mx-4 my-4 text-xl font-bold sm:my-12 md:my-16 md:text-3xl dark:text-gray-300">
        {title}
      </h1>
      <div className="mx-4 mb-4 flex items-center justify-end gap-4 sm:m-6">
        <Image
          src="/author.png"
          alt="author"
          width={80}
          height={80}
          sizes="100vw"
          className="w-[50px] rounded-full md:w-[80px]"
        />
        <p className="text-lg font-bold md:text-3xl dark:text-gray-300">
          {AUTHOR_NAME}
        </p>
      </div>
    </div>
  );
};
export default ThumbnailCard;
