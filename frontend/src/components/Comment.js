import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import "./Comment.css";
import AuthContext from '../context/AuthContext';
import axios from "../axios";

const Comment = ({ id, commenterId, commenter, commenterImage, content, date, calcDate, postComments, setPostComments }) => {

    const {user, authTokens, fetchUserData} = useContext(AuthContext);
    const [postContent, setContent] = useState(content);
    const [isCurrentUser, setIsCurrentUser] = useState(() => 
        user.id === commenterId
    );
    const newDate = calcDate(date);

    const deleteComment = async (e) => {

        if (isCurrentUser) {

            const isComment = (comment) => comment.id === id;
            const index = postComments.findIndex(isComment);
            postComments.splice(index, 1);

            await axios.delete(`/api/comment-uncomment/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authTokens.access)
                    }
            })
            .then(res => {
                console.log(res);
                setPostComments([...postComments])
                fetchUserData();
            })
            .catch(e => {
                console.log(e.response);
            })
        } else {
            return
        }

    }

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
                    {isCurrentUser ? (
                        <div className="comment__topRightClose" onClick={ deleteComment }>
                            &#10006;
                        </div>
                    ): null}
                </div>
            </div>
            <div className="comment__middle">
                <p>{ postContent }</p>
            </div>
        </div>
    );
}

export default Comment