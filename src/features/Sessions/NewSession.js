import {
  Add,
  ArrowBack,
  ArrowForward,
  Delete,
  EmojiEvents,
  PlusOne,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { SelectableChip } from "../../components/SelectableChip";
import { H1, H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { SessionStepCard } from "./SessionStepCard";
import { VerticalStepper } from "./VerticalStepper";
import { Controls, ControlsContainer } from "./Controls";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import {
  DesktopDatePicker,
  TimePicker as MuiTimePicker,
} from "@mui/x-date-pickers";
import { addDays, parse } from "date-fns";

const AreaStep = ({ handleNext, data, setData, ...props }) => {
  const { areas } = useNewSession();

  const isCustomArea = !areas.some((area) => area.key === data.area);
  const [selected, setSelected] = useState(
    isCustomArea ? undefined : data.area
  );
  const [customArea, setCustomArea] = useState(isCustomArea ? data.area : "");
  console.log({ selected, customArea });

  const newArea = customArea || selected;
  const next = () => {
    handleNext({ area: newArea });
  };

  return (
    <SessionStepCard {...props}>
      <Box sx={{ my: 12.5, ...SelectableChip.wrapperSx }}>
        {areas.map((item) => (
          <SelectableChip
            key={item.key}
            label={item.label}
            selected={selected === item.key}
            onClick={() => {
              setSelected(item.key);
              setCustomArea("");
            }}
          />
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "baseline",
          gap: 5,
        }}
      >
        <TextField
          margin="normal"
          // required
          // fullWidth
          id="customArea"
          // label="Area"
          placeholder="Type your own area for growth"
          name="customArea"
          autoFocus
          size="small"
          hiddenLabel
          value={customArea}
          onChange={(e) => {
            setSelected();
            setCustomArea(e.target.value);
          }}
          sx={{ flex: "1 1 auto" }}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={next}
          disabled={!newArea}
        >
          Next
        </Button>
      </Box>
    </SessionStepCard>
  );
};

const TextAreaStep = ({
  textAreaName,
  handleNext,
  handleBack,
  data,
  setData,
  ...props
}) => {
  const { register, handleSubmit, watch, formState } = useForm({
    defaultValues: data,
  });
  const componentData = {
    [textAreaName]: watch(textAreaName),
  };
  console.log({ componentData, data });

  return (
    <SessionStepCard {...props}>
      <Box
        component="form"
        noValidate
        // onSubmit={handleSubmit(submit)}
        sx={{ mt: 1 }}
      >
        <TextField
          placeholder={"Type your own " + textAreaName}
          autoFocus
          size="small"
          hiddenLabel
          multiline
          rows={4}
          {...register(textAreaName, { required: true })}
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

const MotivationStep = (props) => (
  <TextAreaStep textAreaName={"motivation"} {...props} />
);

const GoalStep = (props) => <TextAreaStep textAreaName={"goal"} {...props} />;

const DatePicker = ({ control, name, rules, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <DesktopDatePicker
          renderInput={(params) => <TextField {...props} {...params} />}
          {...field}
        />
      )}
    />
  );
};

const TimePicker = ({ control, name, rules, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <MuiTimePicker
          renderInput={(params) => <TextField {...props} {...params} />}
          {...field}
        />
      )}
    />
  );
};

const Input = ({ name, control, rules, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => <TextField {...props} {...field} />}
    />
  );
};

