import {envVars, checkServerEnvVars} from "../../gatsby-site/envVars";

checkServerEnvVars();

export default envVars;

export type Config = typeof envVars;