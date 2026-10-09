import os
import boto3
from datetime import datetime, timezone


BUCKET_NAME = os.environ.get("BUCKET_NAME")


def s3_upload(file):
    s3 = boto3.client("s3")
    key = f"files/{str(datetime.now(timezone.utc).timestamp())}-{file.filename}"
    s3.upload_fileobj(
        file.file,
        BUCKET_NAME,
        key,
        ExtraArgs={
            "ContentType": file.content_type or "application/octet-stream"
        },
    )
    return key


def s3_link(key: str):
    s3 = boto3.client("s3")
    try:
        url = s3.generate_presigned_url(
            "get_object", Params={"Bucket": BUCKET_NAME, "Key": key}, ExpiresIn=3600
        )
    except:
        url = key
    return url
