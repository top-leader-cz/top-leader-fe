import {
  addDays,
  addHours,
  endOfWeekWithOptions,
  formatISO,
  getDay,
  isWithinInterval,
  parseISO,
  startOfWeek,
  startOfWeekWithOptions,
} from "date-fns/fp";
import {
  always,
  applySpec,
  curryN,
  filter,
  find,
  flatten,
  identity,
  map,
  path,
  pipe,
  prop,
  replace,
  tap,
  values,
} from "ramda";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";
import { I18nContext } from "../I18n/I18nProvider";
import {
  fixEnd,
  getFirstDayOfTheWeek,
  parseUTCZoned,
} from "../I18n/utils/date";
import { getWeekStarts } from "../I18n/utils/getWeekStarts";
import { INDEX_TO_DAY } from "../Settings/AvailabilitySettings";
import { pipeP } from "composable-fetch";

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

const parseSlot = (userTz) => (dateStr) => {
  // const start = parseSlotDateTime(date, timeFrom, userTz);
  // const end = parseSlotDateTime(date, timeTo, userTz);
  const start = parseUTCZoned(userTz, dateStr);
  const end = fixEnd(addHours(1, parseUTCZoned(userTz)));

  return { start, end };
};

// TODO: move to query and add tests :)
const parseAvailabilities = ({
  userTz,
  parentInterval,
  overlapping = "throw",
}) =>
  pipe(
    // values,
    // flatten,
    map(parseSlot(userTz)),
    parentInterval
      ? filter(isIntervalWithin({ parentInterval, overlapping }))
      : identity
  );

export const fetchAvailabilityWeekIntervals = ({
  authFetch,
  username,
  firstDayOfTheWeek,
  userTz,
}) => {
  return pipeP(
    parseISO,
    applySpec({
      from: startOfWeekWithOptions({ weekStartsOn: 1 }),
      to: endOfWeekWithOptions({ weekStartsOn: 1 }),
    }),
    // ({ from, to }) => authFetch({
    //     url: `/api/latest/coaches/${username}/availability`,
    //     query: { username, from, to, }, }),
    applySpec({
      url: always(`/api/latest/coaches/${username}/availability`),
      query: { username: always(username), from: prop("from"), to: prop("to") },
    }),
    authFetch,
    parseAvailabilities({ userTz })
  )(firstDayOfTheWeek);
};

