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
];

// console.log("getWeekStarts", JSON.stringify(cases, null, 2));

it("getWeekStarts", () => {
  cases.map(({ input, output }) => {
    return expect(getWeekStarts(input)).toEqual(output);
  });
});
