import { Box, Card, CardContent, Divider } from "@mui/material";
import { filter } from "ramda";
import { useContext, useState } from "react";
import { useQuery } from "react-query";

import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H1, P } from "../../components/Typography";
import { useAuth } from "../Authorization";
import { I18nContext } from "../I18n/I18nProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { CoachCard } from "./CoachCard";
import { CoachesFilter, INITIAL_FILTER } from "./CoachesFilter";
import { messages } from "./messages";
import { ScheduledSessionsCard } from "./ScheduledSessions";
import { useUserUpcomingSessionsQuery } from "./api";
import { useMyQuery } from "../Authorization/AuthProvider";

export const formatName = ({ firstName, lastName }) =>
  `${firstName} ${lastName}`;

const getPayload = ({
  filter: {
    languages,
    fields,
    experience: [experienceFrom, experienceTo] = [],
    search,
    prices,
  },
  page = {
    pageNumber: 0,
    pageSize: 1000000,
  },
}) =>
  console.log("getPayload", { filter, page }) || {
    page,
    languages: languages?.length ? languages : undefined,
    fields: fields?.length ? fields : undefined,
    experienceFrom,
    // TODO: BE bug - not accepting from-to, just one value from range
    // experienceTo,
    name: search,
    prices: prices?.length ? prices : undefined,
  };

export const useCoachesQuery = ({ filter, ...rest } = {}) => {
  const coachesQuery = useMyQuery({
    queryKey: ["coaches", filter],
    fetchDef: {
      method: "POST",
      url: "/api/latest/coaches",
      data: getPayload({ filter }),
    },
    // queryFn: () => authFetch({ method: "POST", url: "/api/latest/coaches", data: getPayload({ filter }), }),
    refetchOnWindowFocus: false,
    ...rest,
  });

  return coachesQuery;
};

export function CoachesPageInner() {
  const msg = useMsg();
  const { language } = useContext(I18nContext);
  const [filter, setFilter] = useState(INITIAL_FILTER());
  const coachesQuery = useCoachesQuery({ filter });

  const EXPECT_ITEMS = [
    // {
    //   heading: msg("coaches.aside.items.1.heading"),
    //   iconName: "CreditCard",
    //   text: msg("coaches.aside.items.1.text"),
    // },
    {
      heading: msg("coaches.aside.items.2.heading"),
      iconName: "Star",
      text: msg("coaches.aside.items.2.text"),
    },
    {
      heading: msg("coaches.aside.items.3.heading"),
      iconName: "Lock",
      text: msg("coaches.aside.items.3.text"),
    },
  ];

  // console.log("[Coaches.page.rndr]", { filter });

  return (
    <Layout
      rightMenuContent={
        <ScrollableRightMenu heading={<Msg id="coaches.aside.title" />}>
          {EXPECT_ITEMS.map(({ heading, iconName, text }) => (
            <InfoBox
              key={heading}
              heading={heading}
              iconName={iconName}
              color="primary"
              sx={{ p: 2, mb: 3, borderRadius: "6px" }}
            >
              <P>{text}</P>
            </InfoBox>
          ))}
        </ScrollableRightMenu>
      }
    >
      <Box mt={4} mb={3}>
        <Box
          display="flex"
          flexWrap="nowrap"
          alignItems="center"
          flexDirection="row"
        >
          <H1>
            <Msg id="coaches.heading" />
          </H1>
        </Box>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
      </Box>
      <CoachesFilter filter={filter} setFilter={setFilter} />

      <QueryRenderer
        {...coachesQuery}
        success={({ data: { content = [] } }) =>
          content.map((coach, i) => (
            <CoachCard
              key={coach.username}
              coach={coach}
              withContact
              sx={{ my: 3 }}
            />
          ))
        }
      />
    </Layout>
  );
}

const YourCoachPageInner = ({ username }) => {
  const msg = useMsg();
  const { authFetch } = useAuth();
  const yourCoachQuery = useQuery({
    queryKey: ["coaches", username],
    queryFn: () => authFetch({ url: `/api/latest/coaches/${username}` }),
    // refetchOnWindowFocus: false,
  });
  const userUpcomingSessionsQuery = useUserUpcomingSessionsQuery();
  const EXPECT_ITEMS = [
    // {
    //   heading: msg("coaches.aside.items.1.heading"),
    //   iconName: "CreditCard",
    //   text: msg("coaches.aside.items.1.text"),
    // },
    {
      heading: msg("coaches.aside.items.2.heading"),
      iconName: "Star",
      text: msg("coaches.aside.items.2.text"),
    },
    {
      heading: msg("coaches.aside.items.3.heading"),
      iconName: "Lock",
      text: msg("coaches.aside.items.3.text"),
    },
  ];

  return (
    <Layout
      rightMenuContent={
        <ScrollableRightMenu heading={<Msg id="coaches.aside.title" />}>
          {EXPECT_ITEMS.map(({ heading, iconName, text }) => (
            <InfoBox
              key={heading}
              heading={heading}
              iconName={iconName}
              color="primary"
              sx={{ p: 2, mb: 3, borderRadius: "6px" }}
            >
              <P>{text}</P>
            </InfoBox>
          ))}
        </ScrollableRightMenu>
      }
    >
      <Box mt={4} mb={3}>
        <Box
          display="flex"
          flexWrap="nowrap"
          alignItems="center"
          flexDirection="row"
        >
          <H1>
            <Msg id="coaches.heading" />
          </H1>
        </Box>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
      </Box>

      <QueryRenderer
        {...yourCoachQuery}
        success={({ data: coach }) => (
          <CoachCard coach={coach} withContact sx={{ my: 3 }} />
        )}
      />
      <QueryRenderer
        {...userUpcomingSessionsQuery}
        success={({ data }) => <ScheduledSessionsCard data={data} />}
      />
    </Layout>
  );
};

export function CoachesPage() {
  const { user } = useAuth();

  console.log("[CoachesPage]", { user });

  return (
    <MsgProvider messages={messages}>
      {user.data.coach ? (
        <YourCoachPageInner username={user.data.coach} />
      ) : (
        <CoachesPageInner />
      )}
    </MsgProvider>
  );
}
