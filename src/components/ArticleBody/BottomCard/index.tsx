import { AUTHOR_DESCRIPTION, AUTHOR_NAME } from "@/static/blogs";
import Image from "next/image";

const BottomCard = () => {
  return (
    <>
      <div className="mx-6 flex shrink-0 items-center justify-center">
        <Image
          src="/author.png"
          alt="author"
          width={80}
          height={80}
          sizes="100vw"
          className="rounded-full"
        />
      </div>
      <div>
        <p className="text-3xl font-bold dark:text-gray-300">{AUTHOR_NAME}</p>
        <p className="mx-1 mt-4 text-gray-500 dark:text-gray-400">
          {AUTHOR_DESCRIPTION}
        </p>
      </div>
    </>
  );
};
export default BottomCard;
