import React from 'react';
import '../styling/language-focus.css';
import { ReactComponent as GitHubLogo } from '../assets/github.svg'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const LanguageFocus = ({ language, languageRatio, repos, isLoading }) => {

    const MAX_LENGTH_FOR_LARGE_FONT = 10; // Set your threshold
    const largeFontSize = '10px'; // Larger font size
    const smallFontSize = '1px'; // Smaller font size


    return (
        <SkeletonTheme baseColor='#393f44' highlightColor='#666666' duration={2} >
        <div className='lang-container'>
            <div className='header'>
                {isLoading ? (<Skeleton className='language-skeleton'/>):
                (<h1>{language}</h1>)
                }
                <div className='ratio-container'>
                    <div className='ratio'>
                        <p>{languageRatio}</p><h2>%</h2>
                    </div>
                </div>
            </div>
            <div className='lang-body'>

            </div>
            <div className='repos'>
                <div className='repo'>
                    <p>top repo</p>
                    <div className='top-repo'>
                        {repos && repos.length > 0 ? (
                            repos.map((repo, index) => {
                                // Determine the font size for each repo name
                                const fontSize = repo.name.length <= MAX_LENGTH_FOR_LARGE_FONT ? largeFontSize : smallFontSize;
                                return (
                                    <a href={`//github.com/${repo.full_name}`} key={index}>
                                        <div className='repo-item' style={{ fontSize: fontSize }}>
                                            <GitHubLogo className='git-logo'/>
                                            <p>{repo ? repo.name : 'No Name'}</p>
                                        </div>
                                    </a>
                                );
                            })
                        ) : (
                            <p>loading</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </SkeletonTheme>
    );
    
};

export default LanguageFocus;
