import { Box, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { RHFTextField } from "../../../components/Forms";
import { SessionStepCard } from "../SessionStepCard";
import { Controls } from "./Controls";
import { FormStepCard } from "./FormStepCard";

// methods.formState.isValid not set properly
const TextAreaStepTODO = ({ textAreaName, ...props }) => {
  return (
    <FormStepCard {...props}>
      <RHFTextField
        name={textAreaName}
        rules={{ required: true }}
        placeholder={"Type your own " + textAreaName}
        autoFocus
        size="small"
        hiddenLabel
        multiline
        rows={4}
        sx={{ my: 4 }}
        fullWidth
      />
    </FormStepCard>
  );
};

// TODO: -> FormStepCard
export const TextAreaStep = ({
  textAreaName,
  handleNext,
  handleBack,
  data,
  setData,
  ...props
}) => {
  const { register, handleSubmit, watch, formState } = useForm({
    defaultValues: data,
  });
  const componentData = {
    [textAreaName]: watch(textAreaName),
  };
  console.log("[TextAreaStep.rndr]", formState.isValid, {
    componentData,
    data,
  });

  return (
    <SessionStepCard {...props}>
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
          {...register(textAreaName, { required: true })}
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

export const MotivationStep = (props) => (
  <TextAreaStep textAreaName={"motivation"} {...props} />
);

export const GoalStep = (props) => (
  <TextAreaStep textAreaName={"longTermGoal"} {...props} />
);
