import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import "./Profile.css";
import Nav from './Nav';
import axios from "../axios";
import AuthContext from '../context/AuthContext';
import ProfileFeed from './ProfileFeed';
import ProfileHeader from './ProfileHeader';

const Profile = () => {

    const [profileUser, setProfileUser] = useState([]);
    const [profileLikes, setProfileLikes] = useState([]);
    const { userId } = useParams();
    let {user, authTokens, logoutUser} = useContext(AuthContext);

    useEffect(() => {

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

    }, []);

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
                    />
                    <ProfileFeed 
                    posts={ profileUser.user_posts?.map(post => (post)).reverse() }
                    />
                    <ProfileFeed 
                    posts={ profileLikes?.map(post => (post)).reverse() }
                    />
                </div>
            </div>
        </div>
    );
}

export default Profile