#
# Add Unix epoch keys to incidents collection.
#

"""Get all the date strings associated with the current MongoDB database, then add "epoch_"
versions of those keys in the Unix epoch.

Usage:

1. Create a user on the MongoDB database for reading and writing records in
   the `incidents` collection.

2. Export the MongoDB user and password,
```
export MONGO_USER="CHANGEME"
export MONGO_PASSWORD="CHANGEME"
```

3. Run the script,

`python m0001_add_unix_epoch_dates.py`

"""

import pymongo
import time
import datetime
import os

# Set to UTC
os.environ['TZ'] = 'Etc/GMT'
time.tzset()

mongo_user = os.environ['MONGO_USER']
mongo_password = os.environ['MONGO_PASSWORD']

mongo_client_string = "mongodb+srv://" + mongo_user + ":" + mongo_password + "@aiiddev-aqdmh.gcp.mongodb.net/test?retryWrites=true&w=majority"
client = pymongo.MongoClient(
    mongo_client_string,
    unicode_decode_error_handler='ignore')
db = client["aiidprod"]

def string_to_epoch(st):
    epoch_time = time.mktime(datetime.datetime.strptime(st, "%Y-%m-%d").timetuple())
    return int(epoch_time)

def update_epoch_dates(doc):
    if "epoch_incident_date" in doc:
        print("Skipping doc already containing epoch key...")
        return
    print("Updating...\n\n" + str(doc))
    epochs = {
        "epoch_incident_date": string_to_epoch(res["incident_date"]),
        "epoch_date_downloaded": string_to_epoch(res["date_downloaded"]),
        "epoch_date_submitted": string_to_epoch(res["date_submitted"]),
        "epoch_date_modified": string_to_epoch(res["date_modified"]),
        "epoch_date_published": string_to_epoch(res["date_published"])
    }

    print("------------- {}".format(epochs))

    for k in epochs:
        assert isinstance(epochs[k], int)
        assert epochs[k] > 433382300, "{} is {} which is {}".format(k,
            epochs[k], time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(epochs[k])))

    db.incidents.find_one_and_update(
        doc,
        {'$set': epochs})
    return

if __name__ == "__main__":
    print("Getting all incidents...")
    for res in db.incidents.find():
        update_epoch_dates(res)
