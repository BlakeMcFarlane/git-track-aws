const fetch = (...args) => 
    import ('node-fetch').then(({default: fetch}) => fetch(...args))


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {

    const authorizationHeader = event.headers.Authorization || event.headers.authorization;
    const username = event.pathParameters.username

    try {
        const response = await fetch(`https://api.github.com/users/${username}/events`, {
            method: "GET",
            headers: { "Authorization": authorizationHeader } 
        })

        const activity = await response.json()

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(activity),
        }

    } catch (error) {
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
