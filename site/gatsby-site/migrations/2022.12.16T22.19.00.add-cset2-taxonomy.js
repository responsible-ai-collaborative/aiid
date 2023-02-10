const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  await taxaCollection.insertOne(csetV1TaxaEntry);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  await taxaCollection.deleteOne({ namespace: 'CSETv1' });
};

var YesNoMaybe = {
  display_type: 'enum',
  mongo_type: 'string',
  default: 'maybe',
  permitted_values: ['yes', 'no', 'maybe'],
  placeholder: '',
};

var YesNo = {
  display_type: 'bool',
  mongo_type: 'bool',
  permitted_values: [],
  placeholder: '',
};

var handleWhitespace = (string) =>
  string
    .trim()
    .split('\n')
    .map((line) => line.replace(/ */, ''))
    .join('\n');

var csetV1TaxaEntry = {
  namespace: 'CSETv1',
  weight: 70,
  description: handleWhitespace(`
    # What is the CSET Taxonomy?

    The Center for Security and Emerging Technology (CSET) taxonomy is
    a general taxonomy of AI incidents. There are a large number of 
    classified attributes, including ones pertaining to safety, fairness, 
    industry, geography, timing, and cost. All classifications within 
    the CSET taxonomy are first applied by one CSET annotator and 
    reviewed by another CSET annotator before the classifications are 
    finalized. The combination of a rigorously defined coding set and 
    the completeness with which it has been applied make the CSET 
    taxonomy the AIID's gold standard for taxonomies. Nevertheless, 
    the CSET taxonomy is an ongoing effort and you are invited to 
    report any errors you may discover in its application.

    ## How do I explore the taxonomy?

    All taxonomies can be used to filter incident reports within the 
    [Discover Application](/apps/discover). The taxonomy filters work
    similarly to how you filter products on an E-commerce website. 
    Use the search field at the bottom of the “Classifications” tab to 
    find the taxonomy field you would like to filter with, then click 
    the desired value to apply the filter.

    # About CSET

    A policy research organization within Georgetown University’s 
    Walsh School of Foreign Service, CSET produces data-driven 
    research at the intersection of security and technology, 
    providing nonpartisan analysis to the policy community. CSET is 
    currently focusing on the effects of progress in artificial 
    intelligence (AI), advanced computing and biotechnology. CSET 
    seeks to prepare a new generation of decision-makers to address 
    the challenges and opportunities of emerging technologies. [(Read 
    more)](https://cset.georgetown.edu/about-us/).
  `),
  dummy_fields: [
    { field_number: '1', short_name: 'Metadata' },
    { field_number: '2', short_name: 'AI Tangible Harm Category' },
    { field_number: '3', short_name: 'Special Interest Intangible Harm' },
    { field_number: '4', short_name: 'Environmental and Temporal Characteristics' },
    { field_number: '5', short_name: 'Characterizing Entities and the Harm' },
    { field_number: '6', short_name: 'Tangible Harm Quantities ' },
    { field_number: '7', short_name: 'Information about AI System' },
    { field_number: '8', short_name: 'AI Functionality and Techniques' },
  ],
  field_list: [
    {
      field_number: '1.1',
      short_name: 'Incident Number',
      long_name: 'The number of the incident in the AI Incident Database.',
      short_description: 'The number of the incident in the AI Incident Database.',
      long_description: 'The number of the incident in the AI Incident Database.',
      display_type: 'int',
      mongo_type: 'int',
      default: '',
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '1.2',
      short_name: 'Annotator',
      long_name: 'Person responsible for the annotations',
      short_description:
        'This is the researcher that is responsible for applying the classifications of the CSET taxonomy.',
      long_description:
        'An ID designating the individual who classified this incident according to the CSET taxonomy.',
      display_type: 'string',
      mongo_type: 'string',
      default: '',
      placeholder: 'Select name here',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: false,
    },
    {
      field_number: '1.3',
      short_name: 'Annotation Status',
      long_name: 'Where in the annotation process is this incident?',
      short_description:
        'What is the quality assurance status of the CSET classifications for this incident?',
      long_description:
        'What is the quality assurance status of the CSET classifications for this incident?',
      display_type: 'enum',
      mongo_type: 'string',
      default: '',
      placeholder: 'Select process status here',
      permitted_values: [
        '1. Annotation in progress',
        '2. Initial annotation complete',
        '3. In peer review',
        '4. Peer review complete',
        '5. In quality control',
        '6. Complete and final',
      ],
      weight: 10,
      instant_facet: false,
      required: false,
      public: false,
      notes:
        'When you start a row, switch this field from blank to “Annotation in progress” so other annotators know not to work on the same row (and can be sure it wasn’t skipped or left unfinished accidentally).\n\nOnce a row is marked “Initial annotation complete,” we will assume that any remaining blanks were left deliberately - that is, you looked, but couldn’t find enough information to fill out the blank fields. For this reason, please don’t mark a row “Initial annotation complete” until you’ve truly finished filling it out.\n\nWhen peer review begins, the assigned reviewer should switch the status to “In peer review.” When the review is complete and all comments have been resolved, either the peer reviewer or the original annotator should switch the status to “Peer review complete.”\n\nOptions 5 and 6 should only ever be selected by the project lead.',
    },
    {
      field_number: '1.4',
      short_name: 'Reviewer',
      long_name: 'Person responsible for reviewing annotations',
      short_description:
        'This is the researcher that is responsible for ensuring the quality of the classifications applied to this incident.',
      long_description:
        "The CSET taxonomy assigns individual researchers to each incident as the primary parties responsible for classifying the incident according to the taxonomy. This is the person responsible for assuring the integrity of annotator's classifications.",
      display_type: 'string',
      mongo_type: 'string',
      default: '',
      placeholder: 'Select name here',
      permitted_values: [],
      weight: 20,
      instant_facet: false,
      required: false,
      public: false,
      notes: 'The project lead will assign a peer reviewer to each incident.',
    },
    {
      field_number: '1.5',
      short_name: 'Quality Control',
      long_name: 'Was this incident randomly selected for additional quality control?',
      short_description:
        "Has someone flagged a potential issue with this incident's classifications? Annotators should leave this field blank.",
      long_description:
        'The peer review process sometimes uncovers issues with the classifications that have been applied by the annotator. This field serves as a flag when there is a need for additional thought and input on the classifications applied',
      display_type: 'bool',
      mongo_type: 'bool',
      default: 'false',
      placeholder: '',
      permitted_values: [],
      weight: 15,
      instant_facet: false,
      required: false,
      public: false,
    },

    /* For reference, the CSETv0 field entry is commented above its correpsonding v1 field. */

    //      {
    //        short_name: "Physical System",
    //        long_name: "Physical system",
    //        short_description: "Where relevant, indicates whether the AI system(s) was embedded into or tightly associated with specific types of hardware.",
    //        long_description: "Where relevant, indicates whether the AI system(s) was embedded into or tightly associated with specific types of hardware.",
    //        display_type: "multi",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [
    //          "Consumer device",
    //          "Industrial process system",
    //          "Weapons system",
    //          "Vehicle/mobile robot",
    //          "Software only",
    //          "Unknown/unclear"
    //        ],
    //        weight: {
    //          $numberInt: "30"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '2.1.1',
      short_name: 'Physical Objects',
      long_name: 'Did the incident occur in a domain with physical objects ?',
      short_description: 'Did the incident occur in a domain with physical objects ?',
      long_description:
        '“Yes” if the AI system(s) is embedded in hardware that can interact with, affect, and change  the physical objects (cars, robots, medical facilities, etc.). Mark “No” if the system cannot. This includes systems that inform, detect, predict, or recommend.',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      notes:
        'Context matters. AI systems embedded in hardware that can physically interact are more likely to cause death, injury, or damage.',
    },
    {
      field_number: '2.1.2',
      short_name: 'Entertainment Industry',
      long_name: 'Did the AI incident occur in the entertainment industry?',
      short_description: 'Did the AI incident occur in the entertainment industry?',
      long_description:
        '“Yes” if the sector in which the AI was used is associated with entertainment. “No” if it was used in a different, clearly identifiable sector.  “Maybe” if the sector of use could not be determined.',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      notes:
        'Context matters. AI systems used for entertainment are less likely to result in harm. For example a deepfake used in a movie is less likely to cause harm than a deepfake used for political misinformation.',
    },
    {
      field_number: '2.1.3',
      short_name: 'Report, Test, or Study',
      long_name:
        'Was the incident about a report, test, or study of data instead of the AI itself?',
      short_description:
        'Was the incident about a report, test, or study of data instead of the AI itself?',
      long_description:
        '“Yes” if the incident is about a report, test, or study of the data and does not discuss an instance of injury, damage, or loss. “Maybe” if it is unclear.  Otherwise mark “No.”',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      notes:
        'Sometimes there are reports about issues with the data that could be used to develop AI systems. Since there are mitigation approaches, data issues do not automatically mean that the associated AI will have issues that lead to harm. A projection or hypothesis of the harm resulting from data issues is not sufficient. There must be harm that can be clearly linked to an AI.',
    },
    {
      field_number: '2.1.4',
      short_name: 'Deployed',
      long_name:
        'Was the reported system (even if AI involvement is unknown) deployed or sold to users?',
      short_description:
        'Was the reported system (even if AI involvement is unknown) deployed or sold to users?',
      long_description:
        '“Yes” if the involved system was deployed or sold to users. “No” if it was not. “Maybe” if there is not enough information or if the use is unclear.',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      notes:
        'Systems that are not deployed or sold to users tend to still be in the development stage and hence are less likely to cause harm. However, harm can still be possible. ',
    },
    {
      field_number: '2.1.5',
      short_name: 'Producer Test in Controlled Conditions',
      long_name:
        'Was this a test or demonstration of an AI system done by developers, producers or researchers (versus users) in controlled conditions?',
      short_description:
        'Was this a test or demonstration of an AI system done by developers, producers or researchers (versus users) in controlled conditions?',
      long_description:
        '“Yes” if it was a test/demonstration performed by developers, producers or journalists in controlled conditions. “No” if it was not a test/demonstration. “No” if the test/demonstration was done by a user. “No” if the test/demonstration was in operational or uncontrolled conditions. “Maybe” otherwise.',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      notes:
        'AI system tests or demonstrations by developers, producers, or researchers in controlled environments are less likely to expose people, organizations, property, institutions, or the natural environment to harm.  Controlled environments may include situations such as an isolated compute system, a regulatory sandbox, or an autonomous vehicle testing range. ',
    },
    {
      field_number: '2.1.6',
      short_name: 'Producer Test in Operational Conditions',
      long_name:
        'Was this a test or demonstration of an AI system done by developers, producers or researchers (versus users) in operational conditions?',
      short_description:
        'Was this a test or demonstration of an AI system done by developers, producers or researchers (versus users) in operational conditions?',
      long_description:
        '“Yes” if it was a test/demonstration performed by developers, producers or journalists in controlled conditions. “No” if it was not a test/demonstration. “No” if the test/demonstration was done by a user. “No” if the test/demonstration was in controlled or non-operational conditions. “Maybe” otherwise.',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      notes:
        'While almost every AI system undergoes testing or demonstration in a controlled environment, some also undergo testing  or demonstration in an operational environment. Testing in operational environments still occurs before the system is deployed or sold to end-users. However, relative to controlled environments, operational environments try to closely represent real-world conditions and end-users that affect use of the AI system. Therefore, testing in an operational environment typically poses a heightened risk of harm to people, organizations, property, institutions, or the environment.',
    },
    {
      field_number: '2.1.7',
      short_name: 'User Test in Controlled Conditions',
      long_name: 'Was this a test or demonstration done by users in controlled conditions?',
      short_description: 'Was this a test or demonstration done by users in controlled conditions?',
      long_description:
        '“Yes” if it was a test/demonstration performed by users in controlled conditions. “No” if it was not a test/demonstration. “No” if the test/demonstration was done by developers, producers or researchers. “No” if the test/demonstration was in controlled or non-controlled conditions.“Maybe” otherwise.',
      ...YesNoMaybe,
      placeholder: '',
      weight: 50,
      instant_facet: true,
      required: false,
      notes:
        'The involvement of a user (versus a developer, producer, or researcher) increases the likelihood that harm can occur even if the AI system is being tested. Relative to controlled environments, controlled environments try to closely represent real-world conditions and end-users that affect use of the AI system. Therefore, testing in an controlled environment typically poses a heightened risk of harm to people, organizations, property, institutions, or the environment.',
    },
    {
      field_number: '2.1.8',
      short_name: 'User Test in Operational Conditions',
      long_name: 'Was this a test or demonstration done by users in operational conditions?',
      short_description:
        'Was this a test or demonstration done by users in operational conditions?',
      long_description:
        '“Yes” if it was a test/demonstration performed by users in operational conditions. “No” if it was not a test/demonstration. “No” if the test/demonstration was done by developers, producers or researchers. “No” if the test/demonstration was in controlled or non-operational conditions.“Maybe” otherwise.',
      ...YesNoMaybe,
      placeholder: '',
      weight: 50,
      instant_facet: true,
      required: false,
      notes:
        'Sometimes, prior to deployment, the user will perform a test or demonstration of the AI system. The involvement of a user (versus a developer, producer, or researcher) increases the likelihood that harm can occur even if the AI system is being tested in controlled environments.',
    },
    {
      field_number: '2.2',
      short_name: 'Harm Domain',
      long_name: 'Incident occurred in a domain where we could expect harm to occur?',
      short_description: 'Incident occurred in a domain where we could expect harm to occur?',
      long_description:
        'Using the answers to the 8 domain questions, assess if the incident occurred in a domain where harm could be expected to occur. If you are unclear, input “maybe.”',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: false,
      required: false,
      notes:
        'Reflecting upon the previously answered questions, decide if the reported incident or instance occurred in a domain in which harm could possibly occur. This is not a decision on whether or not harm did occur. Just a reflection on the operating conditions or context of the system.',
    },

    {
      field_number: '2.3',
      short_name: 'Tangible Harm',
      long_name: 'Did tangible harm (loss, damage or injury ) occur? ',
      short_description: 'Did tangible harm (loss, damage or injury ) occur? ',
      long_description:
        'An assessment of whether tangible harm, imminent tangible harm, or non-imminent tangible harm occurred. This assessment does not consider the context of the tangible harm, if an AI was involved, or if there is an identifiable, specific, and harmed entity. It is also not assessing if an intangible harm occurred. It is only asking if tangible harm occurred and what its imminency was.',
      display_type: 'enum',
      mongo_type: 'string',
      default: 'unclear',
      placeholder: '',
      permitted_values: [
        'tangible harm definitively occurred',
        'imminent risk of tangible harm (near miss) did occur',
        'non-imminent risk of tangible harm (an issue) occurred',
        'no tangible harm, near-miss, or issue',
        'unclear',
      ],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '2.4',
      short_name: 'AI System',
      long_name: 'Does the incident involve an AI system?',
      short_description: 'Does the incident involve an AI system?',
      long_description:
        'An assessment of whether or not an AI system was involved. It is sometimes difficult to judge between an AI and an automated system or expert rules system. In these cases select “maybe”',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
      notes:
        'Note, over time more information about the incident may become available, allowing a ‘maybe’ to be changed to a ‘yes’ or ‘no.’',
    },

    //      {
    //        short_name: "Intent",
    //        long_name: "Probable level of intent",
    //        short_description: "Was the incident an accident, intentional, or is the intent unclear?",
    //        long_description: "Indicates whether the incident was deliberate/expected or accidental, based on the available evidence. \"Deliberate or expected\" applies if it is established or highly likely that the system acted more or less as expected, from the perspective of at least one of the people or entities responsible for it. “Accident” applies if it is established or highly likely that the harm arose from the system acting in an unexpected way. \"Unclear\" applies if the evidence is contradictory or too thin to apply either of the above labels.",
    //        display_type: "enum",
    //        mongo_type: "string",
    //        default: "Accident",
    //        placeholder: "Accident",
    //        permitted_values: [ "Accident", "Deliberate or expected", "Unclear" ],
    //        weight: {
    //          $numberInt: "75"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '2.5',
      short_name: 'Intentional Harm',
      long_name: 'Was the AI intentionally developed or deployed to perform the harm?',
      short_description:
        'Was the AI intentionally developed or deployed to perform the harm?\n\nIf yes, did the AI’s behavior result in unintended or intended harm? ',
      long_description:
        'Indicates if the system was designed to do harm.  If it was designed to perform harm, the field will indicate if the AI system did or did not create unintended harm–i.e. was the reported harm the harm that AI was expected to perform or a different unexpected harm? ',
      display_type: 'enum',
      mongo_type: 'string',
      default: 'unclear',
      placeholder: '',
      permitted_values: [
        'Yes. Intentionally designed to perform harm and did create intended harm',
        'Yes. Intentionally designed to perform harm but created an unintended harm (a different harm may have occurred)',
        'No. Not intentionally designed to perform harm',
        'unclear',
      ],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
      notes:
        'Tracking and analyzing harm from AI systems designed to do harm is valuable and worthwhile. However, analysts may want to separately analyze harm from AI systems that were or were not designed to produce the observed harm.',
    },
    {
      field_number: '2.6',
      short_name: 'Clear Link to AI',
      long_name: 'Can an AI be directly and clearly linked to tangible or intangible harm?',
      short_description: 'Can an AI be directly and clearly linked to tangible or intangible harm?',
      long_description:
        '“Yes” if an AI was involved in harm, its behavior can be directly linked to the harm, and the harm may not have occurred if the AI acted differently. “Maybe” if the link is unclear. Otherwise, select “no.”',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
      notes:
        'For an AI to be directly linked to harm it must have played an important role in the chain of events that led to harm. The AI system doesn’t need to be the only factor, or even the major factor, in the chain of harm. However, if the AI system hadn’t acted in the way it did, the specific harm would not have occurred.\n\nAn occurrence of harm that involves a system which contains an AI is not sufficient for calling an incident and AI harm event, near-miss, or issue. The involved AI must also be directly linked to the harm.',
    },
    {
      field_number: '2.7',
      short_name: 'Possibly Identifiable Harmed Entity',
      long_name:
        'A potentially identifiable specific entity that experienced the harm can be characterized or identified.',
      short_description:
        'A potentially identifiable specific entity that experienced the harm can be characterized or identified.',
      long_description:
        '“Yes” if it is theoretically possible to both specify and identify the entity. Having that information is not required. The information just needs to exist and be potentially discoverable. “No” if there are not any potentially identifiable specific entities or if the harmed entities are a class or subgroup that can only be characterized. ',
      ...YesNo,
      default: '',
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
      notes:
        'A potentially identifiable specific entity is an entity that can be characterized in detail such that the name (Mr. Joe Smith,  Acme Inc, etc.) or a unique identifier (e.g. 100 Main Street, Anywhere USA) of the entity could be found. We may not know the name or identifier of the entity from the reports, but it does exist and could be found. For example, the general public is not a potentially identifiable specific entity. However, incarcerated people in the Springfield penitentiary would be specific entities because it would be possible to get a list of all the prisoners in the facility.',
    },

    //      {
    //        short_name: "Severity",
    //        long_name: "Overall severity of harm",
    //        short_description: "How bad is the harm for the most affected person or organization?",
    //        long_description: "An estimate of the overall severity of harm caused. \"Negligible\" harm means minor inconvenience or expense, easily remedied. “Minor” harm means limited damage to property, social stability, the political system, or civil liberties occurred or nearly occurred. \"Moderate\" harm means that humans were injured (but not killed) or nearly injured, or that financial, property, social, or political interests or civil liberties were materially affected (or nearly so affected). \"Severe\" harm means that a small number of humans were or were almost gravely injured or killed, or that financial, property, social, or political interests or civil liberties were significantly disrupted at at least a regional or national scale (or nearly so disrupted). \"Critical\" harm means that many humans were or were almost killed, or that financial, property, social, or political interests were seriously disrupted at a national or global scale (or nearly so disrupted).",
    //        display_type: "enum",
    //        mongo_type: "string",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [ "Negligible", "Minor", "Moderate", "Severe", "Critical", "Unclear/unknown" ],
    //        weight: {
    //          $numberInt: "150"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    //      {
    //        short_name: "Near Miss",
    //        long_name: "Harm nearly missed?",
    //        short_description: "Was harm caused, or was it a near miss?",
    //        long_description: "Was harm caused, or was it a near miss?",
    //        display_type: "enum",
    //        mongo_type: "string",
    //        default: "Harm caused",
    //        placeholder: "",
    //        permitted_values: [
    //          "Unclear/unknown",
    //          "Near miss",
    //          "Harm caused"
    //        ],
    //        weight: {
    //          $numberInt: "80"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '2.8',
      short_name: 'Harm Level',
      long_name: "Annotator's AI tangible harm level assessment",
      short_description:
        'An assessment of the AI tangible harm level, which takes into account the CSET definitions of AI tangible harm levels, along with the inputs for annotation fields about the AI, harm, chain of harm, and entity. ',
      long_description:
        'An assessment of the AI tangible harm level, which takes into account the CSET definitions of AI tangible harm levels, along with the inputs for annotation fields about the AI, harm, chain of harm, and entity.',
      display_type: 'enum',
      mongo_type: 'string',
      default: 'unclear',
      placeholder: '',
      permitted_values: [
        'AI tangible harm event',
        'AI tangible harm near-miss',
        'AI tangible harm issue',
        'none',
        'unclear',
      ],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
      notes:
        'Special interest intangible harm is determined in a different field. The determination of a special interest intangible harm is not dependant upon the AI tangible harm level',
    },
    {
      field_number: '2.9',
      short_name: 'Harm Level Notes',
      long_name: 'AI tangible harm level notes',
      short_description: 'Notes about the AI tangible harm level assessment',
      long_description:
        'If for 2.8 you select unclear or leave it blank, please provide a brief description of why.\n\n You can also add notes if you want to provide justification for a level',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: 'Notes about the AI tangible harm level assessment',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Harm Type",
    //        long_name: "Harm type",
    //        short_description: "Indicates the type(s) of harm caused or nearly caused by the incident.",
    //        long_description: "Indicates the type(s) of harm caused or nearly caused by the incident.",
    //        display_type: "multi",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [
    //          "Harm to physical health/safety",
    //          "Psychological harm",
    //          "Financial harm",
    //          "Harm to physical property",
    //          "Harm to intangible property",
    //          "Harm to social or political systems",
    //          "Harm to civil liberties",
    //          "Other"
    //        ],
    //        weight: {
    //          $numberInt: "140"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },

    {
      field_number: '3.1',
      short_name: 'Impact on Critical Services',
      long_name:
        "Did this impact people's access to critical or public services (health care, social services, voting, transportation, etc)?",
      short_description: 'Indicates if people’s access to critical public services was impacted.',
      long_description:
        "Did this impact people's access to critical or public services (health care, social services, voting, transportation, etc)?",
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
      notes:
        'Public services include healthcare, social services, voting, public transportation, education, and consumer protection.\n\nNote, if ‘yes’ is selected then there was likely a violation of civil liberties and there was a special interest intangible harm.',
    },
    {
      field_number: '3.2',
      short_name: 'Rights Violation',
      long_name:
        'Was this a violation of  human rights, civil liberties, civil rights, or democratic norms?',
      short_description:
        'Indicate if a violation of human rights, civil rights, civil liberties, or democratic norms occurred.',
      long_description:
        'Indicate if a violation of human rights, civil rights, civil liberties, or democratic norms occurred.',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
      notes:
        'It can often be difficult for the typical annotator to differentiate between violations of civil liberties, civil rights, human rights, and democratic norms. For this reason CSET grouped them together.\n\nHuman rights are rights inherent to all human beings, regardless of race, sex, nationality, ethnicity, language, religion, or any other status. They include the right to life and liberty, freedom from slavery and torture, freedom of opinion and expression, and the right to work and education. Civil rights are legal provisions that originate from notions of equality and can be enforced by law. Civil liberties are personal freedoms that are referenced in the Bill of Rights. Democratic norms are traditions, customs, and best practices that support democracy. An example of a democratic norm is accepting election results and facilitating a peaceful transfer of political power. ',
    },
    {
      field_number: '3.3',
      short_name: 'Involving Minor',
      long_name:
        'Was a minor involved in the incident (disproportionally treated or specifically  targeted/affected)',
      short_description:
        'Was a minor involved in the incident (disproportionally treated or specifically  targeted/affected)',
      long_description: 'Indicate if a minor was disproportionately targeted or affected',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
      notes:
        'Generally, governments have an interest in establishing heightened protections for minors. These protections are often associated with media content or privacy. For example, if an AI system illegally tracked a minor’s activity online, then answer “yes” to this question. There are instances where an AI system causes indiscriminate harm to a group of people, and it is plausible that some of those people are minors. However, in this case the entire group of people, adults and children alike, shared the distribution of harm equally and therefore the answer to this question would be “no.”',
    },
    {
      field_number: '3.4',
      short_name: 'Detrimental Content',
      long_name: 'Was detrimental content (misinformation, hate speech) involved?',
      short_description:
        'Was detrimental content (misinformation, hate speech) involved? (note detrimental/harmful content is not in itself harm)',
      long_description:
        'Detrimental content can include deepfakes, identity misrepresentation, insults, threats of violence, eating disorder or self harm promotion, extremist content, misinformation, sexual abuse material, and scam emails. Detrimental content in itself is often not harmful, however, it can lead to or instigate injury, damage, or loss.',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '3.5',
      short_name: 'Protected Characteristic',
      long_name: 'Was a group of people treated differently based upon a protected characteristic?',
      short_description:
        'Was a group of people treated differently based upon a protected characteristic (e.g. race, ethnicity, creed, immigrant status, color, religion, sex, national origin, age, disability, genetic information)?',
      long_description:
        'Protected characteristics include religion, commercial facilities, geography, age, sex, sexual orientation or gender identity, familial status (e.g., having or not having children) or pregnancy, disability, veteran status, genetic information, financial means, race or creed, Ideology, nation of origin, citizenship, and immigrant status.\n\nAt the federal level in the US, age is a protected characteristic for people over the age of 40.  Minors are not considered a protected class.  For this reason the CSET annotation taxonomy  has a separate field to note if a minor was involved.\n\nOnly mark yes if there is clear evidence discrimination occurred. If there are conflicting accounts, mark unsure. Do not mark that discrimination occurred based on expectation alone.',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Harm Distribution Basis",
    //        long_name: "Uneven distribution of harms basis",
    //        short_description: "If harms were unevenly distributed, this field indicates the basis or bases on which they were unevenly distributed.",
    //        long_description: "If harms were unevenly distributed, this field indicates the basis or bases on which they were unevenly distributed.",
    //        display_type: "multi",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [
    //          "Race",
    //          "Religion",
    //          "National origin or immigrant status",
    //          "Geography",
    //          "Age",
    //          "Sex",
    //          "Sexual orientation or gender identity",
    //          "Familial status or pregnancy",
    //          "Disability",
    //          "Veteran status",
    //          "Genetic information",
    //          "Financial means",
    //          "Ideology",
    //          "Other"
    //        ],
    //        weight: {
    //          $numberInt: "145"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '3.6',
      short_name: 'Harm Distribution Basis',
      long_name: 'If harms were potentially unevenly distributed among people, on what basis?',
      short_description: 'Indicates how the harms were potentially distributed.',
      long_description:
        'Multiple can occur.\n\nGenetic information refers to information about a person’s genetic tests or the genetic tests of their relatives. Genetic information can predict the manifestation of a disease or disorder.',
      display_type: 'multi',
      mongo_type: 'string',
      default: 'unclear',
      placeholder: '',
      permitted_values: [
        'religion',
        'commercial facilities',
        'geography',
        'age',
        'sex',
        'sexual orientation or gender identity',
        'familial status (e.g., having or not having children) or pregnancy',
        'disability',
        'veteran status',
        'genetic information',
        'financial means',
        'race',
        'ideology',
        'nation of origin, citizenship, immigrant status',
        'unclear',
        'other',
      ],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '3.7',
      short_name: 'Notes (special interest intangible harm)',
      long_name: 'Input any notes that may help explain your answers.',
      short_description: 'Input any notes that may help explain your answers.',
      long_description: 'Input any notes that may help explain your answers.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: 'Notes',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Beginning Date",
    //        long_name: "Beginning date",
    //        short_description: "The date the incident began.",
    //        long_description: "The date the incident began.",
    //        display_type: "date",
    //        mongo_type: "date",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "90"
    //        },
    //        instant_facet: false,
    //        required: false
    //      },
    //      {
    //        short_name: "Ending Date",
    //        long_name: "Ending date",
    //        short_description: "The date the incident ended.",
    //        long_description: "The date the incident ended.",
    //        display_type: "date",
    //        mongo_type: "date",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "85"
    //        },
    //        instant_facet: false,
    //        required: false
    //      },
    {
      field_number: '4.1',
      short_name: 'Date of Incident Year',
      long_name: 'The year in which the incident first occurred.',
      short_description:
        'The year in which the incident occurred. If there are multiple harms or occurrences of the incident, list the earliest. If a precise date is unavailable, but the available sources provide a basis for estimating the year, estimate. Otherwise, leave blank.\n\nEnter in the format of YYYY',
      long_description:
        'The year in which the incident occurred. If there are multiple harms or occurrences of the incident, list the earliest. If a precise date is unavailable, but the available sources provide a basis for estimating the year, estimate. Otherwise, leave blank.',
      display_type: 'string',
      mongo_type: 'string',
      default: '',
      placeholder: 'YYYY',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '4.2',
      short_name: 'Date of Incident Month',
      long_name: 'The month in which the incident first occurred.',
      short_description:
        'The month in which the incident occurred. If there are multiple harms or occurrences of the incident, list the earliest. If a precise date is unavailable, but the available sources provide a basis for estimating the month, estimate. Otherwise, leave blank.\n\nEnter in the format of MM',
      long_description:
        'The month in which the incident occurred. If there are multiple harms or occurrences of the incident, list the earliest. If a precise date is unavailable, but the available sources provide a basis for estimating the month, estimate. Otherwise, leave blank.',
      display_type: 'string',
      mongo_type: 'string',
      default: '',
      placeholder: 'MM',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '4.3',
      short_name: 'Date of Incident Day',
      long_name: 'The day on which the first incident occurred.',
      short_description:
        'The day on which the incident occurred. If a precise date is unavailable, leave blank.\n\nEnter in the format of DD',
      long_description:
        'The day on which the incident occurred. If a precise date is unavailable, leave blank.\n\nEnter in the format of DD',
      display_type: 'string',
      mongo_type: 'string',
      default: '',
      placeholder: 'DD',
      permitted_values: [],
      weight: 5,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '4.4',
      short_name: 'Estimated Date',
      long_name: 'Is the date estimated?',
      short_description: '“Yes” if the data was estimated. “No” otherwise.',
      long_description: '“Yes” if the data was estimated. “No” otherwise.',
      ...YesNo,
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '4.5',
      short_name: 'Multiple AI Interaction',
      long_name: 'Was the AI interacting with another AI?',
      short_description:
        '“Yes” if two independently operating AI systems were involved. “No” otherwise.',
      long_description:
        'This happens very rarely but is possible. Examples include two chatbots having a conversation with each other, or two autonomous vehicles in a crash.',
      ...YesNoMaybe,
      weight: 5,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '4.6',
      short_name: 'Embedded',
      long_name: 'Is the AI embedded in a physical system or have a physical presence?',
      short_description:
        '“Yes” if the AI is embedded in a physical system. “No” if it is not. “Maybe” if it is unclear.',
      long_description:
        'This question is slightly different from the one in field 2.1.1. That question asks about there being interaction with physical objects–an ability to manipulate or change.  A system can be embedded in a physical object and able to interact with the physical environment, e.g. a vacuum robot.  A system can be embedded in a physical object and not interact with a physical environment, e.g. a camera system that only records images when the AI detects that dogs are present. AI systems that are accessed through API, web-browser, etc by using a mobile device or computer are not considered to be embedded in hardware systems. They are accessed through hardware.',
      ...YesNoMaybe,
      weight: 5,
      instant_facet: true,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Location",
    //        long_name: "Location",
    //        short_description: "The location or locations where the incident played out.",
    //        long_description: "The location or locations where the incident played out.",
    //        display_type: "location",
    //        mongo_type: "string",
    //        default: "global",
    //        placeholder: "Input a named place as it could be found in Google maps",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "105"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '4.7',
      short_name: 'City',
      long_name: 'Location City',
      short_description: 'If the incident occurred at a specific known location, note the city. ',
      long_description:
        'If there are multiple relevant locations, enter multiple city/state/country values.',
      display_type: 'string',
      mongo_type: 'string',
      default: '',
      placeholder: 'City',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '4.8',
      short_name: 'State or Province',
      long_name: 'Location State/Province (two letters)',
      short_description:
        'If the incident occurred at a specific known location, note the state/province.',
      long_description:
        'If there are multiple relevant locations, enter multiple city/state/country values.',
      display_type: 'string',
      mongo_type: 'string',
      default: '',
      placeholder: 'State or Province',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '4.10',
      short_name: 'Region',
      long_name: 'Location Region',
      short_description: 'Select the region of the world where the incident occurred.',
      long_description:
        'Select the region of the world where the incident occurred. If it occurred in multiple, leave blank.',
      display_type: 'enum',
      mongo_type: 'string',
      default: 'unclear',
      placeholder: '',
      permitted_values: [
        'Global',
        'Sub-Saharan Africa',
        'Northern Africa and Western Asia',
        'Central and Southern Asia',
        'Eastern and South-Eastern Asia',
        'Latin America and the Caribbean',
        'Australia and New Zealand',
        'Oceania',
        'Europe and Northern America',
        'unclear',
      ],
      weight: 5,
      instant_facet: true,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Infrastructure Sectors",
    //        long_name: "Critical infrastructure sectors affected",
    //        short_description: "Where applicable, this field indicates if the incident caused harm to any of the economic sectors designated by the U.S. government as critical infrastructure.",
    //        long_description: "Where applicable, this field indicates if the incident caused harm to any of the economic sectors designated by the U.S. government as critical infrastructure.",
    //        display_type: "multi",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [
    //          "Chemical",
    //          "Commercial facilities",
    //          "Communications",
    //          "Critical manufacturing",
    //          "Dams",
    //          "Defense-industrial base",
    //          "Emergency services",
    //          "Energy",
    //          "Financial services",
    //          "Food and agriculture",
    //          "Government facilities",
    //          "Healthcare and public health",
    //          "Information technology",
    //          "Nuclear",
    //          "Transportation",
    //          "Water and wastewater"
    //        ],
    //        weight: {
    //          $numberInt: "65"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '4.11',
      short_name: 'Infrastructure Sectors',
      long_name: 'Which critical infrastructure sectors were affected, if any?',
      short_description: 'Which critical infrastructure sectors were affected, if any?',
      long_description: 'Which critical infrastructure sectors were affected, if any?',
      display_type: 'multi',
      mongo_type: 'string',
      default: 'unclear',
      placeholder: '',
      permitted_values: [
        'chemical',
        'commercial facilities',
        'communications',
        'critical manufacturing',
        'dams',
        'defense-industrial base',
        'emergency services',
        'energy',
        'financial services',
        'food and agriculture',
        'government facilities',
        'healthcare and public health',
        'information technology',
        'nuclear  ',
        'transportation',
        'water and wastewater',
        'Other',
        'unclear',
      ],
      weight: 5,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '4.12',
      short_name: 'Operating Conditions',
      long_name: 'A record of any abnormal or atypical operational conditions that occurred.',
      short_description:
        'A record of any abnormal or atypical operational conditions that occurred.',
      long_description:
        'A record of any abnormal or atypical operational conditions that occurred. This field is most often blank.',
      display_type: 'list',
      mongo_type: 'array',
      default: '',
      placeholder: 'e.g. raining; night; low visibility',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '4.13',
      short_name: 'Notes (Environmental and Temporal Characteristics)',
      long_name: 'Notes (Environmental and Temporal Characteristics)',
      short_description: 'Input any notes that may help explain your answers.',
      long_description: 'Input any notes that may help explain your answers.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: 'Notes',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    /* 5. Characterizing Entities and the Harm */
    {
      field_number: '5',
      short_name: 'Entities',
      long_name: 'Characterizing Entities and the Harm',
      short_description: 'Characterizing Entities and the Harm',
      long_description: 'Characterizing Entities and the Harm',
      display_type: 'object-list',
      mongo_type: 'array',

      // TODO: This needs to be implemented
      subfields: [
        {
          field_number: '5.1',
          short_name: 'Entity',
          long_name: 'A short 1 to 2 word description of the entity.',
          short_description:
            'A short 1 to 2 word description of the entity.  When possible use a proper name for the entity, making it a Named Entity.',
          long_description: handleWhitespace(`
            A short 1 to 2 word description of the entity.  When possible use a proper name for the entity, making it a Named Entity.

            Annotate information for each entity involved in the report. Try to capture every entity directly linked to the harm. Think about the entity that experienced the harm, all of the entities between them and the AI, and then all of the entities involved in producing and deploying the AI.

            Employees representing a company in a media or public relations capacity should not be included as an entity.
          `),
          display_type: 'string',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [],
          weight: 5,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          field_number: '5.2',
          short_name: 'Named Entity',
          long_name: 'Named Entity Indicator',
          short_description: 'Indicates if the entity is a Named Entity.',
          long_description:
            'Indicates if the entity is a Named Entity. “Yes” if the entity is a named entity. “No” otherwise.',
          ...YesNo,
          weight: 5,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          field_number: '5.3',
          short_name: 'Entity type',
          long_name: 'Indicates the type of entity',
          short_description: 'Indicates the type of entity',
          long_description:
            'Indicates the type of entity. If multiple selections could characterize the entity, select the primary function of the entity.',
          display_type: 'enum',
          mongo_type: 'string',
          default: 'unclear',
          placeholder: 'Entity Type',
          permitted_values: [
            'individual',
            'group of individuals',
            'for-profit organization',
            'non-profit organization',
            'government entity',
            'privately owned space',
            'public space',
            'infrastructure',
            'social or political system',
            'unclear',
            'product',
            'other',
            'unclear',
          ],
          weight: 5,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          field_number: '5.4',
          short_name: 'Entity Relationship to the AI',
          long_name: 'Entity Relationship to the AI',
          short_description: 'Indicates the entity’s relationship to the AI.',
          long_description:
            'Indicates the entity’s relationship to the AI. Note, the smallest possible chain of harm has just two elements; an AI and an entity experiencing harm, near-miss, or issue.',
          display_type: 'multi',
          mongo_type: 'string',
          default: '',
          placeholder: '',
          permitted_values: [
            'developer',
            'deployer',
            'government oversight',
            'user',
            'AI',
            'geographic area of use',
            'researcher',
            'product containing AI',
            'watchdog',
            'other',
          ],
          weight: 5,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          field_number: '5.5',
          short_name: 'Harm Category Experienced',
          long_name:
            'Was an AI special interest intangible harm, tangible harm event, near-miss, or issue experienced by this entity',
          short_description:
            'Was an AI special interest intangible harm, tangible harm event, near-miss, or issue experienced by this entity',
          long_description:
            'Was an AI special interest intangible harm, tangible harm event, near-miss, or issue experienced by this entity. For each recorded entity, indicate the harm category that they experienced. Because recorded entities have a variety of roles in the AI incident, not every recorded entity will experience harm.',
          display_type: 'enum',
          mongo_type: 'string',
          default: 'unclear',
          placeholder: '',
          permitted_values: [
            'AI special interest intangible harm',
            'AI tangible harm event',
            'AI tangible harm near-miss',
            'AI tangible harm issue',
            'Other harm not meeting CSET definitions',
            'not applicable',
            'unclear',
          ],
          weight: 5,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          field_number: '5.6',
          short_name: 'Harm Type Experienced',
          long_name: 'Type of harm experienced by entity ',
          short_description: 'Indicates the type of harm experienced by the harmed entity',
          long_description:
            'Indicates the type of harm experienced by the harmed entity. Only entities experiencing harm should have an assigned type. If the entity did not experience the harm, ‘not applicable’ should be selected.',
          display_type: 'enum',
          mongo_type: 'string',
          default: 'not applicable',
          placeholder: '',
          permitted_values: [
            'physical health/safety',
            'financial loss',
            'physical property',
            'intangible property',
            'infrastructure',
            'natural environment',
            'social or political systems',
            'violation of human rights, civil liberties, civil rights, or democratic norms',
            'detrimental content',
            'disproportionate treatment based upon a protected characteristic',
            'other tangible harm',
            'other intangible harm',
            'not applicable',
          ],
          weight: 5,
          instant_facet: false,
          required: false,
          public: true,
        },
        {
          field_number: '5.7',
          short_name: 'Notes (Characterizing Entities and the Harm)',
          long_name: 'Notes (Characterizing Entities and the Harm)',
          short_description: 'Input any notes that may help explain your answers.',
          long_description: 'Input any notes that may help explain your answers.',
          display_type: 'long_string',
          mongo_type: 'string',
          default: '',
          placeholder: 'Notes',
          permitted_values: [],
          weight: 5,
          instant_facet: false,
          required: false,
          public: true,
        },
      ],
      default: '[]',
      placeholder: '',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Named Entities",
    //        long_name: "Named entities",
    //        short_description: "All named entities (such as people, organizations, locations, and products - generally proper nouns) that seem to have a significant relationship with this event, as indicated by the available evidence.",
    //        long_description: "All named entities (such as people, organizations, locations, and products - generally proper nouns) that seem to have a significant relationship with this event, as indicated by the available evidence.",
    //        display_type: "list",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "100"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    //      {
    //        short_name: "Technology Purveyor",
    //        long_name: "Party responsible for AI system",
    //        short_description: "A list of parties (up to three) that were responsible for the relevant AI tool or system, i.e. that had operational control over the AI-related system causing harm (or control over those who did).",
    //        long_description: "A list of parties (up to three) that were responsible for the relevant AI tool or system, i.e. that had operational control over the AI-related system causing harm (or control over those who did).",
    //        display_type: "list",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "95"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    //      {
    //        short_name: "System Developer",
    //        long_name: "System developer",
    //        short_description: "The entity that created the AI system.",
    //        long_description: "The entity that created the AI system.",
    //        display_type: "list",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "130"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },

    //      {
    //        short_name: "Lives Lost",
    //        long_name: "Human lives lost",
    //        short_description: "Were human lives lost as a result of the incident?",
    //        long_description: "Marked \"trur\" if one or more people died as a result of the accident, \"false\" if there is no evidence of lives being lost, \"unclear\" otherwise.",
    //        display_type: "bool",
    //        mongo_type: "bool",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "70"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '6.1',
      short_name: 'Lives Lost',
      long_name: 'How many human lives were lost?',
      short_description: 'Indicates the number of deaths reported',
      long_description:
        'This field cannot be greater than zero if the harm is anything besides ‘Physical health/safety.’ ',
      display_type: 'int',
      mongo_type: 'int',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 5,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '6.2',
      short_name: 'Injuries',
      long_name: 'How many humans were injured?',
      short_description: 'Indicate the number of injuries reported.',
      long_description:
        "This field cannot be greater than zero if the harm is anything besides 'Physical health/safety'.\n\nAll reported injuries should count, regardless of their severity level. If a person lost their limb and another person scraped their elbow, both cases would be considered injuries. Do not include the number of deaths in this count.",
      display_type: 'int',
      mongo_type: 'int',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Financial Cost",
    //        long_name: "Total financial cost",
    //        short_description: "The stated or estimated financial cost of the incident, if reported.",
    //        long_description: "The stated or estimated financial cost of the incident, if reported.",
    //        display_type: "string",
    //        mongo_type: "string",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "60"
    //        },
    //        instant_facet: false,
    //        required: false
    //      },
    {
      field_number: '6.3',
      short_name: 'Property Damage Cost',
      long_name: 'Property Damage Cost ($USD)',
      short_description: 'Indicate the amount of property damage in monetary terms.',
      long_description: handleWhitespace(`
        This field will probably not be greater than zero if the harm is anything besides

          - Harm to physical property
          - Harm to infrastructure
          - harm to natural environment
          - Other

        Do not use shorthand or abbreviations for amounts. Only use numbers and commas. Do not use dollar factions, but round to the nearest dollar. For example record one million as 1,000,000 not as 1M, 1 mil, 1 million, or one million.
      `),
      display_type: 'int',
      mongo_type: 'int',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '6.4',
      short_name: 'Financial Cost',
      long_name: 'Financial Cost ($USD)',
      short_description:
        'Indicates the amount of financial cost not including property damage cost',
      long_description:
        'This field will probably not  be greater than zero if the harm is anything besides financial harm.\n\nOnly include financial cost that is not already recorded as property damage cost.\n\nDo not use shorthand or abbreviations for amounts. Only use numbers and commas. Do not use dollar factions, but round to the nearest dollar. For example record one million as 1,000,000 not as 1M, 1 mil, 1 million, or one million.',
      display_type: 'int',
      mongo_type: 'int',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '6.5',
      short_name: 'Estimated Harm Quantities',
      long_name: 'Are any quantities estimated?',
      short_description: 'Indicates if the amount was estimated.',
      long_description: 'Indicates if the amount was estimated.',
      ...YesNo,
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '6.6',
      short_name: 'Notes ( Tangible Harm Quantities Information)',
      long_name: 'Notes ( Tangible Harm Quantities Information)',
      short_description: 'Input any notes that may help explain your answers.',
      long_description: 'Input any notes that may help explain your answers.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: 'Notes',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "AI System Description",
    //        long_name: "Description of AI system involved",
    //        short_description: "A brief description of the AI system(s) involved in the incident, including the system’s intended function, the context in which it was deployed, and any available details about the algorithms, hardware, and training data involved in the system.",
    //        long_description: "A brief description of the AI system(s) involved in the incident, including the system’s intended function, the context in which it was deployed, and any available details about the algorithms, hardware, and training data involved in the system.",
    //        display_type: "string",
    //        mongo_type: "string",
    //        default: "",
    //        placeholder: "Describe the AI system here",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "135"
    //        },
    //        instant_facet: false,
    //        required: false
    //      },
    {
      field_number: '7.1',
      short_name: 'AI System Description',
      long_name: 'Description of the AI system involved',
      short_description: 'A description of the AI system (when possible)',
      long_description:
        'Describe the AI system in as much detail as the reports will allow.\n\nA high level description of the AI system is sufficient, but if more technical details about the AI system are available, include them in the description as well.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: 'Description of the AI system involved',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Data Inputs",
    //        long_name: "Description of the data inputs to the AI systems",
    //        short_description: "A brief description of the data that the AI system(s) used or were trained on.",
    //        long_description: "A brief description of the data that the AI system(s) used or were trained on.",
    //        display_type: "list",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "Describe the AI system here",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "50"
    //        },
    //        instant_facet: false,
    //        required: false
    //      },
    {
      field_number: '7.2',
      short_name: 'Data Inputs',
      long_name: 'Description of data inputs to the AI system',
      short_description: 'A list of the types of data inputs for the AI system.',
      long_description: handleWhitespace(`
        This is a freeform field that can have any value. There could be multiple entries for this field.

        Common ones include

          - still images
          - video
          - text
          - speech
          - Personally Identifiable Information
          - structured data
          - other
          - unclear

        Still images are static images. Video images consist of moving images. Text and speech data are considered an important category of unstructured data. They consist of written and spoken words that are not in a tabular format. Personally identifiable information is data that can uniquely identify an individual and may contain sensitive information. Structured data is often in a tabular, machine readable format and can typically be used by an AI system without much preprocessing.

        Avoid using ‘unstructured data’ data in this field. Instead specify the type of unstructured data; text, images, audio files, etc. It is ok to use ‘structured data’ in this field.

        Record what the media report explicitly states. If the report does not explicitly state an input modality but it is likely that a particular kind of input contributed to the harm or near harm, record that input. If you are still unsure, do not record anything.
      `),
      display_type: 'list',
      mongo_type: 'array',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Sector of Deployment",
    //        long_name: "Sector of deployment",
    //        short_description: "The primary economic sector in which the AI system(s) involved in the incident were operating.",
    //        long_description: "The primary economic sector in which the AI system(s) involved in the incident were operating.",
    //        display_type: "multi",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [
    //          "Manufacturing",
    //          "Electricity, gas, steam and air conditioning supply",
    //          "Water supply",
    //          "Construction",
    //          "Wholesale and retail trade",
    //          "Transportation and storage",
    //          "Accommodation and food service activities",
    //          "Information and communication",
    //          "Financial and insurance activities",
    //          "Real estate activities",
    //          "Professional, scientific and technical activities",
    //          "Administrative and support service activities",
    //          "Public administration and defence",
    //          "Education",
    //          "Human health and social work activities",
    //          "Arts, entertainment and recreation",
    //          "Other service activities",
    //          "Activities of households as employers",
    //          "Activities of extraterritorial organizations and bodies"
    //        ],
    //        weight: {
    //          $numberInt: "125"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '7.3',
      short_name: 'Sector of Deployment',
      long_name: 'Indicates the sector in which the AI system is deployed',
      short_description: 'Indicate the sector in which the AI system is deployed',
      long_description:
        'Indicate the sector in which the AI system is deployed\n\nThere could be multiple entries for this field.',
      display_type: 'multi',
      mongo_type: 'array',
      default: '',
      placeholder: '',
      permitted_values: [
        'agriculture, forestry and fishing',
        'mining and quarrying',
        'manufacturing',
        'electricity, gas, steam and air conditioning supply',
        'water supply',
        'construction',
        'wholesale and retail trade',
        'transportation and storage',
        'accommodation and food service activities',
        'information and communication',
        'financial and insurance activities',
        'real estate activities',
        'professional, scientific and technical activities',
        'administrative and support service activities',
        'public administration',
        'defense',
        'law enforcement',
        'Education',
        'human health and social work activities',
        'Arts, entertainment and recreation',
        'other service activities',
        'activities of households as employers',
        'activities of extraterritorial organizations and bodies',
        'other',
        'unclear',
      ],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Public Sector Deployment",
    //        long_name: "Public sector deployment",
    //        short_description: "\"Yes\" if the AI system(s) involved in the accident were being used by the public sector or for the administration of public goods (for example, public transportation). \"No\" if the system(s) were being used in the private sector or for commercial purposes (for example, a ride-sharing company), on the other.",
    //        long_description: "\"Yes\" if the AI system(s) involved in the accident were being used by the public sector or for the administration of public goods (for example, public transportation). \"No\" if the system(s) were being used in the private sector or for commercial purposes (for example, a ride-sharing company), on the other.",
    //        display_type: "bool",
    //        mongo_type: "bool",
    //        default: "false",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "45"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '7.4',
      short_name: 'Public Sector Deployment',
      long_name: 'Indicates whether the AI system is deployed in the public sector',
      short_description: 'Indicate whether the AI system is deployed in the public sector',
      long_description:
        'Indicate whether the AI system is deployed in the public sector. The public sector is the part of the economy that is controlled and operated by the government.',
      ...YesNoMaybe,
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Level of Autonomy",
    //        long_name: "Level of autonomy",
    //        short_description: "The degree to which the AI system(s) functions independently from human intervention. \"High\" means there is no human involved in the system action execution; \"Medium\" means the system generates a decision and a human oversees the resulting action; \"low\" means the system generates decision-support output and a human makes a decision and executes an action.",
    //        long_description: "The degree to which the AI system(s) functions independently from human intervention. \"High\" means there is no human involved in the system action execution; \"Medium\" means the system generates a decision and a human oversees the resulting action; \"low\" means the system generates decision-support output and a human makes a decision and executes an action.",
    //        display_type: "enum",
    //        mongo_type: "string",
    //        default: "Accident",
    //        placeholder: "Accident",
    //        permitted_values: [ "High", "Medium", "Low" ],
    //        weight: {
    //          $numberInt: "35"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '7.5',
      short_name: 'Autonomy Level',
      long_name: 'Autonomy Level',
      short_description: handleWhitespace(`
        Autonomy1: The system operates independently with no human oversight, interaction, or intervention. //
        Autonomy2: The system operates independently but with human oversight, where a human can observe and override the system’s decisions in real time. //
        Autonomy3: The system does not independently make decisions but instead provides information to a human who actively chooses to proceed with the AI’s information.
      `),
      long_description: handleWhitespace(`
        Autonomy1: The system operates independently with no human oversight, interaction, or intervention.

        Autonomy2: The system operates independently but with human oversight, where a human can observe and override the system’s decisions in real time.

        Autonomy3: The system does not independently make decisions but instead provides information to a human who actively chooses to proceed with the AI’s information.
      `),
      display_type: 'enum',
      mongo_type: 'string',
      default: '',
      placeholder: '',
      permitted_values: ['Autonomy1', 'Autonomy2', 'Autonomy3', 'unclear'],
      weight: 50,
      instant_facet: true,
      required: false,
      public: true,
    },
    {
      field_number: '7.8',
      short_name: 'Notes (Information about AI System)',
      long_name: 'Notes (Information about AI System)',
      short_description: 'Input any notes that may help explain your answers.',
      long_description: 'Input any notes that may help explain your answers.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: 'Notes',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },
    {
      field_number: '8.1',
      short_name: 'Physical System Type',
      long_name: 'Into what type of physical system was the AI integrated, if any?',
      short_description: 'Describe the type of physical system that the AI was integrated into.',
      long_description: 'Describe the type of physical system that the AI was integrated into. ',
      display_type: 'string',
      mongo_type: 'string',
      default: '',
      placeholder: 'Physical System Type (e.g. trash sorting robot)',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "Relevant AI functions",
    //        long_name: "Relevant AI functions",
    //        short_description: "Indicates whether the AI system(s) were intended to perform any of the following high-level functions: \"Perception,\" i.e. sensing and understanding the environment; \"Cognition,\" i.e. making decisions; or \"Action,\" i.e. carrying out decisions through physical or digital means.",
    //        long_description: "Indicates whether the AI system(s) were intended to perform any of the following high-level functions: \"Perception,\" i.e. sensing and understanding the environment; \"Cognition,\" i.e. making decisions; or \"Action,\" i.e. carrying out decisions through physical or digital means.",
    //        display_type: "multi",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [ "Perception", "Cognition", "Action", "Unclear" ],
    //        weight: {
    //          $numberInt: "120"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    //      {
    //        short_name: "AI Applications",
    //        long_name: "AI functions and applications used",
    //        short_description: "Open-ended tags that describe the functions and applications of the AI system.",
    //        long_description: "Open-ended tags that describe the functions and applications of the AI system.",
    //        display_type: "list",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "110"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '8.2',
      short_name: 'AI Task',
      long_name: 'AI task or core application  area',
      short_description: 'Describe the AI’s application.',
      long_description: handleWhitespace(`
        Describe the AI’s application.

        It is likely that the annotator will not have enough information to complete this field. If this occurs, enter unclear.

        This is a freeform field. Some possible entries are

          - unclear
          - human language technologies
          - computer vision
          - robotics
          - automation and/or optimization
          - other

        The application area of an AI is the high level task that the AI is intended to perform. It does not describe the technical methods by which the AI performs the task. Considering what an AI’s technical methods enable it to do is another way of arriving at what an AI’s application is. 

        It is possible for multiple application areas to be involved. When possible pick the principle or domain area, but it is ok to select multiple areas.
      `),
      display_type: 'list',
      mongo_type: 'array',
      default: '',
      placeholder: '',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    //      {
    //        short_name: "AI Techniques",
    //        long_name: "AI tools and techniques used",
    //        short_description: "Open-ended tags that indicate the hardware and software involved in the AI system(s).",
    //        long_description: "Open-ended tags that indicate the hardware and software involved in the AI system(s).",
    //        display_type: "list",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "115"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    {
      field_number: '8.3',
      short_name: 'AI tools and methods',
      long_name: 'AI tools and methods',
      short_description: 'Describe the tools and methods that enable the AI’s application.',
      long_description: handleWhitespace(`
        Describe the tools and methods that enable the AI’s application.

        It is likely that the annotator will not have enough information to complete this field. If this occurs, enter unclear

        This is a freeform field. Some possible entries are

          - unclear
          - reinforcement learning
          - neural networks
          - decision trees
          - bias mitigation
          - optimization
          - classifier
          - NLP/text analytics
          - continuous learning
          - unsupervised learning
          - supervised learning
          - clustering
          - prediction
          - rules
          - random forest

        AI tools and methods are the technical building blocks that enable the AI’s application.
      `),
      display_type: 'list',
      mongo_type: 'array',
      default: 'unclear',
      placeholder: '',
      permitted_values: [],
      weight: 50,
      instant_facet: false,
      required: false,
      public: true,
    },

    {
      field_number: '8.4',
      short_name: 'Notes (AI Functionality and Techniques)',
      long_name: 'Notes (AI Functionality and Techniques)',
      short_description: 'Input any notes that may help explain your answers.',
      long_description: 'Input any notes that may help explain your answers.',
      display_type: 'long_string',
      mongo_type: 'string',
      default: '',
      placeholder: 'Notes',
      permitted_values: [],
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
    },

    /* Removed Fields */

    //      {
    //        short_name: "Full Description",
    //        long_name: "Full description of the incident",
    //        short_description: "A plain-language description of the incident in one paragraph or less.",
    //        long_description: "A plain-language description of the incident in one paragraph or less.",
    //        display_type: "string",
    //        mongo_type: "string",
    //        default: "",
    //        placeholder: "Describe the incident here",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "160"
    //        },
    //        instant_facet: false,
    //        required: false
    //      },
    //      {
    //        short_name: "Short Description",
    //        long_name: "Short description of the incident",
    //        short_description: "A one-sentence description of the incident.",
    //        long_description: "A one-sentence description of the incident.",
    //        display_type: "string",
    //        mongo_type: "string",
    //        default: "",
    //        placeholder: "Describe the incident here",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "155"
    //        },
    //        instant_facet: false,
    //        required: false
    //      },
    //      {
    //        short_name: "Laws Implicated",
    //        long_name: "Laws covering the incident",
    //        short_description: "Relevant laws under which entities involved in the incident may face legal liability as a result of the incident.",
    //        long_description: "Relevant laws under which entities involved in the incident may face legal liability as a result of the incident.",
    //        display_type: "list",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [],
    //        weight: {
    //          $numberInt: "55"
    //        },
    //        instant_facet: false,
    //        required: false
    //      },
    //      {
    //        short_name: "Nature of End User",
    //        long_name: "Nature of end user",
    //        short_description: "\"Expert\" if users with special training or technical expertise were the ones meant to benefit from the AI system(s)’ operation; \"Amateur\" if the AI systems were primarily meant to benefit the general public or untrained users.",
    //        long_description: "\"Expert\" if users with special training or technical expertise were the ones meant to benefit from the AI system(s)’ operation; \"Amateur\" if the AI systems were primarily meant to benefit the general public or untrained users.",
    //        display_type: "enum",
    //        mongo_type: "string",
    //        default: "Accident",
    //        placeholder: "Accident",
    //        permitted_values: [
    //          "Expert",
    //          "Amateur"
    //        ],
    //        weight: {
    //          $numberInt: "40"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    //      {
    //        short_name: "Problem Nature",
    //        long_name: "Causative factors within AI system",
    //        short_description: "Indicates which, if any, of the following types of AI failure describe the incident: \"Specification,\" i.e. the system's behavior did not align with the true intentions of its designer, operator, etc; \"Robustness,\" i.e. the system operated unsafely because of features or changes in its environment, or in the inputs the system received; \"Assurance,\" i.e. the system could not be adequately monitored or controlled during operation.",
    //        long_description: "Indicates which, if any, of the following types of AI failure describe the incident: \"Specification,\" i.e. the system's behavior did not align with the true intentions of its designer, operator, etc; \"Robustness,\" i.e. the system operated unsafely because of features or changes in its environment, or in the inputs the system received; \"Assurance,\" i.e. the system could not be adequately monitored or controlled during operation.",
    //        display_type: "multi",
    //        mongo_type: "array",
    //        default: "",
    //        placeholder: "",
    //        permitted_values: [ "Specification", "Robustness", "Assurance", "Unknown/unclear" ],
    //        weight: {
    //          $numberInt: "25"
    //        },
    //        instant_facet: true,
    //        required: false
    //      },
    //      {
    //        short_name: "Publish",
    //        mongo_type: "bool",
    //        display_type: "bool"
    //      }
  ],
};
