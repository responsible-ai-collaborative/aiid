import validateEnv from '../src/utils/validateEnv';

export interface Config {
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
    API_MONGODB_CONNECTION_STRING: process.env.API_MONGODB_CONNECTION_STRING!,
    ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN: process.env.ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN!,
    MAILERSEND_API_KEY: process.env.MAILERSEND_API_KEY!,
    NOTIFICATIONS_SENDER_NAME: process.env.NOTIFICATIONS_SENDER_NAME!,
    NOTIFICATIONS_SENDER: process.env.NOTIFICATIONS_SENDER!,
    SITE_URL: process.env.SITE_URL! || process.env.URL!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
};

validateEnv(config);

export default config;