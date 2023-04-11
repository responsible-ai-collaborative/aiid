exports = async (input) => {

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

    const loginResponseJSON = EJSON.parse(loginResponse.body.text());

    let response = null;

    const url = `https://realm.mongodb.com/api/admin/v3.0/groups/${groupId}/apps/${appId}${input.path}`;
    const headers = { "Authorization": [`Bearer ${loginResponseJSON.access_token}`] };

    if (input.method == 'GET') {

        const result = await context.http.get({ url, headers });

        response = EJSON.parse(result.body.text());
    }
    else {

        throw `Unsupported method ${input.method}`;
    }

    return response;
}

if (typeof module === 'object') {
    module.exports = exports;
}