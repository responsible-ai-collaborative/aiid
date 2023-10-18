exports = async function (input) {

  try {
    // TODO: This should add documents to the notifications collection
    // for each subscription to a checklist that has a query
    // matched by the updated value.
    //
    const changedAttributes = [];

    for (const newAttribute of input.new_attributes) {
      const matchingOldAttribute = input.old_attributes?.find(
        (oldAttribute) => oldAttribute.short_name == newAttribute.short_name
      );

      if (
        newAttribute?.value_json != matchingOldAttribute?.value_json &&
        newAttribute?.value_json != '""' &&
        newAttribute?.value_json != null
      ) {
        changedAttributes.push(newAttribute);
      }
    }

    const oldTags = tagsFromClassification({ 
      namespace: input.namespace,
      attributes: input.old_attributes 
    });

    const newTags = tagsFromClassification({
      namespace: input.namespace,
      attributes: changedAttributes
    }).filter(tag => !oldTags.includes(tag));


    const checklistsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("checklists");

    const subscriptionsCollection = context.services.get('mongodb-atlas').db('customData').collection("subscriptions");
    
    const notificationsCollection = context.services.get('mongodb-atlas').db('customData').collection("notifications");

    const subscriptions = await subscriptionsCollection.find({
      type: 'checklist'
    }).toArray();

  //  const subscriptions = [];
  //
  //  while (await subscriptionsCursor.hasNext()) {
  //    const subscription = await subscriptionsCursor.next(); 
  //    
  //    subscriptions.push(subscription);
  //  }

    const out = [];

    const checklists = [];

    for (const subscription of subscriptions) {
      const checklist = await checklistsCollection.findOne({ id: subscription.checklistId });

      checklists.push(checklist);

      const queryTags = [
        ...checklist.tags_goals,
        ...checklist.tags_methods,
        ...checklist.tags_other
      ];
  
      const risks = await context.functions.execute('risksResolver', { tags: queryTags});

      const outItem = { allRisks: risks.map(risk => risk.tag) };
  
      // risks for which all precedents are in input.incidents
      // would not have been risks but for this incident classification
      const newRisks = risks.filter(risk => {
        for (const precedent of risk.precedents) {
          if (!input.incidents.includes(precedent.incident_id)) {
            return false;
          }
        } 
        return true;
      });

      if (newRisks.length > 0) {
        notificationsCollection.insertOne({
          type: 'checklist',
          processed: false,
          incident_id: input.incidents[0], // TODO: Multiple?
          checklist_id: subscription.checklistId,
        });
      }

      outItem.newRisks = newRisks.map(risk => risk.tag);

      out.push(outItem);
    }

    return { msg: JSON.stringify({ subscriptions, oldTags, newTags, out }, null, 2) };
  } catch (error) {
    return { msg: 'error' }
  }
};

if (typeof module === 'object') {
  module.exports = exports;
}

// Example classification:
// {
//   attributes: [
//     { short_name: "Known AI Goal"},
//       value_json: '["Content Recommendation", "Something"]' }
//     ...
//   ]
// }
const tagsFromClassification = (classification) => (
  joinArrays(
    classification.attributes.filter(a => ![null, undefined].includes(a.value_json)).map(
      attribute => (
        [].concat(parseJson(attribute.value_json))
          .filter(value => Array.isArray(value) || typeof value !== 'object')
          .map(
            value => [
              classification.namespace,
              attribute.short_name,
              value
            ].join(':')
          )
      )
    )
  )
);

const parseJson = (json) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error('Could not parse ' + json)
  }
}

const joinArrays = (arrays) => arrays.reduce(
  (result, array) => result.concat(array), []
);
