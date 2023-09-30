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

export const AddMemberModal = ({ onClose, open }) => {
  const msg = useMsg();
  const addUserMutation = useCreateUserMutation();
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
      isAuthorized: true,
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
                  <Icon name="GroupAdd" sx={{ color: "#667085" }} />
                </Avatar>
              </Avatar>
              <IconButton onClick={onClose}>
                <Icon name="Close" sx={{ color: "#667085" }} />
              </IconButton>
            </Box>
            <H2 id="add-member-modal-title">
              <Msg id="team.credit.add-member.modal.title" />
            </H2>
            <P id="add-member-modal-description">
              <Msg id="team.credit.add-member.modal.desc" />
            </P>
            <RHFTextField
              name="firstName"
              rules={{ required: true, minLength: 2 }}
              label={"Name"}
              placeholder="Name"
              autoFocus
              size="small"
              fullWidth
            />
            <RHFTextField
              name="lastName"
              rules={{ required: true, minLength: 2 }}
              label=""
              placeholder="Surname"
              autoFocus
              size="small"
              fullWidth
            />
            <RHFTextField
              name="username"
              rules={{ required: true, minLength: 2 }}
              label=""
              placeholder="Email"
              autoFocus
              size="small"
              fullWidth
            />

            <AutocompleteSelect
              multiple
              disableCloseOnSelect
              name={"authorities"}
              options={Object.values(Authority).map((value) => ({
                value,
                label: value,
              }))}
              placeholder={"Authorities"}
            />
            <AutocompleteSelect
              disableClearable
              name={"locale"}
              options={LANGUAGE_OPTIONS}
              renderOption={renderLanguageOption}
              placeholder="Select languages"
            />
            <AutocompleteSelect
              disableClearable
              name={"timeZone"}
              options={TIMEZONE_OPTIONS}
              placeholder="Timezone" // TODO: translations? should be always populated
            />
            <FormControlLabel
              control={<CheckboxField name="isAuthorized" />}
              label="isAuthorized"
            />

            <Divider flexItem sx={{ mt: 3 }} />
            <Box display="flex" flexDirection="row" gap={3}>
              <Button fullWidth variant="outlined" onClick={() => onClose()}>
                <Msg id="coaches.contact.button.cancel" />
              </Button>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={addUserMutation.isLoading}
              >
                <Msg id="team.credit.add-member.submit" />
              </Button>
            </Box>
          </FormProvider>
        </Paper>
      </form>
    </Modal>
  );
};
