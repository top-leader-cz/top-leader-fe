import { pipeP } from "composable-fetch";
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
  replace,
  tap,
} from "ramda";
import { useContext, useMemo } from "react";
import { useMutation, useQueries, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";
import { I18nContext } from "../I18n/I18nProvider";
import {
  fixEnd,
  getFirstDayOfTheWeek,
  parseUTCZoned,
} from "../I18n/utils/date";
import { INDEX_TO_DAY } from "../Settings/AvailabilitySettings";
import * as tz from "date-fns-tz";

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
//       from: pipe( startOfWeekWithOptions({ weekStartsOn: 1 }), formatInTimeZone("yyyy-MM-dd'T'HH:mm:ss", userTz) ),
//       to: pipe( endOfWeekWithOptions({ weekStartsOn: 1 }), formatInTimeZone("yyyy-MM-dd'T'HH:mm:ss", userTz) ), }) );
// const getFetchFrameKeys_ = ({ calendarInterval, userTz }) => { return getWeekStarts({ calendarInterval, userTz, weekStartsOn: 1, UTC: false, ISO: true, }); };

const fetchFrameKeyToParams = ({ userTz }) =>
  pipe(
    parseISO,
    applySpec({
      from: pipe(startOfDay, formatInTimeZone("yyyy-MM-dd'T'HH:mm:ss", userTz)),
      to: pipe(
        startOfDay,
        addDays(7),
        addMilliseconds(-1),
        formatInTimeZone("yyyy-MM-dd'T'HH:mm:ss", userTz)
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
}) => {
  return pipeP(
    fetchFrameKeyToParams({ userTz }),
    // ({ from, to }) => authFetch({
    //     url: `/api/latest/coaches/${username}/availability`,
    //     query: { username, from, to, }, }),
    applySpec({
      url: always(`/api/latest/coaches/${username}/availability`),
      query: { username: always(username), from: prop("from"), to: prop("to") },
    }),
    authFetch,
    parseAvailabilities({ timeZone })
  )(fetchFrameKey);
};

const joinResults = pipe(flatten);

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

export const useAvailabilityQueries = ({
  username,
  timeZone,
  calendarInterval,
}) => {
  // const [fetchWindows, setFetchWindows] = useState([calendarInterval]);
  // useEffect(() => {
  //   if (!isFetched(calendarInterval, fetchWindows)) {
  //     setFetchWindows(updateWindows(calendarInterval));
  //   }
  // }, []);
  // const query = useQuery();

  const { authFetch } = useAuth();
  const { i18n, userTz } = useContext(I18nContext);
  const fetchFrameKeys = getFetchFrameKeys({ calendarInterval, userTz });
  // TODO: frame by current "floating" week, not weekstarts. Initial load - 2x fetch -> 1x fetch
  console.log(".....", { calendarInterval, fetchFrameKeys });

  const queryDefs = fetchFrameKeys.map((fetchFrameKey) => ({
    retry: false,
    refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    enabled: !!username && !!timeZone,
    queryKey: [
      "coaches",
      username,
      "availability",
      { userTz, fetchFrameKey }, // calendarInterval
    ],
    queryFn: async () => ({
      params: { userTz, fetchFrameKey, username, calendarInterval },
      weekData: await fetchAvailabilityWeekIntervals({
        authFetch,
        username,
        fetchFrameKey,
        userTz,
        timeZone,
      }),
    }),
  }));

  const queries = useQueries({
    queries: queryDefs,
    combine: (queries) => {
      // react-router > v5, TODO: useMyQuery
      console.log(">>> COMBINE WORKS", { queries });
      return queries;
    },
  });

  const composedQueries = useMemo(() => {
    const mapped = pipe(
      map(path(["data", "weekData"])),
      tap((data) => console.log({ data }))
    )(queries);
    const fulfilled = filter(Boolean, mapped);
    const allIntervalsMaybe =
      fulfilled.length === queries.length ? joinResults(fulfilled) : undefined;
    const someIntervals = fulfilled.length ? joinResults(fulfilled) : [];

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

  console.log({ composedQueries });

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

const plog =
  (...args) =>
  (data) =>
    console.log(...args, data) || data;

const rmT = replace(/T?$/, "");
const toUtcFix = pipe(
  tap(plog("toUTC 0")),
  formatISO,
  tap(plog("toUTC before")),
  rmT,
  tap(plog("toUTC after"))
);

export const padLeft = (char = "0", num) => {
  const str = `${num}`;
  return str.padStart(2, char);
};

export const usePickSlotMutation = ({
  username,
  onSuccess,
  ...mutationProps
}) => {
  const { i18n, userTz } = useContext(I18nContext);
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  const pickSlotMutation = useMutation({
    mutationFn: async ({ interval }) =>
      authFetch({
        method: "POST",
        url: `/api/latest/coaches/${username}/schedule`,
        data: (() => {
          // Clicked on "12:00 +02:00" === 10:00 UTC (DST - letni cas)
          const localStart = interval.start; // just toString(): "2023-09-26T10:00:00.000Z"
          const firstDayOfTheWeek = getFirstDayOfTheWeek(localStart); // "firstDayOfTheWeek": "2023-09-24",
          const day = INDEX_TO_DAY[getDay(localStart)]; // 0 - Sun
          const utcHours = i18n.formatUtcLocal(localStart, "kk");
          const data = {
            // interval: map(toUtcFix, interval),
            firstDayOfTheWeek,
            day,
            time: `${padLeft("0", utcHours)}:00:00`,
            // time: { hour: getHours(localStart), minute: 0, second: 0, nano: 0, },
          };
          // debugger;
          return data;

          // utc not working, TODO:
          // const utc = i18n.zonedToUtcLocal(localStart); // "utc": "2023-09-26T10:00:00.000Z",
          // const firstDayOfTheWeekLocal = i18n.getFirstDayOfTheWeekLocal(); // "firstDayOfTheWeekLocal": "2023-09-25",
          // console.log("%c[pickSlotMutation]", "color:blue", {
          //   IO: { interval, data },
          //   computed: {
          //     localStart,
          //     utc, // "utc": "2023-09-26T10:00:00.000Z",
          //     utcISO: formatISO(utc), // "utcStr": "2023-09-26T12:00:00+02:00",
          //     localISO: formatISO(localStart), // "2023-09-26T12:00:00+02:00"
          //     firstDayOfTheWeek, firstDayOfTheWeekLocal, utcISOString: utc.toISOString(), utcString: utc.toString(),
          //   },
          //   hours: {
          //     getHours: { utc: getHours(utc), localStart: getHours(localStart), }, // 12
          //     format: { utc: format("kk", utc), localStart: format("kk", localStart), }, // 12
          //     formatLocal: { utc: i18n.formatLocal(utc, "kk"), localStart: i18n.formatLocal(localStart, "kk"), }, // 12
          //     formatUtcLocal: { utc: i18n.formatUtcLocal(utc, "kk"), localStart: i18n.formatUtcLocal(localStart, "kk"), }, // "10"
          //   },
          // });
        })(),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["coaches", username, "availability"],
      });
      onSuccess?.(data);
    },
    ...mutationProps,
  });

  return pickSlotMutation;
};
