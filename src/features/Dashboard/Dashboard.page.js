import { Masonry } from "@mui/lab";
import {
  alpha,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { pick } from "ramda";
import React, { useMemo, useState } from "react";
import { useIsFetching } from "react-query";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { routes } from "../../routes";
import { useAuth } from "../Authorization";
import { useMyMutation } from "../Authorization/AuthProvider";
import { useAreas } from "../Sessions/steps/AreaStep";
import { useTalentsDict } from "../Strengths/talents";
import { useValuesDict } from "../Values/values";
import { JourneyRightMenu } from "./JourneyRightMenu";
import { messages } from "./messages";

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

const useNoteMutation = () =>
  useMyMutation({
    debug: true,
    // debug: "d",
    fetchDef: {
      method: "POST",
      url: `/api/latest/user-info/notes`,
      from: pick(["notes"]),
    },
    invalidate: { queryKey: ["user-info"] },
    snackbar: { success: false, error: true },
  });

const DashboardCardNotes = () => {
  // const [note, setNote] = useLocalStorage("dashboard_note", "");
  const msg = useMsg();
  const { user } = useAuth();
  const [note, setNote] = useState(user.data.notes || "");
  const noteMutation = useNoteMutation();
  const isFetchingUser = useIsFetching({ queryKey: ["user-info"] });
  // useEffect(() => { setNote?.(user.data.notes); }, [user.data.notes])

  // const { isLoading, isFetching, isPending } = noteMutation;
  // console.log({ isLoading, isFetching, isPending, noteMutation });

  return (
    <Card>
      <CardContent sx={{ position: "relative", ...sx }}>
        <H2 sx={{ mb: 2 }}>{msg("dashboard.cards.notes.title")}</H2>
        <TextField
          multiline
          minRows={18}
          placeholder={msg("dashboard.cards.notes.placeholder.empty")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          // defaultValue={user.data.notes || ""}
          onBlur={(e) => {
            if (note !== user.data.notes) {
              // TODO: race condition: Cmd+Z + Blur during user loading after save?
              noteMutation.mutate({
                notes: note,
                previousNotes: user.data.notes,
              });
            }
          }}
        />
        <CircularProgress
          color="inherit"
          size={20}
          // thickness={2}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            opacity: noteMutation.isLoading ? 1 : isFetchingUser ? 0.1 : 0,
          }}
        />
      </CardContent>
    </Card>
  );

  // return (
  //   <Card>
  //     <CardContent sx={sx}>
  //       <H2 sx={{ mb: 2 }}>{msg("dashboard.cards.notes.title")}</H2>
  //       <QueryRenderer
  //         {...noteQuery}
  //         loading={() => <NotesLoader />}
  //         success={({ data }) => {
  //           return (
  //             <TextField
  //               multiline
  //               minRows={18}
  //               placeholder={msg("dashboard.cards.notes.placeholder.empty")}
  //               defaultValue={user.data.notes}
  //               onBlur={(e) => noteMutation.mutate({ note: e.target.value })}
  //               // sx={
  //               //   !isLoading
  //               //     ? undefined
  //               //     : {
  //               //         visibility: "hidden",
  //               //       }
  //               // }
  //               // value={note}
  //               // onChange={(e) => setNote({ note: e.target.value })}
  //             />
  //           );
  //         }}
  //       />
  //       {/* {isLoading && <NotesLoader />} */}

  //     </CardContent>
  //   </Card>
  // );
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
                  height: "auto",
                  p: 1,
                  "& .MuiChip-label": {
                    textWrap: "wrap",
                  },
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
      href={routes.startSession}
      items={items}
      fallbackIcon={{ name: "FitnessCenterOutlined", color: "#66C61C" }}
    />
  );
};

export function DashboardPage() {
  const { user, isCoach } = useAuth();
  const { username, firstName } = user.data;
  const displayName = firstName || username;
  // console.log("[Dashboard.rndr]", { user });

  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={<JourneyRightMenu user={user} />}
        header={{
          withNotifications: true,
          avatarSrc: isCoach && `/api/latest/coaches/${username}/photo`,
          heading: <Msg id="dashboard.header" values={{ user: displayName }} />,
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
