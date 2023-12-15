import { Box } from "@mui/material";
import { RHFTextField } from "../../../components/Forms";
import { P } from "../../../components/Typography";
import { FocusedList } from "../FocusedList";
import { FormStepCard } from "./FormStepCard";
import { SessionTodosFields } from "./SessionTodos";
import { useReflectionHints } from "./hints";
import { SESSION_FIELDS } from "./constants";

const userInputSx = { my: 3, p: 3, bgcolor: "#FCFCFD" };

export const ReflectStep = ({
  step,
  stepper,
  data,
  setData,
  handleNext,
  handleBack,
  motivation = "",
  lastReflection = "",
  previousActionSteps = [],
}) => {
  const reflectionField = step.fieldDefMap[SESSION_FIELDS.REFLECTION];
  const hints = useReflectionHints();
  console.log("[ReflectStep.rndr]", { previousActionSteps });

  return (
    <FormStepCard
      {...{
        step,
        stepper,
        data: {
          ...data,
          previousActionSteps: previousActionSteps.filter(
            ({ checked }) => !checked
          ),
        },
        setData,
        handleNext,
        handleBack,
      }}
    >
      <SessionTodosFields name={SESSION_FIELDS.PREV_ACTION_STEPS} />
      <Box sx={{ ...userInputSx }}>
        <P sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
          {lastReflection || motivation}
        </P>
      </Box>
      <FocusedList items={hints} />
      <RHFTextField
        name={SESSION_FIELDS.REFLECTION}
        rules={{
          required: "Required",
          validate: { ...(reflectionField.validate ?? {}) },
        }}
        placeholder={"Type your own reflection"}
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
