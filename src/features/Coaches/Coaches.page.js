import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
} from "@mui/material";
import {
  addDays,
  endOfDay,
  format,
  getDay,
  getHours,
  isWithinInterval,
  setDay,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  startOfWeek,
} from "date-fns/fp";
import { filter, identity, map, pipe } from "ramda";
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
import { QueryRenderer } from "../QM/QueryRenderer";
import { ControlsContainer } from "../Sessions/steps/Controls";
import { useFieldsDict } from "../Settings/useFieldsDict";
import { CoachesFilter, INITIAL_FILTER } from "./CoachesFilter";
import { ContactModal } from "./ContactModal";
import { messages } from "./messages";
import { DAY_NAMES, INDEX_TO_DAY } from "../Settings/AvailabilitySettings";
import { ErrorBoundary } from "react-error-boundary";

export const createSlot = ({ start, duration = 60 }) => ({
  start,
  // duration,
});

const HEADER_FORMAT = "d MMM";
const VISIBLE_DAYS_COUNT = 7;

const TimeSlot = ({ hour, isFree, sx }) => {
  return (
    <Box
      key={hour}
      borderRadius="6px"
      py={1}
      px={0.5}
      bgcolor={isFree ? "#F9F8FF" : "transparent"}
      color={isFree ? "primary.main" : "inherit"}
      fontWeight={isFree ? 500 : 400}
      sx={sx}
    >
      {isFree ? `${hour}:00` : "-"}
    </Box>
  );
};

export const CalendarDaySlots = ({
  date,
  slotsCount,
  startHour,
  freeHours = [],
  sx = { flexDirection: "column" },
  dateSx,
  slotSx,
}) => {
  const { i18n } = useContext(I18nContext);

  const daySlots = Array(slotsCount)
    .fill(null)
    .map((_, index) => ({
      index,
      hour: index + startHour,
      isFree: freeHours.includes(index + startHour),
    }));

  // console.log("[CalendarDaySlots.rndr]", {
  //   date,
  //   slotsCount,
  //   startHour,
  //   freeHours,
  //   daySlots,
  // });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        textAlign: "center",
        gap: 1,
        width: "100%",
        ...sx,
      }}
    >
      <Box py={1} px={0.5} sx={dateSx}>
        {i18n.formatLocal(date, "E d")}
      </Box>
      {daySlots.map(({ hour, isFree }) => (
        <TimeSlot key={hour} hour={hour} isFree={isFree} sx={slotSx} />
      ))}
    </Box>
  );
};

export const CREATE_OFFSET =
  (date, map = identity) =>
  (daysOffset, hour) =>
    pipe(
      startOfDay,
      addDays(daysOffset),
      setHours(hour),
      setMinutes(0),
      setSeconds(0),
      map
    )(date);

export const offsetDate = (daysOffset, hour, date) =>
  pipe(
    startOfDay,
    addDays(daysOffset),
    setHours(hour),
    setMinutes(0),
    setSeconds(0),
    map
  )(date);

const isWithinDay = (dayDate) =>
  isWithinInterval({ start: startOfDay(dayDate), end: endOfDay(dayDate) });

// const indexToDayIndex = ()

const parseHour = (time) => {
  const str = (time || "").substring(0, 2);
  const number = parseInt(str, 10);
  // console.log({ str, number });
  return number;
};

