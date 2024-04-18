import { z } from 'zod';
import { createEnv } from './utils';

const config = createEnv({
    server: {
        REALM_APP_ID: z.string().min(1),
        REALM_API_APP_ID: z.string().min(1),
        REALM_API_GROUP_ID: z.string().min(1),
        REALM_API_PUBLIC_KEY: z.string().min(1),
        REALM_API_PRIVATE_KEY: z.string().min(1),
        REALM_GRAPHQL_API_KEY: z.string().min(1),
        MONGODB_CONNECTION_STRING: z.string().min(1),
        E2E_ADMIN_USERNAME: z.string().min(1),
        E2E_ADMIN_PASSWORD: z.string().min(1),
    },
    runtimeEnvStrict: {
        E2E_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD,
        E2E_ADMIN_USERNAME: process.env.E2E_ADMIN_USERNAME,
        REALM_API_APP_ID: process.env.REALM_API_APP_ID,
        REALM_API_GROUP_ID: process.env.REALM_API_GROUP_ID,
        REALM_API_PRIVATE_KEY: process.env.REALM_API_PRIVATE_KEY,
        REALM_API_PUBLIC_KEY: process.env.REALM_API_PUBLIC_KEY,
        REALM_GRAPHQL_API_KEY: process.env.REALM_GRAPHQL_API_KEY,
        REALM_APP_ID: process.env.REALM_APP_ID,
        MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
    }
});

export default config;