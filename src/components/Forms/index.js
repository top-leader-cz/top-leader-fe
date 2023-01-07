import { DesktopDatePicker, TimePicker as MuiTimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export const DatePicker = ({ control, name, rules, ...props }) => {
  const methods = useFormContext();
  console.log({ control, methods });
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
  return (
    <Controller
      control={control}
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
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => <TextField {...props} {...field} />}
    />
  );
};
