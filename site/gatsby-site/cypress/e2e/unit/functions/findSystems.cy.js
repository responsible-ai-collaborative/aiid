const findSystems = require('../../../../../realm/functions/findSystems');


const AILD_TAXA = {
  "_id": {
    "$oid": "6504ad068d18f92719b30135"
  },
  "namespace": "AILD",
  "field_list": [
    {
      "short_name": "Record Number",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "int",
      "mongo_type": "int",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Caption",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "text",
      "mongo_type": "string",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Brief Description",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "text",
      "mongo_type": "string",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Area of Application List",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "list",
      "mongo_type": "array",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Cause of Action List",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "list",
      "mongo_type": "array",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Issue List",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "list",
      "mongo_type": "array",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Name of Algorithm List",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "list",
      "mongo_type": "array",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Class Action List",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "list",
      "mongo_type": "array",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Organizations involved",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "list",
      "mongo_type": "array",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Jurisdiction Filed",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "string",
      "mongo_type": "string",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Date Action Filed",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "date",
      "mongo_type": "date",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Published Opinions",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "bool",
      "mongo_type": "bool",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Status Disposition",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "multi",
      "mongo_type": "array",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Date Added",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "date",
      "mongo_type": "date",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Last Update",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "date",
      "mongo_type": "date",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Progress Notes",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "text",
      "mongo_type": "string",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Researcher",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "text",
      "mongo_type": "string",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Summary of Significance",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "text",
      "mongo_type": "string",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Summary Facts Activity to Date",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "text",
      "mongo_type": "string",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Most Recent Activity",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "text",
      "mongo_type": "string",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Most Recent Activity Date",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "date",
      "mongo_type": "date",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    },
    {
      "short_name": "Keyword",
      "long_name": "",
      "short_description": "",
      "long_description": "",
      "display_type": "text",
      "mongo_type": "string",
      "complete_from": {},
      "default": "",
      "placeholder": "",
      "permitted_values": [],
      "weight": 50,
      "instant_facet": false,
      "required": false,
      "public": true
    }
  ]
}

const AILD_FACET_RESULTS = {
  "Record Number": [{ "count": 5 }],
  "Caption": [{ "count": 5 }],
  "Brief Description": [{ "count": 5 }],
  "Area of Application List": [{ "_id": "'Nuremberg Laws'", "count": 1 }, { "_id": "'Crimes Against Humanity'", "count": 1 }, { "_id": "'Advertising'", "count": 1 }, { "_id": "'Privacy'", "count": 2 }, { "_id": "'Health'", "count": 1 }, { "_id": "'Terrorism'", "count": 1 }, { "_id": "'Genocide'", "count": 1 }, { "_id": "'Trading'", "count": 1 }, { "_id": "'Social Media'", "count": 2 }],
  "Cause of Action List": [{ "_id": "'Negligence'", "count": 1 }, { "_id": "'22 U.S.C. §2551'", "count": 1 }, { "_id": "'HIPAA'", "count": 1 }, { "_id": "'Unfair and Deceptive Practices'", "count": 1 }, { "_id": "'18 U.S.C. §1038 False Information and Hoaxes'", "count": 1 }, { "_id": "'CECPA'", "count": 1 }, { "_id": "'FTC Act'", "count": 1 }]
}

describe('Find systems', () => {
  it('Should return a list of incidents and reports', () => {
    const classificationsCollection = {
      find: cy.stub().returns({ toArray: cy.stub().resolves([]) }),
      aggregate: cy.stub().returns({ toArray: cy.stub().resolves([AILD_FACET_RESULTS]) }),
    };

    const taxaCollection = {
      find: cy.stub().returns({ toArray: cy.stub().resolves([AILD_TAXA]) }),
    };

    global.context = {
      // @ts-ignore
      services: {
        get: cy.stub().returns({
          db: (() => {
            const stub = cy.stub();

            stub.withArgs('aiidprod').returns({
              collection: (() => {
                const stub = cy.stub();

                stub.withArgs('classifications').returns(classificationsCollection);
                stub.withArgs('taxa').returns(taxaCollection);

                return stub;
              })(),
            });

            return stub;
          })(),
        }),
      },
    };

    const query = `
    {
      "$or": [
          {
              "$and": [
                  {
                      "namespace": "AILD",
                      "attributes": {
                          "$elemMatch": {
                              "short_name": "Full Description",
                              "value": {
                                  "$regex": "google",
                                  "$options": "i"
                              }
                          }
                      }
                  },
                  {
                      "namespace": "AILD",
                      "attributes": {
                          "$elemMatch": {
                              "short_name": "Beginning Date",
                              "value": {
                                  "$eq": "2023-09-05"
                              }
                          }
                      }
                  }
              ]
          }
      ]
  }
    `

    cy.wrap(
      findSystems({
        query,
      })
    ).then(() => {
      const expected = {
        $or: [
          {
            $and: [
              {
                namespace: 'AILD',
                attributes: {
                  $elemMatch: {
                    short_name: 'Full Description',
                    value: { $regex: 'google', $options: 'i' },
                  },
                },
              },
              {
                namespace: 'AILD',
                attributes: {
                  $elemMatch: {
                    short_name: 'Beginning Date',
                    value: { $eq: new Date('2023-09-05') },
                  },
                },
              },
            ],
          },
        ],
      };

      expect(classificationsCollection.find.firstCall.args[0]).to.deep.eq(expected);
    });
  });
});
