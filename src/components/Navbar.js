import React from 'react'
import '../styling/navbar.css'
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onSearch, onReset }) => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    onSearch(inputText);
    console.log("submit")
  };

  const handleProfileClick = (event) => {
    event.preventDefault(); 
    onReset(); // Reset to original user data
  };

  return (
    <div className='nav-container'>
      <div className='nav-items'>
        <form className='search-user' onSubmit={handleSubmit}>
          <div className='search-wrapper'>
            <input
              className='nav-input'
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="search user"
            />
            <FontAwesomeIcon icon={faSearch} className='search-icon'/>
          </div>
        </form>
        <FontAwesomeIcon onClick={handleProfileClick} icon={faUserAlt} className='profile-icon'/>
      </div>
    </div>
  );
};

export default Navbar;
