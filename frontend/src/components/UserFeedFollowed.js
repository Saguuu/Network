import React from 'react';
import "./UserFeedFollowed.css";
import User from './User';
import { CircularProgress } from '@mui/material';

const UserFeedFollowed = ({ users, handleFollow, feedLoading }) => {
    return (
        <div className="userfeedfollowed">
            {feedLoading ? (
            <div className="progress">
                <CircularProgress />
            </div>
            ): null}
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