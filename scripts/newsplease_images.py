"""Update empty image banners to those pulled down by the NewsPlease library.
Each image will pop up on your screen to confirm the addition to the report
so you will have a chance to reject the change. This
script should generally be run after running cache_images
and before add_placeholder_banner, which pull down explicitly mentioned images
and adds placeholder images, respectively.

Usage:

1. Create a user on the MongoDB database for reading and writing records in
   the `incidents` collection.

2. Export the MongoDB user and password,
```
export MONGO_USER="CHANGEME"
export MONGO_PASSWORD="CHANGEME"
```

3. Run the script,

`python newsplease_images.py`

Then select y/n through each of the images and they will be updated in the
DB and saved locally.

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
from cache_images import cache_image

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

for res in db.incidents.find({ "image_url": "" }):

    if res['source_domain'] == 'arxiv.org':
        print("adding arxiv image for {}".format(res['url']))
        image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/ArXiv_web.svg/1920px-ArXiv_web.svg.png"
        cache_image(image_url)
        update_image(res, image_url)
    else:
        try:
            article = NewsPlease.from_url(res['url'])

            # Show the image
            response = requests.get(article.image_url)
            img = Image.open(BytesIO(response.content))
            img.show()
            print("headline: " + res['title'])
            print("Cache image and add to incident report (y/n)?")
            x = input()
            if x == "y":
                print("Caching...")
                cache_image(article.image_url)
                update_image(res, article.image_url)
            else:
                print("Skipping...")
        except Exception as exc:
            print("EXCEPTION:" + str(exc))
