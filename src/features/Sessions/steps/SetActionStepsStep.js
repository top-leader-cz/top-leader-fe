import { P } from "../../../components/Typography";
import { ActionSteps } from "./ActionSteps";
import { Controls } from "./Controls";
import { FormStepCard } from "./FormStepCard";
import { SessionTodosFields } from "./SessionTodos";
import { SESSION_FIELDS } from "./constants";

export const SetActionStepsStep = ({
  onFinish,
  step,
  stepper,
  data,
  setData,
  handleNext,
  handleBack,
  submitDisabled,
}) => {
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
            children: "Done",
            endIcon: undefined,
          }}
        />
      )}
    >
      <SessionTodosFields name={"previousActionSteps"} />
      {/* <SessionTodos actionSteps={previousActionSteps} withoutControls /> */}
      {/* <Todos items={exampleTodos} keyProp="id" /> */}
      <P my={2}></P>
      <ActionSteps
        name={SESSION_FIELDS.ACTION_STEPS}
        rules={{ required: true, minLength: 1 }}
        sx={{ my: 5 }}
      />
    </FormStepCard>
  );
};
