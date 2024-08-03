import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material";
import { RHFTextField } from "../../../components/Forms";
import { P } from "../../../components/Typography";
import { FocusedList } from "../FocusedList";
import { FormStepCard } from "./FormStepCard";
import { SessionTodosFields } from "./SessionTodos";
import { useReflectionHints } from "./hints";
import { SESSION_FIELDS } from "./constants";
import { useMsg } from "../../../components/Msg/Msg";
import { sessionsMessages } from "../messages";
import { Icon } from "../../../components/Icon";

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
  const msg = useMsg({ dict: sessionsMessages });

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
      <Accordion
        sx={{
          my: 3,
          bgcolor: "#FCFCFD",
          boxShadow: "none",
          borderRadius: "6px",
          "&:before": {
            display: "none",
          },
        }}
      >
        <AccordionSummary
          sx={{ fontSize: 16 }}
          expandIcon={<Icon name="ExpandMore" />}
        >
          {msg("sessions.edit.steps.reflect.reflection-heading")}
        </AccordionSummary>
        <AccordionDetails>
          <P sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
            {lastReflection || motivation}
          </P>
        </AccordionDetails>
      </Accordion>
      <AccordionSummary sx={{ fontSize: 16 }}>
        {msg("sessions.edit.steps.reflect.reflection-questions-heading")}
      </AccordionSummary>
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
