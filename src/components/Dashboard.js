import { Masonry } from "@mui/lab";
import {
  alpha,
  Card,
  CardActionArea,
  CardContent,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import { useAuth } from "../features/auth";
import { routes } from "../features/navigation";
import { Header } from "./Header";
import { Icon } from "./Icon";
import { Layout } from "./Layout";
import { H2, P } from "./Typography";

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
  title,
  children,
  iconName,
  iconColor,
  minHeight = 200,
  to,
}) => {
  const sx = {
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "space-between",
    height: "100%",
  };
  const withTo = (children) =>
    to ? (
      <CardActionArea href={to}>
        <CardContent sx={sx}>{children}</CardContent>
      </CardActionArea>
    ) : (
      <CardContent sx={sx}>{children}</CardContent>
    );
  return (
    <Card sx={{ minHeight }}>
      {withTo(
        <>
          <H2 sx={{ mb: 2 }}>{title}</H2>
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
        </>
      )}
    </Card>
  );
};

const sx = {
  display: "flex",
  flexFlow: "column nowrap",
  justifyContent: "space-between",
  height: "100%",
};

const DashboardCardButton = ({
  title,
  iconName,
  iconColor,
  to = routes.dashboard,
  minHeight = 200,
}) => {
  const withTo = (children) =>
    to ? (
      <CardContent sx={sx}>
        <CardActionArea href={to}>{children}</CardActionArea>
      </CardContent>
    ) : (
      <CardContent sx={sx}>{children}</CardContent>
    );
  return (
    <Card sx={{ minHeight }}>
      {withTo(
        <>
          <H2 sx={{ mb: 2 }}>{title}</H2>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // height: "100%",
            }}
          >
            <DashboardIcon iconName={iconName} color={iconColor} />
          </Box>
        </>
      )}
    </Card>
  );
};

const DashboardCardNotes = ({ title = "My Notes" }) => {
  return (
    <Card>
      <CardContent sx={sx}>
        <H2 sx={{ mb: 2 }}>{title}</H2>
        <TextField multiline minRows={18} placeholder="Type something" />
      </CardContent>
    </Card>
  );
};

const DashboardCardAssessment = ({
  title = "Find my strengths",
  iconName = "FitnessCenterOutlined",
  iconColor = "#0BA5EC",
  to = routes.assessment,
  minHeight = 200,
}) => {
  return (
    <Card sx={{ minHeight }}>
      <CardContent sx={sx}>
        <CardActionArea href={to}>
          <H2 sx={{ mb: 2 }}>{title}</H2>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // height: "100%",
            }}
          >
            <DashboardIcon iconName={iconName} color={iconColor} />
          </Box>
        </CardActionArea>
      </CardContent>
    </Card>
  );
};

function Dashboard() {
  const { authFetch } = useAuth();

  useEffect(() => {
    const res = authFetch({ url: "/api/rest/users" });
  }, []);

  return (
    <Layout>
      <Header />
      <Box>
        <H2>Who I am</H2>
        <P>
          Before you set where you are heading it's good to know from where you
          start.
        </P>
        <Masonry columns={3} spacing={2} sx={{ mt: 3 }}>
          <DashboardCardAssessment />
          <DashboardCardButton
            title="Set my values"
            iconName={"JoinRight"}
            iconColor={"#2E90FA"}
          />
          <DashboardCardNotes />

          <DashboardCardButton
            title="Get feedback"
            iconName="Forum"
            iconColor="#6172F3"
          />
        </Masonry>
      </Box>
      <Box>
        <H2>Who to become</H2>
        <P>Become a better leader and here is how you get there.</P>
        <Masonry columns={3} spacing={2} sx={{ mt: 3 }}>
          <DashboardCardButton
            heading="Set area for my development"
            iconName="FitnessCenterOutlined"
            iconColor={"#66C61C"}
          />
        </Masonry>
      </Box>
    </Layout>
  );
}

export default Dashboard;
