const fetch = (...args) => 
    import ('node-fetch').then(({default: fetch}) => fetch(...args))

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {

    const username = event.pathParameters.username;
    const authHeader = event.headers.Authorization || event.headers.authorization;

    try {
        const followingList = await fetch(`https://api.github.com/users/${username}/following`, {
            method: "GET",
            headers: { "Authorization": authHeader }
        })
        const following = await followingList.json()

        const followersList = await fetch(`https://api.github.com/users/${username}/followers`, {
            method: "GET",
            headers: { "Authorization": authHeader }
        })
        const followers = await followersList.json()

        const mutual = followers.filter(follower => following.some(following => following.login === follower.login));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mutual),
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
            body: JSON.stringify({ message: 'An error occurred while fetching friend data' })
        };
    }
    
};
