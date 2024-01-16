import React from 'react';
import Navbar from '../components/Navbar';
import HomePage from './HomePage';
import '../styling/user-page-wrapper.css';
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import {
  userByName,
  usersByScore
} from '../graphql/queries'; 
import {
  createUserLeaderboard as createUserLeaderboardMutation,
} from '../graphql/mutations';

const client = generateClient();


const UserPageWrapper = () => {
    const [userData, setUserData] = useState({});                   // JSON     {}
    const [userRepos, setUserRepos] = useState([]);                 // Array    []

    const [searchUserData, setSearchUserData] = useState(null);     // JSON     {}
    const [searchRepoData, setSearchRepoData] = useState([]);       // Array    []

    const [users, setUsers] = useState([]);               // GraphQL API Leaderboard | Array of objects
    const [rerender, setRerender] = useState(false)       

    const [userRank, setUserRank] = useState(0)
    const [suffix, setSuffix] = useState('th');
    const [isLoading, setIsLoading] = useState(false);

    const [lastEvent, setLastEvent] = useState(false);



    // Gets authentification token on first mount
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
                }
                })
                setRerender(!rerender)
            }
            getAccessToken()
        }
    }, [])

    // Handles user data and repo states
    useEffect(() => {
        // Fetches user and repo data
        const fetchData = async () => {
            setIsLoading(true); // Start loading

            let userInfo;               // User Info
            let repoScoreInfo;          // User repository Score
            let userRepoData
            try {
                // User searched in a user in navbar
                if (searchUserData){
                    if (searchUserData.message === "Not Found") {
                        return (<div>user not found</div>)
                    }
                    userInfo = searchUserData;
                    fetchUsers(userInfo.login)
                }
                // UserData is empty
                else if (Object.keys(userData).length === 0){
                    userInfo = await getUserData();
                    fetchUsers(userInfo.login)
                    userRepoData = await getRepoData(userInfo.login)
                    repoScoreInfo = await getRepoScoreInfo(userRepoData)
                    userExist(userInfo.login, userInfo.avatar_url, repoScoreInfo, userInfo.location)
                }
                // UserData is not empty - user clicked profile icon in navbar
                else {
                    fetchUsers(userData.login)
                    setIsLoading(false); // Start loading

                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [searchUserData, rerender, ]);       // 
    

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
            await createUser(username, profile_pic, repoScoreInfo, location)
            fetchUsers(username);
        }
        } catch (error) {
        console.error('Error in userExist:', error);
        }
    }
    
    // This function generates the GraphQL leaderboard
    async function fetchUsers(username) {
        let userRank;
        getUserActivity(username)
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

            getSuffix(userRank);
            setUserRank(userRank);

            console.log("User Rank: ", userRank); // Add this line to log the rank
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    // Gets the suffix related to the users rank.
    async function getSuffix(userRank) {
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
    };

    // Creates user for leaderboard         -   Takes [username, profile picture, score, location]
    async function createUser(username, profile_pic, repoScoreInfo, location) {
        let score = 0;
        // Adds each value from { repoScoreInfo } to the score
        Object.values(repoScoreInfo).forEach(value => {
            score += Number(value);
        })

        // Truncate decimal     float -> int
        let scoreint = Math.floor(score)           

        const userToCreate = {                          // ex:
            name: username,                             // name:        BlakeMcFarlane
            score: Number(scoreint),                    // score:       123
            imageUrl: profile_pic,                      // imageUrl:    https://avatars.githubusercontent.com/u/102777146?v=4              
            type: "userLeaderboard",                    // type:        userLeaderboard
            location: location                          // location:    Tampa Fl
        };
        try {
            // Specify user to create
            const newUser = await client.graphql({
                query: createUserLeaderboardMutation,
                variables: { input: userToCreate }
        });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }


    // Gets the original users github user data *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   * 
    const getUserData = async () => {
        const response = await fetch("https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getUserData", {
            method: "GET",
            headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        let data = await response.json();
        setUserData(data);              //      *   Set original users data     * 

        // Return user data JSON
        return data;            
    }

    // Gets the original users repository data
    const getRepoData = async (username) => {
        const response = await fetch(`https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getRepoData/${username}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken")}
        });

        if (!response.ok) 
            throw new Error('Failed to fetch repository data');

        const data = await response.json();

        setUserRepos(data);             //      *   Set original users repository data     *       

        // Return repo data JSON
        return data
    }
    //  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *  *   *   *   *   *   *   *   *   *   *   


    // This function takes in repository JSON and calculates the repo scored needed for the leaderboard
    const getRepoScoreInfo = async (data) => {
        let reposSize=0;

        // Iterates through each repository
        for (let i=0; i<data.length; i++){
            if (data[i].languages){
                reposSize += Object.keys(data[i].languages).length
            }
            reposSize += data[i].size / 10000;
            if (data[i].forks > 0){
                reposSize += (data[i].forks / 2)
            }
            if (data[i].description){
                reposSize += 5
            }
            if (data[i].watchers){
                reposSize += (data[i].watchers / 2)
            }

        }
        const allRepoData = {
            length: 10 * data.length,    // Number of repos
            size: reposSize,             // Size of all repos [languages per repo, forks per repo, description]
        }
        setIsLoading(false);            // End loading 
        return allRepoData
    }

    // Retrieves the activity status of the user
    const getUserActivity = async (username) => {
        const activityResponse = await fetch(`https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getLastActivity/${username}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            }
        })
        if (!activityResponse.ok)
            throw new Error('Failed to get users activity');

        const usersActivity = await activityResponse.json()

        let last_event_time;

        if (usersActivity[0])
            last_event_time = usersActivity[0].created_at
            const activityDate = new Date(last_event_time)

        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);



        if (activityDate > oneWeekAgo) 
            setLastEvent(true)
        else
            setLastEvent(false)

    }

    // Callback method invoked on 'profile icon' click.
    const resetToOriginalUser = () => {
        setSearchUserData(null);        // Resetting the searched user data
        setSearchRepoData([]);          // Resetting the searched user repo data
    };


    // Function invoke on user search
    const handleSearch = async (username) => {
        try {
            // Fetching user data from GitHub API
            const userDataResponse = await fetch(`https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getSearchUserData/${username}`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("accessToken")
                }
            });
            if (!userDataResponse.ok)
                throw new Error('Failed to fetch user data');
            const searchedUser = await userDataResponse.json()
            setSearchUserData(searchedUser)

            // Fetching user repos from GitHub API
            const userRepoResponse = await fetch(`https://6xsg7yktw4.execute-api.us-east-2.amazonaws.com/staging/getRepoData/${username}`, {
                method: "GET",
                headers: { "Authorization": "Bearer " + localStorage.getItem("accessToken") }
            });

            if (!userRepoResponse.ok) 
                throw new Error('Failed to fetch repository data');
            const data = await userRepoResponse.json();
            setSearchRepoData(data);

            let repoScoreInfo = await getRepoScoreInfo(data)

            userExist(searchedUser.login, searchedUser.avatar_url, repoScoreInfo, searchedUser.location)


        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
        setIsLoading(false); // Start loading
    };

    return (
            <div className='page-wrapper'>
                <div className='page-main'>
                    <Navbar onSearch={ handleSearch } onReset={ resetToOriginalUser }/>
                    {
                        searchUserData ?
                        (<HomePage userData={ searchUserData } userRepos={ searchRepoData } users={ users } userRank={ userRank } suffix={ suffix } isLoading={ isLoading } lastEvent={ lastEvent }/>)
                        :
                        (<HomePage userData={ userData } userRepos={ userRepos } users={ users } userRank={ userRank } suffix={ suffix } isLoading={ isLoading } lastEvent={ lastEvent }/>)
                    }
                </div>
            </div>
    );
    };

export default UserPageWrapper;
