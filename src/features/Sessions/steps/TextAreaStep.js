import { Box, TextField } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { SessionStepCard } from "../SessionStepCard";
import { Controls } from "./Controls";

export const FormStepCard = ({
  handleNext,
  handleBack,
  data,
  setData,
  fields = [],
  step,
  stepper,
  sx,
  renderControls = ({ formState, ...props }) => (
    <Controls nextProps={{ disabled: !formState.isValid }} {...props} />
  ),
}) => {
  const methods = useForm({
    defaultValues: data, // TODO: pick(keys, data)
  });
  const componentData = Object.fromEntries(
    fields.map(({ name }) => [name, methods.watch(name)])
  );

  console.log("FormStepCard.rndr", { componentData, data });

  return (
    <FormProvider {...methods}>
      <SessionStepCard {...{ step, stepper, sx }}>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          // onSubmit={handleSubmit(submit)}
        >
          {renderControls({
            handleNext,
            handleBack,
            formState: { isValid: methods.formState.isValid },
            data: componentData,
            sx: { mt: 3 },
          })}
        </Box>
      </SessionStepCard>
    </FormProvider>
  );
};

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
  console.log({ componentData, data });

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
  <TextAreaStep textAreaName={"goal"} {...props} />
);
