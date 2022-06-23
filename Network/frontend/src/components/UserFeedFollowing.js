import React from 'react';
import "./UserFeedFollowing.css";
import User from './User';
import { CircularProgress } from '@mui/material';

const UserFeedFollowing = ({ users, handleFollow, feedLoading }) => {
    return (
        <div className="userfeedfollowing">
            {feedLoading ? (
            <div className="progress">
                <CircularProgress />
            </div>
            ): null}
            {users?.map((user) => (
            <User 
            key={ user.id }
            id={ user.followee_id }
            image={ user.followee_image }
            username={ user.followee }
            bio={ user.followee_bio }
            handleFollow={ handleFollow }
            />
            ))}
        </div>
    );
}

export default UserFeedFollowing