#!/bin/bash -e

echo "------------------------------"
echo "Starting prune.sh execution..."
echo "------------------------------"

# settings
BACKUPFILE_PREFIX="backup"
DELETE_DEVIDE=${DELETE_DEVIDE:-3}
DELETE_TARGET_DAYS_LEFT=${DELETE_TARGET_DAYS_LEFT:-4}

# start script
CWD=`/usr/bin/dirname $0`
cd $CWD

. ./functions.sh
PAST=`create_past_yyyymmdd ${DELETE_TARGET_DAYS_LEFT}`

# check the existence of past file
# if it exists, delete it
TARBALL_PAST="${BACKUPFILE_PREFIX}-${PAST}.tar.bz2"

if [ "x${CLOUDFLARE_R2_ACCOUNT_ID}" != "x" ]; then
  echo "pruning Cloudflare R2 account bucket ${CLOUDFLARE_R2_BUCKET_NAME} ..."
  r2_delete_file_if_delete_backup_day ${CLOUDFLARE_R2_ACCOUNT_ID} ${CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID} ${CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY} ${CLOUDFLARE_R2_BUCKET_NAME} ${TARBALL_PAST} ${DELETE_TARGET_DAYS_LEFT} ${DELETE_DEVIDE}
fi
