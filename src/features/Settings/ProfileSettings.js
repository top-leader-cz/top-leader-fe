import { Alert, Box, Button, Chip } from "@mui/material";
import { formatInTimeZone } from "date-fns-tz/fp";
import { isValid, parse } from "date-fns/fp";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { getCoachLanguagesOptions, getLabel } from "../../components/Forms";
import {
  AutocompleteSelect,
  BareInputField,
  DatePickerField,
  FileUpload,
  StyledOutlinedInput,
  SwitchField,
} from "../../components/Forms/Fields";
import { useRightMenu } from "../../components/Layout";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2, P } from "../../components/Typography";
import { useAuth } from "../Authorization";
import { useMyMutation } from "../Authorization/AuthProvider";
import { IntroLink } from "../Coaches/CoachCard";
import { I18nContext } from "../I18n/I18nProvider";
import { API_DATE_FORMAT } from "../I18n/utils/date";
import { QueryRenderer } from "../QM/QueryRenderer";
import { FormRow } from "./FormRow";
import { WHITE_BG } from "./Settings.page";
import { useFieldsDict } from "./useFieldsDict";
import { useStaticCallback } from "../../hooks/useStaticCallback.hook";
import { invalidDate } from "../../components/Forms/validations";
import { Icon } from "../../components/Icon";
import { messages } from "./messages";

const FIELDS = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  imageSrc: "imageSrc", // TODO: extract "upload component" and "upload form field"
  bio: "bio",
  webLink: "webLink",
  linkedinProfile: "linkedinProfile",
  languages: "languages",
  fields: "fields",
  certificates: "certificates",
  experienceSince: "experienceSince",
  publicProfile: "publicProfile",
  rate: "rate",
};

export const certificatesOptions = [
  { value: "$", label: "ICF ACC / EMCC EIA Practitioner" },
  { value: "$$", label: "ICF PCC / EMCC EIA Senior Practitioner" },
  { value: "$$$", label: "ICF MCC / EMCC EIA Master Practitioner" },
];

const to = (data, { userLocale, userTz }) => {
  const experienceSince = parse(
    new Date(),
    API_DATE_FORMAT,
    data.experienceSince
  );
  const initialValues = {
    ...data,
    bio: data.bio || "",
    certificates: data.rate || undefined,
    experienceSince: isValid(experienceSince) ? experienceSince : null,
    languages: data.languages?.length ? data.languages : [userLocale],
  };
  console.log("to", { initialValues, data });
  return initialValues;
};

const from = (values, { userTz }) => {
  const { imageSrc, rate, certificates, experienceSince, ...rest } = values;
  const payload = {
    ...rest,
    rate: certificates,
    experienceSince: formatInTimeZone(API_DATE_FORMAT, userTz, experienceSince),
  };
  console.log("from", { imageSrc, ...rest }); // TODO: extract "upload component" and "upload form field"
  return payload;
};

export const useResetForm = ({ to, form, initialResetting }) => {
  const [resetting, setResetting] = useState(initialResetting);
  const { reset } = form;
  const resetForm = useStaticCallback(
    (data) => {
      reset(to(data));

      // Autocomplete needs remount after form reset, TODO
      setResetting(true);
      setTimeout(() => {
        setResetting(false);
      }, 0);
    }
    // [reset, to]
  );

  return {
    resetting,
    resetForm,
  };
};

export const LinkedInProfileMaybe = ({ href }) => {
  const msg = useMsg({ dict: messages });

  if (!href) return null;

  return (
    <Button
      type="button"
      variant="text"
      // color="secondary"
      sx={{ my: 3, alignSelf: "flex-start", color: "black" }}
      href={href}
      startIcon={<Icon name="LinkedIn" />}
      // endIcon={<Icon name="OpenInNew" sx={{ fontSize: 14 }} />}
      target="_blank"
      rel="noopener noreferrer"
    >
      {msg("settings.profile.field.linkedinProfile")}
      &nbsp;
      <Icon name="OpenInNew" sx={{ fontSize: "inherit" || 14 }} />
    </Button>
  );
};

