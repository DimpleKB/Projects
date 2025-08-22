import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Home = () =>
{
    
    return (
        <div className="container">
            <h1>Welcome to Nutrient deficieny app</h1>
            <Link to="/login">
            <button className="submit" >Get Started</button>
            </Link>
        </div>
    )
}

export default Home;