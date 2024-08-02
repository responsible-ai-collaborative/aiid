import gql from "graphql-tag";

export default gql`
input SubscriptionQueryInput {
  entityId: EntityQueryInput
  type_ne: String
  _id_nin: [ObjectId]
  OR: [SubscriptionQueryInput!]
  _id_exists: Boolean
  type: String
  _id_gte: ObjectId
  userId: UserQueryInput
  type_gte: String
  userId_exists: Boolean
  entityId_exists: Boolean
  AND: [SubscriptionQueryInput!]
  _id_ne: ObjectId
  _id_lte: ObjectId
  type_lte: String
  type_gt: String
  type_lt: String
  type_exists: Boolean
  type_nin: [String]
  type_in: [String]
  _id_lt: ObjectId
  _id_in: [ObjectId]
  _id_gt: ObjectId
  incident_id: IncidentQueryInput
  _id: ObjectId
  incident_id_exists: Boolean
}

input NotificationInsertInput {
  type: String
  userId: NotificationUserIdRelationInput
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
}

input History_incidentNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}

input TaxaDummy_fieldUpdateInput {
  field_number_unset: Boolean
  short_name: String
  short_name_unset: Boolean
  field_number: String
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

input QuickaddQueryInput {
  _id_in: [ObjectId]
  incident_id_nin: [Long]
  incident_id: Long
  source_domain: String
  incident_id_in: [Long]
  _id_gt: ObjectId
  date_submitted_gt: String
  _id_lte: ObjectId
  incident_id_exists: Boolean
  _id: ObjectId
  source_domain_nin: [String]
  source_domain_ne: String
  url_gte: String
  AND: [QuickaddQueryInput!]
  url_gt: String
  url_nin: [String]
  date_submitted_in: [String]
  url_lte: String
  _id_gte: ObjectId
  _id_exists: Boolean
  _id_nin: [ObjectId]
  incident_id_gt: Long
  source_domain_gte: String
  source_domain_lt: String
  url_ne: String
  source_domain_lte: String
  date_submitted_lt: String
  source_domain_exists: Boolean
  date_submitted_lte: String
  url_exists: Boolean
  date_submitted_nin: [String]
  incident_id_gte: Long
  url_in: [String]
  incident_id_ne: Long
  incident_id_lte: Long
  url: String
  source_domain_in: [String]
  OR: [QuickaddQueryInput!]
  date_submitted_gte: String
  _id_ne: ObjectId
  url_lt: String
  date_submitted_ne: String
  incident_id_lt: Long
  source_domain_gt: String
  _id_lt: ObjectId
  date_submitted_exists: Boolean
  date_submitted: String
}

input IncidentAllegedDeployerOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input History_reportUpdateInput {
  flag: Boolean
  modifiedBy: String
  editor_notes: String
  epoch_date_published_inc: Int
  date_modified_unset: Boolean
  epoch_date_submitted_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  date_published: DateTime
  submitters_unset: Boolean
  modifiedBy_unset: Boolean
  source_domain_unset: Boolean
  language: String
  editor_notes_unset: Boolean
  title: String
  image_url_unset: Boolean
  url: String
  cloudinary_id: String
  date_published_unset: Boolean
  text: String
  cloudinary_id_unset: Boolean
  authors_unset: Boolean
  epoch_date_downloaded: Int
  epoch_date_downloaded_inc: Int
  epoch_date_published_unset: Boolean
  report_number_unset: Boolean
  embedding: History_reportEmbeddingUpdateInput
  plain_text_unset: Boolean
  epoch_date_modified: Int
  epoch_date_submitted_inc: Int
  tags_unset: Boolean
  title_unset: Boolean
  quiet_unset: Boolean
  is_incident_report_unset: Boolean
  embedding_unset: Boolean
  plain_text: String
  epoch_date_modified_unset: Boolean
  image_url: String
  text_unset: Boolean
  inputs_outputs: [String]
  report_number: Int
  report_number_inc: Int
  date_submitted: DateTime
  inputs_outputs_unset: Boolean
  epoch_date_submitted: Int
  source_domain: String
  tags: [String]
  date_downloaded: DateTime
  user_unset: Boolean
  language_unset: Boolean
  user: String
  quiet: Boolean
  _id_unset: Boolean
  _id: ObjectId
  is_incident_report: Boolean
  date_submitted_unset: Boolean
  epoch_date_published: Int
  flag_unset: Boolean
  url_unset: Boolean
  epoch_date_modified_inc: Int
  description: String
  date_modified: DateTime
  authors: [String]
  submitters: [String]
  date_downloaded_unset: Boolean
  description_unset: Boolean
}

input TaxaQueryInput {
  complete_entities_ne: Boolean
  weight_lt: Int
  description: String
  namespace_lte: String
  namespace_lt: String
  namespace_ne: String
  field_list_in: [TaxaField_listQueryInput]
  weight_exists: Boolean
  _id_ne: ObjectId
  dummy_fields_exists: Boolean
  _id_exists: Boolean
  _id_gte: ObjectId
  description_ne: String
  description_nin: [String]
  field_list_exists: Boolean
  weight: Int
  field_list_nin: [TaxaField_listQueryInput]
  complete_entities_exists: Boolean
  _id_in: [ObjectId]
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  weight_ne: Int
  AND: [TaxaQueryInput!]
  namespace_exists: Boolean
  weight_gte: Int
  weight_lte: Int
  _id_lt: ObjectId
  description_gte: String
  _id_nin: [ObjectId]
  description_gt: String
  namespace_nin: [String]
  OR: [TaxaQueryInput!]
  description_exists: Boolean
  description_lt: String
  weight_gt: Int
  weight_in: [Int]
  description_lte: String
  weight_nin: [Int]
  namespace_gt: String
  complete_entities: Boolean
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  description_in: [String]
  field_list: [TaxaField_listQueryInput]
  _id_gt: ObjectId
  namespace: String
  namespace_gte: String
  dummy_fields: [TaxaDummy_fieldQueryInput]
  namespace_in: [String]
  _id: ObjectId
  _id_lte: ObjectId
}

input ReportEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
}

input ClassificationIncidentsRelationInput {
  create: [IncidentInsertInput]
  link: [Int]
}

input TaxaDummy_fieldQueryInput {
  short_name_ne: String
  AND: [TaxaDummy_fieldQueryInput!]
  OR: [TaxaDummy_fieldQueryInput!]
  field_number_in: [String]
  field_number_lte: String
  field_number_nin: [String]
  short_name_exists: Boolean
  field_number_gte: String
  field_number: String
  field_number_ne: String
  short_name_lt: String
  field_number_lt: String
  short_name: String
  short_name_nin: [String]
  field_number_gt: String
  short_name_gt: String
  short_name_gte: String
  short_name_lte: String
  short_name_in: [String]
  field_number_exists: Boolean
}

input History_incidentEmbeddingUpdateInput {
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_reports: [Int]
}

input SubmissionEmbeddingQueryInput {
  from_text_hash_lte: String
  from_text_hash_ne: String
  from_text_hash_in: [String]
  OR: [SubmissionEmbeddingQueryInput!]
  from_text_hash_gte: String
  vector_exists: Boolean
  AND: [SubmissionEmbeddingQueryInput!]
  from_text_hash: String
  vector_in: [Float]
  from_text_hash_gt: String
  from_text_hash_lt: String
  vector_nin: [Float]
  from_text_hash_nin: [String]
  vector: [Float]
  from_text_hash_exists: Boolean
}

type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}

input IncidentTsneUpdateInput {
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
  x_unset: Boolean
}

input SubmissionIncident_editorsRelationInput {
  link: [String]
  create: [UserInsertInput]
}

input History_incidentTsneUpdateInput {
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
}

type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input SubscriptionEntityIdRelationInput {
  create: EntityInsertInput
  link: String
}

type User {
  _id: ObjectId
  adminData: UserAdminDatum
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

input CandidateEmbeddingQueryInput {
  from_text_hash_ne: String
  AND: [CandidateEmbeddingQueryInput!]
  from_text_hash_lt: String
  from_text_hash_nin: [String]
  vector_in: [Float]
  vector: [Float]
  vector_nin: [Float]
  from_text_hash_exists: Boolean
  OR: [CandidateEmbeddingQueryInput!]
  from_text_hash_lte: String
  from_text_hash: String
  from_text_hash_in: [String]
  vector_exists: Boolean
  from_text_hash_gt: String
  from_text_hash_gte: String
}

input History_incidentTsneInsertInput {
  x: Float
  y: Float
}

input History_incidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

type CreateVariantPayload {
  incident_id: Int
  report_number: Int
}

type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}

enum EntitySortByInput {
  _ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  DATE_MODIFIED_ASC
  ENTITY_ID_DESC
  NAME_ASC
  _ID_ASC
  DATE_MODIFIED_DESC
  ENTITY_ID_ASC
  NAME_DESC
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

input ClassificationQueryInput {
  incidents: [IncidentQueryInput]
  _id_ne: ObjectId
  reports_in: [ReportQueryInput]
  notes_ne: String
  _id_lte: ObjectId
  OR: [ClassificationQueryInput!]
  _id_exists: Boolean
  attributes_nin: [ClassificationAttributeQueryInput]
  namespace: String
  namespace_exists: Boolean
  _id_gte: ObjectId
  _id_lt: ObjectId
  namespace_in: [String]
  incidents_in: [IncidentQueryInput]
  notes_in: [String]
  AND: [ClassificationQueryInput!]
  incidents_exists: Boolean
  notes_lt: String
  namespace_nin: [String]
  publish: Boolean
  incidents_nin: [IncidentQueryInput]
  reports_exists: Boolean
  notes_exists: Boolean
  attributes: [ClassificationAttributeQueryInput]
  attributes_exists: Boolean
  notes: String
  _id_in: [ObjectId]
  namespace_gte: String
  _id_gt: ObjectId
  namespace_ne: String
  reports: [ReportQueryInput]
  attributes_in: [ClassificationAttributeQueryInput]
  publish_exists: Boolean
  reports_nin: [ReportQueryInput]
  _id: ObjectId
  namespace_gt: String
  notes_gte: String
  publish_ne: Boolean
  notes_lte: String
  namespace_lt: String
  notes_nin: [String]
  _id_nin: [ObjectId]
  namespace_lte: String
  notes_gt: String
}

input CandidateEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

enum History_incidentSortByInput {
  _ID_DESC
  DATE_DESC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  INCIDENT_ID_DESC
  DESCRIPTION_DESC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_DESC
  TITLE_DESC
  INCIDENT_ID_ASC
  MODIFIEDBY_ASC
  MODIFIEDBY_DESC
  _ID_ASC
  DATE_ASC
  TITLE_ASC
}

input EntityInsertInput {
  entity_id: String!
  name: String!
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
}

input History_reportEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}

input TaxaField_listUpdateInput {
  display_type_unset: Boolean
  mongo_type: String
  default_unset: Boolean
  short_description_unset: Boolean
  field_number: String
  default: String
  instant_facet: Boolean
  permitted_values_unset: Boolean
  item_fields: TaxaField_listItem_fieldUpdateInput
  hide_search: Boolean
  required: Boolean
  weight: Int
  short_name: String
  hide_search_unset: Boolean
  long_description: String
  permitted_values: [String]
  instant_facet_unset: Boolean
  item_fields_unset: Boolean
  display_type: String
  mongo_type_unset: Boolean
  placeholder_unset: Boolean
  complete_from: TaxaField_listComplete_fromUpdateInput
  public_unset: Boolean
  public: Boolean
  weight_inc: Int
  weight_unset: Boolean
  field_number_unset: Boolean
  short_description: String
  long_description_unset: Boolean
  placeholder: String
  short_name_unset: Boolean
  required_unset: Boolean
  complete_from_unset: Boolean
  long_name: String
  long_name_unset: Boolean
}

input SubmissionNlp_similar_incidentQueryInput {
  incident_id_in: [Int]
  similarity_in: [Float]
  incident_id_lt: Int
  incident_id_lte: Int
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  similarity_nin: [Float]
  incident_id_ne: Int
  similarity_gt: Float
  similarity_lte: Float
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  similarity_gte: Float
  similarity_lt: Float
  similarity_ne: Float
  incident_id_gt: Int
  incident_id_nin: [Int]
  incident_id: Int
  incident_id_gte: Int
  incident_id_exists: Boolean
  similarity_exists: Boolean
  similarity: Float
}

input CandidateQueryInput {
  matching_keywords_nin: [String]
  date_downloaded_in: [String]
  matching_keywords_in: [String]
  plain_text_nin: [String]
  image_url_lte: String
  date_downloaded_lte: String
  _id_gte: ObjectId
  date_published_in: [String]
  source_domain_gte: String
  url_gt: String
  match_ne: Boolean
  epoch_date_published: Int
  date_published_nin: [String]
  similarity_in: [Float]
  similarity_exists: Boolean
  authors_in: [String]
  epoch_date_downloaded_gt: Int
  matching_entities_nin: [String]
  title_exists: Boolean
  text_nin: [String]
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  source_domain_lt: String
  matching_entities_exists: Boolean
  plain_text_in: [String]
  image_url_lt: String
  matching_keywords: [String]
  matching_keywords_exists: Boolean
  text_gt: String
  epoch_date_published_gt: Int
  epoch_date_published_lte: Int
  similarity_lt: Float
  image_url_in: [String]
  url_ne: String
  match: Boolean
  date_downloaded_gt: String
  dismissed: Boolean
  classification_similarity_exists: Boolean
  date_downloaded_ne: String
  date_downloaded_gte: String
  epoch_date_published_ne: Int
  language_in: [String]
  url_lt: String
  matching_harm_keywords_nin: [String]
  _id_gt: ObjectId
  date_published_gt: String
  similarity_ne: Float
  date_published: String
  date_downloaded_nin: [String]
  title_lte: String
  text_lt: String
  _id_in: [ObjectId]
  url_exists: Boolean
  source_domain_ne: String
  epoch_date_downloaded_lte: Int
  plain_text_ne: String
  authors_exists: Boolean
  source_domain_in: [String]
  epoch_date_published_gte: Int
  match_exists: Boolean
  dismissed_ne: Boolean
  title_gte: String
  language_exists: Boolean
  title_nin: [String]
  image_url_gte: String
  image_url_ne: String
  epoch_date_published_in: [Int]
  text_lte: String
  date_published_lt: String
  date_downloaded: String
  image_url_exists: Boolean
  text_gte: String
  OR: [CandidateQueryInput!]
  authors: [String]
  date_published_lte: String
  similarity_nin: [Float]
  title_ne: String
  source_domain_nin: [String]
  title_lt: String
  language_nin: [String]
  _id_lt: ObjectId
  dismissed_exists: Boolean
  date_published_gte: String
  url_gte: String
  language_lte: String
  embedding: CandidateEmbeddingQueryInput
  _id_exists: Boolean
  date_downloaded_lt: String
  embedding_exists: Boolean
  url_nin: [String]
  plain_text_exists: Boolean
  epoch_date_published_exists: Boolean
  url_in: [String]
  plain_text_lte: String
  _id_lte: ObjectId
  epoch_date_downloaded: Int
  matching_harm_keywords: [String]
  _id_ne: ObjectId
  epoch_date_downloaded_ne: Int
  AND: [CandidateQueryInput!]
  source_domain_lte: String
  epoch_date_downloaded_gte: Int
  text_exists: Boolean
  matching_entities: [String]
  text_ne: String
  matching_entities_in: [String]
  language_ne: String
  epoch_date_downloaded_lt: Int
  title_gt: String
  epoch_date_downloaded_nin: [Int]
  similarity_gte: Float
  title: String
  language_gt: String
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  image_url_gt: String
  plain_text_gt: String
  url: String
  image_url: String
  date_published_exists: Boolean
  plain_text: String
  text: String
  epoch_date_downloaded_exists: Boolean
  url_lte: String
  similarity_gt: Float
  plain_text_lt: String
  text_in: [String]
  similarity: Float
  authors_nin: [String]
  source_domain_exists: Boolean
  matching_harm_keywords_in: [String]
  _id_nin: [ObjectId]
  date_published_ne: String
  epoch_date_published_lt: Int
  language: String
  classification_similarity: [CandidateClassification_similarityQueryInput]
  date_downloaded_exists: Boolean
  language_lt: String
  title_in: [String]
  epoch_date_downloaded_in: [Int]
  epoch_date_published_nin: [Int]
  plain_text_gte: String
  similarity_lte: Float
  source_domain_gt: String
  image_url_nin: [String]
  matching_harm_keywords_exists: Boolean
  _id: ObjectId
  source_domain: String
  language_gte: String
}

type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input UserQueryInput {
  _id: ObjectId
  _id_gt: ObjectId
  OR: [UserQueryInput!]
  last_name_exists: Boolean
  last_name_gt: String
  roles_exists: Boolean
  AND: [UserQueryInput!]
  last_name: String
  _id_exists: Boolean
  last_name_lte: String
  first_name_lte: String
  userId_nin: [String]
  first_name_ne: String
  userId_lte: String
  _id_in: [ObjectId]
  first_name_gte: String
  _id_gte: ObjectId
  first_name_lt: String
  userId_lt: String
  last_name_gte: String
  userId_gte: String
  last_name_lt: String
  _id_lte: ObjectId
  first_name_gt: String
  first_name_nin: [String]
  userId: String
  first_name: String
  roles_in: [String]
  _id_ne: ObjectId
  last_name_nin: [String]
  roles: [String]
  userId_gt: String
  _id_lt: ObjectId
  userId_ne: String
  last_name_in: [String]
  roles_nin: [String]
  first_name_exists: Boolean
  userId_in: [String]
  _id_nin: [ObjectId]
  first_name_in: [String]
  userId_exists: Boolean
  last_name_ne: String
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

type CandidateClassification_similarity {
  classification: String
  similarity: Float
}

type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input TaxaField_listComplete_fromInsertInput {
  all: [String]
  current: [String]
}

input NotificationQueryInput {
  sentDate_gt: DateTime
  _id_gt: ObjectId
  incident_id_in: [Int]
  incident_id_lte: Int
  userId: UserQueryInput
  AND: [NotificationQueryInput!]
  sentDate_gte: DateTime
  sentDate_exists: Boolean
  userId_exists: Boolean
  _id_lt: ObjectId
  processed_ne: Boolean
  type_lte: String
  incident_id_exists: Boolean
  type_gt: String
  sentDate_lte: DateTime
  sentDate_ne: DateTime
  _id_nin: [ObjectId]
  incident_id_gte: Int
  incident_id_lt: Int
  incident_id_gt: Int
  sentDate_nin: [DateTime]
  sentDate_lt: DateTime
  type_ne: String
  type_in: [String]
  incident_id: Int
  sentDate_in: [DateTime]
  type_exists: Boolean
  _id: ObjectId
  type_nin: [String]
  _id_ne: ObjectId
  type: String
  _id_in: [ObjectId]
  sentDate: DateTime
  type_lt: String
  incident_id_ne: Int
  processed: Boolean
  type_gte: String
  OR: [NotificationQueryInput!]
  _id_exists: Boolean
  incident_id_nin: [Int]
  processed_exists: Boolean
  _id_gte: ObjectId
  _id_lte: ObjectId
}

type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}

type LogReportHistoryPayload {
  report_number: Int
}

input EntityQueryInput {
  created_at_lte: DateTime
  date_modified_nin: [DateTime]
  entity_id_in: [String]
  name_ne: String
  date_modified_exists: Boolean
  entity_id_lt: String
  date_modified: DateTime
  date_modified_lt: DateTime
  entity_id_ne: String
  _id_gt: ObjectId
  created_at_in: [DateTime]
  name_gte: String
  date_modified_gt: DateTime
  entity_id: String
  name_lte: String
  name_in: [String]
  date_modified_gte: DateTime
  date_modified_lte: DateTime
  created_at_nin: [DateTime]
  _id_lt: ObjectId
  created_at_gt: DateTime
  AND: [EntityQueryInput!]
  entity_id_lte: String
  entity_id_gte: String
  created_at_exists: Boolean
  name_exists: Boolean
  _id_ne: ObjectId
  date_modified_ne: DateTime
  date_modified_in: [DateTime]
  entity_id_nin: [String]
  entity_id_gt: String
  _id_gte: ObjectId
  created_at_ne: DateTime
  OR: [EntityQueryInput!]
  _id_lte: ObjectId
  name_lt: String
  _id: ObjectId
  created_at_gte: DateTime
  name_nin: [String]
  _id_nin: [ObjectId]
  _id_in: [ObjectId]
  created_at: DateTime
  name: String
  name_gt: String
  _id_exists: Boolean
  entity_id_exists: Boolean
  created_at_lt: DateTime
}

input Entity_relationshipObjRelationInput {
  link: String
  create: EntityInsertInput
}

input SubscriptionIncident_idRelationInput {
  link: Int
  create: IncidentInsertInput
}

type ReportTranslation {
  text: String
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

input History_reportInsertInput {
  language: String!
  inputs_outputs: [String]
  source_domain: String!
  date_published: DateTime!
  submitters: [String]!
  authors: [String]!
  date_modified: DateTime!
  epoch_date_published: Int!
  user: String
  epoch_date_modified: Int!
  text: String!
  tags: [String]!
  editor_notes: String
  flag: Boolean
  image_url: String!
  url: String!
  modifiedBy: String
  _id: ObjectId
  title: String!
  is_incident_report: Boolean
  report_number: Int!
  embedding: History_reportEmbeddingInsertInput
  description: String
  epoch_date_submitted: Int!
  date_submitted: DateTime!
  quiet: Boolean
  epoch_date_downloaded: Int!
  cloudinary_id: String!
  date_downloaded: DateTime!
  plain_text: String!
}

input DuplicateInsertInput {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input SubscriptionUpdateInput {
  entityId: SubscriptionEntityIdRelationInput
  entityId_unset: Boolean
  _id_unset: Boolean
  userId_unset: Boolean
  _id: ObjectId
  incident_id: SubscriptionIncident_idRelationInput
  type: String
  type_unset: Boolean
  incident_id_unset: Boolean
  userId: SubscriptionUserIdRelationInput
}

input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input SubmissionInsertInput {
  editor_similar_incidents: [Int]
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  date_submitted: String!
  source_domain: String!
  description: String
  cloudinary_id: String
  incident_editors: SubmissionIncident_editorsRelationInput
  submitters: [String]!
  harmed_parties: SubmissionHarmed_partiesRelationInput
  incident_ids: [Int]
  incident_date: String
  authors: [String]!
  tags: [String]!
  date_published: String!
  title: String!
  date_modified: String!
  language: String!
  epoch_date_modified: Int
  status: String
  image_url: String!
  url: String!
  editor_dissimilar_incidents: [Int]
  editor_notes: String
  developers: SubmissionDevelopersRelationInput
  plain_text: String
  text: String!
  quiet: Boolean
  incident_title: String
  embedding: SubmissionEmbeddingInsertInput
  deployers: SubmissionDeployersRelationInput
  user: SubmissionUserRelationInput
  _id: ObjectId
  date_downloaded: String!
}

input ClassificationAttributeInsertInput {
  short_name: String
  value_json: String
}

input PromoteSubmissionToReportInput {
  is_incident_report: Boolean
  submission_id: ObjectId
  incident_ids: [Int]
}

input IncidentTsneQueryInput {
  x_gt: Float
  y: Float
  y_in: [Float]
  y_lt: Float
  x_lt: Float
  x_exists: Boolean
  y_nin: [Float]
  x_nin: [Float]
  y_gt: Float
  y_exists: Boolean
  y_gte: Float
  x_gte: Float
  y_lte: Float
  x_in: [Float]
  AND: [IncidentTsneQueryInput!]
  x: Float
  x_lte: Float
  y_ne: Float
  x_ne: Float
  OR: [IncidentTsneQueryInput!]
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

input CandidateClassification_similarityQueryInput {
  similarity_gte: Float
  similarity_in: [Float]
  similarity_exists: Boolean
  classification_lte: String
  classification_exists: Boolean
  OR: [CandidateClassification_similarityQueryInput!]
  similarity_nin: [Float]
  similarity_lt: Float
  similarity_lte: Float
  similarity: Float
  AND: [CandidateClassification_similarityQueryInput!]
  similarity_ne: Float
  classification_gte: String
  similarity_gt: Float
  classification: String
  classification_lt: String
  classification_gt: String
  classification_nin: [String]
  classification_ne: String
  classification_in: [String]
}

input TaxaField_listItem_fieldComplete_fromInsertInput {
  all: [String]
  current: [String]
  entities: Boolean
}

input History_incidentQueryInput {
  editor_dissimilar_incidents_exists: Boolean
  epoch_date_modified_nin: [Int]
  editor_dissimilar_incidents_in: [Int]
  editor_similar_incidents_in: [Int]
  _id_gte: ObjectId
  title_gte: String
  AllegedDeveloperOfAISystem_exists: Boolean
  date_lt: String
  title_gt: String
  date_gt: String
  editor_similar_incidents: [Int]
  title_lte: String
  editor_similar_incidents_exists: Boolean
  date_ne: String
  flagged_dissimilar_incidents_in: [Int]
  _id_in: [ObjectId]
  AllegedDeployerOfAISystem_exists: Boolean
  modifiedBy_ne: String
  AllegedDeveloperOfAISystem_nin: [String]
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  editor_dissimilar_incidents_nin: [Int]
  incident_id_lte: Int
  AllegedDeveloperOfAISystem: [String]
  modifiedBy: String
  editor_notes_lte: String
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  editor_dissimilar_incidents: [Int]
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  editor_notes_lt: String
  date_in: [String]
  modifiedBy_gte: String
  AllegedDeployerOfAISystem_in: [String]
  editor_notes_in: [String]
  _id_lt: ObjectId
  title_in: [String]
  description_lte: String
  _id: ObjectId
  editor_notes_ne: String
  date_lte: String
  modifiedBy_nin: [String]
  date_exists: Boolean
  title_ne: String
  modifiedBy_in: [String]
  embedding_exists: Boolean
  editors: [String]
  incident_id: Int
  modifiedBy_lt: String
  epoch_date_modified_ne: Int
  description_gte: String
  incident_id_in: [Int]
  modifiedBy_exists: Boolean
  editor_notes_gt: String
  OR: [History_incidentQueryInput!]
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  AllegedDeployerOfAISystem_nin: [String]
  AND: [History_incidentQueryInput!]
  _id_gt: ObjectId
  reports_exists: Boolean
  flagged_dissimilar_incidents_exists: Boolean
  editor_similar_incidents_nin: [Int]
  epoch_date_modified_gte: Int
  incident_id_exists: Boolean
  epoch_date_modified_lte: Int
  epoch_date_modified: Int
  editor_notes: String
  description_gt: String
  editor_notes_gte: String
  date_nin: [String]
  epoch_date_modified_in: [Int]
  description: String
  tsne: History_incidentTsneQueryInput
  epoch_date_modified_lt: Int
  date_gte: String
  embedding: History_incidentEmbeddingQueryInput
  _id_nin: [ObjectId]
  nlp_similar_incidents_exists: Boolean
  editor_notes_nin: [String]
  epoch_date_modified_exists: Boolean
  description_in: [String]
  modifiedBy_lte: String
  description_ne: String
  reports: [Int]
  incident_id_gte: Int
  reports_in: [Int]
  title_nin: [String]
  title_lt: String
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  _id_exists: Boolean
  incident_id_gt: Int
  editors_nin: [String]
  title: String
  _id_lte: ObjectId
  title_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties: [String]
  modifiedBy_gt: String
  flagged_dissimilar_incidents_nin: [Int]
  reports_nin: [Int]
  flagged_dissimilar_incidents: [Int]
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  incident_id_ne: Int
  epoch_date_modified_gt: Int
  date: String
  AllegedDeployerOfAISystem: [String]
  AllegedDeveloperOfAISystem_in: [String]
  description_exists: Boolean
  _id_ne: ObjectId
  editors_exists: Boolean
  tsne_exists: Boolean
  incident_id_lt: Int
  description_nin: [String]
  incident_id_nin: [Int]
  editors_in: [String]
  editor_notes_exists: Boolean
  description_lt: String
}

input IncidentReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

type AppUser {
  email: String
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

input TaxaDummy_fieldInsertInput {
  field_number: String
  short_name: String
}

input ChecklistRiskPrecedentInsertInput {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

enum SubscriptionSortByInput {
  USERID_DESC
  ENTITYID_DESC
  TYPE_ASC
  ENTITYID_ASC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  TYPE_DESC
  USERID_ASC
  _ID_ASC
  _ID_DESC
}

input ChecklistRiskQueryInput {
  severity_gt: String
  title_exists: Boolean
  severity_gte: String
  likelihood_nin: [String]
  precedents: [ChecklistRiskPrecedentQueryInput]
  risk_notes_gt: String
  id_nin: [String]
  tags_nin: [String]
  id: String
  risk_notes_in: [String]
  touched_ne: Boolean
  generated_exists: Boolean
  touched_exists: Boolean
  title_nin: [String]
  risk_notes_gte: String
  id_lt: String
  risk_notes_lt: String
  title_gte: String
  risk_status_gte: String
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  title_gt: String
  likelihood_exists: Boolean
  title_lte: String
  AND: [ChecklistRiskQueryInput!]
  likelihood_in: [String]
  risk_notes_nin: [String]
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  risk_status: String
  OR: [ChecklistRiskQueryInput!]
  id_exists: Boolean
  generated_ne: Boolean
  severity_exists: Boolean
  risk_notes_exists: Boolean
  risk_status_gt: String
  title_ne: String
  risk_status_exists: Boolean
  risk_status_lte: String
  title_in: [String]
  precedents_exists: Boolean
  severity_nin: [String]
  tags: [String]
  title: String
  tags_exists: Boolean
  tags_in: [String]
  likelihood: String
  likelihood_ne: String
  risk_status_lt: String
  risk_notes_ne: String
  severity_lt: String
  id_ne: String
  severity_in: [String]
  severity: String
  risk_status_in: [String]
  risk_status_ne: String
  risk_status_nin: [String]
  id_gte: String
  risk_notes: String
  severity_lte: String
  touched: Boolean
  risk_notes_lte: String
  id_gt: String
  id_lte: String
  likelihood_gt: String
  title_lt: String
  likelihood_gte: String
  likelihood_lt: String
  id_in: [String]
  generated: Boolean
  severity_ne: String
  likelihood_lte: String
}

type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}

input IncidentNlp_similar_incidentQueryInput {
  similarity_lte: Float
  incident_id_gte: Int
  incident_id_lt: Int
  similarity_gt: Float
  OR: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_ne: Int
  similarity_nin: [Float]
  similarity_ne: Float
  similarity_gte: Float
  similarity_exists: Boolean
  incident_id_exists: Boolean
  incident_id: Int
  incident_id_nin: [Int]
  similarity: Float
  incident_id_in: [Int]
  similarity_in: [Float]
  incident_id_gt: Int
  similarity_lt: Float
  AND: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_lte: Int
}

type TaxaDummy_field {
  field_number: String
  short_name: String
}

type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}

type Entity_relationship {
  _id: ObjectId
  created_at: DateTime
  is_symmetric: Boolean
  obj: Entity!
  pred: String!
  sub: Entity!
}

input ClassificationAttributeUpdateInput {
  value_json_unset: Boolean
  short_name: String
  short_name_unset: Boolean
  value_json: String
}

input IncidentEmbeddingQueryInput {
  from_reports_exists: Boolean
  AND: [IncidentEmbeddingQueryInput!]
  from_reports: [Int]
  vector: [Float]
  vector_nin: [Float]
  vector_in: [Float]
  OR: [IncidentEmbeddingQueryInput!]
  vector_exists: Boolean
  from_reports_in: [Int]
  from_reports_nin: [Int]
}

type IncidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input History_incidentTsneQueryInput {
  y_lt: Float
  OR: [History_incidentTsneQueryInput!]
  x_exists: Boolean
  y: Float
  y_in: [Float]
  y_nin: [Float]
  x_lte: Float
  y_gt: Float
  x_lt: Float
  AND: [History_incidentTsneQueryInput!]
  x: Float
  x_nin: [Float]
  y_lte: Float
  y_exists: Boolean
  y_gte: Float
  y_ne: Float
  x_gt: Float
  x_ne: Float
  x_gte: Float
  x_in: [Float]
}

input History_reportQueryInput {
  text_lt: String
  epoch_date_submitted_gte: Int
  modifiedBy_gt: String
  date_submitted_ne: DateTime
  _id_gt: ObjectId
  epoch_date_submitted_exists: Boolean
  date_submitted_lte: DateTime
  epoch_date_submitted: Int
  date_submitted: DateTime
  image_url_nin: [String]
  source_domain: String
  inputs_outputs: [String]
  tags_in: [String]
  epoch_date_downloaded_lt: Int
  title_in: [String]
  modifiedBy_ne: String
  _id_lt: ObjectId
  description_gte: String
  description_ne: String
  epoch_date_submitted_ne: Int
  user_exists: Boolean
  description: String
  embedding: History_reportEmbeddingQueryInput
  date_submitted_gte: DateTime
  title_lte: String
  description_in: [String]
  authors: [String]
  date_submitted_in: [DateTime]
  cloudinary_id_ne: String
  modifiedBy_lte: String
  _id_gte: ObjectId
  user_ne: String
  date_modified_lt: DateTime
  date_modified_lte: DateTime
  epoch_date_submitted_nin: [Int]
  epoch_date_downloaded_exists: Boolean
  plain_text_exists: Boolean
  epoch_date_published_lt: Int
  is_incident_report_exists: Boolean
  quiet_ne: Boolean
  epoch_date_modified_nin: [Int]
  image_url: String
  date_submitted_nin: [DateTime]
  text_gte: String
  submitters_exists: Boolean
  date_published_exists: Boolean
  language_lte: String
  text_ne: String
  date_published_lte: DateTime
  language_nin: [String]
  text: String
  title_lt: String
  title_nin: [String]
  date_submitted_gt: DateTime
  authors_nin: [String]
  epoch_date_published: Int
  date_downloaded_nin: [DateTime]
  date_published_ne: DateTime
  cloudinary_id_lt: String
  image_url_gt: String
  flag: Boolean
  cloudinary_id_nin: [String]
  editor_notes_nin: [String]
  date_modified_exists: Boolean
  text_gt: String
  epoch_date_modified_gt: Int
  editor_notes_ne: String
  submitters_in: [String]
  plain_text_lte: String
  epoch_date_modified_exists: Boolean
  date_modified_gte: DateTime
  editor_notes_lt: String
  date_published_gt: DateTime
  title_gte: String
  date_modified_in: [DateTime]
  embedding_exists: Boolean
  _id_lte: ObjectId
  epoch_date_downloaded_lte: Int
  authors_exists: Boolean
  url_ne: String
  date_downloaded: DateTime
  epoch_date_published_ne: Int
  epoch_date_modified_ne: Int
  cloudinary_id_gte: String
  plain_text_nin: [String]
  report_number_lte: Int
  title_ne: String
  date_published_in: [DateTime]
  title_exists: Boolean
  date_published_gte: DateTime
  source_domain_in: [String]
  modifiedBy: String
  title: String
  language_ne: String
  date_modified_nin: [DateTime]
  date_downloaded_gt: DateTime
  epoch_date_downloaded_ne: Int
  url_gte: String
  url_lt: String
  editor_notes_exists: Boolean
  _id_in: [ObjectId]
  date_downloaded_lt: DateTime
  user_nin: [String]
  url: String
  text_lte: String
  submitters: [String]
  flag_ne: Boolean
  report_number_gte: Int
  url_nin: [String]
  source_domain_exists: Boolean
  date_published_lt: DateTime
  modifiedBy_nin: [String]
  tags: [String]
  user_gte: String
  OR: [History_reportQueryInput!]
  title_gt: String
  date_published_nin: [DateTime]
  is_incident_report_ne: Boolean
  epoch_date_downloaded_in: [Int]
  _id_nin: [ObjectId]
  plain_text_lt: String
  date_downloaded_in: [DateTime]
  date_downloaded_exists: Boolean
  epoch_date_published_in: [Int]
  date_downloaded_gte: DateTime
  description_lt: String
  image_url_in: [String]
  user_lte: String
  modifiedBy_lt: String
  report_number_lt: Int
  date_submitted_lt: DateTime
  modifiedBy_exists: Boolean
  description_lte: String
  plain_text_ne: String
  image_url_ne: String
  epoch_date_modified_in: [Int]
  language_exists: Boolean
  report_number_ne: Int
  image_url_lte: String
  editor_notes_gte: String
  inputs_outputs_in: [String]
  image_url_lt: String
  url_exists: Boolean
  epoch_date_submitted_lte: Int
  date_downloaded_lte: DateTime
  date_modified: DateTime
  plain_text_gte: String
  editor_notes_gt: String
  date_submitted_exists: Boolean
  flag_exists: Boolean
  date_modified_ne: DateTime
  report_number: Int
  plain_text: String
  language_lt: String
  language_gte: String
  source_domain_gte: String
  modifiedBy_in: [String]
  text_nin: [String]
  user_lt: String
  inputs_outputs_exists: Boolean
  report_number_nin: [Int]
  source_domain_gt: String
  inputs_outputs_nin: [String]
  image_url_exists: Boolean
  cloudinary_id_in: [String]
  editor_notes_in: [String]
  epoch_date_downloaded_gt: Int
  epoch_date_downloaded_nin: [Int]
  url_lte: String
  description_gt: String
  source_domain_lt: String
  _id_exists: Boolean
  authors_in: [String]
  date_modified_gt: DateTime
  image_url_gte: String
  user_gt: String
  report_number_in: [Int]
  epoch_date_modified_lte: Int
  source_domain_lte: String
  text_exists: Boolean
  source_domain_nin: [String]
  source_domain_ne: String
  cloudinary_id_exists: Boolean
  epoch_date_downloaded_gte: Int
  user: String
  report_number_gt: Int
  epoch_date_modified_gte: Int
  tags_nin: [String]
  epoch_date_submitted_gt: Int
  editor_notes: String
  report_number_exists: Boolean
  _id_ne: ObjectId
  language_in: [String]
  epoch_date_published_lte: Int
  plain_text_gt: String
  AND: [History_reportQueryInput!]
  text_in: [String]
  description_exists: Boolean
  is_incident_report: Boolean
  cloudinary_id_gt: String
  epoch_date_published_exists: Boolean
  editor_notes_lte: String
  date_published: DateTime
  language_gt: String
  url_gt: String
  user_in: [String]
  epoch_date_modified_lt: Int
  epoch_date_published_gt: Int
  language: String
  epoch_date_submitted_lt: Int
  epoch_date_downloaded: Int
  description_nin: [String]
  submitters_nin: [String]
  plain_text_in: [String]
  epoch_date_submitted_in: [Int]
  epoch_date_published_gte: Int
  modifiedBy_gte: String
  epoch_date_modified: Int
  quiet_exists: Boolean
  tags_exists: Boolean
  cloudinary_id_lte: String
  quiet: Boolean
  _id: ObjectId
  cloudinary_id: String
  url_in: [String]
  epoch_date_published_nin: [Int]
  date_downloaded_ne: DateTime
}

input GetUserInput {
  userId: ObjectId
}

type ClassificationAttribute {
  short_name: String
  value_json: String
}

enum Entity_relationshipSortByInput {
  _ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  OBJ_ASC
  OBJ_DESC
  PRED_ASC
  PRED_DESC
  _ID_ASC
  SUB_ASC
  SUB_DESC
}

enum CandidateSortByInput {
  SOURCE_DOMAIN_DESC
  URL_DESC
  _ID_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  IMAGE_URL_ASC
  PLAIN_TEXT_DESC
  SIMILARITY_ASC
  SIMILARITY_DESC
  _ID_ASC
  DATE_DOWNLOADED_ASC
  DATE_PUBLISHED_ASC
  LANGUAGE_ASC
  LANGUAGE_DESC
  TITLE_DESC
  TEXT_DESC
  TITLE_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  IMAGE_URL_DESC
  PLAIN_TEXT_ASC
  SOURCE_DOMAIN_ASC
  TEXT_ASC
  URL_ASC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_PUBLISHED_DESC
}

input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input IncidentUpdateInput {
  embedding: IncidentEmbeddingUpdateInput
  reports_unset: Boolean
  editor_notes_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  date: String
  title: String
  epoch_date_modified: Int
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  editor_dissimilar_incidents_unset: Boolean
  description: String
  flagged_dissimilar_incidents_unset: Boolean
  embedding_unset: Boolean
  title_unset: Boolean
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  _id_unset: Boolean
  date_unset: Boolean
  _id: ObjectId
  incident_id_inc: Int
  nlp_similar_incidents_unset: Boolean
  incident_id: Int
  description_unset: Boolean
  editor_similar_incidents_unset: Boolean
  AllegedDeployerOfAISystem_unset: Boolean
  reports: IncidentReportsRelationInput
  incident_id_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  editor_dissimilar_incidents: [Int]
  tsne: IncidentTsneUpdateInput
  editors: IncidentEditorsRelationInput
  editor_notes: String
  tsne_unset: Boolean
  editor_similar_incidents: [Int]
  editors_unset: Boolean
  epoch_date_modified_inc: Int
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  epoch_date_modified_unset: Boolean
}

input QuickaddUpdateInput {
  date_submitted: String
  date_submitted_unset: Boolean
  _id: ObjectId
  source_domain: String
  incident_id: Long
  incident_id_unset: Boolean
  url: String
  url_unset: Boolean
  source_domain_unset: Boolean
  _id_unset: Boolean
}

enum NotificationSortByInput {
  _ID_ASC
  TYPE_ASC
  TYPE_DESC
  USERID_ASC
  USERID_DESC
  _ID_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  SENTDATE_ASC
  SENTDATE_DESC
}

input History_reportEmbeddingQueryInput {
  from_text_hash_lt: String
  from_text_hash_in: [String]
  from_text_hash_gte: String
  from_text_hash_nin: [String]
  AND: [History_reportEmbeddingQueryInput!]
  vector_in: [Float]
  vector_nin: [Float]
  from_text_hash_lte: String
  from_text_hash: String
  OR: [History_reportEmbeddingQueryInput!]
  from_text_hash_gt: String
  vector_exists: Boolean
  from_text_hash_ne: String
  from_text_hash_exists: Boolean
  vector: [Float]
}

input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input IncidentEditorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}

input CreateVariantInputVariant {
  date_published: String
  inputs_outputs: [String]
  submitters: [String]
  text: String
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

type DeleteManyPayload {
  deletedCount: Int!
}

input SubscriptionUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input TaxaField_listInsertInput {
  weight: Int
  long_description: String
  placeholder: String
  required: Boolean
  default: String
  short_name: String
  mongo_type: String
  complete_from: TaxaField_listComplete_fromInsertInput
  hide_search: Boolean
  instant_facet: Boolean
  field_number: String
  item_fields: TaxaField_listItem_fieldInsertInput
  permitted_values: [String]
  short_description: String
  public: Boolean
  display_type: String
  long_name: String
}

input QuickaddInsertInput {
  incident_id: Long
  source_domain: String
  url: String!
  _id: ObjectId
  date_submitted: String!
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

type Mutation {
  createDefaultAdminUser(input: CreateDefaultAdminUserInput): DefaultAdminUser
  createVariant(input: CreateVariantInput): CreateVariantPayload
  deleteManyCandidates(query: CandidateQueryInput): DeleteManyPayload
  deleteManyChecklists(query: ChecklistQueryInput): DeleteManyPayload
  deleteManyClassifications(query: ClassificationQueryInput): DeleteManyPayload
  deleteManyDuplicates(query: DuplicateQueryInput): DeleteManyPayload
  deleteManyEntities(query: EntityQueryInput): DeleteManyPayload
  deleteManyEntity_relationships(query: Entity_relationshipQueryInput): DeleteManyPayload
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
  deleteOneEntity_relationship(query: Entity_relationshipQueryInput!): Entity_relationship
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
  insertManyEntity_relationships(data: [Entity_relationshipInsertInput!]!): InsertManyPayload
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
  insertOneEntity_relationship(data: Entity_relationshipInsertInput!): Entity_relationship
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
  replaceOneClassification(query: ClassificationQueryInput, data: ClassificationInsertInput!): Classification
  replaceOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  replaceOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  replaceOneEntity_relationship(query: Entity_relationshipQueryInput, data: Entity_relationshipInsertInput!): Entity_relationship
  replaceOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  replaceOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  replaceOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  replaceOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
  replaceOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  replaceOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  replaceOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  replaceOneSubscription(data: SubscriptionInsertInput!, query: SubscriptionQueryInput): Subscription
  replaceOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  replaceOneUser(data: UserInsertInput!, query: UserQueryInput): User
  updateManyCandidates(query: CandidateQueryInput, set: CandidateUpdateInput!): UpdateManyPayload
  updateManyChecklists(query: ChecklistQueryInput, set: ChecklistUpdateInput!): UpdateManyPayload
  updateManyClassifications(query: ClassificationQueryInput, set: ClassificationUpdateInput!): UpdateManyPayload
  updateManyDuplicates(query: DuplicateQueryInput, set: DuplicateUpdateInput!): UpdateManyPayload
  updateManyEntities(query: EntityQueryInput, set: EntityUpdateInput!): UpdateManyPayload
  updateManyEntity_relationships(query: Entity_relationshipQueryInput, set: Entity_relationshipUpdateInput!): UpdateManyPayload
  updateManyHistory_incidents(query: History_incidentQueryInput, set: History_incidentUpdateInput!): UpdateManyPayload
  updateManyHistory_reports(query: History_reportQueryInput, set: History_reportUpdateInput!): UpdateManyPayload
  updateManyIncidents(query: IncidentQueryInput, set: IncidentUpdateInput!): UpdateManyPayload
  updateManyNotifications(query: NotificationQueryInput, set: NotificationUpdateInput!): UpdateManyPayload
  updateManyQuickadds(set: QuickaddUpdateInput!, query: QuickaddQueryInput): UpdateManyPayload
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
  updateOneEntity_relationship(query: Entity_relationshipQueryInput, set: Entity_relationshipUpdateInput!): Entity_relationship
  updateOneHistory_incident(query: History_incidentQueryInput, set: History_incidentUpdateInput!): History_incident
  updateOneHistory_report(query: History_reportQueryInput, set: History_reportUpdateInput!): History_report
  updateOneIncident(set: IncidentUpdateInput!, query: IncidentQueryInput): Incident
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
  upsertOneEntity(data: EntityInsertInput!, query: EntityQueryInput): Entity
  upsertOneEntity_relationship(data: Entity_relationshipInsertInput!, query: Entity_relationshipQueryInput): Entity_relationship
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

input EntityUpdateInput {
  date_modified: DateTime
  entity_id: String
  name: String
  name_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  entity_id_unset: Boolean
  created_at: DateTime
  created_at_unset: Boolean
  date_modified_unset: Boolean
}

input CandidateEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input CandidateClassification_similarityUpdateInput {
  classification_unset: Boolean
  similarity: Float
  similarity_unset: Boolean
  similarity_inc: Float
  classification: String
}

type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}

input TaxaField_listComplete_fromUpdateInput {
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
}

type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input RisksInput {
  tags: [String]
}

input UpdateOneReportTranslationInput {
  text: String!
  title: String!
  language: String!
  plain_text: String!
  report_number: Int!
}

input CreateDefaultAdminUserInput {
  email: String
  password: String
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

input ReportUserRelationInput {
  create: UserInsertInput
  link: String
}

input Entity_relationshipInsertInput {
  is_symmetric: Boolean
  obj: Entity_relationshipObjRelationInput!
  pred: String!
  sub: Entity_relationshipSubRelationInput!
  _id: ObjectId
  created_at: DateTime
}

input IncidentEmbeddingUpdateInput {
  vector_unset: Boolean
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
}

input LinkReportsToIncidentsInput {
  incident_ids: [Int]
  report_numbers: [Int]
}

enum ClassificationSortByInput {
  _ID_ASC
  _ID_DESC
  NAMESPACE_ASC
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
}

type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}

input CandidateClassification_similarityInsertInput {
  similarity: Float
  classification: String
}

input ChecklistRiskUpdateInput {
  id: String
  precedents: [ChecklistRiskPrecedentUpdateInput]
  tags: [String]
  title: String
  risk_notes: String
  risk_notes_unset: Boolean
  generated_unset: Boolean
  precedents_unset: Boolean
  generated: Boolean
  severity: String
  touched_unset: Boolean
  risk_status: String
  title_unset: Boolean
  severity_unset: Boolean
  tags_unset: Boolean
  touched: Boolean
  likelihood_unset: Boolean
  likelihood: String
  risk_status_unset: Boolean
  id_unset: Boolean
}

type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
}

type IncidentTsne {
  x: Float
  y: Float
}

input Entity_relationshipQueryInput {
  _id_gte: ObjectId
  _id_nin: [ObjectId]
  pred_lt: String
  _id_ne: ObjectId
  is_symmetric_ne: Boolean
  pred_in: [String]
  created_at_lt: DateTime
  created_at_gt: DateTime
  created_at_exists: Boolean
  is_symmetric: Boolean
  obj_exists: Boolean
  pred_ne: String
  sub_exists: Boolean
  obj: EntityQueryInput
  pred_nin: [String]
  pred_lte: String
  sub: EntityQueryInput
  pred_gt: String
  _id: ObjectId
  created_at_gte: DateTime
  _id_in: [ObjectId]
  created_at: DateTime
  created_at_nin: [DateTime]
  _id_exists: Boolean
  created_at_lte: DateTime
  _id_gt: ObjectId
  created_at_ne: DateTime
  is_symmetric_exists: Boolean
  OR: [Entity_relationshipQueryInput!]
  pred: String
  pred_exists: Boolean
  AND: [Entity_relationshipQueryInput!]
  pred_gte: String
  _id_lt: ObjectId
  created_at_in: [DateTime]
  _id_lte: ObjectId
}

input TaxaField_listComplete_fromQueryInput {
  all_nin: [String]
  current_in: [String]
  all_in: [String]
  all_exists: Boolean
  current: [String]
  current_nin: [String]
  current_exists: Boolean
  AND: [TaxaField_listComplete_fromQueryInput!]
  all: [String]
  OR: [TaxaField_listComplete_fromQueryInput!]
}

enum DuplicateSortByInput {
  _ID_ASC
  _ID_DESC
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
}

input ReportEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input CandidateInsertInput {
  date_published: String
  url: String!
  plain_text: String
  text: String
  embedding: CandidateEmbeddingInsertInput
  matching_harm_keywords: [String]
  authors: [String]
  image_url: String
  classification_similarity: [CandidateClassification_similarityInsertInput]
  match: Boolean!
  title: String
  epoch_date_published: Int
  matching_entities: [String]
  matching_keywords: [String]
  date_downloaded: String
  source_domain: String
  dismissed: Boolean
  _id: ObjectId
  epoch_date_downloaded: Int
  language: String
  similarity: Float
}

input ClassificationUpdateInput {
  reports: ClassificationReportsRelationInput
  attributes: [ClassificationAttributeUpdateInput]
  incidents_unset: Boolean
  notes: String
  incidents: ClassificationIncidentsRelationInput
  publish_unset: Boolean
  namespace_unset: Boolean
  attributes_unset: Boolean
  reports_unset: Boolean
  notes_unset: Boolean
  namespace: String
  _id: ObjectId
  _id_unset: Boolean
  publish: Boolean
}

input IncidentQueryInput {
  nlp_similar_incidents_exists: Boolean
  date_lt: String
  epoch_date_modified_exists: Boolean
  date_in: [String]
  incident_id_exists: Boolean
  description_exists: Boolean
  title: String
  editors: [UserQueryInput]
  incident_id_gte: Int
  incident_id_lte: Int
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  reports_in: [ReportQueryInput]
  tsne: IncidentTsneQueryInput
  editor_notes_lt: String
  incident_id_gt: Int
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  editor_notes_exists: Boolean
  _id_exists: Boolean
  title_in: [String]
  editor_similar_incidents_exists: Boolean
  flagged_dissimilar_incidents: [Int]
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  editor_dissimilar_incidents_in: [Int]
  incident_id: Int
  epoch_date_modified_gt: Int
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  title_nin: [String]
  incident_id_in: [Int]
  title_lt: String
  _id_lte: ObjectId
  title_lte: String
  description_lte: String
  editor_dissimilar_incidents_exists: Boolean
  editor_notes_in: [String]
  editor_notes_gt: String
  embedding: IncidentEmbeddingQueryInput
  flagged_dissimilar_incidents_nin: [Int]
  reports: [ReportQueryInput]
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  _id_nin: [ObjectId]
  title_exists: Boolean
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  editor_dissimilar_incidents_nin: [Int]
  title_gt: String
  epoch_date_modified_nin: [Int]
  description: String
  editors_in: [UserQueryInput]
  incident_id_ne: Int
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  editor_similar_incidents: [Int]
  _id_gte: ObjectId
  editor_similar_incidents_nin: [Int]
  embedding_exists: Boolean
  editor_notes_nin: [String]
  OR: [IncidentQueryInput!]
  editors_exists: Boolean
  _id: ObjectId
  _id_gt: ObjectId
  description_ne: String
  _id_ne: ObjectId
  editor_dissimilar_incidents: [Int]
  date_gt: String
  description_gt: String
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  editor_notes_lte: String
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  description_in: [String]
  editors_nin: [UserQueryInput]
  epoch_date_modified_gte: Int
  title_ne: String
  description_gte: String
  reports_nin: [ReportQueryInput]
  editor_notes: String
  editor_similar_incidents_in: [Int]
  AllegedDeveloperOfAISystem_exists: Boolean
  epoch_date_modified_ne: Int
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  date_gte: String
  title_gte: String
  epoch_date_modified_lt: Int
  AND: [IncidentQueryInput!]
  incident_id_nin: [Int]
  incident_id_lt: Int
  date_lte: String
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  date_exists: Boolean
  date_ne: String
  editor_notes_ne: String
  flagged_dissimilar_incidents_exists: Boolean
  flagged_dissimilar_incidents_in: [Int]
  epoch_date_modified_lte: Int
  epoch_date_modified_in: [Int]
  _id_lt: ObjectId
  tsne_exists: Boolean
  _id_in: [ObjectId]
  date: String
  epoch_date_modified: Int
  AllegedDeployerOfAISystem: [EntityQueryInput]
  reports_exists: Boolean
  AllegedDeployerOfAISystem_exists: Boolean
  editor_notes_gte: String
  description_nin: [String]
  date_nin: [String]
  description_lt: String
}

input ChecklistRiskPrecedentUpdateInput {
  title_unset: Boolean
  incident_id_inc: Int
  tags_unset: Boolean
  tags: [String]
  description_unset: Boolean
  title: String
  incident_id: Int
  incident_id_unset: Boolean
  description: String
}

input NotificationUpdateInput {
  _id_unset: Boolean
  userId_unset: Boolean
  _id: ObjectId
  incident_id: Int
  processed_unset: Boolean
  type: String
  type_unset: Boolean
  incident_id_inc: Int
  processed: Boolean
  sentDate: DateTime
  sentDate_unset: Boolean
  incident_id_unset: Boolean
  userId: NotificationUserIdRelationInput
}

input History_incidentInsertInput {
  title: String!
  editor_dissimilar_incidents: [Int]
  incident_id: Int!
  modifiedBy: String
  date: String!
  editor_notes: String
  AllegedHarmedOrNearlyHarmedParties: [String]
  AllegedDeveloperOfAISystem: [String]
  description: String
  embedding: History_incidentEmbeddingInsertInput
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  flagged_dissimilar_incidents: [Int]
  editor_similar_incidents: [Int]
  _id: ObjectId
  epoch_date_modified: Int
  reports: [Int]!
  tsne: History_incidentTsneInsertInput
  AllegedDeployerOfAISystem: [String]
  editors: [String]!
}

input SubmissionNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input TaxaField_listItem_fieldQueryInput {
  placeholder_in: [String]
  weight_in: [Int]
  instant_facet: Boolean
  long_description_ne: String
  weight_gte: Int
  display_type_exists: Boolean
  public_ne: Boolean
  AND: [TaxaField_listItem_fieldQueryInput!]
  short_name_lt: String
  weight_exists: Boolean
  field_number_nin: [String]
  display_type: String
  placeholder_lt: String
  permitted_values_exists: Boolean
  display_type_lt: String
  field_number_gt: String
  short_name_gt: String
  required_exists: Boolean
  display_type_lte: String
  display_type_ne: String
  long_description_in: [String]
  long_name_lt: String
  complete_from_exists: Boolean
  placeholder_nin: [String]
  short_name: String
  weight_lt: Int
  short_description_lte: String
  mongo_type_nin: [String]
  display_type_gt: String
  mongo_type_ne: String
  mongo_type_exists: Boolean
  mongo_type_in: [String]
  field_number_in: [String]
  mongo_type_gte: String
  mongo_type_gt: String
  long_description_exists: Boolean
  display_type_in: [String]
  short_description_ne: String
  short_name_gte: String
  mongo_type: String
  long_name_gte: String
  field_number_ne: String
  OR: [TaxaField_listItem_fieldQueryInput!]
  weight_lte: Int
  default_ne: String
  long_name_gt: String
  weight: Int
  default_lte: String
  long_description: String
  instant_facet_exists: Boolean
  placeholder: String
  placeholder_exists: Boolean
  long_description_lte: String
  long_name_in: [String]
  short_description_gt: String
  short_description: String
  weight_ne: Int
  long_name: String
  field_number_lte: String
  default: String
  short_description_exists: Boolean
  default_exists: Boolean
  short_name_exists: Boolean
  permitted_values_nin: [String]
  placeholder_lte: String
  field_number_lt: String
  placeholder_ne: String
  field_number_exists: Boolean
  short_description_lt: String
  long_description_gte: String
  default_gte: String
  long_description_lt: String
  required: Boolean
  public_exists: Boolean
  permitted_values: [String]
  short_description_nin: [String]
  short_description_in: [String]
  field_number: String
  weight_nin: [Int]
  long_description_nin: [String]
  long_description_gt: String
  display_type_nin: [String]
  short_name_ne: String
  instant_facet_ne: Boolean
  long_name_nin: [String]
  default_in: [String]
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  placeholder_gt: String
  placeholder_gte: String
  long_name_exists: Boolean
  required_ne: Boolean
  display_type_gte: String
  default_lt: String
  short_name_nin: [String]
  weight_gt: Int
  long_name_lte: String
  short_description_gte: String
  default_gt: String
  mongo_type_lt: String
  field_number_gte: String
  long_name_ne: String
  short_name_in: [String]
  mongo_type_lte: String
  public: Boolean
  permitted_values_in: [String]
  default_nin: [String]
  short_name_lte: String
}

input IncidentAllegedDeveloperOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
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

type Query {
  candidate(query: CandidateQueryInput): Candidate
  candidates(limit: Int = 100, sortBy: CandidateSortByInput, query: CandidateQueryInput): [Candidate]!
  checklist(query: ChecklistQueryInput): Checklist
  checklists(query: ChecklistQueryInput, limit: Int = 100, sortBy: ChecklistSortByInput): [Checklist]!
  classification(query: ClassificationQueryInput): Classification
  classifications(query: ClassificationQueryInput, limit: Int = 100, sortBy: ClassificationSortByInput): [Classification]!
  duplicate(query: DuplicateQueryInput): Duplicate
  duplicates(limit: Int = 100, sortBy: DuplicateSortByInput, query: DuplicateQueryInput): [Duplicate]!
  entities(query: EntityQueryInput, limit: Int = 100, sortBy: EntitySortByInput): [Entity]!
  entity(query: EntityQueryInput): Entity
  entity_relationship(query: Entity_relationshipQueryInput): Entity_relationship
  entity_relationships(sortBy: Entity_relationshipSortByInput, query: Entity_relationshipQueryInput, limit: Int = 100): [Entity_relationship]!
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
  taxas(limit: Int = 100, sortBy: TaxaSortByInput, query: TaxaQueryInput): [Taxa]!
  user(query: UserQueryInput): User
  users(query: UserQueryInput, limit: Int = 100, sortBy: UserSortByInput): [User]!
}

input IncidentInsertInput {
  tsne: IncidentTsneInsertInput
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  embedding: IncidentEmbeddingInsertInput
  flagged_dissimilar_incidents: [Int]
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  editor_similar_incidents: [Int]
  _id: ObjectId
  epoch_date_modified: Int
  description: String
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  editor_notes: String
  editors: IncidentEditorsRelationInput!
  date: String!
  title: String!
  reports: IncidentReportsRelationInput!
  incident_id: Int!
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  editor_dissimilar_incidents: [Int]
}

input UserUpdateInput {
  userId: String
  userId_unset: Boolean
  _id: ObjectId
  last_name: String
  roles_unset: Boolean
  first_name: String
  first_name_unset: Boolean
  roles: [String]
  last_name_unset: Boolean
  _id_unset: Boolean
}

input ClassificationInsertInput {
  notes: String
  publish: Boolean
  reports: ClassificationReportsRelationInput!
  _id: ObjectId
  attributes: [ClassificationAttributeInsertInput]
  incidents: ClassificationIncidentsRelationInput!
  namespace: String!
}

input TaxaUpdateInput {
  namespace: String
  field_list_unset: Boolean
  field_list: [TaxaField_listUpdateInput]
  dummy_fields_unset: Boolean
  _id: ObjectId
  complete_entities: Boolean
  _id_unset: Boolean
  complete_entities_unset: Boolean
  weight_unset: Boolean
  description: String
  description_unset: Boolean
  weight_inc: Int
  namespace_unset: Boolean
  dummy_fields: [TaxaDummy_fieldUpdateInput]
  weight: Int
}

input ClassificationAttributeQueryInput {
  short_name_ne: String
  short_name_lt: String
  value_json: String
  short_name_exists: Boolean
  OR: [ClassificationAttributeQueryInput!]
  short_name_in: [String]
  short_name: String
  short_name_lte: String
  short_name_gte: String
  value_json_in: [String]
  value_json_lte: String
  AND: [ClassificationAttributeQueryInput!]
  value_json_ne: String
  value_json_gt: String
  value_json_gte: String
  value_json_nin: [String]
  short_name_nin: [String]
  short_name_gt: String
  value_json_lt: String
  value_json_exists: Boolean
}

input TaxaField_listQueryInput {
  long_description_gte: String
  field_number_gt: String
  long_name: String
  instant_facet_exists: Boolean
  mongo_type_ne: String
  short_name_nin: [String]
  short_description_in: [String]
  short_description_lt: String
  permitted_values: [String]
  weight_gt: Int
  long_description_in: [String]
  permitted_values_in: [String]
  AND: [TaxaField_listQueryInput!]
  short_description_lte: String
  placeholder_lte: String
  default_lt: String
  field_number_in: [String]
  default_gte: String
  weight: Int
  long_name_gt: String
  hide_search_ne: Boolean
  long_description_lt: String
  field_number_exists: Boolean
  field_number_ne: String
  complete_from: TaxaField_listComplete_fromQueryInput
  field_number_nin: [String]
  required_ne: Boolean
  mongo_type_gte: String
  public: Boolean
  long_name_nin: [String]
  display_type_ne: String
  required_exists: Boolean
  long_name_ne: String
  placeholder_ne: String
  weight_lte: Int
  weight_gte: Int
  short_name: String
  weight_lt: Int
  hide_search: Boolean
  default_nin: [String]
  short_name_lte: String
  required: Boolean
  long_name_exists: Boolean
  long_name_lt: String
  hide_search_exists: Boolean
  mongo_type: String
  default_gt: String
  mongo_type_nin: [String]
  permitted_values_exists: Boolean
  display_type: String
  instant_facet: Boolean
  display_type_lte: String
  weight_nin: [Int]
  placeholder_in: [String]
  weight_exists: Boolean
  permitted_values_nin: [String]
  default_ne: String
  default: String
  long_description_lte: String
  placeholder_exists: Boolean
  field_number_lt: String
  short_name_lt: String
  short_name_gt: String
  placeholder_nin: [String]
  short_description_gte: String
  display_type_gte: String
  long_description: String
  short_name_in: [String]
  placeholder_gt: String
  short_description: String
  display_type_in: [String]
  display_type_exists: Boolean
  item_fields: TaxaField_listItem_fieldQueryInput
  item_fields_exists: Boolean
  public_ne: Boolean
  long_description_nin: [String]
  display_type_lt: String
  mongo_type_gt: String
  placeholder_lt: String
  mongo_type_in: [String]
  display_type_nin: [String]
  mongo_type_lte: String
  default_exists: Boolean
  field_number_gte: String
  long_description_ne: String
  default_in: [String]
  instant_facet_ne: Boolean
  long_name_gte: String
  placeholder: String
  weight_in: [Int]
  default_lte: String
  mongo_type_exists: Boolean
  complete_from_exists: Boolean
  short_name_gte: String
  short_description_nin: [String]
  placeholder_gte: String
  short_name_ne: String
  display_type_gt: String
  long_description_gt: String
  OR: [TaxaField_listQueryInput!]
  weight_ne: Int
  long_description_exists: Boolean
  field_number_lte: String
  long_name_lte: String
  field_number: String
  mongo_type_lt: String
  short_description_exists: Boolean
  public_exists: Boolean
  short_description_ne: String
  long_name_in: [String]
  short_description_gt: String
  short_name_exists: Boolean
}

enum ReportSortByInput {
  EDITOR_NOTES_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  REPORT_NUMBER_DESC
  EPOCH_DATE_SUBMITTED_DESC
  IMAGE_URL_ASC
  PLAIN_TEXT_ASC
  _ID_ASC
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  TEXT_ASC
  URL_ASC
  URL_DESC
  IMAGE_URL_DESC
  TITLE_DESC
  CLOUDINARY_ID_ASC
  DATE_PUBLISHED_ASC
  EPOCH_DATE_MODIFIED_ASC
  LANGUAGE_DESC
  TEXT_DESC
  DATE_DOWNLOADED_DESC
  DESCRIPTION_ASC
  REPORT_NUMBER_ASC
  USER_ASC
  USER_DESC
  DATE_DOWNLOADED_ASC
  DATE_SUBMITTED_ASC
  DESCRIPTION_DESC
  PLAIN_TEXT_DESC
  SOURCE_DOMAIN_DESC
  _ID_DESC
  CLOUDINARY_ID_DESC
  DATE_SUBMITTED_DESC
  LANGUAGE_ASC
  TITLE_ASC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_SUBMITTED_ASC
  SOURCE_DOMAIN_ASC
}

input Entity_relationshipSubRelationInput {
  create: EntityInsertInput
  link: String
}

input SubmissionUpdateInput {
  url_unset: Boolean
  _id_unset: Boolean
  editor_dissimilar_incidents: [Int]
  embedding_unset: Boolean
  date_submitted_unset: Boolean
  cloudinary_id_unset: Boolean
  embedding: SubmissionEmbeddingUpdateInput
  incident_ids_unset: Boolean
  incident_title: String
  source_domain_unset: Boolean
  date_published: String
  language_unset: Boolean
  incident_date: String
  url: String
  nlp_similar_incidents_unset: Boolean
  status: String
  language: String
  image_url: String
  description_unset: Boolean
  title_unset: Boolean
  authors_unset: Boolean
  plain_text_unset: Boolean
  text_unset: Boolean
  submitters_unset: Boolean
  authors: [String]
  date_downloaded: String
  incident_title_unset: Boolean
  date_modified_unset: Boolean
  quiet: Boolean
  plain_text: String
  harmed_parties: SubmissionHarmed_partiesRelationInput
  deployers_unset: Boolean
  editor_notes_unset: Boolean
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  quiet_unset: Boolean
  text: String
  cloudinary_id: String
  date_downloaded_unset: Boolean
  editor_similar_incidents_unset: Boolean
  source_domain: String
  developers_unset: Boolean
  tags: [String]
  user: SubmissionUserRelationInput
  incident_date_unset: Boolean
  description: String
  incident_editors_unset: Boolean
  developers: SubmissionDevelopersRelationInput
  epoch_date_modified_unset: Boolean
  status_unset: Boolean
  deployers: SubmissionDeployersRelationInput
  editor_similar_incidents: [Int]
  submitters: [String]
  image_url_unset: Boolean
  epoch_date_modified: Int
  date_modified: String
  editor_dissimilar_incidents_unset: Boolean
  user_unset: Boolean
  date_published_unset: Boolean
  editor_notes: String
  tags_unset: Boolean
  title: String
  incident_ids: [Int]
  incident_editors: SubmissionIncident_editorsRelationInput
  harmed_parties_unset: Boolean
  _id: ObjectId
  epoch_date_modified_inc: Int
  date_submitted: String
}

input IncidentEmbeddingInsertInput {
  vector: [Float]
  from_reports: [Int]
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

input TaxaField_listItem_fieldInsertInput {
  long_description: String
  field_number: String
  mongo_type: String
  default: String
  weight: Int
  long_name: String
  short_description: String
  public: Boolean
  short_name: String
  display_type: String
  instant_facet: Boolean
  placeholder: String
  required: Boolean
  permitted_values: [String]
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
}

input ReportQueryInput {
  url_gte: String
  submitters_exists: Boolean
  epoch_date_modified_lte: Int
  text_exists: Boolean
  date_modified_gte: DateTime
  plain_text_ne: String
  image_url_lt: String
  inputs_outputs: [String]
  flag_ne: Boolean
  title_exists: Boolean
  _id_lte: ObjectId
  image_url_exists: Boolean
  text_in: [String]
  date_submitted: DateTime
  title_ne: String
  AND: [ReportQueryInput!]
  epoch_date_modified_lt: Int
  date_downloaded_nin: [DateTime]
  report_number_lte: Int
  inputs_outputs_exists: Boolean
  language_nin: [String]
  user_exists: Boolean
  report_number_gte: Int
  date_submitted_nin: [DateTime]
  _id_gte: ObjectId
  epoch_date_downloaded_exists: Boolean
  date_modified_ne: DateTime
  tags_in: [String]
  plain_text_gte: String
  flag: Boolean
  text_gte: String
  date_modified: DateTime
  cloudinary_id_gte: String
  editor_notes_lt: String
  epoch_date_published_in: [Int]
  date_published_lt: DateTime
  plain_text_lte: String
  description_lt: String
  epoch_date_submitted_lte: Int
  epoch_date_modified_in: [Int]
  epoch_date_submitted_ne: Int
  date_published: DateTime
  cloudinary_id_gt: String
  date_submitted_gt: DateTime
  source_domain_in: [String]
  submitters_nin: [String]
  epoch_date_published: Int
  image_url_gt: String
  text_ne: String
  date_downloaded_lt: DateTime
  url_exists: Boolean
  language: String
  cloudinary_id_lt: String
  description_exists: Boolean
  editor_notes_lte: String
  epoch_date_submitted_in: [Int]
  epoch_date_published_lte: Int
  date_published_gt: DateTime
  text_nin: [String]
  date_modified_in: [DateTime]
  image_url_in: [String]
  inputs_outputs_in: [String]
  date_modified_lte: DateTime
  title_nin: [String]
  editor_notes_exists: Boolean
  epoch_date_published_exists: Boolean
  epoch_date_published_gt: Int
  embedding_exists: Boolean
  source_domain_gte: String
  plain_text_in: [String]
  tags: [String]
  title_gt: String
  embedding: ReportEmbeddingQueryInput
  date_downloaded_lte: DateTime
  title_lte: String
  user: UserQueryInput
  editor_notes: String
  plain_text_nin: [String]
  text_gt: String
  epoch_date_submitted_gte: Int
  _id_nin: [ObjectId]
  tags_nin: [String]
  image_url_ne: String
  authors_nin: [String]
  date_submitted_in: [DateTime]
  date_downloaded_gt: DateTime
  epoch_date_submitted: Int
  epoch_date_downloaded: Int
  epoch_date_modified_gte: Int
  text_lt: String
  title: String
  _id_exists: Boolean
  epoch_date_modified: Int
  date_published_in: [DateTime]
  date_submitted_ne: DateTime
  url_nin: [String]
  language_gte: String
  date_downloaded_gte: DateTime
  date_submitted_lt: DateTime
  date_submitted_lte: DateTime
  epoch_date_downloaded_in: [Int]
  url_gt: String
  language_lt: String
  cloudinary_id_lte: String
  authors_exists: Boolean
  epoch_date_published_nin: [Int]
  epoch_date_published_gte: Int
  report_number_lt: Int
  report_number_gt: Int
  description_nin: [String]
  epoch_date_downloaded_gt: Int
  epoch_date_downloaded_gte: Int
  epoch_date_submitted_exists: Boolean
  inputs_outputs_nin: [String]
  epoch_date_modified_ne: Int
  language_lte: String
  epoch_date_submitted_gt: Int
  description_in: [String]
  plain_text: String
  flag_exists: Boolean
  cloudinary_id_in: [String]
  date_modified_nin: [DateTime]
  language_gt: String
  plain_text_exists: Boolean
  epoch_date_submitted_lt: Int
  title_gte: String
  quiet_exists: Boolean
  date_downloaded_exists: Boolean
  date_published_lte: DateTime
  epoch_date_downloaded_nin: [Int]
  cloudinary_id: String
  _id: ObjectId
  is_incident_report_exists: Boolean
  date_submitted_gte: DateTime
  date_submitted_exists: Boolean
  text_lte: String
  is_incident_report: Boolean
  source_domain_lt: String
  url_lt: String
  is_incident_report_ne: Boolean
  report_number_exists: Boolean
  url_ne: String
  description_lte: String
  source_domain_ne: String
  quiet_ne: Boolean
  description_gt: String
  submitters: [String]
  epoch_date_published_ne: Int
  report_number_ne: Int
  date_published_nin: [DateTime]
  date_modified_gt: DateTime
  source_domain_exists: Boolean
  date_modified_exists: Boolean
  url: String
  report_number_in: [Int]
  authors: [String]
  url_in: [String]
  epoch_date_submitted_nin: [Int]
  text: String
  date_published_ne: DateTime
  editor_notes_in: [String]
  date_downloaded_in: [DateTime]
  plain_text_gt: String
  description_ne: String
  title_in: [String]
  title_lt: String
  epoch_date_published_lt: Int
  epoch_date_modified_gt: Int
  OR: [ReportQueryInput!]
  language_exists: Boolean
  editor_notes_ne: String
  source_domain: String
  quiet: Boolean
  description_gte: String
  date_downloaded_ne: DateTime
  date_published_exists: Boolean
  cloudinary_id_exists: Boolean
  language_ne: String
  editor_notes_gt: String
  authors_in: [String]
  source_domain_nin: [String]
  report_number: Int
  tags_exists: Boolean
  epoch_date_modified_nin: [Int]
  image_url_lte: String
  epoch_date_downloaded_lt: Int
  source_domain_lte: String
  editor_notes_nin: [String]
  submitters_in: [String]
  source_domain_gt: String
  image_url_nin: [String]
  date_published_gte: DateTime
  image_url_gte: String
  language_in: [String]
  plain_text_lt: String
  _id_lt: ObjectId
  epoch_date_downloaded_ne: Int
  cloudinary_id_nin: [String]
  description: String
  date_downloaded: DateTime
  editor_notes_gte: String
  image_url: String
  report_number_nin: [Int]
  _id_in: [ObjectId]
  epoch_date_downloaded_lte: Int
  _id_ne: ObjectId
  date_modified_lt: DateTime
  _id_gt: ObjectId
  url_lte: String
  epoch_date_modified_exists: Boolean
  cloudinary_id_ne: String
}

scalar DateTime

type History_incidentTsne {
  x: Float
  y: Float
}

input UserInsertInput {
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

input CandidateUpdateInput {
  plain_text_unset: Boolean
  similarity: Float
  _id: ObjectId
  epoch_date_published_unset: Boolean
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  date_published_unset: Boolean
  _id_unset: Boolean
  embedding_unset: Boolean
  matching_entities: [String]
  url_unset: Boolean
  matching_entities_unset: Boolean
  epoch_date_published: Int
  match_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  epoch_date_published_inc: Int
  text: String
  plain_text: String
  title_unset: Boolean
  embedding: CandidateEmbeddingUpdateInput
  epoch_date_downloaded: Int
  similarity_inc: Float
  dismissed_unset: Boolean
  matching_keywords: [String]
  dismissed: Boolean
  classification_similarity_unset: Boolean
  url: String
  matching_harm_keywords: [String]
  title: String
  source_domain_unset: Boolean
  language: String
  matching_keywords_unset: Boolean
  language_unset: Boolean
  image_url_unset: Boolean
  text_unset: Boolean
  matching_harm_keywords_unset: Boolean
  similarity_unset: Boolean
  authors: [String]
  date_downloaded: String
  image_url: String
  epoch_date_downloaded_inc: Int
  date_downloaded_unset: Boolean
  match: Boolean
  date_published: String
  source_domain: String
  authors_unset: Boolean
}

input TaxaField_listItem_fieldUpdateInput {
  required_unset: Boolean
  long_name_unset: Boolean
  display_type: String
  default: String
  default_unset: Boolean
  weight_inc: Int
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  instant_facet: Boolean
  mongo_type: String
  weight_unset: Boolean
  long_name: String
  long_description: String
  permitted_values: [String]
  field_number_unset: Boolean
  placeholder: String
  short_description_unset: Boolean
  placeholder_unset: Boolean
  short_name_unset: Boolean
  display_type_unset: Boolean
  weight: Int
  public_unset: Boolean
  short_name: String
  permitted_values_unset: Boolean
  public: Boolean
  short_description: String
  complete_from_unset: Boolean
  mongo_type_unset: Boolean
  long_description_unset: Boolean
  required: Boolean
  field_number: String
  instant_facet_unset: Boolean
}

type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input ChecklistRiskInsertInput {
  risk_notes: String
  tags: [String]
  touched: Boolean
  precedents: [ChecklistRiskPrecedentInsertInput]
  severity: String
  title: String
  generated: Boolean
  risk_status: String
  id: String
  likelihood: String
}

input SubmissionEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input DuplicateQueryInput {
  true_incident_number_lte: Int
  OR: [DuplicateQueryInput!]
  true_incident_number_in: [Int]
  duplicate_incident_number_gte: Int
  duplicate_incident_number_nin: [Int]
  true_incident_number_nin: [Int]
  _id_gte: ObjectId
  duplicate_incident_number_gt: Int
  _id_lt: ObjectId
  duplicate_incident_number_ne: Int
  _id_ne: ObjectId
  _id_gt: ObjectId
  _id: ObjectId
  duplicate_incident_number_exists: Boolean
  true_incident_number_ne: Int
  true_incident_number_exists: Boolean
  true_incident_number_gt: Int
  _id_in: [ObjectId]
  duplicate_incident_number: Int
  _id_exists: Boolean
  AND: [DuplicateQueryInput!]
  duplicate_incident_number_lte: Int
  duplicate_incident_number_in: [Int]
  true_incident_number: Int
  true_incident_number_gte: Int
  _id_lte: ObjectId
  true_incident_number_lt: Int
  _id_nin: [ObjectId]
  duplicate_incident_number_lt: Int
}

input History_reportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

type Entity {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}

enum SubmissionSortByInput {
  INCIDENT_DATE_DESC
  INCIDENT_TITLE_DESC
  LANGUAGE_DESC
  PLAIN_TEXT_DESC
  SOURCE_DOMAIN_DESC
  DATE_DOWNLOADED_DESC
  DATE_SUBMITTED_ASC
  DESCRIPTION_ASC
  USER_ASC
  USER_DESC
  SOURCE_DOMAIN_ASC
  TEXT_ASC
  _ID_DESC
  CLOUDINARY_ID_DESC
  DATE_PUBLISHED_DESC
  CLOUDINARY_ID_ASC
  EDITOR_NOTES_DESC
  URL_ASC
  DATE_SUBMITTED_DESC
  EDITOR_NOTES_ASC
  PLAIN_TEXT_ASC
  TITLE_ASC
  URL_DESC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_ASC
  IMAGE_URL_DESC
  STATUS_ASC
  DATE_PUBLISHED_ASC
  DESCRIPTION_DESC
  LANGUAGE_ASC
  INCIDENT_DATE_ASC
  INCIDENT_TITLE_ASC
  TITLE_DESC
  DATE_MODIFIED_DESC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_DESC
  TEXT_DESC
  _ID_ASC
  IMAGE_URL_ASC
  STATUS_DESC
}

type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}

input DuplicateUpdateInput {
  true_incident_number_inc: Int
  true_incident_number_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  duplicate_incident_number: Int
  duplicate_incident_number_inc: Int
  duplicate_incident_number_unset: Boolean
  true_incident_number: Int
}

input History_incidentNlp_similar_incidentQueryInput {
  similarity_in: [Float]
  similarity: Float
  incident_id_ne: Int
  similarity_nin: [Float]
  similarity_exists: Boolean
  incident_id_gt: Int
  incident_id: Int
  incident_id_nin: [Int]
  incident_id_exists: Boolean
  incident_id_in: [Int]
  incident_id_lte: Int
  incident_id_lt: Int
  similarity_ne: Float
  similarity_gte: Float
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  similarity_gt: Float
  similarity_lte: Float
  similarity_lt: Float
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_gte: Int
}

type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

input IncidentTsneInsertInput {
  x: Float
  y: Float
}

input TaxaField_listItem_fieldComplete_fromQueryInput {
  current_in: [String]
  entities: Boolean
  all_in: [String]
  entities_exists: Boolean
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all_exists: Boolean
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  current: [String]
  all: [String]
  all_nin: [String]
  current_nin: [String]
  current_exists: Boolean
  entities_ne: Boolean
}

type TaxaField_listComplete_from {
  all: [String]
  current: [String]
}

scalar Long

input ChecklistRiskPrecedentQueryInput {
  incident_id_exists: Boolean
  description_lt: String
  incident_id_ne: Int
  description_nin: [String]
  description_exists: Boolean
  description_ne: String
  AND: [ChecklistRiskPrecedentQueryInput!]
  incident_id_gte: Int
  tags_in: [String]
  tags_nin: [String]
  description_in: [String]
  title_lt: String
  incident_id_lte: Int
  description: String
  title_ne: String
  title_gt: String
  incident_id_gt: Int
  title: String
  description_lte: String
  title_nin: [String]
  title_exists: Boolean
  title_lte: String
  incident_id: Int
  OR: [ChecklistRiskPrecedentQueryInput!]
  incident_id_nin: [Int]
  incident_id_in: [Int]
  tags: [String]
  incident_id_lt: Int
  description_gte: String
  title_in: [String]
  description_gt: String
  tags_exists: Boolean
  title_gte: String
}

input ReportUpdateInput {
  flag_unset: Boolean
  submitters_unset: Boolean
  tags_unset: Boolean
  submitters: [String]
  plain_text_unset: Boolean
  quiet_unset: Boolean
  inputs_outputs: [String]
  report_number: Int
  epoch_date_downloaded: Int
  epoch_date_modified: Int
  epoch_date_modified_inc: Int
  epoch_date_published: Int
  epoch_date_published_unset: Boolean
  tags: [String]
  user_unset: Boolean
  source_domain_unset: Boolean
  _id: ObjectId
  authors: [String]
  report_number_inc: Int
  date_downloaded_unset: Boolean
  report_number_unset: Boolean
  editor_notes: String
  embedding_unset: Boolean
  image_url: String
  source_domain: String
  authors_unset: Boolean
  url: String
  cloudinary_id_unset: Boolean
  quiet: Boolean
  date_modified: DateTime
  date_downloaded: DateTime
  image_url_unset: Boolean
  user: ReportUserRelationInput
  date_submitted_unset: Boolean
  epoch_date_downloaded_inc: Int
  language: String
  is_incident_report_unset: Boolean
  is_incident_report: Boolean
  date_published_unset: Boolean
  epoch_date_published_inc: Int
  language_unset: Boolean
  text: String
  epoch_date_submitted_inc: Int
  cloudinary_id: String
  url_unset: Boolean
  _id_unset: Boolean
  date_published: DateTime
  description: String
  inputs_outputs_unset: Boolean
  description_unset: Boolean
  editor_notes_unset: Boolean
  date_modified_unset: Boolean
  epoch_date_submitted_unset: Boolean
  embedding: ReportEmbeddingUpdateInput
  flag: Boolean
  epoch_date_modified_unset: Boolean
  title: String
  text_unset: Boolean
  date_submitted: DateTime
  title_unset: Boolean
  epoch_date_submitted: Int
  plain_text: String
  epoch_date_downloaded_unset: Boolean
}

type LogIncidentHistoryPayload {
  incident_id: Int
}

type UserAdminDatum {
  creationDate: DateTime
  disabled: Boolean
  email: String
  lastAuthenticationDate: DateTime
}

input ChecklistInsertInput {
  _id: ObjectId
  date_updated: DateTime
  id: String
  owner_id: String
  tags_methods: [String]
  tags_other: [String]
  entity_id: String
  risks: [ChecklistRiskInsertInput]
  about: String
  date_created: DateTime
  name: String
  tags_goals: [String]
}

type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}

input ChecklistQueryInput {
  owner_id_gte: String
  tags_goals_in: [String]
  date_created_gt: DateTime
  tags_methods_in: [String]
  id_nin: [String]
  about_gt: String
  tags_methods: [String]
  about_ne: String
  about_in: [String]
  about_gte: String
  date_updated_lte: DateTime
  entity_id_lt: String
  date_updated_ne: DateTime
  tags_other_exists: Boolean
  id_lt: String
  entity_id_exists: Boolean
  date_updated_gte: DateTime
  date_updated_nin: [DateTime]
  AND: [ChecklistQueryInput!]
  date_created_gte: DateTime
  id_gte: String
  id_lte: String
  risks_exists: Boolean
  entity_id_gte: String
  date_created_ne: DateTime
  date_created: DateTime
  date_created_exists: Boolean
  name_in: [String]
  risks_nin: [ChecklistRiskQueryInput]
  date_updated: DateTime
  owner_id_exists: Boolean
  tags_other: [String]
  _id_gt: ObjectId
  _id: ObjectId
  about_nin: [String]
  date_updated_gt: DateTime
  about_lte: String
  id: String
  name_gte: String
  owner_id_in: [String]
  tags_goals_nin: [String]
  date_created_nin: [DateTime]
  entity_id_in: [String]
  tags_goals: [String]
  _id_nin: [ObjectId]
  entity_id_lte: String
  about_exists: Boolean
  entity_id_ne: String
  entity_id: String
  _id_in: [ObjectId]
  name_lte: String
  risks_in: [ChecklistRiskQueryInput]
  about: String
  owner_id_lte: String
  tags_goals_exists: Boolean
  OR: [ChecklistQueryInput!]
  owner_id_nin: [String]
  name_lt: String
  tags_methods_nin: [String]
  name_nin: [String]
  tags_other_nin: [String]
  _id_exists: Boolean
  about_lt: String
  _id_ne: ObjectId
  date_created_lt: DateTime
  date_updated_in: [DateTime]
  owner_id: String
  id_ne: String
  owner_id_ne: String
  name_gt: String
  date_created_lte: DateTime
  tags_methods_exists: Boolean
  _id_gte: ObjectId
  risks: [ChecklistRiskQueryInput]
  id_exists: Boolean
  id_gt: String
  _id_lte: ObjectId
  date_updated_lt: DateTime
  date_updated_exists: Boolean
  entity_id_gt: String
  entity_id_nin: [String]
  date_created_in: [DateTime]
  _id_lt: ObjectId
  name_exists: Boolean
  name_ne: String
  tags_other_in: [String]
  id_in: [String]
  owner_id_lt: String
  owner_id_gt: String
  name: String
}

input IncidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input CreateVariantInput {
  incidentId: Int
  variant: CreateVariantInputVariant
}

input ReportEmbeddingQueryInput {
  from_text_hash_gte: String
  from_text_hash_lt: String
  from_text_hash_nin: [String]
  vector_exists: Boolean
  from_text_hash_gt: String
  from_text_hash_exists: Boolean
  vector_nin: [Float]
  from_text_hash: String
  vector_in: [Float]
  OR: [ReportEmbeddingQueryInput!]
  from_text_hash_lte: String
  AND: [ReportEmbeddingQueryInput!]
  vector: [Float]
  from_text_hash_in: [String]
  from_text_hash_ne: String
}

type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}

scalar ObjectId

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

input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input TaxaField_listItem_fieldComplete_fromUpdateInput {
  current: [String]
  current_unset: Boolean
  entities: Boolean
  entities_unset: Boolean
  all: [String]
  all_unset: Boolean
}

input IncidentNlp_similar_incidentUpdateInput {
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
}

input SubmissionEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input History_incidentUpdateInput {
  date_unset: Boolean
  editors_unset: Boolean
  description_unset: Boolean
  modifiedBy_unset: Boolean
  modifiedBy: String
  _id_unset: Boolean
  editor_similar_incidents_unset: Boolean
  title: String
  incident_id_inc: Int
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  _id: ObjectId
  editor_notes: String
  editor_similar_incidents: [Int]
  flagged_dissimilar_incidents: [Int]
  epoch_date_modified_unset: Boolean
  incident_id_unset: Boolean
  epoch_date_modified: Int
  title_unset: Boolean
  editors: [String]
  tsne_unset: Boolean
  tsne: History_incidentTsneUpdateInput
  nlp_similar_incidents_unset: Boolean
  AllegedDeployerOfAISystem_unset: Boolean
  editor_dissimilar_incidents_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties: [String]
  AllegedDeveloperOfAISystem: [String]
  date: String
  editor_notes_unset: Boolean
  description: String
  embedding_unset: Boolean
  embedding: History_incidentEmbeddingUpdateInput
  editor_dissimilar_incidents: [Int]
  incident_id: Int
  AllegedDeployerOfAISystem: [String]
  epoch_date_modified_inc: Int
  reports_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  reports: [Int]
  AllegedDeveloperOfAISystem_unset: Boolean
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
  _ID_ASC
  _ID_DESC
  DATE_SUBMITTED_DESC
  SOURCE_DOMAIN_ASC
  SOURCE_DOMAIN_DESC
  URL_ASC
  URL_DESC
  DATE_SUBMITTED_ASC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
}

enum IncidentSortByInput {
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  TITLE_DESC
  _ID_ASC
  DATE_ASC
  DATE_DESC
  DESCRIPTION_ASC
  EDITOR_NOTES_DESC
  _ID_DESC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_ASC
  TITLE_ASC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_DESC
}

input ReportInsertInput {
  date_modified: DateTime!
  _id: ObjectId
  description: String
  title: String!
  text: String!
  authors: [String]!
  cloudinary_id: String!
  date_downloaded: DateTime!
  is_incident_report: Boolean
  url: String!
  submitters: [String]!
  quiet: Boolean
  epoch_date_downloaded: Int!
  plain_text: String!
  embedding: ReportEmbeddingInsertInput
  epoch_date_submitted: Int!
  epoch_date_modified: Int!
  language: String!
  image_url: String!
  report_number: Int!
  source_domain: String!
  date_submitted: DateTime!
  tags: [String]!
  epoch_date_published: Int!
  user: ReportUserRelationInput
  date_published: DateTime!
  inputs_outputs: [String]
  editor_notes: String
  flag: Boolean
}

input ChecklistUpdateInput {
  tags_other_unset: Boolean
  risks: [ChecklistRiskUpdateInput]
  name_unset: Boolean
  owner_id_unset: Boolean
  entity_id_unset: Boolean
  risks_unset: Boolean
  about_unset: Boolean
  entity_id: String
  id: String
  name: String
  tags_goals_unset: Boolean
  tags_goals: [String]
  date_created_unset: Boolean
  _id_unset: Boolean
  date_updated_unset: Boolean
  _id: ObjectId
  tags_other: [String]
  id_unset: Boolean
  tags_methods_unset: Boolean
  date_updated: DateTime
  tags_methods: [String]
  owner_id: String
  date_created: DateTime
  about: String
}

input SubmissionHarmed_partiesRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input ClassificationReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

input History_incidentEmbeddingQueryInput {
  from_reports_nin: [Int]
  from_reports_exists: Boolean
  vector_exists: Boolean
  vector_in: [Float]
  vector: [Float]
  from_reports_in: [Int]
  vector_nin: [Float]
  OR: [History_incidentEmbeddingQueryInput!]
  from_reports: [Int]
  AND: [History_incidentEmbeddingQueryInput!]
}

input SubmissionQueryInput {
  image_url_nin: [String]
  date_downloaded: String
  date_modified_exists: Boolean
  incident_date_lte: String
  date_downloaded_lte: String
  url_lte: String
  cloudinary_id_exists: Boolean
  date_submitted_lt: String
  incident_editors_exists: Boolean
  authors_in: [String]
  date_published_ne: String
  date_submitted_lte: String
  developers_in: [EntityQueryInput]
  nlp_similar_incidents_exists: Boolean
  harmed_parties_nin: [EntityQueryInput]
  editor_notes_gte: String
  epoch_date_modified_gt: Int
  text: String
  tags_exists: Boolean
  tags: [String]
  description_ne: String
  language_ne: String
  date_submitted_ne: String
  editor_similar_incidents: [Int]
  editor_dissimilar_incidents_in: [Int]
  _id_gte: ObjectId
  cloudinary_id: String
  date_published_lt: String
  editor_similar_incidents_exists: Boolean
  incident_title_gt: String
  _id_gt: ObjectId
  language_lt: String
  quiet_ne: Boolean
  source_domain_exists: Boolean
  incident_date_gt: String
  date_downloaded_in: [String]
  source_domain_in: [String]
  description_gte: String
  title_lte: String
  status_gte: String
  plain_text_lte: String
  url_lt: String
  submitters_exists: Boolean
  text_lte: String
  status_nin: [String]
  title_in: [String]
  url_nin: [String]
  developers_nin: [EntityQueryInput]
  _id_in: [ObjectId]
  status_ne: String
  cloudinary_id_lt: String
  image_url_lt: String
  epoch_date_modified_nin: [Int]
  editor_dissimilar_incidents_exists: Boolean
  source_domain_ne: String
  title_nin: [String]
  submitters_nin: [String]
  plain_text_gte: String
  date_modified_nin: [String]
  quiet: Boolean
  date_submitted_in: [String]
  language: String
  incident_title_ne: String
  description_in: [String]
  language_lte: String
  tags_nin: [String]
  cloudinary_id_gt: String
  incident_title_nin: [String]
  epoch_date_modified_lte: Int
  epoch_date_modified_lt: Int
  description_lt: String
  incident_date_exists: Boolean
  date_modified_lte: String
  editor_dissimilar_incidents_nin: [Int]
  text_nin: [String]
  status_lte: String
  editor_dissimilar_incidents: [Int]
  date_downloaded_gte: String
  date_published_gt: String
  date_published_in: [String]
  image_url_lte: String
  cloudinary_id_nin: [String]
  editor_notes_in: [String]
  epoch_date_modified_in: [Int]
  title: String
  plain_text: String
  harmed_parties_in: [EntityQueryInput]
  incident_date_ne: String
  title_ne: String
  incident_title_gte: String
  epoch_date_modified_exists: Boolean
  incident_ids_nin: [Int]
  description_gt: String
  status_in: [String]
  editor_notes_gt: String
  _id_lt: ObjectId
  date_published_lte: String
  source_domain: String
  incident_date_gte: String
  url: String
  description_nin: [String]
  plain_text_lt: String
  tags_in: [String]
  text_gt: String
  cloudinary_id_in: [String]
  incident_editors: [UserQueryInput]
  deployers_in: [EntityQueryInput]
  url_gte: String
  _id_exists: Boolean
  status_gt: String
  url_gt: String
  source_domain_gt: String
  title_exists: Boolean
  incident_date_in: [String]
  cloudinary_id_ne: String
  incident_title_exists: Boolean
  date_modified_in: [String]
  epoch_date_modified_gte: Int
  date_submitted_nin: [String]
  language_gte: String
  title_gt: String
  incident_ids_in: [Int]
  url_in: [String]
  editor_notes_lte: String
  description: String
  url_exists: Boolean
  date_downloaded_lt: String
  image_url_ne: String
  AND: [SubmissionQueryInput!]
  description_lte: String
  authors: [String]
  date_published: String
  language_gt: String
  incident_ids_exists: Boolean
  epoch_date_modified_ne: Int
  date_published_exists: Boolean
  plain_text_nin: [String]
  date_modified_ne: String
  text_lt: String
  authors_nin: [String]
  deployers: [EntityQueryInput]
  image_url: String
  harmed_parties_exists: Boolean
  _id_ne: ObjectId
  incident_title_lt: String
  embedding: SubmissionEmbeddingQueryInput
  plain_text_exists: Boolean
  title_gte: String
  source_domain_lt: String
  incident_title_in: [String]
  date_modified_lt: String
  editor_notes_nin: [String]
  text_exists: Boolean
  editor_similar_incidents_nin: [Int]
  incident_editors_in: [UserQueryInput]
  date_downloaded_exists: Boolean
  date_modified_gte: String
  text_gte: String
  incident_date_lt: String
  OR: [SubmissionQueryInput!]
  date_downloaded_ne: String
  incident_title_lte: String
  user: UserQueryInput
  date_submitted: String
  submitters: [String]
  incident_date: String
  editor_similar_incidents_in: [Int]
  developers_exists: Boolean
  date_modified_gt: String
  source_domain_lte: String
  description_exists: Boolean
  source_domain_gte: String
  image_url_gt: String
  cloudinary_id_gte: String
  language_in: [String]
  editor_notes_ne: String
  title_lt: String
  incident_title: String
  status_exists: Boolean
  image_url_in: [String]
  language_exists: Boolean
  date_downloaded_gt: String
  date_submitted_gt: String
  image_url_exists: Boolean
  deployers_exists: Boolean
  incident_ids: [Int]
  epoch_date_modified: Int
  _id_lte: ObjectId
  status_lt: String
  date_downloaded_nin: [String]
  text_in: [String]
  quiet_exists: Boolean
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  user_exists: Boolean
  plain_text_in: [String]
  language_nin: [String]
  harmed_parties: [EntityQueryInput]
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  editor_notes_lt: String
  plain_text_gt: String
  image_url_gte: String
  authors_exists: Boolean
  date_published_gte: String
  date_submitted_exists: Boolean
  incident_date_nin: [String]
  plain_text_ne: String
  submitters_in: [String]
  _id: ObjectId
  developers: [EntityQueryInput]
  deployers_nin: [EntityQueryInput]
  status: String
  incident_editors_nin: [UserQueryInput]
  embedding_exists: Boolean
  url_ne: String
  source_domain_nin: [String]
  editor_notes: String
  date_published_nin: [String]
  date_modified: String
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  editor_notes_exists: Boolean
  _id_nin: [ObjectId]
  cloudinary_id_lte: String
  text_ne: String
  date_submitted_gte: String
}

type RisksPayloadPrecedentNlp_similar_incident {
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

enum History_reportSortByInput {
  DATE_SUBMITTED_ASC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  PLAIN_TEXT_DESC
  REPORT_NUMBER_DESC
  SOURCE_DOMAIN_ASC
  CLOUDINARY_ID_DESC
  DATE_PUBLISHED_ASC
  SOURCE_DOMAIN_DESC
  EPOCH_DATE_PUBLISHED_DESC
  TEXT_DESC
  TITLE_ASC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_DESC
  URL_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  EPOCH_DATE_SUBMITTED_DESC
  IMAGE_URL_DESC
  PLAIN_TEXT_ASC
  URL_DESC
  USER_DESC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_MODIFIED_ASC
  LANGUAGE_ASC
  TITLE_DESC
  EDITOR_NOTES_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_MODIFIED_DESC
  LANGUAGE_DESC
  USER_ASC
  DATE_DOWNLOADED_ASC
  DESCRIPTION_DESC
  IMAGE_URL_ASC
  MODIFIEDBY_ASC
  MODIFIEDBY_DESC
  TEXT_ASC
  _ID_ASC
  _ID_DESC
  DATE_SUBMITTED_DESC
  REPORT_NUMBER_ASC
  DATE_DOWNLOADED_DESC
  DATE_MODIFIED_ASC
}

enum ChecklistSortByInput {
  DATE_CREATED_ASC
  DATE_UPDATED_ASC
  DATE_UPDATED_DESC
  NAME_DESC
  ABOUT_DESC
  ABOUT_ASC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  OWNER_ID_DESC
  _ID_ASC
  DATE_CREATED_DESC
  NAME_ASC
  OWNER_ID_ASC
  _ID_DESC
  ID_DESC
  ID_ASC
}

input Entity_relationshipUpdateInput {
  created_at_unset: Boolean
  obj_unset: Boolean
  is_symmetric_unset: Boolean
  _id_unset: Boolean
  obj: Entity_relationshipObjRelationInput
  pred: String
  sub: Entity_relationshipSubRelationInput
  _id: ObjectId
  created_at: DateTime
  pred_unset: Boolean
  sub_unset: Boolean
  is_symmetric: Boolean
}

input SubscriptionInsertInput {
  entityId: SubscriptionEntityIdRelationInput
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
  userId: SubscriptionUserIdRelationInput!
  _id: ObjectId
}

type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

type InsertManyPayload {
  insertedIds: [ObjectId]!
}

input SubmissionNlp_similar_incidentUpdateInput {
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
}
`;
