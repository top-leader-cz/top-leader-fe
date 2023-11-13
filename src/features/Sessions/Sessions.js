import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useCallback, useContext } from "react";
import { useQuery } from "react-query";
import { Navigate, generatePath, useNavigate } from "react-router-dom";

import { Header } from "../../components/Header";
import { HistoryRightMenu } from "../../components/HistoryRightMenu";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { Todos } from "../../components/Todos";
import { P } from "../../components/Typography";
import { routes } from "../../routes";
import { useAuth } from "../Authorization";
import { QueryRenderer } from "../QM/QueryRenderer";
import { useMakeSelectable } from "../Values/MyValues";
import { useAreasDict } from "./areas";
import { messages } from "./messages";
import { I18nContext } from "../I18n/I18nProvider";
import { parametrizedRoutes } from "../../routes/constants";
import { ErrorBoundary } from "../../components/ErrorBoundary";

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
  // const {control} = useForm({defaultValues: Object.fromEntries(steps.map(({id, label}) => ))})
  return (
    <>
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
              <P>{label}</P>
            </li>
          );
        })}
      </ul>
      {/* <Todos items={steps} keyProp="label" /> */}
    </>
  );
};

const translateSessionType = ({ type, msg }) =>
  msg.maybe(`sessions.card.type.${type}`) || msg(`sessions.card.type.default`);
// {"areaOfDevelopment":[],"longTermGoal":null,"motivation":null,"actionSteps":[]}
// TODO: grid
const SessionCard = ({
  session: {
    timestamp,
    id = timestamp,
    date,
    type,
    areaOfDevelopment,
    longTermGoal,
    motivation,
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
        sx={{ height: "100%" }}
        disableRipple
        href={id ? parametrizedRoutes.editSession({ id }) : undefined}
      >
        <CardContent sx={{ display: "flex", flexDirection: "row" }}>
          <Box>
            <P>{formattedDate}&nbsp;-&nbsp;</P>
          </Box>
          <Box sx={{ width: "100%" }}>
            <P>{translateSessionType({ type, msg })}</P>
            <Box sx={{ display: "flex", mt: 3 }}>
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
            <P sx={{ my: 3 }}>{reflection || motivation}</P>
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

export const useSessionsQuery = (qParams = {}) => {
  const { authFetch } = useAuth();
  const { language } = useContext(I18nContext);

  const sessionsQuery = useQuery({
    queryKey: ["user-sessions", "history"],
    queryFn: () =>
      authFetch({ url: `/api/latest/history/USER_SESSION` }).then((data) => {
        const sortAlphaNum = ({ createdAt: a }, { createdAt: b }) =>
          b.localeCompare(a, language, { numeric: true });
        console.log({ data });
        return data.sort(sortAlphaNum);
      }),
    ...qParams,
    // {"areaOfDevelopment":[],"longTermGoal":null,"motivation":null,"actionSteps":[]}
  });
  return sessionsQuery;
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
      reflection: el.data.reflection,
      actionSteps: el.data.actionSteps,
    }),
  });

  // const query = useQuery({
  //   queryKey: ["user-sessions"],
  //   queryFn: () => authFetch({ url: `/api/latest/user-sessions` }),
  //   // {"areaOfDevelopment":[],"longTermGoal":null,"motivation":null,"actionSteps":[]}
  // });
  const navigate = useNavigate();

  console.log("[Sessions.rndr]", {
    sessionsQuery,
    sel,
  });

  const renderSuccess = () => (
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
        <ErrorBoundary>
          {sel.all?.map((session) => (
            <SessionCard session={session} />
          ))}
          {/* {sel.selected && <SessionCard session={sel.selected} />} */}
        </ErrorBoundary>
      </Layout>
    </MsgProvider>
  );

  if (!sel.all?.length && !!sessionsQuery.data)
    return <Navigate to={routes.newSession} replace />;

  return <QueryRenderer {...sessionsQuery} success={renderSuccess} />;
}

export default Sessions;
