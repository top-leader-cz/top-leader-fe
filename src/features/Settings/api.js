import { useMutation, useQueryClient } from "react-query";
import { useAuth, useMyQuery } from "../Authorization/AuthProvider";
import { useCallback, useContext } from "react";
import {
  DAY_NAMES,
  INDEX_TO_DAY,
  dayRangesName,
  enabledName,
} from "./AvailabilitySettings";
import { API_TIME_FORMAT } from "../I18n/utils/date";
import { format } from "date-fns";
import { I18nContext } from "../I18n/I18nProvider";
import { addIndex, chain, map, pipe, splitEvery, tap } from "ramda";
import { getDay, isValid } from "date-fns/fp";
import { padLeft } from "../Availability/api";

const AVAILABILITY_TYPE = {
  RECURRING: "recurring",
  NON_RECURRING: "non-recurring",
};

export const useRecurringAvailabilityQuery = () => {
  const query = useMyQuery({
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
export const useNonRecurringAvailabilityQuery = () => {
  const query = useMyQuery({
    queryKey: ["coach-availability", AVAILABILITY_TYPE.NON_RECURRING],
    fetchDef: {
      url: `/api/latest/coach-availability/${AVAILABILITY_TYPE.NON_RECURRING}`,
      query: {
        // TODO
        from: "2023-08-14T00:00:00",
        to: "2023-08-16T00:00:00",
      },
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

const createApiDayTimeObj = ({ date, i18n, utc = false }) => {
  const hours = utc ? i18n.formatUtcLocal(date, "kk") : format(date, "kk");

  return {
    day: INDEX_TO_DAY[getDay(date)], // 0 == SUNDAY
    time: `${padLeft("0", hours)}:00:00`, // "09:00:00"
  };
};

const toApiIntervals = ({ formValues, i18n, userTz }) => {
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
    tap(log(1)), // TODO: adjust intervals overlapping weeks
    splitEvery(2),
    map(([from, to]) => ({
      from: createApiDayTimeObj({ date: from, i18n }),
      to: createApiDayTimeObj({ date: to, i18n }),
    })),
    tap(log(2)) // TODO: adjust intervals overlapping weeks
  )(byDay);

  return intervals;
};

export const useRecurringAvailabilityMutation = () => {
  const { i18n, userTz } = useContext(I18nContext);
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = toApiIntervals({ formValues: values, i18n, userTz });

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

export const useNonRecurringAvailabilityMutation = () => {
  const { i18n, userTz } = useContext(I18nContext);
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = toApiIntervals({ formValues: values, i18n, userTz });

      console.log("%cMUTATION", "color:lime", { values, payload });
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
