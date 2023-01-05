import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HistoryRightMenu } from "../../components/HistoryRightMenu";
import { Layout } from "../../components/Layout";
import { H1, P } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { routes } from "../../routes";
import { AREAS } from "./NewSession";

const ActionStepsTodo = ({ steps = [], label }) => {
  return (
    <>
      <P sx={{ mt: 3, mb: 2 }}>
        <b>{label}</b>
      </P>
      <Stack>
        {steps.map((step) => (
          <FormControlLabel
            control={<Checkbox defaultChecked={!!Math.round(Math.random())} />}
            label={step.label}
          />
        ))}
      </Stack>
    </>
  );
};

// TODO: grid
export const SessionCard = ({
  session: { date, type, area, goal, motivation, steps } = {},
  sx = { mb: 3 },
}) => {
  return (
    <Card sx={{ ...sx }} elevation={0}>
      <CardContent sx={{ display: "flex", flexDirection: "row" }}>
        <Box>
          <P>{date} -&nbsp;</P>
        </Box>
        <Box>
          <P>{type}</P>
          <P sx={{ my: 3 }}>
            <b>{AREAS[area]?.label || area}</b>
          </P>
          <ActionStepsTodo steps={steps} label="Goals" />
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
