import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { SessionStepCard } from "../SessionStepCard";
import { Controls } from "./Controls";
import { identity } from "ramda";
import { SESSION_FIELDS } from "./constants";
import { ActionSteps } from "./ActionSteps";

export const DEFAULT_VALUE_ROW = [{ label: "", date: null }];

export const ActionStepsStep = ({
  handleNext,
  handleBack,
  data,
  setData,
  onFinish,
  disabled: disabledProp,
  step: { fieldDefMap, ...step },
  ...props
}) => {
  const keyName = SESSION_FIELDS.ACTION_STEPS;
  const { control, watch, formState } = useForm({
    mode: "onBlur",
    defaultValues: {
      [keyName]: data[keyName]?.length ? data[keyName] : DEFAULT_VALUE_ROW,
    },
  });
  const map = fieldDefMap[keyName]?.map || identity;
  const nextData = {
    ...data,
    [keyName]: map(watch(keyName)),
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
    <SessionStepCard step={step} {...props}>
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
