import { TextField } from "@mui/material";
import {
  DesktopDatePicker,
  TimePicker as MuiTimePicker,
} from "@mui/x-date-pickers";
import { Controller, useFormContext } from "react-hook-form";

export * from "./ActionSteps";

export const DatePicker = ({ control, name, rules, ...props }) => {
  const methods = useFormContext();

  return (
    <Controller
      control={control || methods?.control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <DesktopDatePicker
          renderInput={(params) => <TextField {...props} {...params} />}
          {...field}
        />
      )}
    />
  );
};

export const TimePicker = ({ control, name, rules, ...props }) => {
  const methods = useFormContext();

  return (
    <Controller
      control={control || methods?.control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <MuiTimePicker
          renderInput={(params) => <TextField {...props} {...params} />}
          {...field}
        />
      )}
    />
  );
};

export const Input = ({ name, control, rules, ...props }) => {
  const methods = useFormContext();

  return (
    <Controller
      control={control || methods?.control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) =>
        console.log("INPUT", {
          name,
          rules,
          field,
          fieldState,
          error: fieldState.error,
        }) || <TextField error={!!fieldState.error} {...props} {...field} />
      }
    />
  );
};
