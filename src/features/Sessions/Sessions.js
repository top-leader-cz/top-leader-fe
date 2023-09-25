import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQuery } from "react-query";
import { Navigate, generatePath, useNavigate } from "react-router-dom";
import { I18nContext } from "../../App";
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
        <Typography variant="h2" fontSize={14}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

const ActionStepsTodo = ({ steps = [], label }) => {
  // const {control} = useForm({defaultValues: Object.fromEntries(steps.map(({id, label}) => ))})
  return (
    <>
      <P sx={{ mt: 3, mb: 2 }}>
        <b>{label}</b>
      </P>
      <Todos items={steps} keyProp="label" />
    </>
  );
};
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
    actionSteps,
  } = {},
  sx = { mb: 3 },
}) => {
  const { areas } = useAreasDict();
  const msg = useMsg();
  const { i18n } = useContext(I18nContext);
  const parsed = i18n.parseUTCLocal(date);
  const formattedDate = i18n.formatLocalMaybe(parsed, "Pp");

  // console.log("[SC.rndr]", {
  //   date,
  //   formattedDate,
  //   parsed,
  // });

  return (
    <Card sx={{ ...sx }} elevation={0}>
      <CardActionArea
        sx={{ height: "100%" }}
        disableRipple
        href={id ? generatePath(routes.editSession, { id }) : undefined} // TODO?
      >
        <CardContent sx={{ display: "flex", flexDirection: "row" }}>
          <Box>
            <P>{formattedDate} -</P>
          </Box>
          <Box sx={{ width: "100%" }}>
            <P>{type}</P>
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
            <P sx={{ my: 3 }}></P>
            <ActionStepsTodo
              steps={actionSteps}
              label={<Msg id="sessions.card.goals.title" />}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

function Sessions() {
  const { authFetch } = useAuth();
  const sessionsQuery = useQuery({
    queryKey: ["user-sessions", "history"],
    queryFn: () => authFetch({ url: `/api/latest/history/USER_SESSION` }),
    // {"areaOfDevelopment":[],"longTermGoal":null,"motivation":null,"actionSteps":[]}
  });
  const sel = useMakeSelectable({
    entries: sessionsQuery.data ?? [],
    map: (el) => ({
      // Right menu
      status: "Private session",
      id: el.id,
      date: el.createdAt,
      timestamp: new Date(el.createdAt).getTime(),

      type: "Private session",
      areaOfDevelopment: el.data.areaOfDevelopment,
      longTermGoal: el.data.longTermGoal,
      motivation: el.data.motivation,
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
              onClick: () => navigate(routes.newSession),
            }}
          />
        }
      >
        <Header text={<Msg id="sessions.heading" />} />
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <Card sx={{}} elevation={0}>
              Error occured: {error.message}
            </Card>
          )}
        >
          {sel.selected && <SessionCard session={sel.selected} />}
        </ErrorBoundary>
      </Layout>
    </MsgProvider>
  );

  if (!sel.all?.length && !!sessionsQuery.data)
    // TODO: test properly, sometimes redirects when there are sessions
    return <Navigate to={routes.newSession} replace />;

  return <QueryRenderer {...sessionsQuery} success={renderSuccess} />;
}

export default Sessions;
