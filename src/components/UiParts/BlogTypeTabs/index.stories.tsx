import type { Meta, StoryObj } from "@storybook/react";

import BlogTypeTabs from ".";
import { GlobalStateProvider } from "@/providers";

const meta = {
  title: 'UiParts/BlogTypeTabs',
  component: BlogTypeTabs,
  tags: ['autodocs'],
  parameters: {
    // NOTE: usePathnameが機能できるように設定
    nextjs: {
      appDirectory: true
    }
  },
  decorators: [
    (Story) => {
      return (
        <GlobalStateProvider>
          <div className="w-1/4">
            <Story />
          </div>
        </GlobalStateProvider>
      )
    }
  ]
} satisfies Meta<typeof BlogTypeTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "blogType": "blogs",
    "locale": "ja"
  }
}

export const ZennTab: Story = {
  args: {
    "blogType": "zenn",
    "locale": "ja"
  },
  parameters: {
    // NOTE: useSearchParamsが機能できるように設定
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/blogs",
        query: {
          blogType: "zenn"
        }
      }
    }
  },
}