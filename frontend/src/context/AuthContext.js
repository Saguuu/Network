import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    let authState = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null;
    let id = localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")).user_id : null;
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

    let loginUser = (e) => {

        e.preventDefault();

        const headers = {
            "Content-Type": "application/json"
        }

        let verify = async () => {
            await axios.post("/api/token/", {
                "username": e.target.parentNode.childNodes[1].value,
                "password": e.target.parentNode.childNodes[3].value
            }, {headers: headers})
            .then(res => {
                setAuthTokens(res.data);    
                setUser({
                    "id": jwt_decode(res.data.access).user_id,
                    "username": jwt_decode(res.data.access).username,
                    "image": jwt_decode(res.data.access).image,
                });
                localStorage.setItem("authTokens", JSON.stringify(res.data))
                setLoading(true);
                navigate("/");
            })
            .catch(e => {
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
        console.log("update tokens");

        const headers = {
            "Content-Type": "application/json"
        }

        if (authTokens) {
            await axios.post("/api/token/refresh/", {
                "refresh": authTokens?.refresh
            }, {headers: headers})
            .then(res => {
                setAuthTokens(res.data);    
                setUser((user) => ({
                    ...user,
                    id: jwt_decode(res.data.access).user_id,
                    username: jwt_decode(res.data.access).username,
                    image: jwt_decode(res.data.access).image,
                }));
                localStorage.setItem("authTokens", JSON.stringify(res.data))
            })
            .catch(e => {
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
        await axios.get(`/api/user-single/${user?.id}/`)
        .then(res => {
            setUser((user) => ({
                ...user,
                bio: res.data.bio,
                posts: res.data.user_posts,
                follows: res.data.user_follows,
                followed: res.data.user_followed,
                likes: res.data.user_likes,
                comments: res.data.user_comments
            }));
            setLoading(false);
        })
        .catch(e => {
            console.log(e.response);
            setLoading(false);
        });
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
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

        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, (1000 * 60 * 4));
        return () => clearInterval(interval);

    }, [authTokens]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
}