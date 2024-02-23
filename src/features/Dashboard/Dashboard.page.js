import { Masonry } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { has, pick } from "ramda";
import React, { Suspense, useMemo, useState } from "react";
import { useIsFetching } from "react-query";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { useAuth } from "../Authorization";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";
import { useAreas } from "../Sessions/steps/AreaStep";
import { useTalentsDict } from "../Strengths/talents";
import { useValuesDict } from "../Values/values";
import { JourneyRightMenu } from "./JourneyRightMenu";
import { messages } from "./messages";
import { primary25, primary500 } from "../../theme";
import { ShowMore } from "../Coaches/CoachCard";
import { QueryRenderer, SuspenseRenderer } from "../QM/QueryRenderer";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { VerticalStepper } from "../Sessions/VerticalStepper";
import { useNavigate } from "react-router-dom";

const DashboardIcon = ({ iconName, color, sx = {} }) => {
  return (
    <Avatar
      variant="rounded"
      sx={{
        width: 100,
        height: 100,
        borderRadius: "28px",
        color,
        bgcolor: alpha(color, 0.2),
        ...sx,
      }}
    >
      <Icon name={iconName} sx={{ width: 50, height: 50 }} />
    </Avatar>
  );
};

const sx = {
  display: "flex",
  flexFlow: "column nowrap",
  justifyContent: "space-between",
  height: "100%",
};

const useNoteMutation = () =>
  useMyMutation({
    debug: true,
    // debug: "d",
    fetchDef: {
      method: "POST",
      url: `/api/latest/user-info/notes`,
      from: pick(["notes"]),
    },
    invalidate: { queryKey: ["user-info"] },
    snackbar: { success: false, error: true },
  });

const DashboardCardNotes = () => {
  const msg = useMsg();
  const { user } = useAuth();
  const [note, setNote] = useState(user.data.notes || "");
  const noteMutation = useNoteMutation();
  const isFetchingUser = useIsFetching({ queryKey: ["user-info"] });
  // useEffect(() => { setNote?.(user.data.notes); }, [user.data.notes])

  // const { isLoading, isFetching, isPending } = noteMutation;
  // console.log({ isLoading, isFetching, isPending, noteMutation });

  return (
    <Card>
      <CardContent sx={{ position: "relative", ...sx }}>
        <H2 sx={{ mb: 2 }}>{msg("dashboard.cards.notes.title")}</H2>
        <TextField
          multiline
          minRows={18}
          placeholder={msg("dashboard.cards.notes.placeholder.empty")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          // defaultValue={user.data.notes || ""}
          onBlur={(e) => {
            if (note !== user.data.notes) {
              // TODO: race condition: Cmd+Z + Blur during user loading after save?
              noteMutation.mutate({
                notes: note,
                previousNotes: user.data.notes,
              });
            }
          }}
        />
        <CircularProgress
          color="inherit"
          size={20}
          // thickness={2}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            opacity: noteMutation.isLoading ? 1 : isFetchingUser ? 0.1 : 0,
          }}
        />
      </CardContent>
    </Card>
  );

  // return (
  //   <Card>
  //     <CardContent sx={sx}>
  //       <H2 sx={{ mb: 2 }}>{msg("dashboard.cards.notes.title")}</H2>
  //       <QueryRenderer
  //         {...noteQuery}
  //         loading={() => <NotesLoader />}
  //         success={({ data }) => {
  //           return (
  //             <TextField
  //               multiline
  //               minRows={18}
  //               placeholder={msg("dashboard.cards.notes.placeholder.empty")}
  //               defaultValue={user.data.notes}
  //               onBlur={(e) => noteMutation.mutate({ note: e.target.value })}
  //               // sx={
  //               //   !isLoading
  //               //     ? undefined
  //               //     : {
  //               //         visibility: "hidden",
  //               //       }
  //               // }
  //               // value={note}
  //               // onChange={(e) => setNote({ note: e.target.value })}
  //             />
  //           );
  //         }}
  //       />
  //       {/* {isLoading && <NotesLoader />} */}

  //     </CardContent>
  //   </Card>
  // );
};

