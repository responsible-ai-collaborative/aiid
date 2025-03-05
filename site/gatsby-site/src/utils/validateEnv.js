function validateEnv(config) {
  const missingEnvs = Object.keys(config).filter(
    (key) => config[key] === undefined || config[key] === ''
  );

  if (missingEnvs.length) {
    throw new Error(`Missing environment variables: ${missingEnvs.join(', ')}`);
  }
}
module.exports = validateEnv;
