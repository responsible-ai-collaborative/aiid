import { ObjectId } from 'bson';

const checklists = [
    {
        _id: new ObjectId("6537e59e9208f3f75b2db1f7"),
        owner_id: "63601cdc29e6840df23ad3e5",
        tags_methods: [
            "GMF:Known AI Technology:Language Modeling"
        ],
        tags_goals: [
            "GMF:Known AI Goal:Chatbot"
        ],
        about: "",
        risks: [
            {
                id: "09511dbb-6bd8-42de-bc7b-bbac8864455b",
                tags: [
                    "GMF:Known AI Technical Failure:Unsafe Exposure or Access"
                ],
                severity: "",
                title: "Unsafe Exposure or Access",
                risk_status: "Not Mitigated",
                likelihood: "",
                touched: false,
                risk_notes: ""
            }
        ],
        tags_other: [
            "CSETv1:Entertainment Industry:yes"
        ],
        id: "849bd303-261f-4abe-8746-77dad5841dbe",
        name: "Test Checklist"
    },
    {
      "about": "",
      "date_created": "2024-01-02T23:38:07.875Z",
      "date_updated": "2024-01-02T23:38:07.875Z",
      "id": "testChecklist",
      "name": "Unspecified System",
      "risks": [
        {
          "__typename": "ChecklistRisk",
          "generated": false,
          "id": "7876ca98-ca8a-4365-8c39-203474c1dc38",
          "likelihood": "",
          "precedents": [
            {
              "__typename": "ChecklistRiskPrecedent",
              "description": "The French digital care company, Nabla, in researching GPT-3’s capabilities for medical documentation, diagnosis support, and treatment recommendation, found its inconsistency and lack of scientific and medical expertise unviable and risky in healthcare applications. This incident has been downgraded to an issue as it does not meet current ingestion criteria.",
              "incident_id": 287,
              "tags": [
                "GMF:Known AI Goal:Question Answering",
                "GMF:Known AI Technology:Transformer",
                "GMF:Known AI Technology:Language Modeling",
                "GMF:Known AI Technology:Distributional Learning",
                "GMF:Known AI Technology Classification Discussion:Distributional Learning: If no training data citing sources is available and/or not enough data from a medical domain were available.",
                "GMF:Potential AI Technical Failure:Limited Dataset",
                "GMF:Potential AI Technical Failure:Problematic Input",
                "GMF:Potential AI Technical Failure:Robustness Failure",
                "GMF:Potential AI Technical Failure:Overfitting",
                "GMF:Potential AI Technical Failure:Underfitting",
                "GMF:Potential AI Technical Failure:Inadequate Sequential Memory",
                "GMF:Potential AI Technical Failure Classification Discussion:Limited Dataset: If no training data citing sources is available and/or not enough data from a medical domain were available.\n\nProblematic Input: If the prompt does not state that references are required.\n\nOverfitting: System does not capture the semantic content of the prompt, but focuses on specific verbage.\n\nUnderfitting: Due to lack of fine-tuning, the model can be considered as having a poor fit for specific medical questions.",
                "GMF:Known AI Technical Failure:Distributional Artifacts"
              ],
              "title": "OpenAI’s GPT-3 Reported as Unviable in Medical Tasks by Healthcare Firm"
            }
          ],
          "risk_notes": "",
          "risk_status": "Mitigated",
          "severity": "Minor",
          "tags": [
            "GMF:Known AI Technical Failure:Distributional Artifacts"
          ],
          "title": "Distributional Artifacts",
          "touched": false
        },
        {
          "__typename": "ChecklistRisk",
          "generated": false,
          "id": "9a1d30d3-b45c-4d7f-a593-8d7dfe78ffb7",
          "likelihood": "",
          "precedents": [
            {
              "__typename": "ChecklistRiskPrecedent",
              "description": "Facebook's automatic language translation software incorrectly translated an Arabic post saying \"Good morning\" into Hebrew saying \"hurt them,\" leading to the arrest of a Palestinian man in Beitar Illit, Israel.",
              "incident_id": 72,
              "tags": [
                "GMF:Known AI Goal:Translation",
                "GMF:Known AI Goal Classification Discussion:Translation: Presumably the arabic dialect in the text is not represented adequately in the training data, hence the translation performance issues. \n",
                "GMF:Known AI Technical Failure:Dataset Imbalance",
                "GMF:Known AI Technical Failure:Distributional Bias",
                "GMF:Known AI Technical Failure Classification Discussion:Dataset Imbalance: Presumably the arabic dialect in the text is not represented adequately in the training data, hence the translation performance issues. \n\n\nDistributional Bias: Biased language in Western / Israeli media texts about Arabs could build false associations and high priors to terrorism and violence.",
                "GMF:Potential AI Technical Failure:Generalization Failure",
                "GMF:Potential AI Technical Failure Classification Discussion:Generalization Failure: Perhaps only one (standard arabic) or a few dialects are supported, and one or more language models is used as fallback for all arabic languages.",
                "GMF:Known AI Technology:Convolutional Neural Network",
                "GMF:Known AI Technology:Recurrent Neural Network",
                "GMF:Known AI Technology:Distributional Learning",
                "GMF:Potential AI Technology:Intermediate modeling",
                "GMF:Potential AI Technology:Classification",
                "GMF:Potential AI Technology:Multimodal Learning",
                "GMF:Potential AI Technology:Image Classification",
                "GMF:Potential AI Technology Classification Discussion:Intermediate modeling: Perhaps intermmediate languages are used (i.e. if no model has been trained to translate X to Y, use X->Z and then Z->Y), which accumulate errors.\n\nClassification: GIven the amount of supported languages for translation, a system must exist to detect the input language and classify amongst supported languages.\n\nMultimodal Learning: If image was also utilized to generate the translation, that would provide additional evidence to the mistranslation.\n\nImage Classification: If multimodal learning is used, perhaps the buldozer was recognized and its extracted keyword contributed to the bias in the NLP domain."
              ],
              "title": "Facebook translates 'good morning' into 'attack them', leading to arrest"
            }
          ],
          "risk_notes": "",
          "risk_status": "Not Mitigated",
          "severity": "Minor",
          "tags": [
            "GMF:Known AI Technical Failure:Dataset Imbalance"
          ],
          "title": "Dataset Imbalance",
          "touched": false
        },
        {
          "__typename": "ChecklistRisk",
          "generated": false,
          "id": "687fe402-3dad-4630-beef-7e423e64e4fd",
          "likelihood": "",
          "precedents": [
            {
              "__typename": "ChecklistRiskPrecedent",
              "description": "Facebook's automatic language translation software incorrectly translated an Arabic post saying \"Good morning\" into Hebrew saying \"hurt them,\" leading to the arrest of a Palestinian man in Beitar Illit, Israel.",
              "incident_id": 72,
              "tags": [
                "GMF:Known AI Goal:Translation",
                "GMF:Known AI Goal Classification Discussion:Translation: Presumably the arabic dialect in the text is not represented adequately in the training data, hence the translation performance issues. \n",
                "GMF:Known AI Technical Failure:Dataset Imbalance",
                "GMF:Known AI Technical Failure:Distributional Bias",
                "GMF:Known AI Technical Failure Classification Discussion:Dataset Imbalance: Presumably the arabic dialect in the text is not represented adequately in the training data, hence the translation performance issues. \n\n\nDistributional Bias: Biased language in Western / Israeli media texts about Arabs could build false associations and high priors to terrorism and violence.",
                "GMF:Potential AI Technical Failure:Generalization Failure",
                "GMF:Potential AI Technical Failure Classification Discussion:Generalization Failure: Perhaps only one (standard arabic) or a few dialects are supported, and one or more language models is used as fallback for all arabic languages.",
                "GMF:Known AI Technology:Convolutional Neural Network",
                "GMF:Known AI Technology:Recurrent Neural Network",
                "GMF:Known AI Technology:Distributional Learning",
                "GMF:Potential AI Technology:Intermediate modeling",
                "GMF:Potential AI Technology:Classification",
                "GMF:Potential AI Technology:Multimodal Learning",
                "GMF:Potential AI Technology:Image Classification",
                "GMF:Potential AI Technology Classification Discussion:Intermediate modeling: Perhaps intermmediate languages are used (i.e. if no model has been trained to translate X to Y, use X->Z and then Z->Y), which accumulate errors.\n\nClassification: GIven the amount of supported languages for translation, a system must exist to detect the input language and classify amongst supported languages.\n\nMultimodal Learning: If image was also utilized to generate the translation, that would provide additional evidence to the mistranslation.\n\nImage Classification: If multimodal learning is used, perhaps the buldozer was recognized and its extracted keyword contributed to the bias in the NLP domain."
              ],
              "title": "Facebook translates 'good morning' into 'attack them', leading to arrest"
            }
          ],
          "risk_notes": "",
          "risk_status": "Mitigated",
          "severity": "Severe",
          "tags": [
            "GMF:Known AI Technical Failure:Distributional Bias"
          ],
          "title": "Distributional Bias",
          "touched": false
        }
      ],
      "tags_goals": [
        "GMF:Known AI Goal:Question Answering"
      ],
      "tags_methods": [
        "GMF:Potential AI Technology:Classification",
        "GMF:Known AI Technology:Language Modeling"
      ],
      "tags_other": []
    }
]

export default checklists;
