import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
    const [currentFeed, setCurrentFeed] = useState({
        posts: true,
        likes: false,
        following: false,
        followed: false
    });
    const { userId } = useParams();
    let {user, authTokens, logoutUser, fetchUserData} = useContext(AuthContext);
    const location = useLocation();
    const data = location.state;

    let handleFeed = (e) => {

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

    let handleFollow = (e) => {

        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens.access)
        }

        let followUser = async () => {
            await axios.post("/api/follow-follow/", {
                "follower": user.id,
                "followee": e.target.id
            }, {headers: headers})
            .then(res => {
                console.log(res);
                let fetchProfileUserData = async () => {
                    await axios.get(`/api/user-single/${profileUser.id}/`)
                    .then(res => {
                        setProfileUser(res.data);
                    })
                    .catch(e => {
                        console.log(e.response);
                    });
                }
                fetchProfileUserData();
                fetchUserData();
            })
            .catch(e => {
                console.log(e.response);
            });
        }

        let unfollowUser = async () => {
            await axios.post("/api/follow-unfollow/", {
                "follower": user.id,
                "followee": e.target.id
            }, {headers: headers})
            .then(res => {
                console.log(res);
                let fetchProfileUserData = async () => {
                    await axios.get(`/api/user-single/${profileUser.id}/`)
                    .then(res => {
                        setProfileUser(res.data);
                    })
                    .catch(e => {
                        console.log(e.response);
                    });
                }
                fetchProfileUserData();
                fetchUserData();
            })
            .catch(e => {
                console.log(e.response);
            });
        }

        if (e.target.textContent === "Follow") {
            followUser();
        } else {
            unfollowUser();
        }
    }

    useEffect(() => {

        if (data?.fromPost) {
            setCurrentFeed((currentFeed) => ({
                ...currentFeed,
                posts: true
            }));
            data.fromPost = false;
        } else {
            setCurrentFeed((currentFeed) => ({
                ...currentFeed
            }));
        }
        
        let fetchProfileUserData = async () => {
            await axios.get(`/api/user-single/${userId}/`)
            .then(res => {
                setProfileUser(res.data);
            })
            .catch(e => {
                console.log(e.response);
            });
        }

        let fetchProfileUserLikes = async () => {
            await axios.get(`/api/user-likes/${userId}/`)
            .then(res => {
                setProfileLikes(res.data);
            })
            .catch(e => {
                console.log(e.response);
            });
        }

        fetchProfileUserData();
        fetchProfileUserLikes();

    }, [userId, user]);

    return (
        <div className="profile">
            <div className="profile__container">
                <Nav />
                <div className="profile__content">
                    <ProfileHeader 
                    userId={ profileUser.id }
                    username={ profileUser.username }
                    image={ profileUser.image }
                    bio={ profileUser.bio }
                    follows={ profileUser.user_follows?.length }
                    followed={ profileUser.user_followed?.length }
                    handleFeed={ handleFeed }
                    handleFollow={ handleFollow }
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
                    users={ profileUser.user_follows?.map(user => (user)).reverse() }
                    handleFollow={ handleFollow }
                    />
                    ): null}
                    {currentFeed.followed ? (
                    <UserFeedFollowed 
                    users={ profileUser.user_followed?.map(user => (user)).reverse() }
                    handleFollow={ handleFollow }
                    />
                    ): null}
                </div>
            </div>
        </div>
    );
}

export default Profile