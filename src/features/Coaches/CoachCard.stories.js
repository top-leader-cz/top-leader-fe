import { AuthMock } from "../../../.storybook/mockUtils";
import App from "../../App";
import { CoachCard } from "./CoachCard";

// TODO: separate AvailabilityCalendar.stories.js, import mock data from there
const MOCK = {
  // TODO: reference date in args
  "GET/api/latest/coaches/testuser/availability": [
    "2023-11-23T08:00:00",
    "2023-11-23T09:00:00",
    "2023-11-23T10:00:00",
    "2023-11-23T11:00:00",
    "2023-11-23T12:00:00",
    "2023-11-23T13:00:00",
    "2023-11-23T14:00:00",
    "2023-11-27T09:00:00",
    "2023-11-27T10:00:00",
    "2023-11-27T11:00:00",
    "2023-11-27T14:00:00",
    "2023-11-27T15:00:00",
    "2023-11-28T09:00:00",
    "2023-11-28T10:00:00",
    "2023-11-28T11:00:00",
    "2023-11-28T12:00:00",
    "2023-11-28T13:00:00",
    "2023-11-28T15:00:00",
    "2023-11-28T16:00:00",
    "2023-11-29T09:00:00",
    "2023-11-29T10:00:00",
    "2023-11-29T11:00:00",
    "2023-11-29T13:00:00",
    "2023-11-29T15:00:00",
    "2023-11-29T16:00:00",
  ],
};

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "TLStories/CoachCard",
  component: CoachCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: "color" },
  },
  decorators: [
    // (Story) => (
    //   <div style={{ margin: "3em" }}>
    //     {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
    //     <Story />
    //   </div>
    // ),
    (Story) => (
      <App>
        <AuthMock mockData={MOCK}>
          {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
          <Story />
        </AuthMock>
      </App>
    ),
  ],
};

const coach = {
  username: "testuser",
  name: "name",
  experience: "experience",
  languages: ["en"],
  rate: "",
  fields: ["field"],
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Basic = {
  args: {
    coach,
  },
};
