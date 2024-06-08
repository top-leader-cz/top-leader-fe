import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useCallback, useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { format } from "date-fns-tz";
import { applySpec, prop } from "ramda";
import { LANGUAGE_OPTIONS, renderLanguageOption } from "../../components/Forms";
import {
  AutocompleteSelect,
  BareInputField,
} from "../../components/Forms/Fields";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2, H3, P } from "../../components/Typography";
import {
  useAuth,
  useMyMutation,
  useMyQuery,
} from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { ControlsContainer } from "../Sessions/steps/Controls";
import { FL_MAX_WIDTH, FormRow } from "./FormRow";
import { WHITE_BG } from "./Settings.page";
import pjson from "../../../package.json";
import { QueryRenderer } from "../QM/QueryRenderer";

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
export const TIMEZONE_OPTIONS = timeZones.map((value) => ({
  value,
  label: formatTimezone(value),
}));

/*
{
  "active": true,
  "status": "IN_PROGRESS",
  "lastSync": "2024-04-28T12:48:19.110Z"
}
*/
const useGoogleInfoQuery = () => {
  return useMyQuery({
    fetchDef: {
      url: "/api/latest/google-info",
    },
  });
};

const GCalSync = ({ msg }) => {
  const query = useGoogleInfoQuery();

  return (
    <>
      <QueryRenderer
        query={query}
        loading={() => <CircularProgress size={20} color="primary" />}
        success={({ data }) => {
          if (!data?.active)
            return (
              <Button
                component="a"
                variant="outlined"
                href={getAbsoluteHref(`/login/google`)}
                // target="_blank"
              >
                {msg("settings.general.integrations.google-calendar.connect")}
              </Button>
            );
          else
            return (
              <Button
                component="a"
                variant="outlined"
                href={getAbsoluteHref(`/login/google`)}
                title={data?.status}
                // target="_blank"
              >
                {msg("settings.general.integrations.google-calendar.reconnect")}
              </Button>
            );
        }}
      />
      {/* <Tooltip title={"Enabled useFreeBusy"} placement="top">
        <Checkbox
          disabled={
            process.env.NODE_ENV === "production" &&
            process.env.REACT_APP_ENV !== "QA"
          }
          name="__freeBusy"
          checked={!!freeBusy}
          onChange={(e, value) => {
            console.log("freeBusy", { value });
            setFreeBusy(value);
          }}
        />
      </Tooltip> */}
    </>
  );
};

export const GeneralSettings = () => {
  const { isCoach } = useAuth();
  const passwordMutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: "/api/latest/password",
      from: applySpec({
        oldPassword: prop(FIELDS_GENERAL.currentPassword),
        newPassword: prop(FIELDS_GENERAL.newPassword),
      }),
    },
    snackbar: { success: true, error: true },
    onSuccess: () => {
      form.reset({
        [FIELDS_GENERAL.currentPassword]: "",
        [FIELDS_GENERAL.newPassword]: "",
        [FIELDS_GENERAL.newPasswordConfirm]: "",
      });
    },
  });
  const msg = useMsg();
  const { language, setLanguage, userTz, userTzMutation, localeMutation } =
    useContext(I18nContext);
  const form = useForm({
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
    // setLanguage(language); // TODO: cannot reset
    form.reset({
      [FIELDS_GENERAL.language]: language,
      [FIELDS_GENERAL.timeZone]: userTz,
      [FIELDS_GENERAL.currentPassword]: "",
      [FIELDS_GENERAL.newPassword]: "",
      [FIELDS_GENERAL.newPasswordConfirm]: "",
    });
  }, [form, language, userTz]);

  const onError = (errors, e) =>
    console.log("[GeneralSettings.onError]", errors, e);

  console.log("[GeneralSettings.rndr]", {
    TIMEZONE_OPTIONS,
    userTz,
  });

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
            placeholder={msg("settings.profile.field.languages.placeholder")}
            autoComplete="language" // TODO: not working
            onChange={(locale) => localeMutation.mutate(locale)}
            disabled={localeMutation.isLoading}
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
        <FormRow dividerTop={false} dividerBottom>
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

        {isCoach && (
          <>
            <H2 sx={{ mb: 3 }}>
              <Msg id="settings.general.integrations" />
            </H2>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                maxWidth: FL_MAX_WIDTH,
              }}
            >
              <Avatar
                sx={{ width: 44, height: 44, mr: 2 }}
                variant="square"
                src={"/google-calendar.png"}
              />
              <Box sx={{ flexGrow: "2" }}>
                <H3 sx={{ mb: 1 }}>
                  {msg("settings.general.integrations.google-calendar.title")}
                </H3>
                <P>
                  {msg(
                    "settings.general.integrations.google-calendar.description"
                  )}
                </P>
              </Box>
              <GCalSync msg={msg} />
            </Box>
          </>
        )}
      </FormProvider>
    </form>
  );
};

const getAbsoluteHref = (path) => {
  const origin =
    process.env.NODE_ENV === "development"
      ? pjson?.proxy || window.location.origin
      : window.location.origin;
  const url = new URL(path, origin);
  const href = url.href;

  if (process.env.NODE_ENV === "development")
    console.log("[getAbsoluteHref]", { path, href, url, origin });

  return href;
};
