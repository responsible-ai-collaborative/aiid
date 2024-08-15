#!/bin/bash -e

echo "Starting list.sh execution..."

# start script
CWD=`/usr/bin/dirname $0`
cd $CWD
. ./functions.sh

if [ "${IS_PUBLIC_BACKUP}" == "true" ]; then
  TARGET_BUCKET_URL=${TARGET_PUBLIC_BUCKET_URL}
else
  TARGET_BUCKET_URL=${TARGET_PRIVATE_BUCKET_URL}
fi

# output S3 bucket file list
if [ `echo $TARGET_BUCKET_URL | cut -f1 -d":"` == "s3" ]; then
  echo "There are files below in '${TARGET_BUCKET_URL}' S3 bucket:"
  s3_list_files ${TARGET_BUCKET_URL}
fi

# output Cludflare R2 account bucket file list
if [ "x${CLOUDFLARE_ACCOUNT_ID}" != "x" ]; then
  echo "There are files below in '${CLOUDFLARE_R2_BUCKET}' R2 bucket:"
  r2_list_files ${CLOUDFLARE_ACCOUNT_ID} ${CLOUDFLARE_R2_ACCESS_KEY} ${CLOUDFLARE_R2_SECRET_KEY} ${CLOUDFLARE_R2_BUCKET}
fi