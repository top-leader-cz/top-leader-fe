import { Masonry } from "@mui/lab";
import {
  alpha,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import React, { useEffect, useMemo } from "react";
import { useAuth } from "../features/auth";
import { useLocalStorage } from "../features/auth/useLocalStorage";
import { routes } from "../features/navigation";
import { Header } from "./Header";
import { Icon } from "./Icon";
import { Layout } from "./Layout";
import { useAssessmentHistory } from "./Strengths/Strengths";
import { TALENTS } from "./Strengths/talents";
import { H2, P } from "./Typography";

const DashboardIcon = ({ iconName, color, sx = {} }) => {
  return (
    <Avatar
      variant="rounded"
      sx={{
        width: 100,
        height: 100,
        borderRadius: "28px",
        color,
        bgcolor: alpha(color, 0.2),
        ...sx,
      }}
    >
      <Icon name={iconName} sx={{ width: 50, height: 50 }} />
    </Avatar>
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
  const [note, setNote] = useLocalStorage("dashboard_note", "");

  return (
    <Card>
      <CardContent sx={sx}>
        <H2 sx={{ mb: 2 }}>{title}</H2>
        <TextField
          multiline
          minRows={18}
          placeholder="Type something"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </CardContent>
    </Card>
  );
};

const DashboardCard = ({
  title,
  href,
  items,
  fallbackIcon = {},
  minHeight = 200,
}) => {
  return (
    <Card sx={{ minHeight }}>
      <CardActionArea sx={{ height: "100%" }} href={href}>
        <CardContent sx={{ position: "relative", height: "100%" }}>
          <H2 sx={{ mb: 2 }}>{title}</H2>
          {!items?.length ? (
            <DashboardIcon
              iconName={fallbackIcon.name ?? "FitnessCenterOutlined"}
              color={fallbackIcon.color ?? "#0BA5EC"}
              sx={{ position: "absolute", bottom: 24, right: 24 }}
            />
          ) : (
            items.map((item) => (
              <Chip
                sx={{ borderRadius: 1, justifyContent: "flex-start", m: 1 }}
                {...item}
              />
            ))
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const DashboardCardAssessment = () => {
  const { last } = useAssessmentHistory();
  const items = useMemo(
    () =>
      last?.orderedTalents.slice(0, 5).map((key) => ({
        label: [TALENTS[key]?.emoji ?? "👤", TALENTS[key]?.name || key]
          .filter(Boolean)
          .join(" "),
      })),
    [last?.orderedTalents]
  );

  return (
    <DashboardCard
      title={items ? "My strengths" : "Find my strengths"}
      href={items ? routes.strengths : routes.assessment}
      items={items}
      fallbackIcon={{ name: "FitnessCenterOutlined", color: "#0BA5EC" }}
    />
  );
};

const DashboardCardValues = () => {
  const items = useMemo(
    () => undefined,
    // last?.orderedTalents.slice(0, 5).map((key) => ({
    //   label: [TALENTS[key]?.emoji ?? "👤", TALENTS[key]?.name || key]
    //     .filter(Boolean)
    //     .join(" "),
    // })),
    []
  );

  return (
    <DashboardCard
      title={items ? "My values" : "Set my values"}
      href={items ? routes.myValues : routes.setValues}
      items={items}
      fallbackIcon={{ name: "JoinRight", color: "#2E90FA" }}
    />
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
          <DashboardCardValues />
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
            title="Set area for my development"
            iconName="FitnessCenterOutlined"
            iconColor={"#66C61C"}
          />
        </Masonry>
      </Box>
    </Layout>
  );
}

export default Dashboard;
