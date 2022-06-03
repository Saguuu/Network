import React, { useState, useEffect, useContext } from 'react';
import "./FollowFeed.css";
import axios from "../axios";
import Post from './Post';
import AuthContext from '../context/AuthContext';

const FollowFeed = () => {

    const [posts, setPosts] = useState([]);
    let {user, authTokens, logoutUser} = useContext(AuthContext);

    useEffect(() => {
        let fetchPosts = async () => {
            await axios.get(`/api/post-following/${user.id}/`, {
                headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
                }
            })
            .then(res => {
                setPosts(res.data);
            })
            .catch(e => {
                console.log(e.response);
                logoutUser();
            });
        }

        fetchPosts();
    }, [user])

    return (
        <div className="followfeed">
            {posts.map((post) => (
                <Post 
                image={ post.poster_image }
                poster={ post.poster }
                date={ post.date }
                key={ post.id }
                id={ post.id }
                userId={ post.poster_id }
                content={ post.content }
                likes={ post.post_likes.length } />  
            ))}
        </div>
    );
}

export default FollowFeed