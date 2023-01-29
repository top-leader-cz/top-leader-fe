import { Box, Divider } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { useMemo } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import {
  B,
  CheckboxField,
  DateRangePickerField,
  RangePickerField,
  SwitchField,
} from "../../components/Forms";
import { useRightMenu } from "../../components/Layout";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2, P } from "../../components/Typography";
import { CalendarDaySlots, CREATE_OFFSET } from "../Coaches/Coaches.page";
import { FieldLayout, FormRow } from "./FormRow";
import { WHITE_BG } from "./Settings.page";

const DAY_NAMES = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const DAYS = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const DaySlots = ({ dayName }) => {
  const enabled = useFormContext().watch(enabledName(dayName));
  console.log(dayName, enabled);

  return (
    <FieldLayout
      label={
        <>
          <CheckboxField name={enabledName(dayName)} /> {DAYS[dayName]}
        </>
      }
      LabelComponent={P}
      dividerTop
      sx={{}}
    >
      <Box display="flex">
        {enabled ? (
          <RangePickerField
            Component={TimePicker}
            name={dayRangesName(dayName)}
            inputProps={{ sx: { ...WHITE_BG, width: 140 } }}
          />
        ) : (
          "Unavailable"
        )}
      </Box>
    </FieldLayout>
  );
};

export const Recurrence = () => {
  const recurring = useFormContext().watch("recurring");

  console.log("[Recurrence.rndr]", { recurring });

  return (
    <FormRow label="Recurring" name={FIELDS_AVAILABILITY.recurring}>
      <Box display="flex">
        <SwitchField name={FIELDS_AVAILABILITY.recurring} />
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

const enabledName = (name) => `enabled_${name}`;
const dayRangesName = (name) => `day_${name}`;

export const FIELDS_AVAILABILITY = {
  recurring: "recurring",
  recurrenceRange: "recurrenceRange",
};

const MOCK_RANGE = [new Date(2022, 0, 0, 9, 0), new Date(2022, 0, 0, 17, 0)];

export const AvailabilitySettings = () => {
  const form = useForm({
    // mode: "onSubmit",
    // mode: "all",¯
    defaultValues: {
      [FIELDS_AVAILABILITY.recurring]: true,
      recurrenceRange: [
        new Date(),
        new Date(Date.now() + 3 * 7 * 24 * 3600 * 1000),
      ],
      [enabledName("mon")]: true,
      [enabledName("tue")]: true,
      [enabledName("wed")]: true,
      [enabledName("thu")]: true,
      [enabledName("fri")]: true,
      [enabledName("sat")]: false,
      [enabledName("sun")]: false,
      [dayRangesName("mon")]: MOCK_RANGE,
      [dayRangesName("tue")]: MOCK_RANGE,
      [dayRangesName("wed")]: MOCK_RANGE,
      [dayRangesName("thu")]: MOCK_RANGE,
      [dayRangesName("fri")]: MOCK_RANGE,
      [dayRangesName("sat")]: MOCK_RANGE,
      [dayRangesName("sun")]: MOCK_RANGE,
    },
  });

  const onSubmit = (data, e) =>
    console.log("[AvailabilitySettings.onSubmit]", data, e);
  const onError = (errors, e) =>
    console.log("[AvailabilitySettings.onError]", errors, e);

  useRightMenu(
    useMemo(
      () => (
        <ScrollableRightMenu
          heading={"Preview"}
          buttonProps={{
            children: "Save",
            onClick: () => console.log("Save click"),
          }}
        >
          <B>September</B>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" flexDirection="column" gap={2} overflow="scroll">
            {Array(7)
              .fill(null)
              .map((_, i) => (
                <CalendarDaySlots
                  sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}
                  dateSx={{ minWidth: "40px", p: 0 }}
                  // slotSx={{ width: "60px" }}
                  key={i}
                  startHour={9}
                  slotsCount={8}
                  date={CREATE_OFFSET(new Date())(i, 0)}
                  freeHours={[9, 10, 11, 13, 14, 16]}
                  // freeHours={getDayFreeHours(freeSlots, addDays(i, TODAY))}
                />
              ))}
          </Box>
        </ScrollableRightMenu>
      ),
      []
    )
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FormProvider {...form}>
        <H2 gutterBottom>Availability</H2>
        <P sx={{ mb: -1 }}>Set your availability here</P>

        <Recurrence />
        {DAY_NAMES.map((dayName) => (
          <DaySlots dayName={dayName} />
        ))}
      </FormProvider>
    </form>
  );
};
