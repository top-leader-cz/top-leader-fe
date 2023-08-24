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
import { useMutation } from "react-query";
import { useAuth } from "../Authorization";

const FIELDS_GENERAL = {
  language: "language",
  currentPassword: "currentPassword",
  newPassword: "newPassword",
  newPasswordConfirm: "newPasswordConfirm",
};

const PASSWORD_MIN_LENGTH = 3;

export const GeneralSettings = () => {
  const { authFetch } = useAuth();
  const passwordMutation = useMutation({
    mutationFn: (values) =>
      console.log("PSSSWORD POST", values) ||
      authFetch({
        method: "POST",
        url: "/api/latest/password",
        data: {
          oldPassword: values[FIELDS_GENERAL.currentPassword],
          newPassword: values[FIELDS_GENERAL.newPassword],
        },
      }),
  });
  const msg = useMsg();
  const { language, setLanguage } = useContext(TranslationContext);
  const form = useForm({
    // mode: "onSubmit",
    // mode: "all",¯
    defaultValues: {
      language,
    },
  });

  const onSubmit = (data, e) => {
    if (
      data[FIELDS_GENERAL.newPassword] !==
      data[FIELDS_GENERAL.newPasswordConfirm]
    )
      form.setError(FIELDS_GENERAL.newPasswordConfirm, {
        message: msg("settings.general.field.newPasswordConfirm.error-match"),
      });
    else passwordMutation.mutate(data);
  };
  const onError = (errors, e) =>
    console.log("[GeneralSettings.onError]", errors, e);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
            rules={{ required: true, minLength: PASSWORD_MIN_LENGTH }}
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
            rules={{ required: true, minLength: PASSWORD_MIN_LENGTH }}
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
            rules={{ required: true, minLength: PASSWORD_MIN_LENGTH }}
            type="password"
            autoComplete="new-password"
          />
        </FormRow>
        <FormRow dividerTop={false}>
          <ControlsContainer>
            <Button variant="outlined" sx={{ bgcolor: "white" }}>
              <Msg id="settings.general.button.cancel" />
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={passwordMutation.isLoading}
            >
              <Msg id="settings.general.button.save" />
            </Button>
          </ControlsContainer>
        </FormRow>
      </FormProvider>
    </form>
  );
};
