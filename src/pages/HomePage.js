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

// Skeleton library


const client = generateClient();


const HomePage = ({ searchUserData, searchUserRepos }) => {
  const [users, setUsers] = useState([]);               // GraphQL API Leaderboard | Array of objects
  const [rerender, setRerender] = useState(false)       
  const [userData, setUserData] = useState({})
  const [userRepos, setUserRepos] = useState([])
  const [userRank, setUserRank] = useState(0)
  const [suffix, setSuffix] = useState('th');
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const codeParam = urlParams.get('code')

    if (codeParam && (localStorage.getItem("accessToken") === null)){
      async function getAccessToken() {
        await fetch("https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getAccessToken?code=" + codeParam, {
          method:"GET"
        }).then((response) => {
          return response.json()
        }).then((data) => {
          if(data.access_token) {
            localStorage.setItem("accessToken", data.access_token)
            setRerender(!rerender)
          }
        })
      }
      getAccessToken()
    }

    // Fetches user and repo data
    const fetchData = async () => {
      setIsLoading(true); // Start loading

      let userInfo;
      let repoScoreInfo;
      try {
        if (searchUserData){
          userInfo = await searchUserDataSet(searchUserData);
          fetchUsers(userInfo.login)
        }
        else {
          userInfo = await getUserData();
          fetchUsers(userInfo.login)
        }
        repoScoreInfo = await getRepoData(userInfo.login)
        userExist(userInfo.login, userInfo.avatar_url, repoScoreInfo, userInfo.location)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false); // End loading
    };
    fetchData();

  }, [searchUserData, ]);
  
  async function searchUserDataSet(searchUserData) {
    setUserData(searchUserData);
    return searchUserData
  }

  // When invoked, function checks if user is in DB, if not invokes createUser()
  async function userExist(username, profile_pic, repoScoreInfo, location) {
    try {
      // Query the user by name from GraphQL DB
      const curUser = await client.graphql({ 
        query: userByName,
        variables: { name: username }
      });
  
      // Checks if user was found in DB
      if (curUser.data.userByName.items.length > 0) {
        fetchUsers(username);
      } else {      
        // Creates user if not found in leaderboard database
        await createUser(username, profile_pic, repoScoreInfo, location).then(fetchUsers)
        fetchUsers(username);
      }
    } catch (error) {
      console.error('Error in userExist:', error);
    }
  }
  
  // This function generates the GraphQL leaderboard
  async function fetchUsers(username) {
    let userRank;
    try {
      // Query all users and sort by score from highest to lowest
      const userData = await client.graphql({ 
          query: usersByScore,
          variables: { type: "userLeaderboard", sortDirection: "DESC" }
      });
      const usersFromAPI = userData.data.usersByScore.items;
      setUsers(usersFromAPI);

      // Find the index of the user with the matching name
      userRank = usersFromAPI.findIndex(user => user.name === username) + 1;

      // Logic required to get suffix 
      const j = userRank % 10;
      const k = userRank % 100;
      
      if (j === 1 && k !== 11) {
        setSuffix("st");
      }
      else if (j === 2 && k !== 12) {
        setSuffix("nd");
      }
      else if (j === 3 && k !== 13) {
        setSuffix("rd");
      }
      else
        setSuffix("th")
    
      setUserRank(userRank);

      console.log("User Rank: ", userRank); // Add this line to log the rank
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
    try {
      const newUser = await client.graphql({
        query: createUserLeaderboardMutation,
        variables: { input: userToCreate }
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
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
    setUserRepos(data);
    console.log("DATA: +++ ", data)
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
          <QuickFacts userRepos={ searchUserRepos } userRank={ userRank } suffix={ suffix } isLoading={isLoading}/>
        ) : (
          <QuickFacts userRepos={ userRepos } userRank={ userRank } suffix={ suffix } isLoading={isLoading}/>
        )}
        { searchUserData ? (
          <Badges userData={ searchUserData }/>
        ) : (
          <Badges userData={ userData }/>
        )}
      </div>
      <div className='bottom-left'>
      { searchUserRepos ? (
          <Languages userRepos={ searchUserRepos } isLoading={isLoading}/>
        ) : (
          <Languages userRepos={ userRepos } isLoading={isLoading}/>
        )}
      </div>
      <div className='bottom-right'>
        <Leaderboard userRankings={ users }/>
      </div>
    </div>
  )
}

export default HomePage;
