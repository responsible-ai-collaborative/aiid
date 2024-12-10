type ConfigType = {
    E2E_ADMIN_PASSWORD: string;
    E2E_ADMIN_USERNAME: string;
    IS_EMPTY_ENVIRONMENT: string;
    AVAILABLE_LANGUAGES?: string;
    [key: string]: string;
    SITE_URL?: string;
};

const config: ConfigType = {
    E2E_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD!,
    E2E_ADMIN_USERNAME: process.env.E2E_ADMIN_USERNAME!,
    IS_EMPTY_ENVIRONMENT: process.env.IS_EMPTY_ENVIRONMENT ?? '',
    AVAILABLE_LANGUAGES: process.env.GATSBY_AVAILABLE_LANGUAGES ?? '',
    SITE_URL: process.env.SITE_URL ?? '',
}

Object.keys(config).forEach((key) => {
    if (config[key] === undefined) {
        throw new Error(`Config property ${key} is undefined`);
    }
});

export default config;