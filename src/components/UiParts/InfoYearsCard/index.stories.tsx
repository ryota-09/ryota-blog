import type { Meta, StoryObj } from "@storybook/react";

import InfoYearsCard from ".";

const meta = {
  title: 'UiParts/InfoYearsCard',
  component: InfoYearsCard,
  tags: ['autodocs']
} satisfies Meta<typeof InfoYearsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "diffYear": 3,
  }
}