import { useMutation, useQueryClient } from "react-query";
import { useAuth, useMyQuery } from "../Authorization/AuthProvider";
import { useCallback, useContext } from "react";
import {
  DAY_NAMES,
  FIELDS_AVAILABILITY,
  INDEX_TO_DAY,
  dayRangesName,
  enabledName,
} from "./AvailabilitySettings";
import { API_TIME_FORMAT } from "../I18n/utils/date";
import { I18nContext } from "../I18n/I18nProvider";
import {
  T,
  addIndex,
  all,
  allPass,
  chain,
  map,
  pipe,
  splitEvery,
  tap,
  values,
  when,
} from "ramda";
import { formatISO, getDay, isValid, startOfDay, format } from "date-fns/fp";
import { API_DATETIME_LOCAL_FORMAT, padLeft } from "../Availability/api";
import { formatInTimeZone } from "date-fns-tz/fp";

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
    // const iso = formatISO(date);
    // const formatted = format(API_DATETIME_LOCAL_FORMAT, date);
    const local = formatInTimeZone(API_DATETIME_LOCAL_FORMAT, timeZone, date);
    // debugger;
    return local;
  };

export const useNonRecurringAvailabilityQuery = ({
  from,
  to,
  enabled = true,
} = {}) => {
  const { userTz: timeZone } = useContext(I18nContext);
  // const timeZone = "UTC";

  const qParams = pipe(
    when(
      all(allPass([isValid])),
      map(
        pipe(
          startOfDay,
          // tap(log(1)),
          createApiDayTimeStr({ timeZone })
          // tap(log(2))
        )
      )
    ),
    ([from, to]) => ({ from, to })
  )([from, to]);
  console.log("useNonRecurringAvailabilityQuery", { from, to, qParams });
  // if (from) debugger;
  const query = useMyQuery({
    enabled: enabled && !!from && !!to,
    queryKey: ["coach-availability", AVAILABILITY_TYPE.NON_RECURRING],
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

const toApiIntervals = ({ formValues, i18n, userTz, mapper }) => {
  const byDay = DAY_NAMES.map((dayName) => ({
    dayName,
    enabled: formValues[enabledName(dayName)],
    dayRanges: formValues[dayRangesName(dayName)],
  })).filter(({ enabled } = {}) => enabled);

  const intervals = pipe(
    chain(({ dayRanges }) => {
      if (dayRanges.some((date) => !isValid(date))) {
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
    tap(log("toApiIntervals - 1")), // TODO: adjust intervals overlapping weeks
    map(mapper),
    splitEvery(2),
    map(([from, to]) => ({ from, to })),
    tap(log("toApiIntervals - 2")) // TODO: adjust intervals overlapping weeks
  )(byDay);

  return intervals;
};

export const useRecurringAvailabilityMutation = () => {
  const { i18n, userTz } = useContext(I18nContext);
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = toApiIntervals({
        formValues: values,
        i18n,
        userTz,
        mapper: createApiDayTimeObj({ i18n }),
      });

      console.log("%cMUTATION", "color:lime", { values, payload });
      return authFetch({
        method: "POST",
        url: `/api/latest/coach-availability/${AVAILABILITY_TYPE.RECURRING}`,
        data: payload,
      });
    },
    onSuccess: useCallback(
      (data) => {
        console.log("mutation.onSuccess", data);
        queryClient.removeQueries({ queryKey: ["coach-availability"] });
        queryClient.removeQueries({ queryKey: ["coaches"] });
      },
      [queryClient]
    ),
  });

  return mutation;
};

/*
{
  "timeFrame": {
    "from": "2023-10-15T20:27:38.006Z",
    "to": "2023-10-15T20:27:38.006Z"
  },
  "events": [
    {
      "from": "2023-10-15T20:27:38.006Z",
      "to": "2023-10-15T20:27:38.006Z"
    }
  ]
}
*/

export const useNonRecurringAvailabilityMutation = () => {
  const { i18n, userTz } = useContext(I18nContext);
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) => {
      const [from, to] = values[FIELDS_AVAILABILITY.recurrenceRange];
      const payload = {
        timeFrame: map(
          pipe(startOfDay, createApiDayTimeStr({ timeZone: userTz }))
        )({ from, to }),
        events: toApiIntervals({
          formValues: values,
          i18n,
          userTz,
          mapper: createApiDayTimeStr({ timeZone: userTz }),
        }),
      };

      console.log("%cMUTATION", "color:lime", { values, from, to, payload });
      // debugger;

      return authFetch({
        method: "POST",
        url: `/api/latest/coach-availability/${AVAILABILITY_TYPE.NON_RECURRING}`,
        data: payload,
      });
    },
    onSuccess: useCallback(
      (data) => {
        console.log("mutation.onSuccess", data);
        queryClient.removeQueries({ queryKey: ["coach-availability"] });
        queryClient.removeQueries({ queryKey: ["coaches"] });
      },
      [queryClient]
    ),
  });

  return mutation;
};
