# How to add a new field to a collection in the database:

## Write a migration adding the field to existing documents

Create the migration file with:

```bash
npm run db:migrator -- create --name <file-name>.js --folder migrations/
```

For example, a migration to add the field "foo" with the value "bar" 
to every document in the reports migration would look like

```javascript
/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const db = client.db('aiidprod');

  const reportsCollection = db.collection('reports');

  await reportsCollection.updateMany(
    { foo: { $exists: false } },
    { $set: { foo: "bar" } }
  );
```

## Add the new field in type definition files

There are a few places that define the fields in documents in a collection.
These three must be updated:

- `site/gatsby-site/server/fields/<collection>.ts`
- `site/gatsby-site/server/types/<collection>.ts`
- `site/gatsby-site/typeDefs.js`

You should then run `$ npm run codegen` to update the files in `site/gatsby-site/server/generated/gql.ts`

You may also want to add the field to the predefined GraphQL queries for the field,
although this is not required for the field to exist in the database.

`site/gatsby-site/src/graphql/<sollection>.js`


## Add the new field to test seeds

Tests run using sets of test data stored in files checked into the repository.
In many cases, you will need to add the new fields to the test data.
The main place to check is:

```
site/gatsby-site/playwright/seeds/aiidprod/<collection>.ts
```

**However**, many tests define their data inline,
and some will need to have the new fields added, or else they will fail.
This should be the first place to look
if you have tests failing after adding a new field.


## Add the field to form schema files

If you're add a field to documents that are presented as forms in the UI,
you may have to add the field to form schema files,
even if the field doesn't visually display in the form.
For example, in `site/gatsby-site/src/components/submissions/schemas.js`.

