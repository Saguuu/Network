import React from 'react';
import "./ProfileFeed.css";
import Post from './Post';

const ProfileFeed = ({ posts }) => {
    return (
        <div className="profilefeed">
            {posts?.map((post) => (
                <Post 
                image={ post.poster_image }
                poster={ post.poster }
                date={ post.date }
                key={ post.id }
                id={ post.poster_id }
                content={ post.content }
                likes={ post.post_likes.length } />  
            ))}
        </div>
    );
}

export default ProfileFeed