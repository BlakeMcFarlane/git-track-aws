import React from 'react'
import ProfileInfo from '../components/ProfileInfo'
import QuickFacts from '../components/QuickFacts'
import Badges from '../components/Badges'
import Languages from '../components/Languages'
import Leaderboard from '../components/Leaderboard'
import '../styling/home-page.css'



const HomePage = ({ userData, userRepos, suffix, isLoading, users, userRank, lastEvent }) => {


  return (
    <div className='main-container'>
      <div className='top-left'>
        <ProfileInfo userData={ userData } lastEvent={ lastEvent }/>
      </div>
      <div className='top-right'>
        <QuickFacts userRepos={ userRepos } userRank={ userRank } suffix={ suffix } isLoading={isLoading}/>
        <Badges userData={ userData }/>
      </div>
      <div className='bottom-left'>
          <Languages userRepos={ userRepos } isLoading={isLoading}/>
      </div>
      <div className='bottom-right'>
        <Leaderboard userRankings={ users } username={ userData.login }/>
      </div>
    </div>
  )
}

export default HomePage;
