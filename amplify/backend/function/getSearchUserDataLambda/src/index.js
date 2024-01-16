const fetch = (...args) => 
    import ('node-fetch').then(({default: fetch}) => fetch(...args))

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {

    const authHeader = event.headers.Authorization || event.headers.authorization;
    const username = event.pathParameters.username
    
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
            method: "GET",
            headers: { "Authorization": authHeader } 
        })
        const searchedUser = await userResponse.json();
    
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json"

            },
            body: JSON.stringify(searchedUser),
        };
    } catch (error) {
        console.error(error)

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: error })
        };
    }
};
