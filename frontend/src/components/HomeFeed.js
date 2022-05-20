import React, { useState, useEffect } from 'react';
import "./HomeFeed.css";
import axios from "../axios";
import Post from './Post';

const HomeFeed = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            const req = await axios.get("/api/post-list/");

            setPosts(req.data);
        }

        fetchPosts();
    }, [])

    console.log(posts);

    return (
        <div className="homefeed">
            {posts.map((post) => (
                <Post 
                image={ post.poster_image }
                poster={ post.poster }
                date={ post.date }
                key={ post.id }
                content={ post.content}
                likes={ post.likes } />  
            ))}
        </div>
    );
}

export default HomeFeed