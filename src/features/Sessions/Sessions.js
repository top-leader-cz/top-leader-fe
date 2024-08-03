import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { descend, prop, sort } from "ramda";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Header } from "../../components/Header";
import { HistoryRightMenu } from "../../components/HistoryRightMenu";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { P } from "../../components/Typography";
import { routes } from "../../routes";
import { useMyQuery } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { useMakeSelectable } from "../Values/MyValues";
import { useAreasDict } from "./areas";
import { messages } from "./messages";

const SessionCardIconTile = ({ iconName, caption, text, sx = {} }) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      width={"100%"}
      sx={sx}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 32,
          height: 32,
          bgcolor: "#DAD2F1",
          // borderRadius: 3,
        }}
      >
        <Icon name={iconName} sx={{ fontSize: 16, color: "primary.main" }} />
      </Avatar>
      <Box sx={{ display: "flex", flexDirection: "column", px: 1 }}>
        <Typography>{caption}</Typography>
        <P emphasized>{text}</P>
      </Box>
    </Box>
  );
};

export const ActionStepsReadOnly = ({
  steps = [],
  label,
  heading = label && (
    <P emphasized sx={{ mt: 3, mb: 2 }}>
      {label}
    </P>
  ),
}) => {
  return (
    <Box sx={{ maxWidth: { xs: 200, sm: 250, md: 350, lg: 450, xl: 750 } }}>
      {heading}
      <ul style={{ paddingLeft: "24px", color: "#667085" /* gray/500 */ }}>
        {steps.map(({ id, label, date, checked }, i) => {
          return (
            <li
              key={id}
              style={{
                paddingTop: "10px",
                textDecoration: checked ? "line-through" : "none",
              }}
            >
              <P sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {label}
              </P>
            </li>
          );
        })}
      </ul>
    </Box>
  );
};

const translateSessionType = ({ type, msg }) =>
  msg.maybe(`sessions.card.type.${type}`) || msg(`sessions.card.type.default`);

const SessionCard = ({
  session: {
    timestamp,
    id = timestamp,
    date,
    type,
    areaOfDevelopment,
    longTermGoal,
    motivation,
    lastReflection,
    reflection,
    actionSteps,
  } = {},
  sx = { mb: 3 },
}) => {
  const { areas } = useAreasDict();
  const msg = useMsg();
  const { i18n } = useContext(I18nContext);
  const parsed = i18n.parseUTCLocal(date);
  const formattedDate = i18n.formatLocalMaybe(parsed, "P");

  // console.log("[SC.rndr]", {
  //   date,
  //   formattedDate,
  //   parsed,
  // });

  return (
    <Card sx={{ ...sx }}>
      <CardActionArea
        sx={{ height: "100%", cursor: "auto" }}
        disableRipple
        // href={id ? parametrizedRoutes.editSession({ id }) : undefined}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <P>{formattedDate}&nbsp;-&nbsp;</P>
          </Box>
          <Box sx={{ width: "100%" }}>
            <P>{translateSessionType({ type, msg })}</P>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                mt: 3,
              }}
            >
              <SessionCardIconTile
                iconName={"InsertChart"}
                caption={msg("sessions.edit.steps.align.area.caption")}
                text={areas[areaOfDevelopment]?.label || areaOfDevelopment}
                sx={{}}
              />
              <SessionCardIconTile
                iconName={"InsertChart"}
                caption={msg("sessions.edit.steps.align.goal.caption")}
                text={longTermGoal}
                // text="Giving speeches to audiences regularly" // TODO: width
                sx={{}}
              />
            </Box>
            <P
              sx={{
                my: 3,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 2,
              }}
            >
              {reflection || lastReflection || motivation}
            </P>
            <ActionStepsReadOnly
              steps={actionSteps}
              label={<Msg id="sessions.card.goals.title" />}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

// const sortAlphaNum = ({ createdAt: a }, { createdAt: b }) => b.localeCompare(a, language, { numeric: true });
export const useSessionsQuery = (rest = {}) => {
  const query = useMyQuery({
    queryKey: ["user-sessions", "history"],
    fetchDef: {
      url: `/api/latest/history/USER_SESSION`,
      to: sort(descend(prop("createdAt"))),
    },
    refetchOnWindowFocus: false,
    ...rest,
  });
  return query;
};

function Sessions() {
  const msg = useMsg({ dict: messages });
  const sessionsQuery = useSessionsQuery();
  const sel = useMakeSelectable({
    entries: sessionsQuery.data ?? [],
    map: (el) => ({
      // Right menu
      status: translateSessionType({ type: el.data.type, msg }),
      id: el.id,
      date: el.createdAt,
      timestamp: new Date(el.createdAt).getTime(),
      // root
      username: el.username,
      type: el.type,
      // data
      areaOfDevelopment: el.data.areaOfDevelopment,
      longTermGoal: el.data.longTermGoal,
      motivation: el.data.motivation,
      lastReflection: el.data.lastReflection,
      reflection: el.data.reflection, // TODO?
      actionSteps: el.data.actionSteps,
    }),
  });
  const navigate = useNavigate();

  console.log("[Sessions.rndr]", {
    sessionsQuery,
    sel,
  });

  if (!sel.all?.length && !!sessionsQuery.data)
    return <Navigate to={routes.newSession} replace />;

  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={
          <HistoryRightMenu
            heading={<Msg id="sessions.aside.title" />}
            history={sel}
            // onRemove={history.remove}
            buttonProps={{
              children: <Msg id="sessions.aside.start-button" />,
              onClick: () => navigate(routes.startSession),
            }}
          />
        }
      >
        <Header text={<Msg id="sessions.heading" />} />
        <QueryRenderer
          query={sessionsQuery}
          success={() =>
            sel.all?.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))
          }
        />
        <Box sx={{ pb: "1px" }} />
      </Layout>
    </MsgProvider>
  );
}

export default Sessions;
