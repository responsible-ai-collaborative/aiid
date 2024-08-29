CLOUDFLARE_CLIENT_SCRIPT="./cloudflare_operations.py"

# Check the existence of specified file on Cloudflare R2 bucket.
# arguments: 1. CLOUDFLARE_R2_ACCOUNT_ID
#            2. CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID
#            3. CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY
#            4. Cloudflare R2 Bucket name (ie: aiid-public)
#            5. File path for the bucket item (ie: backup-20231009233543.tar.bz2)
r2_exists() {
	if [ $# -ne 5 ]; then return 255; fi
	echo "python3 ${CLOUDFLARE_CLIENT_SCRIPT} --operation check_exists --account_id $1 --access_key $2 --secret_key $3 --bucket_name $4 --object_key $5"
	python3 ${CLOUDFLARE_CLIENT_SCRIPT} --operation check_exists --account_id $1 --access_key $2 --secret_key $3 --bucket_name $4 --object_key $5
}

# Output the list of the files on specified Cloudflare R2.
# arguments: 1. CLOUDFLARE_R2_ACCOUNT_ID
#            2. CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID
#            3. CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY
#            4. Cloudflare R2 Bucket name (ie: aiid-public)
r2_list_files() {
	if [ $# -ne 4 ]; then return 255; fi
	echo "python3 ${CLOUDFLARE_CLIENT_SCRIPT} --operation list --account_id $1 --access_key $2 --secret_key $3 --bucket_name $4"
	python3 ${CLOUDFLARE_CLIENT_SCRIPT} --operation list --account_id $1 --access_key $2 --secret_key $3 --bucket_name $4
}

# Delete the specified file on Cloudflare R2 bucket.
# arguments: 1. CLOUDFLARE_R2_ACCOUNT_ID
#            2. CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID
#            3. CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY
#            4. Cloudflare R2 Bucket name (ie: aiid-public)
#            5. File path for the bucket item (ie: backup-20231009233543.tar.bz2)
r2_delete_file() {
	if [ $# -ne 5 ]; then return 255; fi
	echo "python3 ${CLOUDFLARE_CLIENT_SCRIPT} --operation delete --account_id $1 --access_key $2 --secret_key $3 --bucket_name $4 --object_key $5"
	python3 ${CLOUDFLARE_CLIENT_SCRIPT} --operation delete --account_id $1 --access_key $2 --secret_key $3 --bucket_name $4 --object_key $5
}

# Copy the specified file to Cloudflare R2.
# arguments: 1. CLOUDFLARE_R2_ACCOUNT_ID
#            2. CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID
#			 3. CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY
#			 4. Cloudflare R2 Bucket name (ie: aiid-public)
#			 5. File path to upload (ie: /tmp/backup-20231009233543.tar.bz2)
#			 6. File key for the bucket item (ie: backup-20231009233543.tar.bz2)
r2_copy_file() {
	if [ $# -ne 6 ]; then return 255; fi
	echo "python3 ${CLOUDFLARE_CLIENT_SCRIPT} --operation upload --account_id $1 --access_key $2 --secret_key $3 --bucket_name $4 --file_path $5 --object_key $6"
	python3 ${CLOUDFLARE_CLIENT_SCRIPT} --operation upload --account_id $1 --access_key $2 --secret_key $3 --bucket_name $4 --file_path $5 --object_key $6
}

# Create current datetime string(YYYYmmddHHMMSS)
create_current_yyyymmddhhmmss() {
	echo `/bin/date +%Y%m%d%H%M%S`
}

# Create date string of n days ago
# arguments: 1. how many days ago
create_past_yyyymmdd() {
	if [ $# -ne 1 ]; then return 255; fi
	echo `/bin/date +%Y%m%d -d "$1 days ago"`
}

# Check whether the day is deleting backup file or not
# arguments: 1. how many days ago to be deleted
#            2. divide number
check_is_delete_backup_day() {
	if [ $# -ne 2 ]; then return 255; fi
	MOD_COUNT=`/usr/bin/expr $(/bin/date +%s -d "$1 days ago") / 86400 % $2`
	if [ ${MOD_COUNT} -ne 0 ]; then
		return 0
	else
		return 255
	fi
}

# arguments: 1. CLOUDFLARE_R2_ACCOUNT_ID
#            2. CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID
#            3. CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY
#            4. Cloudflare R2 Bucket name (ie: aiid-public)
#            5. File path for the bucket item (ie: backup-20231009233543.tar.bz2)
#            6. how many days ago to be deleted
#            7. divide number
r2_delete_file_if_delete_backup_day() {
	if [ $# -ne 7 ]; then return 255; fi
	if check_is_delete_backup_day $6 $7; then
		if r2_exists $1 $2 $3 $4 $5; then
			r2_delete_file $1 $2 $3 $4 $5
			echo "DELETED past backuped file on R2: $3"
		else
			echo "Not found past backuped file on R2: $3"
		fi
	fi
}
