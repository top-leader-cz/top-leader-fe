import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import * as React from "react";
import { Content } from "./Content";
import { Header } from "./Header";
import { MainMenu } from "./MainMenu";
import { H1, H2, P } from "./Typography";
import { Masonry } from "@mui/lab";
import {
  alpha,
  Card,
  CardContent,
  TextareaAutosize,
  TextField,
  useTheme,
} from "@mui/material";
import { FitnessCenterOutlined, Forum, JoinRight } from "@mui/icons-material";

const Icons = {
  FitnessCenterOutlined,
  Forum,
  JoinRight,
};

const SideMenu = () => {
  return (
    <Paper square sx={{ width: "392px", minWidth: "392px", height: "100vh" }}>
      <H2 sx={{ mx: 3, my: 4 }}>My leadership journey</H2>
    </Paper>
  );
};

const Icon = ({ name, ...props }) => {
  const IconComponent = Icons[name];
  return <IconComponent {...props} />;
};

const DashboardIcon = ({ iconName, color }) => {
  return (
    <Avatar
      variant="rounded"
      sx={{
        width: 100,
        height: 100,
        borderRadius: "28px",
        color,
        bgcolor: alpha(color, 0.2),
      }}
    >
      <Icon name={iconName} sx={{ width: 50, height: 50 }} />
    </Avatar>
  );
};

/* Blue Light/500
background: #0BA5EC;
*/
const DashboardCard = ({
  heading,
  children,
  iconName,
  iconColor,
  minHeight = 200,
}) => {
  return (
    <Card sx={{ minHeight }}>
      <CardContent
        sx={{
          display: "flex",
          flexFlow: "column nowrap",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* <CardContent sx={{ flex: "1 0 auto" }}> */}
        <H2 sx={{ mb: 2 }}>{heading}</H2>
        {!iconName ? (
          children
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // height: "100%",
            }}
          >
            <Box>{children}</Box>
            <DashboardIcon iconName={iconName} color={iconColor} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

function Dashboard() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        bgcolor: "#EAECF0",
      }}
    >
      <MainMenu />
      <Content>
        <Header />
        <Box>
          <H2>Who I am</H2>
          <P>
            Before you set where you are heading it's good to know from where
            you start.
          </P>
          <Masonry columns={3} spacing={2} sx={{ mt: 3 }}>
            <DashboardCard
              heading="Find my strengths"
              iconName="FitnessCenterOutlined"
              iconColor={"#0BA5EC"}
            />
            <DashboardCard
              heading="Set my values"
              iconName={"JoinRight"}
              iconColor={"#2E90FA"}
            />
            <DashboardCard heading="My notes">
              <TextField multiline minRows={18} placeholder="Type something" />
            </DashboardCard>
            <DashboardCard
              heading="Get feedback"
              iconName="Forum"
              iconColor="#6172F3"
            />
          </Masonry>
        </Box>
        <Box>
          <H2>Who to become</H2>
          <P>Become a better leader and here is how you get there.</P>
          <Masonry columns={3} spacing={2} sx={{ mt: 3 }}>
            <DashboardCard
              heading="Set area for my development"
              iconName="FitnessCenterOutlined"
              iconColor={"#66C61C"}
            />
          </Masonry>
        </Box>
      </Content>
      <SideMenu />
    </Box>
  );
}

function Dashboard2() {
  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          {/* TODO: fixed width */}
          <Avatar variant="rounded" sx={{ bgcolor: "primary.main" }} />
        </Grid>
        <Grid item sm={4} md={6}>
          <Avatar variant="circular">AB</Avatar>
          <H1>Hello, Jamie!</H1>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
