import { formatInTimeZone } from "date-fns-tz/fp";
import { format, getDay, isValid, startOfDay } from "date-fns/fp";
import {
  all,
  allPass,
  applySpec,
  chain,
  filter,
  map,
  pipe,
  prop,
  splitEvery,
  when,
} from "ramda";
import { useContext, useMemo } from "react";
import { useMyMutation, useMyQuery } from "../Authorization/AuthProvider";
import { API_DATETIME_LOCAL_FORMAT, padLeft } from "../Availability/api";
import { I18nContext } from "../I18n/I18nProvider";
import {
  DAY_NAMES,
  FIELDS_AVAILABILITY,
  INDEX_TO_DAY,
  dayRangesName,
  enabledName,
} from "./AvailabilitySettings";

const AVAILABILITY_TYPE = {
  RECURRING: "recurring",
  NON_RECURRING: "non-recurring",
};

export const useRecurringAvailabilityQuery = ({ enabled = true } = {}) => {
  const query = useMyQuery({
    enabled,
    queryKey: ["coach-availability", AVAILABILITY_TYPE.RECURRING],
    fetchDef: {
      url: `/api/latest/coach-availability/${AVAILABILITY_TYPE.RECURRING}`,
    },
    // When empty:
    // Request URL: http://localhost:3000/api/latest/coach-availability/ALL
    // Request Method: GET
    // Status Code: 400 Bad Request
    // RECURRING  initially "{}"
    cacheTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query;
};

const createApiDayTimeStr =
  ({ timeZone }) =>
  (date) => {
    if (!date || !timeZone) return "";
    const local = formatInTimeZone(API_DATETIME_LOCAL_FORMAT, timeZone, date);
    // if (debug) debugger;
    return local;
  };

export const useNonRecurringAvailabilityQuery = ({
  start,
  end,
  enabled = true,
} = {}) => {
  const { userTz: timeZone } = useContext(I18nContext);
  const qParams = useMemo(() => {
    // console.log("%cMemoising", "color:pink", { timeZone: timeZone, start: start?.toISOString?.(), end: end?.toISOString?.(), });
    return pipe(
      when(
        all(allPass([isValid])),
        map(pipe(startOfDay, createApiDayTimeStr({ timeZone })))
      ),
      ([from, to]) => ({ from, to })
    )([start, end]);
  }, [end?.toISOString?.(), start?.toISOString?.(), timeZone]);
  // console.log("useNonRecurringAvailabilityQuery", { start, end, qParams, enabled, });
  // if (start) debugger;
  const query = useMyQuery({
    enabled: enabled && !!start && !!end,
    queryKey: [
      "coach-availability",
      AVAILABILITY_TYPE.NON_RECURRING,
      qParams.from,
      qParams.to,
    ],
    fetchDef: {
      url: `/api/latest/coach-availability/${AVAILABILITY_TYPE.NON_RECURRING}`,
      query: qParams,
    },
    // When empty:
    // Request URL: http://localhost:3000/api/latest/coach-availability/ALL
    // Request Method: GET
    // Status Code: 400 Bad Request
    // RECURRING  initially "{}"
    cacheTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query;
};

const log = (arg) => console.log.bind(console, arg);

const createApiDayTimeObj =
  ({ i18n }) =>
  (date) => {
    const hours = format("kk", date);

    return {
      day: INDEX_TO_DAY[getDay(date)], // 0 == SUNDAY
      time: `${padLeft("0", hours)}:00:00`, // "09:00:00"
    };
  };

const toApiIntervals = ({ formValues, mapper }) => {
  const intervals = pipe(
    map((dayName) => ({
      dayName,
      enabled: formValues[enabledName(dayName)],
      dayRanges: formValues[dayRangesName(dayName)],
    })),
    filter(({ enabled } = {}) => enabled),
    chain(({ dayRanges }) => {
      if (dayRanges.some((date) => !isValid(date))) {
        console.error({
          dayRanges,
          firstInvalidIndex: dayRanges.findIndex((date) => !isValid(date)),
        });
        throw new Error(
          `toApiIntervals - Invalid dayRanges, all dates must be valid`
        );
      }
      if (dayRanges.length % 2 !== 0) {
        throw new Error(
          `toApiIntervals - Invalid dayRanges, length must be factor of 2 (start,end,start,end,...)`
        );
      }
      // TODO: validate multiple ranges
      return dayRanges;
    }),
    // tap(log("toApiIntervals - 1")), // TODO: adjust intervals overlapping weeks
    map(mapper),
    // tap(log("toApiIntervals - 2")),
    splitEvery(2),
    // tap(log("toApiIntervals - 3")),
    map(([from, to]) => ({ from, to }))
    // tap(log("toApiIntervals - 4"))
  )(DAY_NAMES);
  // debugger;

  return intervals;
};

export const useRecurringAvailabilityMutation = () => {
  const { i18n, userTz } = useContext(I18nContext);
  const mutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/latest/coach-availability/${AVAILABILITY_TYPE.RECURRING}`,
      from: (formValues) =>
        toApiIntervals({ formValues, mapper: createApiDayTimeObj({ i18n }) }),
    },
    invalidate: [
      { queryKey: ["coach-availability"] },
      { queryKey: ["coaches"] },
    ],
  });

  return mutation;
};

/* {
  "timeFrame": {
    "from": "2023-10-15T20:27:38.006Z",
    "to": "2023-10-15T20:27:38.006Z"
  },
  "events": [
    {
      "from": "2023-10-15T20:27:38.006Z",
      "to": "2023-10-15T20:27:38.006Z"
    } ] } */

export const useNonRecurringAvailabilityMutation = () => {
  const { i18n, userTz } = useContext(I18nContext);
  const mutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/latest/coach-availability/${AVAILABILITY_TYPE.NON_RECURRING}`,
      from: applySpec({
        timeFrame: pipe(
          prop(FIELDS_AVAILABILITY.recurrenceRange),
          applySpec({
            from: prop("start"),
            to: prop("end"),
          }),
          map(pipe(startOfDay, createApiDayTimeStr({ timeZone: userTz })))
        ),
        events: (formValues) =>
          toApiIntervals({
            formValues,
            mapper: createApiDayTimeStr({ timeZone: userTz }),
          }),
      }),
    },
    invalidate: [
      { queryKey: ["coach-availability"] },
      { queryKey: ["coaches"] },
    ],
  });

  return mutation;
};
