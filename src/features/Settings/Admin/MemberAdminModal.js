import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  Modal,
  Paper,
} from "@mui/material";
import { identity, map, pipe, prop } from "ramda";
import { useContext, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AutocompleteSelect,
  CheckboxField,
  FreeSoloField,
  LANGUAGE_OPTIONS,
  RHFTextField,
  renderLanguageOption,
} from "../../../components/Forms";
import { Icon } from "../../../components/Icon";
import { useMsg } from "../../../components/Msg/Msg";
import { H2, P } from "../../../components/Typography";
import { gray500 } from "../../../theme";
import { Authority } from "../../Authorization/AuthProvider";
import { formatName } from "../../Coaches/CoachCard";
import { useCoachesQuery } from "../../Coaches/Coaches.page";
import { INITIAL_FILTER } from "../../Coaches/CoachesFilter";
import { I18nContext } from "../../I18n/I18nProvider";
import { ConfirmModal } from "../../Modal/ConfirmModal";
import { TIMEZONE_OPTIONS } from "../../Settings/GeneralSettings";
import {
  useAdminUserMutation,
  useCompaniesQuery,
  useCompanyMutation,
} from "./api";
import stringSimilarity from "string-similarity";

export const USER_STATUS_OPTIONS = [
  { label: "Authorized", value: "AUTHORIZED" },
  { label: "Pending", value: "PENDING" },
];

const PreventSubmission = ({ children }) => {
  const preventHandler = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onKeyDown={preventHandler}
      onKeyUp={preventHandler}
      onKeyPress={preventHandler}
      onSubmit={preventHandler}
    >
      {children}
    </div>
  );
};

export const getLoadableOptions = ({ query, map = identity }) => {
  if (query.data) return { options: map(query.data) };
  if (query.error || query.isLoading)
    return {
      options: [],
      disabled: true,
      placeholder: query.isLoading ? "Loading..." : "Error loading options",
    };
};

