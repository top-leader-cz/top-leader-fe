import { Box, Divider } from "@mui/material";
import { chain, filter, pipe, prop, uniq } from "ramda";
import { useMemo, useState } from "react";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H1, P } from "../../components/Typography";
import { useAuth } from "../Authorization";
import { useMyQuery } from "../Authorization/AuthProvider";
import { QueryRenderer } from "../QM/QueryRenderer";
import { CoachCard } from "./CoachCard";
import { CoachesFilter, INITIAL_FILTER } from "./CoachesFilter";
import { ScheduledSessionsCard } from "./ScheduledSessions";
import { useUserUpcomingSessionsQuery, useYourCoachQuery } from "./api";
import { messages } from "./messages";

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
    experienceTo,
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
    refetchOnWindowFocus: false,
    ...rest,
  });

  return coachesQuery;
};

const allCoachesFilter = INITIAL_FILTER();

export function CoachesPageInner() {
  const msg = useMsg();
  const [filter, setFilter] = useState(INITIAL_FILTER());
  const coachesQuery = useCoachesQuery({ filter });
  const allCoachesQuery = useCoachesQuery({
    filter: allCoachesFilter,
  });

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
  const { supportedLanguages, supportedFields } = useMemo(() => {
    const coaches = allCoachesQuery.data?.content || [];
    return {
      supportedLanguages: pipe(chain(prop("languages")), uniq)(coaches),
      supportedFields: pipe(chain(prop("fields")), uniq)(coaches),
    };
  }, [allCoachesQuery.data]);

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
      <CoachesFilter
        filter={filter}
        setFilter={setFilter}
        supportedLanguages={supportedLanguages}
        supportedFields={supportedFields}
      />

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
      <Box sx={{ height: "1px" }} />
    </Layout>
  );
}

const YourCoachPageInner = () => {
  const msg = useMsg();
  const yourCoachQuery = useYourCoachQuery();
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
      {user.data.coach ? <YourCoachPageInner /> : <CoachesPageInner />}
    </MsgProvider>
  );
}
