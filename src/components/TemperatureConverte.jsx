import { useState } from "react";
import useConverter from "../utils/useConverter";
import { Input, Select, Button, Card } from "@fluentui/react-components";

export default function TemperatureConverter() {
  const [input, setInput] = useState("");
  const [temperatureType, setTemperatureType] = useState("celcius");
  const result = useConverter(input, temperatureType);

  return (
    <Card style={{ width: 400, padding: 20 }}>
      <h2>Temperature Converter</h2>
      
      <Input
        type="number"
        placeholder="Enter temperature"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Select onChange={(e) => setTemperatureType(e.target.value)}>
        <option value="celcius">Celsius to Fahrenheit</option>
        <option value="fahrenheit">Fahrenheit to Celsius</option>
        <option value="kelvin">Celsius to Kelvin</option>
        <option value="kelvinToC">Kelvin to Celsius</option>
      </Select>

      <Button appearance="primary">Convert</Button>

      <p>Result: {result}</p>
    </Card>
  );
}
