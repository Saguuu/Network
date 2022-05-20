import React from 'react';
import "./Post.css";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

const Post = ({ id, poster, image, content, likes, date }) => {
    return (
        <div className="post">
            <div className="post__header">
                <div className="post__headerLeft">
                    <img className="post__headerImage" src={ image } alt="userImg" />
                    <h3 className="post__headerName">{ poster }</h3>
                </div>
                <div className="post__headerRight">
                    <p>{ date }</p>
                </div>
            </div>
            <div className="post__content">
                <p>{ content }</p>
            </div>
            <div className="post__toolbar">
                <div className="post__toolbarLikes">
                    <FavoriteBorderOutlinedIcon fontSize="small">
                    </FavoriteBorderOutlinedIcon>
                    <p>{ likes }</p>
                </div>
            </div>
        </div>
    );
}

export default Post