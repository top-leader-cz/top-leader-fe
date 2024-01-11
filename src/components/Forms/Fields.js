import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Slider,
  Switch,
  TextField,
} from "@mui/material";
import { Box, alpha, styled } from "@mui/system";
import {
  DatePicker,
  DesktopDatePicker,
  TimePicker as MuiTimePicker,
} from "@mui/x-date-pickers";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { getDay, isSameDay, isValid } from "date-fns/fp";
import {
  assoc,
  chain,
  curryN,
  identity,
  lensProp,
  map,
  pipe,
  prop,
  remove,
  set,
  sortBy,
  splitEvery,
  tap,
  toPairs,
  uniq,
  view,
  when,
} from "ramda";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Controller, useFormContext } from "react-hook-form";
import { defineMessages } from "react-intl";
import { I18nContext } from "../../features/I18n/I18nProvider";
import { useStaticCallback } from "../../hooks/useStaticCallback.hook";
import { ErrorBoundary } from "../ErrorBoundary";
import { Icon } from "../Icon";
import { Msg, MsgProvider } from "../Msg";
import { Score } from "../Score";
import { P } from "../Typography";
import { FieldError } from "./validations";
import { useMsg } from "../Msg/Msg";

// import { DateRangePicker } from "@mui/lab";
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

export const getIntervals = pipe(
  when(
    ({ length }) => length % 2 !== 0,
    () => {
      throw new Error(
        "getIntervals - Invalid dayRanges, length must be factor of 2 (start,end,start,end,...)"
      );
    }
  ),
  splitEvery(2),
  map(([start, end]) => ({ start, end }))
);
const getValuesArr = pipe(chain((interval) => [interval.start, interval.end]));

export const anchorTime = (date, time) => {
  try {
    const {
      hours = 0,
      minutes = 0,
      seconds = 0,
      milliseconds = 0,
    } = typeof time?.getTime === "function"
      ? {
          hours: time.getHours(),
          minutes: time.getMinutes(),
          seconds: time.getSeconds(),
          milliseconds: time.getMilliseconds(),
        }
      : {};
    const target = new Date(date.getTime());
    target.setHours(hours);
    target.setMinutes(minutes);
    target.setSeconds(seconds);
    target.setMilliseconds(milliseconds);
    return target;
  } catch (e) {
    console.error("anchorTime", { date, time, e });
    // debugger;
    return undefined;
  }
};

