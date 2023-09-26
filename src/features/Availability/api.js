import { formatISO, getDay, isWithinInterval } from "date-fns/fp";
import {
  filter,
  flatten,
  identity,
  map,
  pipe,
  replace,
  tap,
  values,
} from "ramda";
import { useCallback, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../Authorization";
import { I18nContext } from "../I18n/I18nProvider";
import {
  fixEnd,
  getFirstDayOfTheWeek,
  parseUTCZoned,
} from "../I18n/utils/date";
import { getWeekStarts } from "../I18n/utils/getWeekStarts";
import { INDEX_TO_DAY } from "../Settings/AvailabilitySettings";

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
      handleIntervalOverlapping({ overlapping, interval, parentInterval });
    }
    return startWithin;
  };

const parseSlot =
  (userTz) =>
  ({ date, timeFrom, timeTo }) => {
    // {
    //     "day": "MONDAY",
    //     "date": "2023-09-24",
    //     "timeFrom": "09:00:00",
    //     "timeTo": "10:00:00",
    //     "firstDayOfTheWeek": "2023-09-24"
    // },
    // const start = parseSlotDateTime(date, timeFrom, userTz);
    // const end = parseSlotDateTime(date, timeTo, userTz);
    const start = parseUTCZoned(userTz, `${date}T${timeFrom}`);
    const end = fixEnd(parseUTCZoned(userTz, `${date}T${timeTo}`));

    return { start, end };
  };

// TODO: move to query and add tests :)
const parseAvailabilities = ({
  userTz,
  parentInterval,
  overlapping = "throw",
}) =>
  pipe(
    values,
    flatten,
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
  // const inner = startOfWeekWithOptions(weekDate, { weekStartsOn: 1 });
  // debugger; // TODO: not working

  return authFetch({
    url: `/api/latest/coaches/${username}/availability`,
    query: {
      firstDayOfTheWeek,
    },
  }).then(
    parseAvailabilities({
      userTz,
      // parentInterval: calendarInterval,
      // overlapping: "throw", // TODO: true and move to useCoachAvailabilityIntervals
    })
  );
};

export const useCoachAvailabilityQuery = ({ username, calendarInterval }) => {
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

// TODO: split into useQueries for better caching
// const useCoachAvailabilityIntervals = ({ username, calendarInterval }) => {
//   const { authFetch } = useAuth();
//   const { i18n, userTz } = useContext(I18nContext);

//   const { allFetched, datas, isLoading, errorsArr } = useQueries({
// const ws = getWeekStarts({ calendarInterval })
//     queries: ws.map((weekStart) => ({
//       retry: false,
//       refetchOnWindowFocus: false,
//       refetchOnReconnect: false,
//       enabled: !!username,
//       queryKey: ["coaches", username, "availability"],
//       queryFn: () =>
//         fetchAvailabilityWeekIntervals({
//           authFetch,
//           username,
//           firstDayOfTheWeek,
//           userTz,
//         }),
//     })),
//     combine: (results) => {
//       return {
//         allFetched: results.every((query) => query.data),
//         datas: results.map((result) => result.data),
//         isLoading: results.some((result) => result.isLoading),
//         errorsArr: results.map((result) => result.error).filter(Boolean),
//       };
//     },
//   });

//   return useMemo(() => {
//     const availabilityIntervals = allFetched
//       ? pipe(
//           flatten,
//           filter(
//             isIntervalWithin({
//               parentInterval: calendarInterval,
//               overlapping: "throw",
//             })
//           ),
//           identity
//         )(datas)
//       : [];
//     return { allFetched, availabilityIntervals, isLoading, errorsArr }; // TODO: error handling
//   }, [allFetched, calendarInterval, datas, errorsArr, isLoading]);
// };

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
