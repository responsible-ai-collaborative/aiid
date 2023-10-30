const config = require('../config');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  await client.connect();

  const db = client.db(config.realm.production_db.db_name);

  const reports = db.collection('reports');

  let docs = await reports.find({}).toArray();

  await Promise.all(
    docs.map((doc) => {
      // Convert epoch timestamps (in seconds) to milliseconds, and then to MongoDB's Date type
      const date_downloaded = new Date(doc.epoch_date_downloaded * 1000);

      const date_modified = new Date(doc.epoch_date_modified * 1000);

      const date_published = new Date(doc.epoch_date_published * 1000);

      const date_submitted = new Date(doc.epoch_date_submitted * 1000);

      // Update the collection with the new Date type values
      return reports.updateOne(
        { _id: doc._id },
        {
          $set: {
            date_downloaded: date_downloaded,
            date_modified: date_modified,
            date_published: date_published,
            date_submitted: date_submitted,
          },
        }
      );
    })
  );

  console.log('Migration completed!');
  // const cursor = reports.find({});

  // const updateResult = await reports.updateMany({},
  //   [
  //     {
  //       $set: {
  //         date_downloaded: {
  //           $toDate: "$date_downloaded"
  //         },
  //         date_modified: {
  //           $toDate: "$date_modified"
  //         },
  //         date_published: {
  //           $toDate: "$date_published"
  //         },
  //         date_submitted: {
  //           $toDate: "$date_submitted"
  //         }
  //       }
  //     }
  //   ])

  //   const updateResult = await reports.updateMany({}, [
  //   {
  //     $set: {
  //       date_downloaded_new: {
  //         $toDate: {
  //           $multiply: ["$epoch_date_downloaded", 1000]
  //         }
  //       },
  //       date_modified_new: {
  //         $toDate: {
  //           $multiply: ["$epoch_date_modified", 1000]
  //         }
  //       },
  //       date_published_new: {
  //         $toDate: {
  //           $multiply: ["$epoch_date_published", 1000]
  //         }
  //       },
  //       date_submitted_new: {
  //         $toDate: {
  //           $multiply: ["$epoch_date_submitted", 1000]
  //         }
  //       }
  //     }
  //   }
  // ]);

  // while (await cursor.hasNext()) {
  //   const doc = await cursor.next();
  //   let dateStrs = [doc.date_modified, doc.date_downloaded, doc.date_submitted, doc.date_published];

  //   // Check if the dateStr has the specific format
  //   dateStrs.forEach(async dateStr => {
  //     console.log(dateStr);
  //     if (dateStr && dateStr['$toString'] && dateStr['$toString'] === '$date_modified') {
  //       dateStr = doc['$toString'];  // Adjust accordingly if this isn't the actual value you're expecting
  //     }

  //     if (dateStr && typeof dateStr === 'string') {
  //       const newDate = new Date(dateStr);
  //       await reports.updateOne({ _id: doc._id }, { $set: { date_modified: newDate } });

  //       // Fetching the updated document
  //       const updatedDoc = await reports.findOne({ _id: doc._id });
  //       console.log("Updated Entry:", updatedDoc);
  //     }
  //   })
  // }

  // Update the schema of the reports collection
  // const updateResult = await db.collection("reports").updateMany(
  //   {},
  //   [{
  //     $set: {
  //       date_modified: {
  //         $toDate: "$date_modified" // Convert the string to a date
  //       },
  //       // date_downloaded: {
  //       //   $toDate: "$date_downloaded" // Convert the string to a date
  //       // },
  //       // date_published: {
  //       //   $toDate: "$date_published" // Convert the string to a date
  //       // },
  //       // date_submitted: {
  //       //   $toDate: "$date_submitted" // Convert the string to a date
  //       // }
  //     }
  //   }]
  // );

  // console.log('Update result:', updateResult);
  // const database = client.db("your-database-name");
  // const collection = db.collection("reports");

  // const pipeline = [
  //   {
  //     $project: {
  //       date_downloaded: {
  //         $dateFromString: {
  //           dateString: "$date_downloaded",
  //           format: "%Y-%m-%d", // Adjust the format to match your data
  //           timezone: "UTC", // Adjust timezone if necessary
  //         },
  //       },
  //     },
  //   },
  // ];

  // const result = await collection.aggregate(pipeline).toArray();
  // console.log(result);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
