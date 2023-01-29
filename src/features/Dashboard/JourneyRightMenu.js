import { Avatar, Button, Icon, Paper } from "@mui/material";
import { H2, P } from "../../components/Typography";
import { routes } from "../../routes";

export const JourneyRightMenu = () => {
  return (
    <Paper
      square
      sx={{
        px: 3,
        py: 4,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignItems: "center",
        // alignItems: "stretch",
        // justifyContent: "space-between",
      }}
    >
      <H2 sx={{ alignSelf: "flex-start" }}>My leadership journey</H2>
      <Avatar variant="circular" sx={{ my: 5 }}>
        <Icon />
      </Avatar>
      <H2 sx={{ mb: 1 }}>No upcoming sessions</H2>
      <P sx={{ mb: 5 }}>Sessions with a coach will apear here</P>
      <Button fullWidth variant="contained" href={routes.newSession}>
        Start Session
      </Button>
    </Paper>
  );
};
