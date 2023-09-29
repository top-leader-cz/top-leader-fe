import { Masonry } from "@mui/lab";
import {
  alpha,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Skeleton,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import React, { useCallback, useMemo, useState } from "react";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { useAuth } from "../Authorization";
import { useTalentsDict } from "../Strengths/talents";
import { useValuesDict } from "../Values/values";
import { JourneyRightMenu, JourneyRightMenu_ } from "./JourneyRightMenu";
import { messages } from "./messages";
import { useAreas } from "../Sessions/steps/AreaStep";

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

const useNote = () => {
  const url = "/api/rest/note";
  const [_note, _setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { _authFetch } = useAuth();

  const getNote = useCallback(() => {
    setIsLoading(true);
    _authFetch({ url }).then(({ response, json }) => {
      // console.log(url, response.status, json);
      _setNote(json?.note?.[0]?.content ?? "");
      setIsLoading(false);
    });
  }, [_authFetch, _setNote]);

  // TODO
  // useEffect(() => {
  //   getNote();
  // }, []);

  const setNote = useCallback(
    ({ note }) => {
      if (_note === note) return;
      setIsLoading(true);
      _authFetch({ url, method: "POST", data: { content: note } }).then(() =>
        getNote()
      );
    },
    [_note, _authFetch, getNote]
  );

  return { note: _note, isLoading, setNote };
};

const NotesLoader = () => {
  return (
    <Box sx={{ position: "relative", height: 0, overflow: "visible" }}>
      <Skeleton variant="text" sx={{ mb: 1 }} />
      <Skeleton variant="text" sx={{ mb: 1 }} />
      <Skeleton variant="text" sx={{ mb: 1 }} />
    </Box>
  );
};

const DashboardCardNotes = () => {
  // const [note, setNote] = useLocalStorage("dashboard_note", "");
  const msg = useMsg();
  const { note, isLoading, setNote } = useNote();

  return (
    <Card>
      <CardContent sx={sx}>
        <H2 sx={{ mb: 2 }}>{msg("dashboard.cards.notes.title")}</H2>
        {isLoading && <NotesLoader />}
        <TextField
          multiline
          minRows={18}
          placeholder={msg("dashboard.cards.notes.placeholder.empty")}
          defaultValue={note}
          onBlur={(e) => setNote({ note: e.target.value })}
          sx={
            !isLoading
              ? undefined
              : {
                  visibility: "hidden",
                }
          }
          // value={note}
          // onChange={(e) => setNote({ note: e.target.value })}
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
  minHeight = 215,
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
                  bgcolor: "#F9F8FF",
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

const DashboardCardAssessment = ({ selectedKeys = [] }) => {
  const { talents } = useTalentsDict();
  const items = useMemo(
    () =>
      selectedKeys?.slice(0, 5).map((key) => ({
        label: [talents[key]?.emoji ?? "👤", talents[key]?.name || key]
          .filter(Boolean)
          .join(" "),
      })),
    [selectedKeys, talents]
  );
  const msg = useMsg();

  return (
    <DashboardCard
      title={
        items.length
          ? msg("dashboard.cards.strengths.title.filled")
          : msg("dashboard.cards.strengths.title.empty")
      }
      href={items.length ? routes.strengths : routes.assessment}
      items={items}
      fallbackIcon={{ name: "FitnessCenterOutlined", color: "#0BA5EC" }}
    />
  );
};

const DashboardCardValues = ({ selectedKeys = [] }) => {
  const valuesDict = useValuesDict();
  const items = useMemo(
    () =>
      selectedKeys.map((key) => ({
        label: [valuesDict[key]?.emoji ?? "⚓️", valuesDict[key]?.name || key]
          .filter(Boolean)
          .join(" "),
      })),
    [selectedKeys, valuesDict]
  );
  const msg = useMsg();

  return (
    <DashboardCard
      title={
        items.length
          ? msg("dashboard.cards.values.title.filled")
          : msg("dashboard.cards.values.title.empty")
      }
      href={items.length ? routes.myValues : routes.setValues}
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

const DashboardCardSession = ({ selectedKeys = [] }) => {
  const msg = useMsg();
  const selectedAreas = useAreas({
    valueArr: selectedKeys,
  });
  const items = useMemo(
    () => selectedAreas.map(({ label }) => ({ label, key: label })),
    [selectedAreas]
  );

  return (
    <DashboardCard
      title={
        items.length
          ? msg("dashboard.cards.sessions.title.filled")
          : msg("dashboard.cards.sessions.title.empty")
      }
      href={routes.newSession}
      items={items}
      fallbackIcon={{ name: "FitnessCenterOutlined", color: "#66C61C" }}
    />
  );
};

export function DashboardPage() {
  const { user, isCoach } = useAuth();
  const username = user.data.username;
  console.log("[Dashboard.rndr]", { user });

  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={<JourneyRightMenu user={user} />}
        header={{
          withNotifications: true,
          avatarSrc: isCoach && `/api/latest/coaches/${username}/photo`,
          heading: <Msg id="dashboard.header" values={{ user: username }} />,
        }}
      >
        <Box>
          <H2>
            <Msg id="dashboard.section-1.heading" />
          </H2>
          <P>
            <Msg id="dashboard.section-1.perex" />
          </P>
          <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={2} sx={{ mt: 3 }}>
            <DashboardCardAssessment selectedKeys={user.data.strengths} />
            <DashboardCardValues selectedKeys={user.data.values} />
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
          <Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={2} sx={{ mt: 3 }}>
            <DashboardCardSession selectedKeys={user.data.areaOfDevelopment} />
          </Masonry>
        </Box>
      </Layout>
    </MsgProvider>
  );
}
