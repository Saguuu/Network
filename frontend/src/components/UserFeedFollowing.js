import React from 'react';
import "./UserFeedFollowing.css";
import User from './User';

const UserFeedFollowing = ({ users }) => {
    return (
        <div className="userfeedfollowing">
            {users?.map((user) => (
            <User 
            key={ user.id }
            id={ user.followee_id }
            image={ user.followee_image }
            username={ user.followee }
            bio={ user.followee_bio }
            />
            ))}
        </div>
    );
}

export default UserFeedFollowing