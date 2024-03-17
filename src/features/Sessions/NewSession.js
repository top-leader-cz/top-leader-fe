import { Box, Button, Divider } from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
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
import { Finished } from "./steps/Finished";
import { useNewSessionSteps, useSteps } from "./steps/useSessionSteps";
import { Header } from "../../components/Header";

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

function NewSessionPageInner() {
  const msg = useMsg();
  const { i18n } = useContext(I18nContext);

  const { steps: STEPS } = useNewSessionSteps();

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
  console.log("[NewSessionPage.rndr]", { data, query, isLoading });

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
      <Header
        text={<Msg id="sessions.new.header" />}
        back={{ href: routes.sessions }}
        actionButton={{
          variant: "text",
          color: "error",
          children: msg("sessions.new.aside.end-button"),
          onClick: () => navigate(routes.sessions),
          startIcon: <Icon name="StopCircle" />,
        }}
        sx={{
          justifyContent: "space-between",
        }}
      />
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
