import React, { useState, useEffect, useContext } from 'react';
import "./HomeFeed.css";
import axios from "../axios";
import Post from './Post';
import CreatePost from './CreatePost';
import AuthContext from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

const HomeFeed = () => {

    const [posts, setPosts] = useState([]);
    let {user} = useContext(AuthContext);
    const [feedLoading, setFeedLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            await axios.get("/api/post-list/")
            .then(res => {
                setTimeout(() => {
                    setPosts(res.data);
                    setFeedLoading(false);
                }, 1000);
            })
            .catch(e => {
                console.log(e.response);
            });
        }

        fetchPosts();
    }, [user])

    return (
        <div className="homefeed">
            {user ? (
            <CreatePost />
            ): null}
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
                comments={ post.post_comments }
                posts={ posts }
                setPosts={ setPosts } 
                />  
            ))}
        </div>
    );
}

export default HomeFeed