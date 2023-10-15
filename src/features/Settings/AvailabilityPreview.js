import { Box } from "@mui/material";
import { getDay } from "date-fns";
import { useContext, useMemo } from "react";
import { useAuth } from "../Authorization";
import {
  AvailabilityCalendar,
  CREATE_OFFSET,
} from "../Availability/AvailabilityCalendar";
import { TimeSlot } from "../Availability/CalendarDaySlots";
import { I18nContext } from "../I18n/I18nProvider";
import { INDEX_TO_DAY } from "./AvailabilitySettings";

export const AvailabilityPreview = () => {
  const { user } = useAuth();

  return (
    <AvailabilityCalendar
      coach={{ username: user.data.username, timeZone: user.data.timeZone }}
      sx={{ flexShrink: 0 }}
    />
  );
};

// TODO: use following design, eg. orientation="horizontal"

//

//

//

//

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

const parseTimeHours = (time) => {
  const [h = "", m, s] = time?.split?.(":") || [];
  if (m === "00" && s === "00" && h?.match?.(/^\d{2}$/)) {
    return parseInt(h, 10);
  } else return NaN;
};
const getRangeHours = ({ timeFrom, timeTo }) => {
  const startHour = parseTimeHours(timeFrom);
  const endHour = parseTimeHours(timeTo);
  if (isNaN(startHour) || isNaN(endHour)) {
    throw new Error(
      "getRangeHours cannot parse time: " + JSON.stringify({ timeFrom, timeTo })
    );
  }

  const hoursCount = endHour - startHour;
  const hours = Array(hoursCount)
    .fill(null)
    .map((_, i) => startHour + i);

  console.log("[getRangeHours]", {
    hours,
    hoursCount,
    timeFrom,
    timeTo,
    startHour,
    endHour,
  });
  return hours;
};

const _AvailabilityPreview = ({ availabilityData }) => {
  const previewDays = useMemo(() => {
    const dayCount = 7;
    const rows = Array(dayCount)
      .fill(null)
      .map((_, i) => {
        const date = CREATE_OFFSET(new Date())(i, 0);
        const dayIndex = getDay(date); // 0 - Sun
        const dayName = INDEX_TO_DAY[dayIndex];
        const ranges = availabilityData?.[dayName] ?? [];
        // const { day, date: _date, timeFrom, timeTo, recurring } = ranges?.[0] || {}; // TODO
        const freeHours = ranges.reduce((acc, range) => {
          const { day, date: _date, timeFrom, timeTo, recurring } = range;
          const rangeHours = getRangeHours({ timeFrom, timeTo });
          return [...acc, ...rangeHours];
        }, []);
        // const freeHours = [9, 10, 11, 13, 14, 16];
        console.log("[previewDays]", dayName, { freeHours, ranges, date });

        return {
          date,
          freeHours,
        };
      });

    return rows;
  }, [availabilityData]);
  const [firstHour, lastHour] = previewDays.reduce(
    (acc, { date, freeHours }) => {
      const sorted = [...(freeHours ?? [])].sort((a, b) => a - b);
      const lowest = sorted[0];
      const highest = sorted[sorted.length - 1];
      const newLowest =
        typeof acc[0] !== "number" || lowest < acc[0] ? lowest : acc[0];
      const newHighest =
        typeof acc[1] !== "number" || highest > acc[1] ? highest : acc[1];

      return [newLowest, newHighest];
    },
    []
  );
  const slotsCount = firstHour === lastHour ? 0 : lastHour - firstHour + 1;

  return (
    <Box display="flex" flexDirection="column" gap={2} overflow="scroll">
      {previewDays.map(({ date, freeHours }, i) => (
        <CalendarDaySlots
          sx={{
            flexDirection: "row",
            // flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
          }}
          dateSx={{ minWidth: "40px", p: 0 }}
          // slotSx={{ width: "60px" }}
          key={i}
          startHour={firstHour ?? 9}
          slotsCount={slotsCount}
          date={date}
          freeHours={freeHours}
          // freeHours={getDayFreeHours(freeSlots, addDays(i, TODAY))}
        />
      ))}
    </Box>
  );
};
