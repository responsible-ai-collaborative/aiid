import { EmailParams, MailerSend, Recipient } from "mailersend"
import { MongoClient, ServerApiVersion } from "mongodb"
import { NextAuthOptions } from "next-auth"
import config from './server/config'

//TODO: add this to the workflow file, this  needs to be set via env variable
// SEE: https://github.com/nextauthjs/next-auth/discussions/9785

process.env.NEXTAUTH_URL = config.NEXTAUTH_URL!

const client = new MongoClient(config.API_MONGODB_CONNECTION_STRING!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

const mailersend = new MailerSend({
  apiKey: config.MAILERSEND_API_KEY!,
});

export const sendVerificationRequest = async ({ identifier: email, url }: { identifier: string, url: string }) => {

  const emailParams = new EmailParams()
    .setFrom({ email: process.env.NOTIFICATIONS_SENDER!, name: 'something' })
    .setTo([new Recipient(email)])
    .setSubject('something')
    .setText(`Please click here to authenticate - ${url}`);

  await mailersend.email.send(emailParams);
}

export const getAuthConfig = async (): Promise<NextAuthOptions> => {

  const { MongoDBAdapter } = await import("@auth/mongodb-adapter");

  return {
    providers: [
      // @ts-ignore
      {
        id: "http-email",
        name: "Email",
        type: "email",
        maxAge: 60 * 60 * 24, // Email link will expire in 24 hours
        sendVerificationRequest,
      }
    ],
    theme: {
      logo: "https://www.gatsbyjs.com/Gatsby-Monogram.svg",
      colorScheme: "light",
      brandColor: "#663399",
    },
    adapter: MongoDBAdapter(client, { databaseName: 'auth' }),
    session: {
      maxAge: 5 * 24 * 60 * 60, // 5 days
      updateAge: 24 * 60 * 60 // 24 hours
    },
    callbacks: {
      async session({ session, token, user, newSession }) {

        const customData = await client.db('customData').collection('users').findOne({ userId: user.id });

        if (session?.user && customData) {

          // @ts-ignore
          session.user.id = customData.userId;
          // @ts-ignore
          session.user.roles = customData.roles;
          // @ts-ignore
          session.user.first_name = customData.first_name;
          // @ts-ignore
          session.user.last_name = customData.last_name;
        }

        return session
      },
    },
    events: {
      createUser: async ({ user }) => {

        await client.db('customData').collection('users').updateOne(
          {
            userId: user.id
          },
          {
            $set: {
              userId: user.id,
              createdAt: new Date(),
              roles: ['subscriber'],
            }
          },
          {
            upsert: true,
          }
        )
      },
    },
    pages: {
      signIn: '/login',
      signOut: '/logout',
      verifyRequest: '/verify-request',
      newUser: '/account',
    },
    secret: config.NEXTAUTH_SECRET!,
    debug: config.NEXTAUTH_URL! === 'http://localhost:8000',
  }
}