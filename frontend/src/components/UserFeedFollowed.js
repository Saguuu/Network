import React from 'react';
import "./UserFeedFollowed.css";
import User from './User';

const UserFeedFollowed = ({ users, handleFollow }) => {
    return (
        <div className="userfeedfollowed">
            {users?.map((user) => (
            <User 
            key={ user.id }
            id={ user.follower_id }
            image={ user.follower_image }
            username={ user.follower }
            bio={ user.follower_bio }
            handleFollow={ handleFollow }
            />
            ))}
        </div>
    );
}

export default UserFeedFollowed