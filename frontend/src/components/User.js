import React, { useContext } from 'react';
import "./User.css";
import { Link, } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const User = ({ id, image, username, bio, handleFollow }) => {

    // Initialize state
    let {user} = useContext(AuthContext);
    let isFollowing = false;
    let isCurrentUser = false;

    // Check if is current user or if current user follows this user
    if (user) {
        if (id === user.id) {
            isCurrentUser = true;
        }
        for (let i = 0; i < user.follows.length; i++) {
            if (user.follows[i]["followee_id"] === id) {
                isFollowing = true;
            }
        }
    }

    return (
        <div className="user">
            <div className="user__top">
                <Link to={`/user/${id}`} style={{ textDecoration: 'none' }}>
                <div className="user__topLeft">
                    <img className="user__topLeftImage" src={image} alt="" />
                    <p className="user__topLeftName">{username}</p>
                </div>
                </Link>
                {!isCurrentUser ? (
                <div className="user__topRight">
                    {!isFollowing ? (
                    <button id={id} className="user__topRightButtonFollow" onClick={handleFollow}>Follow</button>
                    ) : (
                    <button id={id} className="user__topRightButtonUnfollow" onClick={handleFollow}>Unfollow</button>
                    )}
                </div>
                ): null}
            </div>
            <div className="user__middle">
                <p>{bio}</p>
            </div>
        </div>
    );
}

export default User