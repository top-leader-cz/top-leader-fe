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
import { RHFTextField } from "../../../components/Forms";
import { Icon } from "../../../components/Icon";
import { gray500 } from "../../../theme";
import { useCompanyMutation } from "./api";

export const USER_STATUS_OPTIONS = [
  { label: "Authorized", value: "AUTHORIZED" },
  { label: "Pending", value: "PENDING" },
];

export const CompanyForm = ({ onClose, initialValues }) => {
  const mutation = useCompanyMutation({ onSuccess: onClose });
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      name: "",
    },
  });

  console.log("[CompanyModal.rndr]", {
    initialValues,
  });

  return (
    <form onSubmit={methods.handleSubmit(mutation.mutateAsync)}>
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
          <RHFTextField
            name="name"
            label={"Name"}
            rules={{ required: true }}
            autoFocus
            fullWidth
          />

          <Divider flexItem sx={{ mt: 3 }} />
          <Box display="flex" flexDirection="row" gap={3}>
            <Button fullWidth variant="outlined" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={mutation.isLoading}
            >
              Save
            </Button>
          </Box>
        </FormProvider>
      </Paper>
    </form>
  );
};

export const CompanyModal = (props) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <CompanyForm {...props} />
    </Modal>
  );
};
