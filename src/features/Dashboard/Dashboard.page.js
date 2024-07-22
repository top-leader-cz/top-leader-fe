import { Button, Card, CardActionArea, Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { isToday } from "date-fns";
import { evolve, map, pipe, sort } from "ramda";
import React, { useContext } from "react";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Icon } from "../../components/Icon";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { H2, P } from "../../components/Typography";
import { generalMessages } from "../../components/messages";
import { routes } from "../../routes";
import { gray500, gray900, primary500 } from "../../theme";
import { useAuth } from "../Authorization";
import { useUpcomingCoachSessionsQuery } from "../Clients/api";
import { formatName } from "../Coaches/CoachCard";
import { useUserUpcomingSessionsQuery } from "../Coaches/api";
import { I18nContext } from "../I18n/I18nProvider";
import { UserAvatar } from "../Messages/Messages.page";
import { QueryRenderer } from "../QM/QueryRenderer";
import { ActionStepsReadOnly, SessionCardIconTile } from "../Sessions/Sessions";
import { useUserSessionQuery } from "../Sessions/api";
import { useAreasDict } from "../Sessions/areas";
import { sessionsMessages } from "../Sessions/messages";
import {
  actionBlueprintKey,
  anyTruthy,
  DashboardRightMenu,
  useUserInsights,
} from "./DashboardRightMenu";
import { ExpandableInfoBox } from "./ExpandableInfoBox";
import { HeadingWithIcon } from "./HeadingWithIcon";
import { renameKeys } from "./JourneyRightMenu";
import { ResourceMediaCard } from "./ResourceMediaCard";
import { dashboardMessages } from "./messages";

// from JourneyRightMenu
const EmptyActionCardContent = ({
  iconName = "RocketLaunch",
  title,
  perex,
  button,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        px: 3,
        py: 5,
        height: "100%",
        ...sx,
      }}
    >
      {iconName && (
        <Avatar sx={{ bgcolor: "#F9FAFB", width: 100, height: 100 }}>
          <Avatar sx={{ bgcolor: "#EAECF0", width: 60, height: 60 }}>
            <Icon name={iconName} sx={{ color: "#667085" }} />
          </Avatar>
        </Avatar>
      )}
      <Box sx={{ textAlign: "center", flex: 1 }}>
        {title && (
          <P emphasized sx={{ mb: 0.5 }}>
            {title}
          </P>
        )}
        {perex && <P>{perex}</P>}
      </Box>
      {button && <Button {...button} />}
    </Box>
  );
};

const ScheduledDay = ({ id, isPrivate, time, name, username }) => {
  const { i18n } = useContext(I18nContext);
  const msg = useMsg({ dict: sessionsMessages });
  const generalMsg = useMsg({ dict: generalMessages });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <P
        sx={{
          fontSize: 14,
          color: isToday(time) ? primary500 : gray500,
          fontWeight: isToday(time) ? 600 : 400,
        }}
      >
        {i18n
          .formatLocal(
            time,
            isToday(time)
              ? `'${generalMsg("general.today")}, 'PPP`
              : "cccc', 'PPP"
          )
          ?.replace(i18n.formatLocal(time, "y"), "")}
      </P>
      <Box
        sx={{
          // pl: 4,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            height: "100%",
            flexBasis: "24px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            flexShrink: 100,
          }}
        >
          <Box
            sx={{
              borderRight: `4px solid ${isPrivate ? "#EAAA08" : primary500}`,
              borderRadius: "4px",
              height: "100%",
            }}
          />
        </Box>
        {!isPrivate && (
          <UserAvatar
            username={username}
            fullName={name}
            sx={{ width: 38, height: 38 }}
          />
        )}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <P sx={{ fontSize: 14, color: gray900, fontWeight: 600 }}>
            {name || username || msg("sessions.type.USER_SESSION")}
          </P>
          <P sx={{ fontSize: 14, color: gray500, fontWeight: 400 }}>
            {i18n.formatLocal(time, "p")}
          </P>
        </Box>
      </Box>
    </Box>
  );
};

const CoachUpcomingSessions = ({ data }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        gap: 3,
        px: 3,
        py: 3,
        height: "100%",
      }}
    >
      {data.map(({ username, firstName, lastName, time, id, isPrivate }) => (
        <ErrorBoundary>
          <ScheduledDay
            id={id}
            key={time + username}
            name={formatName({ firstName, lastName })}
            username={username}
            time={time}
            isPrivate={isPrivate}
          />
        </ErrorBoundary>
      ))}
    </Box>
  );
};

