import { Box, Card, CardContent, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HistoryRightMenu } from "../../components/HistoryRightMenu";
import { Layout } from "../../components/Layout";
import { H1, P } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { routes } from "../../routes";

export const SessionCard = ({
  session: { date, type, area, goal, motivation, steps } = {},
  sx = { mb: 3 },
}) => {
  return (
    <Card sx={{ ...sx }} elevation={0}>
      <CardContent>
        <Box>
          <P>{date}</P>
        </Box>
        <Box>
          <P>{type}</P>
        </Box>
      </CardContent>
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
    <Layout
      rightMenuContent={
        <HistoryRightMenu
          heading={"My sessions"}
          history={history}
          onRemove={history.remove}
          buttonProps={{
            children: "Start new session",
            onClick: () => navigate(routes.newSession),
          }}
        />
      }
    >
      <Box mt={4} mb={3}>
        <Box
          display="flex"
          flexWrap="nowrap"
          alignItems="center"
          flexDirection="row"
        >
          <H1>Sessions</H1>
        </Box>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
      </Box>
      {history.all.map((session) => (
        <SessionCard session={session} />
      ))}
    </Layout>
  );
}

export default Sessions;
