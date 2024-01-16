import React, { useEffect, useRef } from 'react';
import '../styling/leaderboard.css';

const Leaderboard = ({ userRankings, username }) => {
  const userRefs = useRef({});

  useEffect(() => {
    if (username && userRefs.current[username]) {
      userRefs.current[username].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [username, userRankings]);
  
  return (
    <div className='leaderboard-container'>
      <div className='label'>
        <h1>Leaderboard</h1>
        <h4>{userRankings.length} Git Trackers</h4>
      </div>
      <div className='title-container'>
        <div className='title'>
          <div className='title-item' id='one'>
            <p className='title-name'>name</p>
          </div>
          <div className='title-item' id='two'>
            <p>score</p>
          </div>
          <div className='title-item' id='three'>
            <p>location</p>
          </div>
        </div>
      </div>
      <div className='leaderboard-list'>
        {userRankings.map((user, index) => (
          <div 
            key={user.id} 
            className={`leaderboard-item ${user.name === username ? 'highlighted-user' : ''}`} 
            ref={el => userRefs.current[user.name] = el}
          >
            <div className='rank-order'>{index + 1}</div> {/* Ranking number */}
            <div className='leaderboard-names'>
              <div className='user-image'>
                <img className='image-url' src={user.imageUrl} alt={user.name} />
              </div>
              {user.name}
            </div>
            <div className='score-item'>{user.score}</div>
            <div className='location-item'>{user.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
