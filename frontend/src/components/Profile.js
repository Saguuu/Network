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

        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens.access)
        }

        const followUser = async () => {
            await axios.post("/api/follow-follow/", {
                "follower": user.id,
                "followee": e.target.id
            }, {headers: headers})
            .then(res => {
                const fetchProfileUserData = async () => {
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

        const unfollowUser = async () => {
            await axios.post("/api/follow-unfollow/", {
                "follower": user.id,
                "followee": e.target.id
            }, {headers: headers})
            .then(res => {
                const fetchProfileUserData = async () => {
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

    const fetchProfileUserPosts = async () => {
        await axios.get(`/api/user-posts/${userId}/`)
        .then(res => {
            setTimeout(() => {
                setFeedLoading(false);
                setProfileUserPosts(res.data);
            }, 1000);                
        })
        .catch(e => {
            console.log(e.response);
        });
    }

    const fetchProfileUserLikes = async () => {
        await axios.get(`/api/user-likes/${userId}/`)
        .then(res => {
            setTimeout(() => {
                setFeedLoading(false);
                setProfileLikes(res.data);
            }, 1000);
        })
        .catch(e => {
            console.log(e.response);
        });
    }

    const fetchProfileUserFollowing = async () => {
        await axios.get(`/api/following-list/${userId}/`)
        .then(res => {
            setTimeout(() => {
                setFeedLoading(false);
                setProfileFollowing(res.data);
            }, 1000);
        })
        .catch(e => {
            console.log(e.response);
        });
    }

    const fetchProfileUserFollowed = async () => {
        await axios.get(`/api/followed-list/${userId}/`)
        .then(res => {
            setTimeout(() => {
                setFeedLoading(false);
                setProfileFollowed(res.data);
            }, 1000);
        })
        .catch(e => {
            console.log(e.response);
        });
    }

    useEffect(() => {

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

        const fetchProfileUserData = async () => {
            await axios.get(`/api/user-single/${userId}/`)
            .then(res => {
                setTimeout(() => {
                    setProfileUser(res.data);
                    setHeaderLoading(false);
                    setFeedLoading(false);
                    setProfileUserPosts(res.data.user_posts);
                }, 1000);                
            })
            .catch(e => {
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
                    posts={ profileUserPosts.map(post => (post)).reverse() }
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
