const exceptions = ["", ".", "-", "+", "-.", "+."];
const decimalRe = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

export const isValidDecimalInput = (input: string): boolean => {
  if (exceptions.includes(input)) {
    return true;
  }
  return decimalRe.test(input);
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

export const getValidator =
  (validate?: (value: number) => boolean) =>
  (value: number): boolean => {
    const valid = isValidNumber(value);
    return validate ? valid && validate(value) : valid;
  };
