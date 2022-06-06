import React, { useContext } from 'react';
import { Link, } from 'react-router-dom';
import "./Post.css";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import AuthContext from '../context/AuthContext';
import axios from "../axios";

const Post = ({ id, userId, poster, image, content, likes, date }) => {

    let {user, authTokens, fetchUserData} = useContext(AuthContext);
    let isLiked = false;

    // Check if there is a logged in user and if the post has been liked by them
    if (user) {
        for (let i = 0; i < user.likes.length; i++) {
            if (user.likes[i]["post"] === id) {
                isLiked = true;
            }
        }
    }

    // Grab input date and convert to nicer format depending on time since the post was created
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let formattedDate = new Date(date);
    let difference = Date.now() - formattedDate;
    let newDate;

    if (difference < 60000) { 
        newDate = Math.floor(difference / 1000) + "s";
    } else if (difference < 3600000) {
        newDate = Math.floor(difference / 1000 / 60) + "m";
    } else if (difference < 86400000) {
        newDate = Math.floor(difference / 1000 / 60 / 60) + "h";
    }   else {
        newDate = months[formattedDate.getMonth()] + ", " + formattedDate.getDate() + " " + formattedDate.getFullYear();
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
                    <p>{ newDate }</p>
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