import { useCallback, useMemo } from "react";
import * as dffp from "date-fns/fp";
import * as df from "date-fns";
import * as tz from "date-fns-tz";
import { API_TIME_FORMAT, UTC_DATE_FORMAT, parseUTCZoned } from "./utils/date";
import { formatDistanceToNow } from "date-fns";
import { chain, filter, fromPairs, keys, map, pipe } from "ramda";

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
      try {
        return parseUTCZoned(userTz, utcStr);
      } catch (e) {
        console.error("[parseUTCLocal]", { utcStr, userTz, e });
        throw e;
        // return utcStr;
      }
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
            timeZone: userTz,
            // timeZone? https://stackoverflow.com/questions/58561169/date-fns-how-do-i-format-to-utc
          },
          formatStr,
          date
        );
        // if (resultStr[2] === ":") debugger;
        // console.log("[formatLocal]", { date, formatStr, locale });
        return resultStr;
      } catch (e) {
        console.error("[formatLocal]", { e, date, formatStr, locale });
        return "";
      }
    },
    [locale, userTz]
  );

  const formatInUserTzLocal = useCallback(
    (date, formatStr = "Pp") => {
      try {
        const resultStr = tz.formatInTimeZone(date, userTz, formatStr);
        // const resultStr = formatLocal(utcDate, formatStr);
        // console.log("[formatInUserTzLocal] 1", { userTz, date, formatStr, resultStr, });

        return resultStr;
      } catch (e) {
        console.error("[formatInUserTzLocal]", { date, userTz, e });
        throw e;
      }
    },
    [userTz]
  );

  const formatLocalMaybe = useCallback(
    (maybeDate, formatStr = "PP", defaultValue = "") => {
      const valid = dffp.isValid(maybeDate);
      // console.log("formatLocalMaybe", { maybeDate, formatStr, defaultValue, valid, });
      return !valid ? defaultValue : formatLocal(maybeDate, formatStr);
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
        locale,
        ...options,
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
  const partiallyAppliedDffp = useMemo(() => {
    // const exposed = ["isSameWeek", "startOfWeek", "endOfWeek"];
    const exposed = keys(dffp)
      .filter((k) => k.endsWith("WithOptions"))
      .map((k) => k.replace("WithOptions", ""));
    const fns = pipe(
      chain((fnName) => {
        const fn = dffp[`${fnName}WithOptions`];
        if (typeof fn === "function") {
          return [
            [fnName, (...args) => fn({ locale }, ...args)],
            [
              `${fnName}WithMergeOptions`,
              (options, ...args) => fn({ locale, ...options }, ...args),
            ],
          ];
        }
      }),
      filter(Boolean),
      fromPairs
    )(exposed);
    return fns;
  }, [locale]);

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
      formatInUserTzLocal,
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
      dffp: partiallyAppliedDffp,
    }),
    [
      locale,
      formatLocal,
      formatLocalMaybe,
      formatInUserTzLocal,
      parseUTCLocal,
      parseDate,
      formatDistanceToNowLocal,
      translateTokenLocal,
      formatRelativeLocal,
      startOfWeekLocal,
      partiallyAppliedDffp,
    ]
  );
  return i18n;
};
