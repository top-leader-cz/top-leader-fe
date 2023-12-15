import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, IconButton } from "@mui/material";
import {
  addDays,
  endOfDay,
  getHours,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns/fp";
import { filter, identity, pipe, reduce, times } from "ramda";
import { useCallback, useContext, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { defineMessages } from "react-intl";
import { Icon } from "../../components/Icon";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { useAuth } from "../Authorization";
import { I18nContext } from "../I18n/I18nProvider";
import { fixEnd } from "../I18n/utils/date";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { QueryRenderer } from "../QM/QueryRenderer";
import { ControlsContainer } from "../Sessions/steps/Controls";
import { CalendarDaySlots } from "./CalendarDaySlots";
import {
  getIsDayLoading,
  isIntervalWithin,
  useAvailabilityQueries,
  usePickSlotMutation,
} from "./api";
import { LayoutCtx } from "../../components/Layout";

const HEADER_FORMAT = "d MMM";

const computeSlotStats = pipe(
  reduce(
    ({ lowestHour, highestHour }, interval) => {
      const startHour = getHours(interval.start);
      const endHour = getHours(fixEnd(interval.end));
      if (startHour !== endHour)
        console.log("[computeSlotStats] interval longer than 1 hour", {
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
    slotsCount: Math.max(highestHour - lowestHour + 1, 3),
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
  visibleDaysCount: visibleDaysCountProp,
  sx,
  today: todayProp,
  disablePickSlot = false,
}) => {
  const { downLg } = useContext(LayoutCtx);
  // const visibleDaysCount = 7;
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
    timeZone: coach?.timeZone ?? userTz, // TODO: Dan
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

  console.log(
    "%c[AvailabilityCalendar.rndr]",
    "color:deeppink",
    coach.username,
    {
      calendarInterval,
      someResultsQuery,
      queries,
      onPick,
      pickedCoach,
      coach,
      visibleDaysCount,
    }
  );

  return (
    <Box
      sx={{
        // width: "100%",
        maxWidth: downLg ? 180 : 335,
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
        display="flex"
        gap={1}
        height={180}
        overflow="auto"
        borderBottom="1px solid #EAECF0"
      >
        <QueryRenderer
          {...someResultsQuery}
          loaderName="Block"
          success={({ data: availabilityIntervals }) => {
            // console.log({ availabilityIntervals });
            // debugger;
            if (!Array.isArray(availabilityIntervals)) return null;
            const { slotsCount, firstHour } = computeSlotStats(
              availabilityIntervals
            );
            return times(identity, visibleDaysCount).map((index) => {
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

              const isLoading = getIsDayLoading({
                queries,
                dayInterval,
                userTz,
              });

              return (
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
                    isLoading={isLoading}
                  />
                </ErrorBoundary>
              );
            });
          }}
        />
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
