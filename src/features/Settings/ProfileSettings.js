import { Alert, Box, Chip } from "@mui/material";
import { format } from "date-fns-tz";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import {
  FIELD_OPTIONS,
  LANGUAGE_OPTIONS,
  getLabel,
  renderLanguageOption,
} from "../../components/Forms";
import {
  AutocompleteSelect,
  BareInputField,
  DatePickerField,
  FileUpload,
  SwitchField,
} from "../../components/Forms/Fields";
import { useRightMenu } from "../../components/Layout";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2, P } from "../../components/Typography";
import { useAuth } from "../Authorization";
import { FormRow } from "./FormRow";
import { WHITE_BG } from "./Settings.page";
import { QueryRenderer } from "../QM/QueryRenderer";
import { I18nContext } from "../../App";
import { messages as coachesMessages } from "../Coaches/messages";

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
  imageSrc: "imageSrc", // "photo": [ "string" ],
  bio: "bio",
  timeZone: "timeZone",
  languages: "languages",
  fields: "fields",
  // certificates: "certificates", // rm
  experienceSince: "experienceSince",
  publicProfile: "publicProfile",
  rate: "rate",
};

const _COACH = {
  [FIELDS.firstName]: "Darnell",
  [FIELDS.lastName]: "Brekke",
  [FIELDS.email]: "darnell.brekke@gmail.com",
  [FIELDS.imageSrc]: `https://i.pravatar.cc/225?u=${Math.random()}`, // TODO: upload form field
  [FIELDS.bio]:
    "Saepe aspernatur enim velit libero voluptas aut optio nihil est. Ipsum porro aut quod sunt saepe error est consequatur. Aperiam hic consequuntur qui aut omnis atque voluptatum sequi deleniti. ",
  [FIELDS.timeZone]: Intl.DateTimeFormat().resolvedOptions().timeZone,
  [FIELDS.languages]: [
    Intl.DateTimeFormat().resolvedOptions().locale.substring(0, 2),
  ],
  // [FIELDS.languages]: navigator.language.substring(0, 2),
  // https://stackoverflow.com/questions/673905/how-to-determine-users-locale-within-browser
  // https://attacomsian.com/blog/javascript-current-timezone
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions
  [FIELDS.fields]: ["business", "life"],
  // [FIELDS.certificates]: "Associate Coach Certified - Issued by ICF",
  [FIELDS.experienceSince]: new Date(Date.now() - 7 * 24 * 3600 * 1000),
  [FIELDS.rate]: "",
  [FIELDS.publicProfile]: false,
};

const to = ({ photo, ...data }, { userLocale, userTz }) => {
  return {
    ...data,
    rate: data.rate || "",
    experienceSince: data.experienceSince, // TODO: utc
    timeZone: data.timezone || userTz,
    languages: data.languages?.length ? data.languages : [userLocale],
    imageSrc: photo?.[0],
  };
};

const from = ({ imageSrc, ...values }) => {
  console.log("from", { imageSrc, ...values });
  return {
    ...values,
    photo: imageSrc && [imageSrc],
    experienceSince: values.experienceSince, // TODO
  };
};

