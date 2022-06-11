import React from 'react';
import "./ProfileFeed.css";
import Post from './Post';

const ProfileFeed = ({ posts, setProfileLikes, setProfileUserPosts }) => {
    return (
        <div className="profilefeed">
            {posts?.map((post) => (
                <Post 
                image={ post.poster_image }
                poster={ post.poster }
                date={ post.date }
                key={ post.id }
                id={ post.id }
                userId={ post.poster_id }
                content={ post.content }
                likes={ post.post_likes?.length }
                comments={ post.post_comments } 
                posts={ posts }
                setProfileLikes={ setProfileLikes }
                setProfileUserPosts={ setProfileUserPosts }
                />  
            ))}
        </div>
    );
}

export default ProfileFeed