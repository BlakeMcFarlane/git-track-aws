const fetch = (...args) => 
    import ('node-fetch').then(({default: fetch}) => fetch(...args))


const CLIENT_ID = "aab216eddd2d26ddfc43";
const CLIENT_SECRET = "2a8b41295cceb3958c458b4934b9a9bc771a76ac";

exports.handler = async (event) => {
    const code = event.queryStringParameters.code;

    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + code;

    try {
        const response = await fetch("https://github.com/login/oauth/access_token" + params, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        console.log("DATA: "+data);

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
        console.log("EERROORR: "+data);
        return {
            statusCode: 500,
            body: JSON.stringify({  message: error })
        };
    }
};
 