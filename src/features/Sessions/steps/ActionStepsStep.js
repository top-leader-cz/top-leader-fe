import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { SessionStepCard } from "../SessionStepCard";
import { Controls } from "./Controls";
import { identity } from "ramda";
import { SESSION_FIELDS } from "./constants";
import { ActionSteps, actionStepsMessages } from "./ActionSteps";
import { FormStepCard } from "./FormStepCard";
import { useArea } from "./AreaStep";
import { useActionStepsAIHintsQuery } from "./SetActionStepsStep";
import { useMsg } from "../../../components/Msg/Msg";

export const DEFAULT_VALUE_ROW = [{ label: "", date: null }];

export const ActionStepsStep = ({
  handleNext,
  handleBack,
  data,
  setData,
  onFinish,
  step,
  disabled,
  stepper,
}) => {
  const msg = useMsg({ dict: actionStepsMessages });
  const keyName = SESSION_FIELDS.ACTION_STEPS;
  const valueArr = data[SESSION_FIELDS.AREA_OF_DEVELOPMENT];
  const { areaText } = useArea({ valueArr });
  const actionStepsAIHintsQuery = useActionStepsAIHintsQuery({
    areaOfDevelopment: areaText,
    longTermGoal: data[SESSION_FIELDS.LONG_TERM_GOAL],
  });
  const actionStepsHints = [].concat(actionStepsAIHintsQuery.data || []);

  return (
    <FormStepCard
      {...{ step, stepper, data, setData, handleNext, handleBack }}
      renderControls={({
        handleNext,
        handleBack,
        formState,
        data,
        componentData,
      }) => (
        <Controls
          data={{ ...data, ...componentData }}
          handleNext={onFinish}
          handleBack={handleBack}
          nextProps={{
            disabled: !formState.isValid || disabled,
            children: msg("action-steps.done"),
            endIcon: undefined,
          }}
        />
      )}
    >
      <ActionSteps
        name={keyName}
        rules={{ required: true, minLength: 1 }}
        hints={actionStepsHints}
        hintsLoading={actionStepsAIHintsQuery.isLoading}
        sx={{ my: 5 }}
      />
    </FormStepCard>
  );
};
