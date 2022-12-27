import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Divider } from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth";
import { useLocalStorage } from "../../features/auth/useLocalStorage";
import { routes } from "../../features/navigation";
import { Layout } from "../Layout";
import { GRAY_BG_LIGHT, PRIMARY_BG_LIGHT } from "../Strengths/Strengths";
import { H1, H2, P } from "../Typography";
import { HistoryRightMenu, useHistoryEntries } from "../Values/MyValues";

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
  const { authFetch } = useAuth();
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
