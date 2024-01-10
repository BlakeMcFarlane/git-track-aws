import React, { useState, useEffect } from 'react'
import ProfileInfo from '../components/ProfileInfo'
import QuickFacts from '../components/QuickFacts'
import Badges from '../components/Badges'
import Languages from '../components/Languages'
import Leaderboard from '../components/Leaderboard'
import '../styling/home-page.css'
import { generateClient } from 'aws-amplify/api';
import {
  userByName,
  usersByScore
} from '../graphql/queries'; 
import {
  createUserLeaderboard as createUserLeaderboardMutation,
} from '../graphql/mutations';


const client = generateClient();


const HomePage = ({ searchUserData, searchUserRepos }) => {
  const [users, setUsers] = useState([]);             // GraphQL API Leaderboard
  const [rerender, setRerender] = useState(false)
  const [userData, setUserData] = useState({})
  const [userRepos, setUserRepos] = useState([])
  const [userChart, setUserChart] = useState()
  const [userScore, setUserScore] = useState()


  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const codeParam = urlParams.get('code')

    if (codeParam && (localStorage.getItem("accessToken") === null)){
      async function getAccessToken() {
        console.log(codeParam + " - CODE")
        await fetch("https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getAccessToken?code=" + codeParam, {
          method:"GET"
        }).then((response) => {
          return response.json()
        }).then((data) => {
          console.log(data);
          if(data.access_token) {
            localStorage.setItem("accessToken", data.access_token)
            setRerender(!rerender)
          }
        })
      }
      getAccessToken()
    }
    
    const fetchData = async () => {
      let userInfo;
      let repoScoreInfo;
      try {
        if (searchUserData){
          userInfo = await searchUserDataSet(searchUserData)
        }
        else {
          userInfo = await getUserData();
        }
        repoScoreInfo = await getRepoData(userInfo.login)

        userExist(userInfo.login, userInfo.avatar_url, repoScoreInfo, userInfo.location)
        console.log(userInfo)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
    getUserChart(userData.login)

  }, [searchUserData]);
  
  async function searchUserDataSet(searchUserData) {
    setUserData(searchUserData);
    return searchUserData
  }

  async function userExist(username, profile_pic, repoScoreInfo, location) {
    try {
      const curUser = await client.graphql({ 
        query: userByName,
        variables: { name: username }
      });
  
      if (curUser.data.userByName.items.length > 0) {
        console.log("User exists:", curUser.data.userByName.items[0].name);
        fetchUsers();
      } else {
        console.log("User does not exist, creating user");
        await createUser(username, profile_pic, repoScoreInfo, location).then(fetchUsers)
      }
    } catch (error) {
      console.error('Error in userExist:', error);
    }
  }
  
// This function generates the GraphQL leaderboard
  async function fetchUsers() {
    try {
      const userData = await client.graphql({ 
        query: usersByScore,
        variables: { type:"userLeaderboard", sortDirection:"DESC", limit:10 }
      });
      const usersFromAPI = userData.data.usersByScore.items;
      console.log("USERS + " + usersFromAPI)
      setUsers(usersFromAPI);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }

  async function createUser(username, profile_pic, repoScoreInfo, location) {
    let score = 0;
    Object.values(repoScoreInfo).forEach(value => {
      score += Number(value);
    })
    let scoreint = Math.floor(score)
    const userToCreate = {
      name: username,
      score: Number(scoreint),
      imageUrl: profile_pic,
      type: "userLeaderboard",
      location: location
    };
    console.log("IMAGE + "+profile_pic)
    try {
      const newUser = await client.graphql({
        query: createUserLeaderboardMutation,
        variables: { input: userToCreate }
      });
      console.log('User created:', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  const getUserChart = async (username) => {
    const chartURL = <img src={`https://ghchart.rshah.org/${username}`} alt="Name Your Github chart" />
    setUserChart(chartURL)
  }


  const getUserData = async () => {
    let data;
    if(searchUserData)
      setUserData(searchUserData)
    else{
      const response = await fetch("https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getUserData", {
        method: "GET",
        headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      data = await response.json();
      setUserData(data);
    }
    return data;
  }

  const getRepoData = async (username) => {
    const response = await fetch(`https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getRepoData/${username}`, {
      method: "GET",
      headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken")}
    });

    if (!response.ok) 
      throw new Error('Failed to fetch repository data');
    const data = await response.json();
    let reposSize=0;
    for (let i=0; i<data.length; i++){
      if (data[i].languages){
        reposSize += Object.keys(data[i].languages).length
      }
      reposSize += data[i].size / 10000;
      if (data[i].forks > 0){
        reposSize += data[i].forks
      }
      if (data[i].description)
        reposSize += 1
    }
    const allRepoData = {
      length: 10 * data.length,    // Number of repos
      size: reposSize,             // Size of all repos [languages per repo, forks per repo, description]
    }
    console.log("DATA: ", Object.keys(data[0].languages).length)
    setUserRepos(data);
    return allRepoData
  }

  return (
    <div className='main-container'>
      <div className='top-left'>
        { searchUserData ? (
          <ProfileInfo userData={ searchUserData } />
        ) : (
          <ProfileInfo userData={ userData } />
        )}
      </div>
      <div className='top-right'>
        { searchUserRepos ? (
          <QuickFacts userRepos={ searchUserRepos }/>
        ) : (
          <QuickFacts userRepos={ userRepos }/>
        )}
        { searchUserData ? (
          <Badges userData={ searchUserData }/>
        ) : (
          <Badges userData={ userData }/>
        )}
      </div>
      <div className='bottom-left'>
      { searchUserRepos ? (
          <Languages userRepos={ searchUserRepos } />
        ) : (
          <Languages userRepos={ userRepos } />
        )}
      </div>
      <div className='bottom-right'>
        <Leaderboard userRankings={ users }/>
      </div>
    </div>
  )
}

export default HomePage;
