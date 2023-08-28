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
  getHours,
  isWithinInterval,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns/fp";
import { filter, identity, map, pipe } from "ramda";
import { useState } from "react";
import {
  FIELD_OPTIONS,
  getLabel,
  LANGUAGE_OPTIONS,
} from "../../components/Forms";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H1, P } from "../../components/Typography";
import { ControlsContainer } from "../Sessions/steps/Controls";
import { CoachesFilter, INITIAL_FILTER } from "./CoachesFilter";
import { ContactModal } from "./ContactModal";
import { messages } from "./messages";
import { useQuery } from "react-query";
import { useAuth } from "../Authorization";
import { QueryRenderer } from "../QM/QueryRenderer";

const createSlot = ({ start, duration = 60 }) => ({
  start,
  // duration,
});

const HEADER_FORMAT = "d MMM";
const DAY_FORMAT = "E d";

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
  const daySlots = Array(slotsCount)
    .fill(null)
    .map((_, index) => ({
      index,
      hour: index + startHour,
      isFree: freeHours.includes(index + startHour),
    }));
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
        {format(DAY_FORMAT, date)}
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

const isWithinDay = (dayDate) =>
  isWithinInterval({ start: startOfDay(dayDate), end: endOfDay(dayDate) });

const TimeSlots = ({ slotsRange = [], onContact, freeSlots = [], sx }) => {
  const TODAY = new Date();
  const MOCK_OFFSET = CREATE_OFFSET(TODAY);

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
        {Array(VISIBLE_DAYS_COUNT)
          .fill(null)
          .map((_, i) => (
            <CalendarDaySlots
              key={i}
              startHour={9}
              slotsCount={8}
              date={MOCK_OFFSET(i, 0)}
              freeHours={pipe(
                map((slot) => slot.start),
                filter(isWithinDay(addDays(i, TODAY))),
                map(getHours)
              )(freeSlots)}
              // freeHours={getDayFreeHours(freeSlots, addDays(i, TODAY))}
            />
          ))}
      </Box>
      <ControlsContainer sx={{ mt: 1 }}>
        <Button variant="contained" onClick={() => onContact()}>
          <Msg id="coaches.coach.contact" />
        </Button>
      </ControlsContainer>
    </Box>
  );
};

const CoachCard = ({ coach, freeSlots, onContact, sx = { mb: 3 } }) => {
  // eslint-disable-next-line no-unused-vars
  const {
    username,
    email,
    rate,
    firstName,
    lastName,
    name = `${firstName} ${lastName}`,
    role, // TODO: rm?
    experience,
    languages,
    bio,
    fields,
    photo,
    imgSrc = photo, // TODO: rm
  } = coach;
  const TODAY = new Date();

  console.log("[CoachCard.rndr]", name, { languages });

  return (
    // <Card sx={{ maxWidth: "100%", ...sx }}>
    <Card sx={{ ...sx }}>
      <CardContent sx={{ display: "flex", gap: 3, p: 3 }}>
        <CardMedia
          component="img"
          sx={{ width: 225 }}
          image={imgSrc}
          alt={name}
        />
        <Box
          sx={{
            maxWidth: "50%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 10,
            width: "150px",
          }}
        >
          <H1 gutterBottom>{name}</H1>
          <P gutterBottom>{role}</P>
          <P gutterBottom>
            <Msg id="coaches.coach.experience" values={{ experience }} />
          </P>
          <P gutterBottom>
            <Msg id="coaches.coach.languages" />
            {": "}
            {languages.map(getLabel(LANGUAGE_OPTIONS)).join(", ")}
          </P>
          <P gutterBottom>{bio}</P>
          <Box flex="1 1 auto" display="flex" />
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {fields.map(getLabel(FIELD_OPTIONS)).map((label) => (
              <Chip
                key={label}
                sx={{ borderRadius: "6px", bgcolor: "#F9F8FF" }}
                label={label}
              />
            ))}
          </Box>
        </Box>
        <TimeSlots
          slotsRange={[startOfDay(TODAY), pipe(addDays(6), endOfDay)(TODAY)]}
          freeSlots={freeSlots}
          onContact={() => onContact(coach)}
          sx={{ flexShrink: 0 }}
        />
      </CardContent>
    </Card>
  );
};

