import { Box, Button, IconButton } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";
import { defineMessages } from "react-intl";
import {
  DatePickerField,
  RHFTextField,
} from "../../../components/Forms/Fields";
import {
  invalidDate,
  notBlank,
  todayOrFuture,
} from "../../../components/Forms/validations";
import { Icon } from "../../../components/Icon";
import { MsgProvider } from "../../../components/Msg";
import { Msg, useMsg } from "../../../components/Msg/Msg";
import { P } from "../../../components/Typography";

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
  const msg = useMsg();
  const methods = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: control || methods?.control,
    name,
    rules,
  });

  return (
    <Box sx={{ ...sx }}>
      {fields.map((field, i) => (
        <Box
          key={field.id}
          // component={"li"}
          sx={{
            display: "flex",
            alignItems: "baseline",
            mb: 2,
          }}
        >
          <Box sx={{ width: 16, mx: 1 }}>{i + 1}.</Box>
          <RHFTextField
            control={control}
            name={`${name}.${i}.label`}
            placeholder={msg("action-steps.label.placeholder")}
            rules={{
              required: true,
              validate: { notBlank: notBlank(0) },
            }}
            autoFocus
            sx={{
              mx: 1,
              mb: 0.5,
              minWidth: { lg: 320 },
              // "& .MuiFormHelperText-root.Mui-error": { height: 0, position: "relative", mt: 0, textAlign: "right", },
            }}
          />
          <P sx={{ ml: 4, mr: 2 }}>
            <Msg id="action-steps.due-date.label" />
          </P>
          <DatePickerField
            control={control}
            name={`${name}.${i}.date`}
            rules={{ validate: { invalidDate, todayOrFuture } }}
            disablePast
            clearable
            sx={{ width: 290 }}
          />
          {i > 0 && (
            <IconButton
              onClick={() => remove(i)}
              sx={{
                mx: 2,
                position: "relative",
                top: "5px",
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
