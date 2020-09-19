"""Get all the images associated with the current MongoDB database, then cache them to the static files directory.
All files will be stored as a hash of their MongoDB URL. The client hashes the URLs and requests these files.
"""

import pymongo
import hashlib
import requests
import os.path

mongo_user = "CHANGEME"
mongo_password = "CHANGEME"

mongo_client_string = "mongodb+srv://" + mongo_user + ":" + mongo_password + "@aiiddev-aqdmh.gcp.mongodb.net/test?retryWrites=true&w=majority"
client = pymongo.MongoClient(mongo_client_string)
db = client["aiidprod"]
for res in db.incidents.find():
    image_url = res["image_url"]
    if image_url[:4] != "http":
        if len(image_url) > 0:
            print("bad URL? " + image_url)
        continue
    m = hashlib.md5()
    m.update(image_url.encode("utf8"))
    dig = m.hexdigest()
    path = os.path.join("../site/images/incident_banners/", dig)
    if os.path.isfile(path):
        print("File already exists: " + dig)
        continue
    try:
        response = requests.get(image_url)
    except Exception:
        print("Exception requesting: " + image_url)
        continue
    if not response.ok:
        print("skipping: " + image_url)
        continue
    else:
        print("fetched:" + image_url)
    img_data =  response.content
    with open(path, 'wb') as handler:
        handler.write(img_data)
        print("wrote: " + path)
