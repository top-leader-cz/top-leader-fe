import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { SessionStepCard } from "../SessionStepCard";
import { Controls } from "./Controls";
import { identity } from "ramda";

export const FormStepCard = ({
  handleNext,
  handleBack,
  data,
  setData,
  step: { fields = [], ...step },
  stepper,
  sx,
  children,
  renderControls = ({ formState, data, componentData, ...props }) => (
    <Controls
      nextProps={{ disabled: !formState.isValid }}
      data={componentData}
      {...props}
    />
  ),
}) => {
  const methods = useForm({
    mode: "all",
    defaultValues: data, // TODO: pick(keys, data) vs values: pick(keys, data)
  });
  const componentData = Object.fromEntries(
    fields.map(({ name, map = identity }) => {
      const value = methods.watch(name);
      try {
        return [name, map(value)];
      } catch (e) {
        return [name, value];
      }
    })
  );

  console.log("[FormStepCard.rndr]", methods.formState.isValid, {
    componentData,
    data,
  });

  return (
    <FormProvider {...methods}>
      <SessionStepCard {...{ step, stepper, sx }}>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          // onSubmit={handleSubmit(submit)}
        >
          {children}
          {renderControls({
            handleNext,
            handleBack,
            formState: { isValid: methods.formState.isValid },
            componentData,
            data,
            // data: { ...data, ...componentData }, // TODO
            sx: { mt: 3 },
          })}
        </Box>
      </SessionStepCard>
    </FormProvider>
  );
};
