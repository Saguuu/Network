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
    } : null);

    const navigate = useNavigate();
    let [loading, setLoading] = useState(true);

    let loginUser = async (e) => {

        e.preventDefault();

        const headers = {
            "Content-Type": "application/json"
        }

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
            navigate("/");
        })
        .catch(e => {
            console.log(e.response);
        });
    }

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/");
    }

    let updateToken = async () => {
        console.log("update token call");

        const headers = {
            "Content-Type": "application/json"
        }

        await axios.post("/api/token/refresh/", {
            "refresh": authTokens?.refresh
        }, {headers: headers})
        .then(res => {
            setAuthTokens(res.data);    
            setUser({
                "id": jwt_decode(res.data.access).user_id,
                "username": jwt_decode(res.data.access).username,
                "image": jwt_decode(res.data.access).image,
            });
            localStorage.setItem("authTokens", JSON.stringify(res.data))
        })
        .catch(e => {
            console.log(e.response);
            logoutUser();
        });
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser
    }

    useEffect(() => {   

        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, (1000 * 60 * 4))
        return () => clearInterval(interval);

    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}