import { Box, Button, IconButton } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { defineMessages } from "react-intl";
import { DatePicker, RHFTextField } from ".";
import { Icon } from "../Icon";
import { MsgProvider } from "../Msg";
import { Msg, useMsg } from "../Msg/Msg";
import { P } from "../Typography";

const messages = defineMessages({
  "action-steps.label.placeholder": {
    id: "action-steps.label.placeholder",
    defaultMessage: "Label",
  },
  "action-steps.due-date.label": {
    id: "action-steps.due-date.label",
    defaultMessage: "Due date",
  },
  "action-steps.add-button": {
    id: "action-steps.add-button",
    defaultMessage: "Add action",
  },
});

export const ActionStepsInner = ({ name, rules, control, sx = {} }) => {
  const methods = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control || methods?.control,
    name,
    rules,
  });
  const msg = useMsg();
  // <Box component={"ol"}>
  return (
    <Box sx={{ ...sx }}>
      {fields.map((field, i) => (
        <Box
          key={field.id}
          // component={"li"}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ width: 16, mx: 1 }}>{i + 1}.</Box>
          <RHFTextField
            control={control}
            name={`${name}.${i}.label`}
            placeholder={msg("action-steps.label.placeholder")}
            rules={{ required: true }}
            size="small"
            autoFocus
            sx={{ mx: 1, minWidth: { lg: 320 } }}
          />
          <P sx={{ ml: 4, mr: 2 }}>
            <Msg id="action-steps.due-date.label" />
          </P>
          <DatePicker
            control={control}
            name={`${name}.${i}.date`}
            size="small"
            inputFormat="MM/dd/yyyy"
          />
          {i > 0 && (
            <IconButton
              onClick={() => remove(i)}
              sx={{
                mx: 2,
              }}
            >
              <Icon name="Delete" />
            </IconButton>
          )}
        </Box>
      ))}
      <Button
        onClick={() =>
          append({
            label: "",
            date: null,
          })
        }
        startIcon={<Icon name="Add" />}
      >
        <Msg id="action-steps.add-button" />
      </Button>
    </Box>
  );
};

export const ActionSteps = (props) => (
  <MsgProvider messages={messages}>
    <ActionStepsInner {...props} />
  </MsgProvider>
);
