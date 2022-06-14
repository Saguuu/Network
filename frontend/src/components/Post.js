import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Post.css";
import Comment from './Comment';
import CreateComment from './CreateComment';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import CommentIcon from '@mui/icons-material/Comment';
import AuthContext from '../context/AuthContext';
import axios from "../axios";

const Post = ({ id, userId, poster, image, content, likes, date, comments, posts, setPosts, setProfileLikes, setProfileUserPosts }) => {

    const {user, authTokens, fetchUserData} = useContext(AuthContext);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showCommentsClicked, setShowCommentsClicked] = useState(false);
    const [postComments, setPostComments] = useState([]);
    const [postContent, setPostContent] = useState(content);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [postLikes, setPostLikes] = useState(likes);
    const [editIsOpen, setEditIsOpen] = useState(false);

    // Grab input date and convert to nicer format depending on time since the post was created
    let newDate;
    let calcDate = (inputDate) => {

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const formattedDate = new Date(inputDate);
        const difference = Date.now() - formattedDate;
        let newDate;

        if (difference < 60000) { 
            newDate = Math.floor(difference / 1000) + "s";
        } else if (difference < 3600000) {
            newDate = Math.floor(difference / 1000 / 60) + "m";
        } else if (difference < 86400000) {
            newDate = Math.floor(difference / 1000 / 60 / 60) + "h";
        }   else {
            newDate = months[formattedDate.getMonth()] + " " + formattedDate.getDate() + ", " + formattedDate.getFullYear();
        }

        return newDate
    
    }

    newDate = calcDate(date);

    let like = async (e) => {

        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens.access)
        }

        await axios.post("/api/like-like/", {
            "liker": user.id,
            "post": id
        }, {headers: headers})
        .then(res => {
            fetchUserData();
            setIsLiked(true);
            setPostLikes(postLikes + 1);
        })
        .catch(e => {
            console.log(e.response);
        });
    }

    let unLike = async (e) => {

        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens.access)
        }

        await axios.post("/api/like-unlike/", {
            "liker": user.id,
            "post": id
        }, {headers: headers})
        .then(res => {
            fetchUserData();
            setIsLiked(false);
            setPostLikes(postLikes - 1);
        })
        .catch(e => {
            console.log(e.response);
        });
    }

    let toggleComments = (e) => {
        if (showComments === true) {
            setShowComments(false);
            setShowCommentsClicked(false);
        } else {
            setShowComments(true);
            setShowCommentsClicked(true);
        }
    }

    let handleDelete = async (e) => {

        if (isCurrentUser) {

            const isPost = (post) => post.id === id;
            const index = posts.findIndex(isPost);
            posts.splice(index, 1);

            await axios.delete(`/api/post-delete/${id}/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authTokens.access)
                    }
            })
            .then(res => {
                console.log(res);
                if (setPosts) {
                    setPosts([...posts]);
                } else if (setProfileLikes) {
                    setProfileLikes([...posts]);
                } else {
                    setProfileUserPosts([...posts]);
                }
            })
            .catch(e => {
                console.log(e.response);
            })
        } else {
            return
        }
    }

    const Edit = ({ id, from, initialContent, setPostContent, editIsOpen, setEditIsOpen, postComments, setPostComments }) => {
        
        if (!editIsOpen) {
            return null;
        }

        const handleEdit = async (e) => {

            const newContent = e.target.parentNode.parentNode.childNodes[0].childNodes[1].value;
            setPostContent(newContent);
            setEditIsOpen(false);

            const headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }

            if (from === "Post") {
        
                await axios.post(`/api/post-update/${id}/`, {
                    "id": user.id,
                    "content": newContent,
                }, {headers: headers})
                .then(res => {
                    console.log(res);
                    fetchUserData();
                })
                .catch(e => {
                    console.log(e.response);
                });
            } else {

                await axios.post(`/api/comment-update/${id}/`, {
                    "id": user.id,
                    "content": newContent,
                }, {headers: headers})
                .then(res => {
                    console.log(res);
                    const isComment = (comment) => comment.id === id;
                    const index = postComments.findIndex(isComment);
                    postComments[index].content = newContent;
                    setPostComments([...postComments]);
                })
                .catch(e => {
                    console.log(e.response);
                });
            }  
        }

        return (
            <>
        <div className="overlay"></div>
        <div className="edit">
            <div className="edit__content">
                <h3>Edit { from }:</h3>
                <textarea defaultValue={ initialContent }></textarea>
            </div>
            <div className="edit__bottom">
                <button className="edit__buttonClose" onClick={ () => setEditIsOpen(false) }>Close</button>
                <button className="edit__buttonSave" onClick={ handleEdit }>Save</button>
            </div>
        </div>
        </>
        );
    }

    useEffect(() => {

        // Check if there is a logged in user and if the post has been liked by them, and whether the post is made by currently logged in user
        if (user) {
            for (let i = 0; i < user.likes.length; i++) {
                if (user.likes[i]["post"] === id) {
                    setIsLiked(true);
                }
            }

            if (user.id === userId) {
                setIsCurrentUser(true);
            }

        }

        setPostComments(comments);  

    }, [comments]);

    return (
        <div className="post">
            <Edit 
            id={ id }
            from={ "Post" }
            initialContent={ postContent }
            setPostContent={ setPostContent }
            editIsOpen={ editIsOpen }
            setEditIsOpen={ setEditIsOpen }
            />
            <div className="post__header">
                <Link to={`/user/${userId}`} state={{fromPost: true}} style={{ textDecoration: 'none' }}>
                <div className="post__headerLeft">
                    <img className="post__headerLeftImage" src={ image } alt="userImg" />
                    <h3 className="post__headerLeftName">{ poster }</h3>
                </div>
                </Link>
                <div className="post__headerRight">
                    <p>{ newDate }</p>
                    {isCurrentUser ? (
                    <div className="post__headerRightMenu" title="Edit Post" onClick={ () => setEditIsOpen(true) }>
                        <div className="post__headerRightMenuCircle"></div>
                        <div className="post__headerRightMenuCircle"></div>
                        <div className="post__headerRightMenuCircle"></div>
                    </div>
                    ): null}
                </div>
            </div>
            <div className="post__content">
                <p>{ postContent }</p>
            </div>
            <div className="post__toolbar">
                <div className="post__toolbarLeft">
                    <div className="post__toolbarLikes">
                        {!isLiked ? (
                            <FavoriteBorderOutlinedIcon id={ id } className="post__toolbarLikesHeart" fontSize="small" onClick={ like }>
                            </FavoriteBorderOutlinedIcon>
                        ) : (
                            <FavoriteOutlinedIcon id={ id } className="post__toolbarLikesHeartLiked" fontSize="small" onClick={ unLike }>
                            </FavoriteOutlinedIcon>
                        )}
                        <p>{ postLikes }</p>
                    </div>
                    <div className="post__toolbarComments">
                        {!showCommentsClicked ? (
                            <CommentIcon className="post__toolbarCommentsIcon" fontSize="small" onClick={ toggleComments }>
                            </CommentIcon>
                        ) : (
                            <CommentIcon className="post__toolbarCommentsIconClicked" fontSize="small" onClick={ toggleComments }>
                            </CommentIcon>
                        )}
                        <p>{ postComments.length }</p>
                    </div>
                </div>
                {isCurrentUser ? (
                <div className="post__toolbarRight">
                    <div className="post__toolbarClose" onClick={ handleDelete } title="Delete Post">
                        &#10006;
                    </div>
                </div>
                ): null}
            </div>
            {showComments ? ( 
            <div className="post__comments">
                {user ? (
                <CreateComment
                postId={ id } 
                setPostComments={ setPostComments }
                />
                ): null}
                {postComments.map((comment) => (
                    <Comment 
                    id={ comment.id }
                    key={ comment.id }
                    commenter={ comment.commenter_username }
                    commenterId={ comment.poster }
                    commenterImage={ comment.commenter_image }
                    content={ comment.content }
                    date={ comment.date }
                    calcDate={ calcDate }
                    postComments= { postComments }
                    setPostComments={ setPostComments }
                    Edit={ Edit }
                    />
                )).reverse()}                        
            </div>
            ) : null}
        </div>
    );
}

export default Post