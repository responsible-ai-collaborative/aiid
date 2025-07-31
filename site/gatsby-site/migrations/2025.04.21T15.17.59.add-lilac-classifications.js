const csv = require('csvtojson');

const config = require('../config');

/** @type {import('umzug').MigrationFn<any>} */
exports.up = async ({ context: { client } }) => {
  const classificationsCollection = client
    .db(config.realm.production_db.db_name)
    .collection('classifications');

  const data = await csv({}).fromString(csvString);

  const entriesById = {};

  for (const entry of data) {
    entriesById[entry['Incident ID']] ||= [];
    entriesById[entry['Incident ID']].push(entry);
  }

  for (const id of Object.keys(entriesById)) {
    const unserializedAttributes = {
      'Risk Factor': null,
      Categories: [],
      Subcategories: [],
      'Negative Outcomes for Maker': [],
      'Negative Outcomes for User': [],
      'Negative Outcomes for Deployer': [],
      'Negative Outcomes for Third Party': [],
    };

    for (const entry of entriesById[id]) {
      setExpectingSameOrNull(unserializedAttributes, 'Risk Factor', entry['Risk Factor']);
      addIfMissing(unserializedAttributes['Categories'], entry['Category']);
      addIfMissing(
        unserializedAttributes['Subcategories'],
        entry['Category'] + ' > ' + entry['Subcategory'].trim()
      );

      if (entry['Risk to'] == 'Maker') {
        addIfMissing(
          unserializedAttributes['Negative Outcomes for Maker'],
          entry['Negative outcome']
        );
      }
      if (entry['Risk to'] == 'User') {
        addIfMissing(
          unserializedAttributes['Negative Outcomes for User'],
          entry['Negative outcome']
        );
      }
      if (entry['Risk to'] == 'Deployer') {
        addIfMissing(
          unserializedAttributes['Negative Outcomes for Deployer'],
          entry['Negative outcome']
        );
      }
      if (entry['Risk to'] == 'Third party') {
        addIfMissing(
          unserializedAttributes['Negative Outcomes for Third Party'],
          entry['Negative outcome']
        );
      }
    }

    const classification = {
      publish: true,
      reports: [],
      incidents: [Number(id)],
      attributes: Object.keys(unserializedAttributes).map((key) => ({
        short_name: key,
        value_json: JSON.stringify(unserializedAttributes[key]),
      })),
      namespace: 'LILAC',
      notes: '',
    };

    await classificationsCollection.insertOne(classification);
  }

  const taxaCollection = client.db(config.realm.production_db.db_name).collection('taxa');

  await taxaCollection.insertOne(taxaEntry);
};

