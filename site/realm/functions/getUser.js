exports = async function (input) {

    try {

        const userResponse = await context.functions.execute('apiRequest', { method: 'GET', path: `/users/${input.userId}` });

        return userResponse.data;

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