import * as tz from "date-fns-tz";
import * as dffp from "date-fns/fp";

window.dffp = dffp;

export const UTC_DATE_FORMAT = "yyyy-MM-dd";
export const API_TIME_FORMAT = "HH:mm:ss";

export const parseUTCZoned = (userTz, utcStr) => {
  const parsedDate = dffp.parseISO(
    utcStr.endsWith("Z") ? utcStr : utcStr + "Z"
  );
  const zonedDate = parsedDate;
  // TODO: working without explicit tz setting
  // const zonedDate = tz.utcToZonedTime(parsedDate, userTz);

  return zonedDate;
};

export const getFirstDayOfTheWeek = (
  date = new Date(),
  weekStartsOn = 1,
  format = UTC_DATE_FORMAT
) => {
  // TODO: local?
  try {
    const firstDayOfTheWeek = dffp.format(
      format,
      dffp.startOfWeekWithOptions({ weekStartsOn }, date)
      // dffp.startOfWeek(date, { weekStartsOn })
    );
    return firstDayOfTheWeek;
  } catch (e) {
    console.error("getFirstDayOfTheWeek", { e, date, weekStartsOn });
    throw e;
  }
};

export const fixEnd = (end) => {
  if (dffp.getSeconds(end) === 0) {
    // console.log("fixEnd fixing now", end);
    return dffp.subSeconds(1, end);
  }
  return end;
};

export const fixIntEnd = (interval) => {
  if (dffp.getSeconds(interval.end) === 0) {
    return { ...interval, end: fixEnd(interval.end) };
  }
  return interval;
};

export const getBrowserTz = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;
