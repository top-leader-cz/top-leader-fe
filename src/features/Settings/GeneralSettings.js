import { Button } from "@mui/material";
import { useCallback, useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

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
import { format } from "date-fns-tz";
import { I18nContext } from "../I18n/I18nProvider";

const FIELDS_GENERAL = {
  language: "language",
  timeZone: "timeZone",
  currentPassword: "currentPassword",
  newPassword: "newPassword",
  newPasswordConfirm: "newPasswordConfirm",
};

const PASSWORD_MIN_LENGTH = 3;

const tzf = (f, tz) => format(new Date(), f, { timeZone: tz });

const formatTimezone = (tz) => `${tz} (${tzf("z", tz)}) ${tzf("O", tz)}`; // | ${tzf("zzzz", tz)}`;

const timeZones = Intl.supportedValuesOf("timeZone");
const TIMEZONE_OPTIONS = timeZones.map((value) => ({
  value,
  label: formatTimezone(value),
}));

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
  const { language, setLanguage, userTz, userTzMutation } =
    useContext(I18nContext);
  const form = useForm({
    // mode: "onSubmit",
    // mode: "all",¯
    defaultValues: {
      language,
      timeZone: userTz,
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
  const onCancel = useCallback(() => {
    console.log("TODO");
    setLanguage(language);
    form.reset({
      [FIELDS_GENERAL.language]: language,
      [FIELDS_GENERAL.timeZone]: userTz,
      [FIELDS_GENERAL.currentPassword]: "",
      [FIELDS_GENERAL.newPassword]: "",
      [FIELDS_GENERAL.newPasswordConfirm]: "",
    });
  }, [form, language, setLanguage, userTz]);

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
          dividerBottom={false}
          sx={{ mb: 3 }}
        >
          <AutocompleteSelect
            disableClearable
            sx={WHITE_BG}
            name={FIELDS_GENERAL.language}
            options={LANGUAGE_OPTIONS}
            renderOption={renderLanguageOption}
            placeholder="Select languages you speak"
            autoComplete="language" // TODO: not working
            onChange={(lang) => setLanguage(lang)}
          />
        </FormRow>
        <FormRow
          label={msg("settings.profile.field.timezone")}
          name={FIELDS_GENERAL.timeZone}
          dividerTop={false}
          dividerBottom={true}
        >
          <AutocompleteSelect
            disableClearable
            sx={WHITE_BG}
            name={FIELDS_GENERAL.timeZone}
            options={TIMEZONE_OPTIONS}
            // rules={{ required: true }}
            placeholder="" // TODO: translations? should be always populated
            onChange={(timeZone) => userTzMutation.mutate(timeZone)}
            disabled={userTzMutation.isLoading}
            // getValue={(field) => {
            //   console.log(
            //     "%c[PS.rndr.getValue]" + field.name,
            //     "color:coral",
            //     {
            //       field,
            //     }
            //   );
            //   return field.value;
            //   return LANGUAGE_OPTIONS.find(
            //     (option) => option.value === field.value
            //   );
            // }}
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
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{ bgcolor: "white" }}
            >
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
