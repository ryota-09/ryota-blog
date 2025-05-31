import type { Meta, StoryObj } from "@storybook/react";
import TOCList from ".";

const meta = {
  title: 'Components/TOCList',
  component: TOCList,
  tags: ['autodocs']
} satisfies Meta<typeof TOCList>;

export default meta;
type Story = StoryObj<typeof meta>;

const testData = [
  {
    id: '1',
    text: 'text1',
    subList: [
      {
        id: '1-1',
        text: 'text1-1'
      },
      {
        id: '1-2',
        text: 'テキストテキストテキストテキストテキストテキストテキスト'
      },
      {
        id: '1-3',
        text: 'text1-3'
      }
    ]
  },
  {
    id: '2',
    text: 'テキストテキストテキストテキストテキストテキストテキストテキストテキスト',
    subList: [
      {
        id: '2-1',
        text: 'text2-1'
      },
      {
        id: '2-2',
        text: 'text2-2'
      }
    ]
  }
]

export const Default: Story = {
  args: {
    data: testData
  },
  decorators: [
    (Story) => (
      <div className="m-8">
        <Story />
      </div>
    )
  ]
};