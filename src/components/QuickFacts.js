import React, { useState, useEffect } from 'react';
import '../styling/quick-facts.css';

// Skeleton library
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const QuickFacts = ({ userRepos, userRank, suffix, isLoading }) => {
    const [totalCommits, setTotalCommits] = useState(0);
    const [languages, setLanguages] = useState([]);

    useEffect(() => {

        let total = 0;
        let allLanguages = new Set();
        
        userRepos.forEach(repo => {
            if (repo.totalCommits)
                total += repo.totalCommits
            Object.keys(repo.languages || {}).forEach(language => {
                allLanguages.add(language);  
            });
        });
        setTotalCommits(Number(total));
        setLanguages([...allLanguages]); 
        console.log("HABABAB + ", userRepos)

    }, [userRepos] );

    return (
        <SkeletonTheme baseColor='#393f44' highlightColor='#666666' duration={2} borderRadius={15}>
            <div className='facts-container'>
                {isLoading ? (
                    <>
                        <div className='fact-box'><Skeleton height={64.5} /></div>
                        <div className='fact-box'><Skeleton height={64.5} /></div>
                        <div className='fact-box'><Skeleton height={64.5} /></div>
                        <div className='fact-box'><Skeleton height={64.5} /></div>
                    </>
                ) : (
                    <>
                        <div className='fact-box'>
                            <h1>{totalCommits}</h1>
                            <p>commits</p>
                        </div>
                        <div className='fact-box'>
                            <h1>#</h1>
                            <p>lines</p>
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