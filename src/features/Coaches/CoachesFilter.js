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
import { useEffect, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FIELD_OPTIONS,
  LANGUAGE_OPTIONS,
  renderLanguageOption,
} from "../../components/Forms";
import { AutocompleteSelect, SliderField } from "../../components/Forms/Fields";
import { Icon } from "../../components/Icon";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { ControlsContainer } from "../Sessions/steps/Controls";

const color = (color, msg) => ["%c" + msg, `color:${color};`];

export const INITIAL_FILTER = {
  language: "en",
  field: null,
  experience: [1, 7],
  search: "",
};

export const CoachesFilter = ({ filter, setFilter, sx = { my: 3 } }) => {
  const msg = useMsg();
  const methods = useForm({
    // mode: "all",
    defaultValues: filter,
  });
  const onClearFilters = () => {
    methods.setValue("language", null);
    methods.setValue("field", null);
    methods.setValue("experience", null);
  };

  const language = methods.watch("language");
  const field = methods.watch("field");
  const experience = methods.watch("experience");

  const values = useMemo(
    () => ({ language, field, experience }),
    [field, language, experience]
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

  return (
    <FormProvider {...methods}>
      <Card sx={{ ...sx }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box display="flex" flexDirection="row" gap={3}>
            <AutocompleteSelect
              name="language"
              label={msg("coaches.filter.language.label")}
              options={LANGUAGE_OPTIONS}
              renderOption={renderLanguageOption}
            />
            <AutocompleteSelect
              name="field"
              label={msg("coaches.filter.field.label")}
              options={FIELD_OPTIONS}
            />
            <SliderField
              name="experience"
              label={msg("coaches.filter.experience.label")}
              range={[1, 10]}
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
          disabled
          sx={{ width: 360, "> .MuiInputBase-root": { bgcolor: "white" } }}
          label=""
          placeholder={msg("coaches.filter.search.placeholder")}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
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
