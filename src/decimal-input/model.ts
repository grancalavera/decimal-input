export const isValidDecimalInput = (input: string): boolean => {
  const exceptions = ["", ".", "-", "+", "-.", "+."];
  const decimalRe = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
  if (exceptions.includes(input)) {
    return true;
  }
  return decimalRe.test(input);
};

export const isValidPositiveDecimalInput = (input: string): boolean => {
  const exceptions = ["", "."];
  const decimalRe = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

  if (exceptions.includes(input)) {
    return true;
  }

  const validChars = decimalRe.test(input);
  return validChars;
};

/**
 * Creates a validator for a decimal input with a given precision and scale
 * @param maxPrecision maximum number of digits
 * @param maxScale maximum number of digits to the right of the decimal
 * @returns (input: string) => boolean
 */
export const getPrecisionAndScaleValidator = (
  maxPrecision: number,
  maxScale: number
) => {
  if (maxPrecision < maxScale) {
    throw new Error("maxPrecision must be greater than or equal to scale");
  }

  if (maxPrecision === 0) {
    throw new Error("maxPrecision must be greater than 0");
  }

  if (maxPrecision < 0) {
    throw new Error("maxPrecision must be a positive integer");
  }

  if (maxScale < 0) {
    throw new Error("maxScale must be a positive integer");
  }

  if (!Number.isInteger(maxPrecision)) {
    throw new Error("maxPrecision must be an integer");
  }

  if (!Number.isInteger(maxScale)) {
    throw new Error("maxScale must be an integer");
  }

  return (input: string) => {
    const [, decimals] = input.split(".");
    const actualScale = decimals === undefined ? 0 : decimals.length;
    const sanitisedDigits = input
      // order matters here
      .replace(/^-/, "")
      .replace(/^0+/, "")
      .replace(".", "");

    const digitsRe = /^\d*$/;
    if (!digitsRe.test(sanitisedDigits)) {
      return false;
    }

    const actualPrecision = sanitisedDigits.length;
    const isValidScale = actualScale <= maxScale;
    const isValidPrecision = actualPrecision <= maxPrecision;
    return isValidScale && isValidPrecision;
  };
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
