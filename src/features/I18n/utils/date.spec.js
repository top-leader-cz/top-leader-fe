import { parseUTCZoned } from "./date";

const cases = [
  {
    input: ["Europe/Prague", "2023-10-06T12:00:00"],
    output: { ISO: "2023-10-06T12:00:00.000Z", hours: 14 },
  },
];

// console.log("date", JSON.stringify(cases, null, 2));

it("date", () => {
  cases.map(({ input, output }) => {
    const result = parseUTCZoned(...input);
    return expect({
      ISO: result.toISOString(),
      hours: result.getHours(),
    }).toEqual(output);
  });
  //   expect(getWeekStarts({ calendarInterval, userTz })).toEq(4);
});
