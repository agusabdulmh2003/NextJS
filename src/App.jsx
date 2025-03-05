import {
  FluentProvider,
  Caption1,
  Card,
  CardHeader,
  Body1,
  webLightTheme,
  webDarkTheme,
  CardFooter,
  Button,
  Select,
  Input,
} from "@fluentui/react-components";
import { ConvertRangeRegular, WeatherRegular, SunRegular, MoonRegular } from "@fluentui/react-icons";
import "./App.css";
import useConverter from "./utils/useConverter";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const option = [
  { id: 1, label: "Celsius to Fahrenheit", value: "celcius" },
  { id: 2, label: "Fahrenheit to Celsius", value: "fahrenheit" },
  { id: 3, label: "Celsius to Kelvin", value: "kelvin" },
  { id: 4, label: "Kelvin to Celsius", value: "kelvinToC" },
];

export default function App() {
  const [temperatureType, setTemperatureType] = useState("celcius");
  const [temperatureInput, setTemperatureInput] = useState(0);
  const [temperature, handleTemperature] = useConverter(temperatureInput, temperatureType);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState("light");
  const [city, setCity] = useState("");
  const [weatherTemp, setWeatherTemp] = useState(null);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem("history")) || []);
    setTheme(localStorage.getItem("theme") || "light");
  }, []);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  function getWeather() {
    if (!city) return;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=37825815069fffd31a515d404597ee88&units=metric`)
      .then((res) => res.json())
      .then((data) => setWeatherTemp(data.main?.temp ?? "Not found"))
      .catch(() => setWeatherTemp("Not found"));
  }

  function handleConvert() {
    const result = handleTemperature();
    const newHistory = [...history, { input: temperatureInput, type: temperatureType, result }];
    setHistory(newHistory);
    localStorage.setItem("history", JSON.stringify(newHistory));
  }

  return (
    <FluentProvider theme={theme === "light" ? webLightTheme : webDarkTheme}>
      <Card style={{ width: 400 }}>
        <CardHeader
          header={<Body1><b>Temperature Converter</b></Body1>}
          description={<Caption1>Convert between Celsius, Fahrenheit, and Kelvin</Caption1>}
        />

        <Button icon={theme === "light" ? <MoonRegular /> : <SunRegular />} onClick={toggleTheme}>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>

        <Select value={temperatureType} onChange={({ target }) => setTemperatureType(target.value)}>
          {option.map((selection) => (
            <option key={selection.id} value={selection.value}>
              {selection.label}
            </option>
          ))}
        </Select>

        <Input
          placeholder="Input suhu"
          type="number"
          value={temperatureInput}
          onChange={(e) => setTemperatureInput(e.target.value)}
        />

        <CardFooter>
          <Button icon={<ConvertRangeRegular />} onClick={handleConvert}>
            Convert
          </Button>
          <Input value={`${temperature}°`} disabled className="input__result" />
        </CardFooter>

        <h3>Weather API</h3>
        <Input placeholder="Enter City" onChange={(e) => setCity(e.target.value)} />
        <Button icon={<WeatherRegular />} onClick={getWeather}>Get Temperature</Button>
        {weatherTemp !== null && <p>Temperature in {city}: {weatherTemp}°C</p>}

        <h3>Conversion History</h3>
        <ul>
          {history.slice(-5).map((entry, index) => (
            <li key={index}>{entry.input}° {entry.type} → {entry.result}°</li>
          ))}
        </ul>

        <h3>Temperature Chart</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={history.map((h, i) => ({ index: i, temp: parseFloat(h.result) }))}>
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </FluentProvider>
  );
}