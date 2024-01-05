const fetch = require('node-fetch');

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const authorizationHeader = event.headers.Authorization || event.headers.authorization;
    
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
                "Access-Control-Allow-Origin": "https://main.d3b4yce7jxwy99.amplifyapp.com",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        };
    }
};