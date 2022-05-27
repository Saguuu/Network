import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import "./Profile.css";
import Nav from './Nav';
import axios from "../axios";
import AuthContext from '../context/AuthContext';
import ProfileFeed from './ProfileFeed';

const Profile = () => {

    const [profileUser, setProfileUser] = useState([]);
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
        fetchUserData();

    }, []);

    return (
        <div className="profile">
            <div className="profile__container">
                <Nav />
                <ProfileFeed 
                posts={ profileUser.user_posts?.map(post => (post)).reverse() }
                /> 
            </div>
        </div>
    );
}

export default Profile