import React, { useState, useEffect, useContext } from 'react';
import "./HomeFeed.css";
import axios from "../axios";
import Post from './Post';
import CreatePost from './CreatePost';
import AuthContext from '../context/AuthContext';

const HomeFeed = () => {

    const [posts, setPosts] = useState([]);
    let {user} = useContext(AuthContext);

    useEffect(() => {
        async function fetchPosts() {
            await axios.get("/api/post-list/")
            .then(res => {
                setPosts(res.data);
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