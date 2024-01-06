const fetch = (...args) => 
    import ('node-fetch').then(({default: fetch}) => fetch(...args))


exports.handler = async (event) => {
    // Extract username from the pathParameters
    const username = event.pathParameters.username;
    const authHeader = event.headers.Authorization || event.headers.authorization;
    console.log("USERNAME = ", username)
    console.log("EVENT = ", event)

    try { 
        // Fetch repositories
        const repoResponse = await fetch(`https://api.github.com/users/${username}/repos`, {
            method: "GET",
            headers: { "Authorization": authHeader }
        });
        let repos = await repoResponse.json();

        if (!Array.isArray(repos)) {
            console.error("Expected an array but got:", typeof repos);
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: "Invalid response format" })
            };
        }

        // Fetch languages and commits for each repository
        const repoData = await Promise.all(repos.map(async (repo) => {
            const languagesUrl = `https://api.github.com/repos/${username}/${repo.name}/languages`;
            const commitsUrl = repo.commits_url.replace('{/sha}', '');

            const [languagesResponse, commitsResponse] = await Promise.all([
                fetch(languagesUrl, {
                    method: "GET",
                    headers: { "Authorization": authHeader }
                }),
                fetch(commitsUrl, {
                    method: "GET",
                    headers: { "Authorization": authHeader }
                })
            ]);

            const languages = await languagesResponse.json();
            const commits = await commitsResponse.json();

            return {
                ...repo,
                languages,
                totalCommits: commits.length
            };
        }));

        // Return successful response
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(repoData)
        };

    } catch (error) {
        console.error(error);
        // Return error response
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: 'An error occurred while fetching repository data' })
        };
    }
};