export const ProfileSettings = () => {
  const msg = useMsg();
  const { authFetch, user } = useAuth();
  const { language, i18n, userTz } = useContext(I18nContext);
  const { fieldsOptions } = useFieldsDict();
  const form = useForm({});
  const { resetForm, resetting } = useResetForm({
    initialResetting: true,
    form,
    to: useCallback(
      (data) => to(data, { userTz, userLocale: language.substring(0, 2) }),
      [language, userTz]
    ),
  });
  const certificates = form.watch("certificates");

  const initialValuesQuery = useQuery({
    queryKey: ["coach-info"],
    queryFn: () => authFetch({ url: "/api/latest/coach-info" }),
    staleTime: 20 * 1000,
    retry: 1,
  });

  const saveMutation = useMyMutation({
    fetchDef: {
      url: "/api/latest/coach-info",
      method: "POST",
      from: (values) => from(values, { userTz }),
    },
    onSuccess: (data) => {
      console.log("[save success]", { data });
      resetForm(data);
    },
  });

  const [reloadPhotoToken, reloadPhoto] = useReducer((i) => i + 1, 0);
  const postPhotoMutation = useMyMutation({
    mutationFn: async ({ file }) => {
      // const photo = await getBase64(file);
      const formData = new FormData();
      formData.append("image", file, file.name);
      console.log("[postPhotoMutation]", { formData, file });

      return authFetch({
        method: "POST",
        url: `/api/latest/coach-info/photo`,
        data: formData,
      });
    },
    onSuccess: () => {
      reloadPhoto();
    },
  });

  const handlePhotoUpload = (file) => {
    console.log("[handlePhotoUpload]", { file });
    if (file) {
      postPhotoMutation.mutate({ file });
    }
  };

  const { data } = initialValuesQuery;
  useEffect(() => {
    console.log("%c[PS.eff reset]", "color:lime", { data: data });
    if (data) resetForm(data);
  }, [data, resetForm]);

  const isJustLoaderDisplayed = initialValuesQuery.isLoading || resetting;

  const COACH = form.formState.defaultValues ?? {}; // TODO
  console.log("%c[PS.rndr]", "color:deepskyblue", {
    initialValuesQuery,
    form,
    saveMutation,
    COACH,
    isJustLoaderDisplayed,
    language,
    experienceSince: form.watch("experienceSince"),
  });

  const onError = (errors, e, ...rest) =>
    console.log("[ProfileSettings.onError]", { errors, e, rest });

  const saveDisabled = saveMutation.isLoading || !!initialValuesQuery.error;
  useRightMenu(
    useMemo(
      () => (
        <ScrollableRightMenu
          heading={msg("settings.profile.aside.title")}
          buttonProps={{
            children: msg("settings.profile.aside.save"),
            type: "submit",
            disabled: saveDisabled,
            onClick: (e) => {
              console.log("Save click");
              form.handleSubmit(saveMutation.mutateAsync, onError)(e);
            },
          }}
        >
          <Box
            sx={{
              borderRadius: 0.6,
              minWidth: 225,
              width: 225,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 1,
              }}
              alignSelf={"center"}
              src={`/api/latest/coach-info/photo?${reloadPhotoToken}`}
            />
            <IntroLink webLink={COACH.webLink} />
          </Box>
          <H2 mt={3}>{`${COACH.firstName || ""} ${COACH.lastName || ""}`}</H2>
          {COACH.certificates && (
            <P mt={1}>
              {msg("settings.profile.field.level")}
              {": "}
              {getLabel(certificatesOptions)(COACH.certificates)}
            </P>
          )}
          <P mt={1}>
            {msg("settings.profile.field.experience")}
            {": "}
            {COACH.experienceSince
              ? `${i18n.formatDistanceToNowLocal(COACH.experienceSince)}`
              : ""}
          </P>
          <P mt={1}>
            {msg("settings.profile.field.languages")}
            {": "}
            {[]
              .concat(COACH.languages)
              .map(getLabel(getCoachLanguagesOptions()))
              .join(", ")}
          </P>
          <P my={3} color="black">
            {COACH.bio}
          </P>
          <Box display="flex" gap={1}>
            {[]
              .concat(COACH.fields)
              .map(getLabel(fieldsOptions))
              .map((label) => (
                <Chip
                  key={label}
                  sx={{ borderRadius: "6px", bgcolor: "#F9F8FF" }}
                  label={label}
                />
              ))}
          </Box>
          <LinkedInProfileMaybe href={COACH.linkedinProfile} />
        </ScrollableRightMenu>
      ),
      [
        msg,
        saveDisabled,
        reloadPhotoToken,
        COACH.webLink,
        COACH.firstName,
        COACH.lastName,
        COACH.certificates,
        COACH.experienceSince,
        COACH.languages,
        COACH.bio,
        COACH.fields,
        COACH.linkedinProfile,
        i18n,
        fieldsOptions,
        form,
        saveMutation.mutateAsync,
      ]
    )
  );

  if (initialValuesQuery.error)
    return (
      <QueryRenderer
        error={initialValuesQuery.error}
        errored={() => <Alert severity="error">Profile fetch failed</Alert>}
      />
    );

  // reset of MUI Autocomplete
  if (isJustLoaderDisplayed) return <QueryRenderer isLoading />;

  return (
    <FormProvider {...form}>
      <H2 gutterBottom>
        <Msg id="settings.profile.heading" />
      </H2>
      <P sx={{ mb: -1 }}>
        <Msg id="settings.profile.perex" />
      </P>
      <FormRow
        label={msg("settings.profile.field.publicProfile")}
        name={FIELDS.publicProfile}
      >
        <Box display="flex">
          <SwitchField name={FIELDS.publicProfile} />
        </Box>
      </FormRow>
      <FormRow
        label={msg("settings.profile.field.name")}
        name={FIELDS.lastName}
      >
        <BareInputField
          name={FIELDS.firstName}
          parametrizedValidate={[
            ["required"],
            ["notBlank"],
            ["minLength", { gteLength: 2 }],
          ]}
        />
        <BareInputField
          name={FIELDS.lastName}
          parametrizedValidate={[
            ["required"],
            ["notBlank"],
            ["minLength", { gteLength: 2 }],
          ]}
        />
      </FormRow>

      <FormRow label={msg("settings.profile.field.email")} name={FIELDS.email}>
        <BareInputField
          name={FIELDS.email}
          autoComplete="email"
          parametrizedValidate={[
            // ["required"], // not required, user.data?.username always present
            [
              "rePattern",
              { regexpToMatch: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i },
              { tsKey: "auth.login.email.validation.pattern" },
            ],
          ]}
          placeholder={user.data?.username ?? ""}
        />
      </FormRow>

      <FormRow label={msg("settings.profile.field.photo")}>
        <FileUpload
          name={FIELDS.imageSrc}
          src={`/api/latest/coach-info/photo`}
          secondaryText={msg("settings.profile.field.photo.limit", {
            maxSize: "10MB",
          })}
          onChange={handlePhotoUpload}
        />
      </FormRow>

      <FormRow label={msg("settings.profile.field.bio")} name={FIELDS.bio}>
        <BareInputField name={FIELDS.bio} multiline rows={4} />
      </FormRow>
      <FormRow
        label={msg("settings.profile.field.webLink")}
        name={FIELDS.webLink}
      >
        <BareInputField
          name={FIELDS.webLink}
          placeholder={msg("settings.profile.field.webLink.placeholder")}
        />
      </FormRow>
      <FormRow
        label={msg("settings.profile.field.linkedinProfile")}
        name={FIELDS.linkedinProfile}
      >
        <BareInputField
          name={FIELDS.linkedinProfile}
          placeholder={msg(
            "settings.profile.field.linkedinProfile.placeholder"
          )}
        />
      </FormRow>

      <FormRow
        label={msg("settings.profile.field.languages")}
        name={FIELDS.languages}
      >
        <AutocompleteSelect
          multiple
          sx={WHITE_BG}
          name={FIELDS.languages}
          options={getCoachLanguagesOptions()}
          // renderOption={renderLanguageOption}
          placeholder={msg("settings.profile.field.languages.placeholder")}
          enableIsOptionEqualToValue
        />
      </FormRow>

      <FormRow
        label={msg("settings.profile.field.fields")}
        name={FIELDS.fields}
      >
        <AutocompleteSelect
          multiple
          sx={WHITE_BG}
          name={FIELDS.fields}
          options={fieldsOptions}
          placeholder={msg("settings.profile.field.fields.placeholder")}
          enableIsOptionEqualToValue
        />
      </FormRow>

      {/* <FormRow
        label={msg("settings.profile.field.certificates")}
        name={FIELDS.certificates}
        >
        <BareInputField name={FIELDS.certificates} />
      </FormRow> */}
      <FormRow
        label={msg("settings.profile.field.experience")}
        name={FIELDS.experienceSince}
      >
        <DatePickerField
          name={FIELDS.experienceSince}
          textFieldProps={{ sx: { ...WHITE_BG, width: "100%" } }}
          // rules={{ required: true, validate: { invalidDate } }}
          parametrizedValidate={[["required"], ["validDate"]]}
          size="small"
        />
      </FormRow>

      <FormRow
        label={msg("settings.profile.field.certificates")}
        name={FIELDS.certificates}
      >
        <AutocompleteSelect
          sx={WHITE_BG}
          name={FIELDS.certificates}
          options={certificatesOptions}
          placeholder={msg("settings.profile.field.certificates.placeholder")}
          parametrizedValidate={[["required"]]}
        />
      </FormRow>

      <FormRow label={msg("settings.profile.field.rate")} name={FIELDS.rate}>
        {/* <BareInputField disabled name={FIELDS.rate} /> */}
        <Box width="100%" position="relative">
          <StyledOutlinedInput
            disabled
            name="rate"
            value={certificates}
            fullWidth
            size="small"
          />
        </Box>
      </FormRow>
    </FormProvider>
  );
};
