import { Box, Skeleton } from "@mui/material";
import { useContext } from "react";
import { I18nContext } from "../I18n/I18nProvider";

export const TimeSlot = ({ hour, isLoading, isFree, onClick, sx = {} }) => {
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
      {isLoading ? <Skeleton /> : isFree ? `${hour}:00` : "-"}
    </Box>
  );
};

export const CalendarDaySlots = ({
  date,
  // dayIntervals,
  // slotsCount = 1,
  // firstHour,
  slots = [],
  onTimeslotClick,
  sx = { flexDirection: "column" },
  dateSx,
  slotSx,
  isLoading,
}) => {
  const { i18n } = useContext(I18nContext);

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
        {i18n.formatLocal(date, "E")}
        <br />
        {i18n.formatLocal(date, "d")}
      </Box>
      {slots.map(({ hour, isFree, interval }) => (
        <TimeSlot
          onClick={
            interval &&
            onTimeslotClick &&
            !isLoading &&
            (() => onTimeslotClick({ interval }))
          }
          key={hour}
          hour={hour}
          isFree={isFree}
          sx={slotSx}
          isLoading={isLoading}
        />
      ))}
    </Box>
  );
};
