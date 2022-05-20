import React from 'react';
import "./Home.css";
import HomeFeed from './HomeFeed';
import Nav from './Nav';

const Home = () => {
    return (
        <div className="home">
            <div className="home__container">
                <Nav />
                <HomeFeed />
            </div>
        </div>
    );
}

export default Home