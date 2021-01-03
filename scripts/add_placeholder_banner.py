"""Update all image banners for reports to the AIID placeholder image
if the image does not currently exist in the git LFS cache. This
script should generally be run last, after running cache_images
and newsplease_images, which pull down explicitly mentioned images
and programatically gathered images, respectively. This script
is only for fallback images.

Usage:

1. Create a user on the MongoDB database for reading and writing records in
   the `incidents` collection.

2. Export the MongoDB user and password,
```
export MONGO_USER="CHANGEME"
export MONGO_PASSWORD="CHANGEME"
```

3. Run the script,

`python add_placeholder_banner.py`

4. Add the images via git LFS,

git lfs track FILESHERE

5. Add the files via Git

git add FILESHERE

6. Push the files

7. Deploy

"""

import pymongo
import hashlib
import requests
import os.path
import os
import requests
from io import BytesIO
from newsplease import NewsPlease
from PIL import Image
from cache_images import cache_image, image_is_in_cache

mongo_user = os.environ['MONGO_USER']
mongo_password = os.environ['MONGO_PASSWORD']

mongo_client_string = "mongodb+srv://" + mongo_user + ":" + mongo_password + "@aiiddev-aqdmh.gcp.mongodb.net/test?retryWrites=true&w=majority"
client = pymongo.MongoClient(
    mongo_client_string,
    unicode_decode_error_handler='ignore')
db = client["aiidprod"]

def update_image(record, image_url):
    """Update the image associated with the report.
    
    Args:
        record (PyMongo Result): The record that is to be updated.
        image_url (str): The URL of the image that will be added.
    """
    print("Updating..." + str(record))
    db.incidents.find_one_and_update(
        record,
        {'$set': {'image_url': image_url}})

placeholder_image_url = "placeholder.svg"
for res in db.incidents.find({}):
    if res['image_url'] == "" or not image_is_in_cache(res['image_url']):
        print("adding placeholder image for {}".format(res['image_url']))
        update_image(res, placeholder_image_url)