const COACHES = [
  {
    id: 1,
    name: "Milan Vlcek",
    role: "Associate Coach Certified - Issued by ICF",
    experience: 7,
    languages: ["en", "cs"],
    bio: "Saepe aspernatur enim velit libero voluptas aut optio nihil est. Ipsum porro aut quod sunt saepe error est consequatur. Aperiam hic consequuntur qui aut omnis atque voluptatum sequi deleniti. ",
    fields: [
      "business",
      "career",
      "change",
      "communication",
      "confidence",
      "conflict",
      "diversity",
      "entrepreneurship",
      "executive",
      "facilitation",
      "fitness",
      "health",
      "leadership",
      "life",
      "management",
      "mental_fitness",
      "mentorship",
      "negotiations",
      "organizational_development",
      "performance",
      "relationships",
      "sales",
      "teams",
      "time_management",
      "transformations",
      "wellbeing",
      "women",
    ],
    imgSrc: `https://i.pravatar.cc/225?u=${"" + Math.random()}`,
    // imgSrc: "https://i.pravatar.cc/225?img=1",
  },
  {
    id: 2,
    name: "Darnell Brekke",
    role: "Associate Coach Certified - Issued by ICF",
    experience: 2,
    languages: ["en"],
    bio: "Saepe aspernatur enim velit libero voluptas aut optio nihil est. Ipsum porro aut quod sunt saepe error est consequatur. Aperiam hic consequuntur qui aut omnis atque voluptatum sequi deleniti. ",
    fields: ["business", "life"],
    imgSrc: `https://i.pravatar.cc/225?u=${"" + Math.random()}`,
  },
  {
    id: 3,
    name: "Jenna Pagac",
    role: "Associate Coach Certified - Issued by ICF",
    experience: 3,
    languages: ["en", "cs"],
    bio: "Saepe aspernatur enim velit libero voluptas aut optio nihil est. Ipsum porro aut quod sunt saepe error est consequatur. Aperiam hic consequuntur qui aut omnis atque voluptatum sequi deleniti. ",
    fields: ["business", "life"],
    imgSrc: `https://i.pravatar.cc/225?u=${"" + Math.random()}`,
  },
];

const filterByIncludes = (value, arr) => !value || arr.includes(value);
const filterByRange = (value, number) =>
  !value || (value[0] <= number && value[1] >= number);

const coachPredicate =
  ({ language, field, experience }) =>
  (coach) =>
    filterByIncludes(language, coach.languages) &&
    filterByIncludes(field, coach.fields) &&
    filterByRange(experience, coach.experience);

const getPayload = ({
  filter: {
    language, //: "en",
    field, //: null,
    experience: [experienceFrom, experienceTo] = [], //: [1, 7],
    search, //: "",
  },
  page = {
    pageNumber: 0,
    pageSize: 1000000,
  },
}) =>
  console.log("getPayload", { filter, page }) || {
    page,
    languages: [language],
    fields: field ? [field] : undefined,
    experienceFrom,
    name: search,

    // TODO: BE bug - not accepting from-to, just one value from range
    // experienceTo,
    // prices: [],
  };

export function CoachesPageInner() {
  const msg = useMsg();
  const EXPECT_ITEMS = [
    {
      heading: msg("coaches.aside.items.1.heading"),
      iconName: "CreditCard",
      text: msg("coaches.aside.items.1.text"),
    },
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

  const [filter, setFilter] = useState(INITIAL_FILTER);
  console.log("[CoachesPage.rndr]", {});

  const TODAY = new Date();
  const MOCK_SLOT = CREATE_OFFSET(TODAY, (start) => createSlot({ start }));

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
  });

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
              freeSlots={[
                MOCK_SLOT(0 + (i % 3), 9),
                MOCK_SLOT(0 + (i % 3), 10),
                MOCK_SLOT(0 + (i % 3), 11),
                MOCK_SLOT(2 + (i % 3), 10),
                MOCK_SLOT(3 + (i % 3), 9),
                MOCK_SLOT(4 + (i % 3), 11),
              ]}
            />
          ))
        }
      />

      <Divider>Mocked users:</Divider>

      {/* {Array(25) */}
      {Array(1)
        .fill(null)
        .map((_, i) => COACHES)
        .reduce((acc, v) => acc.concat(v), [])
        .filter(coachPredicate(filter))
        .map((coach, i) => (
          <CoachCard
            key={coach.id + i}
            coach={coach}
            sx={{ my: 3 }}
            onContact={handleContact}
            freeSlots={[
              MOCK_SLOT(0 + (i % 3), 9),
              MOCK_SLOT(0 + (i % 3), 10),
              MOCK_SLOT(0 + (i % 3), 11),
              MOCK_SLOT(2 + (i % 3), 10),
              MOCK_SLOT(3 + (i % 3), 9),
              MOCK_SLOT(4 + (i % 3), 11),
            ]}
          />
        ))}

      <ContactModal
        // coach={COACHES[0]}
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
