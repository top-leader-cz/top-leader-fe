import { Box, Button, Tooltip } from "@mui/material";
import { ICON_NAMES, Icon } from "./Icon";
import { P } from "./Typography";

export default {
  title: "Icon",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  //   decorators: [
  //     (Story) => (
  //       <>
  //         {ICON_NAMES.map((name) => (
  //           <Story name={name} />
  //         ))}
  //       </>
  //     ),
  //   ],
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const All = {
  render: (args) => (
    <>
      {ICON_NAMES.map((name) => (
        <Button key={name} startIcon={<Icon name={name} />}>
          {name}
        </Button>
        // <Box sx={{ display: "flex", flexDirection: "column" }}>
        //   <P>{name}</P>
        //   <Tooltip key={name} title={name} placement="top">
        //     <Icon name={name} />
        //   </Tooltip>
        // </Box>
      ))}
    </>
  ),
};
