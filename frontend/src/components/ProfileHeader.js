import React from 'react';
import "./ProfileHeader.css";

const ProfileHeader = ({ userId, username, image, bio, follows, followed, handleClick }) => {
  return (
    <div className="profileheader">
        <div className="profileheader__top">
            <div className="profileheader__topLeft">
                <img className="profileheader__topLeftImage" src={ image } alt="" />
                <h2 className="profileheader__topLeftName">{ username }</h2>
            </div>
            <div className="profileheader__topRight">
                <button className="profileheader__topRightFollow">Follow</button>
            </div>
        </div>
        <div className="profileheader__middle">
            <p className="profileheader__middleBio">
                { bio }
            </p>
        </div>
        <div className="profileheader__bottom">
            <div className="profileheader__bottomOne" onClick={handleClick}>
                <p className="profileheader__bottomOneNumber">{follows} 
                <span className="profileheader__bottomOneText">  Following</span></p>
            </div>
            <div className="profileheader__bottomTwo" onClick={handleClick}>
                <p className="profileheader__bottomTwoNumber">{followed} 
                <span className="profileheader__bottomTwoText">  Followers</span></p>
            </div>
        </div>
        <div className="profileheader__toolbar">
            <div className="profileheader__toolbarItem" onClick={handleClick} value="posts"> 
                <p>Posts</p> 
            </div>
            <div className="profileheader__toolbarItem" onClick={handleClick}>
                <p>Likes</p>  
            </div>
        </div>
    </div>
  )
}

export default ProfileHeader