const UpcomingSessionsContent = ({}) => {
  const { isCoach, user } = useAuth();
  const { i18n } = useContext(I18nContext);
  const msg = useMsg();
  const coachUpcomingSessionsQuery = useUpcomingCoachSessionsQuery({
    enabled: isCoach,
  });
  const userUpcomingSessionsQuery = useUserUpcomingSessionsQuery({
    enabled: !isCoach,
  });
  const query = isCoach
    ? coachUpcomingSessionsQuery
    : userUpcomingSessionsQuery;

  const empty = (
    <EmptyActionCardContent
      iconName="CalendarMonth"
      title={<Msg id="dashboard.upcoming.empty.title" />}
      perex={<Msg id="dashboard.upcoming.empty.perex" />}
      // perex={ "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
      button={{
        variant: "outlined",
        href: routes.coaches,
        children: user.data.coach ? (
          <Msg id="dashboard.upcoming.empty.action.schedule-session" />
        ) : (
          <Msg id="dashboard.upcoming.empty.action.select-coach" />
        ),
      }}
    />
  );

  return (
    <QueryRenderer
      query={query}
      loaderProps={{ sx: { m: 2 } }}
      loaderName="Skeleton"
      errored={() => empty}
      success={({ data }) => {
        if (!data?.length) return empty;

        const parseTime = evolve({ time: i18n.parseUTCLocal });
        const mappedData = pipe(
          map(
            isCoach
              ? parseTime
              : pipe(renameKeys({ coach: "username" }), parseTime)
          ),
          sort((a, b) => +a.time - b.time)
        )(data);

        return <CoachUpcomingSessions data={mappedData} />;
      }}
    />
  );
};

// const MOCK = [
//   { checked: false, date: "2023-09-06", id: 52, label: "Mock Task1: TODO: RM from FE", },
//   { checked: true, date: "2023-09-06", id: 42, label: "Mock Task2: TODO: RM from FE", },
// ];

const ActionsContent = ({ insightsQuery }) => {
  const msg = useMsg({ dict: dashboardMessages });
  const sessionQuery = useUserSessionQuery({
    enabled: true,
    refetchOnReconnect: true,
  });

  const empty = (
    <EmptyActionCardContent
      iconName="RocketLaunch"
      title={<Msg id="dashboard.actions.empty.title" />}
      perex={<Msg id="dashboard.actions.empty.perex" />}
      button={{
        variant: "outlined",
        href: routes.startSession,
        children: <Msg id="dashboard.actions.empty.action" />,
      }}
    />
  );

  return (
    <QueryRenderer
      query={sessionQuery}
      loaderProps={{ sx: { m: 2 } }}
      loaderName="Skeleton"
      // errored={() => empty}
      success={({ data: { actionSteps = [] } }) => {
        if (!actionSteps?.length) return empty;
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
              gap: 3,
              p: 3,
            }}
          >
            {/* <ActionStepsReadOnly steps={MOCK} /> */}
            <ActionStepsReadOnly steps={actionSteps} />
            <QueryRenderer
              query={insightsQuery}
              loaderName="Skeleton"
              loaderProps={{ rows: 3, sx: { mb: 4 } }}
              loading={null}
              errored={null}
              success={({ data }) => {
                return (
                  <ExpandableInfoBox
                    headingElement={
                      <HeadingWithIcon
                        title={
                          msg(
                            "dashboard.cards.ai.tips.personal-growth.title"
                          ) || "Actions blueprint"
                        }
                        isLoading={anyTruthy(
                          "isPending",
                          [actionBlueprintKey],
                          data
                        )}
                      />
                    }
                    text={data[actionBlueprintKey]?.text}
                    hideEmpty
                  />
                );
              }}
            />
          </Box>
        );
      }}
    />
  );
  // return !areaOfDevelopment.length ? (
  //   <EmptyActionCardContent
  //     iconName="RocketLaunch"
  //     title={<Msg id="dashboard.rightmenu.actions.title.empty" />}
  //     perex={<Msg id="dashboard.rightmenu.actions.perex.empty" />}
  //     button={{
  //       variant: "outlined",
  //       href: routes.startSession,
  //       children: <Msg id="dashboard.rightmenu.actions.set-area" />,
  //     }}
  //   />
  // ) : (
  //   <Actions canFetch={!!areaOfDevelopment?.length} sx={{ py: 0.5 }} />
  // );
};

const sessionCardSx = { display: "flex", gap: 3, flexDirection: "column" };
const SessionCardTitle = ({ iconName, children }) => (
  <P sx={{ fontWeight: 500 }}>
    <Icon name={iconName} sx={{ fontSize: "inherit", mr: 0.5 }} />
    {children}
  </P>
);

const RESOURCE_TYPE = {
  VIDEO: "Video",
  ARTICLE: "Article",
  TUTORIAL: "Tutorial",
};

export const RESOURCE_COLORS = {
  [RESOURCE_TYPE.VIDEO]: { color: "#056AD6", bgcolor: "#EFF9FF" },
  [RESOURCE_TYPE.ARTICLE]: {
    color: primary500,
    bgcolor: "#F9F8FF",
    iconName: "MenuBookOutlined",
    actionName: "read",
  },
  [RESOURCE_TYPE.TUTORIAL]: { color: "#876205", bgcolor: "#FFFBE1" },
  default: { color: "#056AD6", bgcolor: "#EFF9FF" },
};

