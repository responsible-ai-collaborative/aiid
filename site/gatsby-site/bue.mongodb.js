/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('aiidprod');


db.classifications.aggregate([
    { $match: { "namespace": "AILD" } },
    {
        $project: { "namespace": 1, "attributes.value": 1, "attributes.short_name": 1 }
    },
    {
        $unwind: "$attributes",
    },
    // {
    //     $facet: {
    //         "Area of Application List": [
    //             { $match: { "attributes.short_name": "Area of Application List" } },
    //             { $unwind: "$attributes.value" },
    //             { $group: { _id: "$attributes.value", count: { $sum: 1 } } },
    //         ],
    //         "Caption": [
    //             { $match: { "attributes.short_name": "Caption", "attributes.value": { $exists: true } } },
    //             { $count: "count"},
    //         ],
    //     },
    // },
    // {
    //     $project: {
    //       short_name: 1,
    //       value: 1,
    //     }
    // }
    // {
    //   $facet: {
    //     "Record Number": [
    //       { $match: { "attributes.short_name": "Record Number" } },
    //       { $group: { _id: "$attributes.value", count: { $sum: 1 } } },
    //     ],
    //     "Caption": [
    //       { $match: { "attributes.short_name": "Caption" } },
    //       { $group: { _id: "$attributes.value", count: { $sum: 1 } } },
    //     ],
    //     // Add other attributes here
    //   },
    // },
])


// // Here we run an aggregation and open a cursor to the results.
// // Use '.toArray()' to exhaust the cursor to return the whole result set.
// // You can use '.hasNext()/.next()' to iterate through the cursor page by page.
// db.getCollection('sales').aggregate([
//   // Find all of the sales that occurred in 2014.
//   { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
//   // Group the total sales for each product.
//   { $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: [ '$price', '$quantity' ] } } } }
// ]);
