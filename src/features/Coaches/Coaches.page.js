import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  InputAdornment,
  TextField,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Icon } from "../../components/Icon";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H1, P } from "../../components/Typography";
import { ControlsContainer } from "../Sessions/steps/Controls";
import { ContactModal } from "./ContactModal";
import { AutocompleteSelect, SliderField } from "./Fields";

const color = (color, msg) => ["%c" + msg, `color:${color};`];

export const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Czech", value: "cz" },
];
export const FIELD_OPTIONS = [
  { label: "Business", value: "business" },
  { label: "Life", value: "life" },
  { label: "Football", value: "football" },
];

const getFlagSrc = (option, isBigger) => {
  let code = option.value.toLowerCase();
  if (code === "en") code = "gb";

  if (isBigger) return `https://flagcdn.com/40x30/${code}.png 2x`;
  else return `https://flagcdn.com/20x15/${code}.png`;
};

const INITIAL_FILTER = {
  language: "en",
  field: null,
  experience: [1, 3],
  search: "",
};

const CoachesFilter = ({ filter, setFilter, sx = { my: 3 } }) => {
  const methods = useForm({
    // mode: "all",
    defaultValues: filter,
  });
  const onClearFilters = () => {
    methods.setValue("language", null);
    methods.setValue("field", null);
    methods.setValue("experience", null);
  };

  const language = methods.watch("language");
  const field = methods.watch("field");
  const experience = methods.watch("experience");

  const values = useMemo(
    () => ({ language, field, experience }),
    [field, language, experience]
  );

  console.log(...color("pink", "[CoachesFilter]"), {
    filter,
    values,
  });

  const setFilterRef = useRef(setFilter);
  setFilterRef.current = setFilter;
  useEffect(() => {
    setFilterRef.current((filter) => ({ ...filter, ...values }));
  }, [values]);

  return (
    <FormProvider {...methods}>
      <Card sx={{ ...sx }}>
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Box display="flex" flexDirection="row" gap={3}>
            <AutocompleteSelect
              name="language"
              label="Language"
              options={LANGUAGE_OPTIONS}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    loading="lazy"
                    width="20"
                    src={getFlagSrc(option)}
                    srcSet={getFlagSrc(option, true)}
                    alt=""
                  />
                  {option.label} ({option.value})
                </Box>
              )}
            />
            <AutocompleteSelect
              name="field"
              label="Field"
              options={FIELD_OPTIONS}
            />
            <SliderField name="experience" label="Experience" range={[1, 10]} />

            {/* <OutlinedField label="Test" /> */}
          </Box>
          <Divider sx={{ mt: 3, mb: 2 }} />
          <ControlsContainer>
            <Button
              onClick={onClearFilters}
              variant="text"
              startIcon={<Close />}
              sx={{ p: 1 }}
            >
              Remove all filters
            </Button>
          </ControlsContainer>
        </CardContent>
      </Card>
      <Box display="flex" flexDirection="row">
        <TextField
          disabled
          sx={{ width: 360, "> .MuiInputBase-root": { bgcolor: "white" } }}
          label=""
          placeholder={"Search"}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  sx={{
                    mr: -2,
                    px: 1,
                    minWidth: "auto",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  variant="contained"
                >
                  <Icon name="Search" />
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </FormProvider>
  );
};

const createSlot = ({ start, duration = 60 }) => ({
  start,
  // duration,
});

const HEADER_FORMAT = "d MMM";
const DAY_FORMAT = "E d";

const VISIBLE_DAYS_COUNT = 7;

const CREATE_OFFSET =
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

const DaySlots = ({ date, slotsCount, startHour, freeHours = [] }) => {
  const daySlots = Array(slotsCount)
    .fill(null)
    .map((_, index) => ({
      index,
      hour: index + startHour,
      isFree: freeHours.includes(index + startHour),
    }));
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      textAlign="center"
      gap={1}
    >
      <Box p={1}>{format(DAY_FORMAT, date)}</Box>
      {daySlots.map(({ hour, isFree }) => (
        <Box
          key={hour}
          borderRadius="6px"
          p={1}
          bgcolor={isFree ? "#F9F8FF" : "transparent"}
          color={isFree ? "primary.main" : "inherit"}
          fontWeight={isFree ? 500 : 400}
        >
          {isFree ? `${hour}:00` : "-"}
        </Box>
      ))}
    </Box>
  );
};

const isWithinDay = (dayDate) =>
  isWithinInterval({ start: startOfDay(dayDate), end: endOfDay(dayDate) });

