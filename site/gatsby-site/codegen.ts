
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ["./server/schema.ts"],
  require: ['ts-node/register', 'dotenv/config'],
  documents: 'src/graphql/**/!(*.d).{ts,tsx,js}',
  pluckConfig: {
    globalIdentifier: 'gql',
  },
  generates: {
    "server/generated/": {
      preset: 'client',
      presetConfig: {
        gqlTagName: "gql",
      }
    }
  }
};

export default config;
