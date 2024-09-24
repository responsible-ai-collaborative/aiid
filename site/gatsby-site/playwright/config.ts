type ConfigType = {
    E2E_ADMIN_PASSWORD: string;
    E2E_ADMIN_USERNAME: string;
    IS_EMPTY_ENVIRONMENT: string;
    AVAILABLE_LANGUAGES?: string;
    REALM_API_APP_ID: string,
    REALM_API_GROUP_ID: string,
    REALM_API_PRIVATE_KEY: string,
    REALM_API_PUBLIC_KEY: string,
    REALM_GRAPHQL_API_KEY: string,
    REALM_APP_ID: string,
    API_MONGODB_CONNECTION_STRING: string,
    ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN: string,
    [key: string]: string;
};

const config: ConfigType = {
    E2E_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD!,
    E2E_ADMIN_USERNAME: process.env.E2E_ADMIN_USERNAME!,
    IS_EMPTY_ENVIRONMENT: process.env.IS_EMPTY_ENVIRONMENT ?? '',
    AVAILABLE_LANGUAGES: process.env.GATSBY_AVAILABLE_LANGUAGES ?? '',
    REALM_API_APP_ID: process.env.REALM_API_APP_ID!,
    REALM_API_GROUP_ID: process.env.REALM_API_GROUP_ID!,
    REALM_API_PRIVATE_KEY: process.env.REALM_API_PRIVATE_KEY!,
    REALM_API_PUBLIC_KEY: process.env.REALM_API_PUBLIC_KEY!,
    REALM_GRAPHQL_API_KEY: process.env.REALM_GRAPHQL_API_KEY!,
    REALM_APP_ID: process.env.REALM_APP_ID!,
    API_MONGODB_CONNECTION_STRING: process.env.API_MONGODB_CONNECTION_STRING!,
    ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN: process.env.ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN!,
}

Object.keys(config).forEach((key) => {
    if (config[key] === undefined) {
        throw new Error(`Config property ${key} is undefined`);
    }
});

export default config;