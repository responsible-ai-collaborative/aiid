import gql from "graphql-tag";

export default gql`
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

input TaxaDummy_fieldInsertInput {
  field_number: String
  short_name: String
}

input History_incidentEmbeddingQueryInput {
  AND: [History_incidentEmbeddingQueryInput!]
  OR: [History_incidentEmbeddingQueryInput!]
  from_reports_exists: Boolean
  from_reports_nin: [Int]
  vector_in: [Float]
  vector_nin: [Float]
  vector_exists: Boolean
  from_reports_in: [Int]
  from_reports: [Int]
  vector: [Float]
}

input SubmissionEmbeddingQueryInput {
  from_text_hash_exists: Boolean
  vector_nin: [Float]
  vector: [Float]
  vector_exists: Boolean
  vector_in: [Float]
  from_text_hash_in: [String]
  from_text_hash_nin: [String]
  from_text_hash_lte: String
  from_text_hash_lt: String
  from_text_hash_gt: String
  from_text_hash: String
  from_text_hash_ne: String
  OR: [SubmissionEmbeddingQueryInput!]
  AND: [SubmissionEmbeddingQueryInput!]
  from_text_hash_gte: String
}

type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}

enum ChecklistSortByInput {
  ID_ASC
  OWNER_ID_DESC
  _ID_ASC
  _ID_DESC
  DATE_CREATED_ASC
  DATE_UPDATED_ASC
  DATE_UPDATED_DESC
  ENTITY_ID_ASC
  ABOUT_ASC
  ABOUT_DESC
  DATE_CREATED_DESC
  ID_DESC
  ENTITY_ID_DESC
  OWNER_ID_ASC
  NAME_ASC
  NAME_DESC
}

input TaxaInsertInput {
  weight: Int
  _id: ObjectId
  complete_entities: Boolean
  description: String
  dummy_fields: [TaxaDummy_fieldInsertInput]
  field_list: [TaxaField_listInsertInput]
  namespace: String
}

type ReportTranslation {
  text: String
  title: String
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

type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input History_incidentNlp_similar_incidentUpdateInput {
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
}

input ChecklistRiskQueryInput {
  risk_status_lte: String
  touched_exists: Boolean
  tags: [String]
  id_gte: String
  tags_exists: Boolean
  risk_status_gt: String
  likelihood: String
  risk_notes_lt: String
  id_exists: Boolean
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  likelihood_gte: String
  severity: String
  tags_in: [String]
  likelihood_lte: String
  likelihood_nin: [String]
  risk_status: String
  risk_notes_lte: String
  risk_notes_in: [String]
  severity_exists: Boolean
  OR: [ChecklistRiskQueryInput!]
  AND: [ChecklistRiskQueryInput!]
  risk_status_nin: [String]
  generated_ne: Boolean
  precedents: [ChecklistRiskPrecedentQueryInput]
  risk_notes_ne: String
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  id_lt: String
  risk_status_lt: String
  id_lte: String
  id: String
  precedents_exists: Boolean
  severity_lte: String
  generated: Boolean
  generated_exists: Boolean
  severity_ne: String
  severity_gt: String
  risk_notes_exists: Boolean
  risk_status_exists: Boolean
  id_nin: [String]
  title_gt: String
  tags_nin: [String]
  likelihood_gt: String
  risk_notes_nin: [String]
  severity_nin: [String]
  risk_status_ne: String
  likelihood_exists: Boolean
  severity_in: [String]
  title_lte: String
  title_ne: String
  likelihood_in: [String]
  risk_notes_gte: String
  id_ne: String
  severity_lt: String
  risk_notes_gt: String
  touched: Boolean
  title_nin: [String]
  risk_status_gte: String
  id_gt: String
  title_exists: Boolean
  touched_ne: Boolean
  likelihood_ne: String
  title: String
  title_in: [String]
  id_in: [String]
  risk_notes: String
  title_gte: String
  risk_status_in: [String]
  severity_gte: String
  title_lt: String
  likelihood_lt: String
}

enum EntitySortByInput {
  DATE_MODIFIED_ASC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  NAME_DESC
  NAME_ASC
  _ID_ASC
  _ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  DATE_MODIFIED_DESC
}

input QuickaddInsertInput {
  incident_id: Long
  source_domain: String
  url: String!
  _id: ObjectId
  date_submitted: String!
}

input TaxaDummy_fieldUpdateInput {
  field_number: String
  field_number_unset: Boolean
  short_name: String
  short_name_unset: Boolean
}

input CreateVariantInput {
  variant: CreateVariantInputVariant
  incidentId: Int
}

input ReportUpdateInput {
  tags: [String]
  date_downloaded: DateTime
  url: String
  language_unset: Boolean
  epoch_date_submitted: Int
  embedding_unset: Boolean
  description: String
  plain_text_unset: Boolean
  is_incident_report_unset: Boolean
  cloudinary_id: String
  report_number_inc: Int
  editor_notes: String
  text: String
  flag: Boolean
  is_incident_report: Boolean
  _id: ObjectId
  date_modified_unset: Boolean
  epoch_date_submitted_unset: Boolean
  embedding: ReportEmbeddingUpdateInput
  text_unset: Boolean
  title: String
  image_url: String
  user_unset: Boolean
  date_submitted_unset: Boolean
  cloudinary_id_unset: Boolean
  quiet: Boolean
  date_published_unset: Boolean
  report_number_unset: Boolean
  epoch_date_published_inc: Int
  tags_unset: Boolean
  authors_unset: Boolean
  description_unset: Boolean
  flag_unset: Boolean
  title_unset: Boolean
  date_published: DateTime
  date_downloaded_unset: Boolean
  quiet_unset: Boolean
  epoch_date_modified_unset: Boolean
  epoch_date_downloaded_inc: Int
  epoch_date_submitted_inc: Int
  language: String
  inputs_outputs_unset: Boolean
  report_number: Int
  url_unset: Boolean
  editor_notes_unset: Boolean
  source_domain: String
  image_url_unset: Boolean
  submitters: [String]
  date_modified: DateTime
  epoch_date_downloaded: Int
  user: ReportUserRelationInput
  epoch_date_published: Int
  plain_text: String
  inputs_outputs: [String]
  epoch_date_published_unset: Boolean
  authors: [String]
  _id_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  epoch_date_modified: Int
  date_submitted: DateTime
  epoch_date_modified_inc: Int
  source_domain_unset: Boolean
  submitters_unset: Boolean
}

input QuickaddQueryInput {
  date_submitted_in: [String]
  url_gte: String
  incident_id_nin: [Long]
  url_lte: String
  incident_id: Long
  url_exists: Boolean
  source_domain_lte: String
  url_gt: String
  incident_id_gt: Long
  source_domain_gt: String
  _id_ne: ObjectId
  date_submitted: String
  source_domain_lt: String
  incident_id_in: [Long]
  url: String
  url_lt: String
  _id_in: [ObjectId]
  source_domain_gte: String
  _id_gt: ObjectId
  source_domain_ne: String
  AND: [QuickaddQueryInput!]
  _id: ObjectId
  incident_id_gte: Long
  incident_id_ne: Long
  source_domain_exists: Boolean
  _id_lte: ObjectId
  date_submitted_gte: String
  incident_id_lt: Long
  _id_lt: ObjectId
  incident_id_lte: Long
  source_domain_in: [String]
  _id_gte: ObjectId
  _id_exists: Boolean
  incident_id_exists: Boolean
  source_domain_nin: [String]
  date_submitted_nin: [String]
  _id_nin: [ObjectId]
  date_submitted_ne: String
  date_submitted_lt: String
  date_submitted_gt: String
  date_submitted_lte: String
  url_nin: [String]
  OR: [QuickaddQueryInput!]
  source_domain: String
  url_ne: String
  url_in: [String]
  date_submitted_exists: Boolean
}

type History_incidentTsne {
  x: Float
  y: Float
}

enum QuickaddSortByInput {
  INCIDENT_ID_DESC
  SOURCE_DOMAIN_ASC
  URL_ASC
  URL_DESC
  SOURCE_DOMAIN_DESC
  _ID_ASC
  _ID_DESC
  DATE_SUBMITTED_ASC
  DATE_SUBMITTED_DESC
  INCIDENT_ID_ASC
}

input SubmissionNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}

input IncidentEmbeddingInsertInput {
  vector: [Float]
  from_reports: [Int]
}

input NotificationQueryInput {
  type_nin: [String]
  _id_gt: ObjectId
  incident_id_ne: Int
  type: String
  incident_id_gt: Int
  sentDate_gt: DateTime
  processed_ne: Boolean
  sentDate_lt: DateTime
  sentDate: DateTime
  AND: [NotificationQueryInput!]
  _id_gte: ObjectId
  _id_lt: ObjectId
  userId_exists: Boolean
  OR: [NotificationQueryInput!]
  _id_in: [ObjectId]
  type_lte: String
  incident_id_in: [Int]
  _id_exists: Boolean
  sentDate_in: [DateTime]
  type_lt: String
  incident_id_lte: Int
  _id_ne: ObjectId
  _id_lte: ObjectId
  sentDate_ne: DateTime
  incident_id_lt: Int
  incident_id_nin: [Int]
  incident_id: Int
  incident_id_gte: Int
  type_gt: String
  type_in: [String]
  type_exists: Boolean
  sentDate_exists: Boolean
  type_gte: String
  processed: Boolean
  userId: UserQueryInput
  _id: ObjectId
  processed_exists: Boolean
  type_ne: String
  _id_nin: [ObjectId]
  sentDate_gte: DateTime
  sentDate_nin: [DateTime]
  incident_id_exists: Boolean
  sentDate_lte: DateTime
}

type InsertManyPayload {
  insertedIds: [ObjectId]!
}

input NotificationUpdateInput {
  sentDate: DateTime
  incident_id_inc: Int
  sentDate_unset: Boolean
  _id: ObjectId
  processed: Boolean
  type: String
  userId_unset: Boolean
  _id_unset: Boolean
  userId: NotificationUserIdRelationInput
  processed_unset: Boolean
  incident_id: Int
  incident_id_unset: Boolean
  type_unset: Boolean
}

input ChecklistUpdateInput {
  risks_unset: Boolean
  date_created_unset: Boolean
  tags_other: [String]
  entity_id_unset: Boolean
  risks: [ChecklistRiskUpdateInput]
  date_updated: DateTime
  entity_id: String
  id: String
  about: String
  _id: ObjectId
  name: String
  date_created: DateTime
  name_unset: Boolean
  owner_id_unset: Boolean
  date_updated_unset: Boolean
  owner_id: String
  tags_methods: [String]
  tags_methods_unset: Boolean
  tags_other_unset: Boolean
  tags_goals_unset: Boolean
  tags_goals: [String]
  _id_unset: Boolean
  id_unset: Boolean
  about_unset: Boolean
}

input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input ClassificationUpdateInput {
  incidents: ClassificationIncidentsRelationInput
  reports: ClassificationReportsRelationInput
  publish_unset: Boolean
  _id_unset: Boolean
  attributes: [ClassificationAttributeUpdateInput]
  attributes_unset: Boolean
  reports_unset: Boolean
  incidents_unset: Boolean
  notes: String
  notes_unset: Boolean
  namespace: String
  publish: Boolean
  namespace_unset: Boolean
  _id: ObjectId
}

enum ReportSortByInput {
  DATE_PUBLISHED_ASC
  EDITOR_NOTES_ASC
  TITLE_ASC
  TEXT_ASC
  URL_DESC
  _ID_DESC
  DATE_DOWNLOADED_DESC
  DATE_SUBMITTED_DESC
  EPOCH_DATE_MODIFIED_DESC
  PLAIN_TEXT_ASC
  EPOCH_DATE_PUBLISHED_ASC
  DATE_MODIFIED_DESC
  DESCRIPTION_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_SUBMITTED_DESC
  LANGUAGE_ASC
  SOURCE_DOMAIN_DESC
  URL_ASC
  _ID_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  LANGUAGE_DESC
  SOURCE_DOMAIN_ASC
  TEXT_DESC
  USER_DESC
  EPOCH_DATE_SUBMITTED_ASC
  IMAGE_URL_ASC
  IMAGE_URL_DESC
  REPORT_NUMBER_ASC
  REPORT_NUMBER_DESC
  CLOUDINARY_ID_ASC
  CLOUDINARY_ID_DESC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_MODIFIED_ASC
  TITLE_DESC
  USER_ASC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_ASC
  DATE_SUBMITTED_ASC
  EDITOR_NOTES_DESC
  PLAIN_TEXT_DESC
}

input TaxaDummy_fieldQueryInput {
  field_number_gt: String
  field_number_in: [String]
  short_name_lte: String
  field_number: String
  field_number_ne: String
  short_name_gte: String
  OR: [TaxaDummy_fieldQueryInput!]
  field_number_lte: String
  AND: [TaxaDummy_fieldQueryInput!]
  short_name_nin: [String]
  short_name_exists: Boolean
  short_name_in: [String]
  short_name_lt: String
  short_name: String
  field_number_lt: String
  field_number_exists: Boolean
  short_name_gt: String
  field_number_nin: [String]
  field_number_gte: String
  short_name_ne: String
}

type IncidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input ClassificationAttributeQueryInput {
  short_name_gt: String
  AND: [ClassificationAttributeQueryInput!]
  value_json: String
  short_name_ne: String
  short_name_lt: String
  short_name_exists: Boolean
  value_json_nin: [String]
  short_name: String
  short_name_gte: String
  value_json_in: [String]
  short_name_in: [String]
  value_json_gt: String
  value_json_gte: String
  value_json_ne: String
  value_json_exists: Boolean
  OR: [ClassificationAttributeQueryInput!]
  value_json_lte: String
  short_name_nin: [String]
  short_name_lte: String
  value_json_lt: String
}

type CreateVariantPayload {
  incident_id: Int
  report_number: Int
}

input History_reportEmbeddingQueryInput {
  from_text_hash_gt: String
  from_text_hash_nin: [String]
  from_text_hash_ne: String
  vector_exists: Boolean
  from_text_hash_lt: String
  from_text_hash_in: [String]
  OR: [History_reportEmbeddingQueryInput!]
  AND: [History_reportEmbeddingQueryInput!]
  vector: [Float]
  from_text_hash_lte: String
  from_text_hash_gte: String
  from_text_hash_exists: Boolean
  vector_in: [Float]
  vector_nin: [Float]
  from_text_hash: String
}

input TaxaField_listItem_fieldComplete_fromQueryInput {
  current: [String]
  entities_ne: Boolean
  current_in: [String]
  all_nin: [String]
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all: [String]
  all_in: [String]
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  current_nin: [String]
  current_exists: Boolean
  all_exists: Boolean
  entities_exists: Boolean
  entities: Boolean
}

input LinkReportsToIncidentsInput {
  report_numbers: [Int]
  incident_ids: [Int]
}

input CandidateEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input IncidentInsertInput {
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  editor_notes: String
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  reports: IncidentReportsRelationInput!
  flagged_dissimilar_incidents: [Int]
  editor_similar_incidents: [Int]
  epoch_date_modified: Int
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  incident_id: Int!
  editors: IncidentEditorsRelationInput!
  title: String!
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  _id: ObjectId
  tsne: IncidentTsneInsertInput
  description: String
  editor_dissimilar_incidents: [Int]
  embedding: IncidentEmbeddingInsertInput
  date: String!
}

input History_incidentQueryInput {
  flagged_dissimilar_incidents_nin: [Int]
  date_ne: String
  incident_id_nin: [Int]
  description_lt: String
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  title_gt: String
  incident_id_gte: Int
  AllegedDeveloperOfAISystem_nin: [String]
  date_lt: String
  description_ne: String
  reports_in: [Int]
  AllegedDeveloperOfAISystem: [String]
  incident_id_in: [Int]
  flagged_dissimilar_incidents_exists: Boolean
  incident_id: Int
  _id_lt: ObjectId
  AllegedDeployerOfAISystem: [String]
  editor_dissimilar_incidents_exists: Boolean
  title_in: [String]
  editor_notes_exists: Boolean
  description_lte: String
  incident_id_exists: Boolean
  editors_nin: [String]
  editor_dissimilar_incidents: [Int]
  epoch_date_modified_gte: Int
  _id_nin: [ObjectId]
  editor_notes_in: [String]
  embedding: History_incidentEmbeddingQueryInput
  editor_notes_lte: String
  _id_exists: Boolean
  epoch_date_modified_lte: Int
  AllegedDeployerOfAISystem_exists: Boolean
  description_gt: String
  title_gte: String
  tsne: History_incidentTsneQueryInput
  editor_similar_incidents_exists: Boolean
  AND: [History_incidentQueryInput!]
  embedding_exists: Boolean
  editor_notes_nin: [String]
  modifiedBy_in: [String]
  modifiedBy_gte: String
  epoch_date_modified_lt: Int
  flagged_dissimilar_incidents_in: [Int]
  editor_notes_lt: String
  modifiedBy_lte: String
  date_nin: [String]
  editor_dissimilar_incidents_nin: [Int]
  editor_dissimilar_incidents_in: [Int]
  epoch_date_modified_nin: [Int]
  date_gt: String
  date_gte: String
  title_lte: String
  date: String
  date_lte: String
  tsne_exists: Boolean
  _id_lte: ObjectId
  epoch_date_modified_ne: Int
  modifiedBy_lt: String
  modifiedBy_exists: Boolean
  title_ne: String
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  modifiedBy_nin: [String]
  OR: [History_incidentQueryInput!]
  reports: [Int]
  AllegedDeveloperOfAISystem_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  modifiedBy_gt: String
  modifiedBy_ne: String
  incident_id_lte: Int
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  nlp_similar_incidents_exists: Boolean
  AllegedDeployerOfAISystem_nin: [String]
  editor_similar_incidents_in: [Int]
  title_lt: String
  editor_similar_incidents_nin: [Int]
  editor_notes_gte: String
  editor_notes: String
  _id_in: [ObjectId]
  incident_id_lt: Int
  editors: [String]
  incident_id_gt: Int
  title: String
  description_exists: Boolean
  description_nin: [String]
  editor_similar_incidents: [Int]
  editors_in: [String]
  title_exists: Boolean
  reports_nin: [Int]
  AllegedHarmedOrNearlyHarmedParties: [String]
  description: String
  editor_notes_ne: String
  flagged_dissimilar_incidents: [Int]
  _id: ObjectId
  epoch_date_modified_gt: Int
  epoch_date_modified: Int
  title_nin: [String]
  editors_exists: Boolean
  AllegedDeployerOfAISystem_in: [String]
  epoch_date_modified_in: [Int]
  _id_ne: ObjectId
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  _id_gt: ObjectId
  AllegedDeveloperOfAISystem_in: [String]
  description_in: [String]
  editor_notes_gt: String
  incident_id_ne: Int
  epoch_date_modified_exists: Boolean
  description_gte: String
  modifiedBy: String
  _id_gte: ObjectId
  reports_exists: Boolean
  date_in: [String]
  date_exists: Boolean
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

input ReportEmbeddingUpdateInput {
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
}

type Entity {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}

input UpdateOneReportTranslationInput {
  language: String!
  plain_text: String!
  report_number: Int!
  text: String!
  title: String!
}

input History_incidentEmbeddingInsertInput {
  vector: [Float]
  from_reports: [Int]
}

input IncidentUpdateInput {
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  reports: IncidentReportsRelationInput
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  tsne: IncidentTsneUpdateInput
  epoch_date_modified: Int
  _id_unset: Boolean
  reports_unset: Boolean
  incident_id_unset: Boolean
  tsne_unset: Boolean
  description: String
  flagged_dissimilar_incidents: [Int]
  editors_unset: Boolean
  embedding_unset: Boolean
  epoch_date_modified_unset: Boolean
  editor_notes_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  description_unset: Boolean
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  editor_similar_incidents_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  date: String
  epoch_date_modified_inc: Int
  AllegedDeployerOfAISystem_unset: Boolean
  editor_dissimilar_incidents: [Int]
  embedding: IncidentEmbeddingUpdateInput
  incident_id_inc: Int
  editor_notes: String
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  _id: ObjectId
  editor_dissimilar_incidents_unset: Boolean
  editor_similar_incidents: [Int]
  title: String
  editors: IncidentEditorsRelationInput
  date_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  title_unset: Boolean
  incident_id: Int
  nlp_similar_incidents_unset: Boolean
}

input IncidentEmbeddingUpdateInput {
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
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

input SubmissionNlp_similar_incidentUpdateInput {
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
}

input ChecklistRiskPrecedentUpdateInput {
  incident_id_unset: Boolean
  tags_unset: Boolean
  title_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  description: String
  tags: [String]
  description_unset: Boolean
  title: String
}

input History_reportEmbeddingUpdateInput {
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
}

type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

type DeleteManyPayload {
  deletedCount: Int!
}

input EntityInsertInput {
  name: String!
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
}

input SubmissionEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input ChecklistQueryInput {
  about_exists: Boolean
  tags_goals_nin: [String]
  id_lt: String
  date_updated_lt: DateTime
  _id: ObjectId
  date_created_gt: DateTime
  _id_gte: ObjectId
  tags_other: [String]
  date_updated_in: [DateTime]
  tags_goals_exists: Boolean
  owner_id: String
  date_updated: DateTime
  tags_methods: [String]
  entity_id_ne: String
  tags_other_exists: Boolean
  about_gt: String
  _id_in: [ObjectId]
  name_lte: String
  about_lt: String
  _id_ne: ObjectId
  tags_goals_in: [String]
  tags_methods_nin: [String]
  entity_id_nin: [String]
  name: String
  entity_id_gte: String
  about_gte: String
  risks_nin: [ChecklistRiskQueryInput]
  name_lt: String
  id_exists: Boolean
  tags_goals: [String]
  date_created_in: [DateTime]
  date_created_lt: DateTime
  entity_id_lt: String
  entity_id_exists: Boolean
  name_gt: String
  entity_id_gt: String
  _id_lt: ObjectId
  date_updated_exists: Boolean
  date_updated_nin: [DateTime]
  date_created_lte: DateTime
  about: String
  about_nin: [String]
  date_updated_lte: DateTime
  risks_exists: Boolean
  owner_id_nin: [String]
  _id_exists: Boolean
  entity_id_lte: String
  date_created: DateTime
  id_ne: String
  date_created_nin: [DateTime]
  _id_gt: ObjectId
  id_lte: String
  entity_id: String
  name_in: [String]
  id_gt: String
  owner_id_in: [String]
  name_ne: String
  date_updated_gt: DateTime
  _id_lte: ObjectId
  about_ne: String
  risks_in: [ChecklistRiskQueryInput]
  id_nin: [String]
  tags_methods_in: [String]
  date_created_exists: Boolean
  owner_id_exists: Boolean
  about_lte: String
  owner_id_gte: String
  owner_id_gt: String
  date_updated_gte: DateTime
  name_exists: Boolean
  owner_id_ne: String
  _id_nin: [ObjectId]
  tags_methods_exists: Boolean
  entity_id_in: [String]
  about_in: [String]
  owner_id_lt: String
  owner_id_lte: String
  tags_other_nin: [String]
  date_created_ne: DateTime
  id: String
  name_nin: [String]
  risks: [ChecklistRiskQueryInput]
  OR: [ChecklistQueryInput!]
  date_created_gte: DateTime
  id_gte: String
  AND: [ChecklistQueryInput!]
  tags_other_in: [String]
  name_gte: String
  id_in: [String]
  date_updated_ne: DateTime
}

input History_incidentUpdateInput {
  AllegedHarmedOrNearlyHarmedParties: [String]
  editor_dissimilar_incidents_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  modifiedBy_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  embedding: History_incidentEmbeddingUpdateInput
  reports: [Int]
  AllegedDeveloperOfAISystem: [String]
  AllegedDeployerOfAISystem: [String]
  editor_dissimilar_incidents: [Int]
  flagged_dissimilar_incidents: [Int]
  date: String
  tsne: History_incidentTsneUpdateInput
  incident_id: Int
  nlp_similar_incidents_unset: Boolean
  epoch_date_modified_inc: Int
  editor_notes: String
  title_unset: Boolean
  incident_id_inc: Int
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  editor_similar_incidents: [Int]
  _id_unset: Boolean
  epoch_date_modified_unset: Boolean
  editors_unset: Boolean
  title: String
  AllegedDeveloperOfAISystem_unset: Boolean
  incident_id_unset: Boolean
  tsne_unset: Boolean
  AllegedDeployerOfAISystem_unset: Boolean
  _id: ObjectId
  description_unset: Boolean
  date_unset: Boolean
  epoch_date_modified: Int
  editor_similar_incidents_unset: Boolean
  reports_unset: Boolean
  editor_notes_unset: Boolean
  editors: [String]
  modifiedBy: String
  embedding_unset: Boolean
  description: String
}

input SubmissionEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input ClassificationReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

input History_reportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}

type TaxaDummy_field {
  field_number: String
  short_name: String
}

input UserUpdateInput {
  last_name_unset: Boolean
  first_name_unset: Boolean
  roles: [String]
  _id_unset: Boolean
  first_name: String
  roles_unset: Boolean
  userId_unset: Boolean
  last_name: String
  userId: String
  _id: ObjectId
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

input CandidateQueryInput {
  image_url_lt: String
  plain_text_gte: String
  url_ne: String
  _id_gte: ObjectId
  similarity_in: [Float]
  image_url_in: [String]
  image_url_gt: String
  similarity_lte: Float
  date_downloaded_gt: String
  plain_text_exists: Boolean
  url_lt: String
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  plain_text_ne: String
  epoch_date_downloaded_gt: Int
  epoch_date_published_gte: Int
  classification_similarity_exists: Boolean
  source_domain_lte: String
  embedding_exists: Boolean
  text_ne: String
  image_url_ne: String
  epoch_date_downloaded_nin: [Int]
  source_domain: String
  url_exists: Boolean
  authors: [String]
  text_gt: String
  title_gte: String
  source_domain_ne: String
  epoch_date_downloaded_gte: Int
  image_url_exists: Boolean
  date_published_in: [String]
  plain_text_in: [String]
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  language_ne: String
  date_downloaded_lt: String
  title_in: [String]
  text_lte: String
  similarity_ne: Float
  matching_entities_exists: Boolean
  authors_nin: [String]
  epoch_date_downloaded_exists: Boolean
  epoch_date_published_ne: Int
  source_domain_gt: String
  text_nin: [String]
  url_in: [String]
  _id_nin: [ObjectId]
  matching_entities: [String]
  matching_harm_keywords_exists: Boolean
  match: Boolean
  date_published_gt: String
  match_ne: Boolean
  epoch_date_downloaded_lt: Int
  epoch_date_published: Int
  date_published_exists: Boolean
  title_ne: String
  plain_text_lt: String
  epoch_date_published_lt: Int
  matching_keywords_exists: Boolean
  date_published_ne: String
  dismissed: Boolean
  epoch_date_published_nin: [Int]
  url_gte: String
  plain_text_gt: String
  title_lte: String
  language_gt: String
  similarity_exists: Boolean
  similarity: Float
  date_downloaded_lte: String
  language: String
  text_gte: String
  _id_lt: ObjectId
  date_published_gte: String
  language_exists: Boolean
  source_domain_exists: Boolean
  epoch_date_downloaded_ne: Int
  date_downloaded_gte: String
  plain_text: String
  date_downloaded_ne: String
  title_lt: String
  dismissed_ne: Boolean
  image_url_gte: String
  similarity_gte: Float
  title: String
  text_in: [String]
  epoch_date_downloaded_in: [Int]
  similarity_lt: Float
  epoch_date_published_gt: Int
  date_downloaded_exists: Boolean
  epoch_date_downloaded: Int
  language_gte: String
  epoch_date_published_lte: Int
  classification_similarity: [CandidateClassification_similarityQueryInput]
  language_lte: String
  source_domain_lt: String
  language_nin: [String]
  date_downloaded: String
  title_gt: String
  date_downloaded_nin: [String]
  date_published: String
  image_url_lte: String
  plain_text_nin: [String]
  title_nin: [String]
  _id_exists: Boolean
  similarity_gt: Float
  image_url_nin: [String]
  epoch_date_published_in: [Int]
  date_published_nin: [String]
  matching_harm_keywords: [String]
  _id_ne: ObjectId
  OR: [CandidateQueryInput!]
  title_exists: Boolean
  matching_keywords: [String]
  language_in: [String]
  matching_entities_nin: [String]
  matching_keywords_in: [String]
  url_gt: String
  _id_in: [ObjectId]
  epoch_date_published_exists: Boolean
  matching_harm_keywords_in: [String]
  _id_gt: ObjectId
  url_nin: [String]
  dismissed_exists: Boolean
  url_lte: String
  url: String
  matching_harm_keywords_nin: [String]
  AND: [CandidateQueryInput!]
  source_domain_nin: [String]
  date_downloaded_in: [String]
  language_lt: String
  epoch_date_downloaded_lte: Int
  authors_in: [String]
  embedding: CandidateEmbeddingQueryInput
  similarity_nin: [Float]
  text_exists: Boolean
  matching_keywords_nin: [String]
  date_published_lte: String
  source_domain_in: [String]
  _id: ObjectId
  matching_entities_in: [String]
  image_url: String
  authors_exists: Boolean
  _id_lte: ObjectId
  text: String
  date_published_lt: String
  text_lt: String
  plain_text_lte: String
  source_domain_gte: String
  match_exists: Boolean
}

type CandidateClassification_similarity {
  classification: String
  similarity: Float
}

input ReportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

scalar DateTime

type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input ReportUserRelationInput {
  create: UserInsertInput
  link: String
}

type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

input DuplicateInsertInput {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input CreateDefaultAdminUserInput {
  password: String
  email: String
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

type IncidentTsne {
  x: Float
  y: Float
}

type LogIncidentHistoryPayload {
  incident_id: Int
}

input History_reportQueryInput {
  image_url_in: [String]
  epoch_date_submitted_lte: Int
  date_published_ne: DateTime
  epoch_date_published_lte: Int
  epoch_date_submitted_ne: Int
  epoch_date_modified_gte: Int
  report_number_gte: Int
  quiet: Boolean
  title: String
  date_downloaded_gte: DateTime
  flag_ne: Boolean
  url_gte: String
  url_exists: Boolean
  modifiedBy_in: [String]
  date_downloaded: DateTime
  date_published_exists: Boolean
  report_number_nin: [Int]
  tags_exists: Boolean
  user: String
  _id_gte: ObjectId
  title_ne: String
  modifiedBy_gte: String
  title_gte: String
  editor_notes_gte: String
  embedding: History_reportEmbeddingQueryInput
  text_in: [String]
  source_domain_nin: [String]
  epoch_date_submitted_nin: [Int]
  epoch_date_downloaded_ne: Int
  date_modified: DateTime
  date_downloaded_lt: DateTime
  text_ne: String
  date_submitted_lt: DateTime
  cloudinary_id: String
  date_downloaded_lte: DateTime
  cloudinary_id_nin: [String]
  epoch_date_downloaded_lte: Int
  date_submitted: DateTime
  tags: [String]
  user_lt: String
  editor_notes_exists: Boolean
  description: String
  url: String
  epoch_date_submitted_in: [Int]
  epoch_date_submitted_gte: Int
  _id: ObjectId
  date_modified_gte: DateTime
  _id_exists: Boolean
  language_lte: String
  authors_in: [String]
  description_lte: String
  source_domain_exists: Boolean
  authors_nin: [String]
  editor_notes_gt: String
  modifiedBy_lte: String
  text_gte: String
  image_url_lt: String
  title_exists: Boolean
  modifiedBy_ne: String
  source_domain_in: [String]
  date_submitted_gt: DateTime
  date_downloaded_nin: [DateTime]
  date_published_gt: DateTime
  _id_in: [ObjectId]
  modifiedBy_gt: String
  modifiedBy_lt: String
  description_in: [String]
  url_gt: String
  date_submitted_ne: DateTime
  date_submitted_gte: DateTime
  epoch_date_published: Int
  epoch_date_downloaded_gte: Int
  quiet_exists: Boolean
  plain_text_gte: String
  language_gt: String
  language_lt: String
  source_domain_lte: String
  report_number_ne: Int
  epoch_date_submitted: Int
  plain_text_lte: String
  cloudinary_id_in: [String]
  url_in: [String]
  plain_text_lt: String
  text_exists: Boolean
  epoch_date_modified_gt: Int
  url_lte: String
  epoch_date_downloaded_gt: Int
  cloudinary_id_lt: String
  text_lt: String
  date_downloaded_in: [DateTime]
  is_incident_report_ne: Boolean
  inputs_outputs_in: [String]
  report_number_exists: Boolean
  date_submitted_nin: [DateTime]
  authors_exists: Boolean
  _id_lte: ObjectId
  language_ne: String
  date_published_lt: DateTime
  title_lte: String
  epoch_date_modified: Int
  date_published_gte: DateTime
  cloudinary_id_ne: String
  date_downloaded_ne: DateTime
  is_incident_report_exists: Boolean
  date_submitted_lte: DateTime
  user_nin: [String]
  source_domain_ne: String
  user_gte: String
  date_published_nin: [DateTime]
  modifiedBy: String
  description_exists: Boolean
  language_exists: Boolean
  epoch_date_downloaded_exists: Boolean
  date_modified_gt: DateTime
  date_downloaded_exists: Boolean
  cloudinary_id_lte: String
  image_url_nin: [String]
  title_gt: String
  epoch_date_modified_ne: Int
  submitters_nin: [String]
  editor_notes_nin: [String]
  flag: Boolean
  epoch_date_downloaded_lt: Int
  epoch_date_submitted_gt: Int
  embedding_exists: Boolean
  image_url_exists: Boolean
  url_lt: String
  text_nin: [String]
  url_nin: [String]
  report_number_lt: Int
  _id_nin: [ObjectId]
  editor_notes_lte: String
  image_url: String
  tags_nin: [String]
  epoch_date_submitted_exists: Boolean
  epoch_date_published_lt: Int
  submitters: [String]
  language_in: [String]
  source_domain_lt: String
  date_submitted_exists: Boolean
  url_ne: String
  quiet_ne: Boolean
  title_nin: [String]
  epoch_date_modified_nin: [Int]
  epoch_date_modified_exists: Boolean
  date_submitted_in: [DateTime]
  epoch_date_published_ne: Int
  date_modified_lt: DateTime
  language_nin: [String]
  inputs_outputs_nin: [String]
  epoch_date_modified_lte: Int
  report_number: Int
  authors: [String]
  user_lte: String
  cloudinary_id_exists: Boolean
  date_modified_ne: DateTime
  title_in: [String]
  language_gte: String
  submitters_exists: Boolean
  epoch_date_submitted_lt: Int
  image_url_gte: String
  is_incident_report: Boolean
  plain_text_ne: String
  description_gte: String
  epoch_date_modified_lt: Int
  inputs_outputs: [String]
  epoch_date_published_nin: [Int]
  user_in: [String]
  submitters_in: [String]
  language: String
  date_modified_lte: DateTime
  editor_notes: String
  plain_text: String
  tags_in: [String]
  source_domain_gte: String
  epoch_date_published_in: [Int]
  date_published_in: [DateTime]
  description_nin: [String]
  image_url_ne: String
  text_lte: String
  description_gt: String
  text_gt: String
  image_url_gt: String
  date_modified_nin: [DateTime]
  epoch_date_published_exists: Boolean
  flag_exists: Boolean
  report_number_lte: Int
  epoch_date_downloaded_nin: [Int]
  plain_text_gt: String
  date_modified_exists: Boolean
  plain_text_in: [String]
  plain_text_nin: [String]
  date_published_lte: DateTime
  _id_ne: ObjectId
  image_url_lte: String
  date_downloaded_gt: DateTime
  text: String
  _id_gt: ObjectId
  OR: [History_reportQueryInput!]
  report_number_gt: Int
  _id_lt: ObjectId
  source_domain_gt: String
  user_ne: String
  user_gt: String
  cloudinary_id_gt: String
  epoch_date_modified_in: [Int]
  modifiedBy_exists: Boolean
  editor_notes_ne: String
  user_exists: Boolean
  report_number_in: [Int]
  epoch_date_published_gte: Int
  description_lt: String
  epoch_date_published_gt: Int
  source_domain: String
  title_lt: String
  cloudinary_id_gte: String
  editor_notes_in: [String]
  date_published: DateTime
  epoch_date_downloaded_in: [Int]
  modifiedBy_nin: [String]
  date_modified_in: [DateTime]
  inputs_outputs_exists: Boolean
  epoch_date_downloaded: Int
  plain_text_exists: Boolean
  AND: [History_reportQueryInput!]
  description_ne: String
  editor_notes_lt: String
}

input SubmissionIncident_editorsRelationInput {
  link: [String]
  create: [UserInsertInput]
}

input ClassificationIncidentsRelationInput {
  link: [Int]
  create: [IncidentInsertInput]
}

input SubscriptionQueryInput {
  type_exists: Boolean
  type_gte: String
  userId_exists: Boolean
  _id_nin: [ObjectId]
  _id_ne: ObjectId
  incident_id_exists: Boolean
  entityId: EntityQueryInput
  AND: [SubscriptionQueryInput!]
  type_gt: String
  incident_id: IncidentQueryInput
  type: String
  _id_lt: ObjectId
  _id_lte: ObjectId
  _id_in: [ObjectId]
  userId: UserQueryInput
  type_lte: String
  type_lt: String
  entityId_exists: Boolean
  _id_gt: ObjectId
  type_ne: String
  OR: [SubscriptionQueryInput!]
  _id: ObjectId
  _id_exists: Boolean
  _id_gte: ObjectId
  type_in: [String]
  type_nin: [String]
}

input ClassificationAttributeInsertInput {
  short_name: String
  value_json: String
}

input TaxaField_listInsertInput {
  long_name: String
  complete_from: TaxaField_listComplete_fromInsertInput
  public: Boolean
  permitted_values: [String]
  field_number: String
  display_type: String
  placeholder: String
  default: String
  short_name: String
  hide_search: Boolean
  short_description: String
  weight: Int
  required: Boolean
  instant_facet: Boolean
  item_fields: TaxaField_listItem_fieldInsertInput
  mongo_type: String
  long_description: String
}

input TaxaField_listItem_fieldComplete_fromUpdateInput {
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  entities: Boolean
  entities_unset: Boolean
  all: [String]
}

input TaxaField_listQueryInput {
  mongo_type_nin: [String]
  long_name_nin: [String]
  placeholder_in: [String]
  short_description_lte: String
  field_number_nin: [String]
  short_description: String
  display_type_ne: String
  long_description_in: [String]
  placeholder_gt: String
  instant_facet_exists: Boolean
  permitted_values_nin: [String]
  display_type_lt: String
  weight_ne: Int
  field_number_ne: String
  long_name_exists: Boolean
  public_exists: Boolean
  required: Boolean
  OR: [TaxaField_listQueryInput!]
  short_description_gt: String
  mongo_type_lt: String
  long_description_lt: String
  default_lt: String
  display_type_lte: String
  display_type_nin: [String]
  short_name_lte: String
  placeholder_ne: String
  long_name_lte: String
  default_gt: String
  field_number_in: [String]
  weight: Int
  weight_gt: Int
  public_ne: Boolean
  instant_facet: Boolean
  field_number_exists: Boolean
  AND: [TaxaField_listQueryInput!]
  instant_facet_ne: Boolean
  short_name_gte: String
  short_description_ne: String
  short_description_nin: [String]
  complete_from_exists: Boolean
  mongo_type_exists: Boolean
  mongo_type_ne: String
  long_description_gt: String
  short_name_lt: String
  required_exists: Boolean
  mongo_type: String
  default_gte: String
  complete_from: TaxaField_listComplete_fromQueryInput
  weight_exists: Boolean
  public: Boolean
  short_name_exists: Boolean
  mongo_type_gte: String
  short_description_in: [String]
  long_name_ne: String
  mongo_type_in: [String]
  field_number_lte: String
  placeholder: String
  permitted_values_exists: Boolean
  long_description_lte: String
  long_description_nin: [String]
  long_description_gte: String
  short_description_lt: String
  long_description: String
  hide_search_exists: Boolean
  default_in: [String]
  field_number_gte: String
  placeholder_exists: Boolean
  placeholder_lt: String
  short_description_gte: String
  placeholder_lte: String
  permitted_values_in: [String]
  default: String
  short_name_gt: String
  short_name_ne: String
  long_name_in: [String]
  long_name: String
  weight_nin: [Int]
  item_fields_exists: Boolean
  short_name_in: [String]
  permitted_values: [String]
  display_type_exists: Boolean
  long_description_exists: Boolean
  default_exists: Boolean
  weight_lt: Int
  short_description_exists: Boolean
  weight_in: [Int]
  display_type_gt: String
  mongo_type_lte: String
  hide_search_ne: Boolean
  hide_search: Boolean
  display_type: String
  short_name: String
  short_name_nin: [String]
  default_nin: [String]
  placeholder_nin: [String]
  display_type_gte: String
  mongo_type_gt: String
  item_fields: TaxaField_listItem_fieldQueryInput
  field_number_gt: String
  required_ne: Boolean
  display_type_in: [String]
  field_number: String
  long_name_lt: String
  long_description_ne: String
  weight_lte: Int
  weight_gte: Int
  long_name_gte: String
  long_name_gt: String
  field_number_lt: String
  default_ne: String
  placeholder_gte: String
  default_lte: String
}

type ClassificationAttribute {
  short_name: String
  value_json: String
}

input CandidateUpdateInput {
  date_downloaded_unset: Boolean
  embedding: CandidateEmbeddingUpdateInput
  date_published_unset: Boolean
  language: String
  language_unset: Boolean
  date_published: String
  epoch_date_published: Int
  epoch_date_downloaded_unset: Boolean
  _id: ObjectId
  url: String
  matching_keywords_unset: Boolean
  plain_text_unset: Boolean
  plain_text: String
  similarity: Float
  authors: [String]
  text_unset: Boolean
  epoch_date_published_unset: Boolean
  match: Boolean
  dismissed: Boolean
  url_unset: Boolean
  title: String
  image_url_unset: Boolean
  similarity_inc: Float
  source_domain_unset: Boolean
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  title_unset: Boolean
  dismissed_unset: Boolean
  source_domain: String
  _id_unset: Boolean
  classification_similarity_unset: Boolean
  match_unset: Boolean
  matching_entities_unset: Boolean
  text: String
  date_downloaded: String
  similarity_unset: Boolean
  matching_harm_keywords_unset: Boolean
  matching_keywords: [String]
  epoch_date_downloaded: Int
  epoch_date_downloaded_inc: Int
  image_url: String
  matching_entities: [String]
  embedding_unset: Boolean
  epoch_date_published_inc: Int
  authors_unset: Boolean
  matching_harm_keywords: [String]
}

input TaxaField_listItem_fieldComplete_fromInsertInput {
  all: [String]
  current: [String]
  entities: Boolean
}

input DuplicateQueryInput {
  _id_ne: ObjectId
  _id_nin: [ObjectId]
  duplicate_incident_number_gte: Int
  duplicate_incident_number_lte: Int
  true_incident_number_ne: Int
  true_incident_number_lt: Int
  true_incident_number_in: [Int]
  AND: [DuplicateQueryInput!]
  OR: [DuplicateQueryInput!]
  _id: ObjectId
  _id_lte: ObjectId
  duplicate_incident_number_exists: Boolean
  true_incident_number_exists: Boolean
  _id_lt: ObjectId
  _id_gt: ObjectId
  duplicate_incident_number_in: [Int]
  _id_exists: Boolean
  true_incident_number_nin: [Int]
  duplicate_incident_number_nin: [Int]
  duplicate_incident_number_gt: Int
  duplicate_incident_number: Int
  _id_in: [ObjectId]
  true_incident_number_gt: Int
  duplicate_incident_number_ne: Int
  true_incident_number: Int
  _id_gte: ObjectId
  duplicate_incident_number_lt: Int
  true_incident_number_lte: Int
  true_incident_number_gte: Int
}

type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}

type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input History_incidentInsertInput {
  epoch_date_modified: Int
  flagged_dissimilar_incidents: [Int]
  AllegedHarmedOrNearlyHarmedParties: [String]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  title: String!
  editor_dissimilar_incidents: [Int]
  modifiedBy: String
  incident_id: Int!
  AllegedDeveloperOfAISystem: [String]
  _id: ObjectId
  description: String
  editor_similar_incidents: [Int]
  editors: [String]!
  AllegedDeployerOfAISystem: [String]
  date: String!
  embedding: History_incidentEmbeddingInsertInput
  reports: [Int]!
  editor_notes: String
  tsne: History_incidentTsneInsertInput
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

input IncidentAllegedDeployerOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input DuplicateUpdateInput {
  true_incident_number: Int
  true_incident_number_inc: Int
  true_incident_number_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  duplicate_incident_number: Int
  duplicate_incident_number_inc: Int
  duplicate_incident_number_unset: Boolean
}

input SubscriptionUserIdRelationInput {
  create: UserInsertInput
  link: String
}

type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}

input History_reportInsertInput {
  text: String!
  user: String
  plain_text: String!
  report_number: Int!
  embedding: History_reportEmbeddingInsertInput
  inputs_outputs: [String]
  language: String!
  authors: [String]!
  title: String!
  date_downloaded: DateTime!
  date_published: DateTime!
  date_modified: DateTime!
  epoch_date_submitted: Int!
  quiet: Boolean
  epoch_date_published: Int!
  editor_notes: String
  _id: ObjectId
  description: String
  epoch_date_downloaded: Int!
  url: String!
  image_url: String!
  date_submitted: DateTime!
  is_incident_report: Boolean
  source_domain: String!
  tags: [String]!
  flag: Boolean
  submitters: [String]!
  modifiedBy: String
  cloudinary_id: String!
  epoch_date_modified: Int!
}

input SubscriptionUpdateInput {
  userId: SubscriptionUserIdRelationInput
  userId_unset: Boolean
  entityId: SubscriptionEntityIdRelationInput
  entityId_unset: Boolean
  type: String
  incident_id: SubscriptionIncident_idRelationInput
  type_unset: Boolean
  _id_unset: Boolean
  incident_id_unset: Boolean
  _id: ObjectId
}

input IncidentNlp_similar_incidentQueryInput {
  incident_id_lt: Int
  incident_id: Int
  similarity_in: [Float]
  AND: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_in: [Int]
  incident_id_exists: Boolean
  OR: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_gte: Int
  similarity_nin: [Float]
  similarity_exists: Boolean
  incident_id_nin: [Int]
  similarity: Float
  incident_id_gt: Int
  incident_id_ne: Int
  similarity_gt: Float
  similarity_gte: Float
  similarity_lt: Float
  similarity_ne: Float
  similarity_lte: Float
  incident_id_lte: Int
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

input TaxaField_listItem_fieldUpdateInput {
  long_name: String
  permitted_values: [String]
  placeholder: String
  default_unset: Boolean
  short_name: String
  complete_from_unset: Boolean
  field_number: String
  required_unset: Boolean
  display_type: String
  display_type_unset: Boolean
  mongo_type: String
  mongo_type_unset: Boolean
  weight_inc: Int
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  public: Boolean
  short_description_unset: Boolean
  weight_unset: Boolean
  long_name_unset: Boolean
  weight: Int
  public_unset: Boolean
  placeholder_unset: Boolean
  default: String
  instant_facet: Boolean
  long_description: String
  permitted_values_unset: Boolean
  short_description: String
  field_number_unset: Boolean
  long_description_unset: Boolean
  required: Boolean
  short_name_unset: Boolean
  instant_facet_unset: Boolean
}

input IncidentEmbeddingQueryInput {
  from_reports: [Int]
  from_reports_in: [Int]
  vector_in: [Float]
  vector_nin: [Float]
  from_reports_exists: Boolean
  from_reports_nin: [Int]
  vector: [Float]
  AND: [IncidentEmbeddingQueryInput!]
  vector_exists: Boolean
  OR: [IncidentEmbeddingQueryInput!]
}

input IncidentQueryInput {
  description_lte: String
  description: String
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  description_gte: String
  incident_id_gt: Int
  title_lte: String
  editor_notes_gte: String
  editor_dissimilar_incidents_in: [Int]
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  editors_exists: Boolean
  incident_id_lt: Int
  _id_gte: ObjectId
  editor_notes_ne: String
  date: String
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  editor_notes_exists: Boolean
  AllegedDeployerOfAISystem: [EntityQueryInput]
  editors_in: [UserQueryInput]
  tsne: IncidentTsneQueryInput
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  description_gt: String
  description_nin: [String]
  date_in: [String]
  _id_ne: ObjectId
  _id_lte: ObjectId
  epoch_date_modified_nin: [Int]
  date_nin: [String]
  editor_dissimilar_incidents_exists: Boolean
  reports: [ReportQueryInput]
  reports_exists: Boolean
  tsne_exists: Boolean
  epoch_date_modified_lt: Int
  editor_notes_lte: String
  title: String
  title_ne: String
  epoch_date_modified: Int
  incident_id_lte: Int
  reports_nin: [ReportQueryInput]
  editor_similar_incidents_nin: [Int]
  editor_similar_incidents: [Int]
  flagged_dissimilar_incidents_exists: Boolean
  epoch_date_modified_ne: Int
  embedding_exists: Boolean
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  date_lt: String
  title_nin: [String]
  editor_dissimilar_incidents_nin: [Int]
  editor_notes_lt: String
  flagged_dissimilar_incidents: [Int]
  editor_notes_in: [String]
  AllegedDeveloperOfAISystem_exists: Boolean
  editor_similar_incidents_exists: Boolean
  _id_lt: ObjectId
  _id_exists: Boolean
  reports_in: [ReportQueryInput]
  editor_dissimilar_incidents: [Int]
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  description_in: [String]
  editor_notes_nin: [String]
  _id_in: [ObjectId]
  incident_id_exists: Boolean
  date_gte: String
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  title_gt: String
  embedding: IncidentEmbeddingQueryInput
  AllegedDeployerOfAISystem_exists: Boolean
  nlp_similar_incidents_exists: Boolean
  epoch_date_modified_gte: Int
  AND: [IncidentQueryInput!]
  incident_id: Int
  OR: [IncidentQueryInput!]
  title_in: [String]
  editor_similar_incidents_in: [Int]
  editors_nin: [UserQueryInput]
  description_exists: Boolean
  incident_id_gte: Int
  date_gt: String
  description_lt: String
  _id_gt: ObjectId
  date_exists: Boolean
  title_gte: String
  epoch_date_modified_gt: Int
  title_lt: String
  incident_id_ne: Int
  incident_id_nin: [Int]
  epoch_date_modified_lte: Int
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  _id: ObjectId
  editor_notes: String
  editors: [UserQueryInput]
  date_lte: String
  epoch_date_modified_in: [Int]
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  _id_nin: [ObjectId]
  title_exists: Boolean
  editor_notes_gt: String
  description_ne: String
  incident_id_in: [Int]
  flagged_dissimilar_incidents_nin: [Int]
  flagged_dissimilar_incidents_in: [Int]
  epoch_date_modified_exists: Boolean
  date_ne: String
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
  replaceOneCandidate(data: CandidateInsertInput!, query: CandidateQueryInput): Candidate
  replaceOneChecklist(query: ChecklistQueryInput, data: ChecklistInsertInput!): Checklist
  replaceOneClassification(data: ClassificationInsertInput!, query: ClassificationQueryInput): Classification
  replaceOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  replaceOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  replaceOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  replaceOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  replaceOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  replaceOneNotification(data: NotificationInsertInput!, query: NotificationQueryInput): Notification
  replaceOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  replaceOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  replaceOneSubmission(data: SubmissionInsertInput!, query: SubmissionQueryInput): Submission
  replaceOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  replaceOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  replaceOneUser(query: UserQueryInput, data: UserInsertInput!): User
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
  updateManySubmissions(set: SubmissionUpdateInput!, query: SubmissionQueryInput): UpdateManyPayload
  updateManySubscriptions(query: SubscriptionQueryInput, set: SubscriptionUpdateInput!): UpdateManyPayload
  updateManyTaxas(query: TaxaQueryInput, set: TaxaUpdateInput!): UpdateManyPayload
  updateManyUsers(set: UserUpdateInput!, query: UserQueryInput): UpdateManyPayload
  updateOneCandidate(query: CandidateQueryInput, set: CandidateUpdateInput!): Candidate
  updateOneChecklist(query: ChecklistQueryInput, set: ChecklistUpdateInput!): Checklist
  updateOneClassification(query: ClassificationQueryInput, set: ClassificationUpdateInput!): Classification
  updateOneDuplicate(query: DuplicateQueryInput, set: DuplicateUpdateInput!): Duplicate
  updateOneEntity(query: EntityQueryInput, set: EntityUpdateInput!): Entity
  updateOneHistory_incident(query: History_incidentQueryInput, set: History_incidentUpdateInput!): History_incident
  updateOneHistory_report(query: History_reportQueryInput, set: History_reportUpdateInput!): History_report
  updateOneIncident(query: IncidentQueryInput, set: IncidentUpdateInput!): Incident
  updateOneNotification(query: NotificationQueryInput, set: NotificationUpdateInput!): Notification
  updateOneQuickadd(query: QuickaddQueryInput, set: QuickaddUpdateInput!): Quickadd
  updateOneReport(query: ReportQueryInput, set: ReportUpdateInput!): Report
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
  upsertOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  upsertOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  upsertOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  upsertOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  upsertOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
}

input QuickaddUpdateInput {
  source_domain: String
  _id_unset: Boolean
  incident_id: Long
  source_domain_unset: Boolean
  date_submitted: String
  date_submitted_unset: Boolean
  url_unset: Boolean
  _id: ObjectId
  incident_id_unset: Boolean
  url: String
}

enum SubscriptionSortByInput {
  _ID_DESC
  ENTITYID_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  TYPE_ASC
  TYPE_DESC
  _ID_ASC
  ENTITYID_ASC
  USERID_ASC
  USERID_DESC
}

input SubmissionUpdateInput {
  user_unset: Boolean
  text: String
  status: String
  submitters_unset: Boolean
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  quiet: Boolean
  developers_unset: Boolean
  date_modified_unset: Boolean
  epoch_date_modified_unset: Boolean
  image_url_unset: Boolean
  authors_unset: Boolean
  description_unset: Boolean
  epoch_date_modified: Int
  editor_similar_incidents: [Int]
  embedding_unset: Boolean
  plain_text_unset: Boolean
  deployers: SubmissionDeployersRelationInput
  incident_date: String
  incident_editors_unset: Boolean
  harmed_parties_unset: Boolean
  incident_title_unset: Boolean
  epoch_date_modified_inc: Int
  incident_title: String
  text_unset: Boolean
  embedding: SubmissionEmbeddingUpdateInput
  url_unset: Boolean
  quiet_unset: Boolean
  _id: ObjectId
  cloudinary_id_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  date_published_unset: Boolean
  date_submitted_unset: Boolean
  source_domain_unset: Boolean
  image_url: String
  editor_similar_incidents_unset: Boolean
  date_downloaded: String
  harmed_parties: SubmissionHarmed_partiesRelationInput
  developers: SubmissionDevelopersRelationInput
  incident_date_unset: Boolean
  deployers_unset: Boolean
  tags: [String]
  source_domain: String
  url: String
  editor_notes_unset: Boolean
  _id_unset: Boolean
  language_unset: Boolean
  date_published: String
  title: String
  incident_ids_unset: Boolean
  title_unset: Boolean
  language: String
  incident_ids: [Int]
  incident_editors: SubmissionIncident_editorsRelationInput
  status_unset: Boolean
  editor_notes: String
  submitters: [String]
  tags_unset: Boolean
  date_modified: String
  description: String
  editor_dissimilar_incidents: [Int]
  editor_dissimilar_incidents_unset: Boolean
  cloudinary_id: String
  date_downloaded_unset: Boolean
  date_submitted: String
  user: SubmissionUserRelationInput
  authors: [String]
  plain_text: String
}

scalar ObjectId

input CandidateEmbeddingQueryInput {
  from_text_hash_lte: String
  OR: [CandidateEmbeddingQueryInput!]
  from_text_hash_nin: [String]
  from_text_hash_ne: String
  vector_nin: [Float]
  AND: [CandidateEmbeddingQueryInput!]
  vector_in: [Float]
  from_text_hash_exists: Boolean
  from_text_hash_lt: String
  from_text_hash_gt: String
  vector_exists: Boolean
  from_text_hash: String
  from_text_hash_gte: String
  vector: [Float]
  from_text_hash_in: [String]
}

input History_incidentTsneQueryInput {
  x_lt: Float
  y_lte: Float
  x_gte: Float
  x_in: [Float]
  y: Float
  y_gt: Float
  y_exists: Boolean
  y_gte: Float
  x_lte: Float
  x: Float
  x_exists: Boolean
  y_ne: Float
  y_lt: Float
  AND: [History_incidentTsneQueryInput!]
  y_nin: [Float]
  OR: [History_incidentTsneQueryInput!]
  x_nin: [Float]
  y_in: [Float]
  x_ne: Float
  x_gt: Float
}

input IncidentTsneUpdateInput {
  x: Float
  x_inc: Float
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
}

type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input TaxaField_listItem_fieldQueryInput {
  long_name: String
  default_in: [String]
  weight_in: [Int]
  short_name: String
  short_description_lt: String
  weight_nin: [Int]
  long_description_in: [String]
  short_description_ne: String
  short_description_gt: String
  short_name_ne: String
  field_number_gte: String
  long_name_ne: String
  display_type_lte: String
  permitted_values_exists: Boolean
  field_number_ne: String
  display_type: String
  default_lte: String
  mongo_type_exists: Boolean
  placeholder_nin: [String]
  short_description_in: [String]
  field_number_lte: String
  long_name_nin: [String]
  field_number_gt: String
  mongo_type: String
  AND: [TaxaField_listItem_fieldQueryInput!]
  short_name_lte: String
  mongo_type_ne: String
  mongo_type_lte: String
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  display_type_gt: String
  short_description_gte: String
  required: Boolean
  mongo_type_in: [String]
  short_name_nin: [String]
  instant_facet_exists: Boolean
  default: String
  short_description_exists: Boolean
  long_description_ne: String
  display_type_exists: Boolean
  default_gte: String
  display_type_lt: String
  long_description: String
  weight_gte: Int
  mongo_type_gte: String
  placeholder_lt: String
  long_name_lte: String
  short_name_gte: String
  short_description_nin: [String]
  display_type_in: [String]
  long_description_exists: Boolean
  display_type_ne: String
  weight_exists: Boolean
  short_name_exists: Boolean
  placeholder: String
  long_name_lt: String
  placeholder_exists: Boolean
  mongo_type_nin: [String]
  long_name_gt: String
  field_number: String
  long_description_lte: String
  placeholder_in: [String]
  field_number_in: [String]
  instant_facet: Boolean
  placeholder_lte: String
  placeholder_gte: String
  short_description_lte: String
  public: Boolean
  long_name_in: [String]
  long_name_exists: Boolean
  default_ne: String
  long_description_gte: String
  field_number_lt: String
  default_gt: String
  weight_lt: Int
  placeholder_gt: String
  weight_lte: Int
  default_exists: Boolean
  permitted_values_in: [String]
  default_nin: [String]
  mongo_type_gt: String
  required_ne: Boolean
  required_exists: Boolean
  long_description_nin: [String]
  display_type_gte: String
  permitted_values_nin: [String]
  complete_from_exists: Boolean
  placeholder_ne: String
  long_description_gt: String
  short_name_in: [String]
  short_description: String
  short_name_gt: String
  public_ne: Boolean
  default_lt: String
  weight_gt: Int
  OR: [TaxaField_listItem_fieldQueryInput!]
  mongo_type_lt: String
  instant_facet_ne: Boolean
  display_type_nin: [String]
  long_description_lt: String
  field_number_nin: [String]
  weight_ne: Int
  short_name_lt: String
  permitted_values: [String]
  long_name_gte: String
  field_number_exists: Boolean
  weight: Int
  public_exists: Boolean
}

input CandidateInsertInput {
  date_downloaded: String
  image_url: String
  similarity: Float
  date_published: String
  dismissed: Boolean
  match: Boolean!
  url: String!
  authors: [String]
  plain_text: String
  _id: ObjectId
  title: String
  epoch_date_published: Int
  source_domain: String
  embedding: CandidateEmbeddingInsertInput
  language: String
  matching_harm_keywords: [String]
  text: String
  classification_similarity: [CandidateClassification_similarityInsertInput]
  matching_keywords: [String]
  epoch_date_downloaded: Int
  matching_entities: [String]
}

input ChecklistRiskPrecedentInsertInput {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

scalar Long

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

input SubmissionNlp_similar_incidentQueryInput {
  incident_id_in: [Int]
  incident_id_ne: Int
  similarity_nin: [Float]
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  similarity: Float
  similarity_gt: Float
  similarity_gte: Float
  incident_id_lt: Int
  similarity_ne: Float
  incident_id_gte: Int
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id: Int
  incident_id_lte: Int
  incident_id_nin: [Int]
  similarity_in: [Float]
  incident_id_exists: Boolean
  similarity_lte: Float
  similarity_lt: Float
  incident_id_gt: Int
  similarity_exists: Boolean
}

input IncidentTsneInsertInput {
  x: Float
  y: Float
}

type Query {
  candidate(query: CandidateQueryInput): Candidate
  candidates(sortBy: CandidateSortByInput, query: CandidateQueryInput, limit: Int = 100): [Candidate]!
  checklist(query: ChecklistQueryInput): Checklist
  checklists(limit: Int = 100, sortBy: ChecklistSortByInput, query: ChecklistQueryInput): [Checklist]!
  classification(query: ClassificationQueryInput): Classification
  classifications(query: ClassificationQueryInput, limit: Int = 100, sortBy: ClassificationSortByInput): [Classification]!
  duplicate(query: DuplicateQueryInput): Duplicate
  duplicates(query: DuplicateQueryInput, limit: Int = 100, sortBy: DuplicateSortByInput): [Duplicate]!
  entities(query: EntityQueryInput, limit: Int = 100, sortBy: EntitySortByInput): [Entity]!
  entity(query: EntityQueryInput): Entity
  history_incident(query: History_incidentQueryInput): History_incident
  history_incidents(sortBy: History_incidentSortByInput, query: History_incidentQueryInput, limit: Int = 100): [History_incident]!
  history_report(query: History_reportQueryInput): History_report
  history_reports(query: History_reportQueryInput, limit: Int = 100, sortBy: History_reportSortByInput): [History_report]!
  incident(query: IncidentQueryInput): Incident
  incidents(sortBy: IncidentSortByInput, query: IncidentQueryInput, limit: Int = 100): [Incident]!
  notification(query: NotificationQueryInput): Notification
  notifications(sortBy: NotificationSortByInput, query: NotificationQueryInput, limit: Int = 100): [Notification]!
  quickadd(query: QuickaddQueryInput): Quickadd
  quickadds(query: QuickaddQueryInput, limit: Int = 100, sortBy: QuickaddSortByInput): [Quickadd]!
  report(query: ReportQueryInput): Report
  reports(limit: Int = 100, sortBy: ReportSortByInput, query: ReportQueryInput): [Report]!
  risks(input: RisksInput): [RisksPayloadItem]
  submission(query: SubmissionQueryInput): Submission
  submissions(query: SubmissionQueryInput, limit: Int = 100, sortBy: SubmissionSortByInput): [Submission]!
  subscription(query: SubscriptionQueryInput): Subscription
  subscriptions(query: SubscriptionQueryInput, limit: Int = 100, sortBy: SubscriptionSortByInput): [Subscription]!
  taxa(query: TaxaQueryInput): Taxa
  taxas(query: TaxaQueryInput, limit: Int = 100, sortBy: TaxaSortByInput): [Taxa]!
  user(query: UserQueryInput): User
  users(query: UserQueryInput, limit: Int = 100, sortBy: UserSortByInput): [User]!
}

enum TaxaSortByInput {
  _ID_ASC
  _ID_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  NAMESPACE_ASC
  NAMESPACE_DESC
  WEIGHT_ASC
  WEIGHT_DESC
}

input SubmissionHarmed_partiesRelationInput {
  link: [String]
  create: [EntityInsertInput]
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

input SubmissionQueryInput {
  title: String
  status_exists: Boolean
  submitters_nin: [String]
  title_lt: String
  cloudinary_id_nin: [String]
  url_gt: String
  url_in: [String]
  text_ne: String
  description: String
  incident_ids: [Int]
  title_lte: String
  image_url_lte: String
  source_domain_lt: String
  harmed_parties_exists: Boolean
  incident_ids_nin: [Int]
  title_ne: String
  user: UserQueryInput
  incident_editors_nin: [UserQueryInput]
  image_url_gte: String
  date_submitted_gte: String
  text_lte: String
  date_published_gte: String
  plain_text_lte: String
  date_downloaded_lt: String
  editor_notes_gt: String
  description_exists: Boolean
  _id: ObjectId
  url_gte: String
  epoch_date_modified_gt: Int
  status: String
  incident_date_in: [String]
  plain_text_in: [String]
  title_in: [String]
  image_url_lt: String
  title_gte: String
  incident_title_exists: Boolean
  date_submitted_in: [String]
  submitters_in: [String]
  date_modified_exists: Boolean
  date_downloaded: String
  cloudinary_id: String
  epoch_date_modified: Int
  incident_editors_exists: Boolean
  epoch_date_modified_lt: Int
  incident_date_lt: String
  incident_title_nin: [String]
  date_submitted_exists: Boolean
  embedding_exists: Boolean
  incident_title_gte: String
  date_published_lte: String
  deployers: [EntityQueryInput]
  date_modified_in: [String]
  authors_in: [String]
  developers_nin: [EntityQueryInput]
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  cloudinary_id_exists: Boolean
  source_domain_gte: String
  image_url_ne: String
  text_nin: [String]
  source_domain_ne: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  editor_notes_nin: [String]
  plain_text_gte: String
  harmed_parties_nin: [EntityQueryInput]
  date_modified_gt: String
  submitters_exists: Boolean
  editor_dissimilar_incidents_exists: Boolean
  plain_text_gt: String
  developers_in: [EntityQueryInput]
  epoch_date_modified_lte: Int
  cloudinary_id_in: [String]
  language: String
  date_published_nin: [String]
  url_lte: String
  status_nin: [String]
  date_modified: String
  incident_title_ne: String
  editor_notes_lt: String
  url_nin: [String]
  user_exists: Boolean
  developers_exists: Boolean
  incident_date: String
  editor_similar_incidents_in: [Int]
  source_domain_nin: [String]
  source_domain: String
  editor_notes_in: [String]
  date_submitted_lt: String
  editor_similar_incidents_exists: Boolean
  description_gt: String
  quiet_ne: Boolean
  date_submitted: String
  description_gte: String
  url_exists: Boolean
  tags: [String]
  OR: [SubmissionQueryInput!]
  tags_nin: [String]
  editor_dissimilar_incidents: [Int]
  description_in: [String]
  source_domain_exists: Boolean
  text_gte: String
  epoch_date_modified_in: [Int]
  date_modified_ne: String
  incident_editors_in: [UserQueryInput]
  _id_in: [ObjectId]
  submitters: [String]
  editor_notes_exists: Boolean
  _id_gte: ObjectId
  authors_exists: Boolean
  _id_nin: [ObjectId]
  language_nin: [String]
  incident_editors: [UserQueryInput]
  editor_dissimilar_incidents_in: [Int]
  source_domain_in: [String]
  incident_title: String
  _id_exists: Boolean
  nlp_similar_incidents_exists: Boolean
  language_gt: String
  tags_in: [String]
  incident_date_exists: Boolean
  epoch_date_modified_exists: Boolean
  date_modified_lte: String
  date_downloaded_ne: String
  date_modified_nin: [String]
  date_downloaded_nin: [String]
  editor_notes_gte: String
  image_url_exists: Boolean
  language_gte: String
  incident_date_ne: String
  text_lt: String
  incident_title_lt: String
  text_gt: String
  quiet: Boolean
  title_exists: Boolean
  status_lte: String
  plain_text_ne: String
  epoch_date_modified_gte: Int
  text_exists: Boolean
  incident_date_lte: String
  deployers_exists: Boolean
  cloudinary_id_gt: String
  language_ne: String
  date_published_lt: String
  source_domain_lte: String
  description_lt: String
  editor_notes: String
  editor_dissimilar_incidents_nin: [Int]
  _id_ne: ObjectId
  plain_text_nin: [String]
  date_modified_gte: String
  title_nin: [String]
  incident_date_nin: [String]
  source_domain_gt: String
  deployers_nin: [EntityQueryInput]
  date_published_gt: String
  cloudinary_id_lte: String
  text_in: [String]
  status_in: [String]
  incident_title_gt: String
  incident_title_lte: String
  _id_lt: ObjectId
  date_published_in: [String]
  status_gte: String
  cloudinary_id_ne: String
  plain_text_exists: Boolean
  language_in: [String]
  date_submitted_lte: String
  date_downloaded_exists: Boolean
  image_url_gt: String
  deployers_in: [EntityQueryInput]
  embedding: SubmissionEmbeddingQueryInput
  description_nin: [String]
  date_submitted_nin: [String]
  cloudinary_id_gte: String
  date_downloaded_in: [String]
  date_modified_lt: String
  image_url: String
  image_url_in: [String]
  incident_ids_exists: Boolean
  _id_gt: ObjectId
  date_published: String
  AND: [SubmissionQueryInput!]
  date_submitted_ne: String
  date_downloaded_lte: String
  text: String
  incident_ids_in: [Int]
  editor_notes_lte: String
  tags_exists: Boolean
  date_downloaded_gte: String
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  epoch_date_modified_nin: [Int]
  incident_title_in: [String]
  language_lt: String
  status_ne: String
  _id_lte: ObjectId
  image_url_nin: [String]
  description_lte: String
  harmed_parties: [EntityQueryInput]
  authors_nin: [String]
  quiet_exists: Boolean
  incident_date_gt: String
  status_gt: String
  editor_similar_incidents: [Int]
  developers: [EntityQueryInput]
  url: String
  date_published_exists: Boolean
  editor_notes_ne: String
  harmed_parties_in: [EntityQueryInput]
  cloudinary_id_lt: String
  incident_date_gte: String
  url_ne: String
  description_ne: String
  status_lt: String
  authors: [String]
  date_submitted_gt: String
  url_lt: String
  date_downloaded_gt: String
  date_published_ne: String
  title_gt: String
  editor_similar_incidents_nin: [Int]
  epoch_date_modified_ne: Int
  plain_text_lt: String
  language_lte: String
  language_exists: Boolean
  plain_text: String
}

input ReportInsertInput {
  user: ReportUserRelationInput
  tags: [String]!
  quiet: Boolean
  description: String
  submitters: [String]!
  report_number: Int!
  date_published: DateTime!
  authors: [String]!
  epoch_date_published: Int!
  text: String!
  date_modified: DateTime!
  source_domain: String!
  title: String!
  epoch_date_modified: Int!
  flag: Boolean
  plain_text: String!
  date_submitted: DateTime!
  cloudinary_id: String!
  url: String!
  is_incident_report: Boolean
  epoch_date_submitted: Int!
  epoch_date_downloaded: Int!
  editor_notes: String
  embedding: ReportEmbeddingInsertInput
  inputs_outputs: [String]
  _id: ObjectId
  date_downloaded: DateTime!
  image_url: String!
  language: String!
}

input ClassificationQueryInput {
  namespace: String
  _id_lt: ObjectId
  _id_in: [ObjectId]
  notes_ne: String
  reports_nin: [ReportQueryInput]
  namespace_lte: String
  namespace_nin: [String]
  publish_ne: Boolean
  notes_gt: String
  _id: ObjectId
  namespace_ne: String
  _id_lte: ObjectId
  namespace_in: [String]
  AND: [ClassificationQueryInput!]
  attributes_in: [ClassificationAttributeQueryInput]
  notes_gte: String
  publish: Boolean
  _id_exists: Boolean
  OR: [ClassificationQueryInput!]
  _id_ne: ObjectId
  attributes_exists: Boolean
  notes_in: [String]
  notes_exists: Boolean
  _id_gt: ObjectId
  reports_in: [ReportQueryInput]
  notes_lt: String
  _id_gte: ObjectId
  attributes_nin: [ClassificationAttributeQueryInput]
  incidents_exists: Boolean
  _id_nin: [ObjectId]
  attributes: [ClassificationAttributeQueryInput]
  namespace_lt: String
  namespace_gte: String
  incidents: [IncidentQueryInput]
  reports: [ReportQueryInput]
  reports_exists: Boolean
  publish_exists: Boolean
  namespace_gt: String
  notes_lte: String
  notes: String
  notes_nin: [String]
  namespace_exists: Boolean
  incidents_nin: [IncidentQueryInput]
  incidents_in: [IncidentQueryInput]
}

enum ClassificationSortByInput {
  _ID_ASC
  _ID_DESC
  NAMESPACE_ASC
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
}

type AppUser {
  email: String
}

input ChecklistInsertInput {
  date_created: DateTime
  id: String
  owner_id: String
  tags_other: [String]
  _id: ObjectId
  name: String
  tags_goals: [String]
  entity_id: String
  tags_methods: [String]
  about: String
  date_updated: DateTime
  risks: [ChecklistRiskInsertInput]
}

type User {
  _id: ObjectId
  adminData: UserAdminDatum
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
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

type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}

input History_reportUpdateInput {
  authors: [String]
  epoch_date_downloaded_unset: Boolean
  epoch_date_submitted: Int
  modifiedBy_unset: Boolean
  date_published_unset: Boolean
  image_url: String
  user_unset: Boolean
  text_unset: Boolean
  date_modified: DateTime
  is_incident_report: Boolean
  epoch_date_submitted_unset: Boolean
  date_modified_unset: Boolean
  date_downloaded_unset: Boolean
  modifiedBy: String
  editor_notes_unset: Boolean
  epoch_date_published_inc: Int
  epoch_date_modified_inc: Int
  source_domain: String
  language_unset: Boolean
  quiet_unset: Boolean
  embedding: History_reportEmbeddingUpdateInput
  quiet: Boolean
  description: String
  epoch_date_published_unset: Boolean
  submitters_unset: Boolean
  cloudinary_id_unset: Boolean
  plain_text: String
  date_published: DateTime
  description_unset: Boolean
  plain_text_unset: Boolean
  title: String
  user: String
  epoch_date_downloaded: Int
  submitters: [String]
  authors_unset: Boolean
  epoch_date_modified_unset: Boolean
  date_submitted_unset: Boolean
  inputs_outputs_unset: Boolean
  url: String
  date_submitted: DateTime
  text: String
  epoch_date_submitted_inc: Int
  title_unset: Boolean
  epoch_date_modified: Int
  report_number: Int
  tags: [String]
  report_number_unset: Boolean
  embedding_unset: Boolean
  report_number_inc: Int
  flag: Boolean
  language: String
  source_domain_unset: Boolean
  is_incident_report_unset: Boolean
  cloudinary_id: String
  url_unset: Boolean
  _id: ObjectId
  inputs_outputs: [String]
  epoch_date_downloaded_inc: Int
  _id_unset: Boolean
  date_downloaded: DateTime
  editor_notes: String
  epoch_date_published: Int
  image_url_unset: Boolean
  flag_unset: Boolean
  tags_unset: Boolean
}

type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}

input IncidentReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

input TaxaUpdateInput {
  dummy_fields: [TaxaDummy_fieldUpdateInput]
  weight_inc: Int
  field_list: [TaxaField_listUpdateInput]
  weight: Int
  description: String
  namespace_unset: Boolean
  weight_unset: Boolean
  namespace: String
  complete_entities: Boolean
  dummy_fields_unset: Boolean
  field_list_unset: Boolean
  description_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  complete_entities_unset: Boolean
}

input TaxaField_listComplete_fromUpdateInput {
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
}

input TaxaField_listComplete_fromInsertInput {
  all: [String]
  current: [String]
}

input ClassificationAttributeUpdateInput {
  value_json_unset: Boolean
  short_name: String
  short_name_unset: Boolean
  value_json: String
}

input CreateVariantInputVariant {
  submitters: [String]
  text: String
  date_published: String
  inputs_outputs: [String]
}

type UserAdminDatum {
  creationDate: DateTime
  disabled: Boolean
  email: String
  lastAuthenticationDate: DateTime
}

input History_incidentNlp_similar_incidentQueryInput {
  similarity_gte: Float
  similarity_lte: Float
  incident_id_lt: Int
  incident_id_nin: [Int]
  similarity_in: [Float]
  similarity_ne: Float
  incident_id_exists: Boolean
  similarity_gt: Float
  incident_id_gt: Int
  similarity: Float
  incident_id: Int
  similarity_lt: Float
  similarity_nin: [Float]
  similarity_exists: Boolean
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_in: [Int]
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_ne: Int
  incident_id_gte: Int
  incident_id_lte: Int
}

enum NotificationSortByInput {
  INCIDENT_ID_DESC
  TYPE_ASC
  TYPE_DESC
  USERID_DESC
  _ID_ASC
  _ID_DESC
  INCIDENT_ID_ASC
  SENTDATE_ASC
  SENTDATE_DESC
  USERID_ASC
}

input PromoteSubmissionToReportInput {
  submission_id: ObjectId
  incident_ids: [Int]
  is_incident_report: Boolean
}

input IncidentNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_unset: Boolean
  incident_id_inc: Int
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}

input IncidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
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

input ReportQueryInput {
  editor_notes_lt: String
  source_domain_lte: String
  source_domain: String
  report_number_in: [Int]
  _id_in: [ObjectId]
  submitters: [String]
  embedding_exists: Boolean
  date_modified_nin: [DateTime]
  editor_notes_exists: Boolean
  date_submitted_nin: [DateTime]
  language_lt: String
  inputs_outputs_exists: Boolean
  date_published_lte: DateTime
  source_domain_exists: Boolean
  report_number_gte: Int
  _id_nin: [ObjectId]
  _id_ne: ObjectId
  language: String
  plain_text_ne: String
  epoch_date_downloaded_exists: Boolean
  source_domain_ne: String
  date_modified_lte: DateTime
  cloudinary_id_lt: String
  date_submitted_exists: Boolean
  date_published_gt: DateTime
  epoch_date_published_gt: Int
  date_published: DateTime
  language_gte: String
  epoch_date_modified_exists: Boolean
  date_submitted_ne: DateTime
  cloudinary_id_ne: String
  authors_exists: Boolean
  url_lt: String
  cloudinary_id_gt: String
  plain_text_exists: Boolean
  authors_in: [String]
  epoch_date_modified_ne: Int
  date_submitted_lt: DateTime
  date_published_exists: Boolean
  epoch_date_published_ne: Int
  report_number_gt: Int
  source_domain_gte: String
  _id: ObjectId
  url_in: [String]
  date_modified_gt: DateTime
  date_published_in: [DateTime]
  epoch_date_modified_lte: Int
  date_published_nin: [DateTime]
  url_ne: String
  is_incident_report_exists: Boolean
  description_lte: String
  date_downloaded_lt: DateTime
  language_in: [String]
  image_url_ne: String
  epoch_date_published_in: [Int]
  description_gt: String
  tags_nin: [String]
  language_gt: String
  epoch_date_downloaded: Int
  title_exists: Boolean
  is_incident_report_ne: Boolean
  text_gte: String
  quiet: Boolean
  title: String
  quiet_ne: Boolean
  editor_notes_nin: [String]
  date_submitted_lte: DateTime
  date_downloaded_ne: DateTime
  editor_notes_gte: String
  date_submitted_in: [DateTime]
  url_exists: Boolean
  epoch_date_submitted_gt: Int
  plain_text_nin: [String]
  text_gt: String
  date_downloaded: DateTime
  description: String
  cloudinary_id_in: [String]
  epoch_date_downloaded_in: [Int]
  epoch_date_submitted_in: [Int]
  AND: [ReportQueryInput!]
  editor_notes_ne: String
  title_gt: String
  cloudinary_id: String
  report_number_nin: [Int]
  title_in: [String]
  plain_text_in: [String]
  title_lte: String
  date_published_ne: DateTime
  _id_lt: ObjectId
  image_url_lte: String
  date_downloaded_nin: [DateTime]
  title_ne: String
  tags_in: [String]
  epoch_date_modified_gte: Int
  user: UserQueryInput
  flag_ne: Boolean
  epoch_date_modified_gt: Int
  text_ne: String
  editor_notes_gt: String
  image_url_nin: [String]
  epoch_date_downloaded_nin: [Int]
  title_nin: [String]
  date_submitted_gte: DateTime
  text: String
  epoch_date_downloaded_lt: Int
  epoch_date_submitted_ne: Int
  epoch_date_submitted_exists: Boolean
  description_exists: Boolean
  inputs_outputs_in: [String]
  inputs_outputs_nin: [String]
  date_modified_lt: DateTime
  date_modified_ne: DateTime
  text_lt: String
  _id_exists: Boolean
  epoch_date_published_lte: Int
  date_downloaded_lte: DateTime
  description_lt: String
  url_gt: String
  is_incident_report: Boolean
  text_in: [String]
  report_number: Int
  plain_text: String
  source_domain_lt: String
  date_submitted: DateTime
  date_downloaded_gte: DateTime
  _id_lte: ObjectId
  OR: [ReportQueryInput!]
  text_nin: [String]
  epoch_date_published: Int
  epoch_date_downloaded_ne: Int
  description_ne: String
  language_ne: String
  text_exists: Boolean
  date_published_lt: DateTime
  date_modified_in: [DateTime]
  authors: [String]
  language_lte: String
  _id_gt: ObjectId
  language_exists: Boolean
  image_url: String
  report_number_lte: Int
  date_modified_exists: Boolean
  cloudinary_id_lte: String
  submitters_in: [String]
  report_number_lt: Int
  image_url_lt: String
  title_gte: String
  report_number_exists: Boolean
  epoch_date_downloaded_lte: Int
  date_modified: DateTime
  image_url_gte: String
  url_lte: String
  epoch_date_modified_in: [Int]
  tags: [String]
  epoch_date_published_nin: [Int]
  epoch_date_published_exists: Boolean
  date_modified_gte: DateTime
  image_url_gt: String
  cloudinary_id_exists: Boolean
  title_lt: String
  editor_notes_in: [String]
  date_published_gte: DateTime
  inputs_outputs: [String]
  epoch_date_submitted: Int
  source_domain_in: [String]
  epoch_date_downloaded_gt: Int
  epoch_date_submitted_lt: Int
  description_nin: [String]
  date_downloaded_exists: Boolean
  editor_notes: String
  date_downloaded_gt: DateTime
  epoch_date_published_lt: Int
  date_downloaded_in: [DateTime]
  cloudinary_id_nin: [String]
  plain_text_gte: String
  submitters_nin: [String]
  quiet_exists: Boolean
  text_lte: String
  url_gte: String
  flag_exists: Boolean
  epoch_date_submitted_gte: Int
  description_gte: String
  editor_notes_lte: String
  image_url_exists: Boolean
  url: String
  flag: Boolean
  source_domain_nin: [String]
  epoch_date_downloaded_gte: Int
  _id_gte: ObjectId
  url_nin: [String]
  epoch_date_modified: Int
  submitters_exists: Boolean
  epoch_date_submitted_lte: Int
  epoch_date_submitted_nin: [Int]
  epoch_date_modified_lt: Int
  plain_text_lte: String
  tags_exists: Boolean
  language_nin: [String]
  date_submitted_gt: DateTime
  epoch_date_published_gte: Int
  epoch_date_modified_nin: [Int]
  authors_nin: [String]
  source_domain_gt: String
  cloudinary_id_gte: String
  embedding: ReportEmbeddingQueryInput
  plain_text_gt: String
  image_url_in: [String]
  report_number_ne: Int
  plain_text_lt: String
  user_exists: Boolean
  description_in: [String]
}

input IncidentTsneQueryInput {
  y_lt: Float
  OR: [IncidentTsneQueryInput!]
  x_nin: [Float]
  y_nin: [Float]
  y_exists: Boolean
  x_in: [Float]
  x_ne: Float
  x_gt: Float
  y_gt: Float
  x: Float
  x_lt: Float
  y_ne: Float
  x_lte: Float
  y_gte: Float
  y_in: [Float]
  y_lte: Float
  AND: [IncidentTsneQueryInput!]
  x_exists: Boolean
  x_gte: Float
  y: Float
}

type TaxaField_listComplete_from {
  all: [String]
  current: [String]
}

input SubscriptionEntityIdRelationInput {
  create: EntityInsertInput
  link: String
}

type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}

enum IncidentSortByInput {
  DATE_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_DESC
  TITLE_ASC
  _ID_DESC
  EPOCH_DATE_MODIFIED_ASC
  INCIDENT_ID_ASC
  TITLE_DESC
  _ID_ASC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  EDITOR_NOTES_DESC
  INCIDENT_ID_DESC
  DATE_DESC
}

input UserInsertInput {
  roles: [String]!
  userId: String!
  _id: ObjectId
  first_name: String
  last_name: String
}

input SubscriptionInsertInput {
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
  userId: SubscriptionUserIdRelationInput!
  _id: ObjectId
  entityId: SubscriptionEntityIdRelationInput
}

input NotificationInsertInput {
  type: String
  userId: NotificationUserIdRelationInput
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
}

input EntityQueryInput {
  date_modified_lt: DateTime
  created_at_nin: [DateTime]
  name_gte: String
  entity_id_lt: String
  created_at_gt: DateTime
  name_lte: String
  name_gt: String
  name_exists: Boolean
  entity_id_ne: String
  date_modified_gt: DateTime
  name_lt: String
  entity_id_exists: Boolean
  _id_lte: ObjectId
  _id_gt: ObjectId
  entity_id_nin: [String]
  AND: [EntityQueryInput!]
  _id_ne: ObjectId
  entity_id_lte: String
  name_nin: [String]
  date_modified_exists: Boolean
  date_modified_ne: DateTime
  entity_id_gte: String
  created_at_lt: DateTime
  name: String
  name_in: [String]
  _id_exists: Boolean
  created_at_ne: DateTime
  date_modified_gte: DateTime
  created_at: DateTime
  _id_gte: ObjectId
  created_at_lte: DateTime
  created_at_exists: Boolean
  _id: ObjectId
  created_at_in: [DateTime]
  _id_lt: ObjectId
  created_at_gte: DateTime
  entity_id: String
  _id_in: [ObjectId]
  date_modified: DateTime
  OR: [EntityQueryInput!]
  entity_id_gt: String
  date_modified_lte: DateTime
  entity_id_in: [String]
  date_modified_nin: [DateTime]
  _id_nin: [ObjectId]
  date_modified_in: [DateTime]
  name_ne: String
}

input IncidentAllegedDeveloperOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input TaxaField_listUpdateInput {
  long_description_unset: Boolean
  long_name: String
  weight: Int
  placeholder: String
  instant_facet: Boolean
  instant_facet_unset: Boolean
  hide_search: Boolean
  default_unset: Boolean
  long_name_unset: Boolean
  permitted_values_unset: Boolean
  public: Boolean
  field_number_unset: Boolean
  permitted_values: [String]
  display_type_unset: Boolean
  short_description_unset: Boolean
  short_name: String
  item_fields: TaxaField_listItem_fieldUpdateInput
  short_description: String
  default: String
  required: Boolean
  placeholder_unset: Boolean
  weight_inc: Int
  complete_from: TaxaField_listComplete_fromUpdateInput
  item_fields_unset: Boolean
  complete_from_unset: Boolean
  mongo_type_unset: Boolean
  public_unset: Boolean
  weight_unset: Boolean
  required_unset: Boolean
  short_name_unset: Boolean
  hide_search_unset: Boolean
  mongo_type: String
  long_description: String
  field_number: String
  display_type: String
}

type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}

input History_incidentTsneInsertInput {
  x: Float
  y: Float
}

input TaxaField_listItem_fieldInsertInput {
  long_description: String
  required: Boolean
  instant_facet: Boolean
  default: String
  short_name: String
  public: Boolean
  field_number: String
  weight: Int
  placeholder: String
  mongo_type: String
  short_description: String
  permitted_values: [String]
  long_name: String
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
  display_type: String
}

input IncidentEditorsRelationInput {
  link: [String]
  create: [UserInsertInput]
}

input ChecklistRiskPrecedentQueryInput {
  description_lt: String
  incident_id_gte: Int
  title_in: [String]
  description_gt: String
  description_nin: [String]
  incident_id_lte: Int
  description_gte: String
  description_exists: Boolean
  description_in: [String]
  incident_id_gt: Int
  incident_id: Int
  description: String
  incident_id_nin: [Int]
  AND: [ChecklistRiskPrecedentQueryInput!]
  incident_id_in: [Int]
  title_exists: Boolean
  tags: [String]
  title_lte: String
  title: String
  incident_id_lt: Int
  title_lt: String
  title_gte: String
  OR: [ChecklistRiskPrecedentQueryInput!]
  incident_id_exists: Boolean
  title_gt: String
  description_ne: String
  tags_in: [String]
  tags_exists: Boolean
  tags_nin: [String]
  description_lte: String
  title_nin: [String]
  incident_id_ne: Int
  title_ne: String
}

enum SubmissionSortByInput {
  _ID_ASC
  DATE_MODIFIED_ASC
  DATE_SUBMITTED_ASC
  DESCRIPTION_DESC
  LANGUAGE_DESC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_ASC
  INCIDENT_TITLE_DESC
  TITLE_ASC
  URL_ASC
  CLOUDINARY_ID_DESC
  EPOCH_DATE_MODIFIED_ASC
  IMAGE_URL_DESC
  INCIDENT_DATE_ASC
  LANGUAGE_ASC
  PLAIN_TEXT_ASC
  CLOUDINARY_ID_ASC
  PLAIN_TEXT_DESC
  TITLE_DESC
  USER_ASC
  STATUS_DESC
  DATE_PUBLISHED_DESC
  INCIDENT_TITLE_ASC
  TEXT_ASC
  URL_DESC
  _ID_DESC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  IMAGE_URL_ASC
  DATE_DOWNLOADED_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_DATE_DESC
  SOURCE_DOMAIN_ASC
  TEXT_DESC
  DATE_MODIFIED_DESC
  DATE_SUBMITTED_DESC
  SOURCE_DOMAIN_DESC
  USER_DESC
  STATUS_ASC
}

input RisksInput {
  tags: [String]
}

input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input CandidateClassification_similarityQueryInput {
  classification_ne: String
  classification: String
  similarity_ne: Float
  similarity_lt: Float
  classification_exists: Boolean
  classification_gte: String
  classification_gt: String
  similarity_gte: Float
  OR: [CandidateClassification_similarityQueryInput!]
  similarity_nin: [Float]
  similarity_in: [Float]
  similarity: Float
  similarity_exists: Boolean
  similarity_gt: Float
  classification_in: [String]
  similarity_lte: Float
  AND: [CandidateClassification_similarityQueryInput!]
  classification_nin: [String]
  classification_lte: String
  classification_lt: String
}

input TaxaField_listComplete_fromQueryInput {
  all_nin: [String]
  all: [String]
  current_exists: Boolean
  current_nin: [String]
  OR: [TaxaField_listComplete_fromQueryInput!]
  all_exists: Boolean
  current: [String]
  current_in: [String]
  AND: [TaxaField_listComplete_fromQueryInput!]
  all_in: [String]
}

type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input History_incidentTsneUpdateInput {
  x_inc: Float
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
}

input ChecklistRiskUpdateInput {
  precedents: [ChecklistRiskPrecedentUpdateInput]
  risk_notes: String
  generated_unset: Boolean
  precedents_unset: Boolean
  likelihood_unset: Boolean
  severity_unset: Boolean
  touched_unset: Boolean
  id_unset: Boolean
  title: String
  tags_unset: Boolean
  severity: String
  risk_status: String
  generated: Boolean
  risk_status_unset: Boolean
  id: String
  risk_notes_unset: Boolean
  tags: [String]
  title_unset: Boolean
  likelihood: String
  touched: Boolean
}

input GetUserInput {
  userId: ObjectId
}

type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

enum UserSortByInput {
  USERID_ASC
  USERID_DESC
  _ID_ASC
  _ID_DESC
  FIRST_NAME_ASC
  FIRST_NAME_DESC
  LAST_NAME_ASC
  LAST_NAME_DESC
}

input ChecklistRiskInsertInput {
  risk_status: String
  title: String
  touched: Boolean
  likelihood: String
  id: String
  precedents: [ChecklistRiskPrecedentInsertInput]
  risk_notes: String
  severity: String
  generated: Boolean
  tags: [String]
}

input SubmissionInsertInput {
  epoch_date_modified: Int
  language: String!
  editor_similar_incidents: [Int]
  incident_editors: SubmissionIncident_editorsRelationInput
  description: String
  developers: SubmissionDevelopersRelationInput
  incident_date: String
  incident_title: String
  date_downloaded: String!
  _id: ObjectId
  editor_dissimilar_incidents: [Int]
  authors: [String]!
  date_submitted: String!
  incident_ids: [Int]
  tags: [String]!
  user: SubmissionUserRelationInput
  quiet: Boolean
  submitters: [String]!
  text: String!
  deployers: SubmissionDeployersRelationInput
  source_domain: String!
  url: String!
  date_modified: String!
  cloudinary_id: String
  editor_notes: String
  embedding: SubmissionEmbeddingInsertInput
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  title: String!
  date_published: String!
  status: String
  plain_text: String
  image_url: String!
  harmed_parties: SubmissionHarmed_partiesRelationInput
}

input History_incidentEmbeddingUpdateInput {
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_reports: [Int]
}

input SubscriptionIncident_idRelationInput {
  create: IncidentInsertInput
  link: Int
}

type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}

input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

enum History_incidentSortByInput {
  TITLE_DESC
  DATE_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  INCIDENT_ID_ASC
  _ID_DESC
  DATE_ASC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_ID_DESC
  TITLE_ASC
  _ID_ASC
  MODIFIEDBY_ASC
  MODIFIEDBY_DESC
  EDITOR_NOTES_DESC
}

input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}

type LogReportHistoryPayload {
  report_number: Int
}

enum History_reportSortByInput {
  DATE_MODIFIED_ASC
  URL_DESC
  PLAIN_TEXT_ASC
  PLAIN_TEXT_DESC
  TITLE_ASC
  USER_DESC
  DATE_SUBMITTED_ASC
  DESCRIPTION_ASC
  MODIFIEDBY_DESC
  LANGUAGE_DESC
  LANGUAGE_ASC
  URL_ASC
  DATE_PUBLISHED_DESC
  DATE_SUBMITTED_DESC
  EPOCH_DATE_MODIFIED_ASC
  IMAGE_URL_DESC
  SOURCE_DOMAIN_DESC
  TITLE_DESC
  CLOUDINARY_ID_DESC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_MODIFIED_DESC
  SOURCE_DOMAIN_ASC
  EPOCH_DATE_PUBLISHED_DESC
  TEXT_DESC
  USER_ASC
  _ID_ASC
  _ID_DESC
  MODIFIEDBY_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  TEXT_ASC
  DESCRIPTION_DESC
  EDITOR_NOTES_DESC
  EPOCH_DATE_SUBMITTED_DESC
  REPORT_NUMBER_ASC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_SUBMITTED_ASC
  REPORT_NUMBER_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  IMAGE_URL_ASC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_DESC
  DATE_PUBLISHED_ASC
  EDITOR_NOTES_ASC
}

input ReportEmbeddingQueryInput {
  from_text_hash_lte: String
  from_text_hash: String
  OR: [ReportEmbeddingQueryInput!]
  from_text_hash_exists: Boolean
  vector_nin: [Float]
  AND: [ReportEmbeddingQueryInput!]
  vector_exists: Boolean
  from_text_hash_ne: String
  vector: [Float]
  from_text_hash_in: [String]
  from_text_hash_gt: String
  vector_in: [Float]
  from_text_hash_nin: [String]
  from_text_hash_gte: String
  from_text_hash_lt: String
}

input CandidateEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
}

input EntityUpdateInput {
  entity_id_unset: Boolean
  _id_unset: Boolean
  date_modified: DateTime
  date_modified_unset: Boolean
  entity_id: String
  name: String
  _id: ObjectId
  created_at_unset: Boolean
  name_unset: Boolean
  created_at: DateTime
}

input UserQueryInput {
  last_name_exists: Boolean
  last_name_nin: [String]
  last_name_lt: String
  userId_ne: String
  _id_in: [ObjectId]
  userId: String
  first_name: String
  roles_nin: [String]
  _id_exists: Boolean
  last_name_lte: String
  _id_nin: [ObjectId]
  userId_lte: String
  roles_exists: Boolean
  _id_gte: ObjectId
  userId_gte: String
  roles_in: [String]
  first_name_exists: Boolean
  first_name_in: [String]
  OR: [UserQueryInput!]
  _id: ObjectId
  userId_nin: [String]
  roles: [String]
  last_name_in: [String]
  AND: [UserQueryInput!]
  userId_exists: Boolean
  _id_lt: ObjectId
  first_name_gte: String
  last_name: String
  userId_gt: String
  first_name_nin: [String]
  userId_in: [String]
  _id_ne: ObjectId
  userId_lt: String
  last_name_gt: String
  _id_lte: ObjectId
  first_name_ne: String
  last_name_ne: String
  _id_gt: ObjectId
  first_name_gt: String
  last_name_gte: String
  first_name_lt: String
  first_name_lte: String
}

enum DuplicateSortByInput {
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
  _ID_ASC
  _ID_DESC
}

type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}

input CandidateClassification_similarityUpdateInput {
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  classification: String
  classification_unset: Boolean
}

input CandidateClassification_similarityInsertInput {
  similarity: Float
  classification: String
}

enum CandidateSortByInput {
  TEXT_ASC
  URL_DESC
  PLAIN_TEXT_DESC
  SIMILARITY_ASC
  SOURCE_DOMAIN_DESC
  DATE_PUBLISHED_DESC
  IMAGE_URL_ASC
  SOURCE_DOMAIN_ASC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  IMAGE_URL_DESC
  SIMILARITY_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  _ID_DESC
  EPOCH_DATE_PUBLISHED_ASC
  PLAIN_TEXT_ASC
  TEXT_DESC
  _ID_ASC
  TITLE_ASC
  EPOCH_DATE_PUBLISHED_DESC
  DATE_PUBLISHED_ASC
  LANGUAGE_DESC
  TITLE_DESC
  LANGUAGE_ASC
  URL_ASC
  DATE_DOWNLOADED_DESC
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

input TaxaQueryInput {
  field_list_exists: Boolean
  namespace_exists: Boolean
  weight_gt: Int
  _id_gt: ObjectId
  OR: [TaxaQueryInput!]
  description_in: [String]
  weight: Int
  complete_entities_exists: Boolean
  dummy_fields_exists: Boolean
  _id_nin: [ObjectId]
  _id_in: [ObjectId]
  field_list_nin: [TaxaField_listQueryInput]
  description_gt: String
  field_list_in: [TaxaField_listQueryInput]
  weight_lt: Int
  weight_ne: Int
  namespace: String
  description: String
  namespace_gte: String
  namespace_ne: String
  _id_exists: Boolean
  namespace_in: [String]
  _id_lt: ObjectId
  dummy_fields: [TaxaDummy_fieldQueryInput]
  description_lt: String
  _id_gte: ObjectId
  field_list: [TaxaField_listQueryInput]
  weight_in: [Int]
  description_nin: [String]
  description_gte: String
  namespace_nin: [String]
  description_exists: Boolean
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  complete_entities_ne: Boolean
  _id_ne: ObjectId
  _id: ObjectId
  _id_lte: ObjectId
  namespace_gt: String
  complete_entities: Boolean
  description_lte: String
  AND: [TaxaQueryInput!]
  namespace_lt: String
  namespace_lte: String
  description_ne: String
  weight_lte: Int
  weight_gte: Int
  weight_exists: Boolean
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  weight_nin: [Int]
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
`;
