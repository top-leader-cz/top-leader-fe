import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LANGUAGE_OPTIONS, renderLanguageOption } from "../../components/Forms";
import { AutocompleteSelect, SliderField } from "../../components/Forms/Fields";
import { Icon } from "../../components/Icon";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { ControlsContainer } from "../Sessions/steps/Controls";
import { useFieldsDict } from "../Settings/useFieldsDict";
import { defaultLanguage } from "../../App";

const color = (color, msg) => ["%c" + msg, `color:${color};`];

export const INITIAL_FILTER = ({ userLang = defaultLanguage }) => ({
  languages: [userLang.substring(0, 2)],
  fields: [],
  experience: [1, 7],
  prices: [],
  search: "",
});

const ratesOptions = [
  { value: "$", label: "$" },
  { value: "$$", label: "$$" },
  { value: "$$$", label: "$$$" },
];

export const CoachesFilter = ({ filter, setFilter, sx = { my: 3 } }) => {
  const msg = useMsg();
  const { fieldsOptions } = useFieldsDict();
  const methods = useForm({
    // mode: "all",
    defaultValues: filter,
  });
  const onClearFilters = () => {
    methods.setValue("languages", null);
    methods.setValue("fields", null);
    methods.setValue("experience", null);
    methods.setValue("prices", null);
  };

  const languages = methods.watch("languages");
  const fields = methods.watch("fields");
  const experience = methods.watch("experience");
  const prices = methods.watch("prices");

  const values = useMemo(
    () => ({ languages, fields, experience, prices }),
    [languages, fields, experience, prices]
  );

  console.log(...color("pink", "[CoachesFilter]"), {
    filter,
    values,
  });

  const setFilterRef = useRef(setFilter);
  setFilterRef.current = setFilter;
  useEffect(() => {
    setFilterRef.current((filter) => ({ ...filter, ...values }));
  }, [values]);
  const onSearch = useCallback(
    (e) => {
      const root = e.target.closest(".MuiInputBase-root");
      const input = root?.querySelector("input");
      const value = input?.value || "";

      console.log("[onSearch]", { e, root, input, value });
      setFilter((filter) => ({ ...filter, search: value }));
    },
    [setFilter]
  );

  return (
    <FormProvider {...methods}>
      <Card sx={{ ...sx }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box display="flex" flexDirection="row" gap={3}>
            <AutocompleteSelect
              name="languages"
              label={msg("coaches.filter.language.label")}
              options={LANGUAGE_OPTIONS}
              renderOption={renderLanguageOption}
              multiple
              disableCloseOnSelect
            />
            <AutocompleteSelect
              name="fields"
              label={msg("coaches.filter.field.label")}
              options={fieldsOptions}
              multiple
              disableCloseOnSelect
            />
            <SliderField
              name="experience"
              label={msg("coaches.filter.experience.label")}
              range={[1, 10]}
            />
            <AutocompleteSelect
              name="prices"
              label={msg("coaches.filter.rate.label")}
              options={ratesOptions}
              multiple
              disableCloseOnSelect
            />

            {/* <OutlinedField label="Test" /> */}
          </Box>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <ControlsContainer>
            <Button
              onClick={onClearFilters}
              variant="text"
              startIcon={<Close />}
              sx={{ p: 1 }}
            >
              <Msg id="coaches.filter.clear-button" />
            </Button>
          </ControlsContainer>
        </CardContent>
      </Card>
      <Box display="flex" flexDirection="row">
        <TextField
          // disabled
          sx={{ width: 360, "> .MuiInputBase-root": { bgcolor: "white" } }}
          label=""
          placeholder={msg("coaches.filter.search.placeholder")}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={onSearch}
                  sx={{
                    mr: -2,
                    px: 1,
                    minWidth: "auto",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  variant="contained"
                >
                  <Icon name="Search" />
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </FormProvider>
  );
};
