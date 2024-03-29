import { useState } from "react";
import { DecimalInput } from "./decimal-input/DecimalInput";
import { isValidPositiveDecimalInput } from "./decimal-input/model";

function App() {
  return (
    <>
      <Scenario
        title="Positive Decimals (precision=5,scale=2)"
        alternatives={[10, 1.001, 100.01]}
        validateInput={isValidPositiveDecimalInput}
        maxPrecision={5}
        maxScale={2}
      />
      <Scenario
        title="Decimals (precision=5,scale=2)"
        alternatives={[10, -20.4, -0.5, 100.01, -100.01, 1.001, 100000]}
        maxPrecision={5}
        maxScale={2}
      />
      <Scenario
        title="Integers"
        alternatives={[1, 2, 3, 1.1]}
        validateValue={(candidate) => Number.isInteger(candidate)}
      />
      <Scenario
        title="Zero or Greater"
        alternatives={[10, -20.4, 0, -0.5]}
        validateValue={(candidate) => candidate >= 0}
      />
      <Scenario
        title="Financial"
        alternatives={[10, -20.4, 0, -0.5]}
        format={(value) =>
          value < 0 ? `(${Math.abs(value)})` : value.toString()
        }
      />
    </>
  );
}

const Scenario = (props: {
  title: string;
  alternatives: number[];
  format?: (value: number) => string;
  validateValue?: (value: number) => boolean;
  validateInput?: (input: string) => boolean;
  maxPrecision?: number;
  maxScale?: number;
}) => {
  const [initialValue, setInitialValue] = useState<number>();
  const [value, setValue] = useState<number>();
  const [isValid, setIsValid] = useState<boolean>(true);

  return (
    <div
      style={{
        padding: 10,
        border: "1px solid black",
        margin: 10,
        borderColor: isValid ? "black" : "red",
      }}
    >
      <h3>{props.title}</h3>
      <DecimalInput
        key={initialValue}
        initialValue={initialValue}
        onChange={setValue}
        format={props.format}
        validateValue={props.validateValue}
        validateInput={props.validateInput}
        onValidChange={setIsValid}
        maxPrecision={props.maxPrecision}
        maxScale={props.maxScale}
      />
      <div style={{ padding: 10 }}>
        {props.alternatives.map((alternative, i) => (
          <ReplaceInitialValue
            key={i}
            value={alternative}
            onReplace={() => {
              setInitialValue(alternative);
            }}
          />
        ))}
        <Clear
          onClear={() => {
            setIsValid(true);
            setInitialValue(undefined);
            setValue(undefined);
          }}
        />
      </div>
      <blockquote>Value: {value ?? "?"}</blockquote>
    </div>
  );
};

const ReplaceInitialValue = (props: {
  value: number;
  onReplace: (value: number) => void;
}) => (
  <button
    style={{ margin: 5 }}
    onClick={() => {
      props.onReplace(props.value);
    }}
  >
    {props.value}
  </button>
);

const Clear = (props: { onClear: () => void }) => {
  return (
    <button
      style={{ margin: 5 }}
      onClick={() => {
        props.onClear();
      }}
    >
      Clear
    </button>
  );
};

export default App;
