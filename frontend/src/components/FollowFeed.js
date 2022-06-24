import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import "./FollowFeed.css";
import axios from "../axios";
import Post from './Post';
import AuthContext from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

const FollowFeed = () => {

    // Initialize state
    const [posts, setPosts] = useState([]);
    let {user, authTokens, logoutUser} = useContext(AuthContext);
    const [feedLoading, setFeedLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        
        // Check if user exists
        if(!user) {
            navigate("/");
        } else {
            // Retrieve posts by following from backend
            let fetchPosts = async () => {
                await axios.get(`/api/post-following/${user.id}/`, {
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authTokens.access)
                    }
                })
                .then((res) => {
                    setTimeout(() => {
                        setPosts(res.data);
                        setFeedLoading(false);
                    }, 1000);
                })
                .catch((e) => {
                    console.log(e.response);
                    logoutUser();
                });
            }
            fetchPosts();
        }
    }, [user])

    return (
        <div className="followfeed">
            {feedLoading ? (
            <div className="progress">
                <CircularProgress />
            </div>
            ): null}
            {posts.map((post) => (
                <Post 
                image={ post.poster_image }
                poster={ post.poster }
                date={ post.date }
                key={ post.id }
                id={ post.id }
                userId={ post.poster_id }
                content={ post.content }
                likes={ post.post_likes.length }
                comments={ post.post_comments } />  
            ))}
        </div>
    );
}

export default FollowFeed