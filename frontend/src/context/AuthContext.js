import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    // Grab current localstorage data if any exists and set initial state
    let authState = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null;
    let id = localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")).id : null;
    let username = localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")).username : null;
    let image = localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")).image : null;

    let [authTokens, setAuthTokens] = useState(() => authState);
    let [user, setUser] = useState(() => localStorage.getItem("authTokens") ? {
        "id": id,
        "username": username,
        "image": image,
    }: null);
    let [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    let registerUser = (e) => {

        e.preventDefault();

        const headers = {
            "Content-Type": "application/json"
        }

        let create = async () => {

            // Send register request to backend and implement error messaging on invalid input
            await axios.post("/api/user-register/", {
                "username": e.target.parentNode.childNodes[1].value,
                "password1": e.target.parentNode.childNodes[3].value,
                "password2": e.target.parentNode.childNodes[5].value
            }, {headers: headers})
            .then((res) => {
                if (res.status === 202) {
                    e.target.parentNode.childNodes[1].style.border = "1px solid red";
                    e.target.parentNode.childNodes[3].style.border = "1px solid red";
                    e.target.parentNode.childNodes[5].style.border = "1px solid red";
                    let p = e.target.parentNode.appendChild(document.createElement("p", ));
                    p.innerHTML = "User with that name already exists or passwords do not match";
                    p.style.color = "red";
                    setTimeout(() => {
                        p.remove();
                    }, 5000);
                } else {
                    loginUser(e);
                }
            })
            .catch((e) => {
                console.log(e.response);
            })
        }
        create();
    }

    let loginUser = (e) => {

        e.preventDefault();

        const headers = {
            "Content-Type": "application/json"
        }

        // Verify credentials, load response to localstorage and set user state
        let verify = async () => {
            await axios.post("/api/token/", {
                "username": e.target.parentNode.childNodes[1].value,
                "password": e.target.parentNode.childNodes[3].value
            }, {headers: headers})
            .then((res) => {
                setAuthTokens(res.data);    
                setUser({
                    "id": jwt_decode(res.data.access).id,
                    "username": jwt_decode(res.data.access).username,
                    "image": jwt_decode(res.data.access).image,
                });
                localStorage.setItem("authTokens", JSON.stringify(res.data));
                setLoading(true);
                navigate("/");
            })
            .catch((e) => {
                console.log(e.response);
            });
        }
        verify();
    }

    let logoutUser = () => {

        // Remove user data from locale storage, log out and redirect
        
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/");
    }

    let updateToken = async () => {

        const headers = {
            "Content-Type": "application/json"
        }

        // Send request for new tokens, logout if fails
        if (authTokens) {
            await axios.post("/api/token/refresh/", {
                "refresh": JSON.parse(localStorage.getItem("authTokens"))?.refresh
            }, {headers: headers})
            .then((res) => {
                setAuthTokens(res.data);    
                setUser((user) => ({
                    ...user,
                    id: jwt_decode(res.data.access).id,
                    username: jwt_decode(res.data.access).username
                }));
                localStorage.setItem("authTokens", JSON.stringify(res.data));
            })
            .catch((e) => {
                if(!(e.response.data.detail === "Token is blacklisted")) {
                    console.log(e.response);
                    logoutUser();
                }
                else {
                    console.log(e.response);
                }
            });
        }
    }

    let fetchUserData = async () => {

        // Fetch new user data if neccesary to update state
        if (user) {
            await axios.get(`/api/user-single/${user?.id}/`)
            .then((res) => {
                setUser((user) => ({
                    ...user,
                    image: res.data.image,
                    bio: res.data.bio,
                    posts: res.data.user_posts,
                    follows: res.data.user_follows,
                    followed: res.data.user_followed,
                    likes: res.data.user_likes,
                    comments: res.data.user_comments
                }));
            })
            .catch((e) => {
                console.log(e.response);
            });
        }
        setLoading(false);
    }

    // Initialize helper data
    let contextData = {
        user:user,
        authTokens:authTokens,
        registerUser:registerUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
        setUser:setUser,
        fetchUserData:fetchUserData
    }

    useEffect(() => { 

        if(loading) {
            updateToken();
        }

        fetchUserData();

    }, [loading]);

    useEffect(() => {  

        // Initialize reccuring token update cycle
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, (1000 * 60 * 59));
        return () => clearInterval(interval);

    }, [authTokens]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
}