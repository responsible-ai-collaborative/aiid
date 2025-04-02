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
    GATSBY_PRISMIC_REPO_NAME: string,
    PRISMIC_ACCESS_TOKEN: string,
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
    GATSBY_PRISMIC_REPO_NAME: process.env.GATSBY_PRISMIC_REPO_NAME!,
    PRISMIC_ACCESS_TOKEN: process.env.PRISMIC_ACCESS_TOKEN!,
};

validateEnv(config);

export default config;