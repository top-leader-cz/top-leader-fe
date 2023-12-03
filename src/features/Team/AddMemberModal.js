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
import { useCallback, useContext, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AutocompleteSelect,
  CheckboxField,
  LANGUAGE_OPTIONS,
  RHFTextField,
  renderLanguageOption,
} from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { gray500 } from "../../theme";
import { Authority } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { TIMEZONE_OPTIONS } from "../Settings/GeneralSettings";
import { useUserMutation } from "./api";
import { messages } from "./messages";

const HIDDEN_FIELD = { sx: { display: "none" } };

const obj = {};

export const AddMemberModal = ({ onClose, open, initialValues = obj }) => {
  const isEdit = !!initialValues?.username;

  const msg = useMsg({ dict: messages });
  const { userTz, language } = useContext(I18nContext);

  const mutation = useUserMutation({ isEdit, onSuccess: onClose });
  const { reset } = mutation;
  const resetMutation = useCallback(() => {
    reset();
  }, [reset]);

  const defaultValues = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      username: "",
      authorities: ["USER"],
      locale: language,
      timeZone: userTz,
      trialUser: false,
    }),
    [language, userTz]
  );

  const methods = useForm({
    mode: "onSubmit",
    defaultValues,
  });
  const { reset: resetForm } = methods;
  useEffect(() => {
    if (!open) {
      resetMutation();
      resetForm(defaultValues);
    } else if (isEdit) {
      console.log("[AddMemberModal reset]", { initialValues, defaultValues });
      resetForm({ ...defaultValues, ...initialValues });
    }
  }, [defaultValues, initialValues, isEdit, open, resetForm, resetMutation]);
  const onSubmit = (values, e) => mutation.mutateAsync(values);
  const onError = (errors, e) => console.log("[modal.onError]", errors, e);

  console.log("[AddMemberModal.rndr]", isEdit, {
    initialValues,
    defaultValues,
    mutation,
    isEdit,
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-member-modal-title"
      aria-describedby="add-member-modal-description"
    >
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
            <QueryRenderer query={mutation} success={null} loading={null} />
            <H2 id="add-member-modal-title">
              {msg(
                isEdit
                  ? "team.credit.edit-member.modal.title"
                  : "team.credit.add-member.modal.title"
              )}
            </H2>
            <P id="add-member-modal-description">
              {msg("team.credit.add-member.modal.desc")}
            </P>
            <RHFTextField
              name="firstName"
              rules={{ required: true, minLength: 2 }}
              label={msg("team.credit.add-member.fields.firstName")}
              autoFocus
              size="small"
              fullWidth
            />
            <RHFTextField
              name="lastName"
              rules={{ required: true, minLength: 2 }}
              label={msg("team.credit.add-member.fields.lastName")}
              autoFocus
              size="small"
              fullWidth
            />
            <RHFTextField
              disabled={isEdit}
              name="username"
              rules={{ required: true, minLength: 2 }}
              label={msg("team.credit.add-member.fields.username")}
              autoFocus
              size="small"
              fullWidth
            />

            <AutocompleteSelect
              multiple
              disableCloseOnSelect
              name="authorities"
              options={Object.values(Authority).map((value) => ({
                value,
                label: value,
              }))}
              label={msg("team.credit.add-member.fields.authorities")}
              {...HIDDEN_FIELD}
            />
            <AutocompleteSelect
              disableClearable
              name="locale"
              options={LANGUAGE_OPTIONS}
              renderOption={renderLanguageOption}
              label={msg("team.credit.add-member.fields.locale")}
            />
            <AutocompleteSelect
              disableClearable
              name="timeZone"
              options={TIMEZONE_OPTIONS}
              label={msg("team.credit.add-member.fields.timeZone")}
              // TODO: translations? should be always populated
            />
            {!isEdit ? (
              <FormControlLabel
                control={<CheckboxField name="trialUser" />}
                label={msg("team.credit.add-member.fields.trial-user")}
              />
            ) : null}

            <Divider flexItem sx={{ mt: 3 }} />
            <Box display="flex" flexDirection="row" gap={3}>
              <Button fullWidth variant="outlined" onClick={() => onClose()}>
                {msg("coaches.contact.button.cancel")}
              </Button>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={mutation.isLoading}
              >
                {msg(
                  isEdit
                    ? "team.credit.edit-member.submit"
                    : "team.credit.add-member.submit"
                )}
              </Button>
            </Box>
          </FormProvider>
        </Paper>
      </form>
    </Modal>
  );
};