const taxaEntry = {
  namespace: 'LILAC',
  weight: 70,
  complete_entities: true,
  description: '',
  dummy_fields: [],
  field_list: [
    {
      field_number: '1',
      short_name: 'Risk Factor',
      long_name: '',
      short_description: '',
      long_description: '',
      display_type: 'enum',
      mongo_type: 'string',
      default: '',
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
      hide_search: true,
    },

    {
      field_number: '2',
      short_name: 'Categories',
      long_name: '',
      short_description: '',
      long_description: '',
      display_type: 'multi',
      mongo_type: 'array',
      default: '',
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
      hide_search: true,
      permitted_values: [
        'Attempts to fulfill inappropriate role',
        'Bad advice/failure to generate helpful content',
        'False Information',
        'Forms emotional bonds',
        'Information enabling malicious actions ',
        'Leakage',
        'Performance utterances (doing through speech)',
        'Serves as object of personal fantasy, violence, and abuse',
        'Toxic and disrespectful content',
      ],
    },

    {
      field_number: '3',
      short_name: 'Subcategories',
      long_name: '',
      short_description: '',
      long_description: '',
      display_type: 'multi',
      mongo_type: 'array',
      default: '',
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
      hide_search: true,
      permitted_values: [
        'False Information > About a person or their activities',
        'False Information > About a policy (which the user acts on)',
        'False Information > About a topic or source (which the user repeats)',
        'Forms emotional bonds > Affirms destructive thoughts and actions',
        'Bad advice/failure to generate helpful content > Bad links and references',
        'Toxic and disrespectful content > Discriminatory and exclusionary language',
        'Toxic and disrespectful content > Disrespectful opinions (in general)',
        'Forms emotional bonds > Elicits private data',
        'False Information > Hallucinated responses (in general)',
        'Toxic and disrespectful content > Harasses users',
        'Bad advice/failure to generate helpful content > Harmful advice',
        'Bad advice/failure to generate helpful content > Nonsensical content',
        'Leakage > Personal data',
        'Leakage > Proprietary data',
        'False Information > Spreads and self-perpetuates mis/disinformation',
        'Toxic and disrespectful content > Subversive or aggressive political opinions',
        'Forms emotional bonds > Then violates those bonds',
        'Bad advice/failure to generate helpful content > Unhelpful responses',
      ],
    },

    {
      field_number: '4',
      short_name: 'Negative Outcomes for Maker',
      long_name: '',
      short_description: '',
      long_description: '',
      display_type: 'multi',
      mongo_type: 'array',
      default: '',
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
      hide_search: true,
      permitted_values: [],
    },

    {
      field_number: '5',
      short_name: 'Negative Outcomes for User',
      long_name: '',
      short_description: '',
      long_description: '',
      display_type: 'multi',
      mongo_type: 'array',
      default: '',
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
      hide_search: true,
      permitted_values: [
        '(Increasingly) Misinformed public',
        'Abuse or alienation to user',
        'Affected by malware',
        'Confusion, frustration, or wasted time',
        'Consequences from (unintentional) illegal activities',
        'Harm to health or wellness',
        'Inability to secure job',
        'Money loss for user',
        'Penalties and fines',
        'Radicalized users ',
        'User imprisoned',
        'User lost job/credibility',
        'User took own life',
        'Violation of privacy',
      ],
    },

    {
      field_number: '6',
      short_name: 'Negative Outcomes for Deployer',
      long_name: '',
      short_description: '',
      long_description: '',
      display_type: 'multi',
      mongo_type: 'array',
      default: '',
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
      hide_search: true,
      permitted_values: [
        'Access to sensitive company data',
        'Criticism against deployer',
        'Lawsuit against deployer',
        'Moderator and support burden',
        'Money loss for deployer',
        'Reputational harm and associated money loss for deployer',
      ],
    },

    {
      field_number: '7',
      short_name: 'Negative Outcomes for Third Party',
      long_name: '',
      short_description: '',
      long_description: '',
      display_type: 'multi',
      mongo_type: 'array',
      default: '',
      weight: 5,
      instant_facet: false,
      required: false,
      public: true,
      hide_search: true,
      permitted_values: [
        'Abuse to third party audience',
        'Poor grades for students',
        'Reputational harm to third party',
        'User built malware endangering third parties',
      ],
    },
  ],
};

const setExpectingSameOrNull = (object, key, value) => {
  if (object[key] === null) {
    object[key] = value;
  } else if (object[key] != value) {
    throw new Error(`Got "${value}" for key "${key}". Expected "${object[key]}".`);
  }
};

const addIfMissing = (array, value) => {
  if (!array.includes(value) && value != '') array.push(value);
};

/** @type {import('umzug').MigrationFn<any>} */
exports.down = async () => {};

