import { omit, values } from "ramda";
import App, { Contexts } from "../../App";
import { MockForm } from "./AutocompleteSelect.stories";
import { FreeSoloField, optionEqStrategies } from "./Fields";

export default {
  title: "TLStories/Form/FreeSoloField",
  component: FreeSoloField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    selectOnFocus: { control: "boolean" },
    clearOnBlur: { control: "boolean" },
    debug: { control: "select", options: [false, true, "debugger"] },
    optionEqStrategy: {
      control: "inline-radio",
      options: values(optionEqStrategies),
    },
  },
  decorators: [
    (Story) => (
      <Contexts>
        <MockForm formConf={{ defaultValues: { field1: null } }}>
          <Story />
        </MockForm>
      </Contexts>
    ),
  ],
};

const options = [
  { value: 1, label: "First" },
  { value: 2, label: "Second" },
  { value: 3, label: "Third" },
];

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Basic = {
  args: {
    label: "field1 label",
    name: "field1",
    rules: { required: true },
    options,
    debug: true,
    sx: { width: "100%" },
  },
};
export const GroupedOptionsObject = {
  args: {
    ...omit(["options"], Basic.args),
    groupedOptions: {
      "Group 1": options,
      "Group 2": [{ value: 4, label: "Fourth" }],
    },
  },
};
export const GroupedOptionsArray = {
  args: {
    ...omit(["options"], Basic.args),
    groupedOptions: options.map((option, i) => ({
      ...option,
      __group: (i + 1) % 2 ? "odd" : "even",
    })),
  },
};