export const TimeSlots = ({
  // slotsRange = [],
  onContact,
  // freeSlots = [],
  data: availabilities,
  sx,
}) => {
  const TODAY = new Date();
  // const MOCK_SLOT = CREATE_OFFSET(TODAY, (start) => createSlot({ start }));
  // const freeSlots = [
  //   // MOCK_SLOT(0 + (index % 3), 9),
  //   // MOCK_SLOT(0 + (index % 3), 10),
  //   // MOCK_SLOT(0 + (index % 3), 11),
  //   // MOCK_SLOT(2 + (index % 3), 10),
  //   // MOCK_SLOT(3 + (index % 3), 9),
  //   // MOCK_SLOT(4 + (index % 3), 11),
  // ];

  // const freeHours = ({ index }) =>
  //   pipe(
  //     map((slot) => slot.start),
  //     filter(isWithinDay(addDays(index, TODAY))),
  //     map(getHours)
  //   )(freeSlots);
  const daySlots = Array(VISIBLE_DAYS_COUNT)
    .fill(null)
    .map((_, index) => {
      // const dayOffset = index + offset // (weekShift*7) // TODO
      // const date = offsetDate(index, 0, TODAY);
      const todayDayIndex = getDay(TODAY);
      const dayIndex = (todayDayIndex + index) % 7;
      const dayName = INDEX_TO_DAY[dayIndex];

      const date = addDays(index, TODAY);

      return { dayName, date };
    });

  return (
    <Box
      sx={{
        width: 335,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        ...sx,
      }}
    >
      <Box
        bgcolor="#DAD2F1"
        height={44}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius={"6px"}
        color="primary.main"
        fontWeight={500}
      >
        {pipe(startOfDay, format(HEADER_FORMAT))(TODAY)} -{" "}
        {pipe(addDays(6), endOfDay, format(HEADER_FORMAT))(TODAY)}
      </Box>
      <Box
        display="flex"
        gap={1}
        maxHeight={180}
        overflow="auto"
        borderBottom="1px solid #EAECF0"
      >
        {daySlots.map(({ date, dayName }, index) => {
          const freeHours = availabilities[dayName]?.map((slot) => {
            // slot = {
            //     "day": "MONDAY",
            //     "date": "2023-09-24",
            //     "timeFrom": "09:00:00",
            //     "timeTo": "10:00:00",
            //     "firstDayOfTheWeek": "2023-09-24"
            // },
            return parseHour(slot.timeFrom);
          });
          console.log({ freeHours });
          // TODO
          const { min, max } = Object.values(availabilities)
            .reduce((acc, arr) => acc.concat(arr), [])
            .reduce(
              ({ min, max }, slot) => {
                const startHour = parseHour(slot.timeFrom);
                // const endHour = parseHour(slot.timeTo)
                return {
                  min: Math.min(min, startHour),
                  max: Math.max(max, startHour),
                };
              },
              { min: 12, max: 12 }
            );
          // alert(`{ min: ${min}, max: ${max} }`);

          const startHour = min || 0;
          const slotsCount = max - min + 1 || 8;

          if (slotsCount < 0) debugger;

          console.log("[TimeSlots.rndr]", {
            min,
            max,
            startHour,
            slotsCount,
            availabilities,
          });

          return (
            <ErrorBoundary
              fallbackRender={(props) => {
                return null;
              }}
            >
              <CalendarDaySlots
                key={dayName}
                startHour={startHour}
                slotsCount={slotsCount}
                date={date}
                freeHours={freeHours}
              />
            </ErrorBoundary>
          );
        })}
      </Box>
      {onContact && (
        <ControlsContainer sx={{ mt: 1 }}>
          <Button variant="contained" onClick={() => onContact()}>
            <Msg id="coaches.coach.contact" />
          </Button>
        </ControlsContainer>
      )}
    </Box>
  );
};

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

export const formatName = ({ firstName, lastName }) =>
  `${firstName} ${lastName}`;

const CoachCard = ({ coach, onContact, sx = { mb: 3 }, index }) => {
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

  const { authFetch } = useAuth();
  const availabilityQuery = useQuery({
    queryKey: ["coaches", username],
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

  console.log("[CoachCard.rndr]", name, {
    coach,
    availabilityQuery,
  });

  if (!availabilityQuery.data) return <QueryRenderer isLoading />;

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
        <TimeSlots
          data={availabilityQuery.data}
          // freeSlots={freeSlots}
          onContact={() => onContact(coach)}
          sx={{ flexShrink: 0 }}
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
              sx={{ my: 3 }}
              onContact={handleContact}
              index={i}
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
