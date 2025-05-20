import validateEnv from '../src/utils/validateEnv'

type ConfigType = {
    IS_EMPTY_ENVIRONMENT: string;
    AVAILABLE_LANGUAGES?: string;
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;
    SITE_URL?: string;
    GATSBY_PRISMIC_REPO_NAME?: string;
    PRISMIC_ACCESS_TOKEN?: string;
};

const config: ConfigType = {
    IS_EMPTY_ENVIRONMENT: process.env.IS_EMPTY_ENVIRONMENT || 'false',
    AVAILABLE_LANGUAGES: process.env.GATSBY_AVAILABLE_LANGUAGES!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    SITE_URL: process.env.SITE_URL,
    GATSBY_PRISMIC_REPO_NAME: process.env.GATSBY_PRISMIC_REPO_NAME!,
    PRISMIC_ACCESS_TOKEN: process.env.PRISMIC_ACCESS_TOKEN!,
}

validateEnv(config);

export default config;