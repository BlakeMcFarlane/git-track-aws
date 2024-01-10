
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {

    const username = event.headers.username;
    const authHeader = event.headers.Authorization || event.headers.authorization

    try {
        const followingList = await fetch(`https://api.github.com/users/${username}/following`, {
            method: "GET",
            headers: { "Authorization": authHeader }
        })
        const following = await followingList.json()

        const followersList = await fetch(`https://api.github.com/users/${username}/followers`, {
            method: "GET",
            headers: { "Authorization": authHeader}
        })
        const followers = await followersList.json()

        
        return {
            statusCode: 200,
              headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
              },
            body: JSON.stringify(following),
        };
    }
    
};
