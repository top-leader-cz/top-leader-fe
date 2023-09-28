import { Avatar, Button, Paper } from "@mui/material";
import { Msg } from "../../components/Msg";
import { H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { Icon } from "../../components/Icon";

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
        minWidth: 0,
        overflow: "hidden",
        textWrap: "wrap",
        textAlign: "center",
        // alignItems: "stretch",
        // justifyContent: "space-between",
      }}
    >
      <H2 sx={{ alignSelf: "flex-start" }}>
        <Msg id={"dashboard.rightmenu.title"} />
      </H2>
      <Avatar sx={{ bgcolor: "#F9FAFB", width: 100, height: 100, my: 5 }}>
        <Avatar sx={{ bgcolor: "#EAECF0", width: 60, height: 60 }}>
          <Icon name={"RocketLaunch"} sx={{ color: "#667085" }} />
        </Avatar>
      </Avatar>
      <H2 sx={{ mb: 1 }}>
        <Msg id="dashboard.rightmenu.upcoming.title.empty" />
      </H2>
      <P sx={{ mb: 5 }}>
        <Msg id="dashboard.rightmenu.upcoming.perex.empty" />
      </P>
      <Button fullWidth variant="contained" href={routes.newSession}>
        <Msg id="dashboard.rightmenu.upcoming.start" />
      </Button>
    </Paper>
  );
};
