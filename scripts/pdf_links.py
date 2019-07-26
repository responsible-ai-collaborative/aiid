#!/usr/bin/env python
"""

# About #

A simple script for PDFing all the websites associated with AI Incidents.

# Usage #

Place the most up to date CSV file into the data directory, then run this
script.

"""

import csv
import pdfkit
import time
import os.path

# Where we write problems PDFing files
logname = time.strftime("logs/%Y%m%d-%H%M%S.log")
print(logname)

# Names of the incident link columns
link_fields = ['Link 1', 'Link 2', 'Link 3', 'Link 4', 'Link 5',
               'Link 6', 'Link 7', 'Link 8', 'Link 9', 'Link 10',
               'Link 11', 'Link 12', 'Link 13', 'Link 14', 'Link 15',
               'Link 16', 'Link 17', 'Link 18', 'Link 19', 'Link 20',
               'Link 21', 'Link 22', 'Link 23', 'Link 24', 'Link 25',
               'Link 26', 'Link 27', 'Link 28', 'Link 29', 'Link 30']

# Default options for PDFing websites
pdfkit_options = {
    'page-size': 'Letter',
    'margin-top': '0.75in',
    'margin-right': '0.75in',
    'margin-bottom': '0.75in',
    'margin-left': '0.75in',
    #'encoding': "UTF-8",
    #'custom-header' : [
    #    ('Accept-Encoding', 'gzip')
    #],
    #'cookie': [
    #    ('cookie-name1', 'cookie-value1'),
    #    ('cookie-name2', 'cookie-value2'),
    #],
    #'no-outline': None
}

def get_pdf_path(incident_id, link_number):
    """ Get the path to the file where we want to store the PDF

    Args:
        incident_id (str): The string identifier of the incident.
        link_number (int): The document reference number for the PDF.

    Return:
        (str): The relative path to the storage location for the file.
    """
    out_name = incident_id + ".link" + str(link_number) + ".pdf"
    return "captures/pdfs/" + out_name

def collect_pdfs(filepath):
    """Print the CSV file contents

    Args:
        filepath (str): The path to the CSV file we will be processing.

    Return:
        None
    """
    with open(filepath) as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
        print("#######################")
        print("CSV Field names are:")
        print(reader.fieldnames)
        print("#######################")
        for row in reader:
            for idx, link_number in enumerate(link_fields):
                if len(row[link_number]) > 10:
                    pdf_path = get_pdf_path(row["Incident number"], idx)
                    if os.path.exists(pdf_path):
                        print("Skipping: " + pdf_path)
                        continue
                    print("PDFing: " + row[link_number])
                    print("...and storing to: " + pdf_path)
                    try:
                        pdfkit.from_url(row[link_number],
                                        pdf_path,
                                    options=pdfkit_options)
                    except Exception as err:
                        print("Exception Written to Log")
                        with open(logname, "a") as logfile:
                            logfile.write(str(err))

if __name__ == '__main__':
    collect_pdfs("data/seed_data.csv")
