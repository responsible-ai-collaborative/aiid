#!/bin/bash -e
if [ "`echo $TARGET_BUCKET_URL | cut -f1 -d':'`" != "gs" ]; then
	exit 0
fi

GCSCLI="/root/google-cloud-sdk/bin/gsutil"
GCLOUDCLI="/root/google-cloud-sdk/bin/gcloud"
MOUNT="/mab"

if [ -n "${GCP_PROJECT_ID}" ] && [ -n "${GCP_SERVICE_ACCOUNT_KEY_JSON_PATH}" ]; then
  echo '[DEBUG] Using GCP service account authorization'

  # Using GCP service account authorization
  ${GCLOUDCLI} auth activate-service-account --key-file="${GCP_SERVICE_ACCOUNT_KEY_JSON_PATH}"
  ${GCLOUDCLI} --quiet config set project ${GCP_PROJECT_ID}
elif [ -n "${GCP_ACCESS_KEY_ID}" ] && [ -n "${GCP_SECRET_ACCESS_KEY}" ]; then
  echo '[DEBUG] Using HMAC authorization'

  # Disable credential passing (ref. https://cloud.google.com/storage/docs/gsutil_install)
  ${GCLOUDCLI} config set pass_credentials_to_gsutil false
  
  # Using HMAC authorization
  cat <<- HERE > /root/.boto
[Credentials]

gs_access_key_id = $GCP_ACCESS_KEY_ID
gs_secret_access_key = $GCP_SECRET_ACCESS_KEY

[Boto]

https_validate_certificates = True

[GoogleCompute]

[GSUtil]

content_language = en

default_api_version = 1

default_project_id = $GCP_PROJECT_ID

[OAuth2]
HERE
elif [ -f ${MOUNT}/.boto ]; then
  echo '[DEBUG] Using mounted `.boto` file authorization'
  
  # Disable credential passing (ref. https://cloud.google.com/storage/docs/gsutil_install)
  ${GCLOUDCLI} config set pass_credentials_to_gsutil false

  # Using mounted `.boto` file authorization
  cp ${MOUNT}/.boto /root/.boto
elif [ ! -f ${MOUNT}/.boto ]; then
  echo '[DEBUG] Using interactive authorization'
  
  # Disable credential passing (ref. https://cloud.google.com/storage/docs/gsutil_install)
  ${GCLOUDCLI} config set pass_credentials_to_gsutil false

  # Using interactive authorization
  if [ ! -d ${MOUNT} ]; then mkdir -p ${MOUNT}; fi
  ${GCSCLI} config -o ${MOUNT}/.boto
  cp ${MOUNT}/.boto /root/.boto
fi
