
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: ["./server/schema.ts"],
  require: ['tsx/cjs', 'dotenv/config'],
  // TODO: documents option should be 'src/**/!(*.d).{ts,tsx,js}' instead so it parses the entire project but as far as I'm aware there is no way to parse some queries while ignoring others (we have to ignore gatsby's queries because they use a different schema)
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
