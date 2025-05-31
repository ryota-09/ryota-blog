import type { Meta, StoryObj } from "@storybook/react";
import PopupModal from "."

const meta = {
  title: 'UiParts/PopupModal',
  component: PopupModal,
  tags: ['autodocs']
} satisfies Meta<typeof PopupModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="m-8">
        <img src="/author.jpg" className="w-14 h-14" />
      </div>
    )
  }
}