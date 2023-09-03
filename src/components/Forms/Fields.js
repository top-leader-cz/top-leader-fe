import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  Slider,
  Switch,
  TextField,
} from "@mui/material";
import { alpha, Box, styled } from "@mui/system";
import {
  DesktopDatePicker,
  TimePicker as MuiTimePicker,
} from "@mui/x-date-pickers";
import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { defineMessages } from "react-intl";
import { Icon } from "../Icon";
import { Msg, MsgProvider } from "../Msg";
import { P } from "../Typography";
import { useContext } from "react";
import { I18nContext } from "../../App";

// import { DateRangePicker } from "@mui/lab";
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

// export const DateRangePicker = ({ name, ...props }) => {
//   const [value, setValue] = useState([null, null]);
//   console.log("%c[DateRangePicker.rndr]", "color:coral;", { name });

//   return (
//     <DesktopDatePicker

//       renderInput={({ value, onChange }) => (
//         <>
//           <TextField {...{ value: value?.[0] }} />
//           <Box sx={{ mx: 2 }}> to </Box>
//           <TextField {...{ value: value?.[1] }} />
//         </>
//       )}
//     />
//   );
// };

const DateRangePicker = React.forwardRef(
  ({ field, sx, inputFormat, ...props }, ref) => {
    // console.log("%c[DateRangePicker.rndr]", "color:navy;", field.name, {
    //   field,
    //   props,
    // });

    const [startValue, endValue] = field.value ?? [];
    const onChange = (idx) => (date) => {
      const newValue = [startValue, endValue];
      newValue[idx] = date;
      return field.onChange(newValue);
    };

    return (
      <Box display="flex" sx={sx}>
        <DesktopDatePicker
          ref={ref}
          renderInput={(params) => (
            <TextField
              size="small"
              sx={{ width: 180 }}
              {...props}
              {...params}
            />
          )}
          name={field.name}
          onChange={onChange(0)}
          onBlur={field.onBlur}
          value={startValue}
          inputFormat={inputFormat}
        />
        <Box alignSelf="center" sx={{ mx: 1 }}>
          -
        </Box>
        <DesktopDatePicker
          renderInput={(params) => (
            <TextField
              size="small"
              sx={{ width: 180 }}
              {...props}
              {...params}
            />
          )}
          // name={field.name}
          onChange={onChange(1)}
          onBlur={field.onBlur}
          value={endValue}
          inputFormat={inputFormat}
        />
      </Box>
    );
  }
);

const TimeRangePicker = React.forwardRef(
  ({ inputProps, field, sx, inputFormat, ...props }, ref) => {
    // console.log("%c[TimeRangePicker.rndr]", "color:coral;", field.name, {
    //   field,
    //   props,
    // });

    const onChange = (idx) => (date) => {
      const newValue = [...(field?.value ?? [])];
      newValue[idx] = date;
      return field.onChange(newValue);
    };

    return (
      <Box display="flex" sx={sx}>
        <MuiTimePicker
          ref={ref}
          renderInput={(params) => (
            <TextField size="small" {...props} {...params} {...inputProps} />
          )}
          name={field.name}
          onChange={onChange(0)}
          onBlur={field.onBlur}
          value={field.value?.[0]}
          inputFormat={inputFormat}
        />
        <Box alignSelf="center" sx={{ mx: 1 }}>
          -
        </Box>
        <MuiTimePicker
          renderInput={(params) => (
            <TextField size="small" {...props} {...params} {...inputProps} />
          )}
          // name={field.name}
          onChange={onChange(1)}
          onBlur={field.onBlur}
          value={field.value?.[1]}
          inputFormat={inputFormat}
        />
      </Box>
    );
  }
);

export const TimeRangePickerField = ({
  name,
  rules,
  inputFormat: inputFormatProp,
  inputProps,
}) => {
  const { i18n } = useContext(I18nContext);
  const inputFormat = useMemo(
    () => inputFormatProp || i18n.uiFormats.inputTimeFormat,
    [i18n.uiFormats.inputTimeFormat, inputFormatProp]
  );

  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field }) => (
        <TimeRangePicker {...{ field, inputFormat, inputProps }} />
      )}
    />
  );
};

