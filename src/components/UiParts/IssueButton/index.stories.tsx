import type { Meta, StoryObj } from "@storybook/react";
import IssueButton from "."

const meta = {
  title: 'UiParts/IssueButton',
  component: IssueButton,
  tags: ['autodocs'],
  args: {
    currentPath: "https://hogehoge"
  }
} satisfies Meta<typeof IssueButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}