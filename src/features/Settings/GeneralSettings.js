import { Button } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { H2, P } from "../../components/Typography";
import {
  LANGUAGE_OPTIONS,
  renderLanguageOption,
} from "../Coaches/Coaches.page";
import { AutocompleteSelect } from "../Coaches/Fields";
import { ControlsContainer } from "../Sessions/steps/Controls";
import { BareInputField } from "./Fields";
import { FormRow } from "./FormRow";
import { WHITE_BG } from "./Settings.page";

const FIELDS_GENERAL = {
  language: "language",
  currentPassword: "currentPassword",
  newPassword: "newPassword",
  newPasswordConfirm: "newPasswordConfirm",
};

export const GeneralSettings = ({}) => {
  const form = useForm({
    // mode: "onSubmit",
    // mode: "all",¯
    defaultValues: { language: "en" },
  });

  const onSubmit = (data, e) =>
    console.log("[GeneralSettings.onSubmit]", data, e);
  const onError = (errors, e) =>
    console.log("[GeneralSettings.onError]", errors, e);

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FormProvider {...form}>
        <H2 gutterBottom>General</H2>
        <P sx={{ mb: -1 }}>Pavel</P>

        <FormRow label="Language" name={FIELDS_GENERAL.language} dividerBottom>
          <AutocompleteSelect
            sx={WHITE_BG}
            name={FIELDS_GENERAL.language}
            options={LANGUAGE_OPTIONS}
            renderOption={renderLanguageOption}
            placeholder="Select languages you speak"
            autoComplete="language" // TODO
          />
        </FormRow>

        <H2 sx={{ mb: 3 }}>Password</H2>

        <FormRow
          label="Current password"
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
          label="New password"
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
          label="Confirm new password"
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
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Update password
            </Button>
          </ControlsContainer>
        </FormRow>
      </FormProvider>
    </form>
  );
};