export const DateRangePickerField = ({
  name,
  rules,
  inputFormat: inputFormatProp,
  ...props
}) => {
  const { i18n } = useContext(I18nContext);
  const inputFormat = useMemo(
    () => inputFormatProp || i18n.uiFormats.inputDateFormat,
    [i18n.uiFormats.inputDateFormat, inputFormatProp]
  );

  return (
    // <LocalizationProvider
    //   dateAdapter={AdapterDateFns}
    //   localeText={{ start: "Check-in", end: "Check-out" }}
    // >
    <Controller
      // control={methods?.control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <DateRangePicker {...props} inputFormat={inputFormat} field={field} />
      )}
    />
    // </LocalizationProvider>
  );
};

export const SwitchField = ({ name, rules, ...props }) => {
  return (
    <Controller
      // control={control || methods?.control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <Switch {...{ ...props, ...field, checked: !!field.value, name }} />
      )}
    />
  );
};

export const CheckboxField = ({ name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field }) => (
        <Checkbox {...{ ...props, ...field, checked: !!field.value, name }} />
      )}
    />
  );
};

export const DatePickerField = ({
  control,
  name,
  rules,
  inputFormat: inputFormatProp,
  ...props
}) => {
  const { i18n } = useContext(I18nContext);
  const inputFormat = useMemo(
    () => inputFormatProp || i18n.uiFormats.inputDateFormat,
    [i18n.uiFormats.inputDateFormat, inputFormatProp]
  );
  // console.log("[DatePickerField.rndr]", { inputFormatProp, inputFormat, i18n });
  const methods = useFormContext();

  return (
    <Controller
      control={control || methods?.control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <DesktopDatePicker
          renderInput={(params) => <TextField {...props} {...params} />}
          inputFormat={inputFormat}
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

const debugLog = (debug) => {
  if (debug?.msg) {
    const { msg, color, data } = debug;
    const msgs = color ? ["%c" + msg, `color:${color};`] : [msg];
    console.log(...msgs, data);
  }
};

export const RHFTextField = ({ name, control, rules, debug, ...props }) => {
  const methods = useFormContext();

  return (
    <Controller
      control={control || methods?.control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        // debugLog({ ...debug, data: { fieldState, field } }) ||
        <TextField
          error={!!fieldState.error}
          helperText={getError(fieldState.error, rules)}
          // helperText={fieldState.error}
          {...props}
          {...field}
        />
      )}
    />
  );
};

export const getOption = (options, value) =>
  options.find((o) => o.value === value);

export const color = (color, msg) => ["%c" + msg, `color:${color};`];

function valuetext(value) {
  return `${value} years`;
}

const StyledSlider = styled(Slider)(({ theme }) => ({
  "& .MuiSlider-rail": { backgroundColor: "#EAECF0", opacity: 1 },
  "& .MuiSlider-track": {
    // backgroundColor: "transparent",
    backgroundColor: theme.palette.secondary.light,
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 26,
    width: 26,
    borderRadius: "3px",
    // color: theme.palette.primary.main,
    color: "#F9F8FF",
    // bgcolor: "#F9F8FF",
    border: `1px solid ${theme.palette.primary.main}`,
    boxShadow: "none",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.light, 0.16)}`,
      // Reset on touch devices, it doesn't add specificity
      // "@media (hover: none)": {
      //   boxShadow: iOSBoxShadow,
      // },
    },
    "&.Mui-focusVisible": {
      boxShadow: `0 0 0 6px ${alpha(theme.palette.primary.light, 0.16)}`,
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    // fontSize: 12,
    // fontWeight: "normal",
    // top: -6,
    // backgroundColor: "unset",
    // color: theme.palette.text.primary,
    // "&:before": {
    //   display: "none",
    // },
    // "& *": {
    //   background: "transparent",
    //   color: theme.palette.mode === "dark" ? "#fff" : "#000",
    // },
    "&:before": {
      display: "none",
    },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translateY(0%) scale(1)",
      top: 0,
      padding: 0,
      color: theme.palette.primary.main,
      backgroundColor: "transparent",
      height: "100%",
    },
  },
  // "& .MuiSlider-track": {
  //   border: "none",
  // },
  // "& .MuiSlider-rail": {
  //   opacity: 0.5,
  //   backgroundColor: "#bfbfbf",
  // },
  // "& .MuiSlider-mark": {
  //   backgroundColor: "#bfbfbf",
  //   height: 8,
  //   width: 1,
  //   "&.MuiSlider-markActive": {
  //     opacity: 1,
  //     backgroundColor: "currentColor",
  //   },
  // },
}));

const SliderFieldInner = ({ id, label, min, max, onChange, value }) => {
  const handleChange = (e, newValue) => {
    onChange(newValue);
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: "300px", px: 2 }}>
      <InputLabel shrink variant="outlined" htmlFor={id}>
        {label}
      </InputLabel>
      <StyledSlider
        aria-label={`${label}`}
        // valueLabelDisplay="auto"
        valueLabelDisplay="on"
        // components={{
        //   ValueLabel: ValueLabelComponent,
        // }}
        // slots={{
        //   valueLabel: ValueLabelComponent,
        // }}
        step={1}
        min={min}
        max={max}
        sx={{ mt: 1 }}
        getAriaLabel={() => "Temperature range"}
        value={value || [min, max]}
        onChange={handleChange}
        getAriaValueText={valuetext}
        // getAriaValueText={valuetext}
      />
    </FormControl>
  );
};

export const SliderField = ({
  name,
  rules,
  label,
  range: [min = 1, max = 10] = [],
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field }) => (
        <SliderFieldInner {...field} {...{ id: name, label, min, max }} />
      )}
    />
  );
};

export const AutocompleteSelect = ({
  name,
  id = name,
  rules,
  label,
  options,
  renderOption,
  InputProps,
  disableIsOptionEqualToValue,
  placeholder,
  multiple,
  disableCloseOnSelect,
  autoComplete,
  onChange,
  getValue = (f) => f.value,
  sx = {},
}) => {
  const from = useMemo(
    () =>
      multiple
        ? (data) => data?.map((item) => item?.value ?? item) ?? []
        : (data) => data?.value ?? null,
    [multiple]
  );
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Autocomplete
          name={name}
          autoHighlight
          fullWidth
          id={id}
          {...field}
          value={getValue(field)}
          sx={sx}
          multiple={multiple}
          disableCloseOnSelect={disableCloseOnSelect}
          options={options}
          // isOptionEqualToValue={
          //   disableIsOptionEqualToValue
          //     ? undefined
          //     : (option, value) => option.value === value
          // }
          // getOptionSelected
          getOptionLabel={(optionOrValue) =>
            optionOrValue?.label ||
            getOption(options, optionOrValue)?.label ||
            optionOrValue
          }
          size="small"
          renderOption={renderOption}
          // value={getValue(options, field.value)}
          onChange={(event, data, action, other) => {
            // console.log(...color("blue", "[AutocompleteSelect.onChange]"), {
            //   name,
            //   data,
            //   field,
            //   action,
            //   other,
            // });
            const value = from(data);
            onChange?.(value);
            field.onChange(value); // https://levelup.gitconnected.com/reareact-hook-form-with-mui-examples-a3080b71ec45
          }}
          renderInput={(params) => (
            // console.log("[AutocompleteSelect.renderInput]", name, {
            //   field,
            //   params,
            // }) ||
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!fieldState.error}
              helperText={getError(fieldState.error, rules)}
              inputProps={{
                // TODO: profile language autocomplete
                // autocomplete: autoComplete,
                // autoComplete: autoComplete,
                // "auto-complete": autoComplete,
                // ...InputProps,
                ...params.inputProps, // should contain value, but after form init it is ""
                // value: field.value, // TODO: test
                //   autoComplete: "new-password", // disable autocomplete and autofill
              }}
              // InputProps={{ ...InputProps }}
              InputLabelProps={{
                shrink: !!label,
              }}
              sx={
                {
                  // mt: 1,
                  // "label + .MuiOutlinedInput-root": { marginTop: 3 },
                }
              }
            />
          )}
          // inputValue={`${field.value}`}
          // onInputChange={(event, newInputValue) => {
          //   console.log("[AutocompleteSelect.onInputChange]", {
          //     name,
          //     event,
          //     newInputValue,
          //   });
          //   field.onChange(event, newInputValue);
          // }}
        />
      )}
    />
  );
};

// const MyInput = styled(OutlinedInput)(({ theme }) => ({
//   "label + &": {
//     marginTop: theme.spacing(3),
//   },
//   "& .MuiInputBase-input": {
//     // borderRadius: 4,
//     // position: "relative",
//     // backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
//     // border: "1px solid #ced4da",
//     // fontSize: 16,
//     // width: "auto",
//     // padding: "10px 12px",
//     // transition: theme.transitions.create([
//     //   "border-color",
//     //   "background-color",
//     //   "box-shadow",
//     // ]),
//     // "&:focus": {
//     //   boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
//     //   borderColor: theme.palette.primary.main,
//     // },
//   },
// }));

// const OutlinedField = ({ label, id = label, size = "small", shrink }) => {
//   // return null
//   return (
//     <FormControl variant="outlined">
//       <InputLabel shrink={shrink} variant="outlined" size={size} htmlFor={id}>
//         {label}
//       </InputLabel>
//       <OutlinedInput notched={shrink} label={label} id={id} size={size} />
//     </FormControl>
//   );
//   return (
//     <FormControl variant="outlined">
//       <InputLabel htmlFor="adornment-3">Label</InputLabel>
//       <OutlinedInput
//         label="Password"
//         id="adornment-3"
//         size="small"
//         endAdornment={
//           <InputAdornment position="end">
//             <IconButton
//               color="primary"
//               // onClick={handleClickShowPassword}
//               // onMouseDown={handleMouseDownPassword}
//               edge="end"
//             >
//               <Icon name="ArrowForward" />
//             </IconButton>
//           </InputAdornment>
//         }
//       />
//     </FormControl>
//   );
//   return (
//     <FormControl variant="outlined">
//       <InputLabel htmlFor="adornment-2">Label</InputLabel>
//       <OutlinedInput
//         id="adornment-2"
//         size="small"
//         endAdornment={
//           <InputAdornment position="end">
//             <Icon name="ArrowForward" />
//           </InputAdornment>
//         }
//       />
//     </FormControl>
//   );
// };

const getError = (error, rules) =>
  error?.message ||
  [error?.type, rules?.[error?.type]].filter(Boolean).join(": ");

const StyledOutlinedInput = styled(OutlinedInput)({
  backgroundColor: "white",
});

export const BareInputField = ({
  name,
  rules,
  size = "small",
  fullWidth = true,
  ...props
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field, fieldState, formState }) => (
        // console.log(fieldState.error, { field, fieldState }) ||
        <Box width="100%" position="relative">
          <StyledOutlinedInput
            error={!!fieldState.error}
            // helperText={getError(fieldState.error)}
            size={size}
            id={name}
            fullWidth={fullWidth}
            {...props}
            {...field}
          />
          <P
            sx={{
              color: "error.main",
              position: "absolute",
              bottom: "-20px",
              left: "8px",
            }}
          >
            {getError(fieldState.error, rules)}
          </P>
        </Box>
      )}
    />
  );
};

// const AutocompleteSelectStyled = styled(AutocompleteSelect)(({ theme }) => ({
//   ".MuiAutocomplete-root .MuiOutlinedInput-root": { backgroundColor: "white" },
// }));

export const B = styled("b")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

const FileUploadInner = ({ name, src, secondaryText }) => {
  return (
    <>
      <Avatar variant="circular" src={src} sx={{ width: 80, height: 80 }} />
      <Button
        variant="outlined"
        component="label"
        disableRipple
        disableElevation
        fullWidth
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          color: (theme) => theme.palette.text.primary,
          borderColor: "rgba(0, 0, 0, 0.23)",
          backgroundColor: "white",
          boxShadow: "none",
          textTransform: "none",
          height: "130px",
          "&:hover, &.Mui-focusVisible": {
            backgroundColor: "white",
            borderColor: (theme) => theme.palette.common.black,
          },
        }}
      >
        <input hidden accept="image/*" multiple type="file" />
        <Avatar
          variant="circular"
          sx={{ width: 48, height: 48, bgcolor: "#F9FAFB", opacity: 1.6 }}
        >
          <Avatar
            variant="circular"
            sx={{ width: 36, height: 36, bgcolor: "#EAECF0", opacity: 1.4 }}
          >
            <Icon name={"CloudUploadOutlined"} sx={{ color: "#667085" }} />
          </Avatar>
        </Avatar>
        <P gutterBottom sx={{ mt: 1 }}>
          <B>
            <Msg id="file-upload.primary" />
          </B>
        </P>
        <P>{secondaryText}</P>
      </Button>
    </>
  );
};

const messages = defineMessages({
  "file-upload.primary": {
    id: "file-upload.primary",
    defaultMessage: "Click to upload",
  }, // TODO: or drag and drop
});

export const FileUpload = (props) => (
  <MsgProvider messages={messages}>
    <FileUploadInner {...props} />
  </MsgProvider>
);
