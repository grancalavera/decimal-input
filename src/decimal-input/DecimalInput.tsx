import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getFormatter, getValidator, isValidDecimalInput } from "./model";

type ReactInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "onChange" | "value"
>;

type DecimalInputProps = {
  initialValue: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur?: (value: number | undefined) => void;
  format?: (value: number) => string;
  validate?: (value: number) => boolean;
  onValidChange?: (value: boolean) => void;
};

export const DecimalInput = ({
  validate,
  format,
  initialValue,
  onChange,
  onValidChange,
  ...props
}: ReactInputProps & DecimalInputProps) => {
  const validateRef = useRef(getValidator(validate));
  const formatRef = useRef(getFormatter(format));

  const [displayValue, setDisplayValue] = useState(() =>
    formatRef.current(initialValue)
  );

  const [rawInputValue, setRawInputValue] = useState(() =>
    getFormatter()(initialValue)
  );

  const clear = useCallback(() => {
    setDisplayValue("");
    setRawInputValue("");
    onChange(undefined);
  }, [onChange]);

  useEffect(() => {
    if (initialValue === undefined) {
      return;
    }

    const valid = validateRef.current(initialValue);
    onValidChange?.(valid);
    if (valid) {
      onChange(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <input
      value={displayValue}
      onChange={(e) => {
        const value = e.target.value;
        if (value === "") {
          clear();
          return;
        }

        if (!isValidDecimalInput(value)) {
          return;
        }

        setRawInputValue(value);
        setDisplayValue(value);

        const decimalValue = parseFloat(value);
        const valid = validateRef.current(decimalValue);
        onValidChange?.(valid);

        if (valid) {
          onChange(decimalValue);
        }
      }}
      onFocus={(e) => {
        setDisplayValue(rawInputValue);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        const value = e.target.value;

        if (!isValidDecimalInput(value)) {
          return;
        }

        const decimalValue = parseFloat(value);
        setDisplayValue(formatRef.current(decimalValue));

        props.onBlur?.(e);
      }}
      {...props}
    />
  );
};
