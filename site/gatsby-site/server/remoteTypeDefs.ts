import gql from "graphql-tag";

export default gql`
type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}

input SubmissionEmbeddingQueryInput {
  AND: [SubmissionEmbeddingQueryInput!]
  from_text_hash_lt: String
  from_text_hash_gte: String
  vector_in: [Float]
  from_text_hash_gt: String
  from_text_hash_lte: String
  OR: [SubmissionEmbeddingQueryInput!]
  vector: [Float]
  from_text_hash_nin: [String]
  from_text_hash_ne: String
  from_text_hash_in: [String]
  vector_nin: [Float]
  from_text_hash_exists: Boolean
  vector_exists: Boolean
  from_text_hash: String
}

input TaxaField_listComplete_fromQueryInput {
  all_exists: Boolean
  current_in: [String]
  current_exists: Boolean
  AND: [TaxaField_listComplete_fromQueryInput!]
  all_in: [String]
  current: [String]
  OR: [TaxaField_listComplete_fromQueryInput!]
  all: [String]
  all_nin: [String]
  current_nin: [String]
}

input ChecklistRiskPrecedentQueryInput {
  description_in: [String]
  incident_id_lt: Int
  title: String
  incident_id_lte: Int
  incident_id_exists: Boolean
  description_lte: String
  description_lt: String
  incident_id_ne: Int
  incident_id_nin: [Int]
  OR: [ChecklistRiskPrecedentQueryInput!]
  incident_id_gt: Int
  title_gt: String
  title_ne: String
  incident_id: Int
  title_nin: [String]
  title_exists: Boolean
  incident_id_gte: Int
  description_exists: Boolean
  tags_nin: [String]
  title_lt: String
  title_in: [String]
  tags: [String]
  title_lte: String
  tags_exists: Boolean
  description_ne: String
  description_gte: String
  description: String
  description_nin: [String]
  title_gte: String
  AND: [ChecklistRiskPrecedentQueryInput!]
  tags_in: [String]
  description_gt: String
  incident_id_in: [Int]
}

enum ChecklistSortByInput {
  DATE_UPDATED_DESC
  ENTITY_ID_ASC
  OWNER_ID_ASC
  ID_DESC
  NAME_ASC
  _ID_ASC
  DATE_CREATED_ASC
  ID_ASC
  DATE_CREATED_DESC
  DATE_UPDATED_ASC
  ENTITY_ID_DESC
  NAME_DESC
  OWNER_ID_DESC
  _ID_DESC
  ABOUT_ASC
  ABOUT_DESC
}

input IncidentAllegedDeveloperOfAISystemRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input IncidentImplicatedSystemsRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input ClassificationAttributeInsertInput {
  short_name: String
  value_json: String
}

input ChecklistRiskPrecedentUpdateInput {
  description: String
  incident_id: Int
  title: String
  incident_id_inc: Int
  incident_id_unset: Boolean
  tags_unset: Boolean
  tags: [String]
  title_unset: Boolean
  description_unset: Boolean
}

type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input ReportEmbeddingQueryInput {
  from_text_hash_lte: String
  vector_in: [Float]
  AND: [ReportEmbeddingQueryInput!]
  from_text_hash_nin: [String]
  vector: [Float]
  from_text_hash_in: [String]
  vector_nin: [Float]
  vector_exists: Boolean
  OR: [ReportEmbeddingQueryInput!]
  from_text_hash_gte: String
  from_text_hash_gt: String
  from_text_hash: String
  from_text_hash_lt: String
  from_text_hash_ne: String
  from_text_hash_exists: Boolean
}

input SubscriptionUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input IncidentUpdateInput {
  flagged_dissimilar_incidents_unset: Boolean
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  description_unset: Boolean
  _id_unset: Boolean
  editor_notes: String
  _id: ObjectId
  editor_notes_unset: Boolean
  epoch_date_modified: Int
  embedding: IncidentEmbeddingUpdateInput
  editors: IncidentEditorsRelationInput
  editor_similar_incidents: [Int]
  AllegedDeployerOfAISystem_unset: Boolean
  epoch_date_modified_unset: Boolean
  embedding_unset: Boolean
  date_unset: Boolean
  tsne_unset: Boolean
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  epoch_date_modified_inc: Int
  description: String
  title: String
  flagged_dissimilar_incidents: [Int]
  date: String
  incident_id_inc: Int
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  tsne: IncidentTsneUpdateInput
  nlp_similar_incidents_unset: Boolean
  editors_unset: Boolean
  reports_unset: Boolean
  incident_id: Int
  title_unset: Boolean
  reports: IncidentReportsRelationInput
  editor_dissimilar_incidents: [Int]
  editor_dissimilar_incidents_unset: Boolean
  incident_id_unset: Boolean
  editor_similar_incidents_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  implicated_systems: IncidentImplicatedSystemsRelationInput
}

enum IncidentSortByInput {
  DESCRIPTION_ASC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_DESC
  _ID_ASC
  DATE_DESC
  DESCRIPTION_DESC
  INCIDENT_ID_ASC
  TITLE_ASC
  DATE_ASC
  EDITOR_NOTES_DESC
  TITLE_DESC
  _ID_DESC
  EDITOR_NOTES_ASC
  INCIDENT_ID_DESC
}

input SubmissionUpdateInput {
  language_unset: Boolean
  harmed_parties: SubmissionHarmed_partiesRelationInput
  embedding: SubmissionEmbeddingUpdateInput
  incident_editors_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  editor_similar_incidents: [Int]
  description_unset: Boolean
  deployers: SubmissionDeployersRelationInput
  source_domain_unset: Boolean
  tags: [String]
  authors_unset: Boolean
  date_modified_unset: Boolean
  user: SubmissionUserRelationInput
  _id_unset: Boolean
  editor_notes: String
  plain_text: String
  title_unset: Boolean
  url_unset: Boolean
  editor_similar_incidents_unset: Boolean
  editor_notes_unset: Boolean
  cloudinary_id_unset: Boolean
  text: String
  date_downloaded_unset: Boolean
  submitters: [String]
  editor_dissimilar_incidents: [Int]
  developers: SubmissionDevelopersRelationInput
  date_submitted: String
  title: String
  status: String
  authors: [String]
  incident_title: String
  date_modified: String
  date_downloaded: String
  language: String
  plain_text_unset: Boolean
  _id: ObjectId
  harmed_parties_unset: Boolean
  date_published_unset: Boolean
  incident_ids: [Int]
  submitters_unset: Boolean
  user_unset: Boolean
  developers_unset: Boolean
  status_unset: Boolean
  date_published: String
  tags_unset: Boolean
  incident_title_unset: Boolean
  embedding_unset: Boolean
  incident_ids_unset: Boolean
  url: String
  editor_dissimilar_incidents_unset: Boolean
  incident_date: String
  image_url: String
  quiet_unset: Boolean
  description: String
  epoch_date_modified_unset: Boolean
  cloudinary_id: String
  source_domain: String
  incident_editors: SubmissionIncident_editorsRelationInput
  incident_date_unset: Boolean
  epoch_date_modified: Int
  text_unset: Boolean
  date_submitted_unset: Boolean
  epoch_date_modified_inc: Int
  image_url_unset: Boolean
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  quiet: Boolean
  deployers_unset: Boolean
}

input SubmissionNlp_similar_incidentUpdateInput {
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
}

input CandidateUpdateInput {
  matching_entities_unset: Boolean
  similarity_unset: Boolean
  text: String
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  language: String
  match: Boolean
  _id_unset: Boolean
  embedding_unset: Boolean
  authors: [String]
  epoch_date_published_unset: Boolean
  matching_keywords_unset: Boolean
  date_downloaded: String
  source_domain_unset: Boolean
  embedding: CandidateEmbeddingUpdateInput
  matching_harm_keywords_unset: Boolean
  classification_similarity_unset: Boolean
  title: String
  plain_text: String
  text_unset: Boolean
  similarity: Float
  similarity_inc: Float
  dismissed_unset: Boolean
  title_unset: Boolean
  image_url_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  date_downloaded_unset: Boolean
  epoch_date_downloaded: Int
  matching_harm_keywords: [String]
  dismissed: Boolean
  matching_keywords: [String]
  plain_text_unset: Boolean
  authors_unset: Boolean
  source_domain: String
  url: String
  epoch_date_published: Int
  url_unset: Boolean
  date_published: String
  epoch_date_published_inc: Int
  language_unset: Boolean
  date_published_unset: Boolean
  match_unset: Boolean
  epoch_date_downloaded_inc: Int
  matching_entities: [String]
  image_url: String
  _id: ObjectId
}

input TaxaField_listItem_fieldComplete_fromInsertInput {
  entities: Boolean
  all: [String]
  current: [String]
}

input EntityUpdateInput {
  date_modified: DateTime
  entity_id: String
  created_at: DateTime
  date_modified_unset: Boolean
  entity_id_unset: Boolean
  name_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  name: String
  created_at_unset: Boolean
}

input DuplicateQueryInput {
  _id_nin: [ObjectId]
  true_incident_number_lt: Int
  true_incident_number_gt: Int
  true_incident_number_lte: Int
  _id_ne: ObjectId
  _id_gte: ObjectId
  _id_exists: Boolean
  true_incident_number_exists: Boolean
  true_incident_number_ne: Int
  true_incident_number_in: [Int]
  duplicate_incident_number_lt: Int
  duplicate_incident_number: Int
  duplicate_incident_number_lte: Int
  true_incident_number_gte: Int
  duplicate_incident_number_ne: Int
  true_incident_number: Int
  _id: ObjectId
  duplicate_incident_number_exists: Boolean
  true_incident_number_nin: [Int]
  _id_lte: ObjectId
  duplicate_incident_number_gt: Int
  duplicate_incident_number_gte: Int
  duplicate_incident_number_nin: [Int]
  _id_in: [ObjectId]
  _id_lt: ObjectId
  OR: [DuplicateQueryInput!]
  AND: [DuplicateQueryInput!]
  _id_gt: ObjectId
  duplicate_incident_number_in: [Int]
}

input CandidateEmbeddingQueryInput {
  OR: [CandidateEmbeddingQueryInput!]
  from_text_hash_gt: String
  vector_exists: Boolean
  AND: [CandidateEmbeddingQueryInput!]
  from_text_hash_gte: String
  from_text_hash_ne: String
  from_text_hash_nin: [String]
  from_text_hash_lt: String
  vector_nin: [Float]
  vector: [Float]
  from_text_hash: String
  from_text_hash_lte: String
  from_text_hash_exists: Boolean
  vector_in: [Float]
  from_text_hash_in: [String]
}

input SubscriptionInsertInput {
  _id: ObjectId
  entityId: SubscriptionEntityIdRelationInput
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
  userId: SubscriptionUserIdRelationInput!
}

input SubscriptionEntityIdRelationInput {
  link: String
  create: EntityInsertInput
}

input CandidateEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input IncidentTsneInsertInput {
  x: Float
  y: Float
}

input TaxaField_listInsertInput {
  permitted_values: [String]
  long_name: String
  weight: Int
  long_description: String
  display_type: String
  field_number: String
  required: Boolean
  mongo_type: String
  placeholder: String
  short_description: String
  item_fields: TaxaField_listItem_fieldInsertInput
  short_name: String
  default: String
  complete_from: TaxaField_listComplete_fromInsertInput
  hide_search: Boolean
  instant_facet: Boolean
  public: Boolean
}

input ClassificationUpdateInput {
  _id: ObjectId
  _id_unset: Boolean
  incidents: ClassificationIncidentsRelationInput
  publish_unset: Boolean
  reports_unset: Boolean
  attributes_unset: Boolean
  publish: Boolean
  attributes: [ClassificationAttributeUpdateInput]
  namespace_unset: Boolean
  notes: String
  incidents_unset: Boolean
  namespace: String
  reports: ClassificationReportsRelationInput
  notes_unset: Boolean
}

type IncidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input History_incidentEmbeddingQueryInput {
  from_reports: [Int]
  vector: [Float]
  from_reports_nin: [Int]
  from_reports_exists: Boolean
  AND: [History_incidentEmbeddingQueryInput!]
  OR: [History_incidentEmbeddingQueryInput!]
  from_reports_in: [Int]
  vector_nin: [Float]
  vector_exists: Boolean
  vector_in: [Float]
}

type InsertManyPayload {
  insertedIds: [ObjectId]!
}

input QuickaddUpdateInput {
  source_domain_unset: Boolean
  _id: ObjectId
  url_unset: Boolean
  _id_unset: Boolean
  url: String
  date_submitted_unset: Boolean
  incident_id_unset: Boolean
  source_domain: String
  date_submitted: String
  incident_id: Long
}

input DuplicateInsertInput {
  duplicate_incident_number: Int
  true_incident_number: Int
  _id: ObjectId
}

enum ClassificationSortByInput {
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
  _ID_ASC
  _ID_DESC
  NAMESPACE_ASC
}

input ChecklistRiskPrecedentInsertInput {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input History_incidentTsneInsertInput {
  x: Float
  y: Float
}

input IncidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input History_incidentUpdateInput {
  title: String
  date_unset: Boolean
  embedding_unset: Boolean
  epoch_date_modified_unset: Boolean
  modifiedBy: String
  AllegedHarmedOrNearlyHarmedParties: [String]
  title_unset: Boolean
  AllegedDeployerOfAISystem_unset: Boolean
  AllegedDeveloperOfAISystem: [String]
  implicated_systems_unset: Boolean
  editors: [String]
  description_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  incident_id_unset: Boolean
  editor_dissimilar_incidents: [Int]
  editors_unset: Boolean
  reports: [Int]
  _id: ObjectId
  nlp_similar_incidents_unset: Boolean
  tsne_unset: Boolean
  editor_notes_unset: Boolean
  date: String
  incident_id_inc: Int
  incident_id: Int
  editor_similar_incidents: [Int]
  editor_similar_incidents_unset: Boolean
  reports_unset: Boolean
  _id_unset: Boolean
  epoch_date_modified_inc: Int
  AllegedDeveloperOfAISystem_unset: Boolean
  epoch_date_modified: Int
  AllegedDeployerOfAISystem: [String]
  description: String
  editor_notes: String
  modifiedBy_unset: Boolean
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  editor_dissimilar_incidents_unset: Boolean
  embedding: History_incidentEmbeddingUpdateInput
  tsne: History_incidentTsneUpdateInput
  flagged_dissimilar_incidents_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  implicated_systems: [String]
}

input ReportUpdateInput {
  date_modified_unset: Boolean
  flag_unset: Boolean
  user: ReportUserRelationInput
  date_submitted: DateTime
  _id: ObjectId
  editor_notes_unset: Boolean
  epoch_date_published: Int
  description: String
  report_number_inc: Int
  cloudinary_id_unset: Boolean
  inputs_outputs: [String]
  authors: [String]
  url: String
  epoch_date_modified_unset: Boolean
  plain_text_unset: Boolean
  epoch_date_published_inc: Int
  epoch_date_submitted_unset: Boolean
  language_unset: Boolean
  date_modified: DateTime
  url_unset: Boolean
  epoch_date_submitted_inc: Int
  cloudinary_id: String
  submitters_unset: Boolean
  image_url: String
  embedding: ReportEmbeddingUpdateInput
  text: String
  tags: [String]
  text_unset: Boolean
  image_url_unset: Boolean
  date_published: DateTime
  is_incident_report: Boolean
  language: String
  is_incident_report_unset: Boolean
  date_published_unset: Boolean
  quiet: Boolean
  plain_text: String
  submitters: [String]
  description_unset: Boolean
  report_number_unset: Boolean
  embedding_unset: Boolean
  epoch_date_downloaded: Int
  epoch_date_submitted: Int
  inputs_outputs_unset: Boolean
  user_unset: Boolean
  epoch_date_published_unset: Boolean
  quiet_unset: Boolean
  report_number: Int
  title: String
  date_downloaded_unset: Boolean
  date_downloaded: DateTime
  source_domain_unset: Boolean
  epoch_date_downloaded_inc: Int
  source_domain: String
  tags_unset: Boolean
  epoch_date_modified: Int
  editor_notes: String
  title_unset: Boolean
  flag: Boolean
  authors_unset: Boolean
  _id_unset: Boolean
  epoch_date_modified_inc: Int
  date_submitted_unset: Boolean
  epoch_date_downloaded_unset: Boolean
}

input History_incidentQueryInput {
  editor_similar_incidents_exists: Boolean
  AllegedDeployerOfAISystem: [String]
  description_ne: String
  title_gte: String
  _id_gt: ObjectId
  modifiedBy_nin: [String]
  title_in: [String]
  date: String
  editor_dissimilar_incidents_in: [Int]
  editor_notes_ne: String
  title_ne: String
  editor_similar_incidents_in: [Int]
  _id_in: [ObjectId]
  incident_id_exists: Boolean
  editor_notes_lte: String
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  editor_dissimilar_incidents: [Int]
  implicated_systems_nin: [String]
  description_gte: String
  date_gt: String
  epoch_date_modified: Int
  modifiedBy_gt: String
  tsne: History_incidentTsneQueryInput
  flagged_dissimilar_incidents_in: [Int]
  tsne_exists: Boolean
  flagged_dissimilar_incidents_exists: Boolean
  editor_notes_exists: Boolean
  implicated_systems: [String]
  editor_similar_incidents: [Int]
  epoch_date_modified_exists: Boolean
  description: String
  epoch_date_modified_lte: Int
  AllegedDeveloperOfAISystem_exists: Boolean
  title_nin: [String]
  implicated_systems_in: [String]
  modifiedBy_exists: Boolean
  date_in: [String]
  epoch_date_modified_in: [Int]
  title_exists: Boolean
  incident_id_lte: Int
  _id_ne: ObjectId
  _id_lt: ObjectId
  implicated_systems_exists: Boolean
  date_gte: String
  AllegedHarmedOrNearlyHarmedParties: [String]
  description_in: [String]
  AllegedDeployerOfAISystem_exists: Boolean
  editors_exists: Boolean
  description_nin: [String]
  editor_notes_gt: String
  reports_nin: [Int]
  description_gt: String
  epoch_date_modified_ne: Int
  flagged_dissimilar_incidents: [Int]
  incident_id_lt: Int
  embedding_exists: Boolean
  _id: ObjectId
  incident_id_gt: Int
  description_lte: String
  AllegedDeveloperOfAISystem_in: [String]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  editor_dissimilar_incidents_nin: [Int]
  _id_lte: ObjectId
  date_lt: String
  incident_id_in: [Int]
  title_lte: String
  incident_id_nin: [Int]
  editor_notes_in: [String]
  _id_nin: [ObjectId]
  epoch_date_modified_gt: Int
  reports_exists: Boolean
  title: String
  incident_id: Int
  _id_gte: ObjectId
  AllegedDeployerOfAISystem_in: [String]
  modifiedBy_gte: String
  nlp_similar_incidents_exists: Boolean
  flagged_dissimilar_incidents_nin: [Int]
  date_ne: String
  modifiedBy_ne: String
  AND: [History_incidentQueryInput!]
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  editor_notes: String
  editor_notes_gte: String
  AllegedDeployerOfAISystem_nin: [String]
  title_gt: String
  modifiedBy_in: [String]
  incident_id_ne: Int
  OR: [History_incidentQueryInput!]
  editor_dissimilar_incidents_exists: Boolean
  editors: [String]
  epoch_date_modified_nin: [Int]
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  date_nin: [String]
  reports: [Int]
  editors_nin: [String]
  editor_notes_lt: String
  embedding: History_incidentEmbeddingQueryInput
  date_exists: Boolean
  editor_similar_incidents_nin: [Int]
  editor_notes_nin: [String]
  _id_exists: Boolean
  reports_in: [Int]
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  description_exists: Boolean
  description_lt: String
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  epoch_date_modified_gte: Int
  editors_in: [String]
  epoch_date_modified_lt: Int
  modifiedBy_lte: String
  title_lt: String
  modifiedBy_lt: String
  date_lte: String
  AllegedDeveloperOfAISystem_nin: [String]
  AllegedDeveloperOfAISystem: [String]
  incident_id_gte: Int
  modifiedBy: String
}

input SubscriptionUpdateInput {
  _id_unset: Boolean
  entityId_unset: Boolean
  userId: SubscriptionUserIdRelationInput
  userId_unset: Boolean
  entityId: SubscriptionEntityIdRelationInput
  incident_id: SubscriptionIncident_idRelationInput
  incident_id_unset: Boolean
  type: String
  _id: ObjectId
  type_unset: Boolean
}

input ChecklistRiskUpdateInput {
  likelihood_unset: Boolean
  risk_notes: String
  title: String
  generated_unset: Boolean
  severity_unset: Boolean
  tags: [String]
  generated: Boolean
  touched: Boolean
  tags_unset: Boolean
  likelihood: String
  risk_status_unset: Boolean
  severity: String
  title_unset: Boolean
  precedents_unset: Boolean
  risk_notes_unset: Boolean
  touched_unset: Boolean
  id_unset: Boolean
  risk_status: String
  id: String
  precedents: [ChecklistRiskPrecedentUpdateInput]
}

input ClassificationAttributeQueryInput {
  value_json_lt: String
  value_json_in: [String]
  short_name: String
  short_name_nin: [String]
  short_name_lte: String
  value_json_nin: [String]
  value_json_lte: String
  AND: [ClassificationAttributeQueryInput!]
  short_name_ne: String
  value_json_ne: String
  OR: [ClassificationAttributeQueryInput!]
  value_json_gte: String
  short_name_lt: String
  value_json_gt: String
  value_json_exists: Boolean
  short_name_gte: String
  value_json: String
  short_name_gt: String
  short_name_in: [String]
  short_name_exists: Boolean
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

type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}

enum NotificationSortByInput {
  TYPE_ASC
  USERID_ASC
  USERID_DESC
  _ID_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  SENTDATE_DESC
  _ID_ASC
  SENTDATE_ASC
  TYPE_DESC
}

input QuickaddInsertInput {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input ChecklistUpdateInput {
  risks: [ChecklistRiskUpdateInput]
  date_updated_unset: Boolean
  id_unset: Boolean
  tags_methods: [String]
  entity_id: String
  date_created: DateTime
  date_updated: DateTime
  owner_id_unset: Boolean
  tags_methods_unset: Boolean
  id: String
  owner_id: String
  _id_unset: Boolean
  tags_goals: [String]
  tags_other_unset: Boolean
  about: String
  risks_unset: Boolean
  entity_id_unset: Boolean
  date_created_unset: Boolean
  tags_goals_unset: Boolean
  tags_other: [String]
  about_unset: Boolean
  name_unset: Boolean
  name: String
  _id: ObjectId
}

input NotificationQueryInput {
  _id_gte: ObjectId
  type: String
  sentDate_exists: Boolean
  incident_id_in: [Int]
  processed_ne: Boolean
  sentDate_gte: DateTime
  type_in: [String]
  sentDate_nin: [DateTime]
  _id_ne: ObjectId
  processed: Boolean
  type_exists: Boolean
  AND: [NotificationQueryInput!]
  incident_id_lt: Int
  OR: [NotificationQueryInput!]
  sentDate_lte: DateTime
  incident_id_ne: Int
  type_gt: String
  incident_id_exists: Boolean
  incident_id_gte: Int
  userId_exists: Boolean
  incident_id: Int
  _id_lte: ObjectId
  _id_gt: ObjectId
  sentDate: DateTime
  _id_exists: Boolean
  incident_id_lte: Int
  type_lt: String
  incident_id_nin: [Int]
  sentDate_gt: DateTime
  type_gte: String
  type_lte: String
  processed_exists: Boolean
  userId: UserQueryInput
  sentDate_ne: DateTime
  sentDate_lt: DateTime
  _id_in: [ObjectId]
  type_ne: String
  _id_nin: [ObjectId]
  _id: ObjectId
  _id_lt: ObjectId
  type_nin: [String]
  incident_id_gt: Int
  sentDate_in: [DateTime]
}

type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}

input NotificationUpdateInput {
  _id: ObjectId
  incident_id_unset: Boolean
  userId: NotificationUserIdRelationInput
  processed: Boolean
  processed_unset: Boolean
  type: String
  type_unset: Boolean
  userId_unset: Boolean
  incident_id: Int
  sentDate_unset: Boolean
  _id_unset: Boolean
  incident_id_inc: Int
  sentDate: DateTime
}

input CandidateEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
}

input History_reportInsertInput {
  authors: [String]!
  title: String!
  date_published: DateTime!
  epoch_date_submitted: Int!
  flag: Boolean
  submitters: [String]!
  editor_notes: String
  is_incident_report: Boolean
  quiet: Boolean
  tags: [String]!
  text: String!
  source_domain: String!
  cloudinary_id: String!
  epoch_date_downloaded: Int!
  inputs_outputs: [String]
  epoch_date_published: Int!
  user: String
  embedding: History_reportEmbeddingInsertInput
  date_modified: DateTime!
  plain_text: String!
  report_number: Int!
  date_submitted: DateTime!
  image_url: String!
  language: String!
  description: String
  epoch_date_modified: Int!
  date_downloaded: DateTime!
  _id: ObjectId
  url: String!
  modifiedBy: String
}

input SubmissionNlp_similar_incidentQueryInput {
  incident_id_gt: Int
  similarity_lte: Float
  incident_id_lt: Int
  similarity_exists: Boolean
  incident_id_exists: Boolean
  incident_id_gte: Int
  incident_id: Int
  similarity_ne: Float
  incident_id_ne: Int
  similarity: Float
  similarity_gt: Float
  similarity_lt: Float
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_in: [Int]
  incident_id_lte: Int
  incident_id_nin: [Int]
  similarity_in: [Float]
  similarity_gte: Float
  similarity_nin: [Float]
  AND: [SubmissionNlp_similar_incidentQueryInput!]
}

input TaxaField_listQueryInput {
  field_number_gte: String
  field_number: String
  mongo_type_gte: String
  mongo_type_lt: String
  short_name_in: [String]
  long_name_ne: String
  weight_gte: Int
  default_in: [String]
  mongo_type_nin: [String]
  required_exists: Boolean
  short_description: String
  default_gte: String
  permitted_values_nin: [String]
  long_name_nin: [String]
  field_number_lt: String
  weight_gt: Int
  display_type_gt: String
  long_description_lt: String
  weight: Int
  long_description_in: [String]
  placeholder_nin: [String]
  complete_from_exists: Boolean
  display_type: String
  placeholder_lte: String
  display_type_exists: Boolean
  long_description: String
  weight_lt: Int
  default_ne: String
  public_exists: Boolean
  short_description_nin: [String]
  permitted_values_exists: Boolean
  mongo_type_gt: String
  long_description_ne: String
  placeholder_lt: String
  AND: [TaxaField_listQueryInput!]
  required_ne: Boolean
  required: Boolean
  weight_in: [Int]
  display_type_in: [String]
  display_type_nin: [String]
  short_name_lte: String
  short_description_in: [String]
  display_type_lt: String
  field_number_lte: String
  mongo_type: String
  default_gt: String
  placeholder_exists: Boolean
  short_name_lt: String
  long_description_lte: String
  placeholder_ne: String
  mongo_type_exists: Boolean
  instant_facet_exists: Boolean
  long_name_gte: String
  short_name_nin: [String]
  long_name_lt: String
  mongo_type_lte: String
  instant_facet_ne: Boolean
  short_name: String
  OR: [TaxaField_listQueryInput!]
  placeholder_in: [String]
  hide_search_exists: Boolean
  long_name_in: [String]
  default_lt: String
  item_fields: TaxaField_listItem_fieldQueryInput
  long_description_gt: String
  placeholder: String
  default_lte: String
  long_description_nin: [String]
  long_name_gt: String
  mongo_type_in: [String]
  short_description_gte: String
  default: String
  display_type_lte: String
  long_name_exists: Boolean
  hide_search_ne: Boolean
  field_number_nin: [String]
  long_name: String
  permitted_values_in: [String]
  weight_ne: Int
  field_number_in: [String]
  weight_nin: [Int]
  short_description_lte: String
  short_name_exists: Boolean
  weight_lte: Int
  short_description_ne: String
  long_description_gte: String
  field_number_ne: String
  permitted_values: [String]
  short_description_exists: Boolean
  public_ne: Boolean
  instant_facet: Boolean
  short_name_ne: String
  short_description_gt: String
  default_nin: [String]
  weight_exists: Boolean
  complete_from: TaxaField_listComplete_fromQueryInput
  hide_search: Boolean
  short_name_gt: String
  short_name_gte: String
  public: Boolean
  default_exists: Boolean
  long_name_lte: String
  placeholder_gte: String
  display_type_ne: String
  short_description_lt: String
  item_fields_exists: Boolean
  field_number_gt: String
  display_type_gte: String
  placeholder_gt: String
  field_number_exists: Boolean
  long_description_exists: Boolean
  mongo_type_ne: String
}

input History_incidentInsertInput {
  tsne: History_incidentTsneInsertInput
  incident_id: Int!
  title: String!
  AllegedDeveloperOfAISystem: [String]
  _id: ObjectId
  modifiedBy: String
  editor_notes: String
  description: String
  editors: [String]!
  AllegedDeployerOfAISystem: [String]
  implicated_systems: [String]
  date: String!
  editor_similar_incidents: [Int]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  AllegedHarmedOrNearlyHarmedParties: [String]
  embedding: History_incidentEmbeddingInsertInput
  epoch_date_modified: Int
  flagged_dissimilar_incidents: [Int]
  editor_dissimilar_incidents: [Int]
  reports: [Int]!
}

input History_incidentEmbeddingInsertInput {
  vector: [Float]
  from_reports: [Int]
}

input SubscriptionIncident_idRelationInput {
  create: IncidentInsertInput
  link: Int
}

input TaxaField_listItem_fieldUpdateInput {
  required_unset: Boolean
  complete_from_unset: Boolean
  instant_facet: Boolean
  weight_inc: Int
  long_description_unset: Boolean
  short_name_unset: Boolean
  display_type_unset: Boolean
  short_description: String
  short_name: String
  permitted_values_unset: Boolean
  public_unset: Boolean
  mongo_type_unset: Boolean
  long_name_unset: Boolean
  short_description_unset: Boolean
  mongo_type: String
  placeholder_unset: Boolean
  instant_facet_unset: Boolean
  field_number_unset: Boolean
  long_name: String
  display_type: String
  placeholder: String
  public: Boolean
  field_number: String
  default_unset: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  weight_unset: Boolean
  long_description: String
  default: String
  permitted_values: [String]
  weight: Int
  required: Boolean
}

input TaxaField_listComplete_fromUpdateInput {
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
}

input TaxaQueryInput {
  namespace: String
  namespace_gt: String
  _id: ObjectId
  _id_exists: Boolean
  weight_gt: Int
  weight_ne: Int
  namespace_in: [String]
  namespace_nin: [String]
  _id_ne: ObjectId
  dummy_fields_exists: Boolean
  weight_exists: Boolean
  namespace_gte: String
  description_nin: [String]
  field_list_in: [TaxaField_listQueryInput]
  description_lt: String
  _id_gte: ObjectId
  namespace_ne: String
  _id_gt: ObjectId
  complete_entities_exists: Boolean
  weight_in: [Int]
  _id_lte: ObjectId
  description_gte: String
  OR: [TaxaQueryInput!]
  description_in: [String]
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  field_list_exists: Boolean
  description_exists: Boolean
  dummy_fields: [TaxaDummy_fieldQueryInput]
  description_ne: String
  description_gt: String
  _id_in: [ObjectId]
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  field_list_nin: [TaxaField_listQueryInput]
  _id_lt: ObjectId
  namespace_lte: String
  complete_entities_ne: Boolean
  _id_nin: [ObjectId]
  namespace_lt: String
  AND: [TaxaQueryInput!]
  complete_entities: Boolean
  description: String
  weight: Int
  namespace_exists: Boolean
  weight_lt: Int
  weight_nin: [Int]
  weight_lte: Int
  weight_gte: Int
  description_lte: String
  field_list: [TaxaField_listQueryInput]
}

input CandidateClassification_similarityQueryInput {
  classification_gte: String
  similarity_in: [Float]
  similarity_gt: Float
  classification_lte: String
  classification: String
  classification_gt: String
  similarity_lt: Float
  similarity_nin: [Float]
  similarity_exists: Boolean
  similarity_gte: Float
  OR: [CandidateClassification_similarityQueryInput!]
  similarity_lte: Float
  classification_ne: String
  classification_lt: String
  similarity_ne: Float
  classification_nin: [String]
  classification_in: [String]
  AND: [CandidateClassification_similarityQueryInput!]
  classification_exists: Boolean
  similarity: Float
}

input ChecklistRiskQueryInput {
  title_nin: [String]
  id_ne: String
  risk_notes_gte: String
  risk_status_lte: String
  generated: Boolean
  touched: Boolean
  severity_lt: String
  AND: [ChecklistRiskQueryInput!]
  severity: String
  risk_status_in: [String]
  severity_ne: String
  touched_ne: Boolean
  likelihood_in: [String]
  risk_status_gt: String
  risk_status_exists: Boolean
  likelihood_gte: String
  likelihood_lte: String
  risk_status_gte: String
  severity_exists: Boolean
  likelihood: String
  id_gt: String
  risk_notes_exists: Boolean
  id_in: [String]
  risk_status_nin: [String]
  severity_nin: [String]
  likelihood_lt: String
  severity_in: [String]
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  generated_exists: Boolean
  touched_exists: Boolean
  likelihood_ne: String
  id_nin: [String]
  title_lt: String
  id: String
  likelihood_exists: Boolean
  risk_notes: String
  title_lte: String
  generated_ne: Boolean
  risk_notes_in: [String]
  severity_lte: String
  risk_notes_nin: [String]
  title_in: [String]
  title_ne: String
  risk_notes_ne: String
  risk_notes_lt: String
  tags: [String]
  id_exists: Boolean
  id_lte: String
  OR: [ChecklistRiskQueryInput!]
  severity_gt: String
  risk_status: String
  id_gte: String
  title_gt: String
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  title: String
  risk_status_lt: String
  risk_notes_gt: String
  tags_exists: Boolean
  title_exists: Boolean
  risk_status_ne: String
  risk_notes_lte: String
  precedents_exists: Boolean
  likelihood_gt: String
  id_lt: String
  tags_nin: [String]
  severity_gte: String
  tags_in: [String]
  title_gte: String
  precedents: [ChecklistRiskPrecedentQueryInput]
  likelihood_nin: [String]
}

type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input UserInsertInput {
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

input ClassificationIncidentsRelationInput {
  create: [IncidentInsertInput]
  link: [Int]
}

input TaxaField_listItem_fieldComplete_fromUpdateInput {
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  entities: Boolean
  entities_unset: Boolean
  all: [String]
}

input History_reportQueryInput {
  text: String
  editor_notes_in: [String]
  plain_text_nin: [String]
  epoch_date_modified_lt: Int
  date_published_gt: DateTime
  _id_gt: ObjectId
  plain_text_gt: String
  cloudinary_id_lte: String
  epoch_date_modified_exists: Boolean
  modifiedBy_ne: String
  report_number_lte: Int
  title_ne: String
  epoch_date_published_lt: Int
  modifiedBy_nin: [String]
  language_nin: [String]
  date_modified_ne: DateTime
  description: String
  plain_text: String
  image_url: String
  report_number_in: [Int]
  report_number_lt: Int
  epoch_date_modified_gte: Int
  editor_notes: String
  cloudinary_id_gt: String
  title_gt: String
  source_domain_gte: String
  _id_lte: ObjectId
  language_exists: Boolean
  date_published_gte: DateTime
  language_gt: String
  date_modified_gt: DateTime
  language_ne: String
  title_lte: String
  epoch_date_published_lte: Int
  epoch_date_submitted_nin: [Int]
  user_gt: String
  report_number: Int
  source_domain_gt: String
  modifiedBy: String
  text_ne: String
  text_lte: String
  cloudinary_id_lt: String
  cloudinary_id_ne: String
  epoch_date_submitted_lte: Int
  _id: ObjectId
  user: String
  report_number_nin: [Int]
  date_modified_in: [DateTime]
  description_lt: String
  modifiedBy_lte: String
  epoch_date_downloaded_exists: Boolean
  description_ne: String
  inputs_outputs_in: [String]
  submitters: [String]
  embedding_exists: Boolean
  date_downloaded_gte: DateTime
  _id_in: [ObjectId]
  image_url_in: [String]
  authors_exists: Boolean
  description_lte: String
  image_url_lte: String
  is_incident_report_exists: Boolean
  description_gt: String
  modifiedBy_gt: String
  date_submitted_exists: Boolean
  modifiedBy_exists: Boolean
  report_number_gte: Int
  submitters_in: [String]
  date_submitted_lte: DateTime
  epoch_date_modified_nin: [Int]
  epoch_date_modified_lte: Int
  text_gte: String
  cloudinary_id_gte: String
  source_domain_exists: Boolean
  editor_notes_nin: [String]
  modifiedBy_lt: String
  date_published_in: [DateTime]
  title_in: [String]
  epoch_date_modified_in: [Int]
  title: String
  epoch_date_downloaded_in: [Int]
  date_downloaded_ne: DateTime
  date_published_exists: Boolean
  modifiedBy_gte: String
  image_url_exists: Boolean
  date_downloaded_in: [DateTime]
  epoch_date_submitted_lt: Int
  text_lt: String
  cloudinary_id_nin: [String]
  date_submitted: DateTime
  epoch_date_submitted_ne: Int
  image_url_gt: String
  epoch_date_modified: Int
  source_domain_ne: String
  epoch_date_downloaded: Int
  user_ne: String
  epoch_date_downloaded_lte: Int
  source_domain_in: [String]
  date_published: DateTime
  text_nin: [String]
  report_number_ne: Int
  source_domain_nin: [String]
  description_gte: String
  tags_exists: Boolean
  date_modified_lte: DateTime
  epoch_date_published_exists: Boolean
  epoch_date_submitted_in: [Int]
  _id_gte: ObjectId
  epoch_date_published_ne: Int
  url_lte: String
  text_in: [String]
  date_downloaded_lt: DateTime
  report_number_exists: Boolean
  url_exists: Boolean
  AND: [History_reportQueryInput!]
  _id_lt: ObjectId
  submitters_nin: [String]
  date_submitted_gte: DateTime
  OR: [History_reportQueryInput!]
  source_domain: String
  modifiedBy_in: [String]
  date_downloaded_exists: Boolean
  date_modified_exists: Boolean
  epoch_date_published_in: [Int]
  plain_text_exists: Boolean
  language_gte: String
  editor_notes_lte: String
  description_in: [String]
  language_in: [String]
  url_ne: String
  date_published_lte: DateTime
  tags: [String]
  epoch_date_submitted_gte: Int
  flag_exists: Boolean
  is_incident_report_ne: Boolean
  url_gt: String
  epoch_date_downloaded_gte: Int
  inputs_outputs: [String]
  language_lt: String
  date_modified_nin: [DateTime]
  editor_notes_exists: Boolean
  epoch_date_published_gt: Int
  date_modified_gte: DateTime
  language_lte: String
  source_domain_lte: String
  cloudinary_id_in: [String]
  image_url_lt: String
  url_nin: [String]
  tags_in: [String]
  url_lt: String
  epoch_date_published: Int
  inputs_outputs_nin: [String]
  editor_notes_gte: String
  user_exists: Boolean
  url: String
  date_modified: DateTime
  user_in: [String]
  authors: [String]
  plain_text_gte: String
  language: String
  date_published_lt: DateTime
  epoch_date_modified_gt: Int
  submitters_exists: Boolean
  _id_nin: [ObjectId]
  url_gte: String
  epoch_date_published_gte: Int
  date_downloaded_gt: DateTime
  description_nin: [String]
  plain_text_ne: String
  inputs_outputs_exists: Boolean
  quiet_exists: Boolean
  user_lt: String
  authors_in: [String]
  date_submitted_lt: DateTime
  image_url_gte: String
  title_lt: String
  quiet_ne: Boolean
  title_gte: String
  plain_text_in: [String]
  date_submitted_in: [DateTime]
  epoch_date_downloaded_ne: Int
  cloudinary_id: String
  source_domain_lt: String
  tags_nin: [String]
  epoch_date_submitted: Int
  plain_text_lte: String
  image_url_nin: [String]
  user_lte: String
  epoch_date_published_nin: [Int]
  image_url_ne: String
  date_published_nin: [DateTime]
  cloudinary_id_exists: Boolean
  quiet: Boolean
  title_nin: [String]
  _id_ne: ObjectId
  date_downloaded: DateTime
  epoch_date_downloaded_gt: Int
  text_exists: Boolean
  epoch_date_submitted_gt: Int
  editor_notes_lt: String
  url_in: [String]
  title_exists: Boolean
  user_nin: [String]
  _id_exists: Boolean
  text_gt: String
  user_gte: String
  epoch_date_downloaded_lt: Int
  date_submitted_nin: [DateTime]
  flag: Boolean
  epoch_date_downloaded_nin: [Int]
  description_exists: Boolean
  date_submitted_ne: DateTime
  is_incident_report: Boolean
  plain_text_lt: String
  editor_notes_gt: String
  date_downloaded_nin: [DateTime]
  embedding: History_reportEmbeddingQueryInput
  date_submitted_gt: DateTime
  report_number_gt: Int
  authors_nin: [String]
  editor_notes_ne: String
  flag_ne: Boolean
  epoch_date_modified_ne: Int
  date_modified_lt: DateTime
  date_published_ne: DateTime
  date_downloaded_lte: DateTime
  epoch_date_submitted_exists: Boolean
}

type TaxaDummy_field {
  field_number: String
  short_name: String
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

input ClassificationQueryInput {
  notes_gte: String
  reports_nin: [ReportQueryInput]
  _id: ObjectId
  namespace_gte: String
  notes_exists: Boolean
  attributes_in: [ClassificationAttributeQueryInput]
  publish_ne: Boolean
  namespace: String
  namespace_nin: [String]
  incidents_nin: [IncidentQueryInput]
  _id_gte: ObjectId
  notes: String
  AND: [ClassificationQueryInput!]
  _id_gt: ObjectId
  publish: Boolean
  attributes: [ClassificationAttributeQueryInput]
  reports_in: [ReportQueryInput]
  _id_in: [ObjectId]
  notes_lt: String
  _id_exists: Boolean
  namespace_lte: String
  _id_lte: ObjectId
  _id_ne: ObjectId
  incidents: [IncidentQueryInput]
  OR: [ClassificationQueryInput!]
  incidents_in: [IncidentQueryInput]
  incidents_exists: Boolean
  notes_ne: String
  notes_nin: [String]
  notes_gt: String
  attributes_exists: Boolean
  namespace_in: [String]
  namespace_exists: Boolean
  notes_in: [String]
  namespace_ne: String
  publish_exists: Boolean
  namespace_gt: String
  reports_exists: Boolean
  _id_nin: [ObjectId]
  reports: [ReportQueryInput]
  _id_lt: ObjectId
  namespace_lt: String
  notes_lte: String
  attributes_nin: [ClassificationAttributeQueryInput]
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

input TaxaInsertInput {
  description: String
  dummy_fields: [TaxaDummy_fieldInsertInput]
  field_list: [TaxaField_listInsertInput]
  namespace: String
  weight: Int
  _id: ObjectId
  complete_entities: Boolean
}

type IncidentTsne {
  x: Float
  y: Float
}

enum QuickaddSortByInput {
  SOURCE_DOMAIN_ASC
  SOURCE_DOMAIN_DESC
  URL_DESC
  _ID_ASC
  _ID_DESC
  DATE_SUBMITTED_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  DATE_SUBMITTED_ASC
  URL_ASC
}

enum History_reportSortByInput {
  DATE_SUBMITTED_ASC
  DATE_SUBMITTED_DESC
  DESCRIPTION_DESC
  MODIFIEDBY_ASC
  MODIFIEDBY_DESC
  DATE_MODIFIED_ASC
  EPOCH_DATE_SUBMITTED_DESC
  IMAGE_URL_ASC
  LANGUAGE_ASC
  PLAIN_TEXT_DESC
  URL_DESC
  _ID_DESC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  REPORT_NUMBER_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  PLAIN_TEXT_ASC
  SOURCE_DOMAIN_ASC
  TEXT_DESC
  CLOUDINARY_ID_DESC
  DATE_PUBLISHED_DESC
  IMAGE_URL_DESC
  REPORT_NUMBER_ASC
  TITLE_ASC
  TITLE_DESC
  CLOUDINARY_ID_ASC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_MODIFIED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  DESCRIPTION_ASC
  EPOCH_DATE_MODIFIED_ASC
  LANGUAGE_DESC
  SOURCE_DOMAIN_DESC
  URL_ASC
  USER_ASC
  _ID_ASC
  DATE_MODIFIED_DESC
  EDITOR_NOTES_ASC
  TEXT_ASC
  USER_DESC
}

input ChecklistRiskInsertInput {
  severity: String
  title: String
  id: String
  generated: Boolean
  risk_notes: String
  risk_status: String
  likelihood: String
  precedents: [ChecklistRiskPrecedentInsertInput]
  tags: [String]
  touched: Boolean
}

input History_incidentTsneUpdateInput {
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
  x_unset: Boolean
  y: Float
}

type LogReportHistoryPayload {
  report_number: Int
}

input GetUserInput {
  userId: ObjectId
}

input IncidentAllegedDeployerOfAISystemRelationInput {
  link: [String]
  create: [EntityInsertInput]
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
  submissions(limit: Int = 100, sortBy: SubmissionSortByInput, query: SubmissionQueryInput): [Submission]!
  subscription(query: SubscriptionQueryInput): Subscription
  subscriptions(query: SubscriptionQueryInput, limit: Int = 100, sortBy: SubscriptionSortByInput): [Subscription]!
  taxa(query: TaxaQueryInput): Taxa
  taxas(query: TaxaQueryInput, limit: Int = 100, sortBy: TaxaSortByInput): [Taxa]!
  user(query: UserQueryInput): User
  users(query: UserQueryInput, limit: Int = 100, sortBy: UserSortByInput): [User]!
}

input TaxaField_listItem_fieldQueryInput {
  default_in: [String]
  display_type_ne: String
  display_type_lte: String
  field_number_lte: String
  short_description_gt: String
  required_ne: Boolean
  weight_lt: Int
  default_lte: String
  mongo_type_lt: String
  display_type_nin: [String]
  weight_gt: Int
  field_number_nin: [String]
  display_type: String
  long_description_in: [String]
  mongo_type_exists: Boolean
  placeholder_gte: String
  default_ne: String
  default_lt: String
  placeholder_ne: String
  placeholder_gt: String
  short_name: String
  long_description_exists: Boolean
  field_number_in: [String]
  instant_facet_exists: Boolean
  field_number_gte: String
  long_description_nin: [String]
  long_description_lte: String
  short_name_lte: String
  field_number_exists: Boolean
  short_description_gte: String
  placeholder_lt: String
  long_name_gte: String
  mongo_type: String
  display_type_lt: String
  default_nin: [String]
  mongo_type_ne: String
  short_name_lt: String
  long_name_exists: Boolean
  mongo_type_lte: String
  OR: [TaxaField_listItem_fieldQueryInput!]
  long_name_lte: String
  weight_gte: Int
  default_exists: Boolean
  default_gte: String
  display_type_gte: String
  instant_facet: Boolean
  field_number_ne: String
  long_name_ne: String
  default_gt: String
  permitted_values: [String]
  long_description_ne: String
  public: Boolean
  mongo_type_nin: [String]
  default: String
  short_name_gt: String
  weight: Int
  short_name_exists: Boolean
  long_description_gt: String
  long_name_nin: [String]
  long_description_gte: String
  public_exists: Boolean
  long_description: String
  required: Boolean
  placeholder: String
  display_type_exists: Boolean
  mongo_type_in: [String]
  weight_exists: Boolean
  weight_nin: [Int]
  placeholder_lte: String
  short_description_exists: Boolean
  long_name_gt: String
  weight_in: [Int]
  short_description: String
  mongo_type_gt: String
  instant_facet_ne: Boolean
  field_number_lt: String
  short_name_ne: String
  long_name: String
  short_name_nin: [String]
  AND: [TaxaField_listItem_fieldQueryInput!]
  long_name_in: [String]
  placeholder_in: [String]
  field_number_gt: String
  long_description_lt: String
  short_description_ne: String
  placeholder_nin: [String]
  complete_from_exists: Boolean
  short_description_lt: String
  mongo_type_gte: String
  weight_ne: Int
  short_description_nin: [String]
  display_type_in: [String]
  short_description_in: [String]
  public_ne: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  long_name_lt: String
  required_exists: Boolean
  permitted_values_nin: [String]
  permitted_values_exists: Boolean
  weight_lte: Int
  short_name_gte: String
  short_name_in: [String]
  permitted_values_in: [String]
  short_description_lte: String
  display_type_gt: String
  field_number: String
  placeholder_exists: Boolean
}

input ReportQueryInput {
  source_domain_exists: Boolean
  cloudinary_id_exists: Boolean
  image_url_gt: String
  text: String
  date_downloaded_ne: DateTime
  plain_text_ne: String
  date_downloaded_gte: DateTime
  title_gt: String
  date_published_gte: DateTime
  date_submitted: DateTime
  image_url_lte: String
  _id_ne: ObjectId
  epoch_date_downloaded: Int
  report_number_gte: Int
  source_domain_gt: String
  date_downloaded_gt: DateTime
  language_in: [String]
  user_exists: Boolean
  date_published_lte: DateTime
  language_lte: String
  url_in: [String]
  epoch_date_published_gte: Int
  epoch_date_published_exists: Boolean
  inputs_outputs: [String]
  epoch_date_downloaded_gte: Int
  language_gte: String
  epoch_date_submitted_nin: [Int]
  date_modified_gte: DateTime
  epoch_date_submitted_lt: Int
  date_submitted_in: [DateTime]
  epoch_date_published_lte: Int
  inputs_outputs_nin: [String]
  date_published: DateTime
  date_published_nin: [DateTime]
  submitters_in: [String]
  embedding: ReportEmbeddingQueryInput
  report_number_nin: [Int]
  plain_text_lt: String
  source_domain: String
  date_submitted_lte: DateTime
  date_published_ne: DateTime
  url_exists: Boolean
  epoch_date_modified_gte: Int
  epoch_date_submitted_exists: Boolean
  quiet_ne: Boolean
  source_domain_lt: String
  submitters_nin: [String]
  title_nin: [String]
  cloudinary_id_lt: String
  editor_notes_gt: String
  language_lt: String
  description_nin: [String]
  epoch_date_submitted_ne: Int
  date_modified_in: [DateTime]
  language: String
  submitters_exists: Boolean
  _id: ObjectId
  url: String
  text_in: [String]
  epoch_date_modified: Int
  quiet: Boolean
  url_gte: String
  date_downloaded_lte: DateTime
  epoch_date_published_lt: Int
  language_nin: [String]
  quiet_exists: Boolean
  date_submitted_gt: DateTime
  epoch_date_downloaded_nin: [Int]
  url_gt: String
  report_number_exists: Boolean
  cloudinary_id_lte: String
  source_domain_gte: String
  editor_notes_gte: String
  epoch_date_submitted_lte: Int
  is_incident_report: Boolean
  plain_text_exists: Boolean
  url_lt: String
  submitters: [String]
  date_published_lt: DateTime
  epoch_date_published: Int
  description_lte: String
  language_exists: Boolean
  editor_notes: String
  tags_exists: Boolean
  _id_gt: ObjectId
  date_submitted_nin: [DateTime]
  cloudinary_id_nin: [String]
  plain_text_gt: String
  epoch_date_submitted: Int
  description: String
  flag_ne: Boolean
  title_lt: String
  title_ne: String
  date_submitted_ne: DateTime
  editor_notes_lt: String
  date_submitted_lt: DateTime
  tags_in: [String]
  report_number_in: [Int]
  flag_exists: Boolean
  cloudinary_id_gte: String
  AND: [ReportQueryInput!]
  epoch_date_submitted_gte: Int
  date_modified_lte: DateTime
  epoch_date_downloaded_lte: Int
  epoch_date_published_nin: [Int]
  image_url_nin: [String]
  date_modified_gt: DateTime
  url_ne: String
  report_number_lte: Int
  image_url_lt: String
  user: UserQueryInput
  authors_exists: Boolean
  date_modified_lt: DateTime
  date_modified: DateTime
  plain_text: String
  tags_nin: [String]
  editor_notes_exists: Boolean
  epoch_date_downloaded_exists: Boolean
  _id_lte: ObjectId
  date_published_gt: DateTime
  epoch_date_submitted_gt: Int
  epoch_date_submitted_in: [Int]
  date_downloaded_in: [DateTime]
  date_submitted_exists: Boolean
  cloudinary_id_in: [String]
  date_modified_nin: [DateTime]
  _id_in: [ObjectId]
  date_downloaded_lt: DateTime
  plain_text_in: [String]
  text_gt: String
  text_exists: Boolean
  epoch_date_modified_in: [Int]
  epoch_date_published_gt: Int
  title: String
  description_in: [String]
  description_ne: String
  date_modified_exists: Boolean
  text_nin: [String]
  epoch_date_downloaded_gt: Int
  image_url_in: [String]
  source_domain_lte: String
  authors: [String]
  image_url_ne: String
  cloudinary_id: String
  image_url_gte: String
  date_downloaded_exists: Boolean
  url_lte: String
  epoch_date_modified_lte: Int
  epoch_date_modified_nin: [Int]
  text_ne: String
  epoch_date_published_in: [Int]
  epoch_date_modified_lt: Int
  epoch_date_modified_ne: Int
  date_submitted_gte: DateTime
  _id_exists: Boolean
  language_gt: String
  epoch_date_published_ne: Int
  description_gt: String
  image_url: String
  is_incident_report_exists: Boolean
  report_number_ne: Int
  flag: Boolean
  title_in: [String]
  plain_text_lte: String
  tags: [String]
  date_published_in: [DateTime]
  url_nin: [String]
  date_published_exists: Boolean
  plain_text_gte: String
  report_number: Int
  editor_notes_ne: String
  epoch_date_modified_exists: Boolean
  authors_in: [String]
  image_url_exists: Boolean
  editor_notes_lte: String
  language_ne: String
  description_gte: String
  OR: [ReportQueryInput!]
  text_lte: String
  embedding_exists: Boolean
  date_downloaded: DateTime
  text_gte: String
  _id_lt: ObjectId
  editor_notes_in: [String]
  date_downloaded_nin: [DateTime]
  _id_nin: [ObjectId]
  source_domain_in: [String]
  source_domain_nin: [String]
  report_number_lt: Int
  title_lte: String
  cloudinary_id_gt: String
  source_domain_ne: String
  inputs_outputs_exists: Boolean
  title_gte: String
  description_exists: Boolean
  description_lt: String
  epoch_date_downloaded_in: [Int]
  text_lt: String
  plain_text_nin: [String]
  title_exists: Boolean
  epoch_date_downloaded_lt: Int
  date_modified_ne: DateTime
  authors_nin: [String]
  inputs_outputs_in: [String]
  cloudinary_id_ne: String
  _id_gte: ObjectId
  editor_notes_nin: [String]
  report_number_gt: Int
  is_incident_report_ne: Boolean
  epoch_date_modified_gt: Int
  epoch_date_downloaded_ne: Int
}

type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input IncidentReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

input IncidentEmbeddingInsertInput {
  vector: [Float]
  from_reports: [Int]
}

input CandidateInsertInput {
  embedding: CandidateEmbeddingInsertInput
  plain_text: String
  language: String
  classification_similarity: [CandidateClassification_similarityInsertInput]
  epoch_date_published: Int
  match: Boolean!
  authors: [String]
  date_published: String
  image_url: String
  text: String
  matching_harm_keywords: [String]
  url: String!
  title: String
  dismissed: Boolean
  _id: ObjectId
  source_domain: String
  similarity: Float
  date_downloaded: String
  matching_keywords: [String]
  epoch_date_downloaded: Int
  matching_entities: [String]
}

input TaxaUpdateInput {
  weight_inc: Int
  _id: ObjectId
  complete_entities: Boolean
  weight_unset: Boolean
  _id_unset: Boolean
  description: String
  weight: Int
  dummy_fields_unset: Boolean
  field_list: [TaxaField_listUpdateInput]
  namespace: String
  description_unset: Boolean
  dummy_fields: [TaxaDummy_fieldUpdateInput]
  namespace_unset: Boolean
  complete_entities_unset: Boolean
  field_list_unset: Boolean
}

input ReportEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input UserQueryInput {
  last_name_exists: Boolean
  userId_nin: [String]
  _id_in: [ObjectId]
  first_name_in: [String]
  roles_in: [String]
  AND: [UserQueryInput!]
  last_name_gte: String
  last_name_nin: [String]
  first_name_lt: String
  _id_gte: ObjectId
  OR: [UserQueryInput!]
  last_name_ne: String
  _id_nin: [ObjectId]
  first_name_nin: [String]
  userId_exists: Boolean
  _id_gt: ObjectId
  last_name_lt: String
  userId_lte: String
  userId_ne: String
  last_name: String
  last_name_lte: String
  roles: [String]
  _id_lt: ObjectId
  first_name: String
  last_name_gt: String
  first_name_exists: Boolean
  first_name_gt: String
  userId_gte: String
  roles_exists: Boolean
  userId_in: [String]
  userId: String
  userId_gt: String
  last_name_in: [String]
  _id_exists: Boolean
  first_name_gte: String
  first_name_lte: String
  first_name_ne: String
  userId_lt: String
  _id_ne: ObjectId
  _id_lte: ObjectId
  roles_nin: [String]
  _id: ObjectId
}

enum History_incidentSortByInput {
  _ID_ASC
  _ID_DESC
  EDITOR_NOTES_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  MODIFIEDBY_DESC
  MODIFIEDBY_ASC
  DATE_DESC
  DESCRIPTION_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  DATE_ASC
  DESCRIPTION_ASC
  EPOCH_DATE_MODIFIED_ASC
  TITLE_ASC
  TITLE_DESC
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
  implicated_systems: [String]
  incident_id: Int
  nlp_similar_incidents: [RisksPayloadPrecedentNlp_similar_incident]
  reports: [Int]
  tags: [String]
  title: String
  tsne: RisksPayloadPrecedentTsne
}

input IncidentEmbeddingUpdateInput {
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input ClassificationInsertInput {
  incidents: ClassificationIncidentsRelationInput!
  namespace: String!
  notes: String
  publish: Boolean
  reports: ClassificationReportsRelationInput!
  _id: ObjectId
  attributes: [ClassificationAttributeInsertInput]
}

type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input TaxaDummy_fieldQueryInput {
  field_number_nin: [String]
  short_name: String
  OR: [TaxaDummy_fieldQueryInput!]
  short_name_in: [String]
  short_name_ne: String
  AND: [TaxaDummy_fieldQueryInput!]
  short_name_gte: String
  short_name_exists: Boolean
  field_number_lte: String
  field_number_exists: Boolean
  field_number_ne: String
  field_number_in: [String]
  short_name_nin: [String]
  short_name_lt: String
  field_number_lt: String
  short_name_gt: String
  field_number_gte: String
  short_name_lte: String
  field_number: String
  field_number_gt: String
}

enum SubmissionSortByInput {
  SOURCE_DOMAIN_ASC
  STATUS_DESC
  CLOUDINARY_ID_DESC
  DATE_DOWNLOADED_ASC
  IMAGE_URL_DESC
  INCIDENT_TITLE_ASC
  _ID_DESC
  DATE_SUBMITTED_DESC
  SOURCE_DOMAIN_DESC
  TEXT_ASC
  TEXT_DESC
  DATE_PUBLISHED_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_DESC
  LANGUAGE_ASC
  PLAIN_TEXT_ASC
  USER_ASC
  USER_DESC
  DATE_DOWNLOADED_DESC
  EDITOR_NOTES_DESC
  INCIDENT_DATE_ASC
  INCIDENT_DATE_DESC
  INCIDENT_TITLE_DESC
  PLAIN_TEXT_DESC
  DATE_MODIFIED_ASC
  DATE_SUBMITTED_ASC
  EDITOR_NOTES_ASC
  IMAGE_URL_ASC
  DATE_PUBLISHED_DESC
  TITLE_ASC
  _ID_ASC
  DESCRIPTION_ASC
  EPOCH_DATE_MODIFIED_ASC
  LANGUAGE_DESC
  URL_ASC
  URL_DESC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_DESC
  STATUS_ASC
  TITLE_DESC
}

type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input EntityInsertInput {
  date_modified: DateTime
  entity_id: String!
  name: String!
  _id: ObjectId
  created_at: DateTime
}

input IncidentEditorsRelationInput {
  link: [String]
  create: [UserInsertInput]
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

type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
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

type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

enum EntitySortByInput {
  _ID_ASC
  ENTITY_ID_ASC
  NAME_ASC
  NAME_DESC
  _ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  ENTITY_ID_DESC
}

input ChecklistQueryInput {
  OR: [ChecklistQueryInput!]
  about_exists: Boolean
  name_gt: String
  date_updated_ne: DateTime
  about_ne: String
  name_exists: Boolean
  date_updated_nin: [DateTime]
  date_created_gt: DateTime
  tags_goals_in: [String]
  date_updated_gte: DateTime
  about_lt: String
  entity_id_gte: String
  _id_exists: Boolean
  _id: ObjectId
  about_nin: [String]
  date_created_lt: DateTime
  tags_methods: [String]
  tags_methods_in: [String]
  id: String
  id_in: [String]
  owner_id_gte: String
  tags_methods_nin: [String]
  about_gt: String
  tags_goals_nin: [String]
  name_nin: [String]
  id_gt: String
  tags_goals_exists: Boolean
  date_updated_exists: Boolean
  risks_nin: [ChecklistRiskQueryInput]
  owner_id_lte: String
  date_created_in: [DateTime]
  name_lt: String
  date_created_exists: Boolean
  tags_other_exists: Boolean
  risks_exists: Boolean
  id_lte: String
  date_updated_in: [DateTime]
  id_ne: String
  owner_id_nin: [String]
  date_created_lte: DateTime
  name_ne: String
  about: String
  entity_id_lte: String
  owner_id_ne: String
  date_updated_lt: DateTime
  tags_other: [String]
  id_lt: String
  AND: [ChecklistQueryInput!]
  entity_id: String
  name_gte: String
  date_updated_lte: DateTime
  _id_gte: ObjectId
  date_updated: DateTime
  name_lte: String
  owner_id_in: [String]
  tags_methods_exists: Boolean
  about_in: [String]
  owner_id_exists: Boolean
  _id_gt: ObjectId
  entity_id_ne: String
  date_updated_gt: DateTime
  _id_nin: [ObjectId]
  _id_ne: ObjectId
  date_created: DateTime
  _id_in: [ObjectId]
  owner_id: String
  owner_id_gt: String
  about_gte: String
  tags_goals: [String]
  name_in: [String]
  date_created_nin: [DateTime]
  entity_id_in: [String]
  entity_id_nin: [String]
  about_lte: String
  name: String
  id_nin: [String]
  entity_id_lt: String
  owner_id_lt: String
  date_created_gte: DateTime
  id_gte: String
  tags_other_nin: [String]
  _id_lte: ObjectId
  tags_other_in: [String]
  risks: [ChecklistRiskQueryInput]
  entity_id_gt: String
  date_created_ne: DateTime
  _id_lt: ObjectId
  risks_in: [ChecklistRiskQueryInput]
  entity_id_exists: Boolean
  id_exists: Boolean
}

enum CandidateSortByInput {
  IMAGE_URL_DESC
  SOURCE_DOMAIN_ASC
  DATE_PUBLISHED_ASC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_PUBLISHED_DESC
  LANGUAGE_DESC
  PLAIN_TEXT_ASC
  PLAIN_TEXT_DESC
  TEXT_ASC
  TEXT_DESC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  TITLE_ASC
  URL_ASC
  SOURCE_DOMAIN_DESC
  TITLE_DESC
  _ID_ASC
  IMAGE_URL_ASC
  LANGUAGE_ASC
  SIMILARITY_ASC
  SIMILARITY_DESC
  URL_DESC
  _ID_DESC
  DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_ASC
}

type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input ChecklistInsertInput {
  id: String
  name: String
  _id: ObjectId
  entity_id: String
  tags_other: [String]
  date_created: DateTime
  about: String
  owner_id: String
  tags_goals: [String]
  tags_methods: [String]
  risks: [ChecklistRiskInsertInput]
  date_updated: DateTime
}

input CandidateClassification_similarityInsertInput {
  similarity: Float
  classification: String
}

input CreateDefaultAdminUserInput {
  email: String
  password: String
}

type AppUser {
  email: String
}

type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}

input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input History_reportEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
}

input IncidentQueryInput {
  description_lt: String
  description_lte: String
  epoch_date_modified_lte: Int
  incident_id: Int
  editor_notes_in: [String]
  tsne_exists: Boolean
  editor_similar_incidents_nin: [Int]
  date_exists: Boolean
  description_ne: String
  editors_exists: Boolean
  editor_notes_lte: String
  date_in: [String]
  _id_gte: ObjectId
  editor_dissimilar_incidents_exists: Boolean
  flagged_dissimilar_incidents: [Int]
  editor_similar_incidents_exists: Boolean
  incident_id_nin: [Int]
  editor_notes_gt: String
  embedding: IncidentEmbeddingQueryInput
  epoch_date_modified_nin: [Int]
  title_in: [String]
  reports_exists: Boolean
  title_gt: String
  tsne: IncidentTsneQueryInput
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  editor_dissimilar_incidents_in: [Int]
  title_nin: [String]
  epoch_date_modified: Int
  editor_similar_incidents: [Int]
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  reports: [ReportQueryInput]
  embedding_exists: Boolean
  editor_dissimilar_incidents: [Int]
  incident_id_in: [Int]
  incident_id_exists: Boolean
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  _id: ObjectId
  date: String
  incident_id_ne: Int
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  title_lte: String
  incident_id_lt: Int
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  epoch_date_modified_in: [Int]
  editors_in: [UserQueryInput]
  description: String
  AND: [IncidentQueryInput!]
  editors: [UserQueryInput]
  description_gte: String
  date_gte: String
  editor_notes: String
  _id_lte: ObjectId
  AllegedDeployerOfAISystem: [EntityQueryInput]
  AllegedDeployerOfAISystem_exists: Boolean
  incident_id_lte: Int
  date_lte: String
  editors_nin: [UserQueryInput]
  editor_notes_nin: [String]
  epoch_date_modified_lt: Int
  date_nin: [String]
  flagged_dissimilar_incidents_nin: [Int]
  nlp_similar_incidents_exists: Boolean
  _id_lt: ObjectId
  editor_dissimilar_incidents_nin: [Int]
  reports_nin: [ReportQueryInput]
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  title_lt: String
  editor_notes_gte: String
  _id_nin: [ObjectId]
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  epoch_date_modified_gte: Int
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  description_in: [String]
  date_gt: String
  title: String
  editor_similar_incidents_in: [Int]
  _id_gt: ObjectId
  incident_id_gte: Int
  date_ne: String
  AllegedDeveloperOfAISystem_exists: Boolean
  flagged_dissimilar_incidents_exists: Boolean
  description_exists: Boolean
  title_gte: String
  epoch_date_modified_gt: Int
  date_lt: String
  title_exists: Boolean
  editor_notes_exists: Boolean
  OR: [IncidentQueryInput!]
  epoch_date_modified_exists: Boolean
  reports_in: [ReportQueryInput]
  epoch_date_modified_ne: Int
  title_ne: String
  description_nin: [String]
  flagged_dissimilar_incidents_in: [Int]
  description_gt: String
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  _id_in: [ObjectId]
  incident_id_gt: Int
  _id_ne: ObjectId
  editor_notes_lt: String
  editor_notes_ne: String
  _id_exists: Boolean
  implicated_systems: [EntityQueryInput]
}

enum DuplicateSortByInput {
  _ID_ASC
  _ID_DESC
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
}

enum ReportSortByInput {
  DATE_DOWNLOADED_ASC
  DESCRIPTION_DESC
  REPORT_NUMBER_DESC
  TITLE_DESC
  IMAGE_URL_ASC
  IMAGE_URL_DESC
  LANGUAGE_ASC
  LANGUAGE_DESC
  PLAIN_TEXT_DESC
  REPORT_NUMBER_ASC
  SOURCE_DOMAIN_ASC
  URL_DESC
  _ID_ASC
  CLOUDINARY_ID_ASC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_ASC
  DATE_PUBLISHED_DESC
  DATE_SUBMITTED_DESC
  TITLE_ASC
  DATE_SUBMITTED_ASC
  DESCRIPTION_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  TEXT_ASC
  PLAIN_TEXT_ASC
  TEXT_DESC
  USER_ASC
  _ID_DESC
  DATE_MODIFIED_DESC
  EPOCH_DATE_MODIFIED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  SOURCE_DOMAIN_DESC
  URL_ASC
  CLOUDINARY_ID_DESC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  EPOCH_DATE_SUBMITTED_DESC
  USER_DESC
  DATE_MODIFIED_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_ASC
}

type DeleteManyPayload {
  deletedCount: Int!
}

input IncidentTsneUpdateInput {
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_unset: Boolean
  x_inc: Float
  y: Float
}

input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

type User {
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

input History_reportEmbeddingQueryInput {
  from_text_hash_nin: [String]
  from_text_hash_in: [String]
  from_text_hash_exists: Boolean
  from_text_hash_gt: String
  from_text_hash_gte: String
  from_text_hash_ne: String
  vector: [Float]
  from_text_hash_lte: String
  vector_nin: [Float]
  vector_exists: Boolean
  OR: [History_reportEmbeddingQueryInput!]
  vector_in: [Float]
  from_text_hash_lt: String
  AND: [History_reportEmbeddingQueryInput!]
  from_text_hash: String
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

input IncidentTsneQueryInput {
  y_ne: Float
  y_lt: Float
  y: Float
  y_in: [Float]
  x_ne: Float
  x_lt: Float
  x_in: [Float]
  x: Float
  y_lte: Float
  y_gte: Float
  AND: [IncidentTsneQueryInput!]
  x_gt: Float
  x_lte: Float
  y_exists: Boolean
  OR: [IncidentTsneQueryInput!]
  x_gte: Float
  x_exists: Boolean
  x_nin: [Float]
  y_gt: Float
  y_nin: [Float]
}

input CandidateQueryInput {
  matching_entities_exists: Boolean
  epoch_date_published_gt: Int
  image_url_exists: Boolean
  text_ne: String
  _id_nin: [ObjectId]
  language_lte: String
  source_domain_in: [String]
  image_url: String
  text_lt: String
  title_nin: [String]
  image_url_lte: String
  _id_lte: ObjectId
  date_published_in: [String]
  source_domain_lte: String
  date_downloaded_gt: String
  _id_gte: ObjectId
  text_nin: [String]
  title_lte: String
  classification_similarity_exists: Boolean
  dismissed_ne: Boolean
  plain_text_lte: String
  embedding: CandidateEmbeddingQueryInput
  language_exists: Boolean
  plain_text_lt: String
  similarity_gte: Float
  epoch_date_downloaded_ne: Int
  title_lt: String
  epoch_date_published_nin: [Int]
  matching_keywords_nin: [String]
  authors_exists: Boolean
  title_ne: String
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  dismissed_exists: Boolean
  matching_harm_keywords_exists: Boolean
  classification_similarity: [CandidateClassification_similarityQueryInput]
  source_domain_exists: Boolean
  epoch_date_published: Int
  matching_entities: [String]
  epoch_date_downloaded_nin: [Int]
  authors_in: [String]
  source_domain_ne: String
  source_domain_lt: String
  similarity: Float
  language_nin: [String]
  match_exists: Boolean
  language_ne: String
  date_downloaded_lt: String
  date_downloaded_ne: String
  OR: [CandidateQueryInput!]
  epoch_date_downloaded: Int
  similarity_lt: Float
  url_in: [String]
  date_downloaded_nin: [String]
  _id_gt: ObjectId
  image_url_ne: String
  text_exists: Boolean
  text_gt: String
  authors: [String]
  language_in: [String]
  title_exists: Boolean
  url_exists: Boolean
  date_published_exists: Boolean
  text_lte: String
  title_gte: String
  url: String
  text: String
  similarity_gt: Float
  plain_text_in: [String]
  epoch_date_published_lt: Int
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  date_published_lte: String
  language: String
  date_downloaded_gte: String
  date_downloaded_in: [String]
  epoch_date_downloaded_lte: Int
  date_published_nin: [String]
  matching_harm_keywords: [String]
  language_lt: String
  url_ne: String
  epoch_date_published_gte: Int
  source_domain_nin: [String]
  matching_harm_keywords_nin: [String]
  date_published_gte: String
  epoch_date_downloaded_lt: Int
  _id_exists: Boolean
  date_published: String
  matching_keywords_in: [String]
  _id: ObjectId
  url_lte: String
  url_gt: String
  epoch_date_downloaded_in: [Int]
  language_gt: String
  url_nin: [String]
  matching_harm_keywords_in: [String]
  plain_text_exists: Boolean
  epoch_date_downloaded_exists: Boolean
  embedding_exists: Boolean
  plain_text: String
  epoch_date_downloaded_gt: Int
  similarity_nin: [Float]
  image_url_gt: String
  title_in: [String]
  source_domain_gt: String
  epoch_date_published_in: [Int]
  matching_entities_nin: [String]
  date_downloaded_lte: String
  similarity_in: [Float]
  language_gte: String
  url_gte: String
  match_ne: Boolean
  matching_keywords_exists: Boolean
  image_url_gte: String
  text_gte: String
  plain_text_gte: String
  _id_lt: ObjectId
  image_url_nin: [String]
  title: String
  date_downloaded_exists: Boolean
  title_gt: String
  authors_nin: [String]
  source_domain_gte: String
  date_downloaded: String
  similarity_ne: Float
  date_published_ne: String
  match: Boolean
  text_in: [String]
  similarity_lte: Float
  plain_text_nin: [String]
  image_url_in: [String]
  date_published_lt: String
  dismissed: Boolean
  matching_keywords: [String]
  source_domain: String
  epoch_date_downloaded_gte: Int
  _id_in: [ObjectId]
  epoch_date_published_ne: Int
  matching_entities_in: [String]
  epoch_date_published_lte: Int
  image_url_lt: String
  _id_ne: ObjectId
  plain_text_ne: String
  AND: [CandidateQueryInput!]
  url_lt: String
  epoch_date_published_exists: Boolean
  plain_text_gt: String
  similarity_exists: Boolean
  date_published_gt: String
}

enum SubscriptionSortByInput {
  _ID_DESC
  ENTITYID_ASC
  INCIDENT_ID_DESC
  USERID_ASC
  USERID_DESC
  _ID_ASC
  ENTITYID_DESC
  INCIDENT_ID_ASC
  TYPE_ASC
  TYPE_DESC
}

input IncidentNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_unset: Boolean
  similarity_inc: Float
}

input TaxaField_listItem_fieldInsertInput {
  long_description: String
  mongo_type: String
  short_name: String
  display_type: String
  instant_facet: Boolean
  required: Boolean
  field_number: String
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
  placeholder: String
  long_name: String
  public: Boolean
  permitted_values: [String]
  short_description: String
  default: String
  weight: Int
}

input TaxaField_listUpdateInput {
  hide_search_unset: Boolean
  placeholder_unset: Boolean
  placeholder: String
  long_description_unset: Boolean
  item_fields: TaxaField_listItem_fieldUpdateInput
  short_name: String
  hide_search: Boolean
  long_name: String
  mongo_type: String
  public_unset: Boolean
  short_description: String
  instant_facet: Boolean
  long_description: String
  weight_inc: Int
  complete_from: TaxaField_listComplete_fromUpdateInput
  field_number: String
  field_number_unset: Boolean
  required: Boolean
  display_type: String
  complete_from_unset: Boolean
  long_name_unset: Boolean
  mongo_type_unset: Boolean
  weight_unset: Boolean
  short_name_unset: Boolean
  required_unset: Boolean
  default: String
  default_unset: Boolean
  instant_facet_unset: Boolean
  weight: Int
  display_type_unset: Boolean
  permitted_values_unset: Boolean
  short_description_unset: Boolean
  item_fields_unset: Boolean
  permitted_values: [String]
  public: Boolean
}

input ClassificationAttributeUpdateInput {
  short_name: String
  short_name_unset: Boolean
  value_json: String
  value_json_unset: Boolean
}

scalar ObjectId

input TaxaField_listItem_fieldComplete_fromQueryInput {
  entities_exists: Boolean
  current_nin: [String]
  entities: Boolean
  current: [String]
  current_in: [String]
  entities_ne: Boolean
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all: [String]
  all_nin: [String]
  all_exists: Boolean
  all_in: [String]
  current_exists: Boolean
}

input ClassificationReportsRelationInput {
  link: [Int]
  create: [ReportInsertInput]
}

input TaxaDummy_fieldUpdateInput {
  short_name_unset: Boolean
  field_number: String
  field_number_unset: Boolean
  short_name: String
}

input SubmissionIncident_editorsRelationInput {
  create: [UserInsertInput]
  link: [String]
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

type Entity {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
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

type TaxaField_listComplete_from {
  all: [String]
  current: [String]
}

type Incident {
  AllegedDeployerOfAISystem: [Entity]
  AllegedDeveloperOfAISystem: [Entity]
  AllegedHarmedOrNearlyHarmedParties: [Entity]
  implicated_systems: [Entity]
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

type ClassificationAttribute {
  short_name: String
  value_json: String
}

scalar Long

input History_incidentEmbeddingUpdateInput {
  vector_unset: Boolean
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
}

input History_incidentNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}

input TaxaField_listComplete_fromInsertInput {
  current: [String]
  all: [String]
}

input IncidentInsertInput {
  editor_notes: String
  _id: ObjectId
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  date: String!
  flagged_dissimilar_incidents: [Int]
  epoch_date_modified: Int
  editor_dissimilar_incidents: [Int]
  editor_similar_incidents: [Int]
  reports: IncidentReportsRelationInput!
  tsne: IncidentTsneInsertInput
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  title: String!
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  editors: IncidentEditorsRelationInput!
  incident_id: Int!
  embedding: IncidentEmbeddingInsertInput
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  description: String
  implicated_systems: IncidentImplicatedSystemsRelationInput
}

type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}

input IncidentEmbeddingQueryInput {
  vector_exists: Boolean
  from_reports_exists: Boolean
  vector_in: [Float]
  vector_nin: [Float]
  OR: [IncidentEmbeddingQueryInput!]
  from_reports: [Int]
  from_reports_in: [Int]
  AND: [IncidentEmbeddingQueryInput!]
  from_reports_nin: [Int]
  vector: [Float]
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

type History_incidentTsne {
  x: Float
  y: Float
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

input SubmissionHarmed_partiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input SubmissionEmbeddingUpdateInput {
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
}

input NotificationInsertInput {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: NotificationUserIdRelationInput
}

input History_reportUpdateInput {
  epoch_date_downloaded: Int
  date_submitted_unset: Boolean
  embedding: History_reportEmbeddingUpdateInput
  date_submitted: DateTime
  description: String
  title_unset: Boolean
  _id_unset: Boolean
  epoch_date_submitted_unset: Boolean
  is_incident_report: Boolean
  _id: ObjectId
  quiet: Boolean
  url: String
  epoch_date_published_unset: Boolean
  user_unset: Boolean
  date_modified_unset: Boolean
  is_incident_report_unset: Boolean
  date_modified: DateTime
  modifiedBy_unset: Boolean
  epoch_date_submitted_inc: Int
  date_downloaded_unset: Boolean
  report_number: Int
  source_domain: String
  flag: Boolean
  tags_unset: Boolean
  text: String
  report_number_unset: Boolean
  tags: [String]
  source_domain_unset: Boolean
  authors: [String]
  image_url: String
  submitters: [String]
  epoch_date_modified: Int
  language: String
  date_published_unset: Boolean
  description_unset: Boolean
  submitters_unset: Boolean
  editor_notes_unset: Boolean
  language_unset: Boolean
  text_unset: Boolean
  embedding_unset: Boolean
  authors_unset: Boolean
  editor_notes: String
  title: String
  epoch_date_modified_unset: Boolean
  user: String
  flag_unset: Boolean
  epoch_date_submitted: Int
  date_downloaded: DateTime
  image_url_unset: Boolean
  cloudinary_id_unset: Boolean
  modifiedBy: String
  epoch_date_downloaded_inc: Int
  epoch_date_published: Int
  url_unset: Boolean
  inputs_outputs_unset: Boolean
  quiet_unset: Boolean
  cloudinary_id: String
  plain_text: String
  epoch_date_published_inc: Int
  epoch_date_downloaded_unset: Boolean
  plain_text_unset: Boolean
  report_number_inc: Int
  epoch_date_modified_inc: Int
  inputs_outputs: [String]
  date_published: DateTime
}

input History_incidentNlp_similar_incidentQueryInput {
  similarity_lt: Float
  incident_id_nin: [Int]
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_gt: Int
  similarity_gt: Float
  incident_id_ne: Int
  similarity_exists: Boolean
  incident_id_lte: Int
  incident_id_in: [Int]
  incident_id_lt: Int
  similarity_gte: Float
  similarity_in: [Float]
  similarity_ne: Float
  similarity_lte: Float
  similarity: Float
  similarity_nin: [Float]
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id: Int
  incident_id_exists: Boolean
  incident_id_gte: Int
}

input ReportInsertInput {
  description: String
  tags: [String]!
  text: String!
  submitters: [String]!
  image_url: String!
  is_incident_report: Boolean
  source_domain: String!
  url: String!
  cloudinary_id: String!
  embedding: ReportEmbeddingInsertInput
  _id: ObjectId
  date_submitted: DateTime!
  authors: [String]!
  date_downloaded: DateTime!
  editor_notes: String
  epoch_date_submitted: Int!
  date_modified: DateTime!
  epoch_date_modified: Int!
  quiet: Boolean
  plain_text: String!
  title: String!
  language: String!
  user: ReportUserRelationInput
  epoch_date_downloaded: Int!
  inputs_outputs: [String]
  date_published: DateTime!
  report_number: Int!
  epoch_date_published: Int!
  flag: Boolean
}

input TaxaDummy_fieldInsertInput {
  short_name: String
  field_number: String
}

input IncidentNlp_similar_incidentQueryInput {
  similarity_lte: Float
  similarity_nin: [Float]
  similarity_ne: Float
  incident_id: Int
  incident_id_lte: Int
  OR: [IncidentNlp_similar_incidentQueryInput!]
  incident_id_gt: Int
  incident_id_gte: Int
  similarity_in: [Float]
  similarity_gt: Float
  similarity_lt: Float
  incident_id_nin: [Int]
  similarity_exists: Boolean
  incident_id_exists: Boolean
  incident_id_lt: Int
  incident_id_in: [Int]
  incident_id_ne: Int
  similarity: Float
  AND: [IncidentNlp_similar_incidentQueryInput!]
  similarity_gte: Float
}

input QuickaddQueryInput {
  incident_id: Long
  url_exists: Boolean
  date_submitted_lte: String
  incident_id_lt: Long
  source_domain_gt: String
  date_submitted: String
  AND: [QuickaddQueryInput!]
  incident_id_ne: Long
  url_gt: String
  source_domain_lt: String
  url_lt: String
  date_submitted_nin: [String]
  incident_id_nin: [Long]
  _id_gte: ObjectId
  OR: [QuickaddQueryInput!]
  _id_lt: ObjectId
  incident_id_in: [Long]
  date_submitted_in: [String]
  incident_id_gte: Long
  date_submitted_ne: String
  _id_ne: ObjectId
  _id_gt: ObjectId
  url: String
  _id_exists: Boolean
  date_submitted_gte: String
  source_domain_ne: String
  url_lte: String
  date_submitted_lt: String
  source_domain_in: [String]
  source_domain: String
  _id_nin: [ObjectId]
  source_domain_exists: Boolean
  date_submitted_exists: Boolean
  source_domain_lte: String
  source_domain_gte: String
  incident_id_lte: Long
  source_domain_nin: [String]
  _id: ObjectId
  date_submitted_gt: String
  url_in: [String]
  _id_in: [ObjectId]
  incident_id_exists: Boolean
  incident_id_gt: Long
  url_ne: String
  _id_lte: ObjectId
  url_gte: String
  url_nin: [String]
}

type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

type CandidateClassification_similarity {
  classification: String
  similarity: Float
}

input SubscriptionQueryInput {
  entityId_exists: Boolean
  type_gte: String
  type: String
  _id_lt: ObjectId
  _id_exists: Boolean
  _id_in: [ObjectId]
  type_lte: String
  userId: UserQueryInput
  type_lt: String
  entityId: EntityQueryInput
  incident_id: IncidentQueryInput
  _id_lte: ObjectId
  type_gt: String
  OR: [SubscriptionQueryInput!]
  type_exists: Boolean
  _id_gte: ObjectId
  _id_gt: ObjectId
  type_ne: String
  type_in: [String]
  AND: [SubscriptionQueryInput!]
  _id_nin: [ObjectId]
  userId_exists: Boolean
  incident_id_exists: Boolean
  _id: ObjectId
  _id_ne: ObjectId
  type_nin: [String]
}

input SubmissionUserRelationInput {
  link: String
  create: UserInsertInput
}

input CandidateClassification_similarityUpdateInput {
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  classification: String
  classification_unset: Boolean
}

type LogIncidentHistoryPayload {
  incident_id: Int
}

input SubmissionQueryInput {
  date_downloaded_lte: String
  _id_lte: ObjectId
  incident_title_lt: String
  description_nin: [String]
  cloudinary_id_gt: String
  _id_exists: Boolean
  epoch_date_modified_gt: Int
  language_nin: [String]
  date_published_exists: Boolean
  incident_date_gt: String
  url_ne: String
  user: UserQueryInput
  epoch_date_modified_ne: Int
  developers: [EntityQueryInput]
  incident_title_in: [String]
  plain_text_gt: String
  harmed_parties_exists: Boolean
  date_submitted_lte: String
  date_published: String
  url_gt: String
  date_published_gte: String
  submitters: [String]
  incident_date_lte: String
  editor_dissimilar_incidents_nin: [Int]
  incident_title_exists: Boolean
  date_downloaded_lt: String
  text_ne: String
  cloudinary_id_gte: String
  text_exists: Boolean
  source_domain_lte: String
  editor_notes_ne: String
  harmed_parties: [EntityQueryInput]
  incident_date_nin: [String]
  user_exists: Boolean
  _id_gt: ObjectId
  incident_title_nin: [String]
  date_published_in: [String]
  date_downloaded: String
  status_nin: [String]
  date_submitted_gt: String
  url: String
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  _id: ObjectId
  tags_nin: [String]
  date_downloaded_nin: [String]
  date_submitted_lt: String
  _id_lt: ObjectId
  submitters_in: [String]
  date_published_ne: String
  source_domain_ne: String
  status_gte: String
  url_nin: [String]
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  description_exists: Boolean
  incident_title_gte: String
  date_submitted_ne: String
  incident_date_exists: Boolean
  _id_nin: [ObjectId]
  date_modified_nin: [String]
  incident_editors: [UserQueryInput]
  title_ne: String
  plain_text_nin: [String]
  quiet_exists: Boolean
  date_modified_exists: Boolean
  image_url_ne: String
  date_submitted: String
  image_url_in: [String]
  status_gt: String
  status_lt: String
  source_domain_nin: [String]
  plain_text_lt: String
  editor_notes_lt: String
  incident_title_gt: String
  date_modified_gt: String
  date_modified_lt: String
  image_url_gt: String
  language_gte: String
  image_url_nin: [String]
  url_exists: Boolean
  text_gt: String
  title_gte: String
  language_in: [String]
  epoch_date_modified_exists: Boolean
  date_modified_lte: String
  epoch_date_modified_gte: Int
  incident_date_gte: String
  editor_notes_gt: String
  epoch_date_modified_lte: Int
  editor_notes: String
  date_downloaded_gt: String
  embedding: SubmissionEmbeddingQueryInput
  quiet: Boolean
  incident_title: String
  developers_exists: Boolean
  incident_date_lt: String
  plain_text_lte: String
  language_ne: String
  language_lt: String
  image_url_lte: String
  title_exists: Boolean
  image_url_lt: String
  source_domain: String
  description: String
  embedding_exists: Boolean
  editor_notes_nin: [String]
  incident_ids_in: [Int]
  date_published_lt: String
  date_published_gt: String
  status_exists: Boolean
  description_lt: String
  tags_in: [String]
  cloudinary_id: String
  plain_text_gte: String
  status_lte: String
  developers_nin: [EntityQueryInput]
  language: String
  tags_exists: Boolean
  deployers_in: [EntityQueryInput]
  developers_in: [EntityQueryInput]
  editor_similar_incidents_exists: Boolean
  _id_in: [ObjectId]
  url_in: [String]
  _id_ne: ObjectId
  incident_editors_in: [UserQueryInput]
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  harmed_parties_in: [EntityQueryInput]
  description_in: [String]
  submitters_nin: [String]
  cloudinary_id_lt: String
  OR: [SubmissionQueryInput!]
  description_lte: String
  text_gte: String
  plain_text_in: [String]
  language_gt: String
  cloudinary_id_exists: Boolean
  description_gt: String
  title: String
  date_downloaded_gte: String
  date_modified: String
  editor_dissimilar_incidents_in: [Int]
  authors_nin: [String]
  incident_title_lte: String
  epoch_date_modified_in: [Int]
  date_modified_ne: String
  editor_notes_in: [String]
  plain_text_ne: String
  date_downloaded_exists: Boolean
  date_submitted_exists: Boolean
  incident_title_ne: String
  date_submitted_nin: [String]
  _id_gte: ObjectId
  date_submitted_in: [String]
  nlp_similar_incidents_exists: Boolean
  status_ne: String
  incident_editors_nin: [UserQueryInput]
  description_ne: String
  epoch_date_modified_nin: [Int]
  authors: [String]
  cloudinary_id_nin: [String]
  editor_notes_lte: String
  epoch_date_modified_lt: Int
  editor_similar_incidents_nin: [Int]
  title_lt: String
  deployers_nin: [EntityQueryInput]
  description_gte: String
  text_nin: [String]
  language_exists: Boolean
  image_url: String
  language_lte: String
  editor_similar_incidents_in: [Int]
  tags: [String]
  incident_date_in: [String]
  source_domain_lt: String
  url_lt: String
  cloudinary_id_ne: String
  quiet_ne: Boolean
  authors_in: [String]
  title_nin: [String]
  image_url_gte: String
  source_domain_in: [String]
  title_gt: String
  date_modified_in: [String]
  plain_text_exists: Boolean
  incident_ids_exists: Boolean
  image_url_exists: Boolean
  AND: [SubmissionQueryInput!]
  authors_exists: Boolean
  deployers_exists: Boolean
  cloudinary_id_in: [String]
  url_gte: String
  date_published_nin: [String]
  date_modified_gte: String
  editor_dissimilar_incidents: [Int]
  status: String
  title_in: [String]
  date_submitted_gte: String
  editor_dissimilar_incidents_exists: Boolean
  incident_ids: [Int]
  text_lt: String
  incident_editors_exists: Boolean
  submitters_exists: Boolean
  plain_text: String
  editor_notes_gte: String
  incident_date_ne: String
  epoch_date_modified: Int
  editor_similar_incidents: [Int]
  incident_date: String
  url_lte: String
  date_published_lte: String
  status_in: [String]
  incident_ids_nin: [Int]
  date_downloaded_ne: String
  date_downloaded_in: [String]
  text_lte: String
  deployers: [EntityQueryInput]
  source_domain_gte: String
  text: String
  source_domain_exists: Boolean
  source_domain_gt: String
  title_lte: String
  editor_notes_exists: Boolean
  text_in: [String]
  cloudinary_id_lte: String
  harmed_parties_nin: [EntityQueryInput]
}

input EntityQueryInput {
  AND: [EntityQueryInput!]
  _id_gt: ObjectId
  created_at_gte: DateTime
  name: String
  entity_id_gte: String
  _id_lte: ObjectId
  created_at_lt: DateTime
  date_modified_lt: DateTime
  date_modified_lte: DateTime
  name_in: [String]
  date_modified_gte: DateTime
  date_modified_in: [DateTime]
  date_modified_nin: [DateTime]
  name_lt: String
  entity_id_lt: String
  name_gt: String
  created_at_in: [DateTime]
  created_at_exists: Boolean
  _id_lt: ObjectId
  entity_id_ne: String
  OR: [EntityQueryInput!]
  _id_gte: ObjectId
  _id_ne: ObjectId
  name_nin: [String]
  name_ne: String
  created_at: DateTime
  entity_id_nin: [String]
  name_gte: String
  entity_id: String
  name_lte: String
  _id_exists: Boolean
  date_modified: DateTime
  created_at_lte: DateTime
  _id: ObjectId
  created_at_gt: DateTime
  created_at_ne: DateTime
  name_exists: Boolean
  created_at_nin: [DateTime]
  date_modified_exists: Boolean
  entity_id_lte: String
  entity_id_exists: Boolean
  entity_id_gt: String
  date_modified_ne: DateTime
  date_modified_gt: DateTime
  _id_in: [ObjectId]
  _id_nin: [ObjectId]
  entity_id_in: [String]
}

type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}

type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}

input RisksInput {
  tags: [String]
}

type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}

input SubmissionNlp_similar_incidentInsertInput {
  similarity: Float
  incident_id: Int
}

input History_incidentTsneQueryInput {
  y_lt: Float
  y_lte: Float
  x_gte: Float
  y_exists: Boolean
  y_in: [Float]
  x_ne: Float
  y_gt: Float
  y_ne: Float
  x: Float
  y_gte: Float
  x_lt: Float
  y: Float
  x_in: [Float]
  x_gt: Float
  x_lte: Float
  x_exists: Boolean
  y_nin: [Float]
  OR: [History_incidentTsneQueryInput!]
  x_nin: [Float]
  AND: [History_incidentTsneQueryInput!]
}

type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}

input SubmissionEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input UserUpdateInput {
  userId: String
  first_name: String
  roles_unset: Boolean
  _id: ObjectId
  last_name: String
  roles: [String]
  userId_unset: Boolean
  _id_unset: Boolean
  last_name_unset: Boolean
  first_name_unset: Boolean
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
  replaceOneDuplicate(data: DuplicateInsertInput!, query: DuplicateQueryInput): Duplicate
  replaceOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  replaceOneHistory_incident(data: History_incidentInsertInput!, query: History_incidentQueryInput): History_incident
  replaceOneHistory_report(data: History_reportInsertInput!, query: History_reportQueryInput): History_report
  replaceOneIncident(data: IncidentInsertInput!, query: IncidentQueryInput): Incident
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
  updateManySubscriptions(set: SubscriptionUpdateInput!, query: SubscriptionQueryInput): UpdateManyPayload
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
  upsertOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
  upsertOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  upsertOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  upsertOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  upsertOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  upsertOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
}

input SubmissionInsertInput {
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  editor_similar_incidents: [Int]
  source_domain: String!
  text: String!
  incident_editors: SubmissionIncident_editorsRelationInput
  submitters: [String]!
  cloudinary_id: String
  editor_notes: String
  plain_text: String
  authors: [String]!
  _id: ObjectId
  tags: [String]!
  language: String!
  editor_dissimilar_incidents: [Int]
  date_published: String!
  harmed_parties: SubmissionHarmed_partiesRelationInput
  incident_title: String
  url: String!
  deployers: SubmissionDeployersRelationInput
  image_url: String!
  date_downloaded: String!
  embedding: SubmissionEmbeddingInsertInput
  user: SubmissionUserRelationInput
  developers: SubmissionDevelopersRelationInput
  epoch_date_modified: Int
  incident_ids: [Int]
  date_modified: String!
  description: String
  incident_date: String
  quiet: Boolean
  status: String
  date_submitted: String!
  title: String!
}

input ReportUserRelationInput {
  create: UserInsertInput
  link: String
}

scalar DateTime

input ReportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input PromoteSubmissionToReportInput {
  incident_ids: [Int]
  is_incident_report: Boolean
  submission_id: ObjectId
}

type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}

input History_reportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}
`;
