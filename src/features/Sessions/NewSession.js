import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Divider } from "@mui/material";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2 } from "../../components/Typography";
import { routes } from "../../routes";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { SessionStepCard } from "./SessionStepCard";
import { VerticalStepper } from "./VerticalStepper";
import { useUserSessionMutation, useUserSessionQuery } from "./api";
import { messages } from "./messages";
import { ActionStepsStep } from "./steps/ActionStepsStep";
import { AreaStep } from "./steps/AreaStep";
import { Finished } from "./steps/Finished";
import { GoalStep, MotivationStep } from "./steps/TextAreaStep";
import { getTranslatedList } from "./EditSession.page";
import { pipe, uniq } from "ramda";

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
    activeStepIndex: Math.min(activeStepIndex, steps.length - 1),
    setActiveStepIndex,
    isFirst: activeStepIndex === 0,
    isLast: activeStepIndex === steps.length - 1,
    handleNext,
    handleBack,
    data,
    setData,
  };
};

export const useGoalHints = () => {
  const msg = useMsg();

  return useMemo(
    () =>
      pipe(
        getTranslatedList,
        uniq // TODO: translations - sessions.new.steps.goal.focusedlist.1 === 2
      )({
        tsKey: "sessions.new.steps.goal.focusedlist",
        msg,
        startIndex: 1,
      }),
    [msg]
  );
};

function NewSessionPageInner() {
  const msg = useMsg();
  const { i18n } = useContext(I18nContext);

  const goalHints = useGoalHints();
  const motivationHints = useMemo(
    () =>
      getTranslatedList({
        tsKey: "sessions.new.steps.motivation.focusedlist",
        msg,
        startIndex: 1,
      }),
    [msg]
  );
  const STEPS = [
    {
      StepComponent: AreaStep,
      label: msg("sessions.new.steps.area.label"),
      caption: msg("sessions.new.steps.area.caption"),
      iconName: "InsertChart",
      heading: msg("sessions.new.steps.area.heading"),
      perex: msg("sessions.new.steps.area.perex"),
    },
    {
      StepComponent: GoalStep,
      label: msg("sessions.new.steps.goal.label"),
      caption: msg("sessions.new.steps.goal.caption"),
      iconName: "Adjust",
      heading: msg("sessions.new.steps.goal.heading"),
      perex: msg("sessions.new.steps.goal.perex"),
      focusedList: goalHints,
    },
    {
      StepComponent: MotivationStep,
      label: msg("sessions.new.steps.motivation.label"),
      caption: msg("sessions.new.steps.motivation.caption"),
      iconName: "RocketLaunch",
      heading: msg("sessions.new.steps.motivation.heading"),
      perex: msg("sessions.new.steps.motivation.perex"),
      focusedList: motivationHints,
    },
    {
      StepComponent: ActionStepsStep,
      label: msg("sessions.new.steps.actionsteps.label"),
      caption: msg("sessions.new.steps.actionsteps.caption"),
      iconName: "Explore",
      heading: msg("sessions.new.steps.actionsteps.heading"),
      perex: msg("sessions.new.steps.actionsteps.perex"),
    },
  ];

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

  const [unmountedUi, setUnmountedUi] = useState(false);
  const reinit = useCallback(
    (data) => {
      setUnmountedUi(true);
      setData(data);
      setTimeout(() => setUnmountedUi(false), 0);
    },
    [setData]
  );

  const query = useUserSessionQuery();

  const activeStepIndexRef = useRef(activeStepIndex);
  activeStepIndexRef.current = activeStepIndex;
  useEffect(() => {
    console.log("[NewSession.eff]", { qData: query.data });
    if (query.data && activeStepIndexRef.current === 0) {
      console.log("%c[NewSession.eff]", "color:pink", { qData: query.data });
      // reinit(query.data);
    }
  }, [query.data, reinit]);
  const mutation = useUserSessionMutation({
    onSuccess: (data) => {
      // TODO: not called sometimes!
      console.log("mutation.onSuccess", data);
      setFinished(true);
    },
  });

  // const history = useHistoryEntries({ storageKey: "sessions_history" });
  const navigate = useNavigate();
  const [finished, setFinished] = useState(false);

  const onFinish = (data) => {
    console.log("[NewSession.onFinish]", { data });

    // await mutation.mutateAsync(data); // todo: broken, reloads page
    mutation.mutate(data);
    // navigate(routes.sessions);
    // TODO: update @mui/x-date-pickers 5 -> 6
  };

  const isLoading = unmountedUi || query.isFetching || mutation.isLoading;
  console.log("[NewSessionPage.rndr]", { goalHints, data, query, isLoading });

  if (isLoading) return <QueryRenderer isLoading />;

  return (
    <Layout
      rightMenuContent={
        <StepperRightMenu
          heading={
            <>
              <Msg id="sessions.new.aside.title" />
              &nbsp; {i18n.formatLocal(new Date(), "P")}
            </>
          }
          activeStepIndex={activeStepIndex}
          onStepClick={({ index }) => setActiveStepIndex(index)}
          steps={STEPS}
          buttonProps={{
            children: <Msg id="sessions.new.aside.end-button" />,
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
            <H2>
              <Msg id="sessions.new.header" />
            </H2>
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
          disabled={mutation.isLoading}
        />
      )}
    </Layout>
  );
}

export function NewSessionPage() {
  return (
    <MsgProvider messages={messages}>
      <NewSessionPageInner />
    </MsgProvider>
  );
}
