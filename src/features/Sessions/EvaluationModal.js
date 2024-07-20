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
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Icon } from "../../components/Icon";
import { useMsg } from "../../components/Msg/Msg";
import { H2 } from "../../components/Typography";
import { gray500 } from "../../theme";
import { useMyMutation } from "../Authorization/AuthProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { messages } from "./messages";
import { RadioRatingField } from "../../components/Forms";

const HIDDEN_FIELD = { sx: { display: "none" } };

const useEvaluationMutation = ({ onSuccess }) => {
  return useMyMutation({
    fetchDef: {
      url: `/api/latest/evaluation`,
      method: "POST",
    },
    onSuccess,
  });
};

const QUESTIONS = [
  {
    label: "How satisfied were you with the session?",
    minLabel: "Not satisfied",
    maxLabel: "Extremely satisfied",
  },
];

const Rating = ({ label, name, minLabel, maxLabel }) => {
  return (
    <FormControlLabel
      //   control={<CheckboxField name={name} />}
      control={
        <RadioRatingField
          name={name}
          options={Array(10)
            .fill(null)
            .map((_, i) => ({ label: i + 1, value: i + 1 }))}
        />
      }
      label={label}
    />
  );
};

export const EvaluationModal = ({ onClose, open }) => {
  const msg = useMsg({ dict: messages });

  const mutation = useEvaluationMutation({ onSuccess: onClose });
  const methods = useForm({
    mode: "onSubmit",
    // values: query.data,
  });
  const name = "questions";
  //   const { fields, append, remove } = useFieldArray({
  //     name,
  //     rules: { required: true, minLength: 1 },
  //   });

  const onSubmit = (values, e) => mutation.mutateAsync(values);
  const onError = (errors, e) => console.log("[modal.onError]", errors, e);

  console.log("[EvaluationModal.rndr]", {
    mutation,
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="evaluation-modal-title"
      aria-describedby="evaluation-modal-description"
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
            maxHeight: "100%",
            overflow: "auto",
            // border: "2px solid #000",
            // boxShadow: 24,
          }}
        >
          <FormProvider {...methods}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Avatar sx={{ bgcolor: "#F9FAFB", width: 48, height: 48 }}>
                <Avatar sx={{ bgcolor: "#EAECF0", width: 36, height: 36 }}>
                  <Icon
                    name="ChatBubbleOutlineOutlined"
                    sx={{ color: gray500 }}
                  />
                </Avatar>
              </Avatar>
              <IconButton onClick={onClose}>
                <Icon name="Close" sx={{ color: gray500 }} />
              </IconButton>
            </Box>
            <QueryRenderer query={mutation} success={null} loading={null} />
            <H2 id="evaluation-modal-title">{msg("evaluation.modal.title")}</H2>

            {QUESTIONS.map((question, index) => (
              <Rating
                label={question.label}
                minLabel={question.minLabel}
                maxLabel={question.maxLabel}
                name={`${name}.${index}`}
              />
            ))}

            <Divider flexItem sx={{ mt: 3 }} />
            <Box display="flex" flexDirection="row" gap={3}>
              <Button fullWidth variant="outlined" onClick={() => onClose()}>
                {msg("evaluation.modal.skip")}
              </Button>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={mutation.isLoading}
              >
                {msg("evaluation.modal.share")}
              </Button>
            </Box>
          </FormProvider>
        </Paper>
      </form>
    </Modal>
  );
};
