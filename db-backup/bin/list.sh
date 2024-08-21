#!/bin/bash -e

echo "-----------------------------"
echo "Starting list.sh execution..."
echo "-----------------------------"

# start script
CWD=`/usr/bin/dirname $0`
cd $CWD
. ./functions.sh

# output Cludflare R2 account bucket file list
if [ "x${CLOUDFLARE_R2_ACCOUNT_ID}" != "x" ]; then
  echo "Below are the files in the '${CLOUDFLARE_R2_BUCKET_NAME}' Cloudflare R2 bucket:"
  r2_list_files ${CLOUDFLARE_R2_ACCOUNT_ID} ${CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID} ${CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY} ${CLOUDFLARE_R2_BUCKET_NAME}
fi