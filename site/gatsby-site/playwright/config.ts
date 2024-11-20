type ConfigType = {
    E2E_ADMIN_PASSWORD: string;
    E2E_ADMIN_USERNAME: string;
    IS_EMPTY_ENVIRONMENT: string;
    AVAILABLE_LANGUAGES?: string;
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;
};

const config: ConfigType = {
    E2E_ADMIN_PASSWORD: process.env.E2E_ADMIN_PASSWORD!,
    E2E_ADMIN_USERNAME: process.env.E2E_ADMIN_USERNAME!,
    IS_EMPTY_ENVIRONMENT: process.env.IS_EMPTY_ENVIRONMENT ?? '',
    AVAILABLE_LANGUAGES: process.env.GATSBY_AVAILABLE_LANGUAGES ?? '',

    // TODO: add theses values to the workflow
    NEXTAUTH_URL: 'http://localhost:8000',
    NEXTAUTH_SECRET: '678x1irXYWeiOqTwCv1awvkAUbO9eHa5xzQEYhxhMms=',
}

Object.keys(config).forEach((key) => {
    if (config[key as keyof ConfigType] === undefined) {
        throw new Error(`Config property ${key} is undefined`);
    }
});

export default config;