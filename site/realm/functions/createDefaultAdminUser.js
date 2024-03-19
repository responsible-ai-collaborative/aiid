/**
 * This function creates the Default Admin User that is used run the tests
 * 
 * @param {string} email The email address of the user
 * @param {string} password The password of the user
 * 
*/
exports = async (input) => {

    //check if the Admin user is already created
    const usersCollection = context.services.get('mongodb-atlas').db('customData').collection('users');

    const adminUser = await usersCollection.findOne({ roles: { $in: ['admin'] } });

    // If the Admin user already exist in the database, we skip the creation
    if (adminUser) {
        return {
            status: 204,
            message: 'Admin user already exists.'
        }
    }

    const publicApiKey = context.values.get('publicApiKey');
    const privateApiKey = context.values.get('privateApiKey');
    const groupId = context.values.get('groupId');
    const appId = context.values.get('appId');

    const loginResponse = await context.http.post({
        url: 'https://services.cloud.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login',
        body: {
            username: publicApiKey,
            apiKey: privateApiKey,
        },
        encodeBodyAsJSON: true
    })

    if (loginResponse.statusCode != 200) {
        return {
            status: loginResponse.statusCode,
            message: EJSON.parse(loginResponse.body.text()).error,
        }
    }

    const loginResponseJSON = EJSON.parse(loginResponse.body.text());

    const url = `https://services.cloud.mongodb.com/api/admin/v3.0/groups/${groupId}/apps/${appId}/users`;
    const headers = { "Authorization": [`Bearer ${loginResponseJSON.access_token}`] };
    const body = {
        email: input.email,
        password: input.password,
    }

    const result = await context.http.post({
        url,
        headers,
        body,
        encodeBodyAsJSON: true,
    });

    const response = EJSON.parse(result.body.text());

    console.log('Create User API response:', JSON.stringify(response));

    // If the user was successfully created, we add the admin role
    if (response._id) {
        await usersCollection.updateOne(
            { userId: response._id },
            {
                $set: {
                    roles: ['admin'],
                    first_name: 'Test',
                    last_name: 'User',
                },
            }
        );

        return {
            status: 200,
            userId: response._id
        };
    }
    else {
        return {
            status: 500,
            message: "Can't create the Admin user.",
        }
    }
}

if (typeof module === 'object') {
    module.exports = exports;
}