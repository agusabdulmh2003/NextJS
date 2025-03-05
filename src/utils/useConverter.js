import { useState, useEffect } from "react";

const FIXED_CALC = 32;

export default function useConverter(input, type) {
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!input || isNaN(input)) {
      setResult("Invalid input");
      return;
    }

    let output = 0;
    const numericInput = parseFloat(input);

    switch (type) {
      case "celcius":
        output = (numericInput * 9) / 5 + FIXED_CALC; // C to F
        break;
      case "fahrenheit":
        output = ((numericInput - FIXED_CALC) * 5) / 9; // F to C
        break;
      case "kelvin":
        output = numericInput + 273.15; // C to K
        break;
      case "kelvinToC":
        output = numericInput - 273.15; // K to C
        break;
      default:
        setResult("Invalid type");
        return;
    }

    setResult(output.toFixed(2));

    // Simpan ke localStorage
    saveToHistory(numericInput, type, output.toFixed(2));
  }, [input, type]);

  function saveToHistory(input, type, result) {
    try {
      const history = JSON.parse(localStorage.getItem("history")) || [];
      history.push({ input, type, result });
      localStorage.setItem("history", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving history:", error);
    }
  }

  return result;
}