export const MemberAdminForm = ({ onClose, initialValues }) => {
  const { userTz } = useContext(I18nContext);
  const msg = useMsg();
  const [createValues, setCreateValues] = useState();

  const coachesQuery = useCoachesQuery({ filter: INITIAL_FILTER() });
  const companiesQuery = useCompaniesQuery();
  const isEdit = !!initialValues && !!Object.values(initialValues).length;
  const mutation = useAdminUserMutation({
    isEdit,
    onSuccess: () => {
      setCreateValues(null);
      onClose();
    },
  });

  const defaultValues = {
    firstName: initialValues.firstName || "",
    lastName: initialValues.lastName || "",
    username: initialValues.username || "",
    authorities: initialValues.authorities?.length
      ? initialValues.authorities
      : ["USER"],
    locale: initialValues.locale,
    timeZone: initialValues.timeZone || userTz,
    companyId: initialValues.companyId || null, // TODO
    status: initialValues.status,
    ...(isEdit
      ? {
          coach: initialValues.coach,
          credit: initialValues.credit,
          // freeCoach, // TODO?
        }
      : {}),
  };
  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
  });

  const createCompanyMutation = useCompanyMutation({
    onSuccess: async ({ id }) => {
      const values = { ...createValues, companyId: id };
      await mutation.mutateAsync(values);
      setCreateValues(null);
      // debugger;
    },
  });
  const maybeBestMatchMsg = useMemo(() => {
    if (!createValues) return undefined;
    try {
      const companyNames = companiesQuery.data?.map?.(prop("name"));
      const bestMatch = stringSimilarity.findBestMatch(
        createValues?.companyId || "",
        companyNames || []
      );
      return (
        <P>
          You entered "<b>{createValues?.companyId}</b>", the most similar name
          among existing companies: "<b>{bestMatch.bestMatch.target}</b>"
          (similarity score: {bestMatch.bestMatch.rating.toFixed(2)})
        </P>
      );
    } catch (e) {
      console.error(e);
      debugger;
      return undefined;
    }
  }, [companiesQuery.data, createValues]);
  ConfirmModal.useModal(
    useMemo(
      () => ({
        open: !!createValues,
        onClose: () => setCreateValues(null),
        iconName: "RocketLaunch",
        title: "Create new company?",
        desc: maybeBestMatchMsg || "",
        // error: createCompanyMutation.error,
        getButtons: ({ onClose }) => [
          {
            variant: "outlined",
            type: "button",
            children: "Cancel",
            onClick: () => onClose(),
          },
          {
            component: LoadingButton,
            variant: "contained",
            type: "button",
            children: "These two are different companies, create new",
            disabled: createCompanyMutation.isLoading,
            loading: createCompanyMutation.isLoading,
            onClick: () =>
              createCompanyMutation.mutate({ name: createValues?.companyId }),
          },
        ],
      }),
      [createCompanyMutation, createValues, maybeBestMatchMsg]
    )
  );

  const onSubmit = async (values, e) => {
    if (typeof values.companyId === "string") {
      setCreateValues(values);
    } else {
      mutation.mutateAsync(values);
    }
  };
  const onError = (errors, e) => console.log("[modal.onError]", errors, e);

  console.log("[MemberAdminModal.rndr]", {
    initialValues,
    defaultValues,
    coachesQuery,
  });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "500px" },
          bgcolor: "background.paper",
          borderRadius: "6px",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <FormProvider {...methods}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Avatar sx={{ bgcolor: "#F9FAFB", width: 48, height: 48 }}>
              <Avatar sx={{ bgcolor: "#EAECF0", width: 36, height: 36 }}>
                <Icon name="GroupAdd" sx={{ color: gray500 }} />
              </Avatar>
            </Avatar>
            <IconButton onClick={onClose}>
              <Icon name="Close" sx={{ color: gray500 }} />
            </IconButton>
          </Box>
          <H2 id="add-member-modal-title">
            {msg(
              isEdit
                ? "settings.admin.member.modal.title.edit"
                : "settings.admin.member.modal.title"
            )}
          </H2>
          <P id="add-member-modal-description">
            {msg(
              isEdit
                ? "settings.admin.member.modal.desc.edit"
                : "settings.admin.member.modal.desc"
            )}
          </P>
          <RHFTextField
            name="firstName"
            label={msg("settings.admin.member.modal.fields.firstName")}
            rules={{ required: true, minLength: 2 }}
            autoFocus
            fullWidth
          />
          <RHFTextField
            name="lastName"
            label={msg("settings.admin.member.modal.fields.lastName")}
            rules={{ required: true, minLength: 2 }}
            fullWidth
          />
          <RHFTextField
            name="username"
            label={msg("settings.admin.member.modal.fields.username")}
            rules={{ required: true, minLength: 2 }}
            fullWidth
            disabled={isEdit}
          />
          <PreventSubmission>
            <FreeSoloField
              name="companyId"
              label={msg("settings.admin.member.modal.fields.companyId")}
              fullWidth
              {...getLoadableOptions({
                query: companiesQuery,
                map: useCompaniesQuery.toOpts,
              })}
            />
          </PreventSubmission>
          <AutocompleteSelect
            multiple
            disableCloseOnSelect
            name="authorities"
            label={msg("settings.admin.member.modal.fields.authorities")}
            options={Object.values(Authority).map((value) => ({
              value,
              label: value,
            }))}
          />
          {isEdit ? (
            <AutocompleteSelect
              name="coach"
              label={msg("settings.admin.member.modal.fields.coach")}
              {...getLoadableOptions({
                query: coachesQuery,
                map: pipe(
                  prop("content"),
                  map((coach) => ({
                    value: coach.username,
                    label: `${formatName(coach)} (${coach.username})`,
                  }))
                ),
              })}
            />
          ) : null}
          {isEdit ? (
            <RHFTextField
              name="credit"
              label={msg("settings.admin.member.modal.fields.credit")}
              rules={{}}
              fullWidth
            />
          ) : null}
          <AutocompleteSelect
            name="status"
            label={msg("settings.admin.member.modal.fields.status")}
            rules={{ required: true }}
            options={USER_STATUS_OPTIONS}
          />
          <AutocompleteSelect
            disableClearable
            name="locale"
            label={msg("settings.admin.member.modal.fields.locale")}
            options={LANGUAGE_OPTIONS}
            renderOption={renderLanguageOption}
          />
          <AutocompleteSelect
            disableClearable
            name="timeZone"
            label={msg("settings.admin.member.modal.fields.timeZone")}
            options={TIMEZONE_OPTIONS}
          />

          <Divider flexItem sx={{ mt: 3 }} />
          <Box display="flex" flexDirection="row" gap={3}>
            <Button fullWidth variant="outlined" onClick={() => onClose()}>
              {msg("settings.admin.member.cancel")}
            </Button>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={mutation.isLoading}
            >
              {msg(
                isEdit
                  ? "settings.admin.member.submit.edit"
                  : "settings.admin.member.submit.new"
              )}
            </Button>
          </Box>
        </FormProvider>
      </Paper>
    </form>
  );
};

export const MemberAdminModal = (props) => {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="add-member-modal-title"
      aria-describedby="add-member-modal-description"
    >
      <MemberAdminForm {...props} />
    </Modal>
  );
};
