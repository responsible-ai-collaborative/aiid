## Database Migrations

Migration files are stored in the `/site/gatsby-size/migrations` folder and their executions are logged in the `migrations` collection.

### Configuration

Please add a connection string with read/write permissions to the mongo database:

```
MONGODB_MIGRATIONS_CONNECTION_STRING=
```

### Execution

Migrations run automatically as part of Gatsby's `onPreBootstrap` event, but it is also possible to run them from the command line for debugging or testing purposes:

To run all pending migrations:

```
node migrator up
```

To run a specific migration:

```
node migrator up --name 2022.02.18T16.29.14.increment-report-number.js
```

### Adding a new migration

To add a new migration, execute the following command and define the `up` and `down` processes as pertinent.

```
node migrator create --name increment-report-number.js --folder migrations
```

Execution is taken care of by the [umzug](https://github.com/sequelize/umzug) package. Please refer to its documentation for more information.
