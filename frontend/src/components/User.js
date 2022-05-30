import React from 'react';
import "./User.css";
import { Link, } from 'react-router-dom';

const User = ({ id, image, username, bio, handleFollow }) => {
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
                    <button  id={id} className="user__topRightFollow" onClick={handleFollow}>Follow</button>
                </div>
            </div>
            <div className="user__middle">
                <p>{bio}</p>
            </div>
        </div>
    );
}

export default User