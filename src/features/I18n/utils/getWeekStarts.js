import { getTimezoneOffset, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { addDays, eachWeekOfIntervalWithOptions, format } from "date-fns/fp";
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
}) => {
  // const tzOffsetMin = getTimezoneOffset(userTz) / (1000 * 60); // 120
  // TODO
  // const utcInterval = {
  //   start: addDays(tzOffsetMin > 0 ? -1 : 0, calendarInterval.start),
  //   end: addDays(tzOffsetMin < 0 ? 1 : 0, calendarInterval.end),
  // }; // => weekStarts
  // const fetchInterval = {
  //   start: addDays(tzOffsetMin > 0 ? -1 : 0, calendarInterval.start),
  //   end: addDays(tzOffsetMin < 0 ? 1 : 0, calendarInterval.end),
  // };
  const weekStartsArr = eachWeekOfIntervalWithOptions(
    { weekStartsOn: 1 },
    calendarInterval
  ).map((date) => format(formatStr, date));
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
