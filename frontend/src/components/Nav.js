import React from 'react';
import "./Nav.css";
import HomeIcon from '@mui/icons-material/Home';

const Nav = () => {
  return (
    <div className="nav">
        <div className="nav__item">
            <HomeIcon fontSize="large" className="nav__itemImage">
                
            </HomeIcon>
            <div className="nav__itemText">
                <h3>Home</h3>
            </div>
        </div>
    </div>
  );
}

export default Nav