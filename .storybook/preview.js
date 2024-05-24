/** @type { import('@storybook/react').Preview } */

import { Contexts } from "../src/App";

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // TODO: https://storybook.js.org/addons/storybook-addon-react-router-v6
  // https://reactrouter.com/en/main/router-components/memory-router
  decorators: [
    (Story) => (
      <Contexts>
        <Story />
      </Contexts>
    ),
  ],
};

export default preview;
