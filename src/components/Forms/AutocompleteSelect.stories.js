import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import App from "../../App";
import { AutocompleteSelect } from "./Fields";
import { RHForm } from "./Form";
import { keys, map, mergeAll, pipe } from "ramda";

export const MockForm = ({
  children,
  formConf = { defaultValues: {} },
  watchNames = keys(formConf.defaultValues),
}) => {
  const form = useForm(formConf);
  const onSubmit = (data) => {
    console.log("[MockForm] onSubmit", { data, values: form.getValues() });
  };
  const onError = (errors, e) => {
    console.log("[MockForm] onError", { errors, e });
  };
  const values = pipe(
    map((name) => ({ [name]: form.watch(name) })),
    mergeAll
  )(watchNames);
  console.log("[MockForm]", { form, values, watchNames });

  return (
    <RHForm form={form} onSubmit={onSubmit} onError={onError}>
      {children}
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 0 }}>
        Submit
      </Button>
      <pre>{JSON.stringify({ values }, null, 2)}</pre>
    </RHForm>
  );
};

export default {
  title: "TLStories/Form/AutocompleteSelect",
  component: AutocompleteSelect,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    multiple: { control: "boolean" },
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
        <MockForm watchNames={["field1"]}>
          {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
          <Story />
        </MockForm>
      </App>
    ),
  ],
  //   render: ({ footer, ...args }) => (
  //     <Page {...args}>
  //       <footer>{footer}</footer>
  //     </Page>
  //   ),
  /* ...
export const CustomFooter = {
  args: {
    footer: 'Built with Storybook',
  },
};
*/
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
    multiple: false,
  },
};

export const Multiple = {
  args: {
    ...Basic.args,
    multiple: true,
    disableCloseOnSelect: true,
  },
  argTypes: {
    disableCloseOnSelect: { control: "boolean" },
  },
};
