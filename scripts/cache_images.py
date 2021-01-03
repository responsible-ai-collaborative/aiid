"""Get all the images associated with the current MongoDB database, then cache them to the static files directory.
All files will be stored as a hash of their MongoDB URL. The client hashes the URLs and requests these files.

Usage:

1. Create a user on the MongoDB database for reading and writing records in
   the `incidents` collection.

2. Export the MongoDB user and password,
```
export MONGO_USER="CHANGEME"
export MONGO_PASSWORD="CHANGEME"
```

3. Run the script,

`python cache_images.py`

"""

import pymongo
import hashlib
import requests
import os.path
import os

mongo_user = os.environ['MONGO_USER']
mongo_password = os.environ['MONGO_PASSWORD']
report_banner_path = "../site/gatsby-site/static/large_media/report_banners/"

mongo_client_string = "mongodb+srv://" + mongo_user + ":" + mongo_password + "@aiiddev-aqdmh.gcp.mongodb.net/test?retryWrites=true&w=majority"
client = pymongo.MongoClient(
    mongo_client_string,
    unicode_decode_error_handler='ignore')
db = client["aiidprod"]

def url_to_hash(image_url):
    m = hashlib.md5()
    m.update(image_url.encode("utf8"))
    dig = m.hexdigest()
    return dig

def image_is_in_cache(image_url):
    dig = url_to_hash(image_url)
    path = os.path.join(report_banner_path, dig)
    return os.path.isfile(path)

def cache_image(image_url):
    if image_url[:4] != "http":
        if len(image_url) > 0:
            print("bad URL? " + image_url)
        return
    dig = url_to_hash(image_url)
    path = os.path.join(report_banner_path, dig)
    if os.path.isfile(path):
        print("File already exists: " + dig)
        return
    try:
        response = requests.get(image_url)
    except Exception:
        print("Exception requesting: " + image_url)
        return
    if not response.ok:
        print("skipping: " + image_url)
        return
    else:
        print("fetched:" + image_url)
    img_data =  response.content
    with open(path, 'wb') as handler:
        handler.write(img_data)
        print("wrote: " + path)
    return

if __name__ == "__main__":
    print("Caching Images...")
    for res in db.incidents.find():
        image_url = res["image_url"]
        cache_image(image_url)