const ActionSteps = ({ name, rules, control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    rules,
  });

  return (
    // <Box component={"ol"}>
    <Box sx={{ my: 5 }}>
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

const ActionStepsStep = ({
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

const STEPS = [
  {
    StepComponent: AreaStep,
    label: "Choose area",
    caption: "Area for development",
    // caption: "InsertChart",
    iconName: "InsertChart",
    heading: "Set area for your development",
    perex: "",
  },
  {
    StepComponent: GoalStep,
    label: "Set long-term goal",
    caption: "Goals give you focus",
    // caption: "Adjust",
    iconName: "Adjust",
    heading: "Set the long term goal",
    perex:
      "Goals give you focus. Goals help you measure progress and stay motivated.",
    focusedList: ["Focus on building relationship", "TODO", "TODO", "TODO"],
  },
  {
    StepComponent: MotivationStep,
    label: "Motivation",
    caption: "See yourself to excel",
    // caption: "RocketLaunch",
    iconName: "RocketLaunch",
    heading: "Motivation/visualization",
    perex: "Imagine the situation where you excel in this area.",
    focusedList: [
      "TODO",
      "How do you feel when you excel in it?",
      "How can your strenghts help you to achieve excellence in that?",
    ],
  },
  {
    StepComponent: ActionStepsStep,
    label: "Set action steps",
    caption: "Be specific",
    // caption: "Explore",
    iconName: "Explore",
    heading: "Set your action steps",
    perex:
      "Create SMART goals (Specific, Measurable, Attainable, Realistic, Time-bound) - The more specific you can be with your action step, the higher the chance you’ll complete it.",
  },
];

export const RightMenu = ({
  heading,
  activeStepIndex = 0,
  steps,
  buttonProps,
}) => {
  return (
    <ScrollableRightMenu heading={heading} buttonProps={buttonProps}>
      <VerticalStepper activeStepIndex={activeStepIndex} steps={steps} />
    </ScrollableRightMenu>
  );
};

export const AREAS = {
  1: { label: "Become an active listener" },
  2: { label: "Become more efficient" },
  3: { label: "Show appreciation, recognition and empathy for your team" },
  4: { label: "Be honest, transparent and accountable" },
  5: { label: "Be an effective communicator" },
  6: { label: "Being more assertive" },
  7: { label: "Negotiate effectively" },
  8: { label: "Be more self-confident" },
  9: { label: "Apply critical thinking" },
};

const useNewSession = () => {
  return {
    areas: Object.entries(AREAS).map(([key, value]) => ({
      key,
      label: value.label,
    })),
  };
};

const useSteps = ({ steps, initialIndex = 0, initialData = {} }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(initialIndex);
  const [data, setData] = useState(initialData);
  const activeStep = steps[activeStepIndex];

  const handleNext = useCallback((data) => {
    setData((prev) => ({ ...prev, ...data }));
    setActiveStepIndex((i) => i + 1);
  }, []);

  const handleBack = useCallback((data) => {
    setData((prev) => ({ ...prev, ...data }));
    setActiveStepIndex((i) => Math.max(0, i - 1));
  }, []);

  return {
    steps,
    activeStep,
    activeStepIndex: Math.min(activeStepIndex, STEPS.length - 1),
    isFirst: activeStepIndex === 0,
    isLast: activeStepIndex === steps.length - 1,
    handleNext,
    handleBack,
    data,
    setData,
  };
};

const createSessionEntry = ({ area, goal, motivation, steps }) => {
  return {
    timestamp: new Date().getTime(),
    date: new Date().toISOString(),
    type: "Private session",
    area,
    goal,
    motivation,
    steps,
  };
};

const Finished = () => {
  const { control } = useForm({
    defaultValues: {
      date: addDays(new Date(), 7),
      time: parse("14:00", "HH:mm", new Date()),
    },
  });
  return (
    <Card sx={{}} elevation={0}>
      <CardContent
        sx={{
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Avatar
            variant="circular"
            sx={{ width: 100, height: 100, bgcolor: "#F9FAFB" }}
          >
            <Avatar
              variant="circular"
              sx={{ width: 60, height: 60, bgcolor: "#EAECF0" }}
            >
              <EmojiEvents sx={{ fontSize: 30, color: "#667085" }} />
            </Avatar>
          </Avatar>
        </Box>
        <H1 sx={{ mt: 2 }} gutterBottom>
          Congratulations, you’ve completed your session!
        </H1>
        <P>Would you like to book the next one?</P>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            my: 7.5,
          }}
        >
          <DatePicker {...{ control, name: "date", size: "small" }} />
          <P>at</P>
          <TimePicker {...{ control, name: "time", size: "small" }} />
        </Box>
        <ControlsContainer sx={{ mt: 10 }}>
          <Button href={routes.sessions} variant="outlined">
            Skip for now
          </Button>
          <Button href={routes.sessions} variant="contained">
            Schedule the session
          </Button>
        </ControlsContainer>
      </CardContent>
    </Card>
  );
};

export function NewSessionPage() {
  const history = useHistoryEntries({ storageKey: "sessions_history" });
  const navigate = useNavigate();
  const [finished, setFinished] = useState(false);
  const {
    activeStep: { StepComponent = SessionStepCard, ...activeStep } = {},
    activeStepIndex,
    handleNext,
    handleBack,
    data,
    setData,
  } = useSteps({
    steps: STEPS,
    initialIndex: 0,
  });
  const onFinish = (data) => {
    const entry = createSessionEntry(data);
    history.push(entry);
    setFinished(true);
  };
  console.log("[NewSessionPage.rndr]", { data });

  return (
    <Layout
      rightMenuContent={
        <RightMenu
          heading={"My session 22/06/2022"}
          activeStepIndex={activeStepIndex}
          steps={STEPS}
          buttonProps={{
            children: "End session",
            onClick: () => navigate(routes.sessions),
          }}
        />
      }
    >
      <Box mt={4} mb={3}>
        <Box
          display="flex"
          flexWrap="nowrap"
          alignItems="center"
          flexDirection="row"
        >
          <Button
            color="inherit"
            href={routes.sessions}
            startIcon={<ArrowBack />}
          >
            <H2>Back to the sessions</H2>
          </Button>
        </Box>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
      </Box>
      {finished ? (
        <Finished />
      ) : (
        <StepComponent
          step={activeStep}
          stepper={{ currentIndex: activeStepIndex, totalCount: STEPS.length }}
          data={data}
          setData={setData}
          handleNext={handleNext}
          handleBack={handleBack}
          onFinish={onFinish}
        />
      )}
    </Layout>
  );
}
