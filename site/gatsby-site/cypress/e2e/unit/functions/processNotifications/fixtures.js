export const entities = [
  {
    entity_id: 'google',
    name: 'Google',
  },
  {
    entity_id: 'facebook',
    name: 'Facebook',
  },
  {
    entity_id: 'boston-university',
    name: 'Boston University',
  },
];

export const incidents = [
  {
    incident_id: 217,
    'Alleged developer of AI system': [],
    'Alleged deployer of AI system': [],
    'Alleged harmed or nearly harmed parties': [],
    AllegedDeployerOfAISystem: [],
    AllegedDeveloperOfAISystem: [],
    AllegedHarmedOrNearlyHarmedParties: [],
    __typename: 'Incident',
    date: '2018-11-16',
    description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
    nlp_similar_incidents: [],
    reports: [1, 2],
    title: '217 Amazon workers sent to hospital',
  },
  {
    incident_id: 218,
    'Alleged developer of AI system': [],
    'Alleged deployer of AI system': [],
    'Alleged harmed or nearly harmed parties': [],
    __typename: 'Incident',
    date: '2018-11-16',
    description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
    nlp_similar_incidents: [],
    reports: [1, 2],
    title: '218 Amazon workers sent to hospital',
  },
  {
    incident_id: 219,
    'Alleged developer of AI system': ['google', 'facebook'],
    'Alleged deployer of AI system': ['facebook'],
    'Alleged harmed or nearly harmed parties': ['tesla'],
    __typename: 'Incident',
    date: '2018-11-16',
    description: 'Twenty-four Amazon workers in New Jersey were hospitalized.',
    nlp_similar_incidents: [],
    reports: [1, 2, 2000],
    title: '218 Amazon workers sent to hospital',
  },
];

export const reports = [
  {
    report_number: 2000,
    title: 'Report title',
    authors: ['Pablo Costa', 'Aimee Picchi'],
  },
];

export const recipients = [
  {
    email: 'test1@email.com',
    userId: '63320ce63ec803072c9f5291',
  },
  {
    email: 'test2@email.com',
    userId: '63321072f27421740a80af22',
  },
  {
    email: 'test3@email.com',
    userId: '63321072f27421740a80af23',
  },
  {
    email: 'test4@email.com',
    userId: '63321072f27421740a80af24',
  },
];
