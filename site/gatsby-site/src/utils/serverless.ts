export const createResponse = () => {

    let responseHeaders = { 'Content-Type': 'application/json' }
    let response = {}

    const res = {
        getHeader: (name) => {
            return responseHeaders[name]
        },
        setHeader: (name, value) => {
            if (name.toLowerCase() === 'set-cookie') {
                response.multiValueHeaders = {
                    ...response.multiValueHeaders,
                    'Set-Cookie': Array.isArray(value) ? value : [value]
                }
            } else {
                responseHeaders[name] = Array.isArray(value) ? value.join(',') : value
                response.headers = responseHeaders
            }
        },
        status: (statusCode) => {
            response.statusCode = statusCode
            return res
        },
        send: (body) => {
            response.body = typeof body === 'string' ? body : JSON.stringify(body)
        },
        json: (json) => {
            response.body = JSON.stringify(json)
        },
        redirect: (statusOrUrl, url) => {
            const statusCode = typeof statusOrUrl === 'number' ? statusOrUrl : 302
            const redirectUrl = typeof statusOrUrl === 'string' ? statusOrUrl : url
            response.statusCode = statusCode
            responseHeaders.Location = redirectUrl
            response.headers = responseHeaders
        },
        end: () => { },
        getResponse: () => response,
        getResponseHeaders: () => responseHeaders,
    }

    return res
}
