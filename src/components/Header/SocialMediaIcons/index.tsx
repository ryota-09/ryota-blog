import Image from "next/image";

import { getSocialMediaNavItems } from "@/static/header";

interface SocialMediaIconsProps {
  locale?: string;
}

const SocialMediaIcons = ({ locale = "ja" }: SocialMediaIconsProps) => {
  const socialMediaNavItems = getSocialMediaNavItems(locale);

  return (
    <div className="flex flex-wrap gap-5 md:gap-4">
      {socialMediaNavItems.map((item, index) => (
        <a
          key={item.name}
          href={item.href}
          target={item.target}
          rel="noreferrer"
          className={`w-8 h-8 border dark:border-[#333] dark:bg-gray-400 rounded-md font-extrabold flex justify-center items-center transition opacity-60 hover:opacity-30 ${
            item.name === "Zenn" ? "hover:bg-zenn" : ""
          } ${
            item.name === "Storybook" ? "hover:bg-[#FF4785]" : ""
          } ${
            item.name === "LLMs" ? "hover:opacity-50" : ""
          }`}
        >
          <Image
            src={item.icon ?? ""}
            alt={item.name}
            width={item.name === "LLMs" ? 30 : 20}
            height={item.name === "LLMs" ? 30 : 20}
          />
        </a>
      ))}
    </div>
  );
};

export default SocialMediaIcons;