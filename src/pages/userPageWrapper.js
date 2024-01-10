import React from 'react';
import Navbar from '../components/Navbar';
import HomePage from './HomePage';
import { useState, useEffect } from 'react'
import '../styling/user-page-wrapper.css'


const UserPageWrapper = () => {
    const [userData, setUserData] = useState(null);         // JSON     {}
    const [userRepos, setUserRepos] = useState(null);       // Array    []
    

    // Function invoke on user search
    const handleSearch = async (username) => {
        try {
            // Fetching user data from GitHub API
            const userDataResponse = await fetch(`https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getSearchUserData/${username}`, {
                method: "GET",
                headers: {
                    "Authorization": localStorage.getItem("accessToken")
                }
            });
            if (!userDataResponse.ok)
                throw new Error('Failed to fetch user data');
            const data1 = await userDataResponse.json()
                setUserData(data1)

            // Fetching user repos from GitHub API
            const userRepoResponse = await fetch(`https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getRepoData/${username}`, {
                method: "GET",
                headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
            });

            if (!userRepoResponse.ok) 
user-page-wrapper                throw new Error('Failed to fetch repository data');
            const data = await userRepoResponse.json();
                setUserRepos(data);
            
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };
    return (
            <div className='page-wrapper'>
                <Navbar onSearch={ handleSearch }/>
                <HomePage searchUserData={ userData } searchUserRepos={ userRepos } />
            </div>
    );
    };

export default UserPageWrapper;
