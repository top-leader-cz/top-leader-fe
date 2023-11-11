import { useCallback, useMemo } from "react";
import * as dffp from "date-fns/fp";
import * as df from "date-fns";
import * as tz from "date-fns-tz";
import { API_TIME_FORMAT, UTC_DATE_FORMAT, parseUTCZoned } from "./utils/date";
import { formatDistanceToNow } from "date-fns";

// do not use directly, passed down to components thru context
export const useI18nInternal = ({ userTz, language, locale }) => {
  if (!locale) {
    throw new Error("Unsupported locale language: " + language);
  }

  const parseDate = useCallback(
    (input, referenceDate = new Date()) => {
      return dffp.parseWithOptions(
        { locale },
        referenceDate,
        UTC_DATE_FORMAT,
        input
      );
    },
    [locale]
  );

  const parseUTCLocal = useCallback(
    (utcStr) => {
      return parseUTCZoned(userTz, utcStr);
    },
    [userTz]
  );

  const formatLocal = useCallback(
    (date, formatStr = "PP") => {
      // console.log("[useI18n.formatLocal] TODO: UTC", { date, formatStr });
      try {
        const resultStr = dffp.formatWithOptions(
          {
            locale,
            // timeZone? https://stackoverflow.com/questions/58561169/date-fns-how-do-i-format-to-utc
          },
          formatStr,
          date
        );
        // console.log("[formatLocal]", { date, formatStr, locale });
        return resultStr;
      } catch (e) {
        console.error("[formatLocal]", { e, date, formatStr, locale });
        return "";
      }
    },
    [locale]
  );

  const formatUtcLocal = useCallback(
    (localDate, formatStr = "Pp") => {
      try {
        // TODO: not working
        // const utcDate = zonedToUtcLocal(localDate);
        // console.log("[formatUtcLocal] 0", { userTz, localDate, formatStr, utcDate, });

        const resultStr = tz.formatInTimeZone(localDate, "UTC", formatStr);
        // const resultStr = formatLocal(utcDate, formatStr);
        console.log("[formatUtcLocal] 1", {
          userTz,
          localDate,
          formatStr,
          // utcDate,
          resultStr,
        });

        return resultStr;
      } catch (e) {
        console.error("[formatUtcLocal]", {
          localDate,
          userTz,
          e,
        });
        throw e;
      }
    },
    [userTz]
  );

  const formatLocalMaybe = useCallback(
    (maybeDate, formatStr = "PP", defaultStr = "") => {
      const valid = dffp.isValid(maybeDate);
      // console.log("formatLocalMaybe", { maybeDate, formatStr, defaultStr, valid, });
      return !valid ? defaultStr : formatLocal(maybeDate, formatStr);
    },
    [formatLocal]
  );

  const startOfWeekLocal = useCallback(
    (date) => {
      // console.log("[useI18n.startOfWeekLocal] TODO: UTC", { args });
      return dffp.startOfWeekWithOptions({ locale }, date);
    },
    [locale]
  );

  const formatDistanceToNowLocal = useCallback(
    (date, options = {}) => {
      try {
        return formatDistanceToNow(date, { ...options, locale });
      } catch (e) {
        return e?.message || "Invalid date";
      }
    },
    [locale]
  );
  const translateTokenLocal = useCallback(
    (token) => {
      // (date, referenceDate, options = {}) => {
      const formatStr = locale.formatRelative("today");
      const [_, translation] = formatStr?.match?.(/^[^']*'([^'].*)'/) ?? [];

      return translation || token;
    },
    [locale]
  );
  const formatRelativeLocal = useCallback(
    (date, referenceDate = new Date(), options = {}) => {
      // const oLocale = {
      //   ...locale,
      //   formatRelative: (token, date) =>
      //     console.log(">>>>>>>>>>>>", { token }) ||
      //     locale.formatRelative(token),
      // };

      return df.formatRelative(date, referenceDate, {
        ...options,
        locale,
        // locale: oLocale,
      });
      return dffp.formatRelativeWithOptions(
        { ...options, locale },
        referenceDate,
        date
      );
    },
    [locale]
  );

  const i18n = useMemo(
    () => ({
      // TODO: https://date-fns.org/v2.29.3/docs/I18n
      locale,
      uiFormats: {
        inputDateFormat: locale.formatLong.date({ width: "short" }),
        inputTimeFormat: locale.formatLong.time({ width: "short" }),
        apiDateFormat: UTC_DATE_FORMAT,
        apiTimeFormat: API_TIME_FORMAT,
      },
      formatLocal,
      formatLocalMaybe,
      formatUtcLocal,
      parseUTCLocal,
      parseDate,
      formatDistanceToNowLocal,
      translateTokenLocal,
      formatRelativeLocal,
      zonedToUtcLocal: () => {
        throw new Error("TODO: migrate");
      },
      weekStartsOn: locale.options.weekStartsOn,
      startOfWeekLocal,
    }),
    [
      locale,
      formatLocal,
      formatLocalMaybe,
      parseUTCLocal,
      formatUtcLocal,
      parseDate,
      formatDistanceToNowLocal,
      translateTokenLocal,
      formatRelativeLocal,
      startOfWeekLocal,
    ]
  );
  return i18n;
};
