export const createResponse = () => {

    let responseHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
    let response: Record<string, any> = {}

    const res = {
        getHeader: (name: any) => {
            return responseHeaders[name]
        },
        setHeader: (name: any, value: any) => {
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
        status: (statusCode: any) => {
            response.statusCode = statusCode
            return res
        },
        send: (body: any) => {
            response.body = typeof body === 'string' ? body : JSON.stringify(body)
        },
        json: (json: any) => {
            response.body = JSON.stringify(json)
        },
        redirect: (statusOrUrl: any, url: any) => {
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
