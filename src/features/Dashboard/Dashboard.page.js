import { Masonry } from "@mui/lab";
import {
  alpha,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import React, { useEffect, useMemo } from "react";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { routes } from "../../routes";
import { useTalentsDict } from "../Strengths/talents";
import { useAuth } from "../Authorization";
import { JourneyRightMenu } from "./JourneyRightMenu";
import { messages } from "./messages";
import { useValuesDict } from "../Values/values";

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

const DashboardCardNotes = () => {
  const [note, setNote] = useLocalStorage("dashboard_note", "");
  const msg = useMsg();

  return (
    <Card>
      <CardContent sx={sx}>
        <H2 sx={{ mb: 2 }}>{msg("dashboard.cards.notes.title")}</H2>
        <TextField
          multiline
          minRows={18}
          placeholder={msg("dashboard.cards.notes.placeholder.empty")}
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
                sx={{
                  borderRadius: 1,
                  justifyContent: "flex-start",
                  m: 1,
                  pointerEvents: "none",
                }}
                key={item.label}
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
  const { talents } = useTalentsDict();
  const { last } = useHistoryEntries({ storageKey: "assessment_history" });
  const items = useMemo(
    () =>
      last?.orderedTalents.slice(0, 5).map((key) => ({
        label: [talents[key]?.emoji ?? "👤", talents[key]?.name || key]
          .filter(Boolean)
          .join(" "),
      })),
    [last?.orderedTalents, talents]
  );
  const msg = useMsg();

  return (
    <DashboardCard
      title={
        items
          ? msg("dashboard.cards.strengths.title.filled")
          : msg("dashboard.cards.strengths.title.empty")
      }
      href={items ? routes.strengths : routes.assessment}
      items={items}
      fallbackIcon={{ name: "FitnessCenterOutlined", color: "#0BA5EC" }}
    />
  );
};

const DashboardCardValues = () => {
  const { last } = useHistoryEntries({ storageKey: "values_history" }); // TODO: keys vs wrapper hooks
  const { values } = useValuesDict();
  const items = useMemo(
    () =>
      last?.selectedKeys.slice(0).map((key) => ({
        label: [values[key]?.emoji ?? "⚓️", values[key]?.name || key]
          .filter(Boolean)
          .join(" "),
      })),
    [last?.selectedKeys, values]
  );
  const msg = useMsg();

  return (
    <DashboardCard
      title={
        items
          ? msg("dashboard.cards.values.title.filled")
          : msg("dashboard.cards.values.title.filled")
      }
      href={items ? routes.myValues : routes.setValues}
      items={items}
      fallbackIcon={{ name: "JoinRight", color: "#2E90FA" }}
    />
  );
};

const DashboardCardFeedback = () => {
  const msg = useMsg();

  return (
    <DashboardCard
      title={msg("dashboard.cards.feedback.title")}
      href={routes.getFeedback}
      items={undefined}
      fallbackIcon={{ name: "Forum", color: "#6172F3" }}
    />
  );
};

const DashboardCardSession = () => {
  const msg = useMsg();

  return (
    <DashboardCard
      title={msg("dashboard.cards.sessions.title.empty")}
      href={routes.newSession}
      items={undefined}
      fallbackIcon={{ name: "FitnessCenterOutlined", color: "#66C61C" }}
    />
  );
};

export function DashboardPage() {
  const { user, authFetch } = useAuth();

  useEffect(() => {
    const res = authFetch({ url: "/api/rest/users" });
  }, []);

  return (
    <MsgProvider messages={messages}>
      <Layout rightMenuContent={<JourneyRightMenu />}>
        <Header
          avatar={
            <Avatar
              variant="circular"
              src="https://i.pravatar.cc/44"
              sx={{ mr: 2 }}
            />
          }
          text={
            <Msg
              id="dashboard.header"
              values={{ user: user.displayName || user.email }}
            />
          }
        />
        <Box>
          <H2>
            <Msg id="dashboard.section-1.heading" />
          </H2>
          <P>
            <Msg id="dashboard.section-1.perex" />
          </P>
          <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={2} sx={{ mt: 3 }}>
            <DashboardCardAssessment />
            <DashboardCardValues />
            <DashboardCardNotes />
            <DashboardCardFeedback />
          </Masonry>
        </Box>
        <Box>
          <H2>
            <Msg id="dashboard.section-2.heading" />
          </H2>
          <P>
            <Msg id="dashboard.section-2.perex" />
          </P>
          <Masonry columns={3} spacing={2} sx={{ mt: 3 }}>
            <DashboardCardSession />
          </Masonry>
        </Box>
      </Layout>
    </MsgProvider>
  );
}
