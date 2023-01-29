import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { useCallback } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { AutocompleteSelect, Input } from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { H2, P } from "../../components/Typography";

const FIELD_FIELDS = {
  email: "email",
  role: "role",
};

const FIELD_DEFAULT_VALUES = {
  email: "Catalina_Bartoletti29@hotmail.com",
  role: null,
};

const ROLE_OPTIONS = [{ value: "manager", label: "Manager" }];

const EmailListItem = ({ index, remove, getName }) => {
  return (
    <Box display="flex" alignItems="center" gap={3}>
      <Input
        name={getName(FIELD_FIELDS.email)}
        placeholder="Email"
        rules={{}}
        size="small"
        sx={{ width: "50%" }}
      />
      <AutocompleteSelect
        name={getName(FIELD_FIELDS.role)}
        placeholder="Role"
        options={ROLE_OPTIONS}
        sx={{ width: "50%" }}
      />

      <IconButton
        onClick={() => remove(index)}
        sx={{
          // mx: 2,
          width: "40px",
          visibility: index > 0 ? "visible" : "hidden",
          color: "error.main",
        }}
      >
        <Icon name="DeleteOutlined" />
      </IconButton>
    </Box>
  );
};

const EmailList = ({ name }) => {
  const { fields, append, remove } = useFieldArray({
    name,
    rules: { required: true },
  });
  console.log({ fields });

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {fields.map((field, i) => (
        <EmailListItem
          key={field.id}
          index={i}
          remove={remove}
          getName={(fieldName) => `${name}.${i}.${fieldName}`}
          sx={{ mt: 3 }}
        />
      ))}
      <Button
        onClick={() => append(FIELD_DEFAULT_VALUES)}
        startIcon={<Icon name={"Add"} />}
        sx={{ alignSelf: "flex-start" }}
      >
        Add email
      </Button>
    </Box>
  );
};

// TODO: Form reset?
export const ShareFeedbackModal = ({
  open,
  onSubmit,
  onClose,
  link = "http://topleader.io/",
}) => {
  const form = useForm({
    mode: "onSubmit",
    // mode: "all",¯
    defaultValues: { emailList: [FIELD_DEFAULT_VALUES] },
  });

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(link).then(
      () => {
        console.log("Copy success", { link });
      },
      () => {
        console.log("Copy error", { link });
      }
    );
  }, [link]);

  return (
    <FormProvider {...form}>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
            <FormProvider {...form}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Avatar sx={{ bgcolor: "#F9FAFB", width: 48, height: 48 }}>
                  <Avatar sx={{ bgcolor: "#EAECF0", width: 36, height: 36 }}>
                    <Icon name="PersonAdd" sx={{ color: "#667085" }} />
                  </Avatar>
                </Avatar>
                <IconButton onClick={onClose}>
                  <Icon name="Close" sx={{ color: "#667085" }} />
                </IconButton>
              </Box>
              <H2 id="modal-modal-title">Share feedback form</H2>
              <P id="modal-modal-description">
                Et et officia laborum magnam sint perspiciatis alias. Ab
                similique sed. Nisi provident ipsa. Rerum ea nulla odit quis et.
              </P>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={3}
              >
                <TextField
                  name="link"
                  value={link}
                  label=""
                  disabled
                  size="small"
                  sx={{ width: "50%" }}
                  //   fullWidth
                />
                <IconButton onClick={onCopy} sx={{}}>
                  <Icon name="ContentCopy" />
                </IconButton>
              </Box>
              <Divider flexItem />
              <EmailList name={"emailList"} />
              <Divider flexItem />
              <Box display="flex" flexDirection="row" gap={3}>
                <Button fullWidth variant="outlined" onClick={() => onClose()}>
                  Cancel
                </Button>
                <Button fullWidth variant="contained" type="submit">
                  Share
                </Button>
              </Box>
            </FormProvider>
          </Paper>
        </form>
      </Modal>
    </FormProvider>
  );
};
