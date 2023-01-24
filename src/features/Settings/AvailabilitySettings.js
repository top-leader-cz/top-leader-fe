import { Checkbox, Divider, Switch, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { TimePicker } from "@mui/x-date-pickers";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { B } from "../../components/Forms";
import { useRightMenu } from "../../components/Layout";
import { ScrollableRightMenu } from "../../components/ScrollableRightMenu";
import { H2, P } from "../../components/Typography";
import { CalendarDaySlots, CREATE_OFFSET } from "../Coaches/Coaches.page";
import { FieldLayout, FormRow } from "./FormRow";
import { WHITE_BG } from "./Settings.page";

const DAYS = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

const TimeField = () => {
  return (
    <TimePicker
      label=""
      //   value={value}
      //   onChange={(newValue) => {
      //     setValue(newValue);
      //   }}
      renderInput={(params) => (
        <TextField size="small" sx={WHITE_BG} {...params} />
      )}
    />
  );
};

const TimeRange = () => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
      <TimeField /> - <TimeField />
    </Box>
  );
};

const enabledName = (name) => `enabled_${name}`;
const dayName = (name) => `day_${name}`;

const DaySlots = ({ name }) => {
  return (
    <FieldLayout
      label={
        <>
          <Checkbox /> {[name]}
        </>
      }
      LabelComponent={P}
      dividerTop
      sx={{}}
    >
      <Box display="flex" flexDirection="column">
        <TimeRange />
      </Box>
    </FieldLayout>
  );
};

export const FIELDS_AVAILABILITY = {
  recurring: "recurring",
  [enabledName(DAYS.MON)]: true,
  [dayName(DAYS.MON)]: [],
};

export const AvailabilitySettings = () => {
  const form = useForm({
    // mode: "onSubmit",
    // mode: "all",¯
    defaultValues: {},
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

        <FormRow label="Recurring" name={FIELDS_AVAILABILITY.recurring}>
          <Switch />
        </FormRow>
        <DaySlots name={DAYS.MON} />
        <DaySlots name={DAYS.TUE} />
        <DaySlots name={DAYS.WED} />
        <DaySlots name={DAYS.THU} />
        <DaySlots name={DAYS.FRI} />
        <DaySlots name={DAYS.SAT} />
        <DaySlots name={DAYS.SUN} />
      </FormProvider>
    </form>
  );
};
