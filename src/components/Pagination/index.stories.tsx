import type { Meta, StoryObj } from "@storybook/react";
import Pagination from ".";

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
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
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page1AndTotal1: Story = {
  args: {
    currentPage: 1,
    totalCount: 1
  }
}

export const Page1AndTotal10: Story = {
  args: {
    currentPage: 1,
    totalCount: 10
  }
}

export const Page2AndTotal10: Story = {
  args: {
    currentPage: 2,
    totalCount: 10
  }
}

export const Page3AndTotal10: Story = {
  args: {
    currentPage: 3,
    totalCount: 10
  }
}

export const Page3AndTotal20: Story = {
  args: {
    currentPage: 3,
    totalCount: 20
  }
}

export const Page4AndTotal20: Story = {
  args: {
    currentPage: 4,
    totalCount: 20
  }
}

export const Page5AndTotal20: Story = {
  args: {
    currentPage: 5,
    totalCount: 20
  }
}

export const Page2AndTotal45: Story = {
  args: {
    currentPage: 2,
    totalCount: 45
  }
}

export const Page7AndTotal45: Story = {
  args: {
    currentPage: 7,
    totalCount: 45
  }
}

export const Page10AndTotal45: Story = {
  args: {
    currentPage: 10,
    totalCount: 45
  }
}

