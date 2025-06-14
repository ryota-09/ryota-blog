import type { Meta, StoryObj } from '@storybook/react';
import CopyableText from './index';

const meta: Meta<typeof CopyableText> = {
  title: 'ArticleBody/RichEditor/CopyableText',
  component: CopyableText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'INVITE_CODE_123',
  },
};

export const LongCode: Story = {
  args: {
    children: 'VERY_LONG_INVITATION_CODE_WITH_NUMBERS_AND_LETTERS_123456789ABCDEF',
  },
};

export const WithCustomClassName: Story = {
  args: {
    children: 'CUSTOM_STYLED_CODE',
    className: 'border border-blue-300 p-2 rounded',
  },
};

export const JapaneseText: Story = {
  args: {
    children: '招待コード：ABCD1234',
  },
};