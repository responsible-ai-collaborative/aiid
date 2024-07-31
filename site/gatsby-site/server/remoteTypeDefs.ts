import gql from "graphql-tag";

export default gql`
type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
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

type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}

type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input SubmissionUpdateInput {
  incident_editors: SubmissionIncident_editorsRelationInput
  cloudinary_id: String
  language: String
  source_domain: String
  quiet_unset: Boolean
  date_published_unset: Boolean
  language_unset: Boolean
  editor_dissimilar_incidents: [Int]
  incident_title_unset: Boolean
  harmed_parties_unset: Boolean
  embedding: SubmissionEmbeddingUpdateInput
  url: String
  authors_unset: Boolean
  developers: SubmissionDevelopersRelationInput
  editor_notes: String
  date_downloaded_unset: Boolean
  description: String
  incident_editors_unset: Boolean
  harmed_parties: SubmissionHarmed_partiesRelationInput
  submitters_unset: Boolean
  epoch_date_modified_unset: Boolean
  editor_notes_unset: Boolean
  user_unset: Boolean
  _id_unset: Boolean
  editor_similar_incidents_unset: Boolean
  deployers_unset: Boolean
  developers_unset: Boolean
  incident_date_unset: Boolean
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  title_unset: Boolean
  date_published: String
  source_domain_unset: Boolean
  incident_title: String
  user: SubmissionUserRelationInput
  epoch_date_modified_inc: Int
  text: String
  status_unset: Boolean
  tags_unset: Boolean
  tags: [String]
  _id: ObjectId
  date_downloaded: String
  cloudinary_id_unset: Boolean
  description_unset: Boolean
  authors: [String]
  plain_text_unset: Boolean
  date_modified_unset: Boolean
  incident_ids_unset: Boolean
  url_unset: Boolean
  image_url_unset: Boolean
  embedding_unset: Boolean
  image_url: String
  date_submitted_unset: Boolean
  date_modified: String
  submitters: [String]
  plain_text: String
  text_unset: Boolean
  date_submitted: String
  title: String
  editor_similar_incidents: [Int]
  nlp_similar_incidents_unset: Boolean
  status: String
  epoch_date_modified: Int
  incident_ids: [Int]
  editor_dissimilar_incidents_unset: Boolean
  deployers: SubmissionDeployersRelationInput
  quiet: Boolean
  incident_date: String
}

input NotificationInsertInput {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: NotificationUserIdRelationInput
}

input IncidentNlp_similar_incidentQueryInput {
  incident_id_lte: Int
  incident_id_ne: Int
  incident_id_in: [Int]
  similarity_lt: Float
  incident_id_lt: Int
  similarity_ne: Float
  similarity_nin: [Float]
  incident_id_exists: Boolean
  similarity_gt: Float
  similarity_lte: Float
  similarity_in: [Float]
  similarity_gte: Float
  similarity_exists: Boolean
  AND: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_gt: Int
  incident_id_gte: Int
  incident_id_nin: [Int]
  OR: [IncidentNlp_similar_incidentQueryInput!]
  incident_id: Int
  similarity: Float
}

enum IncidentSortByInput {
  EPOCH_DATE_MODIFIED_ASC
  EDITOR_NOTES_ASC
  DATE_DESC
  DESCRIPTION_DESC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  _ID_DESC
  INCIDENT_ID_DESC
  TITLE_DESC
  _ID_ASC
  DESCRIPTION_ASC
  INCIDENT_ID_ASC
  TITLE_ASC
  DATE_ASC
}

type History_incidentTsne {
  x: Float
  y: Float
}

input IncidentTsneQueryInput {
  x_lt: Float
  x_in: [Float]
  OR: [IncidentTsneQueryInput!]
  x_nin: [Float]
  y_lt: Float
  x_ne: Float
  x_gt: Float
  x: Float
  AND: [IncidentTsneQueryInput!]
  x_lte: Float
  y_lte: Float
  y_in: [Float]
  y_nin: [Float]
  y_exists: Boolean
  y_ne: Float
  x_gte: Float
  y: Float
  y_gte: Float
  x_exists: Boolean
  y_gt: Float
}

input NotificationQueryInput {
  userId: UserQueryInput
  _id_nin: [ObjectId]
  sentDate_lt: DateTime
  type: String
  type_gt: String
  _id_lte: ObjectId
  _id_in: [ObjectId]
  sentDate_exists: Boolean
  type_exists: Boolean
  type_gte: String
  type_in: [String]
  _id_ne: ObjectId
  _id_exists: Boolean
  processed_exists: Boolean
  sentDate_lte: DateTime
  _id: ObjectId
  processed: Boolean
  userId_exists: Boolean
  incident_id_ne: Int
  sentDate_nin: [DateTime]
  incident_id_in: [Int]
  incident_id_nin: [Int]
  sentDate_in: [DateTime]
  OR: [NotificationQueryInput!]
  _id_gt: ObjectId
  type_nin: [String]
  AND: [NotificationQueryInput!]
  incident_id_lte: Int
  type_lt: String
  incident_id_gt: Int
  type_ne: String
  sentDate: DateTime
  incident_id_gte: Int
  incident_id: Int
  _id_lt: ObjectId
  incident_id_exists: Boolean
  _id_gte: ObjectId
  processed_ne: Boolean
  incident_id_lt: Int
  sentDate_ne: DateTime
  sentDate_gte: DateTime
  type_lte: String
  sentDate_gt: DateTime
}

input IncidentEditorsRelationInput {
  link: [String]
  create: [UserInsertInput]
}

input IncidentAllegedDeployerOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input TaxaDummy_fieldQueryInput {
  field_number_gte: String
  AND: [TaxaDummy_fieldQueryInput!]
  field_number: String
  short_name_ne: String
  short_name_gt: String
  short_name_nin: [String]
  short_name_in: [String]
  field_number_ne: String
  field_number_lt: String
  field_number_in: [String]
  short_name_gte: String
  field_number_gt: String
  OR: [TaxaDummy_fieldQueryInput!]
  field_number_exists: Boolean
  field_number_nin: [String]
  short_name_lt: String
  short_name_lte: String
  short_name: String
  short_name_exists: Boolean
  field_number_lte: String
}

type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input SubmissionNlp_similar_incidentQueryInput {
  incident_id_in: [Int]
  similarity_gte: Float
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  similarity_ne: Float
  incident_id_ne: Int
  incident_id_exists: Boolean
  incident_id_lt: Int
  incident_id_lte: Int
  similarity_lte: Float
  similarity_nin: [Float]
  incident_id_gt: Int
  similarity_exists: Boolean
  incident_id: Int
  similarity_gt: Float
  incident_id_gte: Int
  incident_id_nin: [Int]
  similarity_in: [Float]
  similarity: Float
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  similarity_lt: Float
}

input IncidentAllegedDeveloperOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

type CreateVariantPayload {
  incident_id: Int
  report_number: Int
}

input ChecklistRiskQueryInput {
  title_in: [String]
  severity: String
  title_gt: String
  id_lt: String
  title_lt: String
  tags_exists: Boolean
  generated: Boolean
  touched: Boolean
  risk_notes_lte: String
  id_gt: String
  tags: [String]
  likelihood_lte: String
  title_ne: String
  title: String
  severity_in: [String]
  severity_exists: Boolean
  risk_notes_ne: String
  severity_lte: String
  likelihood: String
  risk_status_ne: String
  likelihood_gt: String
  severity_ne: String
  touched_ne: Boolean
  risk_status_in: [String]
  id_exists: Boolean
  severity_lt: String
  risk_notes: String
  risk_notes_gt: String
  risk_notes_lt: String
  risk_status_lte: String
  risk_status_exists: Boolean
  risk_notes_in: [String]
  precedents_exists: Boolean
  risk_status_lt: String
  likelihood_ne: String
  severity_nin: [String]
  likelihood_nin: [String]
  OR: [ChecklistRiskQueryInput!]
  id_in: [String]
  title_gte: String
  touched_exists: Boolean
  risk_notes_exists: Boolean
  risk_notes_gte: String
  title_nin: [String]
  severity_gt: String
  precedents: [ChecklistRiskPrecedentQueryInput]
  risk_notes_nin: [String]
  id_ne: String
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  id_gte: String
  id: String
  risk_status_gte: String
  tags_in: [String]
  severity_gte: String
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  title_exists: Boolean
  tags_nin: [String]
  generated_exists: Boolean
  id_lte: String
  title_lte: String
  likelihood_exists: Boolean
  id_nin: [String]
  risk_status_gt: String
  likelihood_gte: String
  likelihood_in: [String]
  likelihood_lt: String
  risk_status: String
  risk_status_nin: [String]
  AND: [ChecklistRiskQueryInput!]
  generated_ne: Boolean
}

input SubmissionQueryInput {
  status_nin: [String]
  user_exists: Boolean
  date_submitted_nin: [String]
  incident_ids_nin: [Int]
  quiet: Boolean
  authors: [String]
  text_lt: String
  plain_text_lte: String
  status_gte: String
  status_lt: String
  language_lt: String
  plain_text_gte: String
  _id_lt: ObjectId
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  status_lte: String
  url_lt: String
  incident_editors: [UserQueryInput]
  source_domain_nin: [String]
  language_gt: String
  image_url_gt: String
  editor_notes: String
  submitters_nin: [String]
  incident_editors_nin: [UserQueryInput]
  description_lt: String
  _id_lte: ObjectId
  date_submitted_lt: String
  date_published_nin: [String]
  date_submitted_lte: String
  incident_date_gt: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  date_published_gt: String
  source_domain_exists: Boolean
  status_ne: String
  developers_exists: Boolean
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  editor_similar_incidents_exists: Boolean
  url_ne: String
  embedding_exists: Boolean
  date_downloaded_gte: String
  date_published_gte: String
  date_downloaded_lt: String
  description_gt: String
  date_submitted_gt: String
  submitters_in: [String]
  text_lte: String
  harmed_parties_nin: [EntityQueryInput]
  harmed_parties: [EntityQueryInput]
  incident_title_lte: String
  editor_notes_nin: [String]
  incident_date_in: [String]
  plain_text_ne: String
  url_gte: String
  incident_date_lte: String
  cloudinary_id_nin: [String]
  editor_dissimilar_incidents_exists: Boolean
  plain_text_gt: String
  image_url_nin: [String]
  submitters_exists: Boolean
  AND: [SubmissionQueryInput!]
  description_lte: String
  date_submitted_ne: String
  _id_exists: Boolean
  date_modified_in: [String]
  description_exists: Boolean
  embedding: SubmissionEmbeddingQueryInput
  plain_text: String
  editor_dissimilar_incidents_in: [Int]
  deployers_nin: [EntityQueryInput]
  editor_similar_incidents: [Int]
  incident_date: String
  source_domain_gte: String
  epoch_date_modified_ne: Int
  url_gt: String
  incident_ids_in: [Int]
  description_nin: [String]
  image_url_in: [String]
  date_modified_gt: String
  date_downloaded_in: [String]
  text_gte: String
  description_ne: String
  developers: [EntityQueryInput]
  language_exists: Boolean
  epoch_date_modified_gte: Int
  date_downloaded_lte: String
  date_published_ne: String
  cloudinary_id_exists: Boolean
  incident_editors_exists: Boolean
  incident_ids: [Int]
  _id: ObjectId
  epoch_date_modified_lt: Int
  source_domain: String
  language_in: [String]
  harmed_parties_in: [EntityQueryInput]
  authors_nin: [String]
  incident_title_nin: [String]
  editor_notes_exists: Boolean
  editor_notes_lt: String
  title_exists: Boolean
  language_ne: String
  url_exists: Boolean
  deployers: [EntityQueryInput]
  plain_text_lt: String
  date_submitted: String
  submitters: [String]
  deployers_in: [EntityQueryInput]
  text_gt: String
  source_domain_lt: String
  language_lte: String
  incident_ids_exists: Boolean
  incident_title_gte: String
  cloudinary_id_lte: String
  source_domain_in: [String]
  authors_exists: Boolean
  language_gte: String
  image_url_ne: String
  _id_gte: ObjectId
  epoch_date_modified_in: [Int]
  epoch_date_modified: Int
  nlp_similar_incidents_exists: Boolean
  authors_in: [String]
  cloudinary_id_lt: String
  incident_title: String
  incident_editors_in: [UserQueryInput]
  editor_notes_ne: String
  date_downloaded_gt: String
  status_exists: Boolean
  incident_date_ne: String
  title: String
  quiet_exists: Boolean
  plain_text_nin: [String]
  _id_nin: [ObjectId]
  url: String
  language: String
  image_url_lt: String
  developers_in: [EntityQueryInput]
  language_nin: [String]
  title_ne: String
  editor_similar_incidents_in: [Int]
  editor_dissimilar_incidents: [Int]
  cloudinary_id_in: [String]
  incident_date_gte: String
  epoch_date_modified_exists: Boolean
  incident_date_exists: Boolean
  image_url_exists: Boolean
  description: String
  incident_title_in: [String]
  incident_title_ne: String
  description_in: [String]
  date_modified_gte: String
  editor_similar_incidents_nin: [Int]
  date_downloaded_nin: [String]
  date_downloaded_ne: String
  editor_notes_lte: String
  image_url_lte: String
  date_modified_lt: String
  status: String
  cloudinary_id_gt: String
  text_ne: String
  editor_notes_in: [String]
  source_domain_lte: String
  image_url: String
  tags_in: [String]
  text_in: [String]
  date_downloaded_exists: Boolean
  editor_notes_gte: String
  title_in: [String]
  date_published_lte: String
  incident_date_lt: String
  cloudinary_id_gte: String
  date_submitted_exists: Boolean
  incident_date_nin: [String]
  editor_dissimilar_incidents_nin: [Int]
  source_domain_gt: String
  date_modified_nin: [String]
  epoch_date_modified_lte: Int
  date_published_exists: Boolean
  deployers_exists: Boolean
  date_published: String
  incident_title_exists: Boolean
  title_gte: String
  text_nin: [String]
  developers_nin: [EntityQueryInput]
  date_modified_ne: String
  tags: [String]
  cloudinary_id: String
  description_gte: String
  tags_exists: Boolean
  title_lte: String
  text_exists: Boolean
  tags_nin: [String]
  title_gt: String
  url_nin: [String]
  user: UserQueryInput
  date_submitted_gte: String
  OR: [SubmissionQueryInput!]
  date_downloaded: String
  _id_gt: ObjectId
  url_in: [String]
  source_domain_ne: String
  date_modified_lte: String
  url_lte: String
  quiet_ne: Boolean
  text: String
  _id_in: [ObjectId]
  date_published_in: [String]
  epoch_date_modified_gt: Int
  date_modified: String
  image_url_gte: String
  status_gt: String
  date_published_lt: String
  epoch_date_modified_nin: [Int]
  cloudinary_id_ne: String
  incident_title_gt: String
  plain_text_in: [String]
  status_in: [String]
  title_nin: [String]
  _id_ne: ObjectId
  harmed_parties_exists: Boolean
  incident_title_lt: String
  title_lt: String
  editor_notes_gt: String
  plain_text_exists: Boolean
  date_modified_exists: Boolean
  date_submitted_in: [String]
}

type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}

scalar DateTime

input ReportQueryInput {
  cloudinary_id_ne: String
  date_submitted_gte: DateTime
  text_nin: [String]
  image_url_exists: Boolean
  plain_text_ne: String
  source_domain_nin: [String]
  cloudinary_id_lt: String
  epoch_date_published_ne: Int
  epoch_date_modified_in: [Int]
  is_incident_report_exists: Boolean
  editor_notes_nin: [String]
  submitters_exists: Boolean
  flag_exists: Boolean
  embedding: ReportEmbeddingQueryInput
  authors_exists: Boolean
  url: String
  embedding_exists: Boolean
  editor_notes: String
  date_downloaded_gt: DateTime
  image_url_gte: String
  title_gt: String
  date_downloaded_gte: DateTime
  date_submitted: DateTime
  url_nin: [String]
  epoch_date_submitted_gt: Int
  title_lte: String
  epoch_date_published: Int
  date_published_ne: DateTime
  plain_text_in: [String]
  source_domain_in: [String]
  date_modified_gt: DateTime
  epoch_date_submitted_ne: Int
  authors_nin: [String]
  date_downloaded_lte: DateTime
  epoch_date_modified_lte: Int
  language: String
  url_gt: String
  title_nin: [String]
  source_domain_exists: Boolean
  text_lt: String
  language_in: [String]
  inputs_outputs_in: [String]
  inputs_outputs_nin: [String]
  date_submitted_ne: DateTime
  report_number: Int
  description_gt: String
  date_submitted_lte: DateTime
  epoch_date_submitted_in: [Int]
  date_published_nin: [DateTime]
  _id_nin: [ObjectId]
  epoch_date_submitted_exists: Boolean
  date_published_in: [DateTime]
  plain_text_lt: String
  epoch_date_published_in: [Int]
  plain_text_lte: String
  url_exists: Boolean
  title_gte: String
  date_downloaded_nin: [DateTime]
  description: String
  date_modified_gte: DateTime
  quiet_exists: Boolean
  title_lt: String
  date_submitted_gt: DateTime
  editor_notes_in: [String]
  flag: Boolean
  cloudinary_id_nin: [String]
  image_url_ne: String
  epoch_date_downloaded_gte: Int
  epoch_date_published_lt: Int
  date_published_gte: DateTime
  epoch_date_downloaded_gt: Int
  _id_ne: ObjectId
  submitters_nin: [String]
  text_lte: String
  date_downloaded: DateTime
  epoch_date_submitted_gte: Int
  _id: ObjectId
  editor_notes_exists: Boolean
  source_domain: String
  epoch_date_downloaded_exists: Boolean
  date_modified: DateTime
  inputs_outputs_exists: Boolean
  description_exists: Boolean
  language_gt: String
  epoch_date_modified_gte: Int
  image_url_lte: String
  epoch_date_submitted_nin: [Int]
  report_number_in: [Int]
  language_lt: String
  date_modified_lte: DateTime
  image_url_lt: String
  title_in: [String]
  epoch_date_published_gt: Int
  date_published_gt: DateTime
  epoch_date_downloaded: Int
  epoch_date_modified: Int
  date_submitted_lt: DateTime
  authors_in: [String]
  text_in: [String]
  epoch_date_downloaded_nin: [Int]
  text_exists: Boolean
  date_submitted_exists: Boolean
  tags: [String]
  epoch_date_downloaded_lt: Int
  text_ne: String
  authors: [String]
  epoch_date_modified_exists: Boolean
  epoch_date_submitted_lt: Int
  tags_nin: [String]
  cloudinary_id_gt: String
  inputs_outputs: [String]
  plain_text_gte: String
  cloudinary_id_lte: String
  epoch_date_modified_gt: Int
  editor_notes_gte: String
  epoch_date_published_exists: Boolean
  source_domain_ne: String
  epoch_date_downloaded_ne: Int
  report_number_lte: Int
  date_downloaded_exists: Boolean
  epoch_date_published_gte: Int
  text_gte: String
  epoch_date_published_lte: Int
  _id_lt: ObjectId
  description_nin: [String]
  OR: [ReportQueryInput!]
  report_number_exists: Boolean
  date_modified_ne: DateTime
  epoch_date_modified_ne: Int
  submitters_in: [String]
  _id_in: [ObjectId]
  date_submitted_in: [DateTime]
  cloudinary_id: String
  cloudinary_id_gte: String
  date_published_exists: Boolean
  epoch_date_modified_lt: Int
  description_lte: String
  date_published_lte: DateTime
  date_downloaded_lt: DateTime
  report_number_gte: Int
  epoch_date_modified_nin: [Int]
  url_lte: String
  text_gt: String
  _id_lte: ObjectId
  editor_notes_lt: String
  date_published_lt: DateTime
  tags_in: [String]
  date_modified_exists: Boolean
  epoch_date_published_nin: [Int]
  language_lte: String
  flag_ne: Boolean
  _id_exists: Boolean
  plain_text_nin: [String]
  editor_notes_lte: String
  title_exists: Boolean
  is_incident_report_ne: Boolean
  _id_gte: ObjectId
  tags_exists: Boolean
  quiet: Boolean
  description_in: [String]
  url_gte: String
  source_domain_gt: String
  url_in: [String]
  epoch_date_downloaded_in: [Int]
  title: String
  image_url_in: [String]
  cloudinary_id_in: [String]
  report_number_ne: Int
  date_modified_nin: [DateTime]
  title_ne: String
  _id_gt: ObjectId
  user_exists: Boolean
  plain_text_gt: String
  language_nin: [String]
  date_downloaded_ne: DateTime
  source_domain_lte: String
  report_number_nin: [Int]
  description_gte: String
  url_ne: String
  report_number_lt: Int
  epoch_date_submitted: Int
  source_domain_lt: String
  editor_notes_ne: String
  date_modified_lt: DateTime
  AND: [ReportQueryInput!]
  text: String
  plain_text_exists: Boolean
  description_lt: String
  plain_text: String
  source_domain_gte: String
  image_url_gt: String
  editor_notes_gt: String
  date_published: DateTime
  quiet_ne: Boolean
  is_incident_report: Boolean
  language_exists: Boolean
  cloudinary_id_exists: Boolean
  date_submitted_nin: [DateTime]
  date_downloaded_in: [DateTime]
  url_lt: String
  description_ne: String
  report_number_gt: Int
  language_ne: String
  user: UserQueryInput
  date_modified_in: [DateTime]
  epoch_date_downloaded_lte: Int
  submitters: [String]
  language_gte: String
  image_url_nin: [String]
  image_url: String
  epoch_date_submitted_lte: Int
}

input DuplicateQueryInput {
  _id_lt: ObjectId
  duplicate_incident_number: Int
  duplicate_incident_number_nin: [Int]
  duplicate_incident_number_gte: Int
  true_incident_number_gte: Int
  _id: ObjectId
  duplicate_incident_number_gt: Int
  true_incident_number_lte: Int
  _id_nin: [ObjectId]
  true_incident_number_in: [Int]
  duplicate_incident_number_ne: Int
  true_incident_number_exists: Boolean
  true_incident_number_gt: Int
  true_incident_number_ne: Int
  true_incident_number_lt: Int
  duplicate_incident_number_lte: Int
  _id_exists: Boolean
  true_incident_number: Int
  _id_in: [ObjectId]
  _id_ne: ObjectId
  duplicate_incident_number_lt: Int
  AND: [DuplicateQueryInput!]
  duplicate_incident_number_exists: Boolean
  duplicate_incident_number_in: [Int]
  true_incident_number_nin: [Int]
  OR: [DuplicateQueryInput!]
  _id_gt: ObjectId
  _id_lte: ObjectId
  _id_gte: ObjectId
}

input SubscriptionQueryInput {
  _id_gte: ObjectId
  _id_lt: ObjectId
  type_ne: String
  type_gte: String
  _id_nin: [ObjectId]
  type: String
  type_exists: Boolean
  AND: [SubscriptionQueryInput!]
  type_lt: String
  userId: UserQueryInput
  userId_exists: Boolean
  _id_gt: ObjectId
  type_in: [String]
  entityId_exists: Boolean
  type_nin: [String]
  _id: ObjectId
  type_gt: String
  _id_in: [ObjectId]
  entityId: EntityQueryInput
  incident_id: IncidentQueryInput
  incident_id_exists: Boolean
  _id_ne: ObjectId
  type_lte: String
  _id_lte: ObjectId
  _id_exists: Boolean
  OR: [SubscriptionQueryInput!]
}

input ChecklistRiskPrecedentInsertInput {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input SubmissionNlp_similar_incidentInsertInput {
  similarity: Float
  incident_id: Int
}

type UserAdminDatum {
  creationDate: DateTime
  disabled: Boolean
  email: String
  lastAuthenticationDate: DateTime
}

input UserInsertInput {
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
  _id: ObjectId
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

scalar ObjectId

type TaxaDummy_field {
  field_number: String
  short_name: String
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

input CreateDefaultAdminUserInput {
  email: String
  password: String
}

type Entity_relationship {
  _id: ObjectId
  created_at: DateTime
  is_symmetric: Boolean
  obj: [Entity]!
  pred: String!
  sub: [Entity]!
}

input TaxaField_listItem_fieldComplete_fromQueryInput {
  entities: Boolean
  entities_exists: Boolean
  entities_ne: Boolean
  all_in: [String]
  current_nin: [String]
  current_exists: Boolean
  all_nin: [String]
  all_exists: Boolean
  current: [String]
  current_in: [String]
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all: [String]
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
}

input History_reportInsertInput {
  plain_text: String!
  image_url: String!
  source_domain: String!
  modifiedBy: String
  epoch_date_downloaded: Int!
  inputs_outputs: [String]
  is_incident_report: Boolean
  tags: [String]!
  date_published: DateTime!
  editor_notes: String
  date_modified: DateTime!
  embedding: History_reportEmbeddingInsertInput
  description: String
  url: String!
  date_downloaded: DateTime!
  cloudinary_id: String!
  language: String!
  submitters: [String]!
  user: String
  quiet: Boolean
  flag: Boolean
  title: String!
  epoch_date_published: Int!
  epoch_date_submitted: Int!
  date_submitted: DateTime!
  epoch_date_modified: Int!
  text: String!
  authors: [String]!
  report_number: Int!
  _id: ObjectId
}

type ClassificationAttribute {
  short_name: String
  value_json: String
}

input SubscriptionUserIdRelationInput {
  link: String
  create: UserInsertInput
}

input TaxaDummy_fieldUpdateInput {
  field_number: String
  field_number_unset: Boolean
  short_name: String
  short_name_unset: Boolean
}

input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input PromoteSubmissionToReportInput {
  incident_ids: [Int]
  is_incident_report: Boolean
  submission_id: ObjectId
}

type IncidentTsne {
  x: Float
  y: Float
}

input TaxaQueryInput {
  weight_gt: Int
  description_in: [String]
  description_ne: String
  namespace_in: [String]
  field_list: [TaxaField_listQueryInput]
  namespace_gte: String
  namespace_lt: String
  namespace: String
  _id: ObjectId
  OR: [TaxaQueryInput!]
  _id_in: [ObjectId]
  dummy_fields: [TaxaDummy_fieldQueryInput]
  weight_lt: Int
  description: String
  dummy_fields_exists: Boolean
  field_list_nin: [TaxaField_listQueryInput]
  field_list_exists: Boolean
  description_lte: String
  namespace_nin: [String]
  _id_exists: Boolean
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  weight_in: [Int]
  namespace_lte: String
  description_gt: String
  namespace_exists: Boolean
  description_gte: String
  weight_ne: Int
  weight_exists: Boolean
  weight_lte: Int
  namespace_gt: String
  complete_entities_ne: Boolean
  description_nin: [String]
  _id_ne: ObjectId
  description_exists: Boolean
  _id_lte: ObjectId
  weight_gte: Int
  _id_lt: ObjectId
  namespace_ne: String
  complete_entities_exists: Boolean
  _id_nin: [ObjectId]
  field_list_in: [TaxaField_listQueryInput]
  _id_gt: ObjectId
  _id_gte: ObjectId
  description_lt: String
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  AND: [TaxaQueryInput!]
  weight_nin: [Int]
  complete_entities: Boolean
  weight: Int
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

input SubmissionIncident_editorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}

type Entity {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}

input History_reportEmbeddingQueryInput {
  from_text_hash_gte: String
  from_text_hash_ne: String
  vector_nin: [Float]
  OR: [History_reportEmbeddingQueryInput!]
  vector: [Float]
  from_text_hash_in: [String]
  from_text_hash_lte: String
  vector_exists: Boolean
  AND: [History_reportEmbeddingQueryInput!]
  from_text_hash: String
  from_text_hash_lt: String
  from_text_hash_nin: [String]
  vector_in: [Float]
  from_text_hash_gt: String
  from_text_hash_exists: Boolean
}

input SubscriptionEntityIdRelationInput {
  link: String
  create: EntityInsertInput
}

input CandidateEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
}

type CandidateClassification_similarity {
  classification: String
  similarity: Float
}

input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

type InsertManyPayload {
  insertedIds: [ObjectId]!
}

input SubmissionHarmed_partiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input CandidateClassification_similarityUpdateInput {
  classification_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  classification: String
}

input Entity_relationshipQueryInput {
  is_symmetric_exists: Boolean
  pred_gt: String
  _id_lte: ObjectId
  created_at_ne: DateTime
  pred_lte: String
  created_at_lte: DateTime
  sub: [EntityQueryInput]
  pred_ne: String
  is_symmetric_ne: Boolean
  obj_in: [EntityQueryInput]
  _id_gte: ObjectId
  pred: String
  _id_in: [ObjectId]
  obj_nin: [EntityQueryInput]
  is_symmetric: Boolean
  _id_exists: Boolean
  _id_lt: ObjectId
  pred_gte: String
  pred_exists: Boolean
  AND: [Entity_relationshipQueryInput!]
  _id: ObjectId
  created_at_in: [DateTime]
  sub_nin: [EntityQueryInput]
  obj: [EntityQueryInput]
  _id_nin: [ObjectId]
  created_at_lt: DateTime
  created_at_gte: DateTime
  OR: [Entity_relationshipQueryInput!]
  created_at_gt: DateTime
  pred_lt: String
  sub_exists: Boolean
  _id_ne: ObjectId
  created_at_exists: Boolean
  pred_nin: [String]
  pred_in: [String]
  created_at_nin: [DateTime]
  sub_in: [EntityQueryInput]
  _id_gt: ObjectId
  created_at: DateTime
  obj_exists: Boolean
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

input History_incidentTsneQueryInput {
  x_exists: Boolean
  OR: [History_incidentTsneQueryInput!]
  y_nin: [Float]
  x_gt: Float
  x_in: [Float]
  x: Float
  y_lte: Float
  y_in: [Float]
  AND: [History_incidentTsneQueryInput!]
  x_ne: Float
  y_exists: Boolean
  x_gte: Float
  x_lte: Float
  y_gte: Float
  y_lt: Float
  x_nin: [Float]
  x_lt: Float
  y_gt: Float
  y_ne: Float
  y: Float
}

enum History_incidentSortByInput {
  _ID_DESC
  DATE_ASC
  _ID_ASC
  EPOCH_DATE_MODIFIED_ASC
  DESCRIPTION_DESC
  EDITOR_NOTES_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_ID_ASC
  TITLE_ASC
  TITLE_DESC
  DESCRIPTION_ASC
  INCIDENT_ID_DESC
  MODIFIEDBY_ASC
  MODIFIEDBY_DESC
  DATE_DESC
}

input ClassificationUpdateInput {
  publish: Boolean
  notes: String
  _id: ObjectId
  incidents_unset: Boolean
  attributes_unset: Boolean
  namespace_unset: Boolean
  reports: ClassificationReportsRelationInput
  attributes: [ClassificationAttributeUpdateInput]
  _id_unset: Boolean
  reports_unset: Boolean
  incidents: ClassificationIncidentsRelationInput
  notes_unset: Boolean
  namespace: String
  publish_unset: Boolean
}

input TaxaField_listItem_fieldUpdateInput {
  permitted_values: [String]
  placeholder: String
  short_name: String
  complete_from_unset: Boolean
  public: Boolean
  display_type_unset: Boolean
  short_description_unset: Boolean
  weight: Int
  mongo_type: String
  short_description: String
  instant_facet_unset: Boolean
  mongo_type_unset: Boolean
  instant_facet: Boolean
  field_number: String
  long_name_unset: Boolean
  weight_unset: Boolean
  required: Boolean
  short_name_unset: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  default: String
  permitted_values_unset: Boolean
  weight_inc: Int
  required_unset: Boolean
  long_name: String
  public_unset: Boolean
  default_unset: Boolean
  field_number_unset: Boolean
  placeholder_unset: Boolean
  long_description: String
  long_description_unset: Boolean
  display_type: String
}

type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}

input CandidateClassification_similarityQueryInput {
  classification: String
  similarity_ne: Float
  classification_in: [String]
  similarity_lt: Float
  similarity: Float
  AND: [CandidateClassification_similarityQueryInput!]
  classification_nin: [String]
  OR: [CandidateClassification_similarityQueryInput!]
  classification_ne: String
  classification_gt: String
  classification_lt: String
  similarity_nin: [Float]
  classification_gte: String
  similarity_in: [Float]
  similarity_lte: Float
  classification_lte: String
  similarity_gte: Float
  classification_exists: Boolean
  similarity_gt: Float
  similarity_exists: Boolean
}

input IncidentTsneUpdateInput {
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
}

input History_incidentTsneInsertInput {
  x: Float
  y: Float
}

type User {
  _id: ObjectId
  adminData: UserAdminDatum
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input SubscriptionInsertInput {
  entityId: SubscriptionEntityIdRelationInput
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
  userId: SubscriptionUserIdRelationInput!
  _id: ObjectId
}

type AppUser {
  email: String
}

input IncidentEmbeddingQueryInput {
  vector_in: [Float]
  from_reports_in: [Int]
  from_reports: [Int]
  vector_exists: Boolean
  vector_nin: [Float]
  OR: [IncidentEmbeddingQueryInput!]
  from_reports_nin: [Int]
  from_reports_exists: Boolean
  vector: [Float]
  AND: [IncidentEmbeddingQueryInput!]
}

input EntityQueryInput {
  _id_gt: ObjectId
  _id_in: [ObjectId]
  created_at_nin: [DateTime]
  name_nin: [String]
  created_at: DateTime
  name: String
  entity_id_ne: String
  date_modified_in: [DateTime]
  _id: ObjectId
  entity_id_gte: String
  entity_id_lte: String
  name_gt: String
  entity_id_gt: String
  name_exists: Boolean
  date_modified_ne: DateTime
  date_modified_gte: DateTime
  date_modified_nin: [DateTime]
  date_modified_gt: DateTime
  date_modified_lte: DateTime
  name_lte: String
  entity_id_exists: Boolean
  created_at_exists: Boolean
  name_gte: String
  _id_lte: ObjectId
  date_modified_lt: DateTime
  entity_id_nin: [String]
  _id_ne: ObjectId
  _id_gte: ObjectId
  entity_id_in: [String]
  entity_id: String
  AND: [EntityQueryInput!]
  date_modified_exists: Boolean
  name_ne: String
  name_lt: String
  entity_id_lt: String
  created_at_ne: DateTime
  _id_exists: Boolean
  created_at_lte: DateTime
  created_at_gt: DateTime
  date_modified: DateTime
  name_in: [String]
  _id_nin: [ObjectId]
  created_at_lt: DateTime
  created_at_in: [DateTime]
  _id_lt: ObjectId
  created_at_gte: DateTime
  OR: [EntityQueryInput!]
}

input DuplicateInsertInput {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
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

input EntityUpdateInput {
  _id: ObjectId
  created_at: DateTime
  date_modified_unset: Boolean
  name_unset: Boolean
  entity_id: String
  entity_id_unset: Boolean
  name: String
  _id_unset: Boolean
  created_at_unset: Boolean
  date_modified: DateTime
}

type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
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

type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}

input IncidentTsneInsertInput {
  y: Float
  x: Float
}

input ClassificationAttributeUpdateInput {
  value_json_unset: Boolean
  short_name: String
  short_name_unset: Boolean
  value_json: String
}

input TaxaDummy_fieldInsertInput {
  short_name: String
  field_number: String
}

input UpdateOneReportTranslationInput {
  text: String!
  title: String!
  language: String!
  plain_text: String!
  report_number: Int!
}

enum ChecklistSortByInput {
  ABOUT_ASC
  DATE_UPDATED_ASC
  ID_DESC
  OWNER_ID_ASC
  _ID_DESC
  DATE_UPDATED_DESC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  ID_ASC
  DATE_CREATED_ASC
  DATE_CREATED_DESC
  NAME_ASC
  OWNER_ID_DESC
  _ID_ASC
  ABOUT_DESC
  NAME_DESC
}

input QuickaddQueryInput {
  url_gte: String
  source_domain_exists: Boolean
  source_domain_ne: String
  _id_nin: [ObjectId]
  url_nin: [String]
  source_domain_lte: String
  incident_id_gte: Long
  url: String
  url_ne: String
  incident_id_ne: Long
  incident_id_gt: Long
  date_submitted_lt: String
  incident_id: Long
  source_domain_gte: String
  incident_id_exists: Boolean
  _id_lt: ObjectId
  url_lte: String
  incident_id_in: [Long]
  source_domain_lt: String
  source_domain_in: [String]
  AND: [QuickaddQueryInput!]
  date_submitted: String
  source_domain: String
  date_submitted_nin: [String]
  source_domain_gt: String
  _id_ne: ObjectId
  date_submitted_gt: String
  incident_id_nin: [Long]
  incident_id_lte: Long
  _id_exists: Boolean
  _id_in: [ObjectId]
  url_exists: Boolean
  OR: [QuickaddQueryInput!]
  _id_lte: ObjectId
  url_gt: String
  source_domain_nin: [String]
  _id: ObjectId
  date_submitted_gte: String
  incident_id_lt: Long
  date_submitted_in: [String]
  date_submitted_ne: String
  url_lt: String
  _id_gt: ObjectId
  date_submitted_exists: Boolean
  url_in: [String]
  date_submitted_lte: String
  _id_gte: ObjectId
}

input CreateVariantInputVariant {
  date_published: String
  inputs_outputs: [String]
  submitters: [String]
  text: String
}

input TaxaField_listComplete_fromInsertInput {
  all: [String]
  current: [String]
}

type LogIncidentHistoryPayload {
  incident_id: Int
}

enum Entity_relationshipSortByInput {
  _ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  OBJ_DESC
  PRED_ASC
  PRED_DESC
  _ID_ASC
  OBJ_ASC
  SUB_ASC
  SUB_DESC
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

input TaxaField_listComplete_fromUpdateInput {
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  all: [String]
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

type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

type DeleteManyPayload {
  deletedCount: Int!
}

enum SubmissionSortByInput {
  _ID_DESC
  DATE_MODIFIED_ASC
  DATE_PUBLISHED_DESC
  EDITOR_NOTES_ASC
  STATUS_ASC
  TEXT_DESC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_DATE_ASC
  LANGUAGE_DESC
  PLAIN_TEXT_ASC
  SOURCE_DOMAIN_ASC
  USER_ASC
  CLOUDINARY_ID_ASC
  DATE_PUBLISHED_ASC
  DESCRIPTION_ASC
  INCIDENT_TITLE_ASC
  INCIDENT_TITLE_DESC
  TEXT_ASC
  DATE_DOWNLOADED_DESC
  DESCRIPTION_DESC
  LANGUAGE_ASC
  URL_ASC
  USER_DESC
  _ID_ASC
  STATUS_DESC
  DATE_SUBMITTED_ASC
  IMAGE_URL_ASC
  IMAGE_URL_DESC
  SOURCE_DOMAIN_DESC
  TITLE_ASC
  CLOUDINARY_ID_DESC
  EDITOR_NOTES_DESC
  PLAIN_TEXT_DESC
  TITLE_DESC
  URL_DESC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_DESC
  DATE_SUBMITTED_DESC
  INCIDENT_DATE_DESC
}

enum SubscriptionSortByInput {
  _ID_ASC
  _ID_DESC
  USERID_DESC
  TYPE_ASC
  TYPE_DESC
  USERID_ASC
  ENTITYID_ASC
  ENTITYID_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
}

input ClassificationAttributeQueryInput {
  short_name_gte: String
  value_json_gte: String
  AND: [ClassificationAttributeQueryInput!]
  value_json_nin: [String]
  value_json_in: [String]
  value_json_exists: Boolean
  short_name_in: [String]
  short_name_exists: Boolean
  OR: [ClassificationAttributeQueryInput!]
  value_json_ne: String
  value_json_lte: String
  short_name_ne: String
  short_name_lte: String
  short_name_gt: String
  value_json: String
  short_name_nin: [String]
  short_name_lt: String
  value_json_lt: String
  short_name: String
  value_json_gt: String
}

input SubmissionEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input TaxaField_listItem_fieldQueryInput {
  long_name_in: [String]
  mongo_type_gt: String
  public: Boolean
  long_name_ne: String
  instant_facet_exists: Boolean
  complete_from_exists: Boolean
  AND: [TaxaField_listItem_fieldQueryInput!]
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  weight: Int
  field_number_gt: String
  mongo_type: String
  weight_lte: Int
  display_type_in: [String]
  instant_facet_ne: Boolean
  short_description: String
  field_number_lte: String
  short_name_exists: Boolean
  placeholder_lt: String
  short_name_gte: String
  long_description_lt: String
  long_description: String
  field_number_in: [String]
  short_description_lte: String
  public_ne: Boolean
  display_type_exists: Boolean
  short_name_ne: String
  long_name_lte: String
  field_number: String
  placeholder_nin: [String]
  mongo_type_lte: String
  weight_gt: Int
  default: String
  default_exists: Boolean
  placeholder_gte: String
  public_exists: Boolean
  default_ne: String
  required: Boolean
  weight_in: [Int]
  short_description_gte: String
  placeholder_lte: String
  short_description_exists: Boolean
  long_name_lt: String
  short_description_nin: [String]
  permitted_values: [String]
  short_description_lt: String
  weight_ne: Int
  short_description_in: [String]
  long_description_exists: Boolean
  long_description_gt: String
  long_description_ne: String
  display_type_lt: String
  default_nin: [String]
  permitted_values_nin: [String]
  placeholder_in: [String]
  permitted_values_in: [String]
  mongo_type_ne: String
  display_type_ne: String
  mongo_type_gte: String
  short_description_ne: String
  short_name_lt: String
  short_name: String
  field_number_ne: String
  required_ne: Boolean
  long_name_gt: String
  mongo_type_lt: String
  required_exists: Boolean
  default_gt: String
  long_description_nin: [String]
  field_number_exists: Boolean
  short_name_in: [String]
  permitted_values_exists: Boolean
  mongo_type_nin: [String]
  long_name: String
  display_type_lte: String
  field_number_nin: [String]
  long_description_in: [String]
  default_lt: String
  weight_exists: Boolean
  default_in: [String]
  display_type_gt: String
  field_number_gte: String
  mongo_type_in: [String]
  field_number_lt: String
  placeholder_ne: String
  placeholder_exists: Boolean
  default_gte: String
  OR: [TaxaField_listItem_fieldQueryInput!]
  weight_nin: [Int]
  short_name_gt: String
  short_description_gt: String
  display_type: String
  long_name_exists: Boolean
  short_name_nin: [String]
  weight_lt: Int
  long_description_gte: String
  long_description_lte: String
  display_type_nin: [String]
  long_name_nin: [String]
  short_name_lte: String
  long_name_gte: String
  placeholder: String
  placeholder_gt: String
  default_lte: String
  display_type_gte: String
  instant_facet: Boolean
  mongo_type_exists: Boolean
  weight_gte: Int
}

input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input UserUpdateInput {
  roles: [String]
  userId_unset: Boolean
  _id: ObjectId
  last_name: String
  _id_unset: Boolean
  first_name: String
  roles_unset: Boolean
  first_name_unset: Boolean
  last_name_unset: Boolean
  userId: String
}

input NotificationUpdateInput {
  _id: ObjectId
  incident_id_unset: Boolean
  userId: NotificationUserIdRelationInput
  incident_id: Int
  incident_id_inc: Int
  processed: Boolean
  sentDate: DateTime
  sentDate_unset: Boolean
  type: String
  processed_unset: Boolean
  type_unset: Boolean
  _id_unset: Boolean
  userId_unset: Boolean
}

type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

type LogReportHistoryPayload {
  report_number: Int
}

input CandidateEmbeddingQueryInput {
  vector_nin: [Float]
  from_text_hash_lt: String
  from_text_hash_in: [String]
  from_text_hash_nin: [String]
  vector_in: [Float]
  from_text_hash_exists: Boolean
  vector: [Float]
  from_text_hash_gt: String
  vector_exists: Boolean
  from_text_hash_gte: String
  OR: [CandidateEmbeddingQueryInput!]
  from_text_hash: String
  AND: [CandidateEmbeddingQueryInput!]
  from_text_hash_lte: String
  from_text_hash_ne: String
}

input History_reportEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input UserQueryInput {
  AND: [UserQueryInput!]
  OR: [UserQueryInput!]
  userId_lt: String
  roles_in: [String]
  first_name_lt: String
  first_name_gt: String
  last_name_gte: String
  first_name_in: [String]
  userId_ne: String
  first_name_ne: String
  userId_exists: Boolean
  _id_nin: [ObjectId]
  _id_lte: ObjectId
  _id_lt: ObjectId
  userId_gte: String
  first_name_lte: String
  userId_in: [String]
  last_name_nin: [String]
  roles_exists: Boolean
  last_name_lt: String
  last_name_in: [String]
  last_name_gt: String
  roles: [String]
  _id: ObjectId
  first_name_gte: String
  first_name_nin: [String]
  last_name_exists: Boolean
  _id_in: [ObjectId]
  userId: String
  first_name: String
  last_name_lte: String
  roles_nin: [String]
  userId_nin: [String]
  _id_exists: Boolean
  _id_ne: ObjectId
  userId_lte: String
  last_name_ne: String
  first_name_exists: Boolean
  _id_gte: ObjectId
  last_name: String
  userId_gt: String
  _id_gt: ObjectId
}

input TaxaField_listInsertInput {
  permitted_values: [String]
  instant_facet: Boolean
  short_description: String
  hide_search: Boolean
  mongo_type: String
  complete_from: TaxaField_listComplete_fromInsertInput
  short_name: String
  public: Boolean
  field_number: String
  placeholder: String
  long_name: String
  required: Boolean
  display_type: String
  default: String
  long_description: String
  item_fields: TaxaField_listItem_fieldInsertInput
  weight: Int
}

input History_incidentNlp_similar_incidentUpdateInput {
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
}

input QuickaddUpdateInput {
  incident_id_unset: Boolean
  source_domain: String
  incident_id: Long
  date_submitted: String
  _id_unset: Boolean
  date_submitted_unset: Boolean
  url_unset: Boolean
  source_domain_unset: Boolean
  url: String
  _id: ObjectId
}

input QuickaddInsertInput {
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
  _id: ObjectId
}

input IncidentInsertInput {
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  embedding: IncidentEmbeddingInsertInput
  reports: IncidentReportsRelationInput!
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  editor_dissimilar_incidents: [Int]
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  _id: ObjectId
  title: String!
  description: String
  incident_id: Int!
  flagged_dissimilar_incidents: [Int]
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  epoch_date_modified: Int
  date: String!
  editors: IncidentEditorsRelationInput!
  editor_similar_incidents: [Int]
  editor_notes: String
  tsne: IncidentTsneInsertInput
}

input ReportEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input TaxaField_listComplete_fromQueryInput {
  all_nin: [String]
  current_in: [String]
  OR: [TaxaField_listComplete_fromQueryInput!]
  all_exists: Boolean
  current_nin: [String]
  all: [String]
  all_in: [String]
  current_exists: Boolean
  AND: [TaxaField_listComplete_fromQueryInput!]
  current: [String]
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

input History_incidentEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_reports: [Int]
  from_reports_unset: Boolean
}

input ChecklistInsertInput {
  tags_goals: [String]
  tags_methods: [String]
  tags_other: [String]
  _id: ObjectId
  id: String
  owner_id: String
  risks: [ChecklistRiskInsertInput]
  entity_id: String
  name: String
  about: String
  date_created: DateTime
  date_updated: DateTime
}

input ClassificationQueryInput {
  notes_gte: String
  AND: [ClassificationQueryInput!]
  namespace_lte: String
  publish_ne: Boolean
  notes_in: [String]
  namespace_exists: Boolean
  namespace_nin: [String]
  _id_gt: ObjectId
  _id_gte: ObjectId
  _id_lt: ObjectId
  namespace: String
  attributes: [ClassificationAttributeQueryInput]
  namespace_ne: String
  incidents_nin: [IncidentQueryInput]
  attributes_exists: Boolean
  OR: [ClassificationQueryInput!]
  notes_gt: String
  publish_exists: Boolean
  reports_nin: [ReportQueryInput]
  _id_exists: Boolean
  attributes_nin: [ClassificationAttributeQueryInput]
  notes_lte: String
  notes_lt: String
  attributes_in: [ClassificationAttributeQueryInput]
  notes_nin: [String]
  reports: [ReportQueryInput]
  incidents_in: [IncidentQueryInput]
  notes_exists: Boolean
  publish: Boolean
  _id_in: [ObjectId]
  incidents: [IncidentQueryInput]
  incidents_exists: Boolean
  namespace_lt: String
  _id_nin: [ObjectId]
  reports_in: [ReportQueryInput]
  _id_ne: ObjectId
  notes: String
  _id: ObjectId
  namespace_gt: String
  namespace_in: [String]
  notes_ne: String
  reports_exists: Boolean
  _id_lte: ObjectId
  namespace_gte: String
}

input ChecklistRiskPrecedentQueryInput {
  incident_id_gt: Int
  title_nin: [String]
  description_lt: String
  AND: [ChecklistRiskPrecedentQueryInput!]
  description: String
  incident_id_nin: [Int]
  tags_in: [String]
  title_gte: String
  title: String
  title_lte: String
  tags_nin: [String]
  description_nin: [String]
  incident_id: Int
  title_lt: String
  description_gt: String
  description_lte: String
  incident_id_lte: Int
  title_in: [String]
  description_gte: String
  incident_id_exists: Boolean
  incident_id_gte: Int
  OR: [ChecklistRiskPrecedentQueryInput!]
  description_in: [String]
  tags_exists: Boolean
  description_exists: Boolean
  description_ne: String
  title_exists: Boolean
  title_ne: String
  incident_id_in: [Int]
  title_gt: String
  tags: [String]
  incident_id_ne: Int
  incident_id_lt: Int
}

input CandidateQueryInput {
  language_ne: String
  text_in: [String]
  authors_nin: [String]
  epoch_date_published_nin: [Int]
  date_published_lte: String
  title: String
  url_nin: [String]
  plain_text_nin: [String]
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  url_lt: String
  text_lt: String
  _id_lte: ObjectId
  image_url_exists: Boolean
  source_domain_nin: [String]
  epoch_date_downloaded_nin: [Int]
  similarity_exists: Boolean
  epoch_date_downloaded_in: [Int]
  language_lte: String
  date_published_lt: String
  plain_text_lt: String
  matching_entities_exists: Boolean
  matching_harm_keywords_nin: [String]
  source_domain_gt: String
  source_domain: String
  url_lte: String
  similarity_gte: Float
  date_downloaded_gt: String
  matching_keywords: [String]
  title_in: [String]
  text_exists: Boolean
  embedding_exists: Boolean
  language_lt: String
  date_published_exists: Boolean
  image_url_nin: [String]
  language: String
  date_downloaded_gte: String
  date_downloaded_exists: Boolean
  image_url_in: [String]
  epoch_date_downloaded_lte: Int
  plain_text_exists: Boolean
  similarity_lte: Float
  url_exists: Boolean
  plain_text_gt: String
  title_exists: Boolean
  dismissed_exists: Boolean
  matching_keywords_nin: [String]
  classification_similarity: [CandidateClassification_similarityQueryInput]
  _id_nin: [ObjectId]
  image_url_gte: String
  epoch_date_published_in: [Int]
  similarity: Float
  match_exists: Boolean
  _id: ObjectId
  epoch_date_published_gte: Int
  match_ne: Boolean
  similarity_nin: [Float]
  matching_entities: [String]
  match: Boolean
  epoch_date_downloaded_gte: Int
  matching_harm_keywords_in: [String]
  matching_harm_keywords: [String]
  date_published: String
  image_url_lte: String
  image_url_gt: String
  url_ne: String
  similarity_ne: Float
  epoch_date_downloaded: Int
  matching_entities_nin: [String]
  epoch_date_published_exists: Boolean
  text_gte: String
  source_domain_lt: String
  source_domain_ne: String
  plain_text: String
  dismissed: Boolean
  language_gte: String
  date_downloaded_lt: String
  plain_text_gte: String
  authors: [String]
  AND: [CandidateQueryInput!]
  authors_in: [String]
  _id_exists: Boolean
  date_downloaded: String
  plain_text_lte: String
  date_published_ne: String
  source_domain_exists: Boolean
  similarity_lt: Float
  _id_gte: ObjectId
  plain_text_ne: String
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  title_ne: String
  date_downloaded_nin: [String]
  date_downloaded_lte: String
  source_domain_in: [String]
  _id_in: [ObjectId]
  epoch_date_downloaded_exists: Boolean
  url: String
  matching_keywords_exists: Boolean
  date_downloaded_in: [String]
  plain_text_in: [String]
  title_gte: String
  _id_gt: ObjectId
  source_domain_lte: String
  epoch_date_published: Int
  title_nin: [String]
  source_domain_gte: String
  url_gt: String
  date_published_in: [String]
  similarity_in: [Float]
  similarity_gt: Float
  language_nin: [String]
  epoch_date_downloaded_ne: Int
  title_lte: String
  _id_ne: ObjectId
  image_url: String
  title_lt: String
  epoch_date_published_lt: Int
  date_published_nin: [String]
  date_published_gt: String
  url_gte: String
  image_url_ne: String
  classification_similarity_exists: Boolean
  epoch_date_published_ne: Int
  date_published_gte: String
  language_gt: String
  epoch_date_downloaded_lt: Int
  _id_lt: ObjectId
  title_gt: String
  epoch_date_published_lte: Int
  text_nin: [String]
  url_in: [String]
  text_ne: String
  date_downloaded_ne: String
  text_gt: String
  matching_harm_keywords_exists: Boolean
  epoch_date_published_gt: Int
  matching_entities_in: [String]
  authors_exists: Boolean
  language_in: [String]
  text: String
  embedding: CandidateEmbeddingQueryInput
  text_lte: String
  image_url_lt: String
  dismissed_ne: Boolean
  language_exists: Boolean
  OR: [CandidateQueryInput!]
  matching_keywords_in: [String]
  epoch_date_downloaded_gt: Int
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

input History_incidentEmbeddingQueryInput {
  vector: [Float]
  from_reports_nin: [Int]
  OR: [History_incidentEmbeddingQueryInput!]
  AND: [History_incidentEmbeddingQueryInput!]
  from_reports: [Int]
  from_reports_exists: Boolean
  from_reports_in: [Int]
  vector_exists: Boolean
  vector_in: [Float]
  vector_nin: [Float]
}

type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}

input CreateVariantInput {
  incidentId: Int
  variant: CreateVariantInputVariant
}

scalar Long

input ClassificationIncidentsRelationInput {
  link: [Int]
  create: [IncidentInsertInput]
}

input ChecklistQueryInput {
  risks_exists: Boolean
  risks: [ChecklistRiskQueryInput]
  _id_lt: ObjectId
  owner_id: String
  tags_methods_exists: Boolean
  tags_goals: [String]
  tags_methods_in: [String]
  date_created_ne: DateTime
  AND: [ChecklistQueryInput!]
  date_created_nin: [DateTime]
  entity_id_lt: String
  owner_id_gte: String
  about_nin: [String]
  name_gte: String
  tags_other_nin: [String]
  date_updated_gte: DateTime
  owner_id_lt: String
  date_created_gt: DateTime
  date_created_lte: DateTime
  id_nin: [String]
  about_lte: String
  OR: [ChecklistQueryInput!]
  _id_gte: ObjectId
  entity_id_gt: String
  _id_in: [ObjectId]
  tags_goals_in: [String]
  about_gte: String
  about_lt: String
  date_created_gte: DateTime
  date_updated_gt: DateTime
  tags_other: [String]
  owner_id_lte: String
  about_exists: Boolean
  about_gt: String
  id: String
  owner_id_gt: String
  date_created_exists: Boolean
  date_updated_exists: Boolean
  entity_id_in: [String]
  about_in: [String]
  date_updated_nin: [DateTime]
  _id_lte: ObjectId
  date_updated: DateTime
  owner_id_ne: String
  id_gte: String
  tags_methods_nin: [String]
  id_ne: String
  date_updated_in: [DateTime]
  entity_id_lte: String
  date_created_lt: DateTime
  entity_id_exists: Boolean
  name: String
  name_nin: [String]
  date_created_in: [DateTime]
  about_ne: String
  entity_id_nin: [String]
  tags_other_in: [String]
  id_in: [String]
  _id_ne: ObjectId
  date_updated_ne: DateTime
  tags_goals_nin: [String]
  entity_id: String
  about: String
  owner_id_exists: Boolean
  owner_id_in: [String]
  name_exists: Boolean
  _id_exists: Boolean
  tags_other_exists: Boolean
  risks_nin: [ChecklistRiskQueryInput]
  _id_gt: ObjectId
  name_lt: String
  tags_goals_exists: Boolean
  entity_id_ne: String
  _id_nin: [ObjectId]
  entity_id_gte: String
  id_lt: String
  id_lte: String
  id_gt: String
  name_ne: String
  _id: ObjectId
  tags_methods: [String]
  risks_in: [ChecklistRiskQueryInput]
  date_updated_lt: DateTime
  owner_id_nin: [String]
  date_updated_lte: DateTime
  name_in: [String]
  date_created: DateTime
  name_lte: String
  name_gt: String
  id_exists: Boolean
}

type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}

enum NotificationSortByInput {
  _ID_ASC
  _ID_DESC
  SENTDATE_DESC
  USERID_DESC
  USERID_ASC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  SENTDATE_ASC
  TYPE_ASC
  TYPE_DESC
}

enum DuplicateSortByInput {
  _ID_ASC
  _ID_DESC
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
}

input History_incidentUpdateInput {
  description: String
  editor_dissimilar_incidents_unset: Boolean
  embedding_unset: Boolean
  _id_unset: Boolean
  epoch_date_modified_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  embedding: History_incidentEmbeddingUpdateInput
  editors: [String]
  description_unset: Boolean
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  date_unset: Boolean
  tsne: History_incidentTsneUpdateInput
  editors_unset: Boolean
  incident_id: Int
  editor_notes: String
  editor_dissimilar_incidents: [Int]
  editor_similar_incidents: [Int]
  nlp_similar_incidents_unset: Boolean
  title: String
  modifiedBy_unset: Boolean
  title_unset: Boolean
  epoch_date_modified: Int
  date: String
  editor_notes_unset: Boolean
  reports_unset: Boolean
  AllegedDeployerOfAISystem_unset: Boolean
  modifiedBy: String
  _id: ObjectId
  incident_id_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties: [String]
  editor_similar_incidents_unset: Boolean
  epoch_date_modified_inc: Int
  AllegedDeployerOfAISystem: [String]
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  tsne_unset: Boolean
  reports: [Int]
  flagged_dissimilar_incidents: [Int]
  incident_id_inc: Int
  flagged_dissimilar_incidents_unset: Boolean
  AllegedDeveloperOfAISystem: [String]
}

type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}

input History_incidentNlp_similar_incidentQueryInput {
  similarity_gte: Float
  similarity_lte: Float
  similarity: Float
  similarity_nin: [Float]
  incident_id_exists: Boolean
  incident_id: Int
  incident_id_gt: Int
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_in: [Int]
  incident_id_lt: Int
  similarity_ne: Float
  incident_id_nin: [Int]
  incident_id_gte: Int
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_ne: Int
  similarity_gt: Float
  similarity_lt: Float
  similarity_exists: Boolean
  similarity_in: [Float]
  incident_id_lte: Int
}

input ReportInsertInput {
  epoch_date_published: Int!
  date_downloaded: DateTime!
  flag: Boolean
  submitters: [String]!
  url: String!
  inputs_outputs: [String]
  title: String!
  date_modified: DateTime!
  text: String!
  plain_text: String!
  _id: ObjectId
  date_submitted: DateTime!
  is_incident_report: Boolean
  editor_notes: String
  user: ReportUserRelationInput
  authors: [String]!
  epoch_date_downloaded: Int!
  date_published: DateTime!
  description: String
  epoch_date_modified: Int!
  quiet: Boolean
  epoch_date_submitted: Int!
  tags: [String]!
  cloudinary_id: String!
  language: String!
  embedding: ReportEmbeddingInsertInput
  image_url: String!
  report_number: Int!
  source_domain: String!
}

input ChecklistRiskUpdateInput {
  id_unset: Boolean
  id: String
  title: String
  risk_status_unset: Boolean
  likelihood: String
  generated: Boolean
  risk_notes_unset: Boolean
  risk_status: String
  severity_unset: Boolean
  likelihood_unset: Boolean
  risk_notes: String
  touched_unset: Boolean
  precedents_unset: Boolean
  title_unset: Boolean
  generated_unset: Boolean
  tags: [String]
  severity: String
  touched: Boolean
  tags_unset: Boolean
  precedents: [ChecklistRiskPrecedentUpdateInput]
}

input IncidentQueryInput {
  _id_in: [ObjectId]
  description_lt: String
  editor_notes_lte: String
  editor_similar_incidents_exists: Boolean
  title_lte: String
  date: String
  date_gt: String
  AllegedDeveloperOfAISystem_exists: Boolean
  _id_ne: ObjectId
  incident_id_lt: Int
  flagged_dissimilar_incidents: [Int]
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  description_nin: [String]
  nlp_similar_incidents_exists: Boolean
  incident_id_in: [Int]
  editor_notes_ne: String
  editors_in: [UserQueryInput]
  incident_id_lte: Int
  AllegedDeployerOfAISystem_exists: Boolean
  _id_gte: ObjectId
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  description: String
  title_lt: String
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  epoch_date_modified_exists: Boolean
  epoch_date_modified: Int
  reports_exists: Boolean
  epoch_date_modified_gt: Int
  embedding: IncidentEmbeddingQueryInput
  incident_id: Int
  incident_id_gte: Int
  description_ne: String
  flagged_dissimilar_incidents_exists: Boolean
  description_in: [String]
  _id_nin: [ObjectId]
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  editor_dissimilar_incidents_exists: Boolean
  description_lte: String
  epoch_date_modified_in: [Int]
  editor_dissimilar_incidents_nin: [Int]
  date_lt: String
  incident_id_ne: Int
  editor_notes_in: [String]
  AllegedDeployerOfAISystem: [EntityQueryInput]
  description_exists: Boolean
  _id_gt: ObjectId
  epoch_date_modified_lt: Int
  title_gte: String
  tsne: IncidentTsneQueryInput
  editor_dissimilar_incidents: [Int]
  description_gte: String
  title_gt: String
  description_gt: String
  date_lte: String
  editor_notes: String
  editor_similar_incidents_in: [Int]
  _id: ObjectId
  title_exists: Boolean
  editor_similar_incidents_nin: [Int]
  editor_notes_nin: [String]
  flagged_dissimilar_incidents_nin: [Int]
  title: String
  reports: [ReportQueryInput]
  date_in: [String]
  tsne_exists: Boolean
  editor_dissimilar_incidents_in: [Int]
  incident_id_gt: Int
  date_nin: [String]
  editors: [UserQueryInput]
  flagged_dissimilar_incidents_in: [Int]
  title_ne: String
  epoch_date_modified_lte: Int
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  editor_notes_gt: String
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  AND: [IncidentQueryInput!]
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  _id_lte: ObjectId
  editors_nin: [UserQueryInput]
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  date_ne: String
  epoch_date_modified_nin: [Int]
  editor_similar_incidents: [Int]
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  date_gte: String
  _id_lt: ObjectId
  _id_exists: Boolean
  epoch_date_modified_ne: Int
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  editor_notes_lt: String
  embedding_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  editors_exists: Boolean
  reports_in: [ReportQueryInput]
  incident_id_exists: Boolean
  epoch_date_modified_gte: Int
  incident_id_nin: [Int]
  OR: [IncidentQueryInput!]
  editor_notes_exists: Boolean
  editor_notes_gte: String
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  date_exists: Boolean
  title_in: [String]
  title_nin: [String]
  reports_nin: [ReportQueryInput]
}

input ChecklistRiskInsertInput {
  likelihood: String
  severity: String
  tags: [String]
  generated: Boolean
  precedents: [ChecklistRiskPrecedentInsertInput]
  title: String
  touched: Boolean
  id: String
  risk_notes: String
  risk_status: String
}

input ChecklistUpdateInput {
  entity_id_unset: Boolean
  entity_id: String
  tags_goals: [String]
  about: String
  tags_other_unset: Boolean
  _id: ObjectId
  id: String
  owner_id: String
  tags_methods: [String]
  risks_unset: Boolean
  tags_methods_unset: Boolean
  tags_other: [String]
  about_unset: Boolean
  date_updated_unset: Boolean
  owner_id_unset: Boolean
  name: String
  date_updated: DateTime
  tags_goals_unset: Boolean
  date_created_unset: Boolean
  risks: [ChecklistRiskUpdateInput]
  date_created: DateTime
  id_unset: Boolean
  name_unset: Boolean
  _id_unset: Boolean
}

type IncidentNlp_similar_incident {
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

input CandidateClassification_similarityInsertInput {
  classification: String
  similarity: Float
}

input ClassificationReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

input NotificationUserIdRelationInput {
  link: String
  create: UserInsertInput
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

type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

input TaxaField_listItem_fieldComplete_fromUpdateInput {
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  entities: Boolean
  entities_unset: Boolean
  all: [String]
}

input History_incidentInsertInput {
  AllegedDeveloperOfAISystem: [String]
  title: String!
  date: String!
  editors: [String]!
  _id: ObjectId
  description: String
  reports: [Int]!
  AllegedDeployerOfAISystem: [String]
  epoch_date_modified: Int
  incident_id: Int!
  AllegedHarmedOrNearlyHarmedParties: [String]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  editor_similar_incidents: [Int]
  modifiedBy: String
  editor_dissimilar_incidents: [Int]
  flagged_dissimilar_incidents: [Int]
  tsne: History_incidentTsneInsertInput
  editor_notes: String
  embedding: History_incidentEmbeddingInsertInput
}

input History_reportUpdateInput {
  report_number_inc: Int
  inputs_outputs: [String]
  epoch_date_modified: Int
  _id: ObjectId
  modifiedBy: String
  date_downloaded: DateTime
  embedding_unset: Boolean
  epoch_date_submitted_inc: Int
  epoch_date_submitted_unset: Boolean
  editor_notes_unset: Boolean
  is_incident_report_unset: Boolean
  tags: [String]
  title_unset: Boolean
  date_published: DateTime
  date_submitted: DateTime
  is_incident_report: Boolean
  inputs_outputs_unset: Boolean
  quiet_unset: Boolean
  text: String
  epoch_date_published_inc: Int
  flag_unset: Boolean
  date_published_unset: Boolean
  url_unset: Boolean
  tags_unset: Boolean
  authors_unset: Boolean
  date_modified_unset: Boolean
  epoch_date_downloaded: Int
  cloudinary_id: String
  flag: Boolean
  description_unset: Boolean
  source_domain: String
  epoch_date_downloaded_inc: Int
  epoch_date_modified_unset: Boolean
  epoch_date_submitted: Int
  embedding: History_reportEmbeddingUpdateInput
  language_unset: Boolean
  report_number: Int
  plain_text: String
  date_downloaded_unset: Boolean
  user: String
  epoch_date_downloaded_unset: Boolean
  image_url_unset: Boolean
  submitters: [String]
  plain_text_unset: Boolean
  language: String
  date_modified: DateTime
  modifiedBy_unset: Boolean
  editor_notes: String
  submitters_unset: Boolean
  text_unset: Boolean
  authors: [String]
  epoch_date_published_unset: Boolean
  quiet: Boolean
  report_number_unset: Boolean
  cloudinary_id_unset: Boolean
  epoch_date_modified_inc: Int
  url: String
  epoch_date_published: Int
  source_domain_unset: Boolean
  user_unset: Boolean
  date_submitted_unset: Boolean
  image_url: String
  description: String
  _id_unset: Boolean
  title: String
}

input SubscriptionUpdateInput {
  entityId_unset: Boolean
  type: String
  _id: ObjectId
  entityId: SubscriptionEntityIdRelationInput
  incident_id_unset: Boolean
  userId_unset: Boolean
  _id_unset: Boolean
  type_unset: Boolean
  userId: SubscriptionUserIdRelationInput
  incident_id: SubscriptionIncident_idRelationInput
}

type ReportTranslation {
  text: String
  title: String
}

input CandidateUpdateInput {
  language_unset: Boolean
  epoch_date_published: Int
  image_url_unset: Boolean
  matching_entities: [String]
  _id_unset: Boolean
  embedding_unset: Boolean
  date_published_unset: Boolean
  epoch_date_published_unset: Boolean
  authors_unset: Boolean
  epoch_date_published_inc: Int
  text_unset: Boolean
  text: String
  source_domain_unset: Boolean
  title: String
  similarity_unset: Boolean
  classification_similarity_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  similarity_inc: Float
  matching_harm_keywords: [String]
  title_unset: Boolean
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  date_downloaded_unset: Boolean
  matching_harm_keywords_unset: Boolean
  epoch_date_downloaded_inc: Int
  match_unset: Boolean
  date_published: String
  language: String
  embedding: CandidateEmbeddingUpdateInput
  similarity: Float
  source_domain: String
  url_unset: Boolean
  match: Boolean
  epoch_date_downloaded: Int
  plain_text: String
  authors: [String]
  _id: ObjectId
  matching_keywords_unset: Boolean
  dismissed_unset: Boolean
  matching_entities_unset: Boolean
  url: String
  image_url: String
  date_downloaded: String
  plain_text_unset: Boolean
  dismissed: Boolean
  matching_keywords: [String]
}

enum EntitySortByInput {
  _ID_ASC
  _ID_DESC
  CREATED_AT_DESC
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  ENTITY_ID_DESC
  NAME_ASC
  NAME_DESC
  CREATED_AT_ASC
  ENTITY_ID_ASC
}

type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}

input CandidateEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input SubscriptionIncident_idRelationInput {
  create: IncidentInsertInput
  link: Int
}

input Entity_relationshipUpdateInput {
  created_at: DateTime
  created_at_unset: Boolean
  is_symmetric: Boolean
  is_symmetric_unset: Boolean
  pred: String
  pred_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
}

input IncidentNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_unset: Boolean
  incident_id_inc: Int
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}

input IncidentReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
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
  replaceOneCandidate(query: CandidateQueryInput, data: CandidateInsertInput!): Candidate
  replaceOneChecklist(data: ChecklistInsertInput!, query: ChecklistQueryInput): Checklist
  replaceOneClassification(query: ClassificationQueryInput, data: ClassificationInsertInput!): Classification
  replaceOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  replaceOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  replaceOneEntity_relationship(data: Entity_relationshipInsertInput!, query: Entity_relationshipQueryInput): Entity_relationship
  replaceOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  replaceOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  replaceOneIncident(data: IncidentInsertInput!, query: IncidentQueryInput): Incident
  replaceOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
  replaceOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  replaceOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  replaceOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  replaceOneSubscription(data: SubscriptionInsertInput!, query: SubscriptionQueryInput): Subscription
  replaceOneTaxa(data: TaxaInsertInput!, query: TaxaQueryInput): Taxa
  replaceOneUser(data: UserInsertInput!, query: UserQueryInput): User
  updateManyCandidates(set: CandidateUpdateInput!, query: CandidateQueryInput): UpdateManyPayload
  updateManyChecklists(query: ChecklistQueryInput, set: ChecklistUpdateInput!): UpdateManyPayload
  updateManyClassifications(query: ClassificationQueryInput, set: ClassificationUpdateInput!): UpdateManyPayload
  updateManyDuplicates(query: DuplicateQueryInput, set: DuplicateUpdateInput!): UpdateManyPayload
  updateManyEntities(set: EntityUpdateInput!, query: EntityQueryInput): UpdateManyPayload
  updateManyEntity_relationships(query: Entity_relationshipQueryInput, set: Entity_relationshipUpdateInput!): UpdateManyPayload
  updateManyHistory_incidents(query: History_incidentQueryInput, set: History_incidentUpdateInput!): UpdateManyPayload
  updateManyHistory_reports(query: History_reportQueryInput, set: History_reportUpdateInput!): UpdateManyPayload
  updateManyIncidents(set: IncidentUpdateInput!, query: IncidentQueryInput): UpdateManyPayload
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
  updateOneEntity_relationship(query: Entity_relationshipQueryInput, set: Entity_relationshipUpdateInput!): Entity_relationship
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
  updateOneUser(set: UserUpdateInput!, query: UserQueryInput): User
  upsertOneCandidate(query: CandidateQueryInput, data: CandidateInsertInput!): Candidate
  upsertOneChecklist(query: ChecklistQueryInput, data: ChecklistInsertInput!): Checklist
  upsertOneClassification(query: ClassificationQueryInput, data: ClassificationInsertInput!): Classification
  upsertOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  upsertOneEntity(data: EntityInsertInput!, query: EntityQueryInput): Entity
  upsertOneEntity_relationship(query: Entity_relationshipQueryInput, data: Entity_relationshipInsertInput!): Entity_relationship
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

input TaxaField_listUpdateInput {
  short_description_unset: Boolean
  long_name: String
  placeholder: String
  default_unset: Boolean
  weight: Int
  long_description: String
  public: Boolean
  mongo_type: String
  long_description_unset: Boolean
  complete_from: TaxaField_listComplete_fromUpdateInput
  required: Boolean
  permitted_values_unset: Boolean
  placeholder_unset: Boolean
  mongo_type_unset: Boolean
  short_name_unset: Boolean
  required_unset: Boolean
  display_type: String
  hide_search: Boolean
  weight_inc: Int
  item_fields: TaxaField_listItem_fieldUpdateInput
  long_name_unset: Boolean
  default: String
  field_number: String
  complete_from_unset: Boolean
  weight_unset: Boolean
  public_unset: Boolean
  short_name: String
  short_description: String
  instant_facet: Boolean
  hide_search_unset: Boolean
  instant_facet_unset: Boolean
  permitted_values: [String]
  display_type_unset: Boolean
  item_fields_unset: Boolean
  field_number_unset: Boolean
}

input History_incidentTsneUpdateInput {
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
  x_unset: Boolean
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
  entities(query: EntityQueryInput, limit: Int = 100, sortBy: EntitySortByInput): [Entity]!
  entity(query: EntityQueryInput): Entity
  entity_relationship(query: Entity_relationshipQueryInput): Entity_relationship
  entity_relationships(query: Entity_relationshipQueryInput, limit: Int = 100, sortBy: Entity_relationshipSortByInput): [Entity_relationship]!
  history_incident(query: History_incidentQueryInput): History_incident
  history_incidents(query: History_incidentQueryInput, limit: Int = 100, sortBy: History_incidentSortByInput): [History_incident]!
  history_report(query: History_reportQueryInput): History_report
  history_reports(sortBy: History_reportSortByInput, query: History_reportQueryInput, limit: Int = 100): [History_report]!
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

input ReportEmbeddingQueryInput {
  from_text_hash: String
  vector_in: [Float]
  vector_nin: [Float]
  from_text_hash_nin: [String]
  from_text_hash_ne: String
  from_text_hash_gte: String
  vector_exists: Boolean
  AND: [ReportEmbeddingQueryInput!]
  from_text_hash_lt: String
  from_text_hash_gt: String
  vector: [Float]
  from_text_hash_lte: String
  from_text_hash_in: [String]
  from_text_hash_exists: Boolean
  OR: [ReportEmbeddingQueryInput!]
}

input SubmissionInsertInput {
  quiet: Boolean
  source_domain: String!
  developers: SubmissionDevelopersRelationInput
  editor_similar_incidents: [Int]
  submitters: [String]!
  editor_notes: String
  plain_text: String
  date_submitted: String!
  date_downloaded: String!
  incident_date: String
  text: String!
  deployers: SubmissionDeployersRelationInput
  editor_dissimilar_incidents: [Int]
  description: String
  embedding: SubmissionEmbeddingInsertInput
  incident_ids: [Int]
  date_modified: String!
  date_published: String!
  cloudinary_id: String
  incident_title: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  status: String
  user: SubmissionUserRelationInput
  epoch_date_modified: Int
  incident_editors: SubmissionIncident_editorsRelationInput
  harmed_parties: SubmissionHarmed_partiesRelationInput
  authors: [String]!
  title: String!
  language: String!
  image_url: String!
  url: String!
  tags: [String]!
  _id: ObjectId
}

type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}

enum CandidateSortByInput {
  TEXT_DESC
  _ID_ASC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  LANGUAGE_DESC
  PLAIN_TEXT_DESC
  TEXT_ASC
  DATE_PUBLISHED_ASC
  DATE_PUBLISHED_DESC
  PLAIN_TEXT_ASC
  TITLE_ASC
  URL_ASC
  _ID_DESC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  LANGUAGE_ASC
  SIMILARITY_DESC
  SOURCE_DOMAIN_DESC
  TITLE_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  IMAGE_URL_ASC
  IMAGE_URL_DESC
  SIMILARITY_ASC
  SOURCE_DOMAIN_ASC
  URL_DESC
}

enum History_reportSortByInput {
  DATE_SUBMITTED_DESC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_MODIFIED_ASC
  REPORT_NUMBER_ASC
  SOURCE_DOMAIN_ASC
  TEXT_ASC
  TITLE_ASC
  CLOUDINARY_ID_ASC
  CLOUDINARY_ID_DESC
  DATE_MODIFIED_ASC
  MODIFIEDBY_DESC
  SOURCE_DOMAIN_DESC
  URL_DESC
  USER_ASC
  DATE_PUBLISHED_DESC
  EDITOR_NOTES_DESC
  IMAGE_URL_ASC
  MODIFIEDBY_ASC
  TEXT_DESC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  LANGUAGE_ASC
  URL_ASC
  DATE_SUBMITTED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  EPOCH_DATE_SUBMITTED_DESC
  LANGUAGE_DESC
  REPORT_NUMBER_DESC
  _ID_ASC
  DESCRIPTION_DESC
  IMAGE_URL_DESC
  PLAIN_TEXT_DESC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_MODIFIED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  TITLE_DESC
  USER_DESC
  _ID_DESC
  DATE_PUBLISHED_ASC
  PLAIN_TEXT_ASC
}

input History_incidentQueryInput {
  editor_dissimilar_incidents_in: [Int]
  modifiedBy_gte: String
  editor_dissimilar_incidents_exists: Boolean
  flagged_dissimilar_incidents_nin: [Int]
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  AllegedDeveloperOfAISystem: [String]
  date_nin: [String]
  reports: [Int]
  description_exists: Boolean
  editors_exists: Boolean
  epoch_date_modified_gte: Int
  editor_notes_lt: String
  embedding: History_incidentEmbeddingQueryInput
  date: String
  _id_lt: ObjectId
  OR: [History_incidentQueryInput!]
  AllegedDeveloperOfAISystem_exists: Boolean
  epoch_date_modified_exists: Boolean
  editor_similar_incidents_exists: Boolean
  editors: [String]
  nlp_similar_incidents_exists: Boolean
  date_exists: Boolean
  title_lte: String
  _id_lte: ObjectId
  incident_id_gte: Int
  description: String
  description_gte: String
  date_gte: String
  AllegedHarmedOrNearlyHarmedParties: [String]
  modifiedBy_exists: Boolean
  date_ne: String
  _id: ObjectId
  title: String
  editor_notes_lte: String
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  epoch_date_modified: Int
  incident_id_ne: Int
  description_nin: [String]
  AllegedDeployerOfAISystem_nin: [String]
  modifiedBy: String
  flagged_dissimilar_incidents: [Int]
  incident_id_gt: Int
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  incident_id_lte: Int
  description_in: [String]
  AllegedDeployerOfAISystem: [String]
  date_lte: String
  flagged_dissimilar_incidents_exists: Boolean
  editor_similar_incidents: [Int]
  epoch_date_modified_ne: Int
  modifiedBy_lte: String
  description_gt: String
  date_in: [String]
  epoch_date_modified_lte: Int
  incident_id_in: [Int]
  editor_dissimilar_incidents: [Int]
  modifiedBy_ne: String
  tsne_exists: Boolean
  description_ne: String
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  editor_notes_nin: [String]
  editor_notes_in: [String]
  embedding_exists: Boolean
  title_gt: String
  AllegedDeployerOfAISystem_exists: Boolean
  _id_in: [ObjectId]
  incident_id_nin: [Int]
  date_lt: String
  editors_in: [String]
  editor_notes_exists: Boolean
  modifiedBy_gt: String
  editor_similar_incidents_in: [Int]
  reports_nin: [Int]
  editors_nin: [String]
  epoch_date_modified_lt: Int
  AllegedDeveloperOfAISystem_nin: [String]
  epoch_date_modified_gt: Int
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  epoch_date_modified_in: [Int]
  AND: [History_incidentQueryInput!]
  title_gte: String
  editor_notes_gte: String
  editor_notes_gt: String
  _id_gte: ObjectId
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  title_ne: String
  modifiedBy_lt: String
  description_lte: String
  date_gt: String
  tsne: History_incidentTsneQueryInput
  _id_ne: ObjectId
  epoch_date_modified_nin: [Int]
  editor_notes: String
  incident_id_exists: Boolean
  description_lt: String
  AllegedDeveloperOfAISystem_in: [String]
  _id_exists: Boolean
  title_lt: String
  flagged_dissimilar_incidents_in: [Int]
  editor_dissimilar_incidents_nin: [Int]
  AllegedDeployerOfAISystem_in: [String]
  editor_similar_incidents_nin: [Int]
  title_exists: Boolean
  incident_id: Int
  incident_id_lt: Int
  _id_gt: ObjectId
  title_nin: [String]
  title_in: [String]
  modifiedBy_in: [String]
  _id_nin: [ObjectId]
  reports_in: [Int]
  editor_notes_ne: String
  modifiedBy_nin: [String]
  reports_exists: Boolean
}

input IncidentUpdateInput {
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  embedding: IncidentEmbeddingUpdateInput
  embedding_unset: Boolean
  date: String
  date_unset: Boolean
  editor_dissimilar_incidents: [Int]
  editors_unset: Boolean
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  flagged_dissimilar_incidents_unset: Boolean
  incident_id_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  editor_notes: String
  description: String
  flagged_dissimilar_incidents: [Int]
  incident_id_inc: Int
  editor_dissimilar_incidents_unset: Boolean
  editor_similar_incidents_unset: Boolean
  editor_similar_incidents: [Int]
  epoch_date_modified_inc: Int
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  tsne_unset: Boolean
  editor_notes_unset: Boolean
  description_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  title: String
  reports: IncidentReportsRelationInput
  _id_unset: Boolean
  incident_id: Int
  title_unset: Boolean
  epoch_date_modified: Int
  epoch_date_modified_unset: Boolean
  editors: IncidentEditorsRelationInput
  AllegedDeployerOfAISystem_unset: Boolean
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  tsne: IncidentTsneUpdateInput
  _id: ObjectId
  nlp_similar_incidents_unset: Boolean
  reports_unset: Boolean
}

type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}

input LinkReportsToIncidentsInput {
  report_numbers: [Int]
  incident_ids: [Int]
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

input IncidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

input History_incidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

input TaxaField_listItem_fieldInsertInput {
  mongo_type: String
  required: Boolean
  long_description: String
  default: String
  instant_facet: Boolean
  weight: Int
  long_name: String
  short_name: String
  public: Boolean
  short_description: String
  field_number: String
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
  display_type: String
  permitted_values: [String]
  placeholder: String
}

input CandidateInsertInput {
  match: Boolean!
  image_url: String
  matching_harm_keywords: [String]
  epoch_date_downloaded: Int
  epoch_date_published: Int
  language: String
  text: String
  _id: ObjectId
  embedding: CandidateEmbeddingInsertInput
  matching_keywords: [String]
  dismissed: Boolean
  url: String!
  date_downloaded: String
  source_domain: String
  plain_text: String
  matching_entities: [String]
  title: String
  authors: [String]
  similarity: Float
  classification_similarity: [CandidateClassification_similarityInsertInput]
  date_published: String
}

enum ReportSortByInput {
  TITLE_ASC
  TITLE_DESC
  USER_ASC
  DESCRIPTION_ASC
  IMAGE_URL_ASC
  REPORT_NUMBER_DESC
  REPORT_NUMBER_ASC
  SOURCE_DOMAIN_DESC
  CLOUDINARY_ID_DESC
  DATE_PUBLISHED_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_PUBLISHED_ASC
  TEXT_ASC
  USER_DESC
  _ID_DESC
  DATE_DOWNLOADED_DESC
  DATE_SUBMITTED_ASC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_MODIFIED_DESC
  PLAIN_TEXT_DESC
  URL_ASC
  URL_DESC
  EDITOR_NOTES_ASC
  EPOCH_DATE_SUBMITTED_ASC
  EPOCH_DATE_SUBMITTED_DESC
  IMAGE_URL_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_DESC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_MODIFIED_ASC
  PLAIN_TEXT_ASC
  TEXT_DESC
  _ID_ASC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_ASC
  LANGUAGE_ASC
  LANGUAGE_DESC
  SOURCE_DOMAIN_ASC
  DATE_MODIFIED_DESC
  DATE_SUBMITTED_DESC
  EDITOR_NOTES_DESC
}

type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input ReportUpdateInput {
  embedding: ReportEmbeddingUpdateInput
  user: ReportUserRelationInput
  cloudinary_id_unset: Boolean
  date_submitted_unset: Boolean
  tags: [String]
  epoch_date_downloaded: Int
  date_downloaded: DateTime
  is_incident_report: Boolean
  inputs_outputs: [String]
  _id: ObjectId
  report_number_unset: Boolean
  image_url_unset: Boolean
  date_published_unset: Boolean
  epoch_date_published: Int
  editor_notes: String
  language: String
  image_url: String
  embedding_unset: Boolean
  source_domain: String
  description: String
  date_downloaded_unset: Boolean
  plain_text: String
  epoch_date_submitted_unset: Boolean
  date_modified: DateTime
  epoch_date_published_unset: Boolean
  epoch_date_downloaded_inc: Int
  title: String
  language_unset: Boolean
  flag: Boolean
  authors_unset: Boolean
  text_unset: Boolean
  date_submitted: DateTime
  description_unset: Boolean
  tags_unset: Boolean
  is_incident_report_unset: Boolean
  epoch_date_published_inc: Int
  url: String
  submitters_unset: Boolean
  date_published: DateTime
  quiet_unset: Boolean
  date_modified_unset: Boolean
  epoch_date_modified_unset: Boolean
  flag_unset: Boolean
  quiet: Boolean
  text: String
  plain_text_unset: Boolean
  report_number_inc: Int
  title_unset: Boolean
  epoch_date_modified: Int
  epoch_date_submitted: Int
  inputs_outputs_unset: Boolean
  report_number: Int
  epoch_date_submitted_inc: Int
  url_unset: Boolean
  submitters: [String]
  epoch_date_downloaded_unset: Boolean
  cloudinary_id: String
  user_unset: Boolean
  source_domain_unset: Boolean
  _id_unset: Boolean
  authors: [String]
  editor_notes_unset: Boolean
  epoch_date_modified_inc: Int
}

input ReportEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input EntityInsertInput {
  name: String!
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
}

input GetUserInput {
  userId: ObjectId
}

input ChecklistRiskPrecedentUpdateInput {
  incident_id: Int
  title: String
  incident_id_unset: Boolean
  title_unset: Boolean
  description: String
  description_unset: Boolean
  tags: [String]
  incident_id_inc: Int
  tags_unset: Boolean
}

input IncidentEmbeddingUpdateInput {
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

enum ClassificationSortByInput {
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
  _ID_ASC
  _ID_DESC
  NAMESPACE_ASC
}

type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input SubmissionNlp_similar_incidentUpdateInput {
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
}

input History_reportEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
}

input History_reportQueryInput {
  epoch_date_downloaded_exists: Boolean
  report_number_ne: Int
  plain_text_lte: String
  epoch_date_downloaded: Int
  report_number: Int
  inputs_outputs_nin: [String]
  source_domain_gte: String
  cloudinary_id_gte: String
  epoch_date_published_exists: Boolean
  epoch_date_published_ne: Int
  user_gt: String
  date_published_gt: DateTime
  flag: Boolean
  description: String
  modifiedBy_in: [String]
  plain_text_gt: String
  title_exists: Boolean
  image_url_in: [String]
  epoch_date_published_gte: Int
  epoch_date_published_in: [Int]
  date_downloaded_ne: DateTime
  epoch_date_downloaded_nin: [Int]
  language_gt: String
  editor_notes_in: [String]
  epoch_date_modified_nin: [Int]
  cloudinary_id_in: [String]
  user_gte: String
  source_domain_lt: String
  epoch_date_downloaded_lt: Int
  _id_ne: ObjectId
  report_number_exists: Boolean
  submitters_exists: Boolean
  quiet_exists: Boolean
  image_url_gte: String
  epoch_date_downloaded_ne: Int
  embedding_exists: Boolean
  epoch_date_published_nin: [Int]
  date_published: DateTime
  authors_in: [String]
  date_published_lt: DateTime
  plain_text_in: [String]
  modifiedBy_lt: String
  description_lte: String
  _id_lte: ObjectId
  user: String
  epoch_date_modified_in: [Int]
  cloudinary_id: String
  epoch_date_submitted_gt: Int
  editor_notes_lt: String
  url_lt: String
  _id_gt: ObjectId
  language_gte: String
  description_gt: String
  date_modified_lt: DateTime
  epoch_date_submitted_lt: Int
  title_gte: String
  epoch_date_submitted_exists: Boolean
  editor_notes_nin: [String]
  language_in: [String]
  report_number_gt: Int
  epoch_date_modified_gte: Int
  modifiedBy: String
  cloudinary_id_lte: String
  is_incident_report_ne: Boolean
  editor_notes_gt: String
  text: String
  flag_ne: Boolean
  authors_nin: [String]
  user_in: [String]
  date_published_lte: DateTime
  date_modified_gt: DateTime
  epoch_date_modified_ne: Int
  source_domain_nin: [String]
  modifiedBy_lte: String
  text_lt: String
  date_published_exists: Boolean
  url: String
  date_submitted: DateTime
  report_number_lt: Int
  epoch_date_modified: Int
  tags_in: [String]
  cloudinary_id_nin: [String]
  date_modified: DateTime
  description_in: [String]
  image_url_ne: String
  language_lte: String
  modifiedBy_gt: String
  plain_text_gte: String
  modifiedBy_ne: String
  _id_lt: ObjectId
  epoch_date_submitted_in: [Int]
  is_incident_report_exists: Boolean
  inputs_outputs: [String]
  date_published_gte: DateTime
  text_in: [String]
  title_gt: String
  image_url_lt: String
  user_lte: String
  date_published_ne: DateTime
  cloudinary_id_lt: String
  date_downloaded_lt: DateTime
  date_modified_gte: DateTime
  text_ne: String
  _id_in: [ObjectId]
  date_downloaded_exists: Boolean
  language_ne: String
  epoch_date_modified_lt: Int
  date_modified_ne: DateTime
  report_number_gte: Int
  editor_notes: String
  authors: [String]
  epoch_date_downloaded_gte: Int
  url_in: [String]
  text_lte: String
  inputs_outputs_exists: Boolean
  user_lt: String
  editor_notes_ne: String
  description_ne: String
  description_lt: String
  source_domain_gt: String
  language: String
  editor_notes_gte: String
  date_submitted_gte: DateTime
  date_submitted_ne: DateTime
  OR: [History_reportQueryInput!]
  epoch_date_submitted_nin: [Int]
  epoch_date_modified_lte: Int
  user_exists: Boolean
  inputs_outputs_in: [String]
  epoch_date_published_lte: Int
  quiet_ne: Boolean
  editor_notes_lte: String
  modifiedBy_nin: [String]
  date_modified_nin: [DateTime]
  date_published_in: [DateTime]
  tags_exists: Boolean
  source_domain_exists: Boolean
  epoch_date_modified_exists: Boolean
  is_incident_report: Boolean
  plain_text_lt: String
  image_url_lte: String
  modifiedBy_exists: Boolean
  date_submitted_in: [DateTime]
  title_lte: String
  title_nin: [String]
  url_exists: Boolean
  source_domain_lte: String
  editor_notes_exists: Boolean
  date_submitted_exists: Boolean
  date_downloaded_gt: DateTime
  cloudinary_id_ne: String
  title: String
  plain_text_exists: Boolean
  report_number_lte: Int
  description_gte: String
  url_gt: String
  epoch_date_published: Int
  date_submitted_lte: DateTime
  plain_text_nin: [String]
  text_gt: String
  epoch_date_published_lt: Int
  embedding: History_reportEmbeddingQueryInput
  plain_text_ne: String
  title_in: [String]
  quiet: Boolean
  AND: [History_reportQueryInput!]
  plain_text: String
  language_nin: [String]
  _id_gte: ObjectId
  language_exists: Boolean
  submitters_in: [String]
  source_domain: String
  tags_nin: [String]
  user_nin: [String]
  description_exists: Boolean
  submitters_nin: [String]
  epoch_date_submitted_lte: Int
  epoch_date_published_gt: Int
  epoch_date_modified_gt: Int
  _id: ObjectId
  image_url: String
  report_number_nin: [Int]
  date_published_nin: [DateTime]
  title_ne: String
  text_gte: String
  date_modified_exists: Boolean
  date_submitted_lt: DateTime
  language_lt: String
  epoch_date_submitted_gte: Int
  date_downloaded_in: [DateTime]
  epoch_date_submitted: Int
  date_submitted_gt: DateTime
  user_ne: String
  authors_exists: Boolean
  url_gte: String
  date_submitted_nin: [DateTime]
  _id_nin: [ObjectId]
  url_ne: String
  flag_exists: Boolean
  date_downloaded_gte: DateTime
  date_downloaded: DateTime
  cloudinary_id_exists: Boolean
  cloudinary_id_gt: String
  date_downloaded_nin: [DateTime]
  image_url_exists: Boolean
  image_url_nin: [String]
  epoch_date_downloaded_in: [Int]
  url_lte: String
  epoch_date_submitted_ne: Int
  epoch_date_downloaded_gt: Int
  report_number_in: [Int]
  text_exists: Boolean
  submitters: [String]
  text_nin: [String]
  image_url_gt: String
  date_downloaded_lte: DateTime
  description_nin: [String]
  tags: [String]
  _id_exists: Boolean
  title_lt: String
  url_nin: [String]
  source_domain_in: [String]
  modifiedBy_gte: String
  epoch_date_downloaded_lte: Int
  source_domain_ne: String
  date_modified_in: [DateTime]
  date_modified_lte: DateTime
}

input Entity_relationshipInsertInput {
  is_symmetric: Boolean
  pred: String!
  _id: ObjectId
  created_at: DateTime
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

input SubmissionEmbeddingQueryInput {
  from_text_hash_gt: String
  from_text_hash_ne: String
  from_text_hash_gte: String
  from_text_hash_lte: String
  OR: [SubmissionEmbeddingQueryInput!]
  from_text_hash: String
  from_text_hash_in: [String]
  vector: [Float]
  from_text_hash_exists: Boolean
  from_text_hash_lt: String
  AND: [SubmissionEmbeddingQueryInput!]
  vector_in: [Float]
  vector_exists: Boolean
  vector_nin: [Float]
  from_text_hash_nin: [String]
}

input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}

input TaxaUpdateInput {
  complete_entities: Boolean
  field_list_unset: Boolean
  complete_entities_unset: Boolean
  weight: Int
  namespace_unset: Boolean
  description_unset: Boolean
  weight_unset: Boolean
  weight_inc: Int
  _id_unset: Boolean
  _id: ObjectId
  dummy_fields: [TaxaDummy_fieldUpdateInput]
  dummy_fields_unset: Boolean
  namespace: String
  field_list: [TaxaField_listUpdateInput]
  description: String
}

input RisksInput {
  tags: [String]
}

input TaxaField_listItem_fieldComplete_fromInsertInput {
  all: [String]
  current: [String]
  entities: Boolean
}

input IncidentNlp_similar_incidentInsertInput {
  similarity: Float
  incident_id: Int
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

input ReportUserRelationInput {
  create: UserInsertInput
  link: String
}

input TaxaField_listQueryInput {
  field_number_gt: String
  item_fields_exists: Boolean
  weight_ne: Int
  default_exists: Boolean
  complete_from: TaxaField_listComplete_fromQueryInput
  short_description_gt: String
  long_name_exists: Boolean
  long_name_ne: String
  placeholder_gt: String
  placeholder_lt: String
  weight_exists: Boolean
  field_number_lt: String
  short_description: String
  weight_gt: Int
  public_ne: Boolean
  hide_search_ne: Boolean
  short_description_in: [String]
  default_lt: String
  long_name: String
  mongo_type_ne: String
  public: Boolean
  display_type_exists: Boolean
  item_fields: TaxaField_listItem_fieldQueryInput
  field_number_gte: String
  short_description_lte: String
  long_name_in: [String]
  display_type: String
  weight_lte: Int
  short_name_gte: String
  placeholder_ne: String
  default_gt: String
  default_nin: [String]
  display_type_gt: String
  placeholder_gte: String
  instant_facet_ne: Boolean
  permitted_values_exists: Boolean
  field_number_lte: String
  mongo_type_lt: String
  field_number: String
  short_name_gt: String
  placeholder: String
  instant_facet: Boolean
  long_description_gt: String
  short_description_nin: [String]
  long_description_lt: String
  weight: Int
  placeholder_nin: [String]
  placeholder_exists: Boolean
  mongo_type_in: [String]
  short_name_in: [String]
  short_description_gte: String
  placeholder_in: [String]
  field_number_ne: String
  short_name_lt: String
  default_gte: String
  display_type_lt: String
  short_description_ne: String
  field_number_in: [String]
  long_description_nin: [String]
  mongo_type_exists: Boolean
  hide_search: Boolean
  instant_facet_exists: Boolean
  display_type_lte: String
  short_name_ne: String
  short_description_exists: Boolean
  long_description_ne: String
  required: Boolean
  mongo_type_gt: String
  long_name_gte: String
  mongo_type: String
  display_type_nin: [String]
  AND: [TaxaField_listQueryInput!]
  hide_search_exists: Boolean
  field_number_exists: Boolean
  long_name_lt: String
  weight_gte: Int
  permitted_values: [String]
  long_name_gt: String
  placeholder_lte: String
  display_type_gte: String
  default_ne: String
  short_name_nin: [String]
  weight_in: [Int]
  weight_nin: [Int]
  default_lte: String
  permitted_values_in: [String]
  default: String
  short_description_lt: String
  mongo_type_lte: String
  long_description_in: [String]
  complete_from_exists: Boolean
  long_name_lte: String
  short_name: String
  weight_lt: Int
  display_type_ne: String
  required_exists: Boolean
  mongo_type_gte: String
  long_description_gte: String
  long_name_nin: [String]
  display_type_in: [String]
  short_name_exists: Boolean
  long_description: String
  permitted_values_nin: [String]
  required_ne: Boolean
  default_in: [String]
  long_description_exists: Boolean
  mongo_type_nin: [String]
  short_name_lte: String
  long_description_lte: String
  OR: [TaxaField_listQueryInput!]
  public_exists: Boolean
  field_number_nin: [String]
}

type TaxaField_listComplete_from {
  all: [String]
  current: [String]
}

enum QuickaddSortByInput {
  URL_DESC
  _ID_ASC
  DATE_SUBMITTED_ASC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  SOURCE_DOMAIN_DESC
  _ID_DESC
  DATE_SUBMITTED_DESC
  SOURCE_DOMAIN_ASC
  URL_ASC
}

type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input ClassificationAttributeInsertInput {
  short_name: String
  value_json: String
}

input SubmissionEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}
`;
