import React from 'react'
import '../styling/languages.css'
import './LanguageFocus'
import { useState, useEffect } from 'react'
import LanguageFocus from './LanguageFocus'
import Skeleton, { SkeletonTheme} from 'react-loading-skeleton'


const findLargestReposByLanguage = (repos) => {
    const largestRepos = {};

    repos.forEach(repo => {
        Object.keys(repo.languages).forEach(language => {
            // Check if this repo is larger than the current largest repo for this language
            if (!largestRepos[language] || repo.size > largestRepos[language].size) {
                largestRepos[language] = { ...repo, language }; // Update with the new largest repo
            }
        });
    });

    return largestRepos;
};


const Languages = ({ userRepos, isLoading }) => {
    const [topLanguages, setTopLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [selectedLanguageRatio, setSelectedLanguageRatio] = useState();
    const [languageRepos, setLanguageRepos] = useState([]); // New state for repositories of the selected language
    const [largestRepoByLanguage, setLargestRepoByLanguage] = useState({});

    const colors = ['#FF6666', '#63618E', '#FFA500', '#20B2AA', '#FFD700', '#D3FFCE', '#F633FF', '#FF8833', '#33FF88', '#8833FF'];

    useEffect(() => {
        if (!userRepos) 
            return;
        else if (userRepos) {
            setLargestRepoByLanguage(findLargestReposByLanguage(userRepos));
        }

        const languageCount = {};
        let totalSize = 0;

        userRepos.forEach(repo => {
            Object.keys(repo.languages).forEach(language => {
                const languageValue = repo.languages[language];
                languageCount[language] = (languageCount[language] || 0) + languageValue;
                totalSize += languageValue;
            });
        });

        const languagePercentages = Object.fromEntries(
            Object.entries(languageCount).map(([language, count]) => [language, (count / totalSize) * 100])
        );
    
        const sortedLanguages = Object.entries(languagePercentages).sort((a, b) => b[1] - a[1]).slice(0, 6);
        setTopLanguages(sortedLanguages);

        if (sortedLanguages.length > 0) {
            setSelectedLanguage(sortedLanguages[0][0]);
            setSelectedLanguageRatio(sortedLanguages[0][1].toFixed(1));
            filterLanguageRepos(sortedLanguages[0][0]);
        }
    }, [userRepos]);

    const handleLanguageClick = (language) => {
        setSelectedLanguage(language);
        const languageData = topLanguages.find(([lang, _]) => lang === language);
        if (languageData) {
            setSelectedLanguageRatio(languageData[1].toFixed(1));
        }
    
        // Check if the largest repository for the selected language exists
        const largestRepo = largestRepoByLanguage[language];
        if (largestRepo) {
            setLanguageRepos([largestRepo]); // Pass the largest repo as an array
        } else {
            setLanguageRepos([]); // If no repo is found, pass an empty array
        }
    };
    
    

    const filterLanguageRepos = (language) => {
        const filteredRepos = userRepos.filter(repo => repo.languages.hasOwnProperty(language));
        setLanguageRepos(filteredRepos);
    };

    return (
        <SkeletonTheme baseColor='#393f44' highlightColor='#666666' duration={2} borderRadius={5}>
        <div className='language-container'>
            <div className='languages'>
                <div className='language-list'>
                    <div className='label'>
                        <h1>LANGUAGES</h1>
                    </div>
                    <div className='list'>
                        <ol className='language'>
                            {isLoading ? (
                                <>
                                    <Skeleton className='language-item-skeleton' width={80}/>
                                    <Skeleton className='language-item-skeleton' width={100}/>
                                    <Skeleton className='language-item-skeleton' width={105}/>
                                    <Skeleton className='language-item-skeleton' width={95}/>
                                    <Skeleton className='language-item-skeleton' width={120}/>
                                </>
                            ): 
                                topLanguages.map(([language, _percentage], index) => (
                                    <li key={index} className='language-item' onClick={() => handleLanguageClick(language)}>
                                        <div className='language-color' style={{ backgroundColor: colors[index % colors.length] }}></div>
                                        <a><span className='language-name'>{language}</span></a>
                                    </li>
                                ))
                            }
                        
                        </ol>
                    </div>
                </div>
                <div className='language-focus'>
                    <div className='focus'>
                    <LanguageFocus
                        language={selectedLanguage}
                        languageRatio={selectedLanguageRatio}
                        repos={largestRepoByLanguage[selectedLanguage] ? [largestRepoByLanguage[selectedLanguage]] : []}
                        isLoading={isLoading}
                    />
                    </div>
                </div>
            </div>
            <div className='language-bar-container'>
                {isLoading ? (
                    <Skeleton className='language-bar-skeleton' containerClassName='language-bar-container'/>
                ) : (
                    <div className='language-bar'>
                        {topLanguages.map(([language, percentage], index) => (
                            <div 
                                key={index} 
                                className='language-bar-item' 
                                style={{ 
                                    width: `${percentage}%`, 
                                    backgroundColor: colors[index % colors.length]
                                }}
                            >
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        </SkeletonTheme>
    )
}

export default Languages