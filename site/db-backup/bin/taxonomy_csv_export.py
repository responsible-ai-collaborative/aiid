import sys
import json
import csv
import os

def taxonomy_csv_export(namespace, taxa_file, classification_file, target_folder):

    print(f"Processing namespace '{namespace}'...")

    # Read data from the JSON file for "taxa"
    with open(taxa_file, 'r', encoding='utf-8') as f:
        taxa_items = json.load(f)
        
        # Filter taxa items for the current namespace
        filtered_taxa_items = [item for item in taxa_items if item['namespace'] == namespace]
        
        # Get the list of fields from the first filtered item
        field_list = [{'short_name': field['short_name']} for field in filtered_taxa_items[0]['field_list']]

    # Read data from the JSON file for "classifications"
    with open(classification_file, 'r', encoding='utf-8') as f:
        classification_items = json.load(f)
    
    # Prepare CSV headers from "field_list.short_name"
    headers = [field['short_name'] for field in field_list]

    # Ensure the target folder exists
    os.makedirs(target_folder, exist_ok=True)

    # Create a CSV file for the "namespace" in the target folder
    csv_filename = os.path.join(target_folder, f"classifications_{namespace}.csv")
    
    with open(csv_filename, mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write the header row to the CSV
        writer.writerow(['Namespace', 'Incident ID', 'Published'] + headers)
        
        # Iterate over the "classification" documents and write rows to the CSV
        for classification_item in classification_items:
            if classification_item['namespace'] != namespace:
                continue
            
            incidents = classification_item.get('incidents', [])
            incident_value = incidents[0] if incidents else ''
            
            attributes = classification_item['attributes']

            published_value = classification_item.get('publish', '')
            
            # Create a dictionary to quickly access attribute values by "short_name"
            attribute_dict = {}
            for attr in attributes:
                value = json.loads(attr['value_json']) if 'value_json' in attr else ''
                if isinstance(value, list):
                    value = ', '.join(map(str, value))
                attribute_dict[attr['short_name']] = value
            
            # Get the corresponding values for each header
            row = [attribute_dict.get(header, '') for header in headers]
            
            # Write the row to the CSV file
            writer.writerow([namespace, incident_value, published_value] + row)

    print(f"CSV file '{csv_filename}' generated successfully.")

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python process_namespace.py <namespace> <taxa_file> <classification_file> <target_folder>")
        sys.exit(1)

    namespace = sys.argv[1]
    taxa_file = sys.argv[2]
    classification_file = sys.argv[3]
    target_folder = sys.argv[4]

    taxonomy_csv_export(namespace, taxa_file, classification_file, target_folder)