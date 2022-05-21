import { createContext, useState, useEffect } from "react";
import axios from "../axios";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(null);
    let [user, setUser] = useState(null);

    let loginUser = async (e) => {

        e.preventDefault();

        const headers = {
            "Content-Type": "application/json"
        }

        let response = await axios.post("/api/token/", {
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
        })
        .catch(e => {
            console.log(e.response);
        });
    }

    let contextData = {
        user:user,
        loginUser:loginUser
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}