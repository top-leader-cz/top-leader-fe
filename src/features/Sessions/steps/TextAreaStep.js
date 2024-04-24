import { Box, Chip } from "@mui/material";
import { identity } from "ramda";
import { useForm } from "react-hook-form";
import { RHFTextField } from "../../../components/Forms";
import { notBlank } from "../../../components/Forms/validations";
import { SessionStepCard } from "../SessionStepCard";
import { Controls } from "./Controls";
import { SESSION_FIELDS } from "./constants";
import { useMsg } from "../../../components/Msg/Msg";
import { messages } from "../messages";
import { useGoalHints } from "./hints";
import { primary25, primary500 } from "../../../theme";
import { useMyQuery } from "../../Authorization/AuthProvider";
import { useArea } from "./AreaStep";
import { QueryRenderer } from "../../QM/QueryRenderer";

// TODO: -> FormStepCard
export const TextAreaStep = ({
  textAreaName,
  textAreaLabel,
  handleNext,
  handleBack,
  data,
  setData,
  step: { fieldDefMap = {}, ...step },
  ...props
}) => {
  const msg = useMsg({ dict: messages });
  const field = fieldDefMap[textAreaName];
  const { control, watch, formState } = useForm({
    mode: "all",
    defaultValues: data,
  });
  const map = field?.map || identity;
  const componentData = {
    [textAreaName]: map(watch(textAreaName)),
  };
  console.log("[TextAreaStep.rndr]", formState.isValid, {
    componentData,
    data,
  });

  return (
    <SessionStepCard step={step} {...props}>
      <Box
        component="form"
        noValidate
        // onSubmit={handleSubmit(submit)}
        sx={{ mt: 1 }}
      >
        <RHFTextField
          control={control}
          name={textAreaName}
          rules={{
            required: "Required",
            validate: { ...(field.validate ?? { notBlank: notBlank(0) }) },
          }}
          placeholder={msg("sessions.steps.textareastep.placeholder", {
            textAreaName,
          })}
          autoFocus
          size="small"
          hiddenLabel
          multiline
          rows={4}
          sx={{ my: 4 }}
          fullWidth
        />
        <Controls
          handleNext={handleNext}
          nextProps={{ disabled: !formState.isValid }}
          handleBack={handleBack}
          data={componentData}
          sx={{ mt: 3 }}
        />
      </Box>
    </SessionStepCard>
  );
};

const useGoalAIHintsQuery = ({ areaOfDevelopment }) => {
  return useMyQuery({
    enabled: !!areaOfDevelopment,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryKey: ["user-sessions", "generate-long-term-goal", areaOfDevelopment],
    fetchDef: {
      method: "POST",
      url: `/api/latest/user-sessions/generate-long-term-goal`,
      payload: { areaOfDevelopment },
    },
  });
};

export const GoalStep = ({
  textAreaLabel,
  handleNext,
  handleBack,
  data,
  setData,
  step: { fieldDefMap = {}, ...step },
  ...props
}) => {
  const textAreaName = SESSION_FIELDS.LONG_TERM_GOAL;

  const valueArr = data[SESSION_FIELDS.AREA_OF_DEVELOPMENT];
  const { areaText } = useArea({ valueArr });
  const goalAIHintsQuery = useGoalAIHintsQuery({
    areaOfDevelopment: areaText,
  });
  // const goalHints = useGoalHints();
  // const goalHints = [].concat(goalAIHintsQuery.data || []);

  const msg = useMsg({ dict: messages });
  const field = fieldDefMap[textAreaName];
  const { control, watch, formState, setValue } = useForm({
    mode: "all",
    defaultValues: data,
  });
  const map = field?.map || identity;
  const componentData = {
    [textAreaName]: map(watch(textAreaName)),
  };
  const onChipClick = ({ text }) => {
    setValue(textAreaName, text, { shouldValidate: true });
  };

  return (
    <SessionStepCard step={step} {...props}>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <RHFTextField
          control={control}
          name={textAreaName}
          rules={{
            required: "Required",
            validate: { ...(field.validate ?? { notBlank: notBlank(0) }) },
          }}
          placeholder={msg("sessions.steps.goal.placeholder")}
          autoFocus
          withHelperTextSpace // without this, helper text is intermediately displayed after clicking on a chip, moving ui down, causing missclick
          size="small"
          hiddenLabel
          multiline
          rows={4}
          sx={{ mt: 4, mb: 0 }}
          fullWidth
        />
        <QueryRenderer
          query={goalAIHintsQuery}
          loaderName="Skeleton"
          loaderProps={{ rows: 3, sx: { mb: 2 } }}
          success={({ data }) =>
            [].concat(data || []).map((text) => (
              <Chip
                sx={{
                  m: "6px",
                  p: "6px",
                  borderRadius: "6px",
                  color: primary500,
                  bgcolor: primary25,
                  // justifyContent: "flex-start",
                  // pointerEvents: "none",
                  // height: "auto",
                  "& .MuiChip-label": {
                    textWrap: "wrap",
                    paddingLeft: 0,
                    paddingRight: 0,
                  },
                }}
                key={text}
                label={text}
                onClick={() => onChipClick({ text })}
              />
            ))
          }
        />

        <Controls
          handleNext={handleNext}
          nextProps={{ disabled: !formState.isValid }}
          handleBack={handleBack}
          data={componentData}
          sx={{ mt: 3 }}
        />
      </Box>
    </SessionStepCard>
  );
};

export const MotivationStep = (props) => (
  <TextAreaStep textAreaName={SESSION_FIELDS.MOTIVATION} {...props} />
);
