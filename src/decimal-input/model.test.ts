import { describe, expect, it } from "vitest";
import {
  getPrecisionAndScaleValidator,
  isValidDecimalInput,
  isValidPositiveDecimalInput,
} from "./model";

interface Scenario {
  input: string;
  expected: boolean;
}

describe("all decimals: isValidDecimalInput", () => {
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
});

describe("positive decimals: isValidPositiveDecimalInput", () => {
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
  ];

  describe.each(scenarios)("isValidPriceString", (scenario) => {
    const { input, expected } = scenario;

    it(`"${input}" should be ${expected ? "valid" : "invalid"}`, () => {
      const actual = isValidPositiveDecimalInput(input);
      expect(actual).toBe(expected);
    });
  });
});

describe("precision and scale: getPrecisionAndScaleValidator", () => {
  describe("constructor", () => {
    it("scale must be <= than precision", () => {
      expect(() => getPrecisionAndScaleValidator(1, 2)).toThrow();
    });

    it("precision cannot be 0", () => {
      expect(() => getPrecisionAndScaleValidator(0, 0)).toThrow();
    });

    it("precision cannot be < 0", () => {
      expect(() => getPrecisionAndScaleValidator(-1, -1)).toThrow();
    });

    it("scale cannot be < 0", () => {
      expect(() => getPrecisionAndScaleValidator(1, -1)).toThrow();
    });

    it("precision must be an integer", () => {
      expect(() => getPrecisionAndScaleValidator(1.1, 1)).toThrow();
    });

    it("scale must be an integer", () => {
      expect(() => getPrecisionAndScaleValidator(2, 1.1)).toThrow();
    });
  });

  describe("validator: precision=5, scale=2", () => {
    const validator = getPrecisionAndScaleValidator(5, 2);

    const scenarios: Scenario[] = [
      { input: "1", expected: true },
      { input: "1.", expected: true },
      { input: ".1", expected: true },
      { input: "1.1", expected: true },
      { input: "1.11", expected: true },
      { input: "10.01", expected: true },
      { input: "1.001", expected: false },
      { input: "10000", expected: true },
      { input: "100.01", expected: true },
      { input: "1000.01", expected: false },
      { input: "100000", expected: false },
      { input: "000000", expected: true },
      { input: "-000001", expected: true },
      { input: "hello", expected: false },
    ];

    describe.each(scenarios)("isValidPriceString", (scenario) => {
      const { input, expected } = scenario;

      it(`"${input}" should be ${expected ? "valid" : "invalid"}`, () => {
        const actual = validator(input);
        expect(actual).toBe(expected);
      });
    });
  });
});
