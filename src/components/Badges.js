import React from 'react'
import '../styling/badges.css'

const Badges = ({ userData }) => {

  return (
    <div className='badges-container'>
        <img src={`https://ghchart.rshah.org/666666/${userData.login}`} alt="This user does not have a public chart." className='chart' />
    </div>
  )
}

export default Badges