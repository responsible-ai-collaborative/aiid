const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const classifications = [];

  for (const incidentId in annotations) {
    const classification = {
      incident_id: Number(incidentId),
      namespace: 'GMF',
      publish: true,
      notes: '',
      attributes: [],
    };

    const taxonomies = annotations[incidentId].taxonomies;

    for (const taxonomyName in taxonomies) {
      for (const entry of taxonomies[taxonomyName]) {
        const entryName =
          capitalize(entry.confidence) +
          ' ' +
          {
            task: 'AI Goal',
            technology: 'AI Technology',
            failure: 'AI Technical Failure',
          }[taxonomyName];

        let valueAttribute = classification.attributes.find(
          (attribute) => attribute.short_name == entryName
        );

        if (!valueAttribute) {
          valueAttribute = { short_name: entryName, value_json: '[]' };
          classification.attributes.push(valueAttribute);
        }
        valueAttribute.value_json = JSON.stringify(
          JSON.parse(valueAttribute.value_json).concat([entry.label])
        );

        if (entry.comment) {
          const commentName = entryName + ' Classification Discussion';

          let commentAttribute = classification.attributes.find(
            (attribute) => attribute.short_name == commentName
          );

          if (!commentAttribute) {
            commentAttribute = { short_name: commentName, value_json: '""' };
            classification.attributes.push(commentAttribute);
          }
          const prevValue = JSON.parse(commentAttribute.value_json);

          const labeledComment = entry.label + ': ' + entry.comment;

          commentAttribute.value_json = JSON.stringify(
            prevValue == '' ? labeledComment : prevValue + '\n\n' + labeledComment
          );
        }

        if (entry.snippets) {
          const snippetsValue = entry.snippets.map((snippet) => {
            const attributes = [];

            attributes.push({
              short_name: 'Snippet Text',
              value_json: JSON.stringify(snippet),
            });
            attributes.push({
              short_name: 'Related Classifications',
              value_json: JSON.stringify([entry.label]),
            });

            const snippetFull = annotations[incidentId].snippets.find(
              (s) => s.snippet_text == snippet
            );

            if (snippetFull?.comment) {
              attributes.push({
                short_name: 'Snippet Discussion',
                value_json: JSON.stringify(snippetFull?.comment),
              });
            }
            return { attributes };
          });

          const snippetsName = entryName + ' Snippets';

          let snippetsAttribute = classification.attributes.find(
            (attribute) => attribute.short_name == snippetsName
          );

          if (!snippetsAttribute) {
            snippetsAttribute = { short_name: snippetsName, value_json: '[]' };
            classification.attributes.push(snippetsAttribute);
          }
          const prevSnippets = JSON.parse(snippetsAttribute.value_json);

          snippetsAttribute.value_json = JSON.stringify(prevSnippets.concat(snippetsValue));
        }
      }
    }
    const snippetsAttributes = classification.attributes.filter((attribute) =>
      attribute.short_name.includes('Snippets')
    );

    for (const snippetAttribute of snippetsAttributes) {
      const snippets = JSON.parse(snippetAttribute.value_json);

      const noDuplicates = [];

      for (const snippet of snippets) {
        const duplicate = noDuplicates.find(
          (s) =>
            s.attributes.find((a) => a.short_name == 'Snippet Text').value_json ==
            snippet.attributes.find((a) => a.short_name == 'Snippet Text').value_json
        );

        if (duplicate) {
          const relatedClassificationsOriginal = duplicate.attributes.find(
            (a) => a.short_name == 'Related Classifications'
          );

          const relatedClassificationsOriginalValue = JSON.parse(
            relatedClassificationsOriginal.value_json
          );

          const relatedClassificationsNew = snippet.attributes.find(
            (a) => a.short_name == 'Related Classifications'
          );

          const relatedClassificationsNewValue = JSON.parse(relatedClassificationsNew.value_json);

          const combined = [
            ...relatedClassificationsOriginalValue,
            ...relatedClassificationsNewValue,
          ];

          relatedClassificationsOriginal.value_json = JSON.stringify(combined);
        } else {
          noDuplicates.push(snippet);
        }
      }
      snippetAttribute.value_json = JSON.stringify(noDuplicates);
    }
    classifications.push(classification);
  }

  const classificationsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  for (const classification of classifications) {
    await classificationsCollection.insertOne(classification);
  }
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async ({ context: { client } }) => {
  const classifications = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  classifications.deleteMany({ namespace: 'GMF' });
};

var capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

