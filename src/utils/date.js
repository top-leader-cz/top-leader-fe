import { formatWithOptions, startOfWeekWithOptions } from "date-fns/fp";
import * as dfnsfp from "date-fns/fp";
import { formatDistanceToNow, isValid, parse } from "date-fns";
import * as tz from "date-fns-tz";
// { zonedTimeToUtc, format }

window.dfnsfp = dfnsfp;

export const UTC_DATE_FORMAT = "yyyy-MM-dd";
export const API_TIME_FORMAT = "HH:mm:ss";

export const parseUTCZoned = (userTz, utcStr) => {
  // const date = dfnsfp.parseISO(utcStr.endsWith("Z") ? utcStr : utcStr + "Z");
  const date = dfnsfp.parseISO(utcStr.endsWith("Z") ? utcStr : utcStr + "Z");
  const zonedDate = tz.utcToZonedTime(date, userTz);

  return zonedDate;
};

export const getFirstDayOfTheWeek = (date = new Date()) => {
  // TODO: local?
  const firstDayOfTheWeek = dfnsfp.format(
    UTC_DATE_FORMAT,
    dfnsfp.startOfWeek(date)
  );
  return firstDayOfTheWeek;
};

// const utc = [zonedTimeToUtc(from, userTz), zonedTimeToUtc(to, userTz)];
// const utcF = utc.map((d) => format(d, i18n.uiFormats.apiTimeFormat));
// Same as utcF:
//   const timeFrom = format(from, i18n.uiFormats.apiTimeFormat);
//   const timeTo = format(to, i18n.uiFormats.apiTimeFormat);