const TimeSlots = ({ slotsRange = [], onContact, freeSlots = [] }) => {
  const TODAY = new Date();
  const MOCK_OFFSET = CREATE_OFFSET(TODAY);

  return (
    <Box width={468} display="flex" flexDirection="column" gap={1}>
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
            <DaySlots
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
          Contact
        </Button>
      </ControlsContainer>
    </Box>
  );
};

const getLabel = (options) => (searchValue) =>
  options.find(({ value }) => value === searchValue)?.label || searchValue;

const CoachCard = ({ coach, freeSlots, onContact, sx = { mb: 3 } }) => {
  const { id, name, role, experience, languages, description, fields, imgSrc } =
    coach;
  const TODAY = new Date();

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
        <Box display="flex" flexDirection="column" maxWidth={"50%"}>
          <H1 gutterBottom>{name}</H1>
          <P gutterBottom>{role}</P>
          <P gutterBottom>Experience: {experience} years</P>
          <P gutterBottom>
            Language: {languages.map(getLabel(LANGUAGE_OPTIONS)).join(", ")}
          </P>
          <P gutterBottom>{description}</P>
          <Box
            flex="1 1 auto"
            display="flex"
            flexDirection="column"
            flexWrap="nowrap"
            alignItems="flex-start"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                height: "100%",
                gap: 1,
              }}
            >
              {fields.map(getLabel(FIELD_OPTIONS)).map((label) => (
                <Chip
                  key={label}
                  sx={{ borderRadius: "6px", bgcolor: "#F9F8FF" }}
                  label={label}
                />
              ))}
            </Box>
          </Box>
        </Box>
        <TimeSlots
          slotsRange={[startOfDay(TODAY), pipe(addDays(6), endOfDay)(TODAY)]}
          freeSlots={freeSlots}
          onContact={() => onContact(coach)}
        />
      </CardContent>
    </Card>
  );
};

const EXPECT_ITEMS = [
  {
    heading: "€100",
    iconName: "CreditCard",
    text: "Fixed price of all sessions",
  },
  {
    heading: "Trusted specialists",
    iconName: "Star",
    text: "Deleniti sed dignissimos minima quibusdam. Possimus enim asperiores quia maiores rem rerum.",
  },
  {
    heading: "Privacy",
    iconName: "Lock",
    text: "Deleniti sed dignissimos minima quibusdam. Possimus enim asperiores quia maiores rem rerum.",
  },
];

const COACHES = [
  {
    id: 1,
    name: "Milan Vlcek",
    role: "Associate Coach Certified - Issued by ICF",
    experience: 3,
    languages: ["en", "cz"],
    description:
      "Saepe aspernatur enim velit libero voluptas aut optio nihil est. Ipsum porro aut quod sunt saepe error est consequatur. Aperiam hic consequuntur qui aut omnis atque voluptatum sequi deleniti. ",
    fields: ["football"],
    imgSrc: `https://i.pravatar.cc/225?u=${"" + Math.random()}`,
    // imgSrc: "https://i.pravatar.cc/225?img=1",
  },
  {
    id: 2,
    name: "Darnell Brekke",
    role: "Associate Coach Certified - Issued by ICF",
    experience: 3,
    languages: ["en", "cz"],
    description:
      "Saepe aspernatur enim velit libero voluptas aut optio nihil est. Ipsum porro aut quod sunt saepe error est consequatur. Aperiam hic consequuntur qui aut omnis atque voluptatum sequi deleniti. ",
    fields: ["business", "life"],
    imgSrc: `https://i.pravatar.cc/225?u=${"" + Math.random()}`,
  },
  {
    id: 3,
    name: "Jenna Pagac",
    role: "Associate Coach Certified - Issued by ICF",
    experience: 3,
    languages: ["en", "cz"],
    description:
      "Saepe aspernatur enim velit libero voluptas aut optio nihil est. Ipsum porro aut quod sunt saepe error est consequatur. Aperiam hic consequuntur qui aut omnis atque voluptatum sequi deleniti. ",
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

export function CoachesPage() {
  const [filter, setFilter] = useState(INITIAL_FILTER);
  console.log("[CoachesPage.rndr]", {});

  const TODAY = new Date();
  const MOCK_SLOT = CREATE_OFFSET(TODAY, (start) => createSlot({ start }));

  const [contactCoach, setContactCoach] = useState(null);
  const handleContact = (coach) => setContactCoach(coach);

  return (
    <Layout
      rightMenuContent={
        <ScrollableRightMenu heading={"What to expect"}>
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
          <H1>Coaches</H1>
        </Box>
        <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
      </Box>
      <CoachesFilter filter={filter} setFilter={setFilter} />
      {COACHES.filter(coachPredicate(filter)).map((coach, i) => (
        <CoachCard
          key={coach.id}
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
