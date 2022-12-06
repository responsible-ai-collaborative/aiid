# "Serverless" Database

The AIID is stored on MongoDB as document collections and hosted in [MongoDB Realm](https://www.mongodb.com/realm). MongoDB is responsible for managing the availability and backups of the database, as well as presenting web-accessible APIs for the content. This document details the database structure as is present on the MongoDB servers. Database exports are available upon request to `aiid.export@incidentdatabase.ai`, but for most database development needs you should be able to interface with the production database.

See also: [MongoDB Realm Serverless Functions](realm.md).

# Administering Data

Administering data requires administrative access to the database. This access is presently limited, but through additional functionality that can protect data from vandalism, we may open it to less privileged parties.

# Collections

* `incidents`: this is the main incident collection that links incidents to  reports in a one-to-many relationship
* `reports`: represents a particular report of an incident
* `quickadd`: A collection of links without their associated content. This is to make it easier to capture lots of data that needs to subsequently get processed into full records.
* `submissions`: Prospective full reports before they are rotated into the `reports` collection. These should have the complete `reports` schema minus the elements that are granted when promoted.
* `duplicates`: All the incident numbers that have been migrated to an earlier incident number.
* `taxa`: Metadata describing the taxonomies of the classifications collection.
* `classifications`: All the taxonomic classifications of incident records.
* `entities`: The organizations and individuals related to incidents.


## Incidents Collection Details

### Systems

* `_id`: 5534b8c29cfd494a0103d45a # MongoDB database hash
* `incident_id`: 1 # (int) The incrementing primary key for incidents, which are a collection of reports.
* `reports`: [1, 2, 3] # (Int[]) The list of reports by `report_number`, that belong to this Incident

### Dates

* `date`: 2019-07-25 # (String) Date the incident occurred.

### People

* `editors`: ["Sean McGregor"] # (String[]) Editors responsible for the Incident

### Text

* `title`: ["Anonymous"]: String title

### Other

* `Alleged deployer of AI system`: String[] The entities responsible for deploying the AI system in the real world.
* `Alleged developer of AI system`: String[] The entities responsible for developing the AI system in the real world.
* `Alleged harmed or nearly harmed parties`: String[] The entities harmed as a result of the AI system.

## Reports Collection Details

### Systems

* `_id`: 5534b8c29cfd494a0103d45a # MongoDB database hash
* `ref_number`: 25 # (int) The reference number scoped to the incident the report belongs to
* `report_number`: 2379 # (int) the incrementing primary key for the report. This is a global resource identifier.

### Dates

* `date_downloaded`:`2019-07-25` # (String) Date the report was downloaded.
* `date_submitted`:`2019-07-25` # (String) Date the report was submitted to the AIID. This determines citation order.
* `date_modified`: `2019-07-25` # (String) Date the report was edited.
* `date_published`: `2019-07-25` # (String) The publication date of the report.
* `epoch_incident_date`: `1564016400` # (Int) Date the incident occurred in the Unix Epoch.
* `epoch_date_downloaded`:`1564016400` # (Int) Date the report was downloaded in the Unix Epoch.
* `epoch_date_submitted`:`1564016400` # (Int) Date the report was submitted to the AIID in the Unix Epoch.
* `epoch_date_modified`: `1564016400` # (Int) Date the report was edited in the Unix Epoch.
* `epoch_date_published`: `1564016400` # (Int) The publication date of the report in the Unix Epoch.

### People

* `submitters`: Array(string) # People that submitted the incident report
* `authors`: Array(string) # People that wrote the incident report
* `editors`: Array(string) # The editors of the incident. Editors are listed in the incident citation and can promote user-submitted records to incident reports.

### Text

* `title`: "title of the report" # (string) The title of the report that is indexed.
* `description`: "Short text for the report"
* `text`: "Long text for the report" # (string) This is the complete text for the report in the MongoDB instance, and a shortened subset in the Algolia index
* `tags`: ["Some Tag"] # (String[]) Tags associated with the report.

### Media

* `language`: "en" # (string) The language identifier of the report.
* `image_url`: "http://si.wsj.net/public/resources/images/BN-IM269_YouTub_P_2015051817" # (string) The URL for the image that is indexed. This will be stored on the server as a hash of the URL.
* `source_domain`: "blogs.wsj.com" # (string) The domain name hosting the report.
* `url`: "https://blogs.wsj.com/digits/2015/05/19/googles-youtube-kids-app-criti" # The fully qualified URL to the report as hosted on the web.
* `cloudinary_id`: "reports/<some URL>" Public ID used by Cloudinary to host the report's main image.

[site/realm/data_sources/mongodb-atlas/aiidprod/incidents/schema.json](site/realm/data_sources/mongodb-atlas/aiidprod/incidents/schema.json)

## QuickAdd Collection

[site/realm/data_sources/mongodb-atlas/aiidprod/quickadd/schema.json](site/realm/data_sources/mongodb-atlas/aiidprod/quickadd/schema.json)

## Submissions Collection

[site/realm/data_sources/mongodb-atlas/aiidprod/submissions/schema.json](site/realm/data_sources/mongodb-atlas/aiidprod/submissions/schema.json)

## Duplicates Collection Details

Systems

* `_id`: 5534b8c29cfd494a0103d45a # MongoDB database hash
* `duplicate_incident_number`: 90
* `true_incident_number`: 77

[site/realm/data_sources/mongodb-atlas/aiidprod/duplicates/schema.json](site/realm/data_sources/mongodb-atlas/aiidprod/duplicates/schema.json)

## Taxa Collection Details

**Example Doc**

```json
{
"namespace": "Organization Name Here",
"weight": 50,
"description": "Description of the taxonomy in Markdown here",
"field_list": [
  {FIELD_DESCRIPTION},
  {...},
],
}
```

**Top Level Attributes**

* `_id`: 5534b8c29cfd494a0103d45a # MongoDB database hash
* namespace: this determines how things are presented to users as facets within the Algolia index and determines the named path to the taxonomy's detail page.
* weight: this determines the priority of displaying the taxonomy when multiple taxonomies are entered in the system.
* description: this is a markdown description of the taxonomy that is presented on the taxonomy detail page
* field_list: a list detailing the classifications within the taxonomy

**Field Description List**

* "short_name": "" # the display name for the field when it is presented as a facet. (e.g., "intent" would be presented as `CSET:intent`)
* "long_name": "" # the display name for the field as presented to users.
* "short_description": "This goes in tooltips and other short descriptions" # Must be defined
* "long_description":"This goes in the documentation page for the taxonomy"
* "display_type": "string" # values are in {"string", "text", "multi", "date",  "enum", "bool", "list", "location"}
* "mongo_type": "" # MongoDB datatype see "alias" [here](https://docs.mongodb.com/manual/reference/operator/query/type/#available-types) for acceptable values.
* "default": "" # the values that sit in the form as a starting value when applying a taxonomy. Default: `nil`
* "placeholder": "" # that to place in the form when classifying according to this taxonomy. Default: `nil`
* "permitted_values": [] # optional, only used with `multi` and `enum` display types
* "weight": 0 # Determines presentation order of the classification
* "instant_facet": false # Determines whether the taxonomy item will be exported to the Algolia instant search index
* "required": false # indicates whether the namespace may have classifications associated with it, but without this particular field
* "public": true # indicates that the field should not be displayed to the general public. It will be displayed to authenticated users
* "render_as": string # optional, overwrites the `display_type` property when rendering. The only supported value is `description_toggle` which shows the field's description if its value is `true`.

**Additional notes**

* display_type's values have these additional notes for determining how the mongo_type will be displayed.
  * string: short text of approximately 140 characters
  * text: textual input potentially of arbitrary length
  * multi: multiple selectable short values
  * list: a sequence of short strings not selected from a defined set
  * enum: a single selection from a list of values
  * date: a timestamp dereferences to a specific day. The number of seconds into the day are dropped
  * bool: generally a checkbox
  * location: the string represents a named place which is geocoded as latitude and longitude values

**MongoDB System Schema**

[site/realm/ data_sources/mongodb-atlas/aiidprod/taxa/schema.json](site/realm/data_sources/mongodb-atlas/aiidprod/taxa/schema.json)

## Classifications Collection

**Top Level Attributes**

* `_id`: 5534b8c29cfd494a0103d45a # MongoDB database hash
* `namespace`: "CSET" # this resolves the classifications to their taxa collection entry.
* `incident_id`: 1 # this is the incident number
* `notes`: "Todo list: add x, y, z" # this is for storing additional, general purpose, classification meta data
* `classifications`: `{}` this is all the classifications consistent with its references taxonomy.

**MongoDB System Schema**

It is not specified.

```json
{
  "title": "classification",
  "properties": {
    "_id": {
      "bsonType": "objectId"
    },
    "classifications": {
      "bsonType": "object",
      "properties": {
        "AI Applications": {
          "bsonType": "array",
          "items": {
            "bsonType": "string"
          }
        },
        "AI System Description": {
          "bsonType": "string"
        },
        "AI Techniques": {
          "bsonType": "string"
        },
        "Annotation Status": {
          "bsonType": "string"
        },
        "Annotator": {
          "bsonType": "string"
        },
        "Beginning Date": {
          "bsonType": "string"
        },
        "Data Inputs": {
          "bsonType": "string"
        },
        "Ending Date": {
          "bsonType": "string"
        },
        "Financial Cost": {
          "bsonType": "string"
        },
        "Full Description": {
          "bsonType": "string"
        },
        "Harm Distribution Basis": {
          "bsonType": "array",
          "items": {
            "bsonType": "string"
          }
        },
        "Harm Type": {
          "bsonType": "array",
          "items": {
            "bsonType": "string"
          }
        },
        "Infrastructure Sectors": {
          "bsonType": "array",
          "items": {
            "bsonType": "string"
          }
        },
        "Intent": {
          "bsonType": "string"
        },
        "Laws Implicated": {
          "bsonType": "string"
        },
        "Level of Autonomy": {
          "bsonType": "string"
        },
        "Lives Lost": {
          "bsonType": "bool"
        },
        "Location": {
          "bsonType": "string"
        },
        "Named Entities": {
          "bsonType": "array",
          "items": {
            "bsonType": "string"
          }
        },
        "Nature of End User": {
          "bsonType": "string"
        },
        "Near Miss": {
          "bsonType": "string"
        },
        "Notes": {
          "bsonType": "string"
        },
        "Physical System": {
          "bsonType": "array",
          "items": {
            "bsonType": "string"
          }
        },
        "Problem Nature": {
          "bsonType": "array",
          "items": {
            "bsonType": "string"
          }
        },
        "Public Sector Deployment": {
          "bsonType": "bool"
        },
        "Publish": {
          "bsonType": "bool"
        },
        "Quality Control": {
          "bsonType": "bool"
        },
        "Relevant AI functions": {
          "bsonType": "array",
          "items": {
            "bsonType": "string"
          }
        },
        "Reviewer": {
          "bsonType": "string"
        },
        "Sector of Deployment": {
          "bsonType": "string"
        },
        "Severity": {
          "bsonType": "string"
        },
        "Short Description": {
          "bsonType": "string"
        },
        "System Developer": {
          "bsonType": "string"
        },
        "Technology Purveyor": {
          "bsonType": "array",
          "items": {
            "bsonType": "string"
          }
        }
      }
    },
    "incident_id": {
      "bsonType": "int"
    },
    "namespace": {
      "bsonType": "string"
    },
    "notes": {
      "bsonType": "string"
    }
  }
}
````

**Example**

```json
{
   "_id":{
      "$oid":"60c6e89ea514640922d807b2"
   },
   "incident_id":{
      "$numberInt":"2"
   },
   "namespace":"CSET",
   "notes": "Next tasks: ...",
   "classifications":{
      "Annotator":"1",
      "Annotation Status":"6. Complete and final",
      "Reviewer":"5",
      "Quality Control":false,
      "Full Description":"On December 5, 2018, a robot punctured a can of bear spray in Amazon's fulfillment center in Robbinsville, New Jersey. Amazon's spokesman stated that \"an automated machine punctured a 9-oz can of bear repellent.\" The punctured can released capsaicin, an irritant, into the air. Several dozen workers were exposed to the fumes, causing symptoms including trouble breathing and a burning sensation in the eyes and throat. 24 workers were hospitalized, and one was sent to intensive care and intubated.",
      "Short Description":"Twenty-four Amazon workers in New Jersey were hospitalized after a robot punctured a can of bear repellent spray in a warehouse.",
      "Beginning Date":"2018-12-05T08:00:00.000Z",
      "Ending Date":"2018-12-05T08:00:00.000Z",
      "Location":"Robbinsville, NJ",
      "Near Miss":"Harm caused",
      "Named Entities":[
         "Amazon"
      ],
      "Technology Purveyor":[
         "Amazon"
      ],
      "Intent":"Accident",
      "Severity":"Moderate",
      "Lives Lost":false,
      "Harm Distribution Basis":[],
      "Harm Type":[
         "Harm to physical health/safety",
         "Harm to physical property"
      ],
      "Infrastructure Sectors":[],
      "Finacial Cost":"",
      "Laws Implicated":"Workplace safety laws; OSHA regulations",
      "AI System Description":"An automated machine operating within an Amazon fulfillment center.",
      "Data Inputs":"",
      "System Developer":"",
      "Sector of Deployment":"Transportation and storage",
      "Public Sector Deployment":"No",
      "Nature of End User":"",
      "Level of Autonomy":"Unclear/unknown",
      "Relevant AI functions":[
         "Unclear"
      ],
      "AI Techniques":"",
      "AI Applications":[
         "robotics"
      ],
      "Physical System":[
         "Unknown/unclear"
      ],
      "Problem Nature":[
         "Unknown/unclear"
      ],
      "Publish":true,
      "Notes":""
   }
}
```

## Entities Collection

### Systems

* `entity_id`: `google` # Identifies an Entity, it is generaly the computed slug from the Entity's name.
* `name`: `Google` # Name of the Entity.




