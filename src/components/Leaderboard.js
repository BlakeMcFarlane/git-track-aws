import React from 'react';
import '../styling/leaderboard.css';

const Leaderboard = ({ userRankings }) => {

  return (
    <div className='leaderboard-container'>
      <div className='label'>
        <h1>Leaderboard</h1>
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
        {userRankings.map(user => (
          <div key={user.id} className='leaderboard-item'>
            <div className='leaderboard-names'>
              <div className='user-image'>
                <img className='image-url' src={user.imageUrl} />
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
