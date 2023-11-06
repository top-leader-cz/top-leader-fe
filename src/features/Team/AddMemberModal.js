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
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AutocompleteSelect,
  CheckboxField,
  LANGUAGE_OPTIONS,
  RHFTextField,
  renderLanguageOption,
} from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { Authority } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { TIMEZONE_OPTIONS } from "../Settings/GeneralSettings";
import { useCreateUserMutation } from "./api";
import { messages } from "./messages";
import { gray500 } from "../../theme";

export const AddMemberModal = ({ onClose, open }) => {
  const msg = useMsg({ dict: messages });
  const addUserMutation = useCreateUserMutation({ onSuccess: onClose });
  const { userTz, language } = useContext(I18nContext);

  const methods = useForm({
    mode: "onSubmit",
    // mode: "all",¯
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      authorities: ["USER"],
      locale: language?.substring(0, 2) ?? "en",
      timeZone: userTz,
      isAuthorized: false,
    },
  });
  const onSubmit = (values, e) => addUserMutation.mutateAsync(values);
  const onError = (errors, e) => console.log("[modal.onError]", errors, e);

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
            <H2 id="add-member-modal-title">
              {msg("team.credit.add-member.modal.title")}
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
            <FormControlLabel
              control={<CheckboxField name="isAuthorized" />}
              label={msg("team.credit.add-member.is-authorized")}
            />

            <Divider flexItem sx={{ mt: 3 }} />
            <Box display="flex" flexDirection="row" gap={3}>
              <Button fullWidth variant="outlined" onClick={() => onClose()}>
                {msg("coaches.contact.button.cancel")}
              </Button>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={addUserMutation.isLoading}
              >
                {msg("team.credit.add-member.submit")}
              </Button>
            </Box>
          </FormProvider>
        </Paper>
      </form>
    </Modal>
  );
};
