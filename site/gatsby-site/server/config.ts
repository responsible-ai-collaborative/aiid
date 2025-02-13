export interface Config {
    REALM_API_APP_ID: string
    REALM_API_GROUP_ID: string
    REALM_API_PRIVATE_KEY: string
    REALM_API_PUBLIC_KEY: string
    REALM_GRAPHQL_API_KEY: string
    REALM_APP_ID: string
    API_MONGODB_CONNECTION_STRING: string
    ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN: string
    MAILERSEND_API_KEY: string;
    NOTIFICATIONS_SENDER_NAME: string;
    NOTIFICATIONS_SENDER: string;
    SITE_URL: string;
    NEXTAUTH_URL: string,
    NEXTAUTH_SECRET: string,
};

const config: Config = {
    REALM_API_APP_ID: process.env.REALM_API_APP_ID!,
    REALM_API_GROUP_ID: process.env.REALM_API_GROUP_ID!,
    REALM_API_PRIVATE_KEY: process.env.REALM_API_PRIVATE_KEY!,
    REALM_API_PUBLIC_KEY: process.env.REALM_API_PUBLIC_KEY!,
    REALM_GRAPHQL_API_KEY: process.env.REALM_GRAPHQL_API_KEY!,
    REALM_APP_ID: process.env.REALM_APP_ID!,
    API_MONGODB_CONNECTION_STRING: process.env.API_MONGODB_CONNECTION_STRING!,
    ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN: process.env.ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN!,
    MAILERSEND_API_KEY: process.env.MAILERSEND_API_KEY!,
    NOTIFICATIONS_SENDER_NAME: process.env.NOTIFICATIONS_SENDER_NAME!,
    NOTIFICATIONS_SENDER: process.env.NOTIFICATIONS_SENDER!,
    SITE_URL: process.env.SITE_URL! || process.env.URL!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
}

Object.keys(config).forEach((key) => {
    if (config[key as keyof Config] === undefined || config[key as keyof Config] === '') {
        throw new Error(`Config property ${key} is undefined`);
    }
});

export default config;