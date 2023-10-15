import { Alert, Box, Divider } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { parse, setDay } from "date-fns";
import { addDays } from "date-fns/fp";
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
  const nonRecurringAvailabilityMutation =
    useNonRecurringAvailabilityMutation();

  const data = recurringAvailabilityQuery.data;
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
              form.handleSubmit(
                recurringAvailabilityMutation.mutateAsync,
                onError
              )(e);
            },
          }}
        >
          {/* <B>{rightMenuSubtitle}</B> */}
          {/* <Divider sx={{ my: 3 }} /> */}
          {!recurringAvailabilityQuery.data ? null : <AvailabilityPreview />}
        </ScrollableRightMenu>
      ),
      [
        recurringAvailabilityMutation.mutateAsync,
        recurringAvailabilityQuery.data,
        form,
        msg,
        saveDisabled,
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
