import React from 'react';
import "./Nav.css";
import HomeIcon from '@mui/icons-material/Home';
import TwitterIcon from '@mui/icons-material/Twitter';
import TagIcon from '@mui/icons-material/Tag';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const Nav = () => {
  return (
    <div className="nav">
        <div className="nav__container">
            <div className="nav__item">
                <TwitterIcon fontSize="large" className="nav__itemImage">
                </TwitterIcon>
            </div>
            <div className="nav__item">
                <HomeIcon fontSize="large" className="nav__itemImage"> 
                </HomeIcon>
                <div className="nav__itemText">
                    <h3>Home</h3>
                </div>
            </div>
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
        </div>
    </div>
  );
}

export default Nav