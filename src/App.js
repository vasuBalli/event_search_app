import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [results, setResults] = useState([]);
  const [searchTime, setSearchTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!search || !startTime || !endTime) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    setResults([]);
    setSearchTime(null);

    try {
      const response = await axios.post("http://localhost:8000/api/search/", {
        search,
        start_time: startTime,
        end_time: endTime,
      });
      setResults(response.data.results);
      setSearchTime(response.data.search_time);
    } catch (err) {
      console.error("Error searching:", err);
      alert("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🔍 Event Log Search</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search String (e.g. 159.62.125.136 or dstaddr=30.55.177.194)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
          🔍 Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {searchTime !== null && (
        <p><strong>Search Time:</strong> {searchTime} seconds</p>
      )}

      <div>
        {results.length === 0 && searchTime !== null && !loading && <p>No matching events found.</p>}
        {results.map((res, index) => (
          <div key={index} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <p><strong>Event:</strong> {res.event}</p>
            <p><strong>File:</strong> {res.file}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
