import React, { useContext } from 'react';
import "./User.css";
import { Link, } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const User = ({ id, image, username, bio, handleFollow }) => {

    let {user, authTokens, logoutUser} = useContext(AuthContext);
    let isFollowing = false;

    if (user) {
        for (let i = 0; i < user.follows.length; i++) {
            if (user.follows[i]["id"] === id) {
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
                <div className="user__topRight">
                    {isFollowing ? (
                    <button id={id} className="user__topRightButtonFollow" onClick={handleFollow}>Follow</button>
                    ) : (
                    <button id={id} className="user__topRightButtonUnfollow" onClick={handleFollow}>Unfollow</button>
                    )}
                </div>
            </div>
            <div className="user__middle">
                <p>{bio}</p>
            </div>
        </div>
    );
}

export default User