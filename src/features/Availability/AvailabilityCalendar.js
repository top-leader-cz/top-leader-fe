import { Box, Button } from "@mui/material";
import {
  addDays,
  endOfDay,
  format,
  getHours,
  getSeconds,
  isWithinInterval,
  set,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  subSeconds,
} from "date-fns/fp";
import {
  filter,
  flatten,
  identity,
  map,
  pipe,
  reduce,
  times,
  values,
} from "ramda";
import { useContext, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { I18nContext, getBrowserTz, parseUtcZoned } from "../../App";
import { Msg } from "../../components/Msg/Msg";
import { ControlsContainer } from "../Sessions/steps/Controls";

export const createSlot = ({ start, duration = 60 }) => ({
  start,
  // duration,
});

const HEADER_FORMAT = "d MMM";
const VISIBLE_DAYS_COUNT = 7;

const fixEnd = (end) => {
  if (getSeconds(end) === 0) {
    // console.log("fixEnd fixing now", end);
    return subSeconds(1, end);
  }
  return end;
};

const fixIntEnd = (interval) => {
  if (getSeconds(interval.end) === 0) {
    return { ...interval, end: fixEnd(interval.end) };
  }
  return interval;
};

export const TimeSlot = ({ hour, isFree, onClick, sx = {} }) => {
  return (
    <Box
      key={hour}
      borderRadius="6px"
      py={1}
      px={0.5}
      bgcolor={isFree ? "#F9F8FF" : "transparent"}
      color={isFree ? "primary.main" : "inherit"}
      fontWeight={isFree ? 500 : 400}
      sx={{ cursor: onClick ? "pointer" : "default", ...sx }}
      onClick={onClick}
    >
      {isFree ? `${hour}:00` : "-"}
    </Box>
  );
};

const parseSlotDateTime = (date, time, tz) => {
  const utcDate = parseUtcZoned(tz, `${date}T${time}`);
  // console.log("[parseSlotDateTime]", { date, time, tz });
  return utcDate;
};
const parseSlot =
  (userTz = getBrowserTz()) =>
  ({ date, timeFrom, timeTo }) => {
    // {
    //     "day": "MONDAY",
    //     "date": "2023-09-24",
    //     "timeFrom": "09:00:00",
    //     "timeTo": "10:00:00",
    //     "firstDayOfTheWeek": "2023-09-24"
    // },
    const start = parseSlotDateTime(date, timeFrom, userTz);
    const end = parseSlotDateTime(date, timeTo, userTz);

    return { start, end };
  };

const computeSlotParams = pipe(
  reduce(
    ({ lowestHour, highestHour }, interval) => {
      const startHour = getHours(interval.start);
      const endHour = getHours(fixEnd(interval.end));
      if (startHour !== endHour)
        console.log("[computeSlotParams] interval longer than 1 hour", {
          interval,
        });
      return {
        lowestHour: Math.min(lowestHour, startHour),
        highestHour: Math.max(highestHour, endHour),
      };
    },
    { lowestHour: 12, highestHour: 12 }
  ),
  ({ lowestHour, highestHour }) => ({
    slotsCount: highestHour - lowestHour + 1 || 3,
    firstHour: lowestHour || 9,
  })
);

const handleIntervalOverlapping = ({
  overlapping,
  interval,
  parentInterval,
}) => {
  const msg = `[isIntervalWithin] Overlapping interval ${interval.start} - ${interval.end}`;
  switch (overlapping) {
    case true:
      return true;
    case "throw":
      throw new Error(msg);
    case "debugger":
      debugger;
    // eslint-disable-next-line no-fallthrough
    default:
      console.log(`%c${msg}`, "color:magenta", {
        parentInterval,
        interval,
      });
      return false;
  }
};

const isIntervalWithin =
  ({ parentInterval, overlapping = "throw" }) =>
  (interval) => {
    const startWithin = isWithinInterval(parentInterval, interval.start);
    const endWithin = isWithinInterval(parentInterval, fixEnd(interval.end));
    if (startWithin !== endWithin) {
      handleIntervalOverlapping({ overlapping, interval, parentInterval });
    }
    return startWithin;
  };
// TODO: tests :)
const parseAvailabilities = ({
  userTz,
  parentInterval,
  overlapping = "throw",
}) =>
  pipe(
    values,
    flatten,
    map(parseSlot(userTz)),
    parentInterval
      ? filter(isIntervalWithin({ parentInterval, overlapping }))
      : identity
  );

const CalendarDaySlots = ({
  date,
  dayIntervals,
  slotsCount,
  firstHour,
  onTimeslotClick,
  sx = { flexDirection: "column" },
  dateSx,
  slotSx,
}) => {
  const { i18n } = useContext(I18nContext);

  const freeHours = dayIntervals.map(({ start }) => getHours(start));
  const slots = createIndicies(slotsCount).map((index) => {
    const hour = index + firstHour;
    const startDateTime = set({ hours: hour }, date);
    const intervals = dayIntervals.filter((interval) =>
      isWithinInterval(fixIntEnd(interval), startDateTime)
    );
    const isFree = freeHours.includes(hour);

    if (isFree) {
      if (intervals.length !== 1) {
        throw new Error("Missing intervals, check");
      }
      // console.log( `%c[CalendarDaySlots] ${intervals.length} intervals found`, intervals.length > 1 ? "color:red" : "color:salmon", { isFree, intervals, hour, date, startDateTime, } );
    }
    return {
      index,
      hour,
      // hour: `${hour}(${intervalHour})`,
      isFree,
      interval: intervals?.[0],
    };
  });

  // console.log("%c[CalendarDaySlots.rndr]", "color:gold", { date, dayIntervals, slotsCount, firstHour, slots, });

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
      {slots.map(({ hour, isFree, interval }) => (
        <TimeSlot
          onClick={onTimeslotClick && (() => onTimeslotClick({ interval }))}
          key={hour}
          hour={hour}
          isFree={isFree}
          sx={slotSx}
        />
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

const parseStartHour = ({ timeFrom, date }) => {
  const str = (timeFrom || "").substring(0, 2);
  const number = parseInt(str, 10);
  // console.log({ str, number });
  return number;
};

const createIndicies = times(identity);

export const AvailabilityCalendar = ({
  availabilitiesByDay,
  onTimeslotClick,
  onContact,
  visibleDaysCount = VISIBLE_DAYS_COUNT,
  sx,
  today: todayProp,
  coachName = "",
}) => {
  const { i18n, userTz } = useContext(I18nContext);

  const today = useMemo(() => todayProp || new Date(), [todayProp]);
  const offsetDays = 0; // TODO: back/forward week
  const calendarInterval = useMemo(
    () => ({
      start: pipe(addDays(offsetDays), startOfDay)(today),
      end: pipe(addDays(offsetDays + visibleDaysCount - 1), endOfDay)(today),
    }),
    [today, visibleDaysCount]
  );

  const availabilityIntervals = useMemo(
    () =>
      parseAvailabilities({
        userTz,
        parentInterval: calendarInterval,
        overlapping: "throw", // TODO: true
      })(availabilitiesByDay),
    [availabilitiesByDay, calendarInterval, userTz]
  );
  const { slotsCount, firstHour } = computeSlotParams(availabilityIntervals);

  const daysArr = useMemo(
    () =>
      createIndicies(visibleDaysCount).map((index) => {
        const date = addDays(index, calendarInterval.start);
        const dayInterval = { start: startOfDay(date), end: endOfDay(date) };
        const dayIntervals = filter(
          isIntervalWithin({
            parentInterval: dayInterval,
            overlapping: "throw",
          }),
          availabilityIntervals
        );

        return {
          index,
          date,
          dayIntervals,
        };
      }),
    [availabilityIntervals, calendarInterval.start, visibleDaysCount]
  );

  console.log("%c[AvailabilityCalendar.rndr]", "color:deeppink", coachName, {
    availabilitiesByDay,
    availabilityIntervals,
    calendarInterval,
    daysArr,
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
        {format(HEADER_FORMAT, calendarInterval.start)} -{" "}
        {format(HEADER_FORMAT, calendarInterval.end)}
      </Box>
      <Box
        display="flex"
        gap={1}
        maxHeight={180}
        overflow="auto"
        borderBottom="1px solid #EAECF0"
      >
        {daysArr.map(({ date, dayIntervals }) => (
          <ErrorBoundary
            key={date.toISOString()}
            fallbackRender={(props) => {
              return null;
            }}
          >
            <CalendarDaySlots
              key={date.toISOString()}
              date={date}
              slotsCount={slotsCount}
              firstHour={firstHour}
              dayIntervals={dayIntervals}
              onTimeslotClick={onTimeslotClick}
            />
          </ErrorBoundary>
        ))}
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