const useCoachAvailabilityQuery = ({ username, calendarInterval }) => {
  const { authFetch } = useAuth();
  const { i18n, userTz } = useContext(I18nContext);
  const firstDaysOfTheWeek = getWeekStarts({
    calendarInterval,
    userTz,
    weekStartsOn: 1,
  });

  return useQuery({
    enabled: !!username,
    queryKey: [
      "coaches",
      username,
      "availability",
      { userTz, firstDaysOfTheWeek }, // calendarInterval
    ],
    queryFn: async () => {
      const intervalPromises = firstDaysOfTheWeek.map((firstDayOfTheWeek) =>
        fetchAvailabilityWeekIntervals({
          // Changed
          authFetch,
          username,
          firstDayOfTheWeek,
          userTz,
        })
      );
      const resolved = await Promise.all(intervalPromises);
      const intervals = pipe(
        flatten
        // filter(
        //   isIntervalWithin({
        //     parentInterval: calendarInterval,
        //     overlapping: "throw",
        //   })
        // )
      )(resolved);
      console.log("[useCoachAvailabilityQuery]", {
        firstDaysOfTheWeek,
        intervals,
        resolved,
      });
      // debugger;

      return intervals;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

const joinResults = pipe(flatten);

export const useAvailabilityQueries_ = ({ username, calendarInterval }) => {
  const { authFetch } = useAuth();
  const { i18n, userTz } = useContext(I18nContext);
  const firstDaysOfTheWeek = getWeekStarts({
    calendarInterval,
    userTz,
    weekStartsOn: 1,
  });
  const queries = useQueries({
    queries: firstDaysOfTheWeek.map((firstDayOfTheWeek) => ({
      retry: false,
      refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
      enabled: !!username,
      queryKey: [
        "coaches",
        username,
        "availability",
        { userTz, firstDayOfTheWeek }, // calendarInterval
      ],
      queryFn: async () => ({
        params: { userTz, firstDayOfTheWeek, username, calendarInterval },
        weekData: await fetchAvailabilityWeekIntervals({
          authFetch,
          username,
          firstDayOfTheWeek,
          userTz,
        }),
      }),
    })),
    combine: (queries) => {
      // react-router > v5, TODO: useMyQuery
      console.log(">>> COMBINE", { queries });
      return queries;
      const mapped = pipe(
        map(path(["data", "weekData"])),
        filter(Boolean),
        flatten
      )(queries);
      const intervalsMaybe =
        mapped.length === queries.length ? mapped : undefined;

      return {
        queries,
        intervalsMaybe,
        composedQuery: {
          data: intervalsMaybe,
          error: queries.find(({ error }) => error),
          isLoading: queries.some(({ isLoading }) => isLoading),
        },
      };
      // return {
      //   allFetched: queries.every((query) => query.data),
      //   datas: queries.map((result) => result.data),
      //   isLoading: queries.some((result) => result.isLoading),
      //   errorsArr: queries.map((result) => result.error).filter(Boolean),
      // };
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
    const someIntervalsMaybe = fulfilled.length ? joinResults(fulfilled) : [];

    return {
      queries,
      composedQuery: {
        data: allIntervalsMaybe,
        error: queries.find(({ error }) => error),
        isLoading: queries.some(({ isLoading }) => isLoading),
      },
      optimisticQuery: {
        data: someIntervalsMaybe,
        error: queries.find(({ error }) => error),
        isLoading: queries.some(({ isLoading }) => isLoading),
      },
    };
  }, [queries]);

  console.log({ composedQueries });

  return composedQueries;
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

export const useAvailabilityQueries = ({ username, calendarInterval }) => {
  // const [fetchWindows, setFetchWindows] = useState([calendarInterval]);
  // useEffect(() => {
  //   if (!isFetched(calendarInterval, fetchWindows)) {
  //     setFetchWindows(updateWindows(calendarInterval));
  //   }
  // }, []);
  // const query = useQuery();

  const { authFetch } = useAuth();
  const { i18n, userTz } = useContext(I18nContext);
  const firstDaysOfTheWeek = getWeekStarts({
    calendarInterval,
    userTz,
    weekStartsOn: 1,
    UTC: false,
    ISO: true,
  });

  const queryDefs = firstDaysOfTheWeek.map((firstDayOfTheWeek) => ({
    retry: false,
    refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    enabled: !!username,
    queryKey: [
      "coaches",
      username,
      "availability",
      { userTz, firstDayOfTheWeek }, // calendarInterval
    ],
    queryFn: async () => ({
      params: { userTz, firstDayOfTheWeek, username, calendarInterval },
      weekData: await fetchAvailabilityWeekIntervals({
        authFetch,
        username,
        firstDayOfTheWeek,
        userTz,
      }),
    }),
  }));

  const queries = useQueries({
    queries: queryDefs,
    combine: (queries) => {
      // react-router > v5, TODO: useMyQuery
      console.log(">>> COMBINE", { queries });
      return queries;
      const mapped = pipe(
        map(path(["data", "weekData"])),
        filter(Boolean),
        flatten
      )(queries);
      const intervalsMaybe =
        mapped.length === queries.length ? mapped : undefined;

      return {
        queries,
        intervalsMaybe,
        composedQuery: {
          data: intervalsMaybe,
          error: queries.find(({ error }) => error),
          isLoading: queries.some(({ isLoading }) => isLoading),
        },
      };
      // return {
      //   allFetched: queries.every((query) => query.data),
      //   datas: queries.map((result) => result.data),
      //   isLoading: queries.some((result) => result.isLoading),
      //   errorsArr: queries.map((result) => result.error).filter(Boolean),
      // };
    },
  });

  const composedQueries = useMemo(() => {
    const mapped = pipe(
      map(path(["data", "weekData"])),
      tap((data) => console.log({ data }))
    )(queries);
    const fulfilled = filter(Boolean, mapped);
    const allIntervalsMaybe =
      fulfilled.length === queries.length ? flatten(fulfilled) : undefined;
    const someIntervalsMaybe = fulfilled.length ? flatten(fulfilled) : [];

    return {
      queries,
      composedQuery: {
        data: allIntervalsMaybe,
        error: queries.find(({ error }) => error),
        isLoading: queries.some(({ isLoading }) => isLoading),
      },
      optimisticQuery: {
        data: someIntervalsMaybe,
        error: queries.find(({ error }) => error),
        isLoading: queries.some(({ isLoading }) => isLoading),
      },
    };
  }, [queries]);

  console.log({ composedQueries });

  return composedQueries;
};

export const getIsDayLoading = ({ queries, dayInterval, userTz }) => {
  const firstDaysOfTheWeek = getWeekStarts({
    calendarInterval: dayInterval,
    userTz,
    weekStartsOn: 1,
  });
  // const dayQueries = queries.filter((query) => {
  //   // const fetchInterval =
  // });
  // firstDaysOfTheWeek - one Monday in Europe/Prague can be split in two week starts in UTC
  const allFetched = firstDaysOfTheWeek.every((dayName) =>
    queries.find((query) => dayName === query.data?.params?.firstDayOfTheWeek)
  );
  // if (dayInterval.end.getDay() === 1)
  //   console.log("%cgetIsDayLoading", "color:blue", {
  //     allFetched,
  //     firstDaysOfTheWeek,
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

const padLeft = (char = "0", num) => {
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
