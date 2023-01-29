import { Box, Chip } from "@mui/material";
import { format } from "date-fns-tz";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  FIELD_OPTIONS,
  getLabel,
  LANGUAGE_OPTIONS,
  renderLanguageOption,
} from "../../components/Forms";
import {
  AutocompleteSelect,
  BareInputField,
  FileUpload,
} from "../../components/Forms/Fields";
import { useRightMenu } from "../../components/Layout";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2, P } from "../../components/Typography";
import { FormRow } from "./FormRow";
import { WHITE_BG } from "./Settings.page";

const tzf = (f, tz) => format(new Date(), f, { timeZone: tz });

const formatTimezone = (tz) => `${tz} (${tzf("z", tz)}) ${tzf("O", tz)}`; // | ${tzf("zzzz", tz)}`;

const timeZones = Intl.supportedValuesOf("timeZone");
const TIMEZONE_OPTIONS = timeZones.map((value) => ({
  value,
  label: formatTimezone(value),
}));

const FIELDS = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  imageSrc: "imageSrc",
  bio: "bio",
  timezone: "timezone",
  languages: "languages",
  fields: "fields",
  certificates: "certificates",
  experience: "experience",
};

const COACH = {
  [FIELDS.firstName]: "Darnell",
  [FIELDS.lastName]: "Brekke",
  [FIELDS.email]: "darnell.brekke@gmail.com",
  [FIELDS.imageSrc]: `https://i.pravatar.cc/225?u=${Math.random()}`, // TODO: upload form field
  [FIELDS.bio]:
    "Saepe aspernatur enim velit libero voluptas aut optio nihil est. Ipsum porro aut quod sunt saepe error est consequatur. Aperiam hic consequuntur qui aut omnis atque voluptatum sequi deleniti. ",
  [FIELDS.timezone]: Intl.DateTimeFormat().resolvedOptions().timeZone,
  [FIELDS.languages]: [
    Intl.DateTimeFormat().resolvedOptions().locale.substring(0, 2),
  ],
  // [FIELDS.languages]: navigator.language.substring(0, 2),
  // https://stackoverflow.com/questions/673905/how-to-determine-users-locale-within-browser
  // https://attacomsian.com/blog/javascript-current-timezone
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
  [FIELDS.fields]: ["business", "life", "football"],
  [FIELDS.certificates]: "Associate Coach Certified - Issued by ICF",
  [FIELDS.experience]: "3", // TODO: field
};

export const ProfileSettings = () => {
  const form = useForm({
    // mode: "onSubmit",
    defaultValues: { ...COACH },
  });

  const onSubmit = (data, e) =>
    console.log("[ProfileSettings.onSubmit]", data, e);
  const onError = (errors, e) =>
    console.log("[ProfileSettings.onError]", errors, e);

  useRightMenu(
    useMemo(
      () => (
        <ScrollableRightMenu
          heading={"Your coach profile preview"}
          buttonProps={{
            children: "Save",
            type: "submit",
            onClick: (e) => {
              console.log("Save click");
              form.handleSubmit(onSubmit, onError)(e);
            },
          }}
        >
          <Box width="100%" align="left" mt={3}>
            <Box
              component="img"
              borderRadius={2}
              width={225}
              alignSelf={"center"}
              src={COACH.imageSrc}
            />
          </Box>
          <H2 mt={3}>{`${COACH.firstName} ${COACH.lastName}`}</H2>
          <P mt={1}>{COACH.certificates}</P>
          <P mt={1}>Experience: {COACH.experience} years</P>
          <P mt={1}>Languages: {[].concat(COACH.languages).join(", ")}</P>
          <P my={3} color="black">
            {COACH.bio}
          </P>
          <Box display="flex" gap={1}>
            {[]
              .concat(COACH.fields)
              .map(getLabel(FIELD_OPTIONS))
              .map((label) => (
                <Chip
                  key={label}
                  sx={{ borderRadius: "6px", bgcolor: "#F9F8FF" }}
                  label={label}
                />
              ))}
          </Box>
        </ScrollableRightMenu>
      ),
      [form]
    )
  );

  return (
    <FormProvider {...form}>
      <H2 gutterBottom>Personal Info</H2>
      <P sx={{ mb: -1 }}>Update your info here</P>

      <FormRow label="Name" name={FIELDS.lastName}>
        <BareInputField
          name={FIELDS.firstName}
          rules={{ required: true, minLength: 2 }}
          // placeholder={"Type your message"}
        />
        <BareInputField
          name={FIELDS.lastName}
          rules={{ required: true, minLength: 2 }}
          // placeholder={"Type your message"}
        />
      </FormRow>

      <FormRow label="Email" name={FIELDS.email}>
        <BareInputField
          name={FIELDS.email}
          autoComplete="email"
          rules={{ required: true, minLength: 4 }}
        />
      </FormRow>

      <FormRow label="Photo">
        <FileUpload name={FIELDS.imageSrc} src={COACH.imageSrc} />
      </FormRow>

      <FormRow label="Bio" name={FIELDS.bio}>
        <BareInputField
          name={FIELDS.bio}
          rules={{ required: true }}
          multiline
          rows={4}
        />
      </FormRow>

      <FormRow label="Timezone" name={FIELDS.timezone}>
        <AutocompleteSelect
          sx={WHITE_BG}
          name={FIELDS.timezone}
          options={TIMEZONE_OPTIONS}
          rules={{ required: true }}
        />
      </FormRow>

      <FormRow label="Languages" name={FIELDS.languages}>
        <AutocompleteSelect
          multiple
          disableCloseOnSelect
          sx={WHITE_BG}
          name={FIELDS.languages}
          options={LANGUAGE_OPTIONS}
          renderOption={renderLanguageOption}
          placeholder="Select languages you speak"
        />
      </FormRow>

      <FormRow label="Fields" name={FIELDS.fields}>
        <AutocompleteSelect
          multiple
          disableCloseOnSelect
          sx={WHITE_BG}
          name={FIELDS.fields}
          options={FIELD_OPTIONS}
          placeholder="Select fields you work in"
        />
      </FormRow>

      <FormRow label="Certificates" name={FIELDS.certificates}>
        <BareInputField name={FIELDS.certificates} rules={{}} />
      </FormRow>

      <FormRow label="Experience (years)" name={FIELDS.experience}>
        <BareInputField name={FIELDS.experience} rules={{}} />
      </FormRow>
    </FormProvider>
  );
};
