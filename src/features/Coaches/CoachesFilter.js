import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { filter, flip, includes, pipe, prop } from "ramda";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { getCoachLanguagesOptions } from "../../components/Forms";
import { AutocompleteSelect, SliderField } from "../../components/Forms/Fields";
import { RHForm } from "../../components/Forms/Form";
import { Icon } from "../../components/Icon";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { I18nContext } from "../I18n/I18nProvider";
import { ControlsContainer } from "../Sessions/steps/Controls";
import { useFieldsDict } from "../Settings/useFieldsDict";

const color = (color, msg) => ["%c" + msg, `color:${color};`];

export const INITIAL_FILTER = () => ({
  // languages: [userLang.substring(0, 2)],
  languages: [],
  fields: [],
  experience: [1, 70],
  prices: [],
  search: "",
});

const ratesOptions = [
  { value: "$", label: "$" },
  { value: "$$", label: "$$" },
  { value: "$$$", label: "$$$" },
];

const RATES = [
  { label: "$", credits: 110 },
  { label: "$$", credits: 165 },
  { label: "$$$", credits: 275 },
];

const Rates = ({ msg, rates = RATES }) => {
  return (
    <>
      <Box display="flex">
        <Box>
          {rates.map(({ label }) => (
            <Box key={label}>{label}</Box>
          ))}
        </Box>
        <Box>
          {rates.map(({ credits }) => (
            <Box key={credits}>
              {" = "}
              {msg("coaches.filter.rate.tooltip.credits-per-session", {
                credits,
              })}
            </Box>
          ))}
        </Box>
      </Box>
      <Box textAlign="center">{msg("coaches.filter.rate.tooltip.info")}</Box>
    </>
  );
};

export const filterOptions = (supportedValues) =>
  filter(pipe(prop("value"), flip(includes)(supportedValues)));

export const CoachesFilter = ({
  filter,
  setFilter,
  supportedLanguages = [],
  supportedFields = [],
  sx = { my: 3 },
}) => {
  const msg = useMsg();
  const { fieldsOptions: unfilteredFieldsOptions } = useFieldsDict();
  const methods = useForm({
    defaultValues: filter,
  });

  const languages = methods.watch("languages");
  const fields = methods.watch("fields");
  const experience = methods.watch("experience");
  const prices = methods.watch("prices");
  const search = methods.watch("search");

  const values = useMemo(
    () => ({ languages, fields, experience, prices }),
    [languages, fields, experience, prices]
  );

  const setFilterRef = useRef(setFilter);
  setFilterRef.current = setFilter;
  useEffect(() => {
    setFilterRef.current((filter) => ({ ...filter, ...values }));
  }, [values]);
  const onSearch = useCallback(
    (searchStr = search) => {
      // const root = e.target.closest(".MuiInputBase-root");
      // const input = root?.querySelector("input");
      // const value = input?.value || "";
      console.log("onSearch", { searchStr, search });
      setFilter((filter) => ({ ...filter, search: searchStr }));
    },
    [search, setFilter]
  );
  const onClearFilters = () => {
    console.log("RESETTING");
    const initialValues = INITIAL_FILTER();
    methods.setValue("languages", initialValues.languages);
    methods.setValue("fields", initialValues.fields);
    methods.setValue("experience", initialValues.experience);
    methods.setValue("prices", initialValues.prices);
    methods.setValue("search", initialValues.search);

    onSearch("");
  };
  const languageOptions = useMemo(
    () => pipe(getCoachLanguagesOptions, filterOptions(supportedLanguages))(),
    [supportedLanguages]
  );
  const fieldsOptions = useMemo(
    () => filterOptions(supportedFields)(unfilteredFieldsOptions),
    [supportedFields, unfilteredFieldsOptions]
  );

  return (
    <RHForm
      form={methods}
      onSubmit={(values) =>
        console.log("onSubmit", { values }) || onSearch(values.search)
      }
    >
      <Card sx={{ ...sx }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          {/* <Box display="flex" flexDirection="row" gap={3}> */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 4, md: 2 }}
          >
            <AutocompleteSelect
              name="languages"
              label={msg("coaches.filter.language.label")}
              options={languageOptions}
              // renderOption={renderLanguageOption}
              multiple
            />
            <AutocompleteSelect
              name="fields"
              label={msg("coaches.filter.field.label")}
              options={fieldsOptions}
              multiple
              disableCloseOnSelect={false}
            />
            <SliderField
              name="experience"
              label={msg("coaches.filter.experience.label")}
              range={[1, 70]}
            />
            <Tooltip title={<Rates msg={msg} />} placement="top">
              <div>
                <AutocompleteSelect
                  name="prices"
                  label={msg("coaches.filter.rate.label")}
                  // label={ <Tooltip title="rates"> {msg("coaches.filter.rate.label")} </Tooltip> } // NOT WORKING
                  options={ratesOptions}
                  multiple
                  // disablePortal
                  // renderOption={(props, option, { selected }) => (
                  //   <li {...props}>
                  //     <Checkbox
                  //       icon={icon}
                  //       checkedIcon={checkedIcon}
                  //       style={{ marginRight: 8 }}
                  //       checked={selected}
                  //     />
                  //     {option.label}
                  //   </li>
                  // )}
                  // sx={{ maxHeight: "40px" }}
                  // textFieldProps={{
                  //   sx: {
                  //     maxHeight: "40px",
                  //     overflow: "hidden",
                  //     "& .MuiInputBase-root": {
                  //       maxHeight: "40px",
                  //       overflow: "hidden",
                  //     },
                  //   },
                  // }}
                />
              </div>
            </Tooltip>

            {/* <OutlinedField label="Test" /> */}
          </Stack>
          {/* </Box> */}
          <Divider sx={{ mt: 3, mb: 2 }} />
          <ControlsContainer>
            <Button
              onClick={onClearFilters}
              variant="text"
              startIcon={<Icon name="Close" />}
              sx={{ p: 1 }}
            >
              <Msg id="coaches.filter.clear-button" />
            </Button>
          </ControlsContainer>
        </CardContent>
      </Card>
      <Box display="flex" flexDirection="row">
        <Controller
          name={"search"}
          // rules={{ minLength: 5 }}
          render={({ field, fieldState, formState }) => (
            <TextField
              // disabled
              autoFocus
              sx={{ width: 360, "> .MuiInputBase-root": { bgcolor: "white" } }}
              label=""
              placeholder={msg("coaches.filter.search.placeholder")}
              size="small"
              {...field}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      // onClick={() => onSearch()}
                      sx={{
                        mr: -2,
                        px: 1,
                        minWidth: "auto",
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                      variant="contained"
                      type="submit"
                    >
                      <Icon name="Search" />
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </Box>
    </RHForm>
  );
};
