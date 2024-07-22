import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import { always, any, ifElse, pick, pipe, prop, values } from "ramda";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { gray50 } from "../../theme";
import { useMyQuery } from "../Authorization/AuthProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { useStrengths } from "../Strengths/talents";
import { useValuesDict } from "../Values/values";
import { ExpandableInfoBox } from "./ExpandableInfoBox";
import { HeadingWithIcon } from "./HeadingWithIcon";
import { dashboardMessages } from "./messages";

const DashboardIcon = ({ iconName, color, size = 100, sx = {} }) => {
  return (
    <Avatar
      variant="rounded"
      sx={{
        width: size,
        height: size,
        borderRadius: `${size / 4}px`,
        color,
        bgcolor: alpha(color, 0.2),
        ...sx,
      }}
    >
      <Icon name={iconName} sx={{ width: 50, height: 50 }} />
    </Avatar>
  );
};

const minCardHeight = 215;

const AIPromptsCategory = ({ title, perex, items = [], isLoading = false }) => {
  const visibleItems = items.filter(prop("text"));
  if (!visibleItems.length) return null;

  return (
    <Box>
      <HeadingWithIcon
        title={title}
        perex={perex}
        isLoading={isLoading}
        sx={{ mb: 2 }}
      />
      {visibleItems.map(({ heading, text }) => (
        <ExpandableInfoBox
          key={heading}
          elevation={0}
          heading={heading}
          text={text}
          hideEmpty
        />
      ))}
    </Box>
  );
};

const VerticalConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.root}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      //   borderColor: "lime",
      minHeight: "16px",
    },
  },
  //   [`&.${stepConnectorClasses.active}`]: { [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main, }, },
  //   [`&.${stepConnectorClasses.completed}`]: { [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main, }, },
  //   [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0", borderTopWidth: 3, borderRadius: 1, },
}));

