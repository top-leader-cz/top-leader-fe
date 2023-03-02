import { Button } from "@mui/material";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TranslationContext } from "../../App";
import { LANGUAGE_OPTIONS, renderLanguageOption } from "../../components/Forms";
import {
  AutocompleteSelect,
  BareInputField,
} from "../../components/Forms/Fields";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { ControlsContainer } from "../Sessions/steps/Controls";
import { FormRow } from "./FormRow";
import { WHITE_BG } from "./Settings.page";

const FIELDS_GENERAL = {
  language: "language",
  currentPassword: "currentPassword",
  newPassword: "newPassword",
  newPasswordConfirm: "newPasswordConfirm",
};

export const GeneralSettings = () => {
  const msg = useMsg();
  const { language, setLanguage } = useContext(TranslationContext);
  const form = useForm({
    // mode: "onSubmit",
    // mode: "all",¯
    defaultValues: {
      language,
    },
  });

  const onSubmit = (data, e) =>
    console.log("[GeneralSettings.onSubmit]", data, e);
  const onError = (errors, e) =>
    console.log("[GeneralSettings.onError]", errors, e);

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FormProvider {...form}>
        <H2 gutterBottom>
          <Msg id="settings.general.heading" />
        </H2>
        <P sx={{ mb: -1 }}>
          <Msg id="settings.general.perex" />
        </P>

        <FormRow
          label={msg("settings.general.field.language")}
          name={FIELDS_GENERAL.language}
          dividerBottom
        >
          <AutocompleteSelect
            sx={WHITE_BG}
            name={FIELDS_GENERAL.language}
            options={LANGUAGE_OPTIONS}
            renderOption={renderLanguageOption}
            placeholder="Select languages you speak"
            autoComplete="language" // TODO
            onChange={(lang) => setLanguage(lang)}
          />
        </FormRow>

        <H2 sx={{ mb: 3 }}>
          <Msg id="settings.general.password" />
        </H2>

        <FormRow
          label={msg("settings.general.field.currentPassword")}
          name={FIELDS_GENERAL.currentPassword}
          dividerTop={false}
          dividerBottom={false}
          sx={{ mb: 3 }}
        >
          <BareInputField
            name={FIELDS_GENERAL.currentPassword}
            type="password"
            autoComplete="current-password"
          />
        </FormRow>

        <FormRow
          label={msg("settings.general.field.newPassword")}
          name={FIELDS_GENERAL.newPassword}
          dividerTop={false}
          dividerBottom={false}
          sx={{ mb: 3 }}
        >
          <BareInputField
            name={FIELDS_GENERAL.newPassword}
            type="password"
            autoComplete="new-password"
          />
        </FormRow>

        <FormRow
          label={msg("settings.general.field.newPasswordConfirm")}
          name={FIELDS_GENERAL.newPasswordConfirm}
          dividerTop={false}
          dividerBottom={false}
          sx={{ mb: 3 }}
        >
          <BareInputField
            name={FIELDS_GENERAL.newPasswordConfirm}
            type="password"
            autoComplete="new-password"
          />
        </FormRow>
        <FormRow dividerTop={false}>
          <ControlsContainer>
            <Button variant="outlined" sx={{ bgcolor: "white" }}>
              <Msg id="settings.general.button.cancel" />
            </Button>
            <Button type="submit" variant="contained">
              <Msg id="settings.general.button.save" />
            </Button>
          </ControlsContainer>
        </FormRow>
      </FormProvider>
    </form>
  );
};
