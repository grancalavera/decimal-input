import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getFormatter,
  getInputValidator,
  getPrecisionAndScaleValidator,
  getValueValidator,
} from "./model";

type ReactInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "onChange" | "value"
>;

type DecimalInputProps = {
  initialValue: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur?: (value: number | undefined) => void;
  format?: (value: number) => string;
  validateInput?: (input: string) => boolean;
  validateValue?: (value: number) => boolean;
  onValidChange?: (value: boolean) => void;
  maxPrecision?: number;
  maxScale?: number;
};

export const DecimalInput = ({
  validateValue,
  format,
  initialValue,
  onChange,
  validateInput,
  onValidChange,
  ...props
}: ReactInputProps & DecimalInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const validateValueRef = useRef(getValueValidator(validateValue));
  const validateInputRef = useRef((input: string) => {
    const isValidInput = getInputValidator(validateInput);
    const isValidPrecisionAndScale = getPrecisionAndScaleValidator(
      props.maxPrecision ?? Number.MAX_SAFE_INTEGER,
      props.maxScale ?? Number.MAX_SAFE_INTEGER
    );
    return isValidInput(input) && isValidPrecisionAndScale(input);
  });

  const formatRef = useRef(getFormatter(format));

  const [displayValue, setDisplayValue] = useState(() => {
    if (initialValue === undefined) {
      return "";
    }

    if (!validateInputRef.current(initialValue.toString())) {
      return "";
    }

    return formatRef.current(initialValue);
  });

  const [rawInputValue, setRawInputValue] = useState(() => {
    if (initialValue === undefined) {
      return "";
    }

    if (!validateInputRef.current(initialValue.toString())) {
      return "";
    }

    return getFormatter()(initialValue);
  });

  const clear = useCallback(() => {
    setDisplayValue("");
    setRawInputValue("");
    onChange(undefined);
  }, [onChange]);

  useEffect(() => {
    if (initialValue === undefined) {
      return;
    }

    if (!validateInputRef.current(initialValue.toString())) {
      return;
    }

    const valid = validateValueRef.current(initialValue);
    onValidChange?.(valid);
    if (valid) {
      onChange(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      clear();
      return;
    }

    const isValidInput = validateInputRef.current(value);

    // prevent caret from jumping to the end
    const { selectionStart, selectionEnd } = e.target;
    requestAnimationFrame(() => {
      if (!inputRef.current) return;

      if (selectionStart !== null) {
        inputRef.current.selectionStart = isValidInput
          ? selectionStart
          : // prevents the caret from advancing 1 position when the input is invalid
            selectionStart - 1;
      }

      if (selectionEnd !== null) {
        inputRef.current.selectionEnd = isValidInput
          ? selectionEnd
          : // prevents the caret from advancing 1 position when the input is invalid
            selectionEnd - 1;
      }
    });

    if (!isValidInput) {
      return;
    }

    setRawInputValue(value);
    setDisplayValue(value);

    const decimalValue = parseFloat(value);
    const valid = validateValueRef.current(decimalValue);
    onValidChange?.(valid);

    if (valid) {
      onChange(decimalValue);
    }
  };

  return (
    <input
      ref={inputRef}
      value={displayValue}
      onChange={handleChange}
      onFocus={(e) => {
        setDisplayValue(rawInputValue);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        const value = e.target.value;

        if (!validateInputRef.current(value)) {
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
