import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./Profile.css";
import Nav from './Nav';
import axios from "../axios";
import AuthContext from '../context/AuthContext';
import ProfileFeed from './ProfileFeed';
import ProfileHeader from './ProfileHeader';
import UserFeedFollowing from './UserFeedFollowing';
import UserFeedFollowed from './UserFeedFollowed';

const Profile = () => {

    // Initialize state
    const navigate = useNavigate();
    const [profileUserPosts, setProfileUserPosts] = useState([]);
    const [profileUser, setProfileUser] = useState([]);
    const [profileLikes, setProfileLikes] = useState([]);
    const [profileFollowed, setProfileFollowed] = useState([]);
    const [profileFollowing, setProfileFollowing] = useState([]);
    const [feedLoading, setFeedLoading] = useState(true);
    const [headerLoading, setHeaderLoading] = useState(true);
    const [currentFeed, setCurrentFeed] = useState({
        posts: true,
        likes: false,
        following: false,
        followed: false
    });
    const { userId } = useParams();
    let {user, authTokens, fetchUserData} = useContext(AuthContext);

    const handleFeed = (e) => {

        e.preventDefault();

        // Handle current feed and loading state
        if (e.target.textContent.toLowerCase() === "posts") {

            if (!currentFeed.posts) {
                setProfileUserPosts([]);
                setFeedLoading(true);
                setCurrentFeed({
                    posts: true,
                    likes: false,
                    following: false,
                    followed: false
                })
            fetchProfileUserPosts();
            }
        } else if (e.target.textContent.toLowerCase() === "likes") {

            if (!currentFeed.likes) {
                setProfileLikes([]);
                setFeedLoading(true);
                setCurrentFeed({
                    posts: false,
                    likes: true,
                    following: false,
                    followed: false
                })
                fetchProfileUserLikes();
            }
        } else if (e.target.textContent.toLowerCase().trim() === "following") {

            if (!currentFeed.following) {
                setProfileFollowing([]);
                setFeedLoading(true);
                setCurrentFeed({
                    posts: false,
                    likes: false,
                    following: true,
                    followed: false
                })
                fetchProfileUserFollowing();
            }
        } else {

            if (!currentFeed.followed) {
                setProfileFollowed([]);
                setFeedLoading(true);
                setCurrentFeed({
                    posts: false,
                    likes: false,
                    following: false,
                    followed: true
                })
                fetchProfileUserFollowed();
            }
        }
    }

    const handleFollow = (e) => {

        e.preventDefault();

        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens?.access)
        }

        const followUser = async () => {
            await axios.post("/api/follow-follow/", {
                "follower": user?.id,
                "followee": e.target.id
            }, {headers: headers})
            .then(() => {

                // Grab new profileuser and user data to update state
                const fetchProfileUserData = async () => {
                    await axios.get(`/api/user-single/${profileUser.id}/`)
                    .then((res) => {
                        setProfileUser(res.data);
                    })
                    .catch((e) => {
                        console.log(e.response);
                    });
                }
                fetchProfileUserFollowed();
                fetchProfileUserData();
                fetchUserData();
            })
            .catch((e) => {
                console.log(e.response);
            });
        }

        const unfollowUser = async () => {
            await axios.post("/api/follow-unfollow/", {
                "follower": user?.id,
                "followee": e.target.id
            }, {headers: headers})
            .then(() => {

                // Grab new profileuser and user data to update state
                const fetchProfileUserData = async () => {
                    await axios.get(`/api/user-single/${profileUser.id}/`)
                    .then((res) => {
                        setProfileUser(res.data);
                    })
                    .catch((e) => {
                        console.log(e.response);
                    });
                }
                fetchProfileUserFollowed();
                fetchProfileUserData();
                fetchUserData();
            })
            .catch((e) => {
                console.log(e.response);
            });
        }

        if (e.target.textContent === "Follow") {
            followUser();
        } else {
            unfollowUser();
        }
    }

    // Helper functions for handling profile navigation actions and state updating
    const fetchProfileUserPosts = async () => {
        await axios.get(`/api/user-posts/${userId}/`)
        .then((res) => {
            setTimeout(() => {
                setFeedLoading(false);
                setProfileUserPosts(res.data);
            }, 1000);                
        })
        .catch((e) => {
            console.log(e.response);
        });
    }

    const fetchProfileUserLikes = async () => {
        await axios.get(`/api/user-likes/${userId}/`)
        .then((res) => {
            setTimeout(() => {
                setFeedLoading(false);
                setProfileLikes(res.data);
            }, 1000);
        })
        .catch((e) => {
            console.log(e.response);
        });
    }

    const fetchProfileUserFollowing = async () => {
        await axios.get(`/api/following-list/${userId}/`)
        .then((res) => {
            setTimeout(() => {
                setFeedLoading(false);
                setProfileFollowing(res.data);
            }, 1000);
        })
        .catch((e) => {
            console.log(e.response);
        });
    }

    const fetchProfileUserFollowed = async () => {
        await axios.get(`/api/followed-list/${userId}/`)
        .then((res) => {
            setTimeout(() => {
                setFeedLoading(false);
                setProfileFollowed(res.data);
            }, 1000);
        })
        .catch((e) => {
            console.log(e.response);
        });
    }

    useEffect(() => {

        // Navigate to top of page on load, set new state
        window.scrollTo(0, 0);
        setFeedLoading(true);
        setHeaderLoading(true);        
        setProfileUserPosts([]);
        setCurrentFeed(() => ({
            posts: true,
            likes: false,
            following: false,
            followed: false
        }));

        // Fetch data for current profile
        const fetchProfileUserData = async () => {
            await axios.get(`/api/user-single/${userId}/`)
            .then((res) => {
                if (res.data === "User DNE") {
                    navigate("/");
                    return
                }
                setProfileUser(res.data);
                setTimeout(() => {
                    setHeaderLoading(false);
                }, 1000);  
                fetchProfileUserPosts();              
            })
            .catch((e) => {
                console.log(e.response);
            });
        }
        fetchProfileUserData();
    }, [userId]);

    return (
        <div className="profile">
            <div className="profile__container">
                <Nav
                location={ "profile" } 
                userId={ userId }
                />
                <div className="profile__content">
                    <ProfileHeader 
                    userId={ profileUser.id }
                    username={ profileUser.username }
                    image={ profileUser.image }
                    bio={ profileUser.bio }
                    follows={ profileUser.user_follows?.length }
                    followed={ profileUser.user_followed?.length }
                    headerLoading={ headerLoading }
                    currentFeed={ currentFeed }
                    handleFeed={ handleFeed }
                    handleFollow={ handleFollow }
                    setProfileUser={ setProfileUser }
                    />
                    {currentFeed.posts ? (
                    <ProfileFeed 
                    posts={ profileUserPosts.map(post => (post)) }
                    setProfileUserPosts={ setProfileUserPosts }
                    feedLoading={ feedLoading }
                    />
                    ): null}
                    {currentFeed.likes ? (
                    <ProfileFeed 
                    posts={ profileLikes?.map(post => (post)) }
                    setProfileLikes={ setProfileLikes }
                    feedLoading={ feedLoading }
                    />
                    ): null}
                    {currentFeed.following ? (
                    <UserFeedFollowing 
                    users={ profileFollowing?.map(user => (user)).reverse() }
                    handleFollow={ handleFollow }
                    feedLoading={ feedLoading }
                    />
                    ): null}
                    {currentFeed.followed ? (
                    <UserFeedFollowed 
                    users={ profileFollowed?.map(user => (user)).reverse() }
                    handleFollow={ handleFollow }
                    feedLoading={ feedLoading }
                    />
                    ): null}
                </div>
            </div>
        </div>
    );
}

export default Profile
