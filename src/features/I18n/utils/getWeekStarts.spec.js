import { parseUTCZoned } from "./date";
import { getWeekStarts } from "./getWeekStarts";

// CZ DST
// Sun 26. 3. 2023 (DST) 2:00 -> 3:00
// Sun 29. 10 2023 (CET) 3:00 -> 2:00.
const TZS = { "-0500": "America/Cayman", "0200": "Europe/Prague" }; // GMT-05:00

const formatStr = "yyyy-MM-dd-HH:mm:ss";
const cases = [
  {
    input: {
      calendarInterval: {
        start: new Date(2023, 8, 27), //            Wed "2023-09-26T22:00:00.000Z"
        end: new Date(new Date(2023, 9, 4) - 1), // Wed "2023-10-03T21:59:59.999Z"
      },
      userTz: TZS["0200"],
      formatStr,
    },
    output: ["2023-09-25-00:00:00", "2023-10-02-00:00:00"],
  },
  {
    input: {
      calendarInterval: {
        start: new Date(2023, 8, 27), // Wed "2023-09-26T22:00:00.000Z"
        end: new Date(2023, 8, 27), //   Wed "2023-09-26T22:00:00.000Z"
      },
      userTz: TZS["0200"],
      formatStr,
    },
    output: ["2023-09-25-00:00:00"],
  },
  {
    input: {
      calendarInterval: {
        start: parseUTCZoned(TZS["0200"], "2023-10-01T03:00:00.000Z"), // // 1. Sun
        end: parseUTCZoned(TZS["0200"], "2023-10-02T03:59:59.999Z"), // 2. Mon
      },
      userTz: TZS["0200"],
      formatStr,
      UTC: true,
    },
    output: ["2023-09-25-00:00:00", "2023-10-02-00:00:00"],
  },
  {
    // 3
    input: {
      calendarInterval: {
        start: parseUTCZoned(TZS["0200"], "2023-10-01T22:00:00.000Z"), //
        end: parseUTCZoned(TZS["0200"], "2023-10-02T21:59:59.999Z"), //
      },
      userTz: TZS["0200"],
      formatStr,
      UTC: true,
    },
    output: ["2023-09-25-00:00:00", "2023-10-02-00:00:00"],
  },
  {
    // 3
    input: {
      calendarInterval: {
        start: parseUTCZoned(TZS["0200"], "2023-10-01T23:30:00.000Z"), //
        end: parseUTCZoned(TZS["0200"], "2023-10-02T01:59:59.999Z"), //
      },
      userTz: TZS["0200"],
      formatStr,
      UTC: true,
    },
    output: ["2023-09-25-00:00:00", "2023-10-02-00:00:00"],
  },
  {
    // 3
    input: {
      calendarInterval: {
        start: parseUTCZoned(TZS["0200"], "2023-10-01T23:30:00.000Z"), //
        end: parseUTCZoned(TZS["0200"], "2023-10-01T23:59:59.999Z"), //
      },
      userTz: TZS["0200"],
      formatStr,
      UTC: true,
    },
    output: ["2023-09-25-00:00:00"],
  },
  {
    // 3
    input: {
      calendarInterval: {
        start: parseUTCZoned(TZS["0200"], "2023-10-02T00:30:00.000Z"), //
        end: parseUTCZoned(TZS["0200"], "2023-10-02T00:59:59.999Z"), //
      },
      userTz: TZS["0200"],
      formatStr,
      UTC: true,
    },
    output: ["2023-10-02-00:00:00"],
  },
];

// console.log("getWeekStarts", JSON.stringify(cases, null, 2));

it("getWeekStarts", () => {
  cases.map(({ input, output }, index) => {
    return expect([getWeekStarts(input), index]).toEqual([output, index]);
  });
});
