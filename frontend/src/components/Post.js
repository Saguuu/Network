import React, { useContext, useState } from 'react';
import { Link, } from 'react-router-dom';
import "./Post.css";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import AuthContext from '../context/AuthContext';
import axios from "../axios";

const Post = ({ id, userId, poster, image, content, likes, date }) => {

    let {user, authTokens, fetchUserData} = useContext(AuthContext);
    let isLiked = false;

    if (user) {
        for (let i = 0; i < user.likes.length; i++) {
            if (user.likes[i]["post"] === id) {
                isLiked = true;
            }
        }
    }

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
            console.log(res);
            fetchUserData();
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
            console.log(res);
            fetchUserData();
        })
        .catch(e => {
            console.log(e.response);
        });

    }

    return (
        <div className="post">
            <div className="post__header">
                <Link to={`/user/${userId}`} state={{fromPost: true}} style={{ textDecoration: 'none' }}>
                <div className="post__headerLeft">
                    <img className="post__headerImage" src={ image } alt="userImg" />
                    <h3 className="post__headerName">{ poster }</h3>
                </div>
                </Link>
                <div className="post__headerRight">
                    <p>{ date }</p>
                </div>
            </div>
            <div className="post__content">
                <p>{ content }</p>
            </div>
            <div className="post__toolbar">
                <div className="post__toolbarLikes">
                    {!isLiked ? (
                    <FavoriteBorderOutlinedIcon id={ id } className="post__toolbarLikesHeart" fontSize="small" onClick={ like }>
                    </FavoriteBorderOutlinedIcon>
                    ) : (
                        <FavoriteOutlinedIcon id={ id } className="post__toolbarLikesHeartLiked" fontSize="small" onClick={ unLike }>
                    </FavoriteOutlinedIcon>
                    )}
                    <p>{ likes }</p>
                </div>
            </div>
        </div>
    );
}

export default Post