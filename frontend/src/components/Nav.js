import React from 'react';
import { Link } from 'react-router-dom';
import "./Nav.css";
import HomeIcon from '@mui/icons-material/Home';
import TwitterIcon from '@mui/icons-material/Twitter';
import TagIcon from '@mui/icons-material/Tag';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const Nav = () => {
  return (
    <div className="nav">
        <div className="nav__container">
            <Link to="/">
            <div className="nav__item">
                <TwitterIcon fontSize="large" className="nav__itemImage">
                </TwitterIcon>
            </div>
            </Link>
            <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="nav__item">
                <HomeIcon fontSize="large" className="nav__itemImage"> 
                </HomeIcon>
                <div className="nav__itemText">
                    <h3>Home</h3>
                </div>
            </div>
            </Link>
            <div className="nav__item">
                <TagIcon fontSize="large" className="nav__itemImage"> 
                </TagIcon>
                <div className="nav__itemText">
                    <h3>Following</h3>
                </div>
            </div>
            <div className="nav__item">
                <EmailIcon fontSize="large" className="nav__itemImage"> 
                </EmailIcon>
                <div className="nav__itemText">
                    <h3>Messages</h3>
                </div>
            </div>
            <div className="nav__item">
                <PersonIcon fontSize="large" className="nav__itemImage"> 
                </PersonIcon>
                <div className="nav__itemText">
                    <h3>Profile</h3>
                </div>
            </div>
            <Link to="/login" style={{ textDecoration: 'none' }}>
            <div className="nav__item">
                <LoginIcon fontSize="large" className="nav__itemImage"> 
                </LoginIcon>
                <div className="nav__itemText">
                    <h3>Guest - Login</h3>
                </div>
            </div>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
            <div className="nav__item">
                <AppRegistrationIcon fontSize="large" className="nav__itemImage"> 
                </AppRegistrationIcon>
                <div className="nav__itemText">
                    <h3>Register</h3>
                </div>
            </div>
            </Link>
        </div>
    </div>
  );
}

export default Nav