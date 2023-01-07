import { ArrowBack } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Todos } from "../../components/Todos";
import { H1, H2 } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { routes } from "../../routes";
import { StepperRightMenu, useSteps } from "./NewSession";
import { SessionStepCard } from "./SessionStepCard";
import { Controls, ControlsContainer } from "./steps/Controls";
import { Finished } from "./steps/Finished";

const IconTile = ({ iconName, caption, text, ...props }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={"100%"}
      bgcolor="#FCFCFD"
      p={3}
      {...props}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 100,
          height: 100,
          bgcolor: "#DAD2F1",
          borderRadius: 3,
        }}
      >
        <Icon name={iconName} sx={{ fontSize: 40, color: "primary.main" }} />
      </Avatar>
      <Typography variant="h2" fontSize={14} mt={2}>
        {caption}
      </Typography>
      <H1 color={"primary.main"} mt={2}>
        {text}
      </H1>
    </Box>
  );
};

const AlignStep = ({ handleNext, ...props }) => {
  return (
    <SessionStepCard {...props}>
      <Box display="flex" flexDirection="row" gap={1} mt={7.5} mb={10}>
        <IconTile
          iconName={"InsertChart"}
          caption="Area of development"
          text="Self-awareness"
        />
        <IconTile
          iconName={"InsertChart"}
          caption="Long-term goal"
          text="Giving speeches to audiences regularly"
        />
      </Box>
      <ControlsContainer>
        {/* <Button variant="outlined" onClick={() => {}}>
          No, I would like to adjust
        </Button> */}
        <Button
          variant="contained"
          endIcon={<Icon name="ArrowForward" />}
          onClick={() => handleNext()}
        >
          Yes
        </Button>
      </ControlsContainer>
    </SessionStepCard>
  );
};

const exampleTodos = [
  { id: 1, label: "Quaerat voluptate eos similique corporis quisquam" },
  { id: 2, label: "Cupiditate aut recusandae soluta consequatur." },
  { id: 3, label: "Qui voluptates sint facilis impedit et ea quia deleniti." },
];

const ReflectStep = ({ handleNext, handleBack, data, setData, ...props }) => {
  return (
    <SessionStepCard {...props}>
      <Todos items={exampleTodos} keyProp="id" />
      <Controls handleNext={handleNext} handleBack={handleBack} />
    </SessionStepCard>
  );
};

const SetGoalStep = ({ ...props }) => {
  return <SessionStepCard {...props} />;
};

const STEPS = [
  {
    StepComponent: AlignStep,
    label: "Area and goal",
    caption: "",
    iconName: "InsertChart",
    heading:
      "Are you still aligned with your area for development and the long term goal? ",
    perex: "",
  },
  {
    StepComponent: ReflectStep,
    label: "Reflect",
    caption: "",
    iconName: "Lightbulb",
    heading: "Reflection on the last session",
    perex: "Here are the actions you set last time",
  },
  {
    StepComponent: SetGoalStep,
    label: "Set goal",
    caption: "",
    iconName: "Explore",
    heading: "Set your action steps",
    perex: "They should be achievable and measurable.",
  },
];

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

export function EditSessionPage() {
  const { id } = useParams();
  const history = useHistoryEntries({ storageKey: "sessions_history" });
  //   const entry = history.get({id})
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
    history.update(entry);
    setFinished(true);
  };
  console.log("[EditSessionPage.rndr]", { id, data });

  return (
    <Layout
      rightMenuContent={
        <StepperRightMenu
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
