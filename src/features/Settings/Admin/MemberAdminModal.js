import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  Modal,
  Paper,
  Tooltip,
} from "@mui/material";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AutocompleteSelect,
  CheckboxField,
  RHFTextField,
} from "../../../components/Forms";
import { Icon } from "../../../components/Icon";
import { useMsg } from "../../../components/Msg/Msg";
import { H2, P } from "../../../components/Typography";
import { gray500 } from "../../../theme";
import { Authority } from "../../Authorization/AuthProvider";
import { I18nContext } from "../../I18n/I18nProvider";
import { TIMEZONE_OPTIONS } from "../../Settings/GeneralSettings";
import { useAdminCreateUserMutation, useAdminEditUserMutation } from "./api";

const STATUS_OPTIONS = [
  { label: "Authorized", value: "AUTHORIZED" },
  { label: "Pending", value: "PENDING" },
];

export const MemberAdminForm = ({ onClose, initialValues }) => {
  const { userTz, language } = useContext(I18nContext);
  const msg = useMsg();

  const isEdit = !!initialValues && !!Object.values(initialValues).length;
  const editUserMutation = useAdminEditUserMutation({ onSuccess: onClose });
  const addUserMutation = useAdminCreateUserMutation({ onSuccess: onClose });
  const mutation = isEdit ? editUserMutation : addUserMutation;

  const defaultValues = {
    firstName: initialValues.firstName || "",
    lastName: initialValues.lastName || "",
    username: initialValues.username || "",

    companyId: initialValues.companyId || null,
    isTrial: initialValues.isTrial ?? false,

    authorities: initialValues.authorities?.length
      ? initialValues.authorities
      : ["USER"],
    timeZone: initialValues.timeZone || userTz,

    // Edit
    status: initialValues.status,
    coach: initialValues.coach,
    credit: initialValues.credit,

    // locale: language?.substring(0, 2) ?? "en",
  };
  const methods = useForm({
    mode: "onSubmit",
    // mode: "all",¯
    defaultValues,
  });

  const onSubmit = (values, e) => mutation.mutateAsync(values);
  const onError = (errors, e) => console.log("[modal.onError]", errors, e);

  console.log("[MemberAdminModal.rndr]", { initialValues, defaultValues });

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
          // border: "2px solid #000",
          // boxShadow: 24,
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
            rules={{ required: true, minLength: 2 }}
            label={"Name"}
            autoFocus
            size="small"
            fullWidth
          />
          <RHFTextField
            name="lastName"
            rules={{ required: true, minLength: 2 }}
            label={"Surname"}
            autoFocus
            size="small"
            fullWidth
          />
          <RHFTextField
            name="username"
            rules={{ required: true, minLength: 2 }}
            label={"Email"}
            autoFocus
            size="small"
            fullWidth
            disabled={isEdit}
          />

          <Tooltip
            title={"TODO: where to get list of companies?"}
            placement="top"
          >
            <div>
              <RHFTextField
                disabled
                name="companyId"
                label={"Company"}
                autoFocus
                size="small"
                fullWidth
              />
            </div>
          </Tooltip>

          <AutocompleteSelect
            multiple
            disableCloseOnSelect
            name={"authorities"}
            options={Object.values(Authority).map((value) => ({
              value,
              label: value,
            }))}
            label={"Roles"}
          />
          {isEdit ? (
            <AutocompleteSelect
              disabled
              name={"coach"}
              options={[]} // TODO
              label={"Current coach"}
            />
          ) : null}
          {isEdit ? (
            <AutocompleteSelect
              // disabled
              name={"status"}
              options={STATUS_OPTIONS}
              label={"Status"}
            />
          ) : null}
          {/* <AutocompleteSelect
            disableClearable
            name={"locale"}
            options={LANGUAGE_OPTIONS}
            renderOption={renderLanguageOption}
            label={"Select languages"}
          /> */}
          <AutocompleteSelect
            disableClearable
            name={"timeZone"}
            options={TIMEZONE_OPTIONS}
            label={"Timezone"}
          />
          <FormControlLabel
            control={<CheckboxField name="isTrial" />}
            label={msg("settings.admin.member.trial")}
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
