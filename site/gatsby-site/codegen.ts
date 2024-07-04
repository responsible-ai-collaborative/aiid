
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ["./server/schema.ts"],
  require: ['ts-node/register', 'dotenv/config'],
  generates: {
    "server/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers", "typescript-mongodb"]
    }
  }
};

export default config;
