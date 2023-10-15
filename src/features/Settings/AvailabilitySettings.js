import { Alert, Box, Divider } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { getDay, parse, setDay } from "date-fns";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import {
  B,
  CheckboxField,
  DateRangePickerField,
  SwitchField,
  TimeRangePickerField,
} from "../../components/Forms";
import { useRightMenu } from "../../components/Layout";
import { Msg, useMsg } from "../../components/Msg/Msg";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2, P } from "../../components/Typography";
import { CREATE_OFFSET } from "../Availability/AvailabilityCalendar";
import { TimeSlot } from "../Availability/CalendarDaySlots";
import { I18nContext } from "../I18n/I18nProvider";
import { API_TIME_FORMAT } from "../I18n/utils/date";
import { QueryRenderer } from "../QM/QueryRenderer";
import { FieldLayout, FormRow } from "./FormRow";
import { useResetForm } from "./ProfileSettings";
import { WHITE_BG } from "./Settings.page";
import {
  useNonRecurringAvailabilityQuery,
  useRecurringAvailabilityMutation,
  useRecurringAvailabilityQuery,
} from "./api";

export const INDEX_TO_DAY = [
  "SUNDAY", // 0
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export const DAY_NAMES = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const translateDay = ({
  dayIndex,
  width = "medium", // 3char
  format = width === "short" ? "EEEEEE" : width === "long" ? "EEEE" : "E",
  i18n,
}) => {
  // return i18n.currentLocale.localize.day(dayIndex); // todo: width
  const date = setDay(new Date(), dayIndex);
  return i18n.formatLocal(date, format);
};

const DaySlots = ({ dayName }) => {
  const msg = useMsg();
  const { i18n } = useContext(I18nContext);
  const enabled = useFormContext().watch(enabledName(dayName));
  const dayLabel = translateDay({
    dayIndex: INDEX_TO_DAY.findIndex((name) => name === dayName),
    width: "long",
    i18n,
  });

  // console.log("[DaySlots.rndr]", dayName, enabled);

  return (
    <FieldLayout
      label={
        <>
          <CheckboxField name={enabledName(dayName)} />
          <Box component={"span"} sx={{ textTransform: "capitalize" }}>
            {dayLabel}
          </Box>
        </>
      }
      LabelComponent={P}
      dividerTop
      sx={{}}
    >
      <Box display="flex">
        {enabled ? (
          <TimeRangePickerField
            Component={TimePicker}
            name={dayRangesName(dayName)}
            inputProps={{ sx: { ...WHITE_BG, width: 140 } }}
          />
        ) : (
          msg("settings.availability.unavailable")
        )}
      </Box>
    </FieldLayout>
  );
};

const TODO_DISABLED_RECURRENCE = true;

export const Recurrence = () => {
  const msg = useMsg();
  const recurring = useFormContext().watch("recurring");

  console.log("[Recurrence.rndr]", { recurring });

  return (
    <FormRow
      label={msg("settings.availability.recurring")}
      name={FIELDS_AVAILABILITY.recurring}
    >
      <Box display="flex">
        <SwitchField
          name={FIELDS_AVAILABILITY.recurring}
          disabled={TODO_DISABLED_RECURRENCE}
        />
        {!recurring && (
          <DateRangePickerField
            name={FIELDS_AVAILABILITY.recurrenceRange}
            sx={{ ml: 8, ...WHITE_BG }}
          />
        )}
      </Box>
    </FormRow>
  );
};

export const enabledName = (name) => `_enabled_${name}`;
export const dayRangesName = (name) => `_day_${name}`;

export const FIELDS_AVAILABILITY = {
  recurring: "recurring",
  recurrenceRange: "recurrenceRange",
};

const getDayInThisWeek = ({ dayName, referenceDate } = {}) => {
  const refDate = new Date(referenceDate || new Date());
  const targetDayIndex = INDEX_TO_DAY.findIndex((name) => name === dayName);

  return setDay(refDate, targetDayIndex);
};
const getReferenceDate = ({ dayName } = {}) => {
  if (!dayName) return new Date();

  return getDayInThisWeek({ dayName });
};

const getDateTime = ({
  time = "09:00:00",
  dayName,
  referenceDate = getReferenceDate({ dayName }),
}) => parse(time, API_TIME_FORMAT, referenceDate);

const to = (data) => {
  const initialValues = DAY_NAMES.map((dayName) => {
    const ranges = data?.filter(({ from }) => from?.day === dayName) || [];
    const range = ranges[0]; // TODO: multi

    if (!range)
      return {
        [enabledName(dayName)]: false,
        [dayRangesName(dayName)]: [
          getDateTime({ time: "09:00:00", dayName }),
          getDateTime({ time: "17:00:00", dayName }),
        ],
      };

    return {
      [enabledName(dayName)]: true,
      [dayRangesName(dayName)]: [
        getDateTime({ time: range.from.time, dayName }),
        getDateTime({ time: range.to.time, dayName }),
      ],
    };
  }).reduce((acc, values) => {
    return { ...acc, ...values };
  }, {});

  console.log("%c[to]", "color:skyblue", { data, initialValues });

  return {
    [FIELDS_AVAILABILITY.recurring]: true, // TODO
    recurrenceRange: [
      new Date(),
      new Date(Date.now() + 3 * 7 * 24 * 3600 * 1000),
    ],
    ...initialValues,
  };
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

export const AvailabilitySettings = () => {
  const form = useForm({});

  const { resetForm, resetting } = useResetForm({
    initialResetting: false,
    form,
    to: useCallback(
      (data) =>
        to(data, {
          // userLocale: language,
          // TODO: notify user that timezone settings is different than currently set!
          // userTz,
        }),
      []
    ),
  });

  const msg = useMsg();
  const { i18n, userTz } = useContext(I18nContext);
  // const availabilityType = AVAILABILITY_TYPE.RECURRING; // TODO
  // const availabilityType = useFormContext().watch("recurring") ? AVAILABILITY_TYPE.RECURRING : AVAILABILITY_TYPE.NON_RECURRING;

  const recurringAvailabilityQuery = useRecurringAvailabilityQuery();
  const nonRecurringAvailabilityQuery = useNonRecurringAvailabilityQuery();
  const recurringAvailabilityMutation = useRecurringAvailabilityMutation();

  const { data } = recurringAvailabilityQuery;
  useEffect(() => {
    console.log("%c[eff reset]", "color:lime", { data });
    if (data) resetForm(data);
  }, [data, resetForm]);

  const saveDisabled = recurringAvailabilityMutation.isLoading; // || !!query.error;
  const isJustLoaderDisplayed = !recurringAvailabilityQuery.data || resetting;

  console.log("[AvailabilitySettings.rndr]", {
    recurringAvailabilityQuery,
    recurringAvailabilityMutation,
    form,
    i18n,
  });

  const onSubmit = (data, e) =>
    console.log("[AvailabilitySettings.onSubmit] SHOULD NEVER HAPPEN", data, e);
  const onError = (errors, e) =>
    console.log("[AvailabilitySettings.onError]", errors, e);

  const previewDays = useMemo(() => {
    const dayCount = 7;
    const rows = Array(dayCount)
      .fill(null)
      .map((_, i) => {
        const date = CREATE_OFFSET(new Date())(i, 0);
        const dayIndex = getDay(date); // 0 - Sun
        const dayName = INDEX_TO_DAY[dayIndex];
        const ranges = recurringAvailabilityQuery.data?.[dayName] ?? [];
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
  }, [recurringAvailabilityQuery.data]);

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

  // firstDay + 3 days -> month
  const rightMenuSubtitle = i18n.formatLocal(previewDays[3].date, "LLLL");

  console.log("[AvailabilitySettings.rndr]", {
    firstHour,
    lastHour,
    slotsCount,
    previewDays,
  });

  useRightMenu(
    useMemo(
      () => (
        <ScrollableRightMenu
          heading={msg("settings.availability.aside.title")}
          buttonProps={{
            children: msg("settings.availability.aside.save"),
            type: "submit",
            disabled: saveDisabled,
            onClick: (e) => {
              console.log("Save click");
              form.handleSubmit(
                recurringAvailabilityMutation.mutateAsync,
                onError
              )(e);
            },
          }}
        >
          <B>{rightMenuSubtitle}</B>
          <Divider sx={{ my: 2 }} />
          {!recurringAvailabilityQuery.data ? null : (
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              overflow="scroll"
            >
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
          )}
        </ScrollableRightMenu>
      ),
      [
        recurringAvailabilityMutation.mutateAsync,
        recurringAvailabilityQuery.data,
        firstHour,
        form,
        msg,
        previewDays,
        rightMenuSubtitle,
        saveDisabled,
        slotsCount,
      ]
    )
  );

  if (recurringAvailabilityQuery.error)
    return (
      <QueryRenderer
        error={recurringAvailabilityQuery.error}
        errored={() => <Alert severity="error">Fetch failed</Alert>}
      />
    );

  // reset of MUI Autocomplete
  if (isJustLoaderDisplayed) return <QueryRenderer isLoading />;

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FormProvider {...form}>
        <H2 gutterBottom>
          <Msg id="settings.availability.heading" />
        </H2>
        <P sx={{ mb: -1 }}>
          <Msg id="settings.availability.perex" />
        </P>

        <Recurrence />
        {DAY_NAMES.map((dayName) => (
          <DaySlots key={dayName} dayName={dayName} />
        ))}
      </FormProvider>
    </form>
  );
};
