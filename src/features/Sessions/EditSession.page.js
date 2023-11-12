import { ArrowBack } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  InputLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionSteps, RHFTextField } from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H1, H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { FocusedList } from "./FocusedList";
import { StepperRightMenu, useSteps } from "./NewSession";
import { SessionStepCard } from "./SessionStepCard";
import { useUserReflectionMutation, useUserSessionQuery } from "./api";
import { useAreasDict } from "./areas";
import { messages } from "./messages";
import { DEFAULT_VALUE_ROW } from "./steps/ActionStepsStep";
import { AreaStep } from "./steps/AreaStep";
import { Controls, ControlsContainer } from "./steps/Controls";
import { Finished } from "./steps/Finished";
import { FormStepCard } from "./steps/FormStepCard";
import { GoalStep } from "./steps/TextAreaStep";
import { Header } from "../../components/Header";

export const IconTileIcon = ({ iconName }) => {
  return (
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
  );
};

export const IconTile = ({
  iconName,
  caption,
  renderCaption = () => (
    <Typography variant="h2" fontSize={14} mt={2}>
      {caption}
    </Typography>
  ),
  text,
  renderText = () => (
    <H1 color={"primary.main"} mt={2}>
      {text}
    </H1>
  ),
  children,
  ...props
}) => {
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
      <IconTileIcon iconName={iconName} />
      {renderCaption(caption)}
      {renderText(text)}
      {children}
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

export const lazyList = ({ i = 0, get, max, items = [] }) => {
  const item = items.length >= max ? undefined : get(i);

  if (!item) return items;

  return lazyList({ i: i + 1, get, max, items: [...items, item] });
};

export const getTranslatedList = ({ tsKey, msg, startIndex = 1, max = 10 }) => {
  return lazyList({
    max,
    get: (i) => {
      const index = startIndex + i;
      const translationKey = `${tsKey.replace(/\.$/, "")}.${index}`;
      const translationMaybe = msg.maybe(translationKey);
      return translationMaybe;
    },
  });
};

const exampleTodos = [
  { id: 1, label: "Quaerat voluptate eos similique corporis quisquam" },
  { id: 2, label: "Cupiditate aut recusandae soluta consequatur." },
  { id: 3, label: "Qui voluptates sint facilis impedit et ea quia deleniti." },
];

const userInputSx = { my: 3, p: 3, bgcolor: "#FCFCFD" };

export const SessionTodos = ({ actionSteps = [], withoutControls }) => {
  const msg = useMsg();
  const [allChecked, setAllChecked] = useState();
  const onCheckAll = useCallback(() => {
    setAllChecked((v) => !v);
  }, []);

  return (
    <Stack sx={{ ...userInputSx }}>
      {actionSteps.map(
        ({ id, label, date = "2023-09-06", checked = false }) => (
          <FormControlLabel
            key={id}
            control={<Checkbox defaultChecked={checked} />}
            label={label}
          />
        )
      )}
      {!withoutControls && (
        <>
          <Divider sx={{ my: 2, opacity: 0.4 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Checkbox id="allChecked" sx={{ py: 0 }} checked={allChecked} />
            <InputLabel htmlFor="allChecked" onClick={onCheckAll}>
              {msg("sessions.edit.steps.reflect.mark-all-as-completed")}
            </InputLabel>
          </Box>
        </>
      )}
    </Stack>
  );
};

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
  const msg = useMsg();
  const hints = useMemo(
    () =>
      getTranslatedList({
        tsKey: "sessions.edit.steps.reflect.hints",
        msg,
        startIndex: 1,
      }),
    [msg]
  );
  console.log("[ReflectStep.rndr]", { previousActionSteps });

  return (
    <FormStepCard {...{ step, stepper, data, setData, handleNext, handleBack }}>
      <SessionTodos actionSteps={previousActionSteps} />
      <Box sx={{ ...userInputSx }}>
        <P>{motivationOrReflection}</P>
      </Box>
      <FocusedList items={hints} />
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
  previousActionSteps = [],
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
      <SessionTodos actionSteps={previousActionSteps} withoutControls />
      {/* <Todos items={exampleTodos} keyProp="id" /> */}
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
  const goalHints = useMemo(
    () =>
      getTranslatedList({
        tsKey: "sessions.new.steps.goal.focusedlist",
        msg,
        startIndex: 1,
      }),
    [msg]
  );
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
      focusedList: goalHints,
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

  const sessionQuery = useUserSessionQuery({});
  const reflectionQuery = {}; // TODO

  const activeStepIndexRef = useRef(activeStepIndex);
  activeStepIndexRef.current = activeStepIndex;

  const mutation = useUserReflectionMutation({
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
      <Header
        text={<Msg id="sessions.new.header" />}
        back={{ href: routes.sessions }}
      />
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
