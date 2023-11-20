import { Box, TextField } from "@mui/material";
import { identity } from "ramda";
import { useForm } from "react-hook-form";
import { notBlank } from "../EditSession.page";
import { SessionStepCard } from "../SessionStepCard";
import { Controls } from "./Controls";
import { SESSION_FIELDS } from "./constants";

// TODO: -> FormStepCard
export const TextAreaStep = ({
  textAreaName,
  handleNext,
  handleBack,
  data,
  setData,
  step: { fieldDefMap = {}, ...step },
  ...props
}) => {
  const field = fieldDefMap[textAreaName];
  const { register, handleSubmit, watch, formState } = useForm({
    defaultValues: data,
  });
  const map = field?.map || identity;
  const componentData = {
    [textAreaName]: map(watch(textAreaName)),
  };
  console.log("[TextAreaStep.rndr]", formState.isValid, {
    componentData,
    data,
  });

  return (
    <SessionStepCard step={step} {...props}>
      <Box
        component="form"
        noValidate
        // onSubmit={handleSubmit(submit)}
        sx={{ mt: 1 }}
      >
        <TextField
          placeholder={"Type your own " + textAreaName}
          autoFocus
          size="small"
          hiddenLabel
          multiline
          rows={4}
          {...register(textAreaName, {
            required: "Required",
            validate: {
              notBlank: notBlank(0),
              ...field?.validate,
            },
          })}
          sx={{ my: 4 }}
          fullWidth
        />
        <Controls
          handleNext={handleNext}
          nextProps={{ disabled: !formState.isValid }}
          handleBack={handleBack}
          data={componentData}
          sx={{ mt: 3 }}
        />
      </Box>
    </SessionStepCard>
  );
};

export const GoalStep = (props) => (
  <TextAreaStep textAreaName={SESSION_FIELDS.LONG_TERM_GOAL} {...props} />
);

export const MotivationStep = (props) => (
  <TextAreaStep textAreaName={SESSION_FIELDS.MOTIVATION} {...props} />
);
