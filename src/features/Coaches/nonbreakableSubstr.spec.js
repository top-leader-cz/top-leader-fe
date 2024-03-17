import { nonbreakableSubstr } from "./nonbreakableSubstr";

const cases = [
  {
    input: ["\n", 0, "a\nb\nc"],
    expected: "",
  },
  {
    input: ["\n", 1, "a\nb\nc"],
    expected: "a",
  },
  {
    input: ["\n", 2, "a\nb\nc"],
    expected: "a\nb",
  },
  {
    input: ["\n", 3, "a\nb\nc"],
    expected: "a\nb\nc",
  },
  {
    input: ["\n", 4, "a\nb\nc"],
    expected: "a\nb\nc",
  },
  {
    input: ["\n", 100, "a\nb\nc"],
    expected: "a\nb\nc",
  },
  {
    input: ["\n", 3, "a\nb\nc\n\n\n"],
    expected: "a\nb\nc\n\n\n",
  },
  {
    input: ["\n", 3, "a\nb\nc\n"],
    expected: "a\nb\nc\n",
  },
  {
    input: ["\n", 2, "a\nbbbb\nc"],
    expected: "a\nb",
  },
];

it("nonbreakableSubstr", () => {
  cases.forEach(({ input, expected }, index) => {
    const result = nonbreakableSubstr(...input);
    try {
      expect(result).toEqual(expected);
    } catch (e) {
      console.log({ input, expected, result, index });
      // console.error(e);
      throw e;
    }
  });
});
