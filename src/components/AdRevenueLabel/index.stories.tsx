import type { Meta, StoryObj } from "@storybook/react";
import AdRevenueLabel from ".";

const meta = {
  title: 'Components/AdRevenueLabel',
  component: AdRevenueLabel,
  tags: ['autodocs']
} satisfies Meta<typeof AdRevenueLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};