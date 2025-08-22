import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];

  const handleReEnter = () => {
    navigate("/dashboard"); // ✅ go back to dashboard to re-enter
  };

  return (
    <div className="container">
      <h3>Results:</h3>
      {results.length === 0 ? (
        <p>No results found</p>
      ) : (
        results.map((def) => (
          <div key={def.id} className="card">
            <h4>{def.name}</h4>
            <p>{def.description}</p>
            <strong>Recommended Foods:</strong>
            <ul>
              {def.foods.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        ))
      )}
      <button className="submit" onClick={handleReEnter} style={{ marginTop: "15px" }}>
        🔄 Re-enter Symptoms
      </button>
    </div>
  );
}

export default Result;
