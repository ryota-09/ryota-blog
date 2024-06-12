import React from "react";
import { Kosugi_Maru } from "next/font/google";
import type { Preview } from "@storybook/react";

import "../src/styles/globals.css"

const KosugiMaru = Kosugi_Maru({ weight: "400", subsets: ["latin"], display: "swap" });

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
      <div className={`${KosugiMaru.className}`}>
        <Story />
      </div>
    )
  ]
};

export default preview;