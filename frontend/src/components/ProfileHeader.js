import React, { useContext, useState } from 'react';
import "./ProfileHeader.css";
import AuthContext from '../context/AuthContext';
import Modal from './Modal';
import axios from "../axios";
import Skeleton from '@mui/material/Skeleton';

const ProfileHeader = ({ userId, username, image, bio, follows, followed, handleFeed, handleFollow, setProfileUser, headerLoading }) => {

    let {user, authTokens, fetchUserData} = useContext(AuthContext);
    let isFollowing = false;
    let isCurrentUser = false;

    if (user) {
        if (userId === user.id) {
            isCurrentUser = true;
        }
        for (let i = 0; i < user.follows.length; i++) {
            if (user.follows[i]["followee_id"] === userId) {
                isFollowing = true;
            }
        }
    }

    const [modalIsOpen, setModalIsOpen] = useState(false);

    let sendChanges = async (e) => {

        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens.access)
        }

        await axios.post("/api/edit-profile/", {
            "id": user.id,
            "bio": e.target.parentNode.parentNode.childNodes[0].childNodes[1].value,
            "image": e.target.parentNode.parentNode.childNodes[1].childNodes[1].value
        }, {headers: headers})
        .then(res => {
            let fetchProfileUserData = async () => {
                await axios.get(`/api/user-single/${userId}/`)
                .then(res => {
                    setProfileUser(res.data);
                })
                .catch(e => {
                    console.log(e.response);
                });
            }
            fetchProfileUserData();
            fetchUserData();
            setModalIsOpen(false);
        })
        .catch(e => {
            console.log(e.response);
        });
    }

    return (
        <div className="profileheader">
            <Modal 
            open={ modalIsOpen } 
            onClose={() => setModalIsOpen(false)}
            bio={ bio }
            image={ image }
            sendChanges={ sendChanges }
            >
            </Modal>
            {headerLoading ? (
            <>
            <Skeleton className="load__circle" variant="circular" width={ 150 } height={ 150 } animation={ false }/>
            <Skeleton className="load__rectangle" variant="rectangular" width={ 400 } height={ 30 } animation={ false }/>
            <Skeleton className="load__rectangle" variant="rectangular" width={ 400 } height={ 30 } animation={ false }/>
            </>
            ) :
            <>
            <div className="profileheader__top">
                <div className="profileheader__topLeft">
                    <img className="profileheader__topLeftImage" src={ image } alt="" />
                    <h2 className="profileheader__topLeftName">{ username }</h2>
                </div>
                <div className="profileheader__topRight">
                    {isCurrentUser ? (
                        <button id={userId} className="profileheader__topRightButton" onClick={() => setModalIsOpen(true)}>Edit Profile</button>
                    ) : null}
                    {!isCurrentUser && isFollowing ? (
                        <button id={userId} className="profileheader__topRightButtonUnfollow" onClick={handleFollow}>Unfollow</button>
                    ): null}
                    {!isCurrentUser && !isFollowing ? (
                        <button id={userId} className="profileheader__topRightButton" onClick={handleFollow}>Follow</button>
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
            </> 
            }
        </div>
    );
}

export default ProfileHeader