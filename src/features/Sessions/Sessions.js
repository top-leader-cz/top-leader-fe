import { Box, Card, CardActionArea, CardContent } from "@mui/material";
import { generatePath, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { HistoryRightMenu } from "../../components/HistoryRightMenu";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { Todos } from "../../components/Todos";
import { P } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { routes } from "../../routes";
import { messages } from "./messages";
import { useAreasDict } from "./areas";
import { useQuery } from "react-query";
import { useAuth } from "../Authorization";
import { QueryRenderer } from "../QM/QueryRenderer";

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
  return (
    <Card sx={{ ...sx }} elevation={0}>
      <CardActionArea
        sx={{ height: "100%" }}
        disableRipple
        // href={generatePath(routes.editSession, { id })} // TODO?
      >
        <CardContent sx={{ display: "flex", flexDirection: "row" }}>
          <Box>
            <P>{date} -&nbsp;</P>
          </Box>
          <Box>
            <P>{type}</P>
            <P sx={{ my: 3 }}>
              <b>{areas[areaOfDevelopment]?.label || areaOfDevelopment}</b>
            </P>
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
  const history = useHistoryEntries({ storageKey: "sessions_history" });
  const { authFetch } = useAuth();
  const query = useQuery({
    queryKey: ["user-sessions"],
    queryFn: () => authFetch({ url: `/api/latest/user-sessions` }),
    // {"areaOfDevelopment":[],"longTermGoal":null,"motivation":null,"actionSteps":[]}
  });
  const navigate = useNavigate();

  console.log("[Sessions.rndr]", {
    history,
    query,
  });

  const maybeSession = query.data?.areaOfDevelopment?.length
    ? query.data
    : undefined; // empty array initially

  const renderSuccess = () => (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={
          <HistoryRightMenu
            heading={<Msg id="sessions.aside.title" />}
            history={history}
            onRemove={history.remove}
            buttonProps={{
              children: <Msg id="sessions.aside.start-button" />,
              onClick: () => navigate(routes.newSession),
            }}
          />
        }
      >
        <Header text={<Msg id="sessions.heading" />} />
        {maybeSession && <SessionCard session={maybeSession} />}
        {/* {history.all.map((session) => (
          <SessionCard session={session} />
        ))} */}
      </Layout>
    </MsgProvider>
  );

  return <QueryRenderer {...query} success={renderSuccess} />;
}

export default Sessions;
