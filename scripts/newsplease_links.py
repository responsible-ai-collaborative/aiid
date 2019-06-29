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

def add_csv_to_doc(doc, csv_row):
    """Add various attributes to the document for indexing that are found in the CSV doc"""
    doc["Submitter"] = ""
    row_keys = [["From AI Failures list?", ["Submitter", "Catherine Olsson"]],
        ["From published Yampolskiy papers", ["Submitter", "Roman Yampolskiy"]],
        ["From Google form answers", ["Submitter", "Anonymous"]],
        ["From unpublished Yampolskiy links", ["Submitter", "Roman Yampolskiy"]],
        ["Start date", "Start Date"],
        ["End date (if known)", "End Date"],
        ["Meets preliminary definition", "Meets Preliminary Definition"],
        ["Uncertain whether this is an incident?", "Uncertain"],
        ["Short description of scenario", "Sam Yoon Description"],
        ["Scale of harm (# of harmed)", "Sam Yoon Estimated Scale of Harm"],
        ["Harmed party", "Sam Yoon Assessed Harmed Party"],
        ["Harm caused", "Sam Yoon Assessed Harm Caused"],
        ["Response or mitigation (as time allows)", "Sam Yoon Assessed Response or Mitigation"],
        ["Search words", "Sam Yoon Search Words"]]
    for row_key in row_keys:
        if type(row_key[1]) is list:
            if csv_row[row_key[0]] ==  "Y":
                doc["Submitter"] = row_key[1][1]
        else:
            doc[row_key[1]] = csv_row[row_key[0]]

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
    link_fields = ['Link ' + str(i) for i in range(1,31)]

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
                        print("Skipping download of: " + json_path)
                        with open(json_path) as json_file:
                            doc = json.load(json_file)
                    else:
                        print("Collecting: " + row[link_number])
                        print("...and storing to: " + json_path)
                        try:
                            article = NewsPlease.from_url(row[link_number])
                            assert article.date_download is not None
                            doc = article.get_dict()
                        except Exception as err:
                            print("Exception Written to Log")
                            with open(logname, "a") as logfile:
                                err_details = "{},{},{},{}\n".format(row[link_number], idx, link_number, str(err))
                                logfile.write(err_details)
                            doc = {
                                "authors": [],
                                "date_download": "",
                                "date_modify": "",
                                "date_publish": "",
                                "description": "",
                                "filename": "",
                                "image_url": "",
                                "language": "",
                                "localpath": "",
                                "source_domain": "",
                                "text": "",
                                "title": "",
                                "title_page": "",
                                "title_rss": "",
                                "url": ""
                            }
                    add_csv_to_doc(doc, row)
                    with open(json_path, 'w') as outfile:
                        json.dump(doc, outfile, indent=4, sort_keys=True, default=str)

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
