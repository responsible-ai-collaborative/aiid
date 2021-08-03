"""Initialize the taxa and classifications collections with the current CSET data.

Usage:

0. Make sure you have the files in the expected directory.!!!!!!!!!

1. Create a user on the MongoDB database for reading and writing records in
   the `taxa` and `classifications` collections.

2. Export the MongoDB user and password,
```
export MONGO_USER="CHANGEME"
export MONGO_PASSWORD="CHANGEME"
```

3. Run the script,

`python m0002_add_initial_taxa_and_classifications_content.py`

"""

import pymongo
import os
import json

taxa_file_path = "data/cset/taxa.json"
classifications_file_path = "data/cset/classifications.json"

mongo_user = os.environ['MONGO_USER']
mongo_password = os.environ['MONGO_PASSWORD']

mongo_client_string = "mongodb+srv://" + mongo_user + ":" + mongo_password + "@aiiddev-aqdmh.gcp.mongodb.net/test?retryWrites=true&w=majority"
client = pymongo.MongoClient(
    mongo_client_string,
    unicode_decode_error_handler='ignore')
db = client["aiidprod"]

def update_taxa(doc):
    print("Skipping! Insert of Taxa")
    return
    print("inserting into taxa:")
    print(doc)
    db.taxa.insert_one(doc)
    return

def update_classifications(docs):
    # dropping current classifications
    db.classifications.delete_many(
       {}
    )
    for doc in docs:
        print("inserting into classifications:")
        print(doc)
        if doc["incident_id"] is None or doc["incident_id"] > 999:
            print("Skipping ^ since the incident_id is None")
            continue
        db.classifications.insert_one(doc)
    return

if __name__ == "__main__":
    with open(taxa_file_path) as f:
        data = json.load(f)
        update_taxa(data)
    with open(classifications_file_path) as f:
        data = json.load(f)
        update_classifications(data)
