import React from 'react'
import '../styling/profile-info.css'

const ProfileInfo = ({ userData, lastEvent }) => {


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
    const accountAge = `${years} yr${years !== 1 ? 's' : ''} & ${months} mth${months !== 1 ? 's' : ''}`;


    return (
        <div className='profile-container'>
            <div className='profile-pic'>
                <img src={userData.avatar_url} />
            </div>
            <div className='info'>
                <div className='profile-name'>
                    <h1>{userData.login}</h1>
                    { lastEvent ?
                    (<div className='activity-section' title='Recently Active'>
                        <div className='activity-status' ></div>
                    </div>)
                    :
                    (<div className='activity-section' title='Recently Active'>
                        <div className='activity-status-absent' ></div>
                    </div>)
                    }
                </div>
                <div className='profile-stats'>
                    <div className='stat'>
                        <p className='stat-label'>repositories</p>
                        <p className='value'>{userData.public_repos}</p>
                    </div>
                    <div className='stat'>
                        <p className='stat-label'>followers</p>
                        <p className='value'>{userData.followers}</p>
                    </div>
                    <div className='stat'>
                        <p className='stat-label'>account age</p>
                        <p className='value'>{accountAge}</p>
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