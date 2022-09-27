exports = async function (input) {

    try {
        const publicApiKey = context.values.get('publicApiKey');
        const privateApiKey = context.values.get('privateApiKey');
        const groupId = context.values.get('groupId');
        const appId = context.values.get('appId');

        const loginResponse = await context.http.post({
            url: 'https://realm.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login',
            body: {
                username: publicApiKey,
                apiKey: privateApiKey,
            },
            encodeBodyAsJSON: true
        })

        if (loginResponse.statusCode != 200) {
            return {
                status: loginResponse.statusCode,
                error: EJSON.parse(loginResponse.body.text()).error
            }
        }

        // The response body is a BSON.Binary object
        const loginResponseJSON = EJSON.parse(loginResponse.body.text());


        const userResponse = await context.http.get({
            url: `https://realm.mongodb.com/api/admin/v3.0/groups/${groupId}/apps/${appId}/users/${input.userId}`,
            headers: {
                "Authorization": [`Bearer ${loginResponseJSON.access_token}`]
            }
        })

        if (userResponse.statusCode != 200) {
            return {
                status: userResponse.statusCode,
                error: EJSON.parse(userResponse.body.text()).error
            }

        }
        // The response body is a BSON.Binary object. Parse it and return
        return EJSON.parse(userResponse.body.text()).data;

    }
    catch (e) {
        if (e.response) {
            return {
                status: e.response.status,
                message: e.response.data.error ? e.response.data.error : e.response.data
            }
        }
        else {
            return e;
        }
    }
};