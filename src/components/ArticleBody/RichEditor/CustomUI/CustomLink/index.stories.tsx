import type { Meta, StoryObj } from "@storybook/react";

import CustomLink from ".";
import ExternalLink from "@/components/UiParts/ExternalLink";

const meta = {
  title: 'RichEditor/Link',
  component: CustomLink,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [(Story) => <div className="m-8"><Story /></div>],
} satisfies Meta<typeof CustomLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "#",
    children: "Anchorテキスト",
  },
}

export const Internal: Story = {
  args: {
    href: "/blogs",
    children: "内部リンクテキスト",
  },
}

// NOTE: 外部リンクはReplaceUiParts.lib(旧)ではCustomLinkでなくExternalLinkに振り分けられていた。
// CustomLink自体は内部リンク(next-view-transitionsのLink)専用のため、外部リンクの見た目はExternalLinkで再現する。
export const External: Story = {
  render: () => (
    <ExternalLink
      href="https://hogehoge"
      className="underline underline-offset-4 transition hover:text-base-color dark:hover:text-primary hover:no-underline break-all"
    >
      外部リンクテキスト(別タブ)
    </ExternalLink>
  ),
}
