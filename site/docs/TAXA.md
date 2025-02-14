[!WARNING]
Outdated Process
Since we no longer depend on MongoDB Realm, the process for creating new taxonomies described below is outdated and may not work as expected. This documentation needs to be updated to reflect the current database structure and workflow.


## Adding new Taxonomies

### To add new taxonomies, follow these steps:

Let's say you want to add the `CTECH` Taxonomy.

1. Create a new MongoDB collection using the lowercased Taxonomy name: ctech.

2. Define the appropriate rules, relationships, and schema for this new collection. Specifically, a schema that specifies the fields of the taxonomy. An example for the fictional `ctech` schema is below. You can optionally populate the schema and use the MongoDB Realm API to generate the schema programmatically.

`/site/realm/data_sources/mongodb-atlas/aiidprod/ctech/schema.json`

```
{
    "properties": {
        "_id": {
            "bsonType": "objectId"
        },
        "classifications": {
            "bsonType": "object",
            "properties": {
                "taxonomy field 1": {
                    "bsonType": "bool"
                },
                "taxonomy field 2": {
                    "bsonType": "string"
                },
                "Publish": {
                    "bsonType": "bool"
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
    },
    "title": "ctech"
}
```

3. Add the new document to the `taxa` collection, that lists the taxonomy fields. This annotates the classifications found in the new collection and determines properties of their display in the user interface.

```
{
    "_id": {
        "$oid": "61f158f4c19c105af2f3d6af"
    },
    "namespace": "ctech",
    "weight": {
        "$numberInt": "50"
    },
    "description": "# What are these resources?\n\nThe following resources have been associated with incidents in the database to provide tools and processes to persons and companies looking for best practices in the prevention or mitigation of similar incidents in the future.",
    "field_list": [
        {
            "short_name": "taxonomy field 1",
            "long_name": "taxonomy field 1",
            "short_description": "Lorem ipsum...",
            "long_description": "__Lorem ipsum__",
            "display_type": "bool",
            "mongo_type": "bool",
            "default": null,
            "placeholder": null,
            "permitted_values": null,
            "weight": {
                "$numberInt": "70"
            },
            "instant_facet": true,
            "required": false
        },
        {
            "short_name": "Publish",
            "display_type": "bool",
            "mongo_type": "bool"
        }
    ]
}
```

4. Update `createCitationPages.js` to have it pull the new taxonomy definitions. The relevant lines are:

   - /site/gatsby-site/page-creators/createCitationPages.js#L125
   - /site/gatsby-site/page-creators/createCitationPages.js#L180

5. Restart Gatsby

Restarting Gatsby should make the new taxonomy available on the citation pages, so you can visit /cite/1 to see a form for editing the taxonomy. Please note that you will need to be logged in to a user account on the application to see the form.
