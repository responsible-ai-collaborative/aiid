export interface Config {
    REALM_API_APP_ID: string
    REALM_API_GROUP_ID: string
    REALM_API_PRIVATE_KEY: string
    REALM_API_PUBLIC_KEY: string
    REALM_GRAPHQL_API_KEY: string
    REALM_APP_ID: string
    API_MONGODB_CONNECTION_STRING: string
    ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN: string
    SENDGRID_API_KEY: string;
    SENDGRID_SENDER_NAME: string;
    SENDGRID_SENDER: string;
    PROCESS_NOTIFICATIONS_SECRET: string;
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
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY!,
    SENDGRID_SENDER_NAME: process.env.SENDGRID_SENDER_NAME!,
    SENDGRID_SENDER: process.env.SENDGRID_SENDER!,
    PROCESS_NOTIFICATIONS_SECRET: process.env.PROCESS_NOTIFICATIONS_SECRET!,
}

Object.keys(config).forEach((key) => {
    if (config[key as keyof Config] === undefined) {
        throw new Error(`Config property ${key} is undefined`);
    }
});

export default config;