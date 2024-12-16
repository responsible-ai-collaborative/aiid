import { handler } from '../../netlify/functions/auth';
import { HandlerEvent, HandlerContext } from '@netlify/functions'
import * as emails from '../emails';
import { getCollection, seedFixture } from './utils';
import config from '../config';

function mockAuthEvent(operation: string, email: string, callbackUrl: string): Partial<HandlerEvent> {

    const encodedEmail = encodeURIComponent(email);
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return {
        path: "/api/auth/signin/http-email",
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

describe('Auth', () => {

    describe('Login', () => {

        test('Should not send an magic link email to unregistered users and to add them to the database', async () => {

            await seedFixture({
                auth: {
                    users: [],
                },
            });


            const sendEmailMock = jest.spyOn(emails, 'sendEmail').mockResolvedValue();

            const event = mockAuthEvent('login', 'test.user@incidentdatabase.ai', '/');

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
            const event = mockAuthEvent('login', email, '/');

            const response = await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).toHaveBeenCalledWith({
                dynamicData: {
                    magicLink: expect.stringMatching(/^http:\/\/localhost:8000\/api\/auth\/callback\/http-email\?callbackUrl=http%3A%2F%2Flocalhost%3A8000%2F&token=.+&email=test.user%40incidentdatabase.ai$/),
                },
                recipients: [
                    {
                        email: "test.user@incidentdatabase.ai",
                    },
                ],
                subject: "Login link",
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
            const event = mockAuthEvent('login', email, callbackUrl);

            await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).toHaveBeenCalledWith({
                dynamicData: {
                    magicLink: expect.stringMatching(/^http:\/\/localhost:8000\/api\/auth\/callback\/http-email\?callbackUrl=http%3A%2F%2Flocalhost%3A8000%2Fsome-path%2Fsome-page&token=.+&email=test.user%40incidentdatabase.ai$/),
                },
                recipients: [
                    {
                        email: "test.user@incidentdatabase.ai",
                    },
                ],
                subject: "Login link",
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
            const event = mockAuthEvent('signup', email, '/');

            const response = await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).toHaveBeenCalledWith({
                dynamicData: {
                    magicLink: expect.stringMatching(/^http:\/\/localhost:8000\/api\/auth\/callback\/http-email\?callbackUrl=http%3A%2F%2Flocalhost%3A8000%2F&token=.+&email=test.user%40incidentdatabase.ai$/),
                },
                recipients: [
                    {
                        email: "test.user@incidentdatabase.ai",
                    },
                ],
                subject: "Signup link",
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
            const event = mockAuthEvent('signup', email, '/');

            const response = await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).toHaveBeenCalledWith({
                dynamicData: {
                    magicLink: expect.stringMatching(/^http:\/\/localhost:8000\/api\/auth\/callback\/http-email\?callbackUrl=http%3A%2F%2Flocalhost%3A8000%2F&token=.+&email=test.user%40incidentdatabase.ai$/),
                },
                recipients: [
                    {
                        email: "test.user@incidentdatabase.ai",
                    },
                ],
                subject: "Login link",
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
            const event = mockAuthEvent('signup', email, callbackUrl);

            await handler(event as HandlerEvent, {} as HandlerContext);

            expect(sendEmailMock).toHaveBeenCalledWith({
                dynamicData: {
                    magicLink: expect.stringMatching(/^http:\/\/localhost:8000\/api\/auth\/callback\/http-email\?callbackUrl=http%3A%2F%2Flocalhost%3A8000%2Fsome-path%2Fsome-page&token=.+&email=test.user%40incidentdatabase.ai$/),
                },
                recipients: [
                    {
                        email: "test.user@incidentdatabase.ai",
                    },
                ],
                subject: "Signup link",
                templateId: "Signup",
            });
        });

    });
});
