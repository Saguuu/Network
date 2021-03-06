import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import "./CreatePost.css";
import axios from '../axios';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

const CreatePost = ({ setPosts }) => {

    // Initialize state
    let {user, authTokens} = useContext(AuthContext);

    let postCreate = async (e) => {

        e.preventDefault();
        
        let content = e.currentTarget.parentNode.parentNode.childNodes[0].childNodes[1].value;

        // Verify content integrity
        if (content.length <= 0 || content.length > 100) {
            return
        }

        // Reset input field to empty string
        e.currentTarget.parentNode.parentNode.childNodes[0].childNodes[1].value = "";

        await axios.post("/api/post-create/", {
            "content": content
        }, { 
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens.access) 
            }
        })
        .then(() => {

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
            <Button variant="contained" endIcon={<SendIcon />} className="createpost__button" onClick={postCreate}>Post</Button>
        </div>
    </div>
    </form>
  );
}


export default CreatePost