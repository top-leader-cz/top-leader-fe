import { Alert, Box, Divider } from "@mui/material";
// import { TimePicker } from "@mui/x-date-pickers";
import { getDay, parse, parseISO, setDay } from "date-fns";
import { addDays, formatISO } from "date-fns/fp";
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
import { I18nContext } from "../I18n/I18nProvider";
import { API_TIME_FORMAT } from "../I18n/utils/date";
import { QueryRenderer } from "../QM/QueryRenderer";
import { AvailabilityPreview } from "./AvailabilityPreview";
import { FieldLayout, FormRow } from "./FormRow";
import { useResetForm } from "./ProfileSettings";
import { WHITE_BG } from "./Settings.page";
import {
  useNonRecurringAvailabilityMutation,
  useNonRecurringAvailabilityQuery,
  useRecurringAvailabilityMutation,
  useRecurringAvailabilityQuery,
} from "./api";
import { map } from "ramda";

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
            // Component={TimePicker}
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

const TODO_DISABLED_RECURRENCE = false;

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

const to = ({ events = [] } = {}, { recurring } = {}) => {
  const daysValues = DAY_NAMES.map((dayName) => {
    const ranges = events?.filter(({ from }) => from?.day === dayName) || [];
    const range = ranges[0]; // TODO: multi + nonrecurring

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
  const isRec = recurring ?? true;
  // debugger;
  const initialValues = {
    [FIELDS_AVAILABILITY.recurring]: isRec,
    recurrenceRange: [
      // TODO: Dan
      new Date(),
      new Date(Date.now() + 1 * 6 * 24 * 3600 * 1000),
    ],
    ...daysValues,
  };

  console.log("%c[to]", "color:skyblue", {
    isRec,
    recurring,
    events,
    initialValues,
  });

  return initialValues;
};

const parseEvent = (str = "") => {
  // "2023-10-19T17:00:00"
  const date = parseISO(str);
  const dayIndex = getDay(date);

  const obj = {
    day: INDEX_TO_DAY[dayIndex],
    time: str.substring(11),
  };
  return obj;
};

export const AvailabilitySettings = () => {
  const msg = useMsg();
  const { i18n, userTz } = useContext(I18nContext);

  const form = useForm({});
  const recurringValue = form.watch(FIELDS_AVAILABILITY.recurring);
  const recurrenceRangeValue = form.watch(FIELDS_AVAILABILITY.recurrenceRange);

  const { resetForm, resetting } = useResetForm({
    initialResetting: true,
    form,
    to: useCallback(
      (data) =>
        to(data, {
          [FIELDS_AVAILABILITY.recurring]: recurringValue,
          // userLocale: language,
          // TODO: notify user that timezone settings is different than currently set!
          // userTz,
        }),
      [recurringValue]
    ),
  });

  const recurringAvailabilityQuery = useRecurringAvailabilityQuery({
    enabled: recurringValue,
  });
  const nonRecurringAvailabilityQuery = useNonRecurringAvailabilityQuery({
    from: recurrenceRangeValue?.[0],
    to: recurrenceRangeValue?.[1],
    enabled: !recurringValue,
  });

  const query = recurringValue
    ? recurringAvailabilityQuery
    : nonRecurringAvailabilityQuery;
  useEffect(() => {
    const fixNonRecurringEvents = (events) => {
      if (!events?.length) return events;
      if (typeof events[0]?.from === "string")
        return events.map(map(parseEvent));
      return events;
    };
    const initialValues = Array.isArray(query.data)
      ? { events: fixNonRecurringEvents(query.data) }
      : query.data;

    console.log("%c[eff reset]", "color:lime", {
      data: query.data,
      initialValues,
    });
    resetForm(initialValues ?? {});
  }, [query.data, recurringValue, resetForm]);

  const recurringAvailabilityMutation = useRecurringAvailabilityMutation();
  const nonRecurringAvailabilityMutation =
    useNonRecurringAvailabilityMutation();
  const mutation = recurringValue
    ? recurringAvailabilityMutation
    : nonRecurringAvailabilityMutation;

  const saveDisabled = mutation.isLoading; // || !!query.error;
  const isJustLoaderDisplayed = !query.data || resetting;

  console.log("[AvailabilitySettings.rndr]", isJustLoaderDisplayed, {
    recurringValue,
    recurrenceRangeValue,
    query,
    mutation,
    form,
    i18n,
  });

  const onSubmit = (data, e) =>
    console.log("[AvailabilitySettings.onSubmit] SHOULD NEVER HAPPEN", data, e);
  const onError = (errors, e) =>
    console.log("[AvailabilitySettings.onError]", errors, e);

  // firstDay + 3 days -> month of this floating week
  // const rightMenuSubtitle = i18n.formatLocal(addDays(3, new Date()), "LLLL");

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
              form.handleSubmit(mutation.mutateAsync, onError)(e);
            },
          }}
        >
          {/* <B>{rightMenuSubtitle}</B> */}
          {/* <Divider sx={{ my: 3 }} /> */}
          {!query.data ? null : <AvailabilityPreview />}
        </ScrollableRightMenu>
      ),
      [mutation.mutateAsync, query.data, form, msg, saveDisabled]
    )
  );

  if (query.error)
    return (
      <QueryRenderer
        error={query.error}
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
