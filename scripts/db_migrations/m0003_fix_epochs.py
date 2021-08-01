"""Fix the epoch dates that are in ms instead of seconds.

Usage:

1. Create a user on the MongoDB database for reading and writing records in
   the `incidents` collection.

2. Export the MongoDB user and password,
```
export MONGO_USER="CHANGEME"
export MONGO_PASSWORD="CHANGEME"
```

3. Run the script,

`python m0003_fix_epochs.py`

"""

import pymongo
import os
import time
import datetime
import json

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
    epochs = {
        "epoch_incident_date": string_to_epoch(res["incident_date"]),
        "epoch_date_downloaded": string_to_epoch(res["date_downloaded"]),
        "epoch_date_submitted": string_to_epoch(res["date_submitted"]),
        "epoch_date_modified": string_to_epoch(res["date_modified"]),
        "epoch_date_published": string_to_epoch(res["date_published"])
    }
    for k in epochs:
        assert isinstance(epochs[k], int)
        assert epochs[k] > 433382300, "{} is {} which is {}".format(k,
            epochs[k], time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(epochs[k])))

    print("------------- {}".format(epochs))

    if epochs["epoch_incident_date"] != doc["epoch_incident_date"] or\
       epochs["epoch_date_downloaded"] != doc["epoch_date_downloaded"] or\
       epochs["epoch_date_submitted"] != doc["epoch_date_submitted"] or\
       epochs["epoch_date_modified"] != doc["epoch_date_modified"] or\
       epochs["epoch_date_published"] != doc["epoch_date_published"]:
        print("\n\nUpdating...")
        if epochs["epoch_incident_date"] != doc["epoch_incident_date"]:
            print("{} <- {}".format(epochs["epoch_incident_date"], doc["epoch_incident_date"]))
            k = "epoch_incident_date"
            print("{} <- {}".format(time.strftime('%Y-%m-%d', time.localtime(epochs[k])), time.strftime('%Y-%m-%d', time.localtime(doc[k]))))
            assert time.strftime('%Y-%m-%d', time.localtime(epochs[k])) == doc["incident_date"],\
                "{} != {}".format(time.strftime('%Y-%m-%d', time.localtime(epochs[k])), doc["incident_date"])
        if epochs["epoch_date_downloaded"] != doc["epoch_date_downloaded"]:
            print("{} <- {}".format(epochs["epoch_date_downloaded"], doc["epoch_date_downloaded"]))
            k = "epoch_date_downloaded"
            print("{} <- {}".format(time.strftime('%Y-%m-%d', time.localtime(epochs[k])), time.strftime('%Y-%m-%d', time.localtime(doc[k]))))
            assert time.strftime('%Y-%m-%d', time.localtime(epochs[k])) == doc["date_downloaded"],\
                "{} != {}".format(time.strftime('%Y-%m-%d', time.localtime(epochs[k])), doc["date_downloaded"])
        if epochs["epoch_date_submitted"] != doc["epoch_date_submitted"]:
            print("{} <- {}".format(epochs["epoch_date_submitted"], doc["epoch_date_submitted"]))
            k = "epoch_date_submitted"
            print("{} <- {}".format(time.strftime('%Y-%m-%d', time.localtime(epochs[k])), time.strftime('%Y-%m-%d', time.localtime(doc[k]))))
            assert time.strftime('%Y-%m-%d', time.localtime(epochs[k])) == doc["date_submitted"],\
                "{} != {}".format(time.strftime('%Y-%m-%d', time.localtime(epochs[k])), doc["date_submitted"])
        if epochs["epoch_date_modified"] != doc["epoch_date_modified"]:
            print("{} <- {}".format(epochs["epoch_date_modified"], doc["epoch_date_modified"]))
            k = "epoch_date_modified"
            print("{} <- {}".format(time.strftime('%Y-%m-%d', time.localtime(epochs[k])), time.strftime('%Y-%m-%d', time.localtime(doc[k]))))
            assert time.strftime('%Y-%m-%d', time.localtime(epochs[k])) == doc["date_modified"],\
                "{} != {}".format(time.strftime('%Y-%m-%d', time.localtime(epochs[k])), doc["date_modified"])
        if epochs["epoch_date_published"] != doc["epoch_date_published"]:
            print("{} <- {}".format(epochs["epoch_date_published"], doc["epoch_date_published"]))
            k = "epoch_date_published"
            print("{} <- {}".format(time.strftime('%Y-%m-%d', time.localtime(epochs[k])), time.strftime('%Y-%m-%d', time.localtime(doc[k]))))
            assert time.strftime('%Y-%m-%d', time.localtime(epochs[k])) == doc["date_published"],\
                "{} != {}".format(time.strftime('%Y-%m-%d', time.localtime(epochs[k])), doc["date_published"])
        db.incidents.find_one_and_update(
                    doc,
                    {'$set': epochs})
    else:
        print("Is correct: {}".format(doc["incident_id"]))

    return

if __name__ == "__main__":
    print("Getting all incidents...")
    for res in db.incidents.find():
        update_epoch_dates(res)
