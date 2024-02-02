type InputValidationOptions = {
  precision?: number;
  scale?: number;
};

export const isValidDecimalInput = (input: string): boolean => {
  const exceptions = ["", ".", "-", "+", "-.", "+."];
  const decimalRe = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
  if (exceptions.includes(input)) {
    return true;
  }
  return decimalRe.test(input);
};

export const isValidPositiveDecimalInput =
  (options?: InputValidationOptions) =>
  (input: string): boolean => {
    const precision = options?.precision ?? 13;
    const scale = options?.scale ?? 12;
    const exceptions = ["", "."];
    const decimalRe = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

    if (exceptions.includes(input)) {
      return true;
    }
    const validChars = decimalRe.test(input);

    const [, decimals] = input.split(".");
    const actualScale = decimals === undefined ? 0 : decimals.length;
    const actualPrecision = input.replace(".", "").length;
    const validDecimals = actualScale <= scale;
    const validLength = actualPrecision <= precision;
    console.log({
      input,
      decimals,
      actualPrecision,
      actualScale,
      validChars,
      validDecimals,
      validLength,
    });

    return validChars && validDecimals && validLength;
  };

export const isValidNumber = (candidate: unknown): candidate is number => {
  return typeof candidate === "number" && !isNaN(candidate);
};

export const getFormatter =
  (format?: (value: number) => string) =>
  (value: number | undefined): string => {
    if (!isValidNumber(value)) {
      return "";
    }
    return format ? format(value) : value.toString();
  };

type ValidateValue = (value: number) => boolean;

export const getValueValidator = (validate?: ValidateValue) => {
  // step 1: construct validation function with defaults
  const applyValidation = (value: number): boolean => {
    const valid = isValidNumber(value);
    return validate ? valid && validate(value) : valid;
  };

  // step 2: return the validation function
  return applyValidation;
};

type ValidateInput = (value: string) => boolean;
export const getInputValidator = (validate?: ValidateInput) => {
  return validate ?? isValidDecimalInput;
};
