import {
  formatInTimeZone,
  getTimezoneOffset,
  utcToZonedTime,
  zonedTimeToUtc,
} from "date-fns-tz";
import {
  addDays,
  addMilliseconds,
  eachWeekOfIntervalWithOptions,
  format,
  formatISO,
} from "date-fns/fp";
import { getFirstDayOfTheWeek } from "./date";

export const toUtc = (tz, date) => {};

// https://stackoverflow.com/questions/67819591/how-to-use-startofday-from-date-fns-with-timezones
export const calcZonedDate = (date, tz, fn, options = null) => {
  const inputZoned = utcToZonedTime(date, tz);
  const fnZoned = options ? fn(inputZoned, options) : fn(inputZoned);
  return zonedTimeToUtc(fnZoned, tz);
};

export const getWeekStarts = ({
  calendarInterval,
  userTz,
  formatStr = "yyyy-MM-dd",
  weekStartsOn = 1,
  UTC = true, // TODO: test
  ISO = false,
}) => {
  const tzOffsetMs = getTimezoneOffset(userTz, calendarInterval.start); // / (1000 * 60); // 120
  // TODO
  const utcInterval = {
    // TODO
    start: addMilliseconds(-tzOffsetMs, calendarInterval.start),
    end: addMilliseconds(-tzOffsetMs, calendarInterval.end),
  }; // => weekStarts
  // const fetchInterval = {
  //   start: addDays(tzOffsetMin > 0 ? -1 : 0, calendarInterval.start),
  //   end: addDays(tzOffsetMin < 0 ? 1 : 0, calendarInterval.end),
  // };
  console.log({ calendarInterval });
  const weekStartsArr = eachWeekOfIntervalWithOptions(
    { weekStartsOn },
    // calendarInterval
    UTC ? utcInterval : calendarInterval
  ).map((date) =>
    UTC
      ? formatInTimeZone(date, userTz, formatStr)
      : ISO
      ? formatISO(date)
      : format(formatStr, date)
  );

  console.log({
    weekStartsArr,
    // tzOffsetMs,
    calendarInterval,
    userTz,
    formatStr,
    weekStartsOn,
    UTC,
    // utcInterval,
  });
  // ).map((date) => getFirstDayOfTheWeek(date, weekStartsOn, formatStr));

  // console.log(">>>>>>>", {
  //   weekStartsArrLocal,
  //   weekStartsArr,
  //   fetchInterval,
  //   calendarInterval,
  //   zoned: "",
  // }); // TODO

  //   debugger;

  return weekStartsArr;
};