const resources = [
  {
    title: "10 Surprising Things Successful Leaders Do Differently",
    previewSrc: "https://placehold.co/400x400?text=Preview",
    type: RESOURCE_TYPE.ARTICLE,
    estimatedTime: "10min",
  },
  {
    title: "Thought leadership benefits",
    previewSrc: "https://placehold.co/400x400?text=Preview",
    type: RESOURCE_TYPE.TUTORIAL,
    estimatedTime: "26min",
  },
  {
    title: "Great Leadership Begins with Three Commitments | Pete Rogers",
    previewSrc: "https://placehold.co/400x400?text=Preview",
    type: RESOURCE_TYPE.VIDEO,
    estimatedTime: "14min",
  },
  {
    title: "The Key to Effective Leadership",
    previewSrc: "https://placehold.co/400x400?text=Preview",
    type: RESOURCE_TYPE.VIDEO,
    estimatedTime: "5min",
  },
  {
    title: "What Makes a Great Leader?",
    previewSrc: "https://placehold.co/400x400?text=Preview",
    type: RESOURCE_TYPE.VIDEO,
    estimatedTime: "27min",
  },
];

export function DashboardPage() {
  const { user, isCoach } = useAuth();
  const { username, firstName } = user.data;
  const displayName = firstName || username;
  // console.log("[Dashboard.rndr]", { user });
  const sessionsMsg = useMsg({ dict: sessionsMessages });
  const dashboardMsg = useMsg({ dict: dashboardMessages });
  const { areas } = useAreasDict();
  const areaOfDevelopment = user.data.areaOfDevelopment[0];
  const longTermGoal = user.data.longTermGoal; // TODO: BE / call

  const insightsQuery = useUserInsights();

  // useEffect( () => () => { console.log("%c[DashboardPage.unmounting]", "color:pink;");  }, [] );

  return (
    <MsgProvider messages={dashboardMessages}>
      <Layout
        rightMenuContent={
          <DashboardRightMenu user={user} insightsQuery={insightsQuery} />
        }
        header={{
          withNotifications: true,
          avatarSrc: isCoach && `/api/latest/coaches/${username}/photo`,
          heading: <Msg id="dashboard.header" values={{ user: displayName }} />,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <H2 sx={{ mb: 0.5 }}>
              {dashboardMsg("dashboard.rightmenu.title")}
            </H2>
            <P>{dashboardMsg("dashboard.perex")}</P>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} alignItems="stretch">
              <Card sx={{ height: "100%" }}>
                <CardActionArea
                  href={routes.startSession}
                  sx={{ minHeight: 92 - 50, p: 3, height: "100%" }}
                >
                  {/* <CardContent sx={{ p: 3 }}> */}
                  <SessionCardIconTile
                    grayOutEmpty
                    spacious
                    iconName={"InsertChart"}
                    caption={sessionsMsg(
                      "sessions.edit.steps.align.area.caption"
                    )}
                    text={areas[areaOfDevelopment]?.label || areaOfDevelopment}
                  />
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea
                  href={routes.startSession}
                  sx={{ minHeight: 92 - 50, p: 3, height: "100%" }}
                >
                  {/* <CardContent sx={{ p: 3 }}> */}
                  <SessionCardIconTile
                    grayOutEmpty
                    spacious
                    iconName={"Adjust"} // TODO x2
                    caption={sessionsMsg(
                      "sessions.edit.steps.align.goal.caption"
                    )}
                    text={longTermGoal}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={5} xl={4} sx={sessionCardSx}>
              <SessionCardTitle iconName={"CalendarMonth"}>
                {dashboardMsg("dashboard.upcoming.heading")}
              </SessionCardTitle>
              <Card sx={{ height: "100%" }}>
                <UpcomingSessionsContent />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} lg={7} xl={8} sx={sessionCardSx}>
              <SessionCardTitle iconName={"RocketLaunch"}>
                {dashboardMsg("dashboard.rightmenu.actions.heading")}
              </SessionCardTitle>
              <Card sx={{ height: "100%" }}>
                <ActionsContent insightsQuery={insightsQuery} />
              </Card>
            </Grid>
          </Grid>

          <SessionCardTitle iconName={"School"}>
            {dashboardMsg("dashboard.learn.heading")}
          </SessionCardTitle>
          <Grid container spacing={2}>
            {resources.map(
              ({
                title = "",
                previewSrc = "https://placehold.co/400x400?text=Preview",
                type = RESOURCE_TYPE.VIDEO,
                estimatedTime = "",
              }) => (
                <Grid item xs={12} sm={6} lg={3} xl={2} sx={{}}>
                  <ResourceMediaCard
                    title={title}
                    previewSrc={previewSrc}
                    type={type}
                    estimatedTime={estimatedTime}
                    sx={{ height: "100%" }}
                  />
                </Grid>
              )
            )}
          </Grid>
        </Box>
      </Layout>
    </MsgProvider>
  );
}
