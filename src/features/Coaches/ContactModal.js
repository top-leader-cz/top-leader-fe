import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";

// TODO: Form reset after close/submit
export const ContactModal = ({ onClose, coach, open = !!coach }) => {
  const msg = useMsg();
  const { id, name, role, experience, languages, description, fields, imgSrc } =
    coach ?? {};

  const methods = useForm({
    mode: "onSubmit",
    // mode: "all",¯
    defaultValues: {},
  });
  const onSubmit = (data, e) => console.log("[ContactModal.onSubmit]", data, e);
  const onError = (errors, e) =>
    console.log("[ContactModal.onError]", errors, e);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "800px" },
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
                  <Icon name="Mail" sx={{ color: "#667085" }} />
                </Avatar>
              </Avatar>
              <IconButton onClick={onClose}>
                <Icon name="Close" sx={{ color: "#667085" }} />
              </IconButton>
            </Box>
            <H2 id="modal-modal-title">
              <Msg id="coaches.contact.title" values={{ name }} />
            </H2>
            <P id="modal-modal-description">
              <Msg id="coaches.contact.perex" />
            </P>
            {/* <OutlinedField label="Subject" /> */}
            <Input
              name="subject"
              rules={{ required: true, minLength: 3 }}
              label={msg("coaches.contact.subject.label")}
              // placeholder={"Type your message"}
              autoFocus
              size="small"
              fullWidth
            />
            <Divider flexItem />
            <Input
              name="message"
              rules={{ required: true }}
              label={msg("coaches.contact.message.label")}
              placeholder={msg("coaches.contact.message.placeholder")}
              size="small"
              hiddenLabel
              multiline
              rows={5}
              sx={{}}
              fullWidth
            />
            <Divider flexItem />
            <Box display="flex" flexDirection="row" gap={3}>
              <Button fullWidth variant="outlined" onClick={() => onClose()}>
                <Msg id="coaches.contact.button.cancel" />
              </Button>
              <Button fullWidth variant="contained" type="submit">
                <Msg id="coaches.contact.button.send" />
              </Button>
            </Box>
          </FormProvider>
        </Paper>
      </form>
    </Modal>
  );
};
