import gql from "graphql-tag";

export default gql`
type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}

input IncidentAllegedDeveloperOfAISystemRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input SubmissionHarmed_partiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input History_incidentTsneUpdateInput {
  x_unset: Boolean
  y: Float
  y_unset: Boolean
  y_inc: Float
  x: Float
  x_inc: Float
}

type LogIncidentHistoryPayload {
  incident_id: Int
}

input TaxaField_listItem_fieldComplete_fromQueryInput {
  entities_ne: Boolean
  entities_exists: Boolean
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  current: [String]
  current_exists: Boolean
  all_exists: Boolean
  current_nin: [String]
  all_in: [String]
  current_in: [String]
  entities: Boolean
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all: [String]
  all_nin: [String]
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

input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input IncidentTsneUpdateInput {
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
  x_unset: Boolean
  y: Float
}

input TaxaDummy_fieldInsertInput {
  field_number: String
  short_name: String
}

type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}

input ChecklistRiskUpdateInput {
  severity_unset: Boolean
  generated: Boolean
  likelihood_unset: Boolean
  precedents_unset: Boolean
  risk_status_unset: Boolean
  touched: Boolean
  precedents: [ChecklistRiskPrecedentUpdateInput]
  severity: String
  tags_unset: Boolean
  likelihood: String
  id: String
  risk_status: String
  title: String
  generated_unset: Boolean
  touched_unset: Boolean
  id_unset: Boolean
  risk_notes: String
  tags: [String]
  risk_notes_unset: Boolean
  title_unset: Boolean
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
  history_incidents(limit: Int = 100, sortBy: History_incidentSortByInput, query: History_incidentQueryInput): [History_incident]!
  history_report(query: History_reportQueryInput): History_report
  history_reports(query: History_reportQueryInput, limit: Int = 100, sortBy: History_reportSortByInput): [History_report]!
  incident(query: IncidentQueryInput): Incident
  incidents(query: IncidentQueryInput, limit: Int = 100, sortBy: IncidentSortByInput): [Incident]!
  notification(query: NotificationQueryInput): Notification
  notifications(sortBy: NotificationSortByInput, query: NotificationQueryInput, limit: Int = 100): [Notification]!
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
  taxas(query: TaxaQueryInput, limit: Int = 100, sortBy: TaxaSortByInput): [Taxa]!
  user(query: UserQueryInput): User
  users(limit: Int = 100, sortBy: UserSortByInput, query: UserQueryInput): [User]!
}

type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input IncidentTsneQueryInput {
  y_lt: Float
  y_ne: Float
  x_in: [Float]
  x: Float
  x_ne: Float
  y_gte: Float
  AND: [IncidentTsneQueryInput!]
  x_nin: [Float]
  y_in: [Float]
  OR: [IncidentTsneQueryInput!]
  y: Float
  x_lte: Float
  x_gte: Float
  y_exists: Boolean
  y_lte: Float
  x_exists: Boolean
  x_lt: Float
  y_nin: [Float]
  x_gt: Float
  y_gt: Float
}

input SubmissionImplicated_systemsRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input IncidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input TaxaField_listItem_fieldComplete_fromUpdateInput {
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  entities: Boolean
  entities_unset: Boolean
  all: [String]
}

scalar Long

type Taxa {
  _id: ObjectId
  complete_entities: Boolean
  description: String
  dummy_fields: [TaxaDummy_field]
  field_list: [TaxaField_list]
  namespace: String
  weight: Int
}

input NotificationQueryInput {
  processed_exists: Boolean
  type_gt: String
  _id_in: [ObjectId]
  _id_ne: ObjectId
  incident_id_lt: Int
  type_lt: String
  incident_id_gte: Int
  _id_lt: ObjectId
  incident_id_nin: [Int]
  incident_id_gt: Int
  userId_exists: Boolean
  incident_id_lte: Int
  incident_id_in: [Int]
  sentDate_nin: [DateTime]
  _id_lte: ObjectId
  sentDate: DateTime
  _id_gte: ObjectId
  incident_id_exists: Boolean
  type: String
  _id_exists: Boolean
  processed_ne: Boolean
  type_gte: String
  AND: [NotificationQueryInput!]
  type_lte: String
  incident_id_ne: Int
  processed: Boolean
  sentDate_lte: DateTime
  type_in: [String]
  _id: ObjectId
  sentDate_gte: DateTime
  sentDate_gt: DateTime
  userId: UserQueryInput
  sentDate_exists: Boolean
  type_nin: [String]
  type_ne: String
  OR: [NotificationQueryInput!]
  _id_nin: [ObjectId]
  incident_id: Int
  sentDate_in: [DateTime]
  sentDate_ne: DateTime
  sentDate_lt: DateTime
  type_exists: Boolean
  _id_gt: ObjectId
}

input ClassificationAttributeQueryInput {
  short_name_nin: [String]
  short_name_gte: String
  value_json_ne: String
  AND: [ClassificationAttributeQueryInput!]
  short_name_in: [String]
  value_json_lte: String
  value_json_nin: [String]
  short_name_exists: Boolean
  OR: [ClassificationAttributeQueryInput!]
  value_json: String
  short_name_lte: String
  short_name_lt: String
  short_name: String
  value_json_gt: String
  value_json_lt: String
  value_json_gte: String
  short_name_ne: String
  value_json_in: [String]
  short_name_gt: String
  value_json_exists: Boolean
}

input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input ClassificationUpdateInput {
  reports_unset: Boolean
  _id: ObjectId
  notes_unset: Boolean
  reports: ClassificationReportsRelationInput
  namespace_unset: Boolean
  publish: Boolean
  publish_unset: Boolean
  incidents_unset: Boolean
  attributes_unset: Boolean
  attributes: [ClassificationAttributeUpdateInput]
  incidents: ClassificationIncidentsRelationInput
  _id_unset: Boolean
  namespace: String
  notes: String
}

input History_reportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input SubscriptionInsertInput {
  _id: ObjectId
  entityId: SubscriptionEntityIdRelationInput
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
  userId: SubscriptionUserIdRelationInput!
}

input CandidateEmbeddingQueryInput {
  from_text_hash_gt: String
  from_text_hash_gte: String
  vector_exists: Boolean
  vector: [Float]
  from_text_hash_in: [String]
  AND: [CandidateEmbeddingQueryInput!]
  vector_nin: [Float]
  OR: [CandidateEmbeddingQueryInput!]
  from_text_hash_ne: String
  from_text_hash_exists: Boolean
  from_text_hash: String
  from_text_hash_lt: String
  vector_in: [Float]
  from_text_hash_lte: String
  from_text_hash_nin: [String]
}

type IncidentTsne {
  x: Float
  y: Float
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

input SubmissionEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
}

input TaxaField_listUpdateInput {
  default_unset: Boolean
  placeholder_unset: Boolean
  permitted_values_unset: Boolean
  display_type: String
  placeholder: String
  instant_facet_unset: Boolean
  mongo_type_unset: Boolean
  short_description_unset: Boolean
  hide_search: Boolean
  mongo_type: String
  short_name: String
  field_number_unset: Boolean
  public_unset: Boolean
  long_description_unset: Boolean
  weight: Int
  complete_from: TaxaField_listComplete_fromUpdateInput
  complete_from_unset: Boolean
  display_type_unset: Boolean
  item_fields_unset: Boolean
  permitted_values: [String]
  long_name: String
  item_fields: TaxaField_listItem_fieldUpdateInput
  weight_unset: Boolean
  short_description: String
  required_unset: Boolean
  weight_inc: Int
  public: Boolean
  field_number: String
  hide_search_unset: Boolean
  short_name_unset: Boolean
  instant_facet: Boolean
  long_description: String
  long_name_unset: Boolean
  default: String
  required: Boolean
}

type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input QuickaddQueryInput {
  _id_ne: ObjectId
  date_submitted: String
  source_domain: String
  date_submitted_in: [String]
  url_in: [String]
  source_domain_in: [String]
  url_gt: String
  source_domain_nin: [String]
  source_domain_gte: String
  url_gte: String
  date_submitted_gt: String
  incident_id_exists: Boolean
  incident_id_nin: [Long]
  _id_gt: ObjectId
  OR: [QuickaddQueryInput!]
  url_lt: String
  _id: ObjectId
  url_lte: String
  url_ne: String
  source_domain_exists: Boolean
  AND: [QuickaddQueryInput!]
  _id_nin: [ObjectId]
  incident_id_ne: Long
  incident_id_lte: Long
  incident_id_lt: Long
  source_domain_lt: String
  _id_gte: ObjectId
  _id_lte: ObjectId
  _id_in: [ObjectId]
  url_exists: Boolean
  date_submitted_exists: Boolean
  date_submitted_gte: String
  url: String
  _id_exists: Boolean
  incident_id_gte: Long
  source_domain_gt: String
  date_submitted_lte: String
  incident_id_gt: Long
  incident_id_in: [Long]
  source_domain_ne: String
  date_submitted_nin: [String]
  incident_id: Long
  url_nin: [String]
  date_submitted_ne: String
  source_domain_lte: String
  _id_lt: ObjectId
  date_submitted_lt: String
}

enum DuplicateSortByInput {
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
  _ID_ASC
  _ID_DESC
  DUPLICATE_INCIDENT_NUMBER_ASC
}

type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}

enum History_incidentSortByInput {
  TITLE_DESC
  DATE_DESC
  DESCRIPTION_ASC
  MODIFIEDBY_DESC
  INCIDENT_ID_DESC
  DATE_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_ASC
  _ID_DESC
  TITLE_ASC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_ID_ASC
  MODIFIEDBY_ASC
  _ID_ASC
  DESCRIPTION_DESC
  EDITOR_NOTES_ASC
}

type History_incidentTsne {
  x: Float
  y: Float
}

input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input ReportUpdateInput {
  authors: [String]
  date_published: DateTime
  plain_text: String
  inputs_outputs: [String]
  image_url_unset: Boolean
  language: String
  editor_notes: String
  url_unset: Boolean
  report_number_unset: Boolean
  epoch_date_downloaded_inc: Int
  title_unset: Boolean
  epoch_date_downloaded: Int
  inputs_outputs_unset: Boolean
  source_domain: String
  date_modified: DateTime
  quiet_unset: Boolean
  date_downloaded: DateTime
  epoch_date_published: Int
  epoch_date_submitted_unset: Boolean
  user_unset: Boolean
  submitters_unset: Boolean
  report_number: Int
  flag_unset: Boolean
  is_incident_report_unset: Boolean
  description_unset: Boolean
  date_downloaded_unset: Boolean
  submitters: [String]
  tags: [String]
  date_submitted_unset: Boolean
  epoch_date_published_unset: Boolean
  tags_unset: Boolean
  text: String
  cloudinary_id_unset: Boolean
  date_submitted: DateTime
  epoch_date_published_inc: Int
  epoch_date_submitted: Int
  epoch_date_modified_unset: Boolean
  embedding: ReportEmbeddingUpdateInput
  user: ReportUserRelationInput
  text_unset: Boolean
  _id: ObjectId
  epoch_date_modified_inc: Int
  cloudinary_id: String
  embedding_unset: Boolean
  date_published_unset: Boolean
  language_unset: Boolean
  date_modified_unset: Boolean
  report_number_inc: Int
  flag: Boolean
  is_incident_report: Boolean
  image_url: String
  source_domain_unset: Boolean
  epoch_date_submitted_inc: Int
  authors_unset: Boolean
  _id_unset: Boolean
  description: String
  quiet: Boolean
  url: String
  epoch_date_downloaded_unset: Boolean
  epoch_date_modified: Int
  plain_text_unset: Boolean
  editor_notes_unset: Boolean
  title: String
}

type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input History_reportEmbeddingQueryInput {
  OR: [History_reportEmbeddingQueryInput!]
  from_text_hash_exists: Boolean
  from_text_hash_gte: String
  from_text_hash_lt: String
  vector_exists: Boolean
  AND: [History_reportEmbeddingQueryInput!]
  from_text_hash_ne: String
  vector_nin: [Float]
  from_text_hash: String
  from_text_hash_gt: String
  vector_in: [Float]
  from_text_hash_lte: String
  from_text_hash_in: [String]
  from_text_hash_nin: [String]
  vector: [Float]
}

type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}

input ChecklistUpdateInput {
  tags_other_unset: Boolean
  risks: [ChecklistRiskUpdateInput]
  about_unset: Boolean
  tags_other: [String]
  date_updated_unset: Boolean
  _id: ObjectId
  date_created_unset: Boolean
  tags_goals_unset: Boolean
  name: String
  name_unset: Boolean
  tags_methods: [String]
  id: String
  _id_unset: Boolean
  owner_id: String
  tags_goals: [String]
  risks_unset: Boolean
  date_updated: DateTime
  entity_id: String
  entity_id_unset: Boolean
  id_unset: Boolean
  owner_id_unset: Boolean
  date_created: DateTime
  tags_methods_unset: Boolean
  about: String
}

input CandidateInsertInput {
  title: String
  source_domain: String
  url: String!
  date_downloaded: String
  plain_text: String
  dismissed: Boolean
  language: String
  date_published: String
  embedding: CandidateEmbeddingInsertInput
  epoch_date_downloaded: Int
  epoch_date_published: Int
  authors: [String]
  matching_harm_keywords: [String]
  match: Boolean!
  similarity: Float
  classification_similarity: [CandidateClassification_similarityInsertInput]
  image_url: String
  matching_keywords: [String]
  text: String
  _id: ObjectId
  matching_entities: [String]
}

type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
}

enum IncidentSortByInput {
  _ID_ASC
  DATE_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_ASC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  EDITOR_NOTES_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  _ID_DESC
  TITLE_DESC
  DATE_DESC
  DESCRIPTION_ASC
  TITLE_ASC
}

input History_incidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

input ChecklistRiskPrecedentUpdateInput {
  incident_id: Int
  description_unset: Boolean
  incident_id_inc: Int
  incident_id_unset: Boolean
  tags: [String]
  tags_unset: Boolean
  description: String
  title: String
  title_unset: Boolean
}

input UserUpdateInput {
  last_name: String
  roles_unset: Boolean
  userId_unset: Boolean
  _id: ObjectId
  roles: [String]
  first_name_unset: Boolean
  userId: String
  _id_unset: Boolean
  first_name: String
  last_name_unset: Boolean
}

input DuplicateQueryInput {
  true_incident_number_nin: [Int]
  OR: [DuplicateQueryInput!]
  duplicate_incident_number_nin: [Int]
  duplicate_incident_number_gte: Int
  duplicate_incident_number_lte: Int
  duplicate_incident_number: Int
  true_incident_number: Int
  true_incident_number_lte: Int
  true_incident_number_ne: Int
  duplicate_incident_number_in: [Int]
  AND: [DuplicateQueryInput!]
  _id_lte: ObjectId
  duplicate_incident_number_exists: Boolean
  true_incident_number_in: [Int]
  true_incident_number_exists: Boolean
  _id: ObjectId
  duplicate_incident_number_gt: Int
  true_incident_number_gte: Int
  _id_lt: ObjectId
  _id_in: [ObjectId]
  _id_gt: ObjectId
  _id_exists: Boolean
  true_incident_number_lt: Int
  duplicate_incident_number_ne: Int
  _id_nin: [ObjectId]
  _id_gte: ObjectId
  duplicate_incident_number_lt: Int
  _id_ne: ObjectId
  true_incident_number_gt: Int
}

input SubmissionQueryInput {
  date_modified_in: [String]
  cloudinary_id: String
  incident_ids_in: [Int]
  date_published_lt: String
  description_ne: String
  title_lte: String
  status_gt: String
  description_lte: String
  date_submitted_gte: String
  editor_notes_exists: Boolean
  epoch_date_modified_ne: Int
  _id: ObjectId
  date_published_exists: Boolean
  image_url_in: [String]
  text_ne: String
  implicated_systems_nin: [EntityQueryInput]
  description_lt: String
  title_nin: [String]
  editor_dissimilar_incidents_nin: [Int]
  date_modified_exists: Boolean
  epoch_date_modified_gte: Int
  developers_exists: Boolean
  language_gte: String
  editor_dissimilar_incidents: [Int]
  tags_in: [String]
  editor_notes_nin: [String]
  incident_date_exists: Boolean
  source_domain_lte: String
  epoch_date_modified: Int
  editor_notes_gte: String
  quiet_ne: Boolean
  plain_text_gte: String
  text_gte: String
  cloudinary_id_gt: String
  language_lte: String
  date_modified_ne: String
  AND: [SubmissionQueryInput!]
  date_submitted_ne: String
  plain_text_nin: [String]
  editor_similar_incidents_in: [Int]
  developers: [EntityQueryInput]
  embedding: SubmissionEmbeddingQueryInput
  language: String
  submitters_nin: [String]
  date_published_gt: String
  tags_exists: Boolean
  implicated_systems_exists: Boolean
  plain_text_gt: String
  image_url_exists: Boolean
  incident_title_exists: Boolean
  _id_in: [ObjectId]
  date_downloaded_lte: String
  tags_nin: [String]
  status: String
  status_in: [String]
  image_url_lte: String
  incident_date_in: [String]
  user_exists: Boolean
  harmed_parties_in: [EntityQueryInput]
  text_in: [String]
  editor_dissimilar_incidents_in: [Int]
  text: String
  plain_text_lte: String
  submitters_in: [String]
  date_downloaded_exists: Boolean
  date_submitted_lte: String
  description_gte: String
  source_domain_exists: Boolean
  date_modified_gt: String
  plain_text_in: [String]
  image_url_gte: String
  epoch_date_modified_gt: Int
  date_downloaded_nin: [String]
  quiet: Boolean
  title_lt: String
  editor_notes_in: [String]
  editor_notes_lte: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  OR: [SubmissionQueryInput!]
  status_lte: String
  editor_dissimilar_incidents_exists: Boolean
  language_lt: String
  url_lt: String
  _id_exists: Boolean
  incident_date_lte: String
  epoch_date_modified_nin: [Int]
  date_modified_gte: String
  language_gt: String
  incident_title_gt: String
  editor_notes_ne: String
  cloudinary_id_in: [String]
  description: String
  source_domain_gte: String
  date_downloaded_gte: String
  date_downloaded_gt: String
  status_ne: String
  description_exists: Boolean
  date_published_nin: [String]
  incident_date_gte: String
  submitters: [String]
  date_submitted_exists: Boolean
  title_in: [String]
  authors_exists: Boolean
  harmed_parties: [EntityQueryInput]
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  epoch_date_modified_exists: Boolean
  incident_title_lt: String
  text_lt: String
  tags: [String]
  cloudinary_id_exists: Boolean
  url_exists: Boolean
  title: String
  image_url_gt: String
  nlp_similar_incidents_exists: Boolean
  plain_text: String
  authors_in: [String]
  incident_title_gte: String
  incident_date: String
  date_downloaded_in: [String]
  description_nin: [String]
  implicated_systems: [EntityQueryInput]
  date_downloaded_ne: String
  editor_similar_incidents_exists: Boolean
  harmed_parties_exists: Boolean
  cloudinary_id_lt: String
  date_modified_nin: [String]
  incident_ids_nin: [Int]
  date_modified: String
  date_submitted_in: [String]
  _id_lte: ObjectId
  date_submitted_gt: String
  incident_date_gt: String
  date_published_ne: String
  epoch_date_modified_in: [Int]
  image_url_ne: String
  developers_in: [EntityQueryInput]
  image_url_nin: [String]
  source_domain_nin: [String]
  authors: [String]
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  title_exists: Boolean
  text_lte: String
  deployers_in: [EntityQueryInput]
  _id_lt: ObjectId
  incident_date_lt: String
  description_in: [String]
  language_exists: Boolean
  source_domain: String
  plain_text_ne: String
  title_gte: String
  date_submitted_lt: String
  date_modified_lte: String
  date_published_gte: String
  _id_gt: ObjectId
  source_domain_ne: String
  language_ne: String
  source_domain_gt: String
  incident_editors_exists: Boolean
  deployers: [EntityQueryInput]
  date_submitted: String
  authors_nin: [String]
  editor_notes_gt: String
  quiet_exists: Boolean
  _id_gte: ObjectId
  image_url: String
  url_nin: [String]
  editor_notes_lt: String
  embedding_exists: Boolean
  date_published_lte: String
  image_url_lt: String
  editor_notes: String
  status_nin: [String]
  incident_date_ne: String
  url_gte: String
  epoch_date_modified_lte: Int
  incident_title: String
  date_downloaded: String
  status_lt: String
  editor_similar_incidents: [Int]
  language_nin: [String]
  date_submitted_nin: [String]
  text_nin: [String]
  implicated_systems_in: [EntityQueryInput]
  text_exists: Boolean
  cloudinary_id_nin: [String]
  date_downloaded_lt: String
  deployers_exists: Boolean
  incident_title_ne: String
  incident_editors_nin: [UserQueryInput]
  incident_title_nin: [String]
  editor_similar_incidents_nin: [Int]
  url: String
  cloudinary_id_ne: String
  incident_title_lte: String
  url_in: [String]
  status_exists: Boolean
  text_gt: String
  epoch_date_modified_lt: Int
  date_published_in: [String]
  date_published: String
  description_gt: String
  _id_ne: ObjectId
  title_gt: String
  plain_text_lt: String
  incident_ids_exists: Boolean
  cloudinary_id_gte: String
  submitters_exists: Boolean
  title_ne: String
  source_domain_lt: String
  incident_date_nin: [String]
  status_gte: String
  incident_editors: [UserQueryInput]
  deployers_nin: [EntityQueryInput]
  incident_title_in: [String]
  language_in: [String]
  url_lte: String
  url_ne: String
  user: UserQueryInput
  harmed_parties_nin: [EntityQueryInput]
  url_gt: String
  plain_text_exists: Boolean
  date_modified_lt: String
  cloudinary_id_lte: String
  _id_nin: [ObjectId]
  incident_ids: [Int]
  source_domain_in: [String]
  incident_editors_in: [UserQueryInput]
  developers_nin: [EntityQueryInput]
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
  replaceOneHistory_incident(data: History_incidentInsertInput!, query: History_incidentQueryInput): History_incident
  replaceOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  replaceOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  replaceOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
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
  updateManySubscriptions(set: SubscriptionUpdateInput!, query: SubscriptionQueryInput): UpdateManyPayload
  updateManyTaxas(query: TaxaQueryInput, set: TaxaUpdateInput!): UpdateManyPayload
  updateManyUsers(query: UserQueryInput, set: UserUpdateInput!): UpdateManyPayload
  updateOneCandidate(query: CandidateQueryInput, set: CandidateUpdateInput!): Candidate
  updateOneChecklist(query: ChecklistQueryInput, set: ChecklistUpdateInput!): Checklist
  updateOneClassification(set: ClassificationUpdateInput!, query: ClassificationQueryInput): Classification
  updateOneDuplicate(query: DuplicateQueryInput, set: DuplicateUpdateInput!): Duplicate
  updateOneEntity(query: EntityQueryInput, set: EntityUpdateInput!): Entity
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
  upsertOneClassification(data: ClassificationInsertInput!, query: ClassificationQueryInput): Classification
  upsertOneDuplicate(data: DuplicateInsertInput!, query: DuplicateQueryInput): Duplicate
  upsertOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  upsertOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  upsertOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  upsertOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  upsertOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
  upsertOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  upsertOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  upsertOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  upsertOneSubscription(data: SubscriptionInsertInput!, query: SubscriptionQueryInput): Subscription
  upsertOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
}

input SubmissionIncident_editorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}

input IncidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

input SubscriptionEntityIdRelationInput {
  create: EntityInsertInput
  link: String
}

input History_incidentTsneQueryInput {
  y_exists: Boolean
  x_exists: Boolean
  y_ne: Float
  y_gte: Float
  x_lte: Float
  x: Float
  x_lt: Float
  x_gt: Float
  y_nin: [Float]
  OR: [History_incidentTsneQueryInput!]
  x_nin: [Float]
  AND: [History_incidentTsneQueryInput!]
  x_ne: Float
  x_in: [Float]
  y: Float
  y_gt: Float
  y_lt: Float
  y_in: [Float]
  x_gte: Float
  y_lte: Float
}

type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}

type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

enum ClassificationSortByInput {
  _ID_ASC
  _ID_DESC
  NAMESPACE_ASC
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
}

type InsertManyPayload {
  insertedIds: [ObjectId]!
}

input SubmissionNlp_similar_incidentUpdateInput {
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
}

input TaxaField_listComplete_fromUpdateInput {
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
}

input ChecklistQueryInput {
  date_updated_lt: DateTime
  id_nin: [String]
  date_created_lte: DateTime
  id_exists: Boolean
  date_created_in: [DateTime]
  about_lt: String
  date_created_ne: DateTime
  _id_exists: Boolean
  risks_nin: [ChecklistRiskQueryInput]
  date_updated_in: [DateTime]
  id: String
  date_updated_ne: DateTime
  id_gt: String
  name_gte: String
  tags_other_exists: Boolean
  tags_other_in: [String]
  name: String
  OR: [ChecklistQueryInput!]
  _id_ne: ObjectId
  owner_id_lt: String
  entity_id: String
  tags_methods: [String]
  _id_lte: ObjectId
  date_updated_nin: [DateTime]
  tags_other: [String]
  date_created_lt: DateTime
  owner_id_in: [String]
  id_gte: String
  date_created_gte: DateTime
  date_created_exists: Boolean
  about_exists: Boolean
  owner_id_gte: String
  id_lt: String
  name_ne: String
  tags_goals_exists: Boolean
  owner_id_nin: [String]
  about_lte: String
  id_ne: String
  name_nin: [String]
  name_exists: Boolean
  about_nin: [String]
  risks_in: [ChecklistRiskQueryInput]
  date_updated_exists: Boolean
  _id_gt: ObjectId
  AND: [ChecklistQueryInput!]
  name_in: [String]
  tags_goals: [String]
  date_updated_gt: DateTime
  risks: [ChecklistRiskQueryInput]
  entity_id_gte: String
  about_gte: String
  entity_id_in: [String]
  about_ne: String
  id_in: [String]
  name_lt: String
  tags_methods_exists: Boolean
  entity_id_ne: String
  tags_methods_nin: [String]
  _id_in: [ObjectId]
  risks_exists: Boolean
  date_updated: DateTime
  tags_goals_in: [String]
  entity_id_exists: Boolean
  tags_other_nin: [String]
  _id_gte: ObjectId
  date_created_nin: [DateTime]
  date_updated_gte: DateTime
  name_lte: String
  tags_goals_nin: [String]
  name_gt: String
  id_lte: String
  owner_id_ne: String
  tags_methods_in: [String]
  entity_id_lt: String
  date_created_gt: DateTime
  date_updated_lte: DateTime
  entity_id_lte: String
  date_created: DateTime
  owner_id: String
  _id_lt: ObjectId
  owner_id_exists: Boolean
  owner_id_lte: String
  about_gt: String
  _id: ObjectId
  entity_id_gt: String
  _id_nin: [ObjectId]
  owner_id_gt: String
  entity_id_nin: [String]
  about_in: [String]
  about: String
}

type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input IncidentEmbeddingQueryInput {
  vector_nin: [Float]
  from_reports: [Int]
  from_reports_nin: [Int]
  from_reports_exists: Boolean
  vector_in: [Float]
  OR: [IncidentEmbeddingQueryInput!]
  from_reports_in: [Int]
  vector: [Float]
  vector_exists: Boolean
  AND: [IncidentEmbeddingQueryInput!]
}

type IncidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

type ClassificationAttribute {
  short_name: String
  value_json: String
}

input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}

input ClassificationIncidentsRelationInput {
  create: [IncidentInsertInput]
  link: [Int]
}

input ClassificationReportsRelationInput {
  link: [Int]
  create: [ReportInsertInput]
}

input ChecklistRiskPrecedentQueryInput {
  title_exists: Boolean
  title_in: [String]
  incident_id_exists: Boolean
  tags_exists: Boolean
  incident_id: Int
  OR: [ChecklistRiskPrecedentQueryInput!]
  title: String
  tags_in: [String]
  description_in: [String]
  incident_id_in: [Int]
  incident_id_nin: [Int]
  description_lte: String
  incident_id_gt: Int
  description_nin: [String]
  incident_id_lt: Int
  tags_nin: [String]
  incident_id_gte: Int
  title_nin: [String]
  title_gt: String
  description: String
  description_lt: String
  tags: [String]
  title_gte: String
  incident_id_ne: Int
  description_gt: String
  title_lt: String
  AND: [ChecklistRiskPrecedentQueryInput!]
  description_ne: String
  description_exists: Boolean
  incident_id_lte: Int
  description_gte: String
  title_ne: String
  title_lte: String
}

input TaxaField_listItem_fieldQueryInput {
  long_description_in: [String]
  placeholder_exists: Boolean
  long_name: String
  placeholder_gte: String
  weight_gte: Int
  long_name_ne: String
  default_gte: String
  mongo_type_exists: Boolean
  short_name_gte: String
  required: Boolean
  long_name_nin: [String]
  mongo_type_nin: [String]
  required_exists: Boolean
  mongo_type_gt: String
  long_description: String
  long_name_in: [String]
  display_type_gte: String
  long_name_lte: String
  placeholder_gt: String
  short_name_in: [String]
  short_description_ne: String
  placeholder_in: [String]
  long_name_gte: String
  short_name_lte: String
  default_nin: [String]
  weight_ne: Int
  display_type_in: [String]
  display_type: String
  mongo_type_in: [String]
  required_ne: Boolean
  weight_lt: Int
  short_name_ne: String
  long_description_exists: Boolean
  display_type_gt: String
  mongo_type_lte: String
  field_number_in: [String]
  default_gt: String
  default_in: [String]
  display_type_exists: Boolean
  display_type_lt: String
  field_number_lt: String
  display_type_nin: [String]
  long_description_ne: String
  long_name_exists: Boolean
  field_number_nin: [String]
  field_number_lte: String
  default_lte: String
  field_number_gt: String
  short_name: String
  field_number_exists: Boolean
  public: Boolean
  mongo_type_lt: String
  placeholder_lt: String
  instant_facet_ne: Boolean
  weight_in: [Int]
  complete_from_exists: Boolean
  default: String
  default_exists: Boolean
  short_description_nin: [String]
  short_name_lt: String
  display_type_ne: String
  placeholder_ne: String
  permitted_values_nin: [String]
  placeholder: String
  OR: [TaxaField_listItem_fieldQueryInput!]
  short_name_exists: Boolean
  short_description_lte: String
  permitted_values_exists: Boolean
  weight_nin: [Int]
  permitted_values: [String]
  public_exists: Boolean
  long_description_lte: String
  weight_lte: Int
  long_name_lt: String
  weight_exists: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  permitted_values_in: [String]
  display_type_lte: String
  short_description_in: [String]
  short_description_exists: Boolean
  short_description_lt: String
  default_ne: String
  field_number: String
  placeholder_lte: String
  weight_gt: Int
  placeholder_nin: [String]
  instant_facet: Boolean
  mongo_type_gte: String
  instant_facet_exists: Boolean
  short_description: String
  short_description_gt: String
  field_number_ne: String
  public_ne: Boolean
  short_name_gt: String
  short_description_gte: String
  mongo_type_ne: String
  long_description_lt: String
  long_name_gt: String
  long_description_nin: [String]
  AND: [TaxaField_listItem_fieldQueryInput!]
  mongo_type: String
  long_description_gt: String
  weight: Int
  default_lt: String
  short_name_nin: [String]
  long_description_gte: String
  field_number_gte: String
}

input CreateDefaultAdminUserInput {
  password: String
  email: String
}

input EntityUpdateInput {
  name_unset: Boolean
  _id_unset: Boolean
  date_modified: DateTime
  _id: ObjectId
  name: String
  entity_id: String
  created_at_unset: Boolean
  date_modified_unset: Boolean
  entity_id_unset: Boolean
  created_at: DateTime
}

input DuplicateUpdateInput {
  duplicate_incident_number_inc: Int
  duplicate_incident_number_unset: Boolean
  true_incident_number: Int
  true_incident_number_inc: Int
  true_incident_number_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  duplicate_incident_number: Int
}

type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}

type SubmissionEmbedding {
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

input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input ChecklistInsertInput {
  owner_id: String
  tags_goals: [String]
  tags_methods: [String]
  _id: ObjectId
  risks: [ChecklistRiskInsertInput]
  tags_other: [String]
  entity_id: String
  name: String
  about: String
  date_updated: DateTime
  date_created: DateTime
  id: String
}

input TaxaUpdateInput {
  complete_entities: Boolean
  weight_unset: Boolean
  _id_unset: Boolean
  description: String
  weight_inc: Int
  _id: ObjectId
  dummy_fields_unset: Boolean
  description_unset: Boolean
  dummy_fields: [TaxaDummy_fieldUpdateInput]
  weight: Int
  namespace: String
  complete_entities_unset: Boolean
  field_list: [TaxaField_listUpdateInput]
  field_list_unset: Boolean
  namespace_unset: Boolean
}

type TaxaDummy_field {
  field_number: String
  short_name: String
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

input SubmissionInsertInput {
  plain_text: String
  url: String!
  date_modified: String!
  user: SubmissionUserRelationInput
  image_url: String!
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  language: String!
  date_downloaded: String!
  incident_title: String
  status: String
  harmed_parties: SubmissionHarmed_partiesRelationInput
  developers: SubmissionDevelopersRelationInput
  embedding: SubmissionEmbeddingInsertInput
  deployers: SubmissionDeployersRelationInput
  editor_similar_incidents: [Int]
  incident_editors: SubmissionIncident_editorsRelationInput
  epoch_date_modified: Int
  cloudinary_id: String
  date_published: String!
  incident_ids: [Int]
  date_submitted: String!
  source_domain: String!
  text: String!
  implicated_systems: SubmissionImplicated_systemsRelationInput
  title: String!
  _id: ObjectId
  submitters: [String]!
  authors: [String]!
  incident_date: String
  description: String
  tags: [String]!
  editor_dissimilar_incidents: [Int]
  quiet: Boolean
  editor_notes: String
}

input QuickaddInsertInput {
  incident_id: Long
  source_domain: String
  url: String!
  _id: ObjectId
  date_submitted: String!
}

input TaxaField_listItem_fieldUpdateInput {
  default: String
  weight_unset: Boolean
  short_description: String
  field_number_unset: Boolean
  display_type_unset: Boolean
  short_name_unset: Boolean
  long_description: String
  permitted_values_unset: Boolean
  required_unset: Boolean
  mongo_type: String
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  weight_inc: Int
  weight: Int
  public: Boolean
  instant_facet_unset: Boolean
  long_description_unset: Boolean
  short_description_unset: Boolean
  mongo_type_unset: Boolean
  complete_from_unset: Boolean
  instant_facet: Boolean
  placeholder: String
  long_name: String
  default_unset: Boolean
  field_number: String
  placeholder_unset: Boolean
  short_name: String
  display_type: String
  permitted_values: [String]
  required: Boolean
  long_name_unset: Boolean
  public_unset: Boolean
}

enum ChecklistSortByInput {
  ID_DESC
  NAME_DESC
  ABOUT_DESC
  DATE_CREATED_ASC
  OWNER_ID_DESC
  ABOUT_ASC
  DATE_UPDATED_ASC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  NAME_ASC
  OWNER_ID_ASC
  _ID_ASC
  DATE_CREATED_DESC
  ID_ASC
  _ID_DESC
  DATE_UPDATED_DESC
}

input SubscriptionQueryInput {
  type_gt: String
  type_gte: String
  type: String
  incident_id: IncidentQueryInput
  type_lte: String
  incident_id_exists: Boolean
  userId_exists: Boolean
  _id_gte: ObjectId
  type_lt: String
  type_exists: Boolean
  AND: [SubscriptionQueryInput!]
  _id: ObjectId
  _id_gt: ObjectId
  _id_in: [ObjectId]
  _id_lt: ObjectId
  _id_ne: ObjectId
  _id_nin: [ObjectId]
  type_in: [String]
  userId: UserQueryInput
  type_nin: [String]
  type_ne: String
  _id_lte: ObjectId
  OR: [SubscriptionQueryInput!]
  _id_exists: Boolean
  entityId: EntityQueryInput
  entityId_exists: Boolean
}

type AppUser {
  email: String
}

type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}

type LogReportHistoryPayload {
  report_number: Int
}

enum CandidateSortByInput {
  SIMILARITY_DESC
  TITLE_ASC
  URL_DESC
  _ID_DESC
  LANGUAGE_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  URL_ASC
  DATE_DOWNLOADED_ASC
  DATE_PUBLISHED_ASC
  IMAGE_URL_DESC
  PLAIN_TEXT_DESC
  SOURCE_DOMAIN_ASC
  SOURCE_DOMAIN_DESC
  _ID_ASC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  IMAGE_URL_ASC
  LANGUAGE_DESC
  PLAIN_TEXT_ASC
  SIMILARITY_ASC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  TITLE_DESC
  TEXT_ASC
  TEXT_DESC
}

enum ReportSortByInput {
  REPORT_NUMBER_DESC
  CLOUDINARY_ID_DESC
  DATE_MODIFIED_DESC
  LANGUAGE_DESC
  PLAIN_TEXT_ASC
  SOURCE_DOMAIN_DESC
  URL_DESC
  CLOUDINARY_ID_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_SUBMITTED_DESC
  IMAGE_URL_ASC
  USER_DESC
  _ID_ASC
  DATE_DOWNLOADED_DESC
  LANGUAGE_ASC
  TITLE_DESC
  USER_ASC
  DATE_SUBMITTED_DESC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_ASC
  TEXT_DESC
  REPORT_NUMBER_ASC
  SOURCE_DOMAIN_ASC
  EPOCH_DATE_MODIFIED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  DATE_PUBLISHED_ASC
  DATE_SUBMITTED_ASC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  PLAIN_TEXT_DESC
  TEXT_ASC
  URL_ASC
  _ID_DESC
  DATE_DOWNLOADED_ASC
  DATE_PUBLISHED_DESC
  EDITOR_NOTES_DESC
  IMAGE_URL_DESC
  TITLE_ASC
  DATE_MODIFIED_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  EPOCH_DATE_SUBMITTED_ASC
}

input IncidentNlp_similar_incidentUpdateInput {
  incident_id_unset: Boolean
  incident_id_inc: Int
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
}

input IncidentImplicated_systemsRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input CandidateEmbeddingUpdateInput {
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
}

input SubmissionNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

scalar ObjectId

input ReportEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
}

type DeleteManyPayload {
  deletedCount: Int!
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

input IncidentQueryInput {
  epoch_date_modified_lt: Int
  date_exists: Boolean
  epoch_date_modified_gte: Int
  AllegedDeployerOfAISystem: [EntityQueryInput]
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  description_in: [String]
  date_gte: String
  date: String
  description: String
  _id_exists: Boolean
  implicated_systems_in: [EntityQueryInput]
  flagged_dissimilar_incidents_nin: [Int]
  editor_notes_gte: String
  OR: [IncidentQueryInput!]
  title_ne: String
  _id_nin: [ObjectId]
  incident_id_exists: Boolean
  reports_in: [ReportQueryInput]
  editor_notes_ne: String
  tsne: IncidentTsneQueryInput
  title: String
  editor_notes: String
  implicated_systems_exists: Boolean
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  embedding: IncidentEmbeddingQueryInput
  incident_id_gte: Int
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  editor_notes_nin: [String]
  epoch_date_modified_in: [Int]
  incident_id_ne: Int
  reports_exists: Boolean
  incident_id_lt: Int
  title_gte: String
  date_ne: String
  description_ne: String
  implicated_systems_nin: [EntityQueryInput]
  editor_notes_in: [String]
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  incident_id: Int
  epoch_date_modified_exists: Boolean
  flagged_dissimilar_incidents_in: [Int]
  tsne_exists: Boolean
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  editors: [UserQueryInput]
  _id_gt: ObjectId
  epoch_date_modified_ne: Int
  implicated_systems: [EntityQueryInput]
  editor_similar_incidents: [Int]
  date_lt: String
  nlp_similar_incidents_exists: Boolean
  editor_notes_lt: String
  AllegedDeveloperOfAISystem_exists: Boolean
  incident_id_gt: Int
  _id_ne: ObjectId
  AllegedDeployerOfAISystem_exists: Boolean
  editor_similar_incidents_exists: Boolean
  incident_id_lte: Int
  editor_dissimilar_incidents_exists: Boolean
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  editor_notes_gt: String
  editor_similar_incidents_nin: [Int]
  title_nin: [String]
  epoch_date_modified: Int
  flagged_dissimilar_incidents_exists: Boolean
  title_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  _id_lte: ObjectId
  editors_exists: Boolean
  description_lt: String
  reports: [ReportQueryInput]
  date_gt: String
  editor_notes_lte: String
  AND: [IncidentQueryInput!]
  _id_in: [ObjectId]
  incident_id_in: [Int]
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  embedding_exists: Boolean
  description_gte: String
  editor_similar_incidents_in: [Int]
  editor_dissimilar_incidents: [Int]
  description_nin: [String]
  incident_id_nin: [Int]
  flagged_dissimilar_incidents: [Int]
  epoch_date_modified_lte: Int
  date_lte: String
  description_lte: String
  epoch_date_modified_nin: [Int]
  _id_gte: ObjectId
  description_exists: Boolean
  title_gt: String
  description_gt: String
  date_nin: [String]
  editors_nin: [UserQueryInput]
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  title_lte: String
  date_in: [String]
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  reports_nin: [ReportQueryInput]
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  epoch_date_modified_gt: Int
  editor_dissimilar_incidents_in: [Int]
  _id: ObjectId
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  _id_lt: ObjectId
  editors_in: [UserQueryInput]
  title_in: [String]
  title_lt: String
  editor_notes_exists: Boolean
  editor_dissimilar_incidents_nin: [Int]
}

input ReportQueryInput {
  tags_exists: Boolean
  report_number_lt: Int
  date_submitted_nin: [DateTime]
  date_modified_in: [DateTime]
  date_modified_gte: DateTime
  language_nin: [String]
  url_gt: String
  _id_nin: [ObjectId]
  cloudinary_id_gt: String
  plain_text_in: [String]
  description_gte: String
  title_in: [String]
  date_submitted_lte: DateTime
  description_lte: String
  date_published_in: [DateTime]
  cloudinary_id_in: [String]
  date_submitted_exists: Boolean
  date_published_lte: DateTime
  report_number_exists: Boolean
  date_downloaded_exists: Boolean
  embedding: ReportEmbeddingQueryInput
  tags_in: [String]
  date_modified_exists: Boolean
  plain_text: String
  date_modified_ne: DateTime
  inputs_outputs: [String]
  title_lt: String
  date_modified_nin: [DateTime]
  tags: [String]
  plain_text_ne: String
  epoch_date_published_exists: Boolean
  epoch_date_modified_gt: Int
  editor_notes_gt: String
  date_downloaded_lt: DateTime
  date_downloaded_lte: DateTime
  embedding_exists: Boolean
  plain_text_nin: [String]
  inputs_outputs_exists: Boolean
  cloudinary_id: String
  date_published_gt: DateTime
  cloudinary_id_lte: String
  epoch_date_published_lt: Int
  date_downloaded_in: [DateTime]
  description_ne: String
  date_modified_gt: DateTime
  epoch_date_published_gt: Int
  title_gte: String
  report_number: Int
  report_number_in: [Int]
  OR: [ReportQueryInput!]
  epoch_date_submitted_lte: Int
  epoch_date_downloaded_in: [Int]
  epoch_date_downloaded_gt: Int
  plain_text_lt: String
  title_nin: [String]
  source_domain_gte: String
  title_exists: Boolean
  source_domain_in: [String]
  image_url_gt: String
  _id_lte: ObjectId
  _id: ObjectId
  quiet_ne: Boolean
  date_submitted: DateTime
  report_number_nin: [Int]
  date_modified_lt: DateTime
  source_domain: String
  date_published_nin: [DateTime]
  source_domain_gt: String
  is_incident_report_exists: Boolean
  epoch_date_submitted_nin: [Int]
  tags_nin: [String]
  report_number_gt: Int
  cloudinary_id_ne: String
  epoch_date_published_lte: Int
  quiet_exists: Boolean
  url_nin: [String]
  epoch_date_submitted_in: [Int]
  editor_notes_nin: [String]
  submitters_in: [String]
  url_lte: String
  report_number_lte: Int
  inputs_outputs_in: [String]
  language_ne: String
  title: String
  epoch_date_published: Int
  description_lt: String
  submitters_nin: [String]
  title_gt: String
  authors: [String]
  epoch_date_submitted_gte: Int
  epoch_date_downloaded_nin: [Int]
  url_lt: String
  user: UserQueryInput
  url: String
  epoch_date_published_nin: [Int]
  epoch_date_downloaded_lt: Int
  is_incident_report_ne: Boolean
  title_ne: String
  authors_nin: [String]
  date_submitted_gte: DateTime
  url_exists: Boolean
  editor_notes_lte: String
  date_published_exists: Boolean
  date_downloaded_gt: DateTime
  report_number_gte: Int
  text_lt: String
  date_published_ne: DateTime
  user_exists: Boolean
  language_lte: String
  date_downloaded_nin: [DateTime]
  description_nin: [String]
  cloudinary_id_nin: [String]
  date_downloaded_gte: DateTime
  epoch_date_submitted_gt: Int
  epoch_date_submitted_ne: Int
  date_submitted_lt: DateTime
  _id_ne: ObjectId
  plain_text_lte: String
  text_in: [String]
  flag: Boolean
  epoch_date_modified_lt: Int
  flag_ne: Boolean
  _id_lt: ObjectId
  submitters: [String]
  submitters_exists: Boolean
  date_modified_lte: DateTime
  source_domain_exists: Boolean
  epoch_date_submitted_exists: Boolean
  epoch_date_modified_lte: Int
  epoch_date_published_gte: Int
  authors_exists: Boolean
  is_incident_report: Boolean
  image_url_lt: String
  date_submitted_gt: DateTime
  source_domain_lte: String
  source_domain_ne: String
  title_lte: String
  image_url: String
  report_number_ne: Int
  text_exists: Boolean
  language: String
  plain_text_gte: String
  _id_gt: ObjectId
  editor_notes_exists: Boolean
  date_downloaded: DateTime
  editor_notes: String
  epoch_date_modified_gte: Int
  date_downloaded_ne: DateTime
  authors_in: [String]
  epoch_date_downloaded_lte: Int
  cloudinary_id_gte: String
  date_submitted_ne: DateTime
  epoch_date_downloaded: Int
  language_in: [String]
  description_in: [String]
  editor_notes_ne: String
  text_gt: String
  text: String
  _id_gte: ObjectId
  description_exists: Boolean
  date_published_lt: DateTime
  text_gte: String
  editor_notes_lt: String
  language_lt: String
  description_gt: String
  epoch_date_modified_ne: Int
  url_gte: String
  inputs_outputs_nin: [String]
  epoch_date_modified_exists: Boolean
  date_submitted_in: [DateTime]
  epoch_date_downloaded_exists: Boolean
  _id_exists: Boolean
  image_url_gte: String
  cloudinary_id_exists: Boolean
  epoch_date_published_in: [Int]
  language_gt: String
  epoch_date_modified_in: [Int]
  flag_exists: Boolean
  editor_notes_in: [String]
  epoch_date_downloaded_ne: Int
  editor_notes_gte: String
  cloudinary_id_lt: String
  text_nin: [String]
  image_url_nin: [String]
  url_in: [String]
  _id_in: [ObjectId]
  language_exists: Boolean
  language_gte: String
  image_url_lte: String
  url_ne: String
  date_published: DateTime
  date_modified: DateTime
  image_url_in: [String]
  source_domain_lt: String
  plain_text_gt: String
  epoch_date_published_ne: Int
  plain_text_exists: Boolean
  text_ne: String
  epoch_date_downloaded_gte: Int
  date_published_gte: DateTime
  epoch_date_submitted_lt: Int
  epoch_date_modified_nin: [Int]
  image_url_ne: String
  epoch_date_submitted: Int
  image_url_exists: Boolean
  source_domain_nin: [String]
  quiet: Boolean
  AND: [ReportQueryInput!]
  description: String
  text_lte: String
  epoch_date_modified: Int
}

type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input ReportInsertInput {
  description: String
  title: String!
  is_incident_report: Boolean
  date_published: DateTime!
  editor_notes: String
  quiet: Boolean
  epoch_date_published: Int!
  plain_text: String!
  source_domain: String!
  date_downloaded: DateTime!
  embedding: ReportEmbeddingInsertInput
  date_submitted: DateTime!
  tags: [String]!
  url: String!
  _id: ObjectId
  authors: [String]!
  epoch_date_submitted: Int!
  language: String!
  submitters: [String]!
  cloudinary_id: String!
  flag: Boolean
  inputs_outputs: [String]
  text: String!
  image_url: String!
  epoch_date_modified: Int!
  date_modified: DateTime!
  report_number: Int!
  epoch_date_downloaded: Int!
  user: ReportUserRelationInput
}

input IncidentTsneInsertInput {
  x: Float
  y: Float
}

type CandidateClassification_similarity {
  classification: String
  similarity: Float
}

input History_reportQueryInput {
  epoch_date_modified_nin: [Int]
  user_gt: String
  url_lt: String
  epoch_date_downloaded_lt: Int
  epoch_date_modified: Int
  inputs_outputs_nin: [String]
  cloudinary_id_lt: String
  language: String
  user_nin: [String]
  epoch_date_downloaded_exists: Boolean
  url_nin: [String]
  epoch_date_submitted_ne: Int
  date_downloaded_lte: DateTime
  date_submitted_nin: [DateTime]
  date_published_nin: [DateTime]
  epoch_date_modified_exists: Boolean
  source_domain_gte: String
  _id_gt: ObjectId
  is_incident_report: Boolean
  inputs_outputs_exists: Boolean
  plain_text_nin: [String]
  text_exists: Boolean
  url_ne: String
  date_downloaded_gt: DateTime
  plain_text_lte: String
  epoch_date_published_lt: Int
  title_gte: String
  _id: ObjectId
  epoch_date_modified_gt: Int
  epoch_date_published_in: [Int]
  image_url_nin: [String]
  tags_nin: [String]
  epoch_date_modified_gte: Int
  report_number_ne: Int
  epoch_date_submitted_exists: Boolean
  epoch_date_published_ne: Int
  text_ne: String
  editor_notes_gt: String
  embedding: History_reportEmbeddingQueryInput
  date_downloaded_gte: DateTime
  source_domain_ne: String
  modifiedBy: String
  epoch_date_published_gte: Int
  epoch_date_downloaded_lte: Int
  date_modified_lt: DateTime
  image_url: String
  cloudinary_id_ne: String
  url: String
  epoch_date_submitted: Int
  plain_text: String
  text_lte: String
  _id_gte: ObjectId
  date_submitted_in: [DateTime]
  epoch_date_downloaded: Int
  is_incident_report_ne: Boolean
  embedding_exists: Boolean
  editor_notes_exists: Boolean
  cloudinary_id_lte: String
  description_nin: [String]
  source_domain_lt: String
  epoch_date_downloaded_gte: Int
  flag_exists: Boolean
  source_domain_gt: String
  editor_notes_in: [String]
  report_number_in: [Int]
  editor_notes_gte: String
  inputs_outputs_in: [String]
  _id_nin: [ObjectId]
  description: String
  user_in: [String]
  epoch_date_published_lte: Int
  date_published_gte: DateTime
  submitters_in: [String]
  date_modified_in: [DateTime]
  language_gte: String
  report_number_nin: [Int]
  source_domain_lte: String
  title_exists: Boolean
  _id_lte: ObjectId
  tags: [String]
  modifiedBy_gt: String
  inputs_outputs: [String]
  epoch_date_downloaded_nin: [Int]
  epoch_date_downloaded_ne: Int
  epoch_date_submitted_in: [Int]
  description_lt: String
  text_gt: String
  editor_notes_nin: [String]
  title_in: [String]
  epoch_date_downloaded_gt: Int
  authors_in: [String]
  quiet_exists: Boolean
  description_in: [String]
  url_gt: String
  _id_ne: ObjectId
  date_downloaded_nin: [DateTime]
  date_modified_lte: DateTime
  title: String
  date_published: DateTime
  epoch_date_published_gt: Int
  image_url_gt: String
  image_url_ne: String
  image_url_lte: String
  plain_text_gt: String
  cloudinary_id_exists: Boolean
  date_modified_nin: [DateTime]
  _id_lt: ObjectId
  epoch_date_submitted_nin: [Int]
  date_modified_gt: DateTime
  date_modified_exists: Boolean
  epoch_date_modified_lte: Int
  quiet_ne: Boolean
  date_submitted_lte: DateTime
  modifiedBy_lt: String
  source_domain: String
  text_nin: [String]
  language_gt: String
  user_ne: String
  editor_notes_lte: String
  authors_exists: Boolean
  modifiedBy_in: [String]
  title_lte: String
  modifiedBy_gte: String
  editor_notes_lt: String
  report_number_exists: Boolean
  cloudinary_id_gte: String
  image_url_exists: Boolean
  date_downloaded_exists: Boolean
  AND: [History_reportQueryInput!]
  date_submitted: DateTime
  url_exists: Boolean
  language_ne: String
  epoch_date_modified_in: [Int]
  epoch_date_modified_ne: Int
  title_nin: [String]
  date_submitted_gte: DateTime
  report_number: Int
  date_published_ne: DateTime
  authors_nin: [String]
  authors: [String]
  modifiedBy_ne: String
  language_exists: Boolean
  text_in: [String]
  epoch_date_published_exists: Boolean
  plain_text_ne: String
  user_lt: String
  title_lt: String
  date_downloaded_in: [DateTime]
  cloudinary_id_in: [String]
  epoch_date_published: Int
  flag: Boolean
  modifiedBy_nin: [String]
  plain_text_exists: Boolean
  report_number_lt: Int
  date_modified: DateTime
  plain_text_lt: String
  tags_in: [String]
  plain_text_in: [String]
  OR: [History_reportQueryInput!]
  url_in: [String]
  is_incident_report_exists: Boolean
  date_submitted_lt: DateTime
  date_published_gt: DateTime
  language_in: [String]
  text: String
  user: String
  language_lte: String
  report_number_gte: Int
  description_lte: String
  url_lte: String
  epoch_date_submitted_gte: Int
  description_gte: String
  language_lt: String
  image_url_gte: String
  _id_exists: Boolean
  epoch_date_published_nin: [Int]
  submitters_exists: Boolean
  date_published_exists: Boolean
  report_number_lte: Int
  user_gte: String
  cloudinary_id_nin: [String]
  quiet: Boolean
  cloudinary_id: String
  source_domain_exists: Boolean
  user_lte: String
  date_modified_ne: DateTime
  submitters: [String]
  epoch_date_submitted_lte: Int
  modifiedBy_exists: Boolean
  image_url_in: [String]
  epoch_date_downloaded_in: [Int]
  description_exists: Boolean
  modifiedBy_lte: String
  date_submitted_ne: DateTime
  text_lt: String
  date_submitted_exists: Boolean
  submitters_nin: [String]
  _id_in: [ObjectId]
  title_gt: String
  flag_ne: Boolean
  plain_text_gte: String
  source_domain_in: [String]
  epoch_date_submitted_lt: Int
  text_gte: String
  description_ne: String
  date_downloaded: DateTime
  title_ne: String
  cloudinary_id_gt: String
  date_submitted_gt: DateTime
  editor_notes_ne: String
  epoch_date_submitted_gt: Int
  date_published_in: [DateTime]
  report_number_gt: Int
  date_modified_gte: DateTime
  date_published_lt: DateTime
  source_domain_nin: [String]
  editor_notes: String
  epoch_date_modified_lt: Int
  date_downloaded_lt: DateTime
  description_gt: String
  date_published_lte: DateTime
  image_url_lt: String
  date_downloaded_ne: DateTime
  tags_exists: Boolean
  language_nin: [String]
  user_exists: Boolean
  url_gte: String
}

input SubscriptionIncident_idRelationInput {
  create: IncidentInsertInput
  link: Int
}

input TaxaField_listComplete_fromQueryInput {
  current: [String]
  current_nin: [String]
  OR: [TaxaField_listComplete_fromQueryInput!]
  all_in: [String]
  current_exists: Boolean
  all: [String]
  all_nin: [String]
  all_exists: Boolean
  AND: [TaxaField_listComplete_fromQueryInput!]
  current_in: [String]
}

enum SubscriptionSortByInput {
  ENTITYID_ASC
  TYPE_DESC
  USERID_ASC
  USERID_DESC
  _ID_ASC
  ENTITYID_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  TYPE_ASC
  _ID_DESC
}

input IncidentAllegedDeployerOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input ReportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input History_incidentEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_reports: [Int]
  from_reports_unset: Boolean
}

input TaxaDummy_fieldUpdateInput {
  short_name_unset: Boolean
  field_number: String
  field_number_unset: Boolean
  short_name: String
}

input ChecklistRiskQueryInput {
  severity: String
  risk_status: String
  severity_lt: String
  risk_status_ne: String
  risk_notes_in: [String]
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  tags_nin: [String]
  risk_notes_gte: String
  tags_in: [String]
  title_ne: String
  precedents_exists: Boolean
  id_in: [String]
  id_ne: String
  tags_exists: Boolean
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  id: String
  touched_exists: Boolean
  likelihood_in: [String]
  AND: [ChecklistRiskQueryInput!]
  title_gte: String
  severity_exists: Boolean
  OR: [ChecklistRiskQueryInput!]
  risk_status_gte: String
  risk_notes_gt: String
  id_nin: [String]
  title_lt: String
  risk_status_in: [String]
  risk_notes_ne: String
  risk_status_gt: String
  touched_ne: Boolean
  generated_exists: Boolean
  id_gte: String
  title_gt: String
  generated_ne: Boolean
  likelihood: String
  id_exists: Boolean
  risk_status_nin: [String]
  likelihood_nin: [String]
  risk_notes: String
  risk_status_lte: String
  severity_gt: String
  id_lte: String
  id_gt: String
  risk_notes_nin: [String]
  risk_notes_lt: String
  severity_gte: String
  title_in: [String]
  id_lt: String
  risk_status_exists: Boolean
  generated: Boolean
  severity_ne: String
  likelihood_lte: String
  likelihood_gte: String
  risk_status_lt: String
  precedents: [ChecklistRiskPrecedentQueryInput]
  likelihood_ne: String
  severity_lte: String
  title_lte: String
  tags: [String]
  touched: Boolean
  likelihood_lt: String
  likelihood_exists: Boolean
  title_exists: Boolean
  title_nin: [String]
  severity_in: [String]
  likelihood_gt: String
  risk_notes_lte: String
  severity_nin: [String]
  title: String
  risk_notes_exists: Boolean
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

input History_incidentQueryInput {
  AllegedDeveloperOfAISystem_exists: Boolean
  date_gte: String
  reports_nin: [Int]
  reports: [Int]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  description_gte: String
  editor_notes_exists: Boolean
  _id_in: [ObjectId]
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  modifiedBy: String
  epoch_date_modified_lt: Int
  _id_exists: Boolean
  description_in: [String]
  date_exists: Boolean
  _id_gt: ObjectId
  title_gte: String
  epoch_date_modified_in: [Int]
  _id: ObjectId
  implicated_systems_exists: Boolean
  title_in: [String]
  incident_id: Int
  editor_notes_ne: String
  editors_exists: Boolean
  epoch_date_modified_exists: Boolean
  title_nin: [String]
  _id_ne: ObjectId
  AllegedDeveloperOfAISystem_in: [String]
  AllegedDeveloperOfAISystem_nin: [String]
  description_lte: String
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  date_gt: String
  editor_notes_gt: String
  editor_notes_lte: String
  flagged_dissimilar_incidents_exists: Boolean
  embedding_exists: Boolean
  modifiedBy_in: [String]
  AllegedDeveloperOfAISystem: [String]
  incident_id_gte: Int
  epoch_date_modified_gt: Int
  incident_id_lte: Int
  flagged_dissimilar_incidents: [Int]
  title_lt: String
  incident_id_in: [Int]
  editor_similar_incidents_in: [Int]
  date_lt: String
  editor_notes_gte: String
  title_lte: String
  editor_similar_incidents_exists: Boolean
  editor_similar_incidents_nin: [Int]
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  AND: [History_incidentQueryInput!]
  flagged_dissimilar_incidents_in: [Int]
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  editor_notes: String
  modifiedBy_nin: [String]
  editor_dissimilar_incidents_exists: Boolean
  modifiedBy_lt: String
  epoch_date_modified_nin: [Int]
  title_ne: String
  modifiedBy_gte: String
  editor_notes_lt: String
  modifiedBy_exists: Boolean
  date_lte: String
  editor_similar_incidents: [Int]
  reports_exists: Boolean
  date_in: [String]
  editor_dissimilar_incidents_nin: [Int]
  date_ne: String
  description: String
  tsne_exists: Boolean
  incident_id_exists: Boolean
  nlp_similar_incidents_exists: Boolean
  incident_id_ne: Int
  AllegedHarmedOrNearlyHarmedParties: [String]
  _id_gte: ObjectId
  incident_id_lt: Int
  AllegedDeployerOfAISystem_exists: Boolean
  incident_id_nin: [Int]
  description_exists: Boolean
  flagged_dissimilar_incidents_nin: [Int]
  AllegedDeployerOfAISystem: [String]
  description_gt: String
  modifiedBy_ne: String
  description_ne: String
  embedding: History_incidentEmbeddingQueryInput
  _id_lt: ObjectId
  AllegedDeployerOfAISystem_in: [String]
  tsne: History_incidentTsneQueryInput
  OR: [History_incidentQueryInput!]
  editor_notes_in: [String]
  incident_id_gt: Int
  editor_notes_nin: [String]
  epoch_date_modified: Int
  modifiedBy_gt: String
  editors_in: [String]
  editor_dissimilar_incidents_in: [Int]
  implicated_systems_nin: [String]
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  title_exists: Boolean
  editors: [String]
  description_lt: String
  AllegedDeployerOfAISystem_nin: [String]
  date: String
  editors_nin: [String]
  _id_nin: [ObjectId]
  reports_in: [Int]
  title: String
  editor_dissimilar_incidents: [Int]
  implicated_systems_in: [String]
  epoch_date_modified_gte: Int
  _id_lte: ObjectId
  date_nin: [String]
  description_nin: [String]
  epoch_date_modified_lte: Int
  implicated_systems: [String]
  epoch_date_modified_ne: Int
  modifiedBy_lte: String
  title_gt: String
}

enum EntitySortByInput {
  _ID_ASC
  ENTITY_ID_ASC
  CREATED_AT_DESC
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  ENTITY_ID_DESC
  NAME_ASC
  NAME_DESC
  _ID_DESC
  CREATED_AT_ASC
}

input History_incidentInsertInput {
  _id: ObjectId
  date: String!
  editor_dissimilar_incidents: [Int]
  tsne: History_incidentTsneInsertInput
  epoch_date_modified: Int
  reports: [Int]!
  editor_similar_incidents: [Int]
  flagged_dissimilar_incidents: [Int]
  implicated_systems: [String]
  editors: [String]!
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  title: String!
  AllegedDeveloperOfAISystem: [String]
  description: String
  AllegedHarmedOrNearlyHarmedParties: [String]
  editor_notes: String
  embedding: History_incidentEmbeddingInsertInput
  incident_id: Int!
  AllegedDeployerOfAISystem: [String]
  modifiedBy: String
}

input TaxaField_listInsertInput {
  display_type: String
  public: Boolean
  default: String
  field_number: String
  short_name: String
  instant_facet: Boolean
  mongo_type: String
  hide_search: Boolean
  complete_from: TaxaField_listComplete_fromInsertInput
  item_fields: TaxaField_listItem_fieldInsertInput
  placeholder: String
  short_description: String
  long_name: String
  weight: Int
  long_description: String
  permitted_values: [String]
  required: Boolean
}

scalar DateTime

type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input TaxaDummy_fieldQueryInput {
  field_number: String
  field_number_gte: String
  field_number_exists: Boolean
  short_name_lt: String
  field_number_lte: String
  short_name_lte: String
  short_name_exists: Boolean
  short_name: String
  field_number_in: [String]
  short_name_ne: String
  short_name_nin: [String]
  short_name_gt: String
  OR: [TaxaDummy_fieldQueryInput!]
  field_number_gt: String
  field_number_ne: String
  short_name_gte: String
  short_name_in: [String]
  field_number_lt: String
  AND: [TaxaDummy_fieldQueryInput!]
  field_number_nin: [String]
}

input History_reportEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
}

input CandidateClassification_similarityInsertInput {
  classification: String
  similarity: Float
}

input TaxaField_listQueryInput {
  public: Boolean
  placeholder_nin: [String]
  weight: Int
  field_number_lte: String
  short_name_gt: String
  instant_facet: Boolean
  short_name_ne: String
  default: String
  long_description_gt: String
  mongo_type_in: [String]
  permitted_values_in: [String]
  short_description_lt: String
  short_name_lte: String
  display_type_ne: String
  weight_in: [Int]
  item_fields: TaxaField_listItem_fieldQueryInput
  default_lte: String
  long_description: String
  weight_nin: [Int]
  long_name_ne: String
  display_type: String
  long_name_gte: String
  default_lt: String
  field_number_lt: String
  default_gt: String
  short_description_exists: Boolean
  default_exists: Boolean
  default_ne: String
  complete_from: TaxaField_listComplete_fromQueryInput
  display_type_in: [String]
  permitted_values_nin: [String]
  long_description_gte: String
  long_name_lt: String
  long_description_nin: [String]
  weight_exists: Boolean
  long_description_in: [String]
  permitted_values_exists: Boolean
  long_name: String
  item_fields_exists: Boolean
  placeholder_lt: String
  field_number_ne: String
  display_type_nin: [String]
  long_description_exists: Boolean
  display_type_lte: String
  placeholder_ne: String
  placeholder_lte: String
  long_name_nin: [String]
  mongo_type_exists: Boolean
  weight_gt: Int
  mongo_type_lt: String
  placeholder_gte: String
  display_type_exists: Boolean
  short_description_gt: String
  OR: [TaxaField_listQueryInput!]
  mongo_type_lte: String
  default_nin: [String]
  weight_ne: Int
  long_name_in: [String]
  short_name_gte: String
  placeholder_in: [String]
  placeholder_exists: Boolean
  permitted_values: [String]
  required: Boolean
  weight_lt: Int
  long_description_lt: String
  field_number_nin: [String]
  default_in: [String]
  display_type_lt: String
  required_ne: Boolean
  short_description_nin: [String]
  short_description_gte: String
  mongo_type_gt: String
  field_number: String
  complete_from_exists: Boolean
  long_name_gt: String
  long_description_lte: String
  short_name_lt: String
  short_description_lte: String
  display_type_gte: String
  mongo_type: String
  placeholder_gt: String
  public_ne: Boolean
  default_gte: String
  short_name_in: [String]
  short_description: String
  required_exists: Boolean
  field_number_gte: String
  mongo_type_ne: String
  AND: [TaxaField_listQueryInput!]
  hide_search_ne: Boolean
  weight_gte: Int
  short_name: String
  field_number_in: [String]
  placeholder: String
  hide_search: Boolean
  field_number_exists: Boolean
  short_name_exists: Boolean
  short_description_ne: String
  hide_search_exists: Boolean
  long_name_exists: Boolean
  instant_facet_exists: Boolean
  long_description_ne: String
  instant_facet_ne: Boolean
  mongo_type_nin: [String]
  short_description_in: [String]
  short_name_nin: [String]
  field_number_gt: String
  long_name_lte: String
  mongo_type_gte: String
  public_exists: Boolean
  weight_lte: Int
  display_type_gt: String
}

input History_incidentNlp_similar_incidentQueryInput {
  incident_id_exists: Boolean
  similarity_nin: [Float]
  incident_id: Int
  similarity: Float
  incident_id_in: [Int]
  similarity_lt: Float
  similarity_in: [Float]
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_lt: Int
  incident_id_gt: Int
  similarity_lte: Float
  incident_id_gte: Int
  incident_id_ne: Int
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_lte: Int
  incident_id_nin: [Int]
  similarity_exists: Boolean
  similarity_gt: Float
  similarity_gte: Float
  similarity_ne: Float
}

enum NotificationSortByInput {
  INCIDENT_ID_DESC
  SENTDATE_ASC
  SENTDATE_DESC
  USERID_DESC
  INCIDENT_ID_ASC
  _ID_DESC
  TYPE_ASC
  TYPE_DESC
  USERID_ASC
  _ID_ASC
}

input IncidentEmbeddingUpdateInput {
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input TaxaField_listItem_fieldComplete_fromInsertInput {
  entities: Boolean
  all: [String]
  current: [String]
}

input SubmissionEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input UserQueryInput {
  userId_in: [String]
  roles_nin: [String]
  first_name_lt: String
  userId_lt: String
  last_name_ne: String
  OR: [UserQueryInput!]
  _id_lte: ObjectId
  last_name_nin: [String]
  userId_gt: String
  _id_nin: [ObjectId]
  last_name_in: [String]
  last_name: String
  last_name_gte: String
  last_name_exists: Boolean
  last_name_lte: String
  AND: [UserQueryInput!]
  roles: [String]
  last_name_lt: String
  userId_nin: [String]
  userId_exists: Boolean
  roles_in: [String]
  _id_lt: ObjectId
  userId: String
  _id_gt: ObjectId
  _id: ObjectId
  first_name_lte: String
  first_name_nin: [String]
  first_name_gt: String
  _id_exists: Boolean
  first_name: String
  userId_gte: String
  userId_ne: String
  _id_gte: ObjectId
  first_name_exists: Boolean
  roles_exists: Boolean
  first_name_gte: String
  first_name_ne: String
  first_name_in: [String]
  last_name_gt: String
  _id_in: [ObjectId]
  userId_lte: String
  _id_ne: ObjectId
}

enum History_reportSortByInput {
  EPOCH_DATE_PUBLISHED_DESC
  MODIFIEDBY_ASC
  EDITOR_NOTES_DESC
  LANGUAGE_DESC
  DATE_DOWNLOADED_ASC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_SUBMITTED_DESC
  SOURCE_DOMAIN_DESC
  TITLE_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_ASC
  EDITOR_NOTES_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_MODIFIED_DESC
  IMAGE_URL_ASC
  LANGUAGE_ASC
  REPORT_NUMBER_ASC
  _ID_DESC
  DATE_PUBLISHED_DESC
  TEXT_DESC
  DATE_SUBMITTED_ASC
  IMAGE_URL_DESC
  DATE_MODIFIED_ASC
  DATE_PUBLISHED_ASC
  DESCRIPTION_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_SUBMITTED_ASC
  MODIFIEDBY_DESC
  PLAIN_TEXT_DESC
  REPORT_NUMBER_DESC
  CLOUDINARY_ID_ASC
  DATE_SUBMITTED_DESC
  SOURCE_DOMAIN_ASC
  TEXT_ASC
  DATE_MODIFIED_DESC
  TITLE_DESC
  URL_ASC
  USER_DESC
  _ID_ASC
  CLOUDINARY_ID_DESC
  URL_DESC
  USER_ASC
  EPOCH_DATE_PUBLISHED_ASC
  PLAIN_TEXT_ASC
}

input SubmissionNlp_similar_incidentQueryInput {
  incident_id_lte: Int
  similarity_gt: Float
  similarity_in: [Float]
  similarity_nin: [Float]
  incident_id_gt: Int
  similarity_lt: Float
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id: Int
  incident_id_ne: Int
  similarity_gte: Float
  incident_id_nin: [Int]
  incident_id_in: [Int]
  similarity_lte: Float
  similarity_ne: Float
  incident_id_exists: Boolean
  similarity: Float
  incident_id_gte: Int
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  similarity_exists: Boolean
  incident_id_lt: Int
}

input EntityInsertInput {
  date_modified: DateTime
  entity_id: String!
  name: String!
  _id: ObjectId
  created_at: DateTime
}

input UserInsertInput {
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

input ReportUserRelationInput {
  create: UserInsertInput
  link: String
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

input ClassificationAttributeUpdateInput {
  value_json: String
  value_json_unset: Boolean
  short_name: String
  short_name_unset: Boolean
}

input EntityQueryInput {
  entity_id_gt: String
  date_modified_lt: DateTime
  entity_id_exists: Boolean
  _id_gt: ObjectId
  name_in: [String]
  _id: ObjectId
  entity_id_ne: String
  created_at_nin: [DateTime]
  date_modified_gte: DateTime
  created_at_lte: DateTime
  date_modified_exists: Boolean
  OR: [EntityQueryInput!]
  _id_gte: ObjectId
  name_gte: String
  _id_lt: ObjectId
  created_at_exists: Boolean
  name_gt: String
  name_ne: String
  _id_in: [ObjectId]
  created_at: DateTime
  date_modified_gt: DateTime
  name_lt: String
  AND: [EntityQueryInput!]
  date_modified_in: [DateTime]
  created_at_ne: DateTime
  created_at_gt: DateTime
  date_modified: DateTime
  created_at_lt: DateTime
  _id_ne: ObjectId
  _id_exists: Boolean
  entity_id_lt: String
  date_modified_nin: [DateTime]
  entity_id_in: [String]
  entity_id_lte: String
  entity_id: String
  entity_id_nin: [String]
  created_at_in: [DateTime]
  name_exists: Boolean
  entity_id_gte: String
  _id_lte: ObjectId
  _id_nin: [ObjectId]
  created_at_gte: DateTime
  date_modified_lte: DateTime
  name_nin: [String]
  date_modified_ne: DateTime
  name: String
  name_lte: String
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

input NotificationUpdateInput {
  processed: Boolean
  userId: NotificationUserIdRelationInput
  _id: ObjectId
  incident_id_inc: Int
  sentDate_unset: Boolean
  type_unset: Boolean
  _id_unset: Boolean
  incident_id: Int
  processed_unset: Boolean
  sentDate: DateTime
  userId_unset: Boolean
  incident_id_unset: Boolean
  type: String
}

input ChecklistRiskPrecedentInsertInput {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}

input SubmissionEmbeddingQueryInput {
  from_text_hash: String
  from_text_hash_ne: String
  OR: [SubmissionEmbeddingQueryInput!]
  from_text_hash_lt: String
  from_text_hash_lte: String
  AND: [SubmissionEmbeddingQueryInput!]
  vector_exists: Boolean
  from_text_hash_exists: Boolean
  from_text_hash_nin: [String]
  vector_in: [Float]
  from_text_hash_gte: String
  vector: [Float]
  from_text_hash_in: [String]
  vector_nin: [Float]
  from_text_hash_gt: String
}

enum QuickaddSortByInput {
  _ID_ASC
  INCIDENT_ID_DESC
  SOURCE_DOMAIN_ASC
  URL_ASC
  URL_DESC
  _ID_DESC
  DATE_SUBMITTED_ASC
  DATE_SUBMITTED_DESC
  INCIDENT_ID_ASC
  SOURCE_DOMAIN_DESC
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

input CandidateEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input DuplicateInsertInput {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

input ReportEmbeddingQueryInput {
  from_text_hash_lt: String
  from_text_hash: String
  from_text_hash_ne: String
  OR: [ReportEmbeddingQueryInput!]
  AND: [ReportEmbeddingQueryInput!]
  vector_nin: [Float]
  from_text_hash_gt: String
  vector_exists: Boolean
  from_text_hash_lte: String
  vector_in: [Float]
  vector: [Float]
  from_text_hash_in: [String]
  from_text_hash_exists: Boolean
  from_text_hash_nin: [String]
  from_text_hash_gte: String
}

input IncidentEditorsRelationInput {
  link: [String]
  create: [UserInsertInput]
}

input ChecklistRiskInsertInput {
  precedents: [ChecklistRiskPrecedentInsertInput]
  risk_notes: String
  title: String
  likelihood: String
  touched: Boolean
  id: String
  risk_status: String
  tags: [String]
  generated: Boolean
  severity: String
}

input PromoteSubmissionToReportInput {
  is_incident_report: Boolean
  submission_id: ObjectId
  incident_ids: [Int]
}

input CandidateQueryInput {
  language_gte: String
  match_exists: Boolean
  url_exists: Boolean
  plain_text_gt: String
  similarity_gte: Float
  title_ne: String
  language_ne: String
  plain_text_gte: String
  matching_harm_keywords: [String]
  text_lt: String
  matching_harm_keywords_exists: Boolean
  language_exists: Boolean
  similarity_ne: Float
  plain_text_nin: [String]
  text_gt: String
  language_gt: String
  AND: [CandidateQueryInput!]
  date_downloaded_in: [String]
  embedding_exists: Boolean
  url_lte: String
  epoch_date_downloaded_exists: Boolean
  title_in: [String]
  authors_in: [String]
  authors: [String]
  date_published_ne: String
  image_url_in: [String]
  plain_text_in: [String]
  similarity_nin: [Float]
  date_downloaded_ne: String
  _id_gt: ObjectId
  image_url_ne: String
  epoch_date_published_lt: Int
  epoch_date_published_exists: Boolean
  epoch_date_downloaded_ne: Int
  language_in: [String]
  epoch_date_published_ne: Int
  source_domain_gte: String
  plain_text_lte: String
  source_domain_ne: String
  url_lt: String
  title_nin: [String]
  date_published_nin: [String]
  epoch_date_downloaded_in: [Int]
  match_ne: Boolean
  plain_text_ne: String
  epoch_date_published_lte: Int
  date_downloaded_exists: Boolean
  url_ne: String
  matching_harm_keywords_nin: [String]
  title_lte: String
  similarity_lte: Float
  matching_entities_exists: Boolean
  _id_ne: ObjectId
  image_url_nin: [String]
  source_domain: String
  date_published_gte: String
  image_url: String
  date_downloaded_gte: String
  image_url_exists: Boolean
  dismissed_exists: Boolean
  date_published_gt: String
  matching_entities: [String]
  image_url_gte: String
  classification_similarity_exists: Boolean
  language_lte: String
  epoch_date_published_nin: [Int]
  OR: [CandidateQueryInput!]
  dismissed_ne: Boolean
  language_nin: [String]
  date_downloaded_lte: String
  _id_in: [ObjectId]
  epoch_date_downloaded_lt: Int
  title_lt: String
  similarity_in: [Float]
  source_domain_lt: String
  plain_text_exists: Boolean
  title: String
  date_downloaded_nin: [String]
  matching_keywords_in: [String]
  epoch_date_downloaded_gt: Int
  authors_nin: [String]
  language_lt: String
  image_url_lte: String
  _id_lt: ObjectId
  date_downloaded_lt: String
  title_gt: String
  url_nin: [String]
  matching_keywords_exists: Boolean
  epoch_date_downloaded_gte: Int
  title_exists: Boolean
  _id_gte: ObjectId
  plain_text: String
  date_downloaded: String
  match: Boolean
  date_published_lte: String
  dismissed: Boolean
  similarity: Float
  url_in: [String]
  source_domain_gt: String
  text_exists: Boolean
  similarity_lt: Float
  _id_exists: Boolean
  epoch_date_published: Int
  date_published_in: [String]
  url_gt: String
  epoch_date_downloaded: Int
  matching_keywords_nin: [String]
  matching_entities_nin: [String]
  text_lte: String
  classification_similarity: [CandidateClassification_similarityQueryInput]
  url_gte: String
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  text_gte: String
  date_published_lt: String
  url: String
  source_domain_nin: [String]
  epoch_date_downloaded_nin: [Int]
  matching_harm_keywords_in: [String]
  source_domain_exists: Boolean
  epoch_date_published_gt: Int
  image_url_lt: String
  epoch_date_published_in: [Int]
  source_domain_lte: String
  matching_keywords: [String]
  epoch_date_published_gte: Int
  text_nin: [String]
  text_in: [String]
  title_gte: String
  _id_lte: ObjectId
  plain_text_lt: String
  date_published_exists: Boolean
  _id: ObjectId
  date_published: String
  epoch_date_downloaded_lte: Int
  image_url_gt: String
  _id_nin: [ObjectId]
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  language: String
  source_domain_in: [String]
  text: String
  matching_entities_in: [String]
  embedding: CandidateEmbeddingQueryInput
  date_downloaded_gt: String
  similarity_exists: Boolean
  authors_exists: Boolean
  text_ne: String
  similarity_gt: Float
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

input CandidateClassification_similarityQueryInput {
  similarity_in: [Float]
  similarity_exists: Boolean
  AND: [CandidateClassification_similarityQueryInput!]
  classification_lte: String
  OR: [CandidateClassification_similarityQueryInput!]
  similarity_ne: Float
  classification_ne: String
  similarity: Float
  classification_nin: [String]
  similarity_nin: [Float]
  similarity_gte: Float
  classification_lt: String
  classification_in: [String]
  similarity_lt: Float
  classification_gte: String
  classification_gt: String
  similarity_gt: Float
  classification: String
  similarity_lte: Float
  classification_exists: Boolean
}

type User {
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

input CandidateClassification_similarityUpdateInput {
  similarity_inc: Float
  similarity_unset: Boolean
  classification: String
  classification_unset: Boolean
  similarity: Float
}

input History_incidentUpdateInput {
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  modifiedBy: String
  AllegedDeveloperOfAISystem_unset: Boolean
  title_unset: Boolean
  incident_id: Int
  _id: ObjectId
  editor_notes: String
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  incident_id_inc: Int
  editor_dissimilar_incidents_unset: Boolean
  editor_similar_incidents: [Int]
  reports_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  AllegedDeployerOfAISystem_unset: Boolean
  epoch_date_modified_inc: Int
  modifiedBy_unset: Boolean
  AllegedDeployerOfAISystem: [String]
  epoch_date_modified: Int
  epoch_date_modified_unset: Boolean
  embedding_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  editor_similar_incidents_unset: Boolean
  incident_id_unset: Boolean
  AllegedDeveloperOfAISystem: [String]
  _id_unset: Boolean
  description_unset: Boolean
  editors_unset: Boolean
  tsne: History_incidentTsneUpdateInput
  flagged_dissimilar_incidents_unset: Boolean
  implicated_systems_unset: Boolean
  tsne_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties: [String]
  embedding: History_incidentEmbeddingUpdateInput
  date: String
  date_unset: Boolean
  editors: [String]
  title: String
  description: String
  reports: [Int]
  implicated_systems: [String]
  editor_dissimilar_incidents: [Int]
  editor_notes_unset: Boolean
}

input QuickaddUpdateInput {
  _id_unset: Boolean
  url_unset: Boolean
  date_submitted: String
  source_domain_unset: Boolean
  url: String
  incident_id: Long
  source_domain: String
  _id: ObjectId
  incident_id_unset: Boolean
  date_submitted_unset: Boolean
}

type TaxaField_listComplete_from {
  all: [String]
  current: [String]
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

input History_incidentTsneInsertInput {
  y: Float
  x: Float
}

input IncidentUpdateInput {
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  epoch_date_modified_inc: Int
  editor_similar_incidents: [Int]
  embedding: IncidentEmbeddingUpdateInput
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  description_unset: Boolean
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  editor_similar_incidents_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  title: String
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  incident_id_unset: Boolean
  _id: ObjectId
  editors: IncidentEditorsRelationInput
  _id_unset: Boolean
  date_unset: Boolean
  description: String
  reports: IncidentReportsRelationInput
  flagged_dissimilar_incidents_unset: Boolean
  epoch_date_modified: Int
  flagged_dissimilar_incidents: [Int]
  tsne: IncidentTsneUpdateInput
  editor_dissimilar_incidents: [Int]
  date: String
  tsne_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  reports_unset: Boolean
  embedding_unset: Boolean
  implicated_systems_unset: Boolean
  editor_notes: String
  incident_id: Int
  AllegedDeployerOfAISystem_unset: Boolean
  implicated_systems: IncidentImplicated_systemsRelationInput
  editors_unset: Boolean
  editor_notes_unset: Boolean
  incident_id_inc: Int
  title_unset: Boolean
  editor_dissimilar_incidents_unset: Boolean
  epoch_date_modified_unset: Boolean
  nlp_similar_incidents_unset: Boolean
}

input IncidentReportsRelationInput {
  link: [Int]
  create: [ReportInsertInput]
}

input TaxaField_listComplete_fromInsertInput {
  all: [String]
  current: [String]
}

input NotificationInsertInput {
  sentDate: DateTime
  type: String
  userId: NotificationUserIdRelationInput
  _id: ObjectId
  incident_id: Int
  processed: Boolean
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

input IncidentNlp_similar_incidentQueryInput {
  incident_id_lt: Int
  incident_id_in: [Int]
  similarity_nin: [Float]
  incident_id: Int
  similarity_lt: Float
  similarity: Float
  similarity_gte: Float
  incident_id_exists: Boolean
  similarity_gt: Float
  OR: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_lte: Int
  incident_id_nin: [Int]
  incident_id_gte: Int
  incident_id_gt: Int
  similarity_exists: Boolean
  incident_id_ne: Int
  similarity_in: [Float]
  similarity_lte: Float
  similarity_ne: Float
  AND: [IncidentNlp_similar_incidentQueryInput!]
}

input SubmissionUpdateInput {
  date_published_unset: Boolean
  submitters_unset: Boolean
  incident_date: String
  date_modified_unset: Boolean
  text: String
  cloudinary_id: String
  epoch_date_modified_unset: Boolean
  harmed_parties_unset: Boolean
  editor_similar_incidents_unset: Boolean
  description_unset: Boolean
  image_url_unset: Boolean
  incident_editors_unset: Boolean
  language_unset: Boolean
  developers: SubmissionDevelopersRelationInput
  implicated_systems: SubmissionImplicated_systemsRelationInput
  developers_unset: Boolean
  tags_unset: Boolean
  plain_text_unset: Boolean
  source_domain_unset: Boolean
  source_domain: String
  quiet_unset: Boolean
  url_unset: Boolean
  editor_dissimilar_incidents: [Int]
  deployers: SubmissionDeployersRelationInput
  status: String
  submitters: [String]
  user: SubmissionUserRelationInput
  date_modified: String
  _id: ObjectId
  title_unset: Boolean
  status_unset: Boolean
  date_downloaded_unset: Boolean
  deployers_unset: Boolean
  cloudinary_id_unset: Boolean
  epoch_date_modified_inc: Int
  date_published: String
  incident_editors: SubmissionIncident_editorsRelationInput
  authors: [String]
  embedding_unset: Boolean
  date_downloaded: String
  harmed_parties: SubmissionHarmed_partiesRelationInput
  authors_unset: Boolean
  quiet: Boolean
  embedding: SubmissionEmbeddingUpdateInput
  incident_ids_unset: Boolean
  image_url: String
  editor_notes_unset: Boolean
  url: String
  incident_title_unset: Boolean
  user_unset: Boolean
  language: String
  text_unset: Boolean
  implicated_systems_unset: Boolean
  editor_dissimilar_incidents_unset: Boolean
  incident_date_unset: Boolean
  date_submitted: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  plain_text: String
  incident_title: String
  _id_unset: Boolean
  editor_similar_incidents: [Int]
  title: String
  description: String
  incident_ids: [Int]
  editor_notes: String
  tags: [String]
  date_submitted_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  epoch_date_modified: Int
}

input SubscriptionUpdateInput {
  _id_unset: Boolean
  entityId: SubscriptionEntityIdRelationInput
  type_unset: Boolean
  incident_id_unset: Boolean
  type: String
  _id: ObjectId
  userId: SubscriptionUserIdRelationInput
  userId_unset: Boolean
  entityId_unset: Boolean
  incident_id: SubscriptionIncident_idRelationInput
}

input SubscriptionUserIdRelationInput {
  link: String
  create: UserInsertInput
}

type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input ClassificationQueryInput {
  publish_exists: Boolean
  publish: Boolean
  reports: [ReportQueryInput]
  AND: [ClassificationQueryInput!]
  incidents_nin: [IncidentQueryInput]
  namespace: String
  publish_ne: Boolean
  notes_gte: String
  namespace_lt: String
  namespace_ne: String
  _id: ObjectId
  notes_lt: String
  namespace_gte: String
  notes_exists: Boolean
  notes: String
  _id_gt: ObjectId
  namespace_in: [String]
  namespace_lte: String
  attributes_nin: [ClassificationAttributeQueryInput]
  namespace_nin: [String]
  _id_lt: ObjectId
  namespace_gt: String
  _id_nin: [ObjectId]
  _id_lte: ObjectId
  namespace_exists: Boolean
  reports_exists: Boolean
  attributes: [ClassificationAttributeQueryInput]
  attributes_in: [ClassificationAttributeQueryInput]
  _id_gte: ObjectId
  notes_in: [String]
  incidents_exists: Boolean
  OR: [ClassificationQueryInput!]
  reports_nin: [ReportQueryInput]
  attributes_exists: Boolean
  notes_gt: String
  reports_in: [ReportQueryInput]
  _id_in: [ObjectId]
  _id_ne: ObjectId
  _id_exists: Boolean
  notes_nin: [String]
  incidents: [IncidentQueryInput]
  notes_ne: String
  notes_lte: String
  incidents_in: [IncidentQueryInput]
}

input GetUserInput {
  userId: ObjectId
}

type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}

input History_incidentEmbeddingQueryInput {
  vector_nin: [Float]
  from_reports_nin: [Int]
  vector: [Float]
  from_reports_in: [Int]
  vector_in: [Float]
  from_reports: [Int]
  AND: [History_incidentEmbeddingQueryInput!]
  from_reports_exists: Boolean
  vector_exists: Boolean
  OR: [History_incidentEmbeddingQueryInput!]
}

input History_incidentNlp_similar_incidentUpdateInput {
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
}

input History_reportInsertInput {
  date_published: DateTime!
  date_downloaded: DateTime!
  language: String!
  source_domain: String!
  date_submitted: DateTime!
  _id: ObjectId
  title: String!
  epoch_date_downloaded: Int!
  flag: Boolean
  inputs_outputs: [String]
  date_modified: DateTime!
  epoch_date_submitted: Int!
  editor_notes: String
  report_number: Int!
  plain_text: String!
  user: String
  image_url: String!
  is_incident_report: Boolean
  modifiedBy: String
  tags: [String]!
  url: String!
  epoch_date_published: Int!
  authors: [String]!
  submitters: [String]!
  epoch_date_modified: Int!
  cloudinary_id: String!
  embedding: History_reportEmbeddingInsertInput
  description: String
  text: String!
  quiet: Boolean
}

input ClassificationAttributeInsertInput {
  short_name: String
  value_json: String
}

type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input TaxaQueryInput {
  description_lte: String
  namespace_exists: Boolean
  weight_exists: Boolean
  weight_lte: Int
  field_list_exists: Boolean
  namespace_lt: String
  description: String
  complete_entities_exists: Boolean
  weight_in: [Int]
  dummy_fields_exists: Boolean
  AND: [TaxaQueryInput!]
  _id_gte: ObjectId
  weight_nin: [Int]
  weight_lt: Int
  namespace: String
  namespace_nin: [String]
  _id_gt: ObjectId
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  _id_ne: ObjectId
  namespace_ne: String
  description_gt: String
  _id_nin: [ObjectId]
  namespace_in: [String]
  _id_exists: Boolean
  OR: [TaxaQueryInput!]
  weight_gte: Int
  field_list_in: [TaxaField_listQueryInput]
  _id: ObjectId
  weight: Int
  weight_gt: Int
  description_lt: String
  description_gte: String
  namespace_lte: String
  complete_entities_ne: Boolean
  _id_in: [ObjectId]
  field_list_nin: [TaxaField_listQueryInput]
  description_exists: Boolean
  weight_ne: Int
  complete_entities: Boolean
  namespace_gte: String
  _id_lte: ObjectId
  description_nin: [String]
  field_list: [TaxaField_listQueryInput]
  _id_lt: ObjectId
  namespace_gt: String
  description_ne: String
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  dummy_fields: [TaxaDummy_fieldQueryInput]
  description_in: [String]
}

enum SubmissionSortByInput {
  CLOUDINARY_ID_ASC
  DATE_SUBMITTED_ASC
  STATUS_DESC
  TEXT_ASC
  TEXT_DESC
  _ID_ASC
  EDITOR_NOTES_ASC
  INCIDENT_TITLE_ASC
  URL_ASC
  URL_DESC
  CLOUDINARY_ID_DESC
  DATE_MODIFIED_ASC
  IMAGE_URL_DESC
  LANGUAGE_ASC
  PLAIN_TEXT_ASC
  PLAIN_TEXT_DESC
  SOURCE_DOMAIN_ASC
  USER_ASC
  USER_DESC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_ASC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_MODIFIED_DESC
  DESCRIPTION_ASC
  IMAGE_URL_ASC
  INCIDENT_TITLE_DESC
  STATUS_ASC
  TITLE_ASC
  INCIDENT_DATE_DESC
  TITLE_DESC
  _ID_DESC
  DATE_SUBMITTED_DESC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_ASC
  LANGUAGE_DESC
  SOURCE_DOMAIN_DESC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_DESC
  DESCRIPTION_DESC
  INCIDENT_DATE_ASC
}

enum TaxaSortByInput {
  NAMESPACE_DESC
  WEIGHT_ASC
  WEIGHT_DESC
  _ID_ASC
  _ID_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  NAMESPACE_ASC
}

input TaxaField_listItem_fieldInsertInput {
  public: Boolean
  short_description: String
  required: Boolean
  mongo_type: String
  short_name: String
  field_number: String
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
  permitted_values: [String]
  default: String
  display_type: String
  weight: Int
  placeholder: String
  instant_facet: Boolean
  long_description: String
  long_name: String
}

input CandidateUpdateInput {
  epoch_date_downloaded_inc: Int
  epoch_date_downloaded: Int
  image_url_unset: Boolean
  plain_text: String
  authors: [String]
  source_domain_unset: Boolean
  matching_keywords_unset: Boolean
  title_unset: Boolean
  image_url: String
  url: String
  date_downloaded: String
  source_domain: String
  dismissed_unset: Boolean
  match: Boolean
  match_unset: Boolean
  _id_unset: Boolean
  epoch_date_published_unset: Boolean
  classification_similarity_unset: Boolean
  dismissed: Boolean
  date_published_unset: Boolean
  epoch_date_published: Int
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  language: String
  title: String
  embedding: CandidateEmbeddingUpdateInput
  matching_entities_unset: Boolean
  matching_entities: [String]
  matching_harm_keywords_unset: Boolean
  text_unset: Boolean
  url_unset: Boolean
  authors_unset: Boolean
  plain_text_unset: Boolean
  date_published: String
  embedding_unset: Boolean
  matching_harm_keywords: [String]
  similarity: Float
  epoch_date_downloaded_unset: Boolean
  similarity_unset: Boolean
  date_downloaded_unset: Boolean
  _id: ObjectId
  similarity_inc: Float
  epoch_date_published_inc: Int
  language_unset: Boolean
  matching_keywords: [String]
  text: String
}

input IncidentInsertInput {
  embedding: IncidentEmbeddingInsertInput
  title: String!
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  editors: IncidentEditorsRelationInput!
  implicated_systems: IncidentImplicated_systemsRelationInput
  incident_id: Int!
  reports: IncidentReportsRelationInput!
  _id: ObjectId
  description: String
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  editor_notes: String
  editor_similar_incidents: [Int]
  flagged_dissimilar_incidents: [Int]
  epoch_date_modified: Int
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  date: String!
  tsne: IncidentTsneInsertInput
  editor_dissimilar_incidents: [Int]
}

input History_reportUpdateInput {
  user: String
  cloudinary_id: String
  date_downloaded: DateTime
  tags: [String]
  quiet: Boolean
  date_modified: DateTime
  submitters: [String]
  epoch_date_modified_inc: Int
  plain_text_unset: Boolean
  report_number: Int
  flag_unset: Boolean
  description: String
  authors_unset: Boolean
  embedding: History_reportEmbeddingUpdateInput
  flag: Boolean
  epoch_date_downloaded: Int
  tags_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  epoch_date_submitted: Int
  date_published_unset: Boolean
  modifiedBy_unset: Boolean
  epoch_date_downloaded_inc: Int
  text_unset: Boolean
  inputs_outputs: [String]
  _id_unset: Boolean
  date_published: DateTime
  url_unset: Boolean
  report_number_inc: Int
  source_domain: String
  epoch_date_published_inc: Int
  embedding_unset: Boolean
  text: String
  epoch_date_published: Int
  language_unset: Boolean
  image_url_unset: Boolean
  report_number_unset: Boolean
  date_submitted_unset: Boolean
  date_submitted: DateTime
  url: String
  submitters_unset: Boolean
  epoch_date_modified: Int
  epoch_date_submitted_unset: Boolean
  inputs_outputs_unset: Boolean
  editor_notes_unset: Boolean
  language: String
  cloudinary_id_unset: Boolean
  epoch_date_published_unset: Boolean
  source_domain_unset: Boolean
  is_incident_report_unset: Boolean
  quiet_unset: Boolean
  editor_notes: String
  image_url: String
  date_modified_unset: Boolean
  epoch_date_modified_unset: Boolean
  user_unset: Boolean
  _id: ObjectId
  description_unset: Boolean
  modifiedBy: String
  date_downloaded_unset: Boolean
  plain_text: String
  title: String
  epoch_date_submitted_inc: Int
  title_unset: Boolean
  authors: [String]
  is_incident_report: Boolean
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

input RisksInput {
  tags: [String]
}
`;
