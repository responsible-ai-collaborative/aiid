const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const resourcesCollection = client.db(config.realm.production_db.db_name).collection('resources');
  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  //resourcesCollection.drop();
  //taxaCollection.deleteOne({ namespace: "resources" });

  const csetV2entry = {
    "description": "# What is the CSET Taxonomy?\n\nThe Center for Security and Emerging Technology (CSET) taxonomy is a general taxonomy of AI incidents. There are a large number of classified attributes, including ones pertaining to safety, fairness, industry, geography, timing, and cost.All classifications within the CSET taxonomy are first applied by one CSET annotator and reviewed by another CSET annotator before the classifications are finalized. The combination of a rigorously defined coding set and the completeness with which it has been applied make the CSET taxonomy the AIID's gold standard for taxonomies. Nevertheless, the CSET taxonomy is an ongoing effort and you are invited to report any errors you may discover in its application.\n\n## How do I explore the taxonomy?\n\nAll taxonomies can be used to filter incident reports within the [Discover Application](/apps/discover). The taxonomy filters work similarly to how you filter products on an E-commerce website. Use the search field at the bottom of the “Classifications” tab to find the taxonomy field you would like to filter with, then click the desired value to apply the filter.\n\n# About CSET\n\nA policy research organization within Georgetown University’s Walsh School of Foreign Service, CSET produces data-driven research at the intersection of security and technology, providing nonpartisan analysis to the policy community. CSET is currently focusing on the effects of progress in artificial intelligence (AI), advanced computing and biotechnology. CSET seeks to prepare a new generation of decision-makers to address the challenges and opportunities of emerging technologies. [(Read more)](https://cset.georgetown.edu/about-us/).",
    "field_list": [
      {
        "short_name": "Annotator",
        "long_name": "Person responsible for the annotations",
        "short_description": "This is the researcher that is responsible for applying the classifications of the CSET taxonomy.",
        "long_description": "An ID designating the individual who classified this incident according to the CSET taxonomy.",
        "display_type": "enum",
        "mongo_type": "string",
        "default": "",
        "placeholder": "Select name here",
        "permitted_values": [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "Other" ],
        "weight": {
          "$numberInt": "5"
        },
        "instant_facet": false,
        "required": false,
        "public": false
      },
      {
        "short_name": "Annotation Status",
        "long_name": "Where in the annotation process is this incident?",
        "short_description": "What is the quality assurance status of the CSET classifications for this incident?",
        "long_description": "What is the quality assurance status of the CSET classifications for this incident?",
        "display_type": "enum",
        "mongo_type": "string",
        "default": "",
        "placeholder": "Select process status here",
        "permitted_values": [
          "1. Annotation in progress",
          "2. Initial annotation complete",
          "3. In peer review",
          "4. Peer review complete",
          "5. In quality control",
          "6. Complete and final"
        ],
        "weight": {
          "$numberInt": "10"
        },
        "instant_facet": false,
        "required": false,
        "public": false
      },
      {
        "short_name": "Reviewer",
        "long_name": "Person responsible for reviewing annotations",
        "short_description": "This is the researcher that is responsible for ensuring the quality of the classifications applied to this incident.",
        "long_description": "The CSET taxonomy assigns individual researchers to each incident as the primary parties responsible for classifying the incident according to the taxonomy. This is the person responsible for assuring the integrity of annotator's classifications.",
        "display_type": "enum",
        "mongo_type": "string",
        "default": "",
        "placeholder": "Select name here",
        "permitted_values": [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "Other" ],
        "weight": {
          "$numberInt": "20"
        },
        "instant_facet": false,
        "required": false,
        "public": false
      },
      {
        "short_name": "Quality Control",
        "long_name": "Was this incident randomly selected for additional quality control?",
        "short_description": "Has someone flagged a potential issue with this incident's classifications?",
        "long_description": "The peer review process sometimes uncovers issues with the classifications that have been applied by the annotator. This field serves as a flag when there is a need for additional thought and input on the classifications applied",
        "display_type": "bool",
        "mongo_type": "bool",
        "default": "false",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "15"
        },
        "instant_facet": false,
        "required": false,
        "public": false
      },
      {
        "short_name": "Full Description",
        "long_name": "Full description of the incident",
        "short_description": "A plain-language description of the incident in one paragraph or less.",
        "long_description": "A plain-language description of the incident in one paragraph or less.",
        "display_type": "string",
        "mongo_type": "string",
        "default": "",
        "placeholder": "Describe the incident here",
        "permitted_values": [],
        "weight": {
          "$numberInt": "160"
        },
        "instant_facet": false,
        "required": false
      },
      {
        "short_name": "Short Description",
        "long_name": "Short description of the incident",
        "short_description": "A one-sentence description of the incident.",
        "long_description": "A one-sentence description of the incident.",
        "display_type": "string",
        "mongo_type": "string",
        "default": "",
        "placeholder": "Describe the incident here",
        "permitted_values": [],
        "weight": {
          "$numberInt": "155"
        },
        "instant_facet": false,
        "required": false
      },
      {
        "short_name": "Beginning Date",
        "long_name": "Beginning date",
        "short_description": "The date the incident began.",
        "long_description": "The date the incident began.",
        "display_type": "date",
        "mongo_type": "date",
        "default": "",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "90"
        },
        "instant_facet": false,
        "required": false
      },
      {
        "short_name": "Ending Date",
        "long_name": "Ending date",
        "short_description": "The date the incident ended.",
        "long_description": "The date the incident ended.",
        "display_type": "date",
        "mongo_type": "date",
        "default": "",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "85"
        },
        "instant_facet": false,
        "required": false
      },
      {
        "short_name": "Location",
        "long_name": "Location",
        "short_description": "The location or locations where the incident played out.",
        "long_description": "The location or locations where the incident played out.",
        "display_type": "location",
        "mongo_type": "string",
        "default": "global",
        "placeholder": "Input a named place as it could be found in Google maps",
        "permitted_values": [],
        "weight": {
          "$numberInt": "105"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Near Miss",
        "long_name": "Harm nearly missed?",
        "short_description": "Was harm caused, or was it a near miss?",
        "long_description": "Was harm caused, or was it a near miss?",
        "display_type": "enum",
        "mongo_type": "string",
        "default": "Harm caused",
        "placeholder": "",
        "permitted_values": [
          "Unclear/unknown",
          "Near miss",
          "Harm caused"
        ],
        "weight": {
          "$numberInt": "80"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Named Entities",
        "long_name": "Named entities",
        "short_description": "All named entities (such as people, organizations, locations, and products - generally proper nouns) that seem to have a significant relationship with this event, as indicated by the available evidence.",
        "long_description": "All named entities (such as people, organizations, locations, and products - generally proper nouns) that seem to have a significant relationship with this event, as indicated by the available evidence.",
        "display_type": "list",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "100"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Technology Purveyor",
        "long_name": "Party responsible for AI system",
        "short_description": "A list of parties (up to three) that were responsible for the relevant AI tool or system, i.e. that had operational control over the AI-related system causing harm (or control over those who did).",
        "long_description": "A list of parties (up to three) that were responsible for the relevant AI tool or system, i.e. that had operational control over the AI-related system causing harm (or control over those who did).",
        "display_type": "list",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "95"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Intent",
        "long_name": "Probable level of intent",
        "short_description": "Was the incident an accident, intentional, or is the intent unclear?",
        "long_description": "Indicates whether the incident was deliberate/expected or accidental, based on the available evidence. \"Deliberate or expected\" applies if it is established or highly likely that the system acted more or less as expected, from the perspective of at least one of the people or entities responsible for it. “Accident” applies if it is established or highly likely that the harm arose from the system acting in an unexpected way. \"Unclear\" applies if the evidence is contradictory or too thin to apply either of the above labels.",
        "display_type": "enum",
        "mongo_type": "string",
        "default": "Accident",
        "placeholder": "Accident",
        "permitted_values": [
          "Accident",
          "Deliberate or expected",
          "Unclear"
        ],
        "weight": {
          "$numberInt": "75"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Severity",
        "long_name": "Overall severity of harm",
        "short_description": "How bad is the harm for the most affected person or organization?",
        "long_description": "An estimate of the overall severity of harm caused. \"Negligible\" harm means minor inconvenience or expense, easily remedied. “Minor” harm means limited damage to property, social stability, the political system, or civil liberties occurred or nearly occurred. \"Moderate\" harm means that humans were injured (but not killed) or nearly injured, or that financial, property, social, or political interests or civil liberties were materially affected (or nearly so affected). \"Severe\" harm means that a small number of humans were or were almost gravely injured or killed, or that financial, property, social, or political interests or civil liberties were significantly disrupted at at least a regional or national scale (or nearly so disrupted). \"Critical\" harm means that many humans were or were almost killed, or that financial, property, social, or political interests were seriously disrupted at a national or global scale (or nearly so disrupted).",
        "display_type": "enum",
        "mongo_type": "string",
        "default": "",
        "placeholder": "",
        "permitted_values": [
          "Negligible",
          "Minor",
          "Moderate",
          "Severe",
          "Critical",
          "Unclear/unknown"
        ],
        "weight": {
          "$numberInt": "150"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Harm Type",
        "long_name": "Harm type",
        "short_description": "Indicates the type(s) of harm caused or nearly caused by the incident.",
        "long_description": "Indicates the type(s) of harm caused or nearly caused by the incident.",
        "display_type": "multi",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [
          "Harm to physical health/safety",
          "Psychological harm",
          "Financial harm",
          "Harm to physical property",
          "Harm to intangible property",
          "Harm to social or political systems",
          "Harm to civil liberties",
          "Other"
        ],
        "weight": {
          "$numberInt": "140"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Lives Lost",
        "long_name": "Human lives lost",
        "short_description": "Were human lives lost as a result of the incident?",
        "long_description": "Marked \"trur\" if one or more people died as a result of the accident, \"false\" if there is no evidence of lives being lost, \"unclear\" otherwise.",
        "display_type": "bool",
        "mongo_type": "bool",
        "default": "",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "70"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Harm Distribution Basis",
        "long_name": "Uneven distribution of harms basis",
        "short_description": "If harms were unevenly distributed, this field indicates the basis or bases on which they were unevenly distributed.",
        "long_description": "If harms were unevenly distributed, this field indicates the basis or bases on which they were unevenly distributed.",
        "display_type": "multi",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [
          "Race",
          "Religion",
          "National origin or immigrant status",
          "Geography",
          "Age",
          "Sex",
          "Sexual orientation or gender identity",
          "Familial status or pregnancy",
          "Disability",
          "Veteran status",
          "Genetic information",
          "Financial means",
          "Ideology",
          "Other"
        ],
        "weight": {
          "$numberInt": "145"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Infrastructure Sectors",
        "long_name": "Critical infrastructure sectors affected",
        "short_description": "Where applicable, this field indicates if the incident caused harm to any of the economic sectors designated by the U.S. government as critical infrastructure.",
        "long_description": "Where applicable, this field indicates if the incident caused harm to any of the economic sectors designated by the U.S. government as critical infrastructure.",
        "display_type": "multi",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [
          "Chemical",
          "Commercial facilities",
          "Communications",
          "Critical manufacturing",
          "Dams",
          "Defense-industrial base",
          "Emergency services",
          "Energy",
          "Financial services",
          "Food and agriculture",
          "Government facilities",
          "Healthcare and public health",
          "Information technology",
          "Nuclear",
          "Transportation",
          "Water and wastewater"
        ],
        "weight": {
          "$numberInt": "65"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Financial Cost",
        "long_name": "Total financial cost",
        "short_description": "The stated or estimated financial cost of the incident, if reported.",
        "long_description": "The stated or estimated financial cost of the incident, if reported.",
        "display_type": "string",
        "mongo_type": "string",
        "default": "",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "60"
        },
        "instant_facet": false,
        "required": false
      },
      {
        "short_name": "Laws Implicated",
        "long_name": "Laws covering the incident",
        "short_description": "Relevant laws under which entities involved in the incident may face legal liability as a result of the incident.",
        "long_description": "Relevant laws under which entities involved in the incident may face legal liability as a result of the incident.",
        "display_type": "list",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "55"
        },
        "instant_facet": false,
        "required": false
      },
      {
        "short_name": "AI System Description",
        "long_name": "Description of AI system involved",
        "short_description": "A brief description of the AI system(s) involved in the incident, including the system’s intended function, the context in which it was deployed, and any available details about the algorithms, hardware, and training data involved in the system.",
        "long_description": "A brief description of the AI system(s) involved in the incident, including the system’s intended function, the context in which it was deployed, and any available details about the algorithms, hardware, and training data involved in the system.",
        "display_type": "string",
        "mongo_type": "string",
        "default": "",
        "placeholder": "Describe the AI system here",
        "permitted_values": [],
        "weight": {
          "$numberInt": "135"
        },
        "instant_facet": false,
        "required": false
      },
      {
        "short_name": "Data Inputs",
        "long_name": "Description of the data inputs to the AI systems",
        "short_description": "A brief description of the data that the AI system(s) used or were trained on.",
        "long_description": "A brief description of the data that the AI system(s) used or were trained on.",
        "display_type": "list",
        "mongo_type": "array",
        "default": "",
        "placeholder": "Describe the AI system here",
        "permitted_values": [],
        "weight": {
          "$numberInt": "50"
        },
        "instant_facet": false,
        "required": false
      },
      {
        "short_name": "System Developer",
        "long_name": "System developer",
        "short_description": "The entity that created the AI system.",
        "long_description": "The entity that created the AI system.",
        "display_type": "list",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "130"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Sector of Deployment",
        "long_name": "Sector of deployment",
        "short_description": "The primary economic sector in which the AI system(s) involved in the incident were operating.",
        "long_description": "The primary economic sector in which the AI system(s) involved in the incident were operating.",
        "display_type": "multi",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [
          "Manufacturing",
          "Electricity, gas, steam and air conditioning supply",
          "Water supply",
          "Construction",
          "Wholesale and retail trade",
          "Transportation and storage",
          "Accommodation and food service activities",
          "Information and communication",
          "Financial and insurance activities",
          "Real estate activities",
          "Professional, scientific and technical activities",
          "Administrative and support service activities",
          "Public administration and defence",
          "Education",
          "Human health and social work activities",
          "Arts, entertainment and recreation",
          "Other service activities",
          "Activities of households as employers",
          "Activities of extraterritorial organizations and bodies"
        ],
        "weight": {
          "$numberInt": "125"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Public Sector Deployment",
        "long_name": "Public sector deployment",
        "short_description": "\"Yes\" if the AI system(s) involved in the accident were being used by the public sector or for the administration of public goods (for example, public transportation). \"No\" if the system(s) were being used in the private sector or for commercial purposes (for example, a ride-sharing company), on the other.",
        "long_description": "\"Yes\" if the AI system(s) involved in the accident were being used by the public sector or for the administration of public goods (for example, public transportation). \"No\" if the system(s) were being used in the private sector or for commercial purposes (for example, a ride-sharing company), on the other.",
        "display_type": "bool",
        "mongo_type": "bool",
        "default": "false",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "45"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Nature of End User",
        "long_name": "Nature of end user",
        "short_description": "\"Expert\" if users with special training or technical expertise were the ones meant to benefit from the AI system(s)’ operation; \"Amateur\" if the AI systems were primarily meant to benefit the general public or untrained users.",
        "long_description": "\"Expert\" if users with special training or technical expertise were the ones meant to benefit from the AI system(s)’ operation; \"Amateur\" if the AI systems were primarily meant to benefit the general public or untrained users.",
        "display_type": "enum",
        "mongo_type": "string",
        "default": "Accident",
        "placeholder": "Accident",
        "permitted_values": [
          "Expert",
          "Amateur"
        ],
        "weight": {
          "$numberInt": "40"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Level of Autonomy",
        "long_name": "Level of autonomy",
        "short_description": "The degree to which the AI system(s) functions independently from human intervention. \"High\" means there is no human involved in the system action execution; \"Medium\" means the system generates a decision and a human oversees the resulting action; \"low\" means the system generates decision-support output and a human makes a decision and executes an action.",
        "long_description": "The degree to which the AI system(s) functions independently from human intervention. \"High\" means there is no human involved in the system action execution; \"Medium\" means the system generates a decision and a human oversees the resulting action; \"low\" means the system generates decision-support output and a human makes a decision and executes an action.",
        "display_type": "enum",
        "mongo_type": "string",
        "default": "Accident",
        "placeholder": "Accident",
        "permitted_values": [
          "High",
          "Medium",
          "Low"
        ],
        "weight": {
          "$numberInt": "35"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Relevant AI functions",
        "long_name": "Relevant AI functions",
        "short_description": "Indicates whether the AI system(s) were intended to perform any of the following high-level functions: \"Perception,\" i.e. sensing and understanding the environment; \"Cognition,\" i.e. making decisions; or \"Action,\" i.e. carrying out decisions through physical or digital means.",
        "long_description": "Indicates whether the AI system(s) were intended to perform any of the following high-level functions: \"Perception,\" i.e. sensing and understanding the environment; \"Cognition,\" i.e. making decisions; or \"Action,\" i.e. carrying out decisions through physical or ital means.",
        "display_type": "multi",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [
          "Perception",
          "Cognition",
          "Action",
          "Unclear"
        ],
        "weight": {
          "$numberInt": "120"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "AI Techniques",
        "long_name": "AI tools and techniques used",
        "short_description": "Open-ended tags that indicate the hardware and software involved in the AI system(s).",
        "long_description": "Open-ended tags that indicate the hardware and software involved in the AI system(s).",
        "display_type": "list",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "115"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "AI Applications",
        "long_name": "AI functions and applications used",
        "short_description": "Open-ended tags that describe the functions and applications of the AI system.",
        "long_description": "Open-ended tags that describe the functions and applications of the AI system.",
        "display_type": "list",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [],
        "weight": {
          "$numberInt": "110"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Physical System",
        "long_name": "Physical system",
        "short_description": "Where relevant, indicates whether the AI system(s) was embedded into or tightly associated with specific types of hardware.",
        "long_description": "Where relevant, indicates whether the AI system(s) was embedded into or tightly associated with specific types of hardware.",
        "display_type": "multi",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [
          "Consumer device",
          "Industrial process system",
          "Weapons system",
          "Vehicle/mobile robot",
          "Software only",
          "Unknown/unclear"
        ],
        "weight": {
          "$numberInt": "30"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Problem Nature",
        "long_name": "Causative factors within AI system",
        "short_description": "Indicates which, if any, of the following types of AI failure describe the incident: \"Specification,\" i.e. the system's behavior did not align with the true intentions of its designer, operator, etc; \"Robustness,\" i.e. the system operated unsafely because of features or changes in its environment, or in the inputs the system received; \"Assurance,\" i.e. the system could not be adequately monitored or controlled during operation.",
        "long_description": "Indicates which, if any, of the following types of AI failure describe the incident: \"Specification,\" i.e. the system's behavior did not align with the true intentions of its designer, operator, etc; \"Robustness,\" i.e. the system operated unsafely because of features or changes in its environment, or in the inputs the system received; \"Assurance,\" i.e. the system could not be adequately monitored or controlled during operation.",
        "display_type": "multi",
        "mongo_type": "array",
        "default": "",
        "placeholder": "",
        "permitted_values": [
          "Specification",
          "Robustness",
          "Assurance",
          "Unknown/unclear"
        ],
        "weight": {
          "$numberInt": "25"
        },
        "instant_facet": true,
        "required": false
      },
      {
        "short_name": "Publish",
        "mongo_type": "bool",
        "display_type": "bool"
      }
    ]
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};
