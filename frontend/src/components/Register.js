import React, { useContext } from 'react';
import "./Register.css";
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {

    let {registerUser} = useContext(AuthContext)

    return (
        <div className="register">
            <Link to="/">
                <TwitterIcon  className="register__logo" fontSize="large"/>
            </Link>
            <div className="register__container">
                <h1>Register</h1>

                <form>
                    <h5>Username</h5>
                    <input type="text"/>

                    <h5>Password</h5>
                    <input type="password"/>

                    <h5>Re-type Password</h5>
                    <input type="password"/>

                    <button className="register__signInButton" onClick={registerUser}>Register</button>
                </form>

                <p>By Registering you agree to the Network Conditions of Use & Sale. Please
                        see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.</p>
            </div>
        </div>
    );
}

export default Register