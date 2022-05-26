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
    }, [])

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
                content={ post.content }
                likes={ post.post_likes.length } />  
            ))}
        </div>
    );
}

export default HomeFeed