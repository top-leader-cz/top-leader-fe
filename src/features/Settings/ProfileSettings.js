import { Alert, Box, Chip } from "@mui/material";

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import {
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
  getBase64,
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
import { useFieldsDict } from "./useFieldsDict";
import { img1 } from "./exampleImg";

const FIELDS = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  imageSrc: "imageSrc", // "photo": [ "string" ],
  bio: "bio",
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
    languages: data.languages?.length ? data.languages : [userLocale],
    imageSrc: photo?.[0],
  };
};

const from = async ({ imageSrc, ...values }) => {
  // const file = imageSrc ? imageSrc?.[0] : undefined;
  // const photo = await getBase64(file);
  // console.log("from", { imageSrc, photo, file, ...values });
  console.log("from", { imageSrc, ...values });

  return {
    ...values,
    experienceSince: values.experienceSince, // TODO
  };
};

export const useResetForm = ({ to, form, initialResetting }) => {
  const [resetting, setResetting] = useState(initialResetting);
  const { reset } = form;
  const resetForm = useCallback(
    (data) => {
      reset(to(data));

      // Autocomplete needs remount after form reset, TODO
      setResetting(true);
      setTimeout(() => {
        setResetting(false);
      }, 0);
    },
    [reset, to]
  );

  return {
    resetting,
    resetForm,
  };
};

export const ProfileSettings = () => {
  const { authFetch, user } = useAuth();
  const msg = useMsg();
  const { fieldsOptions } = useFieldsDict();
  const form = useForm({});
  const { language, i18n } = useContext(I18nContext);
  const { resetForm, resetting } = useResetForm({
    initialResetting: true,
    form,
    to: useCallback(
      (data) => to(data, { userLocale: language.substring(0, 2) }),
      [language]
    ),
  });

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
    mutationFn: async (values) =>
      console.log("[save start]", { values, payload: await from(values) }) ||
      (() => {
        // debugger;
      })() ||
      authFetch({
        url: "/api/latest/coach-info",
        method: "POST",
        data: await from(values),
      }),
    onSuccess: (data) => {
      console.log("[save success]", { data });
      resetForm(data);
    },
  });

  const [reloadPhotoToken, reloadPhoto] = useReducer((i) => i + 1, 0);
  const postPhotoMutation = useMutation({
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
      console.log("[postPhotoMutation.onSuccess] reloading photo!!!");
      reloadPhoto();
    },
  });

  const handlePhotoUpload = (file) => {
    console.log("[handlePhotoUpload]", { file });

    if (file) {
      console.log("[handlePhotoUpload] HAVE FILE", { file });
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
    isJustLoaderDisplayed,
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
              borderRadius={1}
              width={225}
              alignSelf={"center"}
              // src={COACH.imageSrc}
              // src={img1}
              src={`/api/latest/coach-info/photo?${reloadPhotoToken}`}
            />
          </Box>
          <H2 mt={3}>{`${COACH.firstName || ""} ${COACH.lastName || ""}`}</H2>
          {/* <P mt={1}>{COACH.certificates}</P> */}
          <P mt={1}>
            {msg("settings.profile.field.experience")}
            {": "}
            {COACH.experienceSince
              ? `${i18n.formatDistanceToNow(
                  i18n.parseDate(COACH.experienceSince)
                )}`
              : ""}
          </P>
          <P mt={1}>
            {msg("settings.profile.field.languages")}
            {": "}
            {[]
              .concat(COACH.languages)
              .map(getLabel(LANGUAGE_OPTIONS))
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
        </ScrollableRightMenu>
      ),
      [
        COACH.bio,
        COACH.experienceSince,
        COACH.fields,
        COACH.firstName,
        COACH.languages,
        COACH.lastName,
        fieldsOptions,
        form,
        i18n,
        msg,
        reloadPhotoToken,
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
          src={`/api/latest/coach-info/photo`}
          secondaryText={msg("settings.profile.field.photo.limit")}
          onChange={handlePhotoUpload}
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
        label={msg("settings.profile.field.languages")}
        name={FIELDS.languages}
      >
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
          options={fieldsOptions}
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
          // inputFormat={"MM/dd/yyyy"}
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
