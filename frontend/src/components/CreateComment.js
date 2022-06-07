import React, { useContext } from 'react';
import "./CreateComment.css";
import AuthContext from '../context/AuthContext';
import axios from "../axios";

const CreateComment = ({ postId, setPostComments }) => {

    let {user, authTokens, fetchUserData} = useContext(AuthContext);

    let comment = async (e) => {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens.access)
        }

        await axios.post("/api/comment-comment/", {
            "commenter": user.id,
            "post": postId,
            "content": e.target.parentNode.childNodes[1].value
        }, {headers: headers})
        .then(res => {
            // Fetch users last comment from database to set post comments and re-render post component
            let getNewComment = async () => {
                await axios.get(`/api/comment-last/${user.id}`, 
                {headers: headers})
                .then(res => {
                    setPostComments((comments) => (
                        [...comments, res.data]
                    ))
                })
                .catch(e => {
                    console.log(e.response);
                })
            }
            getNewComment();
            fetchUserData();
            e.target.parentNode.childNodes[1].value="";
        })
        .catch(e => {
            console.log(e.response);
        });
    }

    return (
        <div className="createcomment">
            <img className="createcomment__image" src={user.image} />
            <textarea className="createcomment__content" placeholder="Give your thoughts!"/>
            <button className="createcomment__button" onClick={ comment }>Send</button>
        </div>
    );
}

export default CreateComment