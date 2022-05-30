import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import "./Profile.css";
import Nav from './Nav';
import axios from "../axios";
import AuthContext from '../context/AuthContext';
import ProfileFeed from './ProfileFeed';
import ProfileHeader from './ProfileHeader';
import UserFeedFollowing from './UserFeedFollowing';
import UserFeedFollowed from './UserFeedFollowed';

const Profile = () => {

    const [profileUser, setProfileUser] = useState([]);
    const [profileLikes, setProfileLikes] = useState([]);
    const [currentFeed, setCurrentFeed] = useState([]);
    const { userId } = useParams();
    let {user, authTokens, logoutUser} = useContext(AuthContext);

    let handleClick = (e) => {

        e.preventDefault();

        if (e.target.textContent.toLowerCase() === "posts") {
            setCurrentFeed({
                posts: true,
                likes: false,
                following: false,
                followed: false
            })
        } else if (e.target.textContent.toLowerCase() === "likes") {
            setCurrentFeed({
                posts: false,
                likes: true,
                following: false,
                followed: false
            })
        } else if (e.target.textContent.toLowerCase().trim() === "following") {
            setCurrentFeed({
                posts: false,
                likes: false,
                following: true,
                followed: false
            })
        } else {
            setCurrentFeed({
                posts: false,
                likes: false,
                following: false,
                followed: true
            })
        }

        console.log(e.target.textContent.toLowerCase());
    }

    useEffect(() => {

        setCurrentFeed({
            posts: true,
            likes: false,
            following: false,
            followed: false
        });

        async function fetchUserData() {
            await axios.get(`/api/user-single/${userId}/`)
            .then(res => {
                setProfileUser(res.data);
            })
            .catch(e => {
                console.log(e.response);
            });
        }

        async function fetchUserLikes() {
            await axios.get(`/api/user-likes/${userId}/`)
            .then(res => {
                setProfileLikes(res.data);
            })
            .catch(e => {
                console.log(e.response);
            });
        }

        fetchUserData();
        fetchUserLikes();

    }, [userId]);

    return (
        <div className="profile">
            <div className="profile__container">
                <Nav />
                <div className="profile__content">
                    <ProfileHeader 
                    userId={ profileUser.id}
                    username={ profileUser.username}
                    image={ profileUser.image}
                    bio={ profileUser.bio}
                    follows={ profileUser.user_follows?.length}
                    followed={ profileUser.user_followed?.length}
                    handleClick={handleClick}
                    />
                    {currentFeed.posts ? (
                    <ProfileFeed 
                    posts={ profileUser.user_posts?.map(post => (post)).reverse() }
                    />
                    ): null}
                    {currentFeed.likes ? (
                    <ProfileFeed 
                    posts={ profileLikes?.map(post => (post)).reverse() }
                    />
                    ): null}
                    {currentFeed.following ? (
                    <UserFeedFollowing 
                    users={profileUser.user_follows?.map(user => (user))}
                    />
                    ): null}
                    {currentFeed.followed ? (
                    <UserFeedFollowed 
                    users={profileUser.user_followed?.map(user => (user))}
                    />
                    ): null}
                </div>
            </div>
        </div>
    );
}

export default Profile