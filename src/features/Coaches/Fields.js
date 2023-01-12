import { ArrowBack, Close, Diversity1, Mail } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  Modal,
  OutlinedInput,
  Paper,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/system";
import {
  addDays,
  endOfDay,
  format,
  getHours,
  isWithinInterval,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns/fp";
import { curryN, filter, identity, map, pipe } from "ramda";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Input } from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H1, H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { ControlsContainer } from "../Sessions/steps/Controls";

const getOption = (options, value) => options.find((o) => o.value === value);

const color = (color, msg) => ["%c" + msg, `color:${color};`];

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
    console.log("handleChange", { newValue });
    onChange(newValue);
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: "300px", px: 2 }}>
      <InputLabel shrink variant="outlined" htmlFor={id}>
        {label}
      </InputLabel>
      <StyledSlider
        // aria-label="Temperature"
        // defaultValue={30}
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
        // marks
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
  // return null;
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
  rules,
  label,
  options,
  renderOption,
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({ field }) => (
        <Autocomplete
          name={name}
          autoHighlight
          fullWidth
          {...field}
          options={options}
          isOptionEqualToValue={(option, value) => option.value === value}
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
            console.log(...color("blue", "[AutocompleteSelect.onChange]"), {
              name,
              data,
              field,
              action,
              other,
            });
            field.onChange(data?.value ?? null); // https://levelup.gitconnected.com/reareact-hook-form-with-mui-examples-a3080b71ec45
          }}
          renderInput={(params) =>
            console.log("[AutocompleteSelect.renderInput]", {
              field,
              params,
            }) || (
              <TextField
                {...params}
                label={label}
                inputProps={{
                  ...params.inputProps,
                  //   autoComplete: "new-password", // disable autocomplete and autofill
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={
                  {
                    // mt: 1,
                    // "label + .MuiOutlinedInput-root": { marginTop: 3 },
                  }
                }
              />
            )
          }
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

const MyInput = styled(OutlinedInput)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    // borderRadius: 4,
    // position: "relative",
    // backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    // border: "1px solid #ced4da",
    // fontSize: 16,
    // width: "auto",
    // padding: "10px 12px",
    // transition: theme.transitions.create([
    //   "border-color",
    //   "background-color",
    //   "box-shadow",
    // ]),
    // "&:focus": {
    //   boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    //   borderColor: theme.palette.primary.main,
    // },
  },
}));

const OutlinedField = ({ label, id = label, size = "small", shrink }) => {
  // return null
  return (
    <FormControl variant="outlined">
      <InputLabel shrink={shrink} variant="outlined" size={size} htmlFor={id}>
        {label}
      </InputLabel>
      <OutlinedInput notched={shrink} label={label} id={id} size={size} />
    </FormControl>
  );
  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor="adornment-3">Label</InputLabel>
      <OutlinedInput
        label="Password"
        id="adornment-3"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              color="primary"
              // onClick={handleClickShowPassword}
              // onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              <Icon name="ArrowForward" />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor="adornment-2">Label</InputLabel>
      <OutlinedInput
        id="adornment-2"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <Icon name="ArrowForward" />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
