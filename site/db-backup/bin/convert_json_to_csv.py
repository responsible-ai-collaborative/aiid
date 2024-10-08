import json
import csv
import sys

def json_to_csv(json_file, csv_file, fields=None):
    with open(json_file, 'r', encoding='utf-8') as f_json:
        data = json.load(f_json)

    if not data:
        print(f"The JSON file '{json_file}' is empty.")
        sys.exit(1)

    # Extract headers from the keys of the dictionaries in the data if fields are not provided
    if fields is None:
        headers = set()
        for entry in data:
            headers.update(entry.keys())
        headers = list(headers)
    else:
        headers = fields.split(',')

    with open(csv_file, 'w', newline='', encoding='utf-8') as f_csv:
        writer = csv.writer(f_csv, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL, escapechar='\\', lineterminator='\n')

        # Write the header row
        writer.writerow(headers)

        # Write data rows
        for entry in data:
            row = []
            for header in headers:
                value = entry.get(header, '')
                if isinstance(value, list):
                    # Convert list to a comma-separated string
                    value = ', '.join(map(str, value))
                elif isinstance(value, dict) and '$date' in value:
                    value = value['$date']
                elif isinstance(value, dict) and '$oid' in value:
                    value = value['$oid']
                row.append(value)
            writer.writerow(row)
    
    print(f"CSV file '{csv_file}' generated successfully.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_json_to_csv.py <json_file> <csv_file> [fields]")
        sys.exit(1)

    json_file = sys.argv[1]
    csv_file = sys.argv[2]
    fields = sys.argv[3] if len(sys.argv) > 3 else None

    json_to_csv(json_file, csv_file, fields)