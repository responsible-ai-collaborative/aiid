#!/usr/bin/env python
"""

# About #

A simple script for collecting a set of JSON files containing the incident content.
A scraping/parsing library iterates through each of the links in an incident, then saves
JSONs for each containing the web content. Next you can optionally create a JSON
document representing the merged content of the source spreadsheet and the web content.

# Usage #

Place the most up to date CSV file into the data directory, then run this
script.

"""

import csv
import time
import json
import os.path
import argparse
from newsplease import NewsPlease

def get_json_name(incident_id, link_number):
    """ Get the path to the file where we want to store the JSON collected
        from the website.

    Args:
        incident_id (str): The string identifier of the incident.
        link_number (int): The document reference number for the JSON.

    Return:
        (str): The relative path to the storage location for the file.
    """
    out_name =  incident_id + ".link." + str(link_number) + ".json"
    return out_name

def collect_jsons(filepath, web_capture_output_path):
    """Collect the web content associated with each incident record
    and save it to the disc as a JSON.

    Args:
        filepath (str): The path to the CSV file we will be processing.
        web_capture_output_path (str): The path to store the
            web captured output JSONs.

    Return:
        None: Files will be written to the filesystem.
    """

    # Where we write problems collecting JSONs
    logname = time.strftime("logs/%Y%m%d-%H%M%S.log")
    print("Writing errors to logfile: ", logname)

    # Names of the incident link columns
    link_fields = ['link ' + str(i) for i in range(1,31)] 

    with open(filepath, 'r') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
        print("#######################")
        print("CSV Field names are:")
        print(reader.fieldnames)
        print("#######################")
        for row in reader:
            for idx, link_number in enumerate(link_fields):
                if len(row[link_number]) > 10:
                    json_name = get_json_name(row["Incident number"], idx)
                    json_path = os.path.join(web_capture_output_path, json_name)
                    if os.path.exists(json_path):
                        print("Skipping: " + json_path)
                        continue
                    print("Collecting: " + row[link_number])
                    print("...and storing to: " + json_path)
                    try:
                        article = NewsPlease.from_url(row[link_number])
                        assert article.date_download is not None
                        with open(json_path, 'w') as outfile:
                            json.dump(article.get_dict(), outfile, indent=4, sort_keys=True, default=str)
                    except Exception as err:
                        print("Exception Written to Log")
                        with open(logname, "a") as logfile:
                            err_details = "{},{},{},{}\n".format(row[link_number], idx, link_number, str(err))
                            logfile.write(err_details)

def merge_web_with_local():
    """todo"""
    raise NotImplementedError

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-c",
        "--csv_path",
        default="data/seed_data.csv",
        type=str,
        help="path to the CSV data for collection")
    parser.add_argument("-w",
        "--web_capture_output_path",
        default="captures/jsons/newsplease/",
        type=str,
        help="where to place the JSONs collected by NewsPlease")
    args = parser.parse_args()
    collect_jsons(args.csv_path, args.web_capture_output_path)
