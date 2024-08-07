import { Avatar, Box, Button } from "@mui/material";
import { useContext } from "react";
import { Icon } from "../../components/Icon";
import { Msg } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H3, P } from "../../components/Typography";
import { routes } from "../../routes";
import { useAuth } from "../Authorization";
import { gray500, gray900 } from "../Clients/ClientsPage";
import { useUpcomingCoachSessionsQuery } from "../Clients/api";
import { formatName } from "../Coaches/CoachCard";
import { useUserUpcomingSessionsQuery } from "../Coaches/api";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { ActionStepsReadOnly } from "../Sessions/Sessions";
import { useUserSessionQuery } from "../Sessions/api";
import { assoc, curry, evolve, keys, map, pipe, reduce, sort } from "ramda";
import { sessionsMessages } from "../Sessions/messages";

const ActionCardHeading = ({ heading, sx = {} }) => {
  return (
    <Box sx={{ ...sx }}>
      <H3>{heading}</H3>
    </Box>
  );
};

export const ActionCard = ({ heading, children, button, sx = {} }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "250px",
        ...sx,
      }}
    >
      {heading && (
        <ActionCardHeading
          sx={{ mt: 1, alignSelf: "flex-start" }}
          heading={heading}
        />
      )}
      {children}
      {button && <Button fullWidth {...button} />}
    </Box>
  );
};

export const EmptyActionCardContent = ({
  iconName = "RocketLaunch",
  title,
  perex,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...sx,
      }}
    >
      {iconName && (
        <Avatar
          sx={{ bgcolor: "#F9FAFB", width: 100, height: 100, mb: 5, mt: 3 }}
        >
          <Avatar sx={{ bgcolor: "#EAECF0", width: 60, height: 60 }}>
            <Icon name={iconName} sx={{ color: "#667085" }} />
          </Avatar>
        </Avatar>
      )}
      {title && (
        <P emphasized sx={{ mb: 1 }}>
          {title}
        </P>
      )}
      {perex && <P sx={{ mb: 5 }}>{perex}</P>}
    </Box>
  );
};

// const MOCK = [
//   { checked: false, date: "2023-09-06", id: 52, label: "Mock Task1: TODO: RM from FE", },
//   { checked: true, date: "2023-09-06", id: 42, label: "Mock Task2: TODO: RM from FE", },
// ];

export const Actions = ({ canFetch = true, ...props }) => {
  const sessionQuery = useUserSessionQuery({
    enabled: canFetch,
    refetchOnReconnect: true,
  });

  // console.log("[Actions.rndr]", { sessionQuery });

  return (
    <Box {...props}>
      <QueryRenderer
        {...sessionQuery}
        loaderProps={{ sx: { my: 2 } }}
        loaderName="Skeleton"
        success={({
          data: {
            actionSteps = [],
            // actionSteps = MOCK,
          },
        }) => <ActionStepsReadOnly steps={actionSteps} />}
      />
    </Box>
  );
};

const ScheduledDay = ({ time, name, username }) => {
  const { i18n } = useContext(I18nContext);
  const msg = useMsg({ dict: sessionsMessages });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        py: 1,
        gap: 2,
        borderBottom: `1px solid #EAECF0`,
        // "&:last-child": { borderBottom: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "35px",
        }}
      >
        <P sx={{ fontSize: 14, color: gray500, fontWeight: 400 }}>
          {i18n.formatLocal(time, "ccc")}
        </P>
        <P sx={{ fontSize: 14, color: gray900, fontWeight: 600 }}>
          {i18n.formatLocal(time, "d")}
        </P>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <P sx={{ fontSize: 14, color: gray900, fontWeight: 600 }}>
          {name || username || msg("sessions.type.USER_SESSION")}
        </P>
        <P sx={{ fontSize: 14, color: gray500, fontWeight: 400 }}>
          {i18n.formatLocal(time, "p")}
        </P>
      </Box>

      {/* <Box display="flex" gap={1}>
       
      </Box>
      <Box display="flex" gap={1}>
        <P sx={{ fontSize: 18, color: gray900, fontWeight: 600 }}>
          {i18n.formatLocal(time, "pppp")}
        </P>
        <P sx={{ fontSize: 18, color: gray900, fontWeight: 400 }}>
          {name || username}
        </P>
      </Box> */}
    </Box>
  );
};

const CoachUpcomingSessions = ({ data }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        py: 2.5,
        // height: "300px",
        maxHeight: "300px",
        overflow: "auto",
      }}
    >
      {data.map(({ username, firstName, lastName, time }) => (
        <ScheduledDay
          key={time + username}
          name={formatName({ firstName, lastName })}
          username={username}
          time={time}
        />
      ))}
    </Box>
  );
};

// https://github.com/ramda/ramda/wiki/Cookbook#rename-keys-of-an-object
export const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
);

export const UpcomingSessionsCard = ({}) => {
  const { isCoach } = useAuth();
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

  const emptySessions = (
    <EmptyActionCardContent
      iconName="RocketLaunch"
      title={<Msg id="dashboard.rightmenu.upcoming.title.empty" />}
      perex={<Msg id="dashboard.rightmenu.upcoming.perex.empty" />}
    />
  );

  return (
    <ActionCard
      heading={msg("dashboard.rightmenu.today", {
        date: i18n.formatLocal(new Date(), "PP"),
      })}
      // heading={i18n.translateTokenLocal("today")}
      // heading={i18n.formatLocal(new Date(), "")}
      button={
        !query.isLoading &&
        !query.data?.length && {
          variant: "contained",
          href: routes.startSession,
          children: <Msg id="dashboard.rightmenu.upcoming.start" />,
        }
      }
    >
      <QueryRenderer
        {...query}
        loaderProps={{ sx: { my: 2 } }}
        loaderName="Skeleton"
        errored={() => emptySessions}
        success={({ data }) => {
          if (!data?.length) return emptySessions;

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
    </ActionCard>
  );
};

export const SessionsActionCards = ({ ...rest }) => {
  const { user } = useAuth();
  const areaOfDevelopment = user.data.areaOfDevelopment || [];

  return (
    <Box {...rest}>
      <UpcomingSessionsCard />
      <ActionCard
        heading={<Msg id="dashboard.rightmenu.actions.heading" />}
        button={
          !areaOfDevelopment.length && {
            variant: "outlined",
            href: routes.startSession,
            children: <Msg id="dashboard.rightmenu.actions.set-area" />,
          }
        }
        sx={{ mt: 5, mb: 5 }}
      >
        {!areaOfDevelopment.length ? (
          <EmptyActionCardContent
            iconName="RocketLaunch"
            title={<Msg id="dashboard.rightmenu.actions.title.empty" />}
            perex={<Msg id="dashboard.rightmenu.actions.perex.empty" />}
          />
        ) : (
          <Actions canFetch={!!areaOfDevelopment?.length} sx={{ py: 0.5 }} />
        )}
      </ActionCard>
    </Box>
  );
};

export const JourneyRightMenu = ({ user }) => {
  // console.log("[JourneyRightMenu]", { user });

  return (
    <ScrollableRightMenu heading={<Msg id={"dashboard.rightmenu.title"} />}>
      <SessionsActionCards />
    </ScrollableRightMenu>
  );
};
