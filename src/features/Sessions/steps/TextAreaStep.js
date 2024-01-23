import { Box } from "@mui/material";
import { identity } from "ramda";
import { useForm } from "react-hook-form";
import { RHFTextField } from "../../../components/Forms";
import { notBlank } from "../../../components/Forms/validations";
import { SessionStepCard } from "../SessionStepCard";
import { Controls } from "./Controls";
import { SESSION_FIELDS } from "./constants";
import { useMsg } from "../../../components/Msg/Msg";
import { messages } from "../messages";

// TODO: -> FormStepCard
export const TextAreaStep = ({
  textAreaName,
  textAreaLabel,
  handleNext,
  handleBack,
  data,
  setData,
  step: { fieldDefMap = {}, ...step },
  ...props
}) => {
  const msg = useMsg({ dict: messages });
  const field = fieldDefMap[textAreaName];
  const { control, watch, formState } = useForm({
    mode: "all",
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
        <RHFTextField
          control={control}
          name={textAreaName}
          rules={{
            required: "Required",
            validate: { ...(field.validate ?? { notBlank: notBlank(0) }) },
          }}
          placeholder={msg("sessions.steps.textareastep.placeholder", {
            textAreaName,
          })}
          autoFocus
          size="small"
          hiddenLabel
          multiline
          rows={4}
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
