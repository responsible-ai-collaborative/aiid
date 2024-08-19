import gql from "graphql-tag";

export default gql`
input ClassificationQueryInput {
  publish_ne: Boolean
  notes: String
  notes_ne: String
  namespace_gte: String
  _id: ObjectId
  attributes_nin: [ClassificationAttributeQueryInput]
  notes_exists: Boolean
  notes_gt: String
  publish_exists: Boolean
  notes_lte: String
  _id_nin: [ObjectId]
  incidents_exists: Boolean
  namespace_gt: String
  namespace_exists: Boolean
  reports: [ReportQueryInput]
  _id_exists: Boolean
  _id_gt: ObjectId
  namespace: String
  publish: Boolean
  notes_in: [String]
  _id_lt: ObjectId
  namespace_ne: String
  OR: [ClassificationQueryInput!]
  incidents: [IncidentQueryInput]
  reports_nin: [ReportQueryInput]
  reports_exists: Boolean
  _id_gte: ObjectId
  _id_in: [ObjectId]
  attributes_exists: Boolean
  namespace_in: [String]
  incidents_in: [IncidentQueryInput]
  AND: [ClassificationQueryInput!]
  namespace_nin: [String]
  reports_in: [ReportQueryInput]
  incidents_nin: [IncidentQueryInput]
  notes_nin: [String]
  _id_lte: ObjectId
  namespace_lte: String
  _id_ne: ObjectId
  attributes: [ClassificationAttributeQueryInput]
  attributes_in: [ClassificationAttributeQueryInput]
  namespace_lt: String
  notes_gte: String
  notes_lt: String
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

type DeleteManyPayload {
  deletedCount: Int!
}

input IncidentQueryInput {
  _id_nin: [ObjectId]
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  epoch_date_modified_gte: Int
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  date: String
  title: String
  date_nin: [String]
  incident_id_lte: Int
  description_lte: String
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  incident_id_ne: Int
  editors_nin: [UserQueryInput]
  flagged_dissimilar_incidents: [Int]
  _id_gt: ObjectId
  editors_exists: Boolean
  editor_notes_ne: String
  editor_notes_nin: [String]
  editor_similar_incidents_nin: [Int]
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  _id_exists: Boolean
  AND: [IncidentQueryInput!]
  AllegedDeployerOfAISystem: [EntityQueryInput]
  title_nin: [String]
  description_lt: String
  _id_gte: ObjectId
  editor_notes_gt: String
  editor_similar_incidents: [Int]
  flagged_dissimilar_incidents_exists: Boolean
  editor_notes_lt: String
  reports: [ReportQueryInput]
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  editor_notes: String
  reports_in: [ReportQueryInput]
  description_exists: Boolean
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  _id_in: [ObjectId]
  description_gt: String
  epoch_date_modified_ne: Int
  epoch_date_modified_lt: Int
  incident_id_nin: [Int]
  description_nin: [String]
  _id_lt: ObjectId
  editor_dissimilar_incidents_exists: Boolean
  incident_id_exists: Boolean
  editor_dissimilar_incidents_nin: [Int]
  description: String
  title_gte: String
  epoch_date_modified: Int
  reports_nin: [ReportQueryInput]
  reports_exists: Boolean
  date_gte: String
  epoch_date_modified_in: [Int]
  editors_in: [UserQueryInput]
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  date_in: [String]
  title_gt: String
  description_gte: String
  OR: [IncidentQueryInput!]
  title_lt: String
  epoch_date_modified_exists: Boolean
  epoch_date_modified_gt: Int
  editor_dissimilar_incidents_in: [Int]
  _id: ObjectId
  AllegedDeployerOfAISystem_exists: Boolean
  editor_dissimilar_incidents: [Int]
  editor_notes_exists: Boolean
  embedding_exists: Boolean
  AllegedDeveloperOfAISystem_exists: Boolean
  description_in: [String]
  incident_id_in: [Int]
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  editors: [UserQueryInput]
  incident_id_lt: Int
  editor_notes_gte: String
  nlp_similar_incidents_exists: Boolean
  tsne_exists: Boolean
  date_lte: String
  flagged_dissimilar_incidents_nin: [Int]
  incident_id_gte: Int
  date_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  title_ne: String
  title_in: [String]
  date_ne: String
  editor_similar_incidents_exists: Boolean
  embedding: IncidentEmbeddingQueryInput
  epoch_date_modified_lte: Int
  epoch_date_modified_nin: [Int]
  editor_notes_in: [String]
  incident_id_gt: Int
  date_lt: String
  title_lte: String
  _id_lte: ObjectId
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  _id_ne: ObjectId
  incident_id: Int
  date_gt: String
  flagged_dissimilar_incidents_in: [Int]
  editor_similar_incidents_in: [Int]
  description_ne: String
  tsne: IncidentTsneQueryInput
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  title_exists: Boolean
  editor_notes_lte: String
}

input TaxaField_listItem_fieldComplete_fromQueryInput {
  current_in: [String]
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all_exists: Boolean
  current: [String]
  entities_exists: Boolean
  all_nin: [String]
  all_in: [String]
  current_exists: Boolean
  entities: Boolean
  entities_ne: Boolean
  current_nin: [String]
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all: [String]
}

enum NotificationSortByInput {
  _ID_ASC
  SENTDATE_ASC
  SENTDATE_DESC
  TYPE_ASC
  USERID_DESC
  _ID_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  TYPE_DESC
  USERID_ASC
}

scalar Long

input RisksInput {
  tags: [String]
}

input TaxaDummy_fieldUpdateInput {
  field_number: String
  field_number_unset: Boolean
  short_name: String
  short_name_unset: Boolean
}

input TaxaField_listComplete_fromInsertInput {
  all: [String]
  current: [String]
}

input SubmissionIncident_editorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}

input EntityUpdateInput {
  entity_id: String
  created_at: DateTime
  created_at_unset: Boolean
  date_modified_unset: Boolean
  name_unset: Boolean
  _id_unset: Boolean
  entity_id_unset: Boolean
  name: String
  _id: ObjectId
  date_modified: DateTime
}

input SubscriptionInsertInput {
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
  userId: SubscriptionUserIdRelationInput!
  _id: ObjectId
  entityId: SubscriptionEntityIdRelationInput
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

input DuplicateQueryInput {
  true_incident_number_nin: [Int]
  _id_gt: ObjectId
  true_incident_number_lte: Int
  _id_exists: Boolean
  duplicate_incident_number_lt: Int
  duplicate_incident_number_exists: Boolean
  true_incident_number_exists: Boolean
  true_incident_number_ne: Int
  _id_ne: ObjectId
  duplicate_incident_number_lte: Int
  duplicate_incident_number_nin: [Int]
  true_incident_number_in: [Int]
  _id_lte: ObjectId
  OR: [DuplicateQueryInput!]
  true_incident_number_gte: Int
  _id_gte: ObjectId
  _id_in: [ObjectId]
  duplicate_incident_number_gt: Int
  _id_nin: [ObjectId]
  _id_lt: ObjectId
  duplicate_incident_number_in: [Int]
  duplicate_incident_number: Int
  true_incident_number_gt: Int
  AND: [DuplicateQueryInput!]
  duplicate_incident_number_ne: Int
  true_incident_number: Int
  duplicate_incident_number_gte: Int
  true_incident_number_lt: Int
  _id: ObjectId
}

input History_reportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input IncidentEditorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}

input IncidentInsertInput {
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  embedding: IncidentEmbeddingInsertInput
  editor_dissimilar_incidents: [Int]
  reports: IncidentReportsRelationInput!
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  description: String
  editor_similar_incidents: [Int]
  _id: ObjectId
  tsne: IncidentTsneInsertInput
  editors: IncidentEditorsRelationInput!
  epoch_date_modified: Int
  title: String!
  flagged_dissimilar_incidents: [Int]
  date: String!
  editor_notes: String
  incident_id: Int!
}

type InsertManyPayload {
  insertedIds: [ObjectId]!
}

input TaxaDummy_fieldInsertInput {
  field_number: String
  short_name: String
}

input ChecklistRiskPrecedentUpdateInput {
  incident_id_inc: Int
  description: String
  incident_id_unset: Boolean
  title: String
  title_unset: Boolean
  incident_id: Int
  description_unset: Boolean
  tags: [String]
  tags_unset: Boolean
}

type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}

input TaxaField_listComplete_fromUpdateInput {
  current: [String]
  current_unset: Boolean
  all: [String]
  all_unset: Boolean
}

input DuplicateUpdateInput {
  duplicate_incident_number_unset: Boolean
  true_incident_number: Int
  true_incident_number_inc: Int
  true_incident_number_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  duplicate_incident_number: Int
  duplicate_incident_number_inc: Int
}

input History_incidentTsneInsertInput {
  x: Float
  y: Float
}

input IncidentNlp_similar_incidentUpdateInput {
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
}

input SubmissionUpdateInput {
  tags_unset: Boolean
  submitters_unset: Boolean
  date_submitted_unset: Boolean
  embedding_unset: Boolean
  incident_editors: SubmissionIncident_editorsRelationInput
  date_downloaded: String
  cloudinary_id: String
  status_unset: Boolean
  incident_title_unset: Boolean
  _id_unset: Boolean
  text: String
  quiet_unset: Boolean
  plain_text_unset: Boolean
  incident_editors_unset: Boolean
  editor_notes: String
  quiet: Boolean
  language_unset: Boolean
  date_downloaded_unset: Boolean
  authors_unset: Boolean
  tags: [String]
  source_domain_unset: Boolean
  developers_unset: Boolean
  incident_date_unset: Boolean
  deployers: SubmissionDeployersRelationInput
  incident_title: String
  developers: SubmissionDevelopersRelationInput
  epoch_date_modified_inc: Int
  title_unset: Boolean
  incident_ids_unset: Boolean
  url: String
  incident_date: String
  cloudinary_id_unset: Boolean
  source_domain: String
  language: String
  description: String
  editor_similar_incidents_unset: Boolean
  description_unset: Boolean
  user_unset: Boolean
  _id: ObjectId
  date_modified_unset: Boolean
  image_url: String
  harmed_parties: SubmissionHarmed_partiesRelationInput
  incident_ids: [Int]
  editor_dissimilar_incidents: [Int]
  plain_text: String
  epoch_date_modified_unset: Boolean
  title: String
  editor_similar_incidents: [Int]
  deployers_unset: Boolean
  authors: [String]
  embedding: SubmissionEmbeddingUpdateInput
  submitters: [String]
  harmed_parties_unset: Boolean
  date_published_unset: Boolean
  status: String
  url_unset: Boolean
  date_modified: String
  editor_dissimilar_incidents_unset: Boolean
  user: SubmissionUserRelationInput
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  text_unset: Boolean
  date_published: String
  image_url_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  editor_notes_unset: Boolean
  date_submitted: String
  epoch_date_modified: Int
}

type Query {
  candidate(query: CandidateQueryInput): Candidate
  candidates(query: CandidateQueryInput, limit: Int = 100, sortBy: CandidateSortByInput): [Candidate]!
  checklist(query: ChecklistQueryInput): Checklist
  checklists(query: ChecklistQueryInput, limit: Int = 100, sortBy: ChecklistSortByInput): [Checklist]!
  classification(query: ClassificationQueryInput): Classification
  classifications(query: ClassificationQueryInput, limit: Int = 100, sortBy: ClassificationSortByInput): [Classification]!
  duplicate(query: DuplicateQueryInput): Duplicate
  duplicates(sortBy: DuplicateSortByInput, query: DuplicateQueryInput, limit: Int = 100): [Duplicate]!
  entities(sortBy: EntitySortByInput, query: EntityQueryInput, limit: Int = 100): [Entity]!
  entity(query: EntityQueryInput): Entity
  history_incident(query: History_incidentQueryInput): History_incident
  history_incidents(sortBy: History_incidentSortByInput, query: History_incidentQueryInput, limit: Int = 100): [History_incident]!
  history_report(query: History_reportQueryInput): History_report
  history_reports(limit: Int = 100, sortBy: History_reportSortByInput, query: History_reportQueryInput): [History_report]!
  incident(query: IncidentQueryInput): Incident
  incidents(query: IncidentQueryInput, limit: Int = 100, sortBy: IncidentSortByInput): [Incident]!
  notification(query: NotificationQueryInput): Notification
  notifications(query: NotificationQueryInput, limit: Int = 100, sortBy: NotificationSortByInput): [Notification]!
  quickadd(query: QuickaddQueryInput): Quickadd
  quickadds(limit: Int = 100, sortBy: QuickaddSortByInput, query: QuickaddQueryInput): [Quickadd]!
  report(query: ReportQueryInput): Report
  reports(query: ReportQueryInput, limit: Int = 100, sortBy: ReportSortByInput): [Report]!
  risks(input: RisksInput): [RisksPayloadItem]
  submission(query: SubmissionQueryInput): Submission
  submissions(query: SubmissionQueryInput, limit: Int = 100, sortBy: SubmissionSortByInput): [Submission]!
  subscription(query: SubscriptionQueryInput): Subscription
  subscriptions(query: SubscriptionQueryInput, limit: Int = 100, sortBy: SubscriptionSortByInput): [Subscription]!
  taxa(query: TaxaQueryInput): Taxa
  taxas(limit: Int = 100, sortBy: TaxaSortByInput, query: TaxaQueryInput): [Taxa]!
  user(query: UserQueryInput): User
  users(query: UserQueryInput, limit: Int = 100, sortBy: UserSortByInput): [User]!
}

type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input NotificationQueryInput {
  type_lt: String
  incident_id_in: [Int]
  incident_id_gte: Int
  processed_exists: Boolean
  type_lte: String
  incident_id_lte: Int
  userId: UserQueryInput
  userId_exists: Boolean
  incident_id_exists: Boolean
  sentDate_gt: DateTime
  sentDate_gte: DateTime
  _id_ne: ObjectId
  processed_ne: Boolean
  type_gt: String
  type: String
  _id_lte: ObjectId
  OR: [NotificationQueryInput!]
  sentDate_in: [DateTime]
  processed: Boolean
  _id: ObjectId
  incident_id_ne: Int
  sentDate_exists: Boolean
  incident_id_lt: Int
  type_nin: [String]
  incident_id: Int
  type_in: [String]
  incident_id_nin: [Int]
  sentDate_lt: DateTime
  _id_gt: ObjectId
  _id_nin: [ObjectId]
  _id_lt: ObjectId
  type_gte: String
  _id_exists: Boolean
  sentDate_ne: DateTime
  type_exists: Boolean
  incident_id_gt: Int
  AND: [NotificationQueryInput!]
  sentDate: DateTime
  type_ne: String
  _id_gte: ObjectId
  sentDate_lte: DateTime
  sentDate_nin: [DateTime]
  _id_in: [ObjectId]
}

type CandidateClassification_similarity {
  classification: String
  similarity: Float
}

input ChecklistRiskUpdateInput {
  title: String
  title_unset: Boolean
  id: String
  severity_unset: Boolean
  id_unset: Boolean
  risk_notes_unset: Boolean
  risk_notes: String
  tags: [String]
  risk_status: String
  severity: String
  generated_unset: Boolean
  precedents_unset: Boolean
  precedents: [ChecklistRiskPrecedentUpdateInput]
  generated: Boolean
  likelihood: String
  likelihood_unset: Boolean
  touched: Boolean
  risk_status_unset: Boolean
  touched_unset: Boolean
  tags_unset: Boolean
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
  url: String!
  user: User
}

enum SubmissionSortByInput {
  CLOUDINARY_ID_DESC
  STATUS_DESC
  DATE_MODIFIED_DESC
  DATE_PUBLISHED_ASC
  DATE_PUBLISHED_DESC
  INCIDENT_DATE_ASC
  PLAIN_TEXT_DESC
  TEXT_ASC
  TEXT_DESC
  _ID_DESC
  EDITOR_NOTES_DESC
  IMAGE_URL_DESC
  SOURCE_DOMAIN_DESC
  STATUS_ASC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_MODIFIED_ASC
  PLAIN_TEXT_ASC
  SOURCE_DOMAIN_ASC
  USER_ASC
  DATE_DOWNLOADED_ASC
  DATE_SUBMITTED_ASC
  LANGUAGE_ASC
  URL_ASC
  INCIDENT_DATE_DESC
  TITLE_DESC
  USER_DESC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_ASC
  DATE_SUBMITTED_DESC
  EDITOR_NOTES_ASC
  IMAGE_URL_ASC
  _ID_ASC
  INCIDENT_TITLE_DESC
  LANGUAGE_DESC
  URL_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_TITLE_ASC
  TITLE_ASC
}

enum DuplicateSortByInput {
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
  _ID_ASC
  _ID_DESC
}

enum ClassificationSortByInput {
  _ID_DESC
  NAMESPACE_ASC
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
  _ID_ASC
}

input IncidentAllegedDeveloperOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input ChecklistRiskQueryInput {
  OR: [ChecklistRiskQueryInput!]
  likelihood_gt: String
  severity_nin: [String]
  precedents_exists: Boolean
  likelihood_in: [String]
  likelihood_lte: String
  severity_in: [String]
  generated_exists: Boolean
  likelihood: String
  precedents: [ChecklistRiskPrecedentQueryInput]
  risk_notes_ne: String
  severity_gt: String
  severity_lt: String
  touched_exists: Boolean
  risk_status_ne: String
  title_lt: String
  title_lte: String
  id: String
  likelihood_lt: String
  title_in: [String]
  risk_status_exists: Boolean
  risk_notes_in: [String]
  severity: String
  likelihood_gte: String
  title_ne: String
  touched: Boolean
  id_lt: String
  risk_notes: String
  id_lte: String
  tags_nin: [String]
  risk_notes_lte: String
  AND: [ChecklistRiskQueryInput!]
  tags_in: [String]
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  touched_ne: Boolean
  title_gte: String
  risk_notes_lt: String
  id_nin: [String]
  risk_status_nin: [String]
  risk_notes_gte: String
  risk_status_gte: String
  title_gt: String
  id_gt: String
  severity_gte: String
  tags: [String]
  id_gte: String
  risk_status_gt: String
  severity_ne: String
  risk_status: String
  likelihood_ne: String
  risk_notes_gt: String
  id_exists: Boolean
  generated: Boolean
  risk_status_in: [String]
  severity_lte: String
  tags_exists: Boolean
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  title_exists: Boolean
  risk_notes_nin: [String]
  risk_status_lt: String
  risk_status_lte: String
  likelihood_exists: Boolean
  id_ne: String
  likelihood_nin: [String]
  generated_ne: Boolean
  title_nin: [String]
  severity_exists: Boolean
  title: String
  risk_notes_exists: Boolean
  id_in: [String]
}

input TaxaField_listUpdateInput {
  public_unset: Boolean
  instant_facet: Boolean
  item_fields: TaxaField_listItem_fieldUpdateInput
  long_description: String
  complete_from: TaxaField_listComplete_fromUpdateInput
  hide_search: Boolean
  required_unset: Boolean
  required: Boolean
  long_name: String
  permitted_values: [String]
  placeholder_unset: Boolean
  instant_facet_unset: Boolean
  permitted_values_unset: Boolean
  mongo_type_unset: Boolean
  weight_inc: Int
  public: Boolean
  short_name_unset: Boolean
  item_fields_unset: Boolean
  short_name: String
  display_type_unset: Boolean
  placeholder: String
  short_description_unset: Boolean
  weight: Int
  complete_from_unset: Boolean
  default: String
  weight_unset: Boolean
  short_description: String
  field_number: String
  long_name_unset: Boolean
  display_type: String
  hide_search_unset: Boolean
  mongo_type: String
  default_unset: Boolean
  long_description_unset: Boolean
  field_number_unset: Boolean
}

input SubmissionEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input TaxaField_listComplete_fromQueryInput {
  current_nin: [String]
  current_exists: Boolean
  all_nin: [String]
  all_in: [String]
  AND: [TaxaField_listComplete_fromQueryInput!]
  OR: [TaxaField_listComplete_fromQueryInput!]
  all: [String]
  all_exists: Boolean
  current: [String]
  current_in: [String]
}

type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}

enum UserSortByInput {
  _ID_ASC
  _ID_DESC
  FIRST_NAME_ASC
  FIRST_NAME_DESC
  LAST_NAME_ASC
  LAST_NAME_DESC
  USERID_ASC
  USERID_DESC
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

input History_incidentNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}

input CandidateClassification_similarityUpdateInput {
  similarity_inc: Float
  similarity_unset: Boolean
  classification: String
  classification_unset: Boolean
  similarity: Float
}

input ChecklistInsertInput {
  about: String
  date_updated: DateTime
  id: String
  owner_id: String
  _id: ObjectId
  name: String
  tags_other: [String]
  tags_methods: [String]
  tags_goals: [String]
  date_created: DateTime
  entity_id: String
  risks: [ChecklistRiskInsertInput]
}

type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input ClassificationAttributeQueryInput {
  short_name_in: [String]
  value_json_lte: String
  short_name_gte: String
  value_json: String
  value_json_in: [String]
  AND: [ClassificationAttributeQueryInput!]
  value_json_gte: String
  short_name_nin: [String]
  short_name: String
  short_name_lt: String
  short_name_exists: Boolean
  OR: [ClassificationAttributeQueryInput!]
  short_name_lte: String
  value_json_nin: [String]
  short_name_ne: String
  short_name_gt: String
  value_json_exists: Boolean
  value_json_ne: String
  value_json_gt: String
  value_json_lt: String
}

input ReportUserRelationInput {
  link: String
  create: UserInsertInput
}

input SubscriptionIncident_idRelationInput {
  create: IncidentInsertInput
  link: Int
}

enum ReportSortByInput {
  REPORT_NUMBER_DESC
  DESCRIPTION_DESC
  EPOCH_DATE_SUBMITTED_DESC
  LANGUAGE_ASC
  PLAIN_TEXT_ASC
  REPORT_NUMBER_ASC
  CLOUDINARY_ID_ASC
  CLOUDINARY_ID_DESC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_ASC
  DATE_SUBMITTED_ASC
  USER_ASC
  USER_DESC
  EDITOR_NOTES_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_MODIFIED_DESC
  URL_DESC
  PLAIN_TEXT_DESC
  TITLE_DESC
  URL_ASC
  _ID_DESC
  DATE_DOWNLOADED_ASC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  SOURCE_DOMAIN_ASC
  TITLE_ASC
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  IMAGE_URL_ASC
  IMAGE_URL_DESC
  _ID_ASC
  DATE_PUBLISHED_ASC
  DESCRIPTION_ASC
  EPOCH_DATE_PUBLISHED_DESC
  TEXT_DESC
  DATE_SUBMITTED_DESC
  LANGUAGE_DESC
  SOURCE_DOMAIN_DESC
  TEXT_ASC
}

input TaxaUpdateInput {
  weight_unset: Boolean
  description_unset: Boolean
  field_list_unset: Boolean
  complete_entities_unset: Boolean
  dummy_fields_unset: Boolean
  weight_inc: Int
  namespace: String
  complete_entities: Boolean
  _id_unset: Boolean
  field_list: [TaxaField_listUpdateInput]
  _id: ObjectId
  namespace_unset: Boolean
  description: String
  weight: Int
  dummy_fields: [TaxaDummy_fieldUpdateInput]
}

input TaxaInsertInput {
  _id: ObjectId
  complete_entities: Boolean
  description: String
  dummy_fields: [TaxaDummy_fieldInsertInput]
  field_list: [TaxaField_listInsertInput]
  namespace: String
  weight: Int
}

input SubmissionHarmed_partiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input History_incidentTsneUpdateInput {
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
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
  incident_id: Int!
  nlp_similar_incidents: [IncidentNlp_similar_incident]
  reports: [Report]!
  title: String!
  tsne: IncidentTsne
}

input SubmissionQueryInput {
  date_submitted_lt: String
  text_ne: String
  deployers_in: [EntityQueryInput]
  image_url_lt: String
  date_modified_exists: Boolean
  user_exists: Boolean
  text_lt: String
  image_url_gt: String
  epoch_date_modified_in: [Int]
  incident_date_in: [String]
  date_submitted_gte: String
  date_submitted_lte: String
  developers: [EntityQueryInput]
  cloudinary_id_lte: String
  developers_in: [EntityQueryInput]
  date_published_in: [String]
  epoch_date_modified_lt: Int
  url_lt: String
  date_downloaded: String
  source_domain_nin: [String]
  source_domain_lte: String
  title: String
  source_domain_ne: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  developers_nin: [EntityQueryInput]
  editor_notes_gt: String
  plain_text_in: [String]
  text_in: [String]
  nlp_similar_incidents_exists: Boolean
  description_lt: String
  language: String
  _id_exists: Boolean
  incident_editors: [UserQueryInput]
  authors_in: [String]
  url_ne: String
  deployers_nin: [EntityQueryInput]
  editor_similar_incidents: [Int]
  incident_date_nin: [String]
  status_gte: String
  text_gte: String
  date_submitted_in: [String]
  editor_notes_ne: String
  cloudinary_id_gte: String
  epoch_date_modified_lte: Int
  incident_ids_nin: [Int]
  url_in: [String]
  date_modified_gt: String
  language_lt: String
  title_gt: String
  cloudinary_id: String
  source_domain_lt: String
  description_ne: String
  tags_in: [String]
  title_gte: String
  language_gt: String
  plain_text_exists: Boolean
  tags_exists: Boolean
  quiet_exists: Boolean
  date_downloaded_gte: String
  cloudinary_id_ne: String
  description_exists: Boolean
  cloudinary_id_in: [String]
  status_gt: String
  editor_notes_lte: String
  status_ne: String
  source_domain_exists: Boolean
  description_gt: String
  _id_nin: [ObjectId]
  date_submitted: String
  date_published_nin: [String]
  epoch_date_modified_exists: Boolean
  description_gte: String
  tags: [String]
  _id_in: [ObjectId]
  cloudinary_id_nin: [String]
  status_exists: Boolean
  date_downloaded_ne: String
  editor_dissimilar_incidents_exists: Boolean
  submitters_nin: [String]
  _id_lte: ObjectId
  date_modified_nin: [String]
  incident_title: String
  editor_notes: String
  date_modified_gte: String
  url_gt: String
  epoch_date_modified_nin: [Int]
  date_submitted_gt: String
  quiet: Boolean
  description: String
  editor_notes_exists: Boolean
  date_downloaded_lte: String
  title_ne: String
  incident_date_ne: String
  editor_similar_incidents_nin: [Int]
  url_gte: String
  date_modified_lte: String
  title_in: [String]
  text_nin: [String]
  image_url_lte: String
  _id_gt: ObjectId
  authors: [String]
  text_exists: Boolean
  AND: [SubmissionQueryInput!]
  image_url_gte: String
  date_published_gt: String
  plain_text_gt: String
  date_submitted_nin: [String]
  date_modified_ne: String
  incident_editors_nin: [UserQueryInput]
  editor_notes_in: [String]
  incident_title_lt: String
  incident_title_gte: String
  status_nin: [String]
  incident_date: String
  epoch_date_modified: Int
  image_url_ne: String
  cloudinary_id_lt: String
  editor_dissimilar_incidents_nin: [Int]
  cloudinary_id_gt: String
  source_domain_gt: String
  language_ne: String
  date_submitted_ne: String
  text_lte: String
  incident_date_exists: Boolean
  editor_similar_incidents_exists: Boolean
  status_lte: String
  incident_title_exists: Boolean
  image_url: String
  incident_date_gte: String
  source_domain_in: [String]
  incident_ids: [Int]
  plain_text_gte: String
  description_in: [String]
  epoch_date_modified_ne: Int
  description_lte: String
  plain_text_lt: String
  url_nin: [String]
  incident_title_nin: [String]
  editor_similar_incidents_in: [Int]
  date_published_gte: String
  image_url_nin: [String]
  language_gte: String
  editor_notes_gte: String
  developers_exists: Boolean
  language_nin: [String]
  url: String
  deployers: [EntityQueryInput]
  cloudinary_id_exists: Boolean
  plain_text_lte: String
  incident_editors_exists: Boolean
  submitters: [String]
  date_downloaded_gt: String
  epoch_date_modified_gte: Int
  editor_notes_nin: [String]
  language_exists: Boolean
  title_lte: String
  incident_title_gt: String
  embedding: SubmissionEmbeddingQueryInput
  date_published_exists: Boolean
  date_published_ne: String
  date_downloaded_lt: String
  incident_ids_in: [Int]
  text_gt: String
  source_domain_gte: String
  language_lte: String
  incident_ids_exists: Boolean
  _id_lt: ObjectId
  title_exists: Boolean
  harmed_parties_in: [EntityQueryInput]
  embedding_exists: Boolean
  editor_dissimilar_incidents_in: [Int]
  url_exists: Boolean
  tags_nin: [String]
  _id_gte: ObjectId
  status_in: [String]
  incident_title_in: [String]
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  date_downloaded_in: [String]
  language_in: [String]
  incident_date_gt: String
  epoch_date_modified_gt: Int
  _id: ObjectId
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  incident_title_ne: String
  incident_date_lt: String
  user: UserQueryInput
  date_submitted_exists: Boolean
  title_lt: String
  quiet_ne: Boolean
  harmed_parties: [EntityQueryInput]
  editor_notes_lt: String
  incident_title_lte: String
  _id_ne: ObjectId
  deployers_exists: Boolean
  date_published: String
  authors_nin: [String]
  image_url_in: [String]
  harmed_parties_exists: Boolean
  editor_dissimilar_incidents: [Int]
  status_lt: String
  OR: [SubmissionQueryInput!]
  source_domain: String
  date_modified_lt: String
  plain_text_nin: [String]
  date_downloaded_exists: Boolean
  date_downloaded_nin: [String]
  authors_exists: Boolean
  title_nin: [String]
  text: String
  image_url_exists: Boolean
  status: String
  date_modified_in: [String]
  plain_text: String
  plain_text_ne: String
  description_nin: [String]
  date_modified: String
  date_published_lt: String
  date_published_lte: String
  submitters_exists: Boolean
  url_lte: String
  incident_date_lte: String
  incident_editors_in: [UserQueryInput]
  harmed_parties_nin: [EntityQueryInput]
  submitters_in: [String]
}

input History_incidentNlp_similar_incidentQueryInput {
  incident_id_lte: Int
  incident_id_gte: Int
  incident_id: Int
  incident_id_lt: Int
  similarity_gt: Float
  incident_id_nin: [Int]
  similarity_exists: Boolean
  incident_id_exists: Boolean
  similarity_lt: Float
  incident_id_ne: Int
  incident_id_in: [Int]
  similarity_gte: Float
  similarity_nin: [Float]
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  similarity: Float
  similarity_ne: Float
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  similarity_lte: Float
  similarity_in: [Float]
  incident_id_gt: Int
}

input TaxaField_listItem_fieldInsertInput {
  default: String
  public: Boolean
  short_description: String
  short_name: String
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
  long_name: String
  permitted_values: [String]
  placeholder: String
  mongo_type: String
  long_description: String
  display_type: String
  required: Boolean
  weight: Int
  instant_facet: Boolean
  field_number: String
}

input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
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

type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}

input TaxaField_listItem_fieldComplete_fromUpdateInput {
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  entities: Boolean
  entities_unset: Boolean
  all: [String]
}

input ReportEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
}

input History_incidentUpdateInput {
  embedding_unset: Boolean
  editor_dissimilar_incidents_unset: Boolean
  embedding: History_incidentEmbeddingUpdateInput
  incident_id: Int
  AllegedHarmedOrNearlyHarmedParties: [String]
  editor_similar_incidents_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  _id_unset: Boolean
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  editor_dissimilar_incidents: [Int]
  reports_unset: Boolean
  reports: [Int]
  AllegedDeveloperOfAISystem_unset: Boolean
  editor_notes_unset: Boolean
  tsne: History_incidentTsneUpdateInput
  _id: ObjectId
  modifiedBy_unset: Boolean
  AllegedDeveloperOfAISystem: [String]
  incident_id_unset: Boolean
  editor_similar_incidents: [Int]
  date: String
  AllegedDeployerOfAISystem_unset: Boolean
  AllegedDeployerOfAISystem: [String]
  date_unset: Boolean
  editors_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  title_unset: Boolean
  title: String
  editor_notes: String
  tsne_unset: Boolean
  editors: [String]
  epoch_date_modified_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  description: String
  description_unset: Boolean
  incident_id_inc: Int
  epoch_date_modified: Int
  modifiedBy: String
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  epoch_date_modified_inc: Int
}

input CandidateEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input NotificationUpdateInput {
  userId: NotificationUserIdRelationInput
  processed_unset: Boolean
  sentDate: DateTime
  type: String
  userId_unset: Boolean
  sentDate_unset: Boolean
  processed: Boolean
  incident_id_inc: Int
  incident_id_unset: Boolean
  type_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  incident_id: Int
}

input IncidentTsneQueryInput {
  x_gte: Float
  y_ne: Float
  y_gt: Float
  OR: [IncidentTsneQueryInput!]
  x_in: [Float]
  x_lt: Float
  y_exists: Boolean
  AND: [IncidentTsneQueryInput!]
  x_gt: Float
  y_nin: [Float]
  x: Float
  y_in: [Float]
  x_lte: Float
  x_ne: Float
  x_nin: [Float]
  y: Float
  y_lt: Float
  y_gte: Float
  y_lte: Float
  x_exists: Boolean
}

input EntityQueryInput {
  name: String
  AND: [EntityQueryInput!]
  date_modified_gt: DateTime
  created_at_exists: Boolean
  entity_id_lt: String
  _id_lt: ObjectId
  entity_id_gte: String
  date_modified_lt: DateTime
  _id_in: [ObjectId]
  entity_id_gt: String
  date_modified_gte: DateTime
  entity_id_in: [String]
  date_modified_nin: [DateTime]
  created_at_lt: DateTime
  date_modified_exists: Boolean
  name_exists: Boolean
  date_modified_lte: DateTime
  date_modified_in: [DateTime]
  date_modified: DateTime
  entity_id: String
  _id_lte: ObjectId
  created_at_in: [DateTime]
  date_modified_ne: DateTime
  created_at_gt: DateTime
  created_at_ne: DateTime
  name_in: [String]
  _id_nin: [ObjectId]
  created_at_gte: DateTime
  entity_id_lte: String
  created_at: DateTime
  _id_ne: ObjectId
  name_gt: String
  name_ne: String
  OR: [EntityQueryInput!]
  _id_exists: Boolean
  created_at_nin: [DateTime]
  entity_id_nin: [String]
  entity_id_ne: String
  name_gte: String
  _id: ObjectId
  name_nin: [String]
  name_lte: String
  _id_gt: ObjectId
  entity_id_exists: Boolean
  _id_gte: ObjectId
  created_at_lte: DateTime
  name_lt: String
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

input History_reportQueryInput {
  epoch_date_submitted_lt: Int
  editor_notes_ne: String
  user_gte: String
  epoch_date_modified_gt: Int
  epoch_date_downloaded_in: [Int]
  user_ne: String
  inputs_outputs: [String]
  epoch_date_published_ne: Int
  epoch_date_downloaded_lte: Int
  date_modified_ne: DateTime
  tags_in: [String]
  report_number_exists: Boolean
  authors_exists: Boolean
  plain_text_lte: String
  title_gte: String
  source_domain_nin: [String]
  epoch_date_modified_in: [Int]
  epoch_date_published_lte: Int
  epoch_date_published_gte: Int
  epoch_date_modified_gte: Int
  modifiedBy_exists: Boolean
  description_lt: String
  epoch_date_downloaded_lt: Int
  modifiedBy: String
  description_nin: [String]
  date_submitted_lte: DateTime
  _id_in: [ObjectId]
  date_downloaded_gte: DateTime
  language_nin: [String]
  image_url_in: [String]
  date_submitted_nin: [DateTime]
  epoch_date_submitted_nin: [Int]
  date_downloaded_exists: Boolean
  url: String
  editor_notes_in: [String]
  image_url_lt: String
  date_downloaded_ne: DateTime
  report_number_lt: Int
  url_nin: [String]
  epoch_date_published_nin: [Int]
  date_submitted_ne: DateTime
  authors_nin: [String]
  date_published_gt: DateTime
  epoch_date_modified_lt: Int
  plain_text_nin: [String]
  date_published_lt: DateTime
  description_gt: String
  epoch_date_downloaded_ne: Int
  is_incident_report_exists: Boolean
  cloudinary_id_gt: String
  modifiedBy_nin: [String]
  modifiedBy_in: [String]
  is_incident_report_ne: Boolean
  url_exists: Boolean
  text_in: [String]
  OR: [History_reportQueryInput!]
  epoch_date_submitted_ne: Int
  text_nin: [String]
  image_url_lte: String
  submitters_nin: [String]
  editor_notes_lte: String
  flag: Boolean
  editor_notes_exists: Boolean
  tags_exists: Boolean
  submitters_exists: Boolean
  quiet_ne: Boolean
  _id_gte: ObjectId
  date_modified_nin: [DateTime]
  date_published_lte: DateTime
  tags: [String]
  image_url_nin: [String]
  epoch_date_downloaded_gt: Int
  submitters_in: [String]
  date_submitted_gt: DateTime
  date_published: DateTime
  date_modified_lt: DateTime
  date_downloaded_lt: DateTime
  epoch_date_modified: Int
  epoch_date_published: Int
  inputs_outputs_in: [String]
  source_domain_in: [String]
  user_lte: String
  cloudinary_id_lt: String
  image_url: String
  text_ne: String
  source_domain_ne: String
  date_submitted_exists: Boolean
  description_in: [String]
  _id: ObjectId
  date_downloaded: DateTime
  text_lt: String
  cloudinary_id_nin: [String]
  date_submitted_gte: DateTime
  language_in: [String]
  date_published_in: [DateTime]
  title_lte: String
  url_ne: String
  title_ne: String
  date_published_ne: DateTime
  date_modified: DateTime
  epoch_date_modified_nin: [Int]
  plain_text_lt: String
  submitters: [String]
  source_domain_gt: String
  language_ne: String
  cloudinary_id: String
  date_submitted_in: [DateTime]
  url_lte: String
  title_gt: String
  date_modified_lte: DateTime
  title_exists: Boolean
  user_in: [String]
  AND: [History_reportQueryInput!]
  report_number_lte: Int
  image_url_gt: String
  image_url_ne: String
  url_in: [String]
  date_downloaded_gt: DateTime
  cloudinary_id_exists: Boolean
  epoch_date_published_gt: Int
  date_modified_exists: Boolean
  _id_lte: ObjectId
  embedding: History_reportEmbeddingQueryInput
  description_lte: String
  user_gt: String
  date_modified_gte: DateTime
  date_published_exists: Boolean
  language_gt: String
  _id_lt: ObjectId
  language: String
  epoch_date_submitted_lte: Int
  modifiedBy_ne: String
  title_in: [String]
  authors: [String]
  source_domain_gte: String
  is_incident_report: Boolean
  report_number_gt: Int
  editor_notes: String
  title_lt: String
  date_published_gte: DateTime
  epoch_date_published_lt: Int
  title: String
  editor_notes_gt: String
  inputs_outputs_nin: [String]
  inputs_outputs_exists: Boolean
  authors_in: [String]
  modifiedBy_gt: String
  language_lt: String
  epoch_date_modified_exists: Boolean
  flag_exists: Boolean
  user_nin: [String]
  user: String
  epoch_date_submitted_gt: Int
  quiet: Boolean
  language_exists: Boolean
  modifiedBy_lt: String
  url_lt: String
  cloudinary_id_lte: String
  source_domain_exists: Boolean
  epoch_date_modified_lte: Int
  _id_ne: ObjectId
  plain_text: String
  date_modified_gt: DateTime
  language_lte: String
  text_gt: String
  image_url_gte: String
  embedding_exists: Boolean
  date_downloaded_nin: [DateTime]
  report_number_gte: Int
  _id_nin: [ObjectId]
  _id_gt: ObjectId
  source_domain: String
  report_number_in: [Int]
  epoch_date_submitted_exists: Boolean
  editor_notes_gte: String
  epoch_date_submitted: Int
  plain_text_gt: String
  modifiedBy_gte: String
  url_gte: String
  plain_text_gte: String
  cloudinary_id_ne: String
  epoch_date_submitted_in: [Int]
  source_domain_lt: String
  plain_text_exists: Boolean
  epoch_date_published_in: [Int]
  text_exists: Boolean
  description_ne: String
  date_modified_in: [DateTime]
  _id_exists: Boolean
  editor_notes_lt: String
  description_gte: String
  date_submitted_lt: DateTime
  report_number: Int
  date_published_nin: [DateTime]
  cloudinary_id_gte: String
  plain_text_in: [String]
  epoch_date_published_exists: Boolean
  epoch_date_downloaded_exists: Boolean
  epoch_date_modified_ne: Int
  text: String
  title_nin: [String]
  editor_notes_nin: [String]
  image_url_exists: Boolean
  source_domain_lte: String
  flag_ne: Boolean
  modifiedBy_lte: String
  epoch_date_submitted_gte: Int
  language_gte: String
  user_exists: Boolean
  text_lte: String
  date_downloaded_in: [DateTime]
  report_number_ne: Int
  quiet_exists: Boolean
  url_gt: String
  epoch_date_downloaded_nin: [Int]
  epoch_date_downloaded: Int
  description_exists: Boolean
  cloudinary_id_in: [String]
  description: String
  user_lt: String
  report_number_nin: [Int]
  date_downloaded_lte: DateTime
  plain_text_ne: String
  text_gte: String
  epoch_date_downloaded_gte: Int
  date_submitted: DateTime
  tags_nin: [String]
}

input CreateDefaultAdminUserInput {
  email: String
  password: String
}

input ClassificationUpdateInput {
  namespace: String
  _id: ObjectId
  attributes: [ClassificationAttributeUpdateInput]
  attributes_unset: Boolean
  _id_unset: Boolean
  notes_unset: Boolean
  incidents: ClassificationIncidentsRelationInput
  incidents_unset: Boolean
  publish: Boolean
  reports_unset: Boolean
  reports: ClassificationReportsRelationInput
  namespace_unset: Boolean
  notes: String
  publish_unset: Boolean
}

type LogIncidentHistoryPayload {
  incident_id: Int
}

type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
}

type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}

type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

enum History_incidentSortByInput {
  _ID_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  TITLE_DESC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_ID_DESC
  TITLE_ASC
  _ID_ASC
  EDITOR_NOTES_DESC
  DATE_ASC
  DATE_DESC
  INCIDENT_ID_ASC
  MODIFIEDBY_ASC
  MODIFIEDBY_DESC
}

type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}

type Mutation {
  createDefaultAdminUser(input: CreateDefaultAdminUserInput): DefaultAdminUser
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
  replaceOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  replaceOneNotification(data: NotificationInsertInput!, query: NotificationQueryInput): Notification
  replaceOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  replaceOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  replaceOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  replaceOneSubscription(data: SubscriptionInsertInput!, query: SubscriptionQueryInput): Subscription
  replaceOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  replaceOneUser(query: UserQueryInput, data: UserInsertInput!): User
  updateManyCandidates(query: CandidateQueryInput, set: CandidateUpdateInput!): UpdateManyPayload
  updateManyChecklists(query: ChecklistQueryInput, set: ChecklistUpdateInput!): UpdateManyPayload
  updateManyClassifications(query: ClassificationQueryInput, set: ClassificationUpdateInput!): UpdateManyPayload
  updateManyDuplicates(query: DuplicateQueryInput, set: DuplicateUpdateInput!): UpdateManyPayload
  updateManyEntities(query: EntityQueryInput, set: EntityUpdateInput!): UpdateManyPayload
  updateManyHistory_incidents(query: History_incidentQueryInput, set: History_incidentUpdateInput!): UpdateManyPayload
  updateManyHistory_reports(set: History_reportUpdateInput!, query: History_reportQueryInput): UpdateManyPayload
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
  updateOneClassification(set: ClassificationUpdateInput!, query: ClassificationQueryInput): Classification
  updateOneDuplicate(query: DuplicateQueryInput, set: DuplicateUpdateInput!): Duplicate
  updateOneEntity(query: EntityQueryInput, set: EntityUpdateInput!): Entity
  updateOneHistory_incident(query: History_incidentQueryInput, set: History_incidentUpdateInput!): History_incident
  updateOneHistory_report(query: History_reportQueryInput, set: History_reportUpdateInput!): History_report
  updateOneIncident(query: IncidentQueryInput, set: IncidentUpdateInput!): Incident
  updateOneNotification(query: NotificationQueryInput, set: NotificationUpdateInput!): Notification
  updateOneQuickadd(query: QuickaddQueryInput, set: QuickaddUpdateInput!): Quickadd
  updateOneReport(query: ReportQueryInput, set: ReportUpdateInput!): Report
  updateOneSubmission(query: SubmissionQueryInput, set: SubmissionUpdateInput!): Submission
  updateOneSubscription(query: SubscriptionQueryInput, set: SubscriptionUpdateInput!): Subscription
  updateOneTaxa(set: TaxaUpdateInput!, query: TaxaQueryInput): Taxa
  updateOneUser(query: UserQueryInput, set: UserUpdateInput!): User
  upsertOneCandidate(query: CandidateQueryInput, data: CandidateInsertInput!): Candidate
  upsertOneChecklist(query: ChecklistQueryInput, data: ChecklistInsertInput!): Checklist
  upsertOneClassification(query: ClassificationQueryInput, data: ClassificationInsertInput!): Classification
  upsertOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  upsertOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  upsertOneHistory_incident(data: History_incidentInsertInput!, query: History_incidentQueryInput): History_incident
  upsertOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  upsertOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  upsertOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
  upsertOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  upsertOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  upsertOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  upsertOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  upsertOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
}

input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input IncidentAllegedDeployerOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

type IncidentNlp_similar_incident {
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

enum QuickaddSortByInput {
  _ID_DESC
  DATE_SUBMITTED_ASC
  SOURCE_DOMAIN_DESC
  URL_ASC
  _ID_ASC
  DATE_SUBMITTED_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  SOURCE_DOMAIN_ASC
  URL_DESC
}

type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input TaxaField_listQueryInput {
  required_exists: Boolean
  weight: Int
  instant_facet_ne: Boolean
  short_description_gte: String
  permitted_values_in: [String]
  default_nin: [String]
  long_description_ne: String
  long_description_lte: String
  mongo_type_lt: String
  default_ne: String
  long_name_gte: String
  long_name: String
  placeholder_ne: String
  long_name_lt: String
  short_description_lte: String
  short_name_nin: [String]
  field_number_in: [String]
  long_description_nin: [String]
  short_name_ne: String
  public: Boolean
  mongo_type_lte: String
  complete_from: TaxaField_listComplete_fromQueryInput
  weight_gt: Int
  mongo_type_gte: String
  field_number: String
  mongo_type_exists: Boolean
  public_exists: Boolean
  field_number_lte: String
  field_number_nin: [String]
  field_number_gte: String
  long_name_ne: String
  placeholder_gte: String
  placeholder_lt: String
  short_description_in: [String]
  permitted_values_nin: [String]
  display_type_gte: String
  weight_lte: Int
  placeholder_lte: String
  default: String
  field_number_lt: String
  long_description: String
  short_name_lte: String
  short_description_ne: String
  OR: [TaxaField_listQueryInput!]
  instant_facet_exists: Boolean
  complete_from_exists: Boolean
  mongo_type_in: [String]
  instant_facet: Boolean
  display_type_lte: String
  default_in: [String]
  short_name_gt: String
  long_name_gt: String
  display_type_nin: [String]
  hide_search: Boolean
  long_name_exists: Boolean
  long_description_gte: String
  hide_search_ne: Boolean
  placeholder: String
  display_type_lt: String
  field_number_ne: String
  item_fields: TaxaField_listItem_fieldQueryInput
  weight_in: [Int]
  permitted_values: [String]
  default_lt: String
  short_name_lt: String
  required_ne: Boolean
  weight_ne: Int
  short_description_nin: [String]
  placeholder_nin: [String]
  weight_nin: [Int]
  mongo_type_ne: String
  weight_lt: Int
  placeholder_in: [String]
  display_type: String
  long_name_in: [String]
  display_type_ne: String
  hide_search_exists: Boolean
  mongo_type_nin: [String]
  required: Boolean
  field_number_exists: Boolean
  item_fields_exists: Boolean
  display_type_exists: Boolean
  long_description_in: [String]
  short_name_gte: String
  mongo_type_gt: String
  placeholder_exists: Boolean
  weight_gte: Int
  default_gt: String
  long_description_exists: Boolean
  mongo_type: String
  display_type_gt: String
  default_gte: String
  short_description_gt: String
  permitted_values_exists: Boolean
  AND: [TaxaField_listQueryInput!]
  field_number_gt: String
  short_description_exists: Boolean
  short_name_exists: Boolean
  short_description: String
  long_description_gt: String
  placeholder_gt: String
  public_ne: Boolean
  long_name_lte: String
  short_description_lt: String
  default_exists: Boolean
  long_description_lt: String
  display_type_in: [String]
  long_name_nin: [String]
  weight_exists: Boolean
  short_name: String
  default_lte: String
  short_name_in: [String]
}

input IncidentReportsRelationInput {
  link: [Int]
  create: [ReportInsertInput]
}

type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}

input NotificationInsertInput {
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: NotificationUserIdRelationInput
  _id: ObjectId
}

input ClassificationIncidentsRelationInput {
  create: [IncidentInsertInput]
  link: [Int]
}

input IncidentNlp_similar_incidentInsertInput {
  similarity: Float
  incident_id: Int
}

type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}

enum IncidentSortByInput {
  _ID_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  TITLE_ASC
  TITLE_DESC
  DATE_DESC
  _ID_DESC
  DATE_ASC
  DESCRIPTION_DESC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_ASC
  INCIDENT_ID_DESC
  DESCRIPTION_ASC
  INCIDENT_ID_ASC
}

enum SubscriptionSortByInput {
  ENTITYID_ASC
  ENTITYID_DESC
  INCIDENT_ID_ASC
  TYPE_ASC
  TYPE_DESC
  USERID_ASC
  _ID_ASC
  INCIDENT_ID_DESC
  USERID_DESC
  _ID_DESC
}

input IncidentTsneUpdateInput {
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
  x_unset: Boolean
}

input History_reportEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
}

input ClassificationReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

enum ChecklistSortByInput {
  ENTITY_ID_ASC
  NAME_ASC
  NAME_DESC
  OWNER_ID_ASC
  DATE_CREATED_DESC
  DATE_UPDATED_ASC
  ENTITY_ID_DESC
  ID_ASC
  OWNER_ID_DESC
  _ID_ASC
  ABOUT_ASC
  DATE_CREATED_ASC
  ID_DESC
  _ID_DESC
  ABOUT_DESC
  DATE_UPDATED_DESC
}

input ReportInsertInput {
  date_submitted: DateTime!
  epoch_date_published: Int!
  language: String!
  cloudinary_id: String!
  submitters: [String]!
  _id: ObjectId
  description: String
  epoch_date_modified: Int!
  inputs_outputs: [String]
  epoch_date_downloaded: Int!
  embedding: ReportEmbeddingInsertInput
  epoch_date_submitted: Int!
  title: String!
  quiet: Boolean
  report_number: Int!
  source_domain: String!
  user: ReportUserRelationInput
  editor_notes: String
  plain_text: String!
  text: String!
  flag: Boolean
  tags: [String]!
  authors: [String]!
  date_published: DateTime!
  url: String!
  is_incident_report: Boolean
  image_url: String!
  date_modified: DateTime!
  date_downloaded: DateTime!
}

input History_reportUpdateInput {
  embedding: History_reportEmbeddingUpdateInput
  cloudinary_id_unset: Boolean
  epoch_date_submitted_inc: Int
  quiet: Boolean
  submitters_unset: Boolean
  embedding_unset: Boolean
  is_incident_report: Boolean
  epoch_date_downloaded: Int
  modifiedBy_unset: Boolean
  epoch_date_modified_inc: Int
  authors_unset: Boolean
  date_published_unset: Boolean
  epoch_date_published_unset: Boolean
  source_domain_unset: Boolean
  image_url: String
  cloudinary_id: String
  _id: ObjectId
  date_downloaded: DateTime
  image_url_unset: Boolean
  flag_unset: Boolean
  user_unset: Boolean
  editor_notes: String
  epoch_date_modified: Int
  _id_unset: Boolean
  report_number_unset: Boolean
  language_unset: Boolean
  report_number: Int
  inputs_outputs_unset: Boolean
  date_downloaded_unset: Boolean
  tags_unset: Boolean
  date_published: DateTime
  epoch_date_downloaded_unset: Boolean
  inputs_outputs: [String]
  title_unset: Boolean
  url_unset: Boolean
  language: String
  epoch_date_submitted: Int
  user: String
  epoch_date_submitted_unset: Boolean
  date_modified: DateTime
  plain_text_unset: Boolean
  authors: [String]
  flag: Boolean
  text_unset: Boolean
  is_incident_report_unset: Boolean
  title: String
  date_submitted_unset: Boolean
  quiet_unset: Boolean
  submitters: [String]
  text: String
  tags: [String]
  epoch_date_published: Int
  date_modified_unset: Boolean
  report_number_inc: Int
  source_domain: String
  epoch_date_published_inc: Int
  modifiedBy: String
  editor_notes_unset: Boolean
  description: String
  plain_text: String
  description_unset: Boolean
  date_submitted: DateTime
  epoch_date_downloaded_inc: Int
  url: String
  epoch_date_modified_unset: Boolean
}

input ReportUpdateInput {
  user: ReportUserRelationInput
  _id_unset: Boolean
  editor_notes: String
  report_number: Int
  epoch_date_modified: Int
  title: String
  source_domain: String
  epoch_date_published_inc: Int
  inputs_outputs_unset: Boolean
  submitters: [String]
  epoch_date_submitted: Int
  date_modified: DateTime
  source_domain_unset: Boolean
  text_unset: Boolean
  submitters_unset: Boolean
  date_submitted_unset: Boolean
  description_unset: Boolean
  user_unset: Boolean
  image_url: String
  report_number_unset: Boolean
  epoch_date_published_unset: Boolean
  epoch_date_published: Int
  embedding: ReportEmbeddingUpdateInput
  language: String
  text: String
  is_incident_report_unset: Boolean
  date_published: DateTime
  is_incident_report: Boolean
  date_published_unset: Boolean
  report_number_inc: Int
  inputs_outputs: [String]
  quiet_unset: Boolean
  epoch_date_submitted_inc: Int
  epoch_date_downloaded_unset: Boolean
  editor_notes_unset: Boolean
  _id: ObjectId
  date_modified_unset: Boolean
  url: String
  quiet: Boolean
  tags: [String]
  flag: Boolean
  cloudinary_id_unset: Boolean
  tags_unset: Boolean
  epoch_date_modified_inc: Int
  authors_unset: Boolean
  flag_unset: Boolean
  date_downloaded: DateTime
  authors: [String]
  cloudinary_id: String
  date_downloaded_unset: Boolean
  epoch_date_downloaded_inc: Int
  epoch_date_downloaded: Int
  language_unset: Boolean
  title_unset: Boolean
  image_url_unset: Boolean
  plain_text_unset: Boolean
  epoch_date_submitted_unset: Boolean
  epoch_date_modified_unset: Boolean
  url_unset: Boolean
  date_submitted: DateTime
  plain_text: String
  embedding_unset: Boolean
  description: String
}

input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}

input ChecklistQueryInput {
  owner_id_nin: [String]
  owner_id_ne: String
  _id_gte: ObjectId
  date_created: DateTime
  about_gt: String
  tags_other_exists: Boolean
  date_updated_gte: DateTime
  tags_goals_exists: Boolean
  about: String
  name: String
  name_gt: String
  entity_id_gt: String
  _id_ne: ObjectId
  date_updated_gt: DateTime
  entity_id_lte: String
  about_lt: String
  _id_nin: [ObjectId]
  about_in: [String]
  tags_goals_nin: [String]
  owner_id_gte: String
  owner_id_lte: String
  _id_in: [ObjectId]
  AND: [ChecklistQueryInput!]
  tags_other: [String]
  entity_id: String
  name_lte: String
  owner_id: String
  date_created_gt: DateTime
  _id_gt: ObjectId
  tags_methods_nin: [String]
  id_gte: String
  tags_goals: [String]
  entity_id_in: [String]
  name_in: [String]
  tags_methods: [String]
  risks_exists: Boolean
  date_created_gte: DateTime
  tags_methods_exists: Boolean
  id_lte: String
  date_updated_exists: Boolean
  owner_id_lt: String
  tags_other_in: [String]
  date_created_lte: DateTime
  about_gte: String
  date_updated_nin: [DateTime]
  date_created_ne: DateTime
  id_exists: Boolean
  name_ne: String
  date_created_lt: DateTime
  _id: ObjectId
  entity_id_nin: [String]
  id_in: [String]
  id_lt: String
  name_exists: Boolean
  about_ne: String
  date_created_nin: [DateTime]
  name_lt: String
  id_ne: String
  tags_other_nin: [String]
  entity_id_ne: String
  name_gte: String
  entity_id_gte: String
  date_created_exists: Boolean
  name_nin: [String]
  id_gt: String
  about_exists: Boolean
  risks_nin: [ChecklistRiskQueryInput]
  about_lte: String
  OR: [ChecklistQueryInput!]
  date_updated_ne: DateTime
  about_nin: [String]
  _id_lte: ObjectId
  risks: [ChecklistRiskQueryInput]
  risks_in: [ChecklistRiskQueryInput]
  _id_lt: ObjectId
  entity_id_exists: Boolean
  owner_id_exists: Boolean
  tags_goals_in: [String]
  date_created_in: [DateTime]
  date_updated_lte: DateTime
  date_updated_lt: DateTime
  tags_methods_in: [String]
  owner_id_in: [String]
  entity_id_lt: String
  id: String
  date_updated_in: [DateTime]
  _id_exists: Boolean
  owner_id_gt: String
  id_nin: [String]
  date_updated: DateTime
}

input TaxaField_listItem_fieldComplete_fromInsertInput {
  entities: Boolean
  all: [String]
  current: [String]
}

input GetUserInput {
  userId: ObjectId
}

input ChecklistRiskInsertInput {
  likelihood: String
  risk_notes: String
  id: String
  title: String
  touched: Boolean
  generated: Boolean
  risk_status: String
  severity: String
  tags: [String]
  precedents: [ChecklistRiskPrecedentInsertInput]
}

input QuickaddUpdateInput {
  date_submitted: String
  _id: ObjectId
  source_domain: String
  url: String
  url_unset: Boolean
  date_submitted_unset: Boolean
  _id_unset: Boolean
  incident_id: Long
  incident_id_unset: Boolean
  source_domain_unset: Boolean
}

input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input CandidateQueryInput {
  url_nin: [String]
  plain_text_exists: Boolean
  language_lte: String
  source_domain_gte: String
  image_url_lte: String
  text_in: [String]
  _id_gt: ObjectId
  epoch_date_published: Int
  similarity: Float
  similarity_exists: Boolean
  source_domain: String
  match_ne: Boolean
  date_downloaded: String
  epoch_date_published_gte: Int
  title_lt: String
  date_published_gt: String
  date_published_ne: String
  text_gt: String
  url_exists: Boolean
  source_domain_in: [String]
  title_nin: [String]
  matching_entities: [String]
  plain_text_lt: String
  source_domain_nin: [String]
  title_exists: Boolean
  _id_lte: ObjectId
  authors_nin: [String]
  epoch_date_downloaded_in: [Int]
  epoch_date_published_lt: Int
  authors_exists: Boolean
  language_lt: String
  matching_harm_keywords_exists: Boolean
  similarity_gt: Float
  matching_keywords_in: [String]
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  language_gte: String
  date_downloaded_ne: String
  matching_harm_keywords_nin: [String]
  epoch_date_downloaded_lte: Int
  text_exists: Boolean
  url_gte: String
  source_domain_lte: String
  image_url_nin: [String]
  source_domain_gt: String
  epoch_date_published_in: [Int]
  similarity_in: [Float]
  embedding: CandidateEmbeddingQueryInput
  OR: [CandidateQueryInput!]
  date_published_exists: Boolean
  embedding_exists: Boolean
  epoch_date_downloaded_exists: Boolean
  date_published_lt: String
  image_url_in: [String]
  dismissed_ne: Boolean
  url_lt: String
  plain_text: String
  text_gte: String
  epoch_date_downloaded_ne: Int
  _id_lt: ObjectId
  matching_harm_keywords: [String]
  dismissed: Boolean
  _id_gte: ObjectId
  epoch_date_published_nin: [Int]
  _id_exists: Boolean
  similarity_lte: Float
  epoch_date_published_lte: Int
  similarity_lt: Float
  url_in: [String]
  image_url_ne: String
  image_url_lt: String
  date_published: String
  epoch_date_downloaded: Int
  language_ne: String
  similarity_nin: [Float]
  matching_keywords: [String]
  AND: [CandidateQueryInput!]
  similarity_ne: Float
  plain_text_ne: String
  title_in: [String]
  language_exists: Boolean
  epoch_date_downloaded_gt: Int
  matching_harm_keywords_in: [String]
  match_exists: Boolean
  date_downloaded_lte: String
  matching_entities_in: [String]
  title_lte: String
  date_downloaded_lt: String
  matching_keywords_exists: Boolean
  language_in: [String]
  plain_text_in: [String]
  language_gt: String
  matching_entities_nin: [String]
  title_gte: String
  date_published_gte: String
  _id: ObjectId
  url_lte: String
  plain_text_nin: [String]
  classification_similarity_exists: Boolean
  text_lt: String
  image_url_gt: String
  date_downloaded_gte: String
  epoch_date_published_ne: Int
  similarity_gte: Float
  text_lte: String
  matching_entities_exists: Boolean
  match: Boolean
  authors: [String]
  source_domain_ne: String
  title: String
  title_ne: String
  text_nin: [String]
  text: String
  plain_text_lte: String
  authors_in: [String]
  _id_in: [ObjectId]
  date_downloaded_exists: Boolean
  url_gt: String
  image_url: String
  plain_text_gt: String
  date_downloaded_gt: String
  classification_similarity: [CandidateClassification_similarityQueryInput]
  date_published_in: [String]
  language: String
  text_ne: String
  url_ne: String
  image_url_exists: Boolean
  epoch_date_published_gt: Int
  plain_text_gte: String
  epoch_date_downloaded_nin: [Int]
  title_gt: String
  matching_keywords_nin: [String]
  source_domain_exists: Boolean
  image_url_gte: String
  date_downloaded_nin: [String]
  source_domain_lt: String
  url: String
  epoch_date_downloaded_gte: Int
  language_nin: [String]
  date_published_lte: String
  _id_nin: [ObjectId]
  dismissed_exists: Boolean
  epoch_date_published_exists: Boolean
  _id_ne: ObjectId
  date_downloaded_in: [String]
  date_published_nin: [String]
  epoch_date_downloaded_lt: Int
}

input CandidateClassification_similarityQueryInput {
  similarity_exists: Boolean
  classification_gt: String
  similarity_nin: [Float]
  OR: [CandidateClassification_similarityQueryInput!]
  similarity_ne: Float
  similarity: Float
  similarity_lt: Float
  classification_in: [String]
  classification_nin: [String]
  similarity_lte: Float
  similarity_in: [Float]
  classification_ne: String
  classification_exists: Boolean
  classification_lt: String
  similarity_gt: Float
  AND: [CandidateClassification_similarityQueryInput!]
  classification: String
  classification_gte: String
  similarity_gte: Float
  classification_lte: String
}

enum CandidateSortByInput {
  SOURCE_DOMAIN_DESC
  TEXT_DESC
  _ID_DESC
  DATE_PUBLISHED_ASC
  DATE_PUBLISHED_DESC
  IMAGE_URL_DESC
  LANGUAGE_ASC
  TITLE_DESC
  URL_DESC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  PLAIN_TEXT_DESC
  SIMILARITY_ASC
  TEXT_ASC
  TITLE_ASC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  IMAGE_URL_ASC
  LANGUAGE_DESC
  SOURCE_DOMAIN_ASC
  URL_ASC
  _ID_ASC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  PLAIN_TEXT_ASC
  SIMILARITY_DESC
}

input History_reportInsertInput {
  modifiedBy: String
  inputs_outputs: [String]
  is_incident_report: Boolean
  date_modified: DateTime!
  description: String
  tags: [String]!
  epoch_date_modified: Int!
  date_published: DateTime!
  user: String
  epoch_date_downloaded: Int!
  epoch_date_submitted: Int!
  _id: ObjectId
  report_number: Int!
  embedding: History_reportEmbeddingInsertInput
  title: String!
  text: String!
  quiet: Boolean
  plain_text: String!
  submitters: [String]!
  language: String!
  url: String!
  epoch_date_published: Int!
  source_domain: String!
  authors: [String]!
  date_downloaded: DateTime!
  editor_notes: String
  cloudinary_id: String!
  date_submitted: DateTime!
  flag: Boolean
  image_url: String!
}

input IncidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

input ReportQueryInput {
  _id: ObjectId
  date_downloaded_gte: DateTime
  image_url_ne: String
  url_gt: String
  title_in: [String]
  tags: [String]
  _id_gte: ObjectId
  date_downloaded_lte: DateTime
  plain_text_gte: String
  _id_lte: ObjectId
  description_gt: String
  plain_text_nin: [String]
  date_downloaded_gt: DateTime
  plain_text: String
  image_url_in: [String]
  date_published_gt: DateTime
  date_submitted_nin: [DateTime]
  date_modified: DateTime
  description: String
  language_gt: String
  source_domain_gt: String
  date_downloaded_in: [DateTime]
  date_published: DateTime
  text_lte: String
  user_exists: Boolean
  text_gt: String
  date_modified_lt: DateTime
  date_modified_exists: Boolean
  date_modified_gt: DateTime
  flag_exists: Boolean
  date_modified_gte: DateTime
  date_published_nin: [DateTime]
  epoch_date_downloaded_in: [Int]
  date_published_in: [DateTime]
  epoch_date_downloaded_lte: Int
  epoch_date_modified_nin: [Int]
  cloudinary_id_gt: String
  epoch_date_submitted_in: [Int]
  language: String
  image_url_gte: String
  is_incident_report: Boolean
  url_ne: String
  epoch_date_published_nin: [Int]
  plain_text_gt: String
  title_nin: [String]
  is_incident_report_ne: Boolean
  title_ne: String
  epoch_date_submitted_lt: Int
  epoch_date_published_lte: Int
  cloudinary_id_exists: Boolean
  title_gt: String
  source_domain_exists: Boolean
  epoch_date_modified: Int
  epoch_date_modified_gte: Int
  source_domain_ne: String
  title_exists: Boolean
  epoch_date_published: Int
  language_exists: Boolean
  epoch_date_modified_in: [Int]
  title_lte: String
  language_gte: String
  tags_exists: Boolean
  report_number_gt: Int
  date_published_ne: DateTime
  report_number_lte: Int
  _id_in: [ObjectId]
  epoch_date_downloaded_lt: Int
  epoch_date_published_in: [Int]
  epoch_date_submitted_gt: Int
  title_gte: String
  editor_notes: String
  date_published_exists: Boolean
  epoch_date_downloaded_exists: Boolean
  _id_lt: ObjectId
  _id_nin: [ObjectId]
  quiet_exists: Boolean
  url_in: [String]
  flag: Boolean
  inputs_outputs: [String]
  url_nin: [String]
  image_url_exists: Boolean
  date_submitted_lte: DateTime
  title: String
  user: UserQueryInput
  cloudinary_id_gte: String
  description_ne: String
  embedding: ReportEmbeddingQueryInput
  editor_notes_lt: String
  authors_nin: [String]
  epoch_date_submitted_lte: Int
  authors: [String]
  _id_gt: ObjectId
  editor_notes_gt: String
  epoch_date_downloaded_ne: Int
  report_number: Int
  text_exists: Boolean
  image_url_gt: String
  text_lt: String
  text_in: [String]
  epoch_date_published_exists: Boolean
  report_number_gte: Int
  date_submitted: DateTime
  epoch_date_published_gt: Int
  epoch_date_submitted_ne: Int
  url_lte: String
  date_published_lte: DateTime
  cloudinary_id_nin: [String]
  source_domain_nin: [String]
  url: String
  authors_exists: Boolean
  text_ne: String
  editor_notes_gte: String
  title_lt: String
  source_domain_lt: String
  date_modified_in: [DateTime]
  cloudinary_id_lte: String
  authors_in: [String]
  tags_in: [String]
  epoch_date_downloaded_gt: Int
  cloudinary_id_in: [String]
  epoch_date_downloaded: Int
  epoch_date_downloaded_gte: Int
  source_domain_in: [String]
  editor_notes_lte: String
  image_url_lt: String
  source_domain: String
  date_modified_ne: DateTime
  date_modified_lte: DateTime
  description_in: [String]
  date_downloaded_exists: Boolean
  plain_text_exists: Boolean
  AND: [ReportQueryInput!]
  _id_ne: ObjectId
  epoch_date_modified_lte: Int
  plain_text_lte: String
  editor_notes_nin: [String]
  epoch_date_submitted_nin: [Int]
  epoch_date_published_gte: Int
  editor_notes_in: [String]
  text_nin: [String]
  report_number_lt: Int
  description_gte: String
  image_url: String
  inputs_outputs_nin: [String]
  submitters: [String]
  url_exists: Boolean
  plain_text_lt: String
  report_number_exists: Boolean
  epoch_date_submitted_exists: Boolean
  date_published_gte: DateTime
  language_lt: String
  language_nin: [String]
  text_gte: String
  is_incident_report_exists: Boolean
  date_submitted_in: [DateTime]
  date_submitted_ne: DateTime
  date_modified_nin: [DateTime]
  description_lte: String
  date_downloaded_nin: [DateTime]
  description_nin: [String]
  report_number_in: [Int]
  description_lt: String
  source_domain_lte: String
  epoch_date_downloaded_nin: [Int]
  epoch_date_submitted_gte: Int
  submitters_nin: [String]
  editor_notes_exists: Boolean
  quiet_ne: Boolean
  url_lt: String
  plain_text_ne: String
  date_submitted_lt: DateTime
  editor_notes_ne: String
  tags_nin: [String]
  report_number_nin: [Int]
  url_gte: String
  image_url_lte: String
  submitters_exists: Boolean
  epoch_date_modified_gt: Int
  cloudinary_id_lt: String
  date_published_lt: DateTime
  epoch_date_modified_lt: Int
  inputs_outputs_in: [String]
  language_lte: String
  description_exists: Boolean
  date_submitted_gte: DateTime
  language_ne: String
  plain_text_in: [String]
  date_downloaded: DateTime
  epoch_date_published_ne: Int
  quiet: Boolean
  OR: [ReportQueryInput!]
  date_downloaded_lt: DateTime
  epoch_date_submitted: Int
  date_submitted_gt: DateTime
  date_downloaded_ne: DateTime
  report_number_ne: Int
  source_domain_gte: String
  flag_ne: Boolean
  submitters_in: [String]
  cloudinary_id_ne: String
  embedding_exists: Boolean
  epoch_date_modified_ne: Int
  text: String
  inputs_outputs_exists: Boolean
  date_submitted_exists: Boolean
  epoch_date_modified_exists: Boolean
  language_in: [String]
  cloudinary_id: String
  _id_exists: Boolean
  epoch_date_published_lt: Int
  image_url_nin: [String]
}

input ChecklistRiskPrecedentQueryInput {
  incident_id_gte: Int
  description_gte: String
  AND: [ChecklistRiskPrecedentQueryInput!]
  incident_id_nin: [Int]
  title_gt: String
  incident_id: Int
  title_exists: Boolean
  title_lt: String
  incident_id_lte: Int
  incident_id_lt: Int
  tags: [String]
  description_exists: Boolean
  title_in: [String]
  tags_in: [String]
  incident_id_ne: Int
  description_ne: String
  description_lt: String
  incident_id_exists: Boolean
  description: String
  description_gt: String
  title_gte: String
  description_in: [String]
  title_lte: String
  description_lte: String
  title_nin: [String]
  title: String
  incident_id_gt: Int
  tags_nin: [String]
  incident_id_in: [Int]
  title_ne: String
  description_nin: [String]
  tags_exists: Boolean
  OR: [ChecklistRiskPrecedentQueryInput!]
}

input UserInsertInput {
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
  _id: ObjectId
}

input TaxaField_listItem_fieldUpdateInput {
  short_name_unset: Boolean
  display_type_unset: Boolean
  required_unset: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  display_type: String
  field_number_unset: Boolean
  public_unset: Boolean
  mongo_type_unset: Boolean
  default_unset: Boolean
  required: Boolean
  weight_inc: Int
  complete_from_unset: Boolean
  long_name_unset: Boolean
  long_description: String
  short_name: String
  placeholder: String
  permitted_values_unset: Boolean
  short_description_unset: Boolean
  instant_facet_unset: Boolean
  placeholder_unset: Boolean
  instant_facet: Boolean
  permitted_values: [String]
  default: String
  field_number: String
  short_description: String
  weight: Int
  public: Boolean
  long_description_unset: Boolean
  long_name: String
  mongo_type: String
  weight_unset: Boolean
}

input History_incidentEmbeddingInsertInput {
  vector: [Float]
  from_reports: [Int]
}

input ClassificationAttributeInsertInput {
  short_name: String
  value_json: String
}

input SubscriptionUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input UserQueryInput {
  userId_nin: [String]
  last_name_gt: String
  _id_lte: ObjectId
  first_name_gt: String
  first_name_lt: String
  _id_gte: ObjectId
  last_name_in: [String]
  first_name_ne: String
  _id_in: [ObjectId]
  _id_lt: ObjectId
  _id_ne: ObjectId
  first_name_in: [String]
  userId_gt: String
  last_name: String
  first_name_lte: String
  roles_nin: [String]
  roles_exists: Boolean
  last_name_lte: String
  last_name_exists: Boolean
  userId_ne: String
  userId_gte: String
  userId: String
  first_name: String
  last_name_lt: String
  userId_in: [String]
  AND: [UserQueryInput!]
  last_name_nin: [String]
  userId_lt: String
  first_name_exists: Boolean
  _id_gt: ObjectId
  first_name_gte: String
  roles: [String]
  last_name_ne: String
  _id: ObjectId
  _id_nin: [ObjectId]
  userId_exists: Boolean
  first_name_nin: [String]
  last_name_gte: String
  userId_lte: String
  OR: [UserQueryInput!]
  _id_exists: Boolean
  roles_in: [String]
}

type IncidentTsne {
  x: Float
  y: Float
}

input SubmissionNlp_similar_incidentQueryInput {
  similarity_gt: Float
  incident_id_gte: Int
  incident_id_lte: Int
  similarity_ne: Float
  similarity_lte: Float
  incident_id_lt: Int
  similarity_lt: Float
  incident_id_gt: Int
  incident_id_exists: Boolean
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_in: [Int]
  similarity_nin: [Float]
  similarity_in: [Float]
  incident_id_nin: [Int]
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_ne: Int
  similarity: Float
  similarity_gte: Float
  similarity_exists: Boolean
  incident_id: Int
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

input IncidentUpdateInput {
  description: String
  tsne_unset: Boolean
  reports_unset: Boolean
  editors: IncidentEditorsRelationInput
  editor_similar_incidents_unset: Boolean
  description_unset: Boolean
  embedding: IncidentEmbeddingUpdateInput
  epoch_date_modified_unset: Boolean
  incident_id: Int
  flagged_dissimilar_incidents: [Int]
  title_unset: Boolean
  title: String
  AllegedDeployerOfAISystem_unset: Boolean
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  embedding_unset: Boolean
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  editor_notes: String
  date_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  editor_dissimilar_incidents: [Int]
  incident_id_unset: Boolean
  tsne: IncidentTsneUpdateInput
  _id_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  epoch_date_modified_inc: Int
  editor_notes_unset: Boolean
  editors_unset: Boolean
  incident_id_inc: Int
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  epoch_date_modified: Int
  editor_dissimilar_incidents_unset: Boolean
  reports: IncidentReportsRelationInput
  date: String
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  AllegedDeveloperOfAISystem_unset: Boolean
  _id: ObjectId
  nlp_similar_incidents_unset: Boolean
  editor_similar_incidents: [Int]
}

input ReportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input SubmissionInsertInput {
  source_domain: String!
  incident_title: String
  plain_text: String
  status: String
  epoch_date_modified: Int
  language: String!
  title: String!
  image_url: String!
  incident_ids: [Int]
  tags: [String]!
  _id: ObjectId
  incident_editors: SubmissionIncident_editorsRelationInput
  text: String!
  editor_dissimilar_incidents: [Int]
  submitters: [String]!
  date_submitted: String!
  editor_notes: String
  date_downloaded: String!
  date_modified: String!
  embedding: SubmissionEmbeddingInsertInput
  quiet: Boolean
  url: String!
  editor_similar_incidents: [Int]
  date_published: String!
  cloudinary_id: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  description: String
  authors: [String]!
  deployers: SubmissionDeployersRelationInput
  harmed_parties: SubmissionHarmed_partiesRelationInput
  incident_date: String
  user: SubmissionUserRelationInput
  developers: SubmissionDevelopersRelationInput
}

input TaxaField_listInsertInput {
  required: Boolean
  default: String
  hide_search: Boolean
  weight: Int
  instant_facet: Boolean
  complete_from: TaxaField_listComplete_fromInsertInput
  field_number: String
  placeholder: String
  mongo_type: String
  public: Boolean
  long_description: String
  permitted_values: [String]
  short_description: String
  display_type: String
  long_name: String
  short_name: String
  item_fields: TaxaField_listItem_fieldInsertInput
}

input ClassificationAttributeUpdateInput {
  short_name: String
  short_name_unset: Boolean
  value_json: String
  value_json_unset: Boolean
}

input ChecklistUpdateInput {
  id_unset: Boolean
  tags_methods: [String]
  tags_methods_unset: Boolean
  tags_goals: [String]
  entity_id: String
  tags_other: [String]
  date_created: DateTime
  date_updated_unset: Boolean
  owner_id_unset: Boolean
  about_unset: Boolean
  tags_goals_unset: Boolean
  _id_unset: Boolean
  risks_unset: Boolean
  _id: ObjectId
  entity_id_unset: Boolean
  date_updated: DateTime
  name: String
  owner_id: String
  about: String
  id: String
  tags_other_unset: Boolean
  risks: [ChecklistRiskUpdateInput]
  date_created_unset: Boolean
  name_unset: Boolean
}

input IncidentNlp_similar_incidentQueryInput {
  incident_id_gt: Int
  similarity_exists: Boolean
  similarity_ne: Float
  similarity: Float
  incident_id: Int
  incident_id_in: [Int]
  OR: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_nin: [Int]
  similarity_lte: Float
  similarity_nin: [Float]
  similarity_in: [Float]
  incident_id_lt: Int
  similarity_gte: Float
  incident_id_lte: Int
  incident_id_gte: Int
  similarity_gt: Float
  similarity_lt: Float
  AND: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_exists: Boolean
  incident_id_ne: Int
}

input History_incidentQueryInput {
  editor_notes_in: [String]
  editors: [String]
  editor_notes_lt: String
  editor_similar_incidents_nin: [Int]
  epoch_date_modified_ne: Int
  epoch_date_modified_nin: [Int]
  editor_notes: String
  modifiedBy_ne: String
  title_lt: String
  description_exists: Boolean
  title_lte: String
  modifiedBy_nin: [String]
  AllegedDeveloperOfAISystem_nin: [String]
  _id_nin: [ObjectId]
  tsne: History_incidentTsneQueryInput
  description_gt: String
  editors_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  reports_exists: Boolean
  title_gte: String
  _id_exists: Boolean
  description_lt: String
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  tsne_exists: Boolean
  incident_id: Int
  date_lt: String
  date_exists: Boolean
  editor_notes_ne: String
  reports_nin: [Int]
  flagged_dissimilar_incidents_exists: Boolean
  editors_nin: [String]
  editor_notes_nin: [String]
  modifiedBy_gte: String
  incident_id_gt: Int
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  description_nin: [String]
  epoch_date_modified_exists: Boolean
  editor_notes_gte: String
  incident_id_in: [Int]
  editor_notes_gt: String
  _id_gt: ObjectId
  AllegedDeployerOfAISystem_in: [String]
  modifiedBy_gt: String
  epoch_date_modified_lte: Int
  AllegedDeployerOfAISystem_exists: Boolean
  _id_lte: ObjectId
  incident_id_lt: Int
  embedding_exists: Boolean
  date_ne: String
  epoch_date_modified_gte: Int
  title_nin: [String]
  AllegedDeployerOfAISystem_nin: [String]
  description_lte: String
  title_ne: String
  _id_in: [ObjectId]
  epoch_date_modified_gt: Int
  editor_notes_exists: Boolean
  AllegedDeveloperOfAISystem: [String]
  _id_lt: ObjectId
  incident_id_ne: Int
  modifiedBy: String
  title: String
  editor_dissimilar_incidents: [Int]
  description_gte: String
  title_exists: Boolean
  modifiedBy_exists: Boolean
  incident_id_lte: Int
  title_in: [String]
  incident_id_exists: Boolean
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  epoch_date_modified_in: [Int]
  date: String
  editor_dissimilar_incidents_nin: [Int]
  description_in: [String]
  incident_id_gte: Int
  _id_gte: ObjectId
  modifiedBy_lt: String
  editors_in: [String]
  editor_dissimilar_incidents_in: [Int]
  epoch_date_modified_lt: Int
  embedding: History_incidentEmbeddingQueryInput
  nlp_similar_incidents_exists: Boolean
  OR: [History_incidentQueryInput!]
  flagged_dissimilar_incidents_nin: [Int]
  AllegedDeployerOfAISystem: [String]
  AllegedDeveloperOfAISystem_in: [String]
  title_gt: String
  description_ne: String
  date_gte: String
  modifiedBy_in: [String]
  editor_similar_incidents_in: [Int]
  AllegedHarmedOrNearlyHarmedParties: [String]
  reports_in: [Int]
  incident_id_nin: [Int]
  epoch_date_modified: Int
  date_gt: String
  editor_notes_lte: String
  editor_similar_incidents_exists: Boolean
  description: String
  modifiedBy_lte: String
  editor_dissimilar_incidents_exists: Boolean
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  _id: ObjectId
  flagged_dissimilar_incidents_in: [Int]
  _id_ne: ObjectId
  date_lte: String
  date_nin: [String]
  flagged_dissimilar_incidents: [Int]
  reports: [Int]
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  date_in: [String]
  editor_similar_incidents: [Int]
  AllegedDeveloperOfAISystem_exists: Boolean
  AND: [History_incidentQueryInput!]
}

type ClassificationAttribute {
  short_name: String
  value_json: String
}

input CandidateEmbeddingQueryInput {
  from_text_hash_lte: String
  vector_exists: Boolean
  from_text_hash_exists: Boolean
  from_text_hash_ne: String
  from_text_hash: String
  from_text_hash_lt: String
  vector_nin: [Float]
  from_text_hash_gt: String
  AND: [CandidateEmbeddingQueryInput!]
  OR: [CandidateEmbeddingQueryInput!]
  from_text_hash_gte: String
  vector_in: [Float]
  from_text_hash_nin: [String]
  vector: [Float]
  from_text_hash_in: [String]
}

input ClassificationInsertInput {
  namespace: String!
  notes: String
  publish: Boolean
  reports: ClassificationReportsRelationInput!
  _id: ObjectId
  attributes: [ClassificationAttributeInsertInput]
  incidents: ClassificationIncidentsRelationInput!
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

input CandidateClassification_similarityInsertInput {
  classification: String
  similarity: Float
}

type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}

scalar ObjectId

type Entity {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}

input TaxaDummy_fieldQueryInput {
  short_name_in: [String]
  field_number: String
  short_name: String
  short_name_nin: [String]
  field_number_lt: String
  field_number_gt: String
  short_name_gt: String
  AND: [TaxaDummy_fieldQueryInput!]
  OR: [TaxaDummy_fieldQueryInput!]
  field_number_in: [String]
  field_number_exists: Boolean
  short_name_gte: String
  short_name_lt: String
  field_number_lte: String
  field_number_ne: String
  short_name_exists: Boolean
  short_name_ne: String
  field_number_nin: [String]
  short_name_lte: String
  field_number_gte: String
}

type TaxaField_listComplete_from {
  all: [String]
  current: [String]
}

type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}

input EntityInsertInput {
  entity_id: String!
  name: String!
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
}

input QuickaddInsertInput {
  incident_id: Long
  source_domain: String
  url: String!
  _id: ObjectId
  date_submitted: String!
}

input SubmissionEmbeddingQueryInput {
  from_text_hash_in: [String]
  from_text_hash_ne: String
  OR: [SubmissionEmbeddingQueryInput!]
  from_text_hash: String
  AND: [SubmissionEmbeddingQueryInput!]
  from_text_hash_gte: String
  from_text_hash_lt: String
  vector: [Float]
  from_text_hash_exists: Boolean
  vector_exists: Boolean
  vector_in: [Float]
  from_text_hash_nin: [String]
  vector_nin: [Float]
  from_text_hash_lte: String
  from_text_hash_gt: String
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

input History_reportEmbeddingQueryInput {
  from_text_hash_exists: Boolean
  from_text_hash_nin: [String]
  vector_exists: Boolean
  from_text_hash_ne: String
  vector_in: [Float]
  OR: [History_reportEmbeddingQueryInput!]
  from_text_hash_lt: String
  from_text_hash: String
  vector_nin: [Float]
  from_text_hash_lte: String
  AND: [History_reportEmbeddingQueryInput!]
  from_text_hash_gte: String
  vector: [Float]
  from_text_hash_in: [String]
  from_text_hash_gt: String
}

input SubmissionNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

scalar DateTime

input TaxaQueryInput {
  description_exists: Boolean
  field_list_exists: Boolean
  complete_entities: Boolean
  weight_lt: Int
  _id_gt: ObjectId
  namespace_lte: String
  weight_in: [Int]
  _id_ne: ObjectId
  namespace_exists: Boolean
  weight_nin: [Int]
  _id_nin: [ObjectId]
  dummy_fields: [TaxaDummy_fieldQueryInput]
  complete_entities_exists: Boolean
  field_list: [TaxaField_listQueryInput]
  AND: [TaxaQueryInput!]
  _id_gte: ObjectId
  description_nin: [String]
  _id_lt: ObjectId
  namespace_lt: String
  namespace_ne: String
  weight_gte: Int
  _id_lte: ObjectId
  weight_exists: Boolean
  description_in: [String]
  namespace_gt: String
  namespace: String
  description: String
  description_gte: String
  namespace_in: [String]
  field_list_nin: [TaxaField_listQueryInput]
  OR: [TaxaQueryInput!]
  description_gt: String
  dummy_fields_exists: Boolean
  namespace_gte: String
  _id_exists: Boolean
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  complete_entities_ne: Boolean
  weight_lte: Int
  namespace_nin: [String]
  description_lte: String
  description_lt: String
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  _id: ObjectId
  _id_in: [ObjectId]
  weight_ne: Int
  weight: Int
  weight_gt: Int
  description_ne: String
  field_list_in: [TaxaField_listQueryInput]
}

input ChecklistRiskPrecedentInsertInput {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input UserUpdateInput {
  first_name_unset: Boolean
  roles_unset: Boolean
  userId_unset: Boolean
  _id_unset: Boolean
  last_name_unset: Boolean
  roles: [String]
  userId: String
  last_name: String
  first_name: String
  _id: ObjectId
}

input SubmissionEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input CandidateEmbeddingUpdateInput {
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
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

input TaxaField_listItem_fieldQueryInput {
  long_name: String
  default_lte: String
  long_description_lte: String
  permitted_values: [String]
  instant_facet_ne: Boolean
  OR: [TaxaField_listItem_fieldQueryInput!]
  placeholder: String
  weight_gte: Int
  short_name_nin: [String]
  long_name_exists: Boolean
  long_name_ne: String
  field_number_gte: String
  permitted_values_in: [String]
  complete_from_exists: Boolean
  field_number_gt: String
  display_type_gt: String
  short_name_exists: Boolean
  long_description_lt: String
  placeholder_gt: String
  long_name_gte: String
  field_number_ne: String
  default: String
  mongo_type_ne: String
  short_name_in: [String]
  display_type: String
  short_description_in: [String]
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  long_description: String
  instant_facet: Boolean
  permitted_values_nin: [String]
  field_number_exists: Boolean
  long_name_lt: String
  display_type_lte: String
  weight_lt: Int
  mongo_type_exists: Boolean
  short_description_lte: String
  short_description_ne: String
  long_name_gt: String
  mongo_type_gte: String
  display_type_nin: [String]
  weight_nin: [Int]
  long_description_exists: Boolean
  public_ne: Boolean
  field_number_lt: String
  weight_gt: Int
  default_gte: String
  weight_exists: Boolean
  field_number: String
  long_description_nin: [String]
  default_in: [String]
  weight_in: [Int]
  field_number_in: [String]
  long_description_in: [String]
  default_exists: Boolean
  short_description: String
  display_type_in: [String]
  required: Boolean
  default_nin: [String]
  display_type_lt: String
  mongo_type_in: [String]
  short_name_lte: String
  placeholder_gte: String
  placeholder_lte: String
  short_description_exists: Boolean
  short_name: String
  short_description_gte: String
  mongo_type_nin: [String]
  weight: Int
  weight_ne: Int
  long_description_gte: String
  placeholder_nin: [String]
  long_name_in: [String]
  display_type_gte: String
  placeholder_in: [String]
  placeholder_lt: String
  display_type_exists: Boolean
  short_description_nin: [String]
  short_name_gte: String
  short_description_gt: String
  display_type_ne: String
  long_description_gt: String
  placeholder_exists: Boolean
  placeholder_ne: String
  mongo_type_gt: String
  required_ne: Boolean
  mongo_type_lte: String
  instant_facet_exists: Boolean
  short_name_lt: String
  default_lt: String
  field_number_lte: String
  default_gt: String
  default_ne: String
  short_description_lt: String
  weight_lte: Int
  mongo_type: String
  public: Boolean
  required_exists: Boolean
  long_name_nin: [String]
  short_name_gt: String
  short_name_ne: String
  long_name_lte: String
  AND: [TaxaField_listItem_fieldQueryInput!]
  long_description_ne: String
  field_number_nin: [String]
  public_exists: Boolean
  mongo_type_lt: String
  permitted_values_exists: Boolean
}

type TaxaDummy_field {
  field_number: String
  short_name: String
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
  incident_id: Int!
  modifiedBy: String
  nlp_similar_incidents: [History_incidentNlp_similar_incident]
  reports: [Int]!
  title: String!
  tsne: History_incidentTsne
}

type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input IncidentEmbeddingQueryInput {
  AND: [IncidentEmbeddingQueryInput!]
  OR: [IncidentEmbeddingQueryInput!]
  from_reports: [Int]
  from_reports_exists: Boolean
  vector_in: [Float]
  from_reports_nin: [Int]
  vector_nin: [Float]
  vector_exists: Boolean
  from_reports_in: [Int]
  vector: [Float]
}

input QuickaddQueryInput {
  date_submitted_ne: String
  incident_id_lt: Long
  date_submitted_lte: String
  date_submitted_gte: String
  incident_id_ne: Long
  _id: ObjectId
  url_lt: String
  incident_id_exists: Boolean
  url: String
  _id_lte: ObjectId
  url_in: [String]
  OR: [QuickaddQueryInput!]
  url_gt: String
  _id_nin: [ObjectId]
  date_submitted_exists: Boolean
  _id_gt: ObjectId
  source_domain_lte: String
  incident_id_lte: Long
  url_gte: String
  source_domain_gte: String
  date_submitted_lt: String
  source_domain_exists: Boolean
  _id_gte: ObjectId
  url_ne: String
  _id_ne: ObjectId
  url_nin: [String]
  incident_id_in: [Long]
  source_domain_ne: String
  _id_lt: ObjectId
  date_submitted_in: [String]
  date_submitted: String
  date_submitted_gt: String
  source_domain: String
  url_lte: String
  AND: [QuickaddQueryInput!]
  _id_in: [ObjectId]
  incident_id: Long
  source_domain_lt: String
  incident_id_nin: [Long]
  url_exists: Boolean
  incident_id_gt: Long
  source_domain_nin: [String]
  source_domain_in: [String]
  date_submitted_nin: [String]
  incident_id_gte: Long
  source_domain_gt: String
  _id_exists: Boolean
}

input IncidentEmbeddingUpdateInput {
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}

input IncidentTsneInsertInput {
  x: Float
  y: Float
}

input History_incidentEmbeddingUpdateInput {
  vector_unset: Boolean
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
}

input SubscriptionUpdateInput {
  userId_unset: Boolean
  _id: ObjectId
  incident_id_unset: Boolean
  type_unset: Boolean
  _id_unset: Boolean
  incident_id: SubscriptionIncident_idRelationInput
  type: String
  entityId: SubscriptionEntityIdRelationInput
  entityId_unset: Boolean
  userId: SubscriptionUserIdRelationInput
}

input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}

enum History_reportSortByInput {
  MODIFIEDBY_DESC
  TITLE_ASC
  TITLE_DESC
  DATE_SUBMITTED_ASC
  DESCRIPTION_DESC
  LANGUAGE_DESC
  REPORT_NUMBER_ASC
  _ID_ASC
  IMAGE_URL_DESC
  SOURCE_DOMAIN_ASC
  TEXT_DESC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_SUBMITTED_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  IMAGE_URL_ASC
  URL_DESC
  USER_ASC
  USER_DESC
  CLOUDINARY_ID_ASC
  DATE_DOWNLOADED_DESC
  SOURCE_DOMAIN_DESC
  TEXT_ASC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_ASC
  DESCRIPTION_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_MODIFIED_DESC
  _ID_DESC
  CLOUDINARY_ID_DESC
  LANGUAGE_ASC
  MODIFIEDBY_ASC
  DATE_MODIFIED_DESC
  DATE_SUBMITTED_DESC
  DATE_PUBLISHED_DESC
  EDITOR_NOTES_ASC
  EPOCH_DATE_PUBLISHED_DESC
  PLAIN_TEXT_ASC
  PLAIN_TEXT_DESC
  REPORT_NUMBER_DESC
  DATE_MODIFIED_ASC
  DATE_PUBLISHED_ASC
  URL_ASC
}

input SubmissionNlp_similar_incidentUpdateInput {
  incident_id_unset: Boolean
  similarity: Float
  similarity_unset: Boolean
  similarity_inc: Float
  incident_id: Int
  incident_id_inc: Int
}

type LogReportHistoryPayload {
  report_number: Int
}

type User {
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

enum EntitySortByInput {
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  NAME_ASC
  _ID_DESC
  CREATED_AT_ASC
  NAME_DESC
  _ID_ASC
  CREATED_AT_DESC
}

input History_incidentTsneQueryInput {
  x: Float
  x_exists: Boolean
  OR: [History_incidentTsneQueryInput!]
  x_gt: Float
  x_lt: Float
  y_in: [Float]
  y_lt: Float
  x_in: [Float]
  y_exists: Boolean
  AND: [History_incidentTsneQueryInput!]
  y_lte: Float
  x_gte: Float
  x_lte: Float
  x_nin: [Float]
  y: Float
  y_ne: Float
  x_ne: Float
  y_nin: [Float]
  y_gt: Float
  y_gte: Float
}

type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
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

type AppUser {
  email: String
}

input CandidateUpdateInput {
  image_url: String
  dismissed: Boolean
  similarity_unset: Boolean
  epoch_date_published: Int
  dismissed_unset: Boolean
  language: String
  epoch_date_published_inc: Int
  source_domain: String
  similarity: Float
  text_unset: Boolean
  authors_unset: Boolean
  matching_entities_unset: Boolean
  epoch_date_downloaded: Int
  epoch_date_published_unset: Boolean
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  match_unset: Boolean
  source_domain_unset: Boolean
  url_unset: Boolean
  embedding: CandidateEmbeddingUpdateInput
  matching_keywords_unset: Boolean
  matching_keywords: [String]
  matching_harm_keywords: [String]
  title: String
  date_published_unset: Boolean
  date_downloaded: String
  similarity_inc: Float
  plain_text_unset: Boolean
  embedding_unset: Boolean
  authors: [String]
  matching_harm_keywords_unset: Boolean
  _id_unset: Boolean
  title_unset: Boolean
  language_unset: Boolean
  plain_text: String
  date_downloaded_unset: Boolean
  classification_similarity_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  text: String
  match: Boolean
  image_url_unset: Boolean
  _id: ObjectId
  date_published: String
  matching_entities: [String]
  epoch_date_downloaded_inc: Int
  url: String
}

input PromoteSubmissionToReportInput {
  incident_ids: [Int]
  is_incident_report: Boolean
  submission_id: ObjectId
}

input SubscriptionEntityIdRelationInput {
  create: EntityInsertInput
  link: String
}

input ReportEmbeddingQueryInput {
  from_text_hash_gt: String
  from_text_hash_gte: String
  from_text_hash_in: [String]
  vector_exists: Boolean
  from_text_hash_lte: String
  from_text_hash_ne: String
  AND: [ReportEmbeddingQueryInput!]
  from_text_hash_exists: Boolean
  vector_nin: [Float]
  OR: [ReportEmbeddingQueryInput!]
  from_text_hash: String
  from_text_hash_nin: [String]
  from_text_hash_lt: String
  vector: [Float]
  vector_in: [Float]
}

input SubscriptionQueryInput {
  _id: ObjectId
  _id_lte: ObjectId
  _id_ne: ObjectId
  type_ne: String
  type_lt: String
  _id_gte: ObjectId
  entityId_exists: Boolean
  userId_exists: Boolean
  _id_gt: ObjectId
  _id_nin: [ObjectId]
  type: String
  entityId: EntityQueryInput
  incident_id: IncidentQueryInput
  _id_exists: Boolean
  type_gte: String
  type_lte: String
  _id_lt: ObjectId
  incident_id_exists: Boolean
  type_gt: String
  _id_in: [ObjectId]
  userId: UserQueryInput
  type_exists: Boolean
  OR: [SubscriptionQueryInput!]
  type_in: [String]
  type_nin: [String]
  AND: [SubscriptionQueryInput!]
}

input History_incidentEmbeddingQueryInput {
  vector_in: [Float]
  OR: [History_incidentEmbeddingQueryInput!]
  from_reports: [Int]
  from_reports_exists: Boolean
  vector_exists: Boolean
  AND: [History_incidentEmbeddingQueryInput!]
  vector: [Float]
  from_reports_in: [Int]
  vector_nin: [Float]
  from_reports_nin: [Int]
}

type History_incidentTsne {
  x: Float
  y: Float
}

type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input CandidateInsertInput {
  authors: [String]
  matching_harm_keywords: [String]
  _id: ObjectId
  matching_entities: [String]
  title: String
  source_domain: String
  dismissed: Boolean
  image_url: String
  url: String!
  match: Boolean!
  language: String
  plain_text: String
  similarity: Float
  date_published: String
  classification_similarity: [CandidateClassification_similarityInsertInput]
  epoch_date_published: Int
  date_downloaded: String
  text: String
  epoch_date_downloaded: Int
  matching_keywords: [String]
  embedding: CandidateEmbeddingInsertInput
}

input DuplicateInsertInput {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input History_incidentInsertInput {
  tsne: History_incidentTsneInsertInput
  embedding: History_incidentEmbeddingInsertInput
  flagged_dissimilar_incidents: [Int]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  AllegedHarmedOrNearlyHarmedParties: [String]
  AllegedDeveloperOfAISystem: [String]
  editor_similar_incidents: [Int]
  incident_id: Int!
  editor_notes: String
  description: String
  editors: [String]!
  AllegedDeployerOfAISystem: [String]
  _id: ObjectId
  title: String!
  editor_dissimilar_incidents: [Int]
  epoch_date_modified: Int
  modifiedBy: String
  reports: [Int]!
  date: String!
}
`;
