import React from 'react';
import '../styling/language-focus.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch, faStar } from '@fortawesome/free-solid-svg-icons';
import { Grid } from 'react-loader-spinner'


const LanguageFocus = ({ language, languageRatio, repos, isLoading }) => {

    const formatNumber = (num) => {
        return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
    };

    return (
        <SkeletonTheme baseColor='#393f44' highlightColor='#666666' duration={2} >
            <div className='lang-container'>
                <div className='header'>
                    {isLoading ? 
                    (<Skeleton className='language-skeleton'/>)
                    :
                    (<h1>{language}</h1>)
                    }
                    <div className='ratio-container'>
                        <div className='ratio'>
                            <p>{languageRatio}</p><h2>%</h2>
                        </div>
                    </div>
                </div>
                <div className='repos'>
                    <div className='repo-list'>
                        {isLoading ? (
                            <Grid
                                visible={true}
                                height="80"
                                width="80"
                                color="#666666"
                                ariaLabel="grid-loading"
                                radius="12.5"
                                wrapperStyle={{}}
                                wrapperClass="grid-wrapper"
                            />
                        ) : repos && repos.length > 0 ? (
                            repos.map((repo, index) => (
                                <a href={`//github.com/${repo.full_name}`} key={index} >
                                    <div className='repo-item'>
                                        <div className='repo-item-name'>
                                            <p>{repo.name}</p>
                                        </div>
                                        <div className='repo-item-forks'>
                                            <p>{formatNumber(repo.forks)}</p>
                                            <FontAwesomeIcon icon={faCodeBranch} className='fork-icon'/>
                                        </div>
                                        <div className='repo-item-stars'>
                                            <p>{formatNumber(repo.stargazers_count)}</p>
                                            <FontAwesomeIcon icon={faStar} className='fork-icon'/>
                                        </div>
                                    </div>
                                </a>
                                ))
                        ) : (
                            <p>No Repositories Found</p>
                        )}
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default LanguageFocus;
