import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/process"; // Replace with your backend URL

const options = [
  { value: "alphabets", label: "Alphabets" },
  { value: "numbers", label: "Numbers" },
  { value: "highestAlphabet", label: "Highest Alphabet" },
];

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    document.title = "22BCS15834";
  }, []);

  const validateJson = (text) => {
    try {
      const parsed = JSON.parse(text);
      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error("Invalid JSON format: Must contain 'data' array.");
      }
      return parsed;
    } catch (err) {
      return null;
    }
  };

  const handleSubmit = async () => {
    const parsedJson = validateJson(jsonInput);
    if (!parsedJson) {
      setError("Invalid JSON format. Please enter a valid JSON.");
      setResponse(null);
      return;
    }

    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedJson),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Error fetching data from server.");
    }
  };

  const handleFilterChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedFilters(selectedOptions);
  };

  const filterResponse = () => {
    if (!response) return null;

    let filteredData = { ...response };

    if (!selectedFilters.includes("alphabets")) {
      delete filteredData.alphabets;
    }
    if (!selectedFilters.includes("numbers")) {
      delete filteredData.numbers;
    }
    if (!selectedFilters.includes("highestAlphabet")) {
      delete filteredData.highestAlphabet;
    }

    return filteredData;
  };

  return (
    <div className="container">
      <div className="card">
        <h1>JSON Processor</h1>

        <textarea
          className="input"
          rows="4"
          placeholder='Enter JSON (e.g. { "data": ["A", "C", "z"] })'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        ></textarea>

        {error && <p className="error">{error}</p>}

        <button className="button" onClick={handleSubmit}>
          Submit
        </button>

        {response && (
          <div className="dropdown">
            <h2>Select Data to Display:</h2>
            <select multiple onChange={handleFilterChange}>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedFilters.length > 0 && response && (
          <div className="output">
            <h3>Filtered Response:</h3>
            <pre>{JSON.stringify(filterResponse(), null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
