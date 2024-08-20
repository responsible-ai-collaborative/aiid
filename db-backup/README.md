This is a quick port of the forked project to support JSON and CSV backups of the [AIID](https://incidentdatabase.ai/).

The complete state of the database will be backed up on a weekly basis in both JSON and CSV form. The backups can be downloaded from [here](https://incidentdatabase.ai/research/snapshots/).

Requirements
------------

Amazon IAM Access Key ID/Secret Access Key, which must have the access rights of the target Amazon S3 bucket.
Cloudflare R2 Access Key ID/Secret Access Key, which must have the access rights of the target Cloudflare R2 bucket.
MongoDB credentials with read access to the target database.

Usage
-----
```bash
docker run --rm \
  -e CLOUDFLARE_R2_ACCOUNT_ID=<Cloudflare R2 account ID> \
  -e CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID=<Cloudflare R2 Access ID Key with write permission > \
  -e CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY=<Cloudflare R2 Access Secret Key with write permission> \
  -e CLOUDFLARE_R2_PUBLIC_BUCKET=<Cloudflare R2 public bucket name (ie: "aiid-public")> \
  -e CLOUDFLARE_R2_BUCKET_NAME=<Cloudflare R2 bucket name (ie: "aiid-public")> \
  [ -e MONGODB_URI=<Target MongoDB URI> \ ]
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
| CLOUDFLARE_R2_ACCOUNT_ID     | Cloudflare R2 account ID | -       |
| CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID     | Cloudflare R2 Access Key ID with write permission | -       |
| CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY     | Cloudflare R2 Access Secret ID with write permission| -       |
| CLOUDFLARE_R2_PUBLIC_BUCKET     | Cloudflare R2 public bucket name (ie: "aiid-public") | -       |
| CLOUDFLARE_R2_PRIVATE_BUCKET     | Cloudflare R2 private bucket name (ie: "aiid-private") | -       |

#### Optional

| Variable                          | Description                                                                                                                                                                                               | Default  |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| MONGODB_URI                       | Target MongoDB URI (ex. `mongodb://mongodb?replicaSet=rs0`). If set, the other `MONGODB_*` variables will be ignored.                                                                                     | -        |
| CRONMODE                          | If set "true", this container is executed in cron mode.  In cron mode, the script will be executed with the specified arguments and at the time specified by CRON_EXPRESSION.                             | "false"  |
| CRON_EXPRESSION                   | Cron expression (ex. "CRON_EXPRESSION=0 4 * * *" if you want to run at 4:00 every day)                                                                                                                    | -        |
