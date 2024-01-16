import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, IconButton, Skeleton } from "@mui/material";
import {
  addDays,
  eachHourOfInterval,
  endOfDay,
  isWithinInterval,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns/fp";
import {
  converge,
  filter,
  identity,
  map,
  pipe,
  prop,
  reduce,
  subtract,
  times,
} from "ramda";
import { useCallback, useContext, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { defineMessages } from "react-intl";
import { anchorTime } from "../../components/Forms";
import { Icon } from "../../components/Icon";
import { LayoutCtx } from "../../components/Layout";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { useAuth } from "../Authorization";
import { I18nContext } from "../I18n/I18nProvider";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { QueryRenderer } from "../QM/QueryRenderer";
import { ControlsContainer } from "../Sessions/steps/Controls";
import {
  getIsDayLoading,
  isIntervalWithin,
  useAvailabilityQueries,
  usePickSlotMutation,
} from "./api";

const HEADER_FORMAT = "d MMM";

// const computeSlotStats = pipe( reduce( ({ lowestHour, highestHour }, interval) => { const startHour = getHours(interval.start); const endHour = getHours(fixEnd(interval.end)); if (interval.end - interval.start > 60 * 60 * 1000) console.log("[computeSlotStats] interval longer than 1 hour", { interval, }); return { lowestHour: Math.min(lowestHour, startHour), highestHour: Math.max(highestHour, endHour), }; }, { lowestHour: 12, highestHour: 12 } ), ({ lowestHour, highestHour }) => ({ slotsCount: Math.max(highestHour - lowestHour + 1, 3), firstHour: lowestHour || 9, lowestHour, highestHour, }) );

const getAnchoredTimeRange = (dayDate = new Date()) =>
  pipe(
    reduce(
      (acc, { start, end }) => ({
        start: Math.min(acc.start, +anchorTime(dayDate, start)),
        end: Math.max(acc.end, +anchorTime(dayDate, end)),
      }),
      { start: +endOfDay(dayDate), end: +startOfDay(dayDate) }
    ),
    map((timestamp) => new Date(timestamp))
  );

const minsToHeight = (mins) => mins * 0.6;
const intervalToHeight = converge(
  pipe(subtract, (duration) => duration / (1000 * 60), minsToHeight),
  [prop("end"), prop("start")]
);

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

export const AvailabilityCalendar = ({
  coach,
  onContact,
  onPick: onPickProp,
  pickPending,
  visibleDaysCount: visibleDaysCountProp,
  sx,
  today: todayProp,
  disablePickSlot = false,
  cellWidth = "47px",
}) => {
  const { downLg } = useContext(LayoutCtx);
  const visibleDaysCount = visibleDaysCountProp || downLg ? 3 : 7;
  const msg = useMsg({ dict: messages });
  const today = useMemo(() => todayProp || new Date(), [todayProp]);
  const [offsetDays, setOffsetDays] = useState(0);
  const calendarInterval = useMemo(
    () => ({
      start: pipe(addDays(offsetDays), startOfDay)(today),
      end: pipe(addDays(offsetDays + visibleDaysCount - 1), endOfDay)(today),
    }),
    [offsetDays, today, visibleDaysCount]
  );
  const createAddOffset = (days) => () => setOffsetDays((d) => d + days);

  const { i18n, userTz } = useContext(I18nContext);
  const [pickSlot, setPickSlot] = useState();

  const { someResultsQuery, queries } = useAvailabilityQueries({
    username: coach?.username,
    timeZone: coach?.timeZone, // TODO: Should work, check that it's everywhere
    calendarInterval,
  });
  const pickSlotMutation = usePickSlotMutation({
    username: coach?.username,
    onSuccess: () => {
      setPickSlot();
    },
  });

  const { user } = useAuth();
  const pickedCoach = user.data.coach;
  const onPick = useMemo(
    () => (pickedCoach === coach.username ? onPickProp : onPickProp),
    [coach.username, onPickProp, pickedCoach]
  );

  const onTimeslotClick = useCallback(
    ({ interval }) => {
      if (disablePickSlot) return;
      setPickSlot({ interval, coach });
    },
    [disablePickSlot, coach]
  );
  const { reset } = pickSlotMutation;
  const handleClosePickSlotModal = useCallback(() => {
    setPickSlot();
    reset();
  }, [reset]);

  // prettier-ignore
  console.log( "%c[AvailabilityCalendar.rndr]", "color:deeppink", coach.username, { today, calendarInterval, someResultsQuery, queries, onPick, pickedCoach, coach, visibleDaysCount, } );

  return (
    <Box
      sx={{
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
        justifyContent="space-between"
        borderRadius={"6px"}
        color="primary.main"
        fontWeight={500}
      >
        <IconButton
          variant="outlined"
          size="small"
          sx={{ color: "inherit" }}
          onClick={createAddOffset(-1)}
        >
          <Icon name={"ChevronLeft"} />
        </IconButton>
        <IconButton
          variant="outlined"
          size="small"
          sx={{ color: "inherit" }}
          onClick={createAddOffset(-3)}
        >
          <Icon name={"KeyboardDoubleArrowLeft"} />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 2,
          }}
        >
          {i18n.formatLocal(calendarInterval.start, HEADER_FORMAT)} -{" "}
          {i18n.formatLocal(calendarInterval.end, HEADER_FORMAT)}
        </Box>
        <IconButton
          variant="outlined"
          size="small"
          sx={{ color: "inherit" }}
          onClick={createAddOffset(3)}
        >
          <Icon name={"KeyboardDoubleArrowRight"} />
        </IconButton>
        <IconButton
          variant="outlined"
          size="small"
          sx={{ color: "inherit" }}
          onClick={createAddOffset(1)}
        >
          <Icon name={"ChevronRight"} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderBottom: "1px solid #EAECF0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 1,
            // px: 1,
          }}
        >
          {times(identity, visibleDaysCount).map((index) => {
            const date = addDays(index, calendarInterval.start);

            return (
              <Box
                sx={{
                  p: 0.5,
                  pb: 1,
                  position: "relative",
                  textAlign: "center",
                  width: cellWidth,
                }}
              >
                {i18n.formatLocal(date, "E")}
                <br />
                {i18n.formatLocal(date, "d")}
              </Box>
            );
          })}
        </Box>
        <Box
          sx={{
            height: 125,
            overflow: "auto",
          }}
        >
          <QueryRenderer
            {...someResultsQuery}
            loaderName="Block"
            success={({ data: availabilityIntervals }) => {
              if (!Array.isArray(availabilityIntervals)) return null;

              const anchoredInterval = getAnchoredTimeRange(today)(
                availabilityIntervals
              );

              return (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 1,
                    // px: 1,
                  }}
                >
                  {times(identity, visibleDaysCount).map((index) => {
                    const date = addDays(index, calendarInterval.start);
                    const dayInterval = {
                      start: startOfDay(date),
                      end: endOfDay(date),
                    };
                    const dayAvailabilities = filter(
                      isIntervalWithin({
                        parentInterval: dayInterval,
                        overlapping: "debugger",
                      }),
                      availabilityIntervals
                    );
                    const isLoading = getIsDayLoading({
                      queries,
                      dayInterval,
                      userTz,
                    });
                    const visibleDayInterval = {
                      start: anchorTime(date, anchoredInterval.start),
                      end: anchorTime(date, anchoredInterval.end),
                    };

                    const displayedMs =
                      visibleDayInterval.end - visibleDayInterval.start;
                    // assuming one slot === 1 hour
                    const slotsCount =
                      Math.max(
                        0, // loading - negative
                        Math.ceil(displayedMs / (1000 * 60 * 60))
                      ) || 0; // NaN
                    const unavailableSlots = Array(slotsCount)
                      .fill(null)
                      .map((_, idx) => {
                        const slotStart = new Date(
                          +visibleDayInterval.start + idx * 60 * 60 * 1000
                        );
                        const isAvailable = dayAvailabilities.some((interval) =>
                          isWithinInterval(interval, slotStart)
                        );
                        if (isAvailable) return null;
                        return {
                          idx,
                          top: intervalToHeight({
                            start: visibleDayInterval.start,
                            end: slotStart,
                          }),
                          height: minsToHeight(60) - 5,
                          slotStart,
                          // _: { visibleDayInterval, displayedMs, slotsCount, displayedHours: displayedMs / (1000 * 60 * 60), },
                        };
                      })
                      .filter(Boolean);

                    // prettier-ignore
                    console.log( "[AvailabilityCalendar.rndr] DAY rndr prop", date, {displayedMs, slotsCount, unavailableSlots}, { date, dayInterval, dayAvailabilities, isLoading }, { anchoredInterval, availabilityIntervals, visibleDaysCount } );

                    return (
                      <Box
                        key={date.toISOString()}
                        sx={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          textAlign: "center",
                          gap: 1,
                          width: cellWidth,
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            height: intervalToHeight(visibleDayInterval),
                          }}
                        >
                          {unavailableSlots.map(
                            ({ idx, top, height, slotStart }) => {
                              const text = i18n.formatLocalMaybe(
                                slotStart,
                                "p"
                              );
                              return (
                                <Box
                                  key={text}
                                  sx={{
                                    position: "absolute",
                                    height,
                                    lineHeight: `${height}px`,
                                    top,
                                    cursor: "default",
                                    borderRadius: "6px",
                                    bgcolor: "transparent",
                                    color: "inherit",
                                    fontWeight: 400,
                                    width: "100%",
                                    overflowX: "hidden",
                                  }}
                                >
                                  {isLoading ? (
                                    <Skeleton />
                                  ) : (
                                    <span title={text}> - </span>
                                  )}
                                </Box>
                              );
                            }
                          )}
                          {dayAvailabilities.map((interval) => {
                            const text = i18n.formatLocalMaybe(
                              interval.start,
                              "p"
                            );
                            const onClick =
                              interval &&
                              onTimeslotClick &&
                              !isLoading &&
                              (() => onTimeslotClick({ interval }));
                            const height = intervalToHeight(interval) - 5;

                            return (
                              <Box
                                key={text}
                                sx={{
                                  position: "absolute",
                                  height: height,
                                  lineHeight: `${height}px`,
                                  top: intervalToHeight({
                                    start: visibleDayInterval.start,
                                    end: interval.start,
                                  }),
                                  cursor: onClick ? "pointer" : "default",
                                  borderRadius: "6px",
                                  // py: 0.9,
                                  // px: 0.5,
                                  bgcolor: "#F9F8FF",
                                  color: "primary.main",
                                  fontWeight: 500,
                                  width: "100%",
                                  overflowX: "hidden",
                                }}
                                onClick={onClick}
                              >
                                {isLoading ? (
                                  <Skeleton />
                                ) : (
                                  <span title={text}>{text}</span>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              );
            }}
          />
        </Box>
      </Box>
      <ConfirmModal
        open={!!pickSlot}
        onClose={handleClosePickSlotModal}
        iconName="RocketLaunch"
        title={msg("availability-calendar.confirm-reservation.title", {
          date: i18n.formatLocalMaybe(pickSlot?.interval?.start, "PPPPpppp"),
        })}
        desc={msg("availability-calendar.confirm-reservation.desc", {
          name: `${coach?.firstName} ${coach.lastName}`,
        })}
        buttons={[
          {
            variant: "outlined",
            type: "button",
            children: "Cancel",
            onClick: handleClosePickSlotModal,
          },
          {
            component: LoadingButton,
            variant: "contained",
            type: "button",
            children: "Confirm",
            disabled: pickSlotMutation.isLoading,
            loading: pickSlotMutation.isLoading,
            onClick: () => pickSlotMutation.mutate(pickSlot),
          },
        ]}
        sx={{ width: "800px" }}
      >
        <QueryRenderer
          {...pickSlotMutation}
          success={() => null}
          loading={() => null}
          errored={({ error }) => (
            <Alert severity="error">{error?.message || "Oops!"}</Alert>
          )}
        />
      </ConfirmModal>

      {(onContact || onPick) && (
        <>
          <ControlsContainer sx={{ mt: 1 }}>
            {onPick && (
              <LoadingButton
                variant="outlined"
                onClick={() =>
                  onPick(pickedCoach === coach.username ? null : coach.username)
                }
                loading={pickPending}
              >
                {pickedCoach === coach.username
                  ? msg("coaches.coach.change-picked")
                  : msg("coaches.coach.pick")}
              </LoadingButton>
            )}
            {onContact && (
              <Button variant="contained" onClick={onContact}>
                <Msg id="coaches.coach.contact" />
              </Button>
            )}
          </ControlsContainer>
        </>
      )}
    </Box>
  );
};

export const messages = defineMessages({
  "availability-calendar.confirm-reservation.title": {
    id: "availability-calendar.confirm-reservation.title",
    defaultMessage: "Confirm reservation {date}",
  },
  "availability-calendar.confirm-reservation.desc": {
    id: "availability-calendar.confirm-reservation.desc",
    defaultMessage:
      "By booking this time slot you are confirming if want to proceed coaching sessions with {name}.",
  },
  "coaches.coach.pick": {
    id: "coaches.coach.pick",
    defaultMessage: "Pick the Coach",
  },
  "coaches.coach.change-picked": {
    id: "coaches.coach.change-picked",
    defaultMessage: "Change coach",
  },
});
