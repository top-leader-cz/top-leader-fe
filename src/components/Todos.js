import { Checkbox, FormControlLabel } from "@mui/material";
import { Stack } from "@mui/system";

const Todos = ({ items, textProp = "label", keyProp, ...props }) => {
  return (
    <Stack {...props}>
      {items.map((item) => (
        <FormControlLabel
          key={item[keyProp]}
          control={<Checkbox defaultChecked={!!Math.round(Math.random())} />}
          label={item[textProp]}
        />
      ))}
    </Stack>
  );
};
