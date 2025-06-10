import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({ first_name: "", last_name: "" });
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/entries");
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch entries", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/entries", formData);
      setFormData({ first_name: "", last_name: "" });
      fetchEntries();
    } catch (err) {
      console.error("Error submitting entry:", err);
    }
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h2>Name Entry Form</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Entries</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.id || index}>
              <td>{index + 1}</td>
              <td>{entry.first_name}</td>
              <td>{entry.last_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
