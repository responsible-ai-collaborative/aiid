"""
# About #

Package a directory of incidents into the form expected by the Algolia search engine.
After creating the Algolia package, you can upload it as an index to Algolia, then
craft how the index will be searched and returned to the Javascript client.

# Usage #

0. Collect all the incidents you want to incident from the web with the
   `capture/capture.py` script. This will generate a directory with a set
   of JSON files.
1. The capture script will create a series of JSON records in a directory,
   where each record is named `INCIDENTNUMBER.link.LINKNUMBER.json`.
   The incident number is an incrementing primary key for referencing
   the incident. The link number is a counter of links for the
   incident. The directory containing these JSONs is your
   `capture_directory`.
2. Run `python scripts/algolia_package.py --capture_path PATH/TO/CAPTURES --output_path PATH/FOR/OUTPUT`

"""

import glob
import json
import os.path
import argparse

def process_doc(doc, filename, max_field_length=5000):
    """
    Update the fields of the doc for display within Algolia.

    Args:
        doc (dict): The dictionary for the current doc.
        filename (str): The name of the file as it resides on disk. This is parsed for
            the incident identifier.
        max_field_length (int): Algolia has a max record length of 10k characters.
            This parameter controls the truncation length of all attributes within
            a record.

    Return:
        None. The doc is updated.
    """
    for k in doc.keys():
        if doc[k] is not None and len(doc[k]) > max_field_length:
            doc[k] = doc[k][:max_field_length]
    incident_id =  int(filename.split(".")[0])
    ref_number = int(filename.split(".")[2])
    doc["incident_id"] = incident_id
    doc["ref_number"] = ref_number
    if "www." in doc["source_domain"] and doc["source_domain"].index("www.") == 0:
        doc["source_domain"] = doc["source_domain"][4:]

def collect_algolia_index(index_files_directory, out_directory, max_field_length=5000):
    """
    Coerce A set of individual JSON documents into a single index file for upload onto Algolia.

    Args:
        index_files_directory (str): Where all the web scraped JSON files are stored.
        out_directory (str): Where the Algolia index file will be written.
        max_field_length (int): Algolia has a max record length of 10k characters.
            This parameter controls the truncation length of all attributes within
            a record.

    Return:
        None. A JSON file is written to disk.
    """
    big_doc =  []
    files = glob.glob(index_files_directory + "*.json")
    for f in files:
        with open(f, "r") as infile:
            doc = json.loads(infile.read())
            filename = os.path.basename(f)
            process_doc(doc, filename, max_field_length=max_field_length)
            big_doc.append(doc)
    outfile_name = os.path.join(out_directory, "index.json")
    with open(outfile_name, "w") as outfile:
        json.dump(big_doc, outfile)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-c",
        "--capture_path",
        default="captures/jsons/newsplease/",
        type=str,
        help="path to the captured web resources")
    parser.add_argument("-o",
        "--output_path",
        default="indices/algolia/v0/",
        type=str,
        help="where to place the output file")
    args = parser.parse_args()
    collect_algolia_index(args.capture_path, args.output_path)
