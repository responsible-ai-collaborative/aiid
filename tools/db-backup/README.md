This is a quick port of the forked project to support JSON and CSV backups of the [AIID](https://incidentdatabase.ai/).

The complete state of the database will be backed up on a weekly basis in both JSON and CSV form. The backups can be downloaded from [here](https://incidentdatabase.ai/research/snapshots/).

Requirements
------------

- Cloudflare R2 Access Key ID/Secret Access Key, which must have the access rights of the target Cloudflare R2 bucket.
- MongoDB credentials with read access to the target database.

Usage
-----

The GitHub Action "Public backup to the cloud" [/.github/workflows/db-backup.yml](/.github/workflows/db-backup.yml) will run the backup script at 10:00 AM every Monday.

After running this, `backup-YYYYMMdd.tar.bz2` will be placed on the Cloudflare R2 Bucket.


Required environment variables
---------

| Variable              | Description                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| CLOUDFLARE_R2_ACCOUNT_ID     | Cloudflare R2 account ID |
| CLOUDFLARE_R2_BUCKET_NAME     | Cloudflare R2 public bucket name (ie: "aiid-public") |

Required environment secrets

| Secret              | Description                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID     | Cloudflare R2 Access Key ID with write permission |
| CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY     | Cloudflare R2 Access Secret ID with write permission|
| MONGODB_CONNECTION_STRING     | mongodb+srv://[username]:[password]@aiiddev.[CLUSTER].mongodb.net |
