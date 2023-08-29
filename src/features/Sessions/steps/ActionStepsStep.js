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
  disabled: disabledProp,
  ...props
}) => {
  const keyName = "actionSteps";
  const { control, watch, formState } = useForm({
    mode: "onBlur",
    defaultValues: {
      [keyName]: data[keyName]?.length ? data[keyName] : DEFAULT_VALUE_ROW,
    },
  });
  const nextData = {
    ...data,
    [keyName]: watch(keyName),
  };

  // TODO: fieldArray errors?
  console.log("[ActionStepsStep.rndr]", {
    nextData,
    errors: {
      "formState.errors": formState.errors,
      [`formState.errors?.[${keyName}]`]: formState.errors?.[keyName],
      "formState.errors?.fieldArray": formState.errors?.fieldArray,
      "formState.errors?.fieldArray?.root": formState.errors?.fieldArray?.root,
      [`formState.errors?.[${keyName}]?.root`]:
        formState.errors?.[keyName]?.root,
    },
    [`nextData.[${keyName}]?.length`]: nextData[keyName]?.length,
    "formState.isValid": formState.isValid,
  });
  // TODO: not working useFieldArray rules validation? must be required?
  const disabled =
    !nextData[keyName]?.length || !formState.isValid || disabledProp;

  return (
    <SessionStepCard {...props}>
      <Box
        component="form"
        noValidate
        // onSubmit={handleSubmit(submit)}
        sx={{ mt: 1 }}
      >
        <ActionSteps
          name={keyName}
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
