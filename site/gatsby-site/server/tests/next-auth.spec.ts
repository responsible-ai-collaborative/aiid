const { handler } = require('../../netlify/functions/auth');
import { HandlerEvent, HandlerContext } from '@netlify/functions'
import * as emails from '../emails';
import { getCollection, seedFixture } from './utils';
import config from '../config';
import { ObjectId } from 'bson';

function mockAuthEmailEvent(operation: string, email: string, callbackUrl: string,): Partial<HandlerEvent> {

    const encodedEmail = encodeURIComponent(email);
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return {
        path: "/api/auth/signin/http-email",
        rawUrl: "http://localhost:8000/api/auth/signin/http-email",
        httpMethod: "POST",
        queryStringParameters: {
            operation,
        },
        headers: {
            cookie: `next-auth.callback-url=${encodedCallbackUrl}; next-auth.csrf-token=3fc5b5ba3bb4457090ea32b335e69294637dca5a9473dcc669a4ed00cdadf199%7C1ecd6e1064b23beb6a1e215165a586be0a08bed2d588cc0a440ab3e43c4d2e87`,
            connection: "close",
            origin: "http://localhost:8000",
            "content-length": "181",
            "content-type": "application/x-www-form-urlencoded",
            referer: "http://localhost:8000/signup/",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.5",
            accept: "*/*",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0",
            host: "localhost:8000",
        },
        body: `email=${encodedEmail}&redirect=false&callbackUrl=${encodedCallbackUrl}&csrfToken=3fc5b5ba3bb4457090ea32b335e69294637dca5a9473dcc669a4ed00cdadf199&json=true`,
    }
}

function mockMagicLinkEvent(email: string, token: string, callbackUrl: string): Partial<HandlerEvent> {

    return {
        path: "/api/auth/callback/http-email",
        httpMethod: "GET",
        rawUrl: `http://localhost:8000/api/auth/callback/http-email?callbackUrl=${encodeURIComponent(callbackUrl)}&token=${token}&email=${encodeURIComponent(email)}`,
        queryStringParameters: {
            callbackUrl,
            token,
            email,
        },
        headers: {
            cookie: "",
            connection: "close",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.5",
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0",
            host: "localhost:8000",
        },
        body: undefined,
    }
}

function mockAuthSessionEvent(sessionToken: string): Partial<HandlerEvent> {

    const encodedCallbackUrl = encodeURIComponent('/');

    return {
        path: "/api/auth/session",
        httpMethod: "GET",
        queryStringParameters: {},
        rawUrl: `http://localhost:8000/api/auth/session`,
        headers: {
            cookie: `next-auth.session-token=${sessionToken}; next-auth.callback-url=${encodedCallbackUrl}; next-auth.csrf-token=3fc5b5ba3bb4457090ea32b335e69294637dca5a9473dcc669a4ed00cdadf199%7C1ecd6e1064b23beb6a1e215165a586be0a08bed2d588cc0a440ab3e43c4d2e87`,
            connection: "close",
            origin: "http://localhost:8000",
            "content-length": "181",
            "content-type": "application/x-www-form-urlencoded",
            referer: "http://localhost:8000/signup/",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.5",
            accept: "*/*",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:134.0) Gecko/20100101 Firefox/134.0",
            host: "localhost:8000",
        },
        body: ``,
    }
}



