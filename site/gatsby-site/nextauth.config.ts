import { MongoClient, ServerApiVersion } from "mongodb"
import { NextAuthOptions } from "next-auth"
import config from './server/config'
import { sendEmail } from "./server/emails"
import { AdapterUser } from "next-auth/adapters"
import { MongoDBAdapter } from "./server/MongoDBAdapter"

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

export const getAuthConfig = async (req: any): Promise<NextAuthOptions> => {

  return {
    providers: [
      // @ts-ignore
      {
        id: "http-email",
        name: "Email",
        type: "email",
        maxAge: 60 * 60 * 24, // Email link will expire in 24 hours
        async sendVerificationRequest({ identifier: email, url }: { identifier: string, url: string }) {

          const interstitial = `${config.SITE_URL}/magic-link?link=${encodeURIComponent(url)}`;

          const user = await client.db('auth').collection('users').findOne({ email });

          if (user) {

            await sendEmail({
              recipient: { email },
              subject: 'Secure link to log in to AIID',
              templateId: 'Login',
              dynamicData: { magicLink: `<a href="${interstitial}">${interstitial}</a>` },
            })
          }
          else {

            await sendEmail({
              recipient: { email },
              subject: 'Secure link to create your AIID account',
              templateId: 'Signup',
              dynamicData: { magicLink: `<a href="${interstitial}">${interstitial}</a>` },
            })
          }
        }
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
      /**
      * Custom sign-in callback for NextAuth
      * 
      * NextAuth doesn't natively differentiate between signup and signin operations.
      * To handle this, we:
      * 1. Pass an 'operation' parameter from the client side signin call
      * 2. Check if the user's email is verified when they attempt to sign in
      * 3. If unverified and operation='signin', return a URL string that stops the signin flow
      *    but appears identical to a successful flow (for security)
      * 
      * The URL return value is treated by NextAuth as a redirect, which prevents the
      * signin flow from completing while maintaining consistent behavior whether the
      * email is verified or not. This avoids leaking information about email verification
      * status through different error flows.
      * 
      * @param {Object} params - NextAuth signIn callback parameters
      * @param {User} params.user - The user attempting to sign in
      * @returns {Promise<string | boolean>} 
      *   - Returns true to allow sign in
      *   - Returns URL string to gracefully stop signin while appearing successful
      */
      async signIn({ user }) {

        if (!(user as AdapterUser).emailVerified && req?.query?.operation == 'login') {

          return config.SITE_URL + '/api/auth/verify-request?provider=http-email&type=email'
        }

        return true;
      },

      async session({ session, user }) {

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
      error: '/auth-error',
    },
    secret: config.NEXTAUTH_SECRET!,
    debug: config.NEXTAUTH_URL! === 'http://localhost:8000' && !process.env.CI,
  }
}