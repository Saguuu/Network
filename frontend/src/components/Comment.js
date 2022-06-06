import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Comment.css";

const Comment = ({ id, commenterId, commenter, commenterImage, content, date, calcDate }) => {

    let [postContent, setContent] = useState(content);
    let newDate = calcDate(date);

    return (
        <div className="comment">
            <div className="comment__top">
                <Link to={`/user/${commenterId}`} state={{fromPost: true}} style={{ textDecoration: 'none' }}>
                <div className="comment__topLeft">
                    <img className="comment__topLeftImage" src={ commenterImage } alt="userImg" />
                    <h6 className="comment__topLeftName">{ commenter }</h6>
                </div>
                </Link>
                <div className="comment__topRight">
                    <p>{ newDate }</p>
                </div>
            </div>
            <div className="comment__middle">
                <p>{ postContent }</p>
            </div>
        </div>
    );
}

export default Comment