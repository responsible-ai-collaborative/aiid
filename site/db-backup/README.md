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

The GitHub Action "Private daily backup to the cloud" [/.github/workflows/db-daily-backup.yml](/.github/workflows/db-daily-backup.yml) runs the same backup script every day at approximately 3:27 AM US Eastern time and writes to a separate, private Cloudflare R2 bucket. Each run uploads `daily-DD.tar.bz2` (where `DD` is the two-digit day of the month in US Eastern time), so the file for any given calendar day is overwritten the next time that date comes around — yielding a rotating 30-day window of daily snapshots that are not surfaced on the public snapshots page.


Required environment variables
---------

| Variable              | Description                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| CLOUDFLARE_R2_ACCOUNT_ID     | Cloudflare R2 account ID |
| CLOUDFLARE_R2_BUCKET_NAME     | Cloudflare R2 public bucket name (ie: "aiid-public"). Used by the weekly public backup workflow. |
| CLOUDFLARE_R2_DAILY_BUCKET_NAME     | Cloudflare R2 private bucket name used by the daily backup workflow (ie: "aiid-private-daily"). The bucket should NOT be the same as `CLOUDFLARE_R2_BUCKET_NAME`, since contents of the public bucket are listed on the [snapshots page](https://incidentdatabase.ai/research/snapshots/). The credentials in `CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID` / `CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY` must have write access to this bucket as well. |

Required environment secrets

| Secret              | Description                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID     | Cloudflare R2 Access Key ID with write permission |
| CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY     | Cloudflare R2 Access Secret ID with write permission|
| MONGODB_CONNECTION_STRING     | mongodb+srv://[username]:[password]@aiiddev.[CLUSTER].mongodb.net |