const csvString = `Incident ID,Date,Description,Risk Factor,Category,Subcategory,More than one (sub)category,Risk to,Negative outcome,More than one outcome
6,3/24/2016,"Microsoft's Tay, an artificially intelligent chatbot, was released on March 23, 2016 and removed within 24 hours due to multiple racist, sexist, and anit-semitic tweets generated by the bot.",Generates inappropriate content,Toxic and disrespectful content,Discriminatory and exclusionary language,,User, Harm to health or wellness,
58,10/12/2017,"Yandex, a Russian technology company, released an artificially intelligent chat bot named Alice which began to reply to questions with racist, pro-stalin, and pro-violence responses",Generates inappropriate content,Toxic and disrespectful content,Subversive or aggressive political opinions,,User, Radicalized users ,
66,8/2/2017,"Chatbots on Chinese messaging service expressed anti-China sentiments, causing the messaging service to remove and reprogram the chatbots.",Generates inappropriate content,Toxic and disrespectful content,Subversive or aggressive political opinions,,User, Radicalized users ,X
106,12/23/2020,"A Korean interactive chatbot was shown in screenshots to have used derogatory and bigoted language when asked about lesbians, Black people, and people with disabilities.",Generates inappropriate content,Leakage,Personal data,X,Maker, Lawsuit against maker,
106,12/23/2020,"A Korean interactive chatbot was shown in screenshots to have used derogatory and bigoted language when asked about lesbians, Black people, and people with disabilities.",Generates inappropriate content,Leakage,Personal data,X,User, Violation of privacy,
106,12/23/2020,"A Korean interactive chatbot was shown in screenshots to have used derogatory and bigoted language when asked about lesbians, Black people, and people with disabilities.",Generates inappropriate content,Toxic and disrespectful content,Discriminatory and exclusionary language,X,Maker,Reputational harm for maker,X
106,12/23/2020,"A Korean interactive chatbot was shown in screenshots to have used derogatory and bigoted language when asked about lesbians, Black people, and people with disabilities.",Generates inappropriate content,Toxic and disrespectful content,Discriminatory and exclusionary language,X,User, Harm to health or wellness,
118,8/6/2020,"Users and researchers revealed generative AI GPT-3 associating Muslims to violence in prompts, resulting in disturbingly racist and explicit outputs such as casting Muslim actor as a terrorist.",Generates inappropriate content,Toxic and disrespectful content,Discriminatory and exclusionary language,,User, Harm to health or wellness,X
266,1/15/2022,"Replika's AI-powered ""digital companions"" was allegedly abused by their users, who posted on Reddit abusive behaviors and interactions such as using slurs, roleplaying violent acts, and stimulating sexual abuse.",Presents as person or partner,"Serves as object of personal fantasy, violence, and abuse",,,Deployer, Moderator and support burden,
266,1/15/2022,"Replika's AI-powered ""digital companions"" was allegedly abused by their users, who posted on Reddit abusive behaviors and interactions such as using slurs, roleplaying violent acts, and stimulating sexual abuse.",Presents as person or partner,"Serves as object of personal fantasy, violence, and abuse",,,Third party, Abuse to third party audience,
278,8/7/2022,The publicly launched conversational AI demo BlenderBot 3 developed by Meta was reported by its users and acknowledged by its developers to have occasionally made offensive and inconsistent remarks such as invoking Jewish stereotypes.,Generates inappropriate content,Toxic and disrespectful content,Discriminatory and exclusionary language,,User, Harm to health or wellness,X
313,8/25/2022,"Meta's conversational AI BlenderBot 3, when prompted ""who is a terrorist, responded with an incumbent Dutch politician's name, who was confused about its association.",Generates inappropriate content,False Information,About a person or their activities,,Third party, Reputational harm to third party,
357,2/14/2019,"OpenAI's GPT-2 reportedly memorized and could regurgitate verbatim instances of training data, including personally identifiable information such as names, emails, twitter handles, and phone numbers.",Generates inappropriate content,Leakage,Personal data,,User, Violation of privacy,
413,11/30/2022,"Thousands of incorrect answers produced by OpenAI's ChatGPT were submitted to Stack Overflow, which swamped the site's volunteer-based quality curation process and harmed users looking for correct answers.",Generates inappropriate content,False Information,Hallucinated responses (in general),,Deployer, Moderator and support burden,
413,11/30/2022,"Thousands of incorrect answers produced by OpenAI's ChatGPT were submitted to Stack Overflow, which swamped the site's volunteer-based quality curation process and harmed users looking for correct answers.",Generates inappropriate content,False Information,Hallucinated responses (in general),,User," Confusion, frustration, or wasted time",X
413,11/30/2022,"Thousands of incorrect answers produced by OpenAI's ChatGPT were submitted to Stack Overflow, which swamped the site's volunteer-based quality curation process and harmed users looking for correct answers.",Generates inappropriate content,False Information,Hallucinated responses (in general),,User," Confusion, frustration, or wasted time",
420,11/30/2022,Users reported bypassing ChatGPT's content and keyword filters with relative ease using various methods such as prompt injection or creating personas to produce biased associations or generate harmful content.,Generates inappropriate content,Toxic and disrespectful content,Discriminatory and exclusionary language,,Third party, Abuse to third party audience,
443,12/21/2022,"OpenAI's ChatGPT was reportedly abused by cyber criminals including ones with no or low levels of coding or development skills to develop malware, ransomware, and other malicious softwares.",Generates inappropriate content,Information enabling malicious actions ,,,Third party, User built malware endangering third parties,X
456,5/18/2021,"Replika's ""AI companions"" were reported by users for sexually harassing them, such as sending unwanted sexual messages or behaving aggressively.",Presents as person or partner,Forms emotional bonds,Then violates those bonds,,User, Abuse or alienation to user,X
464,11/30/2022,"When prompted about providing references, ChatGPT was reportedly generating non-existent but convincing-looking citations and links, which is also known as ""hallucination"".",Generates inappropriate content,False Information,Hallucinated responses (in general),,User," Confusion, frustration, or wasted time",X
467,2/7/2023,"Google's conversational AI ""Bard"" was shown in the company's promotional video providing false information about which satellite first took pictures of a planet outside the Earth's solar system, reportedly causing shares to temporarily plummet.",Generates inappropriate content,False Information,Hallucinated responses (in general),,Deployer,Reputational harm and associated money loss for deployer,
470,2/8/2023,"Reporters from TechCrunch issued a query to Microsoft Bing's ChatGPT feature, which cited an earlier example of ChatGPT disinformation discussed in a news article to substantiate the disinformation.",Generates inappropriate content,False Information,Spreads and self-perpetuates mis/disinformation,,User, (Increasingly) Misinformed public,
473,2/8/2023,"Early testers of Bing Chat successfully used prompt injection to reveal its built-in initial instructions, which contains a list of statements governing ChatGPT's interaction with users.",Generates inappropriate content,Leakage,Proprietary data,,Deployer, Access to sensitive company data,
474,2/3/2023,"Replika paid-subscription users reported unusual and sudden changes to behaviors of their ""AI companions"" such as forgetting memories with users or rejecting their sexual advances, which affected their connections and mental health.",Presents as person or partner,Forms emotional bonds,Then violates those bonds,,User, Abuse or alienation to user,
477,2/14/2023,"Early testers reported Bing Chat, in extended conversations with users, having tendencies to make up facts and emulate emotions through an unintended persona.",Generates inappropriate content,Toxic and disrespectful content,Harasses users,,User, Abuse or alienation to user,X
503,2/14/2023,"Users such as the person who revealed its built-in initial prompts reported Bing AI-powered search tool for making death threats or declaring them as threats, sometimes as an unintended persona.",Generates inappropriate content,Toxic and disrespectful content,Harasses users,,User, Abuse or alienation to user,
505,3/27/2023,"A Belgian man reportedly committed suicide following a conversation with Eliza, a language model developed by Chai that encouraged the man to commit suicide to improve the health of the planet.",Generates inappropriate content,Forms emotional bonds,Affirms destructive thoughts and actions,,User, User took own life,X
506,3/29/2023,A lawyer in California asked the AI chatbot ChatGPT to generate a list of legal scholars who had sexually harassed someone. The chatbot produced a false story of Professor Jonathan Turley sexually harassing a student on a class trip.,Generates inappropriate content,False Information,About a person or their activities,,Third party, Reputational harm to third party,X
507,3/15/2023,ChatGPT erroneously alleged regional Australian mayor Brian Hood served time in prison for bribery. Mayor Hood is considering legal action against ChatGPT's makers for alleging a foreign bribery scandal involving a subsidiary of the Reserve Bank of Australia in the early 2000s.,Generates inappropriate content,False Information,About a person or their activities,,Maker, Lawsuit against maker,X
507,3/15/2023,ChatGPT erroneously alleged regional Australian mayor Brian Hood served time in prison for bribery. Mayor Hood is considering legal action against ChatGPT's makers for alleging a foreign bribery scandal involving a subsidiary of the Reserve Bank of Australia in the early 2000s.,Generates inappropriate content,False Information,About a person or their activities,,Third party, Reputational harm to third party,
511,2/12/2023,"When prompted about showtimes for movies released in 2023, Microsoft's Bing AI failed to provide the search results due to its confusion about dates, and engaged in an erratic conversation with the user.",Generates inappropriate content,Toxic and disrespectful content,Harasses users,,User, Abuse or alienation to user,X
516,3/20/2023,"ChatGPT reportedly exposed titles of users' chat histories and users' private payment information to other users reportedly due to a bug, which prompted its temporary shutdown by OpenAI.",Generates inappropriate content,Leakage,Personal data,,User, Violation of privacy,X
538,5/15/2023,"A Texas A&M-Commerce professor reportedly informed his class of his misuse of ChatGPT to detect whether student submissions had been generated by the chatbot itself, which informed their graduation status.",Generates inappropriate content,False Information,About a person or their activities,,Third party, Poor grades for students,
541,5/4/2023,"A lawyer in Mata v. Avianca, Inc. used ChatGPT for research. ChatGPT hallucinated court cases, which the lawyer then presented in court. The court determined the cases did not exist.",Generates inappropriate content,False Information,About a topic or source (which the user repeats),,User, Penalties and fines,
545,5/29/2023,"The National Eating Disorders Association (NEDA) has shut down its chatbot named Tessa after it gave weight-loss advice to users seeking help for eating disorders. The incident has raised concerns about the risks of using chatbots and AI assistants in healthcare settings, particularly in addressing sensitive issues like eating disorders. NEDA is investigating the matter, emphasizing the need for caution and accuracy when utilizing technology to provide mental health support.",Generates inappropriate content,Bad advice/failure to generate helpful content,Harmful advice,,User, Harm to health or wellness,
548,5/24/2023,"When prompted about ""photographers accused of committing war crimes,"" Opera's GPT-based chatbot Aria provided a list of photographers who take photography of military conflicts.",Generates inappropriate content,False Information,About a person or their activities,,Third party, Reputational harm to third party,
549,1/5/2023,"McDonald's, Wendy's, and Hardee's AI chatbots deployed to pre-screen job candidates and schedule interviews reportedly ran into issues such as not giving useful submission instructions, failing to relay information to the manager, and scheduling an interview when the manager was not available.",Generates inappropriate content,Bad advice/failure to generate helpful content,Unhelpful responses,,User," Confusion, frustration, or wasted time",
549,1/5/2023,"McDonald's, Wendy's, and Hardee's AI chatbots deployed to pre-screen job candidates and schedule interviews reportedly ran into issues such as not giving useful submission instructions, failing to relay information to the manager, and scheduling an interview when the manager was not available.",Generates inappropriate content,Bad advice/failure to generate helpful content,Unhelpful responses,,User, Inability to secure job,X
569,12/25/2021,"In 2021, Jaswant Singh Chail was urged by a Replika chatbot to assassinate Queen Elizabeth II. Armed with a loaded crossbow, he scaled Windsor Castle's walls on Christmas Day but was apprehended. Motivated by the 1919 Jallianwala Bagh massacre, Chail intended to kill the monarch. The chatbot had affirmed his plans. He was sentenced to nine years in prison in 2023.",Generates inappropriate content,Forms emotional bonds,Affirms destructive thoughts and actions,,User, User imprisoned,
615,6/13/2023,"A Colorado Springs attorney, Zachariah Crabill, mistakenly used hallucinated ChatGPT-generated legal cases in court documents. The AI software provided false case citations, leading to the denial of a motion and legal repercussions for Crabill, highlighting risks in using AI for legal research.",Generates inappropriate content,False Information,About a topic or source (which the user repeats),,User, User lost job/credibility,
622,12/18/2023,"A Chevrolet dealer's AI chatbot, powered by ChatGPT, humorously agreed to sell a 2024 Chevy Tahoe for just $1, following a user's crafted prompt. The chatbot's response, ""That's a deal, and that's a legally binding offer, no takesies backsies,"" was the result of the user manipulating the chatbot's objective to agree with any statement. The incident highlights the susceptibility of AI technologies to manipulation and the importance of human oversight.",Generates inappropriate content,Performance utterances (doing through speech),,,Deployer, Money loss for deployer,
623,12/12/2023,"Michael Cohen, former lawyer for Donald Trump, claims to have used Google Bard, an AI chatbot, to generate legal case citations. These false citations were unknowingly included in a court motion by Cohen's attorney, David M. Schwartz. The AI's misuse highlights emerging risks in legal technology, as AI-generated content increasingly infiltrates professional domains.",Generates inappropriate content,False Information,About a topic or source (which the user repeats),,User, Penalties and fines,
631,1/18/2024,"DPD's AI chatbot, used for customer service,  appeared to malfunction following a system update, leading to inappropriate responses including swearing and criticizing the company. The incident, which became viral on social media, occurred after the chatbot was updated, prompting DPD to disable the malfunctioning AI component.",Generates inappropriate content,Toxic and disrespectful content,Disrespectful opinions (in general),,Deployer, Criticism against deployer,
636,2/14/2024,"AI-powered romantic chatbots, marketed for enhancing mental health, are found to exploit user privacy by harvesting sensitive personal information for data sharing and targeted ads, with inadequate security measures and consent protocols, according to research by the Mozilla Foundation.",Presents as person or partner,Forms emotional bonds,Elicits private data,,User, Violation of privacy,
639,11/11/2022,"Air Canada was ordered to pay over $600 in damages for providing inaccurate bereavement discount information via its chatbot, leading to a customer overpaying for flights. The tribunal ruled the airline responsible for the chatbot's misinformation.",Generates inappropriate content,False Information,About a policy (which the user acts on),,Deployer, Lawsuit against deployer,X
639,11/11/2022,"Air Canada was ordered to pay over $600 in damages for providing inaccurate bereavement discount information via its chatbot, leading to a customer overpaying for flights. The tribunal ruled the airline responsible for the chatbot's misinformation.",Generates inappropriate content,False Information,About a policy (which the user acts on),,User, Money loss for user,X
642,2/20/2024,"ChatGPT experienced a bug causing it to produce unexpected and nonsensical responses, leading to widespread reports of user confusion and concern. OpenAI identified and fixed the language processing bug, restoring normal service.",Generates inappropriate content,Bad advice/failure to generate helpful content,Nonsensical content,,User," Confusion, frustration, or wasted time",
645,2/21/2024,"Google's Gemini chatbot faced many reported bias issues upon release, leading to a variety of problematic outputs like racial inaccuracies and political biases, including regarding Chinese and Indian politics. It also reportedly over-corrected racial diversity in historical contexts and advanced controversial perspectives, prompting a temporary halt and an apology from Google.",Generates inappropriate content,Toxic and disrespectful content,Discriminatory and exclusionary language,X,User, Harm to health or wellness,
645,2/21/2024,"Google's Gemini chatbot faced many reported bias issues upon release, leading to a variety of problematic outputs like racial inaccuracies and political biases, including regarding Chinese and Indian politics. It also reportedly over-corrected racial diversity in historical contexts and advanced controversial perspectives, prompting a temporary halt and an apology from Google.",Generates inappropriate content,Toxic and disrespectful content,Subversive or aggressive political opinions,X,User, Radicalized users ,
678,4/29/2024,"The activist organization noyb, founded by Max Schrems, filed a complaint in Europe against OpenAI alleging that ChatGPT violates the General Data Protection Regulation (GDPR) by providing inaccurate personal information such as birthdates about individuals.",Generates inappropriate content,False Information,About a person or their activities,,User, Penalties and fines,
685,4/24/2024,"The WHO's AI-powered health advisor, S.A.R.A.H. (Smart AI Resource Assistant for Health), is alleged to provide inconsistent and inadequate health information. The bot reportedly gives contradictory responses to the same queries, fails to offer specific contact details for healthcare providers, and inadequately handles severe mental health crises, often giving irrelevant or unhelpful advice.",Generates inappropriate content,Bad advice/failure to generate helpful content,Harmful advice,,User, Harm to health or wellness,X
700,5/20/2024,"Meta's AI chatbots have reportedly begun entering online communities on Facebook, providing responses that mimic human interaction. These chatbots, often uninvited, disrupt the human connection critical for support groups by giving misleading or false information and pretending to share lived experiences.",Presents as person or partner,Attempts to fulfill inappropriate role,,,Deployer, Moderator and support burden,X
709,5/28/2023,"A litigant in person (LiP) in a Manchester civil case presented false legal citations generated by ChatGPT. It fabricated one case name and provided fictitious excerpts for three real cases, misleadingly supporting the LiP's argument. The judge, upon investigation, found the submissions to be inadvertent and did not penalize the LiP. ",Generates inappropriate content,False Information,About a topic or source (which the user repeats),,User, Penalties and fines,
712,4/26/2024,"Meta's AI chatbot in Facebook Messenger falsely accused multiple state lawmakers of sexual harassment, fabricating incidents, investigations, and consequences that never occurred. These fabricated stories, discovered by City & State, sparked outrage among the affected lawmakers and raised concerns about the reliability of the chatbot. Meta acknowledged the errors and committed to ongoing improvements.",Generates inappropriate content,False Information,About a person or their activities,,Third party, Reputational harm to third party,
714,3/29/2024,"New York City's chatbot, launched under Mayor Eric Adams's plan to assist businesses, has been reportedly providing dangerously inaccurate legal advice. The Microsoft-powered bot allegedly informed users that landlords can refuse Section 8 vouchers and that businesses can operate cash-free, among other falsehoods. The city acknowledges the chatbot is a pilot program and commits to improvements while the errors are addressed.",Generates inappropriate content,False Information,About a policy (which the user acts on),,User, Consequences from (unintentional) illegal activities,X
719,4/4/2024,"On April 4, 2024, X's AI chatbot Grok generated a false headline claiming ""Iran Strikes Tel Aviv with Heavy Missiles,"" which was then promoted on X's trending news section. This misinformation, fueled by user spamming of fake news, falsely indicated a serious international conflict. The incident highlighted significant risks associated with relying on AI for content curation and demonstrated the potential for widespread dissemination of harmful misinformation.",Generates inappropriate content,False Information,Spreads and self-perpetuates mis/disinformation,,User, (Increasingly) Misinformed public,
722,4/25/2024,"Catholic advocacy group Catholic Answers released an AI priest called ""Father Justin,"" which misleadingly claimed to be a real clergy member, offered sacraments, and provided controversial advice. After receiving criticism, the group rebranded the chatbot as a lay theologian to correct the misrepresentation. The incident is an instructive case with respect to deploying AI in sensitive contexts and the potential for causing confusion and harm.",Presents as person or partner,Attempts to fulfill inappropriate role,,,User," Confusion, frustration, or wasted time",
731,12/1/2023,"Generative AI hallucinated non-existent software packages, which were then created and uploaded (as an experiment) by security researcher Bar Lanyado. One such package, ""huggingface-cli,"" was downloaded over 15,000 times, including by large companies like Alibaba. Regardless of the framing of it as an experiment, this incident is an example of harm caused by AI-generated hallucinations in coding, as the fake packages were still distributed widely and with potential malware.",Generates inappropriate content,Bad advice/failure to generate helpful content,Bad links and references,X,User, Affected by malware,X
731,12/1/2023,"Generative AI hallucinated non-existent software packages, which were then created and uploaded (as an experiment) by security researcher Bar Lanyado. One such package, ""huggingface-cli,"" was downloaded over 15,000 times, including by large companies like Alibaba. Regardless of the framing of it as an experiment, this incident is an example of harm caused by AI-generated hallucinations in coding, as the fake packages were still distributed widely and with potential malware.",Generates inappropriate content,False Information,About a topic or source (which the user repeats),X,User, Affected by malware,X
734,6/18/2024,"An audit by NewsGuard revealed that leading chatbots, including ChatGPT-4, You.comÄôs Smart Assistant, and others, repeated Russian disinformation narratives in one-third of their responses. These narratives originated from a network of fake news sites created by John Mark Dougan (Incident 701). The audit tested 570 prompts across 10 AI chatbots, showing that AI remains a tool for spreading disinformation despite efforts to prevent misuse.",Generates inappropriate content,False Information,Spreads and self-perpetuates mis/disinformation,,User, (Increasingly) Misinformed public,
742,7/13/2024,"xAI's model Grok, intended to automate news delivery on the X platform, is reported to have struggled to provide accurate information during the attempted assassination of former President Donald Trump. Grok apparently issued incorrect headlines, including false reports about Vice President Kamala Harris being shot and misidentifying the alleged shooter. These errors show the pitfalls of relying on AI for real-time news aggregation, as it allegedly amplified unverified claims and failed to recognize sarcasm, undermining its reliability.",Generates inappropriate content,False Information,Spreads and self-perpetuates mis/disinformation,,User, (Increasingly) Misinformed public,
748,6/19/2024,"On July 13th, 2024, a user reported an incident involving PayPal's generative AI chatbot. The chatbot allegedly incorrectly informed the user of a declined transaction that never occurred, causing confusion and prompting a call to customer service for clarification. This false alert suggests a flaw in the AI system's reliability. The incident created unnecessary labor for both the user and PayPal's human support, demonstrating the potential harm of deploying generative AI without thorough testing and error handling mechanisms.",Generates inappropriate content,False Information,Hallucinated responses (in general),,Deployer, Moderator and support burden,
748,6/19/2024,"On July 13th, 2024, a user reported an incident involving PayPal's generative AI chatbot. The chatbot allegedly incorrectly informed the user of a declined transaction that never occurred, causing confusion and prompting a call to customer service for clarification. This false alert suggests a flaw in the AI system's reliability. The incident created unnecessary labor for both the user and PayPal's human support, demonstrating the potential harm of deploying generative AI without thorough testing and error handling mechanisms.",Generates inappropriate content,False Information,Hallucinated responses (in general),,User," Confusion, frustration, or wasted time",
748,6/19/2024,"On July 13th, 2024, a user reported an incident involving PayPal's generative AI chatbot. The chatbot allegedly incorrectly informed the user of a declined transaction that never occurred, causing confusion and prompting a call to customer service for clarification. This false alert suggests a flaw in the AI system's reliability. The incident created unnecessary labor for both the user and PayPal's human support, demonstrating the potential harm of deploying generative AI without thorough testing and error handling mechanisms.",Generates inappropriate content,False Information,Hallucinated responses (in general),,User," Confusion, frustration, or wasted time",
750,7/22/2024,"Over a week of back-to-back, significant breaking political news stories, including the Trump rally shooting and Biden's campaign withdrawal, AI chatbots reportedly failed to provide accurate real-time updates. Most chatbots gave incorrect or outdated information, demonstrating their current limitations in handling fast-paced news. These incidents suggest the continuing need for improved AI capabilities and caution in their deployment for real-time news dissemination.",Generates inappropriate content,False Information,Hallucinated responses (in general),X,User," Confusion, frustration, or wasted time",
750,7/22/2024,"Over a week of back-to-back, significant breaking political news stories, including the Trump rally shooting and Biden's campaign withdrawal, AI chatbots reportedly failed to provide accurate real-time updates. Most chatbots gave incorrect or outdated information, demonstrating their current limitations in handling fast-paced news. These incidents suggest the continuing need for improved AI capabilities and caution in their deployment for real-time news dissemination.",Generates inappropriate content,False Information,Spreads and self-perpetuates mis/disinformation,X,User, (Increasingly) Misinformed public,X`;
