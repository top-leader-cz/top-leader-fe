import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
} from "@mui/material";
import { format, startOfWeek } from "date-fns/fp";
import { filter } from "ramda";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { I18nContext, UTC_DATE_FORMAT } from "../../App";
import { LANGUAGE_OPTIONS, getLabel } from "../../components/Forms";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H1, P } from "../../components/Typography";
import { useAuth } from "../Authorization";
import { AvailabilityCalendar } from "../Availability/AvailabilityCalendar";
import { QueryRenderer } from "../QM/QueryRenderer";
import { useFieldsDict } from "../Settings/useFieldsDict";
import { CoachesFilter, INITIAL_FILTER } from "./CoachesFilter";
import { ContactModal } from "./ContactModal";
import { messages } from "./messages";

export const ShowMore = ({
  text = "",
  maxChars = 1000,
  moreTranslation = "Show more",
  initialShowAll = false,
}) => {
  const [isMore, setIsMore] = useState(initialShowAll);
  const elipsis = "... ";
  const getShortened = () => (
    <>
      {text.substring(0, maxChars)}
      {elipsis}
      <Button variant="text" onClick={() => setIsMore(true)}>
        {moreTranslation}
      </Button>
    </>
  );
  const maxCharsWithOffset =
    maxChars + elipsis.length + (moreTranslation?.length || 0);

  return isMore || text.length <= maxCharsWithOffset ? text : getShortened();
};

export const CoachInfo = ({
  coach: { name, role, experience, languages, rate, bio, fields } = {},
  maxBioChars = 50,
  sx = {},
}) => {
  const msg = useMsg({ dict: messages });
  const { fieldsOptions } = useFieldsDict();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <H1 gutterBottom>{name}</H1>
      <P gutterBottom>{role}</P>
      <P gutterBottom>{msg("coaches.coach.experience", { experience })}</P>
      <P gutterBottom>
        {msg("coaches.coach.languages")}
        {": "}
        {languages.map(getLabel(LANGUAGE_OPTIONS)).join(", ")}
      </P>
      <P gutterBottom>
        {msg("coaches.coach.rate")}
        {": "}
        {rate}
      </P>
      <P
        emphasized
        gutterBottom
        sx={{ fontSize: 14, my: 2, whiteSpace: "normal" }}
      >
        <ShowMore
          maxChars={maxBioChars}
          text={bio}
          moreTranslation={msg("coaches.coach.show-more")}
        />
      </P>
      <Box flex="1 1 auto" display="flex" />
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {fields.map(getLabel(fieldsOptions)).map((label) => (
          <Chip
            key={label}
            sx={{ borderRadius: "6px", bgcolor: "#F9F8FF" }}
            label={label}
          />
        ))}
      </Box>
    </Box>
  );
};

export const useCoachAvailabilityQuery = ({ username }) => {
  const { authFetch } = useAuth();

  return useQuery({
    enabled: !!username,
    queryKey: ["coaches", username, "availability"],
    queryFn: () => {
      const startOfW = startOfWeek(new Date());
      console.log({ startOfW });
      const firstDayOfTheWeek = format(UTC_DATE_FORMAT, startOfW);
      console.log({ startOfW, firstDayOfTheWeek });

      return authFetch({
        url: `/api/latest/coaches/${username}/availability`,
        query: {
          firstDayOfTheWeek,
        },
      });
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const formatName = ({ firstName, lastName }) =>
  `${firstName} ${lastName}`;

const CoachCard = ({
  coach,
  onContact,
  sx = { mb: 3 },
  onAvailabilityClick,
}) => {
  const {
    username,
    email,
    rate, // TODO
    firstName,
    lastName,
    name = formatName({ firstName, lastName }),
    role, // TODO: rm?
    experience,
    languages,
    bio,
    fields,
  } = coach;

  const availabilityQuery = useCoachAvailabilityQuery({ username });

  console.log("[CoachCard.rndr]", name, {
    coach,
    availabilityQuery,
  });

  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ display: "flex", gap: 3, p: 3 }}>
        <CardMedia
          component="img"
          sx={{ width: 225, borderRadius: 0.6 }}
          image={`/api/latest/coaches/${username}/photo`}
          alt={name}
        />
        <CoachInfo
          coach={{ name, role, experience, languages, rate, bio, fields }}
          maxBioChars={50}
          sx={{ maxWidth: "50%", flexGrow: 10, width: "150px" }}
        />
        <QueryRenderer
          {...availabilityQuery}
          loaderName="Block"
          success={({ data }) => (
            <AvailabilityCalendar
              availabilitiesByDay={data}
              coachName={coach.username}
              onContact={() => onContact(coach)}
              onTimeslotClick={({ interval }) =>
                onAvailabilityClick({ coach, interval })
              }
              sx={{ flexShrink: 0 }}
            />
          )}
        />
      </CardContent>
    </Card>
  );
};

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

export function CoachesPageInner() {
  const msg = useMsg();
  const { language } = useContext(I18nContext);
  const [filter, setFilter] = useState(INITIAL_FILTER({ userLang: language }));
  const [contactCoach, setContactCoach] = useState(null);
  const handleContact = (coach) => setContactCoach(coach);
  const handleAvailabilityClick = ({ coach, interval }) => {
    console.log("handleAvailabilityClick", { coach, interval });
    // prettier-ignore
    alert(`TODO: ${JSON.stringify( { interval, username: coach.username, email: coach.email }, null, 2 )}`);
  };

  const { authFetch } = useAuth();
  const query = useQuery({
    queryKey: ["coaches", filter],
    queryFn: () =>
      authFetch({
        method: "POST",
        url: "/api/latest/coaches",
        data: getPayload({ filter }),
      }),
    refetchOnWindowFocus: false,
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
        {...query}
        success={({ data: { content = [] } }) =>
          content.map((coach, i) => (
            <CoachCard
              key={coach.username}
              coach={coach}
              onContact={handleContact}
              onAvailabilityClick={handleAvailabilityClick}
              sx={{ my: 3 }}
            />
          ))
        }
      />

      <ContactModal
        coach={contactCoach}
        onClose={() => setContactCoach(null)}
      />
    </Layout>
  );
}

export function CoachesPage() {
  return (
    <MsgProvider messages={messages}>
      <CoachesPageInner />
    </MsgProvider>
  );
}
