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
import { QueryRenderer } from "../QM/QueryRenderer";
import { useAddClientMutation } from "./api";
import { clientsMessages as messages } from "./messages";
import { useContext } from "react";
import { I18nContext } from "../I18n/I18nProvider";
import { toApiLocale } from "../Team/api";

export const AddClientModal = ({ onClose: onCloseProp, open }) => {
  const msg = useMsg({ dict: messages });
  const { language } = useContext(I18nContext);
  const form = useForm({
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      locale: language,
      isTrial: false,
      //   company?
    },
  });
  const onClose = () => {
    form.reset();
    addClientMutation.reset();
    onCloseProp();
  };
  const addClientMutation = useAddClientMutation({ onSuccess: onClose });
  //   const { userTz, language } = useContext(I18nContext);
  const onSubmit = ({ locale, ...values }, e) =>
    addClientMutation.mutateAsync({
      locale: toApiLocale(locale),
      ...values,
    });
  const onError = (errors, e) => console.log("[modal.onError]", errors, e);

  console.log("[AddClientModal.rndr]", { ...addClientMutation });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-member-modal-title"
      aria-describedby="add-member-modal-description"
    >
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
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
          <FormProvider {...form}>
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
            <QueryRenderer
              query={addClientMutation}
              success={null}
              loading={null}
            />
            <H2 id="add-member-modal-title">
              {msg("clients.add-client.modal.title")}
            </H2>
            <P id="add-member-modal-description">
              {msg("clients.add-client.modal.desc")}
            </P>
            <RHFTextField
              name="firstName"
              rules={{ required: true, minLength: 2 }}
              label={msg("clients.add-client.fields.firstName")}
              autoFocus
              size="small"
              fullWidth
            />
            <RHFTextField
              name="lastName"
              rules={{ required: true, minLength: 2 }}
              label={msg("clients.add-client.fields.lastName")}
              autoFocus
              size="small"
              fullWidth
            />
            <RHFTextField
              name="email"
              rules={{ required: true, minLength: 2 }}
              label={msg("clients.add-client.fields.email")}
              autoFocus
              size="small"
              fullWidth
            />
            <AutocompleteSelect
              disableClearable
              name="locale"
              rules={{ required: true }}
              label={msg("clients.add-client.fields.locale")}
              options={LANGUAGE_OPTIONS}
              renderOption={renderLanguageOption}
            />
            <FormControlLabel
              control={<CheckboxField name="isTrial" />}
              label={msg("clients.add-client.fields.isTrial")}
            />

            <Divider flexItem sx={{ mt: 3 }} />
            <Box display="flex" flexDirection="row" gap={3}>
              <Button fullWidth variant="outlined" onClick={() => onClose()}>
                {msg("clients.add-client.cancel")}
              </Button>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={addClientMutation.isLoading}
              >
                {msg("clients.add-client.submit")}
              </Button>
            </Box>
          </FormProvider>
        </Paper>
      </form>
    </Modal>
  );
};
