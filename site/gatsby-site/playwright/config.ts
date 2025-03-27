import validateEnv from '../src/utils/validateEnv'

type ConfigType = {
    IS_EMPTY_ENVIRONMENT: string;
    AVAILABLE_LANGUAGES?: string;
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;
    SITE_URL?: string;
};

const config: ConfigType = {
    IS_EMPTY_ENVIRONMENT: process.env.IS_EMPTY_ENVIRONMENT || 'false',
    AVAILABLE_LANGUAGES: process.env.GATSBY_AVAILABLE_LANGUAGES!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    SITE_URL: process.env.SITE_URL,
}

validateEnv(config);

export default config;