const arr = [];
const TimeRangesPicker = React.forwardRef(
  ({ inputProps, field, inputFormat, referenceDate, ...props }, ref) => {
    const { userTz } = useContext(I18nContext);
    const value = field.value ?? arr;
    const intervals = getIntervals(value);
    const sortedValue = [...value]; // TODO: model as array of intervals instead of array of dates
    // const sortedValue = getValuesArr(intervals);
    const onChange = (idx) => (date) => {
      if (!isValid(referenceDate)) {
        console.error(
          "TimeRangesPicker - referenceDate must be valid",
          field.name,
          {
            date,
            referenceDate,
          }
        );
      }
      if (!isSameDay(referenceDate, date)) {
        console.error(
          "TimeRangesPicker - date must be same day as reference",
          field.name,
          {
            date,
            referenceDate,
          }
        );
      }
      const adjustedDate = anchorTime(referenceDate, date);

      const newValue = [...sortedValue];
      newValue[idx] = adjustedDate;
      // debugger;
      return field.onChange(newValue);
    };
    const onAdd = useCallback(() => {
      const newValue = [...sortedValue, null, null];
      return field.onChange(newValue);
    }, [field, sortedValue]);
    const onRemove = useCallback(
      (intervalIndex) => {
        const startIdx = intervalIndex * 2;
        const newValue = remove(startIdx, 2, sortedValue);
        return field.onChange(newValue);
      },
      [field, sortedValue]
    );
    // console.log("%c[TimeRangesPicker.rndr]", "color:coral;", field.name, {
    //   field,
    //   props,
    // });

    return (
      <ErrorBoundary extraInfo={field?.value}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {intervals.map(({ start, end }, intervalIndex) => (
            <Box
              key={`${intervalIndex}`}
              display="flex"
              sx={{ mt: !!intervalIndex ? 3 : undefined }}
            >
              <MuiTimePicker
                ref={ref}
                slotProps={{
                  textField: { size: "small", sx: { bgcolor: "white" } },
                }}
                name={field.name}
                value={start}
                onChange={onChange(0 + intervalIndex * 2)}
                onBlur={field.onBlur}
                format={inputFormat}
                referenceDate={referenceDate}
                timezone={userTz}
              />
              <Box alignSelf="center" sx={{ mx: 1 }}>
                -
              </Box>
              <MuiTimePicker
                slotProps={{
                  textField: { size: "small", sx: { bgcolor: "white" } },
                }}
                // name={field.name}
                onChange={onChange(1 + intervalIndex * 2)}
                value={end}
                onBlur={field.onBlur}
                format={inputFormat}
                referenceDate={referenceDate}
                timezone={userTz}
              />
              {intervalIndex === 0 ? (
                <IconButton sx={{ ml: 2 }} onClick={onAdd}>
                  <Icon
                    name="Add"
                    sx={
                      {
                        // color: "#667085",
                      }
                    }
                  />
                </IconButton>
              ) : (
                <IconButton
                  sx={{ ml: 2 }}
                  onClick={() => onRemove(intervalIndex)}
                >
                  <Icon
                    name="DeleteOutlined"
                    sx={
                      {
                        // color: "#667085",
                      }
                    }
                  />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </ErrorBoundary>
    );
  }
);

export const TimeRangesPickerField = ({
  name,
  rules,
  inputFormat: inputFormatProp,
  inputProps,
  referenceDate,
}) => {
  const { i18n } = useContext(I18nContext);
  const inputFormat = useMemo(
    () => inputFormatProp || i18n.uiFormats.inputTimeFormat,
    [i18n.uiFormats.inputTimeFormat, inputFormatProp]
  );

  // TODO: fields array with intervals: https://react-hook-form.com/docs/usefieldarray

  return (
    <ErrorBoundary>
      <Controller
        name={name}
        rules={rules}
        render={({ field }) => (
          <TimeRangesPicker
            {...{ field, inputFormat, inputProps, referenceDate }}
          />
        )}
      />
    </ErrorBoundary>
  );
};

const DateRangePicker = React.forwardRef(
  ({ field, sx, inputFormat, ...props }, ref) => {
    const [startValue, endValue] = field.value ?? [];
    const onChange = (idx) => (date) => {
      const newValue = [startValue, endValue];
      newValue[idx] = date;
      return field.onChange(newValue);
    };
    // console.log("%c[DateRangePicker.rndr]", "color:navy;", field.name, {
    //   field,
    //   props,
    // });
    return (
      <ErrorBoundary extraInfo={field?.value}>
        <Box display="flex" sx={sx}>
          <DesktopDatePicker
            ref={ref}
            slotProps={{
              textField: { size: "small", sx: { width: 180 } },
            }}
            name={field.name}
            onChange={onChange(0)}
            onBlur={field.onBlur}
            value={startValue}
            format={inputFormat}
          />
          <Box alignSelf="center" sx={{ mx: 1 }}>
            -
          </Box>
          <DesktopDatePicker
            slotProps={{
              textField: { size: "small", sx: { width: 180 } },
            }}
            // name={field.name}
            onChange={onChange(1)}
            onBlur={field.onBlur}
            value={endValue}
            format={inputFormat}
          />
        </Box>
      </ErrorBoundary>
    );
  }
);
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
    <ErrorBoundary>
      <Controller
        name={name}
        rules={rules}
        render={({ field }) => (
          <DateRangePicker {...props} format={inputFormat} field={field} />
        )}
      />
    </ErrorBoundary>
    // </LocalizationProvider>
  );
};

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isHovered",
})(({ theme, isSelected, isHovered, day, ...rest }) => ({
  borderRadius: 0,
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary[theme.palette.mode],
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary[theme.palette.mode],
    },
  }),
  // ...(getDay(day) === 0 && {
  //   borderTopLeftRadius: "50%",
  //   borderBottomLeftRadius: "50%",
  // }),
  // ...(getDay(day) === 6 && {
  //   borderTopRightRadius: "50%",
  //   borderBottomRightRadius: "50%",
  // }),
}));

function Day(props) {
  const { day, selectedDay, hoveredDay, sx = {}, ...other } = props;
  const {
    i18n,
    locale: {
      options: { weekStartsOn },
    },
  } = useContext(I18nContext);
  const weekEndsOn = (weekStartsOn + 6) % 7;

  const isInSameWeek = (dayA, dayB) => {
    if (dayB == null) {
      return false;
    }
    return i18n.dffp.isSameWeek(dayA, dayB);
  };
  // debugger;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{
        px: 2.5,
        ...sx,
        ...(getDay(day) === weekStartsOn && {
          borderTopLeftRadius: "50%",
          borderBottomLeftRadius: "50%",
        }),
        ...(getDay(day) === weekEndsOn && {
          borderTopRightRadius: "50%",
          borderBottomRightRadius: "50%",
        }),
      }}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
    />
  );
}

