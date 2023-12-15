import { useContext, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { routes } from "../../routes";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { StepperRightMenu } from "./NewSession";
import { SessionStepCard } from "./SessionStepCard";
import { useUserReflectionMutation, useUserSessionQuery } from "./api";
import { messages } from "./messages";
import { DEFAULT_VALUE_ROW } from "./steps/ActionStepsStep";
import { Finished } from "./steps/Finished";
import { useEditSteps, useSteps } from "./steps/useSessionSteps";

function EditSessionPageInner() {
  const msg = useMsg();
  const { id } = useParams();
  const { i18n } = useContext(I18nContext);

  const [adjust, setAdjust] = useState(false);
  const [finished, setFinished] = useState(false);

  const { steps } = useEditSteps({ adjust });
  const navigate = useNavigate();
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
      previousActionSteps: [],
    },
  });

  const sessionQuery = useUserSessionQuery({});

  const activeStepIndexRef = useRef(activeStepIndex);
  activeStepIndexRef.current = activeStepIndex;

  const mutation = useUserReflectionMutation({
    adjust,
    onSuccess: () =>
      console.log("mutation.onSuccess", data) || setFinished(true),
  });

  const handleFinish = (data) => {
    console.log("[NewSession.onFinish]", { data });
    if (data.areaOfDevelopment && adjust)
      console.log(
        "[NewSession.onFinish] TODO? Area changed, call user sessions?"
      );
    mutation.mutate(data);
    // setFinished(true);
  };

  console.log("[EditSessionPage.rndr]", {
    id,
    data,
    activeStepIndex,
    steps,
    activeStep,
    adjust,
  });

  if (sessionQuery.isLoading) return <QueryRenderer isLoading />;

  const formattedDate = i18n.formatLocalMaybe(new Date(), "P");

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
          motivation={sessionQuery.data?.motivation}
          lastReflection={sessionQuery.data?.lastReflection}
          previousActionSteps={sessionQuery.data?.actionSteps ?? []}
          previousArea={sessionQuery.data?.areaOfDevelopment ?? ""}
          previousGoal={sessionQuery.data?.longTermGoal ?? ""}
          setAdjust={setAdjust}
          submitDisabled={mutation.isLoading}
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
