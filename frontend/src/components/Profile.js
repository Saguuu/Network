import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import "./Profile.css";
import Nav from './Nav';
import axios from "../axios";
import AuthContext from '../context/AuthContext';

const Profile = () => {

    const [profileUser, setProfileUser] = useState([]);
    const { userId } = useParams();
    let {user, authTokens, logoutUser} = useContext(AuthContext);

    useEffect(() => {

        async function fetchUserData() {
            await axios.get(`/api/user-single/${userId}/`)
            .then(res => {
                setProfileUser(currentState => ({
                    ...currentState,
                    id: res.data.id,
                    username: res.data.username,
                    image: res.data.image,
                    bio: res.data.bio,
                    posts: res.data.user_posts,
                    follows: res.data.user_follows,
                    followed: res.data.user_followed,
                    likes: res.data.user_likes,
                    comments: res.data.user_comments
                }));
            })
            .catch(e => {
                console.log(e.response);
            });
        }
        fetchUserData();

    }, []);

    return (
        <div className="profile">
            <div className="profile__container">
                <Nav />
                {profileUser.username}
            </div>
        </div>
    );
}

export default Profile