describe('Auth', () => {

    describe('Login', () => {

        test('Should not send an magic link email to unregistered users and to add them to the database', async () => {

            await seedFixture({
                auth: {
                    users: [],
                },
            });


            const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();

            const event = mockAuthEmailEvent('login', 'test.user@incidentdatabase.ai', '/');

            const response = await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).not.toHaveBeenCalled();
            expect(response).toMatchObject({
                statusCode: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: config.SITE_URL + '/api/auth/verify-request?provider=http-email&type=email' }),
            });

            const users = await getCollection('auth', 'users').find({}).toArray();

            expect(users).toHaveLength(0);
        });

        test('Should send an magic link email to registered users', async () => {

            const email = "test.user@incidentdatabase.ai";

            await seedFixture({
                auth: {
                    users: [
                        { email, emailVerified: new Date().toString() }
                    ],
                },
            });

            const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();
            const event = mockAuthEmailEvent('login', email, '/');

            const response = await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).toHaveBeenCalledWith({
                dynamicData: {
                    magicLink: expect.stringMatching(/^<a href="http:\/\/localhost:8000\/magic-link\?link=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Fcallback%2Fhttp-email.*<\/a>$/),
                },
                recipient: {
                    email: "test.user@incidentdatabase.ai",
                },
                subject: "Secure link to log in to AIID",
                templateId: "Login",

            });

            expect(response).toMatchObject({
                statusCode: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: config.SITE_URL + '/api/auth/verify-request?provider=http-email&type=email' }),
            });

            const users = await getCollection('auth', 'users').find({}).toArray();

            expect(users).toMatchObject([
                {
                    email: "test.user@incidentdatabase.ai",
                    emailVerified: expect.any(String),
                }
            ]);
        });

        test('Should forward callbackUrl', async () => {

            const email = "test.user@incidentdatabase.ai";
            const callbackUrl = '/some-path/some-page';

            await seedFixture({
                auth: {
                    users: [
                        { email, emailVerified: new Date().toString() }
                    ],
                },
            });

            const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();
            const event = mockAuthEmailEvent('login', email, callbackUrl);

            await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).toHaveBeenCalledWith({
                dynamicData: {
                    magicLink: expect.stringMatching(/^<a href="http:\/\/localhost:8000\/magic-link\?link=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Fcallback%2Fhttp-email.*<\/a>$/),
                },
                recipient: {
                    email: "test.user@incidentdatabase.ai",
                },
                subject: "Secure link to log in to AIID",
                templateId: "Login",

            });
        });
    });

    describe('Signup', () => {

        test('Should send a Sign nup link email to unregistered users', async () => {

            const email = "test.user@incidentdatabase.ai";

            await seedFixture({
                auth: {
                    users: [],
                    verification_tokens: [],
                },
            });

            const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();
            const event = mockAuthEmailEvent('signup', email, '/');

            const response = await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).toHaveBeenCalledWith({
                dynamicData: {
                    magicLink: expect.stringMatching(/^<a href="http:\/\/localhost:8000\/magic-link\?link=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Fcallback%2Fhttp-email.*<\/a>$/),
                },
                recipient: {
                    email: "test.user@incidentdatabase.ai",
                },
                subject: "Secure link to create your AIID account",
                templateId: "Signup",
            });

            expect(response).toMatchObject({
                statusCode: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: config.SITE_URL + '/api/auth/verify-request?provider=http-email&type=email' }),
            });

            const users = await getCollection('auth', 'users').find({}).toArray();
            expect(users).toMatchObject([]);

            const tokens = await getCollection('auth', 'verification_tokens').find({}).toArray();
            expect(tokens).toMatchObject([{ identifier: email, }]);
        });

        test('Should send a Sign in link email to registered users', async () => {

            const email = "test.user@incidentdatabase.ai";

            await seedFixture({
                auth: {
                    users: [
                        { email, emailVerified: new Date().toString() }
                    ],
                    verification_tokens: [],
                },
            });

            const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();
            const event = mockAuthEmailEvent('signup', email, '/');

            const response = await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).toHaveBeenCalledWith({
                dynamicData: {
                    magicLink: expect.stringMatching(/^<a href="http:\/\/localhost:8000\/magic-link\?link=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Fcallback%2Fhttp-email.*<\/a>$/),
                },
                recipient: {
                    email: "test.user@incidentdatabase.ai",
                },
                subject: "Secure link to log in to AIID",
                templateId: "Login",
            });

            expect(response).toMatchObject({
                statusCode: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: config.SITE_URL + '/api/auth/verify-request?provider=http-email&type=email' }),
            });

            const tokens = await getCollection('auth', 'verification_tokens').find({}).toArray();
            expect(tokens).toMatchObject([{ identifier: email, }]);
        });

        test('Should forward callbackUrl', async () => {

            const email = "test.user@incidentdatabase.ai";
            const callbackUrl = '/some-path/some-page';

            await seedFixture({
                auth: {
                    users: [
                    ],
                },
            });

            const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();
            const event = mockAuthEmailEvent('signup', email, callbackUrl);

            await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).toHaveBeenCalledWith({
                dynamicData: {
                    magicLink: expect.stringMatching(/^<a href="http:\/\/localhost:8000\/magic-link\?link=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Fauth%2Fcallback%2Fhttp-email.*<\/a>$/),
                },
                recipient: {
                    email: "test.user@incidentdatabase.ai",
                },
                subject: "Secure link to create your AIID account",
                templateId: "Signup",
            });
        });

    });

    describe('Callbacks', () => {

        test('Should verify the email and create a user with the appropriate userId', async () => {

            const email = "test.user@incidentdatabase.ai";
            // hashed token gets sent in the magic link email
            const hashedToken = '4456ea1edd2d80807c5722de9fa3584ba7b2f9c4b12984ae00f500ddb41d378e';
            // token stored in the database
            const token = 'afffee2a9c99aacb855bf822fbddc770dd455448111ca75adc0727f7dd81c0c8';

            await seedFixture({
                auth: {
                    users: [],
                    verification_tokens: [
                        { identifier: email, token, expires: new Date(new Date().getTime() + 1000 * 60 * 60).toString() }
                    ],
                },
                customData: {
                    users: [],
                }
            });

            const event = mockMagicLinkEvent(email, hashedToken, '/');

            const response = await handler(event as HandlerEvent, {} as HandlerContext);

            expect(response).toMatchObject({
                statusCode: 302,
                headers: {
                    Location: '/account?callbackUrl=http%3A%2F%2Flocalhost%3A8000%2F',
                },
            });

            const users = await getCollection('auth', 'users').find({}).toArray();

            expect(users).toMatchObject([{ email }]);


            const customDataUsers = await getCollection('customData', 'users').find({}).toArray();

            expect(customDataUsers).toMatchObject([{
                userId: users[0]._id.toString(),
                roles: ['subscriber'],
            }]);
        });

        test('Should return enriched session data when hitting session endpoint', async () => {
            const userId = new ObjectId('5f9f1b3b1c9d440000000000');
            const email = 'test.user@incidentdatabase.ai';
            const sessionToken = 'f59bedfb-f318-4b55-ad29-9887abba8f06'
            const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

            await seedFixture({
                auth: {
                    users: [{
                        _id: userId,
                        email,
                        emailVerified: new Date(),
                    }],
                    sessions: [{
                        userId,
                        sessionToken,
                        expires,
                    }]
                },
                customData: {
                    users: [{
                        userId: userId.toHexString(),
                        roles: ['subscriber', 'editor'],
                        first_name: 'Test',
                        last_name: 'User'
                    }]
                }
            });

            const event = mockAuthSessionEvent(sessionToken);

            const response = await handler(event as HandlerEvent, {} as HandlerContext);

            expect(response).toMatchObject({
                body: JSON.stringify({
                    user: {
                        email,
                        id: userId,
                        roles: ['subscriber', 'editor'],
                        first_name: 'Test',
                        last_name: 'User'
                    },
                    expires: expires.toISOString(),
                }),
            });
        });

        test('Should return null session when no valid session exists', async () => {

            const event = mockAuthSessionEvent('fake-session-token');

            const response = await handler(event as HandlerEvent, {} as HandlerContext);

            expect(response).toMatchObject({
                body: `{}`,
                statusCode: 200,
            });
        });
    });

});
