const config = require('../config');
const { parse, parseISO } = require('date-fns');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */
exports.up = async ({ context: { client } }) => {
    await client.connect();

    const taxaCollection = client
        .db(config.realm.production_db.db_name)
        .collection('taxa');

    const taxonomies = await taxaCollection.find({}).toArray();

    const classificationsCollection = client
        .db(config.realm.production_db.db_name)
        .collection('classifications');

    const classifications = classificationsCollection.find({});

    while (await classifications.hasNext()) {
        const classification = await classifications.next();
        const taxonomy = taxonomies.find(t => t.namespace === classification.namespace);

        const attributes = [];

        for (const attribute of classification.attributes) {

            const field = taxonomy.field_list.find(f => f.short_name === attribute.short_name);
            const update = { ...attribute }

            if (field) {

                if (attribute.value_json) {

                    if (field.mongo_type === 'date') {

                        const parsed = JSON.parse(attribute.value_json);

                        if (parsed?.match(/^(0[1-9]|1[0-2])-(\d{4})$/)) {

                            update.value = parse(parsed, 'MM-yyyy', new Date());
                        }
                        else if (parsed?.match(/^\d{4}-\d{2}-\d{2}$/)) {

                            update.value = parse(parsed, 'yyyy-MM-dd', new Date());
                        }
                        else if (parsed?.match(/^(0?[1-9]|1[0-2])\/\d{4}$/)) {

                            update.value = parse(parsed, 'MM/yyyy', new Date());
                        }
                        else {

                            update.value = parseISO(parsed);
                        }
                    }
                    else {

                        update.value = JSON.parse(attribute.value_json);
                    }
                }
            }
            else {

                console.log(`Missing field definition for ${attribute.short_name}`);
            }

            attributes.push(update);
        }

        const result = await classificationsCollection.updateOne(
            { _id: classification._id },
            {
                $set: { attributes },
            }
        );

        console.log(
            `Updated ${classification._id} : ${result.modifiedCount}`
        );
    }
};
