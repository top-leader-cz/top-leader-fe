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

// TODO: grid
export const SessionCard = ({
  session: {
    timestamp,
    id = timestamp,
    date,
    type,
    area,
    goal,
    motivation,
    steps,
  } = {},
  sx = { mb: 3 },
}) => {
  const { areas } = useAreasDict();
  return (
    <Card sx={{ ...sx }} elevation={0}>
      <CardActionArea
        sx={{ height: "100%" }}
        href={generatePath(routes.editSession, { id })}
      >
        <CardContent sx={{ display: "flex", flexDirection: "row" }}>
          <Box>
            <P>{date} -&nbsp;</P>
          </Box>
          <Box>
            <P>{type}</P>
            <P sx={{ my: 3 }}>
              <b>{areas[area]?.label || area}</b>
            </P>
            <ActionStepsTodo
              steps={steps}
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
  const navigate = useNavigate();

  console.log("[Sessions.rndr]", {
    history,
  });

  return (
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
        {history.all.map((session) => (
          <SessionCard session={session} />
        ))}
      </Layout>
    </MsgProvider>
  );
}

export default Sessions;
