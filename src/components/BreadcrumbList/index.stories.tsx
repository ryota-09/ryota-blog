import type { Meta, StoryObj } from "@storybook/react";
import BreadcrumbList from ".";

const meta = {
  title: 'Components/BreadcrumbList',
  component: BreadcrumbList,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true
    }
  },
  decorators: [
    (Story) => (
      <div className="m-8">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof BreadcrumbList>;

export default meta;
type Story = StoryObj<typeof meta>;

const data = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Layer1',
    href: '/layer1'
  },
  {
    label: 'Layer2',
    href: '/layer1/layer2'
  }
]

export const Default: Story = {
  args: {
    items: data
  }
};