import { Add, Delete } from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import { Box, Button, IconButton } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "../../../components/Forms";
import { P } from "../../../components/Typography";
import { SessionStepCard } from "../SessionStepCard";
import { Controls } from "./Controls";

export const ActionSteps = ({ name, rules, control, sx = {} }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    rules,
  });

  return (
    // <Box component={"ol"}>
    <Box sx={{ ...sx }}>
      {fields.map((field, i) => (
        <Box
          key={field.id}
          // component={"li"}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ width: 16, mx: 1 }}>{i + 1}.</Box>
          <Input
            control={control}
            name={`${name}.${i}.label`}
            placeholder={"Label"}
            rules={{ required: true }}
            size="small"
            autoFocus
            sx={{ mx: 1, minWidth: { lg: 320 } }}
          />
          <P sx={{ ml: 4, mr: 2 }}>Due date</P>
          <DatePicker
            control={control}
            name={`${name}.${i}.date`}
            size="small"
            inputFormat="MM/dd/yyyy"
          />
          {i > 0 && (
            <IconButton
              onClick={() => remove(i)}
              sx={{
                mx: 2,
              }}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
      ))}
      <Button
        onClick={() =>
          append({
            label: "",
            date: null,
          })
        }
        startIcon={<Add />}
      >
        Add action
      </Button>
    </Box>
  );
};

export const ActionStepsStep = ({
  handleNext,
  handleBack,
  data,
  setData,
  onFinish,
  ...props
}) => {
  const { control, watch, formState } = useForm({
    defaultValues: {
      steps: data.steps?.length ? data.steps : [{ label: "", date: null }],
    },
  });
  const nextData = {
    ...data,
    steps: watch("steps"),
  };

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
