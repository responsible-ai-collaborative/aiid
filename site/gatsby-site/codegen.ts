
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/server/schema.graphql",
  generates: {
    "src/server/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers", "typescript-mongodb"]
    }
  }
};

export default config;
