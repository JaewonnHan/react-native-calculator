import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, useWindowDimensions, Text } from "react-native";
import Button, { ButtonTypes } from "./components/Button";
import { useState } from "react";

const Operators = {
  CLEAR: "C",
  MINUS: "-",
  PLUS: "+",
  EQUAL: "=",
};

export default function App() {
  const [result, setResult] = useState(0);
  const [formula, setFormula] = useState([]);

  const width = (useWindowDimensions().width - 5) / 4;
  const calculate = () => {
    let calculatedNumber = 0;
    let operator = "";

    formula.forEach((value) => {
      if ([Operators.MINUS, Operators.PLUS].includes(value)) {
        operator = value;
      } else {
        if (operator === Operators.PLUS) {
          calculatedNumber += value;
        } else if (operator === Operators.MINUS) {
          calculatedNumber -= value;
        } else {
          calculatedNumber = value;
        }
      }
    });
    setResult(calculatedNumber);
    setFormula([]);
  };
  const onPressNumber = (num) => {
    const last = formula.at(-1);
    if (isNaN(last)) {
      setResult(num);
      setFormula((prev) => [...prev, num]);
    } else {
      const newNumber = (last ?? 0) * 10 + num;
      setResult(newNumber);
      setFormula((prev) => {
        prev.pop();
        return [...prev, newNumber];
      });
    }
  };

  const onPressOperator = (operator) => {
    switch (operator) {
      case Operators.CLEAR:
        setResult(0);
        setFormula([]);
        break;
      case Operators.EQUAL:
        calculate();
        break;
      default: {
        const last = formula.at(-1);
        if ([Operators.PLUS, Operators.MINUS].includes(last)) {
          setFormula((prev) => {
            prev.pop();
            return [...prev, operator];
          });
        } else {
          setFormula((prev) => [...prev, operator]);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.resultContainer}>
        <Text style={styles.result}>{result.toLocaleString()}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.leftPad}>
          <View style={styles.number}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                title={num.toString()}
                onPress={() => onPressNumber(num)}
                buttonStyle={{ width, height: width, marginTop: 1 }}
              />
            ))}
          </View>
          <View style={styles.bottom}>
            <Button
              title="0"
              onPress={() => onPressNumber(0)}
              buttonStyle={{ width: width * 2, height: width }}
            />
            <Button
              title={Operators.EQUAL}
              onPress={() => {
                onPressOperator(Operators.EQUAL);
              }}
              buttonStyle={{ width, height: width }}
              buttonType={ButtonTypes.OPERATOR}
            />
          </View>
        </View>
        <View style={styles.operator}>
          <Button
            title={Operators.CLEAR}
            onPress={() => {
              onPressOperator(Operators.CLEAR);
            }}
            buttonStyle={{ width, height: width, marginBottom: 1 }}
            buttonType={ButtonTypes.OPERATOR}
          />
          <Button
            title={Operators.MINUS}
            onPress={() => {
              onPressOperator(Operators.MINUS);
            }}
            buttonStyle={{ width, height: width, marginBottom: 1 }}
            buttonType={ButtonTypes.OPERATOR}
          />
          <Button
            title={Operators.PLUS}
            onPress={() => {
              onPressOperator(Operators.PLUS);
            }}
            buttonStyle={{ width, height: width * 2, marginBottom: 1 }}
            buttonType={ButtonTypes.OPERATOR}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    alignItems: "stretch",
    justifyContent: "center",
  },
  resultContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  buttonContainer: {
    backgroundColor: "#000000",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  result: {
    color: "#ffffff",
    fontSize: 60,
    fontWeight: 700,
    paddingBottom: 30,
    paddingRight: 30,
  },
  number: {
    flexDirection: "row",
    flexWrap: "wrap-reverse",
    justifyContent: "space-evenly",
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  operator: {},
  leftPad: {
    width: "75%",
  },
});