export const parseWeek = curryN(2, ({ i18n }, date) => {
  const newValue = {
    start: i18n.dffp.startOfWeek(date),
    end: i18n.dffp.endOfWeek(date),
    selected: date,
  };
  return newValue;
});
const useWeekIntervalParser = () => {
  const { i18n } = useContext(I18nContext);
  return useCallback(parseWeek({ i18n }), [i18n]);
};
const WeekPicker = React.forwardRef(({ field, sx, format, ...props }, ref) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const { start, end, selected } = field.value ?? {};
  const parseWeek = useWeekIntervalParser();
  const onChange = (date) => {
    const newValue = parseWeek(date);
    return field.onChange(newValue);
  };
  // const format = `${inputFormat}' - '${inputFormat}`;
  // console.log("%c[WeekPicker.rndr]", "color:navy;", field.name, {
  //   field,
  //   props,
  // });
  return (
    <ErrorBoundary extraInfo={field?.value}>
      <Box display="flex" sx={sx}>
        <DatePicker
          ref={ref}
          // slots={{ calendar: WeekPickerCalendar }}
          showDaysOutsideCurrentMonth
          displayWeekNumber
          slots={{ day: Day }}
          slotProps={{
            textField: { size: "small", sx: { width: 180 } },
            day: (ownerState) => ({
              selectedDay: selected,
              hoveredDay,
              onPointerEnter: () => setHoveredDay(ownerState.day),
              onPointerLeave: () => setHoveredDay(null),
            }),
          }}
          name={field.name}
          onChange={onChange}
          onBlur={field.onBlur}
          value={selected}
          format={format}
          {...props}
          // selectedSections={} // TODO}
        />
      </Box>
    </ErrorBoundary>
  );
});

export const WeekPickerField = ({
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
    <ErrorBoundary>
      <Controller
        name={name}
        rules={rules}
        render={({ field }) => (
          <WeekPicker {...props} format={inputFormat} field={field} />
        )}
      />
    </ErrorBoundary>
    // </LocalizationProvider>
  );
};

export const SwitchField = ({ name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field }) => (
        <Switch {...{ ...props, ...field, checked: !!field.value, name }} />
      )}
    />
  );
};

export const StaticValueField = ({ name, children, ...props }) => {
  return (
    <Controller
      name={name}
      render={({ field }) =>
        typeof children === "function" ? children(field) : field.value
      }
    />
  );
};

export const CheckboxField = ({ name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field }) => {
        // TODO: develop in storybook properly
        const inverted = false;
        const invertedProps = inverted
          ? {
              checked: !field.value,
              onChange: (e, value) => {
                console.log({ e, value });
                // debugger;
                field.onChange(e, !value);
              },
            }
          : {};
        // console.log("CheckboxField", name, { inverted, invertedProps, field });
        return (
          <Checkbox
            {...{
              name,
              checked: !!field.value,
              ...field,
              ...props,
              ...invertedProps,
            }}
          />
        );
      }}
    />
  );
};

export const DatePickerField = ({
  control,
  name,
  rules,
  inputFormat: inputFormatProp,
  textFieldProps,
  clearable = !rules?.required,
  ...rest
}) => {
  const { i18n } = useContext(I18nContext);
  const inputFormat = useMemo(
    () => inputFormatProp || i18n.uiFormats.inputDateFormat,
    [i18n.uiFormats.inputDateFormat, inputFormatProp]
  );
  const methods = useFormContext();
  // console.log("[DatePickerField.rndr]", { inputFormatProp, inputFormat, i18n });

  return (
    <ErrorBoundary>
      <Controller
        control={control || methods?.control}
        name={name}
        rules={rules}
        render={({ field, fieldState }) =>
          console.log("[DPF]", { field, fieldState }) || (
            <ErrorBoundary extraInfo={field?.value}>
              <DesktopDatePicker
                slotProps={{
                  field: {
                    clearable,
                    // onClear: () => console.log("DatePickerField cleared"),
                  },
                  textField: {
                    size: "small",
                    error: !!fieldState.error,
                    helperText: (
                      <FieldError {...{ field, fieldState, rules, name }} />
                    ),
                    ...textFieldProps,
                  },
                }}
                format={inputFormat}
                {...rest}
                {...field}
              />
            </ErrorBoundary>
          )
        }
      />
    </ErrorBoundary>
  );
};

