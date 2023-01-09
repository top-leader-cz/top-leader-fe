import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Divider } from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2 } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { routes } from "../../routes";
import { SessionStepCard } from "./SessionStepCard";
import { ActionStepsStep } from "./steps/ActionStepsStep";
import { AreaStep } from "./steps/AreaStep";
import { Finished } from "./steps/Finished";
import { GoalStep, MotivationStep } from "./steps/TextAreaStep";
import { VerticalStepper } from "./VerticalStepper";

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

export const StepperRightMenu = ({
  heading,
  buttonProps,

  activeStepIndex = 0,
  onStepClick,
  steps,
}) => {
  return (
    <ScrollableRightMenu heading={heading} buttonProps={buttonProps}>
      <VerticalStepper
        activeStepIndex={activeStepIndex}
        onStepClick={onStepClick}
        steps={steps}
      />
    </ScrollableRightMenu>
  );
};

export const useSteps = ({ steps, initialIndex = 0, initialData = {} }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(initialIndex);
  const [data, setData] = useState(initialData);
  const activeStep = steps[activeStepIndex];

  const handleNext = useCallback((data) => {
    setData(
      (prev) => console.log("handleNext", data, prev) || { ...prev, ...data }
    );
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
    setActiveStepIndex,
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

export function NewSessionPage() {
  const history = useHistoryEntries({ storageKey: "sessions_history" });
  const navigate = useNavigate();
  const [finished, setFinished] = useState(false);
  const {
    activeStep: { StepComponent = SessionStepCard, ...activeStep } = {},
    activeStepIndex,
    setActiveStepIndex,
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
        <StepperRightMenu
          heading={"My session 22/06/2022"}
          activeStepIndex={activeStepIndex}
          onStepClick={({ index }) => setActiveStepIndex(index)}
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
