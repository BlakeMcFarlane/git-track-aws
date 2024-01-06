const fetch = (...args) => 
    import ('node-fetch').then(({default: fetch}) => fetch(...args))


exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const authorizationHeader = event.headers.Authorization || event.headers.authorization;
    console.log("HEADER   +  " + authorizationHeader)
    try {
        const response = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Authorization": authorizationHeader
            }
        });
        const data = await response.json();
        console.log(data);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: error })
        };
    }
};   