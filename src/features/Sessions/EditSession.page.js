import { ArrowBack } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { format } from "date-fns";
import { useCallback, useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { I18nContext, UTC_DATE_FORMAT } from "../../App";
import { ActionSteps, RHFTextField } from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { Todos } from "../../components/Todos";
import { H1, H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { useAuth } from "../Authorization";
import { QueryRenderer } from "../QM/QueryRenderer";
import { FocusedList } from "./FocusedList";
import { StepperRightMenu, useSteps } from "./NewSession";
import { SessionStepCard } from "./SessionStepCard";
import { useAreasDict } from "./areas";
import { messages } from "./messages";
import { DEFAULT_VALUE_ROW } from "./steps/ActionStepsStep";
import { AreaStep } from "./steps/AreaStep";
import { Controls, ControlsContainer } from "./steps/Controls";
import { Finished } from "./steps/Finished";
import { FormStepCard } from "./steps/FormStepCard";
import { GoalStep } from "./steps/TextAreaStep";

const IconTile = ({ iconName, caption, text }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width={"100%"}
      bgcolor="#FCFCFD"
      p={3}
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

const AlignStep = ({
  step,
  stepper,
  data,
  setData,
  handleNext,
  handleBack,
  setAdjust,
  previousArea = "",
  previousGoal = "",
}) => {
  const msg = useMsg();
  const { areas } = useAreasDict();

  const handleAdjust = useCallback(() => {
    console.log("handleAdjust");
    setAdjust(true);
    handleNext();
  }, [handleNext, setAdjust]);
  const handleAligned = useCallback(() => {
    console.log("handleAligned");
    setAdjust(false);
    handleNext();
  }, [handleNext, setAdjust]);

  return (
    <SessionStepCard {...{ step, stepper, handleNext, handleBack }}>
      <Box display="flex" flexDirection="row" gap={1} mt={7.5} mb={10}>
        <IconTile
          iconName={"InsertChart"}
          caption={msg("sessions.edit.steps.align.area.caption")}
          text={areas[previousArea]?.label || previousArea}
        />
        <IconTile
          iconName={"InsertChart"}
          caption={msg("sessions.edit.steps.align.goal.caption")}
          text={previousGoal}
        />
      </Box>
      <ControlsContainer>
        <Button variant="outlined" onClick={handleAdjust}>
          <Msg id="sessions.edit.steps.align.adjust" />
        </Button>
        <Button
          variant="contained"
          endIcon={<Icon name="ArrowForward" />}
          onClick={handleAligned}
        >
          <Msg id="sessions.edit.steps.align.confirm" />
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

const reflectionKeyName = "reflection";
const ReflectStep = ({
  step,
  stepper,
  data,
  setData,
  handleNext,
  handleBack,
  onFinish,
  motivationOrReflection = "",
  previousActionSteps = [],
}) => {
  return (
    <FormStepCard {...{ step, stepper, data, setData, handleNext, handleBack }}>
      <Todos items={previousActionSteps} keyProp="id" />
      <P my={2}>{motivationOrReflection}</P>
      <FocusedList
        items={[
          "What have you learned when aiming to that action step?",
          "What were you happy with?",
        ]}
      />
      <RHFTextField
        name={reflectionKeyName}
        rules={{ required: true }}
        placeholder={"Type your own " + reflectionKeyName}
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

const setActionStepsKeyName = "actionSteps";
const SetActionStepsStep = ({
  onFinish,
  step,
  stepper,
  data,
  setData,
  handleNext,
  handleBack,
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
            disabled: !formState.isValid,
            children: "Done",
            endIcon: undefined,
          }}
        />
      )}
    >
      <Todos items={exampleTodos} keyProp="id" />
      <P my={2}></P>

      <ActionSteps
        name={setActionStepsKeyName}
        rules={{ required: true, minLength: 1 }}
        sx={{ my: 5 }}
      />
    </FormStepCard>
  );
};

const createSessionEntry = (timestamp, { reflection, actionSteps }) => {
  return {
    timestamp,
    actionSteps,
    secondSession: {
      timestamp: new Date().getTime(),
      date: new Date().toISOString(),
      reflection,
    },
  };
};

function EditSessionPageInner() {
  const msg = useMsg();
  const { i18n } = useContext(I18nContext);

  const STEPS = [
    {
      StepComponent: AlignStep,
      label: msg("sessions.edit.steps.align.label"),
      caption: msg("sessions.edit.steps.align.caption"),
      iconName: "InsertChart",
      heading: msg("sessions.edit.steps.align.heading"),
      perex: msg("sessions.edit.steps.align.perex"),
    },
    {
      StepComponent: ReflectStep,
      fields: [{ name: reflectionKeyName }],
      label: msg("sessions.edit.steps.reflect.label"),
      caption: msg("sessions.edit.steps.reflect.caption"),
      iconName: "Lightbulb",
      heading: msg("sessions.edit.steps.reflect.heading"),
      perex: msg("sessions.edit.steps.reflect.perex"),
    },
    {
      StepComponent: SetActionStepsStep,
      fields: [{ name: setActionStepsKeyName }],
      label: msg("sessions.edit.steps.setaction.label"),
      caption: msg("sessions.edit.steps.setaction.caption"),
      iconName: "Explore",
      heading: msg("sessions.edit.steps.setaction.heading"),
      perex: msg("sessions.edit.steps.setaction.perex"),
    },
  ];
  const ADJUST_STEPS = [
    {
      StepComponent: AreaStep,
      label: msg("sessions.new.steps.area.label"),
      caption: msg("sessions.new.steps.area.caption"),
      // caption: "InsertChart",
      iconName: "InsertChart",
      heading: msg("sessions.new.steps.area.heading"),
      perex: msg("sessions.new.steps.area.perex"),
    },
    {
      StepComponent: GoalStep,
      label: msg("sessions.new.steps.goal.label"),
      caption: msg("sessions.new.steps.goal.caption"),
      // caption: "Adjust",
      iconName: "Adjust",
      heading: msg("sessions.new.steps.goal.heading"),
      perex: msg("sessions.new.steps.goal.perex"),
      focusedList: [
        msg("sessions.new.steps.goal.focusedlist.1"),
        "TODO",
        "TODO",
        "TODO",
      ],
    },
  ];
  const [adjust, setAdjust] = useState(false);

  const steps = adjust
    ? [STEPS[0], ADJUST_STEPS[0], ADJUST_STEPS[1], STEPS[1], STEPS[2]]
    : STEPS;

  const { id } = useParams();
  // const timestamp = Number(id);
  // const history = useHistoryEntries({
  //   storageKey: "sessions_history",
  //   initialSelectedId: timestamp,
  //   idKey: "timestamp",
  // });

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
    steps,
    initialIndex: 0,
    initialData: {
      actionSteps: DEFAULT_VALUE_ROW,
    },
  });

  const { authFetch } = useAuth();
  const sessionQuery = useQuery({
    queryKey: ["user-sessions"],
    queryFn: () => authFetch({ url: `/api/latest/user-sessions` }),
    cacheTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const reflectionQuery = {}; // TODO

  const activeStepIndexRef = useRef(activeStepIndex);
  activeStepIndexRef.current = activeStepIndex;

  const mutation = useMutation({
    /* { "reflection": "string", "newActionSteps": [ { "label": "string", "date": "2023-08-29" } ], "checked": [ 0 ] } */
    mutationFn: ({ actionSteps = [], ...data }) => {
      console.log("%cMUTATION", "color:lime", { actionSteps, ...data });
      return authFetch({
        method: "POST",
        url: "/api/latest/user-sessions-reflection",
        data: {
          ...data,
          newActionSteps: actionSteps.map(({ label, date }) => {
            const formattedDate = format(date, UTC_DATE_FORMAT);
            console.log("mapStep", { date, formattedDate });
            return {
              label,
              date: formattedDate,
            };
          }),
        },
      });
    },
    onSuccess: useCallback((data) => {
      // TODO: not called sometimes!
      console.log("mutation.onSuccess", data);
      setFinished(true);
    }, []),
  });

  const handleFinish = (data) => {
    console.log("[NewSession.onFinish]", { data });
    if (data.areaOfDevelopment && adjust)
      console.log(
        "[NewSession.onFinish] TODO? Area changed, call user sessions?"
      );
    mutation.mutate(data);
    return;
    // setFinished(true);
  };
  const isLoading = sessionQuery.isLoading || mutation.isLoading;

  console.log("[EditSessionPage.rndr]", {
    id,
    data,
    activeStepIndex,
    steps,
    activeStep,
    adjust,
  });

  if (isLoading) return <QueryRenderer isLoading />;

  const date = new Date();
  const formattedDate = i18n.formatLocalMaybe(date, "P");
  // console.log({
  //   sessionQuery,
  //   stringDate: sessionQuery.data.createdAt,
  //   date,
  //   formattedDate,
  // });

  return (
    <Layout
      rightMenuContent={
        <StepperRightMenu
          heading={
            <>
              <Msg id="sessions.new.aside.title" />
              &nbsp; {formattedDate}
            </>
          }
          activeStepIndex={activeStepIndex}
          onStepClick={({ index }) => setActiveStepIndex(index)}
          steps={steps}
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
          stepper={{ currentIndex: activeStepIndex, totalCount: steps.length }}
          data={data}
          setData={setData}
          handleNext={handleNext}
          handleBack={handleBack}
          onFinish={handleFinish}
          motivationOrReflection={
            sessionQuery.data?.motivation ?? reflectionQuery?.data?.reflection
          }
          previousActionSteps={sessionQuery.data?.actionSteps ?? []}
          previousArea={sessionQuery.data?.areaOfDevelopment ?? ""}
          previousGoal={sessionQuery.data?.longTermGoal ?? ""}
          setAdjust={setAdjust}
        />
      )}
    </Layout>
  );
}

export function EditSessionPage() {
  return (
    <MsgProvider messages={messages}>
      <EditSessionPageInner />
    </MsgProvider>
  );
}
