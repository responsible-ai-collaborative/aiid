exports = async function (input) {
  let msg = "";
  function log() {
    msg += (
      Object.values(arguments)
        .map(a => JSON.stringify(a, null, 2))
        .join(" ")
    ) + '\n\n' ;
  }

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
  log(`changedAttributes`, changedAttributes);

  const oldTags = tagsFromClassification({ 
    namespace: input.namespace,
    attributes: input.old_attributes 
  });
  log(`oldTags`, oldTags);

  const allCurrentTags = tagsFromClassification({
    namespace: input.namespace,
    attributes: changedAttributes
  });
  log(`allCurrentTags`, allCurrentTags);

  const newTags = allCurrentTags.filter(tag => !oldTags.includes(tag));
  log(`newTags`, newTags);


  const checklistsCollection = context.services.get('mongodb-atlas').db('aiidprod').collection("checklists");

  const subscriptionsCollection = context.services.get('mongodb-atlas').db('customData').collection("subscriptions");
  
  const notificationsCollection = context.services.get('mongodb-atlas').db('customData').collection("notifications");

  const subscriptions = await subscriptionsCollection.find({
    type: 'checklist'
  }).toArray();


  const checklists = [];

  for (const subscription of subscriptions) {

    log(`subscription`, subscription);
    
    const checklist = await checklistsCollection.findOne({ id: subscription.checklistId });
    log(`checklist`, checklist);

    checklists.push(checklist);

    const queryTags = [
      ...checklist.tags_goals,
      ...checklist.tags_methods,
      ...checklist.tags_other
    ];

    log('queryTags', queryTags)

    const risks = await context.functions.execute('risksResolver', { tags: queryTags, graphql: false });
    log(`risks`, risks.map(r => r.tag));

    // TODO: Notification should be triggered in any of these cases:
    //
    // 1. The user adds a new risk tag to a classification AND
    //    that risk is included in `risks` AND
    //    this incident is the only precedent for that risk.
    //
    // 2. The user adds a new query (non-risk) tag to a classification AND
    //    that tag matches the query AND
    //    there is a risk included in the `risks` for which (
    //      this incident is the only precedent AND
    //      none of the classification's other tags match the query
    //    )

    const thisIncidentIsTheOnlyPrecedent = (risk) => (
      risk.precedents.length == 1 &&
      input.incidents.includes(risk.precedents[0].incident_id)
    )
    log(`thisIncidentIsTheOnlyPrecedent`, thisIncidentIsTheOnlyPrecedent);

    const allCurrentTagsMatchingQuery = allCurrentTags.filter(
      tag => queryTags.includes(tag)
    );
    log(`allCurrentTagsMatchingQuery`, allCurrentTagsMatchingQuery);

    const isTheOnlyMatchingTag = (tag) => (
      allCurrentTagsMatchingQuery.length == 1 && 
      allCurrentTagsMatchingQuery[0] == tag 
    );
    log(`isTheOnlyMatchingTag`, isTheOnlyMatchingTag);


    const newRiskTags = [];

    for (const newTag of newTags) {

      const newTagRisk = risks.find(r => r.tag == newTag);

      if (newTagRisk && thisIncidentIsTheOnlyPrecedent(newTagRisk)) {
        newRiskTags.push(newTag);
      }

      if (isTheOnlyMatchingTag(newTag)) {
        for (const risk of risks) {
          if (thisIncidentIsTheOnlyPrecedent(risk)) {
            newRiskTags.push(risk.tag);
          }
        }
      }
    }
    log(`newRiskTags`, newRiskTags);

    if (newRiskTags.length > 0) {
      notificationsCollection.insertOne({
        type: 'checklist',
        processed: false,
        incident_id: input.incidents[0], // TODO: Multiple?
        checklist_id: subscription.checklistId,
      });
    }
  }

  return { msg };
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
