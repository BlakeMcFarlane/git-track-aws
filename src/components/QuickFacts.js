import React, { useState, useEffect } from 'react';
import '../styling/quick-facts.css';

// Skeleton library
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const QuickFacts = ({ userRepos, userRank, suffix, isLoading }) => {
    const [totalCommits, setTotalCommits] = useState(0);
    const [languages, setLanguages] = useState([]);
    const [forks, setForks] = useState(0)

    useEffect(() => {

        let total = 0;
        let allLanguages = new Set();

        let totalForks = 0;
        
        userRepos.forEach(repo => {
            if (repo.totalCommits)
                total += repo.totalCommits
            Object.keys(repo.languages || {}).forEach(language => {
                allLanguages.add(language);  
            });
            totalForks += repo.forks_count
        });

        setTotalCommits(Number(total));
        setLanguages([...allLanguages]); 
        setForks(totalForks)

    }, [userRepos]);

    return (
        <SkeletonTheme baseColor='#393f44' highlightColor='#666666' duration={2} borderRadius={15}>
            <div className='facts-container'>
                {isLoading ? (
                    <>
                        <div className='fact-box'><Skeleton className='fact-box-skeleton' /></div>
                        <div className='fact-box'><Skeleton className='fact-box-skeleton' /></div>
                        <div className='fact-box'><Skeleton className='fact-box-skeleton' /></div>
                        <div className='fact-box'><Skeleton className='fact-box-skeleton' /></div>
                    </>
                ) : (
                    <>
                        <div className='fact-box'>
                            <h1>{totalCommits}</h1>
                            <p>commits</p>
                        </div>
                        <div className='fact-box'>
                            <h1>{forks}</h1>
                            <p>forks</p>
                        </div>
                        <div className='fact-box'>
                            <h1>{languages.length}</h1>
                            <p>languages</p>
                        </div>
                        <div className='fact-box'>
                            <div className='rank'>
                                <h1>{userRank}</h1>
                                <p>{suffix}</p>
                            </div>
                            <p>rank</p>
                        </div>
                    </>
                )}
            </div>
        </SkeletonTheme>
    );
    
    }


export default QuickFacts