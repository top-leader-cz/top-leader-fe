import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
  Snackbar,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { RHFTextField } from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { useSendMessageMutation } from "../Messages/api";
import { formatName } from "./Coaches.page";
import React, { useCallback, useState } from "react";
import { useSnackbar } from "../Modal/ConfirmModal";
import { messages } from "./messages";

// {
//     "username": "coach1@gmail.com",
//     "firstName": "Milan",
//     "lastName": "Vlcek",
//     "email": "vlcekmilan17@gmail.com",
//     "bio": "Coach 1, saepe aspernatur enim velit libero voluptas aut optio nihil est. Ipsum porro aut quod sunt saepe error est consequatur. Aperiam hic consequuntur qui aut omnis atque voluptatum sequi deleniti. ",
//     "languages": [ "cs", "en" ],
//     "fields": [ "entrepreneurship" ],
//     "experience": 2,
//     "rate": "100"
// }

const ContactForm = React.forwardRef(({ onClose, coach }, ref) => {
  const msg = useMsg();
  const {
    username,
    firstName,
    lastName,
    email,
    bio,
    languages,
    fields,
    experience,
    rate,
  } = coach ?? {};
  const methods = useForm({
    mode: "onSubmit",
    // mode: "all",¯
    defaultValues: DEFAULT_VALUES,
  });
  const { reset } = methods;
  const sendMutation = useSendMessageMutation({
    snackbar: {
      success: { message: msg("coaches.contact.success") },
      error: {},
    },
    onSuccess: useCallback(() => {
      reset(DEFAULT_VALUES);
      onClose();
    }, [onClose, reset]),
  });
  const onSubmit = (data, e) => {
    const { subject, message } = data;
    console.log("[ContactModal.onSubmit]", { data, e, coach });
    return sendMutation.mutateAsync({
      userTo: username,
      messageData: subject?.trim() ? `[${subject}] ${message}` : message,
    });
  };
  const onError = (errors, e) =>
    console.log("[ContactModal.onError]", errors, e);

  return (
    <form onSubmit={methods.handleSubmit(onSubmit, onError)} ref={ref}>
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
            <Msg
              id="coaches.contact.title"
              values={{ name: formatName({ firstName, lastName }) }}
            />
          </H2>
          <P id="modal-modal-description">
            <Msg id="coaches.contact.perex" />
          </P>
          {/* <OutlinedField label="Subject" /> */}
          <RHFTextField
            name="subject"
            label={msg("coaches.contact.subject.label")}
            autoFocus
            size="small"
            fullWidth
          />
          <Divider flexItem />
          <RHFTextField
            name="message"
            rules={{ required: true, minLength: 3 }}
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
  );
});

const DEFAULT_VALUES = {
  subject: "",
  message: "",
};

// TODO: Form reset after close/submit
export const ContactModal = ({ onClose, coach, open = !!coach }) => {
  const msg = useMsg({ dict: messages });

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ContactForm coach={coach} onClose={onClose} />
      </Modal>
    </>
  );
};
