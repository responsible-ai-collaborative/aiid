exports = ({
    level = 'error',  // The severity level. One of: "critical", "error", "warning", "info", "debug"
    environment = 'production', // Environment: it could be "production", "staging", "localhost"
    error, // The error object or the error message
    data // Additional data to send to Rollbar
}) => {

    const rollbarAccessToken = context.values.get('rollbarAccessToken');

    if (rollbarAccessToken) {
        context.http.post({
            url: 'https://api.rollbar.com/api/1/item/',
            headers: {
                "X-Rollbar-Access-Token": [rollbarAccessToken],
                "accept": ["application/json"],
                "content-type": ["application/json"],
            },
            body: {
                data: {
                    level,
                    environment,
                    custom: data,
                    body: {
                        message: {
                            body: error.message ? error.message : error,
                        }
                    }
                }
            },
            encodeBodyAsJSON: true,
        });
    }
};

if (typeof module === 'object') {
    module.exports = exports;
}

