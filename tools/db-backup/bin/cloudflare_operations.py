#!/usr/bin/env python3

import sys

import argparse
import boto3


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Simple client for uploading, deleting, listing, and checking objects in Cloudlfare R2 buckets."
    )

    parser.add_argument(
        "--operation",
        choices=["list", "upload", "delete", "check_exists"],
        required=True,
        help="",
    )

    # Arguments that are always required.
    parser.add_argument("--account_id", required=True, help="Cloudflare account ID")
    parser.add_argument(
        "--access_key", required=True, help="Cloudflare R2 bucket access key"
    )
    parser.add_argument(
        "--secret_key", required=True, help="Cloudflare R2 bucket secret key"
    )
    parser.add_argument(
        "--bucket_name", required=True, help="Cloudflare R2 bucket name"
    )

    parser.add_argument(
        "--file_path",
        required=False,
        help="Path to the file to be uploaded or deleted.",
    )
    parser.add_argument(
        "--object_key",
        required=False,
        help="Key under which the object should be stored in the bucket.",
    )

    args = parser.parse_args()

    # Arguments required for only some operations.
    if args.operation == "upload":
        if args.file_path is None:
            parser.error("--operation={upload} requires --file_path.")

    if args.operation in ["upload", "delete", "check_exists"]:
        if args.object_key is None:
            parser.error(
                "--operation={delete,upload,check_exists} requires --object_key."
            )

    return args


def create_cloudflare_client(account_id, access_key, secret_key, region="auto"):
    endpoint_url = f"https://{account_id}.r2.cloudflarestorage.com"
    cloudflare_client = boto3.client(
        service_name="s3",
        endpoint_url=endpoint_url,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region,
    )
    return cloudflare_client


def main(args):
    cloudflare_client = create_cloudflare_client(
        args.account_id, args.access_key, args.secret_key
    )

    if args.operation == "list":
        response = cloudflare_client.list_objects_v2(Bucket=args.bucket_name)

        if "Contents" in response:
            for obj in response["Contents"]:
                print(obj["Key"], "size:", obj["Size"])

    elif args.operation == "upload":
        cloudflare_client.upload_file(
            args.file_path,
            args.bucket_name,
            args.object_key,
            ExtraArgs={"ContentType": "application/x-bzip2"},
        )
        print("-----------------------------")
        print(
            f"Successfully uploaded file {args.file_path} (key: {args.object_key}) to bucket {args.bucket_name}"
        )
        print("-----------------------------")

    elif args.operation == "delete":
        cloudflare_client.delete_object(Bucket=args.bucket_name, Key=args.object_key)
        print("-----------------------------")
        print(
            f"Successfully deleted file {args.object_key} from bucket {args.bucket_name}"
        )
        print("-----------------------------")

    elif args.operation == "check_exists":
        # Raises error/non-zero exit if object doesn't exist. Otherwise success, raises nothing.
        cloudflare_client.get_object(Bucket=args.bucket_name, Key=args.object_key)

    else:
        raise NotImplementedError

    sys.exit()


if __name__ == "__main__":
    args = parse_arguments()
    main(args)
