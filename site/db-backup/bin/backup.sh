#!/bin/bash -e

echo "--------------------------------------"
echo "Starting backup.sh script execution..."
echo "--------------------------------------"

# settings
BACKUPFILE_PREFIX="backup"
CLOUDFLARE_R2_ACCOUNT_ID=${CLOUDFLARE_R2_ACCOUNT_ID}
MONGODB_DBNAME="aiidprod"
MONGODB_DBNAME_TRANSLATIONS="translations"

# start script
CWD=$(/usr/bin/dirname $0)
cd $CWD

. ./functions.sh
NOW=$(create_current_yyyymmddhhmmss)

echo "=== $0 started at $(/bin/date "+%Y/%m/%d %H:%M:%S") ==="

TMPDIR="/tmp"
TARGET_DIRNAME="mongodump_full_snapshot"
TARGET="${TMPDIR}/${TARGET_DIRNAME}"
TAR_CMD="/bin/tar"
TAR_OPTS="jcvf"

DIRNAME=$(/usr/bin/dirname ${TARGET})
BASENAME=$(/usr/bin/basename ${TARGET})
TARBALL="${BACKUPFILE_PREFIX}-${NOW}.tar.bz2"
TARBALL_FULLPATH="${TMPDIR}/${TARBALL}"

# check parameters
# deprecate the old option
if [ "x${CLOUDFLARE_R2_ACCOUNT_ID}" == "x" ]; then
  echo "ERROR: CLOUDFLARE_R2_ACCOUNT_ID must be specified." 1>&2
  exit 1
fi
if [ -z "${CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID}" ]; then
  echo "ERROR: If CLOUDFLARE_R2_ACCOUNT_ID environment variable is defined, you have to define the CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID as well" 1>&2
  exit 1
fi
if [ -z "${CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY}" ]; then
  echo "ERROR: If CLOUDFLARE_R2_ACCOUNT_ID environment variable is defined, you have to define the CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY as well" 1>&2
  exit 1
fi
if [ -z "${CLOUDFLARE_R2_BUCKET_NAME}" ]; then
  echo "ERROR: If CLOUDFLARE_R2_ACCOUNT_ID environment variable is defined, you have to define the CLOUDFLARE_R2_BUCKET_NAME as well" 1>&2
  exit 1
fi

echo "Dump MongoDB 'aiidprod' database..."
mongodump -o ${TARGET} --uri=${MONGODB_URI}/${MONGODB_DBNAME}

echo "Dump MongoDB 'translations' database..."
mongodump -o ${TARGET} --uri=${MONGODB_URI}/${MONGODB_DBNAME_TRANSLATIONS}

echo "Export collections as CSV files..."
mongoexport -o ${TARGET}/incidents.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --collection=incidents --fields=_id,incident_id,date,reports,Alleged\ deployer\ of\ AI\ system,Alleged\ developer\ of\ AI\ system,Alleged\ harmed\ or\ nearly\ harmed\ parties,description,title
mongoexport -o ${TARGET}/duplicates.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --collection=duplicates --fields=duplicate_incident_number,true_incident_number
mongoexport -o ${TARGET}/quickadd.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --collection=quickadd --fields=incident_id,url,date_submitted,source_domain
mongoexport -o ${TARGET}/submissions.csv --uri=${MONGODB_URI}/${MONGODB_DBNAME} -v --type=csv --collection=submissions --fields=authors,date_downloaded,date_modified,date_published,date_submitted,image_url,incident_date,incident_id,language,mongodb_id,source_domain,submitters,text,title,url

###### Begin Reports CSV Export ######

JSON_FILE="${TARGET}/reports.json"
CSV_FILE="${TARGET}/reports.csv"
FIELDS="_id,authors,date_downloaded,date_modified,date_published,date_submitted,description,epoch_date_downloaded,epoch_date_modified,epoch_date_published,epoch_date_submitted,image_url,language,ref_number,report_number,source_domain,submitters,text,title,url,tags"
mongoexport --uri="${MONGODB_URI}/${MONGODB_DBNAME}" --collection=reports --out="${JSON_FILE}" --jsonArray --jsonFormat=relaxed --fields="${FIELDS}"
python3 convert_json_to_csv.py "${JSON_FILE}" "${CSV_FILE}" "${FIELDS}"
rm -f $JSON_FILE

###### End Reports CSV Export ######

###### Begin Taxa CSV Export ######

# Temporary file name to store MongoDB export of "taxa"
taxa_json="taxa_items.json"

# Export all documents from the "taxa" collection to a temporary JSON file
mongoexport --uri=${MONGODB_URI}/${MONGODB_DBNAME} -c taxa --type=json -o $taxa_json --jsonArray --quiet

# Check if mongoexport ran successfully
if [ $? -ne 0 ]; then
    echo "Error executing mongoexport for the 'taxa' collection. Check the MongoDB URI and other parameters."
    exit 1
fi

# Get all unique namespaces from the taxa JSON file
namespaces=$(jq -r '.[].namespace' "$taxa_json" | sort | uniq)

# Iterate over each namespace and execute the corresponding process
for namespace in $namespaces; do

    # Temporary JSON file name to store MongoDB export of "classifications"
    classification_json="classifications_${namespace}.json"

    # Run mongoexport to export documents from the "classifications" collection
    mongoexport --uri=${MONGODB_URI}/${MONGODB_DBNAME} -c classifications --type=json -o $classification_json --query="{\"namespace\": \"$namespace\"}" --jsonArray --quiet

    # Check if mongoexport ran successfully
    if [ $? -ne 0 ]; then
        echo "Error executing mongoexport for the namespace $namespace. Check the MongoDB URI and other parameters."
        continue # Skip to the next namespace if there is an error
    fi

    # Invoke the Python script with the provided parameters
    python3 taxonomy_csv_export.py "$namespace" "$taxa_json" "$classification_json" ${TARGET}

    # Check if the Python script ran successfully
    if [ $? -ne 0 ]; then
        echo "Error executing taxonomy_csv_export.py for the namespace $namespace."
        continue # Skip to the next namespace if there is an error
    fi

    # Delete the temporary JSON file
    rm -f $classification_json
done

# Delete the temporary JSON file
rm -f $taxa_json

echo "All namespaces have completed processing."

###### End Taxa CSV Export ######

## Create a license file
echo "Report contents are subject to their own intellectual property rights. Unless otherwise noted, the database is shared under (CC BY-SA 4.0). See: https://creativecommons.org/licenses/by-sa/4.0/" >${TARGET}/license.txt

# run tar command
echo "Start backup ${TARGET} into ${CLOUDFLARE_R2_BUCKET_NAME} ..."
time ${TAR_CMD} ${TAR_OPTS} ${TARBALL_FULLPATH} -C ${DIRNAME} ${BASENAME}

# upload tarball to Cloudflare R2
r2_copy_file ${CLOUDFLARE_R2_ACCOUNT_ID} ${CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID} ${CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY} ${CLOUDFLARE_R2_BUCKET_NAME} ${TARBALL_FULLPATH} ${TARBALL}

# call healthchecks url for successful backup
if [ "x${HEALTHCHECKS_URL}" != "x" ]; then
  curl -fsS --retry 3 ${HEALTHCHECKS_URL} >/dev/null
fi
