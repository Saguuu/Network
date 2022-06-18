import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import "./CreatePost.css";
import axios from '../axios';

const CreatePost = ({ setPosts }) => {

    // Initialize state
    let {user, authTokens} = useContext(AuthContext);

    let postCreate = async (e) => {

        e.preventDefault();
        
        let content = e.target.parentNode.parentNode.childNodes[0].childNodes[1].value;

        // Verify content integrity
        if (content.length <= 0 || content.length > 100) {
            console.log("Post too long or too short");
            return
        }

        await axios.post("/api/post-create/", {
            "content": content
        }, { 
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens.access) 
            }
        })
        .then(() => {

            // Reset input field to empty string
            e.target.parentNode.parentNode.childNodes[0].childNodes[1].value = "";

            // Fetch users latest post from db then add it to feed state
            let updateState = async () => {
                await axios.get(`/api/post-last/${user.id}/`)
                .then((res) => {
                    setPosts((posts) => 
                        [res.data, ...posts]
                    );
                })
                .catch((e) => {
                    console.log(e.response);
                })
            }
            updateState();
        })
        .catch((e) => {
            console.log(e.response);
        });
    }

  return (
    <form>
    <div className="createpost">
        <div className="createpost__top">
            <img className="createpost__image" alt="" src={user.image}></img>
            <textarea className="createpost__message" placeholder="Max length 100 characters"></textarea>
        </div>
        <div className="createpost__bottom">
            <div></div>
            <button className="createpost__button" type="submit" onClick={postCreate}>Post</button>
        </div>
    </div>
    </form>
  );
}


export default CreatePost