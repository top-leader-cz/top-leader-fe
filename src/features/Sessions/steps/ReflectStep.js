import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
} from "@mui/material";
import {
  AutocompleteSelect,
  FreeSoloField,
  RHFTextField,
} from "../../../components/Forms";
import { P } from "../../../components/Typography";
import { FocusedList } from "../FocusedList";
import { FormStepCard } from "./FormStepCard";
import { SessionTodosFields } from "./SessionTodos";
import { useReflectionHints } from "./hints";
import { SESSION_FIELDS } from "./constants";
import { useMsg } from "../../../components/Msg/Msg";
import { messages } from "../messages";
import { Icon } from "../../../components/Icon";
import { useEffect, useMemo, useRef } from "react";
import { messages as fMessages } from "../../Feedback/messages";
import { useFieldArray } from "react-hook-form";
import { notBlank } from "../../../components/Forms/validations";

const REF_DEFAULT_VALUES = {
  [SESSION_FIELDS.REFLECTION_QUESTION]: "",
  [SESSION_FIELDS.REFLECTION_ANSWER]: "",
};

const ReflectionQuestion = ({ name, ...props }) => {
  const hints = useReflectionHints();
  const questionOptions = useMemo(() => {
    return hints.map((translated) => ({
      value: translated,
      label: translated,
    }));
  }, [hints]);

  const { fields, append, remove } = useFieldArray({
    name,
    rules: { required: true, minLength: 1 },
  });
  const appendedRef = useRef(false);
  useEffect(() => {
    if (!fields.length && !appendedRef.current) {
      appendedRef.current = true; // dev strict mode runs twice, TODO: refactor
      append(REF_DEFAULT_VALUES);
    }
  }, [append, fields.length]);
  const msg = useMsg({ dict: messages });
  const fMsg = useMsg({ dict: fMessages });

  return (
    <>
      {fields.map((field, i) => (
        <Box
          key={field.id}
          sx={{ display: "flex", flexDirection: "row", gap: 3, px: 2 }}
        >
          {/* <FreeSoloField name={titleName} rules={{ required: "Required" }} sx={{ maxWidth: "50%", flex: "0 1 auto" }} {...optionsProps} /> */}
          <AutocompleteSelect
            name={`${name}.${i}.${SESSION_FIELDS.REFLECTION_QUESTION}`}
            options={questionOptions}
            rules={{
              required: "Required",
              // validate: { ...(reflectionField.validate ?? {}) },
            }}
            autoFocus
            size="small"
            hiddenLabel
            multiline
            rows={4}
            sx={{ my: 4 }}
            fullWidth
            // sx={{ maxWidth: "50%", flex: "0 1 180px" }}
          />
          <RHFTextField
            name={`${name}.${i}.${SESSION_FIELDS.REFLECTION_ANSWER}`}
            rules={{
              required: "Required",
              validate: { notBlank: notBlank(0) },
            }}
            placeholder={msg(
              "sessions.edit.steps.reflect.reflection.placeholder"
            )}
            // autoFocus
            size="small"
            hiddenLabel
            sx={{ my: 4 }}
            fullWidth
          />
        </Box>
      ))}
      <Button
        onClick={() => append(REF_DEFAULT_VALUES)}
        startIcon={<Icon name={"Add"} />}
        sx={{ my: 3 }}
      >
        {fMsg("feedback.create.add-question")}
      </Button>
    </>
  );
};

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

  console.log("[ReflectStep.rndr]", {
    step,
    stepper,
    data,
    motivation,
    lastReflection,
    previousActionSteps,
    reflectionField,
    hints,
  });
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
      <ReflectionQuestion name={SESSION_FIELDS.REFLECTION} />

      <AccordionSummary sx={{ fontSize: 16 }}>
        {msg("sessions.edit.steps.reflect.reflection-questions-heading")}
      </AccordionSummary>
      <FocusedList items={hints} />
      <RHFTextField
        name={"SESSION_FIELDS.REFLECTION"}
        rules={{
          required: "Required",
          validate: { ...(reflectionField.validate ?? {}) },
        }}
        placeholder={msg("sessions.edit.steps.reflect.reflection.placeholder")}
        // autoFocus
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