export const TimePicker = ({ control, name, rules, ...props }) => {
  const methods = useFormContext();

  return (
    <Controller
      control={control || methods?.control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <MuiTimePicker
          slotProps={{
            textField: {
              size: "small",
              error: !!fieldState.error,
              helperText: (
                <FieldError {...{ field, fieldState, rules, name }} />
              ),
            },
          }}
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

export const RHFTextField = ({
  name,
  control,
  rules,
  debug,
  size = "small", // "medium"
  // trim = false,
  ...props
}) => {
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
          helperText={<FieldError {...{ field, fieldState, rules, name }} />}
          size={size}
          {...props}
          {...field}
          // onChange={
          //   !trim
          //     ? field.onChange
          //     : (e, newValue) => {
          //         field.onChange(newValue?.trim());
          //       }
          // }
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
        // aria-label={`${label}`}
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
        getAriaLabel={() => `${label}`}
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

// TODO: make stateless for language select, keep state in mutation with optimistic update
// export const AutocompleteBare = ({}) => {}

export const AutocompleteSelect = ({
  name,
  id = name,
  rules,
  label,
  options,
  renderOption,
  InputProps,
  placeholder,
  multiple,
  enableIsOptionEqualToValue = !multiple, // TODO: progressively enable everywhere
  disableCloseOnSelect,
  autoComplete,
  onChange,
  getValue = (f) => f.value,
  sx = {},
  textFieldProps = {},
  disablePortal,
  AutocompleteComponent = Autocomplete,
  TextFieldComponent = TextField,
  disableClearable,
  ...props
}) => {
  const from = useMemo(
    () =>
      multiple
        ? (data) => uniq(data?.map((item) => item?.value ?? item) ?? [])
        : (data) => data?.value ?? null,
    [multiple]
  );
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <AutocompleteComponent
          name={name}
          disablePortal={disablePortal}
          autoHighlight
          fullWidth
          id={id}
          {...field}
          value={getValue(field)}
          sx={sx}
          multiple={multiple}
          disableCloseOnSelect={disableCloseOnSelect}
          disableClearable={disableClearable}
          options={options}
          isOptionEqualToValue={
            // TODO: test multiple works
            enableIsOptionEqualToValue
              ? (option, value) => option.value === value
              : undefined
          }
          getOptionLabel={(optionOrValue) =>
            optionOrValue?.label ||
            getOption(options, optionOrValue)?.label ||
            optionOrValue
          }
          size="small"
          renderOption={renderOption}
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
            <TextFieldComponent
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!fieldState.error}
              helperText={
                <FieldError {...{ field, fieldState, rules, name }} />
              }
              inputProps={{
                // TODO: profile language autocomplete
                ...params.inputProps, // should contain value, but after form init it is ""
                // autocomplete: autoComplete,
                autoComplete: autoComplete,
                ...(textFieldProps.inputProps ?? {}),
                // "aria-autocomplete": autoComplete, // default is "list"
                // ...InputProps,
                // value: field.value, // TODO: test
                //   autoComplete: "new-password", // disable autocomplete and autofill
              }}
              // InputProps={{ ...InputProps }}
              InputLabelProps={{
                shrink: !!label,
              }}
              {...textFieldProps}
            />
          )}
          {...props}
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

const pipeMaybe = (...fns) =>
  fns.some((fn) => !fn) ? undefined : pipe(...fns);

const log =
  (...args) =>
  (data) =>
    console.log(...args, data);

export const optionEqStrategies = {
  default: "default",
  optionValue: "optionValue",
  equals: "equals",
};

const freeSoloMessages = defineMessages({
  "general.freeSolo.placeholder": {
    id: "general.freeSolo.placeholder",
    defaultMessage: "Type your own and hit enter or select from the list",
  },
});

export const FreeSoloField = ({
  name,
  id = name,
  rules,
  label,
  options: optionsProp,
  groupedOptions,
  optionEqStrategy = "optionValue",
  placeholder: placeholderProp,
  onChange,
  selectOnFocus = true,
  clearOnBlur = true,
  debug = true,
  inputProps = {},
  ...props
}) => {
  const msg = useMsg({ dict: freeSoloMessages });
  const placeholder = useMemo(
    () => placeholderProp || msg("general.freeSolo.placeholder"),
    [placeholderProp, msg]
  );

  const optionsProps = useMemo(() => {
    if (!groupedOptions) return { options: optionsProp };

    const groupLens = lensProp("__group");

    if (Array.isArray(groupedOptions))
      return {
        groupBy: view(groupLens),
        options: sortBy(view(groupLens), groupedOptions),
      };

    return {
      groupBy: view(groupLens),
      options: pipe(
        toPairs,
        chain(([key, options]) => map(set(groupLens, key), options))
      )(groupedOptions),
    };
  }, [groupedOptions, optionsProp]);
  const isOptionEqualToValue = useMemo(() => {
    const predicateFns = {
      [optionEqStrategies.default]: undefined,
      [optionEqStrategies.optionValue]: (opt, val) => opt.value === val,
      [optionEqStrategies.equals]: (opt, val) => opt === val,
    };
    return pipeMaybe(
      // tap(debug ? log(`[isOptionEqualToValue] ${optionEqStrategy}`) : identity),
      predicateFns[optionEqStrategy]
    );
  }, [optionEqStrategy]);
  const from = useCallback(
    ({ data, action }) => {
      if (action === "createOption") return data; // isUserInput(value)? {isUserInput: true, inputText: value}
      if (action === "selectOption") return data?.value ?? null;

      // TODO: multiple
      return props.multiple
        ? (data) => uniq(data?.map((item) => item?.value ?? item) ?? [])
        : (data) => data?.value ?? null;
    },
    [props.multiple]
  );
  const { options } = optionsProps;
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <Autocomplete
          freeSolo
          // https://mui.com/material-ui/react-autocomplete/#creatable
          selectOnFocus={selectOnFocus}
          clearOnBlur={clearOnBlur}
          name={name}
          autoHighlight
          fullWidth
          id={id}
          {...field}
          {...optionsProps}
          isOptionEqualToValue={isOptionEqualToValue}
          getOptionLabel={(optionOrValue) =>
            optionOrValue?.label ||
            getOption(options, optionOrValue)?.label ||
            optionOrValue
          }
          size="small"
          onChange={(event, data, action, other) => {
            // prettier-ignore
            console.log(...color("blue", "[FreeSoloField.onChange]"), { name, data, field, action, other });
            if (typeof debug === "string") debugger; // debugger, break, d, b
            const value = from({ data, action });
            onChange?.(value);
            field.onChange(value); // https://levelup.gitconnected.com/reareact-hook-form-with-mui-examples-a3080b71ec45
          }}
          // onBlur={(event, reason, ...rest) => {
          //   // prettier-ignore
          //   console.log(...color("blue", "[FreeSoloField.onBlur]"), { name, field, event, reason, rest });
          //   if (typeof debug === "string") debugger; // debugger, break, d, b
          //   field.onBlur(event, reason, ...rest);
          // }}
          renderInput={(params) => {
            // when initially rendered with value but without options, stays displayed with option key instead of label
            if (debug) console.log("[FreeSoloField.renderInput]", { name, field, params, optionsProps }); // prettier-ignore
            return (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!fieldState.error}
                helperText={
                  <FieldError {...{ field, fieldState, rules, name }} />
                }
                InputLabelProps={{ shrink: !!label }}
                inputProps={{
                  ...params.inputProps,
                  ...inputProps,
                }}
              />
            );
          }}
          {...props}
        />
      )}
    />
  );
};