const UnlockAISteps = ({ assessed, evaluated }) => {
  const msg = useMsg();
  const navigate = useNavigate();

  const switchOrder = evaluated && !assessed;
  const activeStepIndex = +evaluated + assessed;

  const VALUES_STEP = {
    label: msg("dashboard.cards.ai.empty.steps.values.title"),
    buttonLabel: msg("dashboard.cards.ai.empty.steps.values.button"),
    onClick: () => navigate(routes.setValues),
  };
  const STRENGTHS_STEP = {
    label: msg("dashboard.cards.ai.empty.steps.strengths.title"),
    buttonLabel: msg("dashboard.cards.ai.empty.steps.strengths.button"),
    onClick: () => navigate(routes.assessment),
  };
  const steps = [
    ...(switchOrder
      ? [VALUES_STEP, STRENGTHS_STEP]
      : [STRENGTHS_STEP, VALUES_STEP]),
    { label: msg("dashboard.cards.ai.empty.steps.explore.title") },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <P>{msg("dashboard.unlock-steps.perex")}</P>
      <Stepper
        activeStep={activeStepIndex}
        orientation="vertical"
        connector={<VerticalConnector />}
      >
        {steps.map(({ label, buttonLabel, onClick }, index) => {
          const stepLabelProps =
            index === activeStepIndex
              ? {
                  sx: {
                    padding: 0,
                    cursor: onClick ? "pointer" : "default",
                  },
                  onClick,
                }
              : {
                  sx: {
                    padding: 0,
                  },
                };
          return (
            <Step key={label}>
              <StepLabel {...stepLabelProps}>{label}</StepLabel>
              {onClick && buttonLabel && (
                <StepContent>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={onClick}
                    sx={{ mt: 2 }}
                  >
                    {buttonLabel}
                  </Button>
                </StepContent>
              )}
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export const anyTruthy = (subProp, propNames, obj) =>
  pipe(pick(propNames), values, any(prop(subProp)))(obj);

const insightsKeys = ["leaderShipStyle", "leaderPersona", "animalSpirit"];
const tipsKeys = [
  "leadershipTip",
  // "personalGrowthTip"
];
export const actionBlueprintKey = "personalGrowthTip"; // TODO: BE @jk?
const allKeys = [...insightsKeys, ...tipsKeys];

const isGenerating = (data, query) => {
  if (!data) return false;
  const isGeneratingResults = anyTruthy("isPending", allKeys, data);
  // console.log("[isGenerating]", { isGeneratingResults, data, query });
  return isGeneratingResults;
};

const POLL_INTERVAL = 7 * 1000;

export const useUserInsights = () => {
  const generateQuery = useMyQuery({
    queryKey: ["user-insight", "generate-tips"],
    fetchDef: {
      url: `/api/latest/user-insight/generate-tips`,
      to: always({ TODO: "@JK" }),
    },
    staleTime: 8 * 60 * 60 * 1000,
    cacheTime: Infinity, // never garbage collect inactive query
  });
  const insightsQuery = useMyQuery({
    enabled: !generateQuery.isLoading,
    queryKey: ["user-insight"],
    fetchDef: { url: `/api/latest/user-insight` },
    refetchInterval: ifElse(isGenerating, always(POLL_INTERVAL), always(false)),
  });

  return insightsQuery;
};

const DashboardCardAI = ({ insightsQuery }) => {
  const msg = useMsg({ dict: dashboardMessages });
  // Does not return anything, BE side effect to trigger generation
  //   const { user } = useAuth();
  //   const assessed = !!user.data.strengths?.length;
  //   const evaluated = !!user.data.values?.length;
  if (!insightsQuery.data || !anyTruthy("text", allKeys, insightsQuery.data))
    return null;

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
          loading={null}
          errored={null}
          success={({ data }) => {
            // TODO: rm or switch order? This is never displayed now
            if (!anyTruthy("text", allKeys, insightsQuery.data))
              return <UnlockAISteps />;

            return (
              <Box sx={{ display: "flex", flexFlow: "column nowrap", gap: 1 }}>
                <AIPromptsCategory
                  title={msg("dashboard.cards.ai.insights.title")}
                  //   perex={msg("dashboard.cards.ai.insights.perex")}
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
            );
          }}
        />
      </CardContent>
    </Card>
  );
};

const RightMenuCardExpandable = ({ title, perex, href, items, icon }) => {
  return (
    <Card sx={{}}>
      <Accordion
        sx={{
          bgcolor: gray50,
          borderRadius: "8px",
          "&:before": {
            display: "none", // remove border
          },
        }}
      >
        <AccordionSummary
          expandIcon={<Icon name="ExpandMore" />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{}}
        >
          <Box>
            <DashboardIcon
              iconName={icon.name ?? "FitnessCenterOutlined"}
              color={icon.color ?? "#0BA5EC"}
              size={64}
              sx={{ float: "left", mr: 2, mb: 1 }}
            />
            <H2 sx={{ mb: 1, fontSize: 16, fontWeight: 500 }}>{title}</H2>
            <P>{perex}</P>
          </Box>
        </AccordionSummary>
        <CardActionArea sx={{}} href={href}>
          <AccordionDetails>
            {items.map((item) => (
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
            ))}
          </AccordionDetails>
        </CardActionArea>
      </Accordion>
    </Card>
  );
};

export const DashboardRightMenu = ({ user, insightsQuery }) => {
  // const { user } = useAuth();
  const msg = useMsg({ dict: dashboardMessages });

  //   const assessed = false;
  //   const evaluated = false;
  const assessed = !!user.data.strengths?.length;
  const evaluated = !!user.data.values?.length;

  const strengthsItems = useStrengths({
    keys: user.data.strengths?.slice(0, 5),
  });

  const valuesDict = useValuesDict();
  const valuesItems = useMemo(
    () =>
      user.data.values.map((key) => ({
        label: [valuesDict[key]?.emoji ?? "⚓️", valuesDict[key]?.name || key]
          .filter(Boolean)
          .join(" "),
      })),
    [user.data.values, valuesDict]
  );

  // console.log("[DashboardRightMenu]", { user });

  return (
    <ScrollableRightMenu
      heading={<Msg id={"dashboard.my-leader-profile"} />}
      sx={{ height: "auto", flex: 1 }}
      wrapperSx={{ gap: 2 }}
    >
      {!assessed && !evaluated && (
        <UnlockAISteps assessed={assessed} evaluated={evaluated} />
      )}
      {assessed && (
        <RightMenuCardExpandable
          title={
            strengthsItems.length
              ? msg("dashboard.cards.strengths.title.filled")
              : msg("dashboard.cards.strengths.title.empty")
          }
          perex={msg("dashboard.cards.strengths.perex")}
          href={strengthsItems.length ? routes.strengths : routes.assessment}
          items={strengthsItems}
          icon={{ name: "FitnessCenterOutlined", color: "#0BA5EC" }}
        />
      )}
      {evaluated && (
        <RightMenuCardExpandable
          title={
            valuesItems.length
              ? msg("dashboard.cards.values.title.filled")
              : msg("dashboard.cards.values.title.empty")
          }
          perex={msg("dashboard.cards.values.perex")}
          href={valuesItems.length ? routes.myValues : routes.setValues}
          items={valuesItems}
          icon={{ name: "JoinRight", color: "#2E90FA" }}
        />
      )}
      <DashboardCardAI insightsQuery={insightsQuery} />
    </ScrollableRightMenu>
  );
};
