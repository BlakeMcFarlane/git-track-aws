
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {

    const username = event.headers.Name || event.headers.name;
    console.log(username)
    const authHeader = event.headers.Authorization || event.headers.authorization

    try {
        const followingList = await fetch(`https://api.github.com/users/BlakeMcFarlane/following`, {
            method: "GET",
            headers: { "Authorization": authHeader }
        })
        const following = await followingList.json()
        console.log("FOLLOWING USER: ", following[0].login)
        //const followersList = await fetch(`https://api.github.com/users/${username}/followers`, {
        //    method: "GET",
        //    headers: { "Authorization": authHeader}
        //})
        //const followers = await followersList.json()

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(following),
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
