import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import "./CreatePost.css";
import axios from '../axios';

const CreatePost = () => {

    let {user, authTokens} = useContext(AuthContext);

    let postCreate = async (e) => {

        await axios.post("/api/post-create/", {
            "content": e.target.parentNode.parentNode.childNodes[0].childNodes[1].value
        }, { 
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + String(authTokens.access) 
            }
        })
        .then(res => {
            console.log(res.data)
        })
        .catch(e => {
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