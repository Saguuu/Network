import React from 'react';
import "./Home.css";
import Nav from "./Nav.js";

const Home = () => {
  return (
    <div className="home">
        <div className="home__container">
            <Nav />
            { /* feed component */ }
        </div>
    </div>
  );
}

export default Home