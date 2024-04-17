import { z } from 'zod';
import { createEnv } from './utils';

const config = createEnv({
    server: {
        REALM_APP_ID: z.string().min(1),
        REALM_API_APP_ID: z.string().min(1),
        REALM_API_GROUP_ID: z.string().min(1),
        REALM_API_PUBLIC_KEY: z.string().min(1),
        REALM_API_PRIVATE_KEY: z.string().min(1),
        MONGODB_CONNECTION_STRING: z.string().min(1),
        E2E_ADMIN_USERNAME: z.string().min(1),
        E2E_ADMIN_PASSWORD: z.string().min(1),
    }, 
    runtimeEnv: process.env,
});

export default config;