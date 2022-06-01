import React from 'react';
import "./ProfileHeader.css";

const ProfileHeader = ({ user, userId, username, image, bio, follows, followed, handleFeed, handleFollow }) => {

    let isCurrentUser = false;
    let isFollowing = false;

    if (userId === user.id) {
        isCurrentUser = true;
    } else {
        for (let i = 0; i < user.follows.length; i++) {
            if (user.follows[i]["followee_id"] === userId) {
                isFollowing = true;
            }
        }
    }

    return (
        <div className="profileheader">
            <div className="profileheader__top">
                <div className="profileheader__topLeft">
                    <img className="profileheader__topLeftImage" src={ image } alt="" />
                    <h2 className="profileheader__topLeftName">{ username }</h2>
                </div>
                <div className="profileheader__topRight">
                    {isCurrentUser ? (
                        <button id={userId} className="profileheader__topRightButton">Edit Profile</button>
                    ) : null}
                    {!isCurrentUser && isFollowing ? (
                        <button id={userId} className="profileheader__topRightButtonUnfollow" onClick={handleFollow}>Unfollow</button>
                    ): null}
                    {!isCurrentUser && !isFollowing ? (
                    <button id={userId} className="profileheader__topRightButtonButton" onClick={handleFollow}>Follow</button>
                    ): null}
                </div>
            </div>
            <div className="profileheader__middle">
                <p className="profileheader__middleBio">
                    { bio }
                </p>
            </div>
            <div className="profileheader__bottom">
                <div className="profileheader__bottomOne" onClick={handleFeed}>
                    <p className="profileheader__bottomOneNumber">{follows} 
                    <span className="profileheader__bottomOneText">  Following</span></p>
                </div>
                <div className="profileheader__bottomTwo" onClick={handleFeed}>
                    <p className="profileheader__bottomTwoNumber">{followed} 
                    <span className="profileheader__bottomTwoText">  Followers</span></p>
                </div>
            </div>
            <div className="profileheader__toolbar">
                <div className="profileheader__toolbarItem" onClick={handleFeed} value="posts"> 
                    <p>Posts</p> 
                </div>
                <div className="profileheader__toolbarItem" onClick={handleFeed}>
                    <p>Likes</p>  
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader