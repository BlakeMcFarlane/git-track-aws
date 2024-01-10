import React from 'react'
import '../styling/profile-info.css'
import { useEffect, useState } from 'react'

const ProfileInfo = ({ userData, userFriends }) => {


    const now = new Date();
    const creationDate = new Date(userData.created_at); // Parse the creation date

    // Calculate difference in years
    let years = now.getFullYear() - creationDate.getFullYear();

    // Adjust for month and day
    if (now.getMonth() < creationDate.getMonth() || 
        (now.getMonth() === creationDate.getMonth() && now.getDate() < creationDate.getDate())) {
        years--;
    }

    // Calculate the remaining months
    let months = now.getMonth() - creationDate.getMonth();
    if (now.getDate() < creationDate.getDate()) {
        months--;
        if (months < 0) {
            months += 12; // Adjust months when it goes negative
        }
    }

    // Format the account age
    const accountAge = `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''}`;


    return (
        <div className='profile-container'>
            <div className='profile-pic'>
                <img src={userData.avatar_url} />
            </div>
            <div className='info'>
                <div className='profile-name'>
                    <h1>{userData.login}</h1>
                </div>
                <div className='profile-stats'>
                    <div className='stat'>
                        <p>repositories</p>
                        <p id='value'>{userData.public_repos}</p>
                    </div>
                    <div className='stat'>
                        <p>friends</p>
                        <p id='value'>{userFriends.length}</p>
                    </div>
                    <div className='stat'>
                        <p>account Age</p>
                        <p id='value' style={{ fontSize: "12pt" }}>{accountAge}</p>
                    </div> 
                    <div className='stat-bio'>
                        <p className='bio-key'>bio</p>
                        <div className='bio'>
                            <p>{userData.bio}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileInfo