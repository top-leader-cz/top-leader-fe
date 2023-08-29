import { ArrowBack } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionSteps, RHFTextField } from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { Todos } from "../../components/Todos";
import { H1, H2, P } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { routes } from "../../routes";
import { FocusedList } from "./FocusedList";
import { messages } from "./messages";
import { StepperRightMenu, useSteps } from "./NewSession";
import { SessionStepCard } from "./SessionStepCard";
import { DEFAULT_VALUE_ROW } from "./steps/ActionStepsStep";
import { Controls, ControlsContainer } from "./steps/Controls";
import { Finished } from "./steps/Finished";
import { FormStepCard } from "./steps/FormStepCard";

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

const AlignStep = ({ handleNext, ...props }) => {
  const msg = useMsg();
  return (
    <SessionStepCard {...props}>
      <Box display="flex" flexDirection="row" gap={1} mt={7.5} mb={10}>
        <IconTile
          iconName={"InsertChart"}
          caption={msg("sessions.edit.steps.align.area.caption")}
          text="Self-awareness"
        />
        <IconTile
          iconName={"InsertChart"}
          caption={msg("sessions.edit.steps.align.goal.caption")}
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
const ReflectStep = ({ ...props }) => {
  return (
    <FormStepCard {...props}>
      <Todos items={exampleTodos} keyProp="id" />
      <P>
        Dolores perspiciatis ea et ut est magnam eaque sed provident. Adipisci
        unde iure ipsum ullam est molestiae. Ut deleniti et provident et placeat
        eos qui. Cumque ex ut. Iure harum labore. Soluta qui consequuntur rem.
      </P>
      <P>
        Animi eos autem libero hic at sint molestiae accusamus. Et sed aliquid
        possimus minima expedita quia dicta ea. Et autem voluptatem ullam
        voluptates ipsa fuga ut aut dolorem. Consequuntur tempora rerum
        molestiae dignissimos molestiae distinctio reiciendis.
      </P>
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

const setActionStepsKeyName = "steps";
const SetActionStepsStep = ({ onFinish, data, ...props }) => {
  return (
    <FormStepCard
      {...props}
      data={data}
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
      <P>
        Dolores perspiciatis ea et ut est magnam eaque sed provident. Adipisci
        unde iure ipsum ullam est molestiae. Ut deleniti et provident et placeat
        eos qui. Cumque ex ut. Iure harum labore. Soluta qui consequuntur rem.
      </P>
      <P>
        Animi eos autem libero hic at sint molestiae accusamus. Et sed aliquid
        possimus minima expedita quia dicta ea. Et autem voluptatem ullam
        voluptates ipsa fuga ut aut dolorem. Consequuntur tempora rerum
        molestiae dignissimos molestiae distinctio reiciendis.
      </P>
      <FocusedList
        items={[
          "What have you learned when aiming to that action step?",
          "What were you happy with?",
        ]}
      />
      <ActionSteps
        name={setActionStepsKeyName}
        rules={{ required: true, minLength: 1 }}
        sx={{ my: 5 }}
      />
    </FormStepCard>
  );
};

const createSessionEntry = (timestamp, { reflection, steps }) => {
  return {
    timestamp,
    steps: steps,
    secondSession: {
      timestamp: new Date().getTime(),
      date: new Date().toISOString(),
      reflection,
      // steps,
    },
  };
};

function EditSessionPageInner() {
  const msg = useMsg();

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

  const { id } = useParams();
  const timestamp = Number(id);
  const history = useHistoryEntries({
    storageKey: "sessions_history",
    initialSelectedId: timestamp,
    idKey: "timestamp",
  });
  const entry = history.selected; // get({ id }); // TODO

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
    initialData: {
      ...entry,
      steps: entry?.steps?.length ? entry.steps : DEFAULT_VALUE_ROW,
    },
  });
  const handleFinish = (data) => {
    console.log("%chandleFinish", "color:pink;", data);
    const entry = createSessionEntry(timestamp, data);

    history.update(entry);
    setFinished(true);
  };
  console.log("[EditSessionPage.rndr]", { id, data, entry, history });

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
          onFinish={handleFinish}
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
