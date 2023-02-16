const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  await taxaCollection.insertOne(gmfTaxaEntry);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  await taxaCollection.deleteOne({ namespace: 'GMF' });
};

var handleWhitespace = (string) =>
  string
    .trim()
    .split('\n')
    .map((line) => line.replace(/ */, ''))
    .join('\n');

var gmfTaxaEntry = {
  namespace: 'GMF',
  weight: 70,
  description: handleWhitespace(`
    ## What is the GMF Taxonomy?

    The Goals, Methods, and Failures (GMF) taxonomy is a failure 
    cause analysis taxonomy interrelating the goals of the system 
    deployment, the system's methods, and their likely failings. 
    Details on the process are available in the recent work published 
    for [SafeAI paper](https://arxiv.org/abs/2211.07280).

    ## How do I explore the taxonomy?

    All taxonomies can be used to filter incident reports within the 
    Discover Application. The taxonomy filters work similarly to how 
    you filter products on an E-commerce website. Use the search 
    field at the bottom of the “Classifications” tab to find the 
    taxonomy field you would like to filter with, then click the 
    desired value to apply the filter.

    ## About the Responsible AI Collaborative

    The AI Incident Database is a collaborative project of many 
    people and organizations. Details on the people and organizations 
    contributing to this particular taxonomy will appear here, while 
    you can learn more about the Collab itself on the incident 
    database [home](https://incidentdatabase.ai/) and 
    [about](https://incidentdatabase.ai/about/) pages.

    The maintainers of this taxonomy include,

    * [Nikiforos Pittaras](https://www.linkedin.com/in/nikiforos-pittaras/)
    * [Sean McGregor](https://www.linkedin.com/in/seanbmcgregor/)
  `),
  dummy_fields: [
    { field_number: '1', short_name: 'Goals' },
    { field_number: '2', short_name: 'Methods' },
    { field_number: '3', short_name: 'Failures' },
  ],
  field_list: [
    {
      field_number: '1.1.1',
      short_name: 'Known AI Goal',
      long_name: 'Known AI Goal',
      short_description:
        'An AI Goal which is almost certainly pursued by the AI system referenced in the incident.',
      long_description:
        'An AI Goal which is almost certainly pursued by the AI system referenced in the incident.',
      display_type: 'list',
      mongo_type: 'array',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '1.1.2',
      short_name: 'Known AI Goal Snippets',
      long_name: 'Known AI Goal Snippets',
      short_description: 'One or more snippets that justify the classification.',
      long_description: 'One or more snippets that justify the classification.',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
      display_type: 'object-list',
      mongo_type: 'array',
      subfields: [
        {
          short_name: 'Snippet Text',
          long_name: 'Snippet Text',
          short_description: 'Snippet Text',
          long_description: 'Snippet Text',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Related Classifications',
          long_name: 'Related Classifications',
          short_description:
            'The Known AI Goal Classification classifications from above which this snippet supports',
          long_description:
            'The Known AI Goal Classification classifications from above which this snippet supports',
          display_type: 'list',
          mongo_type: 'array',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Snippet Discussion',
          long_name: 'Snippet Discussion',
          short_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          long_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
      ],
    },
    {
      field_number: '1.1.3',
      short_name: 'Known AI Goal Classification Discussion',
      long_name: 'Known AI Goal Classification Discussion',
      short_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      long_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '1.2.1',
      short_name: 'Potential AI Goal',
      long_name: 'Potential AI Goal',
      short_description:
        'An AI Goal which is probably pursued by the AI system referenced in the incident.',
      long_description:
        'An AI Goal which is probably pursued by the AI system referenced in the incident.',
      display_type: 'list',
      mongo_type: 'array',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '1.2.2',
      short_name: 'Potential AI Goal Snippets',
      long_name: 'Potential AI Goal Snippets',
      short_description: 'One or more snippets that justify the classification.',
      long_description: 'One or more snippets that justify the classification.',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
      display_type: 'object-list',
      mongo_type: 'array',
      subfields: [
        {
          short_name: 'Snippet Text',
          long_name: 'Snippet Text',
          short_description: 'Snippet Text',
          long_description: 'Snippet Text',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Related Classifications',
          long_name: 'Related Classifications',
          short_description:
            'The Potential AI Goal classifications from above which this snippet supports',
          long_description:
            'The Potential AI Goal classifications from above which this snippet supports',
          display_type: 'list',
          mongo_type: 'array',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Snippet Discussion',
          long_name: 'Snippet Discussion',
          short_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          long_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
      ],
    },
    {
      field_number: '1.2.3',
      short_name: 'Potential AI Goal Classification Discussion',
      long_name: 'Potential AI Goal Classification Discussion',
      short_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      long_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '2.1.1',
      short_name: 'Known AI Technology',
      long_name: 'Known AI Technology',
      short_description:
        'An AI Technology which is almost certainly a part of the implementation of the AI system referenced in the incident.',
      long_description:
        'An AI Technology which is almost certainly a part of the implementation of the AI system referenced in the incident.',
      display_type: 'list',
      mongo_type: 'array',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '2.1.2',
      short_name: 'Known AI Technology Snippets',
      long_name: 'Known AI Technology Snippets',
      short_description: 'One or more snippets that justify the classification.',
      long_description: 'One or more snippets that justify the classification.',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
      display_type: 'object-list',
      mongo_type: 'array',
      subfields: [
        {
          short_name: 'Snippet Text',
          long_name: 'Snippet Text',
          short_description: 'Snippet Text',
          long_description: 'Snippet Text',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Related Classifications',
          long_name: 'Related Classifications',
          short_description:
            'The Known AI Technology classifications from above which this snippet supports',
          long_description:
            'The Known AI Technology classifications from above which this snippet supports',
          display_type: 'list',
          mongo_type: 'array',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Snippet Discussion',
          long_name: 'Snippet Discussion',
          short_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          long_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
      ],
    },
    {
      field_number: '2.1.3',
      short_name: 'Known AI Technology Classification Discussion',
      long_name: 'Known AI Technology Classification Discussion',
      short_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      long_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '2.2.1',
      short_name: 'Potential AI Technology',
      long_name: 'Potential AI Technology',
      short_description:
        'An AI Method / Technology which probably is a part of the implementation of the AI system referenced in the incident.',
      long_description:
        'An AI Method / Technology which probably is a part of the implementation of the AI system referenced in the incident.',
      display_type: 'list',
      mongo_type: 'array',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '2.2.2',
      short_name: 'Potential AI Technology Snippets',
      long_name: 'Potential AI Technology Snippets',
      short_description: 'One or more snippets that justify the classification.',
      long_description: 'One or more snippets that justify the classification.',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
      display_type: 'object-list',
      mongo_type: 'array',
      subfields: [
        {
          short_name: 'Snippet Text',
          long_name: 'Snippet Text',
          short_description: 'Snippet Text',
          long_description: 'Snippet Text',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Related Classifications',
          long_name: 'Related Classifications',
          short_description:
            'The Potential AI Technology classifications from above which this snippet supports',
          long_description:
            'The Potential AI Technology classifications from above which this snippet supports',
          display_type: 'list',
          mongo_type: 'array',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Snippet Discussion',
          long_name: 'Snippet Discussion',
          short_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          long_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
      ],
    },
    {
      field_number: '2.2.3',
      short_name: 'Potential AI Technology Classification Discussion',
      long_name: 'Potential AI Technology Classification Discussion',
      short_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      long_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '3.1.1',
      short_name: 'Known AI Technical Failure',
      long_name: 'Known AI Technical Failure',
      short_description:
        'An AI Technical Failure which almost certainly contributes to the AI system failure referenced in the incident.',
      long_description:
        'An AI Technical Failure which almost certainly contributes to the AI system failure referenced in the incident.',
      display_type: 'list',
      mongo_type: 'array',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '3.1.2',
      short_name: 'Known AI Technical Failure Snippets',
      long_name: 'Snippets',
      short_description: 'One or more snippets that justify the classification.',
      long_description: 'One or more snippets that justify the classification.',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
      display_type: 'object-list',
      mongo_type: 'array',
      subfields: [
        {
          short_name: 'Snippet Text',
          long_name: 'Snippet Text',
          short_description: 'Snippet Text',
          long_description: 'Snippet Text',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Related Classifications',
          long_name: 'Related Classifications',
          short_description:
            'The Known AI Technical Failure classifications from above which this snippet supports',
          long_description:
            'The Known AI Technical Failure classifications from above which this snippet supports',
          display_type: 'list',
          mongo_type: 'array',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Snippet Discussion',
          long_name: 'Snippet Discussion',
          short_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          long_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
      ],
    },
    {
      field_number: '3.1.3',
      short_name: 'Known AI Technical Failure Classification Discussion',
      long_name: 'Known AI Technical Failure Classification Discussion',
      short_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      long_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '3.2.1',
      short_name: 'Potential AI Technical Failure',
      long_name: 'Potential AI Technical Failure',
      short_description:
        'An AI Technical Failure which probably contributes to the AI system failure referenced in the incident.',
      long_description: 'Distributional Bias',
      display_type: 'list',
      mongo_type: 'array',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '3.2.2',
      short_name: 'Potential AI Technical Failure Snippets',
      long_name: 'Potential AI Technical Failure Snippets',
      short_description: 'One or more snippets that justify the classification.',
      long_description: 'One or more snippets that justify the classification.',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
      display_type: 'object-list',
      mongo_type: 'array',
      subfields: [
        {
          short_name: 'Snippet Text',
          long_name: 'Snippet Text',
          short_description: 'Snippet Text',
          long_description: 'Snippet Text',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Related Classifications',
          long_name: 'Related Classifications',
          short_description:
            'The Potential AI Technical Failure classifications from above which this snippet supports',
          long_description:
            'The Potential AI Technical Failure classifications from above which this snippet supports',
          display_type: 'list',
          mongo_type: 'array',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          short_name: 'Snippet Discussion',
          long_name: 'Snippet Discussion',
          short_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          long_description:
            'Free text discussion on snippet usefulness, elaboration on information / terms included, etc.',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 50,
          instant_facet: false,
          required: false,
          public: true,
        },
      ],
    },
    {
      field_number: '3.2.3',
      short_name: 'Potential AI Technical Failure Classification Discussion',
      long_name: 'Potential AI Technical Failure Classification Discussion',
      short_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      long_description:
        'Free text with comments justifying the chosen classification (e.g. based on information on selected snippets and technical analysis), if needed.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 40,
      instant_facet: false,
      required: false,
      public: true,
    },
  ],
};
