import { LoadingButton } from "@mui/lab";
import { Box, Button, IconButton } from "@mui/material";
import {
  addDays,
  endOfDay,
  format,
  getHours,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns/fp";
import { filter, identity, pipe, reduce, times } from "ramda";
import { useCallback, useContext, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Msg } from "../../components/Msg/Msg";
import { useAuth } from "../Authorization";
import { I18nContext } from "../I18n/I18nProvider";
import { fixEnd } from "../I18n/utils/date";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { QueryRenderer } from "../QM/QueryRenderer";
import { ControlsContainer } from "../Sessions/steps/Controls";
import { CalendarDaySlots } from "./CalendarDaySlots";
import {
  isIntervalWithin,
  useCoachAvailabilityQuery,
  usePickSlotMutation,
} from "./api";
import { Icon } from "../../components/Icon";

const HEADER_FORMAT = "d MMM";
const VISIBLE_DAYS_COUNT = 7;

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
  visibleDaysCount = VISIBLE_DAYS_COUNT,
  sx,
  today: todayProp,
}) => {
  const today = useMemo(() => todayProp || new Date(), [todayProp]);
  const [offsetDays, setOffsetDays] = useState(0);
  const calendarInterval = useMemo(
    () => ({
      start: pipe(addDays(offsetDays), startOfDay)(today),
      end: pipe(addDays(offsetDays + visibleDaysCount - 1), endOfDay)(today),
    }),
    [offsetDays, today, visibleDaysCount]
  );
  const onNext = useCallback(() => {
    console.log("onNext");
    setOffsetDays((d) => d + 1);
  }, []);
  const onBack = useCallback(() => {
    console.log("onBack");
    setOffsetDays((d) => d - 1);
  }, []);

  const { i18n } = useContext(I18nContext);
  const [pickSlot, setPickSlot] = useState();
  const coachAvailabilityQuery = useCoachAvailabilityQuery({
    username: coach?.username,
    calendarInterval,
  });
  const pickSlotMutation = usePickSlotMutation({
    username: coach?.username,
    onSuccess: () => {
      setPickSlot();
    },
  });

  // const confirmModal =  // TODO
  const onTimeslotClick = useCallback(
    ({ interval }) => {
      setPickSlot({ interval, coach });
      // return pickSlotMutation.mutate({ interval });
    },
    [coach]
  );
  const { user } = useAuth();
  const pickedCoach = user.data.coach;
  const onPick = useMemo(
    () => (pickedCoach === coach.username ? undefined : onPickProp),
    [coach.username, onPickProp, pickedCoach]
  );

  // const availabilityIntervalsMaybe = allFetched
  //   ? availabilityIntervals
  //   : undefined;
  // const { daysArr, slotsCount, firstHour } = useMemo(() => {
  //   if (!availabilityIntervalsMaybe) return {};
  //   const availabilityIntervals = availabilityIntervalsMaybe;
  //   const { slotsCount, firstHour } = computeSlotParams(availabilityIntervals);
  //   const daysArr = createIndicies(visibleDaysCount).map((index) => {
  //     const date = addDays(index, calendarInterval.start);
  //     const dayInterval = { start: startOfDay(date), end: endOfDay(date) };
  //     const dayIntervals = filter( isIntervalWithin({ parentInterval: dayInterval, overlapping: "throw", }), availabilityIntervals );
  //     return { index, date, dayIntervals, };
  //   });
  //   return { daysArr, slotsCount, firstHour };
  // }, [availabilityIntervalsMaybe, calendarInterval.start, visibleDaysCount]);

  console.log(
    "%c[AvailabilityCalendar.rndr]",
    "color:deeppink",
    coach.username,
    { calendarInterval, coachAvailabilityQuery }
  );

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
        justifyContent="space-between"
        borderRadius={"6px"}
        color="primary.main"
        fontWeight={500}
      >
        <IconButton
          variant="outlined"
          size="small"
          // disableRipple
          sx={{ color: "inherit" }}
          onClick={onBack}
        >
          <Icon name={"ChevronLeft"} />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {format(HEADER_FORMAT, calendarInterval.start)} -{" "}
          {format(HEADER_FORMAT, calendarInterval.end)}
        </Box>
        <IconButton
          variant="outlined"
          size="small"
          // disableRipple
          sx={{ color: "inherit" }}
          onClick={onNext}
        >
          <Icon name={"ChevronRight"} />
        </IconButton>
      </Box>
      <Box
        display="flex"
        gap={1}
        height={180}
        overflow="auto"
        borderBottom="1px solid #EAECF0"
      >
        <QueryRenderer
          {...coachAvailabilityQuery}
          loaderName="Block"
          success={({ data: availabilityIntervals }) => {
            console.log({ availabilityIntervals });
            // debugger;
            if (!Array.isArray(availabilityIntervals)) return null;
            const { slotsCount, firstHour } = computeSlotParams(
              availabilityIntervals
            );
            const daysArr = times(identity, visibleDaysCount).map((index) => {
              const date = addDays(index, calendarInterval.start);
              const dayInterval = {
                start: startOfDay(date),
                end: endOfDay(date),
              };
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
            });

            return daysArr.map(({ date, dayIntervals }) => (
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
            ));
          }}
        />
      </Box>
      <ConfirmModal
        open={!!pickSlot}
        onClose={() => setPickSlot()}
        iconName="RocketLaunch"
        title={`Confirm reservation ${i18n.formatLocalMaybe(
          pickSlot?.interval?.start,
          "PPPPpppp"
        )}`}
        desc={`By booking this time slot tou are confirming if want to proceed coaching sessions with ${coach?.firstName} ${coach.lastName}.`}
        buttons={[
          {
            variant: "outlined",
            type: "button",
            children: "Cancel",
            onClick: () => setPickSlot(),
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
      />
      {(onContact || onPick) && (
        <>
          <ControlsContainer sx={{ mt: 1 }}>
            {onPick && (
              <LoadingButton
                variant="outlined"
                onClick={onPick}
                loading={pickPending}
              >
                <Msg id="coaches.coach.pick" />
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
