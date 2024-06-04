import { pipeP } from "composable-fetch";
import * as tz from "date-fns-tz";
import { formatInTimeZone } from "date-fns-tz/fp";
import {
  addDays,
  addHours,
  addMilliseconds,
  eachWeekOfIntervalWithOptions,
  formatISO,
  getDay,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns/fp";
import {
  always,
  applySpec,
  filter,
  flatten,
  identity,
  map,
  path,
  pipe,
  prop,
} from "ramda";
import { useContext, useMemo } from "react";
import { useQueries } from "react-query";
import { useAuth } from "../Authorization";
import { useMyMutation } from "../Authorization/AuthProvider";
import { I18nContext } from "../I18n/I18nProvider";
import { fixEnd } from "../I18n/utils/date";
import {
  useLocalStorage,
  useSessionStorage,
} from "../../hooks/useLocalStorage";

const handleIntervalOverlapping = ({
  overlapping,
  interval,
  parentInterval,
}) => {
  const msg = `[isIntervalWithin] Overlapping interval ${interval.start} - ${interval.end}`;
  switch (overlapping) {
    case true:
      return true;
    case "throw":
      throw new Error(msg);
    case "debugger":
      debugger;
    // eslint-disable-next-line no-fallthrough
    default:
      console.log(`%c${msg}`, "color:magenta", {
        parentInterval,
        interval,
      });
      return false;
  }
};

export const isIntervalWithin =
  ({ parentInterval, overlapping = "throw" }) =>
  (interval) => {
    const startWithin = isWithinInterval(parentInterval, interval.start);
    const endWithin = isWithinInterval(parentInterval, fixEnd(interval.end));
    if (startWithin !== endWithin) {
      return handleIntervalOverlapping({
        overlapping,
        interval,
        parentInterval,
      });
    }
    return startWithin;
  };

const parseLocal = ({ dateStr, timeZone }) => {
  const result = tz.zonedTimeToUtc(dateStr, timeZone);
  if (!dateStr || !timeZone) debugger;
  return result;
};

const parseSlot = (timeZone) => (dateStr) => {
  // const start = parseSlotDateTime(date, timeFrom, timeZone);
  // const end = parseSlotDateTime(date, timeTo, timeZone);

  // debugger;
  const start = parseLocal({ timeZone, dateStr });
  const end = fixEnd(addHours(1, parseLocal({ timeZone, dateStr })));

  return { start, end };
};

const parseAvailabilities = ({
  timeZone,
  parentInterval,
  overlapping = "throw",
}) =>
  pipe(
    map(parseSlot(timeZone)),
    parentInterval
      ? filter(isIntervalWithin({ parentInterval, overlapping }))
      : identity
  );

// const fetchFrameKeyToParams_ = ({ userTz }) => pipe(
//     parseISO,
//     applySpec({
//       from: pipe( startOfWeekWithOptions({ weekStartsOn: 1 }), formatInTimeZone(API_DATETIME_LOCAL_FORMAT, userTz) ),
//       to: pipe( endOfWeekWithOptions({ weekStartsOn: 1 }), formatInTimeZone(API_DATETIME_LOCAL_FORMAT, userTz) ), }) );
// const getFetchFrameKeys_ = ({ calendarInterval, userTz }) => { return getWeekStarts({ calendarInterval, userTz, weekStartsOn: 1, UTC: false, ISO: true, }); };

export const API_DATETIME_LOCAL_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

const fetchFrameKeyToParams = ({ userTz }) =>
  pipe(
    parseISO,
    applySpec({
      from: pipe(
        startOfDay,
        formatInTimeZone(API_DATETIME_LOCAL_FORMAT, userTz)
      ),
      to: pipe(
        startOfDay,
        addDays(7),
        addMilliseconds(-1),
        formatInTimeZone(API_DATETIME_LOCAL_FORMAT, userTz)
      ),
    })
  );

const getFetchFrameKeys = ({ calendarInterval, userTz }) => {
  const now = startOfDay(new Date());
  const floatingWeekKeys = pipe(
    eachWeekOfIntervalWithOptions({ weekStartsOn: getDay(now) }),
    map(formatISO)
  )(calendarInterval);
  return floatingWeekKeys;
};

export const fetchAvailabilityWeekIntervals = ({
  authFetch,
  username,
  fetchFrameKey,
  userTz,
  timeZone,
  freeBusy,
}) => {
  return pipeP(
    fetchFrameKeyToParams({ userTz }),
    // ({ from, to }) => authFetch({
    //     url: `/api/latest/coaches/${username}/availability`,
    //     query: { username, from, to, }, }),
    applySpec({
      url: always(`/api/latest/coaches/${username}/availability`),
      query: {
        username: always(username),
        from: prop("from"),
        to: prop("to"),
        useFreeBusy: always(freeBusy),
      },
    }),
    authFetch,
    parseAvailabilities({ timeZone })
  )(fetchFrameKey);
};

// const isFetched = (interval, intervals) => {
//   const startIntervalMaybe = pipe(
//     find((int) => isWithinInterval(interval.start, int))
//   )(intervals);
//   const endIntervalMaybe = pipe(
//     find((int) => isWithinInterval(interval.end, int))
//   )(intervals);

//   if (startIntervalMaybe === endIntervalMaybe) return true;
//   if (startIntervalMaybe === endIntervalMaybe) return true;
// };

// const updateWindows = curryN(2, (interval, intervals) => {});

export const useFreeBusy = () => {
  const [freeBusy, setFreeBusy] = useSessionStorage("__freeBusy", true);
  return [freeBusy, setFreeBusy];
};

export const useAvailabilityQueries = ({
  username,
  timeZone,
  calendarInterval,
  disabled,
}) => {
  const { authFetch } = useAuth();
  const { userTz } = useContext(I18nContext);
  const fetchFrameKeys = getFetchFrameKeys({ calendarInterval, userTz });
  // TODO: frame by current "floating" week, not weekstarts. Initial load - 2x fetch -> 1x fetch
  // console.log(".....", { calendarInterval, fetchFrameKeys });

  const [freeBusy] = useFreeBusy();

  const queryDefs = fetchFrameKeys.map((fetchFrameKey) => ({
    enabled: !!username && !!timeZone && !disabled,
    queryKey: ["coaches", username, "availability", { userTz, fetchFrameKey, freeBusy }], // prettier-ignore
    queryFn: async () => ({
      params: { userTz, fetchFrameKey, username, calendarInterval },
      weekData: await fetchAvailabilityWeekIntervals({
        authFetch,
        username,
        fetchFrameKey,
        userTz,
        timeZone,
        freeBusy,
      }),
    }),
  }));

  const queries = useQueries({
    queries: queryDefs,
    combine: (queries) => {
      // react-router > v5, TODO: useMyQuery
      // console.log(">>> COMBINE WORKS", { queries });
      return queries;
    },
  });

  const composedQueries = useMemo(() => {
    const mapped = pipe(
      map(path(["data", "weekData"]))
      // tap((data) => console.log({ data }))
    )(queries);
    const fulfilled = filter(Boolean, mapped);
    const allIntervalsMaybe =
      fulfilled.length === queries.length ? flatten(fulfilled) : undefined;
    const someIntervals = fulfilled.length ? flatten(fulfilled) : [];

    return {
      queries,
      allResultsQuery: {
        data: allIntervalsMaybe,
        error: queries.find(({ error }) => error),
        isLoading: queries.some(({ isLoading }) => isLoading),
      },
      someResultsQuery: {
        data: someIntervals,
        error: queries.find(({ error }) => error),
        isLoading:
          queries.length && queries.every(({ isLoading }) => isLoading),
      },
    };
  }, [queries]);

  // console.log("[useAvailabilityQueries]", { composedQueries });

  return composedQueries;
};

export const getIsDayLoading = ({ queries, dayInterval, userTz }) => {
  const fetchFrameKeys = getFetchFrameKeys({
    calendarInterval: dayInterval,
    userTz,
  });
  // const dayQueries = queries.filter((query) => {
  //   // const fetchInterval =
  // });
  // firstDaysOfTheWeek - one Monday in Europe/Prague can be split in two week starts in UTC
  const allFetched = fetchFrameKeys.every((dayName) =>
    queries.find((query) => dayName === query.data?.params?.fetchFrameKey)
  );
  // if (dayInterval.end.getDay() === 1)
  //   console.log("%cgetIsDayLoading", "color:blue", {
  //     allFetched,
  //     fetchFrameKeys,
  //     queries,
  //     dayInterval,
  //     userTz,
  //   });
  return !allFetched;
};

// const plog =
//   (...args) =>
//   (data) =>
//     console.log(...args, data) || data;

// const rmT = replace(/T?$/, "");
// const toUtcFix = pipe(
//   tap(plog("toUTC 0")),
//   formatISO,
//   tap(plog("toUTC before")),
//   rmT,
//   tap(plog("toUTC after"))
// );

export const padLeft = (char = "0", num) => {
  const str = `${num}`;
  return str.padStart(2, char);
};

const exampleErr = [
  {
    errorCode: "not.enough.credits",
    fields: [
      {
        name: "user",
        value: "no-credit-user",
      },
    ],
    errorMessage: "User does not have enough credit",
  },
];
export const usePickSlotMutation = ({ username, ...mutationProps }) => {
  const { i18n, userTz } = useContext(I18nContext);
  const [freeBusy] = useFreeBusy();
  const pickSlotMutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/latest/coaches/${username}/schedule`,
      query: { useFreeBusy: freeBusy },
      from: applySpec({
        time: ({ interval }) =>
          i18n.formatLocal(interval.start, API_DATETIME_LOCAL_FORMAT),
      }),
    },
    snackbar: { success: true, error: true },
    invalidate: [
      { queryKey: ["coaches", username, "availability"] },
      { queryKey: ["user-info"] },
    ],
    ...mutationProps,
  });
  // console.log("[usePickSlotMutation.rndr]", { pickSlotMutation });

  return pickSlotMutation;
};
