import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./index.css"
import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Result  from "./pages/Result";

const App = () => {
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={setUserId} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard userId={userId} />} />
        <Route path="/result" element={<Result userId={userId} />} />
      </Routes>
    </Router>
  );
};

export default App;
