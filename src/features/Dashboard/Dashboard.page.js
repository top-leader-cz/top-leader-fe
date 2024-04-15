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
import { always, anyPass, ifElse, map, path, pick, prop } from "ramda";
import React, { useMemo, useState } from "react";
import { useIsFetching } from "react-query";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { primary25, primary500 } from "../../theme";
import { useAuth } from "../Authorization";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";
import { ShowMore } from "../Coaches/CoachCard";
import { QueryRenderer } from "../QM/QueryRenderer";
import { useTalentsDict } from "../Strengths/talents";
import { useValuesDict } from "../Values/values";
import { JourneyRightMenu } from "./JourneyRightMenu";
import { messages } from "./messages";

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

export const useStrengths = ({ keys = [] }) => {
  const { talents } = useTalentsDict();
  return useMemo(
    () =>
      keys.map((key) => ({
        key,
        name: talents[key]?.name || key,
        label: [talents[key]?.emoji ?? "👤", talents[key]?.name || key]
          .filter(Boolean)
          .join(" "),
      })),
    [keys, talents]
  );
};

const DashboardCardAssessment = ({ selectedKeys = [] }) => {
  const items = useStrengths({ keys: selectedKeys?.slice(0, 5) });
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

const ExpandableInfoBox = ({ heading, text }) => {
  const showMoreMaxChars = 1500;

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

const InsightsTipsHeader = ({ title, perex, isLoading = false }) => {
  const size = 14;
  return (
    <>
      <Typography sx={{ mb: 2, color: primary500, fontSize: size }}>
        {isLoading ? (
          <CircularProgress
            color="inherit"
            size={size}
            // thickness={2}
            sx={{ opacity: 0.25, mr: 1 }}
          />
        ) : (
          <Icon name={"AutoAwesome"} sx={{ fontSize: "inherit", mr: 1 }} />
        )}
        {title}
      </Typography>
      {perex && <Typography sx={{ mb: 2 }}>{perex}</Typography>}
    </>
  );
};

const AIPromptsCategory = ({ title, perex, items = [], isLoading = false }) => {
  const visibleItems = items.filter(prop("text"));
  if (!visibleItems.length) return null;

  return (
    <Box>
      <InsightsTipsHeader title={title} perex={perex} isLoading={isLoading} />
      {visibleItems.map(({ heading, text }) => (
        <ExpandableInfoBox
          key={heading}
          elevation={0}
          heading={heading}
          text={text}
        />
      ))}
    </Box>
  );
};

const UnlockAI = () => {
  const msg = useMsg();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  return (
    <Box>
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
    </Box>
  );
};

const anyTruthy = (subProp, propNames, obj) =>
  anyPass(map((propName) => path([propName, subProp]), propNames))(obj);

const insightsKeys = ["leaderShipStyle", "leaderPersona", "animalSpirit"];
const tipsKeys = ["leadershipTip", "personalGrowthTip"];
const allKeys = [...insightsKeys, ...tipsKeys];

const isGenerating = (data, query) => {
  if (!data) return false;
  const isGeneratingResults = anyTruthy("isPending", allKeys, data);
  // console.log("[isGenerating]", { isGeneratingResults, data, query });
  return isGeneratingResults;
};

const POLL_INTERVAL = 7 * 1000;
// const POLL_INTERVAL = 3 * 1000;

const DashboardCardAI = () => {
  const msg = useMsg();
  // Does not return anything, BE side effect to trigger generation
  const generateQuery = useMyQuery({
    queryKey: ["user-insight", "generate-tips"],
    fetchDef: {
      url: `/api/latest/user-insight/generate-tips`,
      to: always({ TODO: "@JK" }),
    },
    // refetch* apply only to stale query:
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,

    staleTime: 8 * 60 * 60 * 1000,
    cacheTime: Infinity, // never garbage collect inactive query
  });
  const insightsQuery = useMyQuery({
    enabled: !generateQuery.isLoading,
    queryKey: ["user-insight"],
    fetchDef: { url: `/api/latest/user-insight` },
    refetchInterval: ifElse(isGenerating, always(POLL_INTERVAL), always(false)),
    // refetchOnWindowFocus: false,
  });

  // prettier-ignore
  // useEffect( () => () => { console.log("%c[DashboardCardAI.eff.unmounting] in React.StrictMode mode executes nested tree queries twice, but user-info query once", "color:pink;");  }, [] );
  // prettier-ignore
  // if (process.env.NODE_ENV === "development") console.log("[DashboardCardAI.rndr]", { insights: insightsQuery.status, generate: generateQuery.status, insightsQuery, generateQuery, });

  return (
    <Card sx={{ minHeight: minCardHeight, mb: 3 }}>
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
          success={({ data }) =>
            !anyTruthy("text", allKeys, data) ? (
              <UnlockAI /> // All empty
            ) : (
              // Some data available
              <Box sx={{ display: "flex", flexFlow: "column nowrap", gap: 1 }}>
                <AIPromptsCategory
                  title={msg("dashboard.cards.ai.insights.title")}
                  perex={msg("dashboard.cards.ai.insights.perex")}
                  items={[
                    {
                      heading: msg(
                        "dashboard.cards.ai.insights.leadership-style.title"
                      ),
                      text: data[insightsKeys[0]]?.text,
                    },
                    {
                      heading: msg(
                        "dashboard.cards.ai.insights.leader-persona.title"
                      ),
                      text: data[insightsKeys[1]]?.text,
                    },
                    {
                      heading: msg(
                        "dashboard.cards.ai.insights.animal-spirit.title"
                      ),
                      text: data[insightsKeys[2]]?.text,
                    },
                  ]}
                  isLoading={anyTruthy("isPending", insightsKeys, data)}
                />
                <AIPromptsCategory
                  title={msg("dashboard.cards.ai.tips.title")}
                  // perex={msg("dashboard.cards.ai.tips.perex")}
                  items={[
                    {
                      heading: msg("dashboard.cards.ai.tips.leadership.title"),
                      text: data[tipsKeys[0]]?.text,
                    },
                    {
                      heading: msg(
                        "dashboard.cards.ai.tips.personal-growth.title"
                      ),
                      text: data[tipsKeys[1]]?.text,
                    },
                  ]}
                  isLoading={anyTruthy("isPending", tipsKeys, data)}
                />
              </Box>
            )
          }
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

export function DashboardPage() {
  const { user, isCoach } = useAuth();
  const { username, firstName } = user.data;
  const displayName = firstName || username;
  // console.log("[Dashboard.rndr]", { user });

  // prettier-ignore
  // useEffect( () => () => { console.log("%c[DashboardPage.unmounting]", "color:pink;");  }, [] );

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
