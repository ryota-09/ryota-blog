import React from "react";
import type { Preview } from "@storybook/react";

import "../src/styles/globals.css"

// next/font/googleはVite環境では使用不可のため、CSS @importで代替
import "./storybook.css"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ fontFamily: "'Kosugi Maru', sans-serif" }}>
        <Story />
      </div>
    )
  ],
};

export default preview;