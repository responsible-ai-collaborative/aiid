export const typeDefs = `
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

enum IncidentSortByInput {
  EDITOR_NOTES_ASC
  TITLE_ASC
  TITLE_DESC
  _ID_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  DATE_ASC
  INCIDENT_ID_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_ASC
  INCIDENT_ID_DESC
  _ID_DESC
  DATE_DESC
  DESCRIPTION_ASC
}

input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input History_reportEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
}

input CandidateClassification_similarityQueryInput {
  similarity_ne: Float
  classification_gte: String
  classification_in: [String]
  similarity_gt: Float
  AND: [CandidateClassification_similarityQueryInput!]
  OR: [CandidateClassification_similarityQueryInput!]
  similarity: Float
  similarity_in: [Float]
  similarity_exists: Boolean
  classification_lt: String
  similarity_lt: Float
  classification: String
  similarity_lte: Float
  classification_ne: String
  classification_gt: String
  similarity_gte: Float
  classification_nin: [String]
  classification_exists: Boolean
  classification_lte: String
  similarity_nin: [Float]
}

input NotificationQueryInput {
  type_ne: String
  incident_id_gt: Int
  processed_ne: Boolean
  type_gt: String
  _id_lte: ObjectId
  incident_id_lt: Int
  _id_lt: ObjectId
  processed: Boolean
  sentDate_in: [DateTime]
  sentDate_gt: DateTime
  AND: [NotificationQueryInput!]
  incident_id_exists: Boolean
  _id_ne: ObjectId
  type_in: [String]
  incident_id_gte: Int
  incident_id_in: [Int]
  processed_exists: Boolean
  sentDate_lte: DateTime
  _id_gte: ObjectId
  _id_nin: [ObjectId]
  sentDate: DateTime
  incident_id_lte: Int
  sentDate_ne: DateTime
  incident_id_nin: [Int]
  type_lte: String
  _id_exists: Boolean
  sentDate_lt: DateTime
  type_exists: Boolean
  type_gte: String
  sentDate_exists: Boolean
  userId_exists: Boolean
  _id_gt: ObjectId
  type: String
  type_lt: String
  incident_id_ne: Int
  _id: ObjectId
  OR: [NotificationQueryInput!]
  sentDate_gte: DateTime
  sentDate_nin: [DateTime]
  _id_in: [ObjectId]
  incident_id: Int
  userId: UserQueryInput
  type_nin: [String]
}

enum ReportSortByInput {
  DATE_SUBMITTED_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  TEXT_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_MODIFIED_ASC
  SOURCE_DOMAIN_ASC
  SOURCE_DOMAIN_DESC
  TITLE_DESC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_ASC
  EPOCH_DATE_PUBLISHED_ASC
  LANGUAGE_DESC
  PLAIN_TEXT_DESC
  URL_DESC
  USER_ASC
  USER_DESC
  _ID_DESC
  CLOUDINARY_ID_DESC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  EPOCH_DATE_PUBLISHED_DESC
  LANGUAGE_ASC
  DATE_SUBMITTED_DESC
  IMAGE_URL_ASC
  TEXT_DESC
  _ID_ASC
  DATE_MODIFIED_DESC
  EPOCH_DATE_MODIFIED_DESC
  URL_ASC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_DESC
  DESCRIPTION_DESC
  EDITOR_NOTES_DESC
  EPOCH_DATE_SUBMITTED_ASC
  REPORT_NUMBER_DESC
  TITLE_ASC
  DATE_DOWNLOADED_ASC
  DATE_PUBLISHED_ASC
  EPOCH_DATE_SUBMITTED_DESC
  IMAGE_URL_DESC
  PLAIN_TEXT_ASC
  REPORT_NUMBER_ASC
}

input LinkReportsToIncidentsInput {
  incident_ids: [Int]
  report_numbers: [Int]
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
  report_number: Int!
  source_domain: String!
  submitters: [String]!
  tags: [String]!
  text: String!
  title: String!
  url: String!
  user: String
}

type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input History_incidentQueryInput {
  incident_id_gte: Int
  editor_similar_incidents_in: [Int]
  embedding: History_incidentEmbeddingQueryInput
  _id_lte: ObjectId
  editor_dissimilar_incidents_in: [Int]
  embedding_exists: Boolean
  editor_notes_lt: String
  title_gte: String
  epoch_date_modified_nin: [Int]
  title_exists: Boolean
  AllegedDeveloperOfAISystem_in: [String]
  incident_id_lt: Int
  description_exists: Boolean
  editor_notes_ne: String
  description_in: [String]
  flagged_dissimilar_incidents_nin: [Int]
  editor_notes_lte: String
  AllegedDeveloperOfAISystem_exists: Boolean
  flagged_dissimilar_incidents_exists: Boolean
  date_nin: [String]
  editor_similar_incidents_nin: [Int]
  title_in: [String]
  date_lte: String
  _id: ObjectId
  date_exists: Boolean
  _id_gt: ObjectId
  epoch_date_modified_in: [Int]
  modifiedBy_lte: String
  AllegedDeployerOfAISystem_in: [String]
  AllegedDeployerOfAISystem: [String]
  description_gt: String
  nlp_similar_incidents_exists: Boolean
  incident_id_lte: Int
  date_in: [String]
  title_nin: [String]
  editor_notes_exists: Boolean
  epoch_date_modified_ne: Int
  tsne_exists: Boolean
  title: String
  _id_ne: ObjectId
  epoch_date_modified_lt: Int
  editor_dissimilar_incidents_nin: [Int]
  description: String
  AllegedHarmedOrNearlyHarmedParties: [String]
  modifiedBy_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  editor_notes_nin: [String]
  title_gt: String
  AllegedDeployerOfAISystem_nin: [String]
  AllegedDeveloperOfAISystem_nin: [String]
  editor_similar_incidents_exists: Boolean
  date_gte: String
  flagged_dissimilar_incidents_in: [Int]
  OR: [History_incidentQueryInput!]
  _id_lt: ObjectId
  date: String
  _id_exists: Boolean
  tsne: History_incidentTsneQueryInput
  editors: [String]
  flagged_dissimilar_incidents: [Int]
  reports_nin: [Int]
  epoch_date_modified_gte: Int
  incident_id_ne: Int
  description_lte: String
  incident_id: Int
  editors_in: [String]
  reports_in: [Int]
  _id_in: [ObjectId]
  epoch_date_modified_exists: Boolean
  reports_exists: Boolean
  incident_id_nin: [Int]
  modifiedBy_gte: String
  editors_nin: [String]
  incident_id_exists: Boolean
  date_gt: String
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  description_lt: String
  modifiedBy_ne: String
  modifiedBy_nin: [String]
  description_ne: String
  incident_id_in: [Int]
  editor_notes_in: [String]
  _id_gte: ObjectId
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  editor_similar_incidents: [Int]
  AllegedDeveloperOfAISystem: [String]
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  date_lt: String
  title_lte: String
  editor_dissimilar_incidents: [Int]
  epoch_date_modified_lte: Int
  _id_nin: [ObjectId]
  incident_id_gt: Int
  editors_exists: Boolean
  description_nin: [String]
  editor_notes_gte: String
  modifiedBy_gt: String
  description_gte: String
  title_lt: String
  title_ne: String
  epoch_date_modified_gt: Int
  AllegedDeployerOfAISystem_exists: Boolean
  editor_notes_gt: String
  AND: [History_incidentQueryInput!]
  modifiedBy_in: [String]
  modifiedBy: String
  modifiedBy_lt: String
  editor_dissimilar_incidents_exists: Boolean
  epoch_date_modified: Int
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  editor_notes: String
  date_ne: String
  reports: [Int]
}

input ChecklistQueryInput {
  name: String
  entity_id: String
  name_nin: [String]
  owner_id_nin: [String]
  entity_id_lt: String
  tags_other_in: [String]
  date_created_lt: DateTime
  entity_id_exists: Boolean
  owner_id_in: [String]
  date_created_lte: DateTime
  tags_methods_nin: [String]
  risks_exists: Boolean
  owner_id_gte: String
  owner_id_lt: String
  name_in: [String]
  _id_exists: Boolean
  owner_id: String
  date_updated_nin: [DateTime]
  OR: [ChecklistQueryInput!]
  date_created_gt: DateTime
  risks: [ChecklistRiskQueryInput]
  tags_other_nin: [String]
  tags_methods_exists: Boolean
  owner_id_exists: Boolean
  date_created_exists: Boolean
  id_gte: String
  date_updated_in: [DateTime]
  name_ne: String
  entity_id_lte: String
  id_lte: String
  id_lt: String
  name_lte: String
  owner_id_ne: String
  date_updated_lt: DateTime
  date_created_nin: [DateTime]
  name_exists: Boolean
  _id_nin: [ObjectId]
  entity_id_nin: [String]
  tags_goals_exists: Boolean
  date_updated_gt: DateTime
  about_lt: String
  entity_id_ne: String
  id: String
  name_gte: String
  about_lte: String
  about_in: [String]
  id_exists: Boolean
  tags_goals: [String]
  id_in: [String]
  risks_in: [ChecklistRiskQueryInput]
  date_created_ne: DateTime
  about: String
  name_lt: String
  _id_gte: ObjectId
  _id_lte: ObjectId
  _id_ne: ObjectId
  entity_id_gt: String
  id_nin: [String]
  about_nin: [String]
  date_updated_ne: DateTime
  tags_other_exists: Boolean
  AND: [ChecklistQueryInput!]
  name_gt: String
  _id_lt: ObjectId
  tags_methods_in: [String]
  id_ne: String
  tags_goals_in: [String]
  risks_nin: [ChecklistRiskQueryInput]
  owner_id_lte: String
  date_created_in: [DateTime]
  owner_id_gt: String
  about_gt: String
  date_created: DateTime
  date_updated_exists: Boolean
  tags_goals_nin: [String]
  tags_methods: [String]
  about_exists: Boolean
  entity_id_in: [String]
  _id_gt: ObjectId
  entity_id_gte: String
  about_gte: String
  tags_other: [String]
  about_ne: String
  date_created_gte: DateTime
  date_updated_lte: DateTime
  _id: ObjectId
  date_updated_gte: DateTime
  id_gt: String
  date_updated: DateTime
  _id_in: [ObjectId]
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

input UserInsertInput {
  roles: [String]!
  userId: String!
  _id: ObjectId
  first_name: String
  last_name: String
}

input UpdateOneReportTranslationInput {
  title: String!
  language: String!
  plain_text: String!
  report_number: Int!
  text: String!
}

input PromoteSubmissionToReportInput {
  is_incident_report: Boolean
  submission_id: ObjectId
  incident_ids: [Int]
}

input TaxaField_listItem_fieldUpdateInput {
  short_description_unset: Boolean
  weight_unset: Boolean
  display_type_unset: Boolean
  instant_facet: Boolean
  instant_facet_unset: Boolean
  short_name: String
  long_description: String
  permitted_values_unset: Boolean
  field_number: String
  short_name_unset: Boolean
  placeholder: String
  permitted_values: [String]
  mongo_type_unset: Boolean
  required: Boolean
  short_description: String
  long_name_unset: Boolean
  default: String
  complete_from_unset: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  long_name: String
  placeholder_unset: Boolean
  public: Boolean
  public_unset: Boolean
  long_description_unset: Boolean
  weight_inc: Int
  display_type: String
  field_number_unset: Boolean
  weight: Int
  default_unset: Boolean
  mongo_type: String
  required_unset: Boolean
}

type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}

input CandidateClassification_similarityInsertInput {
  classification: String
  similarity: Float
}

input CandidateEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input TaxaDummy_fieldUpdateInput {
  field_number: String
  field_number_unset: Boolean
  short_name: String
  short_name_unset: Boolean
}

input SubscriptionUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input GetUserInput {
  userId: ObjectId
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

input History_reportQueryInput {
  url_lt: String
  modifiedBy_in: [String]
  source_domain_exists: Boolean
  report_number: Int
  report_number_gte: Int
  submitters: [String]
  text_lte: String
  title_gt: String
  inputs_outputs_exists: Boolean
  url: String
  url_ne: String
  description: String
  epoch_date_downloaded_gt: Int
  description_exists: Boolean
  epoch_date_downloaded_nin: [Int]
  epoch_date_downloaded_exists: Boolean
  text_exists: Boolean
  date_submitted_lte: DateTime
  title_nin: [String]
  source_domain_nin: [String]
  inputs_outputs_nin: [String]
  date_published_in: [DateTime]
  modifiedBy_gt: String
  text_gte: String
  cloudinary_id_nin: [String]
  report_number_lt: Int
  epoch_date_submitted_exists: Boolean
  tags_exists: Boolean
  description_ne: String
  date_modified_exists: Boolean
  language_in: [String]
  _id_gt: ObjectId
  plain_text_ne: String
  epoch_date_submitted_lt: Int
  epoch_date_published_ne: Int
  date_submitted_lt: DateTime
  user_in: [String]
  user_gt: String
  cloudinary_id: String
  url_gte: String
  plain_text_nin: [String]
  date_downloaded_nin: [DateTime]
  flag_ne: Boolean
  epoch_date_submitted_lte: Int
  inputs_outputs_in: [String]
  submitters_nin: [String]
  date_published_exists: Boolean
  date_modified_lte: DateTime
  language_exists: Boolean
  date_published_gt: DateTime
  description_lte: String
  editor_notes_lte: String
  user_nin: [String]
  plain_text: String
  user_gte: String
  date_published_lte: DateTime
  title_gte: String
  date_published_nin: [DateTime]
  epoch_date_modified: Int
  image_url_exists: Boolean
  _id_gte: ObjectId
  authors_in: [String]
  user_ne: String
  epoch_date_submitted_gte: Int
  url_in: [String]
  date_submitted: DateTime
  modifiedBy_lte: String
  source_domain_ne: String
  _id: ObjectId
  plain_text_exists: Boolean
  text_in: [String]
  description_gt: String
  epoch_date_submitted_nin: [Int]
  image_url: String
  embedding: History_reportEmbeddingQueryInput
  authors_nin: [String]
  image_url_lt: String
  language_lte: String
  embedding_exists: Boolean
  text: String
  plain_text_lt: String
  AND: [History_reportQueryInput!]
  description_lt: String
  flag: Boolean
  tags_in: [String]
  date_downloaded_lt: DateTime
  cloudinary_id_gt: String
  epoch_date_submitted_in: [Int]
  title_ne: String
  language_lt: String
  editor_notes_nin: [String]
  modifiedBy: String
  epoch_date_published_gt: Int
  date_downloaded_exists: Boolean
  tags_nin: [String]
  date_downloaded_ne: DateTime
  text_ne: String
  authors_exists: Boolean
  plain_text_gte: String
  editor_notes_lt: String
  date_modified_ne: DateTime
  user_lte: String
  epoch_date_modified_nin: [Int]
  epoch_date_downloaded_ne: Int
  report_number_nin: [Int]
  language_nin: [String]
  tags: [String]
  date_modified_nin: [DateTime]
  image_url_in: [String]
  epoch_date_downloaded_lte: Int
  date_submitted_ne: DateTime
  epoch_date_modified_lte: Int
  source_domain: String
  language_gte: String
  cloudinary_id_exists: Boolean
  _id_lte: ObjectId
  epoch_date_published_lt: Int
  image_url_gt: String
  modifiedBy_ne: String
  inputs_outputs: [String]
  _id_ne: ObjectId
  date_downloaded_in: [DateTime]
  image_url_ne: String
  epoch_date_published: Int
  image_url_gte: String
  report_number_ne: Int
  epoch_date_modified_lt: Int
  source_domain_lte: String
  url_lte: String
  title_exists: Boolean
  epoch_date_downloaded: Int
  _id_nin: [ObjectId]
  authors: [String]
  cloudinary_id_gte: String
  cloudinary_id_lt: String
  epoch_date_downloaded_lt: Int
  date_submitted_exists: Boolean
  epoch_date_modified_gte: Int
  epoch_date_published_gte: Int
  date_submitted_nin: [DateTime]
  date_published: DateTime
  image_url_nin: [String]
  epoch_date_published_lte: Int
  url_exists: Boolean
  user_lt: String
  is_incident_report_exists: Boolean
  epoch_date_modified_gt: Int
  user: String
  language_ne: String
  modifiedBy_lt: String
  description_gte: String
  _id_in: [ObjectId]
  title_lt: String
  epoch_date_published_exists: Boolean
  _id_lt: ObjectId
  date_modified_lt: DateTime
  text_nin: [String]
  plain_text_lte: String
  title_lte: String
  is_incident_report_ne: Boolean
  modifiedBy_gte: String
  epoch_date_modified_ne: Int
  epoch_date_submitted_ne: Int
  date_published_gte: DateTime
  date_modified_gt: DateTime
  date_downloaded_lte: DateTime
  date_modified_in: [DateTime]
  flag_exists: Boolean
  modifiedBy_exists: Boolean
  date_published_lt: DateTime
  epoch_date_downloaded_in: [Int]
  title: String
  editor_notes_in: [String]
  modifiedBy_nin: [String]
  date_downloaded: DateTime
  epoch_date_published_in: [Int]
  date_downloaded_gt: DateTime
  epoch_date_downloaded_gte: Int
  url_gt: String
  OR: [History_reportQueryInput!]
  title_in: [String]
  date_submitted_gte: DateTime
  report_number_gt: Int
  cloudinary_id_lte: String
  epoch_date_modified_in: [Int]
  source_domain_gte: String
  epoch_date_submitted_gt: Int
  language_gt: String
  editor_notes_gte: String
  epoch_date_submitted: Int
  date_modified: DateTime
  _id_exists: Boolean
  editor_notes: String
  date_submitted_in: [DateTime]
  cloudinary_id_ne: String
  date_modified_gte: DateTime
  submitters_exists: Boolean
  report_number_lte: Int
  editor_notes_exists: Boolean
  date_downloaded_gte: DateTime
  text_gt: String
  description_nin: [String]
  image_url_lte: String
  is_incident_report: Boolean
  editor_notes_gt: String
  report_number_exists: Boolean
  source_domain_gt: String
  editor_notes_ne: String
  date_published_ne: DateTime
  date_submitted_gt: DateTime
  description_in: [String]
  submitters_in: [String]
  plain_text_gt: String
  source_domain_lt: String
  epoch_date_published_nin: [Int]
  user_exists: Boolean
  language: String
  report_number_in: [Int]
  epoch_date_modified_exists: Boolean
  url_nin: [String]
  plain_text_in: [String]
  cloudinary_id_in: [String]
  source_domain_in: [String]
  text_lt: String
}

enum NotificationSortByInput {
  _ID_ASC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  SENTDATE_ASC
  TYPE_ASC
  _ID_DESC
  SENTDATE_DESC
  TYPE_DESC
  USERID_ASC
  USERID_DESC
}

type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input QuickaddQueryInput {
  date_submitted_gt: String
  url_gt: String
  source_domain: String
  url_in: [String]
  source_domain_in: [String]
  date_submitted: String
  incident_id_gt: Long
  url_gte: String
  url_lt: String
  url: String
  url_nin: [String]
  source_domain_lte: String
  source_domain_gt: String
  url_exists: Boolean
  url_ne: String
  _id_ne: ObjectId
  date_submitted_exists: Boolean
  incident_id_in: [Long]
  incident_id_ne: Long
  date_submitted_lt: String
  source_domain_ne: String
  OR: [QuickaddQueryInput!]
  _id_gte: ObjectId
  date_submitted_nin: [String]
  url_lte: String
  _id_nin: [ObjectId]
  _id_exists: Boolean
  incident_id_gte: Long
  AND: [QuickaddQueryInput!]
  _id_lt: ObjectId
  date_submitted_gte: String
  _id_lte: ObjectId
  source_domain_lt: String
  date_submitted_lte: String
  incident_id_lte: Long
  source_domain_exists: Boolean
  incident_id_exists: Boolean
  incident_id_lt: Long
  source_domain_gte: String
  incident_id: Long
  _id: ObjectId
  date_submitted_in: [String]
  source_domain_nin: [String]
  _id_gt: ObjectId
  date_submitted_ne: String
  _id_in: [ObjectId]
  incident_id_nin: [Long]
}

enum SubscriptionSortByInput {
  ENTITYID_ASC
  USERID_ASC
  USERID_DESC
  _ID_DESC
  ENTITYID_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  TYPE_ASC
  TYPE_DESC
  _ID_ASC
}

type CreateVariantPayload {
  incident_id: Int
  report_number: Int
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

enum ChecklistSortByInput {
  DATE_CREATED_DESC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  ID_ASC
  NAME_DESC
  DATE_CREATED_ASC
  _ID_DESC
  ABOUT_DESC
  DATE_UPDATED_ASC
  DATE_UPDATED_DESC
  OWNER_ID_DESC
  _ID_ASC
  ID_DESC
  NAME_ASC
  OWNER_ID_ASC
  ABOUT_ASC
}

input ReportEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input ChecklistRiskInsertInput {
  risk_status: String
  touched: Boolean
  generated: Boolean
  id: String
  likelihood: String
  precedents: [ChecklistRiskPrecedentInsertInput]
  tags: [String]
  risk_notes: String
  severity: String
  title: String
}

input SubmissionEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input ClassificationReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

input TaxaField_listItem_fieldComplete_fromUpdateInput {
  entities: Boolean
  entities_unset: Boolean
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
}

input TaxaDummy_fieldQueryInput {
  AND: [TaxaDummy_fieldQueryInput!]
  short_name_in: [String]
  field_number_ne: String
  short_name: String
  OR: [TaxaDummy_fieldQueryInput!]
  short_name_nin: [String]
  field_number_exists: Boolean
  short_name_gte: String
  field_number_lte: String
  short_name_exists: Boolean
  short_name_gt: String
  short_name_ne: String
  field_number_in: [String]
  field_number_gte: String
  field_number: String
  field_number_lt: String
  short_name_lt: String
  field_number_gt: String
  short_name_lte: String
  field_number_nin: [String]
}

type TaxaField_listComplete_from {
  all: [String]
  current: [String]
}

input EntityQueryInput {
  _id: ObjectId
  _id_exists: Boolean
  entity_id: String
  name_ne: String
  name_lte: String
  entity_id_lte: String
  _id_ne: ObjectId
  name_exists: Boolean
  _id_lte: ObjectId
  _id_gt: ObjectId
  entity_id_ne: String
  entity_id_nin: [String]
  name_lt: String
  name_gt: String
  name_gte: String
  entity_id_gte: String
  _id_gte: ObjectId
  OR: [EntityQueryInput!]
  AND: [EntityQueryInput!]
  entity_id_in: [String]
  _id_lt: ObjectId
  entity_id_exists: Boolean
  entity_id_gt: String
  name_in: [String]
  _id_nin: [ObjectId]
  _id_in: [ObjectId]
  name: String
  name_nin: [String]
  entity_id_lt: String
}

input CandidateQueryInput {
  date_downloaded_ne: String
  epoch_date_downloaded_gte: Int
  similarity_exists: Boolean
  OR: [CandidateQueryInput!]
  epoch_date_published_nin: [Int]
  image_url_gt: String
  matching_entities: [String]
  plain_text_gte: String
  match_exists: Boolean
  source_domain_lt: String
  text_in: [String]
  epoch_date_downloaded_ne: Int
  language: String
  url: String
  image_url_lte: String
  similarity_gte: Float
  epoch_date_downloaded_gt: Int
  language_gt: String
  similarity_lte: Float
  AND: [CandidateQueryInput!]
  text_lt: String
  title_nin: [String]
  date_downloaded_gt: String
  date_downloaded: String
  date_published_in: [String]
  _id_nin: [ObjectId]
  epoch_date_downloaded_in: [Int]
  title_in: [String]
  url_lte: String
  epoch_date_published_gt: Int
  similarity_lt: Float
  matching_entities_nin: [String]
  image_url_lt: String
  _id_in: [ObjectId]
  epoch_date_downloaded_nin: [Int]
  dismissed_ne: Boolean
  matching_keywords_nin: [String]
  _id_exists: Boolean
  source_domain_ne: String
  matching_entities_exists: Boolean
  date_published_gte: String
  source_domain: String
  text_lte: String
  epoch_date_downloaded_exists: Boolean
  image_url_ne: String
  authors: [String]
  epoch_date_published_ne: Int
  source_domain_exists: Boolean
  matching_harm_keywords: [String]
  title_exists: Boolean
  similarity_in: [Float]
  url_in: [String]
  authors_in: [String]
  plain_text_lt: String
  authors_exists: Boolean
  language_nin: [String]
  url_nin: [String]
  epoch_date_downloaded_lt: Int
  _id_gt: ObjectId
  image_url_gte: String
  similarity_gt: Float
  image_url_exists: Boolean
  _id: ObjectId
  title_gt: String
  classification_similarity_exists: Boolean
  epoch_date_published_lte: Int
  image_url: String
  plain_text: String
  plain_text_gt: String
  date_published_lte: String
  source_domain_nin: [String]
  plain_text_lte: String
  similarity_nin: [Float]
  plain_text_nin: [String]
  title_lt: String
  match: Boolean
  classification_similarity: [CandidateClassification_similarityQueryInput]
  language_in: [String]
  date_downloaded_lt: String
  source_domain_in: [String]
  url_exists: Boolean
  text_exists: Boolean
  authors_nin: [String]
  epoch_date_downloaded_lte: Int
  dismissed: Boolean
  url_lt: String
  date_published_ne: String
  title_lte: String
  plain_text_exists: Boolean
  language_ne: String
  title_gte: String
  image_url_in: [String]
  date_downloaded_nin: [String]
  matching_harm_keywords_in: [String]
  epoch_date_downloaded: Int
  image_url_nin: [String]
  source_domain_lte: String
  matching_keywords: [String]
  text_nin: [String]
  text: String
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  matching_harm_keywords_nin: [String]
  epoch_date_published_in: [Int]
  url_gt: String
  epoch_date_published: Int
  matching_entities_in: [String]
  date_downloaded_gte: String
  date_downloaded_in: [String]
  dismissed_exists: Boolean
  plain_text_in: [String]
  source_domain_gte: String
  match_ne: Boolean
  source_domain_gt: String
  embedding: CandidateEmbeddingQueryInput
  _id_lt: ObjectId
  embedding_exists: Boolean
  epoch_date_published_gte: Int
  _id_gte: ObjectId
  language_lt: String
  language_lte: String
  url_gte: String
  date_published_exists: Boolean
  title: String
  date_published_gt: String
  plain_text_ne: String
  language_gte: String
  similarity: Float
  _id_lte: ObjectId
  date_published_lt: String
  date_downloaded_lte: String
  matching_harm_keywords_exists: Boolean
  text_gte: String
  epoch_date_published_exists: Boolean
  _id_ne: ObjectId
  matching_keywords_in: [String]
  epoch_date_published_lt: Int
  text_gt: String
  title_ne: String
  url_ne: String
  date_published_nin: [String]
  matching_keywords_exists: Boolean
  date_downloaded_exists: Boolean
  similarity_ne: Float
  date_published: String
  text_ne: String
  language_exists: Boolean
}

type IncidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input IncidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
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

type User {
  _id: ObjectId
  adminData: UserAdminDatum
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

input ChecklistRiskQueryInput {
  risk_notes_gte: String
  severity_gt: String
  likelihood: String
  precedents_exists: Boolean
  likelihood_exists: Boolean
  risk_notes_exists: Boolean
  severity: String
  risk_notes_lte: String
  id_nin: [String]
  risk_status_exists: Boolean
  id_in: [String]
  id: String
  id_lt: String
  risk_notes_in: [String]
  tags_in: [String]
  tags_nin: [String]
  title_nin: [String]
  tags: [String]
  risk_status: String
  risk_notes_gt: String
  severity_nin: [String]
  precedents: [ChecklistRiskPrecedentQueryInput]
  touched_exists: Boolean
  id_exists: Boolean
  severity_lte: String
  likelihood_lte: String
  tags_exists: Boolean
  title_lte: String
  severity_lt: String
  touched_ne: Boolean
  id_lte: String
  likelihood_in: [String]
  risk_status_gt: String
  risk_status_lt: String
  likelihood_ne: String
  risk_status_gte: String
  risk_status_ne: String
  title_exists: Boolean
  likelihood_nin: [String]
  severity_in: [String]
  severity_gte: String
  id_ne: String
  severity_exists: Boolean
  generated_exists: Boolean
  risk_status_in: [String]
  id_gt: String
  risk_notes_ne: String
  title_ne: String
  generated: Boolean
  title_gte: String
  touched: Boolean
  generated_ne: Boolean
  risk_notes_nin: [String]
  risk_notes_lt: String
  id_gte: String
  title_gt: String
  AND: [ChecklistRiskQueryInput!]
  likelihood_lt: String
  title_lt: String
  likelihood_gte: String
  severity_ne: String
  title: String
  title_in: [String]
  OR: [ChecklistRiskQueryInput!]
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  risk_status_lte: String
  risk_notes: String
  likelihood_gt: String
  risk_status_nin: [String]
}

type LogIncidentHistoryPayload {
  incident_id: Int
}

input ClassificationQueryInput {
  notes_in: [String]
  notes_ne: String
  namespace_in: [String]
  notes: String
  namespace_lte: String
  notes_exists: Boolean
  _id_ne: ObjectId
  _id_in: [ObjectId]
  notes_gt: String
  notes_lte: String
  _id_exists: Boolean
  incidents: [IncidentQueryInput]
  namespace_gte: String
  namespace_lt: String
  publish: Boolean
  incidents_exists: Boolean
  _id_nin: [ObjectId]
  publish_exists: Boolean
  reports_nin: [ReportQueryInput]
  reports_exists: Boolean
  notes_nin: [String]
  attributes: [ClassificationAttributeQueryInput]
  namespace: String
  _id_gte: ObjectId
  attributes_in: [ClassificationAttributeQueryInput]
  _id_lt: ObjectId
  attributes_exists: Boolean
  incidents_nin: [IncidentQueryInput]
  notes_lt: String
  namespace_ne: String
  _id: ObjectId
  namespace_nin: [String]
  reports_in: [ReportQueryInput]
  attributes_nin: [ClassificationAttributeQueryInput]
  AND: [ClassificationQueryInput!]
  reports: [ReportQueryInput]
  notes_gte: String
  namespace_gt: String
  OR: [ClassificationQueryInput!]
  incidents_in: [IncidentQueryInput]
  namespace_exists: Boolean
  _id_gt: ObjectId
  publish_ne: Boolean
  _id_lte: ObjectId
}

input History_incidentTsneInsertInput {
  y: Float
  x: Float
}

type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}

input UserQueryInput {
  last_name_lt: String
  last_name_gt: String
  _id_gt: ObjectId
  roles: [String]
  _id_exists: Boolean
  AND: [UserQueryInput!]
  first_name_lte: String
  userId: String
  last_name_in: [String]
  last_name_nin: [String]
  _id_nin: [ObjectId]
  last_name_gte: String
  _id: ObjectId
  userId_lt: String
  userId_gt: String
  last_name_lte: String
  _id_lte: ObjectId
  first_name_gte: String
  userId_exists: Boolean
  _id_ne: ObjectId
  last_name: String
  _id_gte: ObjectId
  last_name_ne: String
  userId_in: [String]
  userId_lte: String
  userId_ne: String
  _id_in: [ObjectId]
  roles_nin: [String]
  first_name_gt: String
  first_name_nin: [String]
  last_name_exists: Boolean
  roles_in: [String]
  first_name_exists: Boolean
  userId_gte: String
  first_name: String
  first_name_lt: String
  OR: [UserQueryInput!]
  roles_exists: Boolean
  first_name_ne: String
  userId_nin: [String]
  first_name_in: [String]
  _id_lt: ObjectId
}

input IncidentNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}

input SubmissionIncident_editorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}

enum SubmissionSortByInput {
  LANGUAGE_ASC
  SOURCE_DOMAIN_DESC
  TEXT_DESC
  DATE_MODIFIED_ASC
  PLAIN_TEXT_DESC
  TEXT_ASC
  TITLE_DESC
  USER_DESC
  _ID_DESC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_MODIFIED_ASC
  INCIDENT_DATE_DESC
  LANGUAGE_DESC
  URL_ASC
  DATE_PUBLISHED_ASC
  EDITOR_NOTES_ASC
  IMAGE_URL_DESC
  INCIDENT_TITLE_ASC
  INCIDENT_TITLE_DESC
  SOURCE_DOMAIN_ASC
  DATE_SUBMITTED_ASC
  DATE_SUBMITTED_DESC
  DESCRIPTION_ASC
  EPOCH_DATE_MODIFIED_DESC
  URL_DESC
  USER_ASC
  PLAIN_TEXT_ASC
  _ID_ASC
  CLOUDINARY_ID_ASC
  DATE_DOWNLOADED_DESC
  DESCRIPTION_DESC
  EDITOR_NOTES_DESC
  IMAGE_URL_ASC
  TITLE_ASC
  CLOUDINARY_ID_DESC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_DESC
  INCIDENT_DATE_ASC
  STATUS_ASC
  STATUS_DESC
}

input DuplicateInsertInput {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input SubmissionInsertInput {
  editor_similar_incidents: [Int]
  incident_date: String
  url: String!
  developers: SubmissionDevelopersRelationInput
  deployers: SubmissionDeployersRelationInput
  image_url: String!
  language: String!
  epoch_date_modified: Int
  incident_editors: SubmissionIncident_editorsRelationInput
  source_domain: String!
  user: SubmissionUserRelationInput
  embedding: SubmissionEmbeddingInsertInput
  cloudinary_id: String
  submitters: [String]!
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  date_modified: String!
  date_published: String!
  editor_dissimilar_incidents: [Int]
  status: String
  incident_ids: [Int]
  _id: ObjectId
  authors: [String]!
  date_submitted: String!
  text: String!
  date_downloaded: String!
  incident_title: String
  title: String!
  editor_notes: String
  description: String
  tags: [String]!
  plain_text: String
  harmed_parties: SubmissionHarmed_partiesRelationInput
}

input IncidentNlp_similar_incidentQueryInput {
  incident_id_lt: Int
  OR: [IncidentNlp_similar_incidentQueryInput!]
  similarity: Float
  incident_id: Int
  incident_id_nin: [Int]
  incident_id_gte: Int
  similarity_ne: Float
  similarity_exists: Boolean
  similarity_nin: [Float]
  similarity_gt: Float
  similarity_gte: Float
  similarity_lte: Float
  similarity_in: [Float]
  similarity_lt: Float
  incident_id_gt: Int
  incident_id_exists: Boolean
  incident_id_lte: Int
  incident_id_in: [Int]
  incident_id_ne: Int
  AND: [IncidentNlp_similar_incidentQueryInput!]
}

input SubscriptionEntityIdRelationInput {
  create: EntityInsertInput
  link: String
}

input History_incidentTsneQueryInput {
  AND: [History_incidentTsneQueryInput!]
  x_exists: Boolean
  y_gte: Float
  x_in: [Float]
  x_ne: Float
  y_exists: Boolean
  y_lt: Float
  y_in: [Float]
  x_lt: Float
  y_nin: [Float]
  x_nin: [Float]
  x_gt: Float
  x_gte: Float
  y_gt: Float
  y: Float
  y_ne: Float
  x: Float
  y_lte: Float
  OR: [History_incidentTsneQueryInput!]
  x_lte: Float
}

input IncidentEmbeddingUpdateInput {
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_reports: [Int]
}

enum ClassificationSortByInput {
  NAMESPACE_ASC
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
  _ID_ASC
  _ID_DESC
}

input ClassificationAttributeQueryInput {
  short_name_gte: String
  short_name_lt: String
  short_name_exists: Boolean
  short_name_lte: String
  AND: [ClassificationAttributeQueryInput!]
  short_name_ne: String
  value_json_gt: String
  value_json_gte: String
  short_name_in: [String]
  value_json: String
  value_json_lt: String
  value_json_nin: [String]
  value_json_lte: String
  short_name_gt: String
  short_name_nin: [String]
  value_json_ne: String
  OR: [ClassificationAttributeQueryInput!]
  value_json_in: [String]
  short_name: String
  value_json_exists: Boolean
}

input DuplicateQueryInput {
  duplicate_incident_number_ne: Int
  true_incident_number_nin: [Int]
  _id: ObjectId
  _id_nin: [ObjectId]
  _id_lte: ObjectId
  true_incident_number_ne: Int
  duplicate_incident_number_gte: Int
  true_incident_number_lte: Int
  true_incident_number: Int
  true_incident_number_gt: Int
  AND: [DuplicateQueryInput!]
  true_incident_number_exists: Boolean
  duplicate_incident_number_lte: Int
  duplicate_incident_number_nin: [Int]
  _id_exists: Boolean
  _id_ne: ObjectId
  duplicate_incident_number_exists: Boolean
  true_incident_number_gte: Int
  true_incident_number_lt: Int
  duplicate_incident_number: Int
  duplicate_incident_number_lt: Int
  duplicate_incident_number_gt: Int
  duplicate_incident_number_in: [Int]
  true_incident_number_in: [Int]
  OR: [DuplicateQueryInput!]
  _id_gt: ObjectId
  _id_lt: ObjectId
  _id_in: [ObjectId]
  _id_gte: ObjectId
}

input TaxaField_listItem_fieldQueryInput {
  weight_gte: Int
  AND: [TaxaField_listItem_fieldQueryInput!]
  long_description: String
  long_name_ne: String
  instant_facet: Boolean
  default_ne: String
  placeholder_exists: Boolean
  short_description_lt: String
  mongo_type_ne: String
  field_number_lte: String
  display_type_nin: [String]
  display_type_ne: String
  default_lte: String
  public: Boolean
  short_name_in: [String]
  short_description_nin: [String]
  mongo_type_in: [String]
  long_description_lt: String
  public_exists: Boolean
  field_number_lt: String
  mongo_type_nin: [String]
  mongo_type_lte: String
  weight_nin: [Int]
  instant_facet_exists: Boolean
  short_description_in: [String]
  field_number_in: [String]
  field_number_gt: String
  long_name_lte: String
  long_name_gte: String
  short_description: String
  long_description_gt: String
  required: Boolean
  required_ne: Boolean
  placeholder_ne: String
  default_exists: Boolean
  long_name_in: [String]
  OR: [TaxaField_listItem_fieldQueryInput!]
  mongo_type_gte: String
  short_name_nin: [String]
  short_name: String
  permitted_values: [String]
  long_name: String
  permitted_values_in: [String]
  short_description_gte: String
  short_name_gte: String
  placeholder_gte: String
  mongo_type: String
  field_number_gte: String
  short_description_exists: Boolean
  short_description_gt: String
  long_description_in: [String]
  weight_lte: Int
  placeholder_lt: String
  permitted_values_nin: [String]
  default_in: [String]
  placeholder_in: [String]
  weight_in: [Int]
  long_description_nin: [String]
  default_gte: String
  display_type_gt: String
  long_name_exists: Boolean
  field_number_ne: String
  placeholder: String
  instant_facet_ne: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  public_ne: Boolean
  field_number_nin: [String]
  short_name_lte: String
  field_number: String
  display_type_in: [String]
  short_description_ne: String
  mongo_type_lt: String
  display_type_exists: Boolean
  short_name_lt: String
  short_description_lte: String
  display_type: String
  mongo_type_gt: String
  long_description_gte: String
  mongo_type_exists: Boolean
  permitted_values_exists: Boolean
  short_name_gt: String
  weight_lt: Int
  default_nin: [String]
  long_name_lt: String
  default_lt: String
  long_name_gt: String
  display_type_lte: String
  placeholder_nin: [String]
  long_description_ne: String
  default_gt: String
  weight_gt: Int
  long_description_exists: Boolean
  complete_from_exists: Boolean
  long_name_nin: [String]
  weight_exists: Boolean
  weight: Int
  short_name_exists: Boolean
  placeholder_lte: String
  required_exists: Boolean
  placeholder_gt: String
  long_description_lte: String
  short_name_ne: String
  display_type_gte: String
  field_number_exists: Boolean
  default: String
  weight_ne: Int
  display_type_lt: String
}

type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input IncidentNlp_similar_incidentInsertInput {
  similarity: Float
  incident_id: Int
}

type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}

input TaxaField_listComplete_fromQueryInput {
  AND: [TaxaField_listComplete_fromQueryInput!]
  all_exists: Boolean
  current_in: [String]
  current_nin: [String]
  all: [String]
  all_nin: [String]
  current: [String]
  current_exists: Boolean
  OR: [TaxaField_listComplete_fromQueryInput!]
  all_in: [String]
}

input IncidentTsneQueryInput {
  x_gte: Float
  x_lte: Float
  AND: [IncidentTsneQueryInput!]
  y_lte: Float
  y_exists: Boolean
  y_gt: Float
  x_gt: Float
  x_ne: Float
  y_nin: [Float]
  y_gte: Float
  y_lt: Float
  x_in: [Float]
  x: Float
  y_in: [Float]
  y_ne: Float
  OR: [IncidentTsneQueryInput!]
  y: Float
  x_lt: Float
  x_nin: [Float]
  x_exists: Boolean
}

input QuickaddUpdateInput {
  date_submitted_unset: Boolean
  incident_id_unset: Boolean
  date_submitted: String
  incident_id: Long
  source_domain_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  source_domain: String
  url: String
  url_unset: Boolean
}

type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}

input ReportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input ClassificationAttributeInsertInput {
  short_name: String
  value_json: String
}

input SubmissionNlp_similar_incidentQueryInput {
  incident_id_nin: [Int]
  incident_id: Int
  similarity_in: [Float]
  similarity_nin: [Float]
  incident_id_lt: Int
  similarity_gte: Float
  incident_id_exists: Boolean
  incident_id_gte: Int
  incident_id_lte: Int
  similarity: Float
  similarity_lt: Float
  incident_id_in: [Int]
  similarity_ne: Float
  similarity_exists: Boolean
  incident_id_ne: Int
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  similarity_lte: Float
  incident_id_gt: Int
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  similarity_gt: Float
}

input ClassificationAttributeUpdateInput {
  value_json: String
  value_json_unset: Boolean
  short_name: String
  short_name_unset: Boolean
}

input SubmissionNlp_similar_incidentUpdateInput {
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
}

input SubscriptionInsertInput {
  entityId: SubscriptionEntityIdRelationInput
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
  userId: SubscriptionUserIdRelationInput!
  _id: ObjectId
}

type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input IncidentTsneUpdateInput {
  x: Float
  x_inc: Float
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
}

input IncidentReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

input SubmissionHarmed_partiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input CreateVariantInputVariant {
  text: String
  date_published: String
  inputs_outputs: [String]
  submitters: [String]
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

enum EntitySortByInput {
  _ID_ASC
  _ID_DESC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  NAME_ASC
  NAME_DESC
}

input CandidateUpdateInput {
  image_url: String
  similarity: Float
  matching_keywords_unset: Boolean
  epoch_date_downloaded_inc: Int
  matching_harm_keywords: [String]
  similarity_unset: Boolean
  language: String
  embedding_unset: Boolean
  plain_text_unset: Boolean
  similarity_inc: Float
  epoch_date_downloaded_unset: Boolean
  _id_unset: Boolean
  dismissed: Boolean
  epoch_date_published: Int
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  matching_entities_unset: Boolean
  date_downloaded_unset: Boolean
  date_downloaded: String
  matching_harm_keywords_unset: Boolean
  text_unset: Boolean
  plain_text: String
  title: String
  epoch_date_downloaded: Int
  dismissed_unset: Boolean
  authors_unset: Boolean
  image_url_unset: Boolean
  match: Boolean
  matching_keywords: [String]
  epoch_date_published_unset: Boolean
  date_published: String
  url_unset: Boolean
  _id: ObjectId
  authors: [String]
  classification_similarity_unset: Boolean
  matching_entities: [String]
  source_domain: String
  embedding: CandidateEmbeddingUpdateInput
  source_domain_unset: Boolean
  epoch_date_published_inc: Int
  date_published_unset: Boolean
  language_unset: Boolean
  url: String
  title_unset: Boolean
  match_unset: Boolean
  text: String
}

input CreateDefaultAdminUserInput {
  email: String
  password: String
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

input History_incidentInsertInput {
  embedding: History_incidentEmbeddingInsertInput
  editor_notes: String
  editor_similar_incidents: [Int]
  AllegedHarmedOrNearlyHarmedParties: [String]
  AllegedDeployerOfAISystem: [String]
  editors: [String]!
  title: String!
  tsne: History_incidentTsneInsertInput
  _id: ObjectId
  date: String!
  modifiedBy: String
  epoch_date_modified: Int
  editor_dissimilar_incidents: [Int]
  flagged_dissimilar_incidents: [Int]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  reports: [Int]!
  incident_id: Int!
  AllegedDeveloperOfAISystem: [String]
  description: String
}

input TaxaQueryInput {
  _id_exists: Boolean
  weight_nin: [Int]
  field_list_in: [TaxaField_listQueryInput]
  description_exists: Boolean
  description_nin: [String]
  field_list: [TaxaField_listQueryInput]
  weight_exists: Boolean
  namespace_in: [String]
  weight_lt: Int
  weight_ne: Int
  description_gte: String
  namespace_exists: Boolean
  _id_gt: ObjectId
  complete_entities: Boolean
  _id_lt: ObjectId
  complete_entities_ne: Boolean
  _id_gte: ObjectId
  complete_entities_exists: Boolean
  description_lte: String
  dummy_fields: [TaxaDummy_fieldQueryInput]
  weight_gte: Int
  dummy_fields_exists: Boolean
  namespace_ne: String
  _id_nin: [ObjectId]
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  namespace_lt: String
  namespace_gt: String
  namespace_nin: [String]
  description_ne: String
  _id_lte: ObjectId
  field_list_nin: [TaxaField_listQueryInput]
  namespace_gte: String
  weight: Int
  weight_gt: Int
  weight_lte: Int
  description_lt: String
  AND: [TaxaQueryInput!]
  OR: [TaxaQueryInput!]
  namespace: String
  namespace_lte: String
  weight_in: [Int]
  description_in: [String]
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  _id: ObjectId
  _id_ne: ObjectId
  _id_in: [ObjectId]
  description_gt: String
  field_list_exists: Boolean
  description: String
}

input DuplicateUpdateInput {
  _id: ObjectId
  _id_unset: Boolean
  duplicate_incident_number: Int
  duplicate_incident_number_inc: Int
  duplicate_incident_number_unset: Boolean
  true_incident_number: Int
  true_incident_number_inc: Int
  true_incident_number_unset: Boolean
}

input TaxaField_listItem_fieldComplete_fromQueryInput {
  entities_exists: Boolean
  entities_ne: Boolean
  entities: Boolean
  current_nin: [String]
  current_in: [String]
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all: [String]
  all_exists: Boolean
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all_nin: [String]
  all_in: [String]
  current: [String]
  current_exists: Boolean
}

input ReportUserRelationInput {
  create: UserInsertInput
  link: String
}

input IncidentUpdateInput {
  reports: IncidentReportsRelationInput
  editors: IncidentEditorsRelationInput
  epoch_date_modified_inc: Int
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  epoch_date_modified: Int
  title: String
  date_unset: Boolean
  description: String
  editor_dissimilar_incidents_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  AllegedDeveloperOfAISystem_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  reports_unset: Boolean
  incident_id: Int
  description_unset: Boolean
  editor_notes: String
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  embedding: IncidentEmbeddingUpdateInput
  flagged_dissimilar_incidents_unset: Boolean
  date: String
  editors_unset: Boolean
  editor_dissimilar_incidents: [Int]
  editor_notes_unset: Boolean
  tsne: IncidentTsneUpdateInput
  epoch_date_modified_unset: Boolean
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  AllegedDeployerOfAISystem_unset: Boolean
  embedding_unset: Boolean
  title_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  incident_id_unset: Boolean
  editor_similar_incidents_unset: Boolean
  incident_id_inc: Int
  _id_unset: Boolean
  editor_similar_incidents: [Int]
  tsne_unset: Boolean
  _id: ObjectId
}

input IncidentAllegedDeployerOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

enum CandidateSortByInput {
  EPOCH_DATE_DOWNLOADED_DESC
  LANGUAGE_ASC
  TEXT_DESC
  _ID_ASC
  URL_ASC
  DATE_DOWNLOADED_ASC
  IMAGE_URL_DESC
  TEXT_ASC
  TITLE_ASC
  TITLE_DESC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  SIMILARITY_DESC
  _ID_DESC
  SIMILARITY_ASC
  SOURCE_DOMAIN_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  PLAIN_TEXT_ASC
  PLAIN_TEXT_DESC
  SOURCE_DOMAIN_DESC
  DATE_PUBLISHED_ASC
  LANGUAGE_DESC
  DATE_DOWNLOADED_DESC
  IMAGE_URL_ASC
  URL_DESC
}

input RisksInput {
  tags: [String]
}

input ChecklistRiskPrecedentQueryInput {
  description: String
  description_lt: String
  incident_id_gte: Int
  title_ne: String
  description_gt: String
  incident_id_lte: Int
  OR: [ChecklistRiskPrecedentQueryInput!]
  AND: [ChecklistRiskPrecedentQueryInput!]
  description_ne: String
  title_nin: [String]
  tags_nin: [String]
  description_nin: [String]
  incident_id_ne: Int
  title_exists: Boolean
  incident_id: Int
  description_gte: String
  incident_id_in: [Int]
  incident_id_lt: Int
  tags: [String]
  title_lt: String
  description_in: [String]
  description_lte: String
  description_exists: Boolean
  tags_in: [String]
  title_gte: String
  tags_exists: Boolean
  title_gt: String
  title_lte: String
  incident_id_nin: [Int]
  title_in: [String]
  title: String
  incident_id_exists: Boolean
  incident_id_gt: Int
}

input IncidentAllegedDeveloperOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input History_incidentEmbeddingUpdateInput {
  vector_unset: Boolean
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
}

input CandidateEmbeddingQueryInput {
  AND: [CandidateEmbeddingQueryInput!]
  from_text_hash: String
  from_text_hash_gt: String
  from_text_hash_gte: String
  vector: [Float]
  from_text_hash_exists: Boolean
  OR: [CandidateEmbeddingQueryInput!]
  from_text_hash_in: [String]
  vector_exists: Boolean
  vector_nin: [Float]
  from_text_hash_nin: [String]
  from_text_hash_lte: String
  from_text_hash_ne: String
  from_text_hash_lt: String
  vector_in: [Float]
}

input NotificationInsertInput {
  sentDate: DateTime
  type: String
  userId: NotificationUserIdRelationInput
  _id: ObjectId
  incident_id: Int
  processed: Boolean
}

input CandidateEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input EntityUpdateInput {
  _id_unset: Boolean
  entity_id: String
  entity_id_unset: Boolean
  name: String
  name_unset: Boolean
  _id: ObjectId
}

input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}

type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input History_incidentNlp_similar_incidentQueryInput {
  incident_id: Int
  incident_id_gt: Int
  similarity_in: [Float]
  incident_id_lt: Int
  incident_id_lte: Int
  similarity_gt: Float
  similarity_nin: [Float]
  similarity_exists: Boolean
  similarity_lte: Float
  incident_id_in: [Int]
  similarity: Float
  incident_id_exists: Boolean
  incident_id_ne: Int
  similarity_gte: Float
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_gte: Int
  incident_id_nin: [Int]
  similarity_ne: Float
  similarity_lt: Float
}

input SubmissionNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

type IncidentTsne {
  x: Float
  y: Float
}

input ReportInsertInput {
  authors: [String]!
  tags: [String]!
  date_published: DateTime!
  embedding: ReportEmbeddingInsertInput
  plain_text: String!
  epoch_date_modified: Int!
  date_submitted: DateTime!
  epoch_date_published: Int!
  date_modified: DateTime!
  report_number: Int!
  cloudinary_id: String!
  submitters: [String]!
  editor_notes: String
  url: String!
  language: String!
  title: String!
  image_url: String!
  inputs_outputs: [String]
  epoch_date_downloaded: Int!
  flag: Boolean
  _id: ObjectId
  description: String
  user: ReportUserRelationInput
  is_incident_report: Boolean
  text: String!
  date_downloaded: DateTime!
  epoch_date_submitted: Int!
  source_domain: String!
}

input QuickaddInsertInput {
  incident_id: Long
  source_domain: String
  url: String!
  _id: ObjectId
  date_submitted: String!
}

input IncidentEmbeddingQueryInput {
  from_reports: [Int]
  from_reports_in: [Int]
  vector: [Float]
  vector_nin: [Float]
  vector_exists: Boolean
  AND: [IncidentEmbeddingQueryInput!]
  vector_in: [Float]
  OR: [IncidentEmbeddingQueryInput!]
  from_reports_exists: Boolean
  from_reports_nin: [Int]
}

input ReportUpdateInput {
  epoch_date_published_inc: Int
  submitters_unset: Boolean
  epoch_date_modified: Int
  tags: [String]
  inputs_outputs: [String]
  date_submitted_unset: Boolean
  plain_text: String
  epoch_date_submitted: Int
  source_domain: String
  is_incident_report_unset: Boolean
  description_unset: Boolean
  epoch_date_downloaded: Int
  text_unset: Boolean
  language: String
  text: String
  title: String
  epoch_date_submitted_inc: Int
  report_number_inc: Int
  description: String
  epoch_date_published_unset: Boolean
  plain_text_unset: Boolean
  epoch_date_modified_inc: Int
  editor_notes: String
  authors: [String]
  date_modified: DateTime
  embedding: ReportEmbeddingUpdateInput
  image_url_unset: Boolean
  report_number: Int
  epoch_date_published: Int
  date_downloaded: DateTime
  date_submitted: DateTime
  date_downloaded_unset: Boolean
  editor_notes_unset: Boolean
  _id_unset: Boolean
  cloudinary_id_unset: Boolean
  date_published: DateTime
  url: String
  flag_unset: Boolean
  submitters: [String]
  cloudinary_id: String
  embedding_unset: Boolean
  report_number_unset: Boolean
  url_unset: Boolean
  user: ReportUserRelationInput
  source_domain_unset: Boolean
  flag: Boolean
  date_modified_unset: Boolean
  user_unset: Boolean
  _id: ObjectId
  epoch_date_modified_unset: Boolean
  title_unset: Boolean
  is_incident_report: Boolean
  epoch_date_downloaded_unset: Boolean
  language_unset: Boolean
  inputs_outputs_unset: Boolean
  tags_unset: Boolean
  date_published_unset: Boolean
  epoch_date_downloaded_inc: Int
  epoch_date_submitted_unset: Boolean
  image_url: String
  authors_unset: Boolean
}

input ChecklistUpdateInput {
  risks_unset: Boolean
  tags_methods: [String]
  id_unset: Boolean
  tags_methods_unset: Boolean
  about: String
  entity_id_unset: Boolean
  owner_id: String
  risks: [ChecklistRiskUpdateInput]
  tags_goals: [String]
  name_unset: Boolean
  date_updated_unset: Boolean
  name: String
  date_created: DateTime
  date_updated: DateTime
  tags_goals_unset: Boolean
  _id_unset: Boolean
  id: String
  tags_other: [String]
  tags_other_unset: Boolean
  entity_id: String
  about_unset: Boolean
  _id: ObjectId
  owner_id_unset: Boolean
  date_created_unset: Boolean
}

input TaxaField_listUpdateInput {
  weight: Int
  mongo_type: String
  short_name: String
  placeholder: String
  item_fields: TaxaField_listItem_fieldUpdateInput
  long_name_unset: Boolean
  public_unset: Boolean
  field_number_unset: Boolean
  long_description_unset: Boolean
  long_description: String
  mongo_type_unset: Boolean
  complete_from: TaxaField_listComplete_fromUpdateInput
  permitted_values: [String]
  required_unset: Boolean
  short_description_unset: Boolean
  weight_inc: Int
  item_fields_unset: Boolean
  default_unset: Boolean
  weight_unset: Boolean
  hide_search: Boolean
  default: String
  display_type_unset: Boolean
  short_description: String
  display_type: String
  permitted_values_unset: Boolean
  required: Boolean
  placeholder_unset: Boolean
  public: Boolean
  hide_search_unset: Boolean
  long_name: String
  field_number: String
  instant_facet_unset: Boolean
  short_name_unset: Boolean
  instant_facet: Boolean
  complete_from_unset: Boolean
}

input NotificationUpdateInput {
  incident_id: Int
  type_unset: Boolean
  _id_unset: Boolean
  processed: Boolean
  userId: NotificationUserIdRelationInput
  incident_id_inc: Int
  processed_unset: Boolean
  userId_unset: Boolean
  type: String
  _id: ObjectId
  incident_id_unset: Boolean
  sentDate: DateTime
  sentDate_unset: Boolean
}

enum UserSortByInput {
  _ID_DESC
  FIRST_NAME_ASC
  FIRST_NAME_DESC
  LAST_NAME_ASC
  LAST_NAME_DESC
  USERID_ASC
  USERID_DESC
  _ID_ASC
}

enum History_reportSortByInput {
  EPOCH_DATE_DOWNLOADED_DESC
  URL_ASC
  SOURCE_DOMAIN_DESC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  EPOCH_DATE_SUBMITTED_DESC
  MODIFIEDBY_ASC
  DATE_MODIFIED_DESC
  EDITOR_NOTES_DESC
  REPORT_NUMBER_DESC
  SOURCE_DOMAIN_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  IMAGE_URL_DESC
  LANGUAGE_ASC
  USER_DESC
  DATE_DOWNLOADED_ASC
  DATE_SUBMITTED_DESC
  DESCRIPTION_DESC
  EDITOR_NOTES_ASC
  REPORT_NUMBER_ASC
  _ID_DESC
  CLOUDINARY_ID_ASC
  EPOCH_DATE_SUBMITTED_ASC
  IMAGE_URL_ASC
  DESCRIPTION_ASC
  EPOCH_DATE_PUBLISHED_ASC
  LANGUAGE_DESC
  MODIFIEDBY_DESC
  DATE_DOWNLOADED_DESC
  DATE_MODIFIED_ASC
  DATE_PUBLISHED_DESC
  DATE_SUBMITTED_ASC
  TEXT_ASC
  URL_DESC
  TEXT_DESC
  TITLE_DESC
  _ID_ASC
  CLOUDINARY_ID_DESC
  PLAIN_TEXT_ASC
  PLAIN_TEXT_DESC
  DATE_PUBLISHED_ASC
  EPOCH_DATE_MODIFIED_DESC
  TITLE_ASC
  USER_ASC
}

type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input History_reportInsertInput {
  image_url: String!
  date_downloaded: DateTime!
  modifiedBy: String
  epoch_date_published: Int!
  description: String
  title: String!
  user: String
  text: String!
  is_incident_report: Boolean
  date_published: DateTime!
  submitters: [String]!
  _id: ObjectId
  epoch_date_downloaded: Int!
  report_number: Int!
  epoch_date_submitted: Int!
  tags: [String]!
  editor_notes: String
  language: String!
  epoch_date_modified: Int!
  authors: [String]!
  inputs_outputs: [String]
  date_submitted: DateTime!
  embedding: History_reportEmbeddingInsertInput
  flag: Boolean
  plain_text: String!
  url: String!
  source_domain: String!
  cloudinary_id: String!
  date_modified: DateTime!
}

input TaxaField_listQueryInput {
  long_name: String
  required: Boolean
  weight_gte: Int
  short_description_gt: String
  field_number_nin: [String]
  complete_from_exists: Boolean
  placeholder_gte: String
  OR: [TaxaField_listQueryInput!]
  instant_facet_exists: Boolean
  complete_from: TaxaField_listComplete_fromQueryInput
  required_ne: Boolean
  long_description_gte: String
  weight_in: [Int]
  short_name_exists: Boolean
  long_name_gt: String
  display_type: String
  mongo_type_exists: Boolean
  short_description_gte: String
  long_name_gte: String
  AND: [TaxaField_listQueryInput!]
  mongo_type_lt: String
  field_number_lte: String
  weight_lte: Int
  short_description_in: [String]
  field_number_lt: String
  mongo_type_gt: String
  placeholder_ne: String
  placeholder_nin: [String]
  instant_facet: Boolean
  long_name_ne: String
  mongo_type_lte: String
  short_name_gt: String
  item_fields: TaxaField_listItem_fieldQueryInput
  default: String
  short_name: String
  long_description_ne: String
  long_name_in: [String]
  display_type_ne: String
  mongo_type_in: [String]
  default_exists: Boolean
  default_gte: String
  display_type_exists: Boolean
  placeholder_lt: String
  hide_search_ne: Boolean
  field_number_in: [String]
  permitted_values_exists: Boolean
  field_number: String
  field_number_gt: String
  weight_gt: Int
  default_gt: String
  mongo_type: String
  weight_nin: [Int]
  long_name_nin: [String]
  display_type_lte: String
  short_name_nin: [String]
  short_description_exists: Boolean
  short_description_lt: String
  long_description_gt: String
  required_exists: Boolean
  short_name_gte: String
  long_description_lte: String
  long_name_lt: String
  item_fields_exists: Boolean
  public_exists: Boolean
  display_type_gte: String
  display_type_lt: String
  default_in: [String]
  hide_search_exists: Boolean
  short_description_lte: String
  default_ne: String
  short_description: String
  permitted_values: [String]
  mongo_type_ne: String
  display_type_gt: String
  short_description_nin: [String]
  placeholder_lte: String
  long_name_lte: String
  placeholder: String
  weight_lt: Int
  mongo_type_nin: [String]
  field_number_exists: Boolean
  placeholder_gt: String
  hide_search: Boolean
  short_name_in: [String]
  weight: Int
  permitted_values_in: [String]
  mongo_type_gte: String
  permitted_values_nin: [String]
  weight_exists: Boolean
  long_description_in: [String]
  field_number_gte: String
  long_description_exists: Boolean
  field_number_ne: String
  long_description: String
  public_ne: Boolean
  instant_facet_ne: Boolean
  weight_ne: Int
  placeholder_exists: Boolean
  short_name_lt: String
  long_name_exists: Boolean
  public: Boolean
  default_lte: String
  default_nin: [String]
  default_lt: String
  placeholder_in: [String]
  long_description_lt: String
  short_description_ne: String
  display_type_nin: [String]
  short_name_lte: String
  short_name_ne: String
  long_description_nin: [String]
  display_type_in: [String]
}

input SubmissionEmbeddingQueryInput {
  vector_exists: Boolean
  vector: [Float]
  OR: [SubmissionEmbeddingQueryInput!]
  from_text_hash_nin: [String]
  vector_nin: [Float]
  AND: [SubmissionEmbeddingQueryInput!]
  from_text_hash_lt: String
  from_text_hash_exists: Boolean
  from_text_hash_gt: String
  from_text_hash_gte: String
  vector_in: [Float]
  from_text_hash_lte: String
  from_text_hash_in: [String]
  from_text_hash: String
  from_text_hash_ne: String
}

input ReportQueryInput {
  plain_text_nin: [String]
  flag_ne: Boolean
  epoch_date_submitted_nin: [Int]
  user: UserQueryInput
  date_downloaded_in: [DateTime]
  is_incident_report_exists: Boolean
  user_exists: Boolean
  plain_text_ne: String
  text_gte: String
  title_nin: [String]
  submitters_exists: Boolean
  _id_ne: ObjectId
  cloudinary_id_gt: String
  date_modified_exists: Boolean
  title_lt: String
  flag_exists: Boolean
  epoch_date_downloaded: Int
  date_modified_gt: DateTime
  AND: [ReportQueryInput!]
  authors_exists: Boolean
  epoch_date_submitted_gte: Int
  text_lte: String
  report_number_lt: Int
  url_gte: String
  url_gt: String
  image_url_lte: String
  image_url_lt: String
  language: String
  editor_notes_nin: [String]
  report_number_exists: Boolean
  title_ne: String
  text_gt: String
  date_downloaded_gte: DateTime
  inputs_outputs: [String]
  url_nin: [String]
  editor_notes_gte: String
  epoch_date_submitted_gt: Int
  editor_notes_lt: String
  epoch_date_submitted_exists: Boolean
  report_number: Int
  epoch_date_downloaded_nin: [Int]
  cloudinary_id_in: [String]
  date_submitted_ne: DateTime
  plain_text_in: [String]
  tags: [String]
  plain_text_gt: String
  report_number_gte: Int
  embedding_exists: Boolean
  date_submitted: DateTime
  epoch_date_downloaded_gt: Int
  inputs_outputs_nin: [String]
  date_published_gte: DateTime
  source_domain_gt: String
  report_number_gt: Int
  editor_notes_ne: String
  date_modified_nin: [DateTime]
  epoch_date_submitted_ne: Int
  url_exists: Boolean
  date_published_in: [DateTime]
  plain_text_lte: String
  epoch_date_submitted_lte: Int
  editor_notes: String
  epoch_date_published_exists: Boolean
  _id_exists: Boolean
  epoch_date_modified_ne: Int
  cloudinary_id: String
  date_submitted_in: [DateTime]
  language_in: [String]
  language_gte: String
  date_downloaded_exists: Boolean
  epoch_date_downloaded_in: [Int]
  date_published: DateTime
  source_domain_ne: String
  report_number_lte: Int
  epoch_date_modified_lte: Int
  url_ne: String
  cloudinary_id_exists: Boolean
  authors_in: [String]
  submitters_nin: [String]
  date_downloaded_nin: [DateTime]
  date_published_lt: DateTime
  epoch_date_published: Int
  text_nin: [String]
  date_downloaded: DateTime
  epoch_date_modified_nin: [Int]
  image_url: String
  epoch_date_modified_gte: Int
  is_incident_report: Boolean
  text_ne: String
  text_in: [String]
  language_nin: [String]
  image_url_nin: [String]
  epoch_date_submitted_in: [Int]
  title_exists: Boolean
  epoch_date_modified_in: [Int]
  date_modified_ne: DateTime
  source_domain_gte: String
  date_published_ne: DateTime
  cloudinary_id_nin: [String]
  _id_gt: ObjectId
  epoch_date_modified_gt: Int
  source_domain_lte: String
  tags_exists: Boolean
  OR: [ReportQueryInput!]
  _id: ObjectId
  image_url_in: [String]
  source_domain_lt: String
  title_gte: String
  epoch_date_published_gte: Int
  cloudinary_id_lte: String
  epoch_date_downloaded_ne: Int
  epoch_date_downloaded_gte: Int
  plain_text_gte: String
  image_url_gte: String
  epoch_date_published_lte: Int
  language_ne: String
  epoch_date_modified: Int
  epoch_date_published_ne: Int
  date_submitted_lt: DateTime
  report_number_ne: Int
  description_gt: String
  url: String
  _id_gte: ObjectId
  epoch_date_published_gt: Int
  date_downloaded_lt: DateTime
  description_lte: String
  tags_nin: [String]
  tags_in: [String]
  epoch_date_published_in: [Int]
  _id_lte: ObjectId
  image_url_ne: String
  editor_notes_gt: String
  date_submitted_gte: DateTime
  language_gt: String
  report_number_in: [Int]
  _id_nin: [ObjectId]
  flag: Boolean
  url_lt: String
  title_gt: String
  source_domain_in: [String]
  _id_lt: ObjectId
  is_incident_report_ne: Boolean
  plain_text: String
  description_in: [String]
  source_domain_nin: [String]
  date_submitted_nin: [DateTime]
  source_domain_exists: Boolean
  url_in: [String]
  date_submitted_exists: Boolean
  description_gte: String
  date_modified_gte: DateTime
  date_published_gt: DateTime
  language_lt: String
  submitters: [String]
  text_lt: String
  date_downloaded_lte: DateTime
  title: String
  image_url_exists: Boolean
  date_submitted_gt: DateTime
  url_lte: String
  epoch_date_submitted: Int
  description_nin: [String]
  date_modified: DateTime
  epoch_date_modified_lt: Int
  cloudinary_id_gte: String
  date_downloaded_gt: DateTime
  language_exists: Boolean
  epoch_date_submitted_lt: Int
  description_exists: Boolean
  epoch_date_published_lt: Int
  epoch_date_modified_exists: Boolean
  epoch_date_downloaded_exists: Boolean
  title_in: [String]
  authors: [String]
  epoch_date_published_nin: [Int]
  date_modified_in: [DateTime]
  report_number_nin: [Int]
  date_submitted_lte: DateTime
  date_downloaded_ne: DateTime
  text_exists: Boolean
  date_modified_lt: DateTime
  source_domain: String
  cloudinary_id_lt: String
  cloudinary_id_ne: String
  epoch_date_downloaded_lt: Int
  editor_notes_lte: String
  _id_in: [ObjectId]
  date_published_exists: Boolean
  description_lt: String
  inputs_outputs_in: [String]
  text: String
  plain_text_lt: String
  date_modified_lte: DateTime
  editor_notes_in: [String]
  authors_nin: [String]
  description: String
  language_lte: String
  date_published_lte: DateTime
  inputs_outputs_exists: Boolean
  description_ne: String
  submitters_in: [String]
  plain_text_exists: Boolean
  image_url_gt: String
  epoch_date_downloaded_lte: Int
  embedding: ReportEmbeddingQueryInput
  editor_notes_exists: Boolean
  date_published_nin: [DateTime]
  title_lte: String
}

enum History_incidentSortByInput {
  _ID_ASC
  _ID_DESC
  DATE_ASC
  DESCRIPTION_ASC
  MODIFIEDBY_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_ASC
  INCIDENT_ID_DESC
  TITLE_DESC
  DESCRIPTION_DESC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_ID_ASC
  MODIFIEDBY_DESC
  DATE_DESC
  TITLE_ASC
}

type AppUser {
  email: String
}

input History_incidentEmbeddingQueryInput {
  vector_exists: Boolean
  AND: [History_incidentEmbeddingQueryInput!]
  OR: [History_incidentEmbeddingQueryInput!]
  from_reports_exists: Boolean
  vector_in: [Float]
  from_reports_nin: [Int]
  vector: [Float]
  from_reports: [Int]
  from_reports_in: [Int]
  vector_nin: [Float]
}

type ClassificationAttribute {
  short_name: String
  value_json: String
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
  replaceOneClassification(data: ClassificationInsertInput!, query: ClassificationQueryInput): Classification
  replaceOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  replaceOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
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
  updateManyCandidates(set: CandidateUpdateInput!, query: CandidateQueryInput): UpdateManyPayload
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
  upsertOneDuplicate(data: DuplicateInsertInput!, query: DuplicateQueryInput): Duplicate
  upsertOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  upsertOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  upsertOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  upsertOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  upsertOneNotification(data: NotificationInsertInput!, query: NotificationQueryInput): Notification
  upsertOneQuickadd(data: QuickaddInsertInput!, query: QuickaddQueryInput): Quickadd
  upsertOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  upsertOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  upsertOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  upsertOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
}

input ClassificationUpdateInput {
  namespace_unset: Boolean
  _id_unset: Boolean
  reports_unset: Boolean
  notes: String
  attributes_unset: Boolean
  publish_unset: Boolean
  _id: ObjectId
  attributes: [ClassificationAttributeUpdateInput]
  incidents: ClassificationIncidentsRelationInput
  namespace: String
  publish: Boolean
  incidents_unset: Boolean
  notes_unset: Boolean
  reports: ClassificationReportsRelationInput
}

input TaxaField_listComplete_fromUpdateInput {
  current: [String]
  current_unset: Boolean
  all: [String]
  all_unset: Boolean
}

input SubmissionEmbeddingUpdateInput {
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
}

type Query {
  candidate(query: CandidateQueryInput): Candidate
  candidates(query: CandidateQueryInput, limit: Int = 100, sortBy: CandidateSortByInput): [Candidate]!
  checklist(query: ChecklistQueryInput): Checklist
  checklists(query: ChecklistQueryInput, limit: Int = 100, sortBy: ChecklistSortByInput): [Checklist]!
  classification(query: ClassificationQueryInput): Classification
  classifications(sortBy: ClassificationSortByInput, query: ClassificationQueryInput, limit: Int = 100): [Classification]!
  duplicate(query: DuplicateQueryInput): Duplicate
  duplicates(sortBy: DuplicateSortByInput, query: DuplicateQueryInput, limit: Int = 100): [Duplicate]!
  entities(limit: Int = 100, sortBy: EntitySortByInput, query: EntityQueryInput): [Entity]!
  entity(query: EntityQueryInput): Entity
  history_incident(query: History_incidentQueryInput): History_incident
  history_incidents(query: History_incidentQueryInput, limit: Int = 100, sortBy: History_incidentSortByInput): [History_incident]!
  history_report(query: History_reportQueryInput): History_report
  history_reports(query: History_reportQueryInput, limit: Int = 100, sortBy: History_reportSortByInput): [History_report]!
  incident(query: IncidentQueryInput): Incident
  incidents(sortBy: IncidentSortByInput, query: IncidentQueryInput, limit: Int = 100): [Incident]!
  notification(query: NotificationQueryInput): Notification
  notifications(sortBy: NotificationSortByInput, query: NotificationQueryInput, limit: Int = 100): [Notification]!
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

input SubscriptionIncident_idRelationInput {
  create: IncidentInsertInput
  link: Int
}

input TaxaField_listItem_fieldComplete_fromInsertInput {
  all: [String]
  current: [String]
  entities: Boolean
}

input IncidentTsneInsertInput {
  x: Float
  y: Float
}

type TaxaDummy_field {
  field_number: String
  short_name: String
}

input IncidentQueryInput {
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  incident_id_lte: Int
  editor_similar_incidents: [Int]
  epoch_date_modified_nin: [Int]
  AllegedDeployerOfAISystem_exists: Boolean
  title: String
  editor_notes_ne: String
  title_gte: String
  description_lt: String
  date_ne: String
  editor_similar_incidents_in: [Int]
  date: String
  editor_dissimilar_incidents_exists: Boolean
  _id: ObjectId
  description_lte: String
  editor_notes_gt: String
  incident_id_ne: Int
  description_exists: Boolean
  incident_id_nin: [Int]
  epoch_date_modified_gte: Int
  editor_dissimilar_incidents: [Int]
  epoch_date_modified_ne: Int
  epoch_date_modified_exists: Boolean
  title_nin: [String]
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  epoch_date_modified_lt: Int
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  editors: [UserQueryInput]
  incident_id: Int
  _id_nin: [ObjectId]
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  date_lte: String
  _id_lt: ObjectId
  incident_id_in: [Int]
  title_exists: Boolean
  date_lt: String
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  epoch_date_modified: Int
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  epoch_date_modified_in: [Int]
  description_nin: [String]
  _id_gte: ObjectId
  editor_notes_lt: String
  description: String
  tsne_exists: Boolean
  editor_notes_lte: String
  reports: [ReportQueryInput]
  editor_similar_incidents_nin: [Int]
  editors_exists: Boolean
  editors_nin: [UserQueryInput]
  embedding: IncidentEmbeddingQueryInput
  title_ne: String
  flagged_dissimilar_incidents_in: [Int]
  editor_similar_incidents_exists: Boolean
  reports_nin: [ReportQueryInput]
  _id_exists: Boolean
  tsne: IncidentTsneQueryInput
  AND: [IncidentQueryInput!]
  editor_dissimilar_incidents_nin: [Int]
  _id_lte: ObjectId
  epoch_date_modified_lte: Int
  OR: [IncidentQueryInput!]
  description_ne: String
  flagged_dissimilar_incidents_exists: Boolean
  flagged_dissimilar_incidents_nin: [Int]
  title_gt: String
  AllegedDeployerOfAISystem: [EntityQueryInput]
  description_gte: String
  _id_ne: ObjectId
  reports_in: [ReportQueryInput]
  description_gt: String
  date_gt: String
  title_lt: String
  editor_dissimilar_incidents_in: [Int]
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  date_in: [String]
  flagged_dissimilar_incidents: [Int]
  title_in: [String]
  title_lte: String
  date_gte: String
  date_exists: Boolean
  editor_notes_gte: String
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  editor_notes_nin: [String]
  incident_id_lt: Int
  editor_notes: String
  incident_id_exists: Boolean
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  embedding_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  nlp_similar_incidents_exists: Boolean
  editor_notes_in: [String]
  _id_in: [ObjectId]
  incident_id_gt: Int
  reports_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  epoch_date_modified_gt: Int
  AllegedDeveloperOfAISystem_exists: Boolean
  date_nin: [String]
  editor_notes_exists: Boolean
  _id_gt: ObjectId
  editors_in: [UserQueryInput]
  description_in: [String]
  incident_id_gte: Int
}

type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}

input History_reportEmbeddingQueryInput {
  from_text_hash_in: [String]
  from_text_hash: String
  from_text_hash_gt: String
  OR: [History_reportEmbeddingQueryInput!]
  from_text_hash_ne: String
  vector_in: [Float]
  from_text_hash_lt: String
  AND: [History_reportEmbeddingQueryInput!]
  from_text_hash_exists: Boolean
  vector_exists: Boolean
  vector: [Float]
  vector_nin: [Float]
  from_text_hash_lte: String
  from_text_hash_gte: String
  from_text_hash_nin: [String]
}

input IncidentInsertInput {
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  editor_notes: String
  editor_similar_incidents: [Int]
  tsne: IncidentTsneInsertInput
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  editor_dissimilar_incidents: [Int]
  flagged_dissimilar_incidents: [Int]
  description: String
  incident_id: Int!
  editors: IncidentEditorsRelationInput!
  title: String!
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  reports: IncidentReportsRelationInput!
  _id: ObjectId
  date: String!
  embedding: IncidentEmbeddingInsertInput
  epoch_date_modified: Int
}

enum QuickaddSortByInput {
  _ID_DESC
  INCIDENT_ID_ASC
  URL_ASC
  URL_DESC
  SOURCE_DOMAIN_ASC
  SOURCE_DOMAIN_DESC
  _ID_ASC
  DATE_SUBMITTED_ASC
  DATE_SUBMITTED_DESC
  INCIDENT_ID_DESC
}

enum DuplicateSortByInput {
  _ID_ASC
  _ID_DESC
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
}

input ChecklistRiskPrecedentUpdateInput {
  description_unset: Boolean
  title_unset: Boolean
  incident_id_inc: Int
  title: String
  tags_unset: Boolean
  description: String
  incident_id: Int
  incident_id_unset: Boolean
  tags: [String]
}

input SubscriptionQueryInput {
  OR: [SubscriptionQueryInput!]
  type_exists: Boolean
  _id_gt: ObjectId
  _id_nin: [ObjectId]
  type_ne: String
  incident_id_exists: Boolean
  _id: ObjectId
  type_gt: String
  _id_lte: ObjectId
  entityId: EntityQueryInput
  userId: UserQueryInput
  _id_gte: ObjectId
  _id_exists: Boolean
  userId_exists: Boolean
  type: String
  type_nin: [String]
  type_gte: String
  entityId_exists: Boolean
  incident_id: IncidentQueryInput
  AND: [SubscriptionQueryInput!]
  _id_in: [ObjectId]
  type_lt: String
  _id_lt: ObjectId
  _id_ne: ObjectId
  type_lte: String
  type_in: [String]
}

input History_reportUpdateInput {
  is_incident_report_unset: Boolean
  language_unset: Boolean
  epoch_date_downloaded_inc: Int
  report_number_unset: Boolean
  flag_unset: Boolean
  image_url: String
  description_unset: Boolean
  submitters: [String]
  date_downloaded_unset: Boolean
  url_unset: Boolean
  date_modified_unset: Boolean
  editor_notes: String
  language: String
  epoch_date_published: Int
  epoch_date_downloaded: Int
  user_unset: Boolean
  tags: [String]
  epoch_date_modified_unset: Boolean
  epoch_date_submitted: Int
  date_submitted_unset: Boolean
  modifiedBy: String
  modifiedBy_unset: Boolean
  is_incident_report: Boolean
  url: String
  report_number: Int
  text: String
  epoch_date_submitted_inc: Int
  embedding_unset: Boolean
  cloudinary_id_unset: Boolean
  editor_notes_unset: Boolean
  report_number_inc: Int
  date_published_unset: Boolean
  epoch_date_published_inc: Int
  authors_unset: Boolean
  title_unset: Boolean
  date_published: DateTime
  plain_text: String
  date_modified: DateTime
  authors: [String]
  date_submitted: DateTime
  epoch_date_modified: Int
  epoch_date_downloaded_unset: Boolean
  submitters_unset: Boolean
  _id_unset: Boolean
  embedding: History_reportEmbeddingUpdateInput
  source_domain_unset: Boolean
  plain_text_unset: Boolean
  date_downloaded: DateTime
  description: String
  inputs_outputs: [String]
  epoch_date_modified_inc: Int
  tags_unset: Boolean
  source_domain: String
  epoch_date_published_unset: Boolean
  flag: Boolean
  title: String
  user: String
  inputs_outputs_unset: Boolean
  _id: ObjectId
  image_url_unset: Boolean
  epoch_date_submitted_unset: Boolean
  text_unset: Boolean
  cloudinary_id: String
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

input History_reportEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input UserUpdateInput {
  _id_unset: Boolean
  last_name: String
  roles: [String]
  roles_unset: Boolean
  _id: ObjectId
  last_name_unset: Boolean
  first_name: String
  userId_unset: Boolean
  first_name_unset: Boolean
  userId: String
}

input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input ChecklistInsertInput {
  owner_id: String
  tags_goals: [String]
  about: String
  name: String
  id: String
  risks: [ChecklistRiskInsertInput]
  tags_methods: [String]
  _id: ObjectId
  tags_other: [String]
  date_updated: DateTime
  date_created: DateTime
  entity_id: String
}

type LogReportHistoryPayload {
  report_number: Int
}

type UserAdminDatum {
  creationDate: DateTime
  disabled: Boolean
  email: String
  lastAuthenticationDate: DateTime
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

type DeleteManyPayload {
  deletedCount: Int!
}

input CandidateInsertInput {
  date_downloaded: String
  match: Boolean!
  date_published: String
  plain_text: String
  similarity: Float
  matching_harm_keywords: [String]
  matching_keywords: [String]
  text: String
  image_url: String
  epoch_date_published: Int
  authors: [String]
  epoch_date_downloaded: Int
  title: String
  dismissed: Boolean
  matching_entities: [String]
  classification_similarity: [CandidateClassification_similarityInsertInput]
  _id: ObjectId
  source_domain: String
  embedding: CandidateEmbeddingInsertInput
  language: String
  url: String!
}

input CreateVariantInput {
  incidentId: Int
  variant: CreateVariantInputVariant
}

type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}

input IncidentEditorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}

input TaxaField_listInsertInput {
  public: Boolean
  short_description: String
  complete_from: TaxaField_listComplete_fromInsertInput
  permitted_values: [String]
  placeholder: String
  item_fields: TaxaField_listItem_fieldInsertInput
  long_name: String
  display_type: String
  mongo_type: String
  field_number: String
  hide_search: Boolean
  default: String
  instant_facet: Boolean
  required: Boolean
  weight: Int
  long_description: String
  short_name: String
}

scalar ObjectId

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
  source_domain: String!
  status: String
  submitters: [String]!
  tags: [String]!
  text: String!
  title: String!
  url: String!
  user: User
}

type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}

input ClassificationIncidentsRelationInput {
  link: [Int]
  create: [IncidentInsertInput]
}

scalar Long

type Entity {
  _id: ObjectId
  entity_id: String
  name: String
}

input CandidateClassification_similarityUpdateInput {
  similarity_unset: Boolean
  classification: String
  classification_unset: Boolean
  similarity: Float
  similarity_inc: Float
}

input History_incidentTsneUpdateInput {
  x_inc: Float
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
}

input SubscriptionUpdateInput {
  entityId_unset: Boolean
  type_unset: Boolean
  incident_id: SubscriptionIncident_idRelationInput
  incident_id_unset: Boolean
  userId: SubscriptionUserIdRelationInput
  _id: ObjectId
  type: String
  userId_unset: Boolean
  _id_unset: Boolean
  entityId: SubscriptionEntityIdRelationInput
}

input TaxaUpdateInput {
  weight_unset: Boolean
  complete_entities_unset: Boolean
  field_list_unset: Boolean
  _id_unset: Boolean
  namespace: String
  _id: ObjectId
  dummy_fields: [TaxaDummy_fieldUpdateInput]
  field_list: [TaxaField_listUpdateInput]
  namespace_unset: Boolean
  weight: Int
  description_unset: Boolean
  weight_inc: Int
  dummy_fields_unset: Boolean
  complete_entities: Boolean
  description: String
}

type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}

type ReportTranslation {
  text: String
  title: String
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

input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input ChecklistRiskUpdateInput {
  tags: [String]
  likelihood: String
  risk_notes: String
  risk_status_unset: Boolean
  tags_unset: Boolean
  title_unset: Boolean
  generated: Boolean
  risk_notes_unset: Boolean
  touched: Boolean
  touched_unset: Boolean
  precedents: [ChecklistRiskPrecedentUpdateInput]
  precedents_unset: Boolean
  severity_unset: Boolean
  id_unset: Boolean
  severity: String
  likelihood_unset: Boolean
  title: String
  generated_unset: Boolean
  risk_status: String
  id: String
}

scalar DateTime

input ReportEmbeddingQueryInput {
  from_text_hash_lte: String
  from_text_hash_in: [String]
  from_text_hash_nin: [String]
  from_text_hash_exists: Boolean
  vector: [Float]
  from_text_hash_lt: String
  from_text_hash_ne: String
  vector_exists: Boolean
  vector_nin: [Float]
  from_text_hash_gte: String
  vector_in: [Float]
  from_text_hash_gt: String
  from_text_hash: String
  AND: [ReportEmbeddingQueryInput!]
  OR: [ReportEmbeddingQueryInput!]
}

type CandidateClassification_similarity {
  classification: String
  similarity: Float
}

type InsertManyPayload {
  insertedIds: [ObjectId]!
}

input EntityInsertInput {
  _id: ObjectId
  entity_id: String
  name: String
}

input History_incidentNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
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

type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input TaxaField_listComplete_fromInsertInput {
  all: [String]
  current: [String]
}

input History_incidentUpdateInput {
  editor_dissimilar_incidents: [Int]
  date: String
  modifiedBy_unset: Boolean
  date_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  description: String
  AllegedDeployerOfAISystem: [String]
  editors_unset: Boolean
  title_unset: Boolean
  reports_unset: Boolean
  incident_id_inc: Int
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  editor_notes_unset: Boolean
  editor_dissimilar_incidents_unset: Boolean
  tsne_unset: Boolean
  AllegedDeveloperOfAISystem: [String]
  incident_id: Int
  AllegedDeployerOfAISystem_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  editors: [String]
  editor_notes: String
  embedding: History_incidentEmbeddingUpdateInput
  flagged_dissimilar_incidents_unset: Boolean
  tsne: History_incidentTsneUpdateInput
  epoch_date_modified_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  _id_unset: Boolean
  description_unset: Boolean
  incident_id_unset: Boolean
  title: String
  modifiedBy: String
  editor_similar_incidents_unset: Boolean
  epoch_date_modified: Int
  embedding_unset: Boolean
  _id: ObjectId
  AllegedHarmedOrNearlyHarmedParties: [String]
  editor_similar_incidents: [Int]
  reports: [Int]
  epoch_date_modified_inc: Int
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
}

input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input SubmissionQueryInput {
  _id_gte: ObjectId
  description_nin: [String]
  cloudinary_id_gt: String
  date_downloaded_lte: String
  source_domain_lt: String
  title_gt: String
  incident_title_lt: String
  cloudinary_id_exists: Boolean
  cloudinary_id: String
  editor_dissimilar_incidents: [Int]
  plain_text_gte: String
  date_downloaded_in: [String]
  status_in: [String]
  incident_ids_in: [Int]
  url_in: [String]
  language_gt: String
  description_gte: String
  user: UserQueryInput
  incident_date_ne: String
  _id_exists: Boolean
  _id_nin: [ObjectId]
  image_url_lt: String
  authors_nin: [String]
  developers_nin: [EntityQueryInput]
  harmed_parties_in: [EntityQueryInput]
  image_url_gte: String
  plain_text_gt: String
  incident_editors: [UserQueryInput]
  incident_title_nin: [String]
  image_url_ne: String
  incident_ids_exists: Boolean
  title: String
  tags_in: [String]
  user_exists: Boolean
  nlp_similar_incidents_exists: Boolean
  url_ne: String
  title_exists: Boolean
  date_modified_ne: String
  incident_date_gte: String
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  url_lt: String
  title_gte: String
  description: String
  date_published_nin: [String]
  date_modified_exists: Boolean
  _id: ObjectId
  incident_title_in: [String]
  _id_gt: ObjectId
  editor_similar_incidents_exists: Boolean
  date_downloaded: String
  incident_ids_nin: [Int]
  date_submitted_in: [String]
  cloudinary_id_gte: String
  embedding: SubmissionEmbeddingQueryInput
  incident_title_ne: String
  date_submitted_lte: String
  description_exists: Boolean
  editor_notes_gte: String
  date_published_lt: String
  editor_notes_gt: String
  incident_date_lt: String
  cloudinary_id_lt: String
  url: String
  incident_editors_exists: Boolean
  developers: [EntityQueryInput]
  plain_text_exists: Boolean
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  plain_text_in: [String]
  harmed_parties_exists: Boolean
  date_submitted_nin: [String]
  submitters_exists: Boolean
  harmed_parties_nin: [EntityQueryInput]
  submitters_nin: [String]
  date_published_exists: Boolean
  developers_in: [EntityQueryInput]
  date_downloaded_nin: [String]
  tags_exists: Boolean
  cloudinary_id_nin: [String]
  text_lt: String
  date_modified_gte: String
  language_lte: String
  language_exists: Boolean
  image_url_gt: String
  editor_dissimilar_incidents_in: [Int]
  title_lte: String
  editor_notes_in: [String]
  url_gt: String
  description_in: [String]
  date_downloaded_gt: String
  epoch_date_modified_gt: Int
  date_modified_lte: String
  AND: [SubmissionQueryInput!]
  source_domain_gte: String
  status_gte: String
  status_nin: [String]
  epoch_date_modified_ne: Int
  text: String
  editor_notes_lt: String
  developers_exists: Boolean
  incident_title_lte: String
  epoch_date_modified_exists: Boolean
  plain_text_lte: String
  editor_notes_nin: [String]
  date_modified_lt: String
  status_lt: String
  title_in: [String]
  source_domain_exists: Boolean
  deployers: [EntityQueryInput]
  editor_similar_incidents_in: [Int]
  editor_dissimilar_incidents_nin: [Int]
  OR: [SubmissionQueryInput!]
  date_published_in: [String]
  text_gte: String
  harmed_parties: [EntityQueryInput]
  incident_title_gte: String
  description_lte: String
  incident_title_exists: Boolean
  plain_text: String
  deployers_nin: [EntityQueryInput]
  tags_nin: [String]
  text_exists: Boolean
  source_domain_ne: String
  date_modified_nin: [String]
  epoch_date_modified_lt: Int
  date_modified: String
  embedding_exists: Boolean
  cloudinary_id_ne: String
  language_lt: String
  date_submitted_lt: String
  date_downloaded_lt: String
  deployers_exists: Boolean
  image_url_exists: Boolean
  image_url: String
  cloudinary_id_lte: String
  source_domain_nin: [String]
  text_ne: String
  url_exists: Boolean
  language_nin: [String]
  date_downloaded_gte: String
  epoch_date_modified_nin: [Int]
  epoch_date_modified_gte: Int
  epoch_date_modified: Int
  incident_editors_nin: [UserQueryInput]
  authors_in: [String]
  status_lte: String
  date_published: String
  date_published_gt: String
  editor_notes_exists: Boolean
  text_lte: String
  source_domain_gt: String
  date_downloaded_exists: Boolean
  plain_text_ne: String
  plain_text_lt: String
  description_ne: String
  date_modified_in: [String]
  epoch_date_modified_lte: Int
  status_exists: Boolean
  date_published_lte: String
  date_published_gte: String
  title_lt: String
  submitters: [String]
  date_submitted_ne: String
  date_submitted_gte: String
  language: String
  date_submitted_gt: String
  editor_dissimilar_incidents_exists: Boolean
  title_ne: String
  incident_title_gt: String
  text_gt: String
  _id_lte: ObjectId
  source_domain_in: [String]
  authors_exists: Boolean
  language_in: [String]
  status_gt: String
  language_ne: String
  incident_date_gt: String
  incident_date_nin: [String]
  editor_notes_lte: String
  submitters_in: [String]
  date_downloaded_ne: String
  url_gte: String
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  description_gt: String
  editor_notes: String
  tags: [String]
  incident_editors_in: [UserQueryInput]
  date_submitted_exists: Boolean
  editor_similar_incidents: [Int]
  cloudinary_id_in: [String]
  plain_text_nin: [String]
  url_lte: String
  incident_date_in: [String]
  incident_date: String
  authors: [String]
  image_url_in: [String]
  status_ne: String
  epoch_date_modified_in: [Int]
  status: String
  date_modified_gt: String
  text_in: [String]
  incident_date_lte: String
  source_domain: String
  url_nin: [String]
  title_nin: [String]
  text_nin: [String]
  editor_similar_incidents_nin: [Int]
  language_gte: String
  image_url_nin: [String]
  _id_lt: ObjectId
  incident_title: String
  description_lt: String
  incident_date_exists: Boolean
  incident_ids: [Int]
  _id_in: [ObjectId]
  image_url_lte: String
  date_submitted: String
  deployers_in: [EntityQueryInput]
  source_domain_lte: String
  _id_ne: ObjectId
  date_published_ne: String
  editor_notes_ne: String
}

input ChecklistRiskPrecedentInsertInput {
  incident_id: Int
  tags: [String]
  title: String
  description: String
}

input TaxaDummy_fieldInsertInput {
  field_number: String
  short_name: String
}

input TaxaField_listItem_fieldInsertInput {
  long_name: String
  permitted_values: [String]
  long_description: String
  default: String
  short_name: String
  required: Boolean
  weight: Int
  placeholder: String
  display_type: String
  mongo_type: String
  public: Boolean
  field_number: String
  instant_facet: Boolean
  short_description: String
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
}

type History_incidentTsne {
  x: Float
  y: Float
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

type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}

type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}

input History_incidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

input SubmissionUpdateInput {
  nlp_similar_incidents_unset: Boolean
  incident_editors: SubmissionIncident_editorsRelationInput
  deployers: SubmissionDeployersRelationInput
  incident_date: String
  _id: ObjectId
  cloudinary_id: String
  date_submitted_unset: Boolean
  authors_unset: Boolean
  date_downloaded_unset: Boolean
  epoch_date_modified: Int
  description_unset: Boolean
  incident_ids_unset: Boolean
  date_modified_unset: Boolean
  developers: SubmissionDevelopersRelationInput
  incident_editors_unset: Boolean
  submitters_unset: Boolean
  language: String
  developers_unset: Boolean
  url_unset: Boolean
  title_unset: Boolean
  image_url_unset: Boolean
  user_unset: Boolean
  language_unset: Boolean
  editor_notes_unset: Boolean
  image_url: String
  date_modified: String
  incident_ids: [Int]
  editor_dissimilar_incidents: [Int]
  harmed_parties_unset: Boolean
  tags: [String]
  plain_text_unset: Boolean
  date_published: String
  incident_date_unset: Boolean
  date_published_unset: Boolean
  editor_similar_incidents_unset: Boolean
  source_domain_unset: Boolean
  text: String
  embedding_unset: Boolean
  date_submitted: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  incident_title_unset: Boolean
  source_domain: String
  status: String
  editor_dissimilar_incidents_unset: Boolean
  editor_similar_incidents: [Int]
  _id_unset: Boolean
  cloudinary_id_unset: Boolean
  incident_title: String
  submitters: [String]
  deployers_unset: Boolean
  embedding: SubmissionEmbeddingUpdateInput
  user: SubmissionUserRelationInput
  editor_notes: String
  epoch_date_modified_inc: Int
  title: String
  date_downloaded: String
  authors: [String]
  epoch_date_modified_unset: Boolean
  tags_unset: Boolean
  text_unset: Boolean
  description: String
  url: String
  harmed_parties: SubmissionHarmed_partiesRelationInput
  plain_text: String
  status_unset: Boolean
}`;
