import React from 'react';
import "./UserFeedFollowed.css";
import User from './User';

const UserFeedFollowed = ({ users }) => {
    return (
        <div className="userfeedfollowed">
            {users?.map((user) => (
            <User 
            key={ user.id }
            id={ user.follower_id }
            image={ user.follower_image }
            username={ user.follower }
            bio={ user.follower_bio }
            />
            ))}
        </div>
    );
}

export default UserFeedFollowed