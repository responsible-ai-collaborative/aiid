import gql from "graphql-tag";

export default gql`
type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}
type TaxaDummy_field {
  field_number: String
  short_name: String
}
input IncidentReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}
enum CandidateSortByInput {
  PLAIN_TEXT_DESC
  TITLE_ASC
  TITLE_DESC
  URL_ASC
  _ID_DESC
  DATE_DOWNLOADED_ASC
  DATE_PUBLISHED_ASC
  PLAIN_TEXT_ASC
  TEXT_DESC
  URL_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_DESC
  SOURCE_DOMAIN_ASC
  SIMILARITY_ASC
  SOURCE_DOMAIN_DESC
  TEXT_ASC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  IMAGE_URL_ASC
  LANGUAGE_DESC
  SIMILARITY_DESC
  _ID_ASC
  DATE_DOWNLOADED_DESC
  IMAGE_URL_DESC
  LANGUAGE_ASC
}
input IncidentEmbeddingQueryInput {
  from_reports_in: [Int]
  vector: [Float]
  vector_exists: Boolean
  OR: [IncidentEmbeddingQueryInput!]
  from_reports: [Int]
  vector_in: [Float]
  vector_nin: [Float]
  from_reports_nin: [Int]
  from_reports_exists: Boolean
  AND: [IncidentEmbeddingQueryInput!]
}
type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}
type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}
type History_incidentTsne {
  x: Float
  y: Float
}
input SubmissionIncident_editorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}
type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}
input TaxaField_listItem_fieldInsertInput {
  short_description: String
  short_name: String
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
  field_number: String
  mongo_type: String
  placeholder: String
  permitted_values: [String]
  instant_facet: Boolean
  long_description: String
  weight: Int
  public: Boolean
  long_name: String
  default: String
  display_type: String
  required: Boolean
}
type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
}
input ChecklistRiskUpdateInput {
  id_unset: Boolean
  risk_notes_unset: Boolean
  generated: Boolean
  tags_unset: Boolean
  title_unset: Boolean
  title: String
  severity: String
  precedents_unset: Boolean
  severity_unset: Boolean
  touched_unset: Boolean
  precedents: [ChecklistRiskPrecedentUpdateInput]
  generated_unset: Boolean
  touched: Boolean
  likelihood_unset: Boolean
  risk_status_unset: Boolean
  risk_status: String
  tags: [String]
  id: String
  likelihood: String
  risk_notes: String
}
input CreateDefaultAdminUserInput {
  email: String
  password: String
}
input TaxaField_listItem_fieldComplete_fromUpdateInput {
  current: [String]
  current_unset: Boolean
  entities: Boolean
  entities_unset: Boolean
  all: [String]
  all_unset: Boolean
}
input TaxaField_listItem_fieldComplete_fromInsertInput {
  all: [String]
  current: [String]
  entities: Boolean
}
input History_incidentQueryInput {
  title_exists: Boolean
  AllegedDeveloperOfAISystem_in: [String]
  AllegedDeployerOfAISystem_nin: [String]
  epoch_date_modified: Int
  title_gte: String
  flagged_dissimilar_incidents_exists: Boolean
  _id_nin: [ObjectId]
  AllegedDeployerOfAISystem_exists: Boolean
  reports: [Int]
  editors_exists: Boolean
  modifiedBy_exists: Boolean
  description_lt: String
  implicated_systems: [String]
  editor_similar_incidents_in: [Int]
  date_lte: String
  embedding: History_incidentEmbeddingQueryInput
  title_lt: String
  tsne_exists: Boolean
  description_in: [String]
  editor_notes_nin: [String]
  editor_notes_gte: String
  incident_id_nin: [Int]
  epoch_date_modified_lt: Int
  modifiedBy_lt: String
  flagged_dissimilar_incidents_nin: [Int]
  epoch_date_modified_exists: Boolean
  _id_lt: ObjectId
  title: String
  editors: [String]
  title_nin: [String]
  date_nin: [String]
  epoch_date_modified_gte: Int
  incident_id_gt: Int
  AllegedDeployerOfAISystem: [String]
  AND: [History_incidentQueryInput!]
  editor_notes: String
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  title_gt: String
  implicated_systems_in: [String]
  modifiedBy_in: [String]
  AllegedDeveloperOfAISystem: [String]
  editors_nin: [String]
  AllegedHarmedOrNearlyHarmedParties: [String]
  description_lte: String
  epoch_date_modified_gt: Int
  editor_notes_lte: String
  modifiedBy_ne: String
  nlp_similar_incidents_exists: Boolean
  incident_id_exists: Boolean
  editor_notes_ne: String
  AllegedDeployerOfAISystem_in: [String]
  editor_similar_incidents: [Int]
  date_gt: String
  incident_id_lte: Int
  flagged_dissimilar_incidents_in: [Int]
  title_lte: String
  date_gte: String
  date: String
  editor_notes_in: [String]
  embedding_exists: Boolean
  flagged_dissimilar_incidents: [Int]
  title_in: [String]
  implicated_systems_exists: Boolean
  AllegedDeveloperOfAISystem_nin: [String]
  modifiedBy_nin: [String]
  title_ne: String
  _id_in: [ObjectId]
  epoch_date_modified_nin: [Int]
  description: String
  reports_nin: [Int]
  incident_id: Int
  _id_lte: ObjectId
  incident_id_lt: Int
  date_in: [String]
  editors_in: [String]
  description_gt: String
  editor_similar_incidents_exists: Boolean
  modifiedBy_gt: String
  _id: ObjectId
  reports_exists: Boolean
  incident_id_in: [Int]
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  date_ne: String
  editor_dissimilar_incidents_in: [Int]
  epoch_date_modified_lte: Int
  editor_dissimilar_incidents_exists: Boolean
  reports_in: [Int]
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  epoch_date_modified_ne: Int
  _id_gt: ObjectId
  editor_similar_incidents_nin: [Int]
  incident_id_ne: Int
  description_gte: String
  implicated_systems_nin: [String]
  _id_exists: Boolean
  tsne: History_incidentTsneQueryInput
  editor_notes_lt: String
  modifiedBy_lte: String
  editor_dissimilar_incidents_nin: [Int]
  epoch_date_modified_in: [Int]
  _id_ne: ObjectId
  date_lt: String
  modifiedBy: String
  incident_id_gte: Int
  editor_notes_exists: Boolean
  _id_gte: ObjectId
  description_nin: [String]
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  description_ne: String
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  editor_notes_gt: String
  OR: [History_incidentQueryInput!]
  editor_dissimilar_incidents: [Int]
  description_exists: Boolean
  AllegedDeveloperOfAISystem_exists: Boolean
  modifiedBy_gte: String
  date_exists: Boolean
}
input History_incidentTsneInsertInput {
  x: Float
  y: Float
}
input TaxaUpdateInput {
  dummy_fields_unset: Boolean
  weight: Int
  description_unset: Boolean
  field_list: [TaxaField_listUpdateInput]
  complete_entities_unset: Boolean
  namespace: String
  weight_unset: Boolean
  field_list_unset: Boolean
  namespace_unset: Boolean
  description: String
  _id_unset: Boolean
  _id: ObjectId
  complete_entities: Boolean
  dummy_fields: [TaxaDummy_fieldUpdateInput]
  weight_inc: Int
}
input TaxaField_listComplete_fromQueryInput {
  current_nin: [String]
  OR: [TaxaField_listComplete_fromQueryInput!]
  current_exists: Boolean
  all_exists: Boolean
  current: [String]
  all: [String]
  all_in: [String]
  AND: [TaxaField_listComplete_fromQueryInput!]
  all_nin: [String]
  current_in: [String]
}
input ClassificationAttributeQueryInput {
  short_name_exists: Boolean
  short_name_lt: String
  value_json_gte: String
  short_name_gt: String
  value_json_nin: [String]
  value_json_ne: String
  value_json_lte: String
  short_name: String
  value_json_exists: Boolean
  OR: [ClassificationAttributeQueryInput!]
  short_name_ne: String
  value_json: String
  short_name_in: [String]
  short_name_nin: [String]
  short_name_lte: String
  short_name_gte: String
  value_json_in: [String]
  AND: [ClassificationAttributeQueryInput!]
  value_json_lt: String
  value_json_gt: String
}
type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}
input IncidentAllegedDeveloperOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
input SubmissionNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}
input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}
input ChecklistRiskPrecedentUpdateInput {
  tags_unset: Boolean
  title_unset: Boolean
  description_unset: Boolean
  incident_id: Int
  tags: [String]
  title: String
  description: String
  incident_id_inc: Int
  incident_id_unset: Boolean
}
type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
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
input TaxaField_listComplete_fromUpdateInput {
  current_unset: Boolean
  all: [String]
  all_unset: Boolean
  current: [String]
}
type LogIncidentHistoryPayload {
  incident_id: Int
}
type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}
input ReportUserRelationInput {
  create: UserInsertInput
  link: String
}
input IncidentInsertInput {
  editor_notes: String
  editor_dissimilar_incidents: [Int]
  title: String!
  editor_similar_incidents: [Int]
  reports: IncidentReportsRelationInput!
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  embedding: IncidentEmbeddingInsertInput
  editors: IncidentEditorsRelationInput!
  _id: ObjectId
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  epoch_date_modified: Int
  flagged_dissimilar_incidents: [Int]
  implicated_systems: IncidentImplicated_systemsRelationInput
  tsne: IncidentTsneInsertInput
  date: String!
  incident_id: Int!
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  description: String
}
input IncidentTsneInsertInput {
  x: Float
  y: Float
}
input IncidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}
input SubmissionEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}
input History_reportInsertInput {
  language: String!
  tags: [String]!
  plain_text: String!
  authors: [String]!
  is_incident_report: Boolean
  image_url: String!
  title: String!
  user: String
  cloudinary_id: String!
  embedding: History_reportEmbeddingInsertInput
  date_modified: DateTime!
  epoch_date_downloaded: Int!
  description: String
  epoch_date_published: Int!
  _id: ObjectId
  source_domain: String!
  editor_notes: String
  text: String!
  url: String!
  modifiedBy: String
  epoch_date_submitted: Int!
  inputs_outputs: [String]
  flag: Boolean
  date_downloaded: DateTime!
  date_submitted: DateTime!
  report_number: Int!
  epoch_date_modified: Int!
  quiet: Boolean
  submitters: [String]!
  date_published: DateTime!
}
type User {
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}
input History_incidentNlp_similar_incidentUpdateInput {
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
}
input ReportEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
}
enum ClassificationSortByInput {
  _ID_DESC
  NAMESPACE_ASC
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
  _ID_ASC
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
input IncidentEditorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}
input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
input CandidateClassification_similarityUpdateInput {
  classification: String
  classification_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}
input TaxaDummy_fieldInsertInput {
  field_number: String
  short_name: String
}
input History_reportUpdateInput {
  plain_text: String
  title_unset: Boolean
  editor_notes_unset: Boolean
  cloudinary_id_unset: Boolean
  user: String
  inputs_outputs: [String]
  date_submitted: DateTime
  image_url: String
  submitters_unset: Boolean
  image_url_unset: Boolean
  authors_unset: Boolean
  epoch_date_submitted_inc: Int
  plain_text_unset: Boolean
  quiet: Boolean
  text_unset: Boolean
  date_downloaded: DateTime
  epoch_date_modified_unset: Boolean
  flag_unset: Boolean
  _id_unset: Boolean
  epoch_date_submitted_unset: Boolean
  inputs_outputs_unset: Boolean
  report_number_inc: Int
  description: String
  date_downloaded_unset: Boolean
  tags: [String]
  is_incident_report: Boolean
  tags_unset: Boolean
  description_unset: Boolean
  editor_notes: String
  embedding_unset: Boolean
  text: String
  url: String
  date_published_unset: Boolean
  date_modified: DateTime
  epoch_date_downloaded: Int
  modifiedBy_unset: Boolean
  is_incident_report_unset: Boolean
  report_number: Int
  language_unset: Boolean
  embedding: History_reportEmbeddingUpdateInput
  epoch_date_published_unset: Boolean
  epoch_date_modified_inc: Int
  epoch_date_downloaded_unset: Boolean
  _id: ObjectId
  date_submitted_unset: Boolean
  date_modified_unset: Boolean
  source_domain: String
  language: String
  quiet_unset: Boolean
  url_unset: Boolean
  report_number_unset: Boolean
  submitters: [String]
  user_unset: Boolean
  title: String
  epoch_date_published: Int
  cloudinary_id: String
  date_published: DateTime
  flag: Boolean
  authors: [String]
  epoch_date_modified: Int
  modifiedBy: String
  epoch_date_downloaded_inc: Int
  epoch_date_published_inc: Int
  epoch_date_submitted: Int
  source_domain_unset: Boolean
}
type IncidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}
input SubmissionNlp_similar_incidentUpdateInput {
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
}
input UserQueryInput {
  OR: [UserQueryInput!]
  userId_lt: String
  _id_lt: ObjectId
  _id_in: [ObjectId]
  first_name_lte: String
  _id_gte: ObjectId
  first_name_lt: String
  roles_exists: Boolean
  AND: [UserQueryInput!]
  last_name_lte: String
  _id: ObjectId
  userId_lte: String
  last_name_nin: [String]
  _id_lte: ObjectId
  first_name_in: [String]
  last_name_exists: Boolean
  userId_gt: String
  last_name_ne: String
  last_name: String
  roles: [String]
  userId_nin: [String]
  roles_in: [String]
  first_name_nin: [String]
  last_name_gte: String
  userId_ne: String
  _id_gt: ObjectId
  first_name_exists: Boolean
  last_name_lt: String
  userId_exists: Boolean
  userId_in: [String]
  last_name_gt: String
  first_name_ne: String
  last_name_in: [String]
  _id_ne: ObjectId
  userId_gte: String
  first_name: String
  first_name_gte: String
  _id_nin: [ObjectId]
  first_name_gt: String
  userId: String
  roles_nin: [String]
  _id_exists: Boolean
}
input IncidentQueryInput {
  incident_id_lt: Int
  implicated_systems_in: [EntityQueryInput]
  title_exists: Boolean
  description_ne: String
  description_nin: [String]
  editor_dissimilar_incidents: [Int]
  editors_nin: [UserQueryInput]
  AllegedDeployerOfAISystem: [EntityQueryInput]
  epoch_date_modified_ne: Int
  AllegedDeployerOfAISystem_exists: Boolean
  title: String
  editor_notes_lte: String
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  description_gt: String
  title_gt: String
  tsne_exists: Boolean
  epoch_date_modified_lt: Int
  editor_notes_in: [String]
  incident_id_exists: Boolean
  editor_notes_lt: String
  title_ne: String
  flagged_dissimilar_incidents_in: [Int]
  incident_id_nin: [Int]
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  _id: ObjectId
  editor_notes_ne: String
  description_in: [String]
  reports_exists: Boolean
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  _id_nin: [ObjectId]
  editor_similar_incidents_in: [Int]
  date: String
  editors_in: [UserQueryInput]
  incident_id: Int
  incident_id_gt: Int
  implicated_systems_exists: Boolean
  editor_dissimilar_incidents_in: [Int]
  epoch_date_modified_gte: Int
  editor_notes_nin: [String]
  editor_similar_incidents: [Int]
  embedding_exists: Boolean
  reports: [ReportQueryInput]
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  incident_id_gte: Int
  editor_notes_gte: String
  editor_dissimilar_incidents_nin: [Int]
  epoch_date_modified_nin: [Int]
  epoch_date_modified_in: [Int]
  nlp_similar_incidents_exists: Boolean
  flagged_dissimilar_incidents_exists: Boolean
  editor_similar_incidents_exists: Boolean
  title_lte: String
  flagged_dissimilar_incidents_nin: [Int]
  editor_dissimilar_incidents_exists: Boolean
  date_gte: String
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  date_lte: String
  title_lt: String
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  AllegedDeveloperOfAISystem_exists: Boolean
  editor_similar_incidents_nin: [Int]
  _id_in: [ObjectId]
  _id_lt: ObjectId
  date_in: [String]
  tsne: IncidentTsneQueryInput
  _id_gt: ObjectId
  implicated_systems: [EntityQueryInput]
  incident_id_ne: Int
  title_in: [String]
  _id_exists: Boolean
  description_lte: String
  flagged_dissimilar_incidents: [Int]
  epoch_date_modified: Int
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  _id_lte: ObjectId
  epoch_date_modified_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  AND: [IncidentQueryInput!]
  editor_notes_exists: Boolean
  date_ne: String
  date_lt: String
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  epoch_date_modified_gt: Int
  title_nin: [String]
  date_exists: Boolean
  reports_in: [ReportQueryInput]
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  _id_gte: ObjectId
  description_lt: String
  _id_ne: ObjectId
  date_nin: [String]
  incident_id_lte: Int
  incident_id_in: [Int]
  epoch_date_modified_lte: Int
  description: String
  reports_nin: [ReportQueryInput]
  editor_notes_gt: String
  implicated_systems_nin: [EntityQueryInput]
  editors_exists: Boolean
  description_gte: String
  title_gte: String
  description_exists: Boolean
  editor_notes: String
  OR: [IncidentQueryInput!]
  embedding: IncidentEmbeddingQueryInput
  date_gt: String
  editors: [UserQueryInput]
}
type ClassificationAttribute {
  short_name: String
  value_json: String
}
input SubmissionNlp_similar_incidentQueryInput {
  similarity_lt: Float
  similarity: Float
  similarity_lte: Float
  incident_id_gte: Int
  incident_id_in: [Int]
  similarity_exists: Boolean
  incident_id: Int
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_lte: Int
  incident_id_exists: Boolean
  similarity_in: [Float]
  similarity_ne: Float
  similarity_gte: Float
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_nin: [Int]
  similarity_nin: [Float]
  similarity_gt: Float
  incident_id_gt: Int
  incident_id_lt: Int
  incident_id_ne: Int
}
input QuickaddQueryInput {
  _id_ne: ObjectId
  _id_lt: ObjectId
  incident_id_in: [Long]
  _id_exists: Boolean
  incident_id_ne: Long
  source_domain_nin: [String]
  AND: [QuickaddQueryInput!]
  url_ne: String
  date_submitted_ne: String
  date_submitted_lte: String
  source_domain_gt: String
  incident_id_gt: Long
  date_submitted_gte: String
  _id_in: [ObjectId]
  _id_gt: ObjectId
  url_nin: [String]
  incident_id_exists: Boolean
  url_lt: String
  source_domain_lte: String
  _id_lte: ObjectId
  incident_id_lte: Long
  url_gte: String
  url_exists: Boolean
  url_in: [String]
  source_domain_ne: String
  date_submitted_exists: Boolean
  incident_id: Long
  incident_id_lt: Long
  date_submitted_gt: String
  date_submitted_lt: String
  incident_id_nin: [Long]
  incident_id_gte: Long
  source_domain_in: [String]
  _id: ObjectId
  url_gt: String
  url: String
  source_domain_gte: String
  date_submitted: String
  source_domain_lt: String
  date_submitted_nin: [String]
  date_submitted_in: [String]
  url_lte: String
  source_domain_exists: Boolean
  _id_nin: [ObjectId]
  OR: [QuickaddQueryInput!]
  source_domain: String
  _id_gte: ObjectId
}
scalar Long
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
type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}
input ClassificationInsertInput {
  publish: Boolean
  reports: ClassificationReportsRelationInput!
  _id: ObjectId
  attributes: [ClassificationAttributeInsertInput]
  incidents: ClassificationIncidentsRelationInput!
  namespace: String!
  notes: String
}
enum History_reportSortByInput {
  USER_ASC
  CLOUDINARY_ID_ASC
  LANGUAGE_DESC
  MODIFIEDBY_DESC
  EDITOR_NOTES_ASC
  PLAIN_TEXT_DESC
  SOURCE_DOMAIN_ASC
  IMAGE_URL_DESC
  LANGUAGE_ASC
  PLAIN_TEXT_ASC
  USER_DESC
  CLOUDINARY_ID_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_DESC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  MODIFIEDBY_ASC
  DATE_DOWNLOADED_ASC
  DATE_DOWNLOADED_DESC
  DATE_SUBMITTED_DESC
  REPORT_NUMBER_DESC
  TEXT_DESC
  URL_DESC
  DATE_PUBLISHED_DESC
  DESCRIPTION_ASC
  EPOCH_DATE_SUBMITTED_DESC
  DATE_SUBMITTED_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  URL_ASC
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  DATE_PUBLISHED_ASC
  DESCRIPTION_DESC
  IMAGE_URL_ASC
  REPORT_NUMBER_ASC
  SOURCE_DOMAIN_DESC
  TEXT_ASC
  TITLE_ASC
  TITLE_DESC
  _ID_ASC
  _ID_DESC
  EPOCH_DATE_PUBLISHED_ASC
}
input CandidateEmbeddingQueryInput {
  from_text_hash_gt: String
  vector: [Float]
  from_text_hash: String
  vector_nin: [Float]
  vector_exists: Boolean
  from_text_hash_lt: String
  from_text_hash_in: [String]
  from_text_hash_exists: Boolean
  AND: [CandidateEmbeddingQueryInput!]
  from_text_hash_ne: String
  vector_in: [Float]
  from_text_hash_gte: String
  OR: [CandidateEmbeddingQueryInput!]
  from_text_hash_lte: String
  from_text_hash_nin: [String]
}
input ReportQueryInput {
  date_submitted_gte: DateTime
  date_downloaded_nin: [DateTime]
  epoch_date_published: Int
  epoch_date_submitted_lt: Int
  source_domain_in: [String]
  text_gt: String
  epoch_date_downloaded_gte: Int
  language_nin: [String]
  epoch_date_published_nin: [Int]
  title_lte: String
  date_downloaded_gte: DateTime
  date_published_gt: DateTime
  tags_exists: Boolean
  epoch_date_downloaded_nin: [Int]
  authors: [String]
  epoch_date_published_gte: Int
  epoch_date_modified_nin: [Int]
  flag_exists: Boolean
  epoch_date_submitted_ne: Int
  cloudinary_id_nin: [String]
  epoch_date_published_in: [Int]
  report_number_ne: Int
  submitters_in: [String]
  user: UserQueryInput
  _id_gte: ObjectId
  date_submitted_ne: DateTime
  title_lt: String
  description_nin: [String]
  date_published_lte: DateTime
  date_submitted_lt: DateTime
  flag: Boolean
  source_domain_gt: String
  AND: [ReportQueryInput!]
  report_number_lte: Int
  date_downloaded: DateTime
  plain_text_gt: String
  epoch_date_submitted_exists: Boolean
  quiet: Boolean
  language_lte: String
  image_url_nin: [String]
  url: String
  url_nin: [String]
  inputs_outputs_nin: [String]
  text: String
  image_url_in: [String]
  submitters_nin: [String]
  date_modified_ne: DateTime
  editor_notes_in: [String]
  _id_lt: ObjectId
  text_exists: Boolean
  epoch_date_submitted_in: [Int]
  date_published_lt: DateTime
  url_gt: String
  inputs_outputs: [String]
  plain_text_ne: String
  url_gte: String
  date_modified_nin: [DateTime]
  source_domain_lte: String
  editor_notes_gt: String
  date_published_gte: DateTime
  date_submitted_in: [DateTime]
  epoch_date_published_lt: Int
  date_submitted_gt: DateTime
  editor_notes_gte: String
  is_incident_report_exists: Boolean
  authors_exists: Boolean
  cloudinary_id_lt: String
  epoch_date_submitted_gt: Int
  image_url_lt: String
  authors_in: [String]
  text_lte: String
  epoch_date_submitted_nin: [Int]
  date_modified_exists: Boolean
  date_modified_gte: DateTime
  title_exists: Boolean
  cloudinary_id_lte: String
  _id: ObjectId
  authors_nin: [String]
  inputs_outputs_exists: Boolean
  description: String
  date_submitted: DateTime
  language_lt: String
  text_nin: [String]
  language_in: [String]
  title_in: [String]
  date_submitted_nin: [DateTime]
  source_domain_exists: Boolean
  date_published_exists: Boolean
  epoch_date_modified_gte: Int
  description_lt: String
  text_gte: String
  OR: [ReportQueryInput!]
  epoch_date_published_exists: Boolean
  date_published_in: [DateTime]
  cloudinary_id_ne: String
  editor_notes_exists: Boolean
  image_url_gte: String
  inputs_outputs_in: [String]
  plain_text_gte: String
  epoch_date_modified_lte: Int
  epoch_date_modified_lt: Int
  editor_notes_lte: String
  date_downloaded_gt: DateTime
  url_in: [String]
  epoch_date_downloaded_exists: Boolean
  epoch_date_modified_ne: Int
  plain_text_exists: Boolean
  report_number_gte: Int
  tags: [String]
  date_modified_gt: DateTime
  epoch_date_submitted_gte: Int
  title_ne: String
  date_modified_lt: DateTime
  image_url_exists: Boolean
  epoch_date_downloaded_gt: Int
  epoch_date_modified_exists: Boolean
  quiet_exists: Boolean
  title_gt: String
  editor_notes_lt: String
  user_exists: Boolean
  description_ne: String
  language_gt: String
  date_downloaded_ne: DateTime
  _id_ne: ObjectId
  _id_in: [ObjectId]
  language_gte: String
  report_number: Int
  source_domain_nin: [String]
  editor_notes_ne: String
  tags_nin: [String]
  _id_lte: ObjectId
  url_exists: Boolean
  description_lte: String
  language: String
  plain_text_lte: String
  text_in: [String]
  quiet_ne: Boolean
  _id_gt: ObjectId
  description_gte: String
  description_gt: String
  date_modified_in: [DateTime]
  date_downloaded_lt: DateTime
  embedding: ReportEmbeddingQueryInput
  submitters_exists: Boolean
  report_number_lt: Int
  flag_ne: Boolean
  epoch_date_downloaded_lt: Int
  report_number_in: [Int]
  url_ne: String
  source_domain_gte: String
  plain_text_in: [String]
  url_lte: String
  text_lt: String
  date_submitted_exists: Boolean
  url_lt: String
  date_published_nin: [DateTime]
  language_exists: Boolean
  title_gte: String
  image_url: String
  epoch_date_downloaded_in: [Int]
  report_number_exists: Boolean
  epoch_date_published_ne: Int
  date_downloaded_exists: Boolean
  cloudinary_id: String
  source_domain: String
  editor_notes: String
  epoch_date_downloaded_ne: Int
  plain_text_lt: String
  epoch_date_downloaded: Int
  image_url_gt: String
  _id_nin: [ObjectId]
  date_modified: DateTime
  is_incident_report: Boolean
  report_number_nin: [Int]
  epoch_date_submitted: Int
  source_domain_lt: String
  editor_notes_nin: [String]
  image_url_lte: String
  plain_text: String
  cloudinary_id_in: [String]
  language_ne: String
  date_published: DateTime
  tags_in: [String]
  date_submitted_lte: DateTime
  epoch_date_published_gt: Int
  image_url_ne: String
  source_domain_ne: String
  epoch_date_modified: Int
  title: String
  cloudinary_id_gte: String
  date_modified_lte: DateTime
  plain_text_nin: [String]
  date_downloaded_lte: DateTime
  text_ne: String
  embedding_exists: Boolean
  title_nin: [String]
  cloudinary_id_gt: String
  description_exists: Boolean
  description_in: [String]
  epoch_date_modified_gt: Int
  epoch_date_submitted_lte: Int
  submitters: [String]
  is_incident_report_ne: Boolean
  epoch_date_published_lte: Int
  cloudinary_id_exists: Boolean
  date_published_ne: DateTime
  date_downloaded_in: [DateTime]
  report_number_gt: Int
  _id_exists: Boolean
  epoch_date_downloaded_lte: Int
  epoch_date_modified_in: [Int]
}
enum ChecklistSortByInput {
  _ID_ASC
  DATE_UPDATED_DESC
  ID_DESC
  NAME_ASC
  _ID_DESC
  ABOUT_ASC
  DATE_CREATED_ASC
  ENTITY_ID_ASC
  NAME_DESC
  OWNER_ID_ASC
  DATE_UPDATED_ASC
  ID_ASC
  ABOUT_DESC
  DATE_CREATED_DESC
  ENTITY_ID_DESC
  OWNER_ID_DESC
}
type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}
input History_incidentNlp_similar_incidentInsertInput {
  similarity: Float
  incident_id: Int
}
input ChecklistRiskQueryInput {
  title_gte: String
  likelihood_gt: String
  title_lte: String
  title_in: [String]
  touched: Boolean
  risk_notes_nin: [String]
  severity_nin: [String]
  title_ne: String
  title_exists: Boolean
  risk_status_in: [String]
  severity_gte: String
  precedents_exists: Boolean
  tags_nin: [String]
  risk_notes_lte: String
  likelihood_lt: String
  title_gt: String
  risk_notes: String
  severity_lt: String
  risk_status_lte: String
  risk_status_gte: String
  risk_status: String
  risk_notes_gt: String
  risk_status_exists: Boolean
  id_lt: String
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  touched_ne: Boolean
  likelihood_nin: [String]
  touched_exists: Boolean
  id_gt: String
  risk_status_ne: String
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  likelihood_gte: String
  AND: [ChecklistRiskQueryInput!]
  id_in: [String]
  id_ne: String
  title: String
  risk_status_nin: [String]
  likelihood_ne: String
  risk_notes_lt: String
  severity_lte: String
  risk_status_gt: String
  id_lte: String
  risk_notes_gte: String
  risk_notes_ne: String
  tags_in: [String]
  tags: [String]
  likelihood: String
  generated: Boolean
  OR: [ChecklistRiskQueryInput!]
  precedents: [ChecklistRiskPrecedentQueryInput]
  likelihood_exists: Boolean
  risk_notes_in: [String]
  risk_notes_exists: Boolean
  id_nin: [String]
  likelihood_in: [String]
  severity_in: [String]
  id: String
  id_gte: String
  likelihood_lte: String
  id_exists: Boolean
  severity_gt: String
  title_nin: [String]
  risk_status_lt: String
  title_lt: String
  generated_ne: Boolean
  generated_exists: Boolean
  severity: String
  severity_ne: String
  tags_exists: Boolean
  severity_exists: Boolean
}
input ClassificationAttributeInsertInput {
  value_json: String
  short_name: String
}
input IncidentImplicated_systemsRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
input SubmissionHarmed_partiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
input QuickaddInsertInput {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}
input UserInsertInput {
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}
type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}
enum DuplicateSortByInput {
  TRUE_INCIDENT_NUMBER_DESC
  _ID_ASC
  _ID_DESC
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
}
input IncidentUpdateInput {
  incident_id_inc: Int
  nlp_similar_incidents_unset: Boolean
  implicated_systems: IncidentImplicated_systemsRelationInput
  date: String
  embedding_unset: Boolean
  title_unset: Boolean
  editor_notes: String
  reports: IncidentReportsRelationInput
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  editor_dissimilar_incidents: [Int]
  editors_unset: Boolean
  title: String
  AllegedDeployerOfAISystem_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  embedding: IncidentEmbeddingUpdateInput
  AllegedDeveloperOfAISystem_unset: Boolean
  tsne_unset: Boolean
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  date_unset: Boolean
  editor_similar_incidents_unset: Boolean
  reports_unset: Boolean
  _id: ObjectId
  description_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  editor_notes_unset: Boolean
  incident_id_unset: Boolean
  _id_unset: Boolean
  implicated_systems_unset: Boolean
  tsne: IncidentTsneUpdateInput
  epoch_date_modified_unset: Boolean
  incident_id: Int
  editor_dissimilar_incidents_unset: Boolean
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  epoch_date_modified: Int
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  epoch_date_modified_inc: Int
  editor_similar_incidents: [Int]
  description: String
  editors: IncidentEditorsRelationInput
}
input TaxaDummy_fieldUpdateInput {
  short_name: String
  short_name_unset: Boolean
  field_number: String
  field_number_unset: Boolean
}
input QuickaddUpdateInput {
  url: String
  _id_unset: Boolean
  source_domain: String
  source_domain_unset: Boolean
  incident_id_unset: Boolean
  _id: ObjectId
  date_submitted: String
  date_submitted_unset: Boolean
  incident_id: Long
  url_unset: Boolean
}
input ChecklistRiskInsertInput {
  precedents: [ChecklistRiskPrecedentInsertInput]
  severity: String
  tags: [String]
  title: String
  generated: Boolean
  risk_notes: String
  likelihood: String
  id: String
  touched: Boolean
  risk_status: String
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
  replaceOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  replaceOneTaxa(data: TaxaInsertInput!, query: TaxaQueryInput): Taxa
  replaceOneUser(query: UserQueryInput, data: UserInsertInput!): User
  updateManyCandidates(query: CandidateQueryInput, set: CandidateUpdateInput!): UpdateManyPayload
  updateManyChecklists(query: ChecklistQueryInput, set: ChecklistUpdateInput!): UpdateManyPayload
  updateManyClassifications(query: ClassificationQueryInput, set: ClassificationUpdateInput!): UpdateManyPayload
  updateManyDuplicates(set: DuplicateUpdateInput!, query: DuplicateQueryInput): UpdateManyPayload
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
  updateManyUsers(set: UserUpdateInput!, query: UserQueryInput): UpdateManyPayload
  updateOneCandidate(query: CandidateQueryInput, set: CandidateUpdateInput!): Candidate
  updateOneChecklist(query: ChecklistQueryInput, set: ChecklistUpdateInput!): Checklist
  updateOneClassification(query: ClassificationQueryInput, set: ClassificationUpdateInput!): Classification
  updateOneDuplicate(query: DuplicateQueryInput, set: DuplicateUpdateInput!): Duplicate
  updateOneEntity(set: EntityUpdateInput!, query: EntityQueryInput): Entity
  updateOneHistory_incident(query: History_incidentQueryInput, set: History_incidentUpdateInput!): History_incident
  updateOneHistory_report(set: History_reportUpdateInput!, query: History_reportQueryInput): History_report
  updateOneIncident(query: IncidentQueryInput, set: IncidentUpdateInput!): Incident
  updateOneNotification(query: NotificationQueryInput, set: NotificationUpdateInput!): Notification
  updateOneQuickadd(query: QuickaddQueryInput, set: QuickaddUpdateInput!): Quickadd
  updateOneReport(query: ReportQueryInput, set: ReportUpdateInput!): Report
  updateOneSubmission(query: SubmissionQueryInput, set: SubmissionUpdateInput!): Submission
  updateOneSubscription(query: SubscriptionQueryInput, set: SubscriptionUpdateInput!): Subscription
  updateOneTaxa(query: TaxaQueryInput, set: TaxaUpdateInput!): Taxa
  updateOneUser(query: UserQueryInput, set: UserUpdateInput!): User
  upsertOneCandidate(query: CandidateQueryInput, data: CandidateInsertInput!): Candidate
  upsertOneChecklist(query: ChecklistQueryInput, data: ChecklistInsertInput!): Checklist
  upsertOneClassification(query: ClassificationQueryInput, data: ClassificationInsertInput!): Classification
  upsertOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  upsertOneEntity(data: EntityInsertInput!, query: EntityQueryInput): Entity
  upsertOneHistory_incident(data: History_incidentInsertInput!, query: History_incidentQueryInput): History_incident
  upsertOneHistory_report(data: History_reportInsertInput!, query: History_reportQueryInput): History_report
  upsertOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  upsertOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
  upsertOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  upsertOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  upsertOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  upsertOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  upsertOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
}
scalar ObjectId
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
type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}
input History_incidentEmbeddingQueryInput {
  from_reports: [Int]
  from_reports_in: [Int]
  from_reports_nin: [Int]
  vector_in: [Float]
  AND: [History_incidentEmbeddingQueryInput!]
  OR: [History_incidentEmbeddingQueryInput!]
  vector_exists: Boolean
  from_reports_exists: Boolean
  vector: [Float]
  vector_nin: [Float]
}
input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
input DuplicateUpdateInput {
  duplicate_incident_number: Int
  duplicate_incident_number_inc: Int
  duplicate_incident_number_unset: Boolean
  true_incident_number: Int
  true_incident_number_inc: Int
  true_incident_number_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
}
input ReportUpdateInput {
  inputs_outputs_unset: Boolean
  embedding_unset: Boolean
  epoch_date_modified: Int
  flag: Boolean
  date_downloaded: DateTime
  source_domain_unset: Boolean
  quiet_unset: Boolean
  description: String
  date_published: DateTime
  date_modified_unset: Boolean
  plain_text_unset: Boolean
  tags: [String]
  epoch_date_submitted: Int
  text_unset: Boolean
  editor_notes: String
  user_unset: Boolean
  is_incident_report: Boolean
  image_url: String
  is_incident_report_unset: Boolean
  report_number_inc: Int
  epoch_date_published_unset: Boolean
  date_submitted: DateTime
  flag_unset: Boolean
  url_unset: Boolean
  editor_notes_unset: Boolean
  submitters: [String]
  _id: ObjectId
  authors_unset: Boolean
  epoch_date_modified_unset: Boolean
  epoch_date_downloaded_inc: Int
  authors: [String]
  epoch_date_published: Int
  cloudinary_id_unset: Boolean
  epoch_date_submitted_inc: Int
  title: String
  url: String
  tags_unset: Boolean
  epoch_date_modified_inc: Int
  date_modified: DateTime
  epoch_date_submitted_unset: Boolean
  source_domain: String
  inputs_outputs: [String]
  epoch_date_downloaded: Int
  report_number: Int
  text: String
  date_submitted_unset: Boolean
  language: String
  report_number_unset: Boolean
  image_url_unset: Boolean
  submitters_unset: Boolean
  epoch_date_published_inc: Int
  embedding: ReportEmbeddingUpdateInput
  user: ReportUserRelationInput
  cloudinary_id: String
  date_published_unset: Boolean
  date_downloaded_unset: Boolean
  description_unset: Boolean
  title_unset: Boolean
  plain_text: String
  language_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  quiet: Boolean
  _id_unset: Boolean
}
input History_incidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}
type Entity {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}
input PromoteSubmissionToReportInput {
  incident_ids: [Int]
  is_incident_report: Boolean
  submission_id: ObjectId
}
input TaxaDummy_fieldQueryInput {
  OR: [TaxaDummy_fieldQueryInput!]
  field_number_in: [String]
  short_name_lt: String
  field_number_exists: Boolean
  field_number_gte: String
  AND: [TaxaDummy_fieldQueryInput!]
  field_number_lt: String
  short_name_lte: String
  field_number_ne: String
  field_number: String
  field_number_lte: String
  field_number_gt: String
  short_name_ne: String
  short_name_gt: String
  short_name_exists: Boolean
  short_name_in: [String]
  short_name_nin: [String]
  short_name: String
  short_name_gte: String
  field_number_nin: [String]
}
enum NotificationSortByInput {
  SENTDATE_ASC
  TYPE_ASC
  TYPE_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  SENTDATE_DESC
  USERID_ASC
  USERID_DESC
  _ID_ASC
  _ID_DESC
}
input CandidateClassification_similarityInsertInput {
  classification: String
  similarity: Float
}
input ClassificationIncidentsRelationInput {
  create: [IncidentInsertInput]
  link: [Int]
}
input NotificationInsertInput {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: NotificationUserIdRelationInput
}
input SubscriptionUserIdRelationInput {
  create: UserInsertInput
  link: String
}
input History_incidentUpdateInput {
  flagged_dissimilar_incidents: [Int]
  implicated_systems_unset: Boolean
  incident_id: Int
  embedding: History_incidentEmbeddingUpdateInput
  tsne_unset: Boolean
  modifiedBy: String
  editor_dissimilar_incidents: [Int]
  embedding_unset: Boolean
  epoch_date_modified_unset: Boolean
  incident_id_unset: Boolean
  date_unset: Boolean
  editor_similar_incidents_unset: Boolean
  reports: [Int]
  AllegedDeveloperOfAISystem_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties: [String]
  description_unset: Boolean
  incident_id_inc: Int
  editor_dissimilar_incidents_unset: Boolean
  epoch_date_modified: Int
  implicated_systems: [String]
  editor_notes: String
  editors_unset: Boolean
  AllegedDeployerOfAISystem_unset: Boolean
  editor_notes_unset: Boolean
  _id_unset: Boolean
  editor_similar_incidents: [Int]
  modifiedBy_unset: Boolean
  title_unset: Boolean
  reports_unset: Boolean
  _id: ObjectId
  AllegedDeveloperOfAISystem: [String]
  AllegedDeployerOfAISystem: [String]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  editors: [String]
  epoch_date_modified_inc: Int
  description: String
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  date: String
  title: String
  tsne: History_incidentTsneUpdateInput
}
input ChecklistQueryInput {
  about_nin: [String]
  entity_id_exists: Boolean
  date_created_gte: DateTime
  tags_methods_nin: [String]
  name_exists: Boolean
  _id_in: [ObjectId]
  about: String
  tags_goals: [String]
  _id_gt: ObjectId
  date_updated_exists: Boolean
  risks_exists: Boolean
  id_lte: String
  date_updated: DateTime
  date_created_ne: DateTime
  date_created_lte: DateTime
  owner_id_gte: String
  entity_id_lt: String
  name_gt: String
  _id_exists: Boolean
  about_lt: String
  about_ne: String
  about_in: [String]
  tags_other_exists: Boolean
  risks: [ChecklistRiskQueryInput]
  about_gt: String
  date_updated_gte: DateTime
  _id_lt: ObjectId
  date_created_nin: [DateTime]
  owner_id: String
  id: String
  tags_methods_exists: Boolean
  date_created_exists: Boolean
  _id_nin: [ObjectId]
  risks_nin: [ChecklistRiskQueryInput]
  risks_in: [ChecklistRiskQueryInput]
  id_in: [String]
  _id: ObjectId
  id_ne: String
  tags_other: [String]
  OR: [ChecklistQueryInput!]
  id_lt: String
  entity_id_gt: String
  about_lte: String
  entity_id_lte: String
  tags_goals_nin: [String]
  id_nin: [String]
  entity_id_nin: [String]
  entity_id: String
  owner_id_ne: String
  date_updated_nin: [DateTime]
  owner_id_nin: [String]
  name_gte: String
  date_created_gt: DateTime
  tags_other_nin: [String]
  name_in: [String]
  date_updated_lte: DateTime
  name_nin: [String]
  entity_id_ne: String
  name_ne: String
  owner_id_exists: Boolean
  name: String
  owner_id_lte: String
  owner_id_lt: String
  tags_goals_in: [String]
  id_gt: String
  _id_gte: ObjectId
  about_exists: Boolean
  tags_methods: [String]
  tags_goals_exists: Boolean
  tags_methods_in: [String]
  id_exists: Boolean
  name_lt: String
  date_created_in: [DateTime]
  date_updated_in: [DateTime]
  date_created_lt: DateTime
  owner_id_in: [String]
  date_created: DateTime
  _id_ne: ObjectId
  _id_lte: ObjectId
  AND: [ChecklistQueryInput!]
  owner_id_gt: String
  name_lte: String
  about_gte: String
  date_updated_lt: DateTime
  date_updated_ne: DateTime
  date_updated_gt: DateTime
  id_gte: String
  tags_other_in: [String]
  entity_id_in: [String]
  entity_id_gte: String
}
input EntityInsertInput {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}
input GetUserInput {
  userId: ObjectId
}
type AppUser {
  email: String
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
input EntityQueryInput {
  OR: [EntityQueryInput!]
  name: String
  name_nin: [String]
  name_ne: String
  name_gte: String
  entity_id_lt: String
  created_at_lte: DateTime
  name_lt: String
  _id_lte: ObjectId
  date_modified: DateTime
  _id: ObjectId
  entity_id: String
  date_modified_gte: DateTime
  date_modified_nin: [DateTime]
  date_modified_in: [DateTime]
  created_at_gt: DateTime
  created_at_gte: DateTime
  date_modified_exists: Boolean
  _id_lt: ObjectId
  entity_id_nin: [String]
  AND: [EntityQueryInput!]
  created_at_nin: [DateTime]
  _id_ne: ObjectId
  _id_in: [ObjectId]
  date_modified_gt: DateTime
  _id_exists: Boolean
  date_modified_lte: DateTime
  entity_id_gt: String
  _id_nin: [ObjectId]
  name_gt: String
  date_modified_lt: DateTime
  name_lte: String
  entity_id_lte: String
  created_at_lt: DateTime
  entity_id_ne: String
  entity_id_gte: String
  created_at_ne: DateTime
  created_at_in: [DateTime]
  name_exists: Boolean
  date_modified_ne: DateTime
  _id_gte: ObjectId
  _id_gt: ObjectId
  entity_id_in: [String]
  entity_id_exists: Boolean
  created_at: DateTime
  name_in: [String]
  created_at_exists: Boolean
}
enum IncidentSortByInput {
  INCIDENT_ID_ASC
  TITLE_ASC
  DATE_DESC
  DESCRIPTION_DESC
  EDITOR_NOTES_DESC
  _ID_ASC
  _ID_DESC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_ASC
  INCIDENT_ID_DESC
  DATE_ASC
  EPOCH_DATE_MODIFIED_DESC
  TITLE_DESC
}
enum SubscriptionSortByInput {
  USERID_DESC
  _ID_DESC
  TYPE_ASC
  TYPE_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  USERID_ASC
  _ID_ASC
  ENTITYID_ASC
  ENTITYID_DESC
}
input NotificationUpdateInput {
  type: String
  incident_id_unset: Boolean
  userId: NotificationUserIdRelationInput
  incident_id: Int
  processed: Boolean
  _id_unset: Boolean
  sentDate_unset: Boolean
  type_unset: Boolean
  _id: ObjectId
  incident_id_inc: Int
  processed_unset: Boolean
  sentDate: DateTime
  userId_unset: Boolean
}
input History_incidentInsertInput {
  editor_dissimilar_incidents: [Int]
  epoch_date_modified: Int
  editor_notes: String
  editors: [String]!
  title: String!
  editor_similar_incidents: [Int]
  flagged_dissimilar_incidents: [Int]
  incident_id: Int!
  modifiedBy: String
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  reports: [Int]!
  embedding: History_incidentEmbeddingInsertInput
  _id: ObjectId
  description: String
  implicated_systems: [String]
  AllegedDeployerOfAISystem: [String]
  AllegedHarmedOrNearlyHarmedParties: [String]
  AllegedDeveloperOfAISystem: [String]
  date: String!
  tsne: History_incidentTsneInsertInput
}
input History_reportEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}
input ClassificationAttributeUpdateInput {
  short_name_unset: Boolean
  value_json: String
  value_json_unset: Boolean
  short_name: String
}
input TaxaQueryInput {
  weight_ne: Int
  _id: ObjectId
  _id_in: [ObjectId]
  description_lt: String
  weight_in: [Int]
  weight_exists: Boolean
  complete_entities_exists: Boolean
  namespace_in: [String]
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  dummy_fields_exists: Boolean
  _id_ne: ObjectId
  description_gt: String
  complete_entities: Boolean
  namespace_exists: Boolean
  description_lte: String
  weight_nin: [Int]
  complete_entities_ne: Boolean
  OR: [TaxaQueryInput!]
  namespace_lt: String
  description_nin: [String]
  field_list_in: [TaxaField_listQueryInput]
  namespace: String
  namespace_nin: [String]
  _id_gte: ObjectId
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  _id_gt: ObjectId
  weight_lt: Int
  field_list_exists: Boolean
  weight: Int
  weight_gt: Int
  AND: [TaxaQueryInput!]
  _id_lte: ObjectId
  field_list: [TaxaField_listQueryInput]
  weight_gte: Int
  _id_nin: [ObjectId]
  description_exists: Boolean
  weight_lte: Int
  namespace_lte: String
  description_gte: String
  _id_exists: Boolean
  field_list_nin: [TaxaField_listQueryInput]
  description_in: [String]
  namespace_gt: String
  description_ne: String
  namespace_gte: String
  description: String
  _id_lt: ObjectId
  namespace_ne: String
  dummy_fields: [TaxaDummy_fieldQueryInput]
}
input DuplicateQueryInput {
  true_incident_number_gt: Int
  _id_lt: ObjectId
  true_incident_number_ne: Int
  true_incident_number_in: [Int]
  duplicate_incident_number_ne: Int
  true_incident_number_lt: Int
  true_incident_number_gte: Int
  AND: [DuplicateQueryInput!]
  duplicate_incident_number_lte: Int
  _id_nin: [ObjectId]
  duplicate_incident_number_exists: Boolean
  true_incident_number_exists: Boolean
  _id_in: [ObjectId]
  _id_ne: ObjectId
  duplicate_incident_number_in: [Int]
  _id_gte: ObjectId
  duplicate_incident_number_lt: Int
  duplicate_incident_number_gte: Int
  _id_gt: ObjectId
  _id_lte: ObjectId
  OR: [DuplicateQueryInput!]
  duplicate_incident_number: Int
  duplicate_incident_number_nin: [Int]
  true_incident_number_lte: Int
  _id: ObjectId
  duplicate_incident_number_gt: Int
  _id_exists: Boolean
  true_incident_number_nin: [Int]
  true_incident_number: Int
}
input SubmissionQueryInput {
  deployers_exists: Boolean
  harmed_parties: [EntityQueryInput]
  date_submitted_lt: String
  date_modified_exists: Boolean
  date_submitted_gte: String
  plain_text_nin: [String]
  editor_dissimilar_incidents: [Int]
  epoch_date_modified_ne: Int
  image_url_gt: String
  _id_lt: ObjectId
  incident_ids: [Int]
  OR: [SubmissionQueryInput!]
  editor_similar_incidents_exists: Boolean
  source_domain_lt: String
  date_downloaded_lte: String
  incident_editors_nin: [UserQueryInput]
  source_domain: String
  date_modified_nin: [String]
  implicated_systems: [EntityQueryInput]
  date_modified_ne: String
  editor_notes_lt: String
  date_modified_in: [String]
  incident_date_lte: String
  image_url_gte: String
  image_url_exists: Boolean
  status: String
  title_lt: String
  editor_notes_in: [String]
  incident_date_gte: String
  quiet_ne: Boolean
  developers_nin: [EntityQueryInput]
  title_gt: String
  authors_exists: Boolean
  _id_nin: [ObjectId]
  date_modified_gt: String
  editor_dissimilar_incidents_exists: Boolean
  tags_nin: [String]
  epoch_date_modified_gte: Int
  editor_notes_nin: [String]
  incident_date_exists: Boolean
  incident_date_lt: String
  incident_title_in: [String]
  cloudinary_id: String
  title_exists: Boolean
  implicated_systems_nin: [EntityQueryInput]
  deployers_nin: [EntityQueryInput]
  title_in: [String]
  submitters_exists: Boolean
  editor_similar_incidents: [Int]
  language_lt: String
  submitters_nin: [String]
  authors: [String]
  date_submitted_ne: String
  incident_title_lte: String
  cloudinary_id_gte: String
  quiet_exists: Boolean
  date_downloaded_gt: String
  _id_exists: Boolean
  plain_text_exists: Boolean
  AND: [SubmissionQueryInput!]
  incident_date_nin: [String]
  language_lte: String
  language_ne: String
  editor_dissimilar_incidents_in: [Int]
  _id: ObjectId
  plain_text_lte: String
  source_domain_lte: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  epoch_date_modified_gt: Int
  description: String
  description_gt: String
  status_lt: String
  incident_title_gte: String
  user_exists: Boolean
  image_url: String
  incident_editors: [UserQueryInput]
  status_lte: String
  language_gte: String
  cloudinary_id_nin: [String]
  date_submitted_exists: Boolean
  deployers_in: [EntityQueryInput]
  epoch_date_modified_exists: Boolean
  text_lte: String
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  description_in: [String]
  incident_date_in: [String]
  epoch_date_modified: Int
  developers_exists: Boolean
  incident_ids_exists: Boolean
  url: String
  source_domain_ne: String
  source_domain_exists: Boolean
  epoch_date_modified_lte: Int
  date_submitted_lte: String
  cloudinary_id_in: [String]
  date_published_gte: String
  date_downloaded: String
  url_gt: String
  text_gt: String
  description_ne: String
  plain_text: String
  description_lte: String
  cloudinary_id_lt: String
  developers: [EntityQueryInput]
  title_gte: String
  description_exists: Boolean
  date_published_lte: String
  date_submitted_nin: [String]
  incident_date_gt: String
  authors_nin: [String]
  user: UserQueryInput
  harmed_parties_nin: [EntityQueryInput]
  date_modified_lte: String
  incident_ids_in: [Int]
  language_exists: Boolean
  date_downloaded_gte: String
  title_lte: String
  source_domain_nin: [String]
  incident_title: String
  description_nin: [String]
  language: String
  status_exists: Boolean
  editor_notes_lte: String
  submitters: [String]
  image_url_lte: String
  text_lt: String
  developers_in: [EntityQueryInput]
  embedding: SubmissionEmbeddingQueryInput
  description_gte: String
  plain_text_lt: String
  epoch_date_modified_nin: [Int]
  date_published_in: [String]
  _id_in: [ObjectId]
  text_nin: [String]
  date_published: String
  description_lt: String
  image_url_in: [String]
  incident_date_ne: String
  source_domain_gte: String
  incident_editors_in: [UserQueryInput]
  incident_ids_nin: [Int]
  tags_in: [String]
  date_downloaded_ne: String
  title_ne: String
  date_submitted_gt: String
  date_published_exists: Boolean
  source_domain_in: [String]
  incident_editors_exists: Boolean
  title: String
  implicated_systems_exists: Boolean
  _id_lte: ObjectId
  tags_exists: Boolean
  submitters_in: [String]
  incident_title_exists: Boolean
  image_url_ne: String
  implicated_systems_in: [EntityQueryInput]
  editor_notes_ne: String
  epoch_date_modified_lt: Int
  text_in: [String]
  date_published_nin: [String]
  editor_notes: String
  authors_in: [String]
  tags: [String]
  harmed_parties_in: [EntityQueryInput]
  incident_title_ne: String
  text_exists: Boolean
  url_lt: String
  language_in: [String]
  title_nin: [String]
  editor_notes_gt: String
  date_modified_lt: String
  cloudinary_id_ne: String
  date_downloaded_nin: [String]
  url_nin: [String]
  embedding_exists: Boolean
  _id_ne: ObjectId
  _id_gte: ObjectId
  status_nin: [String]
  plain_text_ne: String
  editor_notes_gte: String
  cloudinary_id_lte: String
  nlp_similar_incidents_exists: Boolean
  date_published_ne: String
  date_downloaded_exists: Boolean
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  url_exists: Boolean
  text_gte: String
  status_in: [String]
  _id_gt: ObjectId
  url_lte: String
  editor_notes_exists: Boolean
  status_ne: String
  cloudinary_id_gt: String
  language_nin: [String]
  url_ne: String
  date_downloaded_lt: String
  language_gt: String
  url_gte: String
  plain_text_gte: String
  quiet: Boolean
  status_gte: String
  plain_text_in: [String]
  date_modified_gte: String
  editor_similar_incidents_in: [Int]
  incident_title_nin: [String]
  date_submitted: String
  date_modified: String
  plain_text_gt: String
  image_url_lt: String
  cloudinary_id_exists: Boolean
  harmed_parties_exists: Boolean
  date_published_gt: String
  incident_date: String
  epoch_date_modified_in: [Int]
  source_domain_gt: String
  status_gt: String
  deployers: [EntityQueryInput]
  editor_dissimilar_incidents_nin: [Int]
  editor_similar_incidents_nin: [Int]
  date_submitted_in: [String]
  text_ne: String
  image_url_nin: [String]
  text: String
  date_published_lt: String
  date_downloaded_in: [String]
  url_in: [String]
  incident_title_lt: String
  incident_title_gt: String
}
input History_incidentTsneQueryInput {
  y_lt: Float
  x: Float
  x_lt: Float
  x_exists: Boolean
  x_gte: Float
  x_lte: Float
  OR: [History_incidentTsneQueryInput!]
  x_in: [Float]
  y_nin: [Float]
  y_gt: Float
  y: Float
  y_lte: Float
  y_in: [Float]
  y_ne: Float
  x_nin: [Float]
  x_ne: Float
  y_exists: Boolean
  x_gt: Float
  y_gte: Float
  AND: [History_incidentTsneQueryInput!]
}
input SubscriptionUpdateInput {
  incident_id: SubscriptionIncident_idRelationInput
  type_unset: Boolean
  userId: SubscriptionUserIdRelationInput
  _id: ObjectId
  _id_unset: Boolean
  entityId: SubscriptionEntityIdRelationInput
  entityId_unset: Boolean
  type: String
  userId_unset: Boolean
  incident_id_unset: Boolean
}
input CandidateQueryInput {
  plain_text_lt: String
  epoch_date_published_in: [Int]
  url_lte: String
  date_downloaded_exists: Boolean
  similarity_gt: Float
  date_published_exists: Boolean
  title_lt: String
  date_published: String
  date_published_gte: String
  _id_lt: ObjectId
  language_lt: String
  title_exists: Boolean
  text_gt: String
  OR: [CandidateQueryInput!]
  url_lt: String
  plain_text: String
  epoch_date_downloaded_nin: [Int]
  match: Boolean
  matching_keywords_in: [String]
  title_lte: String
  epoch_date_published_ne: Int
  date_published_nin: [String]
  authors_nin: [String]
  source_domain_in: [String]
  classification_similarity: [CandidateClassification_similarityQueryInput]
  epoch_date_published_gte: Int
  language_in: [String]
  title_ne: String
  epoch_date_published_lt: Int
  similarity_exists: Boolean
  text_in: [String]
  similarity: Float
  date_published_lte: String
  epoch_date_downloaded_gte: Int
  date_published_lt: String
  matching_entities_nin: [String]
  _id_nin: [ObjectId]
  language: String
  date_downloaded_in: [String]
  matching_keywords_exists: Boolean
  source_domain_nin: [String]
  similarity_ne: Float
  epoch_date_downloaded_lt: Int
  title_gt: String
  authors_exists: Boolean
  date_downloaded_gte: String
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  source_domain_ne: String
  text_ne: String
  image_url_exists: Boolean
  language_lte: String
  url_nin: [String]
  image_url_nin: [String]
  similarity_nin: [Float]
  epoch_date_downloaded_exists: Boolean
  matching_entities: [String]
  date_downloaded_nin: [String]
  text_exists: Boolean
  image_url_lt: String
  matching_keywords_nin: [String]
  source_domain_exists: Boolean
  plain_text_ne: String
  image_url_lte: String
  matching_harm_keywords: [String]
  source_domain_lt: String
  url_ne: String
  _id_exists: Boolean
  url_gte: String
  similarity_lt: Float
  language_ne: String
  language_nin: [String]
  _id_gte: ObjectId
  language_exists: Boolean
  image_url_gte: String
  epoch_date_published_gt: Int
  dismissed_exists: Boolean
  text_nin: [String]
  url: String
  epoch_date_downloaded_ne: Int
  text: String
  title_nin: [String]
  image_url_gt: String
  plain_text_nin: [String]
  _id_gt: ObjectId
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  title_in: [String]
  image_url_in: [String]
  title_gte: String
  authors_in: [String]
  AND: [CandidateQueryInput!]
  source_domain: String
  embedding_exists: Boolean
  _id_ne: ObjectId
  matching_entities_in: [String]
  source_domain_gte: String
  plain_text_lte: String
  date_published_ne: String
  source_domain_lte: String
  epoch_date_downloaded: Int
  date_downloaded_ne: String
  _id: ObjectId
  url_in: [String]
  image_url_ne: String
  plain_text_in: [String]
  epoch_date_downloaded_in: [Int]
  dismissed_ne: Boolean
  embedding: CandidateEmbeddingQueryInput
  title: String
  match_exists: Boolean
  epoch_date_published_exists: Boolean
  plain_text_exists: Boolean
  dismissed: Boolean
  matching_entities_exists: Boolean
  date_downloaded: String
  date_downloaded_gt: String
  epoch_date_published_nin: [Int]
  url_exists: Boolean
  plain_text_gte: String
  date_downloaded_lte: String
  matching_harm_keywords_nin: [String]
  similarity_gte: Float
  match_ne: Boolean
  epoch_date_published_lte: Int
  classification_similarity_exists: Boolean
  similarity_in: [Float]
  text_lte: String
  image_url: String
  language_gt: String
  epoch_date_downloaded_lte: Int
  authors: [String]
  epoch_date_downloaded_gt: Int
  source_domain_gt: String
  url_gt: String
  date_downloaded_lt: String
  language_gte: String
  text_lt: String
  date_published_gt: String
  _id_in: [ObjectId]
  matching_harm_keywords_exists: Boolean
  similarity_lte: Float
  epoch_date_published: Int
  matching_keywords: [String]
  _id_lte: ObjectId
  text_gte: String
  date_published_in: [String]
  matching_harm_keywords_in: [String]
  plain_text_gt: String
}
input NotificationQueryInput {
  type_exists: Boolean
  incident_id_nin: [Int]
  sentDate_exists: Boolean
  sentDate_gt: DateTime
  incident_id_lt: Int
  type_lt: String
  type_nin: [String]
  incident_id_gt: Int
  processed_exists: Boolean
  sentDate_ne: DateTime
  type: String
  _id_gte: ObjectId
  incident_id_gte: Int
  incident_id_lte: Int
  _id_lt: ObjectId
  type_ne: String
  OR: [NotificationQueryInput!]
  incident_id_exists: Boolean
  userId: UserQueryInput
  _id_lte: ObjectId
  userId_exists: Boolean
  _id_ne: ObjectId
  type_lte: String
  sentDate_nin: [DateTime]
  _id: ObjectId
  incident_id: Int
  _id_exists: Boolean
  sentDate_gte: DateTime
  type_gt: String
  _id_in: [ObjectId]
  sentDate_lt: DateTime
  AND: [NotificationQueryInput!]
  sentDate_lte: DateTime
  _id_nin: [ObjectId]
  type_in: [String]
  sentDate: DateTime
  _id_gt: ObjectId
  incident_id_in: [Int]
  sentDate_in: [DateTime]
  processed_ne: Boolean
  incident_id_ne: Int
  processed: Boolean
  type_gte: String
}
input CandidateEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}
input ReportInsertInput {
  _id: ObjectId
  epoch_date_modified: Int!
  epoch_date_submitted: Int!
  description: String
  epoch_date_published: Int!
  authors: [String]!
  url: String!
  text: String!
  submitters: [String]!
  report_number: Int!
  inputs_outputs: [String]
  epoch_date_downloaded: Int!
  flag: Boolean
  date_submitted: DateTime!
  language: String!
  is_incident_report: Boolean
  date_modified: DateTime!
  date_downloaded: DateTime!
  title: String!
  cloudinary_id: String!
  date_published: DateTime!
  user: ReportUserRelationInput
  quiet: Boolean
  tags: [String]!
  embedding: ReportEmbeddingInsertInput
  editor_notes: String
  image_url: String!
  source_domain: String!
  plain_text: String!
}
type DeleteManyPayload {
  deletedCount: Int!
}
type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
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
input History_incidentNlp_similar_incidentQueryInput {
  incident_id_nin: [Int]
  incident_id_gt: Int
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  similarity_lte: Float
  incident_id_lte: Int
  similarity_lt: Float
  incident_id_exists: Boolean
  incident_id_gte: Int
  similarity_gt: Float
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id: Int
  incident_id_ne: Int
  similarity_ne: Float
  similarity_nin: [Float]
  similarity_gte: Float
  similarity: Float
  similarity_exists: Boolean
  incident_id_in: [Int]
  similarity_in: [Float]
  incident_id_lt: Int
}
enum History_incidentSortByInput {
  MODIFIEDBY_ASC
  DATE_DESC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_ASC
  INCIDENT_ID_ASC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_ID_DESC
  MODIFIEDBY_DESC
  _ID_ASC
  DESCRIPTION_ASC
  EDITOR_NOTES_DESC
  TITLE_ASC
  TITLE_DESC
  _ID_DESC
  DATE_ASC
  DESCRIPTION_DESC
}
input ClassificationReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}
input ReportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}
input SubmissionInsertInput {
  text: String!
  date_modified: String!
  date_published: String!
  image_url: String!
  incident_date: String
  plain_text: String
  harmed_parties: SubmissionHarmed_partiesRelationInput
  incident_ids: [Int]
  editor_similar_incidents: [Int]
  incident_title: String
  submitters: [String]!
  developers: SubmissionDevelopersRelationInput
  date_submitted: String!
  deployers: SubmissionDeployersRelationInput
  date_downloaded: String!
  user: SubmissionUserRelationInput
  language: String!
  authors: [String]!
  quiet: Boolean
  url: String!
  embedding: SubmissionEmbeddingInsertInput
  description: String
  incident_editors: SubmissionIncident_editorsRelationInput
  editor_dissimilar_incidents: [Int]
  title: String!
  editor_notes: String
  status: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  implicated_systems: SubmissionImplicated_systemsRelationInput
  _id: ObjectId
  tags: [String]!
  epoch_date_modified: Int
  cloudinary_id: String
  source_domain: String!
}
input SubmissionImplicated_systemsRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
type Query {
  candidate(query: CandidateQueryInput): Candidate
  candidates(query: CandidateQueryInput, limit: Int = 100, sortBy: CandidateSortByInput): [Candidate]!
  checklist(query: ChecklistQueryInput): Checklist
  checklists(query: ChecklistQueryInput, limit: Int = 100, sortBy: ChecklistSortByInput): [Checklist]!
  classification(query: ClassificationQueryInput): Classification
  classifications(query: ClassificationQueryInput, limit: Int = 100, sortBy: ClassificationSortByInput): [Classification]!
  duplicate(query: DuplicateQueryInput): Duplicate
  duplicates(query: DuplicateQueryInput, limit: Int = 100, sortBy: DuplicateSortByInput): [Duplicate]!
  entities(query: EntityQueryInput, limit: Int = 100, sortBy: EntitySortByInput): [Entity]!
  entity(query: EntityQueryInput): Entity
  history_incident(query: History_incidentQueryInput): History_incident
  history_incidents(query: History_incidentQueryInput, limit: Int = 100, sortBy: History_incidentSortByInput): [History_incident]!
  history_report(query: History_reportQueryInput): History_report
  history_reports(limit: Int = 100, sortBy: History_reportSortByInput, query: History_reportQueryInput): [History_report]!
  incident(query: IncidentQueryInput): Incident
  incidents(query: IncidentQueryInput, limit: Int = 100, sortBy: IncidentSortByInput): [Incident]!
  notification(query: NotificationQueryInput): Notification
  notifications(query: NotificationQueryInput, limit: Int = 100, sortBy: NotificationSortByInput): [Notification]!
  quickadd(query: QuickaddQueryInput): Quickadd
  quickadds(query: QuickaddQueryInput, limit: Int = 100, sortBy: QuickaddSortByInput): [Quickadd]!
  report(query: ReportQueryInput): Report
  reports(query: ReportQueryInput, limit: Int = 100, sortBy: ReportSortByInput): [Report]!
  risks(input: RisksInput): [RisksPayloadItem]
  submission(query: SubmissionQueryInput): Submission
  submissions(query: SubmissionQueryInput, limit: Int = 100, sortBy: SubmissionSortByInput): [Submission]!
  subscription(query: SubscriptionQueryInput): Subscription
  subscriptions(sortBy: SubscriptionSortByInput, query: SubscriptionQueryInput, limit: Int = 100): [Subscription]!
  taxa(query: TaxaQueryInput): Taxa
  taxas(sortBy: TaxaSortByInput, query: TaxaQueryInput, limit: Int = 100): [Taxa]!
  user(query: UserQueryInput): User
  users(sortBy: UserSortByInput, query: UserQueryInput, limit: Int = 100): [User]!
}
input TaxaField_listInsertInput {
  weight: Int
  short_name: String
  complete_from: TaxaField_listComplete_fromInsertInput
  permitted_values: [String]
  short_description: String
  hide_search: Boolean
  instant_facet: Boolean
  mongo_type: String
  field_number: String
  long_name: String
  required: Boolean
  default: String
  public: Boolean
  display_type: String
  item_fields: TaxaField_listItem_fieldInsertInput
  long_description: String
  placeholder: String
}
type TaxaField_listComplete_from {
  all: [String]
  current: [String]
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
type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}
input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
input ChecklistRiskPrecedentInsertInput {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}
input EntityUpdateInput {
  created_at_unset: Boolean
  entity_id_unset: Boolean
  entity_id: String
  _id_unset: Boolean
  date_modified: DateTime
  created_at: DateTime
  date_modified_unset: Boolean
  name: String
  _id: ObjectId
  name_unset: Boolean
}
input SubmissionEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
}
input ChecklistRiskPrecedentQueryInput {
  title: String
  title_lt: String
  tags_exists: Boolean
  incident_id_exists: Boolean
  OR: [ChecklistRiskPrecedentQueryInput!]
  AND: [ChecklistRiskPrecedentQueryInput!]
  incident_id_lte: Int
  incident_id_ne: Int
  description_gt: String
  description_in: [String]
  title_in: [String]
  title_ne: String
  description_nin: [String]
  title_gte: String
  incident_id_lt: Int
  title_nin: [String]
  description_exists: Boolean
  incident_id_nin: [Int]
  title_gt: String
  tags_nin: [String]
  description: String
  incident_id_gt: Int
  title_exists: Boolean
  incident_id_in: [Int]
  description_lte: String
  description_ne: String
  title_lte: String
  description_lt: String
  description_gte: String
  tags_in: [String]
  incident_id: Int
  incident_id_gte: Int
  tags: [String]
}
input History_incidentTsneUpdateInput {
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
  x_unset: Boolean
  y: Float
}
input IncidentNlp_similar_incidentQueryInput {
  similarity_gt: Float
  incident_id_lt: Int
  similarity: Float
  incident_id_in: [Int]
  incident_id_lte: Int
  similarity_nin: [Float]
  similarity_ne: Float
  similarity_in: [Float]
  OR: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_gte: Int
  incident_id_gt: Int
  similarity_lte: Float
  incident_id: Int
  incident_id_exists: Boolean
  similarity_exists: Boolean
  AND: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_nin: [Int]
  similarity_gte: Float
  incident_id_ne: Int
  similarity_lt: Float
}
input SubscriptionQueryInput {
  userId: UserQueryInput
  userId_exists: Boolean
  type_exists: Boolean
  _id_lte: ObjectId
  _id_nin: [ObjectId]
  _id_exists: Boolean
  type_gt: String
  type_lte: String
  OR: [SubscriptionQueryInput!]
  _id_lt: ObjectId
  entityId: EntityQueryInput
  _id: ObjectId
  _id_ne: ObjectId
  type: String
  entityId_exists: Boolean
  _id_gt: ObjectId
  type_gte: String
  type_nin: [String]
  _id_gte: ObjectId
  type_in: [String]
  _id_in: [ObjectId]
  type_ne: String
  AND: [SubscriptionQueryInput!]
  incident_id: IncidentQueryInput
  incident_id_exists: Boolean
  type_lt: String
}
input IncidentEmbeddingInsertInput {
  vector: [Float]
  from_reports: [Int]
}
input TaxaField_listItem_fieldUpdateInput {
  weight_inc: Int
  placeholder: String
  short_name: String
  weight: Int
  long_description: String
  long_name_unset: Boolean
  complete_from_unset: Boolean
  instant_facet: Boolean
  public_unset: Boolean
  long_name: String
  required: Boolean
  field_number: String
  permitted_values_unset: Boolean
  short_name_unset: Boolean
  default_unset: Boolean
  weight_unset: Boolean
  placeholder_unset: Boolean
  mongo_type: String
  display_type: String
  default: String
  long_description_unset: Boolean
  short_description_unset: Boolean
  short_description: String
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  field_number_unset: Boolean
  permitted_values: [String]
  public: Boolean
  instant_facet_unset: Boolean
  mongo_type_unset: Boolean
  required_unset: Boolean
  display_type_unset: Boolean
}
input History_incidentEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_reports: [Int]
  from_reports_unset: Boolean
}
input TaxaField_listItem_fieldQueryInput {
  permitted_values: [String]
  short_description_gte: String
  long_name_ne: String
  field_number_in: [String]
  AND: [TaxaField_listItem_fieldQueryInput!]
  OR: [TaxaField_listItem_fieldQueryInput!]
  field_number_exists: Boolean
  long_description: String
  placeholder_gte: String
  short_description_ne: String
  long_name_lt: String
  short_description_gt: String
  long_name: String
  default_in: [String]
  weight_lte: Int
  field_number_ne: String
  placeholder: String
  field_number_gte: String
  field_number_lt: String
  default_lt: String
  short_name_lte: String
  permitted_values_nin: [String]
  short_description: String
  short_name_ne: String
  placeholder_gt: String
  public: Boolean
  long_name_exists: Boolean
  display_type_nin: [String]
  default_lte: String
  short_name_gt: String
  short_name_gte: String
  short_description_lte: String
  required_ne: Boolean
  display_type_gte: String
  weight_in: [Int]
  mongo_type_gte: String
  required_exists: Boolean
  field_number_gt: String
  default_nin: [String]
  instant_facet_ne: Boolean
  short_name_exists: Boolean
  required: Boolean
  long_description_exists: Boolean
  instant_facet_exists: Boolean
  placeholder_lte: String
  default: String
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  long_name_gt: String
  instant_facet: Boolean
  mongo_type_exists: Boolean
  default_ne: String
  weight_lt: Int
  mongo_type_gt: String
  placeholder_nin: [String]
  mongo_type_lt: String
  field_number: String
  placeholder_lt: String
  long_name_lte: String
  display_type_lt: String
  mongo_type_ne: String
  long_description_lte: String
  long_description_lt: String
  short_description_nin: [String]
  public_exists: Boolean
  long_name_gte: String
  display_type_exists: Boolean
  display_type_gt: String
  short_name_lt: String
  complete_from_exists: Boolean
  default_gte: String
  field_number_nin: [String]
  long_description_ne: String
  display_type: String
  mongo_type_lte: String
  long_name_nin: [String]
  long_description_in: [String]
  long_description_nin: [String]
  mongo_type_nin: [String]
  mongo_type_in: [String]
  placeholder_exists: Boolean
  placeholder_ne: String
  permitted_values_exists: Boolean
  public_ne: Boolean
  short_name_nin: [String]
  weight_ne: Int
  default_gt: String
  short_description_in: [String]
  weight_exists: Boolean
  short_description_exists: Boolean
  default_exists: Boolean
  display_type_in: [String]
  long_description_gt: String
  weight_gte: Int
  short_description_lt: String
  weight_nin: [Int]
  weight: Int
  short_name: String
  field_number_lte: String
  long_name_in: [String]
  permitted_values_in: [String]
  display_type_ne: String
  short_name_in: [String]
  mongo_type: String
  display_type_lte: String
  weight_gt: Int
  long_description_gte: String
  placeholder_in: [String]
}
input TaxaField_listQueryInput {
  default_gt: String
  short_name_lt: String
  field_number_gt: String
  long_description_ne: String
  display_type_gt: String
  long_description: String
  short_name_in: [String]
  complete_from: TaxaField_listComplete_fromQueryInput
  long_description_exists: Boolean
  short_description_gte: String
  long_description_gt: String
  field_number_exists: Boolean
  weight_gt: Int
  short_name_gte: String
  field_number_ne: String
  long_name_ne: String
  short_description: String
  weight_in: [Int]
  AND: [TaxaField_listQueryInput!]
  long_name_gte: String
  weight_lt: Int
  short_description_nin: [String]
  mongo_type_gt: String
  placeholder_in: [String]
  instant_facet: Boolean
  required_exists: Boolean
  long_description_lte: String
  long_name: String
  placeholder_lte: String
  permitted_values_nin: [String]
  short_name_gt: String
  hide_search: Boolean
  item_fields_exists: Boolean
  mongo_type_in: [String]
  long_name_in: [String]
  mongo_type_ne: String
  weight_lte: Int
  complete_from_exists: Boolean
  weight_exists: Boolean
  permitted_values_in: [String]
  short_description_lte: String
  short_name_nin: [String]
  display_type_ne: String
  short_name_exists: Boolean
  short_name_lte: String
  long_description_lt: String
  long_description_in: [String]
  short_description_gt: String
  field_number_lt: String
  default_gte: String
  default: String
  default_exists: Boolean
  item_fields: TaxaField_listItem_fieldQueryInput
  weight_gte: Int
  public_ne: Boolean
  display_type_lt: String
  hide_search_exists: Boolean
  long_name_lte: String
  weight: Int
  mongo_type_lt: String
  mongo_type: String
  required_ne: Boolean
  short_name: String
  field_number_in: [String]
  display_type_lte: String
  display_type_exists: Boolean
  short_description_in: [String]
  display_type_in: [String]
  permitted_values_exists: Boolean
  weight_ne: Int
  placeholder_exists: Boolean
  public: Boolean
  field_number_lte: String
  long_name_exists: Boolean
  long_name_gt: String
  mongo_type_gte: String
  instant_facet_ne: Boolean
  field_number: String
  mongo_type_lte: String
  placeholder_gte: String
  display_type: String
  weight_nin: [Int]
  default_in: [String]
  field_number_nin: [String]
  public_exists: Boolean
  short_description_lt: String
  short_description_exists: Boolean
  long_name_lt: String
  placeholder_ne: String
  default_lt: String
  display_type_gte: String
  placeholder_nin: [String]
  required: Boolean
  mongo_type_nin: [String]
  short_description_ne: String
  placeholder_gt: String
  field_number_gte: String
  mongo_type_exists: Boolean
  long_description_nin: [String]
  instant_facet_exists: Boolean
  hide_search_ne: Boolean
  long_name_nin: [String]
  default_ne: String
  short_name_ne: String
  placeholder_lt: String
  default_lte: String
  permitted_values: [String]
  OR: [TaxaField_listQueryInput!]
  placeholder: String
  default_nin: [String]
  display_type_nin: [String]
  long_description_gte: String
}
enum ReportSortByInput {
  _ID_DESC
  DATE_DOWNLOADED_ASC
  DATE_PUBLISHED_ASC
  DATE_SUBMITTED_ASC
  TITLE_ASC
  USER_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_PUBLISHED_DESC
  REPORT_NUMBER_DESC
  SOURCE_DOMAIN_ASC
  URL_ASC
  EDITOR_NOTES_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_SUBMITTED_DESC
  IMAGE_URL_DESC
  URL_DESC
  DATE_MODIFIED_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  LANGUAGE_ASC
  SOURCE_DOMAIN_DESC
  TITLE_DESC
  CLOUDINARY_ID_ASC
  PLAIN_TEXT_ASC
  PLAIN_TEXT_DESC
  REPORT_NUMBER_ASC
  USER_DESC
  _ID_ASC
  DATE_MODIFIED_ASC
  LANGUAGE_DESC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  TEXT_DESC
  CLOUDINARY_ID_DESC
  DATE_SUBMITTED_DESC
  EPOCH_DATE_MODIFIED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  IMAGE_URL_ASC
  TEXT_ASC
}
input CandidateUpdateInput {
  match: Boolean
  authors: [String]
  source_domain_unset: Boolean
  epoch_date_published_inc: Int
  epoch_date_published: Int
  authors_unset: Boolean
  title_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  language_unset: Boolean
  matching_entities: [String]
  date_downloaded_unset: Boolean
  date_downloaded: String
  date_published: String
  title: String
  matching_harm_keywords_unset: Boolean
  url_unset: Boolean
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  dismissed_unset: Boolean
  matching_entities_unset: Boolean
  embedding: CandidateEmbeddingUpdateInput
  _id: ObjectId
  epoch_date_published_unset: Boolean
  matching_keywords: [String]
  similarity_unset: Boolean
  source_domain: String
  similarity_inc: Float
  classification_similarity_unset: Boolean
  matching_keywords_unset: Boolean
  dismissed: Boolean
  text_unset: Boolean
  _id_unset: Boolean
  epoch_date_downloaded_inc: Int
  image_url: String
  plain_text: String
  epoch_date_downloaded: Int
  date_published_unset: Boolean
  image_url_unset: Boolean
  url: String
  text: String
  language: String
  similarity: Float
  matching_harm_keywords: [String]
  match_unset: Boolean
  plain_text_unset: Boolean
  embedding_unset: Boolean
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
input TaxaField_listUpdateInput {
  mongo_type: String
  long_description_unset: Boolean
  display_type: String
  permitted_values: [String]
  weight: Int
  weight_inc: Int
  default: String
  field_number_unset: Boolean
  required_unset: Boolean
  field_number: String
  long_name: String
  weight_unset: Boolean
  long_name_unset: Boolean
  placeholder_unset: Boolean
  short_description_unset: Boolean
  complete_from_unset: Boolean
  item_fields_unset: Boolean
  public_unset: Boolean
  instant_facet: Boolean
  hide_search_unset: Boolean
  public: Boolean
  short_name_unset: Boolean
  hide_search: Boolean
  display_type_unset: Boolean
  permitted_values_unset: Boolean
  long_description: String
  complete_from: TaxaField_listComplete_fromUpdateInput
  instant_facet_unset: Boolean
  default_unset: Boolean
  placeholder: String
  required: Boolean
  short_name: String
  short_description: String
  item_fields: TaxaField_listItem_fieldUpdateInput
  mongo_type_unset: Boolean
}
input UserUpdateInput {
  first_name: String
  last_name_unset: Boolean
  first_name_unset: Boolean
  last_name: String
  _id: ObjectId
  roles: [String]
  userId_unset: Boolean
  _id_unset: Boolean
  roles_unset: Boolean
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
  url: String!
  user: User
}
input ReportEmbeddingQueryInput {
  from_text_hash_lte: String
  vector_in: [Float]
  from_text_hash_exists: Boolean
  vector_exists: Boolean
  AND: [ReportEmbeddingQueryInput!]
  from_text_hash_lt: String
  vector_nin: [Float]
  from_text_hash_ne: String
  from_text_hash_in: [String]
  from_text_hash_gt: String
  OR: [ReportEmbeddingQueryInput!]
  vector: [Float]
  from_text_hash_gte: String
  from_text_hash: String
  from_text_hash_nin: [String]
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
input SubmissionEmbeddingQueryInput {
  AND: [SubmissionEmbeddingQueryInput!]
  vector_in: [Float]
  from_text_hash_nin: [String]
  from_text_hash_lt: String
  OR: [SubmissionEmbeddingQueryInput!]
  vector_nin: [Float]
  vector_exists: Boolean
  from_text_hash: String
  from_text_hash_gte: String
  from_text_hash_in: [String]
  from_text_hash_gt: String
  from_text_hash_exists: Boolean
  vector: [Float]
  from_text_hash_ne: String
  from_text_hash_lte: String
}
enum SubmissionSortByInput {
  EPOCH_DATE_MODIFIED_ASC
  DATE_PUBLISHED_DESC
  DESCRIPTION_ASC
  _ID_DESC
  DATE_MODIFIED_DESC
  SOURCE_DOMAIN_DESC
  STATUS_ASC
  EDITOR_NOTES_ASC
  PLAIN_TEXT_DESC
  STATUS_DESC
  TITLE_ASC
  URL_ASC
  DATE_PUBLISHED_ASC
  LANGUAGE_DESC
  INCIDENT_DATE_DESC
  INCIDENT_TITLE_DESC
  PLAIN_TEXT_ASC
  SOURCE_DOMAIN_ASC
  TEXT_DESC
  TITLE_DESC
  DATE_MODIFIED_ASC
  EDITOR_NOTES_DESC
  IMAGE_URL_ASC
  IMAGE_URL_DESC
  INCIDENT_TITLE_ASC
  URL_DESC
  USER_ASC
  USER_DESC
  DATE_SUBMITTED_ASC
  EPOCH_DATE_MODIFIED_DESC
  DATE_DOWNLOADED_ASC
  DATE_DOWNLOADED_DESC
  INCIDENT_DATE_ASC
  TEXT_ASC
  _ID_ASC
  CLOUDINARY_ID_ASC
  DESCRIPTION_DESC
  LANGUAGE_ASC
  CLOUDINARY_ID_DESC
  DATE_SUBMITTED_DESC
}
type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}
input ChecklistInsertInput {
  about: String
  date_created: DateTime
  tags_other: [String]
  _id: ObjectId
  tags_methods: [String]
  date_updated: DateTime
  id: String
  risks: [ChecklistRiskInsertInput]
  entity_id: String
  name: String
  owner_id: String
  tags_goals: [String]
}
input IncidentEmbeddingUpdateInput {
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
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
input SubscriptionInsertInput {
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
  userId: SubscriptionUserIdRelationInput!
  _id: ObjectId
  entityId: SubscriptionEntityIdRelationInput
}
input TaxaField_listComplete_fromInsertInput {
  all: [String]
  current: [String]
}
input ChecklistUpdateInput {
  owner_id: String
  risks: [ChecklistRiskUpdateInput]
  date_created: DateTime
  tags_methods: [String]
  id_unset: Boolean
  about_unset: Boolean
  date_updated_unset: Boolean
  tags_goals_unset: Boolean
  date_created_unset: Boolean
  tags_goals: [String]
  tags_other: [String]
  tags_other_unset: Boolean
  _id: ObjectId
  entity_id_unset: Boolean
  name: String
  date_updated: DateTime
  owner_id_unset: Boolean
  name_unset: Boolean
  id: String
  tags_methods_unset: Boolean
  about: String
  entity_id: String
  risks_unset: Boolean
  _id_unset: Boolean
}
type LogReportHistoryPayload {
  report_number: Int
}
type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}
type IncidentTsne {
  x: Float
  y: Float
}
input IncidentTsneUpdateInput {
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
}
input SubscriptionEntityIdRelationInput {
  create: EntityInsertInput
  link: String
}
input SubmissionUpdateInput {
  authors: [String]
  incident_title: String
  incident_date_unset: Boolean
  text: String
  title: String
  editor_dissimilar_incidents: [Int]
  tags_unset: Boolean
  epoch_date_modified: Int
  editor_similar_incidents_unset: Boolean
  date_downloaded: String
  image_url_unset: Boolean
  harmed_parties_unset: Boolean
  status_unset: Boolean
  harmed_parties: SubmissionHarmed_partiesRelationInput
  embedding: SubmissionEmbeddingUpdateInput
  submitters: [String]
  date_modified_unset: Boolean
  url_unset: Boolean
  incident_ids: [Int]
  title_unset: Boolean
  date_published_unset: Boolean
  user: SubmissionUserRelationInput
  incident_editors_unset: Boolean
  embedding_unset: Boolean
  incident_editors: SubmissionIncident_editorsRelationInput
  text_unset: Boolean
  implicated_systems_unset: Boolean
  _id: ObjectId
  image_url: String
  incident_title_unset: Boolean
  user_unset: Boolean
  incident_date: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  quiet_unset: Boolean
  epoch_date_modified_inc: Int
  deployers: SubmissionDeployersRelationInput
  quiet: Boolean
  submitters_unset: Boolean
  language_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  incident_ids_unset: Boolean
  implicated_systems: SubmissionImplicated_systemsRelationInput
  editor_notes: String
  cloudinary_id: String
  status: String
  source_domain: String
  description_unset: Boolean
  plain_text_unset: Boolean
  tags: [String]
  authors_unset: Boolean
  date_downloaded_unset: Boolean
  developers_unset: Boolean
  _id_unset: Boolean
  url: String
  date_published: String
  date_submitted_unset: Boolean
  epoch_date_modified_unset: Boolean
  editor_notes_unset: Boolean
  cloudinary_id_unset: Boolean
  date_modified: String
  date_submitted: String
  editor_similar_incidents: [Int]
  language: String
  developers: SubmissionDevelopersRelationInput
  source_domain_unset: Boolean
  editor_dissimilar_incidents_unset: Boolean
  description: String
  plain_text: String
  deployers_unset: Boolean
}
input History_reportEmbeddingQueryInput {
  vector_in: [Float]
  from_text_hash_exists: Boolean
  from_text_hash_lt: String
  from_text_hash: String
  from_text_hash_gt: String
  AND: [History_reportEmbeddingQueryInput!]
  from_text_hash_lte: String
  vector: [Float]
  vector_exists: Boolean
  from_text_hash_gte: String
  from_text_hash_nin: [String]
  from_text_hash_in: [String]
  from_text_hash_ne: String
  vector_nin: [Float]
  OR: [History_reportEmbeddingQueryInput!]
}
input ClassificationQueryInput {
  _id_lte: ObjectId
  incidents_exists: Boolean
  notes_in: [String]
  _id_nin: [ObjectId]
  attributes_in: [ClassificationAttributeQueryInput]
  notes_exists: Boolean
  incidents_nin: [IncidentQueryInput]
  publish: Boolean
  notes: String
  namespace_ne: String
  notes_gt: String
  namespace_lt: String
  publish_ne: Boolean
  reports_exists: Boolean
  _id_ne: ObjectId
  notes_nin: [String]
  notes_lt: String
  OR: [ClassificationQueryInput!]
  attributes: [ClassificationAttributeQueryInput]
  attributes_nin: [ClassificationAttributeQueryInput]
  notes_lte: String
  namespace_lte: String
  _id_gte: ObjectId
  _id: ObjectId
  publish_exists: Boolean
  incidents: [IncidentQueryInput]
  _id_lt: ObjectId
  _id_exists: Boolean
  _id_in: [ObjectId]
  namespace_gt: String
  reports_nin: [ReportQueryInput]
  reports: [ReportQueryInput]
  _id_gt: ObjectId
  notes_ne: String
  namespace_gte: String
  AND: [ClassificationQueryInput!]
  namespace_exists: Boolean
  notes_gte: String
  attributes_exists: Boolean
  incidents_in: [IncidentQueryInput]
  namespace_in: [String]
  namespace: String
  namespace_nin: [String]
  reports_in: [ReportQueryInput]
}
input RisksInput {
  tags: [String]
}
type InsertManyPayload {
  insertedIds: [ObjectId]!
}
type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}
input History_reportEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
}
input CandidateClassification_similarityQueryInput {
  classification_lte: String
  similarity_gt: Float
  similarity_exists: Boolean
  classification_lt: String
  classification: String
  similarity_lt: Float
  similarity_ne: Float
  classification_nin: [String]
  similarity: Float
  similarity_in: [Float]
  classification_gte: String
  classification_ne: String
  OR: [CandidateClassification_similarityQueryInput!]
  classification_gt: String
  similarity_gte: Float
  similarity_nin: [Float]
  AND: [CandidateClassification_similarityQueryInput!]
  classification_in: [String]
  similarity_lte: Float
  classification_exists: Boolean
}
input CandidateInsertInput {
  plain_text: String
  classification_similarity: [CandidateClassification_similarityInsertInput]
  date_downloaded: String
  url: String!
  authors: [String]
  embedding: CandidateEmbeddingInsertInput
  match: Boolean!
  matching_entities: [String]
  text: String
  epoch_date_downloaded: Int
  date_published: String
  similarity: Float
  epoch_date_published: Int
  matching_harm_keywords: [String]
  dismissed: Boolean
  title: String
  source_domain: String
  image_url: String
  language: String
  _id: ObjectId
  matching_keywords: [String]
}
input ClassificationUpdateInput {
  namespace: String
  _id_unset: Boolean
  incidents: ClassificationIncidentsRelationInput
  notes: String
  publish: Boolean
  publish_unset: Boolean
  attributes: [ClassificationAttributeUpdateInput]
  reports_unset: Boolean
  attributes_unset: Boolean
  notes_unset: Boolean
  _id: ObjectId
  namespace_unset: Boolean
  reports: ClassificationReportsRelationInput
  incidents_unset: Boolean
}
scalar DateTime
input TaxaField_listItem_fieldComplete_fromQueryInput {
  current_exists: Boolean
  all_nin: [String]
  entities: Boolean
  all_in: [String]
  current_nin: [String]
  current_in: [String]
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  current: [String]
  entities_ne: Boolean
  entities_exists: Boolean
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all: [String]
  all_exists: Boolean
}
type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}
input History_reportQueryInput {
  date_modified_ne: DateTime
  epoch_date_submitted: Int
  modifiedBy: String
  inputs_outputs: [String]
  epoch_date_modified_in: [Int]
  cloudinary_id_ne: String
  title_gte: String
  epoch_date_modified_lt: Int
  image_url_gt: String
  date_published_gt: DateTime
  image_url_in: [String]
  title_gt: String
  epoch_date_submitted_gte: Int
  language_gte: String
  date_published_exists: Boolean
  date_modified_gt: DateTime
  modifiedBy_gt: String
  image_url_ne: String
  plain_text_lte: String
  is_incident_report_ne: Boolean
  date_published_in: [DateTime]
  _id: ObjectId
  language_in: [String]
  is_incident_report_exists: Boolean
  epoch_date_downloaded_exists: Boolean
  authors_nin: [String]
  cloudinary_id_lte: String
  report_number_lt: Int
  epoch_date_published_ne: Int
  modifiedBy_gte: String
  url_ne: String
  url_exists: Boolean
  url_lte: String
  url: String
  quiet_ne: Boolean
  modifiedBy_ne: String
  user_exists: Boolean
  date_modified_lte: DateTime
  flag_ne: Boolean
  epoch_date_modified_nin: [Int]
  date_submitted_nin: [DateTime]
  description_exists: Boolean
  epoch_date_published_gte: Int
  _id_lt: ObjectId
  date_downloaded_lte: DateTime
  image_url_gte: String
  embedding: History_reportEmbeddingQueryInput
  plain_text_ne: String
  language_nin: [String]
  source_domain_lt: String
  date_submitted_ne: DateTime
  tags_exists: Boolean
  report_number_nin: [Int]
  description_nin: [String]
  cloudinary_id_nin: [String]
  text_lt: String
  epoch_date_published: Int
  authors_exists: Boolean
  date_submitted_lte: DateTime
  image_url: String
  _id_in: [ObjectId]
  title_exists: Boolean
  editor_notes_lt: String
  epoch_date_downloaded_lte: Int
  language_lte: String
  title_lt: String
  user_lt: String
  user_gte: String
  date_downloaded_exists: Boolean
  AND: [History_reportQueryInput!]
  date_published_ne: DateTime
  date_modified_in: [DateTime]
  date_submitted_gte: DateTime
  description_in: [String]
  embedding_exists: Boolean
  OR: [History_reportQueryInput!]
  description_gt: String
  date_downloaded_lt: DateTime
  _id_ne: ObjectId
  date_modified_lt: DateTime
  report_number_exists: Boolean
  report_number_gte: Int
  date_downloaded: DateTime
  image_url_nin: [String]
  submitters: [String]
  editor_notes_nin: [String]
  modifiedBy_lte: String
  image_url_lt: String
  date_published: DateTime
  date_published_lt: DateTime
  plain_text: String
  _id_gt: ObjectId
  url_gte: String
  title_lte: String
  epoch_date_submitted_nin: [Int]
  language_exists: Boolean
  tags_in: [String]
  authors_in: [String]
  authors: [String]
  url_lt: String
  plain_text_gte: String
  date_submitted: DateTime
  text: String
  epoch_date_published_exists: Boolean
  date_published_gte: DateTime
  modifiedBy_lt: String
  cloudinary_id_lt: String
  epoch_date_downloaded_gt: Int
  epoch_date_modified: Int
  epoch_date_downloaded_lt: Int
  text_exists: Boolean
  epoch_date_published_nin: [Int]
  inputs_outputs_in: [String]
  date_downloaded_in: [DateTime]
  cloudinary_id_gte: String
  epoch_date_submitted_lte: Int
  source_domain_gt: String
  user_ne: String
  source_domain_lte: String
  _id_gte: ObjectId
  editor_notes_gte: String
  description_lte: String
  epoch_date_submitted_exists: Boolean
  date_submitted_gt: DateTime
  date_submitted_in: [DateTime]
  epoch_date_published_lte: Int
  source_domain_nin: [String]
  source_domain: String
  submitters_in: [String]
  date_published_nin: [DateTime]
  _id_exists: Boolean
  cloudinary_id_exists: Boolean
  epoch_date_submitted_lt: Int
  epoch_date_downloaded_ne: Int
  flag: Boolean
  epoch_date_downloaded_in: [Int]
  text_ne: String
  is_incident_report: Boolean
  plain_text_nin: [String]
  user_in: [String]
  epoch_date_modified_lte: Int
  plain_text_in: [String]
  date_modified_exists: Boolean
  quiet_exists: Boolean
  epoch_date_modified_exists: Boolean
  epoch_date_modified_gt: Int
  url_nin: [String]
  tags: [String]
  epoch_date_submitted_gt: Int
  epoch_date_submitted_in: [Int]
  cloudinary_id_gt: String
  epoch_date_modified_ne: Int
  url_gt: String
  editor_notes_lte: String
  language_gt: String
  cloudinary_id: String
  submitters_nin: [String]
  url_in: [String]
  user_gt: String
  date_modified: DateTime
  description_gte: String
  source_domain_in: [String]
  image_url_lte: String
  user: String
  date_downloaded_nin: [DateTime]
  text_in: [String]
  text_gte: String
  report_number_gt: Int
  description_ne: String
  date_modified_gte: DateTime
  title_ne: String
  epoch_date_downloaded_gte: Int
  user_nin: [String]
  inputs_outputs_exists: Boolean
  _id_lte: ObjectId
  inputs_outputs_nin: [String]
  language_ne: String
  epoch_date_downloaded_nin: [Int]
  editor_notes: String
  date_submitted_lt: DateTime
  text_nin: [String]
  epoch_date_published_in: [Int]
  modifiedBy_nin: [String]
  date_published_lte: DateTime
  modifiedBy_exists: Boolean
  plain_text_lt: String
  submitters_exists: Boolean
  editor_notes_in: [String]
  quiet: Boolean
  language_lt: String
  date_modified_nin: [DateTime]
  title: String
  epoch_date_downloaded: Int
  description: String
  source_domain_gte: String
  image_url_exists: Boolean
  plain_text_exists: Boolean
  source_domain_ne: String
  epoch_date_submitted_ne: Int
  epoch_date_modified_gte: Int
  report_number_ne: Int
  title_nin: [String]
  cloudinary_id_in: [String]
  report_number_lte: Int
  epoch_date_published_gt: Int
  text_gt: String
  flag_exists: Boolean
  user_lte: String
  editor_notes_exists: Boolean
  editor_notes_gt: String
  editor_notes_ne: String
  plain_text_gt: String
  modifiedBy_in: [String]
  epoch_date_published_lt: Int
  title_in: [String]
  date_downloaded_ne: DateTime
  _id_nin: [ObjectId]
  description_lt: String
  report_number_in: [Int]
  report_number: Int
  tags_nin: [String]
  date_downloaded_gt: DateTime
  date_submitted_exists: Boolean
  language: String
  date_downloaded_gte: DateTime
  text_lte: String
  source_domain_exists: Boolean
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
type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}
input IncidentTsneQueryInput {
  x: Float
  OR: [IncidentTsneQueryInput!]
  y_lte: Float
  y_in: [Float]
  y_nin: [Float]
  x_lt: Float
  x_in: [Float]
  x_gt: Float
  x_nin: [Float]
  y_exists: Boolean
  y_ne: Float
  x_exists: Boolean
  x_gte: Float
  x_ne: Float
  AND: [IncidentTsneQueryInput!]
  y_lt: Float
  x_lte: Float
  y: Float
  y_gt: Float
  y_gte: Float
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
  _ID_ASC
  DATE_MODIFIED_DESC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  NAME_ASC
  _ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  DATE_MODIFIED_ASC
  NAME_DESC
}
input IncidentAllegedDeployerOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
type CandidateClassification_similarity {
  classification: String
  similarity: Float
}
input IncidentNlp_similar_incidentUpdateInput {
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
}
type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}
enum UserSortByInput {
  LAST_NAME_DESC
  USERID_ASC
  USERID_DESC
  _ID_ASC
  _ID_DESC
  FIRST_NAME_ASC
  FIRST_NAME_DESC
  LAST_NAME_ASC
}
input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}
type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}
input CandidateEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}
input SubscriptionIncident_idRelationInput {
  link: Int
  create: IncidentInsertInput
}
input DuplicateInsertInput {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}
enum QuickaddSortByInput {
  URL_DESC
  _ID_ASC
  _ID_DESC
  DATE_SUBMITTED_DESC
  SOURCE_DOMAIN_ASC
  URL_ASC
  DATE_SUBMITTED_ASC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  SOURCE_DOMAIN_DESC
}
`;
