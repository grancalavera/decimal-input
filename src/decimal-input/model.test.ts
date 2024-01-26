import { describe, it, expect } from "vitest";
import { isValidDecimalInput } from "./model";

interface Scenario {
  input: string;
  expected: boolean;
}

const scenarios: Scenario[] = [
  { input: "foo", expected: false },
  { input: "foo1", expected: false },
  { input: "1foo", expected: false },
  { input: "0", expected: true },
  { input: "0.", expected: true },
  { input: ".0", expected: true },
  { input: "-.0", expected: true },
  { input: "+.0", expected: true },
  { input: "-0", expected: true },
  { input: "+0", expected: true },
  { input: "1", expected: true },
  { input: "1.", expected: true },
  { input: ".1", expected: true },
  { input: "-.1", expected: true },
  { input: "+.1", expected: true },
  { input: "-1", expected: true },
  { input: "+1", expected: true },
  { input: "1.1", expected: true },
  { input: "1.1.", expected: false },
  { input: "-1.1", expected: true },
  { input: "+1.1", expected: true },
  { input: ".", expected: true },
  { input: "+", expected: true },
  { input: "-", expected: true },
  { input: "+.", expected: true },
  { input: "-.", expected: true },
  { input: "", expected: true },
];

describe.each(scenarios)("isValidPriceString", (scenario) => {
  const { input, expected } = scenario;

  it(`"${input}" should be ${expected ? "valid" : "invalid"}`, () => {
    const actual = isValidDecimalInput(input);
    expect(actual).toBe(expected);
  });
});