export const StyledOutlinedInput = styled(OutlinedInput)({
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
            <FieldError {...{ field, fieldState, rules, name }} />
          </P>
        </Box>
      )}
    />
  );
};

export const ScoreField = ({ name, rules, ...props }) => {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field, fieldState, formState }) => (
        <Score
          {...field}
          {...props}
          error={!!fieldState.error}
          onChange={({ value }) => field.onChange(value)}
        />
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

export async function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((res, rej) => {
    reader.onload = function () {
      console.log("[getBase64.onload]");
      console.log(reader.result);
      res(reader.result);
    };
    reader.onerror = function (error) {
      console.log("[getBase64.onerror]", error);
      rej(error);
    };
  });
}

// https://claritydev.net/blog/react-hook-form-multipart-form-data-file-uploads
const FileUploadInner = ({ name, src, secondaryText, onChange = () => {} }) => {
  const { register, watch } = useFormContext();
  const fileList = watch(name);
  const fileMaybe = fileList?.[0];
  const fileSrc = fileMaybe ? URL.createObjectURL(fileMaybe) : src;

  const onChangeStatic = useStaticCallback(onChange);
  useEffect(() => {
    onChangeStatic(fileMaybe);
  }, [fileMaybe, onChangeStatic]);

  console.log("FileUploadInner.rndr", { name, src, fileList, fileSrc });
  return (
    <>
      <Avatar variant="circular" src={fileSrc} sx={{ width: 80, height: 80 }} />
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
        <input
          hidden
          accept="image/*"
          type="file"
          name={name}
          {...register(name)}
        />
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
