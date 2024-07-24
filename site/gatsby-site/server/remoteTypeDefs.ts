import gql from "graphql-tag";

export default gql`
input CandidateEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input TaxaDummy_fieldInsertInput {
  field_number: String
  short_name: String
}

input ClassificationAttributeInsertInput {
  value_json: String
  short_name: String
}

input ClassificationAttributeUpdateInput {
  short_name_unset: Boolean
  value_json: String
  value_json_unset: Boolean
  short_name: String
}

input TaxaField_listItem_fieldComplete_fromUpdateInput {
  entities_unset: Boolean
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  entities: Boolean
}

input History_incidentUpdateInput {
  flagged_dissimilar_incidents_unset: Boolean
  implicated_systems_unset: Boolean
  modifiedBy_unset: Boolean
  AllegedDeployerOfAISystem_unset: Boolean
  epoch_date_modified_inc: Int
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  title: String
  embedding: History_incidentEmbeddingUpdateInput
  editor_dissimilar_incidents_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  tsne_unset: Boolean
  incident_id: Int
  _id: ObjectId
  editors_unset: Boolean
  reports: [Int]
  date_unset: Boolean
  epoch_date_modified: Int
  epoch_date_modified_unset: Boolean
  incident_id_inc: Int
  incident_id_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  date: String
  AllegedHarmedOrNearlyHarmedParties: [String]
  implicated_systems: [String]
  tsne: History_incidentTsneUpdateInput
  AllegedDeployerOfAISystem: [String]
  description_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  reports_unset: Boolean
  editor_similar_incidents_unset: Boolean
  editor_notes: String
  editor_notes_unset: Boolean
  description: String
  modifiedBy: String
  editors: [String]
  title_unset: Boolean
  _id_unset: Boolean
  editor_similar_incidents: [Int]
  embedding_unset: Boolean
  editor_dissimilar_incidents: [Int]
  AllegedDeveloperOfAISystem: [String]
}

type TaxaField_listItem_field {
  complete_from: TaxaField_listItem_fieldComplete_from
  default: String
  display_type: String
  field_number: String
  instant_facet: Boolean
  long_description: String
  long_name: String
  mongo_type: String
  permitted_values: [String]
  placeholder: String
  public: Boolean
  required: Boolean
  short_description: String
  short_name: String
  weight: Int
}

input History_incidentQueryInput {
  epoch_date_modified: Int
  _id_ne: ObjectId
  _id_lte: ObjectId
  editor_dissimilar_incidents_in: [Int]
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  AllegedDeployerOfAISystem_exists: Boolean
  editor_notes_in: [String]
  implicated_systems_in: [String]
  _id_exists: Boolean
  editors_nin: [String]
  editor_similar_incidents_nin: [Int]
  title_exists: Boolean
  title_ne: String
  tsne: History_incidentTsneQueryInput
  AND: [History_incidentQueryInput!]
  incident_id_gte: Int
  description_in: [String]
  editor_notes: String
  embedding_exists: Boolean
  description_lt: String
  AllegedDeployerOfAISystem_nin: [String]
  flagged_dissimilar_incidents_in: [Int]
  date_exists: Boolean
  reports_nin: [Int]
  modifiedBy_nin: [String]
  title_lte: String
  editor_notes_ne: String
  incident_id_lte: Int
  editor_dissimilar_incidents: [Int]
  _id_nin: [ObjectId]
  epoch_date_modified_lt: Int
  date_nin: [String]
  date_ne: String
  description: String
  title_gte: String
  epoch_date_modified_lte: Int
  modifiedBy_lte: String
  implicated_systems: [String]
  description_ne: String
  editor_notes_nin: [String]
  epoch_date_modified_gte: Int
  implicated_systems_nin: [String]
  reports: [Int]
  title_nin: [String]
  editor_dissimilar_incidents_nin: [Int]
  editor_notes_lt: String
  modifiedBy_gte: String
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  description_gte: String
  editors_in: [String]
  _id_in: [ObjectId]
  epoch_date_modified_in: [Int]
  incident_id_ne: Int
  reports_in: [Int]
  modifiedBy_in: [String]
  date_gt: String
  incident_id_exists: Boolean
  date_lt: String
  incident_id: Int
  modifiedBy_exists: Boolean
  incident_id_gt: Int
  AllegedHarmedOrNearlyHarmedParties: [String]
  description_nin: [String]
  modifiedBy_ne: String
  flagged_dissimilar_incidents_nin: [Int]
  flagged_dissimilar_incidents: [Int]
  title: String
  title_in: [String]
  _id: ObjectId
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  AllegedDeveloperOfAISystem_nin: [String]
  description_exists: Boolean
  tsne_exists: Boolean
  modifiedBy: String
  editors: [String]
  incident_id_nin: [Int]
  date_lte: String
  editor_notes_gte: String
  implicated_systems_exists: Boolean
  modifiedBy_lt: String
  description_gt: String
  AllegedDeployerOfAISystem: [String]
  flagged_dissimilar_incidents_exists: Boolean
  _id_gte: ObjectId
  modifiedBy_gt: String
  incident_id_in: [Int]
  date: String
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  _id_gt: ObjectId
  epoch_date_modified_ne: Int
  epoch_date_modified_nin: [Int]
  title_lt: String
  epoch_date_modified_exists: Boolean
  editor_notes_exists: Boolean
  reports_exists: Boolean
  editor_notes_lte: String
  date_gte: String
  AllegedDeveloperOfAISystem_in: [String]
  editor_similar_incidents: [Int]
  editor_similar_incidents_in: [Int]
  date_in: [String]
  incident_id_lt: Int
  OR: [History_incidentQueryInput!]
  _id_lt: ObjectId
  nlp_similar_incidents_exists: Boolean
  embedding: History_incidentEmbeddingQueryInput
  AllegedDeveloperOfAISystem: [String]
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  editors_exists: Boolean
  epoch_date_modified_gt: Int
  title_gt: String
  AllegedDeveloperOfAISystem_exists: Boolean
  editor_dissimilar_incidents_exists: Boolean
  editor_similar_incidents_exists: Boolean
  description_lte: String
  AllegedDeployerOfAISystem_in: [String]
  editor_notes_gt: String
}

input ReportInsertInput {
  date_submitted: DateTime!
  user: ReportUserRelationInput
  epoch_date_modified: Int!
  quiet: Boolean
  date_published: DateTime!
  report_number: Int!
  _id: ObjectId
  date_modified: DateTime!
  epoch_date_downloaded: Int!
  text: String!
  authors: [String]!
  embedding: ReportEmbeddingInsertInput
  tags: [String]!
  epoch_date_published: Int!
  submitters: [String]!
  cloudinary_id: String!
  source_domain: String!
  is_incident_report: Boolean
  language: String!
  flag: Boolean
  inputs_outputs: [String]
  date_downloaded: DateTime!
  description: String
  image_url: String!
  epoch_date_submitted: Int!
  editor_notes: String
  plain_text: String!
  title: String!
  url: String!
}

input TaxaField_listUpdateInput {
  default: String
  display_type_unset: Boolean
  field_number_unset: Boolean
  permitted_values_unset: Boolean
  public: Boolean
  hide_search: Boolean
  weight_unset: Boolean
  short_description: String
  permitted_values: [String]
  weight: Int
  long_name_unset: Boolean
  required_unset: Boolean
  short_description_unset: Boolean
  complete_from_unset: Boolean
  instant_facet_unset: Boolean
  placeholder_unset: Boolean
  instant_facet: Boolean
  long_description_unset: Boolean
  long_name: String
  mongo_type_unset: Boolean
  short_name_unset: Boolean
  complete_from: TaxaField_listComplete_fromUpdateInput
  short_name: String
  display_type: String
  required: Boolean
  item_fields_unset: Boolean
  weight_inc: Int
  item_fields: TaxaField_listItem_fieldUpdateInput
  field_number: String
  hide_search_unset: Boolean
  placeholder: String
  mongo_type: String
  long_description: String
  default_unset: Boolean
  public_unset: Boolean
}

type Query {
  candidate(query: CandidateQueryInput): Candidate
  candidates(sortBy: CandidateSortByInput, query: CandidateQueryInput, limit: Int = 100): [Candidate]!
  checklist(query: ChecklistQueryInput): Checklist
  checklists(query: ChecklistQueryInput, limit: Int = 100, sortBy: ChecklistSortByInput): [Checklist]!
  classification(query: ClassificationQueryInput): Classification
  classifications(query: ClassificationQueryInput, limit: Int = 100, sortBy: ClassificationSortByInput): [Classification]!
  duplicate(query: DuplicateQueryInput): Duplicate
  duplicates(query: DuplicateQueryInput, limit: Int = 100, sortBy: DuplicateSortByInput): [Duplicate]!
  entities(sortBy: EntitySortByInput, query: EntityQueryInput, limit: Int = 100): [Entity]!
  entity(query: EntityQueryInput): Entity
  history_incident(query: History_incidentQueryInput): History_incident
  history_incidents(query: History_incidentQueryInput, limit: Int = 100, sortBy: History_incidentSortByInput): [History_incident]!
  history_report(query: History_reportQueryInput): History_report
  history_reports(query: History_reportQueryInput, limit: Int = 100, sortBy: History_reportSortByInput): [History_report]!
  incident(query: IncidentQueryInput): Incident
  incidents(query: IncidentQueryInput, limit: Int = 100, sortBy: IncidentSortByInput): [Incident]!
  notification(query: NotificationQueryInput): Notification
  notifications(query: NotificationQueryInput, limit: Int = 100, sortBy: NotificationSortByInput): [Notification]!
  quickadd(query: QuickaddQueryInput): Quickadd
  quickadds(query: QuickaddQueryInput, limit: Int = 100, sortBy: QuickaddSortByInput): [Quickadd]!
  report(query: ReportQueryInput): Report
  reports(limit: Int = 100, sortBy: ReportSortByInput, query: ReportQueryInput): [Report]!
  risks(input: RisksInput): [RisksPayloadItem]
  submission(query: SubmissionQueryInput): Submission
  submissions(query: SubmissionQueryInput, limit: Int = 100, sortBy: SubmissionSortByInput): [Submission]!
  subscription(query: SubscriptionQueryInput): Subscription
  subscriptions(limit: Int = 100, sortBy: SubscriptionSortByInput, query: SubscriptionQueryInput): [Subscription]!
  taxa(query: TaxaQueryInput): Taxa
  taxas(limit: Int = 100, sortBy: TaxaSortByInput, query: TaxaQueryInput): [Taxa]!
  user(query: UserQueryInput): User
  users(sortBy: UserSortByInput, query: UserQueryInput, limit: Int = 100): [User]!
}

type Incident {
  AllegedDeployerOfAISystem: [Entity]
  AllegedDeveloperOfAISystem: [Entity]
  AllegedHarmedOrNearlyHarmedParties: [Entity]
  _id: ObjectId
  date: String!
  description: String
  editor_dissimilar_incidents: [Int]
  editor_notes: String
  editor_similar_incidents: [Int]
  editors: [User]!
  embedding: IncidentEmbedding
  epoch_date_modified: Int
  flagged_dissimilar_incidents: [Int]
  implicated_systems: [Entity]
  incident_id: Int!
  nlp_similar_incidents: [IncidentNlp_similar_incident]
  reports: [Report]!
  title: String!
  tsne: IncidentTsne
}

enum EntitySortByInput {
  ENTITY_ID_DESC
  NAME_ASC
  DATE_MODIFIED_DESC
  _ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  DATE_MODIFIED_ASC
  ENTITY_ID_ASC
  NAME_DESC
  _ID_ASC
}

input DuplicateUpdateInput {
  true_incident_number_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  duplicate_incident_number: Int
  duplicate_incident_number_inc: Int
  duplicate_incident_number_unset: Boolean
  true_incident_number: Int
  true_incident_number_inc: Int
}

input IncidentEmbeddingInsertInput {
  vector: [Float]
  from_reports: [Int]
}

scalar Long

input GetUserInput {
  userId: ObjectId
}

input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input IncidentTsneQueryInput {
  y_gt: Float
  y: Float
  y_lte: Float
  x_exists: Boolean
  x: Float
  y_exists: Boolean
  y_ne: Float
  OR: [IncidentTsneQueryInput!]
  x_lte: Float
  x_nin: [Float]
  x_ne: Float
  y_in: [Float]
  x_gte: Float
  y_nin: [Float]
  y_gte: Float
  x_gt: Float
  y_lt: Float
  AND: [IncidentTsneQueryInput!]
  x_in: [Float]
  x_lt: Float
}

enum History_incidentSortByInput {
  _ID_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  TITLE_ASC
  TITLE_DESC
  DATE_DESC
  DESCRIPTION_ASC
  EPOCH_DATE_MODIFIED_ASC
  INCIDENT_ID_ASC
  DATE_ASC
  EDITOR_NOTES_ASC
  _ID_DESC
  DESCRIPTION_DESC
  INCIDENT_ID_DESC
  MODIFIEDBY_ASC
  MODIFIEDBY_DESC
}

input TaxaField_listItem_fieldComplete_fromInsertInput {
  all: [String]
  current: [String]
  entities: Boolean
}

enum IncidentSortByInput {
  _ID_ASC
  _ID_DESC
  DATE_ASC
  DATE_DESC
  DESCRIPTION_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  EPOCH_DATE_MODIFIED_ASC
  INCIDENT_ID_ASC
  TITLE_ASC
  TITLE_DESC
  DESCRIPTION_DESC
  EDITOR_NOTES_ASC
  INCIDENT_ID_DESC
}

type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input ReportUserRelationInput {
  create: UserInsertInput
  link: String
}

input TaxaField_listInsertInput {
  instant_facet: Boolean
  field_number: String
  mongo_type: String
  required: Boolean
  long_description: String
  public: Boolean
  long_name: String
  short_description: String
  weight: Int
  hide_search: Boolean
  complete_from: TaxaField_listComplete_fromInsertInput
  display_type: String
  placeholder: String
  short_name: String
  default: String
  item_fields: TaxaField_listItem_fieldInsertInput
  permitted_values: [String]
}

scalar ObjectId

enum DuplicateSortByInput {
  _ID_ASC
  _ID_DESC
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
}

input History_incidentNlp_similar_incidentUpdateInput {
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
}

input SubscriptionInsertInput {
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
  userId: SubscriptionUserIdRelationInput!
  _id: ObjectId
  entityId: SubscriptionEntityIdRelationInput
}

input SubmissionUpdateInput {
  date_submitted_unset: Boolean
  language_unset: Boolean
  deployers_unset: Boolean
  editor_notes: String
  harmed_parties_unset: Boolean
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  incident_ids_unset: Boolean
  date_published: String
  embedding_unset: Boolean
  embedding: SubmissionEmbeddingUpdateInput
  deployers: SubmissionDeployersRelationInput
  plain_text_unset: Boolean
  implicated_systems: SubmissionImplicated_systemsRelationInput
  text_unset: Boolean
  title: String
  user: SubmissionUserRelationInput
  editor_dissimilar_incidents: [Int]
  incident_date_unset: Boolean
  description: String
  language: String
  source_domain_unset: Boolean
  image_url_unset: Boolean
  epoch_date_modified: Int
  description_unset: Boolean
  epoch_date_modified_unset: Boolean
  date_published_unset: Boolean
  date_downloaded: String
  authors: [String]
  cloudinary_id_unset: Boolean
  harmed_parties: SubmissionHarmed_partiesRelationInput
  nlp_similar_incidents_unset: Boolean
  editor_similar_incidents: [Int]
  source_domain: String
  plain_text: String
  epoch_date_modified_inc: Int
  incident_editors: SubmissionIncident_editorsRelationInput
  status: String
  incident_ids: [Int]
  incident_title_unset: Boolean
  editor_similar_incidents_unset: Boolean
  incident_date: String
  date_submitted: String
  url: String
  text: String
  developers_unset: Boolean
  url_unset: Boolean
  incident_editors_unset: Boolean
  _id_unset: Boolean
  quiet: Boolean
  editor_notes_unset: Boolean
  tags: [String]
  submitters: [String]
  user_unset: Boolean
  date_downloaded_unset: Boolean
  image_url: String
  authors_unset: Boolean
  quiet_unset: Boolean
  date_modified: String
  cloudinary_id: String
  developers: SubmissionDevelopersRelationInput
  incident_title: String
  tags_unset: Boolean
  _id: ObjectId
  editor_dissimilar_incidents_unset: Boolean
  status_unset: Boolean
  title_unset: Boolean
  implicated_systems_unset: Boolean
  date_modified_unset: Boolean
  submitters_unset: Boolean
}

input CandidateClassification_similarityInsertInput {
  classification: String
  similarity: Float
}

input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input TaxaUpdateInput {
  weight_unset: Boolean
  complete_entities: Boolean
  weight: Int
  field_list_unset: Boolean
  dummy_fields_unset: Boolean
  weight_inc: Int
  namespace_unset: Boolean
  namespace: String
  field_list: [TaxaField_listUpdateInput]
  description_unset: Boolean
  description: String
  _id_unset: Boolean
  _id: ObjectId
  complete_entities_unset: Boolean
  dummy_fields: [TaxaDummy_fieldUpdateInput]
}

input TaxaDummy_fieldQueryInput {
  short_name_lte: String
  short_name_gte: String
  short_name_nin: [String]
  OR: [TaxaDummy_fieldQueryInput!]
  field_number_lte: String
  short_name_ne: String
  field_number_gt: String
  AND: [TaxaDummy_fieldQueryInput!]
  field_number: String
  field_number_exists: Boolean
  field_number_in: [String]
  field_number_nin: [String]
  field_number_gte: String
  field_number_lt: String
  field_number_ne: String
  short_name: String
  short_name_gt: String
  short_name_lt: String
  short_name_in: [String]
  short_name_exists: Boolean
}

input ChecklistRiskQueryInput {
  likelihood_gte: String
  likelihood_lte: String
  id_lte: String
  generated: Boolean
  likelihood_in: [String]
  OR: [ChecklistRiskQueryInput!]
  id_in: [String]
  id_gt: String
  risk_status_nin: [String]
  title_gte: String
  likelihood_exists: Boolean
  risk_status_lt: String
  severity_ne: String
  tags_nin: [String]
  generated_exists: Boolean
  title_nin: [String]
  id_exists: Boolean
  severity_lte: String
  title_ne: String
  severity_nin: [String]
  likelihood_ne: String
  risk_notes: String
  risk_status_lte: String
  title_lte: String
  risk_status: String
  title_lt: String
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  risk_status_exists: Boolean
  touched: Boolean
  touched_exists: Boolean
  severity: String
  risk_status_ne: String
  risk_notes_nin: [String]
  precedents: [ChecklistRiskPrecedentQueryInput]
  id_nin: [String]
  risk_status_in: [String]
  title_in: [String]
  id_ne: String
  risk_notes_gt: String
  risk_notes_lte: String
  risk_notes_lt: String
  tags_in: [String]
  likelihood_gt: String
  severity_exists: Boolean
  title: String
  risk_notes_gte: String
  generated_ne: Boolean
  likelihood_nin: [String]
  tags_exists: Boolean
  severity_in: [String]
  risk_status_gte: String
  title_gt: String
  risk_status_gt: String
  severity_gt: String
  touched_ne: Boolean
  risk_notes_in: [String]
  tags: [String]
  title_exists: Boolean
  id: String
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  AND: [ChecklistRiskQueryInput!]
  severity_lt: String
  likelihood: String
  risk_notes_exists: Boolean
  id_lt: String
  severity_gte: String
  precedents_exists: Boolean
  risk_notes_ne: String
  id_gte: String
  likelihood_lt: String
}

type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input IncidentEditorsRelationInput {
  link: [String]
  create: [UserInsertInput]
}

input SubmissionEmbeddingQueryInput {
  from_text_hash_in: [String]
  vector_nin: [Float]
  vector: [Float]
  vector_exists: Boolean
  AND: [SubmissionEmbeddingQueryInput!]
  from_text_hash_lte: String
  from_text_hash_nin: [String]
  vector_in: [Float]
  from_text_hash: String
  from_text_hash_lt: String
  from_text_hash_exists: Boolean
  from_text_hash_gt: String
  OR: [SubmissionEmbeddingQueryInput!]
  from_text_hash_gte: String
  from_text_hash_ne: String
}

enum History_reportSortByInput {
  EPOCH_DATE_DOWNLOADED_DESC
  LANGUAGE_ASC
  PLAIN_TEXT_DESC
  REPORT_NUMBER_DESC
  TITLE_DESC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_ASC
  DATE_PUBLISHED_DESC
  DATE_MODIFIED_DESC
  DATE_SUBMITTED_DESC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_PUBLISHED_ASC
  _ID_ASC
  CLOUDINARY_ID_DESC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  SOURCE_DOMAIN_ASC
  URL_ASC
  USER_DESC
  DATE_DOWNLOADED_DESC
  DATE_SUBMITTED_ASC
  PLAIN_TEXT_ASC
  SOURCE_DOMAIN_DESC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  LANGUAGE_DESC
  USER_ASC
  DESCRIPTION_ASC
  MODIFIEDBY_DESC
  TEXT_ASC
  REPORT_NUMBER_ASC
  URL_DESC
  DATE_PUBLISHED_ASC
  IMAGE_URL_DESC
  MODIFIEDBY_ASC
  TITLE_ASC
  _ID_DESC
  EPOCH_DATE_SUBMITTED_ASC
  IMAGE_URL_ASC
  TEXT_DESC
  EDITOR_NOTES_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_SUBMITTED_DESC
}

input ReportUpdateInput {
  date_published: DateTime
  user: ReportUserRelationInput
  authors_unset: Boolean
  date_published_unset: Boolean
  epoch_date_modified_inc: Int
  inputs_outputs: [String]
  flag_unset: Boolean
  image_url_unset: Boolean
  language: String
  plain_text_unset: Boolean
  date_modified: DateTime
  text: String
  date_submitted_unset: Boolean
  epoch_date_published_unset: Boolean
  epoch_date_submitted_unset: Boolean
  title: String
  is_incident_report: Boolean
  is_incident_report_unset: Boolean
  url_unset: Boolean
  date_downloaded: DateTime
  tags_unset: Boolean
  embedding: ReportEmbeddingUpdateInput
  cloudinary_id: String
  flag: Boolean
  report_number_inc: Int
  plain_text: String
  date_downloaded_unset: Boolean
  editor_notes: String
  epoch_date_downloaded_inc: Int
  image_url: String
  cloudinary_id_unset: Boolean
  submitters: [String]
  description_unset: Boolean
  language_unset: Boolean
  description: String
  embedding_unset: Boolean
  inputs_outputs_unset: Boolean
  source_domain_unset: Boolean
  epoch_date_modified: Int
  epoch_date_submitted_inc: Int
  quiet_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  url: String
  date_modified_unset: Boolean
  submitters_unset: Boolean
  epoch_date_modified_unset: Boolean
  quiet: Boolean
  epoch_date_published: Int
  editor_notes_unset: Boolean
  authors: [String]
  epoch_date_downloaded: Int
  source_domain: String
  _id: ObjectId
  title_unset: Boolean
  report_number_unset: Boolean
  date_submitted: DateTime
  report_number: Int
  text_unset: Boolean
  tags: [String]
  _id_unset: Boolean
  user_unset: Boolean
  epoch_date_published_inc: Int
  epoch_date_submitted: Int
}

input History_reportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input IncidentEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_reports: [Int]
  from_reports_unset: Boolean
}

input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}

type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input NotificationUpdateInput {
  userId_unset: Boolean
  processed_unset: Boolean
  sentDate: DateTime
  type: String
  _id_unset: Boolean
  incident_id: Int
  type_unset: Boolean
  userId: NotificationUserIdRelationInput
  _id: ObjectId
  sentDate_unset: Boolean
  incident_id_inc: Int
  incident_id_unset: Boolean
  processed: Boolean
}

input IncidentNlp_similar_incidentUpdateInput {
  incident_id_unset: Boolean
  similarity: Float
  similarity_unset: Boolean
  similarity_inc: Float
  incident_id: Int
  incident_id_inc: Int
}

input IncidentTsneInsertInput {
  x: Float
  y: Float
}

input TaxaInsertInput {
  dummy_fields: [TaxaDummy_fieldInsertInput]
  field_list: [TaxaField_listInsertInput]
  namespace: String
  weight: Int
  _id: ObjectId
  complete_entities: Boolean
  description: String
}

enum CandidateSortByInput {
  _ID_ASC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  LANGUAGE_ASC
  PLAIN_TEXT_DESC
  TEXT_ASC
  _ID_DESC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  IMAGE_URL_ASC
  LANGUAGE_DESC
  PLAIN_TEXT_ASC
  SIMILARITY_ASC
  SOURCE_DOMAIN_DESC
  TITLE_DESC
  DATE_PUBLISHED_ASC
  SIMILARITY_DESC
  SOURCE_DOMAIN_ASC
  TEXT_DESC
  TITLE_ASC
  URL_ASC
  EPOCH_DATE_PUBLISHED_DESC
  IMAGE_URL_DESC
  URL_DESC
}

input PromoteSubmissionToReportInput {
  incident_ids: [Int]
  is_incident_report: Boolean
  submission_id: ObjectId
}

input SubmissionNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}

input QuickaddQueryInput {
  incident_id_in: [Long]
  source_domain_lte: String
  OR: [QuickaddQueryInput!]
  _id_gte: ObjectId
  date_submitted_nin: [String]
  incident_id_nin: [Long]
  source_domain_lt: String
  AND: [QuickaddQueryInput!]
  incident_id_gte: Long
  url_gt: String
  incident_id_exists: Boolean
  _id_gt: ObjectId
  date_submitted_gt: String
  _id_nin: [ObjectId]
  date_submitted_in: [String]
  source_domain_in: [String]
  url_nin: [String]
  url_ne: String
  incident_id_ne: Long
  _id_lte: ObjectId
  incident_id_lte: Long
  source_domain_ne: String
  date_submitted: String
  incident_id: Long
  _id: ObjectId
  url_exists: Boolean
  date_submitted_ne: String
  source_domain_gt: String
  _id_lt: ObjectId
  date_submitted_lte: String
  _id_ne: ObjectId
  url_in: [String]
  source_domain_nin: [String]
  _id_in: [ObjectId]
  url_lt: String
  date_submitted_exists: Boolean
  url_gte: String
  source_domain_gte: String
  source_domain: String
  source_domain_exists: Boolean
  date_submitted_gte: String
  url: String
  date_submitted_lt: String
  incident_id_lt: Long
  url_lte: String
  _id_exists: Boolean
  incident_id_gt: Long
}

type Classification {
  _id: ObjectId
  attributes: [ClassificationAttribute]
  incidents: [Incident]!
  namespace: String!
  notes: String
  publish: Boolean
  reports: [Report]!
}

input History_incidentEmbeddingQueryInput {
  vector_exists: Boolean
  AND: [History_incidentEmbeddingQueryInput!]
  from_reports_exists: Boolean
  vector: [Float]
  vector_nin: [Float]
  OR: [History_incidentEmbeddingQueryInput!]
  from_reports_in: [Int]
  vector_in: [Float]
  from_reports_nin: [Int]
  from_reports: [Int]
}

type LogReportHistoryPayload {
  report_number: Int
}

input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input IncidentInsertInput {
  flagged_dissimilar_incidents: [Int]
  reports: IncidentReportsRelationInput!
  editor_notes: String
  embedding: IncidentEmbeddingInsertInput
  epoch_date_modified: Int
  _id: ObjectId
  tsne: IncidentTsneInsertInput
  incident_id: Int!
  editor_similar_incidents: [Int]
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  title: String!
  editor_dissimilar_incidents: [Int]
  date: String!
  implicated_systems: IncidentImplicated_systemsRelationInput
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  editors: IncidentEditorsRelationInput!
  description: String
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
}

input ReportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input NotificationQueryInput {
  sentDate: DateTime
  processed_exists: Boolean
  _id_lte: ObjectId
  OR: [NotificationQueryInput!]
  type: String
  type_nin: [String]
  _id_gt: ObjectId
  _id_gte: ObjectId
  processed: Boolean
  type_in: [String]
  incident_id_ne: Int
  type_exists: Boolean
  sentDate_in: [DateTime]
  _id_exists: Boolean
  type_gte: String
  incident_id_in: [Int]
  AND: [NotificationQueryInput!]
  incident_id_nin: [Int]
  incident_id_lte: Int
  sentDate_gt: DateTime
  sentDate_lte: DateTime
  type_lt: String
  incident_id_gte: Int
  incident_id_exists: Boolean
  sentDate_nin: [DateTime]
  incident_id: Int
  _id_in: [ObjectId]
  type_gt: String
  type_lte: String
  _id_lt: ObjectId
  _id_ne: ObjectId
  processed_ne: Boolean
  _id_nin: [ObjectId]
  sentDate_gte: DateTime
  sentDate_exists: Boolean
  sentDate_ne: DateTime
  userId_exists: Boolean
  type_ne: String
  incident_id_lt: Int
  userId: UserQueryInput
  incident_id_gt: Int
  _id: ObjectId
  sentDate_lt: DateTime
}

input IncidentImplicated_systemsRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input SubmissionInsertInput {
  submitters: [String]!
  epoch_date_modified: Int
  cloudinary_id: String
  title: String!
  url: String!
  _id: ObjectId
  date_downloaded: String!
  user: SubmissionUserRelationInput
  date_published: String!
  image_url: String!
  incident_editors: SubmissionIncident_editorsRelationInput
  editor_similar_incidents: [Int]
  text: String!
  date_submitted: String!
  embedding: SubmissionEmbeddingInsertInput
  date_modified: String!
  tags: [String]!
  incident_title: String
  deployers: SubmissionDeployersRelationInput
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  plain_text: String
  authors: [String]!
  editor_notes: String
  incident_ids: [Int]
  harmed_parties: SubmissionHarmed_partiesRelationInput
  quiet: Boolean
  description: String
  developers: SubmissionDevelopersRelationInput
  language: String!
  implicated_systems: SubmissionImplicated_systemsRelationInput
  source_domain: String!
  status: String
  editor_dissimilar_incidents: [Int]
  incident_date: String
}

input ChecklistRiskPrecedentQueryInput {
  title_exists: Boolean
  tags_exists: Boolean
  incident_id_exists: Boolean
  title_gte: String
  title: String
  description_lte: String
  incident_id_lte: Int
  incident_id_gte: Int
  description_nin: [String]
  description: String
  incident_id_ne: Int
  title_lt: String
  tags: [String]
  incident_id_in: [Int]
  description_lt: String
  title_nin: [String]
  OR: [ChecklistRiskPrecedentQueryInput!]
  description_exists: Boolean
  tags_in: [String]
  incident_id: Int
  title_ne: String
  description_ne: String
  description_gte: String
  incident_id_gt: Int
  tags_nin: [String]
  incident_id_lt: Int
  title_gt: String
  title_in: [String]
  incident_id_nin: [Int]
  title_lte: String
  AND: [ChecklistRiskPrecedentQueryInput!]
  description_in: [String]
  description_gt: String
}

input SubmissionQueryInput {
  cloudinary_id_ne: String
  submitters_nin: [String]
  title_ne: String
  date_downloaded_nin: [String]
  incident_ids_exists: Boolean
  language_gt: String
  editor_similar_incidents_nin: [Int]
  date_published_ne: String
  title_nin: [String]
  date_modified_in: [String]
  _id_nin: [ObjectId]
  incident_date_exists: Boolean
  AND: [SubmissionQueryInput!]
  incident_editors_exists: Boolean
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  url_gte: String
  url_gt: String
  cloudinary_id_in: [String]
  incident_editors: [UserQueryInput]
  nlp_similar_incidents_exists: Boolean
  date_modified_lte: String
  plain_text_gt: String
  user: UserQueryInput
  embedding_exists: Boolean
  language_lt: String
  url_lte: String
  incident_title: String
  _id: ObjectId
  submitters_in: [String]
  quiet_exists: Boolean
  image_url_lt: String
  image_url_exists: Boolean
  text_lte: String
  epoch_date_modified_lt: Int
  editor_notes_lt: String
  language_in: [String]
  title_lt: String
  _id_in: [ObjectId]
  date_downloaded_lt: String
  developers: [EntityQueryInput]
  incident_title_lte: String
  incident_ids: [Int]
  description_ne: String
  plain_text_gte: String
  harmed_parties_in: [EntityQueryInput]
  incident_date: String
  developers_nin: [EntityQueryInput]
  date_submitted_exists: Boolean
  image_url_ne: String
  authors_nin: [String]
  incident_editors_nin: [UserQueryInput]
  implicated_systems_in: [EntityQueryInput]
  plain_text_lt: String
  description_lt: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  epoch_date_modified: Int
  status_gte: String
  url_lt: String
  image_url_gte: String
  editor_notes_gt: String
  editor_similar_incidents_exists: Boolean
  plain_text: String
  editor_dissimilar_incidents_nin: [Int]
  cloudinary_id_lt: String
  date_downloaded_ne: String
  incident_date_lt: String
  _id_exists: Boolean
  tags_nin: [String]
  epoch_date_modified_nin: [Int]
  _id_ne: ObjectId
  epoch_date_modified_in: [Int]
  editor_notes_in: [String]
  image_url: String
  deployers_in: [EntityQueryInput]
  text_nin: [String]
  implicated_systems_nin: [EntityQueryInput]
  date_downloaded: String
  source_domain_nin: [String]
  date_published_lt: String
  text_gte: String
  description_exists: Boolean
  title_lte: String
  editor_dissimilar_incidents_in: [Int]
  source_domain: String
  url_in: [String]
  incident_editors_in: [UserQueryInput]
  plain_text_lte: String
  date_modified_lt: String
  status_gt: String
  _id_lt: ObjectId
  source_domain_exists: Boolean
  developers_exists: Boolean
  cloudinary_id_gt: String
  editor_dissimilar_incidents: [Int]
  plain_text_ne: String
  user_exists: Boolean
  editor_notes: String
  authors_exists: Boolean
  date_submitted_lt: String
  text_exists: Boolean
  epoch_date_modified_lte: Int
  submitters_exists: Boolean
  description: String
  date_submitted_lte: String
  date_modified: String
  editor_similar_incidents: [Int]
  status: String
  title_exists: Boolean
  incident_title_lt: String
  date_published_nin: [String]
  epoch_date_modified_exists: Boolean
  language_lte: String
  date_downloaded_gt: String
  date_downloaded_in: [String]
  deployers_exists: Boolean
  _id_lte: ObjectId
  date_published_exists: Boolean
  date_modified_nin: [String]
  date_submitted_ne: String
  date_downloaded_exists: Boolean
  quiet: Boolean
  date_submitted: String
  plain_text_exists: Boolean
  title_gte: String
  epoch_date_modified_gt: Int
  implicated_systems_exists: Boolean
  incident_title_in: [String]
  epoch_date_modified_ne: Int
  harmed_parties: [EntityQueryInput]
  epoch_date_modified_gte: Int
  deployers_nin: [EntityQueryInput]
  OR: [SubmissionQueryInput!]
  cloudinary_id_gte: String
  incident_date_ne: String
  cloudinary_id_nin: [String]
  date_downloaded_gte: String
  editor_similar_incidents_in: [Int]
  date_modified_gt: String
  date_published_gt: String
  date_published_lte: String
  date_submitted_in: [String]
  incident_title_gte: String
  text_in: [String]
  date_submitted_gt: String
  source_domain_gte: String
  incident_title_exists: Boolean
  status_lte: String
  implicated_systems: [EntityQueryInput]
  incident_title_gt: String
  language_ne: String
  incident_date_nin: [String]
  title_in: [String]
  language_gte: String
  description_lte: String
  harmed_parties_exists: Boolean
  url_exists: Boolean
  url_nin: [String]
  incident_date_gte: String
  date_downloaded_lte: String
  source_domain_lt: String
  status_nin: [String]
  title: String
  _id_gt: ObjectId
  incident_title_nin: [String]
  embedding: SubmissionEmbeddingQueryInput
  incident_ids_nin: [Int]
  date_published: String
  authors: [String]
  editor_dissimilar_incidents_exists: Boolean
  incident_title_ne: String
  language_exists: Boolean
  source_domain_ne: String
  cloudinary_id_lte: String
  date_modified_ne: String
  developers_in: [EntityQueryInput]
  cloudinary_id_exists: Boolean
  status_ne: String
  status_lt: String
  incident_date_in: [String]
  tags_exists: Boolean
  _id_gte: ObjectId
  status_exists: Boolean
  incident_ids_in: [Int]
  deployers: [EntityQueryInput]
  url_ne: String
  description_gt: String
  url: String
  date_published_gte: String
  language_nin: [String]
  authors_in: [String]
  description_gte: String
  description_nin: [String]
  plain_text_in: [String]
  date_modified_exists: Boolean
  description_in: [String]
  text_gt: String
  source_domain_in: [String]
  image_url_lte: String
  text: String
  source_domain_gt: String
  title_gt: String
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  image_url_nin: [String]
  editor_notes_lte: String
  editor_notes_exists: Boolean
  image_url_gt: String
  submitters: [String]
  editor_notes_nin: [String]
  date_published_in: [String]
  incident_date_lte: String
  status_in: [String]
  plain_text_nin: [String]
  text_lt: String
  editor_notes_ne: String
  text_ne: String
  harmed_parties_nin: [EntityQueryInput]
  date_submitted_nin: [String]
  date_submitted_gte: String
  date_modified_gte: String
  image_url_in: [String]
  source_domain_lte: String
  incident_date_gt: String
  editor_notes_gte: String
  tags_in: [String]
  language: String
  tags: [String]
  cloudinary_id: String
  quiet_ne: Boolean
}

input EntityInsertInput {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}

type LogIncidentHistoryPayload {
  incident_id: Int
}

type History_report {
  _id: ObjectId
  authors: [String]!
  cloudinary_id: String!
  date_downloaded: DateTime!
  date_modified: DateTime!
  date_published: DateTime!
  date_submitted: DateTime!
  description: String
  editor_notes: String
  embedding: History_reportEmbedding
  epoch_date_downloaded: Int!
  epoch_date_modified: Int!
  epoch_date_published: Int!
  epoch_date_submitted: Int!
  flag: Boolean
  image_url: String!
  inputs_outputs: [String]
  is_incident_report: Boolean
  language: String!
  modifiedBy: String
  plain_text: String!
  quiet: Boolean
  report_number: Int!
  source_domain: String!
  submitters: [String]!
  tags: [String]!
  text: String!
  title: String!
  url: String!
  user: String
}

enum ReportSortByInput {
  CLOUDINARY_ID_ASC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_SUBMITTED_DESC
  IMAGE_URL_DESC
  _ID_DESC
  TITLE_DESC
  DATE_PUBLISHED_ASC
  EDITOR_NOTES_DESC
  LANGUAGE_ASC
  LANGUAGE_DESC
  SOURCE_DOMAIN_DESC
  TEXT_ASC
  IMAGE_URL_ASC
  URL_ASC
  _ID_ASC
  DATE_SUBMITTED_ASC
  DATE_SUBMITTED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  URL_DESC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  REPORT_NUMBER_ASC
  TEXT_DESC
  USER_ASC
  DATE_MODIFIED_ASC
  PLAIN_TEXT_DESC
  REPORT_NUMBER_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  TITLE_ASC
  USER_DESC
  EPOCH_DATE_MODIFIED_DESC
  PLAIN_TEXT_ASC
  CLOUDINARY_ID_DESC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_DESC
  DATE_PUBLISHED_DESC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_ASC
  SOURCE_DOMAIN_ASC
}

enum NotificationSortByInput {
  USERID_ASC
  _ID_DESC
  INCIDENT_ID_ASC
  SENTDATE_ASC
  SENTDATE_DESC
  TYPE_DESC
  _ID_ASC
  INCIDENT_ID_DESC
  TYPE_ASC
  USERID_DESC
}

input CandidateClassification_similarityUpdateInput {
  similarity_unset: Boolean
  classification: String
  classification_unset: Boolean
  similarity: Float
  similarity_inc: Float
}

input History_incidentEmbeddingUpdateInput {
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input LinkReportsToIncidentsInput {
  incident_ids: [Int]
  report_numbers: [Int]
}

input IncidentEmbeddingQueryInput {
  from_reports_nin: [Int]
  vector_in: [Float]
  vector_nin: [Float]
  vector_exists: Boolean
  AND: [IncidentEmbeddingQueryInput!]
  from_reports_exists: Boolean
  vector: [Float]
  OR: [IncidentEmbeddingQueryInput!]
  from_reports: [Int]
  from_reports_in: [Int]
}

input History_incidentTsneInsertInput {
  y: Float
  x: Float
}

input ReportQueryInput {
  AND: [ReportQueryInput!]
  date_published: DateTime
  date_submitted_lte: DateTime
  _id_nin: [ObjectId]
  date_downloaded: DateTime
  language: String
  embedding_exists: Boolean
  editor_notes_nin: [String]
  date_modified_ne: DateTime
  epoch_date_published_gte: Int
  submitters: [String]
  editor_notes_in: [String]
  epoch_date_published_in: [Int]
  date_published_lte: DateTime
  text_gte: String
  epoch_date_downloaded: Int
  date_published_ne: DateTime
  epoch_date_submitted_lt: Int
  image_url_in: [String]
  title_exists: Boolean
  date_submitted_ne: DateTime
  editor_notes: String
  authors_exists: Boolean
  source_domain_gt: String
  description_gte: String
  image_url: String
  date_downloaded_exists: Boolean
  text_nin: [String]
  is_incident_report_ne: Boolean
  epoch_date_submitted_ne: Int
  language_exists: Boolean
  image_url_nin: [String]
  _id_ne: ObjectId
  date_modified_nin: [DateTime]
  plain_text_exists: Boolean
  source_domain: String
  url_ne: String
  editor_notes_lt: String
  tags_exists: Boolean
  image_url_lt: String
  epoch_date_submitted_lte: Int
  date_downloaded_gt: DateTime
  user: UserQueryInput
  source_domain_lt: String
  quiet_ne: Boolean
  quiet_exists: Boolean
  date_downloaded_lte: DateTime
  epoch_date_published_lte: Int
  flag_exists: Boolean
  date_downloaded_ne: DateTime
  submitters_nin: [String]
  cloudinary_id_exists: Boolean
  epoch_date_downloaded_gte: Int
  text: String
  language_lt: String
  title_lte: String
  epoch_date_downloaded_lte: Int
  date_published_lt: DateTime
  cloudinary_id_gte: String
  date_submitted_in: [DateTime]
  date_downloaded_gte: DateTime
  date_submitted_exists: Boolean
  image_url_ne: String
  tags_in: [String]
  plain_text: String
  plain_text_lt: String
  epoch_date_downloaded_gt: Int
  report_number_nin: [Int]
  date_published_gt: DateTime
  plain_text_in: [String]
  epoch_date_modified: Int
  date_modified_gte: DateTime
  submitters_in: [String]
  epoch_date_submitted_gte: Int
  url_lte: String
  source_domain_ne: String
  epoch_date_submitted_gt: Int
  editor_notes_exists: Boolean
  flag: Boolean
  plain_text_gt: String
  source_domain_nin: [String]
  source_domain_exists: Boolean
  url: String
  date_submitted_gte: DateTime
  report_number_exists: Boolean
  description_lte: String
  text_exists: Boolean
  date_submitted_gt: DateTime
  cloudinary_id: String
  title: String
  cloudinary_id_lte: String
  date_published_gte: DateTime
  epoch_date_modified_in: [Int]
  source_domain_in: [String]
  date_submitted_lt: DateTime
  tags_nin: [String]
  epoch_date_downloaded_in: [Int]
  date_modified_gt: DateTime
  inputs_outputs_exists: Boolean
  date_downloaded_nin: [DateTime]
  source_domain_lte: String
  _id_lte: ObjectId
  date_submitted_nin: [DateTime]
  epoch_date_submitted_exists: Boolean
  report_number_gt: Int
  editor_notes_ne: String
  _id: ObjectId
  text_lte: String
  user_exists: Boolean
  epoch_date_published_ne: Int
  is_incident_report_exists: Boolean
  inputs_outputs_in: [String]
  url_nin: [String]
  description_ne: String
  description_lt: String
  epoch_date_published_lt: Int
  date_submitted: DateTime
  _id_lt: ObjectId
  _id_gt: ObjectId
  cloudinary_id_in: [String]
  cloudinary_id_gt: String
  title_in: [String]
  epoch_date_published_gt: Int
  date_modified_exists: Boolean
  epoch_date_modified_lt: Int
  cloudinary_id_ne: String
  epoch_date_downloaded_lt: Int
  date_modified_lte: DateTime
  title_lt: String
  inputs_outputs: [String]
  plain_text_lte: String
  epoch_date_submitted_in: [Int]
  text_lt: String
  description_exists: Boolean
  epoch_date_submitted_nin: [Int]
  epoch_date_modified_gt: Int
  epoch_date_published: Int
  epoch_date_published_nin: [Int]
  date_published_in: [DateTime]
  image_url_lte: String
  epoch_date_modified_exists: Boolean
  title_gte: String
  text_ne: String
  submitters_exists: Boolean
  image_url_gte: String
  date_modified_in: [DateTime]
  epoch_date_downloaded_exists: Boolean
  date_downloaded_in: [DateTime]
  image_url_exists: Boolean
  url_lt: String
  epoch_date_submitted: Int
  cloudinary_id_lt: String
  report_number_in: [Int]
  title_nin: [String]
  editor_notes_gte: String
  epoch_date_modified_gte: Int
  embedding: ReportEmbeddingQueryInput
  authors: [String]
  authors_nin: [String]
  image_url_gt: String
  date_published_exists: Boolean
  url_gte: String
  quiet: Boolean
  description_in: [String]
  url_exists: Boolean
  description_gt: String
  source_domain_gte: String
  title_ne: String
  epoch_date_modified_lte: Int
  plain_text_ne: String
  is_incident_report: Boolean
  language_nin: [String]
  language_ne: String
  date_downloaded_lt: DateTime
  language_lte: String
  OR: [ReportQueryInput!]
  date_modified: DateTime
  text_gt: String
  editor_notes_lte: String
  authors_in: [String]
  language_gt: String
  url_in: [String]
  text_in: [String]
  report_number_gte: Int
  inputs_outputs_nin: [String]
  cloudinary_id_nin: [String]
  plain_text_gte: String
  report_number_ne: Int
  epoch_date_downloaded_ne: Int
  language_gte: String
  report_number_lt: Int
  epoch_date_downloaded_nin: [Int]
  tags: [String]
  url_gt: String
  report_number: Int
  description: String
  description_nin: [String]
  title_gt: String
  _id_in: [ObjectId]
  plain_text_nin: [String]
  _id_exists: Boolean
  epoch_date_modified_ne: Int
  report_number_lte: Int
  language_in: [String]
  flag_ne: Boolean
  editor_notes_gt: String
  epoch_date_published_exists: Boolean
  date_published_nin: [DateTime]
  _id_gte: ObjectId
  epoch_date_modified_nin: [Int]
  date_modified_lt: DateTime
}

input ClassificationUpdateInput {
  reports_unset: Boolean
  notes: String
  reports: ClassificationReportsRelationInput
  _id: ObjectId
  incidents: ClassificationIncidentsRelationInput
  incidents_unset: Boolean
  notes_unset: Boolean
  attributes_unset: Boolean
  _id_unset: Boolean
  attributes: [ClassificationAttributeUpdateInput]
  namespace_unset: Boolean
  publish_unset: Boolean
  namespace: String
  publish: Boolean
}

input History_incidentTsneUpdateInput {
  x: Float
  x_inc: Float
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
}

input QuickaddInsertInput {
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
  _id: ObjectId
}

input History_reportEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input SubmissionEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input DuplicateInsertInput {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input History_reportQueryInput {
  text_ne: String
  authors_in: [String]
  date_published_gt: DateTime
  _id_gte: ObjectId
  source_domain_gte: String
  text: String
  inputs_outputs_in: [String]
  editor_notes_in: [String]
  epoch_date_modified_gt: Int
  url_ne: String
  image_url_lt: String
  url_lte: String
  description_in: [String]
  report_number_in: [Int]
  user_gte: String
  inputs_outputs_nin: [String]
  url_in: [String]
  text_lte: String
  epoch_date_downloaded_gte: Int
  _id_in: [ObjectId]
  quiet_ne: Boolean
  url_gte: String
  date_submitted_lte: DateTime
  title_lte: String
  title_gte: String
  epoch_date_modified_nin: [Int]
  date_published: DateTime
  plain_text_gte: String
  text_gt: String
  epoch_date_submitted_in: [Int]
  user_lt: String
  date_downloaded: DateTime
  report_number_gt: Int
  date_downloaded_gte: DateTime
  report_number_lte: Int
  user_gt: String
  submitters_in: [String]
  epoch_date_submitted_gt: Int
  OR: [History_reportQueryInput!]
  date_modified_ne: DateTime
  user_lte: String
  cloudinary_id_nin: [String]
  date_submitted_ne: DateTime
  quiet: Boolean
  image_url_gt: String
  description_gt: String
  text_gte: String
  description_nin: [String]
  date_submitted_in: [DateTime]
  language_lte: String
  plain_text_lt: String
  date_downloaded_lt: DateTime
  report_number_exists: Boolean
  epoch_date_downloaded: Int
  language_gte: String
  description_exists: Boolean
  title_gt: String
  title_nin: [String]
  image_url_gte: String
  url_gt: String
  date_downloaded_in: [DateTime]
  plain_text_ne: String
  source_domain_lte: String
  submitters_nin: [String]
  authors_nin: [String]
  date_modified: DateTime
  epoch_date_downloaded_nin: [Int]
  cloudinary_id_ne: String
  plain_text_nin: [String]
  text_in: [String]
  _id_exists: Boolean
  AND: [History_reportQueryInput!]
  epoch_date_published: Int
  epoch_date_published_gte: Int
  submitters: [String]
  modifiedBy_ne: String
  image_url_nin: [String]
  inputs_outputs: [String]
  authors_exists: Boolean
  modifiedBy_exists: Boolean
  url_exists: Boolean
  date_modified_gt: DateTime
  description_ne: String
  text_nin: [String]
  epoch_date_modified_lte: Int
  is_incident_report: Boolean
  date_modified_gte: DateTime
  editor_notes: String
  user_exists: Boolean
  epoch_date_published_lte: Int
  epoch_date_submitted_gte: Int
  date_submitted_gt: DateTime
  epoch_date_submitted: Int
  source_domain: String
  date_published_gte: DateTime
  report_number_nin: [Int]
  image_url_exists: Boolean
  user_ne: String
  embedding_exists: Boolean
  epoch_date_published_ne: Int
  epoch_date_modified_in: [Int]
  text_exists: Boolean
  image_url: String
  date_modified_nin: [DateTime]
  epoch_date_published_lt: Int
  language_nin: [String]
  _id_lt: ObjectId
  source_domain_nin: [String]
  date_modified_lte: DateTime
  language_gt: String
  inputs_outputs_exists: Boolean
  date_submitted_lt: DateTime
  description_lt: String
  epoch_date_submitted_exists: Boolean
  title_ne: String
  editor_notes_lte: String
  editor_notes_exists: Boolean
  title: String
  cloudinary_id_lt: String
  language_in: [String]
  report_number_gte: Int
  epoch_date_downloaded_exists: Boolean
  date_downloaded_exists: Boolean
  plain_text_lte: String
  epoch_date_downloaded_ne: Int
  user: String
  date_published_ne: DateTime
  date_downloaded_gt: DateTime
  modifiedBy_lt: String
  epoch_date_published_gt: Int
  language: String
  epoch_date_submitted_ne: Int
  plain_text_in: [String]
  title_lt: String
  date_modified_exists: Boolean
  tags_in: [String]
  date_modified_lt: DateTime
  modifiedBy_gt: String
  user_nin: [String]
  _id_gt: ObjectId
  source_domain_gt: String
  epoch_date_published_nin: [Int]
  editor_notes_ne: String
  tags_nin: [String]
  epoch_date_modified_ne: Int
  source_domain_ne: String
  date_downloaded_nin: [DateTime]
  modifiedBy_lte: String
  date_published_in: [DateTime]
  plain_text_gt: String
  epoch_date_modified: Int
  modifiedBy: String
  url_lt: String
  epoch_date_modified_lt: Int
  date_published_exists: Boolean
  report_number_lt: Int
  tags_exists: Boolean
  flag_exists: Boolean
  language_ne: String
  epoch_date_published_in: [Int]
  epoch_date_downloaded_lte: Int
  submitters_exists: Boolean
  quiet_exists: Boolean
  date_published_nin: [DateTime]
  _id_lte: ObjectId
  date_published_lte: DateTime
  cloudinary_id: String
  modifiedBy_nin: [String]
  editor_notes_lt: String
  date_submitted_exists: Boolean
  modifiedBy_gte: String
  description_gte: String
  report_number_ne: Int
  image_url_ne: String
  date_downloaded_ne: DateTime
  language_lt: String
  image_url_in: [String]
  description: String
  user_in: [String]
  is_incident_report_exists: Boolean
  epoch_date_downloaded_gt: Int
  cloudinary_id_exists: Boolean
  date_submitted_nin: [DateTime]
  cloudinary_id_gte: String
  is_incident_report_ne: Boolean
  editor_notes_nin: [String]
  epoch_date_downloaded_in: [Int]
  epoch_date_submitted_lte: Int
  plain_text: String
  source_domain_in: [String]
  plain_text_exists: Boolean
  epoch_date_published_exists: Boolean
  epoch_date_modified_exists: Boolean
  date_submitted: DateTime
  epoch_date_downloaded_lt: Int
  modifiedBy_in: [String]
  date_published_lt: DateTime
  language_exists: Boolean
  epoch_date_submitted_lt: Int
  report_number: Int
  editor_notes_gt: String
  _id: ObjectId
  date_modified_in: [DateTime]
  cloudinary_id_gt: String
  embedding: History_reportEmbeddingQueryInput
  source_domain_exists: Boolean
  title_in: [String]
  url_nin: [String]
  _id_ne: ObjectId
  epoch_date_modified_gte: Int
  description_lte: String
  _id_nin: [ObjectId]
  flag_ne: Boolean
  title_exists: Boolean
  source_domain_lt: String
  epoch_date_submitted_nin: [Int]
  date_downloaded_lte: DateTime
  text_lt: String
  editor_notes_gte: String
  tags: [String]
  date_submitted_gte: DateTime
  flag: Boolean
  authors: [String]
  cloudinary_id_lte: String
  url: String
  image_url_lte: String
  cloudinary_id_in: [String]
}

type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input IncidentTsneUpdateInput {
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
  x_unset: Boolean
  y: Float
}

input ClassificationInsertInput {
  attributes: [ClassificationAttributeInsertInput]
  incidents: ClassificationIncidentsRelationInput!
  namespace: String!
  notes: String
  publish: Boolean
  reports: ClassificationReportsRelationInput!
  _id: ObjectId
}

type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

type IncidentTsne {
  x: Float
  y: Float
}

input ClassificationIncidentsRelationInput {
  create: [IncidentInsertInput]
  link: [Int]
}

input ClassificationReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

input CandidateEmbeddingQueryInput {
  vector_nin: [Float]
  from_text_hash: String
  OR: [CandidateEmbeddingQueryInput!]
  vector_exists: Boolean
  AND: [CandidateEmbeddingQueryInput!]
  from_text_hash_exists: Boolean
  from_text_hash_gt: String
  from_text_hash_lt: String
  from_text_hash_gte: String
  from_text_hash_nin: [String]
  from_text_hash_ne: String
  from_text_hash_in: [String]
  from_text_hash_lte: String
  vector: [Float]
  vector_in: [Float]
}

input TaxaDummy_fieldUpdateInput {
  field_number: String
  field_number_unset: Boolean
  short_name: String
  short_name_unset: Boolean
}

input CandidateUpdateInput {
  url: String
  plain_text_unset: Boolean
  date_published: String
  image_url: String
  epoch_date_downloaded: Int
  matching_harm_keywords: [String]
  _id: ObjectId
  classification_similarity_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  authors_unset: Boolean
  embedding_unset: Boolean
  title_unset: Boolean
  similarity_unset: Boolean
  matching_harm_keywords_unset: Boolean
  match_unset: Boolean
  epoch_date_published: Int
  similarity: Float
  epoch_date_downloaded_inc: Int
  matching_entities: [String]
  date_downloaded_unset: Boolean
  dismissed: Boolean
  matching_entities_unset: Boolean
  source_domain: String
  plain_text: String
  epoch_date_published_unset: Boolean
  matching_keywords_unset: Boolean
  title: String
  authors: [String]
  text: String
  dismissed_unset: Boolean
  language: String
  similarity_inc: Float
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  date_downloaded: String
  date_published_unset: Boolean
  image_url_unset: Boolean
  url_unset: Boolean
  epoch_date_published_inc: Int
  match: Boolean
  _id_unset: Boolean
  matching_keywords: [String]
  source_domain_unset: Boolean
  text_unset: Boolean
  embedding: CandidateEmbeddingUpdateInput
  language_unset: Boolean
}

input ClassificationQueryInput {
  notes_lte: String
  namespace_nin: [String]
  namespace_exists: Boolean
  _id_gte: ObjectId
  _id_ne: ObjectId
  namespace_gte: String
  _id: ObjectId
  _id_lt: ObjectId
  notes_gt: String
  notes_lt: String
  reports_nin: [ReportQueryInput]
  incidents_nin: [IncidentQueryInput]
  publish: Boolean
  notes_in: [String]
  namespace: String
  _id_nin: [ObjectId]
  namespace_in: [String]
  namespace_gt: String
  AND: [ClassificationQueryInput!]
  attributes_in: [ClassificationAttributeQueryInput]
  notes: String
  reports_exists: Boolean
  OR: [ClassificationQueryInput!]
  attributes: [ClassificationAttributeQueryInput]
  _id_lte: ObjectId
  notes_nin: [String]
  _id_gt: ObjectId
  notes_ne: String
  namespace_ne: String
  publish_exists: Boolean
  publish_ne: Boolean
  incidents: [IncidentQueryInput]
  reports_in: [ReportQueryInput]
  reports: [ReportQueryInput]
  incidents_in: [IncidentQueryInput]
  namespace_lte: String
  incidents_exists: Boolean
  notes_gte: String
  notes_exists: Boolean
  _id_in: [ObjectId]
  attributes_nin: [ClassificationAttributeQueryInput]
  attributes_exists: Boolean
  namespace_lt: String
  _id_exists: Boolean
}

input CandidateInsertInput {
  _id: ObjectId
  epoch_date_downloaded: Int
  classification_similarity: [CandidateClassification_similarityInsertInput]
  image_url: String
  epoch_date_published: Int
  language: String
  matching_entities: [String]
  text: String
  source_domain: String
  authors: [String]
  matching_keywords: [String]
  plain_text: String
  url: String!
  date_published: String
  dismissed: Boolean
  similarity: Float
  title: String
  embedding: CandidateEmbeddingInsertInput
  match: Boolean!
  matching_harm_keywords: [String]
  date_downloaded: String
}

input TaxaField_listItem_fieldComplete_fromQueryInput {
  all_exists: Boolean
  entities_exists: Boolean
  entities_ne: Boolean
  current: [String]
  entities: Boolean
  all: [String]
  all_nin: [String]
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  current_nin: [String]
  current_exists: Boolean
  current_in: [String]
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all_in: [String]
}

enum SubscriptionSortByInput {
  ENTITYID_ASC
  ENTITYID_DESC
  INCIDENT_ID_DESC
  USERID_ASC
  USERID_DESC
  _ID_ASC
  _ID_DESC
  INCIDENT_ID_ASC
  TYPE_ASC
  TYPE_DESC
}

type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}

input TaxaField_listItem_fieldUpdateInput {
  field_number: String
  display_type_unset: Boolean
  placeholder: String
  mongo_type: String
  short_description: String
  short_description_unset: Boolean
  weight_unset: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  field_number_unset: Boolean
  default: String
  long_description_unset: Boolean
  complete_from_unset: Boolean
  public_unset: Boolean
  long_description: String
  permitted_values: [String]
  required: Boolean
  mongo_type_unset: Boolean
  long_name: String
  public: Boolean
  required_unset: Boolean
  short_name_unset: Boolean
  permitted_values_unset: Boolean
  instant_facet_unset: Boolean
  long_name_unset: Boolean
  display_type: String
  placeholder_unset: Boolean
  weight: Int
  instant_facet: Boolean
  weight_inc: Int
  default_unset: Boolean
  short_name: String
}

input TaxaField_listItem_fieldQueryInput {
  short_description_lt: String
  public_ne: Boolean
  short_name_nin: [String]
  mongo_type_lt: String
  public: Boolean
  long_name_gte: String
  placeholder_gte: String
  mongo_type_nin: [String]
  long_description_lte: String
  placeholder_ne: String
  short_name_exists: Boolean
  display_type_exists: Boolean
  display_type_in: [String]
  field_number_gt: String
  weight_ne: Int
  default_ne: String
  complete_from_exists: Boolean
  weight_nin: [Int]
  required_ne: Boolean
  short_name_gte: String
  long_name_exists: Boolean
  display_type_gt: String
  long_description_gt: String
  default_gt: String
  field_number_exists: Boolean
  field_number_ne: String
  long_name_in: [String]
  placeholder_exists: Boolean
  short_name_lte: String
  short_description: String
  field_number_in: [String]
  long_name_gt: String
  permitted_values_exists: Boolean
  display_type_ne: String
  AND: [TaxaField_listItem_fieldQueryInput!]
  display_type: String
  long_description_lt: String
  display_type_lt: String
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  weight_lte: Int
  placeholder_nin: [String]
  long_name: String
  mongo_type_gte: String
  default_lte: String
  placeholder: String
  instant_facet_exists: Boolean
  mongo_type_in: [String]
  long_name_lte: String
  default: String
  permitted_values: [String]
  instant_facet: Boolean
  display_type_lte: String
  long_description: String
  field_number_lt: String
  weight_lt: Int
  mongo_type_gt: String
  permitted_values_nin: [String]
  long_name_ne: String
  mongo_type_lte: String
  short_description_exists: Boolean
  permitted_values_in: [String]
  weight_exists: Boolean
  default_lt: String
  public_exists: Boolean
  mongo_type_ne: String
  weight_in: [Int]
  short_name_in: [String]
  weight_gt: Int
  field_number_lte: String
  short_name_gt: String
  field_number_gte: String
  weight: Int
  long_name_nin: [String]
  long_description_gte: String
  short_description_ne: String
  mongo_type_exists: Boolean
  field_number_nin: [String]
  mongo_type: String
  short_description_gt: String
  instant_facet_ne: Boolean
  default_exists: Boolean
  default_gte: String
  required_exists: Boolean
  long_name_lt: String
  short_name_lt: String
  long_description_in: [String]
  short_name_ne: String
  OR: [TaxaField_listItem_fieldQueryInput!]
  field_number: String
  long_description_exists: Boolean
  long_description_nin: [String]
  short_description_gte: String
  placeholder_in: [String]
  display_type_nin: [String]
  placeholder_gt: String
  display_type_gte: String
  placeholder_lt: String
  short_description_in: [String]
  short_description_lte: String
  short_description_nin: [String]
  default_nin: [String]
  long_description_ne: String
  required: Boolean
  weight_gte: Int
  placeholder_lte: String
  default_in: [String]
  short_name: String
}

type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}

input IncidentAllegedDeployerOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}

type Entity {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}

type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}

type CreateVariantPayload {
  incident_id: Int
  report_number: Int
}

input History_reportUpdateInput {
  title_unset: Boolean
  quiet_unset: Boolean
  report_number_unset: Boolean
  embedding_unset: Boolean
  epoch_date_submitted_inc: Int
  epoch_date_submitted_unset: Boolean
  editor_notes_unset: Boolean
  source_domain_unset: Boolean
  description_unset: Boolean
  authors: [String]
  user_unset: Boolean
  date_published_unset: Boolean
  epoch_date_downloaded: Int
  epoch_date_modified_inc: Int
  epoch_date_downloaded_inc: Int
  quiet: Boolean
  authors_unset: Boolean
  epoch_date_modified: Int
  tags_unset: Boolean
  date_modified_unset: Boolean
  plain_text_unset: Boolean
  image_url_unset: Boolean
  description: String
  source_domain: String
  date_published: DateTime
  language_unset: Boolean
  text_unset: Boolean
  url_unset: Boolean
  cloudinary_id: String
  epoch_date_published_unset: Boolean
  epoch_date_modified_unset: Boolean
  report_number: Int
  submitters_unset: Boolean
  flag_unset: Boolean
  date_downloaded_unset: Boolean
  submitters: [String]
  image_url: String
  date_submitted: DateTime
  report_number_inc: Int
  epoch_date_published: Int
  plain_text: String
  text: String
  flag: Boolean
  is_incident_report_unset: Boolean
  embedding: History_reportEmbeddingUpdateInput
  date_downloaded: DateTime
  is_incident_report: Boolean
  _id: ObjectId
  epoch_date_submitted: Int
  _id_unset: Boolean
  editor_notes: String
  cloudinary_id_unset: Boolean
  tags: [String]
  epoch_date_downloaded_unset: Boolean
  url: String
  inputs_outputs_unset: Boolean
  date_modified: DateTime
  modifiedBy_unset: Boolean
  title: String
  date_submitted_unset: Boolean
  modifiedBy: String
  user: String
  epoch_date_published_inc: Int
  language: String
  inputs_outputs: [String]
}

type ClassificationAttribute {
  short_name: String
  value_json: String
}

type TaxaField_listComplete_from {
  all: [String]
  current: [String]
}

input History_incidentNlp_similar_incidentQueryInput {
  similarity_exists: Boolean
  incident_id_gt: Int
  incident_id_lt: Int
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_in: [Int]
  incident_id_ne: Int
  similarity_ne: Float
  similarity_lte: Float
  similarity_in: [Float]
  similarity_nin: [Float]
  similarity_gt: Float
  similarity: Float
  incident_id_gte: Int
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id: Int
  incident_id_exists: Boolean
  incident_id_lte: Int
  similarity_gte: Float
  similarity_lt: Float
  incident_id_nin: [Int]
}

input ChecklistRiskPrecedentUpdateInput {
  tags: [String]
  title: String
  incident_id_inc: Int
  incident_id_unset: Boolean
  incident_id: Int
  tags_unset: Boolean
  title_unset: Boolean
  description: String
  description_unset: Boolean
}

type User {
  _id: ObjectId
  adminData: UserAdminDatum
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

type Submission {
  _id: ObjectId
  authors: [String]!
  cloudinary_id: String
  date_downloaded: String!
  date_modified: String!
  date_published: String!
  date_submitted: String!
  deployers: [Entity]
  description: String
  developers: [Entity]
  editor_dissimilar_incidents: [Int]
  editor_notes: String
  editor_similar_incidents: [Int]
  embedding: SubmissionEmbedding
  epoch_date_modified: Int
  harmed_parties: [Entity]
  image_url: String!
  implicated_systems: [Entity]
  incident_date: String
  incident_editors: [User]
  incident_ids: [Int]
  incident_title: String
  language: String!
  nlp_similar_incidents: [SubmissionNlp_similar_incident]
  plain_text: String
  quiet: Boolean
  source_domain: String!
  status: String
  submitters: [String]!
  tags: [String]!
  text: String!
  title: String!
  url: String!
  user: User
}

input SubmissionIncident_editorsRelationInput {
  link: [String]
  create: [UserInsertInput]
}

input DuplicateQueryInput {
  _id_gt: ObjectId
  true_incident_number_lt: Int
  true_incident_number: Int
  true_incident_number_in: [Int]
  _id_exists: Boolean
  duplicate_incident_number_nin: [Int]
  AND: [DuplicateQueryInput!]
  _id_gte: ObjectId
  duplicate_incident_number_lt: Int
  duplicate_incident_number_in: [Int]
  true_incident_number_ne: Int
  _id_lt: ObjectId
  duplicate_incident_number_gt: Int
  OR: [DuplicateQueryInput!]
  duplicate_incident_number_lte: Int
  true_incident_number_lte: Int
  _id: ObjectId
  true_incident_number_gte: Int
  true_incident_number_exists: Boolean
  duplicate_incident_number_gte: Int
  _id_nin: [ObjectId]
  _id_lte: ObjectId
  _id_in: [ObjectId]
  _id_ne: ObjectId
  duplicate_incident_number_exists: Boolean
  true_incident_number_nin: [Int]
  duplicate_incident_number: Int
  true_incident_number_gt: Int
  duplicate_incident_number_ne: Int
}

type Checklist {
  _id: ObjectId
  about: String
  date_created: DateTime
  date_updated: DateTime
  entity_id: String
  id: String
  name: String
  owner_id: String
  risks: [ChecklistRisk]
  tags_goals: [String]
  tags_methods: [String]
  tags_other: [String]
}

input History_reportEmbeddingQueryInput {
  vector_exists: Boolean
  from_text_hash_gte: String
  from_text_hash_in: [String]
  from_text_hash: String
  AND: [History_reportEmbeddingQueryInput!]
  vector: [Float]
  from_text_hash_exists: Boolean
  vector_in: [Float]
  from_text_hash_nin: [String]
  vector_nin: [Float]
  from_text_hash_gt: String
  from_text_hash_ne: String
  OR: [History_reportEmbeddingQueryInput!]
  from_text_hash_lt: String
  from_text_hash_lte: String
}

type History_incidentTsne {
  x: Float
  y: Float
}

input IncidentQueryInput {
  description_gt: String
  implicated_systems: [EntityQueryInput]
  epoch_date_modified_gt: Int
  editor_notes_nin: [String]
  editor_notes_lt: String
  incident_id_lte: Int
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  title_exists: Boolean
  description_gte: String
  date_lt: String
  editor_notes_in: [String]
  nlp_similar_incidents_exists: Boolean
  title_lt: String
  date_lte: String
  description_lte: String
  embedding_exists: Boolean
  tsne_exists: Boolean
  date: String
  incident_id_ne: Int
  epoch_date_modified_exists: Boolean
  incident_id_gt: Int
  editor_similar_incidents_nin: [Int]
  editor_notes_exists: Boolean
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  reports_nin: [ReportQueryInput]
  embedding: IncidentEmbeddingQueryInput
  editor_similar_incidents_exists: Boolean
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  _id: ObjectId
  _id_in: [ObjectId]
  editor_dissimilar_incidents_exists: Boolean
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  epoch_date_modified_in: [Int]
  description_nin: [String]
  _id_lte: ObjectId
  reports_in: [ReportQueryInput]
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  OR: [IncidentQueryInput!]
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  AllegedDeployerOfAISystem_exists: Boolean
  description_exists: Boolean
  incident_id_lt: Int
  tsne: IncidentTsneQueryInput
  implicated_systems_in: [EntityQueryInput]
  editor_dissimilar_incidents: [Int]
  title_nin: [String]
  editor_dissimilar_incidents_in: [Int]
  incident_id_in: [Int]
  editor_similar_incidents: [Int]
  editor_dissimilar_incidents_nin: [Int]
  date_exists: Boolean
  title_ne: String
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  implicated_systems_nin: [EntityQueryInput]
  epoch_date_modified: Int
  implicated_systems_exists: Boolean
  description_in: [String]
  editor_notes_lte: String
  flagged_dissimilar_incidents_exists: Boolean
  date_nin: [String]
  flagged_dissimilar_incidents: [Int]
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  title_in: [String]
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  description: String
  AllegedDeployerOfAISystem: [EntityQueryInput]
  flagged_dissimilar_incidents_nin: [Int]
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  incident_id: Int
  epoch_date_modified_lt: Int
  date_in: [String]
  editor_notes_gte: String
  date_gte: String
  epoch_date_modified_gte: Int
  epoch_date_modified_lte: Int
  editors_exists: Boolean
  AllegedDeveloperOfAISystem_exists: Boolean
  editors_nin: [UserQueryInput]
  date_gt: String
  title: String
  incident_id_gte: Int
  description_lt: String
  editor_similar_incidents_in: [Int]
  _id_gt: ObjectId
  date_ne: String
  epoch_date_modified_nin: [Int]
  epoch_date_modified_ne: Int
  title_gt: String
  incident_id_exists: Boolean
  description_ne: String
  _id_nin: [ObjectId]
  reports: [ReportQueryInput]
  _id_lt: ObjectId
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  _id_exists: Boolean
  editor_notes_ne: String
  flagged_dissimilar_incidents_in: [Int]
  editors: [UserQueryInput]
  AND: [IncidentQueryInput!]
  reports_exists: Boolean
  incident_id_nin: [Int]
  title_gte: String
  title_lte: String
  _id_gte: ObjectId
  editor_notes_gt: String
  editors_in: [UserQueryInput]
  editor_notes: String
  _id_ne: ObjectId
}

input TaxaField_listComplete_fromQueryInput {
  all_exists: Boolean
  current_exists: Boolean
  AND: [TaxaField_listComplete_fromQueryInput!]
  all_in: [String]
  all_nin: [String]
  all: [String]
  OR: [TaxaField_listComplete_fromQueryInput!]
  current: [String]
  current_in: [String]
  current_nin: [String]
}

input SubscriptionQueryInput {
  _id_ne: ObjectId
  _id_nin: [ObjectId]
  _id_gt: ObjectId
  entityId_exists: Boolean
  type_exists: Boolean
  incident_id: IncidentQueryInput
  _id_exists: Boolean
  type_lte: String
  entityId: EntityQueryInput
  type_ne: String
  userId: UserQueryInput
  OR: [SubscriptionQueryInput!]
  type: String
  type_gte: String
  _id_in: [ObjectId]
  type_gt: String
  userId_exists: Boolean
  _id_lte: ObjectId
  type_nin: [String]
  type_lt: String
  _id: ObjectId
  AND: [SubscriptionQueryInput!]
  incident_id_exists: Boolean
  type_in: [String]
  _id_gte: ObjectId
  _id_lt: ObjectId
}

type Candidate {
  _id: ObjectId
  authors: [String]
  classification_similarity: [CandidateClassification_similarity]
  date_downloaded: String
  date_published: String
  dismissed: Boolean
  embedding: CandidateEmbedding
  epoch_date_downloaded: Int
  epoch_date_published: Int
  image_url: String
  language: String
  match: Boolean!
  matching_entities: [String]
  matching_harm_keywords: [String]
  matching_keywords: [String]
  plain_text: String
  similarity: Float
  source_domain: String
  text: String
  title: String
  url: String!
}

type RisksPayloadPrecedent {
  AllegedDeployerOfAISystem: [String]
  AllegedDeveloperOfAISystem: [String]
  AllegedHarmedOrNearlyHarmedParties: [String]
  _id: ObjectId
  date: String
  description: String
  editor_dissimilar_incidents: [Int]
  editor_notes: String
  editor_similar_incidents: [Int]
  editors: [String]
  embedding: RisksPayloadPrecedentEmbedding
  epoch_date_modified: Int
  flagged_dissimilar_incidents: [Int]
  incident_id: Int
  nlp_similar_incidents: [RisksPayloadPrecedentNlp_similar_incident]
  reports: [Int]
  tags: [String]
  title: String
  tsne: RisksPayloadPrecedentTsne
}

input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}

type ReportTranslation {
  text: String
  title: String
}

type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input SubmissionNlp_similar_incidentQueryInput {
  similarity_gte: Float
  similarity_in: [Float]
  incident_id_gte: Int
  incident_id_in: [Int]
  similarity_exists: Boolean
  incident_id_nin: [Int]
  similarity_lt: Float
  incident_id_exists: Boolean
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  similarity: Float
  similarity_ne: Float
  incident_id: Int
  incident_id_gt: Int
  similarity_nin: [Float]
  similarity_gt: Float
  similarity_lte: Float
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_lt: Int
  incident_id_lte: Int
  incident_id_ne: Int
}

input SubmissionHarmed_partiesRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input History_reportInsertInput {
  tags: [String]!
  language: String!
  source_domain: String!
  is_incident_report: Boolean
  epoch_date_downloaded: Int!
  description: String
  editor_notes: String
  report_number: Int!
  date_submitted: DateTime!
  _id: ObjectId
  image_url: String!
  quiet: Boolean
  user: String
  modifiedBy: String
  epoch_date_published: Int!
  flag: Boolean
  date_published: DateTime!
  title: String!
  authors: [String]!
  embedding: History_reportEmbeddingInsertInput
  plain_text: String!
  date_modified: DateTime!
  epoch_date_modified: Int!
  cloudinary_id: String!
  epoch_date_submitted: Int!
  inputs_outputs: [String]
  date_downloaded: DateTime!
  text: String!
  url: String!
  submitters: [String]!
}

type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}

input CandidateClassification_similarityQueryInput {
  similarity_lte: Float
  similarity_gte: Float
  similarity_lt: Float
  classification_in: [String]
  classification_gt: String
  similarity: Float
  similarity_in: [Float]
  similarity_gt: Float
  classification_lte: String
  similarity_ne: Float
  classification_exists: Boolean
  classification_gte: String
  similarity_exists: Boolean
  AND: [CandidateClassification_similarityQueryInput!]
  classification_lt: String
  classification_nin: [String]
  classification: String
  similarity_nin: [Float]
  classification_ne: String
  OR: [CandidateClassification_similarityQueryInput!]
}

input ChecklistRiskUpdateInput {
  touched: Boolean
  tags: [String]
  severity_unset: Boolean
  generated_unset: Boolean
  precedents_unset: Boolean
  precedents: [ChecklistRiskPrecedentUpdateInput]
  title: String
  id_unset: Boolean
  risk_notes: String
  risk_status_unset: Boolean
  touched_unset: Boolean
  risk_status: String
  tags_unset: Boolean
  title_unset: Boolean
  severity: String
  generated: Boolean
  id: String
  risk_notes_unset: Boolean
  likelihood: String
  likelihood_unset: Boolean
}

input TaxaField_listComplete_fromInsertInput {
  all: [String]
  current: [String]
}

input CreateDefaultAdminUserInput {
  email: String
  password: String
}

input SubmissionEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input TaxaField_listItem_fieldInsertInput {
  weight: Int
  public: Boolean
  instant_facet: Boolean
  display_type: String
  long_description: String
  short_description: String
  placeholder: String
  long_name: String
  field_number: String
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
  required: Boolean
  mongo_type: String
  short_name: String
  default: String
  permitted_values: [String]
}

type TaxaField_list {
  complete_from: TaxaField_listComplete_from
  default: String
  display_type: String
  field_number: String
  hide_search: Boolean
  instant_facet: Boolean
  item_fields: TaxaField_listItem_field
  long_description: String
  long_name: String
  mongo_type: String
  permitted_values: [String]
  placeholder: String
  public: Boolean
  required: Boolean
  short_description: String
  short_name: String
  weight: Int
}

enum TaxaSortByInput {
  WEIGHT_ASC
  WEIGHT_DESC
  _ID_ASC
  _ID_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  NAMESPACE_ASC
  NAMESPACE_DESC
}

type UserAdminDatum {
  creationDate: DateTime
  disabled: Boolean
  email: String
  lastAuthenticationDate: DateTime
}

input ClassificationAttributeQueryInput {
  value_json_gt: String
  short_name_nin: [String]
  value_json: String
  short_name_lt: String
  short_name: String
  short_name_lte: String
  value_json_in: [String]
  value_json_nin: [String]
  short_name_in: [String]
  short_name_gte: String
  value_json_exists: Boolean
  short_name_ne: String
  value_json_lt: String
  value_json_ne: String
  AND: [ClassificationAttributeQueryInput!]
  short_name_gt: String
  value_json_lte: String
  short_name_exists: Boolean
  value_json_gte: String
  OR: [ClassificationAttributeQueryInput!]
}

input EntityQueryInput {
  entity_id_lt: String
  name_gt: String
  date_modified_gt: DateTime
  _id_in: [ObjectId]
  created_at_gte: DateTime
  OR: [EntityQueryInput!]
  entity_id_nin: [String]
  date_modified_ne: DateTime
  name_gte: String
  created_at_ne: DateTime
  _id_nin: [ObjectId]
  date_modified_lt: DateTime
  created_at_gt: DateTime
  name_in: [String]
  entity_id_gte: String
  entity_id: String
  name_ne: String
  created_at_lte: DateTime
  created_at_exists: Boolean
  _id_lt: ObjectId
  date_modified_gte: DateTime
  date_modified_nin: [DateTime]
  name_exists: Boolean
  name: String
  entity_id_in: [String]
  created_at: DateTime
  date_modified_lte: DateTime
  name_lt: String
  name_nin: [String]
  AND: [EntityQueryInput!]
  created_at_lt: DateTime
  name_lte: String
  _id_gte: ObjectId
  _id: ObjectId
  _id_exists: Boolean
  entity_id_gt: String
  _id_ne: ObjectId
  date_modified_in: [DateTime]
  created_at_in: [DateTime]
  _id_lte: ObjectId
  date_modified: DateTime
  entity_id_exists: Boolean
  date_modified_exists: Boolean
  _id_gt: ObjectId
  entity_id_lte: String
  created_at_nin: [DateTime]
  entity_id_ne: String
}

input History_incidentEmbeddingInsertInput {
  vector: [Float]
  from_reports: [Int]
}

type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}

input ChecklistRiskPrecedentInsertInput {
  title: String
  description: String
  incident_id: Int
  tags: [String]
}

type CandidateClassification_similarity {
  classification: String
  similarity: Float
}

input ChecklistInsertInput {
  risks: [ChecklistRiskInsertInput]
  name: String
  tags_methods: [String]
  owner_id: String
  _id: ObjectId
  about: String
  date_created: DateTime
  tags_goals: [String]
  date_updated: DateTime
  entity_id: String
  id: String
  tags_other: [String]
}

type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input IncidentNlp_similar_incidentQueryInput {
  similarity_gt: Float
  AND: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_gt: Int
  similarity_lt: Float
  incident_id_gte: Int
  similarity_exists: Boolean
  incident_id_lt: Int
  incident_id_lte: Int
  similarity_gte: Float
  OR: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_exists: Boolean
  similarity: Float
  incident_id: Int
  incident_id_nin: [Int]
  incident_id_ne: Int
  incident_id_in: [Int]
  similarity_ne: Float
  similarity_in: [Float]
  similarity_nin: [Float]
  similarity_lte: Float
}

enum UserSortByInput {
  USERID_DESC
  _ID_ASC
  _ID_DESC
  FIRST_NAME_ASC
  FIRST_NAME_DESC
  LAST_NAME_ASC
  LAST_NAME_DESC
  USERID_ASC
}

input ChecklistQueryInput {
  date_created_gte: DateTime
  owner_id_gte: String
  risks: [ChecklistRiskQueryInput]
  about_gte: String
  tags_goals_nin: [String]
  _id_lt: ObjectId
  owner_id: String
  tags_other_in: [String]
  _id_exists: Boolean
  name_gt: String
  risks_in: [ChecklistRiskQueryInput]
  entity_id_exists: Boolean
  date_updated_exists: Boolean
  tags_other_exists: Boolean
  tags_goals_exists: Boolean
  name_lt: String
  tags_other_nin: [String]
  about_gt: String
  date_created_ne: DateTime
  tags_other: [String]
  date_created: DateTime
  owner_id_ne: String
  owner_id_in: [String]
  _id_nin: [ObjectId]
  entity_id_gte: String
  tags_methods: [String]
  date_updated_gt: DateTime
  _id_in: [ObjectId]
  owner_id_gt: String
  date_updated_nin: [DateTime]
  _id_ne: ObjectId
  owner_id_lte: String
  id_gte: String
  about_lte: String
  _id_gte: ObjectId
  name_ne: String
  entity_id_ne: String
  tags_goals: [String]
  tags_methods_exists: Boolean
  date_updated_ne: DateTime
  about: String
  id: String
  date_created_nin: [DateTime]
  id_exists: Boolean
  tags_methods_in: [String]
  about_ne: String
  entity_id_lte: String
  date_updated_lt: DateTime
  name_lte: String
  id_nin: [String]
  _id_gt: ObjectId
  id_lte: String
  owner_id_nin: [String]
  id_in: [String]
  entity_id_in: [String]
  about_lt: String
  entity_id_nin: [String]
  date_updated_in: [DateTime]
  risks_exists: Boolean
  owner_id_exists: Boolean
  _id: ObjectId
  entity_id_gt: String
  id_ne: String
  _id_lte: ObjectId
  date_updated_gte: DateTime
  date_created_lte: DateTime
  risks_nin: [ChecklistRiskQueryInput]
  OR: [ChecklistQueryInput!]
  AND: [ChecklistQueryInput!]
  date_updated: DateTime
  id_lt: String
  id_gt: String
  tags_goals_in: [String]
  date_created_in: [DateTime]
  name: String
  about_nin: [String]
  about_exists: Boolean
  about_in: [String]
  owner_id_lt: String
  entity_id: String
  name_exists: Boolean
  tags_methods_nin: [String]
  date_created_lt: DateTime
  name_in: [String]
  date_created_exists: Boolean
  date_created_gt: DateTime
  name_gte: String
  entity_id_lt: String
  date_updated_lte: DateTime
  name_nin: [String]
}

type TaxaDummy_field {
  field_number: String
  short_name: String
}

input ReportEmbeddingQueryInput {
  from_text_hash_nin: [String]
  from_text_hash_lte: String
  from_text_hash_exists: Boolean
  AND: [ReportEmbeddingQueryInput!]
  from_text_hash_in: [String]
  OR: [ReportEmbeddingQueryInput!]
  vector: [Float]
  from_text_hash_lt: String
  from_text_hash: String
  vector_in: [Float]
  vector_nin: [Float]
  from_text_hash_ne: String
  from_text_hash_gt: String
  from_text_hash_gte: String
  vector_exists: Boolean
}

type ChecklistRisk {
  generated: Boolean
  id: String
  likelihood: String
  precedents: [ChecklistRiskPrecedent]
  risk_notes: String
  risk_status: String
  severity: String
  tags: [String]
  title: String
  touched: Boolean
}

input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

type DeleteManyPayload {
  deletedCount: Int!
}

input UserQueryInput {
  _id_gt: ObjectId
  _id_lte: ObjectId
  userId_lte: String
  _id_ne: ObjectId
  userId_lt: String
  last_name_ne: String
  last_name_gte: String
  AND: [UserQueryInput!]
  userId_gte: String
  userId: String
  first_name_ne: String
  last_name_gt: String
  first_name_lte: String
  first_name_nin: [String]
  last_name_exists: Boolean
  _id_exists: Boolean
  first_name_exists: Boolean
  last_name_lte: String
  first_name_gt: String
  first_name_lt: String
  userId_ne: String
  _id_lt: ObjectId
  _id_in: [ObjectId]
  last_name_lt: String
  _id_gte: ObjectId
  roles: [String]
  _id_nin: [ObjectId]
  last_name: String
  last_name_nin: [String]
  userId_exists: Boolean
  roles_nin: [String]
  first_name: String
  userId_gt: String
  userId_in: [String]
  last_name_in: [String]
  first_name_in: [String]
  _id: ObjectId
  first_name_gte: String
  userId_nin: [String]
  roles_exists: Boolean
  OR: [UserQueryInput!]
  roles_in: [String]
}

input QuickaddUpdateInput {
  source_domain: String
  url: String
  source_domain_unset: Boolean
  url_unset: Boolean
  _id: ObjectId
  incident_id_unset: Boolean
  date_submitted_unset: Boolean
  incident_id: Long
  _id_unset: Boolean
  date_submitted: String
}

input TaxaField_listComplete_fromUpdateInput {
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
}

input ChecklistRiskInsertInput {
  touched: Boolean
  generated: Boolean
  title: String
  likelihood: String
  risk_status: String
  precedents: [ChecklistRiskPrecedentInsertInput]
  risk_notes: String
  severity: String
  tags: [String]
  id: String
}

input SubscriptionUpdateInput {
  incident_id: SubscriptionIncident_idRelationInput
  type_unset: Boolean
  _id_unset: Boolean
  type: String
  _id: ObjectId
  entityId_unset: Boolean
  incident_id_unset: Boolean
  userId: SubscriptionUserIdRelationInput
  userId_unset: Boolean
  entityId: SubscriptionEntityIdRelationInput
}

input IncidentAllegedDeveloperOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input CreateVariantInputVariant {
  date_published: String
  inputs_outputs: [String]
  submitters: [String]
  text: String
}

input SubmissionNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

type Taxa {
  _id: ObjectId
  complete_entities: Boolean
  description: String
  dummy_fields: [TaxaDummy_field]
  field_list: [TaxaField_list]
  namespace: String
  weight: Int
}

input History_incidentTsneQueryInput {
  AND: [History_incidentTsneQueryInput!]
  x_ne: Float
  x_gte: Float
  y_gte: Float
  y_lt: Float
  x_in: [Float]
  x_exists: Boolean
  y_ne: Float
  x_lte: Float
  y: Float
  x_gt: Float
  y_lte: Float
  x_lt: Float
  x: Float
  y_exists: Boolean
  x_nin: [Float]
  y_gt: Float
  y_in: [Float]
  y_nin: [Float]
  OR: [History_incidentTsneQueryInput!]
}

type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}

type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

type AppUser {
  email: String
}

enum ChecklistSortByInput {
  _ID_DESC
  ABOUT_ASC
  DATE_UPDATED_ASC
  ENTITY_ID_DESC
  NAME_ASC
  OWNER_ID_ASC
  _ID_ASC
  DATE_CREATED_DESC
  ENTITY_ID_ASC
  OWNER_ID_DESC
  ID_ASC
  NAME_DESC
  ABOUT_DESC
  DATE_CREATED_ASC
  DATE_UPDATED_DESC
  ID_DESC
}

enum SubmissionSortByInput {
  DATE_DOWNLOADED_DESC
  DATE_SUBMITTED_ASC
  DESCRIPTION_DESC
  EDITOR_NOTES_DESC
  IMAGE_URL_ASC
  _ID_DESC
  CLOUDINARY_ID_DESC
  DATE_DOWNLOADED_ASC
  TEXT_ASC
  EPOCH_DATE_MODIFIED_ASC
  LANGUAGE_ASC
  DATE_PUBLISHED_DESC
  TITLE_DESC
  USER_ASC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  DATE_SUBMITTED_DESC
  STATUS_DESC
  URL_ASC
  _ID_ASC
  LANGUAGE_DESC
  SOURCE_DOMAIN_DESC
  EDITOR_NOTES_ASC
  INCIDENT_DATE_ASC
  INCIDENT_DATE_DESC
  INCIDENT_TITLE_ASC
  INCIDENT_TITLE_DESC
  TEXT_DESC
  DATE_PUBLISHED_ASC
  EPOCH_DATE_MODIFIED_DESC
  IMAGE_URL_DESC
  TITLE_ASC
  URL_DESC
  SOURCE_DOMAIN_ASC
  STATUS_ASC
  USER_DESC
  DESCRIPTION_ASC
  PLAIN_TEXT_ASC
  PLAIN_TEXT_DESC
}

type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

scalar DateTime

enum ClassificationSortByInput {
  NAMESPACE_ASC
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
  _ID_ASC
  _ID_DESC
}

input SubscriptionEntityIdRelationInput {
  create: EntityInsertInput
  link: String
}

input ChecklistUpdateInput {
  risks: [ChecklistRiskUpdateInput]
  name_unset: Boolean
  owner_id: String
  date_created_unset: Boolean
  name: String
  _id_unset: Boolean
  about_unset: Boolean
  tags_methods_unset: Boolean
  id_unset: Boolean
  _id: ObjectId
  entity_id_unset: Boolean
  tags_methods: [String]
  date_updated_unset: Boolean
  tags_other_unset: Boolean
  about: String
  owner_id_unset: Boolean
  tags_other: [String]
  date_updated: DateTime
  tags_goals: [String]
  tags_goals_unset: Boolean
  entity_id: String
  id: String
  date_created: DateTime
  risks_unset: Boolean
}

input History_incidentInsertInput {
  title: String!
  editor_dissimilar_incidents: [Int]
  flagged_dissimilar_incidents: [Int]
  implicated_systems: [String]
  date: String!
  editors: [String]!
  AllegedDeveloperOfAISystem: [String]
  embedding: History_incidentEmbeddingInsertInput
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  _id: ObjectId
  editor_similar_incidents: [Int]
  reports: [Int]!
  editor_notes: String
  modifiedBy: String
  incident_id: Int!
  tsne: History_incidentTsneInsertInput
  AllegedHarmedOrNearlyHarmedParties: [String]
  description: String
  AllegedDeployerOfAISystem: [String]
  epoch_date_modified: Int
}

type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}

type Mutation {
  createDefaultAdminUser(input: CreateDefaultAdminUserInput): DefaultAdminUser
  createVariant(input: CreateVariantInput): CreateVariantPayload
  deleteManyCandidates(query: CandidateQueryInput): DeleteManyPayload
  deleteManyChecklists(query: ChecklistQueryInput): DeleteManyPayload
  deleteManyClassifications(query: ClassificationQueryInput): DeleteManyPayload
  deleteManyDuplicates(query: DuplicateQueryInput): DeleteManyPayload
  deleteManyEntities(query: EntityQueryInput): DeleteManyPayload
  deleteManyHistory_incidents(query: History_incidentQueryInput): DeleteManyPayload
  deleteManyHistory_reports(query: History_reportQueryInput): DeleteManyPayload
  deleteManyIncidents(query: IncidentQueryInput): DeleteManyPayload
  deleteManyNotifications(query: NotificationQueryInput): DeleteManyPayload
  deleteManyQuickadds(query: QuickaddQueryInput): DeleteManyPayload
  deleteManyReports(query: ReportQueryInput): DeleteManyPayload
  deleteManySubmissions(query: SubmissionQueryInput): DeleteManyPayload
  deleteManySubscriptions(query: SubscriptionQueryInput): DeleteManyPayload
  deleteManyTaxas(query: TaxaQueryInput): DeleteManyPayload
  deleteManyUsers(query: UserQueryInput): DeleteManyPayload
  deleteOneCandidate(query: CandidateQueryInput!): Candidate
  deleteOneChecklist(query: ChecklistQueryInput!): Checklist
  deleteOneClassification(query: ClassificationQueryInput!): Classification
  deleteOneDuplicate(query: DuplicateQueryInput!): Duplicate
  deleteOneEntity(query: EntityQueryInput!): Entity
  deleteOneHistory_incident(query: History_incidentQueryInput!): History_incident
  deleteOneHistory_report(query: History_reportQueryInput!): History_report
  deleteOneIncident(query: IncidentQueryInput!): Incident
  deleteOneNotification(query: NotificationQueryInput!): Notification
  deleteOneQuickadd(query: QuickaddQueryInput!): Quickadd
  deleteOneReport(query: ReportQueryInput!): Report
  deleteOneSubmission(query: SubmissionQueryInput!): Submission
  deleteOneSubscription(query: SubscriptionQueryInput!): Subscription
  deleteOneTaxa(query: TaxaQueryInput!): Taxa
  deleteOneUser(query: UserQueryInput!): User
  getUser(input: GetUserInput): AppUser
  insertManyCandidates(data: [CandidateInsertInput!]!): InsertManyPayload
  insertManyChecklists(data: [ChecklistInsertInput!]!): InsertManyPayload
  insertManyClassifications(data: [ClassificationInsertInput!]!): InsertManyPayload
  insertManyDuplicates(data: [DuplicateInsertInput!]!): InsertManyPayload
  insertManyEntities(data: [EntityInsertInput!]!): InsertManyPayload
  insertManyHistory_incidents(data: [History_incidentInsertInput!]!): InsertManyPayload
  insertManyHistory_reports(data: [History_reportInsertInput!]!): InsertManyPayload
  insertManyIncidents(data: [IncidentInsertInput!]!): InsertManyPayload
  insertManyNotifications(data: [NotificationInsertInput!]!): InsertManyPayload
  insertManyQuickadds(data: [QuickaddInsertInput!]!): InsertManyPayload
  insertManyReports(data: [ReportInsertInput!]!): InsertManyPayload
  insertManySubmissions(data: [SubmissionInsertInput!]!): InsertManyPayload
  insertManySubscriptions(data: [SubscriptionInsertInput!]!): InsertManyPayload
  insertManyTaxas(data: [TaxaInsertInput!]!): InsertManyPayload
  insertManyUsers(data: [UserInsertInput!]!): InsertManyPayload
  insertOneCandidate(data: CandidateInsertInput!): Candidate
  insertOneChecklist(data: ChecklistInsertInput!): Checklist
  insertOneClassification(data: ClassificationInsertInput!): Classification
  insertOneDuplicate(data: DuplicateInsertInput!): Duplicate
  insertOneEntity(data: EntityInsertInput!): Entity
  insertOneHistory_incident(data: History_incidentInsertInput!): History_incident
  insertOneHistory_report(data: History_reportInsertInput!): History_report
  insertOneIncident(data: IncidentInsertInput!): Incident
  insertOneNotification(data: NotificationInsertInput!): Notification
  insertOneQuickadd(data: QuickaddInsertInput!): Quickadd
  insertOneReport(data: ReportInsertInput!): Report
  insertOneSubmission(data: SubmissionInsertInput!): Submission
  insertOneSubscription(data: SubscriptionInsertInput!): Subscription
  insertOneTaxa(data: TaxaInsertInput!): Taxa
  insertOneUser(data: UserInsertInput!): User
  linkReportsToIncidents(input: LinkReportsToIncidentsInput): [Incident]
  logIncidentHistory(input: History_incidentInsertInput): LogIncidentHistoryPayload
  logReportHistory(input: History_reportInsertInput): LogReportHistoryPayload
  processNotifications: Int
  promoteSubmissionToReport(input: PromoteSubmissionToReportInput): PromoteSubmissionToReportPayload
  replaceOneCandidate(query: CandidateQueryInput, data: CandidateInsertInput!): Candidate
  replaceOneChecklist(query: ChecklistQueryInput, data: ChecklistInsertInput!): Checklist
  replaceOneClassification(query: ClassificationQueryInput, data: ClassificationInsertInput!): Classification
  replaceOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  replaceOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  replaceOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  replaceOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  replaceOneIncident(data: IncidentInsertInput!, query: IncidentQueryInput): Incident
  replaceOneNotification(data: NotificationInsertInput!, query: NotificationQueryInput): Notification
  replaceOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  replaceOneReport(data: ReportInsertInput!, query: ReportQueryInput): Report
  replaceOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  replaceOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  replaceOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  replaceOneUser(data: UserInsertInput!, query: UserQueryInput): User
  updateManyCandidates(query: CandidateQueryInput, set: CandidateUpdateInput!): UpdateManyPayload
  updateManyChecklists(query: ChecklistQueryInput, set: ChecklistUpdateInput!): UpdateManyPayload
  updateManyClassifications(query: ClassificationQueryInput, set: ClassificationUpdateInput!): UpdateManyPayload
  updateManyDuplicates(query: DuplicateQueryInput, set: DuplicateUpdateInput!): UpdateManyPayload
  updateManyEntities(query: EntityQueryInput, set: EntityUpdateInput!): UpdateManyPayload
  updateManyHistory_incidents(query: History_incidentQueryInput, set: History_incidentUpdateInput!): UpdateManyPayload
  updateManyHistory_reports(query: History_reportQueryInput, set: History_reportUpdateInput!): UpdateManyPayload
  updateManyIncidents(query: IncidentQueryInput, set: IncidentUpdateInput!): UpdateManyPayload
  updateManyNotifications(query: NotificationQueryInput, set: NotificationUpdateInput!): UpdateManyPayload
  updateManyQuickadds(query: QuickaddQueryInput, set: QuickaddUpdateInput!): UpdateManyPayload
  updateManyReports(query: ReportQueryInput, set: ReportUpdateInput!): UpdateManyPayload
  updateManySubmissions(query: SubmissionQueryInput, set: SubmissionUpdateInput!): UpdateManyPayload
  updateManySubscriptions(query: SubscriptionQueryInput, set: SubscriptionUpdateInput!): UpdateManyPayload
  updateManyTaxas(query: TaxaQueryInput, set: TaxaUpdateInput!): UpdateManyPayload
  updateManyUsers(query: UserQueryInput, set: UserUpdateInput!): UpdateManyPayload
  updateOneCandidate(query: CandidateQueryInput, set: CandidateUpdateInput!): Candidate
  updateOneChecklist(query: ChecklistQueryInput, set: ChecklistUpdateInput!): Checklist
  updateOneClassification(query: ClassificationQueryInput, set: ClassificationUpdateInput!): Classification
  updateOneDuplicate(query: DuplicateQueryInput, set: DuplicateUpdateInput!): Duplicate
  updateOneEntity(query: EntityQueryInput, set: EntityUpdateInput!): Entity
  updateOneHistory_incident(query: History_incidentQueryInput, set: History_incidentUpdateInput!): History_incident
  updateOneHistory_report(set: History_reportUpdateInput!, query: History_reportQueryInput): History_report
  updateOneIncident(query: IncidentQueryInput, set: IncidentUpdateInput!): Incident
  updateOneNotification(query: NotificationQueryInput, set: NotificationUpdateInput!): Notification
  updateOneQuickadd(query: QuickaddQueryInput, set: QuickaddUpdateInput!): Quickadd
  updateOneReport(set: ReportUpdateInput!, query: ReportQueryInput): Report
  updateOneReportTranslation(input: UpdateOneReportTranslationInput): Report
  updateOneSubmission(query: SubmissionQueryInput, set: SubmissionUpdateInput!): Submission
  updateOneSubscription(query: SubscriptionQueryInput, set: SubscriptionUpdateInput!): Subscription
  updateOneTaxa(query: TaxaQueryInput, set: TaxaUpdateInput!): Taxa
  updateOneUser(query: UserQueryInput, set: UserUpdateInput!): User
  upsertOneCandidate(query: CandidateQueryInput, data: CandidateInsertInput!): Candidate
  upsertOneChecklist(query: ChecklistQueryInput, data: ChecklistInsertInput!): Checklist
  upsertOneClassification(query: ClassificationQueryInput, data: ClassificationInsertInput!): Classification
  upsertOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  upsertOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  upsertOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  upsertOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  upsertOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  upsertOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
  upsertOneQuickadd(data: QuickaddInsertInput!, query: QuickaddQueryInput): Quickadd
  upsertOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  upsertOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  upsertOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  upsertOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
}

input EntityUpdateInput {
  date_modified: DateTime
  _id_unset: Boolean
  entity_id_unset: Boolean
  name_unset: Boolean
  _id: ObjectId
  created_at_unset: Boolean
  date_modified_unset: Boolean
  entity_id: String
  name: String
  created_at: DateTime
}

input IncidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

type InsertManyPayload {
  insertedIds: [ObjectId]!
}

input SubscriptionUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input TaxaQueryInput {
  _id_gt: ObjectId
  weight_lt: Int
  namespace_exists: Boolean
  _id_gte: ObjectId
  description_ne: String
  weight_gt: Int
  AND: [TaxaQueryInput!]
  _id_lte: ObjectId
  _id_in: [ObjectId]
  description_exists: Boolean
  namespace_gt: String
  _id_lt: ObjectId
  complete_entities_exists: Boolean
  field_list: [TaxaField_listQueryInput]
  OR: [TaxaQueryInput!]
  weight_lte: Int
  complete_entities_ne: Boolean
  _id: ObjectId
  field_list_in: [TaxaField_listQueryInput]
  weight_ne: Int
  namespace_nin: [String]
  namespace: String
  namespace_ne: String
  field_list_nin: [TaxaField_listQueryInput]
  weight_nin: [Int]
  description_in: [String]
  dummy_fields_exists: Boolean
  _id_nin: [ObjectId]
  weight_in: [Int]
  namespace_lte: String
  description_lte: String
  description: String
  description_gte: String
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  namespace_lt: String
  weight_exists: Boolean
  namespace_in: [String]
  _id_ne: ObjectId
  dummy_fields: [TaxaDummy_fieldQueryInput]
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  namespace_gte: String
  description_gt: String
  description_nin: [String]
  complete_entities: Boolean
  weight_gte: Int
  description_lt: String
  _id_exists: Boolean
  weight: Int
  field_list_exists: Boolean
}

input CandidateQueryInput {
  _id: ObjectId
  _id_in: [ObjectId]
  epoch_date_downloaded_lt: Int
  matching_entities: [String]
  text_in: [String]
  title_lt: String
  matching_harm_keywords_exists: Boolean
  plain_text_lte: String
  epoch_date_downloaded: Int
  source_domain_lte: String
  _id_exists: Boolean
  date_published_ne: String
  plain_text_lt: String
  title_ne: String
  epoch_date_published_gt: Int
  image_url_ne: String
  text_lt: String
  matching_entities_exists: Boolean
  title_exists: Boolean
  date_published_nin: [String]
  epoch_date_downloaded_gte: Int
  text_nin: [String]
  url: String
  source_domain: String
  similarity_lt: Float
  dismissed_exists: Boolean
  image_url_nin: [String]
  date_published_lte: String
  title_gt: String
  similarity_nin: [Float]
  plain_text_in: [String]
  image_url_lt: String
  matching_keywords_in: [String]
  epoch_date_downloaded_ne: Int
  text: String
  date_downloaded_lte: String
  source_domain_lt: String
  language_nin: [String]
  epoch_date_downloaded_gt: Int
  matching_harm_keywords: [String]
  source_domain_gte: String
  plain_text_gt: String
  epoch_date_downloaded_exists: Boolean
  date_downloaded_exists: Boolean
  date_published_exists: Boolean
  image_url_gte: String
  url_ne: String
  language_exists: Boolean
  similarity_in: [Float]
  _id_lte: ObjectId
  plain_text_nin: [String]
  _id_gte: ObjectId
  _id_nin: [ObjectId]
  url_lt: String
  similarity: Float
  similarity_exists: Boolean
  dismissed_ne: Boolean
  url_gte: String
  date_published_in: [String]
  matching_entities_nin: [String]
  language_lte: String
  match: Boolean
  authors_nin: [String]
  url_lte: String
  plain_text_gte: String
  title_in: [String]
  _id_ne: ObjectId
  AND: [CandidateQueryInput!]
  date_downloaded_lt: String
  matching_keywords: [String]
  source_domain_gt: String
  authors_in: [String]
  plain_text: String
  url_nin: [String]
  classification_similarity: [CandidateClassification_similarityQueryInput]
  date_published_gte: String
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  image_url: String
  language_ne: String
  source_domain_nin: [String]
  similarity_gt: Float
  similarity_lte: Float
  epoch_date_published_gte: Int
  authors: [String]
  epoch_date_published_exists: Boolean
  language: String
  authors_exists: Boolean
  matching_harm_keywords_nin: [String]
  text_exists: Boolean
  epoch_date_published_lt: Int
  date_downloaded: String
  text_lte: String
  dismissed: Boolean
  matching_keywords_nin: [String]
  title_gte: String
  epoch_date_published_nin: [Int]
  OR: [CandidateQueryInput!]
  plain_text_ne: String
  image_url_exists: Boolean
  date_published: String
  date_published_gt: String
  similarity_gte: Float
  url_in: [String]
  _id_gt: ObjectId
  date_published_lt: String
  matching_entities_in: [String]
  image_url_in: [String]
  date_downloaded_nin: [String]
  text_gte: String
  matching_keywords_exists: Boolean
  source_domain_in: [String]
  source_domain_exists: Boolean
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  epoch_date_downloaded_nin: [Int]
  date_downloaded_in: [String]
  similarity_ne: Float
  language_lt: String
  language_in: [String]
  epoch_date_downloaded_lte: Int
  text_ne: String
  language_gte: String
  image_url_lte: String
  embedding: CandidateEmbeddingQueryInput
  title_lte: String
  classification_similarity_exists: Boolean
  plain_text_exists: Boolean
  epoch_date_published: Int
  embedding_exists: Boolean
  date_downloaded_gte: String
  _id_lt: ObjectId
  matching_harm_keywords_in: [String]
  match_exists: Boolean
  date_downloaded_gt: String
  text_gt: String
  epoch_date_published_in: [Int]
  source_domain_ne: String
  title: String
  epoch_date_published_ne: Int
  url_exists: Boolean
  title_nin: [String]
  url_gt: String
  match_ne: Boolean
  epoch_date_published_lte: Int
  image_url_gt: String
  language_gt: String
  date_downloaded_ne: String
  epoch_date_downloaded_in: [Int]
}

input RisksInput {
  tags: [String]
}

input CreateVariantInput {
  incidentId: Int
  variant: CreateVariantInputVariant
}

type IncidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input ReportEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
}

enum QuickaddSortByInput {
  INCIDENT_ID_DESC
  URL_ASC
  URL_DESC
  _ID_ASC
  DATE_SUBMITTED_DESC
  INCIDENT_ID_ASC
  SOURCE_DOMAIN_DESC
  _ID_DESC
  DATE_SUBMITTED_ASC
  SOURCE_DOMAIN_ASC
}

input IncidentUpdateInput {
  editors_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  embedding_unset: Boolean
  implicated_systems: IncidentImplicated_systemsRelationInput
  _id: ObjectId
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  implicated_systems_unset: Boolean
  AllegedDeployerOfAISystem_unset: Boolean
  description_unset: Boolean
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  incident_id: Int
  reports_unset: Boolean
  incident_id_inc: Int
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  editor_dissimilar_incidents: [Int]
  description: String
  epoch_date_modified: Int
  title: String
  _id_unset: Boolean
  title_unset: Boolean
  tsne_unset: Boolean
  incident_id_unset: Boolean
  editor_similar_incidents: [Int]
  reports: IncidentReportsRelationInput
  editor_notes_unset: Boolean
  epoch_date_modified_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  editor_dissimilar_incidents_unset: Boolean
  tsne: IncidentTsneUpdateInput
  epoch_date_modified_inc: Int
  date: String
  editor_notes: String
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  editors: IncidentEditorsRelationInput
  embedding: IncidentEmbeddingUpdateInput
  nlp_similar_incidents_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  editor_similar_incidents_unset: Boolean
  date_unset: Boolean
}

input UpdateOneReportTranslationInput {
  language: String!
  plain_text: String!
  report_number: Int!
  text: String!
  title: String!
}

input SubscriptionIncident_idRelationInput {
  link: Int
  create: IncidentInsertInput
}

input TaxaField_listQueryInput {
  field_number_exists: Boolean
  default_lt: String
  default_lte: String
  short_name_nin: [String]
  field_number_nin: [String]
  long_name_gte: String
  default_ne: String
  short_name: String
  field_number_ne: String
  placeholder_gte: String
  field_number_in: [String]
  weight_in: [Int]
  placeholder_nin: [String]
  display_type_gt: String
  default_gt: String
  short_description_ne: String
  field_number_gte: String
  long_description_gte: String
  complete_from: TaxaField_listComplete_fromQueryInput
  display_type_gte: String
  weight_nin: [Int]
  hide_search_ne: Boolean
  short_description_exists: Boolean
  field_number_lt: String
  short_name_gt: String
  permitted_values_in: [String]
  long_name_nin: [String]
  long_description_ne: String
  item_fields: TaxaField_listItem_fieldQueryInput
  permitted_values_nin: [String]
  long_name_gt: String
  long_description_in: [String]
  short_name_lt: String
  short_description_nin: [String]
  mongo_type_ne: String
  short_name_exists: Boolean
  public_ne: Boolean
  public: Boolean
  long_description_lte: String
  mongo_type_gte: String
  mongo_type: String
  long_name_exists: Boolean
  display_type_nin: [String]
  long_description: String
  short_name_gte: String
  required_ne: Boolean
  weight_exists: Boolean
  default_gte: String
  weight_gte: Int
  placeholder_lte: String
  mongo_type_nin: [String]
  default: String
  short_description_gt: String
  long_name: String
  long_description_gt: String
  display_type_ne: String
  AND: [TaxaField_listQueryInput!]
  long_name_lt: String
  display_type_lt: String
  default_nin: [String]
  OR: [TaxaField_listQueryInput!]
  short_description: String
  required: Boolean
  short_name_ne: String
  mongo_type_lt: String
  long_description_nin: [String]
  weight: Int
  long_name_ne: String
  field_number: String
  mongo_type_lte: String
  placeholder_lt: String
  hide_search: Boolean
  instant_facet_exists: Boolean
  mongo_type_in: [String]
  long_description_lt: String
  permitted_values_exists: Boolean
  placeholder: String
  display_type_lte: String
  short_name_lte: String
  weight_ne: Int
  permitted_values: [String]
  default_exists: Boolean
  complete_from_exists: Boolean
  short_description_gte: String
  public_exists: Boolean
  placeholder_gt: String
  field_number_gt: String
  short_description_lte: String
  short_description_in: [String]
  mongo_type_exists: Boolean
  item_fields_exists: Boolean
  display_type_exists: Boolean
  required_exists: Boolean
  instant_facet: Boolean
  display_type_in: [String]
  weight_lt: Int
  instant_facet_ne: Boolean
  weight_lte: Int
  placeholder_in: [String]
  short_description_lt: String
  long_name_in: [String]
  short_name_in: [String]
  long_description_exists: Boolean
  field_number_lte: String
  hide_search_exists: Boolean
  placeholder_exists: Boolean
  default_in: [String]
  long_name_lte: String
  placeholder_ne: String
  display_type: String
  weight_gt: Int
  mongo_type_gt: String
}

input NotificationInsertInput {
  sentDate: DateTime
  type: String
  userId: NotificationUserIdRelationInput
  _id: ObjectId
  incident_id: Int
  processed: Boolean
}

input UserUpdateInput {
  roles: [String]
  last_name_unset: Boolean
  roles_unset: Boolean
  userId_unset: Boolean
  first_name: String
  first_name_unset: Boolean
  last_name: String
  _id: ObjectId
  _id_unset: Boolean
  userId: String
}

type Report {
  _id: ObjectId
  authors: [String]!
  cloudinary_id: String!
  date_downloaded: DateTime!
  date_modified: DateTime!
  date_published: DateTime!
  date_submitted: DateTime!
  description: String
  editor_notes: String
  embedding: ReportEmbedding
  epoch_date_downloaded: Int!
  epoch_date_modified: Int!
  epoch_date_published: Int!
  epoch_date_submitted: Int!
  flag: Boolean
  image_url: String!
  inputs_outputs: [String]
  is_incident_report: Boolean
  language: String!
  plain_text: String!
  quiet: Boolean
  report_number: Int!
  source_domain: String!
  submitters: [String]!
  tags: [String]!
  text: String!
  title: String!
  translations(input: String): ReportTranslation
  url: String!
  user: User
}

input IncidentReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}

input CandidateEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}

type History_incident {
  AllegedDeployerOfAISystem: [String]
  AllegedDeveloperOfAISystem: [String]
  AllegedHarmedOrNearlyHarmedParties: [String]
  _id: ObjectId
  date: String!
  description: String
  editor_dissimilar_incidents: [Int]
  editor_notes: String
  editor_similar_incidents: [Int]
  editors: [String]!
  embedding: History_incidentEmbedding
  epoch_date_modified: Int
  flagged_dissimilar_incidents: [Int]
  implicated_systems: [String]
  incident_id: Int!
  modifiedBy: String
  nlp_similar_incidents: [History_incidentNlp_similar_incident]
  reports: [Int]!
  title: String!
  tsne: History_incidentTsne
}

input UserInsertInput {
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

input SubmissionImplicated_systemsRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
`;
