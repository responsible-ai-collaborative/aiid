export const typeDefs = `
input SubmissionNlp_similar_incidentQueryInput {
  incident_id: Int
  similarity_in: [Float]
  similarity_gte: Float
  similarity_exists: Boolean
  incident_id_lt: Int
  incident_id_in: [Int]
  similarity: Float
  similarity_gt: Float
  incident_id_ne: Int
  similarity_lt: Float
  incident_id_gte: Int
  incident_id_gt: Int
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_nin: [Int]
  similarity_ne: Float
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_lte: Int
  similarity_lte: Float
  similarity_nin: [Float]
  incident_id_exists: Boolean
}

input EntityInsertInput {
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
  _id: ObjectId
}

input History_reportUpdateInput {
  inputs_outputs: [String]
  editor_notes: String
  language_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  authors_unset: Boolean
  date_downloaded_unset: Boolean
  epoch_date_published: Int
  epoch_date_downloaded: Int
  plain_text_unset: Boolean
  source_domain_unset: Boolean
  source_domain: String
  epoch_date_downloaded_inc: Int
  is_incident_report: Boolean
  epoch_date_submitted_inc: Int
  text_unset: Boolean
  report_number_unset: Boolean
  user: String
  date_submitted: DateTime
  editor_notes_unset: Boolean
  epoch_date_published_unset: Boolean
  modifiedBy: String
  _id_unset: Boolean
  _id: ObjectId
  epoch_date_modified_unset: Boolean
  submitters_unset: Boolean
  flag_unset: Boolean
  epoch_date_submitted: Int
  is_incident_report_unset: Boolean
  epoch_date_modified: Int
  description_unset: Boolean
  embedding: History_reportEmbeddingUpdateInput
  embedding_unset: Boolean
  quiet: Boolean
  epoch_date_published_inc: Int
  report_number_inc: Int
  date_published_unset: Boolean
  tags: [String]
  date_submitted_unset: Boolean
  date_downloaded: DateTime
  report_number: Int
  cloudinary_id: String
  plain_text: String
  modifiedBy_unset: Boolean
  tags_unset: Boolean
  user_unset: Boolean
  description: String
  date_modified: DateTime
  image_url: String
  date_published: DateTime
  language: String
  title_unset: Boolean
  inputs_outputs_unset: Boolean
  url_unset: Boolean
  title: String
  text: String
  cloudinary_id_unset: Boolean
  image_url_unset: Boolean
  flag: Boolean
  date_modified_unset: Boolean
  epoch_date_modified_inc: Int
  submitters: [String]
  epoch_date_submitted_unset: Boolean
  authors: [String]
  url: String
  quiet_unset: Boolean
}

input SubscriptionQueryInput {
  _id_gte: ObjectId
  AND: [SubscriptionQueryInput!]
  type_ne: String
  _id_nin: [ObjectId]
  _id_exists: Boolean
  incident_id: IncidentQueryInput
  _id_ne: ObjectId
  _id_lt: ObjectId
  type: String
  type_nin: [String]
  userId_exists: Boolean
  type_in: [String]
  userId: UserQueryInput
  type_exists: Boolean
  type_gt: String
  OR: [SubscriptionQueryInput!]
  entityId_exists: Boolean
  _id_gt: ObjectId
  _id_in: [ObjectId]
  type_lte: String
  _id_lte: ObjectId
  type_gte: String
  entityId: EntityQueryInput
  _id: ObjectId
  type_lt: String
  incident_id_exists: Boolean
}

enum History_incidentSortByInput {
  INCIDENT_ID_DESC
  MODIFIEDBY_ASC
  MODIFIEDBY_DESC
  TITLE_ASC
  DATE_ASC
  DATE_DESC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_ASC
  TITLE_DESC
  _ID_ASC
  DESCRIPTION_DESC
  EDITOR_NOTES_ASC
  INCIDENT_ID_ASC
  _ID_DESC
  EPOCH_DATE_MODIFIED_DESC
  DESCRIPTION_ASC
}

input SubmissionHarmed_partiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input CandidateEmbeddingQueryInput {
  OR: [CandidateEmbeddingQueryInput!]
  vector_exists: Boolean
  AND: [CandidateEmbeddingQueryInput!]
  vector_in: [Float]
  from_text_hash_exists: Boolean
  from_text_hash_gt: String
  from_text_hash_lte: String
  vector: [Float]
  vector_nin: [Float]
  from_text_hash: String
  from_text_hash_gte: String
  from_text_hash_ne: String
  from_text_hash_lt: String
  from_text_hash_nin: [String]
  from_text_hash_in: [String]
}

input DuplicateInsertInput {
  duplicate_incident_number: Int
  true_incident_number: Int
  _id: ObjectId
}

input TaxaQueryInput {
  namespace_lt: String
  complete_entities: Boolean
  description_lt: String
  _id_gt: ObjectId
  _id_ne: ObjectId
  namespace_exists: Boolean
  description_lte: String
  namespace_in: [String]
  description_ne: String
  weight: Int
  weight_in: [Int]
  weight_lt: Int
  field_list_exists: Boolean
  field_list_in: [TaxaField_listQueryInput]
  complete_entities_exists: Boolean
  dummy_fields_exists: Boolean
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  description_exists: Boolean
  OR: [TaxaQueryInput!]
  namespace_gte: String
  AND: [TaxaQueryInput!]
  description_nin: [String]
  complete_entities_ne: Boolean
  weight_nin: [Int]
  weight_exists: Boolean
  _id_gte: ObjectId
  _id_exists: Boolean
  namespace_lte: String
  _id_lt: ObjectId
  _id: ObjectId
  field_list: [TaxaField_listQueryInput]
  description_gt: String
  namespace_nin: [String]
  description: String
  weight_gte: Int
  field_list_nin: [TaxaField_listQueryInput]
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  weight_gt: Int
  namespace: String
  _id_lte: ObjectId
  weight_ne: Int
  description_gte: String
  description_in: [String]
  namespace_gt: String
  namespace_ne: String
  weight_lte: Int
  _id_in: [ObjectId]
  _id_nin: [ObjectId]
  dummy_fields: [TaxaDummy_fieldQueryInput]
}

input TaxaDummy_fieldQueryInput {
  short_name_nin: [String]
  field_number_gt: String
  field_number_gte: String
  short_name: String
  field_number_lte: String
  field_number_in: [String]
  field_number_nin: [String]
  short_name_gte: String
  field_number: String
  short_name_lte: String
  field_number_exists: Boolean
  OR: [TaxaDummy_fieldQueryInput!]
  short_name_lt: String
  short_name_exists: Boolean
  field_number_lt: String
  short_name_ne: String
  short_name_in: [String]
  AND: [TaxaDummy_fieldQueryInput!]
  short_name_gt: String
  field_number_ne: String
}

enum IncidentSortByInput {
  _ID_DESC
  DATE_DESC
  DESCRIPTION_ASC
  EPOCH_DATE_MODIFIED_DESC
  DATE_ASC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_ASC
  TITLE_ASC
  _ID_ASC
  DESCRIPTION_DESC
  EDITOR_NOTES_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  TITLE_DESC
}

type UserAdminDatum {
  creationDate: DateTime
  disabled: Boolean
  email: String
  lastAuthenticationDate: DateTime
}

type ReportTranslation {
  text: String
  title: String
}

type AppUser {
  email: String
}

input CandidateInsertInput {
  epoch_date_downloaded: Int
  epoch_date_published: Int
  _id: ObjectId
  plain_text: String
  title: String
  language: String
  matching_keywords: [String]
  similarity: Float
  dismissed: Boolean
  text: String
  url: String!
  match: Boolean!
  matching_harm_keywords: [String]
  source_domain: String
  classification_similarity: [CandidateClassification_similarityInsertInput]
  authors: [String]
  date_published: String
  matching_entities: [String]
  embedding: CandidateEmbeddingInsertInput
  image_url: String
  date_downloaded: String
}

input ChecklistRiskUpdateInput {
  touched: Boolean
  id_unset: Boolean
  severity: String
  severity_unset: Boolean
  generated_unset: Boolean
  risk_status: String
  tags: [String]
  likelihood: String
  title_unset: Boolean
  touched_unset: Boolean
  risk_status_unset: Boolean
  generated: Boolean
  risk_notes_unset: Boolean
  title: String
  likelihood_unset: Boolean
  risk_notes: String
  tags_unset: Boolean
  id: String
  precedents: [ChecklistRiskPrecedentUpdateInput]
  precedents_unset: Boolean
}

enum CandidateSortByInput {
  DATE_PUBLISHED_ASC
  DATE_PUBLISHED_DESC
  TITLE_ASC
  LANGUAGE_ASC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  PLAIN_TEXT_ASC
  URL_ASC
  _ID_ASC
  EPOCH_DATE_PUBLISHED_ASC
  IMAGE_URL_ASC
  SOURCE_DOMAIN_DESC
  PLAIN_TEXT_DESC
  SIMILARITY_ASC
  SIMILARITY_DESC
  SOURCE_DOMAIN_ASC
  DATE_DOWNLOADED_ASC
  TEXT_DESC
  TITLE_DESC
  _ID_DESC
  EPOCH_DATE_PUBLISHED_DESC
  LANGUAGE_DESC
  TEXT_ASC
  URL_DESC
  IMAGE_URL_DESC
}

input QuickaddUpdateInput {
  incident_id: Long
  source_domain_unset: Boolean
  date_submitted_unset: Boolean
  _id_unset: Boolean
  date_submitted: String
  incident_id_unset: Boolean
  source_domain: String
  url_unset: Boolean
  _id: ObjectId
  url: String
}

input UserUpdateInput {
  userId: String
  userId_unset: Boolean
  _id: ObjectId
  first_name_unset: Boolean
  last_name_unset: Boolean
  first_name: String
  last_name: String
  roles_unset: Boolean
  _id_unset: Boolean
  roles: [String]
}

input SubmissionNlp_similar_incidentUpdateInput {
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
}

enum NotificationSortByInput {
  _ID_DESC
  INCIDENT_ID_DESC
  SENTDATE_ASC
  USERID_DESC
  _ID_ASC
  SENTDATE_DESC
  TYPE_ASC
  TYPE_DESC
  USERID_ASC
  INCIDENT_ID_ASC
}

input ReportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input IncidentEditorsRelationInput {
  link: [String]
  create: [UserInsertInput]
}

input IncidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
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

input UserInsertInput {
  roles: [String]!
  userId: String!
  _id: ObjectId
  first_name: String
  last_name: String
}

input TaxaField_listItem_fieldComplete_fromQueryInput {
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  current_in: [String]
  current_exists: Boolean
  all_exists: Boolean
  entities_ne: Boolean
  entities_exists: Boolean
  entities: Boolean
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all_nin: [String]
  current: [String]
  current_nin: [String]
  all_in: [String]
  all: [String]
}

input History_incidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

type History_incidentTsne {
  x: Float
  y: Float
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

type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}

input LinkReportsToIncidentsInput {
  report_numbers: [Int]
  incident_ids: [Int]
}

input History_reportQueryInput {
  epoch_date_downloaded_gt: Int
  plain_text_lt: String
  cloudinary_id_nin: [String]
  tags_in: [String]
  flag: Boolean
  language_lt: String
  language_gte: String
  modifiedBy_in: [String]
  date_downloaded_lt: DateTime
  _id_ne: ObjectId
  cloudinary_id_lt: String
  date_modified_exists: Boolean
  description_gt: String
  user_lt: String
  epoch_date_downloaded_in: [Int]
  date_downloaded_ne: DateTime
  source_domain_lt: String
  cloudinary_id: String
  plain_text_exists: Boolean
  language_ne: String
  plain_text: String
  epoch_date_downloaded_lte: Int
  text_exists: Boolean
  report_number: Int
  editor_notes_ne: String
  image_url_gte: String
  text_lt: String
  epoch_date_published_gte: Int
  date_published_in: [DateTime]
  url_exists: Boolean
  epoch_date_downloaded_lt: Int
  language_nin: [String]
  description: String
  editor_notes_exists: Boolean
  text_gt: String
  epoch_date_downloaded_ne: Int
  _id_gt: ObjectId
  date_published_ne: DateTime
  cloudinary_id_ne: String
  epoch_date_submitted_gt: Int
  epoch_date_downloaded_nin: [Int]
  epoch_date_submitted_nin: [Int]
  date_published_gt: DateTime
  url_lt: String
  image_url_lte: String
  _id_lt: ObjectId
  editor_notes_nin: [String]
  date_submitted_lte: DateTime
  description_lte: String
  image_url_ne: String
  date_downloaded_gt: DateTime
  _id_exists: Boolean
  cloudinary_id_gte: String
  report_number_ne: Int
  description_in: [String]
  user_ne: String
  tags: [String]
  cloudinary_id_lte: String
  source_domain_nin: [String]
  epoch_date_modified_lt: Int
  is_incident_report_ne: Boolean
  date_modified_nin: [DateTime]
  user_lte: String
  epoch_date_modified_ne: Int
  plain_text_ne: String
  title_exists: Boolean
  modifiedBy_gt: String
  date_modified_lte: DateTime
  submitters: [String]
  source_domain_ne: String
  text: String
  text_ne: String
  inputs_outputs: [String]
  image_url_gt: String
  epoch_date_modified_gte: Int
  OR: [History_reportQueryInput!]
  date_published_lt: DateTime
  date_downloaded_gte: DateTime
  flag_ne: Boolean
  date_submitted_ne: DateTime
  _id: ObjectId
  language_in: [String]
  editor_notes_lte: String
  epoch_date_published: Int
  user_nin: [String]
  epoch_date_modified_exists: Boolean
  date_submitted_gt: DateTime
  title_nin: [String]
  embedding_exists: Boolean
  modifiedBy_nin: [String]
  user_in: [String]
  date_submitted_exists: Boolean
  date_downloaded_nin: [DateTime]
  image_url_in: [String]
  plain_text_gte: String
  date_submitted_in: [DateTime]
  tags_nin: [String]
  description_exists: Boolean
  url_lte: String
  image_url_nin: [String]
  date_downloaded_lte: DateTime
  editor_notes_gte: String
  quiet: Boolean
  _id_in: [ObjectId]
  title: String
  date_published_exists: Boolean
  description_lt: String
  editor_notes_lt: String
  title_gt: String
  epoch_date_published_gt: Int
  image_url_lt: String
  report_number_lt: Int
  url_in: [String]
  epoch_date_submitted_lt: Int
  is_incident_report_exists: Boolean
  text_lte: String
  date_modified_ne: DateTime
  date_submitted: DateTime
  date_modified_gt: DateTime
  plain_text_gt: String
  inputs_outputs_exists: Boolean
  tags_exists: Boolean
  date_published_lte: DateTime
  title_lt: String
  url_nin: [String]
  text_gte: String
  epoch_date_downloaded: Int
  epoch_date_submitted_lte: Int
  quiet_ne: Boolean
  epoch_date_downloaded_gte: Int
  authors_exists: Boolean
  date_downloaded: DateTime
  language: String
  modifiedBy_lt: String
  cloudinary_id_gt: String
  submitters_nin: [String]
  report_number_lte: Int
  inputs_outputs_in: [String]
  url_ne: String
  user_gt: String
  inputs_outputs_nin: [String]
  epoch_date_modified_nin: [Int]
  editor_notes: String
  epoch_date_downloaded_exists: Boolean
  text_in: [String]
  date_modified_in: [DateTime]
  plain_text_in: [String]
  date_downloaded_exists: Boolean
  title_gte: String
  authors_nin: [String]
  url: String
  image_url_exists: Boolean
  date_published_gte: DateTime
  language_lte: String
  language_exists: Boolean
  date_published_nin: [DateTime]
  report_number_gt: Int
  date_modified: DateTime
  modifiedBy: String
  date_downloaded_in: [DateTime]
  source_domain_exists: Boolean
  authors: [String]
  AND: [History_reportQueryInput!]
  description_gte: String
  epoch_date_modified_in: [Int]
  source_domain_in: [String]
  epoch_date_submitted_in: [Int]
  report_number_gte: Int
  cloudinary_id_in: [String]
  user_gte: String
  epoch_date_submitted: Int
  epoch_date_published_exists: Boolean
  _id_nin: [ObjectId]
  user_exists: Boolean
  title_in: [String]
  modifiedBy_exists: Boolean
  date_submitted_nin: [DateTime]
  source_domain_gte: String
  user: String
  plain_text_nin: [String]
  epoch_date_published_ne: Int
  modifiedBy_lte: String
  report_number_in: [Int]
  cloudinary_id_exists: Boolean
  editor_notes_gt: String
  _id_lte: ObjectId
  epoch_date_published_lte: Int
  text_nin: [String]
  epoch_date_modified_gt: Int
  source_domain: String
  submitters_in: [String]
  epoch_date_modified_lte: Int
  source_domain_gt: String
  date_submitted_gte: DateTime
  quiet_exists: Boolean
  source_domain_lte: String
  epoch_date_published_lt: Int
  epoch_date_modified: Int
  is_incident_report: Boolean
  date_modified_lt: DateTime
  epoch_date_submitted_exists: Boolean
  description_nin: [String]
  epoch_date_published_in: [Int]
  editor_notes_in: [String]
  description_ne: String
  modifiedBy_gte: String
  title_lte: String
  epoch_date_published_nin: [Int]
  url_gte: String
  date_modified_gte: DateTime
  _id_gte: ObjectId
  url_gt: String
  report_number_nin: [Int]
  language_gt: String
  date_submitted_lt: DateTime
  authors_in: [String]
  submitters_exists: Boolean
  image_url: String
  flag_exists: Boolean
  modifiedBy_ne: String
  plain_text_lte: String
  epoch_date_submitted_ne: Int
  date_published: DateTime
  epoch_date_submitted_gte: Int
  embedding: History_reportEmbeddingQueryInput
  report_number_exists: Boolean
  title_ne: String
}

input ClassificationAttributeQueryInput {
  short_name_gte: String
  value_json_gt: String
  value_json_gte: String
  short_name_in: [String]
  short_name_nin: [String]
  value_json: String
  OR: [ClassificationAttributeQueryInput!]
  short_name_exists: Boolean
  value_json_nin: [String]
  value_json_lt: String
  AND: [ClassificationAttributeQueryInput!]
  value_json_ne: String
  value_json_lte: String
  short_name: String
  short_name_gt: String
  short_name_ne: String
  short_name_lt: String
  short_name_lte: String
  value_json_in: [String]
  value_json_exists: Boolean
}

enum History_reportSortByInput {
  _ID_ASC
  CLOUDINARY_ID_DESC
  EPOCH_DATE_PUBLISHED_DESC
  TEXT_DESC
  IMAGE_URL_DESC
  LANGUAGE_ASC
  USER_ASC
  CLOUDINARY_ID_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_SUBMITTED_DESC
  _ID_DESC
  DATE_MODIFIED_ASC
  MODIFIEDBY_ASC
  TITLE_DESC
  URL_DESC
  USER_DESC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  PLAIN_TEXT_DESC
  PLAIN_TEXT_ASC
  REPORT_NUMBER_DESC
  DATE_MODIFIED_DESC
  DATE_SUBMITTED_ASC
  DESCRIPTION_DESC
  MODIFIEDBY_DESC
  TITLE_ASC
  DATE_PUBLISHED_ASC
  EDITOR_NOTES_ASC
  EPOCH_DATE_SUBMITTED_ASC
  IMAGE_URL_ASC
  EPOCH_DATE_MODIFIED_DESC
  REPORT_NUMBER_ASC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_DESC
  DESCRIPTION_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  TEXT_ASC
  URL_ASC
  DATE_SUBMITTED_DESC
  LANGUAGE_DESC
  SOURCE_DOMAIN_ASC
  SOURCE_DOMAIN_DESC
}

type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}

enum QuickaddSortByInput {
  _ID_ASC
  INCIDENT_ID_DESC
  SOURCE_DOMAIN_ASC
  SOURCE_DOMAIN_DESC
  URL_ASC
  URL_DESC
  _ID_DESC
  DATE_SUBMITTED_ASC
  DATE_SUBMITTED_DESC
  INCIDENT_ID_ASC
}

input TaxaField_listUpdateInput {
  permitted_values_unset: Boolean
  public_unset: Boolean
  short_description_unset: Boolean
  required: Boolean
  weight: Int
  field_number: String
  item_fields_unset: Boolean
  long_name_unset: Boolean
  long_name: String
  display_type: String
  long_description: String
  short_name: String
  complete_from: TaxaField_listComplete_fromUpdateInput
  short_description: String
  hide_search: Boolean
  placeholder_unset: Boolean
  field_number_unset: Boolean
  instant_facet_unset: Boolean
  public: Boolean
  weight_unset: Boolean
  weight_inc: Int
  short_name_unset: Boolean
  placeholder: String
  display_type_unset: Boolean
  required_unset: Boolean
  permitted_values: [String]
  default: String
  long_description_unset: Boolean
  hide_search_unset: Boolean
  mongo_type: String
  complete_from_unset: Boolean
  mongo_type_unset: Boolean
  item_fields: TaxaField_listItem_fieldUpdateInput
  instant_facet: Boolean
  default_unset: Boolean
}

input ClassificationReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}

input CreateVariantInputVariant {
  inputs_outputs: [String]
  submitters: [String]
  text: String
  date_published: String
}

input History_incidentUpdateInput {
  reports: [Int]
  editor_notes_unset: Boolean
  date: String
  flagged_dissimilar_incidents: [Int]
  description: String
  editor_similar_incidents: [Int]
  AllegedDeployerOfAISystem_unset: Boolean
  editor_similar_incidents_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  description_unset: Boolean
  title_unset: Boolean
  title: String
  editor_notes: String
  epoch_date_modified_inc: Int
  reports_unset: Boolean
  _id_unset: Boolean
  modifiedBy_unset: Boolean
  modifiedBy: String
  editors_unset: Boolean
  embedding: History_incidentEmbeddingUpdateInput
  tsne: History_incidentTsneUpdateInput
  AllegedDeveloperOfAISystem: [String]
  incident_id_unset: Boolean
  editor_dissimilar_incidents: [Int]
  epoch_date_modified_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  editors: [String]
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  incident_id_inc: Int
  tsne_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties: [String]
  _id: ObjectId
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  date_unset: Boolean
  epoch_date_modified: Int
  editor_dissimilar_incidents_unset: Boolean
  AllegedDeployerOfAISystem: [String]
  embedding_unset: Boolean
  incident_id: Int
}

input IncidentAllegedDeployerOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input History_incidentEmbeddingUpdateInput {
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_reports: [Int]
}

type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
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

type TaxaField_listComplete_from {
  all: [String]
  current: [String]
}

type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input IncidentQueryInput {
  editor_notes_exists: Boolean
  editor_similar_incidents_exists: Boolean
  title_exists: Boolean
  editor_notes_ne: String
  editor_dissimilar_incidents: [Int]
  description_exists: Boolean
  editor_dissimilar_incidents_in: [Int]
  title: String
  epoch_date_modified_gt: Int
  description: String
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  _id_lt: ObjectId
  embedding_exists: Boolean
  nlp_similar_incidents_exists: Boolean
  editor_notes_lte: String
  OR: [IncidentQueryInput!]
  AllegedDeployerOfAISystem_exists: Boolean
  description_gt: String
  title_ne: String
  editor_dissimilar_incidents_nin: [Int]
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  incident_id_lt: Int
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  editors: [UserQueryInput]
  tsne_exists: Boolean
  incident_id_ne: Int
  editors_exists: Boolean
  epoch_date_modified_nin: [Int]
  _id: ObjectId
  editor_notes: String
  title_nin: [String]
  reports_in: [ReportQueryInput]
  editor_notes_in: [String]
  editor_notes_gte: String
  description_ne: String
  epoch_date_modified_exists: Boolean
  AND: [IncidentQueryInput!]
  date: String
  description_in: [String]
  editors_in: [UserQueryInput]
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  AllegedDeployerOfAISystem: [EntityQueryInput]
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  date_nin: [String]
  incident_id_exists: Boolean
  title_gt: String
  epoch_date_modified_lte: Int
  description_lte: String
  reports_nin: [ReportQueryInput]
  embedding: IncidentEmbeddingQueryInput
  epoch_date_modified: Int
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  description_lt: String
  _id_nin: [ObjectId]
  editor_dissimilar_incidents_exists: Boolean
  editor_notes_gt: String
  incident_id_lte: Int
  date_gte: String
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  epoch_date_modified_gte: Int
  date_lt: String
  title_in: [String]
  date_ne: String
  epoch_date_modified_lt: Int
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  flagged_dissimilar_incidents_in: [Int]
  flagged_dissimilar_incidents: [Int]
  date_exists: Boolean
  epoch_date_modified_in: [Int]
  AllegedDeveloperOfAISystem_exists: Boolean
  date_gt: String
  incident_id_in: [Int]
  _id_ne: ObjectId
  incident_id_gte: Int
  _id_gte: ObjectId
  title_lte: String
  tsne: IncidentTsneQueryInput
  _id_exists: Boolean
  editor_notes_nin: [String]
  incident_id_gt: Int
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  _id_in: [ObjectId]
  editor_notes_lt: String
  reports: [ReportQueryInput]
  title_gte: String
  title_lt: String
  flagged_dissimilar_incidents_nin: [Int]
  incident_id: Int
  epoch_date_modified_ne: Int
  _id_lte: ObjectId
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  editor_similar_incidents_in: [Int]
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  editor_similar_incidents: [Int]
  date_in: [String]
  flagged_dissimilar_incidents_exists: Boolean
  editors_nin: [UserQueryInput]
  description_gte: String
  incident_id_nin: [Int]
  editor_similar_incidents_nin: [Int]
  reports_exists: Boolean
  _id_gt: ObjectId
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  date_lte: String
  description_nin: [String]
}

input History_incidentNlp_similar_incidentQueryInput {
  similarity_gte: Float
  incident_id_lte: Int
  incident_id_in: [Int]
  incident_id_ne: Int
  similarity: Float
  similarity_nin: [Float]
  similarity_gt: Float
  incident_id_nin: [Int]
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_lt: Int
  similarity_in: [Float]
  incident_id_exists: Boolean
  similarity_lt: Float
  similarity_exists: Boolean
  incident_id_gt: Int
  similarity_lte: Float
  similarity_ne: Float
  incident_id: Int
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_gte: Int
}

input TaxaField_listItem_fieldQueryInput {
  long_description_gte: String
  weight_lte: Int
  long_name_lt: String
  OR: [TaxaField_listItem_fieldQueryInput!]
  short_name_lt: String
  display_type: String
  long_description_ne: String
  placeholder_gt: String
  display_type_gte: String
  complete_from_exists: Boolean
  short_name_exists: Boolean
  field_number_lt: String
  field_number_gt: String
  weight: Int
  placeholder_lte: String
  placeholder: String
  weight_ne: Int
  short_description: String
  mongo_type_exists: Boolean
  short_description_gt: String
  mongo_type_lte: String
  default_gte: String
  short_name_nin: [String]
  mongo_type_in: [String]
  required_ne: Boolean
  default_lt: String
  public: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  long_name_lte: String
  long_description: String
  weight_gte: Int
  instant_facet_exists: Boolean
  field_number_nin: [String]
  long_name_nin: [String]
  long_name_exists: Boolean
  field_number_gte: String
  instant_facet_ne: Boolean
  default_in: [String]
  long_description_nin: [String]
  mongo_type_ne: String
  long_name_ne: String
  long_name_gt: String
  short_name_lte: String
  default_exists: Boolean
  field_number: String
  mongo_type_gt: String
  short_name_ne: String
  field_number_ne: String
  short_description_gte: String
  placeholder_in: [String]
  long_description_exists: Boolean
  short_description_ne: String
  required_exists: Boolean
  required: Boolean
  mongo_type: String
  short_name: String
  permitted_values_nin: [String]
  field_number_in: [String]
  short_description_lte: String
  display_type_lte: String
  instant_facet: Boolean
  weight_in: [Int]
  public_exists: Boolean
  placeholder_nin: [String]
  mongo_type_nin: [String]
  permitted_values: [String]
  long_name: String
  placeholder_gte: String
  long_description_in: [String]
  long_name_gte: String
  short_description_in: [String]
  weight_lt: Int
  long_description_gt: String
  weight_gt: Int
  long_description_lt: String
  AND: [TaxaField_listItem_fieldQueryInput!]
  mongo_type_gte: String
  short_description_exists: Boolean
  display_type_exists: Boolean
  default_gt: String
  field_number_exists: Boolean
  short_name_gt: String
  short_description_lt: String
  default_nin: [String]
  placeholder_ne: String
  display_type_gt: String
  mongo_type_lt: String
  short_description_nin: [String]
  default_ne: String
  display_type_ne: String
  default_lte: String
  placeholder_exists: Boolean
  short_name_gte: String
  display_type_lt: String
  placeholder_lt: String
  weight_exists: Boolean
  short_name_in: [String]
  long_name_in: [String]
  display_type_nin: [String]
  weight_nin: [Int]
  permitted_values_in: [String]
  default: String
  permitted_values_exists: Boolean
  public_ne: Boolean
  long_description_lte: String
  display_type_in: [String]
  field_number_lte: String
}

type User {
  _id: ObjectId
  adminData: UserAdminDatum
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

input History_incidentTsneUpdateInput {
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
}

input TaxaField_listQueryInput {
  short_description_ne: String
  weight_nin: [Int]
  mongo_type_exists: Boolean
  complete_from: TaxaField_listComplete_fromQueryInput
  AND: [TaxaField_listQueryInput!]
  public_exists: Boolean
  default_exists: Boolean
  default_lte: String
  placeholder_ne: String
  mongo_type_lte: String
  short_name_exists: Boolean
  mongo_type_lt: String
  mongo_type_nin: [String]
  placeholder_in: [String]
  short_name_ne: String
  long_name_lt: String
  short_description_nin: [String]
  long_name: String
  placeholder_exists: Boolean
  long_description_gte: String
  permitted_values_in: [String]
  long_description_lt: String
  placeholder_gte: String
  permitted_values_nin: [String]
  short_name: String
  short_description_in: [String]
  field_number_ne: String
  short_name_gte: String
  long_description_ne: String
  public: Boolean
  weight_gt: Int
  short_name_gt: String
  weight_ne: Int
  hide_search_exists: Boolean
  display_type_gte: String
  permitted_values_exists: Boolean
  display_type_nin: [String]
  short_name_lt: String
  long_description_in: [String]
  field_number_lte: String
  placeholder_lte: String
  field_number: String
  required_ne: Boolean
  instant_facet_exists: Boolean
  placeholder_nin: [String]
  public_ne: Boolean
  short_description_gte: String
  long_name_gte: String
  display_type_lte: String
  long_name_gt: String
  short_description_gt: String
  mongo_type_ne: String
  mongo_type_gte: String
  required: Boolean
  display_type_lt: String
  instant_facet_ne: Boolean
  weight_gte: Int
  field_number_lt: String
  long_description_lte: String
  field_number_in: [String]
  short_description_exists: Boolean
  hide_search: Boolean
  short_description: String
  default_gt: String
  weight_lt: Int
  default_ne: String
  instant_facet: Boolean
  display_type_gt: String
  OR: [TaxaField_listQueryInput!]
  field_number_gte: String
  display_type: String
  required_exists: Boolean
  short_name_nin: [String]
  item_fields_exists: Boolean
  short_description_lt: String
  weight_in: [Int]
  weight_exists: Boolean
  long_name_in: [String]
  long_description_exists: Boolean
  complete_from_exists: Boolean
  long_name_ne: String
  default_lt: String
  hide_search_ne: Boolean
  display_type_exists: Boolean
  mongo_type: String
  long_description: String
  long_description_gt: String
  weight: Int
  mongo_type_in: [String]
  placeholder: String
  default_gte: String
  long_name_lte: String
  default: String
  display_type_in: [String]
  short_description_lte: String
  placeholder_gt: String
  field_number_exists: Boolean
  weight_lte: Int
  field_number_nin: [String]
  mongo_type_gt: String
  default_nin: [String]
  long_name_exists: Boolean
  short_name_in: [String]
  field_number_gt: String
  long_description_nin: [String]
  short_name_lte: String
  default_in: [String]
  display_type_ne: String
  long_name_nin: [String]
  item_fields: TaxaField_listItem_fieldQueryInput
  permitted_values: [String]
  placeholder_lt: String
}

input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input CreateDefaultAdminUserInput {
  email: String
  password: String
}

type IncidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input History_incidentTsneQueryInput {
  y_ne: Float
  AND: [History_incidentTsneQueryInput!]
  x_lte: Float
  y: Float
  y_in: [Float]
  x_gte: Float
  y_nin: [Float]
  x_gt: Float
  y_lte: Float
  x_exists: Boolean
  x_nin: [Float]
  y_gte: Float
  x_ne: Float
  y_exists: Boolean
  x: Float
  y_gt: Float
  OR: [History_incidentTsneQueryInput!]
  y_lt: Float
  x_lt: Float
  x_in: [Float]
}

input ChecklistQueryInput {
  date_updated: DateTime
  about_gt: String
  date_created: DateTime
  id_exists: Boolean
  id_lt: String
  about_ne: String
  date_updated_lt: DateTime
  tags_other_in: [String]
  date_updated_in: [DateTime]
  tags_other_nin: [String]
  date_updated_gte: DateTime
  owner_id_lte: String
  date_created_in: [DateTime]
  entity_id_lte: String
  _id_lt: ObjectId
  about_lt: String
  name_ne: String
  date_created_gt: DateTime
  risks_nin: [ChecklistRiskQueryInput]
  about_in: [String]
  owner_id_ne: String
  about_gte: String
  AND: [ChecklistQueryInput!]
  _id_nin: [ObjectId]
  id_ne: String
  date_updated_ne: DateTime
  _id_gt: ObjectId
  tags_methods: [String]
  tags_methods_exists: Boolean
  _id: ObjectId
  id_gt: String
  id_in: [String]
  date_created_nin: [DateTime]
  entity_id_exists: Boolean
  owner_id_in: [String]
  OR: [ChecklistQueryInput!]
  tags_methods_nin: [String]
  _id_exists: Boolean
  _id_lte: ObjectId
  risks_in: [ChecklistRiskQueryInput]
  owner_id_gte: String
  date_created_gte: DateTime
  about_lte: String
  entity_id_nin: [String]
  risks: [ChecklistRiskQueryInput]
  date_created_lt: DateTime
  entity_id: String
  date_updated_gt: DateTime
  date_created_exists: Boolean
  entity_id_gte: String
  name_gte: String
  entity_id_in: [String]
  date_updated_exists: Boolean
  tags_goals_exists: Boolean
  about_nin: [String]
  entity_id_lt: String
  name_lt: String
  name_nin: [String]
  owner_id: String
  about: String
  tags_methods_in: [String]
  name: String
  name_lte: String
  about_exists: Boolean
  date_created_ne: DateTime
  id_gte: String
  _id_gte: ObjectId
  tags_other_exists: Boolean
  owner_id_gt: String
  risks_exists: Boolean
  entity_id_gt: String
  tags_goals_nin: [String]
  id_lte: String
  tags_goals: [String]
  owner_id_exists: Boolean
  tags_goals_in: [String]
  _id_ne: ObjectId
  date_updated_nin: [DateTime]
  entity_id_ne: String
  date_created_lte: DateTime
  name_exists: Boolean
  id: String
  _id_in: [ObjectId]
  name_gt: String
  tags_other: [String]
  name_in: [String]
  owner_id_lt: String
  id_nin: [String]
  date_updated_lte: DateTime
  owner_id_nin: [String]
}

input History_reportInsertInput {
  is_incident_report: Boolean
  date_downloaded: DateTime!
  text: String!
  editor_notes: String
  flag: Boolean
  modifiedBy: String
  submitters: [String]!
  title: String!
  epoch_date_submitted: Int!
  epoch_date_published: Int!
  embedding: History_reportEmbeddingInsertInput
  date_published: DateTime!
  plain_text: String!
  authors: [String]!
  _id: ObjectId
  epoch_date_modified: Int!
  url: String!
  cloudinary_id: String!
  image_url: String!
  quiet: Boolean
  date_submitted: DateTime!
  date_modified: DateTime!
  report_number: Int!
  language: String!
  epoch_date_downloaded: Int!
  tags: [String]!
  inputs_outputs: [String]
  user: String
  source_domain: String!
  description: String
}

input ReportUpdateInput {
  image_url: String
  epoch_date_downloaded_inc: Int
  _id_unset: Boolean
  epoch_date_published: Int
  epoch_date_modified: Int
  user_unset: Boolean
  editor_notes: String
  source_domain_unset: Boolean
  epoch_date_modified_unset: Boolean
  report_number_unset: Boolean
  date_downloaded: DateTime
  epoch_date_published_inc: Int
  authors: [String]
  date_modified: DateTime
  report_number: Int
  epoch_date_downloaded_unset: Boolean
  epoch_date_published_unset: Boolean
  flag_unset: Boolean
  url_unset: Boolean
  date_submitted: DateTime
  editor_notes_unset: Boolean
  submitters: [String]
  submitters_unset: Boolean
  language_unset: Boolean
  tags_unset: Boolean
  epoch_date_submitted_inc: Int
  inputs_outputs: [String]
  plain_text_unset: Boolean
  authors_unset: Boolean
  title: String
  text_unset: Boolean
  epoch_date_modified_inc: Int
  user: ReportUserRelationInput
  tags: [String]
  is_incident_report: Boolean
  is_incident_report_unset: Boolean
  description_unset: Boolean
  embedding: ReportEmbeddingUpdateInput
  epoch_date_submitted_unset: Boolean
  flag: Boolean
  language: String
  epoch_date_submitted: Int
  description: String
  text: String
  date_submitted_unset: Boolean
  date_downloaded_unset: Boolean
  date_published: DateTime
  source_domain: String
  url: String
  plain_text: String
  quiet: Boolean
  date_modified_unset: Boolean
  title_unset: Boolean
  epoch_date_downloaded: Int
  _id: ObjectId
  image_url_unset: Boolean
  cloudinary_id_unset: Boolean
  date_published_unset: Boolean
  cloudinary_id: String
  quiet_unset: Boolean
  embedding_unset: Boolean
  inputs_outputs_unset: Boolean
  report_number_inc: Int
}

type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

enum UserSortByInput {
  FIRST_NAME_DESC
  LAST_NAME_ASC
  LAST_NAME_DESC
  USERID_ASC
  USERID_DESC
  _ID_ASC
  _ID_DESC
  FIRST_NAME_ASC
}

input ReportInsertInput {
  description: String
  image_url: String!
  authors: [String]!
  date_submitted: DateTime!
  title: String!
  plain_text: String!
  report_number: Int!
  is_incident_report: Boolean
  epoch_date_modified: Int!
  quiet: Boolean
  inputs_outputs: [String]
  _id: ObjectId
  user: ReportUserRelationInput
  embedding: ReportEmbeddingInsertInput
  tags: [String]!
  cloudinary_id: String!
  date_downloaded: DateTime!
  epoch_date_submitted: Int!
  url: String!
  date_published: DateTime!
  flag: Boolean
  epoch_date_published: Int!
  source_domain: String!
  text: String!
  submitters: [String]!
  editor_notes: String
  language: String!
  epoch_date_downloaded: Int!
  date_modified: DateTime!
}

type LogReportHistoryPayload {
  report_number: Int
}

type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}

input SubscriptionIncident_idRelationInput {
  link: Int
  create: IncidentInsertInput
}

type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}

type DeleteManyPayload {
  deletedCount: Int!
}

input TaxaInsertInput {
  namespace: String
  weight: Int
  _id: ObjectId
  complete_entities: Boolean
  description: String
  dummy_fields: [TaxaDummy_fieldInsertInput]
  field_list: [TaxaField_listInsertInput]
}

input SubmissionEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input IncidentAllegedDeveloperOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

type LogIncidentHistoryPayload {
  incident_id: Int
}

input ReportEmbeddingUpdateInput {
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
}

input CandidateUpdateInput {
  text_unset: Boolean
  authors_unset: Boolean
  embedding_unset: Boolean
  match: Boolean
  image_url_unset: Boolean
  dismissed: Boolean
  plain_text: String
  similarity_inc: Float
  similarity_unset: Boolean
  title_unset: Boolean
  _id_unset: Boolean
  dismissed_unset: Boolean
  language: String
  epoch_date_published_inc: Int
  epoch_date_downloaded_unset: Boolean
  embedding: CandidateEmbeddingUpdateInput
  source_domain: String
  date_downloaded: String
  title: String
  classification_similarity_unset: Boolean
  matching_harm_keywords: [String]
  url_unset: Boolean
  epoch_date_published: Int
  match_unset: Boolean
  epoch_date_published_unset: Boolean
  authors: [String]
  text: String
  plain_text_unset: Boolean
  date_published_unset: Boolean
  date_downloaded_unset: Boolean
  source_domain_unset: Boolean
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  matching_keywords_unset: Boolean
  url: String
  epoch_date_downloaded_inc: Int
  matching_entities_unset: Boolean
  similarity: Float
  matching_keywords: [String]
  matching_entities: [String]
  date_published: String
  language_unset: Boolean
  matching_harm_keywords_unset: Boolean
  epoch_date_downloaded: Int
  _id: ObjectId
  image_url: String
}

scalar ObjectId

scalar Long

enum SubmissionSortByInput {
  DATE_DOWNLOADED_ASC
  DESCRIPTION_DESC
  IMAGE_URL_ASC
  STATUS_DESC
  USER_ASC
  URL_DESC
  _ID_ASC
  DESCRIPTION_ASC
  SOURCE_DOMAIN_ASC
  STATUS_ASC
  TITLE_ASC
  DATE_PUBLISHED_ASC
  EDITOR_NOTES_DESC
  INCIDENT_TITLE_DESC
  DATE_MODIFIED_DESC
  DATE_PUBLISHED_DESC
  DATE_SUBMITTED_ASC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_ASC
  LANGUAGE_DESC
  INCIDENT_TITLE_ASC
  PLAIN_TEXT_ASC
  TEXT_ASC
  _ID_DESC
  DATE_SUBMITTED_DESC
  EDITOR_NOTES_ASC
  INCIDENT_DATE_ASC
  INCIDENT_DATE_DESC
  TITLE_DESC
  SOURCE_DOMAIN_DESC
  USER_DESC
  CLOUDINARY_ID_DESC
  DATE_DOWNLOADED_DESC
  IMAGE_URL_DESC
  LANGUAGE_ASC
  PLAIN_TEXT_DESC
  EPOCH_DATE_MODIFIED_DESC
  TEXT_DESC
  URL_ASC
}

input ClassificationAttributeInsertInput {
  short_name: String
  value_json: String
}

input ClassificationUpdateInput {
  _id: ObjectId
  namespace_unset: Boolean
  reports_unset: Boolean
  publish: Boolean
  namespace: String
  reports: ClassificationReportsRelationInput
  publish_unset: Boolean
  notes: String
  _id_unset: Boolean
  attributes_unset: Boolean
  incidents_unset: Boolean
  incidents: ClassificationIncidentsRelationInput
  attributes: [ClassificationAttributeUpdateInput]
  notes_unset: Boolean
}

input SubmissionEmbeddingQueryInput {
  from_text_hash_nin: [String]
  from_text_hash_in: [String]
  from_text_hash_exists: Boolean
  from_text_hash_lt: String
  vector_nin: [Float]
  vector_in: [Float]
  AND: [SubmissionEmbeddingQueryInput!]
  from_text_hash_gt: String
  vector: [Float]
  from_text_hash_lte: String
  vector_exists: Boolean
  OR: [SubmissionEmbeddingQueryInput!]
  from_text_hash_gte: String
  from_text_hash_ne: String
  from_text_hash: String
}

input History_incidentInsertInput {
  editor_dissimilar_incidents: [Int]
  editor_notes: String
  editors: [String]!
  AllegedDeployerOfAISystem: [String]
  AllegedHarmedOrNearlyHarmedParties: [String]
  _id: ObjectId
  tsne: History_incidentTsneInsertInput
  AllegedDeveloperOfAISystem: [String]
  date: String!
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  epoch_date_modified: Int
  description: String
  flagged_dissimilar_incidents: [Int]
  embedding: History_incidentEmbeddingInsertInput
  editor_similar_incidents: [Int]
  incident_id: Int!
  reports: [Int]!
  modifiedBy: String
  title: String!
}

input SubmissionEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

enum ChecklistSortByInput {
  ID_ASC
  NAME_DESC
  OWNER_ID_ASC
  ENTITY_ID_ASC
  NAME_ASC
  _ID_ASC
  ABOUT_DESC
  DATE_UPDATED_DESC
  DATE_UPDATED_ASC
  _ID_DESC
  ABOUT_ASC
  DATE_CREATED_DESC
  OWNER_ID_DESC
  DATE_CREATED_ASC
  ENTITY_ID_DESC
  ID_DESC
}

input TaxaUpdateInput {
  complete_entities: Boolean
  complete_entities_unset: Boolean
  dummy_fields_unset: Boolean
  _id_unset: Boolean
  field_list: [TaxaField_listUpdateInput]
  namespace_unset: Boolean
  field_list_unset: Boolean
  _id: ObjectId
  weight_unset: Boolean
  description: String
  dummy_fields: [TaxaDummy_fieldUpdateInput]
  namespace: String
  weight_inc: Int
  description_unset: Boolean
  weight: Int
}

input ChecklistRiskInsertInput {
  risk_notes: String
  risk_status: String
  severity: String
  tags: [String]
  touched: Boolean
  precedents: [ChecklistRiskPrecedentInsertInput]
  title: String
  likelihood: String
  id: String
  generated: Boolean
}

input History_incidentQueryInput {
  AllegedDeployerOfAISystem_nin: [String]
  description_in: [String]
  date_in: [String]
  _id_in: [ObjectId]
  modifiedBy_nin: [String]
  epoch_date_modified_lt: Int
  OR: [History_incidentQueryInput!]
  _id_ne: ObjectId
  modifiedBy: String
  flagged_dissimilar_incidents_in: [Int]
  modifiedBy_ne: String
  modifiedBy_gte: String
  _id_gte: ObjectId
  date: String
  date_gt: String
  AllegedDeveloperOfAISystem: [String]
  editors: [String]
  AllegedDeveloperOfAISystem_in: [String]
  modifiedBy_gt: String
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  title: String
  incident_id_lt: Int
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  description_nin: [String]
  epoch_date_modified_exists: Boolean
  date_exists: Boolean
  epoch_date_modified_in: [Int]
  description: String
  epoch_date_modified: Int
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  _id_nin: [ObjectId]
  epoch_date_modified_gt: Int
  title_lt: String
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  reports_exists: Boolean
  reports_in: [Int]
  editor_similar_incidents_nin: [Int]
  editor_notes: String
  flagged_dissimilar_incidents_nin: [Int]
  tsne: History_incidentTsneQueryInput
  description_exists: Boolean
  editor_dissimilar_incidents_exists: Boolean
  nlp_similar_incidents_exists: Boolean
  title_ne: String
  epoch_date_modified_nin: [Int]
  tsne_exists: Boolean
  editor_similar_incidents_exists: Boolean
  editor_notes_exists: Boolean
  AllegedDeployerOfAISystem_in: [String]
  _id_exists: Boolean
  flagged_dissimilar_incidents: [Int]
  description_ne: String
  incident_id_gt: Int
  description_lt: String
  editors_nin: [String]
  description_lte: String
  title_nin: [String]
  incident_id_lte: Int
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  editor_notes_in: [String]
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  editors_in: [String]
  editor_notes_lt: String
  description_gt: String
  incident_id: Int
  AllegedDeployerOfAISystem: [String]
  incident_id_gte: Int
  AllegedDeveloperOfAISystem_exists: Boolean
  modifiedBy_lte: String
  editor_dissimilar_incidents: [Int]
  embedding: History_incidentEmbeddingQueryInput
  editor_dissimilar_incidents_nin: [Int]
  incident_id_ne: Int
  _id: ObjectId
  modifiedBy_exists: Boolean
  editor_dissimilar_incidents_in: [Int]
  reports: [Int]
  AND: [History_incidentQueryInput!]
  flagged_dissimilar_incidents_exists: Boolean
  editor_notes_gt: String
  editor_notes_lte: String
  date_lte: String
  incident_id_exists: Boolean
  editors_exists: Boolean
  AllegedDeveloperOfAISystem_nin: [String]
  _id_lte: ObjectId
  title_exists: Boolean
  date_ne: String
  editor_similar_incidents: [Int]
  editor_notes_gte: String
  AllegedDeployerOfAISystem_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties: [String]
  epoch_date_modified_gte: Int
  _id_lt: ObjectId
  editor_notes_nin: [String]
  editor_notes_ne: String
  embedding_exists: Boolean
  _id_gt: ObjectId
  modifiedBy_lt: String
  editor_similar_incidents_in: [Int]
  date_lt: String
  description_gte: String
  epoch_date_modified_lte: Int
  title_lte: String
  incident_id_nin: [Int]
  reports_nin: [Int]
  title_gt: String
  epoch_date_modified_ne: Int
  title_in: [String]
  date_nin: [String]
  date_gte: String
  modifiedBy_in: [String]
  incident_id_in: [Int]
  title_gte: String
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

input ChecklistRiskQueryInput {
  severity_exists: Boolean
  title_ne: String
  likelihood: String
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  risk_status_gt: String
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  tags: [String]
  id_ne: String
  precedents: [ChecklistRiskPrecedentQueryInput]
  severity_ne: String
  tags_nin: [String]
  touched_exists: Boolean
  tags_exists: Boolean
  risk_status_gte: String
  risk_status_lt: String
  risk_status_ne: String
  id_lte: String
  risk_notes: String
  likelihood_lte: String
  touched_ne: Boolean
  title_nin: [String]
  likelihood_exists: Boolean
  risk_notes_gte: String
  title_gte: String
  generated: Boolean
  likelihood_nin: [String]
  likelihood_gte: String
  likelihood_in: [String]
  OR: [ChecklistRiskQueryInput!]
  risk_status_exists: Boolean
  title_exists: Boolean
  likelihood_gt: String
  severity_in: [String]
  id_exists: Boolean
  id_gt: String
  title_gt: String
  title_in: [String]
  generated_exists: Boolean
  precedents_exists: Boolean
  risk_notes_ne: String
  risk_status_lte: String
  id_in: [String]
  severity_gte: String
  AND: [ChecklistRiskQueryInput!]
  title_lt: String
  risk_notes_nin: [String]
  likelihood_ne: String
  tags_in: [String]
  title_lte: String
  likelihood_lt: String
  risk_notes_gt: String
  id: String
  id_lt: String
  title: String
  risk_notes_lte: String
  generated_ne: Boolean
  severity_gt: String
  severity_nin: [String]
  risk_notes_lt: String
  risk_status_nin: [String]
  severity_lte: String
  risk_notes_exists: Boolean
  id_gte: String
  risk_status_in: [String]
  severity: String
  severity_lt: String
  touched: Boolean
  risk_notes_in: [String]
  risk_status: String
  id_nin: [String]
}

input ChecklistInsertInput {
  entity_id: String
  name: String
  tags_methods: [String]
  owner_id: String
  tags_goals: [String]
  about: String
  date_created: DateTime
  id: String
  tags_other: [String]
  _id: ObjectId
  date_updated: DateTime
  risks: [ChecklistRiskInsertInput]
}

type ClassificationAttribute {
  short_name: String
  value_json: String
}

type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}

type IncidentTsne {
  x: Float
  y: Float
}

type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input CreateVariantInput {
  incidentId: Int
  variant: CreateVariantInputVariant
}

type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input History_reportEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input ClassificationInsertInput {
  _id: ObjectId
  attributes: [ClassificationAttributeInsertInput]
  incidents: ClassificationIncidentsRelationInput!
  namespace: String!
  notes: String
  publish: Boolean
  reports: ClassificationReportsRelationInput!
}

input TaxaField_listItem_fieldComplete_fromInsertInput {
  current: [String]
  entities: Boolean
  all: [String]
}

type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input ChecklistRiskPrecedentInsertInput {
  tags: [String]
  title: String
  description: String
  incident_id: Int
}

type Query {
  candidate(query: CandidateQueryInput): Candidate
  candidates(sortBy: CandidateSortByInput, query: CandidateQueryInput, limit: Int = 100): [Candidate]!
  checklist(query: ChecklistQueryInput): Checklist
  checklists(query: ChecklistQueryInput, limit: Int = 100, sortBy: ChecklistSortByInput): [Checklist]!
  classification(query: ClassificationQueryInput): Classification
  classifications(sortBy: ClassificationSortByInput, query: ClassificationQueryInput, limit: Int = 100): [Classification]!
  duplicate(query: DuplicateQueryInput): Duplicate
  duplicates(query: DuplicateQueryInput, limit: Int = 100, sortBy: DuplicateSortByInput): [Duplicate]!
  entities(query: EntityQueryInput, limit: Int = 100, sortBy: EntitySortByInput): [Entity]!
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
  reports(query: ReportQueryInput, limit: Int = 100, sortBy: ReportSortByInput): [Report]!
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

input TaxaField_listComplete_fromUpdateInput {
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
}

input ClassificationIncidentsRelationInput {
  create: [IncidentInsertInput]
  link: [Int]
}

input IncidentNlp_similar_incidentQueryInput {
  similarity_exists: Boolean
  incident_id: Int
  incident_id_lte: Int
  similarity: Float
  similarity_gt: Float
  OR: [IncidentNlp_similar_incidentQueryInput!]
  similarity_in: [Float]
  incident_id_exists: Boolean
  AND: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_in: [Int]
  incident_id_ne: Int
  similarity_nin: [Float]
  similarity_gte: Float
  incident_id_gte: Int
  incident_id_lt: Int
  similarity_lte: Float
  similarity_ne: Float
  incident_id_nin: [Int]
  similarity_lt: Float
  incident_id_gt: Int
}

input TaxaField_listItem_fieldUpdateInput {
  weight_unset: Boolean
  complete_from_unset: Boolean
  long_name: String
  mongo_type: String
  field_number_unset: Boolean
  short_name_unset: Boolean
  short_description: String
  weight: Int
  field_number: String
  mongo_type_unset: Boolean
  short_description_unset: Boolean
  display_type: String
  long_description: String
  placeholder: String
  permitted_values_unset: Boolean
  public: Boolean
  required_unset: Boolean
  default: String
  instant_facet_unset: Boolean
  required: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  display_type_unset: Boolean
  long_name_unset: Boolean
  instant_facet: Boolean
  public_unset: Boolean
  short_name: String
  long_description_unset: Boolean
  weight_inc: Int
  placeholder_unset: Boolean
  default_unset: Boolean
  permitted_values: [String]
}

input IncidentNlp_similar_incidentUpdateInput {
  similarity_inc: Float
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_unset: Boolean
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
  replaceOneEntity(data: EntityInsertInput!, query: EntityQueryInput): Entity
  replaceOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  replaceOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  replaceOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  replaceOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
  replaceOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  replaceOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  replaceOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
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
  updateManySubmissions(query: SubmissionQueryInput, set: SubmissionUpdateInput!): UpdateManyPayload
  updateManySubscriptions(query: SubscriptionQueryInput, set: SubscriptionUpdateInput!): UpdateManyPayload
  updateManyTaxas(set: TaxaUpdateInput!, query: TaxaQueryInput): UpdateManyPayload
  updateManyUsers(query: UserQueryInput, set: UserUpdateInput!): UpdateManyPayload
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
  updateOneReport(set: ReportUpdateInput!, query: ReportQueryInput): Report
  updateOneReportTranslation(input: UpdateOneReportTranslationInput): Report
  updateOneSubmission(query: SubmissionQueryInput, set: SubmissionUpdateInput!): Submission
  updateOneSubscription(set: SubscriptionUpdateInput!, query: SubscriptionQueryInput): Subscription
  updateOneTaxa(query: TaxaQueryInput, set: TaxaUpdateInput!): Taxa
  updateOneUser(query: UserQueryInput, set: UserUpdateInput!): User
  upsertOneCandidate(query: CandidateQueryInput, data: CandidateInsertInput!): Candidate
  upsertOneChecklist(data: ChecklistInsertInput!, query: ChecklistQueryInput): Checklist
  upsertOneClassification(query: ClassificationQueryInput, data: ClassificationInsertInput!): Classification
  upsertOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  upsertOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  upsertOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  upsertOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  upsertOneIncident(data: IncidentInsertInput!, query: IncidentQueryInput): Incident
  upsertOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
  upsertOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  upsertOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  upsertOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  upsertOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  upsertOneTaxa(data: TaxaInsertInput!, query: TaxaQueryInput): Taxa
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
}

input History_incidentTsneInsertInput {
  x: Float
  y: Float
}

input EntityQueryInput {
  created_at_nin: [DateTime]
  created_at_gte: DateTime
  date_modified_exists: Boolean
  name_nin: [String]
  name_lte: String
  entity_id_lt: String
  entity_id_ne: String
  entity_id: String
  entity_id_gt: String
  OR: [EntityQueryInput!]
  _id_lt: ObjectId
  created_at_gt: DateTime
  date_modified_ne: DateTime
  entity_id_nin: [String]
  entity_id_gte: String
  date_modified_lte: DateTime
  entity_id_in: [String]
  name_gt: String
  created_at_ne: DateTime
  date_modified_gt: DateTime
  _id_in: [ObjectId]
  name_in: [String]
  _id_lte: ObjectId
  created_at: DateTime
  name_ne: String
  date_modified_lt: DateTime
  created_at_lte: DateTime
  created_at_exists: Boolean
  name: String
  _id_gte: ObjectId
  date_modified: DateTime
  date_modified_gte: DateTime
  entity_id_lte: String
  name_gte: String
  entity_id_exists: Boolean
  date_modified_in: [DateTime]
  _id_nin: [ObjectId]
  created_at_in: [DateTime]
  _id_gt: ObjectId
  created_at_lt: DateTime
  name_lt: String
  _id: ObjectId
  date_modified_nin: [DateTime]
  AND: [EntityQueryInput!]
  _id_ne: ObjectId
  _id_exists: Boolean
  name_exists: Boolean
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

type CandidateClassification_similarity {
  classification: String
  similarity: Float
}

input ReportEmbeddingQueryInput {
  from_text_hash_ne: String
  from_text_hash_gt: String
  from_text_hash_gte: String
  from_text_hash_nin: [String]
  vector_exists: Boolean
  vector: [Float]
  vector_nin: [Float]
  from_text_hash: String
  from_text_hash_lte: String
  OR: [ReportEmbeddingQueryInput!]
  from_text_hash_in: [String]
  from_text_hash_exists: Boolean
  vector_in: [Float]
  AND: [ReportEmbeddingQueryInput!]
  from_text_hash_lt: String
}

enum ReportSortByInput {
  IMAGE_URL_DESC
  REPORT_NUMBER_DESC
  CLOUDINARY_ID_DESC
  DATE_PUBLISHED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  DATE_SUBMITTED_ASC
  LANGUAGE_DESC
  PLAIN_TEXT_DESC
  _ID_ASC
  CLOUDINARY_ID_ASC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_PUBLISHED_ASC
  LANGUAGE_ASC
  TITLE_ASC
  URL_DESC
  DATE_MODIFIED_DESC
  DATE_SUBMITTED_DESC
  EDITOR_NOTES_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  TEXT_ASC
  DATE_MODIFIED_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_SUBMITTED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  IMAGE_URL_ASC
  SOURCE_DOMAIN_DESC
  TITLE_DESC
  USER_ASC
  DATE_DOWNLOADED_ASC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_DESC
  TEXT_DESC
  USER_DESC
  _ID_DESC
  REPORT_NUMBER_ASC
  SOURCE_DOMAIN_ASC
  URL_ASC
  DESCRIPTION_ASC
  EPOCH_DATE_MODIFIED_DESC
  PLAIN_TEXT_ASC
}

input History_reportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
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

input SubmissionNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
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

type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

enum DuplicateSortByInput {
  _ID_ASC
  _ID_DESC
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
}

input SubmissionUpdateInput {
  user_unset: Boolean
  plain_text_unset: Boolean
  date_downloaded_unset: Boolean
  title_unset: Boolean
  description_unset: Boolean
  developers_unset: Boolean
  quiet: Boolean
  incident_date: String
  title: String
  epoch_date_modified_inc: Int
  status: String
  _id: ObjectId
  epoch_date_modified_unset: Boolean
  authors: [String]
  quiet_unset: Boolean
  language: String
  incident_title_unset: Boolean
  authors_unset: Boolean
  date_submitted: String
  editor_notes_unset: Boolean
  editor_dissimilar_incidents: [Int]
  incident_ids_unset: Boolean
  source_domain_unset: Boolean
  _id_unset: Boolean
  date_modified_unset: Boolean
  date_submitted_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  embedding: SubmissionEmbeddingUpdateInput
  image_url_unset: Boolean
  editor_similar_incidents_unset: Boolean
  user: SubmissionUserRelationInput
  date_published_unset: Boolean
  incident_editors: SubmissionIncident_editorsRelationInput
  embedding_unset: Boolean
  source_domain: String
  editor_dissimilar_incidents_unset: Boolean
  date_downloaded: String
  tags: [String]
  harmed_parties_unset: Boolean
  editor_notes: String
  text_unset: Boolean
  harmed_parties: SubmissionHarmed_partiesRelationInput
  incident_ids: [Int]
  submitters: [String]
  date_published: String
  incident_title: String
  status_unset: Boolean
  deployers_unset: Boolean
  developers: SubmissionDevelopersRelationInput
  editor_similar_incidents: [Int]
  date_modified: String
  language_unset: Boolean
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  url: String
  description: String
  submitters_unset: Boolean
  incident_editors_unset: Boolean
  epoch_date_modified: Int
  tags_unset: Boolean
  text: String
  url_unset: Boolean
  cloudinary_id_unset: Boolean
  plain_text: String
  deployers: SubmissionDeployersRelationInput
  incident_date_unset: Boolean
  image_url: String
  cloudinary_id: String
}

input RisksInput {
  tags: [String]
}

type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}

input CandidateClassification_similarityQueryInput {
  classification_gt: String
  classification_gte: String
  classification: String
  similarity_gte: Float
  OR: [CandidateClassification_similarityQueryInput!]
  similarity_lt: Float
  similarity: Float
  similarity_gt: Float
  similarity_nin: [Float]
  AND: [CandidateClassification_similarityQueryInput!]
  similarity_ne: Float
  similarity_in: [Float]
  classification_exists: Boolean
  classification_ne: String
  classification_in: [String]
  similarity_lte: Float
  classification_lt: String
  classification_lte: String
  similarity_exists: Boolean
  classification_nin: [String]
}

input TaxaDummy_fieldInsertInput {
  short_name: String
  field_number: String
}

input IncidentUpdateInput {
  nlp_similar_incidents_unset: Boolean
  editor_similar_incidents_unset: Boolean
  tsne: IncidentTsneUpdateInput
  epoch_date_modified_unset: Boolean
  editor_notes: String
  AllegedDeveloperOfAISystem_unset: Boolean
  date_unset: Boolean
  title_unset: Boolean
  _id: ObjectId
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  AllegedDeployerOfAISystem_unset: Boolean
  editor_dissimilar_incidents: [Int]
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  date: String
  tsne_unset: Boolean
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  description: String
  embedding_unset: Boolean
  epoch_date_modified_inc: Int
  editors_unset: Boolean
  description_unset: Boolean
  reports: IncidentReportsRelationInput
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  incident_id_unset: Boolean
  _id_unset: Boolean
  embedding: IncidentEmbeddingUpdateInput
  reports_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  editor_notes_unset: Boolean
  editor_dissimilar_incidents_unset: Boolean
  epoch_date_modified: Int
  title: String
  incident_id: Int
  editor_similar_incidents: [Int]
  editors: IncidentEditorsRelationInput
  incident_id_inc: Int
  flagged_dissimilar_incidents: [Int]
  flagged_dissimilar_incidents_unset: Boolean
}

input History_incidentEmbeddingQueryInput {
  from_reports_exists: Boolean
  vector_nin: [Float]
  OR: [History_incidentEmbeddingQueryInput!]
  vector: [Float]
  AND: [History_incidentEmbeddingQueryInput!]
  from_reports_nin: [Int]
  vector_in: [Float]
  from_reports: [Int]
  from_reports_in: [Int]
  vector_exists: Boolean
}

input TaxaField_listComplete_fromQueryInput {
  all_in: [String]
  current_in: [String]
  AND: [TaxaField_listComplete_fromQueryInput!]
  all_nin: [String]
  all_exists: Boolean
  OR: [TaxaField_listComplete_fromQueryInput!]
  current: [String]
  current_nin: [String]
  current_exists: Boolean
  all: [String]
}

input TaxaDummy_fieldUpdateInput {
  field_number_unset: Boolean
  short_name: String
  short_name_unset: Boolean
  field_number: String
}

type CreateVariantPayload {
  incident_id: Int
  report_number: Int
}

type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}

type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input ClassificationQueryInput {
  namespace_lt: String
  attributes_in: [ClassificationAttributeQueryInput]
  reports_in: [ReportQueryInput]
  publish: Boolean
  _id_nin: [ObjectId]
  attributes_exists: Boolean
  notes_lte: String
  namespace_nin: [String]
  notes_nin: [String]
  OR: [ClassificationQueryInput!]
  namespace_lte: String
  notes_lt: String
  notes_exists: Boolean
  publish_exists: Boolean
  namespace_gte: String
  namespace_exists: Boolean
  incidents_nin: [IncidentQueryInput]
  _id_lte: ObjectId
  _id_gte: ObjectId
  attributes_nin: [ClassificationAttributeQueryInput]
  notes_in: [String]
  _id_ne: ObjectId
  attributes: [ClassificationAttributeQueryInput]
  reports_nin: [ReportQueryInput]
  notes_ne: String
  namespace_gt: String
  notes_gte: String
  reports_exists: Boolean
  publish_ne: Boolean
  incidents_in: [IncidentQueryInput]
  namespace: String
  _id_in: [ObjectId]
  AND: [ClassificationQueryInput!]
  _id_lt: ObjectId
  _id_gt: ObjectId
  namespace_in: [String]
  incidents_exists: Boolean
  incidents: [IncidentQueryInput]
  notes: String
  reports: [ReportQueryInput]
  _id: ObjectId
  _id_exists: Boolean
  namespace_ne: String
  notes_gt: String
}

input UserQueryInput {
  AND: [UserQueryInput!]
  first_name_lte: String
  userId_ne: String
  userId_gt: String
  _id_exists: Boolean
  userId_gte: String
  _id_lt: ObjectId
  last_name_ne: String
  last_name_lte: String
  _id_lte: ObjectId
  last_name_gt: String
  roles_in: [String]
  userId_lte: String
  first_name_gte: String
  last_name_in: [String]
  last_name: String
  first_name_ne: String
  userId_lt: String
  last_name_gte: String
  OR: [UserQueryInput!]
  _id_nin: [ObjectId]
  userId_nin: [String]
  first_name_nin: [String]
  _id_gte: ObjectId
  userId_exists: Boolean
  roles_nin: [String]
  first_name: String
  first_name_in: [String]
  roles_exists: Boolean
  first_name_lt: String
  first_name_gt: String
  last_name_exists: Boolean
  _id_gt: ObjectId
  _id: ObjectId
  _id_ne: ObjectId
  userId_in: [String]
  _id_in: [ObjectId]
  userId: String
  first_name_exists: Boolean
  last_name_lt: String
  roles: [String]
  last_name_nin: [String]
}

enum ClassificationSortByInput {
  _ID_ASC
  _ID_DESC
  NAMESPACE_ASC
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
}

input TaxaField_listComplete_fromInsertInput {
  current: [String]
  all: [String]
}

input EntityUpdateInput {
  created_at_unset: Boolean
  _id_unset: Boolean
  date_modified: DateTime
  date_modified_unset: Boolean
  name_unset: Boolean
  name: String
  entity_id_unset: Boolean
  entity_id: String
  _id: ObjectId
  created_at: DateTime
}

scalar DateTime

input QuickaddQueryInput {
  date_submitted_in: [String]
  incident_id_gt: Long
  _id_nin: [ObjectId]
  source_domain: String
  url_in: [String]
  incident_id_exists: Boolean
  source_domain_lt: String
  incident_id: Long
  source_domain_in: [String]
  date_submitted_nin: [String]
  date_submitted_gte: String
  _id: ObjectId
  _id_lt: ObjectId
  url_lte: String
  url_lt: String
  date_submitted_lte: String
  incident_id_ne: Long
  source_domain_ne: String
  incident_id_nin: [Long]
  _id_exists: Boolean
  date_submitted_exists: Boolean
  _id_lte: ObjectId
  url_exists: Boolean
  source_domain_lte: String
  AND: [QuickaddQueryInput!]
  _id_ne: ObjectId
  url_gte: String
  date_submitted_lt: String
  source_domain_exists: Boolean
  incident_id_gte: Long
  _id_in: [ObjectId]
  url: String
  _id_gte: ObjectId
  source_domain_gte: String
  url_ne: String
  url_nin: [String]
  OR: [QuickaddQueryInput!]
  source_domain_gt: String
  _id_gt: ObjectId
  date_submitted_ne: String
  incident_id_lt: Long
  incident_id_lte: Long
  source_domain_nin: [String]
  incident_id_in: [Long]
  date_submitted_gt: String
  url_gt: String
  date_submitted: String
}

input UpdateOneReportTranslationInput {
  language: String!
  plain_text: String!
  report_number: Int!
  text: String!
  title: String!
}

input IncidentReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

input IncidentTsneInsertInput {
  y: Float
  x: Float
}

input CandidateClassification_similarityUpdateInput {
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  classification: String
  classification_unset: Boolean
}

input ChecklistUpdateInput {
  entity_id: String
  about_unset: Boolean
  date_updated: DateTime
  owner_id_unset: Boolean
  risks: [ChecklistRiskUpdateInput]
  _id_unset: Boolean
  tags_methods: [String]
  tags_methods_unset: Boolean
  date_created_unset: Boolean
  risks_unset: Boolean
  tags_other: [String]
  name_unset: Boolean
  owner_id: String
  about: String
  date_created: DateTime
  entity_id_unset: Boolean
  tags_other_unset: Boolean
  tags_goals_unset: Boolean
  id: String
  tags_goals: [String]
  id_unset: Boolean
  _id: ObjectId
  date_updated_unset: Boolean
  name: String
}

input IncidentTsneQueryInput {
  y_lt: Float
  y_in: [Float]
  y_nin: [Float]
  OR: [IncidentTsneQueryInput!]
  x_lt: Float
  y: Float
  y_lte: Float
  y_ne: Float
  x_gte: Float
  x_in: [Float]
  x: Float
  x_ne: Float
  y_exists: Boolean
  x_lte: Float
  y_gt: Float
  AND: [IncidentTsneQueryInput!]
  x_exists: Boolean
  y_gte: Float
  x_nin: [Float]
  x_gt: Float
}

input DuplicateQueryInput {
  duplicate_incident_number_ne: Int
  true_incident_number_lte: Int
  duplicate_incident_number_gte: Int
  _id_gte: ObjectId
  _id_nin: [ObjectId]
  true_incident_number_ne: Int
  duplicate_incident_number_exists: Boolean
  true_incident_number_in: [Int]
  _id_gt: ObjectId
  AND: [DuplicateQueryInput!]
  OR: [DuplicateQueryInput!]
  _id_lt: ObjectId
  true_incident_number_gte: Int
  true_incident_number_lt: Int
  duplicate_incident_number_in: [Int]
  duplicate_incident_number_nin: [Int]
  _id_in: [ObjectId]
  _id_ne: ObjectId
  duplicate_incident_number: Int
  duplicate_incident_number_lt: Int
  _id: ObjectId
  duplicate_incident_number_gt: Int
  true_incident_number_nin: [Int]
  _id_lte: ObjectId
  _id_exists: Boolean
  duplicate_incident_number_lte: Int
  true_incident_number: Int
  true_incident_number_exists: Boolean
  true_incident_number_gt: Int
}

type InsertManyPayload {
  insertedIds: [ObjectId]!
}

input ReportQueryInput {
  report_number_nin: [Int]
  cloudinary_id_nin: [String]
  _id_lt: ObjectId
  editor_notes_gte: String
  date_published_lt: DateTime
  description_lte: String
  date_modified_nin: [DateTime]
  date_submitted_gte: DateTime
  date_downloaded: DateTime
  editor_notes: String
  date_downloaded_gte: DateTime
  date_downloaded_nin: [DateTime]
  epoch_date_modified_nin: [Int]
  date_modified_ne: DateTime
  plain_text: String
  image_url: String
  image_url_ne: String
  report_number_gt: Int
  cloudinary_id_gte: String
  url_ne: String
  editor_notes_gt: String
  title_in: [String]
  flag_ne: Boolean
  url_lt: String
  plain_text_nin: [String]
  OR: [ReportQueryInput!]
  is_incident_report_exists: Boolean
  description_lt: String
  url_gte: String
  epoch_date_downloaded_lte: Int
  inputs_outputs_nin: [String]
  epoch_date_modified_gt: Int
  text_in: [String]
  date_submitted_lt: DateTime
  report_number_lt: Int
  language_in: [String]
  plain_text_lte: String
  is_incident_report: Boolean
  _id_gte: ObjectId
  image_url_lte: String
  inputs_outputs_in: [String]
  source_domain_nin: [String]
  epoch_date_modified: Int
  epoch_date_downloaded_in: [Int]
  inputs_outputs_exists: Boolean
  submitters_in: [String]
  is_incident_report_ne: Boolean
  epoch_date_published_lt: Int
  editor_notes_exists: Boolean
  plain_text_exists: Boolean
  text_nin: [String]
  date_submitted_ne: DateTime
  epoch_date_modified_lt: Int
  epoch_date_modified_exists: Boolean
  plain_text_gt: String
  epoch_date_published_gt: Int
  cloudinary_id_exists: Boolean
  text_gte: String
  tags: [String]
  epoch_date_submitted_ne: Int
  authors_exists: Boolean
  date_downloaded_exists: Boolean
  description_exists: Boolean
  submitters_nin: [String]
  date_submitted_lte: DateTime
  _id_lte: ObjectId
  cloudinary_id_ne: String
  epoch_date_published_nin: [Int]
  description_gte: String
  text: String
  epoch_date_downloaded_ne: Int
  date_downloaded_lte: DateTime
  date_submitted_in: [DateTime]
  text_lte: String
  editor_notes_nin: [String]
  submitters_exists: Boolean
  cloudinary_id_gt: String
  date_downloaded_gt: DateTime
  epoch_date_published: Int
  image_url_gte: String
  url_gt: String
  description_gt: String
  date_modified: DateTime
  date_submitted: DateTime
  date_modified_lt: DateTime
  language_lte: String
  epoch_date_submitted: Int
  user_exists: Boolean
  epoch_date_modified_lte: Int
  url_lte: String
  image_url_lt: String
  inputs_outputs: [String]
  date_published_gt: DateTime
  source_domain_exists: Boolean
  date_published_gte: DateTime
  report_number: Int
  date_submitted_gt: DateTime
  url_in: [String]
  epoch_date_submitted_exists: Boolean
  date_modified_exists: Boolean
  source_domain_in: [String]
  date_submitted_exists: Boolean
  authors: [String]
  epoch_date_submitted_in: [Int]
  epoch_date_published_gte: Int
  date_downloaded_in: [DateTime]
  _id_gt: ObjectId
  _id_in: [ObjectId]
  title_nin: [String]
  date_modified_lte: DateTime
  language_nin: [String]
  title_lte: String
  url_exists: Boolean
  date_downloaded_ne: DateTime
  tags_in: [String]
  source_domain_ne: String
  image_url_nin: [String]
  date_submitted_nin: [DateTime]
  cloudinary_id_in: [String]
  plain_text_ne: String
  text_exists: Boolean
  title_lt: String
  epoch_date_published_lte: Int
  text_ne: String
  epoch_date_published_ne: Int
  embedding: ReportEmbeddingQueryInput
  source_domain_lt: String
  quiet_exists: Boolean
  plain_text_lt: String
  description_in: [String]
  epoch_date_submitted_nin: [Int]
  editor_notes_lt: String
  _id: ObjectId
  epoch_date_downloaded_lt: Int
  flag: Boolean
  epoch_date_submitted_gt: Int
  submitters: [String]
  cloudinary_id_lte: String
  language: String
  tags_exists: Boolean
  plain_text_gte: String
  epoch_date_downloaded: Int
  image_url_gt: String
  epoch_date_submitted_gte: Int
  date_published: DateTime
  date_published_exists: Boolean
  language_gte: String
  source_domain: String
  language_lt: String
  epoch_date_downloaded_exists: Boolean
  image_url_exists: Boolean
  date_modified_in: [DateTime]
  report_number_exists: Boolean
  source_domain_gt: String
  flag_exists: Boolean
  language_gt: String
  date_published_nin: [DateTime]
  report_number_lte: Int
  editor_notes_ne: String
  description_nin: [String]
  user: UserQueryInput
  title: String
  date_downloaded_lt: DateTime
  epoch_date_submitted_lt: Int
  editor_notes_in: [String]
  title_exists: Boolean
  epoch_date_modified_gte: Int
  epoch_date_submitted_lte: Int
  _id_nin: [ObjectId]
  _id_exists: Boolean
  url: String
  description_ne: String
  cloudinary_id: String
  date_published_lte: DateTime
  epoch_date_downloaded_nin: [Int]
  epoch_date_downloaded_gt: Int
  language_ne: String
  epoch_date_downloaded_gte: Int
  title_ne: String
  text_gt: String
  url_nin: [String]
  epoch_date_modified_in: [Int]
  quiet_ne: Boolean
  epoch_date_published_exists: Boolean
  _id_ne: ObjectId
  date_published_in: [DateTime]
  text_lt: String
  plain_text_in: [String]
  report_number_ne: Int
  epoch_date_modified_ne: Int
  description: String
  title_gte: String
  AND: [ReportQueryInput!]
  image_url_in: [String]
  embedding_exists: Boolean
  report_number_gte: Int
  title_gt: String
  source_domain_gte: String
  cloudinary_id_lt: String
  authors_in: [String]
  report_number_in: [Int]
  source_domain_lte: String
  quiet: Boolean
  date_published_ne: DateTime
  editor_notes_lte: String
  epoch_date_published_in: [Int]
  date_modified_gte: DateTime
  tags_nin: [String]
  authors_nin: [String]
  language_exists: Boolean
  date_modified_gt: DateTime
}

input SubmissionQueryInput {
  quiet_exists: Boolean
  title_ne: String
  _id: ObjectId
  source_domain_lte: String
  date_modified_nin: [String]
  title_gte: String
  harmed_parties_exists: Boolean
  language_nin: [String]
  date_published_nin: [String]
  editor_notes_exists: Boolean
  deployers: [EntityQueryInput]
  plain_text_gt: String
  incident_title_gt: String
  text_gt: String
  image_url_nin: [String]
  url_lte: String
  date_modified_in: [String]
  plain_text_in: [String]
  source_domain_lt: String
  date_published_ne: String
  developers: [EntityQueryInput]
  status_gte: String
  tags_nin: [String]
  date_downloaded_exists: Boolean
  image_url_exists: Boolean
  epoch_date_modified_gte: Int
  description: String
  _id_lte: ObjectId
  description_gt: String
  harmed_parties_nin: [EntityQueryInput]
  text_lte: String
  incident_date_in: [String]
  editor_notes_gt: String
  epoch_date_modified: Int
  language: String
  authors_nin: [String]
  plain_text_exists: Boolean
  editor_dissimilar_incidents: [Int]
  url_ne: String
  title_exists: Boolean
  description_gte: String
  developers_exists: Boolean
  incident_date_nin: [String]
  _id_ne: ObjectId
  text_in: [String]
  user: UserQueryInput
  text_nin: [String]
  date_submitted_lt: String
  date_downloaded_nin: [String]
  date_published_gte: String
  tags_in: [String]
  source_domain_ne: String
  editor_notes: String
  developers_in: [EntityQueryInput]
  quiet: Boolean
  status_in: [String]
  editor_dissimilar_incidents_nin: [Int]
  incident_title: String
  nlp_similar_incidents_exists: Boolean
  embedding: SubmissionEmbeddingQueryInput
  incident_editors: [UserQueryInput]
  date_modified_lte: String
  epoch_date_modified_exists: Boolean
  url_lt: String
  date_modified_gt: String
  AND: [SubmissionQueryInput!]
  date_published_exists: Boolean
  language_lte: String
  language_in: [String]
  incident_ids: [Int]
  image_url_ne: String
  incident_title_nin: [String]
  date_published: String
  date_downloaded_gt: String
  image_url_in: [String]
  image_url_lte: String
  editor_similar_incidents: [Int]
  date_downloaded_lte: String
  editor_dissimilar_incidents_in: [Int]
  date_submitted: String
  url_in: [String]
  plain_text_lte: String
  date_submitted_exists: Boolean
  epoch_date_modified_nin: [Int]
  text: String
  source_domain_nin: [String]
  language_gt: String
  developers_nin: [EntityQueryInput]
  cloudinary_id_nin: [String]
  source_domain_gt: String
  incident_date_lt: String
  date_modified_lt: String
  status_exists: Boolean
  text_lt: String
  url: String
  date_submitted_lte: String
  incident_ids_exists: Boolean
  title_lte: String
  incident_title_gte: String
  text_gte: String
  plain_text_nin: [String]
  incident_ids_in: [Int]
  incident_date_gt: String
  _id_in: [ObjectId]
  editor_dissimilar_incidents_exists: Boolean
  date_published_lt: String
  authors_in: [String]
  embedding_exists: Boolean
  date_downloaded_gte: String
  image_url: String
  language_ne: String
  title_in: [String]
  submitters: [String]
  _id_lt: ObjectId
  status_ne: String
  cloudinary_id_lte: String
  incident_editors_exists: Boolean
  editor_notes_ne: String
  submitters_in: [String]
  editor_similar_incidents_nin: [Int]
  url_gte: String
  url_exists: Boolean
  _id_gte: ObjectId
  source_domain: String
  harmed_parties_in: [EntityQueryInput]
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  description_exists: Boolean
  editor_similar_incidents_in: [Int]
  _id_nin: [ObjectId]
  title_gt: String
  status_lte: String
  harmed_parties: [EntityQueryInput]
  incident_title_in: [String]
  url_gt: String
  date_modified_ne: String
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  incident_date: String
  quiet_ne: Boolean
  status_gt: String
  submitters_nin: [String]
  title: String
  status_nin: [String]
  date_modified_exists: Boolean
  tags: [String]
  editor_notes_lte: String
  submitters_exists: Boolean
  date_downloaded_in: [String]
  cloudinary_id_in: [String]
  deployers_nin: [EntityQueryInput]
  epoch_date_modified_lte: Int
  incident_date_exists: Boolean
  incident_date_ne: String
  editor_similar_incidents_exists: Boolean
  cloudinary_id_exists: Boolean
  cloudinary_id_lt: String
  text_exists: Boolean
  date_submitted_gt: String
  OR: [SubmissionQueryInput!]
  date_submitted_nin: [String]
  description_in: [String]
  status: String
  _id_exists: Boolean
  title_lt: String
  incident_ids_nin: [Int]
  editor_notes_gte: String
  authors: [String]
  editor_notes_lt: String
  date_modified: String
  date_submitted_gte: String
  tags_exists: Boolean
  status_lt: String
  _id_gt: ObjectId
  date_downloaded: String
  authors_exists: Boolean
  date_published_in: [String]
  date_submitted_ne: String
  date_modified_gte: String
  incident_date_lte: String
  cloudinary_id: String
  language_lt: String
  plain_text_ne: String
  source_domain_in: [String]
  cloudinary_id_gt: String
  description_lt: String
  user_exists: Boolean
  description_lte: String
  source_domain_gte: String
  epoch_date_modified_gt: Int
  editor_notes_in: [String]
  editor_notes_nin: [String]
  cloudinary_id_gte: String
  description_nin: [String]
  epoch_date_modified_lt: Int
  date_published_lte: String
  incident_title_ne: String
  language_exists: Boolean
  date_published_gt: String
  plain_text_gte: String
  date_downloaded_lt: String
  deployers_in: [EntityQueryInput]
  source_domain_exists: Boolean
  incident_title_exists: Boolean
  incident_editors_in: [UserQueryInput]
  plain_text: String
  description_ne: String
  epoch_date_modified_ne: Int
  incident_title_lte: String
  image_url_gt: String
  cloudinary_id_ne: String
  image_url_lt: String
  plain_text_lt: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  incident_date_gte: String
  text_ne: String
  url_nin: [String]
  date_submitted_in: [String]
  image_url_gte: String
  language_gte: String
  incident_title_lt: String
  date_downloaded_ne: String
  incident_editors_nin: [UserQueryInput]
  epoch_date_modified_in: [Int]
  deployers_exists: Boolean
  title_nin: [String]
}

input TaxaField_listInsertInput {
  mongo_type: String
  placeholder: String
  weight: Int
  complete_from: TaxaField_listComplete_fromInsertInput
  permitted_values: [String]
  public: Boolean
  default: String
  required: Boolean
  long_description: String
  field_number: String
  instant_facet: Boolean
  short_description: String
  short_name: String
  hide_search: Boolean
  long_name: String
  display_type: String
  item_fields: TaxaField_listItem_fieldInsertInput
}

input SubscriptionUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input QuickaddInsertInput {
  source_domain: String
  url: String!
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
}

input CandidateEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input ChecklistRiskPrecedentQueryInput {
  incident_id_gte: Int
  incident_id_lte: Int
  incident_id_nin: [Int]
  description_nin: [String]
  description: String
  title_gt: String
  incident_id_gt: Int
  tags_in: [String]
  description_gte: String
  title_lt: String
  description_ne: String
  tags_nin: [String]
  incident_id_ne: Int
  description_exists: Boolean
  title_ne: String
  incident_id_lt: Int
  title_gte: String
  tags_exists: Boolean
  AND: [ChecklistRiskPrecedentQueryInput!]
  incident_id_in: [Int]
  title_exists: Boolean
  title_in: [String]
  description_lte: String
  description_lt: String
  incident_id_exists: Boolean
  tags: [String]
  incident_id: Int
  title_nin: [String]
  title_lte: String
  OR: [ChecklistRiskPrecedentQueryInput!]
  title: String
  description_in: [String]
  description_gt: String
}

type TaxaDummy_field {
  field_number: String
  short_name: String
}

type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}

input IncidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

input CandidateEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
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

input GetUserInput {
  userId: ObjectId
}

input IncidentTsneUpdateInput {
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
  x_unset: Boolean
  y: Float
}

input SubscriptionUpdateInput {
  type: String
  userId: SubscriptionUserIdRelationInput
  type_unset: Boolean
  entityId_unset: Boolean
  userId_unset: Boolean
  incident_id_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  entityId: SubscriptionEntityIdRelationInput
  incident_id: SubscriptionIncident_idRelationInput
}

enum SubscriptionSortByInput {
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  TYPE_ASC
  USERID_ASC
  USERID_DESC
  _ID_ASC
  _ID_DESC
  TYPE_DESC
  ENTITYID_ASC
  ENTITYID_DESC
}

type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
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

type Entity {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}

input TaxaField_listItem_fieldInsertInput {
  display_type: String
  long_description: String
  short_name: String
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
  public: Boolean
  instant_facet: Boolean
  permitted_values: [String]
  default: String
  placeholder: String
  short_description: String
  weight: Int
  long_name: String
  mongo_type: String
  field_number: String
  required: Boolean
}

input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input CandidateClassification_similarityInsertInput {
  classification: String
  similarity: Float
}

enum EntitySortByInput {
  _ID_ASC
  _ID_DESC
  CREATED_AT_DESC
  ENTITY_ID_DESC
  NAME_DESC
  CREATED_AT_ASC
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  ENTITY_ID_ASC
  NAME_ASC
}

input NotificationInsertInput {
  userId: NotificationUserIdRelationInput
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
}

input ReportUserRelationInput {
  create: UserInsertInput
  link: String
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

input SubmissionIncident_editorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}

input ChecklistRiskPrecedentUpdateInput {
  incident_id_inc: Int
  description_unset: Boolean
  incident_id: Int
  incident_id_unset: Boolean
  description: String
  tags: [String]
  tags_unset: Boolean
  title: String
  title_unset: Boolean
}

input IncidentInsertInput {
  editor_notes: String
  title: String!
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  _id: ObjectId
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  incident_id: Int!
  flagged_dissimilar_incidents: [Int]
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  epoch_date_modified: Int
  reports: IncidentReportsRelationInput!
  tsne: IncidentTsneInsertInput
  editor_similar_incidents: [Int]
  editors: IncidentEditorsRelationInput!
  description: String
  embedding: IncidentEmbeddingInsertInput
  date: String!
  editor_dissimilar_incidents: [Int]
}

input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}

input SubscriptionEntityIdRelationInput {
  create: EntityInsertInput
  link: String
}

input IncidentEmbeddingQueryInput {
  from_reports_exists: Boolean
  from_reports_in: [Int]
  vector: [Float]
  vector_exists: Boolean
  OR: [IncidentEmbeddingQueryInput!]
  from_reports_nin: [Int]
  from_reports: [Int]
  AND: [IncidentEmbeddingQueryInput!]
  vector_nin: [Float]
  vector_in: [Float]
}

input CandidateQueryInput {
  _id: ObjectId
  similarity_exists: Boolean
  _id_exists: Boolean
  epoch_date_published_gte: Int
  language_nin: [String]
  source_domain_gte: String
  image_url_lte: String
  date_downloaded_in: [String]
  image_url_gte: String
  classification_similarity_exists: Boolean
  text_in: [String]
  date_downloaded: String
  plain_text: String
  plain_text_gt: String
  epoch_date_published_exists: Boolean
  epoch_date_downloaded_gte: Int
  matching_entities_exists: Boolean
  title_lte: String
  plain_text_lte: String
  plain_text_in: [String]
  match: Boolean
  date_published_gt: String
  epoch_date_published_in: [Int]
  date_published_exists: Boolean
  epoch_date_downloaded_nin: [Int]
  image_url_exists: Boolean
  source_domain_ne: String
  title: String
  title_exists: Boolean
  epoch_date_downloaded_exists: Boolean
  matching_entities: [String]
  _id_gt: ObjectId
  matching_entities_in: [String]
  title_gte: String
  url_in: [String]
  matching_entities_nin: [String]
  title_nin: [String]
  epoch_date_published_gt: Int
  date_published: String
  date_published_gte: String
  authors_nin: [String]
  match_exists: Boolean
  source_domain_gt: String
  title_lt: String
  _id_nin: [ObjectId]
  date_downloaded_gt: String
  source_domain: String
  dismissed_exists: Boolean
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  epoch_date_downloaded_ne: Int
  text_exists: Boolean
  match_ne: Boolean
  classification_similarity: [CandidateClassification_similarityQueryInput]
  matching_keywords_exists: Boolean
  similarity_in: [Float]
  similarity_lt: Float
  authors_in: [String]
  matching_harm_keywords_in: [String]
  url_nin: [String]
  language_in: [String]
  matching_keywords_nin: [String]
  similarity_lte: Float
  matching_harm_keywords: [String]
  language_gt: String
  authors_exists: Boolean
  source_domain_exists: Boolean
  language_ne: String
  image_url_in: [String]
  AND: [CandidateQueryInput!]
  url: String
  text_lte: String
  date_published_lte: String
  epoch_date_downloaded_gt: Int
  embedding: CandidateEmbeddingQueryInput
  similarity_gte: Float
  url_lte: String
  title_ne: String
  url_lt: String
  embedding_exists: Boolean
  similarity: Float
  url_exists: Boolean
  text_ne: String
  _id_lt: ObjectId
  title_gt: String
  date_published_nin: [String]
  plain_text_ne: String
  source_domain_lt: String
  date_published_in: [String]
  image_url_gt: String
  epoch_date_published_nin: [Int]
  _id_in: [ObjectId]
  matching_keywords: [String]
  matching_harm_keywords_exists: Boolean
  epoch_date_published_ne: Int
  date_downloaded_ne: String
  epoch_date_published_lt: Int
  language_lt: String
  source_domain_in: [String]
  source_domain_lte: String
  epoch_date_downloaded_in: [Int]
  _id_gte: ObjectId
  similarity_gt: Float
  text_gte: String
  matching_harm_keywords_nin: [String]
  image_url_ne: String
  text_lt: String
  title_in: [String]
  epoch_date_published_lte: Int
  dismissed: Boolean
  plain_text_exists: Boolean
  source_domain_nin: [String]
  plain_text_lt: String
  language: String
  date_downloaded_exists: Boolean
  language_exists: Boolean
  epoch_date_published: Int
  url_gte: String
  plain_text_gte: String
  date_published_lt: String
  _id_ne: ObjectId
  image_url_nin: [String]
  epoch_date_downloaded_lt: Int
  date_downloaded_gte: String
  epoch_date_downloaded_lte: Int
  similarity_nin: [Float]
  language_gte: String
  image_url: String
  date_published_ne: String
  date_downloaded_lte: String
  text_nin: [String]
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  OR: [CandidateQueryInput!]
  text_gt: String
  language_lte: String
  date_downloaded_lt: String
  epoch_date_downloaded: Int
  authors: [String]
  url_gt: String
  dismissed_ne: Boolean
  plain_text_nin: [String]
  date_downloaded_nin: [String]
  text: String
  image_url_lt: String
  similarity_ne: Float
  _id_lte: ObjectId
  url_ne: String
  matching_keywords_in: [String]
}

input TaxaField_listItem_fieldComplete_fromUpdateInput {
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  entities: Boolean
  entities_unset: Boolean
}

input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input NotificationQueryInput {
  type_lt: String
  type_in: [String]
  processed: Boolean
  incident_id_nin: [Int]
  sentDate_exists: Boolean
  type_lte: String
  incident_id_lt: Int
  type_gt: String
  incident_id: Int
  userId_exists: Boolean
  type_exists: Boolean
  _id_in: [ObjectId]
  sentDate_gte: DateTime
  sentDate_nin: [DateTime]
  AND: [NotificationQueryInput!]
  _id_gte: ObjectId
  _id_exists: Boolean
  sentDate_gt: DateTime
  type_ne: String
  incident_id_in: [Int]
  processed_exists: Boolean
  _id_gt: ObjectId
  _id_ne: ObjectId
  processed_ne: Boolean
  sentDate_ne: DateTime
  _id_lte: ObjectId
  incident_id_lte: Int
  _id_lt: ObjectId
  incident_id_gt: Int
  _id_nin: [ObjectId]
  incident_id_ne: Int
  OR: [NotificationQueryInput!]
  _id: ObjectId
  incident_id_gte: Int
  sentDate_lt: DateTime
  incident_id_exists: Boolean
  sentDate_in: [DateTime]
  type_nin: [String]
  type: String
  sentDate_lte: DateTime
  sentDate: DateTime
  userId: UserQueryInput
  type_gte: String
}

input PromoteSubmissionToReportInput {
  incident_ids: [Int]
  is_incident_report: Boolean
  submission_id: ObjectId
}

input IncidentEmbeddingUpdateInput {
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
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

input SubmissionInsertInput {
  authors: [String]!
  developers: SubmissionDevelopersRelationInput
  embedding: SubmissionEmbeddingInsertInput
  quiet: Boolean
  date_submitted: String!
  url: String!
  incident_ids: [Int]
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  user: SubmissionUserRelationInput
  status: String
  submitters: [String]!
  date_published: String!
  harmed_parties: SubmissionHarmed_partiesRelationInput
  description: String
  title: String!
  cloudinary_id: String
  text: String!
  editor_notes: String
  incident_editors: SubmissionIncident_editorsRelationInput
  language: String!
  source_domain: String!
  incident_date: String
  editor_dissimilar_incidents: [Int]
  incident_title: String
  plain_text: String
  image_url: String!
  editor_similar_incidents: [Int]
  deployers: SubmissionDeployersRelationInput
  _id: ObjectId
  date_modified: String!
  epoch_date_modified: Int
  tags: [String]!
  date_downloaded: String!
}

input ClassificationAttributeUpdateInput {
  short_name_unset: Boolean
  value_json: String
  value_json_unset: Boolean
  short_name: String
}

input History_reportEmbeddingQueryInput {
  vector_in: [Float]
  from_text_hash_gt: String
  from_text_hash_lte: String
  vector_exists: Boolean
  from_text_hash_ne: String
  from_text_hash_gte: String
  from_text_hash_in: [String]
  vector_nin: [Float]
  from_text_hash_nin: [String]
  AND: [History_reportEmbeddingQueryInput!]
  from_text_hash: String
  from_text_hash_lt: String
  OR: [History_reportEmbeddingQueryInput!]
  vector: [Float]
  from_text_hash_exists: Boolean
}

input History_incidentNlp_similar_incidentUpdateInput {
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
}

input NotificationUpdateInput {
  sentDate_unset: Boolean
  userId: NotificationUserIdRelationInput
  type_unset: Boolean
  incident_id: Int
  processed: Boolean
  incident_id_inc: Int
  processed_unset: Boolean
  incident_id_unset: Boolean
  userId_unset: Boolean
  _id_unset: Boolean
  type: String
  _id: ObjectId
  sentDate: DateTime
}

input SubscriptionInsertInput {
  userId: SubscriptionUserIdRelationInput!
  _id: ObjectId
  entityId: SubscriptionEntityIdRelationInput
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
}
`;