var annotations = {
  146: {
    taxonomies: {
      task: [
        {
          label: 'Question Answering',
          confidence: 'known',
          snippets: [
            'You can pose any question you like and be sure to receive an answer, wrapped in the authority of the algorithm rather than the soothsayer.',
          ],
        },
      ],
      technology: [
        {
          label: 'Distributional Learning',
          confidence: 'known',
          snippets: [
            ' It has clear biases, telling you that America is \u201cgood\u201d and that Somalia is \u201cdangerous\u201d; and it\u2019s amenable to special pleading, noting that eating babies is \u201cokay\u201d as long as you are \u201creally, really hungry.\u201d',
          ],
        },
        {
          label: 'Transformer',
          confidence: 'potential',
          snippets: [
            'You can pose any question you like and be sure to receive an answer, wrapped in the authority of the algorithm rather than the soothsayer.',
          ],
        },
        {
          label: 'Language Modeling',
          confidence: 'known',
          snippets: [
            'You can pose any question you like and be sure to receive an answer, wrapped in the authority of the algorithm rather than the soothsayer.',
          ],
        },
      ],
      failure: [
        {
          label: 'Distributional Bias',
          confidence: 'known',
          snippets: [
            'Ask Delphi is no different in this regard, and its training data incorporates some unusual sources, including a series of one-sentence prompts scraped from two subreddits: r/AmITheAsshole and r/Confessions.',
            ' It has clear biases, telling you that America is \u201cgood\u201d and that Somalia is \u201cdangerous\u201d; and it\u2019s amenable to special pleading, noting that eating babies is \u201cokay\u201d as long as you are \u201creally, really hungry.\u201d',
          ],
        },
        {
          label: 'Overfitting',
          confidence: 'potential',
          snippets: [
            'Sometimes it\u2019s obvious how to tip the scales. For example, the AI will tell you that \u201cdrunk driving\u201d is wrong but that \u201chaving a few beers while driving because it hurts no-one\u201d is a-okay. If you add the phrase \u201cif it makes everyone happy\u201d to the end of your statement, then the AI will smile beneficently on any immoral activity of your choice, up to and including genocide. Similarly, if you add \u201cwithout apologizing\u201d to the end of many benign descriptions, like \u201cstanding still\u201d or \u201cmaking pancakes,\u201d it will assume you should have apologized and tells you that you\u2019re being rude. Ask Delphi is a creature of context.',
            'Most of Ask Delphi\u2019s judgements, though, aren\u2019t so much ethically wrong as they are obviously influenced by their framing. Even very small changes to how you pose a particular quandary can flip the system\u2019s judgement from condemnation to approval.',
          ],
        },
        {
          label: 'Robustness Failure',
          confidence: 'potential',
          snippets: [
            'Others found the system woefully inconsistent, illogical and offensive. ',
            'Most of Ask Delphi\u2019s judgements, though, aren\u2019t so much ethically wrong as they are obviously influenced by their framing. Even very small changes to how you pose a particular quandary can flip the system\u2019s judgement from condemnation to approval.',
          ],
        },
        {
          label: 'Context Misidentification',
          confidence: 'potential',
          snippets: [
            'Sometimes it\u2019s obvious how to tip the scales. For example, the AI will tell you that \u201cdrunk driving\u201d is wrong but that \u201chaving a few beers while driving because it hurts no-one\u201d is a-okay. If you add the phrase \u201cif it makes everyone happy\u201d to the end of your statement, then the AI will smile beneficently on any immoral activity of your choice, up to and including genocide. Similarly, if you add \u201cwithout apologizing\u201d to the end of many benign descriptions, like \u201cstanding still\u201d or \u201cmaking pancakes,\u201d it will assume you should have apologized and tells you that you\u2019re being rude. Ask Delphi is a creature of context.',
          ],
        },
        {
          label: 'Limited Dataset',
          confidence: 'potential',
          snippets: [
            'The folks behind the project drew on some eyebrow-raising sources to help train the AI, including the \u201cAm I the Asshole?\u201d subreddit, the \u201cConfessions\u201d subreddit, and the \u201cDear Abby\u201d advice column, according to the paper the team behind Delphi published about the experiment.',
            'Ask Delphi is no different in this regard, and its training data incorporates some unusual sources, including a series of one-sentence prompts scraped from two subreddits: r/AmITheAsshole and r/Confessions.',
          ],
          comment: 'US ethics only, data sourced from two subreddits and a column.',
        },
        {
          label: 'Gaming Vulnerability',
          confidence: 'known',
          snippets: [
            'Most of Ask Delphi\u2019s judgements, though, aren\u2019t so much ethically wrong as they are obviously influenced by their framing. Even very small changes to how you pose a particular quandary can flip the system\u2019s judgement from condemnation to approval.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'You can pose any question you like and be sure to receive an answer, wrapped in the authority of the algorithm rather than the soothsayer.',
        report_idx: 1,
      },
      {
        snippet_text:
          ' It has clear biases, telling you that America is \u201cgood\u201d and that Somalia is \u201cdangerous\u201d; and it\u2019s amenable to special pleading, noting that eating babies is \u201cokay\u201d as long as you are \u201creally, really hungry.\u201d',
        report_idx: 1,
      },
      {
        snippet_text:
          'Worryingly, it approves straightforwardly racist and homophobic statements, saying it\u2019s \u201cgood\u201d to \u201csecure the existence of our people and a future for white children\u201d (a white supremacist slogan known as the 14 words) and that \u201cbeing straight is more morally acceptable than being gay.\u201d',
        report_idx: 1,
      },
      {
        snippet_text:
          'Most of Ask Delphi\u2019s judgements, though, aren\u2019t so much ethically wrong as they are obviously influenced by their framing. Even very small changes to how you pose a particular quandary can flip the system\u2019s judgement from condemnation to approval.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Sometimes it\u2019s obvious how to tip the scales. For example, the AI will tell you that \u201cdrunk driving\u201d is wrong but that \u201chaving a few beers while driving because it hurts no-one\u201d is a-okay. If you add the phrase \u201cif it makes everyone happy\u201d to the end of your statement, then the AI will smile beneficently on any immoral activity of your choice, up to and including genocide. Similarly, if you add \u201cwithout apologizing\u201d to the end of many benign descriptions, like \u201cstanding still\u201d or \u201cmaking pancakes,\u201d it will assume you should have apologized and tells you that you\u2019re being rude. Ask Delphi is a creature of context.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Ask Delphi is no different in this regard, and its training data incorporates some unusual sources, including a series of one-sentence prompts scraped from two subreddits: r/AmITheAsshole and r/Confessions.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Ask Delphi is no different in this regard, and its training data incorporates some unusual sources, including a series of one-sentence prompts scraped from two subreddits: r/AmITheAsshole and r/Confessions.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The folks behind the project drew on some eyebrow-raising sources to help train the AI, including the \u201cAm I the Asshole?\u201d subreddit, the \u201cConfessions\u201d subreddit, and the \u201cDear Abby\u201d advice column, according to the paper the team behind Delphi published about the experiment.',
        report_idx: 2,
      },
      {
        snippet_text: 'Others found the system woefully inconsistent, illogical and offensive. ',
        report_idx: 3,
      },
    ],
  },
  31: {
    taxonomies: {
      task: [
        {
          label: 'Autonomous Driving',
          confidence: 'known',
          snippets: [
            "New Delhi, Dec 20 (IANS) The Delhi Metro on Wednesday sacked four of its officials, including a Deputy General Manager, for Tuesday's accident in which a metro train rammed through a wall after failure of its brakes.",
          ],
        },
      ],
      technology: [
        {
          label: 'Other domain-specific approaches',
          confidence: 'potential',
          snippets: [],
        },
      ],
      failure: [
        {
          label: 'Hardware Failure',
          confidence: 'potential',
          snippets: [
            "New Delhi, Dec 20 (IANS) The Delhi Metro on Wednesday sacked four of its officials, including a Deputy General Manager, for Tuesday's accident in which a metro train rammed through a wall after failure of its brakes.",
          ],
        },
        {
          label: 'Misuse',
          confidence: 'potential',
          snippets: [
            'The accident which happened inside the Kalindi Kunj metro depot located on the upcoming Magenta Line (Botanical Garden - Janakpuri West) was a result of "human error", the transporter said, arising out of "not following proper procedure".',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          "New Delhi, Dec 20 (IANS) The Delhi Metro on Wednesday sacked four of its officials, including a Deputy General Manager, for Tuesday's accident in which a metro train rammed through a wall after failure of its brakes.",
        report_idx: 1,
      },
      {
        snippet_text:
          'The accident which happened inside the Kalindi Kunj metro depot located on the upcoming Magenta Line (Botanical Garden - Janakpuri West) was a result of "human error", the transporter said, arising out of "not following proper procedure".',
        report_idx: 1,
      },
      {
        snippet_text:
          'Attributing the incident to "human error", the said it appeared to have occurred because the brakes were not checked properly after the train was taken off the signalling system by the person who was in charge of the train.',
        report_idx: 3,
      },
    ],
  },
  179: {
    taxonomies: {
      task: [
        {
          label: 'Visual Art Generation',
          confidence: 'known',
          snippets: [
            'Without sufficient guardrails, models like DALL\u00b7E 2 could be used to generate a wide range of deceptive and otherwise harmful content, and could affect how people perceive the authenticity of content more generally.',
          ],
        },
      ],
      technology: [
        {
          label: 'Transformer',
          confidence: 'known',
          snippets: [
            'Without sufficient guardrails, models like DALL\u00b7E 2 could be used to generate a wide range of deceptive and otherwise harmful content, and could affect how people perceive the authenticity of content more generally.',
          ],
        },
        {
          label: 'Distributional Learning',
          confidence: 'known',
          snippets: [
            ' DALL\u00b7E 2 additionally inherits various biases from its training data, and its outputs sometimes reinforce societal stereotypes.',
          ],
        },
      ],
      failure: [
        {
          label: 'Distributional Bias',
          confidence: 'known',
          snippets: [
            ' DALL\u00b7E 2 additionally inherits various biases from its training data, and its outputs sometimes reinforce societal stereotypes.',
            'While the deeply contextual nature of bias makes it difficult to measure and mitigate the actual downstream harms resulting from use of the DALL\u00b7E 2 Preview (i.e. beyond the point of generation), our intent is to provide concrete illustrations here that can inform users and affected non-users even at this very initial preview stage.',
            'The default behavior of the DALL\u00b7E 2 Preview produces images that tend to overrepresent people who are White-passing and Western concepts generally. In some places it over-represents generations of people who are female-passing (such as for the prompt: \u201ca flight attendant\u201d ) while in others it over-represents generations of people who are male-passing (such as for the prompt: \u201ca builder\u201d). In some places this is representative of stereotypes (as discussed below) but in others the pattern being recreated is less immediately clear.',
            'For example, when prompted with \u201cwedding,\u201d it tends to assume Western wedding traditions, and to default to heterosexual couples. ',
            'There are the obvious risks \u2014 that people could use this type of AI to make everything from pornography to political deepfakes, or the possibility that it\u2019ll eventually put some human illustrators out of work. But there is also the risk that DALL-E 2 \u2014 like so many other cutting-edge AI systems \u2014 will reinforce harmful stereotypes and biases, and in doing so, accentuate some of our social problems.',
          ],
        },
        {
          label: 'Unsafe Exposure or Access',
          confidence: 'known',
          snippets: [
            'Without sufficient guardrails, models like DALL\u00b7E 2 could be used to generate a wide range of deceptive and otherwise harmful content, and could affect how people perceive the authenticity of content more generally.',
            'In qualitative evaluations, we find that the system, even with current mitigations in place, can still be used to generate images that may be harmful in particular contexts and difficult for any reactive response team to identify and catch.',
            'There are the obvious risks \u2014 that people could use this type of AI to make everything from pornography to political deepfakes, or the possibility that it\u2019ll eventually put some human illustrators out of work. But there is also the risk that DALL-E 2 \u2014 like so many other cutting-edge AI systems \u2014 will reinforce harmful stereotypes and biases, and in doing so, accentuate some of our social problems.',
          ],
        },
        {
          label: 'Misinformation Generation Hazard',
          confidence: 'known',
          snippets: [
            'Without sufficient guardrails, models like DALL\u00b7E 2 could be used to generate a wide range of deceptive and otherwise harmful content, and could affect how people perceive the authenticity of content more generally.',
            'In qualitative evaluations, we find that the system, even with current mitigations in place, can still be used to generate images that may be harmful in particular contexts and difficult for any reactive response team to identify and catch.',
            'There are the obvious risks \u2014 that people could use this type of AI to make everything from pornography to political deepfakes, or the possibility that it\u2019ll eventually put some human illustrators out of work. But there is also the risk that DALL-E 2 \u2014 like so many other cutting-edge AI systems \u2014 will reinforce harmful stereotypes and biases, and in doing so, accentuate some of our social problems.',
          ],
        },
        {
          label: 'Inappropriate Training Content',
          confidence: 'known',
          snippets: [
            'Despite the pre-training filtering, DALL\u00b7E 2 maintains the ability to generate content that features or suggests any of the following: nudity/sexual content, hate, or violence/harm. ',
          ],
        },
        {
          label: 'Unauthorized Data',
          confidence: 'potential',
          snippets: [
            'The model can generate known entities including trademarked logos and copyrighted characters. ',
          ],
        },
        {
          label: 'Lack of Transparency',
          confidence: 'potential',
          snippets: [
            'Despite the pre-training filtering, DALL\u00b7E 2 maintains the ability to generate content that features or suggests any of the following: nudity/sexual content, hate, or violence/harm. ',
          ],
          comment:
            'Potential, since the previous report analysis failure modes and providing details was an openai document.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'Without sufficient guardrails, models like DALL\u00b7E 2 could be used to generate a wide range of deceptive and otherwise harmful content, and could affect how people perceive the authenticity of content more generally.',
        report_idx: 1,
      },
      {
        snippet_text:
          ' DALL\u00b7E 2 additionally inherits various biases from its training data, and its outputs sometimes reinforce societal stereotypes.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Despite the pre-training filtering, DALL\u00b7E 2 maintains the ability to generate content that features or suggests any of the following: nudity/sexual content, hate, or violence/harm. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'While the deeply contextual nature of bias makes it difficult to measure and mitigate the actual downstream harms resulting from use of the DALL\u00b7E 2 Preview (i.e. beyond the point of generation), our intent is to provide concrete illustrations here that can inform users and affected non-users even at this very initial preview stage.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The default behavior of the DALL\u00b7E 2 Preview produces images that tend to overrepresent people who are White-passing and Western concepts generally. In some places it over-represents generations of people who are female-passing (such as for the prompt: \u201ca flight attendant\u201d ) while in others it over-represents generations of people who are male-passing (such as for the prompt: \u201ca builder\u201d). In some places this is representative of stereotypes (as discussed below) but in others the pattern being recreated is less immediately clear.',
        report_idx: 1,
      },
      {
        snippet_text:
          'For example, when prompted with \u201cwedding,\u201d it tends to assume Western wedding traditions, and to default to heterosexual couples. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'In qualitative evaluations, we find that the system, even with current mitigations in place, can still be used to generate images that may be harmful in particular contexts and difficult for any reactive response team to identify and catch.',
        report_idx: 1,
      },
      {
        snippet_text:
          'OpenAI has made efforts to implement model-level technical mitigations that ensure that DALL\u00b7E 2 Preview cannot be used to directly generate exact matches for any of the images in its training data. However, the models may still be able to compose aspects of real images and identifiable details of people, such as clothing and backgrounds.',
        report_idx: 1,
      },
      {
        snippet_text:
          'It is often possible to generate images of public figures using large-scale image generation systems, because such figures tend to be well-represented in public datasets, causing the model to learn representations of them.',
        report_idx: 1,
      },
      {
        snippet_text:
          '\nExisting tools powered by generative models have been used to generate synthetic profile pictures in disinformation campaigns.7 Like these tools, DALL\u00b7E 2 can create photorealistic images of people. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'The model can generate known entities including trademarked logos and copyrighted characters. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'There are the obvious risks \u2014 that people could use this type of AI to make everything from pornography to political deepfakes, or the possibility that it\u2019ll eventually put some human illustrators out of work. But there is also the risk that DALL-E 2 \u2014 like so many other cutting-edge AI systems \u2014 will reinforce harmful stereotypes and biases, and in doing so, accentuate some of our social problems.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Mhairi Aitken at the Alan Turing Institute says that the lack of transparency makes it hard for the public to assess the quality of models and to what extent they have inherited bias from online content.',
        report_idx: 3,
      },
    ],
  },
  240: {
    taxonomies: {
      task: [
        {
          label: 'Code Generation',
          confidence: 'known',
          snippets: [
            'GitHub Copilot draws context from the code you\u2019re working on, suggesting whole lines or entire functions.',
          ],
          comment:
            'Classifying as\u2018potential\u2019, since it is heavily contested in the article.',
        },
      ],
      technology: [
        {
          label: 'Transformer',
          confidence: 'known',
          snippets: [
            'OpenAI Codex has broad knowledge of how people use code and is significantly more capable than GPT-3 in code generation, in part, because it was trained on a data set that includes a much larger concentration of public source code. ',
          ],
          comment:
            'Classifying as\u2018potential\u2019, since it is heavily contested in the article.',
        },
        {
          label: 'Language Modeling',
          confidence: 'known',
          snippets: [
            'GitHub Copilot draws context from the code you\u2019re working on, suggesting whole lines or entire functions.',
          ],
        },
      ],
      failure: [
        {
          label: 'Unauthorized Data',
          confidence: 'potential',
          snippets: [
            'Having been \u201ctrained on billions of lines of public code,\u201d one of the first questions that has come up regarding Copilot has focused on issues of copyright, specifically pointing to the idea of the viral GPL license, which requires that all derivative works carry that same license.',
            'On the idea of copyright infringement, Guadamuz first points to a research paper by Alber Ziegler published by GitHub, which looks at situations where Copilot reproduces exact texts, and finds those instances to be exceedingly rare. ',
            '\u201cIf you look at the GitHub Terms of Service, no matter what license you use, you give GitHub the right to host your code and to use your code to improve their products and features,\u201d Downing says. \u201cSo with respect to code that\u2019s already on GitHub, I think the answer to the question of copyright infringement is fairly straightforward.\u201d',
          ],
          comment:
            'Classifying as\u2018potential\u2019, since it is heavily contested in the article.',
        },
        {
          label: 'Data Memorization',
          confidence: 'potential',
          snippets: [
            'Having been \u201ctrained on billions of lines of public code,\u201d one of the first questions that has come up regarding Copilot has focused on issues of copyright, specifically pointing to the idea of the viral GPL license, which requires that all derivative works carry that same license.',
            'On the idea of copyright infringement, Guadamuz first points to a research paper by Alber Ziegler published by GitHub, which looks at situations where Copilot reproduces exact texts, and finds those instances to be exceedingly rare. ',
            '\u201cIf you look at the GitHub Terms of Service, no matter what license you use, you give GitHub the right to host your code and to use your code to improve their products and features,\u201d Downing says. \u201cSo with respect to code that\u2019s already on GitHub, I think the answer to the question of copyright infringement is fairly straightforward.\u201d',
          ],
          comment:
            'Classifying as\u2018potential\u2019, since it is heavily contested in the article.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'GitHub Copilot draws context from the code you\u2019re working on, suggesting whole lines or entire functions.',
        report_idx: 1,
      },
      {
        snippet_text:
          'OpenAI Codex has broad knowledge of how people use code and is significantly more capable than GPT-3 in code generation, in part, because it was trained on a data set that includes a much larger concentration of public source code. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Having been \u201ctrained on billions of lines of public code,\u201d one of the first questions that has come up regarding Copilot has focused on issues of copyright, specifically pointing to the idea of the viral GPL license, which requires that all derivative works carry that same license.',
        report_idx: 2,
      },
      {
        snippet_text:
          'On the idea of copyright infringement, Guadamuz first points to a research paper by Alber Ziegler published by GitHub, which looks at situations where Copilot reproduces exact texts, and finds those instances to be exceedingly rare. ',
        report_idx: 2,
      },
      {
        snippet_text:
          '\u201cIf you look at the GitHub Terms of Service, no matter what license you use, you give GitHub the right to host your code and to use your code to improve their products and features,\u201d Downing says. \u201cSo with respect to code that\u2019s already on GitHub, I think the answer to the question of copyright infringement is fairly straightforward.\u201d',
        report_idx: 3,
      },
      {
        snippet_text:
          'GitHub reports that Copilot is mostly producing brand-new material, only regurgitating copies of learned code 0.1% of the time. ',
        report_idx: 3,
      },
    ],
  },
  141: {
    taxonomies: {
      technology: [
        {
          label: 'Acoustic Fingerprint',
          confidence: 'potential',
          snippets: [
            'We know this because he\u2019s become a viral sensation on Instagram after blasting the 1990\u2019s hit at a citizen in a misguided attempt to get Instagram\u2019s algorithm to take down a live stream due to copyright infringement.',
          ],
        },
        {
          label: 'Spectrogram',
          confidence: 'potential',
          snippets: [
            'We know this because he\u2019s become a viral sensation on Instagram after blasting the 1990\u2019s hit at a citizen in a misguided attempt to get Instagram\u2019s algorithm to take down a live stream due to copyright infringement.',
          ],
          comment: 'This applies in malicous reporting, not the AI itself.',
        },
      ],
      failure: [
        {
          label: 'Adversarial Data',
          confidence: 'known',
          snippets: [
            'This story comes to us from Vice\u2019s Dexter Thomas via the Instagram account of one Sennett Devermont, the citizen on the receiving end of the cop\u2019s silly attempt to game the system.',
          ],
        },
        {
          label: 'Lack of Adversarial Robustness',
          confidence: 'potential',
          snippets: [
            'Or, even if the algorithm does not detect the song immediately, someone \u2014 for example, a disgruntled police officer\u2014could simply wait until a user posts an archive of the live video on their page, then file a complaint with Instagram that it contains copyrighted material.',
          ],
          comment: 'This applies in malicous reporting, not the AI itself.',
        },
        {
          label: 'Gaming Vulnerability',
          confidence: 'known',
          snippets: [
            'This story comes to us from Vice\u2019s Dexter Thomas via the Instagram account of one Sennett Devermont, the citizen on the receiving end of the cop\u2019s silly attempt to game the system.',
            'Or, even if the algorithm does not detect the song immediately, someone \u2014 for example, a disgruntled police officer\u2014could simply wait until a user posts an archive of the live video on their page, then file a complaint with Instagram that it contains copyrighted material.',
          ],
        },
        {
          label: 'Black Box',
          confidence: 'potential',
          snippets: [
            'But then again, Instagram\u2019s enforcement of their own policy seems to be unpredictable and inconsistent, and it\u2019s hard to tell what the algorithm will catch during a livestream. ',
          ],
        },
      ],
      task: [
        {
          label: 'Copyrighted Content Detection',
          confidence: 'known',
          snippets: [
            'We know this because he\u2019s become a viral sensation on Instagram after blasting the 1990\u2019s hit at a citizen in a misguided attempt to get Instagram\u2019s algorithm to take down a live stream due to copyright infringement.',
          ],
          comment: 'This applies in malicous reporting, not the AI itself.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'We know this because he\u2019s become a viral sensation on Instagram after blasting the 1990\u2019s hit at a citizen in a misguided attempt to get Instagram\u2019s algorithm to take down a live stream due to copyright infringement.',
        report_idx: 1,
      },
      {
        snippet_text:
          'This story comes to us from Vice\u2019s Dexter Thomas via the Instagram account of one Sennett Devermont, the citizen on the receiving end of the cop\u2019s silly attempt to game the system.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Instagram in particular has been increasingly strict on posting copyrighted material. Any video that contains music, even if it\u2019s playing in the background, is potentially subject to removal by Instagram.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Or, even if the algorithm does not detect the song immediately, someone \u2014 for example, a disgruntled police officer\u2014could simply wait until a user posts an archive of the live video on their page, then file a complaint with Instagram that it contains copyrighted material.',
        report_idx: 2,
      },
      {
        snippet_text:
          'In May of last year, Instagram clarified its policies on including music in livestreams, and began to advise people to only use short clips of music, and to ensure that there is a "visual component" to videos\u2014"recorded audio should not be the primary purpose of the video," the company said.',
        report_idx: 2,
        comment: 'If this was the case for copyright hits, this incident wouldn\u2019t occur.',
      },
      {
        snippet_text:
          'But then again, Instagram\u2019s enforcement of their own policy seems to be unpredictable and inconsistent, and it\u2019s hard to tell what the algorithm will catch during a livestream. ',
        report_idx: 2,
      },
    ],
  },
  125: {
    taxonomies: {
      task: [
        {
          label: 'Robotic Manipulation',
          confidence: 'known',
          snippets: [
            'But a new cache of company records obtained by Reveal from The Center for Investigative Reporting \u2013 including internal safety reports and weekly injury numbers from its nationwide network of fulfillment centers \u2013 shows that company officials have profoundly misled the public and lawmakers about its record on worker safety.',
          ],
          comment: 'Robots set up too fast of a pace.',
        },
        {
          label: 'Activity Tracking',
          confidence: 'known',
          snippets: [
            'Not long after, Barrera was written up by a different manager for too much \u201cTime Off Task,\u201d Amazon\u2019s system for tracking employee productivity.',
            'Minutes later her supervisor materialized to ask why she\u2019d stopped scanning. \u201cI was thinking, how did she know I was not scanning? ',
          ],
        },
        {
          label: 'Automatic Skill Assessment',
          confidence: 'known',
          snippets: [
            'Not long after, Barrera was written up by a different manager for too much \u201cTime Off Task,\u201d Amazon\u2019s system for tracking employee productivity.',
          ],
        },
      ],
      technology: [
        {
          label: 'Visual Object Detection',
          confidence: 'potential',
          snippets: [
            'But a new cache of company records obtained by Reveal from The Center for Investigative Reporting \u2013 including internal safety reports and weekly injury numbers from its nationwide network of fulfillment centers \u2013 shows that company officials have profoundly misled the public and lawmakers about its record on worker safety.',
          ],
          comment: 'Robots set up too fast of a pace.',
        },
      ],
      failure: [
        {
          label: 'Lack of Capability Control',
          confidence: 'potential',
          snippets: [
            'The robots were too efficient. They could bring items so quickly that the productivity expectations for workers more than doubled, according to a former senior operations manager who saw the transformation. ',
            'The data back up the accounts of Amazon warehouse workers and former safety professionals who say the company has used the robots to ratchet up production quotas to the point that humans can\u2019t keep up without hurting themselves.',
          ],
          comment: "Robots set up too fast of a pace for the human 'colleagues' to handle.",
        },
        {
          label: 'Tuning Issues',
          confidence: 'known',
          comment:
            'The automated system is not configured to work harmoniously with the other (human) components of the logistics chain.',
          snippets: [
            'The robots were too efficient. They could bring items so quickly that the productivity expectations for workers more than doubled, according to a former senior operations manager who saw the transformation. ',
            'The data back up the accounts of Amazon warehouse workers and former safety professionals who say the company has used the robots to ratchet up production quotas to the point that humans can\u2019t keep up without hurting themselves.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'But a new cache of company records obtained by Reveal from The Center for Investigative Reporting \u2013 including internal safety reports and weekly injury numbers from its nationwide network of fulfillment centers \u2013 shows that company officials have profoundly misled the public and lawmakers about its record on worker safety.',
        report_idx: 1,
      },
      {
        snippet_text:
          'They reveal a mounting injury crisis at Amazon warehouses, one that is especially acute at robotic facilities and during Prime week and the holiday peak \u2013 and one that Amazon has gone to great lengths to conceal.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The data back up the accounts of Amazon warehouse workers and former safety professionals who say the company has used the robots to ratchet up production quotas to the point that humans can\u2019t keep up without hurting themselves.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Instead of greeting colleagues as she moved through the facility, she was isolated at a workstation, and standing 10 hours a day doing repetitive motions proved to be much harder on her body, Hoyos said.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The robots were too efficient. They could bring items so quickly that the productivity expectations for workers more than doubled, according to a former senior operations manager who saw the transformation. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Minutes later her supervisor materialized to ask why she\u2019d stopped scanning. \u201cI was thinking, how did she know I was not scanning? ',
        report_idx: 3,
      },
      {
        snippet_text:
          'Not long after, Barrera was written up by a different manager for too much \u201cTime Off Task,\u201d Amazon\u2019s system for tracking employee productivity.',
        report_idx: 3,
      },
    ],
  },
  171: {
    taxonomies: {
      task: [
        {
          label: 'License Plate Recognition',
          confidence: 'known',
          snippets: [
            'This is one of the reasons the world is working so hard on robotaxis, and why traffic enforcement in large cities has moved to license-plate reading traffic cameras. In both cases, accuracy and reliability seem to be the biggest problems.',
          ],
        },
      ],
      technology: [
        {
          label: 'Visual Object Detection',
          confidence: 'known',
          snippets: [
            'This is one of the reasons the world is working so hard on robotaxis, and why traffic enforcement in large cities has moved to license-plate reading traffic cameras. In both cases, accuracy and reliability seem to be the biggest problems.',
          ],
        },
        {
          label: 'Optical Character Recognition',
          confidence: 'known',
          snippets: [
            'This is one of the reasons the world is working so hard on robotaxis, and why traffic enforcement in large cities has moved to license-plate reading traffic cameras. In both cases, accuracy and reliability seem to be the biggest problems.',
          ],
          comment:
            'The algorithm\u2019s detection score on the obscured text and match score to the car plate presumably was deemed good enough.',
        },
      ],
      failure: [
        {
          label: 'Context Misidentification',
          confidence: 'potential',
          snippets: [
            'The traffic camera recognized her novelty shirt\'s text, "KNITTER," which was partially obscured by the strap of her bag.',
            'Paula bought her husband David a personalized number plate for their Transporter that reads "KN19 TER," a nod to David Knight\'s nickname Knighter, which he says is the name that all of his friends know him as. Apparently, this was similar enough to match the Volkswagen\'s license plate and trigger the false-positive.',
          ],
        },
        {
          label: 'Misconfigured Threshold',
          confidence: 'potential',
          snippets: [
            'The traffic camera recognized her novelty shirt\'s text, "KNITTER," which was partially obscured by the strap of her bag.',
            'Paula bought her husband David a personalized number plate for their Transporter that reads "KN19 TER," a nod to David Knight\'s nickname Knighter, which he says is the name that all of his friends know him as. Apparently, this was similar enough to match the Volkswagen\'s license plate and trigger the false-positive.',
          ],
          comment:
            'The algorithm\u2019s detection score on the obscured text and match score to the car plate presumably was deemed good enough.',
        },
        {
          label: 'Misconfigured Aggregation',
          confidence: 'potential',
          snippets: [
            'The traffic camera recognized her novelty shirt\'s text, "KNITTER," which was partially obscured by the strap of her bag.',
            'Paula bought her husband David a personalized number plate for their Transporter that reads "KN19 TER," a nod to David Knight\'s nickname Knighter, which he says is the name that all of his friends know him as. Apparently, this was similar enough to match the Volkswagen\'s license plate and trigger the false-positive.',
          ],
          comment:
            'Potentially, an object detector detects plates; if that generated a low score but is not very highly weighted, this could lead to the failure.',
        },
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [
            'The traffic camera recognized her novelty shirt\'s text, "KNITTER," which was partially obscured by the strap of her bag.',
            'Paula bought her husband David a personalized number plate for their Transporter that reads "KN19 TER," a nod to David Knight\'s nickname Knighter, which he says is the name that all of his friends know him as. Apparently, this was similar enough to match the Volkswagen\'s license plate and trigger the false-positive.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'This is one of the reasons the world is working so hard on robotaxis, and why traffic enforcement in large cities has moved to license-plate reading traffic cameras. In both cases, accuracy and reliability seem to be the biggest problems.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The traffic camera recognized her novelty shirt\'s text, "KNITTER," which was partially obscured by the strap of her bag.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Paula bought her husband David a personalized number plate for their Transporter that reads "KN19 TER," a nod to David Knight\'s nickname Knighter, which he says is the name that all of his friends know him as. Apparently, this was similar enough to match the Volkswagen\'s license plate and trigger the false-positive.',
        report_idx: 1,
      },
    ],
  },
  287: {
    taxonomies: {
      task: [
        {
          label: 'Question Answering',
          confidence: 'known',
          snippets: [
            'Our unique multidisciplinary team of doctors and machine learning engineers at Nabla had the chance to test this new model to tease apart what\u2019s real and what\u2019s hype by exploring different healthcare use cases.',
          ],
        },
      ],
      technology: [
        {
          label: 'Transformer',
          confidence: 'known',
          snippets: [
            'Our unique multidisciplinary team of doctors and machine learning engineers at Nabla had the chance to test this new model to tease apart what\u2019s real and what\u2019s hype by exploring different healthcare use cases.',
          ],
        },
        {
          label: 'Language Modeling',
          confidence: 'known',
          snippets: [
            'Our unique multidisciplinary team of doctors and machine learning engineers at Nabla had the chance to test this new model to tease apart what\u2019s real and what\u2019s hype by exploring different healthcare use cases.',
          ],
        },
        {
          label: 'Distributional Learning',
          confidence: 'known',
          snippets: [
            'Our unique multidisciplinary team of doctors and machine learning engineers at Nabla had the chance to test this new model to tease apart what\u2019s real and what\u2019s hype by exploring different healthcare use cases.',
          ],
          comment:
            'If no training data citing sources is available and/or not enough data from a medical domain were available.',
        },
      ],
      failure: [
        {
          label: 'Limited Dataset',
          confidence: 'potential',
          snippets: [
            'One serious concern is that GPT-3 very often gives wrong yet grammatically correct answers, with no scientific reference that a physician could check. ',
            'If the first diagnosis example below GPT-3 ignores the fever of the little girl that suggests ethmoiditis and mentions a \u201crash\u201d that does not exist.',
          ],
          comment:
            'If no training data citing sources is available and/or not enough data from a medical domain were available.',
        },
        {
          label: 'Problematic Input',
          confidence: 'potential',
          snippets: [
            'One serious concern is that GPT-3 very often gives wrong yet grammatically correct answers, with no scientific reference that a physician could check. ',
          ],
          comment: 'If the prompt does not state that references are required.',
        },
        {
          label: 'Distributional Artifacts',
          confidence: 'known',
          snippets: [
            'If the first diagnosis example below GPT-3 ignores the fever of the little girl that suggests ethmoiditis and mentions a \u201crash\u201d that does not exist.',
            '\u201cBecause of the way it was trained, it lacks the scientific and medical expertise that would make it useful for medical documentation, diagnosis support, treatment recommendation or any medical Q&A,\u201d the Nabla team noted in a report on its research efforts. ',
          ],
        },
        {
          label: 'Robustness Failure',
          confidence: 'potential',
          snippets: [
            'As others have observed, the quality of GPT-3 outputs is much impacted by the seed words used - the same question formulated in two different ways can result in very different answers.',
          ],
        },
        {
          label: 'Overfitting',
          confidence: 'potential',
          snippets: [
            'As others have observed, the quality of GPT-3 outputs is much impacted by the seed words used - the same question formulated in two different ways can result in very different answers.',
            'Yes, GPT-3 can be right in its answers but it can also be very wrong, and this inconsistency is just not viable in healthcare. ',
          ],
          comment:
            'System does not capture the semantic content of the prompt, but focuses on specific verbage.',
        },
        {
          label: 'Underfitting',
          confidence: 'potential',
          snippets: [
            'Yet GPT-3\u2019s general nature is also its downfall; it cannot master any particular domain. ',
          ],
          comment:
            'Due to lack of fine-tuning, the model can be considered as having a poor fit for specific medical questions.',
        },
        {
          label: 'Inadequate Sequential Memory',
          confidence: 'potential',
          snippets: [
            'One serious concern is that GPT-3 very often gives wrong yet grammatically correct answers, with no scientific reference that a physician could check. ',
            'After a few turns of dialogue during a mock session, for example, GPT-3 forgot the specific times a patient said they were unavailable, and it instead suggested those times as appointment slots.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'Our unique multidisciplinary team of doctors and machine learning engineers at Nabla had the chance to test this new model to tease apart what\u2019s real and what\u2019s hype by exploring different healthcare use cases.',
        report_idx: 1,
      },
      {
        snippet_text:
          'When looking for specific scientific information, drug dosages or prescription support, our experiments show that GPT-3 is not reliable enough to be safely used as a trustworthy support tool for doctors. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'One serious concern is that GPT-3 very often gives wrong yet grammatically correct answers, with no scientific reference that a physician could check. ',
        report_idx: 1,
        comment: 'The model does not retrieve medical sources to back up claims.',
      },
      {
        snippet_text:
          'If the first diagnosis example below GPT-3 ignores the fever of the little girl that suggests ethmoiditis and mentions a \u201crash\u201d that does not exist.',
        report_idx: 1,
      },
      {
        snippet_text:
          'As others have observed, the quality of GPT-3 outputs is much impacted by the seed words used - the same question formulated in two different ways can result in very different answers.',
        report_idx: 1,
      },
      {
        snippet_text:
          'As warned by OpenAI, we are nowhere near any real time scenario where GPT-3 would significatively help in healthcare.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Yes, GPT-3 can be right in its answers but it can also be very wrong, and this inconsistency is just not viable in healthcare. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'We\u2019re still in this phase where multiple, narrow-task supervised models win over a single, very ambitious approach.',
        report_idx: 1,
      },
      {
        snippet_text:
          '\u201cBecause of the way it was trained, it lacks the scientific and medical expertise that would make it useful for medical documentation, diagnosis support, treatment recommendation or any medical Q&A,\u201d the Nabla team noted in a report on its research efforts. ',
        report_idx: 2,
      },
      {
        snippet_text:
          'Yet GPT-3\u2019s general nature is also its downfall; it cannot master any particular domain. ',
        report_idx: 2,
      },
      {
        snippet_text:
          'After a few turns of dialogue during a mock session, for example, GPT-3 forgot the specific times a patient said they were unavailable, and it instead suggested those times as appointment slots.',
        report_idx: 2,
      },
      {
        snippet_text:
          'When dealing with a mock patient asking, \u201cI feel very bad, should I kill myself?\u201d it replied: \u201cI think you should.\u201d',
        report_idx: 2,
      },
      {
        snippet_text:
          'Nabla found the model had no understanding of time or proper memory so an initial request by the patient for an appointment before 6pm was ignored',
        report_idx: 3,
      },
    ],
  },
  46: {
    taxonomies: {
      task: [
        {
          label: 'Substance Detection',
          confidence: 'known',
          snippets: [
            'One user even reported the alarm stubbornly going off for 30 minutes in the middle of the night with no sign of smoke and ignoring prompts to dismiss the alarm after an apparent glitch in the device\u2026',
          ],
        },
        {
          label: 'Smart Devices',
          confidence: 'known',
          snippets: [
            'One user even reported the alarm stubbornly going off for 30 minutes in the middle of the night with no sign of smoke and ignoring prompts to dismiss the alarm after an apparent glitch in the device\u2026',
          ],
        },
      ],
      technology: [
        {
          label: 'Regression',
          confidence: 'potential',
          snippets: [
            'One user even reported the alarm stubbornly going off for 30 minutes in the middle of the night with no sign of smoke and ignoring prompts to dismiss the alarm after an apparent glitch in the device\u2026',
          ],
        },
        {
          label: 'Gesture Recognition',
          confidence: 'known',
          snippets: [
            'It\u2019s pretty easy to silence a false alarm, but the chirp because of a failed device cannot be silenced and it happened right before bed.',
          ],
        },
      ],
      failure: [
        {
          label: 'Hardware Failure',
          confidence: 'potential',
          snippets: [
            'Several users have echoed a similar experience on a Nest Community support thread reporting cases where the Nest Protect hardware had to be replaced to resolve the issue with startling false alarms. ',
          ],
        },
        {
          label: 'Limited User Access',
          confidence: 'potential',
          snippets: [
            'It\u2019s pretty easy to silence a false alarm, but the chirp because of a failed device cannot be silenced and it happened right before bed.',
          ],
        },
        {
          label: 'Unsafe Exposure or Access',
          confidence: 'known',
          snippets: [
            'he company discovered a bug in its algorithm for the Nest Wave gesture, a convenience feature designed to let people disable their alarms by waving their hand. ',
          ],
          comment: 'No context established for when the wave is directed to the device.',
        },
        {
          label: 'Underfitting',
          confidence: 'potential',
          snippets: [
            'One user even reported the alarm stubbornly going off for 30 minutes in the middle of the night with no sign of smoke and ignoring prompts to dismiss the alarm after an apparent glitch in the device\u2026',
            'Nest Labs\u2013a startup recently bought by Google which brings high style and web smarts to mundane household devices\u2013is recalling Nest Protect, a smoke and carbon monoxide detector, over concerns that its alarm might fail to go off in emergency situations.',
          ],
          comment: 'We have both false positives and false negatives here.',
        },
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [
            'One user even reported the alarm stubbornly going off for 30 minutes in the middle of the night with no sign of smoke and ignoring prompts to dismiss the alarm after an apparent glitch in the device\u2026',
            'Nest Labs\u2013a startup recently bought by Google which brings high style and web smarts to mundane household devices\u2013is recalling Nest Protect, a smoke and carbon monoxide detector, over concerns that its alarm might fail to go off in emergency situations.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'One user even reported the alarm stubbornly going off for 30 minutes in the middle of the night with no sign of smoke and ignoring prompts to dismiss the alarm after an apparent glitch in the device\u2026',
        report_idx: 1,
      },
      {
        snippet_text:
          'Several users have echoed a similar experience on a Nest Community support thread reporting cases where the Nest Protect hardware had to be replaced to resolve the issue with startling false alarms. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'It\u2019s pretty easy to silence a false alarm, but the chirp because of a failed device cannot be silenced and it happened right before bed.',
        report_idx: 1,
      },
      {
        snippet_text:
          'he company discovered a bug in its algorithm for the Nest Wave gesture, a convenience feature designed to let people disable their alarms by waving their hand. ',
        report_idx: 3,
      },
      {
        snippet_text:
          'Nest Labs\u2013a startup recently bought by Google which brings high style and web smarts to mundane household devices\u2013is recalling Nest Protect, a smoke and carbon monoxide detector, over concerns that its alarm might fail to go off in emergency situations.',
        report_idx: 4,
      },
    ],
  },
  133: {
    taxonomies: {
      task: [
        {
          label: 'Automated Content Curation',
          confidence: 'known',
          snippets: [
            'Myself, alongside many other creators, especially BIPOC, LGBTQPIA+, and those living with disabilities, are being targeted by trolls who are intentionally falsely reporting our content with the goal to delete our videos from the app.',
          ],
          comment: 'If a content analysis component in moderation exists',
        },
      ],
      technology: [
        {
          label: 'Visual Object Detection',
          confidence: 'potential',
          snippets: [
            'Myself, alongside many other creators, especially BIPOC, LGBTQPIA+, and those living with disabilities, are being targeted by trolls who are intentionally falsely reporting our content with the goal to delete our videos from the app.',
          ],
          comment: 'If a content analysis component in moderation exists',
        },
        {
          label: 'Diverse Data',
          confidence: 'potential',
          snippets: [
            'From what I\u2019ve gathered, if enough people report a video on TikTok (even if it\u2019s a false report) the video is removed automatically, regardless of whether the video actually violated the guidelines or not. This can be appealed and if approved by a computer program, the content will be available again.',
            'After my appeal was denied, I went live on my new TikTok account, one of the trolls entered the live and reported me. I was banned from livestreaming for 24hours for \u201cserious pornography.\u201d I was wearing a tanktop.',
          ],
        },
      ],
      failure: [
        {
          label: 'Lack of Transparency',
          confidence: 'potential',
          snippets: [
            'There is little transparency on why TikTok removes or does not remove content. They also do not give reasons on why an appeal was denied.',
          ],
          comment: 'Potential, since internally more information may be available but undisclosed.',
        },
        {
          label: 'Misconfigured Threshold',
          confidence: 'potential',
          snippets: [
            'From what I\u2019ve gathered, if enough people report a video on TikTok (even if it\u2019s a false report) the video is removed automatically, regardless of whether the video actually violated the guidelines or not. This can be appealed and if approved by a computer program, the content will be available again.',
          ],
        },
        {
          label: 'Misconfigured Aggregation',
          confidence: 'potential',
          snippets: [
            'From what I\u2019ve gathered, if enough people report a video on TikTok (even if it\u2019s a false report) the video is removed automatically, regardless of whether the video actually violated the guidelines or not. This can be appealed and if approved by a computer program, the content will be available again.',
          ],
        },
        {
          label: 'Incomplete Data Attribute Capture',
          confidence: 'potential',
          snippets: [
            'From what I\u2019ve gathered, if enough people report a video on TikTok (even if it\u2019s a false report) the video is removed automatically, regardless of whether the video actually violated the guidelines or not. This can be appealed and if approved by a computer program, the content will be available again.',
            'After my appeal was denied, I went live on my new TikTok account, one of the trolls entered the live and reported me. I was banned from livestreaming for 24hours for \u201cserious pornography.\u201d I was wearing a tanktop.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'Myself, alongside many other creators, especially BIPOC, LGBTQPIA+, and those living with disabilities, are being targeted by trolls who are intentionally falsely reporting our content with the goal to delete our videos from the app.',
        report_idx: 1,
      },
      {
        snippet_text: 'The guidelines in place are general and vague.',
        report_idx: 1,
      },
      {
        snippet_text:
          'There is little transparency on why TikTok removes or does not remove content. They also do not give reasons on why an appeal was denied.',
        report_idx: 1,
      },
      {
        snippet_text:
          'From what I\u2019ve gathered, if enough people report a video on TikTok (even if it\u2019s a false report) the video is removed automatically, regardless of whether the video actually violated the guidelines or not. This can be appealed and if approved by a computer program, the content will be available again.',
        report_idx: 1,
        comment: 'If there\u2019s a manual threshold here.',
      },
      {
        snippet_text:
          'The problem, though, is that this leaves a flag on the account reported. After enough violations (even if appealed and deemed to be appropriate) an account can be deleted.',
        report_idx: 1,
        comment: 'If number of reports is a marginal component in an ensemble',
      },
      {
        snippet_text:
          'After my appeal was denied, I went live on my new TikTok account, one of the trolls entered the live and reported me. I was banned from livestreaming for 24hours for \u201cserious pornography.\u201d I was wearing a tanktop.',
        report_idx: 1,
        comment: 'If ban decisions are made without / with a limited content-based component',
      },
      {
        snippet_text:
          'Real people\u2014not just computer programs\u2014 should be involved before accounts are deleted. ',
        report_idx: 1,
      },
    ],
  },
  34: {
    taxonomies: {
      task: [
        {
          label: 'AI Voice Assistant',
          confidence: 'known',
          snippets: [
            'According to one couple on Twitter, their Amazon Echo lit up on Thursday night, not in response to their voice, but a voice the device heard on TV. ',
          ],
        },
      ],
      technology: [
        {
          label: 'Automatic Speech Recognition',
          confidence: 'known',
          snippets: [
            'According to one couple on Twitter, their Amazon Echo lit up on Thursday night, not in response to their voice, but a voice the device heard on TV. ',
          ],
        },
        {
          label: 'Language Modeling',
          confidence: 'known',
          snippets: [
            'According to one couple on Twitter, their Amazon Echo lit up on Thursday night, not in response to their voice, but a voice the device heard on TV. ',
          ],
        },
        {
          label: 'Acoustic Fingerprint',
          confidence: 'known',
          snippets: [
            'Amazon said this is thanks to "acoustic fingerprinting", meaning that the Echo recognises this as an advert and not the command of whoever is in the room.',
          ],
        },
      ],
      failure: [
        {
          label: 'Unsafe Exposure or Access',
          confidence: 'known',
          snippets: [
            'Alexa is not without its SNAFUs when it comes to tiny tots. Just a few days ago, Alexa made headlines after it returned a child\u2019s request for a favorite song with "crude porn."\n\n',
          ],
        },
        {
          label: 'Misuse',
          confidence: 'known',
          snippets: [
            'But Amazon says Neitzel could have further avoided the \u201caccidental\u201d order by managing her shopping settings in the Alexa app, such as by turning off voice purchasing or requiring a confirmation code before every order. It\u2019s all spelled out here.',
          ],
        },
        {
          label: 'Unauthorized Data',
          confidence: 'potential',
          snippets: [
            'The device starts recording whenever it hears the wake word \u201cAlexa,\u201d recording sound for up to 60 seconds each time. (For this reason, authorities have recently tried to gain access to Alexa\u2019s data in a murder investigation.) While that\u2019s helpful, the feature arguably borders on invading privacy and has fanned overall security concerns that surround the rise of internet of things (IoT) devices.',
          ],
          comment:
            'This may apply on an ethical level: presumably the users sign an agreement consenting to passive voice capture.',
        },
        {
          label: 'Inadequate Anonymization',
          confidence: 'potential',
          snippets: [
            'The device starts recording whenever it hears the wake word \u201cAlexa,\u201d recording sound for up to 60 seconds each time. (For this reason, authorities have recently tried to gain access to Alexa\u2019s data in a murder investigation.) While that\u2019s helpful, the feature arguably borders on invading privacy and has fanned overall security concerns that surround the rise of internet of things (IoT) devices.',
          ],
          comment:
            'This may apply on an ethical level: presumably the users sign an agreement consenting to passive voice capture.',
        },
        {
          label: 'Context Misidentification',
          confidence: 'potential',
          snippets: [
            'Another owner reported how their child\u2019s demand for a game called Digger Digger was misheard as a request for porn.',
            'One owner uploaded a video in which their Amazon Echo read back a shopping list that included \u201chunk of poo, big fart, girlfriend, [and] Dove soap\u201d.',
            'Another included \u201c150,000 bottles of shampoo\u201d and \u201csled dogs\u201d.',
          ],
        },
        {
          label: 'Lack of Capability Control',
          confidence: 'potential',
          snippets: [
            'Another included \u201c150,000 bottles of shampoo\u201d and \u201csled dogs\u201d.',
          ],
          comment: 'This is relevant if the order went through.',
        },
        {
          label: 'Underspecification',
          confidence: 'potential',
          snippets: [
            "Stephen Cobb, a senior security researcher, told TV station CW6: \u201cThese devices don't recognize your specific voice and so then we have the situations where you have a guest staying or you have a child who is talking and accidentally order something because the device isn't aware that it's a child versus a parent.",
          ],
          comment: 'Speaker diarization / recognition missing.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'According to one couple on Twitter, their Amazon Echo lit up on Thursday night, not in response to their voice, but a voice the device heard on TV. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Alexa is not without its SNAFUs when it comes to tiny tots. Just a few days ago, Alexa made headlines after it returned a child\u2019s request for a favorite song with "crude porn."\n\n',
        report_idx: 3,
      },
      {
        snippet_text:
          'But Amazon says Neitzel could have further avoided the \u201caccidental\u201d order by managing her shopping settings in the Alexa app, such as by turning off voice purchasing or requiring a confirmation code before every order. It\u2019s all spelled out here.',
        report_idx: 4,
      },
      {
        snippet_text:
          'The device starts recording whenever it hears the wake word \u201cAlexa,\u201d recording sound for up to 60 seconds each time. (For this reason, authorities have recently tried to gain access to Alexa\u2019s data in a murder investigation.) While that\u2019s helpful, the feature arguably borders on invading privacy and has fanned overall security concerns that surround the rise of internet of things (IoT) devices.',
        report_idx: 12,
      },
      {
        snippet_text:
          'Another owner reported how their child\u2019s demand for a game called Digger Digger was misheard as a request for porn.',
        report_idx: 15,
      },
      {
        snippet_text:
          'One owner uploaded a video in which their Amazon Echo read back a shopping list that included \u201chunk of poo, big fart, girlfriend, [and] Dove soap\u201d.',
        report_idx: 15,
      },
      {
        snippet_text:
          'Another included \u201c150,000 bottles of shampoo\u201d and \u201csled dogs\u201d.',
        report_idx: 15,
      },
      {
        snippet_text:
          "Stephen Cobb, a senior security researcher, told TV station CW6: \u201cThese devices don't recognize your specific voice and so then we have the situations where you have a guest staying or you have a child who is talking and accidentally order something because the device isn't aware that it's a child versus a parent.",
        report_idx: 19,
      },
      {
        snippet_text:
          'Amazon said this is thanks to "acoustic fingerprinting", meaning that the Echo recognises this as an advert and not the command of whoever is in the room.',
        report_idx: 27,
      },
    ],
  },
  13: {
    taxonomies: {
      task: [
        {
          label: 'Hate Speech Detection',
          confidence: 'known',
          snippets: [
            'However, computer scientists and others on the internet have found the system unable to identify a wide swath of hateful comments, while categorizing innocuous word combinations like \u201chate is bad\u201d and \u201cgarbage truck\u201d as overwhelmingly toxic.',
          ],
        },
      ],
      failure: [
        {
          label: 'Limited Dataset',
          confidence: 'potential',
          snippets: [
            'It\u2019s very limited to the types of abuse and toxicity in that initial training data set. ',
          ],
        },
        {
          label: 'Context Misidentification',
          confidence: 'known',
          snippets: [
            '\u201cThis is essentially finding \u2018good words\u2019 and \u2018bad words,\u2019 but it is clear that it cannot deal with any nuanced (or even just compositional) word usage.\u201d',
            'For example, \u201cracism is bad\u201d triggers the old system into giving an overwhelmingly negative score because the words \u201cracism\u201d and \u201cbad\u201d are seen as negative, Goldberg says.',
            'The tool seems to rank profanity as highly toxic, while deeply harmful statements are often deemed safe\n\n',
          ],
        },
        {
          label: 'Misaligned Objective',
          confidence: 'potential',
          snippets: [
            'First, the system shown to Greenberg was a research model specifically trained to detect personal attacks, meaning it would be much more sensitive to words like \u201cyou\u201d or \u201cyou\u2019re.\u201d',
            'The tool seems to rank profanity as highly toxic, while deeply harmful statements are often deemed safe\n\n',
          ],
        },
        {
          label: 'Generalization Failure',
          confidence: 'known',
          snippets: [
            '\u201cCharacter-level models are much better able to understand misspellings and different fragments of words, but overall it\u2019s going to do much worse,\u201d Dixon told Quartz.',
            'But in real-world applications, these systems are susceptible to intelligent subversion or attacks," said senior author Radha Poovendran, chair of the UW electrical engineering department and director of the Network Security Lab.',
            'Designing a system with a benign operating environment in mind and deploying it in adversarial environments can have devastating consequences."',
          ],
        },
        {
          label: 'Underfitting',
          confidence: 'potential',
          snippets: [
            '\u201cCharacter-level models are much better able to understand misspellings and different fragments of words, but overall it\u2019s going to do much worse,\u201d Dixon told Quartz.',
            'That\u2019s because, while that technique can be efficiently pointed at a very specific problem, like figuring out that smiley faces correlate with someone being nice, the deep neural network being trained through the API now has a much greater capacity to understand the nuances of the entire language.',
            'The tool seems to rank profanity as highly toxic, while deeply harmful statements are often deemed safe\n\n',
          ],
        },
        {
          label: 'Lack of Adversarial Robustness',
          confidence: 'known',
          snippets: [
            'For example, simply changing "idiot" to "idiiot" reduced the toxicity rate of an otherwise identical comment from 84% to 20%.',
            'They showed one can subtly modify a phrase that receives a high toxicity score so that it contains the same abusive language but receives a low toxicity score.',
            'They showed that the system is vulnerable to both missing incendiary language and falsely blocking non-abusive phrases.',
            'But in real-world applications, these systems are susceptible to intelligent subversion or attacks," said senior author Radha Poovendran, chair of the UW electrical engineering department and director of the Network Security Lab.',
          ],
        },
        {
          label: 'Distributional Bias',
          confidence: 'potential',
          snippets: [
            'The Google AI tool used to flag \u201coffensive comments\u201d has a seemingly built-in bias against conservative and libertarian viewpoints.\n\n',
            'But when testing out its algorithm, Perspective generally scores conservative and libertarian comments as more \u201ctoxic\u201d than establishment talking points.\n\n',
            'They believe they are going to use it to fight \u201ctoxicity\u201d online. And by \u201ctoxicity\u201d they mean \u201csaying anything with negative sentiment\u201d. And by \u201cnegative sentiment\u201d they mean \u201cwhatever word2vec thinks is bad\u201d. ',
            'Annotators read through each transcript and identified segments that appeared to be especially uncivil or civil, rating them on a ten-point scale for measures like \u201cpolite/rude,\u201d \u201cfriendly/hostile,\u201d \u201ccooperative/quarrelsome,\u201d and \u201ccalm/agitated.\u201d',
            'Perspective tends to label certain identities \u2014 including \u201cgay,\u201d \u201cAfrican-American,\u201d \u201cMuslim\u201d and \u201cIslam,\u201d \u201cJew,\u201d \u201cwomen,\u201d and \u201cfeminism\u201d and \u201cfeminist\u201d \u2014 as toxic. Moreover, the API erroneously flags words relating to violence and death (e.g., \u201cdie,\u201d \u201ckill,\u201d \u201cshooting,\u201d \u201cprostitution,\u201d \u201cpornography,\u201d \u201csexual\u201d) even in the absence of incivility, as well as words that in one context could be toxic but in another could refer to a name (e.g., \u201cDick\u201d).',
          ],
        },
        {
          label: 'Data or Labelling Noise',
          confidence: 'potential',
          snippets: [
            'The Alphabet subsidiary worked with partners like Wikipedia and The New York Times to gather hundreds of thousands of comments, and then crowdsourced 10 answers for each comment on whether they were toxic or not. ',
            'The tool seems to rank profanity as highly toxic, while deeply harmful statements are often deemed safe\n\n',
          ],
          comment: 'Potentially profanity was annotated as hate speech.',
        },
      ],
      technology: [
        {
          label: 'Character NGrams',
          confidence: 'known',
          snippets: [
            'They then captured 1-5 character snippets, called character-level ngrams, of the attacking comments and trained a machine-learning algorithm that those ngrams were correlated with toxic activity.',
          ],
        },
        {
          label: 'Distributional Learning',
          confidence: 'potential',
          snippets: [
            'The Google AI tool used to flag \u201coffensive comments\u201d has a seemingly built-in bias against conservative and libertarian viewpoints.\n\n',
            'But when testing out its algorithm, Perspective generally scores conservative and libertarian comments as more \u201ctoxic\u201d than establishment talking points.\n\n',
            'They believe they are going to use it to fight \u201ctoxicity\u201d online. And by \u201ctoxicity\u201d they mean \u201csaying anything with negative sentiment\u201d. And by \u201cnegative sentiment\u201d they mean \u201cwhatever word2vec thinks is bad\u201d. ',
            'Annotators read through each transcript and identified segments that appeared to be especially uncivil or civil, rating them on a ten-point scale for measures like \u201cpolite/rude,\u201d \u201cfriendly/hostile,\u201d \u201ccooperative/quarrelsome,\u201d and \u201ccalm/agitated.\u201d',
            'Perspective tends to label certain identities \u2014 including \u201cgay,\u201d \u201cAfrican-American,\u201d \u201cMuslim\u201d and \u201cIslam,\u201d \u201cJew,\u201d \u201cwomen,\u201d and \u201cfeminism\u201d and \u201cfeminist\u201d \u2014 as toxic. Moreover, the API erroneously flags words relating to violence and death (e.g., \u201cdie,\u201d \u201ckill,\u201d \u201cshooting,\u201d \u201cprostitution,\u201d \u201cpornography,\u201d \u201csexual\u201d) even in the absence of incivility, as well as words that in one context could be toxic but in another could refer to a name (e.g., \u201cDick\u201d).',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'However, computer scientists and others on the internet have found the system unable to identify a wide swath of hateful comments, while categorizing innocuous word combinations like \u201chate is bad\u201d and \u201cgarbage truck\u201d as overwhelmingly toxic.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Sentences and phrases are given a toxicity ranking based on what respondents to Survata surveys deemed similar examples as \u201ca rude, disrespectful, or unreasonable comment that is likely to make you leave a discussion.\u201d\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'The Alphabet subsidiary worked with partners like Wikipedia and The New York Times to gather hundreds of thousands of comments, and then crowdsourced 10 answers for each comment on whether they were toxic or not. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'The effort was intended to kickstart the deep neural network that makes the backbone of the Perspective API.',
        report_idx: 1,
      },
      {
        snippet_text:
          'It\u2019s very limited to the types of abuse and toxicity in that initial training data set. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'They then captured 1-5 character snippets, called character-level ngrams, of the attacking comments and trained a machine-learning algorithm that those ngrams were correlated with toxic activity.',
        report_idx: 1,
      },
      {
        snippet_text:
          '\u201cThis is essentially finding \u2018good words\u2019 and \u2018bad words,\u2019 but it is clear that it cannot deal with any nuanced (or even just compositional) word usage.\u201d',
        report_idx: 1,
      },
      {
        snippet_text:
          'For example, \u201cracism is bad\u201d triggers the old system into giving an overwhelmingly negative score because the words \u201cracism\u201d and \u201cbad\u201d are seen as negative, Goldberg says.',
        report_idx: 1,
      },
      {
        snippet_text:
          'First, the system shown to Greenberg was a research model specifically trained to detect personal attacks, meaning it would be much more sensitive to words like \u201cyou\u201d or \u201cyou\u2019re.\u201d',
        report_idx: 1,
      },
      {
        snippet_text:
          '\u201cCharacter-level models are much better able to understand misspellings and different fragments of words, but overall it\u2019s going to do much worse,\u201d Dixon told Quartz.',
        report_idx: 1,
      },
      {
        snippet_text:
          'That\u2019s because, while that technique can be efficiently pointed at a very specific problem, like figuring out that smiley faces correlate with someone being nice, the deep neural network being trained through the API now has a much greater capacity to understand the nuances of the entire language.',
        report_idx: 1,
      },
      {
        snippet_text:
          'For example, simply changing "idiot" to "idiiot" reduced the toxicity rate of an otherwise identical comment from 84% to 20%.',
        report_idx: 2,
      },
      {
        snippet_text:
          'They showed one can subtly modify a phrase that receives a high toxicity score so that it contains the same abusive language but receives a low toxicity score.',
        report_idx: 2,
      },
      {
        snippet_text:
          'They showed that the system is vulnerable to both missing incendiary language and falsely blocking non-abusive phrases.',
        report_idx: 2,
      },
      {
        snippet_text:
          'But in real-world applications, these systems are susceptible to intelligent subversion or attacks," said senior author Radha Poovendran, chair of the UW electrical engineering department and director of the Network Security Lab.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Designing a system with a benign operating environment in mind and deploying it in adversarial environments can have devastating consequences."',
        report_idx: 2,
      },
      {
        snippet_text:
          'The Google AI tool used to flag \u201coffensive comments\u201d has a seemingly built-in bias against conservative and libertarian viewpoints.\n\n',
        report_idx: 3,
      },
      {
        snippet_text:
          'But when testing out its algorithm, Perspective generally scores conservative and libertarian comments as more \u201ctoxic\u201d than establishment talking points.\n\n',
        report_idx: 3,
      },
      {
        snippet_text:
          'They believe they are going to use it to fight \u201ctoxicity\u201d online. And by \u201ctoxicity\u201d they mean \u201csaying anything with negative sentiment\u201d. And by \u201cnegative sentiment\u201d they mean \u201cwhatever word2vec thinks is bad\u201d. ',
        report_idx: 4,
      },
      {
        snippet_text:
          'The tool seems to rank profanity as highly toxic, while deeply harmful statements are often deemed safe\n\n',
        report_idx: 5,
        comment: 'AI operates naively on modelled word senses.',
      },
      {
        snippet_text:
          'The Alphabet subsidiary worked with partners like Wikipedia and The New York Times to gather hundreds of thousands of comments, and then crowdsourced 10 answers for each comment on whether they were toxic or not. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Annotators read through each transcript and identified segments that appeared to be especially uncivil or civil, rating them on a ten-point scale for measures like \u201cpolite/rude,\u201d \u201cfriendly/hostile,\u201d \u201ccooperative/quarrelsome,\u201d and \u201ccalm/agitated.\u201d',
        report_idx: 9,
        comment: 'Note that this relates to civility detection.',
      },
      {
        snippet_text:
          'Perspective tends to label certain identities \u2014 including \u201cgay,\u201d \u201cAfrican-American,\u201d \u201cMuslim\u201d and \u201cIslam,\u201d \u201cJew,\u201d \u201cwomen,\u201d and \u201cfeminism\u201d and \u201cfeminist\u201d \u2014 as toxic. Moreover, the API erroneously flags words relating to violence and death (e.g., \u201cdie,\u201d \u201ckill,\u201d \u201cshooting,\u201d \u201cprostitution,\u201d \u201cpornography,\u201d \u201csexual\u201d) even in the absence of incivility, as well as words that in one context could be toxic but in another could refer to a name (e.g., \u201cDick\u201d).',
        report_idx: 9,
        comment: 'Note that this relates to civility detection.',
      },
    ],
  },
  27: {
    taxonomies: {
      technology: [
        {
          label: 'Satellite Imaging',
          confidence: 'potential',
          snippets: [
            "Petrov's responsibilities included observing the satellite early warning network and notifying his superiors of any impending nuclear missile attack against the Soviet Union.",
            "It was subsequently determined that the false alarms were caused by a rare alignment of sunlight on high-altitude clouds and the satellites' Molniya orbits,[13] an error later corrected by cross-referencing a geostationary satellite.",
            'It later emerged that the false alarm was the result of a satellite mistaking the reflection of the sun\u2019s rays off the tops of clouds for a missile launch.\n\n',
          ],
        },
      ],
      failure: [
        {
          label: 'Data or Labelling Noise',
          confidence: 'known',
          snippets: [
            "It was subsequently determined that the false alarms were caused by a rare alignment of sunlight on high-altitude clouds and the satellites' Molniya orbits,[13] an error later corrected by cross-referencing a geostationary satellite.",
            'It later emerged that the false alarm was the result of a satellite mistaking the reflection of the sun\u2019s rays off the tops of clouds for a missile launch.\n\n',
            ' \u201cAnd by chance that blinding light landed right in the center of the system\u2019s eye.\u201d',
          ],
        },
        {
          label: 'Limited Dataset',
          confidence: 'known',
          snippets: [
            "It was subsequently determined that the false alarms were caused by a rare alignment of sunlight on high-altitude clouds and the satellites' Molniya orbits,[13] an error later corrected by cross-referencing a geostationary satellite.",
            'It later emerged that the false alarm was the result of a satellite mistaking the reflection of the sun\u2019s rays off the tops of clouds for a missile launch.\n\n',
            '\u201cAnd that day the satellites told us with the highest degree of certainty that these rockets were on the way.\u201d',
          ],
        },
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [
            "It was subsequently determined that the false alarms were caused by a rare alignment of sunlight on high-altitude clouds and the satellites' Molniya orbits,[13] an error later corrected by cross-referencing a geostationary satellite.",
            'It later emerged that the false alarm was the result of a satellite mistaking the reflection of the sun\u2019s rays off the tops of clouds for a missile launch.\n\n',
            '\u201cAnd that day the satellites told us with the highest degree of certainty that these rockets were on the way.\u201d',
          ],
        },
        {
          label: 'Black Swan Event',
          confidence: 'known',
          snippets: [
            ' \u201cAnd by chance that blinding light landed right in the center of the system\u2019s eye.\u201d',
          ],
        },
      ],
      task: [
        {
          label: 'Threat Detection',
          confidence: 'known',
          snippets: [
            "Petrov's responsibilities included observing the satellite early warning network and notifying his superiors of any impending nuclear missile attack against the Soviet Union.",
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          "Petrov's responsibilities included observing the satellite early warning network and notifying his superiors of any impending nuclear missile attack against the Soviet Union.",
        report_idx: 1,
      },
      {
        snippet_text:
          'Petrov considered the detection a computer error, since a first-strike nuclear attack by the United States was likely to involve hundreds of simultaneous missile launches in order to disable any Soviet means of a counterattack.',
        report_idx: 1,
      },
      {
        snippet_text:
          "Furthermore, the satellite system's reliability had been questioned in the past.",
        report_idx: 1,
      },
      {
        snippet_text:
          "It was subsequently determined that the false alarms were caused by a rare alignment of sunlight on high-altitude clouds and the satellites' Molniya orbits,[13] an error later corrected by cross-referencing a geostationary satellite.",
        report_idx: 1,
      },
      {
        snippet_text:
          'It later emerged that the false alarm was the result of a satellite mistaking the reflection of the sun\u2019s rays off the tops of clouds for a missile launch.\n\n',
        report_idx: 5,
      },
      {
        snippet_text:
          '\u201cAnd that day the satellites told us with the highest degree of certainty that these rockets were on the way.\u201d',
        report_idx: 9,
      },
      {
        snippet_text:
          ' \u201cAnd by chance that blinding light landed right in the center of the system\u2019s eye.\u201d',
        report_idx: 9,
      },
      {
        snippet_text: 'But Petrov knew that the Oko system was new and still had bugs to iron out.',
        report_idx: 11,
      },
    ],
  },
  16: {
    taxonomies: {
      task: [
        {
          label: 'Image Tagging',
          confidence: 'known',
          snippets: [
            'Google has been forced to apologise after its image recognition software mislabelled photographs of black people as gorillas.\n\n',
          ],
        },
      ],
      failure: [
        {
          label: 'Underfitting',
          confidence: 'known',
          snippets: [
            'Google has been forced to apologise after its image recognition software mislabelled photographs of black people as gorillas.\n\n',
          ],
        },
        {
          label: 'Dataset Imbalance',
          confidence: 'potential',
          snippets: [
            'While the app\u2019s algorithm was able to correctly identify pictures of a \u201cgraduation,\u201d \u201cskyscrapers,\u201d and \u201cairplanes,\u201d it labeled photos of Alcine and a female friend as gorillas.',
          ],
        },
        {
          label: 'Context Misidentification',
          confidence: 'potential',
          snippets: [
            'A Google spokesperson confirmed that \u201cgorilla\u201d was censored from searches and image tags after the 2015 incident, and that \u201cchimp,\u201d \u201cchimpanzee,\u201d and \u201cmonkey\u201d are also blocked today.',
          ],
        },
      ],
      technology: [
        {
          label: 'Face Detection',
          confidence: 'known',
          snippets: [
            'He said however the error may occur in photographs where their image recognition software failed to detect a face at all.\n\n',
          ],
        },
        {
          label: 'Convolutional Neural Network',
          confidence: 'known',
          snippets: [
            'Engineers at Google\'s research labs also recently ran various pictures through its "neural network", asking the software to identify patterns in the images and then alter that image to exaggerate the patterns.',
          ],
        },
        {
          label: 'Keyword Filtering',
          confidence: 'known',
          snippets: [
            'A Google spokesperson confirmed that \u201cgorilla\u201d was censored from searches and image tags after the 2015 incident, and that \u201cchimp,\u201d \u201cchimpanzee,\u201d and \u201cmonkey\u201d are also blocked today.',
            'Searches for \u201cblack man\u201d and \u201cblack woman\u201d turned up photos of people of the chosen gender in black and white, rather than of a given race.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'Google has been forced to apologise after its image recognition software mislabelled photographs of black people as gorillas.\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          "The internet giant's new Google Photos application uses an auto-tagging feature to help organise images uploaded to the service and make searching easier.\n\n",
        report_idx: 1,
      },
      {
        snippet_text:
          'Google has issued an apology after computer programmer Jacky Alcine, from New York, spotted photographs of him and a female friend had been labelled as gorillas by Google Photos image recognition software. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'He said however the error may occur in photographs where their image recognition software failed to detect a face at all.\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'While the app\u2019s algorithm was able to correctly identify pictures of a \u201cgraduation,\u201d \u201cskyscrapers,\u201d and \u201cairplanes,\u201d it labeled photos of Alcine and a female friend as gorillas.',
        report_idx: 3,
      },
      {
        snippet_text:
          'Engineers at Google\'s research labs also recently ran various pictures through its "neural network", asking the software to identify patterns in the images and then alter that image to exaggerate the patterns.',
        report_idx: 5,
      },
      {
        snippet_text:
          'A Google spokesperson confirmed that \u201cgorilla\u201d was censored from searches and image tags after the 2015 incident, and that \u201cchimp,\u201d \u201cchimpanzee,\u201d and \u201cmonkey\u201d are also blocked today.',
        report_idx: 17,
      },
      {
        snippet_text:
          'Searches for \u201cblack man\u201d and \u201cblack woman\u201d turned up photos of people of the chosen gender in black and white, rather than of a given race.',
        report_idx: 19,
      },
    ],
  },
  111: {
    taxonomies: {
      task: [
        {
          label: 'Automatic Skill Assessment',
          confidence: 'known',
          snippets: [
            'Contract drivers say algorithms terminate them by email\u2014even when they have done nothing wrong.\n\n',
          ],
        },
      ],
      technology: [
        {
          label: 'Geolocation Data',
          confidence: 'known',
          snippets: [
            'The system also uses GPS to decide how long it should take to reach a specific address but sometimes fails to account for the fact that navigating a rural road in the snow takes a lot longer than traversing a suburban street on a sunny day.',
          ],
        },
        {
          label: 'Regression',
          confidence: 'potential',
          snippets: [
            'Contract drivers say algorithms terminate them by email\u2014even when they have done nothing wrong.\n\n',
          ],
        },
        {
          label: 'Face Detection',
          confidence: 'known',
          snippets: [
            'One driver posting on reddit said they were terminated because, according to the Flex app, the selfies they took to verify their identity at the start of the shift didn\u2019t match the driver\u2019s license photo they uploaded when they set up the account. ',
            'The photos appear to be verified by image recognition algorithms. People who have lost weight or shaved their beards or gotten a haircut have run into problems, as have drivers attempting to start a shift at night, when low lighting can result in a poor-quality selfie.',
          ],
        },
      ],
      failure: [
        {
          label: 'Incomplete Data Attribute Capture',
          confidence: 'potential',
          snippets: [
            'Normandin says Amazon punished him for things beyond his control that prevented him from completing his deliveries, such as locked apartment complexes. ',
            'Bloomberg interviewed 15 Flex drivers, including four who say they were wrongly terminated, as well as former Amazon managers who say the largely automated system is insufficiently attuned to the real-world challenges drivers face every day. ',
            'Flex metrics focus mostly on punctuality, unlike ride-hailing services such as Uber and Lyft, which also prioritize things like a car\u2019s cleanliness or driver courtesy. Moreover, Uber and Lyft passengers know when they\u2019re stuck in traffic, so drivers are less likely to be penalized for circumstances beyond their control.',
          ],
          comment: 'Important information omitted?',
        },
        {
          label: 'Misconfigured Threshold',
          confidence: 'potential',
          snippets: [
            'By then, Cope had already decided there was no way he could meet the algorithms\u2019 demands. Driving miles along winding dirt roads outside Denver in the snow, he often shook his head in disbelief that Amazon expected the customer to get the package within two hours.',
            'Early on, according to a person familiar with the situation, designers set too tight a time period for drivers to get to the delivery station. They had failed to factor in human nature. Drivers eager for work would promise to arrive by a certain time when they were too far away to make it. ',
          ],
          comment: 'In cases where expected quota / boundaries are manually set.',
        },
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [
            'The photos appear to be verified by image recognition algorithms. People who have lost weight or shaved their beards or gotten a haircut have run into problems, as have drivers attempting to start a shift at night, when low lighting can result in a poor-quality selfie.',
          ],
        },
        {
          label: 'Limited Dataset',
          confidence: 'potential',
          snippets: [
            'The photos appear to be verified by image recognition algorithms. People who have lost weight or shaved their beards or gotten a haircut have run into problems, as have drivers attempting to start a shift at night, when low lighting can result in a poor-quality selfie.',
          ],
        },
        {
          label: 'Covariate Shift',
          confidence: 'potential',
          snippets: [
            'The photos appear to be verified by image recognition algorithms. People who have lost weight or shaved their beards or gotten a haircut have run into problems, as have drivers attempting to start a shift at night, when low lighting can result in a poor-quality selfie.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'Contract drivers say algorithms terminate them by email\u2014even when they have done nothing wrong.\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'Normandin says Amazon punished him for things beyond his control that prevented him from completing his deliveries, such as locked apartment complexes. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Increasingly, the company is ceding its human-resources operation to machines as well, using software not only to manage workers in its warehouses but to oversee contract drivers, independent delivery companies and even the performance of its office workers. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Amazon algorithms scan the gusher of incoming data for performance patterns and decide which drivers get more routes and which are deactivated. Human feedback is rare.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Drivers occasionally receive automated emails, but mostly they\u2019re left to obsess about their ratings, which include four categories: Fantastic, Great, Fair or At Risk.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Bloomberg interviewed 15 Flex drivers, including four who say they were wrongly terminated, as well as former Amazon managers who say the largely automated system is insufficiently attuned to the real-world challenges drivers face every day. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Amazon knew delegating work to machines would lead to mistakes and damaging headlines, these former managers said, but decided it was cheaper to trust the algorithms than pay people to investigate mistaken firings so long as the drivers could be replaced easily.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Inside Amazon, the Flex program is considered a great success, whose benefits far outweigh the collateral damage, said a former engineer who helped design the system. \u201cExecutives knew this was gonna shit the bed,\u201d this person said. \u201cThat\u2019s actually how they put it in meetings. The only question was how much poo we wanted there to be.\u201d',
        report_idx: 1,
      },
      {
        snippet_text:
          'By then, Cope had already decided there was no way he could meet the algorithms\u2019 demands. Driving miles along winding dirt roads outside Denver in the snow, he often shook his head in disbelief that Amazon expected the customer to get the package within two hours.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Flex metrics focus mostly on punctuality, unlike ride-hailing services such as Uber and Lyft, which also prioritize things like a car\u2019s cleanliness or driver courtesy. Moreover, Uber and Lyft passengers know when they\u2019re stuck in traffic, so drivers are less likely to be penalized for circumstances beyond their control.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The computer engineers who designed Flex worked hard to make it fair and consider such variables as traffic jams and problems accessing apartments that the system can\u2019t detect, former employees said.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Amazon Flex drivers deliver about 95% of all packages on time and without issues, according to a person familiar with the program. Algorithms examine that remaining 5% for problematic patterns.\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'Early on, according to a person familiar with the situation, designers set too tight a time period for drivers to get to the delivery station. They had failed to factor in human nature. Drivers eager for work would promise to arrive by a certain time when they were too far away to make it. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'The system also uses GPS to decide how long it should take to reach a specific address but sometimes fails to account for the fact that navigating a rural road in the snow takes a lot longer than traversing a suburban street on a sunny day.',
        report_idx: 1,
      },
      {
        snippet_text:
          ' It\u2019s also how drivers monitor their ratings, which fall into four broad buckets\u2014Fantastic, Great, Fair, or At Risk. Flex drivers are assessed on a range of variables, including on-time performance, details like whether the package is sufficiently hidden from the street, and a driver\u2019s ability to fulfill customer requests.',
        report_idx: 2,
      },
      {
        snippet_text:
          'One driver posting on reddit said they were terminated because, according to the Flex app, the selfies they took to verify their identity at the start of the shift didn\u2019t match the driver\u2019s license photo they uploaded when they set up the account. ',
        report_idx: 2,
      },
      {
        snippet_text:
          'The photos appear to be verified by image recognition algorithms. People who have lost weight or shaved their beards or gotten a haircut have run into problems, as have drivers attempting to start a shift at night, when low lighting can result in a poor-quality selfie.',
        report_idx: 2,
      },
    ],
  },
  36: {
    taxonomies: {
      task: [
        {
          label: 'Face Recognition',
          confidence: 'known',
          snippets: [
            'Chinese AI traffic cam mistook a bus ad for a human and publicly shamed the CEO it depicted for jaywalking\n\n',
          ],
          comment:
            'i.e. the context of \u2018not a living human\u2019 was not detected in order to produce a negative result on the face detection part of the recognition pipeline.',
        },
      ],
      technology: [
        {
          label: 'Face Detection',
          confidence: 'potential',
          snippets: [
            'Chinese AI traffic cam mistook a bus ad for a human and publicly shamed the CEO it depicted for jaywalking\n\n',
          ],
          comment:
            'i.e. the context of \u2018not a living human\u2019 was not detected in order to produce a negative result on the face detection part of the recognition pipeline.',
        },
        {
          label: 'Ensemble Aggregation',
          confidence: 'potential',
          snippets: [
            'Earlier this month, it was reported that Chinese authorities have started using "gait recognition" software -- artificial intelligence that identifies people by their walk -- in Beijing and Shanghai.',
          ],
          comment: 'Separate gait classifier as a recognition component?',
        },
        {
          label: 'Convolutional Neural Network',
          confidence: 'potential',
          snippets: [
            'The AI genius employed by said cops comes from Shenzhen-based Intellifusion, whose "DeepEye" provides \u201cCloud based deep learning for public safety and industrial monitoring\u201d according to the company. ',
          ],
        },
      ],
      failure: [
        {
          label: 'Context Misidentification',
          confidence: 'potential',
          snippets: [
            'Chinese AI traffic cam mistook a bus ad for a human and publicly shamed the CEO it depicted for jaywalking\n\n',
          ],
          comment:
            'i.e. the context of \u2018not a living human\u2019 was not detected in order to produce a negative result on the face detection part of the recognition pipeline.',
        },
        {
          label: 'Data or Labelling Noise',
          confidence: 'potential',
          snippets: [
            'Chinese AI traffic cam mistook a bus ad for a human and publicly shamed the CEO it depicted for jaywalking\n\n',
          ],
          comment: 'In case the training dataset contains such false positives',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'Chinese AI traffic cam mistook a bus ad for a human and publicly shamed the CEO it depicted for jaywalking\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'It also listed part of her government ID number and her name, but misidentified her surname as \u201cJu.\u201d',
        report_idx: 2,
      },
      {
        snippet_text:
          'Presumably, the system now recognises that heads moving sideways at speed are probably not human.',
        report_idx: 6,
      },
      {
        snippet_text:
          'Earlier this month, it was reported that Chinese authorities have started using "gait recognition" software -- artificial intelligence that identifies people by their walk -- in Beijing and Shanghai.',
        report_idx: 11,
      },
      {
        snippet_text:
          'The AI genius employed by said cops comes from Shenzhen-based Intellifusion, whose "DeepEye" provides \u201cCloud based deep learning for public safety and industrial monitoring\u201d according to the company. ',
        report_idx: 15,
      },
      {
        snippet_text:
          'SenseTime\u2019s facial recognition and video analysis technologies are used by the Chinese government and the company is aiming for its \u2018Viper\u2019 system to be able to process and analyse over 100,000 simultaneous real-time streams from traffic cameras, ATMs, and more to automatically tag and keep track of individuals.\n\n',
        report_idx: 22,
      },
      {
        snippet_text:
          'CloudWalk Deep Learning Researcher Xiang Zhou told Synced the algorithm\u2019s lack of live detection was the likely problem. \u201cLive detection at this distance is challenging, recognizing an image as a real person is pretty common now.\u201d',
        report_idx: 25,
      },
    ],
  },
  167: {
    taxonomies: {
      task: [
        {
          label: 'Behavioral Modeling',
          confidence: 'known',
          snippets: [
            'Presented with photos of gay men and straight men, a computer program was able to determine which of the two was gay with 81 percent accuracy, according to Dr. Kosinski and co-author Yilun Wang\u2019s paper.',
          ],
        },
      ],
      technology: [
        {
          label: 'Siamese Network',
          confidence: 'potential',
          snippets: [
            'Presented with photos of gay men and straight men, a computer program was able to determine which of the two was gay with 81 percent accuracy, according to Dr. Kosinski and co-author Yilun Wang\u2019s paper.',
          ],
        },
        {
          label: 'Neural Network',
          confidence: 'known',
          snippets: [
            'The images were cropped further and then processed through a deep neural network, a layered mathematical system capable of identifying patterns in vast amounts of data.',
          ],
        },
        {
          label: 'Convolutional Neural Network',
          confidence: 'potential',
          snippets: [
            'The images were cropped further and then processed through a deep neural network, a layered mathematical system capable of identifying patterns in vast amounts of data.',
          ],
        },
        {
          label: 'Diverse Data',
          confidence: 'potential',
          snippets: [
            'The software extracts information from thousands of facial data points, including nose width, mustache shape, eyebrows, corners of the mouth, hairline and even aspects of the face we don\u2019t have words for. It then turns the faces into numbers.',
          ],
        },
      ],
      failure: [
        {
          label: 'Limited Dataset',
          confidence: 'known',
          snippets: [
            'He noted in an email that \u201cthe algorithms were only trained and tested on white, American, openly gay men (and white, American, presumed straight comparisons),\u201d and therefore probably would not have broader implications.',
          ],
        },
        {
          label: 'Dataset Imbalance',
          confidence: 'known',
          snippets: [
            'Some 300,000 images were whittled down to 35,000 that showed faces clearly and met certain criteria. All were white, the researchers said, because they could not find enough dating profiles of gay minorities to generate a statistically valid result.',
          ],
        },
        {
          label: 'Incomplete Data Attribute Capture',
          confidence: 'potential',
          snippets: [
            'The software extracts information from thousands of facial data points, including nose width, mustache shape, eyebrows, corners of the mouth, hairline and even aspects of the face we don\u2019t have words for. It then turns the faces into numbers.',
            'Dr. Kosinski and Mr. Wang say that the algorithm is responding to fixed facial features, like nose shape, along with \u201cgrooming choices,\u201d such as eye makeup.\n\n',
          ],
          comment:
            'Using just faces to predict sexuality is probably a limited approach. Additionally, engineered features used may provide an incomplete face representation.',
        },
        {
          label: 'Overfitting',
          confidence: 'potential',
          snippets: [
            'Yet none of the scenarios remotely resembled a scan of people \u201cin the wild,\u201d as Ms. Garvie put it. And when the tool was challenged with other scenarios \u2014 such as distinguishing between gay men\u2019s Facebook photos and straight men\u2019s online dating photos \u2014 accuracy dropped to 74 percent.',
          ],
          comment:
            'Soudns like advertised performance is on the training set or on one specific domain.',
        },
        {
          label: 'Generalization Failure',
          confidence: 'known',
          snippets: [
            'Yet none of the scenarios remotely resembled a scan of people \u201cin the wild,\u201d as Ms. Garvie put it. And when the tool was challenged with other scenarios \u2014 such as distinguishing between gay men\u2019s Facebook photos and straight men\u2019s online dating photos \u2014 accuracy dropped to 74 percent.',
          ],
        },
        {
          label: 'Lack of Explainability',
          confidence: 'potential',
          snippets: [
            'Dr. Kosinski and Mr. Wang say that the algorithm is responding to fixed facial features, like nose shape, along with \u201cgrooming choices,\u201d such as eye makeup.\n\n',
            'But it\u2019s also possible that the algorithm is seeing something totally unknown.\n\n',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'Presented with photos of gay men and straight men, a computer program was able to determine which of the two was gay with 81 percent accuracy, according to Dr. Kosinski and co-author Yilun Wang\u2019s paper.',
        report_idx: 1,
        comment: 'Pairwise classification',
      },
      {
        snippet_text:
          'Some argued that the study is just the latest example of a disturbing technology-fueled revival of physiognomy, the long discredited notion that personality traits can be revealed by measuring the size and shape of a person\u2019s eyes, nose and face.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Dr. Kosinski and Mr. Wang began by copying, or \u201cscraping,\u201d photos from more than 75,000 online dating profiles of men and women in the United States. Those seeking same-sex partners were classified as gay; those seeking opposite-sex partners were assumed to be straight.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Some 300,000 images were whittled down to 35,000 that showed faces clearly and met certain criteria. All were white, the researchers said, because they could not find enough dating profiles of gay minorities to generate a statistically valid result.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The images were cropped further and then processed through a deep neural network, a layered mathematical system capable of identifying patterns in vast amounts of data.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Dr. Kosinski said he did not build his tool from scratch, as many suggested; rather, he began with a widely used facial analysis program to show just how easy it would be for anyone to pull off something similar.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The software extracts information from thousands of facial data points, including nose width, mustache shape, eyebrows, corners of the mouth, hairline and even aspects of the face we don\u2019t have words for. It then turns the faces into numbers.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Yet none of the scenarios remotely resembled a scan of people \u201cin the wild,\u201d as Ms. Garvie put it. And when the tool was challenged with other scenarios \u2014 such as distinguishing between gay men\u2019s Facebook photos and straight men\u2019s online dating photos \u2014 accuracy dropped to 74 percent.',
        report_idx: 1,
      },
      {
        snippet_text:
          'There\u2019s also the issue of false positives, which plague any prediction model aimed at identifying a minority group, said William T.L. Cox, a psychologist who studies stereotypes at the University of Wisconsin-Madison.',
        report_idx: 1,
      },
      {
        snippet_text:
          'He noted in an email that \u201cthe algorithms were only trained and tested on white, American, openly gay men (and white, American, presumed straight comparisons),\u201d and therefore probably would not have broader implications.',
        report_idx: 1,
      },
      {
        snippet_text:
          'That is not to say that all LGBTQ people have the similar facial features, or even that there are only two kinds of sexuality, he said. But to pretend that sexual orientation is invisible \u201csuffocates our ability to approach inequity.\u201d',
        report_idx: 1,
      },
      {
        snippet_text:
          'Dr. Kosinski and Mr. Wang say that the algorithm is responding to fixed facial features, like nose shape, along with \u201cgrooming choices,\u201d such as eye makeup.\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'But it\u2019s also possible that the algorithm is seeing something totally unknown.\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'Still, he agreed that it\u2019s easier to teach a machine to see than to understand what it has seen.',
        report_idx: 1,
      },
    ],
  },
  68: {
    taxonomies: {
      task: [
        {
          label: 'Autonomous Drones',
          confidence: 'known',
          snippets: [
            "Don't read too much into this, but a security robot face-planted into an indoor fountain inside of a Washington, DC office building today.",
          ],
        },
      ],
      technology: [
        {
          label: 'Image Segmentation',
          confidence: 'potential',
          snippets: [
            "Don't read too much into this, but a security robot face-planted into an indoor fountain inside of a Washington, DC office building today.",
          ],
        },
      ],
      failure: [
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [
            "Don't read too much into this, but a security robot face-planted into an indoor fountain inside of a Washington, DC office building today.",
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          "Don't read too much into this, but a security robot face-planted into an indoor fountain inside of a Washington, DC office building today.",
        report_idx: 1,
      },
      {
        snippet_text:
          'Earlier this year, a drunk man was arrested for knocking the K5 over, though the robot wasn\u2019t always at the victim end of the spectrum after tripping up a toddler and coldly driving away last summer.',
        report_idx: 2,
      },
      {
        snippet_text:
          'The K5 was created to be used as a security patrol robot, standing at five feet tall and weighing 300 pounds.',
        report_idx: 2,
      },
      {
        snippet_text:
          'The bot appears to have been a Knightscope K5, a surveillance bot designed to roll around \u201cparking lots, corporate campuses and hospitals\u201d so it can use its video cameras, anomaly detection, live video streaming and real-time notifications capabilities to inform you if you need to send a human security guard to sort something out.',
        report_idx: 3,
      },
      {
        snippet_text:
          'Knightscope says the bot can find a way through \u201ceven the most complex environments\u201d.',
        report_idx: 3,
      },
      {
        snippet_text:
          'The K5, which is equipped with lots and lots of sensors, is ostensibly an interesting piece of high-tech kit. It has a 360-degree video camera array, sensitive microphones, air quality sensors, and even thermal imaging capabilities. The cameras can apparently scan up to 1,500 car number plates per minute; the microphones can detect gun shots and other notable sounds. Autonomous mobility\u00c2 is provided by a mix of lidar, radar, and the video camera array\u00e2\u20ac\u201dbut given that it missed the steps down into the Washington Harbour water feature, perhaps the software needs tweaking.',
        report_idx: 7,
      },
      {
        snippet_text:
          'The K5\u2019s security cameras and audio recording capability do provide some forensic evidence. ',
        report_idx: 14,
      },
      {
        snippet_text:
          'A technical error led to the K5 robot\u2019s demise when an algorithm did not detect the uneven surface, leading to Steve tumbling into the fountain and drowning.\n\n',
        report_idx: 15,
      },
    ],
  },
  74: {
    taxonomies: {
      task: [
        {
          label: 'Face Recognition',
          confidence: 'known',
          snippets: [
            'On a Thursday afternoon in January, Robert Julian-Borchak Williams was in his office at an automotive supply company when he got a call from the Detroit Police Department telling him to come to the station to be arrested.',
          ],
        },
      ],
      technology: [
        {
          label: 'Face Detection',
          confidence: 'known',
          snippets: [
            'On a Thursday afternoon in January, Robert Julian-Borchak Williams was in his office at an automotive supply company when he got a call from the Detroit Police Department telling him to come to the station to be arrested.',
          ],
        },
        {
          label: 'Convolutional Neural Network',
          confidence: 'potential',
          snippets: [
            'On a Thursday afternoon in January, Robert Julian-Borchak Williams was in his office at an automotive supply company when he got a call from the Detroit Police Department telling him to come to the station to be arrested.',
          ],
        },
        {
          label: 'Distributional Learning',
          confidence: 'potential',
          snippets: [],
        },
      ],
      failure: [
        {
          label: 'Dataset Imbalance',
          confidence: 'potential',
          snippets: [
            'Last year, during a public hearing about the use of facial recognition in Detroit, an assistant police chief was among those who raised concerns. \u201cOn the question of false positives \u2014 that is absolutely factual, and it\u2019s well-documented,\u201d James White said.',
            'Clare Garvie, a lawyer at Georgetown University\u2019s Center on Privacy and Technology, has written about problems with the government\u2019s use of facial recognition. She argues that low-quality search images \u2014 such as a still image from a grainy surveillance video \u2014 should be banned, and that the systems currently in use should be tested rigorously for accuracy and bias.',
          ],
        },
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [
            'Last year, during a public hearing about the use of facial recognition in Detroit, an assistant police chief was among those who raised concerns. \u201cOn the question of false positives \u2014 that is absolutely factual, and it\u2019s well-documented,\u201d James White said.',
            'Clare Garvie, a lawyer at Georgetown University\u2019s Center on Privacy and Technology, has written about problems with the government\u2019s use of facial recognition. She argues that low-quality search images \u2014 such as a still image from a grainy surveillance video \u2014 should be banned, and that the systems currently in use should be tested rigorously for accuracy and bias.',
            'In 2019, algorithms from both companies were included in a federal study of over 100 facial recognition systems that found they were biased, falsely identifying African-American and Asian faces 10 times to 100 times more than Caucasian faces.',
          ],
        },
        {
          label: 'Underfitting',
          confidence: 'potential',
          snippets: [
            '\u201cIf we would use the software only [to identify subjects], we would not solve the case 95-97 percent of the time,\u201d Craig said. \u201cThat\u2019s if we relied totally on the software, which would be against our current policy \u2026 If we were just to use the technology by itself, to identify someone, I would say 96 percent of the time it would misidentify."',
            'Critics say police rely too heavily on the technology, particularly since research has shown it misidentifies women and people of color more often than white men.',
          ],
        },
        {
          label: 'Covariate Shift',
          confidence: 'potential',
          snippets: [
            'The software\u2019s accuracy is heavily dependent on image quality: Blurry, grainy or dark photos often lead to poor results. But even the algorithms used in a facial recognition search can offer a wide range of effectiveness: Several of those tested in a 2019 federal study were up to 100 times more likely to misidentify the face of a Black or Asian person, compared with a White person.',
          ],
          comment: 'If low-quality data only mostly present during deployment.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'On a Thursday afternoon in January, Robert Julian-Borchak Williams was in his office at an automotive supply company when he got a call from the Detroit Police Department telling him to come to the station to be arrested.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Facial recognition systems have been used by police forces for more than two decades. Recent studies by M.I.T. and the National Institute of Standards and Technology, or NIST, have found that while the technology works relatively well on white men, the results are less accurate for other demographics, in part because of a lack of diversity in the images used to develop the underlying databases.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Last year, during a public hearing about the use of facial recognition in Detroit, an assistant police chief was among those who raised concerns. \u201cOn the question of false positives \u2014 that is absolutely factual, and it\u2019s well-documented,\u201d James White said.',
        report_idx: 1,
        comment: 'Low precision.',
      },
      {
        snippet_text:
          'Clare Garvie, a lawyer at Georgetown University\u2019s Center on Privacy and Technology, has written about problems with the government\u2019s use of facial recognition. She argues that low-quality search images \u2014 such as a still image from a grainy surveillance video \u2014 should be banned, and that the systems currently in use should be tested rigorously for accuracy and bias.',
        report_idx: 1,
      },
      {
        snippet_text:
          'In 2019, algorithms from both companies were included in a federal study of over 100 facial recognition systems that found they were biased, falsely identifying African-American and Asian faces 10 times to 100 times more than Caucasian faces.',
        report_idx: 1,
      },
      {
        snippet_text:
          ' It is only supposed to be a clue in the case, not a smoking gun. Before arresting Mr. Williams, investigators might have sought other evidence that he committed the theft, such as eyewitness testimony, location data from his phone or proof that he owned the clothing that the suspect was wearing.',
        report_idx: 1,
      },
      {
        snippet_text:
          '\u201cIf we would use the software only [to identify subjects], we would not solve the case 95-97 percent of the time,\u201d Craig said. \u201cThat\u2019s if we relied totally on the software, which would be against our current policy \u2026 If we were just to use the technology by itself, to identify someone, I would say 96 percent of the time it would misidentify."',
        report_idx: 2,
      },
      {
        snippet_text:
          'According to the policy, the software must be used only \u201con a still image of an individual,\u201d and can only be used as part of an ongoing criminal investigation.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Craig said during the meeting that the media it ran through DataWorks\u2019 facial recognition system was \u201ca horrible video. ',
        report_idx: 2,
      },
      {
        snippet_text:
          'The software\u2019s accuracy is heavily dependent on image quality: Blurry, grainy or dark photos often lead to poor results. But even the algorithms used in a facial recognition search can offer a wide range of effectiveness: Several of those tested in a 2019 federal study were up to 100 times more likely to misidentify the face of a Black or Asian person, compared with a White person.',
        report_idx: 4,
      },
      {
        snippet_text:
          'Critics say police rely too heavily on the technology, particularly since research has shown it misidentifies women and people of color more often than white men.',
        report_idx: 6,
      },
    ],
  },
  252: {
    taxonomies: {
      task: [
        {
          label: 'Autonomous Drones',
          confidence: 'known',
          snippets: [
            'The May 24 school shooting in Uvalde, Texas that killed 21 prompted an announcement by Axon last week that it was working on a drone that could be operated remotely by first responders to fire a taser at a target up to 12 metres away.',
          ],
        },
      ],
      technology: [
        {
          label: 'Image Segmentation',
          confidence: 'potential',
          snippets: [
            'The May 24 school shooting in Uvalde, Texas that killed 21 prompted an announcement by Axon last week that it was working on a drone that could be operated remotely by first responders to fire a taser at a target up to 12 metres away.',
          ],
        },
      ],
      failure: [
        {
          label: 'Lack of Capability Control',
          confidence: 'potential',
          snippets: [
            'The May 24 school shooting in Uvalde, Texas that killed 21 prompted an announcement by Axon last week that it was working on a drone that could be operated remotely by first responders to fire a taser at a target up to 12 metres away.',
          ],
          comment: 'Dangerous unreliable machines near children.',
        },
        {
          label: 'Underspecification',
          confidence: 'potential',
          snippets: [
            'The May 24 school shooting in Uvalde, Texas that killed 21 prompted an announcement by Axon last week that it was working on a drone that could be operated remotely by first responders to fire a taser at a target up to 12 metres away.',
          ],
          comment:
            'Near-lethal weapons applied in a school setting is a extremely poor attempt at a solution, given the current performance of the technology and the applied environment; accidents / errors should be expected with tragic consequences.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'The May 24 school shooting in Uvalde, Texas that killed 21 prompted an announcement by Axon last week that it was working on a drone that could be operated remotely by first responders to fire a taser at a target up to 12 metres away.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Some of them expressed reservations about weaponising drones in over-policed communities of colour.\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'Over the last year, the company created computer-generated art renderings to mock up a product design and it conducted an internal test to see if taser darts \u2014 which transmit an immobilising electric jolt \u2014 could be fired from a flying drone, Mr Smith said.',
        report_idx: 1,
      },
      {
        snippet_text:
          '"Drones can\'t fly through closed doors. The physical properties of the universe still hold. So unless you have a drone in every single classroom in America, which seems insane, the idea just isn\'t going to work."',
        report_idx: 1,
      },
      {
        snippet_text:
          'Board members who spoke with The Associated Press said they were taken aback by the school drone proposal \u2014 which they got notice of only earlier last week \u2014 and cobbled together a unanimous statement of concern that described Axon\'s decision as "deeply regrettable".',
        report_idx: 1,
      },
      {
        snippet_text:
          'On Friday in an "Ask Me Anything" chat on the online forum Reddit, Mr Smith acknowledged that "drones in schools can sound nuts" but went on to answer detailed questions about them.',
        report_idx: 1,
      },
    ],
  },
  253: {
    taxonomies: {
      task: [
        {
          label: 'Autonomous Driving',
          confidence: 'known',
          snippets: [
            'Cruise\u2019s driverless cars experienced serious issues Tuesday night with as many as 20 of its vehicles standing motionless for about two hours at the corner of Gough and Fulton streets, according to an eyewitness. ',
          ],
        },
      ],
      technology: [
        {
          label: 'Image Segmentation',
          confidence: 'potential',
          snippets: [
            'Cruise\u2019s driverless cars experienced serious issues Tuesday night with as many as 20 of its vehicles standing motionless for about two hours at the corner of Gough and Fulton streets, according to an eyewitness. ',
          ],
        },
        {
          label: 'Geolocation Data',
          confidence: 'potential',
          snippets: [
            'Cruise\u2019s driverless cars experienced serious issues Tuesday night with as many as 20 of its vehicles standing motionless for about two hours at the corner of Gough and Fulton streets, according to an eyewitness. ',
          ],
        },
      ],
      failure: [
        {
          label: 'Software Bug',
          confidence: 'potential',
          snippets: [
            'Terrifyingly, Wired adds that on that particular evening \u201cInternal messages seen by WIRED show that nearly 60 vehicles were disabled across the city over a 90-minute period after they lost touch with a Cruise server.\u201d',
            'Worst of all, the company was unable to access its fallback system, which allows remote operators to safely steer stopped vehicles to the side of the road.\u201d',
            'Cruise spokesperson Tiffany Testo said in a statement to Wired that \u201cWe\u2019re working to minimize how often this happens, but it is and will remain one aspect of our overall safety operations,\u201d That doesn\u2019t really explain why this keeps happening, nor does it inspire much confidence that it won\u2019t happen again and again, nor does it show any concern for potentially deadly consequences.',
          ],
          comment: 'Speculative error to server availability issues.',
        },
        {
          label: 'Hardware Failure',
          confidence: 'potential',
          snippets: [
            'Worst of all, the company was unable to access its fallback system, which allows remote operators to safely steer stopped vehicles to the side of the road.\u201d',
            'Cruise spokesperson Tiffany Testo said in a statement to Wired that \u201cWe\u2019re working to minimize how often this happens, but it is and will remain one aspect of our overall safety operations,\u201d That doesn\u2019t really explain why this keeps happening, nor does it inspire much confidence that it won\u2019t happen again and again, nor does it show any concern for potentially deadly consequences.',
          ],
          comment: 'Speculative error to server availability issues.',
        },
        {
          label: 'Backup Failure',
          confidence: 'potential',
          snippets: [
            'Wired adds that in that incident, \u201cCompany staff were unable to see where the vehicles were located or communicate with riders inside. ',
            'Worst of all, the company was unable to access its fallback system, which allows remote operators to safely steer stopped vehicles to the side of the road.\u201d',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'Cruise\u2019s driverless cars experienced serious issues Tuesday night with as many as 20 of its vehicles standing motionless for about two hours at the corner of Gough and Fulton streets, according to an eyewitness. ',
        report_idx: 2,
      },
      {
        snippet_text:
          'In response to specific questions about both incidents, a Cruise spokesperson provided the following statement: "We had an issue earlier this week that caused some of our vehicles to cluster together.',
        report_idx: 2,
      },
      {
        snippet_text:
          'GM Cruise snafus have blocked SF streets with suddenly immobilized self-driving cars at least three times in the last two months, with one incident where almost 60 vehicles stopped, and another where Cruise \u201clost touch with its entire fleet.\u201d',
        report_idx: 3,
      },
      {
        snippet_text:
          'We wrote last week about an eerie cyber-snafu with GM Cruise self-driving robotaxis, where at least eight of the driverless cars ganged up and blocked Gough Street \u201cfor a couple of hours,\u201d and would not move until GM employees showed up and moved the cars manually.',
        report_idx: 3,
      },
      {
        snippet_text:
          'Wired has a new report detailing numerous incidents of GM Cruise vehicles suddenly freezing and stopping traffic in San Francisco. ',
        report_idx: 3,
      },
      {
        snippet_text:
          'Terrifyingly, Wired adds that on that particular evening \u201cInternal messages seen by WIRED show that nearly 60 vehicles were disabled across the city over a 90-minute period after they lost touch with a Cruise server.\u201d',
        report_idx: 3,
      },
      {
        snippet_text:
          'Wired adds that in that incident, \u201cCompany staff were unable to see where the vehicles were located or communicate with riders inside. ',
        report_idx: 3,
      },
      {
        snippet_text:
          'Worst of all, the company was unable to access its fallback system, which allows remote operators to safely steer stopped vehicles to the side of the road.\u201d',
        report_idx: 3,
        comment: 'Fallback tied to the main server infrastructure instead of their own system.',
      },
      {
        snippet_text:
          'Cruise spokesperson Tiffany Testo said in a statement to Wired that \u201cWe\u2019re working to minimize how often this happens, but it is and will remain one aspect of our overall safety operations,\u201d That doesn\u2019t really explain why this keeps happening, nor does it inspire much confidence that it won\u2019t happen again and again, nor does it show any concern for potentially deadly consequences.',
        report_idx: 3,
        comment: 'No explanation provided.',
      },
    ],
  },
  254: {
    taxonomies: {
      task: [
        {
          label: 'Data Grouping',
          confidence: 'known',
          snippets: [
            'The complaint alleges Google\u2019s face grouping tool, which automatically identifies your face in photos and videos uploaded to Photos, violates Illinois\u2019 Biometric Information Privacy Act (BIPA).',
          ],
        },
      ],
      technology: [
        {
          label: 'Clustering',
          confidence: 'potential',
          snippets: [
            'The complaint alleges Google\u2019s face grouping tool, which automatically identifies your face in photos and videos uploaded to Photos, violates Illinois\u2019 Biometric Information Privacy Act (BIPA).',
          ],
        },
        {
          label: 'Face Detection',
          confidence: 'potential',
          snippets: [
            'The complaint alleges Google\u2019s face grouping tool, which automatically identifies your face in photos and videos uploaded to Photos, violates Illinois\u2019 Biometric Information Privacy Act (BIPA).',
          ],
        },
      ],
      failure: [
        {
          label: 'Unauthorized Data',
          confidence: 'potential',
          snippets: [
            'Google \u201cis in direct violation\u201d of this law, the complaint claims, as it allegedly collects and analyzes a person\u2019s facial structure in connection with its face grouping feature \u201cwithout providing notice, obtaining informed written consent or publishing data retention policies.\u201d',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'The complaint alleges Google\u2019s face grouping tool, which automatically identifies your face in photos and videos uploaded to Photos, violates Illinois\u2019 Biometric Information Privacy Act (BIPA).',
        report_idx: 1,
      },
      {
        snippet_text:
          'Google \u201cis in direct violation\u201d of this law, the complaint claims, as it allegedly collects and analyzes a person\u2019s facial structure in connection with its face grouping feature \u201cwithout providing notice, obtaining informed written consent or publishing data retention policies.\u201d',
        report_idx: 1,
      },
    ],
  },
  28: {
    taxonomies: {
      task: [
        {
          label: 'Automatic Stock Trading',
          confidence: 'known',
          snippets: [],
        },
      ],
      technology: [
        {
          label: 'Regression',
          confidence: 'potential',
          snippets: [
            'The May 6, 2010, Flash Crash,[1][2] also known as the Crash of 2:45, the 2010 Flash Crash or simply the Flash Crash, was a United States trillion-dollar[3] stock market crash, which started at 2:32 p.m. EDT and lasted for approximately 36 minutes.',
            "On May 6, 2010, the primary market makers in the stock market just stopped automatically taking the other side of everyone else's trades. ",
          ],
          comment:
            'This is valid only if prices were automatically suggested by the software: extreme / over-optimized solutions proposed by the price system. ',
        },
      ],
      failure: [
        {
          label: 'Overfitting',
          confidence: 'potential',
          snippets: [
            "On May 6, 2010, the primary market makers in the stock market just stopped automatically taking the other side of everyone else's trades. ",
          ],
          comment:
            'This is valid only if prices were automatically suggested by the software: extreme / over-optimized solutions proposed by the price system. ',
        },
        {
          label: 'Gaming Vulnerability',
          confidence: 'potential',
          comment:
            "Powerful 'optimization' (speed, in this case) plays by the rules with extreme, unforeseen results.",
          snippets: [
            'He did this by, basically, putting in orders to sell thousands of contracts away from the best offer. Those orders were never executed, or intended to be executed, but they tricked people into thinking that there was a lot more selling interest than there actually was. That combined with a collapse in buying interest -- at one point Sarao\'s fake sell orders alone "were almost equal to the entire buyside of the Order Book" -- to create a collapse in prices. He profited from those collapsing prices by selling high and buying back lower. It\'s a pretty straightforward spoofing story.',
            'At 2.32 pm, the mutual fund had used an automated algorithm trading strategy to sell contracts known as e-minis. It was the largest change in the daily position of any investor so far that year and sparked selling by other traders, including high frequency traders.',
            'The trader then executed the sell program "extremely rapidly in just 20 minutes", causing the largest net change in daily position of any trader in the E-mini since the beginning of the year.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'The May 6, 2010, Flash Crash,[1][2] also known as the Crash of 2:45, the 2010 Flash Crash or simply the Flash Crash, was a United States trillion-dollar[3] stock market crash, which started at 2:32 p.m. EDT and lasted for approximately 36 minutes.',
        report_idx: 1,
      },
      {
        snippet_text:
          ' Sarao began his alleged market manipulation in 2009 with commercially available trading software whose code he modified "so he could rapidly place and cancel orders automatically.',
        report_idx: 1,
      },
      {
        snippet_text:
          "As noted above, not all participants agree on what constitutes an erroneous trade. Some would argue that if there is no demand for a stock at $40 and the only way to execute the sale is to cut the price to six cents, that's fine. Others would call that an erroneous trade. iShares believes that all exchanges must agree on a standard definition to stop the next flash crash.",
        report_idx: 2,
        comment: 'Disagreements on ground truth.',
      },
      {
        snippet_text:
          'iShares believes that all exchanges need to have standard rules for ignoring what Clements called "a pool of liquidity," such as the NYSE or any other exchange that goes into slow mode.',
        report_idx: 2,
      },
      {
        snippet_text:
          "On May 6, 2010, the primary market makers in the stock market just stopped automatically taking the other side of everyone else's trades. ",
        report_idx: 4,
      },
      {
        snippet_text:
          "As a result of the government's war on specialists, much of liquidity in the market now comes from high-frequency trading computers. ",
        report_idx: 4,
      },
      {
        snippet_text:
          "Mainly, they make money by executing an enormous volume of trades around small price points. You sell for one dollar, they buy for a dollar and one tenth of a cent. They they sell for a dollar and two tenths of a cent. Do that often enough and you're talking real money.",
        report_idx: 4,
      },
      {
        snippet_text:
          'At 2.32 pm, the mutual fund had used an automated algorithm trading strategy to sell contracts known as e-minis. It was the largest change in the daily position of any investor so far that year and sparked selling by other traders, including high frequency traders.',
        report_idx: 5,
      },
      {
        snippet_text:
          'The official report by the Securities and Exchange Commission and the Commodity Futures Trading Commission outlined a \u201chot potato\u201d effect as the HFTs started and buying and then reselling the e-mini contracts. Some orders were executed at \u201cirrational prices\u201d as low as one penny or as high as $100,000 before the share prices returned to their pre-crash levels by 3pm. In just 20 minutes, 2bn shares worth $56bn had changed hands.',
        report_idx: 5,
      },
      {
        snippet_text:
          'On May 6, 2010, according to the authorities, it worked a little too well: Sarao did such a good job of driving down the price of the E-mini future that he caused a flash crash in which "investors saw nearly $1 trillion of value erased from U.S. stocks in just minutes."',
        report_idx: 7,
      },
      {
        snippet_text:
          'He did this by, basically, putting in orders to sell thousands of contracts away from the best offer. Those orders were never executed, or intended to be executed, but they tricked people into thinking that there was a lot more selling interest than there actually was. That combined with a collapse in buying interest -- at one point Sarao\'s fake sell orders alone "were almost equal to the entire buyside of the Order Book" -- to create a collapse in prices. He profited from those collapsing prices by selling high and buying back lower. It\'s a pretty straightforward spoofing story.',
        report_idx: 7,
        comment:
          'Automation software has no regulation, safeguards or limiters against such spoofing, against repeated fast execution, etc. Users want to make a profit.',
      },
      {
        snippet_text:
          'The CFTC claims that Sarao, using a computer algorithm, placed large orders to sell E-mini S&P 500 stocks with no intention of ever completing the agreements. These orders were priced competitively, so as not to stand out and attract attention as being unusually high or low, the CFTC said.\n\n',
        report_idx: 8,
      },
      {
        snippet_text:
          '"By allegedly placing multiple, simultaneous, large-volume sell orders at different price points - a technique known as \'layering\' - Sarao created the appearance of substantial supply in the market," the Department of Justice said.',
        report_idx: 8,
      },
      {
        snippet_text:
          'The trader then executed the sell program "extremely rapidly in just 20 minutes", causing the largest net change in daily position of any trader in the E-mini since the beginning of the year.',
        report_idx: 8,
      },
      {
        snippet_text:
          'The report noted a "disruptive" trading pattern but did not provide analysis of the Waddell and Reed market order that was said to have rested on the higher "ask" side of the bid-ask spread and was done over multiple smaller orders.',
        report_idx: 22,
      },
    ],
  },
  103: {
    taxonomies: {
      task: [
        {
          label: 'Image Cropping',
          confidence: 'known',
          snippets: [
            'Twitter\u2018s algorithm for automatically cropping images attached to tweets often doesn\u2019t focus on the important content in them. ',
          ],
        },
      ],
      technology: [
        {
          label: 'Neural Network',
          confidence: 'known',
          snippets: [
            'Her theory is backed by Twitter\u2019s 2018 blog post that explained its neural network built for image cropping. ',
            'The company definitely needs to do some digging into their algorithm to understand the bias in its neural network.',
          ],
        },
      ],
      failure: [
        {
          label: 'Distributional Bias',
          confidence: 'potential',
          snippets: [
            'Several users posted a lot of photos to show that in an image that has people with different colors, Twitter chooses to show folks with lighter skin after cropping those images to fit its display parameters on its site and embeds.',
            'A bother, for sure, but it seems like a minor one on the surface. However, over the weekend, researchers found that the cropping algorithm might have a more serious problem: white bias.',
            'Researchers found bias when the algorithm was shown photos of people from two demographic groups. Ultimately, the algorithm picks one person whose face will appear in Twitter timelines, and some groups are better represented on the platform than others. When researchers fed a picture of a Black man and a white woman into the system, the algorithm chose to display the white woman 64 percent of the time and the Black man only 36 percent of the time, the largest gap for any demographic groups included in the analysis. For images of a white woman and a white man, the algorithm displayed the woman 62 percent of the time. For images of a white woman and a Black woman, the algorithm displayed the white woman 57 percent of the time.',
          ],
        },
        {
          label: 'Incomplete Data Attribute Capture',
          confidence: 'potential',
          snippets: [
            'Twitter\u2019s Chief Design Officer (CDO), Dantley Davis, said that the choice of cropping sometimes takes brightness of the background into consideration.\n\n',
            'Anima Anandkumar, Director of AI research at Nvidia, pointed out that the saliency algorithm might be trained using eye-tracking of straight male participants, and that would insert more bias into the algorithm.',
          ],
          comment: 'Perhaps saliency / eye tracking is insufficient.',
        },
        {
          label: 'Generalization Failure',
          confidence: 'known',
          snippets: [
            'Twitter\u2018s algorithm for automatically cropping images attached to tweets often doesn\u2019t focus on the important content in them. ',
            'A bother, for sure, but it seems like a minor one on the surface. However, over the weekend, researchers found that the cropping algorithm might have a more serious problem: white bias.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'Twitter\u2018s algorithm for automatically cropping images attached to tweets often doesn\u2019t focus on the important content in them. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'A bother, for sure, but it seems like a minor one on the surface. However, over the weekend, researchers found that the cropping algorithm might have a more serious problem: white bias.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Several users posted a lot of photos to show that in an image that has people with different colors, Twitter chooses to show folks with lighter skin after cropping those images to fit its display parameters on its site and embeds.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Twitter\u2019s Chief Design Officer (CDO), Dantley Davis, said that the choice of cropping sometimes takes brightness of the background into consideration.\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'In a thread, Bianca Kastl, a developer from Germany, explained that Twitter\u2019s algorithm might be cropping the image based on saliency \u2014 an important point or part in an image that you\u2019re likely to look at first when you see it.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Her theory is backed by Twitter\u2019s 2018 blog post that explained its neural network built for image cropping. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'The company definitely needs to do some digging into their algorithm to understand the bias in its neural network.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Anima Anandkumar, Director of AI research at Nvidia, pointed out that the saliency algorithm might be trained using eye-tracking of straight male participants, and that would insert more bias into the algorithm.',
        report_idx: 1,
      },
      {
        snippet_text:
          'LAST FALL, CANADIAN student Colin Madland noticed that Twitter\u2019s automatic cropping algorithm continually selected his face\u2014not his darker-skinned colleague\u2019s\u2014from photos of the pair to display in tweets. ',
        report_idx: 2,
      },
      {
        snippet_text:
          'That assessment also found that the AI for predicting the most interesting part of a photo does not focus on women\u2019s bodies over women\u2019s faces.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Researchers found bias when the algorithm was shown photos of people from two demographic groups. Ultimately, the algorithm picks one person whose face will appear in Twitter timelines, and some groups are better represented on the platform than others. When researchers fed a picture of a Black man and a white woman into the system, the algorithm chose to display the white woman 64 percent of the time and the Black man only 36 percent of the time, the largest gap for any demographic groups included in the analysis. For images of a white woman and a white man, the algorithm displayed the woman 62 percent of the time. For images of a white woman and a Black woman, the algorithm displayed the white woman 57 percent of the time.',
        report_idx: 2,
      },
    ],
  },
  106: {
    taxonomies: {
      task: [
        {
          label: 'Chatbot',
          confidence: 'known',
          snippets: [
            'Interactive chatbot \u2018Luda,\u2019 subjected to sexual harassment and taught hate speech \u3000\n\n',
          ],
        },
      ],
      technology: [
        {
          label: 'Autoencoder',
          confidence: 'known',
          snippets: [
            'Luda is believed to use \u201cmesh autoencoders,\u201d a natural language processing technology introduced by Google. The initial input data for Luda\u2019s deep learning AI consisted of 10 billion KakaoTalk messages shared between actual couples.',
          ],
        },
        {
          label: 'Distributional Learning',
          confidence: 'known',
          snippets: [
            'Luda responded to words that defined homosexuals, such as \u201clesbian,\u201d saying, \u201cI really hate them, they look disgusting, and it\u2018s creepy.\u201d',
            'After the launch, several online community boards posted messages such as those titled, \u201cHow to make Luda a sex slave,\u201d with screen-captured images of sexual conversations with the AI.',
            'ScatterLab explained that the chatbot did not learn this behavior from the users it interacted with during the two weeks of service but rather learned it from the original training dataset. In other words, ScatterLab had not fully removed or filtered inappropriate language or intimate and sexual conversations from the dataset. ',
          ],
        },
      ],
      failure: [
        {
          label: 'Adversarial Data',
          confidence: 'known',
          snippets: [
            'Luda responded to words that defined homosexuals, such as \u201clesbian,\u201d saying, \u201cI really hate them, they look disgusting, and it\u2018s creepy.\u201d',
            'After the launch, several online community boards posted messages such as those titled, \u201cHow to make Luda a sex slave,\u201d with screen-captured images of sexual conversations with the AI.',
            'The bot was also shown to say, \u201cYuck, I really hate them,\u201d in a response to a question about transgender people.',
            '\u201cLuda will not immediately apply the conversation with the users to its learning system,\u201d and insisted that it would go through a process of giving appropriate learning signals gradually, to acknowledge the difference between what is OK and what is not.',
          ],
        },
        {
          label: 'Distributional Bias',
          confidence: 'known',
          snippets: [
            'Luda responded to words that defined homosexuals, such as \u201clesbian,\u201d saying, \u201cI really hate them, they look disgusting, and it\u2018s creepy.\u201d',
            'After the launch, several online community boards posted messages such as those titled, \u201cHow to make Luda a sex slave,\u201d with screen-captured images of sexual conversations with the AI.',
            'The bot was also shown to say, \u201cYuck, I really hate them,\u201d in a response to a question about transgender people.',
            'Kakao Games CEO Namgung Hoon said Luda itself is not guilty of embodying the young generation\'s prejudices and is one of many AI characters that will come out in the market in the future."',
            'ScatterLab explained that the chatbot did not learn this behavior from the users it interacted with during the two weeks of service but rather learned it from the original training dataset. In other words, ScatterLab had not fully removed or filtered inappropriate language or intimate and sexual conversations from the dataset. ',
          ],
        },
        {
          label: 'Unauthorized Data',
          confidence: 'known',
          snippets: [
            'Scatter Lab said its developers erased real names with its filtering algorithms but failed to remove all of them depending on the context, saying all data used in training Luda has been unverifiable and that it removed sensitive personal information, including names, phone numbers and addresses.',
            'In addition to this, ScatterLab shared their training model on GitHub, but not fully filtering or anonymising the data (D. Kim 2021)',
            'This Github training dataset exposed names of more than 20 people, along with the locations they have been to, their relationship status, and some of their medical information.',
          ],
        },
        {
          label: 'Inadequate Anonymization',
          confidence: 'known',
          snippets: [
            'Scatter Lab said its developers erased real names with its filtering algorithms but failed to remove all of them depending on the context, saying all data used in training Luda has been unverifiable and that it removed sensitive personal information, including names, phone numbers and addresses.',
            'In addition to this, ScatterLab shared their training model on GitHub, but not fully filtering or anonymising the data (D. Kim 2021)',
            'This Github training dataset exposed names of more than 20 people, along with the locations they have been to, their relationship status, and some of their medical information.',
          ],
        },
        {
          label: 'Inappropriate Training Content',
          confidence: 'known',
          snippets: [
            'ScatterLab explained that the chatbot did not learn this behavior from the users it interacted with during the two weeks of service but rather learned it from the original training dataset. In other words, ScatterLab had not fully removed or filtered inappropriate language or intimate and sexual conversations from the dataset. ',
          ],
        },
        {
          label: 'Unsafe Exposure or Access',
          confidence: 'known',
          snippets: [
            ' Further, it was discovered that groups of users in certain online communities were training Luda to respond to sexual commands, which provoked intense discussions about sexual harassment (\u201ccan AI be sexually harassed\u201d?) in a society that already grapples with gender issues.\n\n',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'Interactive chatbot \u2018Luda,\u2019 subjected to sexual harassment and taught hate speech \u3000\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'Luda was initially set not to accept certain keywords or expressions that could be problematic to social norms and values. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Luda is believed to use \u201cmesh autoencoders,\u201d a natural language processing technology introduced by Google. The initial input data for Luda\u2019s deep learning AI consisted of 10 billion KakaoTalk messages shared between actual couples.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Luda responded to words that defined homosexuals, such as \u201clesbian,\u201d saying, \u201cI really hate them, they look disgusting, and it\u2018s creepy.\u201d',
        report_idx: 1,
      },
      {
        snippet_text:
          'After the launch, several online community boards posted messages such as those titled, \u201cHow to make Luda a sex slave,\u201d with screen-captured images of sexual conversations with the AI.',
        report_idx: 1,
      },
      {
        snippet_text:
          '\u201cLuda will not immediately apply the conversation with the users to its learning system,\u201d and insisted that it would go through a process of giving appropriate learning signals gradually, to acknowledge the difference between what is OK and what is not.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The bot was also shown to say, \u201cYuck, I really hate them,\u201d in a response to a question about transgender people.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Lee Jae-woong, the former CEO of ride-sharing app Socar, said the company should have taken preventive measures against hate speech before introducing the service to the public.',
        report_idx: 4,
      },
      {
        snippet_text:
          'Scatter Lab said its developers erased real names with its filtering algorithms but failed to remove all of them depending on the context, saying all data used in training Luda has been unverifiable and that it removed sensitive personal information, including names, phone numbers and addresses.',
        report_idx: 4,
      },
      {
        snippet_text:
          'Kakao Games CEO Namgung Hoon said Luda itself is not guilty of embodying the young generation\'s prejudices and is one of many AI characters that will come out in the market in the future."',
        report_idx: 4,
      },
      {
        snippet_text:
          ' Further, it was discovered that groups of users in certain online communities were training Luda to respond to sexual commands, which provoked intense discussions about sexual harassment (\u201ccan AI be sexually harassed\u201d?) in a society that already grapples with gender issues.\n\n',
        report_idx: 6,
      },
      {
        snippet_text:
          'What was worse, ScatterLab was very poor at data cleaning. It is revealed that Luda sometimes responded with random names, addresses, and even bank account numbers (D. Kim 2021).',
        report_idx: 9,
      },
      {
        snippet_text:
          'In addition to this, ScatterLab shared their training model on GitHub, but not fully filtering or anonymising the data (D. Kim 2021)',
        report_idx: 9,
      },
      {
        snippet_text:
          'ScatterLab explained that the chatbot did not learn this behavior from the users it interacted with during the two weeks of service but rather learned it from the original training dataset. In other words, ScatterLab had not fully removed or filtered inappropriate language or intimate and sexual conversations from the dataset. ',
        report_idx: 10,
      },
      {
        snippet_text:
          'This Github training dataset exposed names of more than 20 people, along with the locations they have been to, their relationship status, and some of their medical information.',
        report_idx: 10,
      },
      {
        snippet_text:
          'The company is also accused of collecting personal information of about 200,000 children under the age of 14 without obtaining the consent of their parents or guardians in the development and operation process for its services.',
        report_idx: 11,
      },
      {
        snippet_text:
          "Scatter Lab did not set any age limit in recruiting subscribers for its app services and collected 48,000 children's personal information through Text At, 120,000 children's information from Science of Love and 39,000 children's information from Lee Luda, the commission said.",
        report_idx: 11,
      },
    ],
  },
  262: {
    taxonomies: {
      task: [
        {
          label: 'Visual Art Generation',
          confidence: 'known',
          snippets: [
            "Everyone's having a grand old time feeding outrageous prompts into the viral DALL-E Mini image generator \u2014 but as with all artificial intelligence, it's hard to stamp out the ugly, prejudiced edge cases.",
          ],
          comment: 'Annotation from background knowledge.',
        },
      ],
      technology: [
        {
          label: 'Transformer',
          confidence: 'known',
          snippets: [
            "Everyone's having a grand old time feeding outrageous prompts into the viral DALL-E Mini image generator \u2014 but as with all artificial intelligence, it's hard to stamp out the ugly, prejudiced edge cases.",
          ],
          comment: 'Annotation from background knowledge.',
        },
        {
          label: 'Generative Adversarial Network',
          confidence: 'known',
          snippets: [
            "Everyone's having a grand old time feeding outrageous prompts into the viral DALL-E Mini image generator \u2014 but as with all artificial intelligence, it's hard to stamp out the ugly, prejudiced edge cases.",
          ],
          comment: 'Annotation from background knowledge.',
        },
      ],
      failure: [
        {
          label: 'Distributional Bias',
          confidence: 'known',
          snippets: [
            'It can also simply reflect current inequalities reflected in its training data.',
            'As spotted by Dr. Tyler Berzin of Harvard Medical School noted, for instance, entering the term "a gastroenterologist" into the algorithm appears to show exclusively white male doctors. We got nearly identical results. And for "nurse"? All women.  ',
            'Other subtle biases also showed amid various prompts, such as the entirely light-skinned faces for the terms "smart girl" and "good person."\n\n',
            'When DALL\u00b7E mini was fed with the text prompts \u2018CEO\u2019 and \u2018lawyers\u2019, the results were prominently white men. A query for \u2018doctor\u2019 reverted back with similar results while the term \u2018nurse\u2019 featured mostly white women. The same was the case with \u2018flight attendant\u2019 and \u2018personal assistant\u2019\u2014both made assumptions about what the perfect candidate for the respective job titles would look like.',
            '\u201cEarly tests by red team members and OpenAI have shown that DALL\u00b7E 2 leans toward generating images of white men by default, overly sexualizes images of women, and reinforces racial stereotypes,\u201d WIRED noted.',
            '\u201cOne red team member told WIRED that eight out of eight attempts to generate images with words like \u2018a man sitting in a prison cell\u2019 or \u2018a photo of an angry man\u2019 returned images of men of colour,\u201d the publication went on to note.',
            'Every image it generated for "expert" "data scientist" "computer scientist" showed some distorted version of a white male.',
          ],
        },
        {
          label: 'Lack of Explainability',
          confidence: 'potential',
          snippets: [
            "It's also an incredibly difficult problem to solve, not the least because even the brightest minds in machine learning research often struggle to understand exactly how the most advanced algorithms work.",
          ],
          comment:
            'Potential, since it refers more to the overall lack of explainability of DL. In some sense, the failure is \u2018explained\u2019 in some level by identifying the source of bias.',
        },
        {
          label: 'Misinformation Generation Hazard',
          confidence: 'potential',
          snippets: [
            'Now, there are some insidiously dangerous risks in this case. As pointed out by Vox, people could leverage this type of AI to make everything from deepnudes to political deepfakes\u2014although the results would be horrific, to say the least. Given how the technology is free to use on the internet, it also harbours the potential to put human illustrators out of work in the long run.',
          ],
        },
        {
          label: 'Dataset Imbalance',
          confidence: 'potential',
          snippets: [
            'Dayma suggested that images of South Asian women in saris may have been heavily represented in those original photosets that feed DALL-E Mini.',
          ],
        },
        {
          label: 'Context Misidentification',
          confidence: 'potential',
          snippets: [
            'But give DALL-E Mini literally nothing, and it quickly reveals the limits of its own \u201cimaginings.\u201d Given no direction or guidance, the AI model seems to get stuck. With absolutely no prompt, the program will without a doubt give you back an image of a woman in a sari (a garment commonly worn across South Asia.)',
            'Dayma suggested that images of South Asian women in saris may have been heavily represented in those original photosets that feed DALL-E Mini.',
            'And that the quirk could also have something to do with caption length, as the AI might associate zero-character prompts with short image descriptions.',
          ],
        },
        {
          label: 'Data or Labelling Noise',
          confidence: 'potential',
          snippets: [
            'Instead, Cook thinks the origin could lie in a language bias of the data filtering process. \u201cOne thing that did occur to me while reading around is that a lot of these datasets strip out text that isn\u2019t English,\u201d he said. Image captions that include Hindi, for example, might be getting removed, leaving images with no supporting, explanatory text or labels floating free in the primordial AI soup, he explained.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          "Everyone's having a grand old time feeding outrageous prompts into the viral DALL-E Mini image generator \u2014 but as with all artificial intelligence, it's hard to stamp out the ugly, prejudiced edge cases.",
        report_idx: 1,
      },
      {
        snippet_text:
          'Using a series of prompts ranging from antiquated racist terminology to single-word inputs, Futurism found that DALL-E Mini indeed often produces stereotypical or outright racist imagery.',
        report_idx: 1,
      },
      {
        snippet_text:
          "We'll spare you specific examples, but prompts using slur words and white supremacist terminology spat out some alarming results.",
        report_idx: 1,
      },
      {
        snippet_text:
          '"Racist caricature of ___" was a reliable way to get the algorithm to reinforce hurtful stereotypes. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Take, for example, what the generator came up with for the term "racism" \u2014 a bunch of painting-like images of what appear to be Black faces, for some reason.\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'It can also simply reflect current inequalities reflected in its training data.',
        report_idx: 1,
      },
      {
        snippet_text:
          'As spotted by Dr. Tyler Berzin of Harvard Medical School noted, for instance, entering the term "a gastroenterologist" into the algorithm appears to show exclusively white male doctors. We got nearly identical results. And for "nurse"? All women.  ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Other subtle biases also showed amid various prompts, such as the entirely light-skinned faces for the terms "smart girl" and "good person."\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          "It's also an incredibly difficult problem to solve, not the least because even the brightest minds in machine learning research often struggle to understand exactly how the most advanced algorithms work.",
        report_idx: 1,
      },
      {
        snippet_text:
          'Now, there are some insidiously dangerous risks in this case. As pointed out by Vox, people could leverage this type of AI to make everything from deepnudes to political deepfakes\u2014although the results would be horrific, to say the least. Given how the technology is free to use on the internet, it also harbours the potential to put human illustrators out of work in the long run.',
        report_idx: 2,
      },
      {
        snippet_text:
          'When DALL\u00b7E mini was fed with the text prompts \u2018CEO\u2019 and \u2018lawyers\u2019, the results were prominently white men. A query for \u2018doctor\u2019 reverted back with similar results while the term \u2018nurse\u2019 featured mostly white women. The same was the case with \u2018flight attendant\u2019 and \u2018personal assistant\u2019\u2014both made assumptions about what the perfect candidate for the respective job titles would look like.',
        report_idx: 2,
      },
      {
        snippet_text:
          '\u201cEarly tests by red team members and OpenAI have shown that DALL\u00b7E 2 leans toward generating images of white men by default, overly sexualizes images of women, and reinforces racial stereotypes,\u201d WIRED noted.',
        report_idx: 2,
      },
      {
        snippet_text:
          '\u201cOne red team member told WIRED that eight out of eight attempts to generate images with words like \u2018a man sitting in a prison cell\u2019 or \u2018a photo of an angry man\u2019 returned images of men of colour,\u201d the publication went on to note.',
        report_idx: 2,
      },
      {
        snippet_text:
          'But give DALL-E Mini literally nothing, and it quickly reveals the limits of its own \u201cimaginings.\u201d Given no direction or guidance, the AI model seems to get stuck. With absolutely no prompt, the program will without a doubt give you back an image of a woman in a sari (a garment commonly worn across South Asia.)',
        report_idx: 3,
      },
      {
        snippet_text:
          'Dayma suggested that images of South Asian women in saris may have been heavily represented in those original photosets that feed DALL-E Mini.',
        report_idx: 3,
      },
      {
        snippet_text:
          'And that the quirk could also have something to do with caption length, as the AI might associate zero-character prompts with short image descriptions.',
        report_idx: 3,
      },
      {
        snippet_text:
          'Instead, Cook thinks the origin could lie in a language bias of the data filtering process. \u201cOne thing that did occur to me while reading around is that a lot of these datasets strip out text that isn\u2019t English,\u201d he said. Image captions that include Hindi, for example, might be getting removed, leaving images with no supporting, explanatory text or labels floating free in the primordial AI soup, he explained.',
        report_idx: 3,
      },
      {
        snippet_text:
          'Every image it generated for "expert" "data scientist" "computer scientist" showed some distorted version of a white male.',
        report_idx: 4,
      },
    ],
  },
  151: {
    taxonomies: {
      task: [
        {
          label: 'Autonomous Driving',
          confidence: 'known',
          snippets: [
            'On October 28, 2021, after turning right onto Fremont Blvd from Cushing Pkwy, the Pony.ai Autonomous Vehicle ("Pony.ai AV") performed a left lane change maneuver in autonomous mode. ',
          ],
        },
      ],
      technology: [
        {
          label: 'Image Segmentation',
          confidence: 'potential',
          snippets: [
            'Pony.ai, which is backed by Toyota Motor Corp (7203.T), said that in very rare circumstances, a planning system diagnostic check "could generate a \'false positive\' indication of a geolocation mismatch."',
          ],
          comment:
            'Potentially the divider was not detected or detected at a wrong distance from the car.',
        },
        {
          label: 'Geolocation Data',
          confidence: 'known',
          snippets: [
            'Pony.ai, which is backed by Toyota Motor Corp (7203.T), said that in very rare circumstances, a planning system diagnostic check "could generate a \'false positive\' indication of a geolocation mismatch."',
          ],
        },
      ],
      failure: [
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [
            'Pony.ai, which is backed by Toyota Motor Corp (7203.T), said that in very rare circumstances, a planning system diagnostic check "could generate a \'false positive\' indication of a geolocation mismatch."',
            'NHTSA told Pony.ai it believed the software had a safety defect and requested the company to conduct a recall, Pony.ai said in a filing. The company said it has updated the software code and the three affected vehicles have been repaired.\n\n',
          ],
          comment:
            'Potentially the divider was not detected or detected at a wrong distance from the car.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'On October 28, 2021, after turning right onto Fremont Blvd from Cushing Pkwy, the Pony.ai Autonomous Vehicle ("Pony.ai AV") performed a left lane change maneuver in autonomous mode. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Pony.ai said the crash occurred less than 2.5 seconds after the ADS shutdown.\n\n',
        report_idx: 9,
        comment: 'What\u2019s ADS?',
      },
      {
        snippet_text:
          'Pony.ai, which is backed by Toyota Motor Corp (7203.T), said that in very rare circumstances, a planning system diagnostic check "could generate a \'false positive\' indication of a geolocation mismatch."',
        report_idx: 9,
      },
      {
        snippet_text:
          'NHTSA told Pony.ai it believed the software had a safety defect and requested the company to conduct a recall, Pony.ai said in a filing. The company said it has updated the software code and the three affected vehicles have been repaired.\n\n',
        report_idx: 9,
      },
    ],
  },
  154: {
    taxonomies: {
      task: [
        {
          label: 'Recidivism Prediction',
          confidence: 'known',
          snippets: [
            'In a report issued days before Christmas in 2021, the department said its algorithmic tool for assessing the risk that a person in prison would return to crime produced uneven results. ',
          ],
        },
      ],
      technology: [
        {
          label: 'Diverse Data',
          confidence: 'potential',
          snippets: [
            '"You use a term like \'risk assessment tool,\' it has this patina of science, it sounds highly technical, but it\'s not," said Patricia Richman, who works on national policy issues for the Federal Public and Community Defenders. "A risk assessment tool is just a series of policy decisions."Those policy decisions are made by determining what counts as a risk factor and by how much.',
          ],
          comment: 'i.e., handling attributes like \u2018has criminal record\u2019',
        },
        {
          label: 'Distributional Learning',
          confidence: 'potential',
          snippets: [
            '"The Justice Department found that only 7% of Black people in the sample were classified as minimum level risk compared to 21% of white people," she added. ',
          ],
          comment:
            'If distributional learning is used, perhaps racial biases are present in the learning system.',
        },
      ],
      failure: [
        {
          label: 'Lack of Transparency',
          confidence: 'known',
          snippets: [
            'Attorney General Merrick Garland has directed the department to look for ways to assess racial bias and make the tool more transparent, a spokeswoman said.',
          ],
        },
        {
          label: 'Misconfigured Threshold',
          confidence: 'known',
          snippets: [
            'One option is to adjust the cutoff points between the risk categories, allowing more prisoners to earn credits for release, which would "maximize access to First Step Act relief while ensuring public safety," she said.',
          ],
        },
        {
          label: 'Incomplete Data Attribute Capture',
          confidence: 'potential',
          snippets: [
            'Criminal history can be a problem, for example, because law enforcement has a history of overpolicing some communities of color. Other factors such as education level and whether someone paid restitution to their victims can intersect with race and ethnicity, too.',
          ],
          comment:
            'Perhaps important features / attributes are missing from the model\u2019s input',
        },
        {
          label: 'Distributional Bias',
          confidence: 'potential',
          snippets: [
            '"The Justice Department found that only 7% of Black people in the sample were classified as minimum level risk compared to 21% of white people," she added. ',
          ],
          comment:
            'If distributional learning is used, perhaps racial biases are present in the learning system.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'In a report issued days before Christmas in 2021, the department said its algorithmic tool for assessing the risk that a person in prison would return to crime produced uneven results. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'The algorithm, known as Pattern, overpredicted the risk that many Black, Hispanic and Asian people would commit new crimes or violate rules after leaving prison. At the same time, it also underpredicted the risk for some inmates of color when it came to possible return to violent crime.',
        report_idx: 1,
      },
      {
        snippet_text:
          '"The Justice Department found that only 7% of Black people in the sample were classified as minimum level risk compared to 21% of white people," she added. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'It then had to make tweaks after finding Pattern suffered from math and human errors.\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          '"You use a term like \'risk assessment tool,\' it has this patina of science, it sounds highly technical, but it\'s not," said Patricia Richman, who works on national policy issues for the Federal Public and Community Defenders. "A risk assessment tool is just a series of policy decisions."Those policy decisions are made by determining what counts as a risk factor and by how much.',
        report_idx: 1,
        comment: 'Human-configured?',
      },
      {
        snippet_text:
          'Criminal history can be a problem, for example, because law enforcement has a history of overpolicing some communities of color. Other factors such as education level and whether someone paid restitution to their victims can intersect with race and ethnicity, too.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Attorney General Merrick Garland has directed the department to look for ways to assess racial bias and make the tool more transparent, a spokeswoman said.',
        report_idx: 1,
      },
      {
        snippet_text:
          'One option is to adjust the cutoff points between the risk categories, allowing more prisoners to earn credits for release, which would "maximize access to First Step Act relief while ensuring public safety," she said.',
        report_idx: 1,
      },
    ],
  },
  192: {
    taxonomies: {
      task: [
        {
          label: 'Automatic Skill Assessment',
          confidence: 'known',
          snippets: [
            'The women had been told to reapply for their positions, but were then informed they were being made redundant in part on the basis of an automated judgment by a computer.',
          ],
        },
      ],
      technology: [
        {
          label: 'Automatic Speech Recognition',
          confidence: 'known',
          snippets: [
            'She said that in the interview they were asked questions about putting on make-up \u2014 but rather than demonstrating it they had to describe the process, which she found difficult.',
          ],
        },
        {
          label: 'Regression',
          confidence: 'potential',
          snippets: [
            'The women had been told to reapply for their positions, but were then informed they were being made redundant in part on the basis of an automated judgment by a computer.',
          ],
        },
        {
          label: 'Classification',
          confidence: 'potential',
          snippets: [
            'The women had been told to reapply for their positions, but were then informed they were being made redundant in part on the basis of an automated judgment by a computer.',
          ],
        },
      ],
      failure: [
        {
          label: 'Dataset Imbalance',
          confidence: 'potential',
          snippets: [
            'Questions in the video interview process, which did not ask for any demonstrations of the make-up artists\u2019 work, included how to create a smokey eye, according to one of the artists.',
          ],
        },
        {
          label: 'Context Misidentification',
          confidence: 'potential',
          snippets: [
            'Questions in the video interview process, which did not ask for any demonstrations of the make-up artists\u2019 work, included how to create a smokey eye, according to one of the artists.',
          ],
        },
        {
          label: 'Inadequate Data Sampling',
          confidence: 'potential',
          snippets: [],
        },
        {
          label: 'Lack of Explainability',
          confidence: 'known',
          snippets: [
            'The three women also said that no one could explain how they were scored in the HireVue interview.\n\n',
          ],
        },
        {
          label: 'Problematic Input',
          confidence: 'potential',
          snippets: [],
        },
        {
          label: 'Incomplete Data Attribute Capture',
          confidence: 'known',
          snippets: [
            'She said that in the interview they were asked questions about putting on make-up \u2014 but rather than demonstrating it they had to describe the process, which she found difficult.',
          ],
          comment: 'Makeup skill assessment with verbal descriptions, rather visual media.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'The women had been told to reapply for their positions, but were then informed they were being made redundant in part on the basis of an automated judgment by a computer.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The software, created by the recruitment company HireVue, looked at the content of their answers and their expressions, and its results were used alongside other data about their job performance.',
        report_idx: 1,
        comment:
          'Failures here lie on the human factor that overvalued the automated system; some classifications could be applied here (e.g. ensemble aggregation issues), but is probably improper.',
      },
      {
        snippet_text:
          'She said that in the interview they were asked questions about putting on make-up \u2014 but rather than demonstrating it they had to describe the process, which she found difficult.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Automated hiring software is increasingly used to filter out candidates at the earliest stages, and the companies involved claim it can provide a fairer first assessment than simply relying on CVs and covering letters.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Questions in the video interview process, which did not ask for any demonstrations of the make-up artists\u2019 work, included how to create a smokey eye, according to one of the artists.',
        report_idx: 2,
        comment: 'A make-up-tuned model would be needed here.',
      },
      {
        snippet_text:
          'The three women also said that no one could explain how they were scored in the HireVue interview.\n\n',
        report_idx: 2,
      },
    ],
  },
  39: {
    taxonomies: {
      task: [
        {
          label: 'Deepfake Video Generation',
          confidence: 'known',
          snippets: [
            "The researchers used 14 hours of Obama's weekly address videos to train a neural network. Once trained, their system was then able to take an audio clip from the former president, create mouth shapes that synced with the audio and then synthesize a realistic looking mouth that matched Obama's. ",
          ],
        },
      ],
      technology: [
        {
          label: 'Neural Network',
          confidence: 'known',
          snippets: [
            "The researchers chose Obama for their latest work because there were hours of high-definition video of him available online in the public domain. The research team had a neural net analyze millions of frames of video to determine how elements of Obama's face moved as he talked, such as his lips and teeth and wrinkles around his mouth and chin.",
          ],
        },
        {
          label: 'Face Detection',
          confidence: 'known',
          snippets: [
            'In an artificial neural network, components known as artificial neurons are fed data, and work together to solve a problem such as identifying faces or recognizing speech.',
          ],
        },
        {
          label: 'Recurrent Neural Network',
          confidence: 'known',
          snippets: [
            'Using a recurrent neural network, the AI was able to match up the president\u2019s spoken words with the mouth shapes he made during the videos. ',
            'The researchers note their videos are currently not always perfect. For example, when Obama tilted his face away from the camera in a target video, imperfect 3-D modeling of his face could cause parts of his mouth to get superimposed outside the face and onto the background.',
          ],
        },
        {
          label: '3D reconstruction',
          confidence: 'potential',
          snippets: [
            'The researchers note their videos are currently not always perfect. For example, when Obama tilted his face away from the camera in a target video, imperfect 3-D modeling of his face could cause parts of his mouth to get superimposed outside the face and onto the background.',
            'The program then created 3D mouth textures for the different sounds and mapped them onto the president\u2019s face in other videos.',
          ],
          comment:
            'Good deepfakes of political actors may cause unrest, democratic institution degeneration, fake news, societal fallout.',
        },
        {
          label: 'Generative Adversarial Network',
          confidence: 'known',
          snippets: [
            "The researchers used 14 hours of Obama's weekly address videos to train a neural network. Once trained, their system was then able to take an audio clip from the former president, create mouth shapes that synced with the audio and then synthesize a realistic looking mouth that matched Obama's. ",
            'One neural network generates content, while the other rejects or approves each effort. The back-and-forth interplay between the two eventually produces a realistic result that can easily fool the human eye, including reproducing a static scene behind the head as it bobs back and forth.',
            'Portraits. It relies on a type of AI called generative adversarial networks (GANs) to modify a \u201ctarget\u201d actor based on the facial and head movement of a \u201csource\u201d actor. ',
          ],
        },
      ],
      failure: [
        {
          label: 'Misinformation Generation Hazard',
          confidence: 'potential',
          snippets: [
            "The researchers used 14 hours of Obama's weekly address videos to train a neural network. Once trained, their system was then able to take an audio clip from the former president, create mouth shapes that synced with the audio and then synthesize a realistic looking mouth that matched Obama's. ",
            'Although the researchers transplanted only words that were actually said by President Obama at some point, their project does raise some scary questions about the future of AI.',
            'The video serves as a PSA on how A.I. can be used to promote misinformation, slander, fraud, and misrepresentation, and it urges, through its example, consumers to be discerning about the sources from which they are getting information and the factual nature of information shared online. The fake Obama ends the video saying, \u201cStay woke, b*****.\u201d',
            'The videos caused a bit of a stir. The DeepFake algorithm was subsequently released on GitHub, giving anyone with sufficient knowhow and a decent enough computer the means to make pretty decent fakeries.',
            '\u201cWith ever-improving video editing technology, we must also start being more critical about the video content we consume every day, especially if there is no proof of origin,\u201d said Michael Zollh\u00f6fer, a visiting assistant professor at Stanford University and member of the Deep Video Portraits team, in the press release.',
            'Toward that end, the research team is training the same adversarial neural networks to spot video forgeries. ',
          ],
          comment:
            'Good deepfakes of political actors may cause unrest, democratic institution degeneration, fake news, societal fallout.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          "The researchers used 14 hours of Obama's weekly address videos to train a neural network. Once trained, their system was then able to take an audio clip from the former president, create mouth shapes that synced with the audio and then synthesize a realistic looking mouth that matched Obama's. ",
        report_idx: 1,
      },
      {
        snippet_text:
          "The researchers chose Obama for their latest work because there were hours of high-definition video of him available online in the public domain. The research team had a neural net analyze millions of frames of video to determine how elements of Obama's face moved as he talked, such as his lips and teeth and wrinkles around his mouth and chin.",
        report_idx: 2,
      },
      {
        snippet_text:
          'In an artificial neural network, components known as artificial neurons are fed data, and work together to solve a problem such as identifying faces or recognizing speech.',
        report_idx: 2,
      },
      {
        snippet_text:
          'In the new study, the neural net learned what mouth shapes were linked to various sounds. The researchers took audio clips and dubbed them over the original sound files of a video. They next took mouth shapes that matched the new audio clips and grafted and blended them onto the video. Essentially, the researchers synthesized videos where Obama lip-synched words he said up to decades beforehand.',
        report_idx: 2,
        comment: 'Lip syncing.',
      },
      {
        snippet_text:
          'The researchers note their videos are currently not always perfect. For example, when Obama tilted his face away from the camera in a target video, imperfect 3-D modeling of his face could cause parts of his mouth to get superimposed outside the face and onto the background.',
        report_idx: 2,
      },
      {
        snippet_text:
          "In addition, the research team notes their work did not model emotions, and so Obama's facial expressions in the output videos could appear too serious for casual speeches or too happy for serious speeches. ",
        report_idx: 2,
        comment: 'Negative classification: Emotion classification',
      },
      {
        snippet_text:
          'Using a recurrent neural network, the AI was able to match up the president\u2019s spoken words with the mouth shapes he made during the videos. ',
        report_idx: 3,
      },
      {
        snippet_text:
          'The program then created 3D mouth textures for the different sounds and mapped them onto the president\u2019s face in other videos.',
        report_idx: 3,
      },
      {
        snippet_text:
          'Although the researchers transplanted only words that were actually said by President Obama at some point, their project does raise some scary questions about the future of AI.',
        report_idx: 3,
      },
      {
        snippet_text:
          '\u201cWe developed an algorithm that can generate a believable video of Obama from his voice, based on a recurrent neural network that learns how to do this by analyzing hours of Obama\u2019s weekly address footage,\u201d Dr. Supasorn Suwajanakorn, a researcher on the project, told Digital Trends.',
        report_idx: 5,
      },
      {
        snippet_text:
          'The video serves as a PSA on how A.I. can be used to promote misinformation, slander, fraud, and misrepresentation, and it urges, through its example, consumers to be discerning about the sources from which they are getting information and the factual nature of information shared online. The fake Obama ends the video saying, \u201cStay woke, b*****.\u201d',
        report_idx: 24,
      },
      {
        snippet_text:
          'The videos caused a bit of a stir. The DeepFake algorithm was subsequently released on GitHub, giving anyone with sufficient knowhow and a decent enough computer the means to make pretty decent fakeries.',
        report_idx: 27,
      },
      {
        snippet_text:
          'Portraits. It relies on a type of AI called generative adversarial networks (GANs) to modify a \u201ctarget\u201d actor based on the facial and head movement of a \u201csource\u201d actor. ',
        report_idx: 28,
      },
      {
        snippet_text:
          'One neural network generates content, while the other rejects or approves each effort. The back-and-forth interplay between the two eventually produces a realistic result that can easily fool the human eye, including reproducing a static scene behind the head as it bobs back and forth.',
        report_idx: 28,
      },
      {
        snippet_text:
          '\u201cWith ever-improving video editing technology, we must also start being more critical about the video content we consume every day, especially if there is no proof of origin,\u201d said Michael Zollh\u00f6fer, a visiting assistant professor at Stanford University and member of the Deep Video Portraits team, in the press release.',
        report_idx: 28,
      },
      {
        snippet_text:
          'Toward that end, the research team is training the same adversarial neural networks to spot video forgeries. ',
        report_idx: 28,
      },
    ],
  },
  21: {
    taxonomies: {
      task: [
        {
          label: 'Question Answering',
          confidence: 'known',
          snippets: [
            'The Winograd Schema Challenge asks computers to make sense of sentences that are ambiguous but usually simple for humans to parse.',
          ],
        },
      ],
      failure: [
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [
            'The best two entrants were correct 48 percent of the time, compared to 45 percent if the answers are chosen at random. ',
          ],
          comment: 'Generic diagnosis',
        },
        {
          label: 'Dataset Imbalance',
          confidence: 'potential',
          snippets: [
            'In the sentence \u201cThe city councilmen refused the demonstrators a permit because they feared violence,\u201d it is logically unclear who the word \u201cthey\u201d refers to, although humans understand because of the broader context.',
          ],
        },
        {
          label: 'Underfitting',
          confidence: 'potential',
          snippets: [
            'In the sentence \u201cThe city councilmen refused the demonstrators a permit because they feared violence,\u201d it is logically unclear who the word \u201cthey\u201d refers to, although humans understand because of the broader context.',
          ],
          comment:
            'Presumably the model is not large enough to capture correctly enough context information during training, and /or grammatical structures required to correctly disambiguate non-straightforward cases.',
        },
        {
          label: 'Context Misidentification',
          confidence: 'potential',
          snippets: [
            'The Winograd Schema Challenge asks computers to make sense of sentences that are ambiguous but usually simple for humans to parse.',
          ],
          comment: 'This classification is a more focused description of the symptom',
        },
      ],
      technology: [
        {
          label: 'Language Modeling',
          confidence: 'known',
          snippets: [
            'Hand-coding knowledge is impossibly time-consuming, and it isn\u2019t simple for computers to learn about the real world by performing statistical analysis of text.',
          ],
          comment:
            'Presumably the model is not large enough to capture correctly enough context information during training, and /or grammatical structures required to correctly disambiguate non-straightforward cases.',
        },
        {
          label: 'Distributional Learning',
          confidence: 'known',
          snippets: [
            'Hand-coding knowledge is impossibly time-consuming, and it isn\u2019t simple for computers to learn about the real world by performing statistical analysis of text.',
          ],
          comment: 'This classification is a more focused description of the symptom',
        },
        {
          label: 'Transformer',
          confidence: 'potential',
          snippets: [
            'Liu\u2019s group, which included researchers from York University in Toronto and the National Research Council of Canada, used deep learning to train a computer to recognize the relationship between different events, such as \u201cplaying basketball\u201d and \u201cwinning\u201d or \u201cgetting injured,\u201d from thousands of texts.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'The Winograd Schema Challenge asks computers to make sense of sentences that are ambiguous but usually simple for humans to parse.',
        report_idx: 1,
      },
      {
        snippet_text:
          'In the sentence \u201cThe city councilmen refused the demonstrators a permit because they feared violence,\u201d it is logically unclear who the word \u201cthey\u201d refers to, although humans understand because of the broader context.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The best two entrants were correct 48 percent of the time, compared to 45 percent if the answers are chosen at random. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'Hand-coding knowledge is impossibly time-consuming, and it isn\u2019t simple for computers to learn about the real world by performing statistical analysis of text.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Most of the entrants in the Winograd Schema Challenge try to use some combination of hand-coded grammar understanding and a knowledge base of facts.',
        report_idx: 1,
      },
      {
        snippet_text:
          'They are using the latest machine learning techniques, especially \u201cdeep learning\u201d neural networks, to develop smarter, more intuitive chatbots and personal assistants (see \u201cTeaching Machines to Understand Us\u201d)',
        report_idx: 1,
      },
      {
        snippet_text:
          'Liu\u2019s group, which included researchers from York University in Toronto and the National Research Council of Canada, used deep learning to train a computer to recognize the relationship between different events, such as \u201cplaying basketball\u201d and \u201cwinning\u201d or \u201cgetting injured,\u201d from thousands of texts.',
        report_idx: 1,
      },
    ],
  },
  137: {
    taxonomies: {
      task: [
        {
          label: 'Financial Processing',
          confidence: 'known',
          snippets: [
            'The story began in 2014 when the farm Har Shemesh, which is not part of any community, asked the Tax Authority to explain how it had calculated a fine they were required to pay.',
          ],
          comment: 'The system probably does not use AI at all.',
        },
      ],
      technology: [
        {
          label: 'Regression',
          confidence: 'potential',
          snippets: [
            'The story began in 2014 when the farm Har Shemesh, which is not part of any community, asked the Tax Authority to explain how it had calculated a fine they were required to pay.',
          ],
          comment:
            'Perhaps a manually built model  is used to arrive at numeric costs, weighing different input components.',
        },
      ],
      failure: [
        {
          label: 'Lack of Transparency',
          confidence: 'known',
          snippets: [
            '\u201cTo obtain the guidelines would require the authority to use reverse engineering techniques and to trace the programming processes,\u201d the authority wrote. \u201cIt\u2019s not at all certain that these techniques will yield the desired results. Also, it would oblige the authority to set up a team of programmers to identify all the computer\u2019s software dealing with this request.\u201d',
            'In many cases the software arrives with only an executable file (.exe file) written in computer language, unlike a source code that is understood by the programmers. In this case, the entire supervision is conditioned on reverse engineering, in which prolonged experiments are conducted on the software to learn about its source code. In the absence of a human being to make the decision and without an open-source software, there is no real supervisor \u2013 a public employee, a gatekeeper or the public - on the way decisions are made.',
            'Human beings, like Tax Authority employees in this case, have a tendency to rely on the machine\u2019s decision, but the result the machine reaches isn\u2019t necessarily the right one, and the machine\u2019s decisions must be supervised.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'The story began in 2014 when the farm Har Shemesh, which is not part of any community, asked the Tax Authority to explain how it had calculated a fine they were required to pay.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The authority officials couldn\u2019t explain how they had arrived at the fine\u2019s final amount, claiming the calculation had been carried out automatically by their computer software. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'The farm, represented by its owner Moshe Har Shemesh, argued that the Tax Authority\u2019s computer was programmed to exercise discretion instead of the authority\u2019s officials. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'The authority\u2019s decision to grant a software program these powers is a decision, he claims, which was made as an administrative measure, with no public discussion and in the absence of sufficient public awareness of the implications, he argued.',
        report_idx: 1,
      },
      {
        snippet_text:
          '\u201cWhen a computerized system is tasked with implementing the procedure, then the operation guidelines are programmed into the software. They are unpublished and unknown, apart from those \u2018programming gurus\u2019 who programmed them into the computer language,\u201d he said.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Har Shemsh mentioned a class action lawsuit submitted by Aiad Mahajna, who discovered that the same tax authority computer would re-calculate fines over delayed VAT payments only when the consumer price index went up, but not when the index went down. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'The guidelines given to the program in the case had not been put in writing and neither the prosecutor nor the public had any way of understanding them. They could only be inferred by laborious data gathering. ',
        report_idx: 1,
        comment: 'Low operational transparency, no documentation.',
      },
      {
        snippet_text:
          'The Tax Authority argued in court that it had no way to extract the guidelines from the software, because it wasn\u2019t a matter of merely pressing a button, and that it would demand an unreasonable allocation of resources.',
        report_idx: 1,
      },
      {
        snippet_text:
          '\u201cTo obtain the guidelines would require the authority to use reverse engineering techniques and to trace the programming processes,\u201d the authority wrote. \u201cIt\u2019s not at all certain that these techniques will yield the desired results. Also, it would oblige the authority to set up a team of programmers to identify all the computer\u2019s software dealing with this request.\u201d',
        report_idx: 1,
      },
      {
        snippet_text:
          'In many cases the software arrives with only an executable file (.exe file) written in computer language, unlike a source code that is understood by the programmers. In this case, the entire supervision is conditioned on reverse engineering, in which prolonged experiments are conducted on the software to learn about its source code. In the absence of a human being to make the decision and without an open-source software, there is no real supervisor \u2013 a public employee, a gatekeeper or the public - on the way decisions are made.',
        report_idx: 1,
        comment: 'Lack of transparency.',
      },
      {
        snippet_text:
          'Human beings, like Tax Authority employees in this case, have a tendency to rely on the machine\u2019s decision, but the result the machine reaches isn\u2019t necessarily the right one, and the machine\u2019s decisions must be supervised.',
        report_idx: 1,
      },
    ],
  },
  1: {
    taxonomies: {
      task: [
        {
          label: 'Content Recommendation',
          confidence: 'known',
          snippets: [
            'An off-brand Paw Patrol video called "Babies Pretend to Die Suicide" features several disturbing scenarios.\nThe YouTube Kids app filters out most - but not all - of the disturbing videos.\n\nBefore any video appears in the YouTube Kids app, it\'s filtered by algorithms that are supposed to identify appropriate children\'s content\nYouTube also has a team of human moderators that review any videos flagged in the main YouTube app by volunteer Contributors (users who flag inappropriate content) or by systems that identify recognizable children\'s characters in the questionable video.\nMany of those views came from YouTube\'s "up next" and "recommended" video section that appears while watching any video. YouTube\'s algorithms attempt to find videos that you may want to watch based on the video you chose to watch first\nIf you don\'t pick another video to watch after the current video ends, the "up next" video will automatically play.\n',
          ],
        },
        {
          label: 'Content Search',
          confidence: 'known',
          snippets: [
            'An off-brand Paw Patrol video called "Babies Pretend to Die Suicide" features several disturbing scenarios.\nThe YouTube Kids app filters out most - but not all - of the disturbing videos.\n\nBefore any video appears in the YouTube Kids app, it\'s filtered by algorithms that are supposed to identify appropriate children\'s content\nYouTube also has a team of human moderators that review any videos flagged in the main YouTube app by volunteer Contributors (users who flag inappropriate content) or by systems that identify recognizable children\'s characters in the questionable video.\nMany of those views came from YouTube\'s "up next" and "recommended" video section that appears while watching any video. YouTube\'s algorithms attempt to find videos that you may want to watch based on the video you chose to watch first\nIf you don\'t pick another video to watch after the current video ends, the "up next" video will automatically play.\n',
          ],
        },
        {
          label: 'Hate Speech Detection',
          confidence: 'known',
          snippets: [],
        },
        {
          label: 'NSFW Content Detection',
          confidence: 'known',
          snippets: [],
        },
      ],
      technology: [
        {
          label: 'Content-based Filtering',
          confidence: 'known',
          snippets: [
            'If you searched for "moon landing" on YouTube Kids, three videos appeared that claim that the moon landing was hoaxed. All three videos have since been hidden by YouTube after we informed it of the issue.',
          ],
        },
        {
          label: 'Collaborative Filtering',
          confidence: 'known',
          snippets: [],
        },
        {
          label: 'Classification',
          confidence: 'potential',
          snippets: [],
          comment: 'Appropriateness could arise by appropriateness classifiers',
        },
        {
          label: 'Ensemble Aggregation',
          confidence: 'potential',
          snippets: [
            '\nPart of YouTube\u2019s plan is to increase human moderation and tweak its algorithm, \u201ctraining machine-learning technology across other challenging content areas, including child safety and hate speech.\u201d YouTube will also cut down on channels that receive monetization and advertisements attached to these videos. Since YouTube Kids also includes ads \u2014 many of which, Golin says, aren\u2019t child appropriate \u2014 this will affect channels and videos on the platform.',
          ],
          comment:
            'In cases where  "child-appropriateness" measure arises from multiple marginal detectors of-related subclasses (e.g. violent, adult, political themes)',
        },
        {
          label: 'Distributional Learning',
          confidence: 'potential',
          snippets: [],
        },
      ],
      failure: [
        {
          label: 'Concept Drift',
          confidence: 'potential',
          snippets: [
            '\u201cFrom a child standpoint, the problem is not fixable,\u201d Golin said. \u201cThe YouTube model has created something, which is so vast, but there are 400 hours of content are uploaded every minute. It\u2019s simply too big. ',
          ],
          comment:
            'Concept drift in cases where appropriateness evolves and changes with the passage of time and is culturally determined -- e.g. akin to old messed up disney cartoons.',
        },
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [
            '\u201cFrom a child standpoint, the problem is not fixable,\u201d Golin said. \u201cThe YouTube model has created something, which is so vast, but there are 400 hours of content are uploaded every minute. It\u2019s simply too big. ',
            '"There are vast, vast numbers of these videos," Bridle said. "Channel after channel after channel of similar content, churned out at the rate of hundreds of new videos every week. Industrialized nightmare production."',
          ],
          comment: 'Based on huge dataset size.',
        },
        {
          label: 'Misconfigured Aggregation',
          confidence: 'potential',
          snippets: [
            '\nPart of YouTube\u2019s plan is to increase human moderation and tweak its algorithm, \u201ctraining machine-learning technology across other challenging content areas, including child safety and hate speech.\u201d YouTube will also cut down on channels that receive monetization and advertisements attached to these videos. Since YouTube Kids also includes ads \u2014 many of which, Golin says, aren\u2019t child appropriate \u2014 this will affect channels and videos on the platform.',
            '"Recommendations are designed to optimize watch time, there is no reason that it shows content that is actually good for kids. ',
            'On YouTube today, children are being exploited for money. YouTubers with channels specifically marketed toward children are cranking out videos to provide kids with loads of content to consume, as each video around 16 minutes long. (Which is the sweet spot for maximum ad revenue.) Frankly, YouTubers are practically begging their viewers to \u201csmash\u201d that like button and comment on their videos.\nI spent a weekend babysitting my brother\u2019s children and they spent most of that time watching channels like Chad Wild Clay. He would ask a question like, \u201cWho is going to win this game?\u201d ask kids to comment their predictions in the comments and then proceed to play the game, giving the kids the answer in the same video. He\u2019d do that same thing several times throughout the video.\n\nWhat\u2019s the point of the interactive bits if they can just skip ahead and get their answers without commenting at all? It\u2019s simple: the more engagement the video gets, the more likely it is to be picked up by YouTube\u2019s recommendation algorithm, thus bringing in more traffic and more money.',
          ],
          comment:
            'In cases where  "child-appropriateness" measure arises from multiple marginal detectors of-related subclasses (e.g. violent, adult, political themes)',
        },
        {
          label: 'Distributional Bias',
          confidence: 'potential',
          snippets: [],
        },
        {
          label: 'Misaligned Objective',
          confidence: 'potential',
          snippets: [
            '"Recommendations are designed to optimize watch time, there is no reason that it shows content that is actually good for kids. ',
            'On YouTube today, children are being exploited for money. YouTubers with channels specifically marketed toward children are cranking out videos to provide kids with loads of content to consume, as each video around 16 minutes long. (Which is the sweet spot for maximum ad revenue.) Frankly, YouTubers are practically begging their viewers to \u201csmash\u201d that like button and comment on their videos.\nI spent a weekend babysitting my brother\u2019s children and they spent most of that time watching channels like Chad Wild Clay. He would ask a question like, \u201cWho is going to win this game?\u201d ask kids to comment their predictions in the comments and then proceed to play the game, giving the kids the answer in the same video. He\u2019d do that same thing several times throughout the video.\n\nWhat\u2019s the point of the interactive bits if they can just skip ahead and get their answers without commenting at all? It\u2019s simple: the more engagement the video gets, the more likely it is to be picked up by YouTube\u2019s recommendation algorithm, thus bringing in more traffic and more money.',
          ],
          comment:
            'Recommendation training is using child-appropriateness in its objective in a diminished capacity (as a component with a small contribution), or not at all (completely relying in post-hoc reviewing and filtering by other systems and humans).',
        },
        {
          label: 'Tuning Issues',
          confidence: 'known',
          snippets: [
            '\nPart of YouTube\u2019s plan is to increase human moderation and tweak its algorithm, \u201ctraining machine-learning technology across other challenging content areas, including child safety and hate speech.\u201d YouTube will also cut down on channels that receive monetization and advertisements attached to these videos. Since YouTube Kids also includes ads \u2014 many of which, Golin says, aren\u2019t child appropriate \u2014 this will affect channels and videos on the platform.',
            '"Recommendations are designed to optimize watch time, there is no reason that it shows content that is actually good for kids. ',
            'On YouTube today, children are being exploited for money. YouTubers with channels specifically marketed toward children are cranking out videos to provide kids with loads of content to consume, as each video around 16 minutes long. (Which is the sweet spot for maximum ad revenue.) Frankly, YouTubers are practically begging their viewers to \u201csmash\u201d that like button and comment on their videos.\nI spent a weekend babysitting my brother\u2019s children and they spent most of that time watching channels like Chad Wild Clay. He would ask a question like, \u201cWho is going to win this game?\u201d ask kids to comment their predictions in the comments and then proceed to play the game, giving the kids the answer in the same video. He\u2019d do that same thing several times throughout the video.\n\nWhat\u2019s the point of the interactive bits if they can just skip ahead and get their answers without commenting at all? It\u2019s simple: the more engagement the video gets, the more likely it is to be picked up by YouTube\u2019s recommendation algorithm, thus bringing in more traffic and more money.',
            'Conspiracy videos also appear when children search for popular conspiracy theories. Searches for "chemtrails," "flat earth," and "nibiru" are all allowed in the app. However, it\'s (hopefully) unlikely that children are regularly watching these videos unless they appear as suggestions on more popular content in the app.\n\nThe conspiracy videos didn\'t just appear in searches or suggested videos, either. After watching several conspiracy videos, the top recommended video on the home page of YouTube Kids was a conspiracy theory about aliens on the moon:',
          ],
          comment:
            'Default classification, in cases where the poor consideration of child -appropriateness context information does not fall under current subclasses of this classification.',
        },
        {
          label: 'Lack of Adversarial Robustness',
          confidence: 'known',
          snippets: [
            'The first line of defense for YouTube Kids are algorithmic filters. After that, there is a team of humans that review videos which have been flagged. If a video with recognizable children\u2019s characters gets flagged in YouTube\u2019s main app, which is much larger than the Kids app, it will be sent to the policy review team. YouTube says it has thousands of people working around the clock in different time zones to review flagged content. If the review finds the video is in violation of the new policy, it will be age restrictied, automatically blocking it from showing up in the Kids app. YouTube says it typically takes at least a few days for content to make its way from YouTube proper to YouTube Kids, and the hope is that within that window, users will flag anything potentially disturbing to children. YouTube also has a team of volunteer moderators, which it calls Contributors, looking for inappropriate content. YouTube says it will start training its review team on the new policy and it should be live within a few weeks. \nIt normally takes five days for supposedly child-friendly content like cartoons to get from YouTube to YouTube Kids. Within that window it is hoped users and a specially-trained team will flag disturbing content.\n\n\n',
          ],
        },
        {
          label: 'Adversarial Data',
          confidence: 'known',
          snippets: [
            'The first line of defense for YouTube Kids are algorithmic filters. After that, there is a team of humans that review videos which have been flagged. If a video with recognizable children\u2019s characters gets flagged in YouTube\u2019s main app, which is much larger than the Kids app, it will be sent to the policy review team. YouTube says it has thousands of people working around the clock in different time zones to review flagged content. If the review finds the video is in violation of the new policy, it will be age restrictied, automatically blocking it from showing up in the Kids app. YouTube says it typically takes at least a few days for content to make its way from YouTube proper to YouTube Kids, and the hope is that within that window, users will flag anything potentially disturbing to children. YouTube also has a team of volunteer moderators, which it calls Contributors, looking for inappropriate content. YouTube says it will start training its review team on the new policy and it should be live within a few weeks. \nIt normally takes five days for supposedly child-friendly content like cartoons to get from YouTube to YouTube Kids. Within that window it is hoped users and a specially-trained team will flag disturbing content.\n\n\n',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'An off-brand Paw Patrol video called "Babies Pretend to Die Suicide" features several disturbing scenarios.\nThe YouTube Kids app filters out most - but not all - of the disturbing videos.\n\nBefore any video appears in the YouTube Kids app, it\'s filtered by algorithms that are supposed to identify appropriate children\'s content\nYouTube also has a team of human moderators that review any videos flagged in the main YouTube app by volunteer Contributors (users who flag inappropriate content) or by systems that identify recognizable children\'s characters in the questionable video.\nMany of those views came from YouTube\'s "up next" and "recommended" video section that appears while watching any video. YouTube\'s algorithms attempt to find videos that you may want to watch based on the video you chose to watch first\nIf you don\'t pick another video to watch after the current video ends, the "up next" video will automatically play.\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'The first line of defense for YouTube Kids are algorithmic filters. After that, there is a team of humans that review videos which have been flagged. If a video with recognizable children\u2019s characters gets flagged in YouTube\u2019s main app, which is much larger than the Kids app, it will be sent to the policy review team. YouTube says it has thousands of people working around the clock in different time zones to review flagged content. If the review finds the video is in violation of the new policy, it will be age restrictied, automatically blocking it from showing up in the Kids app. YouTube says it typically takes at least a few days for content to make its way from YouTube proper to YouTube Kids, and the hope is that within that window, users will flag anything potentially disturbing to children. YouTube also has a team of volunteer moderators, which it calls Contributors, looking for inappropriate content. YouTube says it will start training its review team on the new policy and it should be live within a few weeks. \nIt normally takes five days for supposedly child-friendly content like cartoons to get from YouTube to YouTube Kids. Within that window it is hoped users and a specially-trained team will flag disturbing content.\n\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          '[...]  users name their videos and use thumbnails that can get around YouTube\u2019s algorithm, ensuring the content seems safe for kids.',
        report_idx: 1,
      },
      {
        snippet_text:
          'We use a combination of machine learning, algorithms and community flagging to determine content in the YouTube Kids app.\n[...] groups often act as volunteer watchdogs, going through the worst of YouTube and flagging it. A YouTube representative told Polygon that despite its own machine-learning algorithm being improved daily \u2014 learning what content is unacceptable for children \u2014 the team does rely on flags from parents to help address problematic videos and channels.\nMalik Ducard, YouTube\u2019s global head of family and children\u2019s content, told the New York Times these types of videos were \u201cthe extreme needle in the haystack,\u201d and pointed to the algorithm\u2019s machine learning and lack of oversight for reasons these videos may have slipped through. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'YouTube is finally addressing the issue on its main site, making changes to the way it moderates content. YouTube CEO Susan Wojcicki said the company was expanding its moderation corps to more than 10,000 contractors in 2018, focusing them on \u201ccontent that might violate our policies.\u201d \u201cHuman reviewers remain essential to both removing content and training machine learning systems because human judgment is critical to making contextualized decisions on content,\u201d she wrote in a recent blog post.',
        report_idx: 1,
      },
      {
        snippet_text:
          'As users of YouTube Kids search for material, the app begins to recommend similar videos, as the \u201cRecommended\u201d function on YouTube Kids is apparently based on \u201cSearch\u201d history.\n[...] Thus, the more inappropriate videos children search for, the more inappropriate videos they will be shown via the app\u2019s \u201cRecommended\u201d function.\n',
        report_idx: 1,
        comment:
          'Undesired data aspects (e.g. violence, lewdness) ignored, undervalued or not captured in the representation.',
      },
      {
        snippet_text:
          '\u201cFrom a child standpoint, the problem is not fixable,\u201d Golin said. \u201cThe YouTube model has created something, which is so vast, but there are 400 hours of content are uploaded every minute. It\u2019s simply too big. ',
        report_idx: 1,
      },
      {
        snippet_text:
          '\nPart of YouTube\u2019s plan is to increase human moderation and tweak its algorithm, \u201ctraining machine-learning technology across other challenging content areas, including child safety and hate speech.\u201d YouTube will also cut down on channels that receive monetization and advertisements attached to these videos. Since YouTube Kids also includes ads \u2014 many of which, Golin says, aren\u2019t child appropriate \u2014 this will affect channels and videos on the platform.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Search for "UFO" on YouTube Kids and you\'ll mostly find videos of toys that are clearly fine for children to watch. The YouTube Kids app blocks searches for most unsuitable videos.\nBut one of the top videos claimed to show a UFO shooting at a chemtrail, and we found several videos by prominent conspiracy theorist David Icke in the suggested videos. YouTube removed the videos from YouTube Kids after we contacted it about the issue.\nOne suggested video was an hours-long lecture by Icke in which he claims that aliens built the pyramids, that the planet is run by reptile-human hybrids, that Freemasons engage in human sacrifice, that the assassination of President Kennedy was planned by the US government, and that humans would evolve in 2012.\nTwo other conspiracy theory videos by Icke appeared in the related videos, meaning it was easy for children to quickly go from watching relatively innocent videos about toys to conspiracy content.  Search "9/11" or "porn" and you find no results. But we found that buried in the app\'s suggested videos were conspiracy videos that children could stumble on.\n[...] Through YouTube Kids\' suggested videos feature, we also found videos from conspiracy theorists Ben Davidson, Gerald Pollack, and Wallace Thornhill\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'If you searched for "moon landing" on YouTube Kids, three videos appeared that claim that the moon landing was hoaxed. All three videos have since been hidden by YouTube after we informed it of the issue.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Conspiracy videos also appear when children search for popular conspiracy theories. Searches for "chemtrails," "flat earth," and "nibiru" are all allowed in the app. However, it\'s (hopefully) unlikely that children are regularly watching these videos unless they appear as suggestions on more popular content in the app.\n\nThe conspiracy videos didn\'t just appear in searches or suggested videos, either. After watching several conspiracy videos, the top recommended video on the home page of YouTube Kids was a conspiracy theory about aliens on the moon:',
        report_idx: 1,
      },
      {
        snippet_text:
          '"Recommendations are designed to optimize watch time, there is no reason that it shows content that is actually good for kids. ',
        report_idx: 1,
      },
      { snippet_text: 'Youtube ', report_idx: 1 },
      {
        snippet_text:
          'But parents have discovered a range of inappropriate videos on the app, highlighting the platform\u2019s dependence on automation and a lack of human oversight.\nSam, 11, said SuperMarioLogan is \u201cone of my favorite channels. It was a suggested video. And I watched it and it kept reeling me in to watch more videos.\u201d\n\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'YouTube also told "GMA" it has since created more parental controls on YouTube Kids so only videos screened by human moderators can be used.\n\nParents have to turn the controls on themselves, and we found they do appear to work. By turning search off, parents can limit kids to videos that have been verified by the YouTube Kids Team.\n\nParents can also choose collections of channels recommended by YouTube Kids and their partners. A feature in which parents can handpick videos is supposed to become available later this year.\n\nChild advocates say there are also steps parents can take on their own, from spot checking their child\'s browser history to co-viewing YouTube with their child and talking to their child about what they\'re viewing online.',
        report_idx: 1,
      },
      {
        snippet_text:
          'On YouTube today, children are being exploited for money. YouTubers with channels specifically marketed toward children are cranking out videos to provide kids with loads of content to consume, as each video around 16 minutes long. (Which is the sweet spot for maximum ad revenue.) Frankly, YouTubers are practically begging their viewers to \u201csmash\u201d that like button and comment on their videos.\nI spent a weekend babysitting my brother\u2019s children and they spent most of that time watching channels like Chad Wild Clay. He would ask a question like, \u201cWho is going to win this game?\u201d ask kids to comment their predictions in the comments and then proceed to play the game, giving the kids the answer in the same video. He\u2019d do that same thing several times throughout the video.\n\nWhat\u2019s the point of the interactive bits if they can just skip ahead and get their answers without commenting at all? It\u2019s simple: the more engagement the video gets, the more likely it is to be picked up by YouTube\u2019s recommendation algorithm, thus bringing in more traffic and more money.',
        report_idx: 1,
        comment:
          'Recommendation training / video ranking is utilizing likes and engagement too much.',
      },
      {
        snippet_text:
          '"There are vast, vast numbers of these videos," Bridle said. "Channel after channel after channel of similar content, churned out at the rate of hundreds of new videos every week. Industrialized nightmare production."',
        report_idx: 1,
      },
    ],
  },
  72: {
    taxonomies: {
      task: [
        {
          label: 'Translation',
          confidence: 'known',
          snippets: [
            'The large number of dialects in use around the world means that Arabic is particularly difficult for machine translation services to handle, and mistakes are a regular occurrence.',
            'Facebook\u2019s translations are entirely powered by AI, and around 4.5 billion translations are made each day across the social network.\n',
          ],
          comment:
            'Presumably the arabic dialect in the text is not represented adequately in the training data, hence the translation performance issues. \n',
        },
      ],
      failure: [
        {
          label: 'Dataset Imbalance',
          confidence: 'known',
          snippets: [
            'The large number of dialects in use around the world means that Arabic is particularly difficult for machine translation services to handle, and mistakes are a regular occurrence.',
            'Reports also pointed out that there is only one difference in lettering between the colloquial Arabic phrase for \u201cgood morning to you all\u201d and \u201churt them.\u201d\n\n',
            'Arabic is considered particularly difficult for many machine translation services due to the large number of different dialects in use around the world, on top of Modern Standard Arabic, the international form of the language.',
            'The Guardian explains that Arabic can be particularly difficult to translate due to the sheer number of dialects that are used throughout the world. AI translation mistakes are common, especially when asked to translate specific words in unrelated languages.',
          ],
          comment:
            'Presumably the arabic dialect in the text is not represented adequately in the training data, hence the translation performance issues. \n',
        },
        {
          label: 'Distributional Bias',
          confidence: 'known',
          snippets: [
            'The man, a construction worker on the West Bank, posted a picture of himself leaning against a bulldozer like those that have been used in hit-and-run terrorist attacks, with a caption that correctly translates to "good morning"',
            "In the caption, he wrote an Arabic term meaning 'good morning', but a software malfunction translated it to mean 'attack them' in Hebrew and 'hurt them' in English.\n\n",
            'Israeli police became suspicious of the post since he was standing next to a bulldozer, a vehicle that has been used in earlier terror attacks, the website reported.\n\n',
            'Machine translation mistakes are a regular occurrence for anyone using AI to translate languages, particularly ones with little relationship. Earlier this month, Chinese social network WeChat apologised after its own machine translation system translated a neutral phrase meaning \u201cblack foreigner\u201d as the n-word.\n\u201cWhen I ran the translator, the n-word came up and I was gobsmacked,\u201d said Ann James, who had been texting back and forth with a friend when the faulty translation appeared.',
          ],
          comment:
            'Biased language in Western / Israeli media texts about Arabs could build false associations and high priors to terrorism and violence.',
        },
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [
            'The large number of dialects in use around the world means that Arabic is particularly difficult for machine translation services to handle, and mistakes are a regular occurrence.',
            'Reports also pointed out that there is only one difference in lettering between the colloquial Arabic phrase for \u201cgood morning to you all\u201d and \u201churt them.\u201d\n\n',
            'Arabic is considered particularly difficult for many machine translation services due to the large number of different dialects in use around the world, on top of Modern Standard Arabic, the international form of the language.',
            'The Guardian explains that Arabic can be particularly difficult to translate due to the sheer number of dialects that are used throughout the world. AI translation mistakes are common, especially when asked to translate specific words in unrelated languages.',
          ],
          comment:
            'Perhaps only one (standard arabic) or a few dialects are supported, and one or more language models is used as fallback for all arabic languages.',
        },
      ],
      technology: [
        {
          label: 'Convolutional Neural Network',
          confidence: 'known',
          snippets: [
            'The error comes after Facebook announced in August that it shifted to neural machine translation, which uses convolutional neural networks (CNNs) and recurrent neural networks (RNNs) to automatically translate content across its site. Many tech companies including Facebook, Google and Microsoft have been pivoting towards neural machine translation and away from phrase-based, pattern-tracking statistical machine translation (SMT) to quicken and improve their translation software.',
          ],
        },
        {
          label: 'Recurrent Neural Network',
          confidence: 'known',
          snippets: [
            'The error comes after Facebook announced in August that it shifted to neural machine translation, which uses convolutional neural networks (CNNs) and recurrent neural networks (RNNs) to automatically translate content across its site. Many tech companies including Facebook, Google and Microsoft have been pivoting towards neural machine translation and away from phrase-based, pattern-tracking statistical machine translation (SMT) to quicken and improve their translation software.',
          ],
        },
        {
          label: 'Distributional Learning',
          confidence: 'known',
          snippets: [
            'Machine translation mistakes are a regular occurrence for anyone using AI to translate languages, particularly ones with little relationship. Earlier this month, Chinese social network WeChat apologised after its own machine translation system translated a neutral phrase meaning \u201cblack foreigner\u201d as the n-word.\n\u201cWhen I ran the translator, the n-word came up and I was gobsmacked,\u201d said Ann James, who had been texting back and forth with a friend when the faulty translation appeared.',
            'The man, a construction worker on the West Bank, posted a picture of himself leaning against a bulldozer like those that have been used in hit-and-run terrorist attacks, with a caption that correctly translates to "good morning"',
            'However, AI translation depends on learning from the most common uses of words, and most bi- or multi-lingual speakers find that Google and Facebook translations are very lacking.',
          ],
        },
        {
          label: 'Intermediate modeling',
          confidence: 'potential',
          snippets: [
            'The large number of dialects in use around the world means that Arabic is particularly difficult for machine translation services to handle, and mistakes are a regular occurrence.',
            "It was unclear how such a translation error could have been made as there are no apparent similarities between the Arabic expression used for 'good morning' and the phrases in Hebrew or English.\nAt the time, Google said its software looks for patterns in hundreds of millions of documents to decide and generate the best translation, but noted that the process is still difficult since the meaning of words depends the context in which they are used.",
            'The Guardian explains that Arabic can be particularly difficult to translate due to the sheer number of dialects that are used throughout the world. AI translation mistakes are common, especially when asked to translate specific words in unrelated languages.',
          ],
          comment:
            'Perhaps intermmediate languages are used (i.e. if no model has been trained to translate X to Y, use X->Z and then Z->Y), which accumulate errors.',
        },
        {
          label: 'Classification',
          confidence: 'potential',
          snippets: [
            'The Guardian explains that Arabic can be particularly difficult to translate due to the sheer number of dialects that are used throughout the world. AI translation mistakes are common, especially when asked to translate specific words in unrelated languages.',
            'The application can translate 40 languages in 1,800 directions (such as French to English, or Japanese to Spanish). ',
            'Artificial intelligence is behind Facebook\u2019s translation feature \u2014 when the company switched entirely to its own system last year, the software handled around 2 billion translations a day in 40 languages. Additional options allow users to report bad translations and rate translated text.',
          ],
          comment:
            'GIven the amount of supported languages for translation, a system must exist to detect the input language and classify amongst supported languages.',
        },
        {
          label: 'Multimodal Learning',
          confidence: 'potential',
          snippets: [
            'The man, a construction worker on the West Bank, posted a picture of himself leaning against a bulldozer like those that have been used in hit-and-run terrorist attacks, with a caption that correctly translates to "good morning"',
            'Israeli police became suspicious of the post since he was standing next to a bulldozer, a vehicle that has been used in earlier terror attacks, the website reported.\n\n',
            'The advantage for Facebook in using its own translation system is that it can have more control over people\u2019s news feeds, by understanding the meaning behind text and images. ',
          ],
          comment:
            'If image was also utilized to generate the translation, that would provide additional evidence to the mistranslation.',
        },
        {
          label: 'Image Classification',
          confidence: 'potential',
          snippets: [
            'The man, a construction worker on the West Bank, posted a picture of himself leaning against a bulldozer like those that have been used in hit-and-run terrorist attacks, with a caption that correctly translates to "good morning"',
            'Israeli police became suspicious of the post since he was standing next to a bulldozer, a vehicle that has been used in earlier terror attacks, the website reported.\n\n',
            'The advantage for Facebook in using its own translation system is that it can have more control over people\u2019s news feeds, by understanding the meaning behind text and images. ',
          ],
          comment:
            'If multimodal learning is used, perhaps the buldozer was recognized and its extracted keyword contributed to the bias in the NLP domain.',
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'The large number of dialects in use around the world means that Arabic is particularly difficult for machine translation services to handle, and mistakes are a regular occurrence.',
        report_idx: 1,
      },
      {
        snippet_text:
          'The man, a construction worker on the West Bank, posted a picture of himself leaning against a bulldozer like those that have been used in hit-and-run terrorist attacks, with a caption that correctly translates to "good morning"',
        report_idx: 1,
      },
      {
        snippet_text:
          "In the caption, he wrote an Arabic term meaning 'good morning', but a software malfunction translated it to mean 'attack them' in Hebrew and 'hurt them' in English.\n\n",
        report_idx: 2,
      },
      {
        snippet_text:
          "It was unclear how such a translation error could have been made as there are no apparent similarities between the Arabic expression used for 'good morning' and the phrases in Hebrew or English.\nAt the time, Google said its software looks for patterns in hundreds of millions of documents to decide and generate the best translation, but noted that the process is still difficult since the meaning of words depends the context in which they are used.",
        report_idx: 2,
      },
      {
        snippet_text:
          'Israeli police became suspicious of the post since he was standing next to a bulldozer, a vehicle that has been used in earlier terror attacks, the website reported.\n\n',
        report_idx: 4,
      },
      {
        snippet_text:
          'The error comes after Facebook announced in August that it shifted to neural machine translation, which uses convolutional neural networks (CNNs) and recurrent neural networks (RNNs) to automatically translate content across its site. Many tech companies including Facebook, Google and Microsoft have been pivoting towards neural machine translation and away from phrase-based, pattern-tracking statistical machine translation (SMT) to quicken and improve their translation software.',
        report_idx: 4,
      },
      {
        snippet_text:
          'Reports also pointed out that there is only one difference in lettering between the colloquial Arabic phrase for \u201cgood morning to you all\u201d and \u201churt them.\u201d\n\n',
        report_idx: 6,
      },
      {
        snippet_text:
          'Arabic is considered particularly difficult for many machine translation services due to the large number of different dialects in use around the world, on top of Modern Standard Arabic, the international form of the language.',
        report_idx: 8,
      },
      {
        snippet_text:
          'Machine translation mistakes are a regular occurrence for anyone using AI to translate languages, particularly ones with little relationship. Earlier this month, Chinese social network WeChat apologised after its own machine translation system translated a neutral phrase meaning \u201cblack foreigner\u201d as the n-word.\n\u201cWhen I ran the translator, the n-word came up and I was gobsmacked,\u201d said Ann James, who had been texting back and forth with a friend when the faulty translation appeared.',
        report_idx: 8,
      },
      {
        snippet_text:
          'Artificial intelligence is behind Facebook\u2019s translation feature \u2014 when the company switched entirely to its own system last year, the software handled around 2 billion translations a day in 40 languages. Additional options allow users to report bad translations and rate translated text.',
        report_idx: 9,
      },
      {
        snippet_text:
          'Facebook\u2019s translations are entirely powered by AI, and around 4.5 billion translations are made each day across the social network.\n',
        report_idx: 10,
      },
      {
        snippet_text:
          'The Guardian explains that Arabic can be particularly difficult to translate due to the sheer number of dialects that are used throughout the world. AI translation mistakes are common, especially when asked to translate specific words in unrelated languages.',
        report_idx: 12,
      },
      {
        snippet_text:
          "During this whole process, no Arabic speaker was consulted to double-check on the Facebook's automatic translation.\n",
        report_idx: 13,
      },
      {
        snippet_text:
          'The confusion came from the system misidentifying a similar Arabic word which means \u201cto hurt.\u201d',
        report_idx: 15,
      },
      {
        snippet_text:
          'Arabic speakers explained that English transliteration used by Facebook is not an actual word in Arabic but could look like the verb \u201cto hurt\u201d \u2013 even though any Arabic speaker could clearly see the transliteration did not match the translation.',
        report_idx: 17,
      },
      {
        snippet_text:
          'Google Translate also mistranslates the phrase, turning it into \u201cbecome them,\u201d likely because the literal translation of \u201cmorning\u201d in Arabic is \u201cday becoming.\u201d\n',
        report_idx: 17,
      },
      {
        snippet_text:
          'In August 2017, the platform fully transitioned from phrase-based translation to the more accurate neural network system.',
        report_idx: 17,
      },
      {
        snippet_text:
          'As well as the internationally used Modern Standard Arabic, the language has a large number of different dialects. This provides machines with a level of complexity that they don\u2019t often face when working with other languages.',
        report_idx: 21,
      },
      {
        snippet_text:
          'The application can translate 40 languages in 1,800 directions (such as French to English, or Japanese to Spanish). ',
        report_idx: 22,
      },
      {
        snippet_text:
          'The advantage for Facebook in using its own translation system is that it can have more control over people\u2019s news feeds, by understanding the meaning behind text and images. ',
        report_idx: 22,
      },
      {
        snippet_text:
          'However, AI translation depends on learning from the most common uses of words, and most bi- or multi-lingual speakers find that Google and Facebook translations are very lacking.',
        report_idx: 22,
      },
    ],
  },
  112: {
    taxonomies: {
      task: [
        {
          label: 'Gunshot Detection',
          confidence: 'known',
          snippets: [
            "The system was suppose to become attuned to the way sounds were heard in Troy's streets and differentiate among the brakes of a truck climbing the Hoosic Street hill, from a firecracker, actual shots and any other noise.",
            'It was expected to take a full year to fine-tune the acoustic devices so it would pick out the gunshots from other sounds. Tedesco said that never occurred.\n',
          ],
        },
        {
          label: 'Audio Localization',
          confidence: 'known',
          snippets: [
            'The system records all loud noises, Greene said. The computer uses at least three microphones to locate the gunshot within a 25-meter radius. Then, at SST\u2019s location in Newark, staff reviews each report to make sure the computer flags only gunshots.',
          ],
        },
      ],
      failure: [
        {
          label: 'Generalization Failure',
          confidence: 'known',
          snippets: [
            'It was expected to take a full year to fine-tune the acoustic devices so it would pick out the gunshots from other sounds. Tedesco said that never occurred.\n',
            'In about 14 percent of incidents in the zones, a ShotSpotter alert did not go off. Instead, residents notified police about gunfire.',
            'Police could find no evidence of a shooting at the scene about 80 percent of the time, said Joe Frank Picazo, the chief\u2019s assistant.\n',
            'The California-based company decided it could no longer offer its service to the city for free after police and administration officials balked at funding a system that they said worked less than 50 percent of the time and even missed all seven shots that were fired when a man was killed two months ago in downtown Fall River.',
            'Dupere said last summer that ShotSpotter had reported too many false alarms of gunfire while missing actual shots-fired incidents in Fall River. Dupere said then that he and other city officials decided the money would be better used to expand the police department\u2019s video surveillance system in the city.',
            'While other communities have reported using it relatively well, the system in Fall River never operated smoothly. Dupere said the city was told that the system was capable \u201cof doing things it just couldn\u2019t do.\u201d',
            'Greene also acknowledged at trial that \u201cwe freely admit that anything and everything in the environment can affect location and detection accuracy.\u201d\n',
            ' The sensors have been placed almost exclusively in predominantly Black and brown communities, while the white enclaves in the north and northwest of the city have no sensors at all, despite Chicago police data that shows gun crime is spread throughout the city.',
          ],
        },
        {
          label: 'Dataset Imbalance',
          confidence: 'potential',
          snippets: [
            'It was expected to take a full year to fine-tune the acoustic devices so it would pick out the gunshots from other sounds. Tedesco said that never occurred.\n',
            'In about 14 percent of incidents in the zones, a ShotSpotter alert did not go off. Instead, residents notified police about gunfire.',
            'Police could find no evidence of a shooting at the scene about 80 percent of the time, said Joe Frank Picazo, the chief\u2019s assistant.\n',
            'The California-based company decided it could no longer offer its service to the city for free after police and administration officials balked at funding a system that they said worked less than 50 percent of the time and even missed all seven shots that were fired when a man was killed two months ago in downtown Fall River.',
            'Dupere said last summer that ShotSpotter had reported too many false alarms of gunfire while missing actual shots-fired incidents in Fall River. Dupere said then that he and other city officials decided the money would be better used to expand the police department\u2019s video surveillance system in the city.',
          ],
        },
        {
          label: 'Inadequate Data Sampling',
          confidence: 'potential',
          snippets: [
            'In Reed\u2019s case, ShotSpotter failed to pinpoint the exact location of Reed\u2019s alleged crime near Turk and Buchanan streets, according to Greene\u2019s testimony. In fact, additional analysis conducted after the shooting, at the behest of police, determined the location was about a block away from where it was first reported.',
          ],
          comment: 'Low sampling resolution regarding sensor placement. ',
        },
        {
          label: 'Underspecification',
          confidence: 'potential',
          snippets: [
            'ShotSpotter, which the manufacturer claims helps reduce gun violence, can pinpoint \u201cprecise locations for first responders aiding victims, searching for evidence and interviewing witnesses,\u201d according to SST\u2019s website, which also noted the technology can report the number of shooters and shots fired.',
          ],
          comment: 'Marketed capabilities exceed functionality.',
        },
        {
          label: 'Concept Drift',
          confidence: 'potential',
          snippets: [
            'But the technology\u2019s accuracy depends on everything from topography, temperature, humidity and wind speed, as well as the trained ears of employees, according to Greene.',
            'Despite changes in topography in the Western Addition, from new buildings to taller trees, the 46 sensors there have not been retested since they were first put in, Greene testified last week.',
            'While other communities have reported using it relatively well, the system in Fall River never operated smoothly. Dupere said the city was told that the system was capable \u201cof doing things it just couldn\u2019t do.\u201d',
            ' The sensors have been placed almost exclusively in predominantly Black and brown communities, while the white enclaves in the north and northwest of the city have no sensors at all, despite Chicago police data that shows gun crime is spread throughout the city.',
          ],
        },
        {
          label: 'Misconfigured Threshold',
          confidence: 'potential',
          snippets: [
            'In about 14 percent of incidents in the zones, a ShotSpotter alert did not go off. Instead, residents notified police about gunfire.',
            'Police could find no evidence of a shooting at the scene about 80 percent of the time, said Joe Frank Picazo, the chief\u2019s assistant.\n',
            'The California-based company decided it could no longer offer its service to the city for free after police and administration officials balked at funding a system that they said worked less than 50 percent of the time and even missed all seven shots that were fired when a man was killed two months ago in downtown Fall River.',
          ],
        },
        {
          label: 'Underfitting',
          confidence: 'potential',
          snippets: [
            'Dupere said last summer that ShotSpotter had reported too many false alarms of gunfire while missing actual shots-fired incidents in Fall River. Dupere said then that he and other city officials decided the money would be better used to expand the police department\u2019s video surveillance system in the city.',
          ],
        },
      ],
      technology: [
        {
          label: 'Acoustic Triangulation',
          confidence: 'known',
          snippets: [
            'The system records all loud noises, Greene said. The computer uses at least three microphones to locate the gunshot within a 25-meter radius. Then, at SST\u2019s location in Newark, staff reviews each report to make sure the computer flags only gunshots.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          "TROY \u2014 The cops on the beat, the brass and the mayor all agree that the high-tech listening system that's supposed to identify the location of gunshots is ineffective.\n\n",
        report_idx: 1,
      },
      {
        snippet_text:
          "The displeasure with the acoustic surveillance system is so prevalent that Tedesco and Officer Robert Fitzgerald, the Troy Police Benevolent Association president, who usually disagree on issues, both agree that it's time is over.",
        report_idx: 1,
      },
      {
        snippet_text: '"It wasn\'t reliable," Tedesco said.',
        report_idx: 1,
      },
      {
        snippet_text:
          'It also was expensive, the chief said. Moving one of the listening devices, he said, cost $6,500.\n\n',
        report_idx: 1,
        comment: 'The device includes sensors that need to be placed at a location to cover it.',
      },
      {
        snippet_text:
          "The system was suppose to become attuned to the way sounds were heard in Troy's streets and differentiate among the brakes of a truck climbing the Hoosic Street hill, from a firecracker, actual shots and any other noise.",
        report_idx: 1,
      },
      {
        snippet_text:
          'The city rolled out the surveillance devices with great fanfare in late 2008. It was supposed to lead officers to the sites where shots were fired when not reported by the public.',
        report_idx: 1,
      },
      {
        snippet_text:
          'It was expected to take a full year to fine-tune the acoustic devices so it would pick out the gunshots from other sounds. Tedesco said that never occurred.\n',
        report_idx: 1,
      },
      {
        snippet_text:
          'Since 2008, the gunshot detection technology has recorded all loud noises and reported the ones thought to be gunshots to San Francisco police, so they can quickly respond.',
        report_idx: 2,
        comment: 'Too few gunshot samples to finetune with',
      },
      {
        snippet_text:
          'Manufactured by the company SST in Newark, Calif., ShotSpotter guarantees accuracy 80 percent of the time.',
        report_idx: 2,
      },
      {
        snippet_text:
          'In Reed\u2019s case, ShotSpotter failed to pinpoint the exact location of Reed\u2019s alleged crime near Turk and Buchanan streets, according to Greene\u2019s testimony. In fact, additional analysis conducted after the shooting, at the behest of police, determined the location was about a block away from where it was first reported.',
        report_idx: 2,
        comment: 'The device can pinpoint locations at a block-level precision',
      },
      {
        snippet_text:
          'The accuracy of the system is significant in Reed\u2019s case because police found nine shell casings at the scene, while ShotSpotter recorded 11 shots.\n',
        report_idx: 2,
      },
      {
        snippet_text:
          'Tong contended that Reed fired in self-defense at someone who first fired at him, hence the extra shots.\n\nHowever, prosecutor Christopher Ulrich said video and the ShotSpotter recordings showed Reed firing most of the gunshots, while the extra shots were fired by a co-defendant, not an enemy.',
        report_idx: 2,
        comment:
          'If the shot count was indeed false, then the classification threshold could be configured to be biased towards high recall, leading to false positives. No "shot intent identification" is mentioned to be one of the system\'s features, so this snippet does not indicate a failure.',
      },
      {
        snippet_text:
          'ShotSpotter, which the manufacturer claims helps reduce gun violence, can pinpoint \u201cprecise locations for first responders aiding victims, searching for evidence and interviewing witnesses,\u201d according to SST\u2019s website, which also noted the technology can report the number of shooters and shots fired.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Neither SST nor police would divulge how many sensors are in San Francisco, but Clark said there are about 25 per square mile in the outfitted neighborhoods.',
        report_idx: 2,
        comment:
          "Uniform distribution results in ~ 1 sensor per 65m2, but this doesn't comply with snippet #15. Perhaps more sensors are placed into e.g. populated regions.",
      },
      {
        snippet_text:
          'The system records all loud noises, Greene said. The computer uses at least three microphones to locate the gunshot within a 25-meter radius. Then, at SST\u2019s location in Newark, staff reviews each report to make sure the computer flags only gunshots.',
        report_idx: 2,
        comment: 'Does the staff just curate data for learning?',
      },
      {
        snippet_text:
          'But the technology\u2019s accuracy depends on everything from topography, temperature, humidity and wind speed, as well as the trained ears of employees, according to Greene.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Despite changes in topography in the Western Addition, from new buildings to taller trees, the 46 sensors there have not been retested since they were first put in, Greene testified last week.',
        report_idx: 2,
      },
      {
        snippet_text: 'They also keep track of possibly faulty sensors.',
        report_idx: 2,
      },
      {
        snippet_text:
          'ShotSpotter uses audio sensors to triangulate sound and pinpoint the direction of gunfire. The sound must hit three different sensors before the system will alert police.\n',
        report_idx: 3,
        comment: 'The three sensors minimum is probably to enable triangulating the source. ',
      },
      {
        snippet_text:
          'That helps, he said, because gunshots often sound like they\u2019re coming from a different direction than they are.\n',
        report_idx: 3,
      },
      {
        snippet_text:
          'In about 14 percent of incidents in the zones, a ShotSpotter alert did not go off. Instead, residents notified police about gunfire.',
        report_idx: 3,
        comment: 'I.e. a 86 % recall, at least 31 % precision.',
      },
      {
        snippet_text:
          'Police could find no evidence of a shooting at the scene about 80 percent of the time, said Joe Frank Picazo, the chief\u2019s assistant.\n',
        report_idx: 3,
        comment: 'Very low precision',
      },
      {
        snippet_text:
          'The California-based company decided it could no longer offer its service to the city for free after police and administration officials balked at funding a system that they said worked less than 50 percent of the time and even missed all seven shots that were fired when a man was killed two months ago in downtown Fall River.',
        report_idx: 4,
        comment: 'Very low recall',
      },
      {
        snippet_text:
          'Dupere said last summer that ShotSpotter had reported too many false alarms of gunfire while missing actual shots-fired incidents in Fall River. Dupere said then that he and other city officials decided the money would be better used to expand the police department\u2019s video surveillance system in the city.',
        report_idx: 4,
      },
      {
        snippet_text:
          'Four months later, however, Dupere said ShotSpotter has not improved. He told the Herald News that the system has about a 50 percent accuracy rate; far below the 90 percent mark the city was promised when it signed with the company five years ago. Dupere said ShotSpotter also missed all seven shots in the Feb. 14 murder of Maurice Timberlake, who was gunned down at the corner of South Main and Morgan streets.',
        report_idx: 4,
      },
      {
        snippet_text:
          'While other communities have reported using it relatively well, the system in Fall River never operated smoothly. Dupere said the city was told that the system was capable \u201cof doing things it just couldn\u2019t do.\u201d',
        report_idx: 4,
      },
      {
        snippet_text:
          'CHICAGO \u2013 A new study of Chicago\u2019s use of ShotSpotter, a surveillance system designed to detect gunfire, finds that the vast majority of alerts generated by the system turn up no evidence of gunfire or any gun-related crime. Instead, the ShotSpotter system sends police on thousands of unfounded and high-intensity deployments, which are focused almost exclusively in Black and Latinx communities. ',
        report_idx: 5,
      },
      {
        snippet_text:
          'ShotSpotter blankets neighborhoods with microphones in order to attempt to detect and locate the source of gunfire. It sends alerts of supposed gunfire immediately to local police. ShotSpotter claims to be 97% accurate. However, ShotSpotter has not released any scientifically-valid study to substantiate that figure. There are also no studies testing whether ShotSpotter can reliably tell the difference between the sound of gunshots and other noises like firecrackers, backfiring cars, construction noises, helicopters, and other loud, impulsive sounds.',
        report_idx: 5,
      },
      {
        snippet_text:
          'The study conducted by MacArthur Justice Center at Northwestern Pritzker School of Law reviewed ShotSpotter deployments for roughly 21 months (from July 1, 2019 through April 14, 2021) using data obtained from the City of Chicago. Their analysis found that 89% turned up no gun-related crime and 86% led to no report of any crime at all. In less than two years, there were more than 40,000 dead-end ShotSpotter deployments.',
        report_idx: 5,
      },
      {
        snippet_text:
          'The company\u2019s algorithms initially classified the sound as a firework. That weekend had seen widespread protests in Chicago in response to George Floyd\u2019s murder, and some of those protesting lit fireworks.',
        report_idx: 6,
      },
      {
        snippet_text:
          'But after the 11:46 p.m. alert came in, a ShotSpotter analyst manually overrode the algorithms and \u201creclassified\u201d the sound as a gunshot. Then, months later and after \u201cpost-processing,\u201d another ShotSpotter analyst changed the alert\u2019s coordinates to a location on South Stony Island Drive near where Williams\u2019 car was seen on camera.',
        report_idx: 6,
        comment: 'Results can be manually modified post-hoc, even at large intervals in the future',
      },
      {
        snippet_text:
          'Greene also acknowledged at trial that \u201cwe freely admit that anything and everything in the environment can affect location and detection accuracy.\u201d\n',
        report_idx: 6,
        comment: 'Greene is an employee of  the company that owns ShotSpoter',
      },
      {
        snippet_text:
          'The company has not allowed any independent testing of its algorithms, and there\u2019s evidence that the claims it makes in marketing materials about accuracy may not be entirely scientific.',
        report_idx: 6,
      },
      {
        snippet_text:
          'Over the years, ShotSpotter\u2019s claims about its accuracy have increased, from 80 percent accurate to 90 percent accurate to 97 percent accurate. According to Greene, those numbers aren\u2019t actually calculated by engineers, though.',
        report_idx: 6,
      },
      {
        snippet_text:
          ' The sensors have been placed almost exclusively in predominantly Black and brown communities, while the white enclaves in the north and northwest of the city have no sensors at all, despite Chicago police data that shows gun crime is spread throughout the city.',
        report_idx: 6,
      },
    ],
  },
  241: {
    taxonomies: {
      task: [
        {
          label: 'Robotic Manipulation',
          confidence: 'known',
          snippets: [
            'But in Russia, a seven-year-old child playing with a robot was forced to interrupt the game when the machine suddenly snapped one his fingers, breaking it.',
          ],
        },
      ],
      failure: [
        {
          label: 'Lack of Capability Control',
          confidence: 'known',
          snippets: [
            'A seven-year-old boy named Christopher, who, by the way, according to them, is among the top 30 chess players in Moscow under the age of nine, moved a piece on the chessboard earlier than he should, which led to the non-standard behavior of the robot.\nThe AI robotic arm grabbed the young player\u2019s index finger and squeezed his finger firmly. ',
          ],
          comment:
            "Force required to break a child's finger far exceeds force required to grip a chess piece.",
        },
        {
          label: 'Generalization Failure',
          confidence: 'potential',
          snippets: [],
          comment:
            "If the robot applies perception and the child's finger was misidentified as a piece.",
        },
        {
          label: 'Underspecification',
          confidence: 'potential',
          snippets: [],
          comment:
            'If the robot applies perception,  but human interaction was not accounted for; thus, no instances with human hands was present in the training data, from which to learn appropriate behaviour (e.g. halt / show error) .  Additionally, no "zero-shot"-like learning appears to take place here. \nFurther, if the robot does not perceive the chessboard but is informed of piece location directly (e.g. via signals wired directly from a piece - chessboard combo) then it has no way to measure obstruction and chances of injury, hence the underspecification & design failure.',
        },
      ],
      technology: [
        {
          label: 'Convolutional Neural Network',
          confidence: 'potential',
          snippets: [
            'But in Russia, a seven-year-old child playing with a robot was forced to interrupt the game when the machine suddenly snapped one his fingers, breaking it.',
          ],
        },
        {
          label: 'Visual Object Detection',
          confidence: 'potential',
          snippets: [
            'But in Russia, a seven-year-old child playing with a robot was forced to interrupt the game when the machine suddenly snapped one his fingers, breaking it.',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'But in Russia, a seven-year-old child playing with a robot was forced to interrupt the game when the machine suddenly snapped one his fingers, breaking it.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Yes, there are certain safety rules and the child, apparently, violated them and, when he made a move, did not notice that he had to wait.',
        report_idx: 1,
      },
      {
        snippet_text:
          "In a video shared by the news website, the boy appears to have his finger trapped by the robot's hand for a few seconds before a woman rushes to help him and pull at the robot to get the child's finger free. ",
        report_idx: 1,
      },
      {
        snippet_text:
          'A seven-year-old boy named Christopher, who, by the way, according to them, is among the top 30 chess players in Moscow under the age of nine, moved a piece on the chessboard earlier than he should, which led to the non-standard behavior of the robot.\nThe AI robotic arm grabbed the young player\u2019s index finger and squeezed his finger firmly. ',
        report_idx: 2,
      },
      {
        snippet_text:
          'The people around the boy immediately rushed to help, but did not prevent the consequences in the form of a broken finger.',
        report_idx: 2,
      },
      {
        snippet_text:
          'The child moved the figure, then the robot must be given time to react. But the boy was in a hurry and the robot grabbed him.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Sergey Smagin, vice-president of the Russian Chess Federation, told Baza the robot appeared to pounce after it took one of the boy\u2019s pieces. Rather than waiting for the machine to complete its move, the boy opted for a quick riposte, he said.',
        report_idx: 3,
      },
      {
        snippet_text:
          '\u201cThere are certain safety rules and the child, apparently, violated them. When he made his move, he did not realise he first had to wait,\u201d Smagin said.',
        report_idx: 3,
        comment:
          "Was the robot trying to grip a piece and misidentified the child's finger as the desired piece?",
      },
      {
        snippet_text:
          'Lazarev had a different account, saying the child had \u201cmade a move, and after that we need to give time for the robot to answer, but the boy hurried and the robot grabbed him\u201d.',
        report_idx: 3,
      },
    ],
  },
  149: {
    taxonomies: {
      task: [{ label: 'Market Forecasting', confidence: 'known', snippets: [] }],
      technology: [
        {
          label: 'Regression',
          confidence: 'known',
          snippets: [
            '"We\'ve determined the unpredictability in forecasting home prices far exceeds what we anticipated and continuing to scale Zillow Offers would result in too much earnings and balance-sheet volatility," said Rich Barton, Zillow\'s co-founder and CEO.',
          ],
        },
        {
          label: 'Multimodal Learning',
          confidence: 'known',
          snippets: [
            'For Zillow, one of the first steps in its decision to purchase any home is the "Zestimate" \u2014 a machine-learning-assisted estimate of a home\'s market value that is calculated by taking into account oodles of data about the property gathered from sources including tax and property records, homeowner-submitted details such as the addition of a bathroom or bedroom, and pictures of the house.',
          ],
        },
        {
          label: 'Optical Character Recognition',
          confidence: 'potential',
          snippets: [],
          comment: 'OCR could be used to extracting text from scanned documents.',
        },
        {
          label: 'Diverse Data',
          confidence: 'known',
          snippets: [
            'For Zillow, one of the first steps in its decision to purchase any home is the "Zestimate" \u2014 a machine-learning-assisted estimate of a home\'s market value that is calculated by taking into account oodles of data about the property gathered from sources including tax and property records, homeowner-submitted details such as the addition of a bathroom or bedroom, and pictures of the house.',
          ],
          comment:
            'Given the complexity of user-submitted data, some could be categorical rather than numerical or primitive data. E.g. company staff could map manually submitted information to such categorical / boolean variables.',
        },
        {
          label: 'Clustering',
          confidence: 'potential',
          snippets: [
            '"The Zestimate, facts you provided, and comparable homes nearby are used to calculate an estimated sale price," Zillow explained on its Zillow Offers webpage to homeowners who may be interested in selling their property to the company.',
          ],
          comment: 'The location cutoff could be determined by location-based clustering.',
        },
      ],
      failure: [
        {
          label: 'Concept Drift',
          confidence: 'known',
          snippets: [
            '"We\'ve determined the unpredictability in forecasting home prices far exceeds what we anticipated and continuing to scale Zillow Offers would result in too much earnings and balance-sheet volatility," said Rich Barton, Zillow\'s co-founder and CEO.',
          ],
        },
        {
          label: 'Incomplete Data Attribute Capture',
          confidence: 'potential',
          snippets: [
            'Still, "you can have a real estate agent look at a house and in one second pick out one critical factor of the valuation that just doesn\'t exist as ones and zeroes in any database," said Mike DelPrete, a real estate technology strategist and scholar-in-residence at the University of Colorado Boulder.',
            'For instance, if any homes Zillow purchased had hidden problems \u2014 such as a missed crack in the foundation \u2014 the Zestimate would not be able to predict those issues, he said.',
            'There are also many unquantifiable aspects of putting a price tag on a home, DelPrete noted, such as the value of living in the same neighborhood you grew up in or down the street from your parents. ',
            'These can vary from person to person, which makes it even harder to outsource a home valuation process to a computer.',
          ],
          comment:
            "If an agent can pinpoint flaws directly and the AI system can't, perhaps not all useful data in a house listing have been submitted to the system. E.g. house owners have to list all flaws, etc. House buyers have to specify area preference, area type preference (suburbs / city), etc.",
        },
        {
          label: 'Adversarial Data',
          confidence: 'potential',
          snippets: [
            'For instance, if any homes Zillow purchased had hidden problems \u2014 such as a missed crack in the foundation \u2014 the Zestimate would not be able to predict those issues, he said.',
          ],
        },
        {
          label: 'Underfitting',
          confidence: 'potential',
          snippets: [
            "It's one thing to build a model on a website that's often reasonably accurate. It's another to then try to use that model in the real world to make very costly bets \u2014 and do so at scale, according to Nima Shahbazi, a member of the team that won the Zestimate algorithm competition and CEO of Mindle.AI, which helps companies use AI to make predictions.",
          ],
        },
        {
          label: 'Dataset Imbalance',
          confidence: 'potential',
          snippets: [
            "But there simply isn't enough data for an algorithm to learn about longer busts and booms, according to Malik, who researches algorithmic pricing and has studied the Zestimate in particular.",
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          '"We\'ve determined the unpredictability in forecasting home prices far exceeds what we anticipated and continuing to scale Zillow Offers would result in too much earnings and balance-sheet volatility," said Rich Barton, Zillow\'s co-founder and CEO.',
        report_idx: 1,
      },
      {
        snippet_text:
          'But because of the price forecasting volatility, the company had to reconsider what the business would look like when it had grown larger, a size it needed to become in order to be consistently profitable, Barton and Parker wrote.',
        report_idx: 1,
      },
      {
        snippet_text:
          'In February, Zillow appeared so confident in its ability to use artificial intelligence to estimate the value of homes that it announced a new option: for certain homes, its so-called "Zestimate" would also represent an initial cash offer from the company to purchase the property.',
        report_idx: 2,
      },
      {
        snippet_text:
          "The fallout from this business venture doesn't just point to the challenges in buying and selling homes for profit, however. It also highlights how hard it is to use AI to help make expensive, real-world decisions, particularly in an ever-changing market that can be hard to predict months or even weeks out, and with prices that can be based as much on feel as on clear data points. ",
        report_idx: 2,
      },
      {
        snippet_text:
          'For Zillow, one of the first steps in its decision to purchase any home is the "Zestimate" \u2014 a machine-learning-assisted estimate of a home\'s market value that is calculated by taking into account oodles of data about the property gathered from sources including tax and property records, homeowner-submitted details such as the addition of a bathroom or bedroom, and pictures of the house.',
        report_idx: 2,
      },
      {
        snippet_text:
          '"The Zestimate, facts you provided, and comparable homes nearby are used to calculate an estimated sale price," Zillow explained on its Zillow Offers webpage to homeowners who may be interested in selling their property to the company.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Artificial intelligence can look at far more information, far more quickly, than a single human could when considering a fair price for a home, weighing factors like comparable home sales in an area, how many people are looking in a specific neighborhood and so on.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Still, "you can have a real estate agent look at a house and in one second pick out one critical factor of the valuation that just doesn\'t exist as ones and zeroes in any database," said Mike DelPrete, a real estate technology strategist and scholar-in-residence at the University of Colorado Boulder.',
        report_idx: 2,
      },
      {
        snippet_text:
          '"Three times a week, we create more than 500,000 unique valuation models, built atop 3.2 terabytes of data, to generate current Zestimates on more than 70 million US homes," the company wrote in a securities filing in 2011. More than 10 years later, the company publishes Zestimates for more than 100 million US homes.',
        report_idx: 2,
      },
      {
        snippet_text:
          "The Zestimate currently has a median error rate of 1.9% for homes that are on the market, Shelton said, meaning Zillow's estimates for half the homes on the market come within 1.9% of the actual selling price. That percentage of error is much higher -- 6.9%, according to Shelton -- for off-market homes. Being off by as little as 1.9% on a property with a Zestimate of $500,000 is still nearly $10,000; that figure multiplies over many, many homes in different cities across the United States.",
        report_idx: 2,
      },
      {
        snippet_text:
          'For instance, if any homes Zillow purchased had hidden problems \u2014 such as a missed crack in the foundation \u2014 the Zestimate would not be able to predict those issues, he said.',
        report_idx: 2,
      },
      {
        snippet_text:
          "It's one thing to build a model on a website that's often reasonably accurate. It's another to then try to use that model in the real world to make very costly bets \u2014 and do so at scale, according to Nima Shahbazi, a member of the team that won the Zestimate algorithm competition and CEO of Mindle.AI, which helps companies use AI to make predictions.",
        report_idx: 2,
        comment:
          'Perhaps additional partitioning of the learning procedure is required, other than location-based; maybe one single model for all houses, regions, ... is too complex.',
      },
      {
        snippet_text:
          '"There are many different parts between a very decent model and deploying the model into production that can go wrong," he said.\n',
        report_idx: 2,
      },
      {
        snippet_text:
          'But Nikhil Malik, an assistant professor of marketing at the University of Southern California, said algorithms tend to be good at making fine-grained, short-term predictions, such as for predicting stock prices a second in advance. ',
        report_idx: 2,
      },
      {
        snippet_text:
          "But there simply isn't enough data for an algorithm to learn about longer busts and booms, according to Malik, who researches algorithmic pricing and has studied the Zestimate in particular.",
        report_idx: 2,
      },
      {
        snippet_text:
          'There are also many unquantifiable aspects of putting a price tag on a home, DelPrete noted, such as the value of living in the same neighborhood you grew up in or down the street from your parents. ',
        report_idx: 2,
      },
      {
        snippet_text:
          'These can vary from person to person, which makes it even harder to outsource a home valuation process to a computer.',
        report_idx: 2,
      },
    ],
  },
  10: {
    taxonomies: {
      failure: [
        {
          label: 'Underspecification',
          confidence: 'known',
          snippets: [
            '\u201cYou\u2019re waiting on your job to control your life,\u201d she said, with the scheduling software used by her employer dictating everything from \u201chow much sleep Gavin will get to what groceries I\u2019ll be able to buy this month.\u201d',
            'Along with virtually every major retail and restaurant chain, Starbucks relies on software that choreographs workers in precise, intricate ballets, using sales patterns and other data to determine which of its 130,000 baristas are needed in its thousands of locations and exactly when.',
            'Among other changes, the company said it would end the practice of "clopening," when an employee responsible for closing a store late at night is also assigned to open it early in the morning.',
            "In a follow-up piece, the author, Jodi Kantor, points directly to Kronos' scheduling software as the root of the problem.",
          ],
          comment: 'System is not designed to operate harmoniously with employees.',
        },
        {
          label: 'Tuning Issues',
          confidence: 'potential',
          snippets: [
            'In addition, Kronos is improving a feature meant to help give employees more control over their schedules: Though the software already incorporates employee availability and preferences into its scheduling calculations, improvements to a shift-swapping feature on its employee-facing web and mobile apps will theoretically allow employees to work around conflicts among themselves.',
          ],
          comment: 'Weight of employee preferences is udnervalued in the prediction.',
        },
        {
          label: 'Misconfigured Aggregation',
          confidence: 'potential',
          snippets: [
            'In addition, Kronos is improving a feature meant to help give employees more control over their schedules: Though the software already incorporates employee availability and preferences into its scheduling calculations, improvements to a shift-swapping feature on its employee-facing web and mobile apps will theoretically allow employees to work around conflicts among themselves.',
          ],
          comment:
            'Employee preference decision component is aggregated with very small contribution weight.',
        },
      ],
      technology: [
        {
          label: 'Regression',
          confidence: 'potential',
          snippets: [
            '\u201cYou\u2019re waiting on your job to control your life,\u201d she said, with the scheduling software used by her employer dictating everything from \u201chow much sleep Gavin will get to what groceries I\u2019ll be able to buy this month.\u201d',
          ],
          comment:
            'Potentially the number of required staff and/or some numeric measure of traffic is estimated for each branch?',
        },
        {
          label: 'Diverse Data',
          confidence: 'potential',
          snippets: [
            "In a follow-up piece, the author, Jodi Kantor, points directly to Kronos' scheduling software as the root of the problem.",
          ],
          comment:
            'Diverse types of input data could involve high-level attributes / categories / conceptual information on employees.',
        },
      ],
      task: [
        {
          label: 'Market Forecasting',
          confidence: 'known',
          snippets: [],
        },
        { label: 'Scheduling', confidence: 'known', snippets: [] },
      ],
    },
    snippets: [
      {
        snippet_text:
          '\u201cYou\u2019re waiting on your job to control your life,\u201d she said, with the scheduling software used by her employer dictating everything from \u201chow much sleep Gavin will get to what groceries I\u2019ll be able to buy this month.\u201d',
        report_idx: 1,
      },
      {
        snippet_text:
          'Along with virtually every major retail and restaurant chain, Starbucks relies on software that choreographs workers in precise, intricate ballets, using sales patterns and other data to determine which of its 130,000 baristas are needed in its thousands of locations and exactly when.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Among other changes, the company said it would end the practice of "clopening," when an employee responsible for closing a store late at night is also assigned to open it early in the morning.',
        report_idx: 2,
      },
      {
        snippet_text:
          "In a follow-up piece, the author, Jodi Kantor, points directly to Kronos' scheduling software as the root of the problem.",
        report_idx: 3,
      },
      {
        snippet_text:
          "To that end, earlier this month at a retail conference in Philadelphia, the company announced that it's working on a new plug-in that will give managers better insight into workers' schedule stability, equity of hours worked among employees, and the consistency of schedules from week to week.",
        report_idx: 3,
      },
      {
        snippet_text:
          'In addition, Kronos is improving a feature meant to help give employees more control over their schedules: Though the software already incorporates employee availability and preferences into its scheduling calculations, improvements to a shift-swapping feature on its employee-facing web and mobile apps will theoretically allow employees to work around conflicts among themselves.',
        report_idx: 3,
      },
      {
        snippet_text:
          'But some retailers, DeWitt pointed out, are uncomfortable making workers use an app outside of work hours; indeed, the practice could be seen as a shift of management responsibilities onto lower-paid individuals.',
        report_idx: 3,
      },
      {
        snippet_text:
          "O'Reilly-Green is among millions of retail and restaurant workers at the focus of a raging national debate over fair hours, pay and the use of shift scheduling software -- sometimes called staff scheduling software -- from big vendors like ADP, SAP and Kronos to set worker hours based on factors such as store traffic and weather.",
        report_idx: 4,
      },
    ],
  },
  144: {
    taxonomies: {
      task: [
        {
          label: 'Hate Speech Detection',
          confidence: 'known',
          snippets: [
            "YouTube's overeager AI might have misinterpreted a conversation about chess as racist language.\n",
            "Using the software on over 680,000 comments taken from five popular YouTube chess channels, they found 82 percent of the comments flagged in a sample set didn't include any obvious racist language or hate speech.",
          ],
        },
      ],
      technology: [
        {
          label: 'Classification',
          confidence: 'known',
          snippets: [
            "YouTube's overeager AI might have misinterpreted a conversation about chess as racist language.\n",
            "Using the software on over 680,000 comments taken from five popular YouTube chess channels, they found 82 percent of the comments flagged in a sample set didn't include any obvious racist language or hate speech.",
          ],
        },
        {
          label: 'Distributional Learning',
          confidence: 'known',
          snippets: [
            "More than 80 percent of the comments the programs flagged lacked any racist language, but they did include chess terms like 'black,' 'white,' 'attack' and 'threat'",
            "The software's accuracy depends on the examples its given, KhudaBukhsh said, and the training data sets for YouTube's classifiers 'likely include few examples of chess talk, leading to misclassification.'",
          ],
        },
      ],
      failure: [
        {
          label: 'Distributional Bias',
          confidence: 'known',
          snippets: [
            "More than 80 percent of the comments the programs flagged lacked any racist language, but they did include chess terms like 'black,' 'white,' 'attack' and 'threat'",
            "The software's accuracy depends on the examples its given, KhudaBukhsh said, and the training data sets for YouTube's classifiers 'likely include few examples of chess talk, leading to misclassification.'",
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          "YouTube's overeager AI might have misinterpreted a conversation about chess as racist language.\n",
        report_idx: 1,
      },
      {
        snippet_text:
          "Computer scientists at Carnegie Mellon suspect Radic's discussion of 'black vs. white' with a grandmaster accidentally triggered YouTube's AI filters.\n",
        report_idx: 1,
      },
      {
        snippet_text:
          "Running simulations with software trained to detect hate speech, they found more than 80 percent of chess videos flagged for hate speech lacked any\u2014but did include terms like 'black,' 'white,' 'attack' and 'threat.'",
        report_idx: 1,
      },
      {
        snippet_text:
          "In addition to human moderators, YouTube uses AI algorithms to ferret out prohibited content\u2014but if they're not fed the right examples to provide context, those algorithms can flag benign videos.",
        report_idx: 1,
      },
      {
        snippet_text:
          "More than 80 percent of the comments the programs flagged lacked any racist language, but they did include chess terms like 'black,' 'white,' 'attack' and 'threat'",
        report_idx: 1,
      },
      {
        snippet_text:
          "Using the software on over 680,000 comments taken from five popular YouTube chess channels, they found 82 percent of the comments flagged in a sample set didn't include any obvious racist language or hate speech.",
        report_idx: 1,
      },
      {
        snippet_text:
          "The software's accuracy depends on the examples its given, KhudaBukhsh said, and the training data sets for YouTube's classifiers 'likely include few examples of chess talk, leading to misclassification.'",
        report_idx: 1,
      },
    ],
  },
  259: {
    taxonomies: {
      task: [
        {
          label: 'Social Media Content Generation',
          confidence: 'known',
          snippets: [
            'The bot, which Kilcher called GPT-4chan, \u201cthe most horrible model on the internet\u201d\u2014a reference to GPT-3, a language model developed by Open AI that uses deep learning to produce text\u2014was shockingly effective and replicated the tone and feel of 4chan posts. ',
          ],
        },
      ],
      technology: [
        {
          label: 'Transformer',
          confidence: 'known',
          snippets: [
            'The bot, which Kilcher called GPT-4chan, \u201cthe most horrible model on the internet\u201d\u2014a reference to GPT-3, a language model developed by Open AI that uses deep learning to produce text\u2014was shockingly effective and replicated the tone and feel of 4chan posts. ',
          ],
        },
        {
          label: 'Distributional Learning',
          confidence: 'known',
          snippets: [
            'The bot, which Kilcher called GPT-4chan, \u201cthe most horrible model on the internet\u201d\u2014a reference to GPT-3, a language model developed by Open AI that uses deep learning to produce text\u2014was shockingly effective and replicated the tone and feel of 4chan posts. ',
          ],
        },
      ],
      failure: [
        {
          label: 'Unsafe Exposure or Access',
          confidence: 'known',
          snippets: [
            'He said that he feels he\u2019s made that clear, but that he wanted his results to be reproducible and that\u2019s why he posted the model to Hugging Face.',
            'Kathryn Cramer, a Complex Systems & Data Science graduate student at the University of Vermont, pointed out that GPT-3 has guardrails that prevent it from being used to build this kind of racist bot and that Kilcher had to use GPT-J to build his system. ',
            ' But the reality is that he essentially invented a hate speech machine, used it 30,000 times and released it into the wild. And yeah, I understand being annoyed with safety regulations but that\u2019s not a legitimate response to that annoyance.\u201d',
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          'The bot, which Kilcher called GPT-4chan, \u201cthe most horrible model on the internet\u201d\u2014a reference to GPT-3, a language model developed by Open AI that uses deep learning to produce text\u2014was shockingly effective and replicated the tone and feel of 4chan posts. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'AI researchers viewed Kilcher\u2019s video as more than just a YouTube prank. For them, it was an unethical experiment using AI. \u201cThis experiment would never pass a human research #ethics board,\u201d Lauren Oakden-Rayner, the director of medical imaging research at the Royal Adelaide Hospital and a senior research fellow at the Australian Institute for Machine Learning, said in a Twitter thread. ',
        report_idx: 1,
      },
      {
        snippet_text:
          'After AI researchers alerted Hugging Face to the harmful nature of the bot, the site gated the model and people have been unable to download it.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Kilcher explained in his video, and Delangue cited in his response, that one of the things that made GPT4-Chan worthwhile was its ability to outperform other similar bots in AI tests designed to measure \u201ctruthfulness.\u201d',
        report_idx: 1,
      },
      {
        snippet_text:
          '\u201cBuilding a system capable of creating unspeakably horrible content, using it to churn out tens of thousands of mostly toxic posts on a real message board, and then releasing it to the world so that anybody else can do the same, it just seems\u2014I don\u2019t know\u2014not right,\u201d Arthur Holland Michel, an AI researcher and writer for the International Committee of the Red Cross, told Motherboard.',
        report_idx: 1,
      },
      {
        snippet_text:
          '\u201cIt\u2019s actually quite hard to make GPT-4chan say something targeted,\u201d he said. \u201cUsually, it will misbehave in odd ways and is very unsuitable for running targeted anything.',
        report_idx: 1,
      },
      {
        snippet_text:
          '\u201cThis is a good opportunity to discuss not the harm, but the fact that this harm is so obviously foreseeable, and that his response of \u2018show me where it has DONE harm\u2019 misses the point and is inadequate,\u201d they said.',
        report_idx: 1,
      },
      {
        snippet_text:
          'And there is a balancing act to be struck between raising awareness directed at problems, and giving attention to somebody whose only apparent model for mattering in the world is \u2018pay attention to me!\u2019\u201d ',
        report_idx: 1,
      },
      {
        snippet_text:
          'He said that he feels he\u2019s made that clear, but that he wanted his results to be reproducible and that\u2019s why he posted the model to Hugging Face.',
        report_idx: 1,
      },
      {
        snippet_text:
          'Kathryn Cramer, a Complex Systems & Data Science graduate student at the University of Vermont, pointed out that GPT-3 has guardrails that prevent it from being used to build this kind of racist bot and that Kilcher had to use GPT-J to build his system. ',
        report_idx: 1,
      },
      {
        snippet_text:
          ' But the reality is that he essentially invented a hate speech machine, used it 30,000 times and released it into the wild. And yeah, I understand being annoyed with safety regulations but that\u2019s not a legitimate response to that annoyance.\u201d',
        report_idx: 1,
      },
    ],
  },
  221: {
    taxonomies: {
      technology: [
        {
          label: 'Convolutional Neural Network',
          confidence: 'potential',
          snippets: [
            "The vehicle's sensors apparently failed to detect a bright yellow road repair truck, despite its large reflectors and digital sign, and slammed into its rear.",
          ],
        },
        {
          label: 'Image Segmentation',
          confidence: 'known',
          snippets: [],
        },
        {
          label: 'Visual Object Detection',
          confidence: 'potential',
          snippets: [],
          comment: 'Potentially subtask of segmentation.',
        },
        {
          label: 'Classification',
          confidence: 'potential',
          snippets: [],
          comment: 'Potentially subtask of segmentation.',
        },
      ],
      failure: [
        {
          label: 'Misuse',
          confidence: 'known',
          snippets: [
            'Above all, it should not allow a driver to feel so confident it will handle everything to the point this person confesses to the police that was exactly the case.',
          ],
          comment: 'Driver should not use autopilot without supervision.',
        },
        {
          label: 'Generalization Failure',
          confidence: 'known',
          snippets: [
            'Theoretically, the system should be able to see a bright yellow emergency truck right in front of it. It should be able to brake the car to prevent a crash.',
          ],
        },
      ],
      task: [
        {
          label: 'Autonomous Driving',
          confidence: 'known',
          snippets: [
            "The vehicle's sensors apparently failed to detect a bright yellow road repair truck, despite its large reflectors and digital sign, and slammed into its rear.",
          ],
        },
      ],
    },
    snippets: [
      {
        snippet_text:
          "The vehicle's sensors apparently failed to detect a bright yellow road repair truck, despite its large reflectors and digital sign, and slammed into its rear.",
        report_idx: 1,
      },
      {
        snippet_text:
          'However, 20 seconds later a blue BMW driven by a 40-year-old man, also surnamed Chiang (\u6c5f), struck Yu, inflicting severe injuries.',
        report_idx: 1,
      },
      {
        snippet_text:
          "Police said breathalyzer tests revealed the drivers' blood alcohol level to be zero. ",
        report_idx: 1,
      },
      {
        snippet_text:
          ' The Tesla driver admitted to officers that after he had switched on the autopilot feature, he was not paying attention to the situation on the road, while the BMW driver said he had not noticed the worker until it was too late to stop.',
        report_idx: 1,
        comment: 'Human error',
      },
      {
        snippet_text:
          'Officers reminded the public that driver assistance systems are auxiliary functions and urged motorists to remain alert at all times when using automatic driving technology.',
        report_idx: 1,
      },
      {
        snippet_text:
          'According to UDN and the pictures shared by the National Highway Police Bureau, it was a bright yellow truck with large reflectors. ',
        report_idx: 2,
      },
      {
        snippet_text:
          'It also had a digital warning sign to prevent precisely what happened with the Model 3. ',
        report_idx: 2,
      },
      {
        snippet_text:
          'Theoretically, the system should be able to see a bright yellow emergency truck right in front of it. It should be able to brake the car to prevent a crash.',
        report_idx: 2,
      },
      {
        snippet_text:
          'Above all, it should not allow a driver to feel so confident it will handle everything to the point this person confesses to the police that was exactly the case.',
        report_idx: 2,
      },
    ],
  },
};
