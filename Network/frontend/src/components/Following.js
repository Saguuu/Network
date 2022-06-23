import React from 'react';
import FollowFeed from './FollowFeed';
import "./Following.css";
import Nav from './Nav';

const Following = () => {
    return (
        <div className="following">
            <div className="following__container">
                <Nav 
                location={ "following" }
                />
                <FollowFeed />
            </div>
        </div>
    );
}

export default Following