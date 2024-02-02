import { describe, it, expect } from "vitest";
import { isValidPositiveDecimalInput } from "./model";

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
  { input: "-.0", expected: false },
  { input: "+.0", expected: false },
  { input: "-0", expected: false },
  { input: "+0", expected: false },
  { input: "1", expected: true },
  { input: "1.", expected: true },
  { input: ".1", expected: true },
  { input: "-.1", expected: false },
  { input: "+.1", expected: false },
  { input: "-1", expected: false },
  { input: "+1", expected: false },
  { input: "1.1", expected: true },
  { input: "1.1.", expected: false },
  { input: "-1.1", expected: false },
  { input: "+1.1", expected: false },
  { input: ".", expected: true },
  { input: "+", expected: false },
  { input: "-", expected: false },
  { input: "+.", expected: false },
  { input: "-.", expected: false },
  { input: "", expected: true },
  // 1 character more than the allowed max decimals (only two decimal places allowed)
  { input: ".001", expected: false },
  // max allowed numerical chars count = 5
  { input: "10.01", expected: true },
  { input: "1.001", expected: false },
  { input: "10000", expected: true },
  { input: "100.01", expected: true },
  { input: "1000.01", expected: false },
  { input: "100000", expected: false },
];

describe.each(scenarios)("isValidPriceString", (scenario) => {
  const { input, expected } = scenario;

  it(`"${input}" should be ${expected ? "valid" : "invalid"}`, () => {
    const actual = isValidPositiveDecimalInput({ precision: 5, scale: 2 })(
      input
    );
    expect(actual).toBe(expected);
  });
});
