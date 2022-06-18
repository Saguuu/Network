import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import "./Comment.css";
import AuthContext from '../context/AuthContext';
import axios from "../axios";

const Comment = ({ id, commenterId, commenter, commenterImage, content, date, calcDate, postComments, setPostComments, Edit }) => {

    // Initialize state
    const {user, authTokens} = useContext(AuthContext);
    const [postContent, setPostContent] = useState(content);
    const [editIsOpen, setEditIsOpen] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(() => 
        user?.id === commenterId
    );

    // Calculate date for comment
    const newDate = calcDate(date);

    const deleteComment = async (e) => {

        e.preventDefault();

        if (isCurrentUser) {

            // Locate comment in posts comment state and remove it, send delete request to backend
            const isComment = (comment) => comment.id === id;
            const index = postComments.findIndex(isComment);
            postComments.splice(index, 1);

            await axios.delete(`/api/comment-uncomment/${id}/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authTokens.access)
                    }
            })
            .then(() => {
                setPostComments([...postComments])
            })
            .catch((e) => {
                console.log(e.response);
            })
        } else {
            return
        }

    }

    return (
        <div className="comment">
            <Edit 
            id={ id }
            from={ "Comment" }
            initialContent={ postContent }
            setPostContent={ setPostContent }
            editIsOpen={ editIsOpen }
            setEditIsOpen={ setEditIsOpen }
            postComments={ postComments }
            setPostComments={ setPostComments }
            />
            <div className="comment__top">
                <Link to={`/user/${commenterId}`} style={{ textDecoration: 'none' }}>
                <div className="comment__topLeft">
                    <img className="comment__topLeftImage" src={ commenterImage } alt="userImg" />
                    <h6 className="comment__topLeftName">{ commenter }</h6>
                </div>
                </Link>
                <div className="comment__topRight">
                    <p>{ newDate }</p>
                    {isCurrentUser ? (
                        <>
                        <div className="comment__topRightClose" title="Delete Comment" onClick={ deleteComment }>
                            &#10006;
                        </div>
                        <div className="comment__topRightMenu" title="Edit Comment" onClick={ () => setEditIsOpen(true) }>
                            <div className="comment__topRightMenuCircle"></div>
                            <div className="comment__topRightMenuCircle"></div>
                            <div className="comment__topRightMenuCircle"></div>
                        </div>
                        </>
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