const minCardHeight = 215;
const DashboardCard = ({ title, href, items, fallbackIcon = {} }) => {
  return (
    <Card sx={{ minHeight: minCardHeight }}>
      <CardActionArea sx={{ height: "100%" }} href={href}>
        <CardContent
          sx={{
            position: "relative",
            height: "100%",
            minHeight: minCardHeight, // just for Grid
          }}
        >
          <H2 sx={{ mb: 2 }}>{title}</H2>
          {!items?.length ? (
            <DashboardIcon
              iconName={fallbackIcon.name ?? "FitnessCenterOutlined"}
              color={fallbackIcon.color ?? "#0BA5EC"}
              sx={{ position: "absolute", bottom: 24, right: 24 }}
            />
          ) : (
            items.map((item) => (
              <Chip
                sx={{
                  borderRadius: 1,
                  justifyContent: "flex-start",
                  m: 1,
                  pointerEvents: "none",
                  bgcolor: "#F9F8FF",
                  height: "auto",
                  p: 1,
                  "& .MuiChip-label": {
                    textWrap: "wrap",
                  },
                }}
                key={item.label}
                {...item}
              />
            ))
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const DashboardCardAssessment = ({ selectedKeys = [] }) => {
  const { talents } = useTalentsDict();
  const items = useMemo(
    () =>
      selectedKeys?.slice(0, 5).map((key) => ({
        label: [talents[key]?.emoji ?? "👤", talents[key]?.name || key]
          .filter(Boolean)
          .join(" "),
      })),
    [selectedKeys, talents]
  );
  const msg = useMsg();

  return (
    <DashboardCard
      title={
        items.length
          ? msg("dashboard.cards.strengths.title.filled")
          : msg("dashboard.cards.strengths.title.empty")
      }
      href={items.length ? routes.strengths : routes.assessment}
      items={items}
      fallbackIcon={{ name: "FitnessCenterOutlined", color: "#0BA5EC" }}
    />
  );
};

const DashboardCardValues = ({ selectedKeys = [] }) => {
  const valuesDict = useValuesDict();
  const items = useMemo(
    () =>
      selectedKeys.map((key) => ({
        label: [valuesDict[key]?.emoji ?? "⚓️", valuesDict[key]?.name || key]
          .filter(Boolean)
          .join(" "),
      })),
    [selectedKeys, valuesDict]
  );
  const msg = useMsg();

  return (
    <DashboardCard
      title={
        items.length
          ? msg("dashboard.cards.values.title.filled")
          : msg("dashboard.cards.values.title.empty")
      }
      href={items.length ? routes.myValues : routes.setValues}
      items={items}
      fallbackIcon={{ name: "JoinRight", color: "#2E90FA" }}
    />
  );
};

const DashboardCardFeedback = () => {
  const msg = useMsg();

  return (
    <DashboardCard
      title={msg("dashboard.cards.feedback.title")}
      href={routes.getFeedback}
      items={undefined}
      fallbackIcon={{ name: "Forum", color: "#6172F3" }}
    />
  );
};

const ExpandableInfoBox = ({ heading, text, showMoreMaxChars = 250 }) => {
  return (
    <Accordion
      sx={{
        bgcolor: primary25,
        mb: 1,
        boxShadow: "none",
        borderRadius: "6px",
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<Icon name="ExpandMore" />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          // p: 3,
          // borderRadius: 0.5,
          color: primary500,
          fontSize: 16,
          fontWeight: 500,
          py: 1,
        }}
      >
        {heading}
      </AccordionSummary>
      <AccordionDetails>
        {showMoreMaxChars ? (
          <ShowMore maxChars={showMoreMaxChars} text={text} />
        ) : (
          text
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const InsightsTipsHeader = ({ title, perex }) => {
  return (
    <>
      <Typography sx={{ mb: 2, color: primary500, fontSize: 14 }}>
        <Icon name={"AutoAwesome"} sx={{ fontSize: "inherit", mr: 1 }} />
        {title}
      </Typography>
      {perex && <Typography sx={{ mb: 2 }}>{perex}</Typography>}
    </>
  );
};

const hasInsights = (data) =>
  data.leaderShipStyleAnalysis || data.animalSpiritGuide;
const InsightsInner = ({ data }) => {
  const msg = useMsg();
  // const { data } = useMyQuery({
  //   suspense: true,
  //   queryKey: ["user-insight"],
  //   fetchDef: { url: `/api/latest/user-insight` },
  // });

  if (hasInsights(data))
    return (
      <>
        <InsightsTipsHeader
          title={msg("dashboard.cards.ai.insights.title")}
          perex={msg("dashboard.cards.ai.insights.perex")}
        />
        {data.leaderShipStyleAnalysis && (
          <ExpandableInfoBox
            elevation={0}
            heading={msg("dashboard.cards.ai.insights.leadership-style.title")}
            text={data.leaderShipStyleAnalysis}
          />
        )}
        {data.animalSpiritGuide && (
          <ExpandableInfoBox
            heading={msg("dashboard.cards.ai.insights.animal-spirit.title")}
            text={data.animalSpiritGuide}
          />
        )}
      </>
    );
};

const hasTips = (data) => data.leadershipTip || data.personalGrowthTip;
const TipsInner = ({ data }) => {
  const msg = useMsg();
  // const { data } = useMyQuery({
  //   suspense: true,
  //   queryKey: ["user-insight", "generate-tips"],
  //   fetchDef: { url: `/api/latest/user-insight/generate-tips` },
  // });

  if (hasTips(data))
    return (
      <>
        <InsightsTipsHeader title={msg("dashboard.cards.ai.tips.title")} />
        {data.leadershipTip && (
          <ExpandableInfoBox
            heading={msg("dashboard.cards.ai.tips.leadership.title")}
            text={data.leadershipTip}
          />
        )}
        {data.personalGrowthTip && (
          <ExpandableInfoBox
            heading={msg("dashboard.cards.ai.tips.personal-growth.title")}
            text={data.personalGrowthTip}
          />
        )}
      </>
    );
};

const DashboardCardAI = () => {
  const msg = useMsg();
  const { user } = useAuth();
  const navigate = useNavigate();
  const insightsQuery = useMyQuery({
    queryKey: ["user-insight"],
    fetchDef: { url: `/api/latest/user-insight` },
  });
  const tipsQuery = useMyQuery({
    queryKey: ["user-insight", "generate-tips"],
    fetchDef: { url: `/api/latest/user-insight/generate-tips` },
  });

  // const assessed = false;
  // const evaluated = false;
  const assessed = !!user.data.strengths?.length;
  const evaluated = !!user.data.values?.length;
  const switchOrder = evaluated && !assessed;
  const activeStepIndex = +evaluated + assessed;

  const VALUES_STEP = {
    label: msg("dashboard.cards.ai.empty.steps.values.title"),
    onClick: () => navigate(routes.setValues),
  };
  const STRENGTHS_STEP = {
    label: msg("dashboard.cards.ai.empty.steps.strengths.title"),
    onClick: () => navigate(routes.assessment),
  };
  const steps = [
    ...(switchOrder
      ? [VALUES_STEP, STRENGTHS_STEP]
      : [STRENGTHS_STEP, VALUES_STEP]),
    { label: msg("dashboard.cards.ai.empty.steps.explore.title") },
  ];

  if (
    tipsQuery.data &&
    !hasTips(tipsQuery.data) &&
    insightsQuery.data &&
    !hasInsights(insightsQuery.data)
  )
    return (
      <Card sx={{ minHeight: 66 }}>
        <CardContent
          sx={{
            position: "relative",
            height: "100%",
            minHeight: 66, // just for Grid
          }}
        >
          <InsightsTipsHeader
            title={msg("dashboard.cards.ai.empty.title")}
            perex={msg("dashboard.cards.ai.empty.perex")}
          />
          <Stepper activeStep={activeStepIndex} orientation="vertical">
            {steps.map(({ label, onClick }, index) => {
              const stepLabelProps =
                index === activeStepIndex
                  ? {
                      sx: {
                        padding: 0,
                        cursor: onClick ? "pointer" : "default",
                      },
                      onClick: () => onClick?.({ index, activeStepIndex }),
                    }
                  : { sx: { padding: 0 } };
              return (
                <Step key={label}>
                  <StepLabel {...stepLabelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </CardContent>
      </Card>
    );

  return (
    // <UiMaybe.Root>
    <Card sx={{ minHeight: minCardHeight }}>
      <CardContent
        sx={{
          position: "relative",
          height: "100%",
          minHeight: minCardHeight, // just for Grid
        }}
      >
        <QueryRenderer
          query={insightsQuery}
          loaderName="Skeleton"
          loaderProps={{ rows: 3, sx: { mb: 4 } }}
          success={({ data }) => <InsightsInner data={data} />}
        />
        <QueryRenderer
          query={tipsQuery}
          loaderName="Skeleton"
          loaderProps={{ rows: 3, sx: { mt: 4 } }}
          success={({ data }) => <TipsInner data={data} />}
        />
        {/* <SuspenseRenderer
          loaderName="Skeleton"
          loaderProps={{ rows: 3, sx: { mb: 4 } }}
        >
          <InsightsInner />
        </SuspenseRenderer>
        <SuspenseRenderer
          loaderName="Skeleton"
          loaderProps={{ rows: 3, sx: { mt: 4 } }}
        >
          <TipsInner />
        </SuspenseRenderer> */}
      </CardContent>
    </Card>
  );
};

const DashboardCardSession = ({ selectedKeys = [] }) => {
  const msg = useMsg();
  const selectedAreas = useAreas({
    valueArr: selectedKeys,
  });
  const items = useMemo(
    () => selectedAreas.map(({ label }) => ({ label, key: label })),
    [selectedAreas]
  );

  return (
    <DashboardCard
      title={
        items.length
          ? msg("dashboard.cards.sessions.title.filled")
          : msg("dashboard.cards.sessions.title.empty")
      }
      href={routes.startSession}
      items={items}
      fallbackIcon={{ name: "FitnessCenterOutlined", color: "#66C61C" }}
    />
  );
};

export function DashboardPage() {
  const { user, isCoach } = useAuth();
  const { username, firstName } = user.data;
  const displayName = firstName || username;
  // console.log("[Dashboard.rndr]", { user });

  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={<JourneyRightMenu user={user} />}
        header={{
          withNotifications: true,
          avatarSrc: isCoach && `/api/latest/coaches/${username}/photo`,
          heading: <Msg id="dashboard.header" values={{ user: displayName }} />,
        }}
      >
        <Box>
          <H2>
            <Msg id="dashboard.section-1.heading" />
          </H2>
          <P>
            <Msg id="dashboard.section-1.perex" />
          </P>
          <Grid
            container
            // columns={{ xs: 4, md: 8, lg: 12 }}
            spacing={2}
            sx={{ my: 3 }}
          >
            <Grid item xs={12} md={6} lg={4}>
              <DashboardCardAssessment selectedKeys={user.data.strengths} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <DashboardCardValues selectedKeys={user.data.values} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <DashboardCardFeedback />
            </Grid>
            <Grid item xs={12}>
              <DashboardCardAI />
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </MsgProvider>
  );
}
