import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { ActionSteps } from "../../../components/Forms";
import { SessionStepCard } from "../SessionStepCard";
import { Controls } from "./Controls";

export const DEFAULT_VALUE_ROW = [{ label: "", date: null }];

export const ActionStepsStep = ({
  handleNext,
  handleBack,
  data,
  setData,
  onFinish,
  ...props
}) => {
  const { control, watch, formState } = useForm({
    mode: "onBlur",
    defaultValues: {
      steps: data.steps?.length ? data.steps : DEFAULT_VALUE_ROW,
    },
  });
  const nextData = {
    ...data,
    steps: watch("steps"),
  };

  // TODO: fieldArray errors?
  console.log("[ActionStepsStep.rndr]", {
    nextData,
    errors: {
      "formState.errors": formState.errors,
      "formState.errors?.steps": formState.errors?.steps,
      "formState.errors?.fieldArray": formState.errors?.fieldArray,
      "formState.errors?.fieldArray?.root": formState.errors?.fieldArray?.root,
      "formState.errors?.steps?.root": formState.errors?.steps?.root,
    },
    "nextData.steps?.length": nextData.steps?.length,
    "formState.isValid": formState.isValid,
  });
  // TODO: not working useFieldArray rules validation? must be required?
  const disabled = !nextData.steps?.length || !formState.isValid;

  return (
    <SessionStepCard {...props}>
      <Box
        component="form"
        noValidate
        // onSubmit={handleSubmit(submit)}
        sx={{ mt: 1 }}
      >
        <ActionSteps
          name="steps"
          control={control}
          rules={{ required: true, minLength: 1 }}
          sx={{ my: 5 }}
        />
        <Controls
          handleNext={onFinish}
          nextProps={{ disabled, children: "Done", endIcon: undefined }}
          handleBack={handleBack}
          data={nextData}
          sx={{ mt: 3 }}
        />
      </Box>
    </SessionStepCard>
  );
};
