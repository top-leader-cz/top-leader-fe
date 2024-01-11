import { Box } from "@mui/material";
import { RHFTextField } from "../../../components/Forms";
import { P } from "../../../components/Typography";
import { FocusedList } from "../FocusedList";
import { FormStepCard } from "./FormStepCard";
import { SessionTodosFields } from "./SessionTodos";
import { useReflectionHints } from "./hints";
import { SESSION_FIELDS } from "./constants";
import { useMsg } from "../../../components/Msg/Msg";
import { messages } from "../messages";

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
  const msg = useMsg({ dict: messages });

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
        placeholder={msg("sessions.edit.steps.reflect.reflection.placeholder")}
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
