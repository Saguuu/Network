import React, { useContext } from 'react';
import "./CreateComment.css";
import AuthContext from '../context/AuthContext';
import axios from "../axios";

const CreateComment = ({ postId, setPostComments }) => {

    // Initialize state
    let {user, authTokens} = useContext(AuthContext);

    let comment = async (e) => {

        let content = e.target.parentNode.childNodes[1].value

        // Verify content integrity
        if (content.length <= 0 || content.length > 100) {
            console.log("Comment too long or too short");
            return
        }

        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens.access)
        }

        await axios.post("/api/comment-comment/", {
            "commenter": user.id,
            "post": postId,
            "content": content
        }, {headers: headers})
        .then(() => {
            // Fetch users last comment from database to set post comments and re-render post component
            let getNewComment = async () => {
                await axios.get(`/api/comment-last/${user.id}/`, 
                {headers: headers})
                .then((res) => {
                    setPostComments((comments) => (
                        [...comments, res.data]
                    ))
                })
                .catch((e) => {
                    console.log(e.response);
                })
            }
            getNewComment();

            // Set inputfield to null
            e.target.parentNode.childNodes[1].value="";
        })
        .catch((e) => {
            console.log(e.response);
        });
    }

    return (
        <div className="createcomment">
            <img className="createcomment__image" src={user.image} alt="user_img"/>
            <textarea className="createcomment__content" placeholder="Give your thoughts!"/>
            <button className="createcomment__button" onClick={ comment }>Send</button>
        </div>
    );
}

export default CreateComment
