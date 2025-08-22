import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [symptomInput, setSymptomInput] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [results, setResults] = useState([]);   // ❌ not needed here if you're showing results on /result
  const navigate = useNavigate();

  const handleAddSymptom = () => {
    const cleanSymptom = symptomInput.trim().toLowerCase();
    if (cleanSymptom && !selectedSymptoms.includes(cleanSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, cleanSymptom]);
      setSymptomInput("");
    }
  };

  const handleDeleteSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  const handleCheck = async () => {
    if (selectedSymptoms.length === 0) {
      alert("Please enter at least one symptom!");
      return;
    }

    const res = await fetch("http://localhost:5000/check-symptoms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: selectedSymptoms }),
    });

    const data = await res.json();

    // ✅ Send results to /result page
    navigate("/result", { state: { results: data.deficiencies } });

    // ✅ Reset symptoms for next time
    setSelectedSymptoms([]);
  };

  return (
    <div className="container" style={{paddingLeft:"50px",paddingRight:"50px",paddingTop:"50px",paddingBottom:"50px"}}>
      <h2 style={{marginBottom:"50px"}}>Symptom Checker</h2>
      <input
        type="text"
        value={symptomInput}
        onChange={(e) => setSymptomInput(e.target.value)}
        placeholder="Enter a symptom (e.g. fatigue)"
        style={{marginBottom:"30px",width:"200px"}}
      />
      <button onClick={handleAddSymptom}>Add Symptom</button>

      <h3 style={{marginBottom:"20px"}}>Selected Symptoms:</h3>
      <ul>
        {selectedSymptoms.map((s, i) => (
          <li key={i}>
            {s}{" "}
            <button
              className="remove"
              onClick={() => handleDeleteSymptom(s)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button style={{marginBottom:"30px",marginTop:"30px"}} className="submit" onClick={handleCheck}>
        Check Deficiency
      </button>
    </div>
  );
}

export default Dashboard;
