
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ["./server/localTypeDefs.ts", "./server/fields/**/*.ts"],
  generates: {
    "server/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers", "typescript-mongodb"]
    }
  }
};

export default config;
