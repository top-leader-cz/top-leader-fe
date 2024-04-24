import { useMsg } from "../../../components/Msg/Msg";
import { P } from "../../../components/Typography";
import { FETCH_TYPE, useMyQuery } from "../../Authorization/AuthProvider";
import { ActionSteps, actionStepsMessages } from "./ActionSteps";
import { useArea } from "./AreaStep";
import { Controls } from "./Controls";
import { FormStepCard } from "./FormStepCard";
import { SessionTodosFields } from "./SessionTodos";
import { SESSION_FIELDS } from "./constants";

export const useActionStepsAIHintsQuery = ({
  areaOfDevelopment,
  longTermGoal,
}) => {
  return useMyQuery({
    enabled: !!areaOfDevelopment && !!longTermGoal,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryKey: [
      "user-sessions",
      "generate-action-steps",
      areaOfDevelopment,
      longTermGoal,
    ],
    fetchDef: {
      method: "POST",
      url: `/api/latest/user-sessions/generate-action-steps`,
      payload: { areaOfDevelopment, longTermGoal },
      // type: FETCH_TYPE.TEXT,
    },
  });
};

export const SetActionStepsStep = ({
  onFinish,
  step,
  stepper,
  data,
  setData,
  handleNext,
  handleBack,
  submitDisabled,
  previousArea,
  previousGoal,
}) => {
  const msg = useMsg({ dict: actionStepsMessages });
  const valueArr = data[SESSION_FIELDS.AREA_OF_DEVELOPMENT] || previousArea;
  const { areaText } = useArea({ valueArr });
  const actionStepsAIHintsQuery = useActionStepsAIHintsQuery({
    areaOfDevelopment: areaText,
    longTermGoal: data[SESSION_FIELDS.LONG_TERM_GOAL] || previousGoal,
  });
  const actionStepsHints = [].concat(actionStepsAIHintsQuery.data || []);
  // const actionStepsHints = ["Hint 1", "Hint 2", "Hint 3"];

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
            disabled: !formState.isValid || submitDisabled,
            children: msg("action-steps.done"),
            endIcon: undefined,
          }}
        />
      )}
    >
      <SessionTodosFields name={"previousActionSteps"} />
      <P my={2}></P>
      <ActionSteps
        name={SESSION_FIELDS.ACTION_STEPS}
        rules={{ required: true, minLength: 1 }}
        hints={actionStepsHints}
        hintsLoading={actionStepsAIHintsQuery.isLoading}
        sx={{ my: 5 }}
      />
    </FormStepCard>
  );
};