export const ProfileSettings = () => {
  const { authFetch, user } = useAuth();
  const msg = useMsg();
  const form = useForm({});
  const { language, userTz } = useContext(I18nContext);

  const [loading, setLoading] = useState(true);
  const { reset } = form;
  const resetForm = useCallback(
    (data) => {
      reset(
        to(data, {
          userLocale: language,
          // TODO: notify user that timezone settings is different than currently set!
          userTz,
        })
      );

      // Autocomplete needs remount after form reset, TODO
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 0);
    },
    [language, reset, userTz]
  );

  const initialValuesQuery = useQuery({
    queryKey: ["coach-info"], // TODO?
    queryFn: () => authFetch({ url: "/api/latest/coach-info" }),
    staleTime: 20 * 1000,
    retry: 1,
    // refetchOnMount: "always",
    // Reset needed on every component mount -> eff
    // onSuccess: (data) => {
    //   // console.log("%cDATA", "color:blue", { data });
    //   resetForm(data);
    // },
  });

  const saveMutation = useMutation({
    mutationFn: (values) =>
      console.log("[save start]", { values, payload: from(values) }) ||
      (() => {
        // debugger;
      })() ||
      authFetch({
        url: "/api/latest/coach-info",
        method: "POST",
        data: from(values),
      }),
    onSuccess: (data) => {
      console.log("[save success]", { data });
      resetForm(data);
    },
  });

  const { data } = initialValuesQuery;
  useEffect(() => {
    console.log("%c[PS.eff reset]", "color:lime", { data: data });
    if (data) resetForm(data);

    // stuck on loading?
    // if (data) reset(to((data));
    // else setLoading(false);
  }, [data, resetForm]);

  const isJustLoaderDisplayed = initialValuesQuery.isLoading || loading;

  const COACH = form.formState.defaultValues ?? {}; // TODO
  console.log("%c[PS.rndr]", "color:deepskyblue", {
    initialValuesQuery,
    form,
    saveMutation,
    isJustLoaderDisplayed,
    userTz,
    language,
    experienceSince: form.watch("experienceSince"),
  });

  const onSubmit = (data, e) =>
    console.log("[ProfileSettings.onSubmit]", data, e);
  const onError = (errors, e) =>
    console.log("[ProfileSettings.onError]", errors, e);

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
          <Box width="100%" align="left" mt={3}>
            <Box
              component="img"
              borderRadius={2}
              width={225}
              alignSelf={"center"}
              src={COACH.imageSrc}
            />
          </Box>
          <H2 mt={3}>{`${COACH.firstName || ""} ${COACH.lastName || ""}`}</H2>
          {/* <P mt={1}>{COACH.certificates}</P> */}
          <P mt={1}>
            {msg("settings.profile.field.experience")}
            {": "}
            {COACH.experienceSince ? `${COACH.experienceSince}` : ""}
          </P>
          <P mt={1}>
            {msg("settings.profile.field.languages")}
            {": "}
            {[].concat(COACH.languages).join(", ")}
          </P>
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
      [
        COACH.bio,
        COACH.experienceSince,
        COACH.fields,
        COACH.firstName,
        COACH.imageSrc,
        COACH.languages,
        COACH.lastName,
        form,
        msg,
        saveDisabled,
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
          rules={{ required: true, minLength: 2 }}
          // placeholder={"Type your message"}
        />
        <BareInputField
          name={FIELDS.lastName}
          rules={{ required: true, minLength: 2 }}
          // placeholder={"Type your message"}
        />
      </FormRow>

      <FormRow label={msg("settings.profile.field.email")} name={FIELDS.email}>
        <BareInputField
          name={FIELDS.email}
          autoComplete="email"
          rules={{ minLength: 5 }}
          placeholder={user.data?.username ?? ""}
        />
      </FormRow>

      <FormRow label={msg("settings.profile.field.photo")}>
        <FileUpload
          name={FIELDS.imageSrc}
          src={COACH.imageSrc}
          secondaryText={msg("settings.profile.field.photo.limit")}
        />
      </FormRow>

      <FormRow label={msg("settings.profile.field.bio")} name={FIELDS.bio}>
        <BareInputField
          name={FIELDS.bio}
          // rules={{ required: true }}
          multiline
          rows={4}
        />
      </FormRow>

      <FormRow
        label={msg("settings.profile.field.timezone")}
        name={FIELDS.timeZone}
      >
        <AutocompleteSelect
          sx={WHITE_BG}
          name={FIELDS.timeZone}
          options={TIMEZONE_OPTIONS}
          rules={{ required: true }}
          placeholder="Select your timezone" // TODO: translations!
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

      <FormRow
        label={msg("settings.profile.field.languages")}
        name={FIELDS.languages}
      >
        {/* {form.formState.defaultValues?.timeZone ? NOT WORKING!?! */}
        <AutocompleteSelect
          multiple
          disableCloseOnSelect
          sx={WHITE_BG}
          name={FIELDS.languages}
          options={LANGUAGE_OPTIONS}
          renderOption={renderLanguageOption}
          placeholder={msg("settings.profile.field.languages.placeholder")}
        />
      </FormRow>

      <FormRow
        label={msg("settings.profile.field.fields")}
        name={FIELDS.fields}
      >
        <AutocompleteSelect
          multiple
          disableCloseOnSelect
          sx={WHITE_BG}
          name={FIELDS.fields}
          options={FIELD_OPTIONS}
          placeholder={msg("settings.profile.field.fields.placeholder")}
        />
      </FormRow>

      {/* <FormRow
        label={msg("settings.profile.field.certificates")}
        name={FIELDS.certificates}
      >
        <BareInputField name={FIELDS.certificates} rules={{}} />
      </FormRow> */}

      <FormRow
        label={msg("settings.profile.field.experience")}
        name={FIELDS.experienceSince}
      >
        <DatePickerField
          name={FIELDS.experienceSince}
          inputFormat={"MM/dd/yyyy"}
          sx={{ ...WHITE_BG, width: "100%" }}
          size="small"
        />
      </FormRow>

      <FormRow label={msg("settings.profile.field.rate")} name={FIELDS.rate}>
        <BareInputField name={FIELDS.rate} />
      </FormRow>
    </FormProvider>
  );
};
