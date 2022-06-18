import React, { useContext } from 'react';
import "./Login.css";
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {

    // Grab helper function
    let {loginUser} = useContext(AuthContext)

    return (
        <div className="login">
            <Link to="/">
                <TwitterIcon  className="login__logo" fontSize="large"/>
            </Link>
            <div className="login__container">
                <h1>Sign in</h1>

                <form>
                    <h5>Username</h5>
                    <input type="text"/>

                    <h5>Password</h5>
                    <input type="password"/>

                    <button className="login__signInButton" onClick={loginUser}>Sign in</button>
                </form>

                <p>By signing-in you agree to the Network Conditions of Use & Sale. Please
                        see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.</p>
                <Link to="/register">
                <button type="submit" className="login__registerButton">Create account</button>
                </Link>
            </div>
        </div>
    );
}

export default Login