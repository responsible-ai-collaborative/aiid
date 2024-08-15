This is a quick port of the forked project to support JSON and CSV backups of the [AIID](https://incidentdatabase.ai/).

The complete state of the database will be backed up on a weekly basis in both JSON and CSV form. The backups can be downloaded from [here](https://incidentdatabase.ai/research/snapshots/).

What is mongodb-awesome-backup?
-------------------------------

mongodb-awesome-backup is the collection of scripts which backup MongoDB databases to Amazon S3.
You can set a custom S3 endpoint to use S3 based services like DigitalOcean Spaces instead of Amazon S3.


Requirements
------------

Amazon IAM Access Key ID/Secret Access Key, which must have the access rights of the target Amazon S3 bucket.
Cloudflare R2 Access Key ID/Secret Access Key, which must have the access rights of the target Cloudflare R2 bucket.
MongoDB credentials with read access to the target database.

Usage
-----
```bash
docker run --rm \
  -e AWS_ACCESS_KEY_ID=<Your IAM Access Key ID> \
  -e AWS_SECRET_ACCESS_KEY=<Your IAM Secret Access Key> \
  -e TARGET_PRIVATE_BUCKET_URL=<Target public Bucket URL (s3://...)> \
  -e TARGET_PUBLIC_BUCKET_URL=<Target private Bucket URL (s3://...)> \
  -e CLOUDFLARE_ACCOUNT_ID=<Cloudflare R2 account ID> \
  -e CLOUDFLARE_R2_ACCESS_KEY=<Cloudflare R2 Access ID Key> \
  -e CLOUDFLARE_R2_SECRET_KEY=<Cloudflare R2 Access Secret Key> \
  -e CLOUDFLARE_R2_PUBLIC_BUCKET=<Cloudflare R2 public bucket name (ie: "aiid-public")> \
  -e CLOUDFLARE_R2_BUCKET=<Cloudflare R2 bucket name (ie: "aiid-public")> \
  [ -e BACKUPFILE_PREFIX=<Prefix of Backup Filename (default: "backup") \ ]
  [ -e MONGODB_URI=<Target MongoDB URI> \ ]
  [ -e MONGODB_HOST=<Target MongoDB Host (default: "mongo")> \ ]
  [ -e MONGODB_DBNAME=<Target DB name> \ ]
  [ -e MONGODB_USERNAME=<DB login username> \ ]
  [ -e MONGODB_PASSWORD=<DB login password> \ ]
  [ -e MONGODB_AUTHDB=<Authentication DB name> \ ]
  [ -v ~:/mab \ ]
  weseek/mongodb-awesome-backup
```

and after running this, `backup-YYYYMMdd.tar.bz2` will be placed on Target S3 Bucket.


Environment variables
---------

### For `backup`, `prune`, `list`

#### Required

| Variable              | Description                                                                    | Default |
| --------------------- | ------------------------------------------------------------------------------ | ------- |
| AWS_ACCESS_KEY_ID     | Your IAM Access Key ID                                                         | -       |
| AWS_SECRET_ACCESS_KEY | Your IAM Secret Access Key                                                     | -       |
| TARGET_PRIVATE_BUCKET_URL     | Target private Bucket URL (s3://...). **URL is needed to be end with '/'** | -       |
| TARGET_PUBLIC_BUCKET_URL     | Target public Bucket URL (s3://...). **URL is needed to be end with '/'** | -       |
| CLOUDFLARE_ACCOUNT_ID     | Cloudflare R2 account ID | -       |
| CLOUDFLARE_R2_ACCESS_KEY     | Cloudflare R2 Access Key ID | -       |
| CLOUDFLARE_R2_SECRET_KEY     | Cloudflare R2 Access Secret ID | -       |
| CLOUDFLARE_R2_PUBLIC_BUCKET     | Cloudflare R2 public bucket name (ie: "aiid-public") | -       |
| CLOUDFLARE_R2_PRIVATE_BUCKET     | Cloudflare R2 private bucket name (ie: "aiid-private") | -       |

#### Optional

| Variable                          | Description                                                                                                                                                                                               | Default  |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| BACKUPFILE_PREFIX                 | Prefix of Backup Filename                                                                                                                                                                                 | "backup" |
| MONGODB_URI                       | Target MongoDB URI (ex. `mongodb://mongodb?replicaSet=rs0`). If set, the other `MONGODB_*` variables will be ignored.                                                                                     | -        |
| MONGODB_HOST                      | Target MongoDB Host                                                                                                                                                                                       | "mongo"  |
| MONGODB_DBNAME                    | Target DB name                                                                                                                                                                                            | -        |
| MONGODB_USERNAME                  | DB login username                                                                                                                                                                                         | -        |
| MONGODB_PASSWORD                  | DB login password                                                                                                                                                                                         | -        |
| MONGODB_AUTHDB                    | Authentication DB name                                                                                                                                                                                    | -        |
| CRONMODE                          | If set "true", this container is executed in cron mode.  In cron mode, the script will be executed with the specified arguments and at the time specified by CRON_EXPRESSION.                             | "false"  |
| CRON_EXPRESSION                   | Cron expression (ex. "CRON_EXPRESSION=0 4 * * *" if you want to run at 4:00 every day)                                                                                                                    | -        |
