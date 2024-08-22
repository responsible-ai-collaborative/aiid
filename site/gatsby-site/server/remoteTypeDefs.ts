import gql from "graphql-tag";

export default gql`
type Mutation {
  createDefaultAdminUser(input: CreateDefaultAdminUserInput): DefaultAdminUser
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
  logIncidentHistory(input: History_incidentInsertInput): LogIncidentHistoryPayload
  logReportHistory(input: History_reportInsertInput): LogReportHistoryPayload
  processNotifications: Int
  promoteSubmissionToReport(input: PromoteSubmissionToReportInput): PromoteSubmissionToReportPayload
  replaceOneCandidate(query: CandidateQueryInput, data: CandidateInsertInput!): Candidate
  replaceOneChecklist(data: ChecklistInsertInput!, query: ChecklistQueryInput): Checklist
  replaceOneClassification(query: ClassificationQueryInput, data: ClassificationInsertInput!): Classification
  replaceOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  replaceOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  replaceOneEntity_relationship(query: Entity_relationshipQueryInput, data: Entity_relationshipInsertInput!): Entity_relationship
  replaceOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  replaceOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  replaceOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  replaceOneNotification(data: NotificationInsertInput!, query: NotificationQueryInput): Notification
  replaceOneQuickadd(data: QuickaddInsertInput!, query: QuickaddQueryInput): Quickadd
  replaceOneReport(data: ReportInsertInput!, query: ReportQueryInput): Report
  replaceOneSubmission(query: SubmissionQueryInput, data: SubmissionInsertInput!): Submission
  replaceOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  replaceOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  replaceOneUser(query: UserQueryInput, data: UserInsertInput!): User
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
  updateManyQuickadds(query: QuickaddQueryInput, set: QuickaddUpdateInput!): UpdateManyPayload
  updateManyReports(query: ReportQueryInput, set: ReportUpdateInput!): UpdateManyPayload
  updateManySubmissions(query: SubmissionQueryInput, set: SubmissionUpdateInput!): UpdateManyPayload
  updateManySubscriptions(query: SubscriptionQueryInput, set: SubscriptionUpdateInput!): UpdateManyPayload
  updateManyTaxas(set: TaxaUpdateInput!, query: TaxaQueryInput): UpdateManyPayload
  updateManyUsers(query: UserQueryInput, set: UserUpdateInput!): UpdateManyPayload
  updateOneCandidate(query: CandidateQueryInput, set: CandidateUpdateInput!): Candidate
  updateOneChecklist(query: ChecklistQueryInput, set: ChecklistUpdateInput!): Checklist
  updateOneClassification(query: ClassificationQueryInput, set: ClassificationUpdateInput!): Classification
  updateOneDuplicate(set: DuplicateUpdateInput!, query: DuplicateQueryInput): Duplicate
  updateOneEntity(query: EntityQueryInput, set: EntityUpdateInput!): Entity
  updateOneEntity_relationship(query: Entity_relationshipQueryInput, set: Entity_relationshipUpdateInput!): Entity_relationship
  updateOneHistory_incident(set: History_incidentUpdateInput!, query: History_incidentQueryInput): History_incident
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
  upsertOneEntity_relationship(query: Entity_relationshipQueryInput, data: Entity_relationshipInsertInput!): Entity_relationship
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
type Entity {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}
type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}
input Entity_relationshipUpdateInput {
  obj_unset: Boolean
  sub: Entity_relationshipSubRelationInput
  sub_unset: Boolean
  _id: ObjectId
  is_symmetric_unset: Boolean
  pred_unset: Boolean
  _id_unset: Boolean
  is_symmetric: Boolean
  obj: Entity_relationshipObjRelationInput
  pred: String
  created_at: DateTime
  created_at_unset: Boolean
}
input ClassificationReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
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
type SubmissionNlp_similar_incident {
  incident_id: Int
  similarity: Float
}
input Entity_relationshipQueryInput {
  created_at_in: [DateTime]
  _id_gte: ObjectId
  _id_gt: ObjectId
  is_symmetric: Boolean
  OR: [Entity_relationshipQueryInput!]
  AND: [Entity_relationshipQueryInput!]
  _id: ObjectId
  created_at_gte: DateTime
  pred: String
  pred_ne: String
  pred_exists: Boolean
  pred_lte: String
  created_at_lte: DateTime
  sub: EntityQueryInput
  is_symmetric_ne: Boolean
  _id_exists: Boolean
  is_symmetric_exists: Boolean
  obj_exists: Boolean
  pred_nin: [String]
  created_at_gt: DateTime
  pred_gt: String
  pred_in: [String]
  pred_lt: String
  sub_exists: Boolean
  _id_in: [ObjectId]
  obj: EntityQueryInput
  created_at_lt: DateTime
  _id_lte: ObjectId
  created_at_nin: [DateTime]
  _id_lt: ObjectId
  created_at: DateTime
  pred_gte: String
  created_at_ne: DateTime
  _id_ne: ObjectId
  created_at_exists: Boolean
  _id_nin: [ObjectId]
}
enum QuickaddSortByInput {
  DATE_SUBMITTED_DESC
  _ID_ASC
  _ID_DESC
  DATE_SUBMITTED_ASC
  SOURCE_DOMAIN_DESC
  URL_ASC
  URL_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  SOURCE_DOMAIN_ASC
}
type IncidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}
enum ChecklistSortByInput {
  ENTITY_ID_ASC
  _ID_ASC
  ABOUT_ASC
  ENTITY_ID_DESC
  ID_ASC
  _ID_DESC
  ABOUT_DESC
  DATE_CREATED_ASC
  DATE_UPDATED_DESC
  NAME_DESC
  OWNER_ID_DESC
  DATE_CREATED_DESC
  DATE_UPDATED_ASC
  ID_DESC
  NAME_ASC
  OWNER_ID_ASC
}
input ChecklistRiskPrecedentQueryInput {
  tags: [String]
  title_gte: String
  incident_id_ne: Int
  description_ne: String
  incident_id_lt: Int
  title_lte: String
  description_exists: Boolean
  description_lt: String
  incident_id_exists: Boolean
  description_nin: [String]
  title: String
  incident_id_gt: Int
  description_gte: String
  title_exists: Boolean
  title_gt: String
  title_in: [String]
  description_lte: String
  incident_id_in: [Int]
  description_gt: String
  incident_id_nin: [Int]
  OR: [ChecklistRiskPrecedentQueryInput!]
  description_in: [String]
  incident_id_gte: Int
  tags_nin: [String]
  tags_exists: Boolean
  description: String
  AND: [ChecklistRiskPrecedentQueryInput!]
  title_ne: String
  tags_in: [String]
  title_nin: [String]
  title_lt: String
  incident_id: Int
  incident_id_lte: Int
}
type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}
type Entity_relationship {
  _id: ObjectId
  created_at: DateTime
  is_symmetric: Boolean
  obj: Entity!
  pred: String!
  sub: Entity!
}
input NotificationQueryInput {
  incident_id_lt: Int
  sentDate_nin: [DateTime]
  incident_id_gt: Int
  OR: [NotificationQueryInput!]
  sentDate: DateTime
  incident_id_in: [Int]
  _id_gte: ObjectId
  incident_id_lte: Int
  type_gt: String
  incident_id: Int
  sentDate_in: [DateTime]
  _id_exists: Boolean
  type_gte: String
  processed: Boolean
  _id_gt: ObjectId
  type: String
  incident_id_exists: Boolean
  incident_id_nin: [Int]
  userId: UserQueryInput
  sentDate_gte: DateTime
  sentDate_lt: DateTime
  sentDate_lte: DateTime
  type_ne: String
  _id: ObjectId
  type_exists: Boolean
  type_lte: String
  type_lt: String
  _id_in: [ObjectId]
  AND: [NotificationQueryInput!]
  userId_exists: Boolean
  _id_lt: ObjectId
  sentDate_ne: DateTime
  processed_exists: Boolean
  _id_nin: [ObjectId]
  sentDate_gt: DateTime
  type_nin: [String]
  incident_id_gte: Int
  sentDate_exists: Boolean
  _id_lte: ObjectId
  incident_id_ne: Int
  type_in: [String]
  _id_ne: ObjectId
  processed_ne: Boolean
}
type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}
input Entity_relationshipSubRelationInput {
  create: EntityInsertInput
  link: String
}
input TaxaDummy_fieldInsertInput {
  field_number: String
  short_name: String
}
type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}
input History_incidentEmbeddingQueryInput {
  from_reports_nin: [Int]
  from_reports_exists: Boolean
  vector_nin: [Float]
  vector: [Float]
  vector_in: [Float]
  AND: [History_incidentEmbeddingQueryInput!]
  vector_exists: Boolean
  OR: [History_incidentEmbeddingQueryInput!]
  from_reports: [Int]
  from_reports_in: [Int]
}
input CandidateClassification_similarityQueryInput {
  similarity_gt: Float
  similarity_lt: Float
  similarity_exists: Boolean
  classification_gt: String
  classification_gte: String
  similarity: Float
  classification_nin: [String]
  classification_exists: Boolean
  similarity_nin: [Float]
  OR: [CandidateClassification_similarityQueryInput!]
  classification: String
  similarity_gte: Float
  similarity_ne: Float
  AND: [CandidateClassification_similarityQueryInput!]
  classification_in: [String]
  similarity_lte: Float
  classification_ne: String
  classification_lte: String
  classification_lt: String
  similarity_in: [Float]
}
input RisksInput {
  tags: [String]
}
input History_reportInsertInput {
  user: String
  tags: [String]!
  report_number: Int!
  submitters: [String]!
  authors: [String]!
  date_downloaded: DateTime!
  cloudinary_id: String!
  date_published: DateTime!
  text: String!
  flag: Boolean
  modifiedBy: String
  editor_notes: String
  epoch_date_downloaded: Int!
  is_incident_report: Boolean
  image_url: String!
  url: String!
  description: String
  source_domain: String!
  date_submitted: DateTime!
  plain_text: String!
  embedding: History_reportEmbeddingInsertInput
  epoch_date_published: Int!
  language: String!
  epoch_date_submitted: Int!
  inputs_outputs: [String]
  title: String!
  date_modified: DateTime!
  quiet: Boolean
  _id: ObjectId
  epoch_date_modified: Int!
}
input IncidentAllegedDeployerOfAISystemRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
input CandidateEmbeddingUpdateInput {
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
}
scalar ObjectId
input ReportUserRelationInput {
  create: UserInsertInput
  link: String
}
type LogIncidentHistoryPayload {
  incident_id: Int
}
input History_incidentTsneQueryInput {
  y_gt: Float
  AND: [History_incidentTsneQueryInput!]
  y_gte: Float
  y_lt: Float
  y_in: [Float]
  y_nin: [Float]
  x_gt: Float
  y: Float
  y_ne: Float
  x_exists: Boolean
  x_nin: [Float]
  x_gte: Float
  x_in: [Float]
  y_lte: Float
  x_lt: Float
  y_exists: Boolean
  x_ne: Float
  x: Float
  x_lte: Float
  OR: [History_incidentTsneQueryInput!]
}
type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}
input TaxaField_listQueryInput {
  weight_gte: Int
  long_name: String
  mongo_type: String
  mongo_type_lte: String
  short_name: String
  default_exists: Boolean
  required_ne: Boolean
  field_number_gte: String
  display_type_lt: String
  display_type_gte: String
  short_description_ne: String
  long_name_lte: String
  short_name_gt: String
  short_description: String
  short_name_ne: String
  display_type_lte: String
  weight_lt: Int
  default_nin: [String]
  short_name_in: [String]
  mongo_type_in: [String]
  display_type_exists: Boolean
  long_name_ne: String
  field_number_lt: String
  placeholder_nin: [String]
  long_name_exists: Boolean
  weight_in: [Int]
  permitted_values_nin: [String]
  display_type_nin: [String]
  field_number_ne: String
  placeholder: String
  short_description_lte: String
  short_description_in: [String]
  field_number_in: [String]
  default_lte: String
  hide_search_ne: Boolean
  placeholder_in: [String]
  placeholder_gte: String
  display_type_in: [String]
  mongo_type_gt: String
  long_name_nin: [String]
  public_ne: Boolean
  AND: [TaxaField_listQueryInput!]
  weight_exists: Boolean
  short_name_gte: String
  weight_nin: [Int]
  short_name_exists: Boolean
  long_name_in: [String]
  long_name_gt: String
  hide_search: Boolean
  short_description_nin: [String]
  weight_gt: Int
  field_number: String
  default_gt: String
  display_type: String
  long_description_in: [String]
  placeholder_lte: String
  short_name_lt: String
  mongo_type_exists: Boolean
  default_in: [String]
  placeholder_ne: String
  complete_from_exists: Boolean
  short_description_gte: String
  weight: Int
  field_number_nin: [String]
  instant_facet: Boolean
  public_exists: Boolean
  field_number_lte: String
  mongo_type_gte: String
  instant_facet_ne: Boolean
  permitted_values_exists: Boolean
  display_type_gt: String
  weight_ne: Int
  long_description_nin: [String]
  item_fields_exists: Boolean
  mongo_type_ne: String
  OR: [TaxaField_listQueryInput!]
  default_lt: String
  placeholder_gt: String
  placeholder_lt: String
  required: Boolean
  public: Boolean
  complete_from: TaxaField_listComplete_fromQueryInput
  field_number_gt: String
  long_description_gt: String
  default: String
  default_gte: String
  short_name_lte: String
  long_description_lte: String
  permitted_values_in: [String]
  permitted_values: [String]
  display_type_ne: String
  long_description_lt: String
  weight_lte: Int
  item_fields: TaxaField_listItem_fieldQueryInput
  hide_search_exists: Boolean
  long_description_ne: String
  long_description_exists: Boolean
  instant_facet_exists: Boolean
  placeholder_exists: Boolean
  default_ne: String
  long_name_lt: String
  mongo_type_nin: [String]
  short_description_gt: String
  short_description_lt: String
  long_description: String
  mongo_type_lt: String
  required_exists: Boolean
  field_number_exists: Boolean
  long_name_gte: String
  short_description_exists: Boolean
  short_name_nin: [String]
  long_description_gte: String
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
type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}
input NotificationUpdateInput {
  processed: Boolean
  processed_unset: Boolean
  type: String
  userId: NotificationUserIdRelationInput
  type_unset: Boolean
  sentDate: DateTime
  sentDate_unset: Boolean
  incident_id: Int
  userId_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  incident_id_inc: Int
  incident_id_unset: Boolean
}
input SubmissionQueryInput {
  editor_notes_lt: String
  date_published_gte: String
  source_domain: String
  editor_dissimilar_incidents_exists: Boolean
  incident_title_in: [String]
  image_url_ne: String
  source_domain_lte: String
  incident_editors_nin: [UserQueryInput]
  status_lte: String
  date_modified_lte: String
  deployers_in: [EntityQueryInput]
  cloudinary_id_lte: String
  image_url_gte: String
  date_modified_exists: Boolean
  editor_notes_lte: String
  source_domain_ne: String
  text_ne: String
  date_submitted: String
  date_modified_in: [String]
  plain_text_gt: String
  description_gt: String
  plain_text_nin: [String]
  tags_in: [String]
  editor_notes: String
  epoch_date_modified_ne: Int
  status_exists: Boolean
  incident_date_exists: Boolean
  language_in: [String]
  harmed_parties_exists: Boolean
  harmed_parties: [EntityQueryInput]
  _id_ne: ObjectId
  cloudinary_id_in: [String]
  date_published_gt: String
  editor_dissimilar_incidents_in: [Int]
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  _id: ObjectId
  date_downloaded_exists: Boolean
  image_url_nin: [String]
  image_url_lte: String
  deployers_nin: [EntityQueryInput]
  submitters_nin: [String]
  description_exists: Boolean
  authors_in: [String]
  date_published_nin: [String]
  status: String
  url_gt: String
  image_url_exists: Boolean
  title_nin: [String]
  incident_date_lt: String
  date_modified: String
  _id_in: [ObjectId]
  submitters_exists: Boolean
  date_downloaded_gt: String
  _id_gte: ObjectId
  description_ne: String
  date_published_exists: Boolean
  incident_title_lte: String
  date_submitted_gte: String
  source_domain_gte: String
  incident_title_ne: String
  date_downloaded: String
  date_published_lt: String
  editor_similar_incidents_nin: [Int]
  text_exists: Boolean
  source_domain_lt: String
  incident_title_lt: String
  tags_exists: Boolean
  epoch_date_modified_lte: Int
  _id_lte: ObjectId
  date_submitted_nin: [String]
  text_lte: String
  title_in: [String]
  plain_text_lte: String
  url_lt: String
  deployers_exists: Boolean
  date_published_in: [String]
  incident_title_exists: Boolean
  tags: [String]
  editor_similar_incidents_exists: Boolean
  plain_text_lt: String
  deployers: [EntityQueryInput]
  epoch_date_modified_gte: Int
  text: String
  title_exists: Boolean
  plain_text_in: [String]
  title_ne: String
  status_lt: String
  url_in: [String]
  title_lt: String
  incident_editors_in: [UserQueryInput]
  text_gt: String
  date_downloaded_nin: [String]
  date_downloaded_lte: String
  user_exists: Boolean
  incident_title_gte: String
  _id_gt: ObjectId
  cloudinary_id_nin: [String]
  _id_lt: ObjectId
  description_lte: String
  submitters_in: [String]
  incident_ids_exists: Boolean
  _id_exists: Boolean
  cloudinary_id: String
  language_lte: String
  image_url_gt: String
  incident_ids_in: [Int]
  language_nin: [String]
  submitters: [String]
  description_gte: String
  incident_ids_nin: [Int]
  language_lt: String
  date_downloaded_gte: String
  date_published: String
  description: String
  quiet_exists: Boolean
  incident_title_nin: [String]
  url_exists: Boolean
  language_gt: String
  url_lte: String
  incident_ids: [Int]
  editor_similar_incidents_in: [Int]
  date_modified_ne: String
  date_submitted_ne: String
  incident_date_lte: String
  date_submitted_lte: String
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  authors_nin: [String]
  description_lt: String
  source_domain_in: [String]
  description_nin: [String]
  url_ne: String
  authors_exists: Boolean
  _id_nin: [ObjectId]
  editor_dissimilar_incidents_nin: [Int]
  language: String
  editor_dissimilar_incidents: [Int]
  harmed_parties_in: [EntityQueryInput]
  incident_editors: [UserQueryInput]
  developers_nin: [EntityQueryInput]
  cloudinary_id_lt: String
  incident_date_in: [String]
  text_lt: String
  url_nin: [String]
  developers: [EntityQueryInput]
  editor_notes_in: [String]
  user: UserQueryInput
  epoch_date_modified_lt: Int
  status_in: [String]
  status_gte: String
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  editor_notes_nin: [String]
  AND: [SubmissionQueryInput!]
  quiet: Boolean
  title_lte: String
  quiet_ne: Boolean
  language_ne: String
  source_domain_gt: String
  date_downloaded_ne: String
  incident_editors_exists: Boolean
  plain_text: String
  image_url_lt: String
  incident_date: String
  date_downloaded_lt: String
  incident_date_ne: String
  developers_in: [EntityQueryInput]
  status_gt: String
  OR: [SubmissionQueryInput!]
  date_downloaded_in: [String]
  epoch_date_modified_in: [Int]
  language_gte: String
  date_submitted_in: [String]
  incident_date_nin: [String]
  text_gte: String
  cloudinary_id_ne: String
  incident_title: String
  cloudinary_id_gte: String
  source_domain_nin: [String]
  incident_title_gt: String
  editor_notes_exists: Boolean
  incident_date_gt: String
  title: String
  description_in: [String]
  text_nin: [String]
  epoch_date_modified: Int
  url_gte: String
  status_nin: [String]
  date_modified_gte: String
  plain_text_exists: Boolean
  embedding: SubmissionEmbeddingQueryInput
  plain_text_ne: String
  epoch_date_modified_gt: Int
  date_published_ne: String
  developers_exists: Boolean
  url: String
  date_modified_nin: [String]
  date_submitted_lt: String
  date_submitted_exists: Boolean
  editor_notes_gte: String
  epoch_date_modified_exists: Boolean
  plain_text_gte: String
  text_in: [String]
  incident_date_gte: String
  title_gt: String
  title_gte: String
  date_published_lte: String
  epoch_date_modified_nin: [Int]
  date_modified_lt: String
  source_domain_exists: Boolean
  harmed_parties_nin: [EntityQueryInput]
  status_ne: String
  language_exists: Boolean
  nlp_similar_incidents_exists: Boolean
  authors: [String]
  editor_similar_incidents: [Int]
  image_url: String
  date_modified_gt: String
  embedding_exists: Boolean
  date_submitted_gt: String
  cloudinary_id_exists: Boolean
  editor_notes_gt: String
  tags_nin: [String]
  image_url_in: [String]
  cloudinary_id_gt: String
  editor_notes_ne: String
}
enum SubmissionSortByInput {
  EPOCH_DATE_MODIFIED_ASC
  SOURCE_DOMAIN_ASC
  STATUS_DESC
  TITLE_ASC
  DATE_SUBMITTED_DESC
  STATUS_ASC
  TEXT_DESC
  TITLE_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  URL_ASC
  EDITOR_NOTES_ASC
  INCIDENT_DATE_DESC
  INCIDENT_TITLE_ASC
  USER_DESC
  _ID_DESC
  CLOUDINARY_ID_ASC
  CLOUDINARY_ID_DESC
  DATE_PUBLISHED_DESC
  EDITOR_NOTES_DESC
  IMAGE_URL_DESC
  _ID_ASC
  DATE_PUBLISHED_ASC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_DATE_ASC
  INCIDENT_TITLE_DESC
  USER_ASC
  DATE_DOWNLOADED_DESC
  LANGUAGE_ASC
  PLAIN_TEXT_DESC
  TEXT_ASC
  SOURCE_DOMAIN_DESC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  DATE_SUBMITTED_ASC
  IMAGE_URL_ASC
  LANGUAGE_DESC
  PLAIN_TEXT_ASC
  URL_DESC
}
input SubscriptionQueryInput {
  type_gte: String
  entityId_exists: Boolean
  _id: ObjectId
  type_nin: [String]
  type_in: [String]
  type_exists: Boolean
  type_ne: String
  _id_ne: ObjectId
  _id_lt: ObjectId
  _id_gt: ObjectId
  _id_gte: ObjectId
  type_gt: String
  _id_lte: ObjectId
  userId: UserQueryInput
  incident_id: IncidentQueryInput
  type: String
  _id_in: [ObjectId]
  incident_id_exists: Boolean
  type_lte: String
  AND: [SubscriptionQueryInput!]
  userId_exists: Boolean
  OR: [SubscriptionQueryInput!]
  _id_exists: Boolean
  type_lt: String
  entityId: EntityQueryInput
  _id_nin: [ObjectId]
}
type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}
input History_reportEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}
input TaxaUpdateInput {
  description: String
  _id_unset: Boolean
  description_unset: Boolean
  dummy_fields: [TaxaDummy_fieldUpdateInput]
  namespace: String
  complete_entities_unset: Boolean
  weight_unset: Boolean
  dummy_fields_unset: Boolean
  field_list: [TaxaField_listUpdateInput]
  namespace_unset: Boolean
  _id: ObjectId
  complete_entities: Boolean
  weight: Int
  field_list_unset: Boolean
  weight_inc: Int
}
type Query {
  candidate(query: CandidateQueryInput): Candidate
  candidates(query: CandidateQueryInput, limit: Int = 100, sortBy: CandidateSortByInput): [Candidate]!
  checklist(query: ChecklistQueryInput): Checklist
  checklists(sortBy: ChecklistSortByInput, query: ChecklistQueryInput, limit: Int = 100): [Checklist]!
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
  history_reports(limit: Int = 100, sortBy: History_reportSortByInput, query: History_reportQueryInput): [History_report]!
  incident(query: IncidentQueryInput): Incident
  incidents(query: IncidentQueryInput, limit: Int = 100, sortBy: IncidentSortByInput): [Incident]!
  notification(query: NotificationQueryInput): Notification
  notifications(query: NotificationQueryInput, limit: Int = 100, sortBy: NotificationSortByInput): [Notification]!
  quickadd(query: QuickaddQueryInput): Quickadd
  quickadds(query: QuickaddQueryInput, limit: Int = 100, sortBy: QuickaddSortByInput): [Quickadd]!
  report(query: ReportQueryInput): Report
  reports(sortBy: ReportSortByInput, query: ReportQueryInput, limit: Int = 100): [Report]!
  risks(input: RisksInput): [RisksPayloadItem]
  submission(query: SubmissionQueryInput): Submission
  submissions(query: SubmissionQueryInput, limit: Int = 100, sortBy: SubmissionSortByInput): [Submission]!
  subscription(query: SubscriptionQueryInput): Subscription
  subscriptions(limit: Int = 100, sortBy: SubscriptionSortByInput, query: SubscriptionQueryInput): [Subscription]!
  taxa(query: TaxaQueryInput): Taxa
  taxas(query: TaxaQueryInput, limit: Int = 100, sortBy: TaxaSortByInput): [Taxa]!
  user(query: UserQueryInput): User
  users(limit: Int = 100, sortBy: UserSortByInput, query: UserQueryInput): [User]!
}
input IncidentEmbeddingQueryInput {
  OR: [IncidentEmbeddingQueryInput!]
  from_reports: [Int]
  from_reports_exists: Boolean
  from_reports_in: [Int]
  vector_exists: Boolean
  vector_in: [Float]
  vector_nin: [Float]
  AND: [IncidentEmbeddingQueryInput!]
  from_reports_nin: [Int]
  vector: [Float]
}
input SubmissionHarmed_partiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
input ReportEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
}
type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}
input IncidentNlp_similar_incidentUpdateInput {
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
}
type DeleteManyPayload {
  deletedCount: Int!
}
input Entity_relationshipInsertInput {
  sub: Entity_relationshipSubRelationInput!
  _id: ObjectId
  created_at: DateTime
  is_symmetric: Boolean
  obj: Entity_relationshipObjRelationInput!
  pred: String!
}
input TaxaField_listInsertInput {
  complete_from: TaxaField_listComplete_fromInsertInput
  display_type: String
  required: Boolean
  short_description: String
  long_description: String
  weight: Int
  long_name: String
  default: String
  mongo_type: String
  public: Boolean
  field_number: String
  short_name: String
  placeholder: String
  permitted_values: [String]
  instant_facet: Boolean
  hide_search: Boolean
  item_fields: TaxaField_listItem_fieldInsertInput
}
input UserQueryInput {
  AND: [UserQueryInput!]
  userId_lte: String
  last_name_ne: String
  _id_ne: ObjectId
  userId_lt: String
  first_name_gte: String
  userId_exists: Boolean
  userId_gt: String
  last_name_gte: String
  userId_nin: [String]
  first_name_nin: [String]
  userId_ne: String
  last_name_nin: [String]
  first_name_lte: String
  last_name: String
  last_name_in: [String]
  roles_nin: [String]
  _id_lt: ObjectId
  last_name_lt: String
  userId: String
  _id_nin: [ObjectId]
  _id_exists: Boolean
  userId_gte: String
  roles: [String]
  first_name_gt: String
  first_name_exists: Boolean
  roles_exists: Boolean
  first_name_in: [String]
  _id_in: [ObjectId]
  first_name: String
  userId_in: [String]
  first_name_ne: String
  _id_gte: ObjectId
  last_name_gt: String
  OR: [UserQueryInput!]
  _id_lte: ObjectId
  last_name_lte: String
  roles_in: [String]
  last_name_exists: Boolean
  _id_gt: ObjectId
  _id: ObjectId
  first_name_lt: String
}
input NotificationInsertInput {
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: NotificationUserIdRelationInput
  _id: ObjectId
}
input ChecklistUpdateInput {
  risks_unset: Boolean
  tags_other: [String]
  date_updated: DateTime
  entity_id_unset: Boolean
  _id_unset: Boolean
  about: String
  tags_goals: [String]
  name_unset: Boolean
  tags_methods: [String]
  date_created: DateTime
  date_created_unset: Boolean
  tags_methods_unset: Boolean
  owner_id_unset: Boolean
  name: String
  risks: [ChecklistRiskUpdateInput]
  id_unset: Boolean
  owner_id: String
  about_unset: Boolean
  date_updated_unset: Boolean
  entity_id: String
  _id: ObjectId
  tags_goals_unset: Boolean
  id: String
  tags_other_unset: Boolean
}
input History_incidentEmbeddingUpdateInput {
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}
input TaxaDummy_fieldQueryInput {
  AND: [TaxaDummy_fieldQueryInput!]
  field_number_gt: String
  short_name_gt: String
  field_number_lt: String
  short_name_in: [String]
  field_number_gte: String
  field_number_lte: String
  short_name_ne: String
  short_name_lt: String
  OR: [TaxaDummy_fieldQueryInput!]
  field_number: String
  short_name_lte: String
  short_name_nin: [String]
  field_number_nin: [String]
  short_name_exists: Boolean
  field_number_in: [String]
  field_number_ne: String
  short_name: String
  short_name_gte: String
  field_number_exists: Boolean
}
scalar Long
input History_reportEmbeddingQueryInput {
  vector_exists: Boolean
  from_text_hash_gt: String
  from_text_hash_nin: [String]
  from_text_hash_ne: String
  vector_nin: [Float]
  from_text_hash_lte: String
  OR: [History_reportEmbeddingQueryInput!]
  from_text_hash: String
  from_text_hash_in: [String]
  from_text_hash_exists: Boolean
  AND: [History_reportEmbeddingQueryInput!]
  vector: [Float]
  vector_in: [Float]
  from_text_hash_gte: String
  from_text_hash_lt: String
}
input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}
input TaxaField_listComplete_fromQueryInput {
  all: [String]
  all_nin: [String]
  current_exists: Boolean
  OR: [TaxaField_listComplete_fromQueryInput!]
  all_in: [String]
  current_in: [String]
  AND: [TaxaField_listComplete_fromQueryInput!]
  all_exists: Boolean
  current: [String]
  current_nin: [String]
}
input SubmissionEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}
input History_incidentQueryInput {
  editor_notes_lte: String
  embedding_exists: Boolean
  modifiedBy_gte: String
  title_exists: Boolean
  date: String
  modifiedBy_in: [String]
  date_lte: String
  description_exists: Boolean
  modifiedBy: String
  description_gt: String
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  incident_id_lt: Int
  incident_id_lte: Int
  date_exists: Boolean
  incident_id_exists: Boolean
  reports: [Int]
  epoch_date_modified_gte: Int
  date_gt: String
  epoch_date_modified_lte: Int
  tsne: History_incidentTsneQueryInput
  AllegedDeployerOfAISystem_exists: Boolean
  title: String
  date_in: [String]
  flagged_dissimilar_incidents_in: [Int]
  incident_id_in: [Int]
  nlp_similar_incidents_exists: Boolean
  editor_notes_nin: [String]
  epoch_date_modified_nin: [Int]
  embedding: History_incidentEmbeddingQueryInput
  editor_notes_gte: String
  OR: [History_incidentQueryInput!]
  modifiedBy_ne: String
  epoch_date_modified_lt: Int
  editor_similar_incidents_exists: Boolean
  editor_notes_gt: String
  AllegedDeployerOfAISystem_in: [String]
  incident_id_gt: Int
  incident_id_nin: [Int]
  date_nin: [String]
  flagged_dissimilar_incidents: [Int]
  _id_gt: ObjectId
  editors: [String]
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  editor_notes_ne: String
  title_gt: String
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  AND: [History_incidentQueryInput!]
  _id_gte: ObjectId
  editors_in: [String]
  title_ne: String
  editor_similar_incidents_nin: [Int]
  epoch_date_modified_gt: Int
  date_ne: String
  epoch_date_modified: Int
  title_in: [String]
  reports_nin: [Int]
  title_gte: String
  date_gte: String
  description_lt: String
  modifiedBy_nin: [String]
  tsne_exists: Boolean
  epoch_date_modified_ne: Int
  _id_lte: ObjectId
  _id_ne: ObjectId
  editor_dissimilar_incidents_in: [Int]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  incident_id: Int
  reports_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  editor_notes: String
  editors_exists: Boolean
  reports_in: [Int]
  modifiedBy_lte: String
  editor_dissimilar_incidents_nin: [Int]
  description_lte: String
  _id_lt: ObjectId
  title_lte: String
  AllegedDeveloperOfAISystem_exists: Boolean
  editor_notes_lt: String
  modifiedBy_gt: String
  AllegedDeveloperOfAISystem_in: [String]
  AllegedDeveloperOfAISystem_nin: [String]
  editor_notes_in: [String]
  editor_similar_incidents_in: [Int]
  description_ne: String
  editors_nin: [String]
  _id_in: [ObjectId]
  editor_notes_exists: Boolean
  AllegedDeployerOfAISystem: [String]
  epoch_date_modified_in: [Int]
  title_nin: [String]
  date_lt: String
  editor_similar_incidents: [Int]
  AllegedDeployerOfAISystem_nin: [String]
  flagged_dissimilar_incidents_exists: Boolean
  incident_id_ne: Int
  description_gte: String
  flagged_dissimilar_incidents_nin: [Int]
  incident_id_gte: Int
  _id_exists: Boolean
  description_nin: [String]
  AllegedHarmedOrNearlyHarmedParties: [String]
  description: String
  editor_dissimilar_incidents_exists: Boolean
  modifiedBy_lt: String
  editor_dissimilar_incidents: [Int]
  modifiedBy_exists: Boolean
  _id_nin: [ObjectId]
  epoch_date_modified_exists: Boolean
  description_in: [String]
  title_lt: String
  _id: ObjectId
  AllegedDeveloperOfAISystem: [String]
}
input History_incidentUpdateInput {
  epoch_date_modified: Int
  epoch_date_modified_unset: Boolean
  reports: [Int]
  AllegedDeployerOfAISystem_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  description: String
  _id_unset: Boolean
  reports_unset: Boolean
  editor_similar_incidents: [Int]
  modifiedBy: String
  AllegedDeployerOfAISystem: [String]
  embedding: History_incidentEmbeddingUpdateInput
  _id: ObjectId
  AllegedHarmedOrNearlyHarmedParties: [String]
  incident_id_inc: Int
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  AllegedDeveloperOfAISystem: [String]
  AllegedDeveloperOfAISystem_unset: Boolean
  title_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  editors: [String]
  tsne: History_incidentTsneUpdateInput
  tsne_unset: Boolean
  date_unset: Boolean
  date: String
  editor_dissimilar_incidents: [Int]
  editor_similar_incidents_unset: Boolean
  embedding_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  editor_dissimilar_incidents_unset: Boolean
  incident_id_unset: Boolean
  epoch_date_modified_inc: Int
  editor_notes_unset: Boolean
  modifiedBy_unset: Boolean
  title: String
  editors_unset: Boolean
  incident_id: Int
  editor_notes: String
  description_unset: Boolean
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
}
input IncidentEmbeddingInsertInput {
  vector: [Float]
  from_reports: [Int]
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
type InsertManyPayload {
  insertedIds: [ObjectId]!
}
type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
}
enum SubscriptionSortByInput {
  INCIDENT_ID_ASC
  TYPE_ASC
  TYPE_DESC
  USERID_ASC
  USERID_DESC
  _ID_ASC
  _ID_DESC
  ENTITYID_ASC
  ENTITYID_DESC
  INCIDENT_ID_DESC
}
input CandidateEmbeddingInsertInput {
  from_text_hash: String
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
input SubmissionNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}
input UserInsertInput {
  roles: [String]!
  userId: String!
  _id: ObjectId
  first_name: String
  last_name: String
}
input IncidentEditorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}
input QuickaddUpdateInput {
  source_domain_unset: Boolean
  _id: ObjectId
  date_submitted: String
  incident_id: Long
  incident_id_unset: Boolean
  _id_unset: Boolean
  date_submitted_unset: Boolean
  source_domain: String
  url_unset: Boolean
  url: String
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
input SubscriptionInsertInput {
  type: String!
  userId: SubscriptionUserIdRelationInput!
  _id: ObjectId
  entityId: SubscriptionEntityIdRelationInput
  incident_id: SubscriptionIncident_idRelationInput
}
input GetUserInput {
  userId: ObjectId
}
input History_reportUpdateInput {
  url: String
  flag: Boolean
  _id_unset: Boolean
  user: String
  tags: [String]
  epoch_date_downloaded_unset: Boolean
  user_unset: Boolean
  quiet_unset: Boolean
  text: String
  epoch_date_downloaded_inc: Int
  tags_unset: Boolean
  _id: ObjectId
  cloudinary_id_unset: Boolean
  date_downloaded_unset: Boolean
  plain_text_unset: Boolean
  authors: [String]
  epoch_date_modified_inc: Int
  inputs_outputs: [String]
  language_unset: Boolean
  is_incident_report: Boolean
  epoch_date_published_inc: Int
  date_published_unset: Boolean
  epoch_date_submitted_unset: Boolean
  epoch_date_submitted: Int
  submitters_unset: Boolean
  editor_notes_unset: Boolean
  epoch_date_modified_unset: Boolean
  source_domain_unset: Boolean
  text_unset: Boolean
  epoch_date_submitted_inc: Int
  epoch_date_published: Int
  report_number_inc: Int
  cloudinary_id: String
  date_downloaded: DateTime
  embedding: History_reportEmbeddingUpdateInput
  modifiedBy: String
  url_unset: Boolean
  date_submitted: DateTime
  description: String
  is_incident_report_unset: Boolean
  editor_notes: String
  report_number_unset: Boolean
  quiet: Boolean
  description_unset: Boolean
  source_domain: String
  report_number: Int
  date_published: DateTime
  title_unset: Boolean
  embedding_unset: Boolean
  modifiedBy_unset: Boolean
  image_url: String
  submitters: [String]
  epoch_date_downloaded: Int
  date_modified: DateTime
  inputs_outputs_unset: Boolean
  flag_unset: Boolean
  image_url_unset: Boolean
  plain_text: String
  language: String
  date_modified_unset: Boolean
  epoch_date_published_unset: Boolean
  title: String
  date_submitted_unset: Boolean
  epoch_date_modified: Int
  authors_unset: Boolean
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
input ReportInsertInput {
  url: String!
  submitters: [String]!
  title: String!
  plain_text: String!
  cloudinary_id: String!
  text: String!
  image_url: String!
  date_modified: DateTime!
  embedding: ReportEmbeddingInsertInput
  authors: [String]!
  language: String!
  date_published: DateTime!
  tags: [String]!
  description: String
  epoch_date_downloaded: Int!
  source_domain: String!
  quiet: Boolean
  user: ReportUserRelationInput
  epoch_date_published: Int!
  report_number: Int!
  editor_notes: String
  flag: Boolean
  epoch_date_modified: Int!
  _id: ObjectId
  epoch_date_submitted: Int!
  date_downloaded: DateTime!
  inputs_outputs: [String]
  is_incident_report: Boolean
  date_submitted: DateTime!
}
input IncidentTsneUpdateInput {
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
  x_inc: Float
}
input ReportEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}
input TaxaQueryInput {
  _id_in: [ObjectId]
  _id_nin: [ObjectId]
  description_lt: String
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  namespace: String
  dummy_fields: [TaxaDummy_fieldQueryInput]
  namespace_in: [String]
  description_exists: Boolean
  namespace_lte: String
  namespace_ne: String
  _id_gte: ObjectId
  complete_entities_exists: Boolean
  namespace_gte: String
  weight_lt: Int
  weight_gt: Int
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  weight_in: [Int]
  _id_exists: Boolean
  namespace_nin: [String]
  _id_gt: ObjectId
  complete_entities_ne: Boolean
  namespace_exists: Boolean
  AND: [TaxaQueryInput!]
  description_lte: String
  namespace_gt: String
  complete_entities: Boolean
  _id_lte: ObjectId
  weight_gte: Int
  description_gt: String
  weight_nin: [Int]
  field_list_nin: [TaxaField_listQueryInput]
  description_gte: String
  field_list: [TaxaField_listQueryInput]
  dummy_fields_exists: Boolean
  field_list_in: [TaxaField_listQueryInput]
  description_nin: [String]
  weight: Int
  weight_ne: Int
  description_in: [String]
  _id: ObjectId
  weight_lte: Int
  namespace_lt: String
  description: String
  OR: [TaxaQueryInput!]
  _id_ne: ObjectId
  field_list_exists: Boolean
  weight_exists: Boolean
  _id_lt: ObjectId
  description_ne: String
}
type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
}
input SubmissionIncident_editorsRelationInput {
  link: [String]
  create: [UserInsertInput]
}
input UserUpdateInput {
  roles: [String]
  last_name_unset: Boolean
  roles_unset: Boolean
  userId_unset: Boolean
  first_name_unset: Boolean
  last_name: String
  first_name: String
  userId: String
  _id: ObjectId
  _id_unset: Boolean
}
input TaxaField_listItem_fieldInsertInput {
  instant_facet: Boolean
  default: String
  required: Boolean
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
  long_description: String
  placeholder: String
  mongo_type: String
  long_name: String
  public: Boolean
  weight: Int
  short_name: String
  permitted_values: [String]
  display_type: String
  short_description: String
  field_number: String
}
type LogReportHistoryPayload {
  report_number: Int
}
input TaxaField_listItem_fieldComplete_fromUpdateInput {
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  entities: Boolean
  entities_unset: Boolean
  all: [String]
}
input EntityQueryInput {
  entity_id_lte: String
  date_modified_nin: [DateTime]
  _id_gt: ObjectId
  date_modified_lt: DateTime
  _id_in: [ObjectId]
  name_gte: String
  name_in: [String]
  entity_id_gt: String
  name: String
  date_modified_gt: DateTime
  _id: ObjectId
  _id_exists: Boolean
  entity_id_lt: String
  entity_id: String
  date_modified_exists: Boolean
  date_modified_in: [DateTime]
  _id_gte: ObjectId
  _id_lte: ObjectId
  _id_ne: ObjectId
  date_modified_gte: DateTime
  created_at: DateTime
  created_at_ne: DateTime
  created_at_nin: [DateTime]
  date_modified: DateTime
  name_lte: String
  created_at_gt: DateTime
  name_gt: String
  created_at_gte: DateTime
  entity_id_nin: [String]
  created_at_exists: Boolean
  AND: [EntityQueryInput!]
  created_at_lt: DateTime
  entity_id_in: [String]
  _id_nin: [ObjectId]
  name_lt: String
  OR: [EntityQueryInput!]
  name_exists: Boolean
  created_at_lte: DateTime
  created_at_in: [DateTime]
  name_ne: String
  date_modified_lte: DateTime
  _id_lt: ObjectId
  entity_id_exists: Boolean
  entity_id_ne: String
  name_nin: [String]
  date_modified_ne: DateTime
  entity_id_gte: String
}
input IncidentQueryInput {
  editor_similar_incidents_in: [Int]
  incident_id_ne: Int
  _id_gte: ObjectId
  editor_similar_incidents_nin: [Int]
  description_lte: String
  description_ne: String
  incident_id_gte: Int
  AllegedDeveloperOfAISystem_exists: Boolean
  reports_nin: [ReportQueryInput]
  editor_notes_gte: String
  OR: [IncidentQueryInput!]
  editor_dissimilar_incidents_in: [Int]
  description_nin: [String]
  epoch_date_modified_nin: [Int]
  date_lt: String
  title_gt: String
  description_lt: String
  title_nin: [String]
  editors_nin: [UserQueryInput]
  date_lte: String
  _id_ne: ObjectId
  flagged_dissimilar_incidents_nin: [Int]
  description_gt: String
  epoch_date_modified_exists: Boolean
  title: String
  epoch_date_modified: Int
  incident_id_exists: Boolean
  incident_id_lt: Int
  epoch_date_modified_lte: Int
  epoch_date_modified_gt: Int
  embedding: IncidentEmbeddingQueryInput
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  _id_lte: ObjectId
  editor_notes_exists: Boolean
  title_exists: Boolean
  editor_notes_in: [String]
  title_in: [String]
  epoch_date_modified_ne: Int
  flagged_dissimilar_incidents: [Int]
  editors_in: [UserQueryInput]
  nlp_similar_incidents_exists: Boolean
  editor_similar_incidents: [Int]
  incident_id_lte: Int
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  editors: [UserQueryInput]
  incident_id_gt: Int
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  description_gte: String
  date: String
  editor_notes_ne: String
  editor_notes_lt: String
  date_exists: Boolean
  epoch_date_modified_in: [Int]
  description: String
  tsne_exists: Boolean
  reports_in: [ReportQueryInput]
  editor_notes_gt: String
  _id_gt: ObjectId
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  incident_id_nin: [Int]
  date_in: [String]
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  _id_in: [ObjectId]
  date_gt: String
  embedding_exists: Boolean
  epoch_date_modified_gte: Int
  editor_dissimilar_incidents: [Int]
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  editor_similar_incidents_exists: Boolean
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  incident_id_in: [Int]
  description_in: [String]
  title_lt: String
  _id: ObjectId
  date_gte: String
  title_gte: String
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  epoch_date_modified_lt: Int
  date_ne: String
  AllegedDeployerOfAISystem_exists: Boolean
  incident_id: Int
  tsne: IncidentTsneQueryInput
  editor_dissimilar_incidents_exists: Boolean
  description_exists: Boolean
  title_lte: String
  editors_exists: Boolean
  date_nin: [String]
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  _id_lt: ObjectId
  AllegedDeployerOfAISystem: [EntityQueryInput]
  flagged_dissimilar_incidents_in: [Int]
  reports: [ReportQueryInput]
  _id_nin: [ObjectId]
  editor_dissimilar_incidents_nin: [Int]
  _id_exists: Boolean
  editor_notes: String
  reports_exists: Boolean
  flagged_dissimilar_incidents_exists: Boolean
  title_ne: String
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  AND: [IncidentQueryInput!]
  editor_notes_lte: String
  editor_notes_nin: [String]
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
type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}
input QuickaddInsertInput {
  incident_id: Long
  source_domain: String
  url: String!
  _id: ObjectId
  date_submitted: String!
}
input EntityInsertInput {
  entity_id: String!
  name: String!
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
}
input TaxaField_listItem_fieldUpdateInput {
  complete_from_unset: Boolean
  field_number_unset: Boolean
  short_description: String
  permitted_values: [String]
  public_unset: Boolean
  field_number: String
  mongo_type_unset: Boolean
  permitted_values_unset: Boolean
  required_unset: Boolean
  short_name: String
  mongo_type: String
  long_description: String
  weight_unset: Boolean
  default: String
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  long_description_unset: Boolean
  required: Boolean
  display_type_unset: Boolean
  display_type: String
  long_name_unset: Boolean
  short_description_unset: Boolean
  weight: Int
  short_name_unset: Boolean
  long_name: String
  default_unset: Boolean
  instant_facet_unset: Boolean
  weight_inc: Int
  placeholder_unset: Boolean
  placeholder: String
  public: Boolean
  instant_facet: Boolean
}
input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}
input EntityUpdateInput {
  date_modified_unset: Boolean
  created_at: DateTime
  date_modified: DateTime
  _id: ObjectId
  created_at_unset: Boolean
  entity_id: String
  _id_unset: Boolean
  entity_id_unset: Boolean
  name: String
  name_unset: Boolean
}
input CreateDefaultAdminUserInput {
  email: String
  password: String
}
input TaxaField_listUpdateInput {
  default_unset: Boolean
  weight_inc: Int
  item_fields_unset: Boolean
  short_name: String
  mongo_type_unset: Boolean
  placeholder: String
  weight: Int
  field_number_unset: Boolean
  item_fields: TaxaField_listItem_fieldUpdateInput
  long_description_unset: Boolean
  hide_search: Boolean
  short_description: String
  default: String
  field_number: String
  short_name_unset: Boolean
  display_type: String
  mongo_type: String
  long_name: String
  placeholder_unset: Boolean
  instant_facet_unset: Boolean
  long_description: String
  long_name_unset: Boolean
  weight_unset: Boolean
  instant_facet: Boolean
  complete_from: TaxaField_listComplete_fromUpdateInput
  hide_search_unset: Boolean
  permitted_values_unset: Boolean
  complete_from_unset: Boolean
  short_description_unset: Boolean
  public_unset: Boolean
  public: Boolean
  display_type_unset: Boolean
  required_unset: Boolean
  required: Boolean
  permitted_values: [String]
}
input TaxaField_listItem_fieldQueryInput {
  display_type: String
  mongo_type_lt: String
  field_number_lte: String
  display_type_exists: Boolean
  long_name_gte: String
  long_name_lt: String
  short_description_ne: String
  weight_nin: [Int]
  short_description_in: [String]
  placeholder_in: [String]
  field_number_in: [String]
  default_ne: String
  placeholder_nin: [String]
  default_lt: String
  long_description_ne: String
  short_name_in: [String]
  weight_lt: Int
  field_number_nin: [String]
  field_number_ne: String
  placeholder_lt: String
  long_name_lte: String
  short_name_lte: String
  field_number_gte: String
  required_ne: Boolean
  instant_facet_ne: Boolean
  long_description_in: [String]
  permitted_values_in: [String]
  required_exists: Boolean
  long_name_nin: [String]
  display_type_gte: String
  display_type_nin: [String]
  public_exists: Boolean
  field_number_lt: String
  mongo_type_nin: [String]
  short_name_lt: String
  display_type_gt: String
  permitted_values_nin: [String]
  mongo_type_exists: Boolean
  long_description_gte: String
  long_description_nin: [String]
  short_description_nin: [String]
  default_gt: String
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  long_description_gt: String
  long_name_gt: String
  long_description_lte: String
  default_in: [String]
  long_description_exists: Boolean
  long_name: String
  AND: [TaxaField_listItem_fieldQueryInput!]
  weight_in: [Int]
  placeholder_ne: String
  short_name_exists: Boolean
  weight_ne: Int
  placeholder_gte: String
  display_type_lte: String
  weight: Int
  instant_facet_exists: Boolean
  weight_gt: Int
  display_type_in: [String]
  display_type_lt: String
  long_name_in: [String]
  placeholder_lte: String
  OR: [TaxaField_listItem_fieldQueryInput!]
  public_ne: Boolean
  short_name: String
  mongo_type_lte: String
  mongo_type_in: [String]
  mongo_type: String
  permitted_values_exists: Boolean
  short_name_nin: [String]
  weight_lte: Int
  mongo_type_ne: String
  permitted_values: [String]
  field_number_exists: Boolean
  short_description_gt: String
  weight_gte: Int
  default_lte: String
  default_exists: Boolean
  field_number: String
  long_name_exists: Boolean
  public: Boolean
  field_number_gt: String
  default: String
  placeholder_gt: String
  instant_facet: Boolean
  short_description: String
  short_name_gt: String
  long_description: String
  short_description_lt: String
  default_nin: [String]
  long_description_lt: String
  long_name_ne: String
  required: Boolean
  weight_exists: Boolean
  default_gte: String
  mongo_type_gt: String
  display_type_ne: String
  short_description_exists: Boolean
  short_name_gte: String
  complete_from_exists: Boolean
  short_description_lte: String
  short_description_gte: String
  placeholder_exists: Boolean
  mongo_type_gte: String
  short_name_ne: String
  placeholder: String
}
enum NotificationSortByInput {
  _ID_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
  SENTDATE_ASC
  SENTDATE_DESC
  USERID_ASC
  USERID_DESC
  _ID_ASC
  TYPE_ASC
  TYPE_DESC
}
input History_reportQueryInput {
  tags: [String]
  plain_text_gt: String
  user_exists: Boolean
  cloudinary_id_lt: String
  modifiedBy_gt: String
  source_domain_gt: String
  epoch_date_submitted_ne: Int
  image_url_nin: [String]
  modifiedBy_ne: String
  epoch_date_published_gte: Int
  user_lt: String
  date_submitted_gt: DateTime
  epoch_date_modified_lte: Int
  source_domain_lt: String
  epoch_date_published_ne: Int
  epoch_date_modified_gt: Int
  epoch_date_published_exists: Boolean
  is_incident_report: Boolean
  title: String
  date_submitted_gte: DateTime
  cloudinary_id: String
  epoch_date_submitted_gte: Int
  modifiedBy_exists: Boolean
  epoch_date_modified: Int
  quiet: Boolean
  date_modified_nin: [DateTime]
  _id_gt: ObjectId
  _id_nin: [ObjectId]
  date_submitted_nin: [DateTime]
  inputs_outputs_nin: [String]
  text_exists: Boolean
  cloudinary_id_in: [String]
  date_downloaded_lt: DateTime
  editor_notes_in: [String]
  description_gte: String
  epoch_date_modified_gte: Int
  plain_text_in: [String]
  text_gt: String
  description_lt: String
  epoch_date_published: Int
  title_in: [String]
  epoch_date_downloaded_ne: Int
  epoch_date_published_lt: Int
  submitters_exists: Boolean
  quiet_exists: Boolean
  language_gte: String
  date_downloaded_gt: DateTime
  description_nin: [String]
  epoch_date_modified_ne: Int
  epoch_date_submitted_gt: Int
  embedding: History_reportEmbeddingQueryInput
  epoch_date_submitted_exists: Boolean
  date_modified_exists: Boolean
  plain_text: String
  date_submitted_lte: DateTime
  epoch_date_downloaded_in: [Int]
  source_domain_lte: String
  plain_text_ne: String
  date_downloaded_exists: Boolean
  inputs_outputs: [String]
  title_gte: String
  cloudinary_id_gt: String
  text_lt: String
  source_domain_exists: Boolean
  source_domain_nin: [String]
  date_submitted: DateTime
  user_gt: String
  editor_notes_exists: Boolean
  epoch_date_modified_lt: Int
  source_domain_in: [String]
  epoch_date_published_gt: Int
  date_modified_lt: DateTime
  url_ne: String
  user_lte: String
  description_lte: String
  editor_notes_gt: String
  source_domain: String
  title_gt: String
  cloudinary_id_gte: String
  epoch_date_modified_exists: Boolean
  user_ne: String
  epoch_date_downloaded_lt: Int
  date_published_lte: DateTime
  report_number_ne: Int
  date_published_gt: DateTime
  modifiedBy_in: [String]
  date_published_ne: DateTime
  _id_in: [ObjectId]
  _id: ObjectId
  authors_exists: Boolean
  plain_text_exists: Boolean
  title_exists: Boolean
  epoch_date_downloaded_nin: [Int]
  user_gte: String
  modifiedBy_nin: [String]
  tags_nin: [String]
  user_in: [String]
  epoch_date_published_nin: [Int]
  epoch_date_modified_nin: [Int]
  modifiedBy: String
  cloudinary_id_exists: Boolean
  date_modified_in: [DateTime]
  image_url_ne: String
  text_lte: String
  source_domain_gte: String
  date_modified_lte: DateTime
  authors_nin: [String]
  date_modified_gte: DateTime
  image_url: String
  is_incident_report_ne: Boolean
  report_number_lte: Int
  cloudinary_id_nin: [String]
  editor_notes_lt: String
  report_number: Int
  report_number_lt: Int
  editor_notes: String
  cloudinary_id_lte: String
  epoch_date_downloaded_gt: Int
  language: String
  date_published_gte: DateTime
  tags_exists: Boolean
  OR: [History_reportQueryInput!]
  text_in: [String]
  title_lte: String
  _id_lt: ObjectId
  date_downloaded_ne: DateTime
  plain_text_nin: [String]
  date_published_lt: DateTime
  image_url_lte: String
  language_lte: String
  flag_exists: Boolean
  text_nin: [String]
  source_domain_ne: String
  date_downloaded_nin: [DateTime]
  language_in: [String]
  tags_in: [String]
  epoch_date_published_lte: Int
  modifiedBy_lt: String
  epoch_date_submitted_lt: Int
  url_in: [String]
  epoch_date_submitted_lte: Int
  submitters_nin: [String]
  language_ne: String
  epoch_date_submitted_in: [Int]
  user: String
  user_nin: [String]
  submitters: [String]
  inputs_outputs_exists: Boolean
  language_nin: [String]
  epoch_date_downloaded: Int
  flag: Boolean
  text: String
  language_lt: String
  date_submitted_lt: DateTime
  quiet_ne: Boolean
  is_incident_report_exists: Boolean
  plain_text_lt: String
  description_gt: String
  date_downloaded_gte: DateTime
  embedding_exists: Boolean
  date_modified_ne: DateTime
  date_published_in: [DateTime]
  description_in: [String]
  description_exists: Boolean
  url_gt: String
  _id_lte: ObjectId
  report_number_in: [Int]
  modifiedBy_lte: String
  epoch_date_modified_in: [Int]
  epoch_date_downloaded_gte: Int
  authors: [String]
  epoch_date_published_in: [Int]
  url_gte: String
  _id_exists: Boolean
  language_exists: Boolean
  date_submitted_in: [DateTime]
  date_published_nin: [DateTime]
  text_ne: String
  date_submitted_exists: Boolean
  image_url_exists: Boolean
  text_gte: String
  url_nin: [String]
  _id_gte: ObjectId
  flag_ne: Boolean
  editor_notes_lte: String
  report_number_gt: Int
  _id_ne: ObjectId
  epoch_date_downloaded_exists: Boolean
  date_downloaded_in: [DateTime]
  report_number_exists: Boolean
  report_number_gte: Int
  epoch_date_submitted: Int
  date_downloaded_lte: DateTime
  date_submitted_ne: DateTime
  report_number_nin: [Int]
  AND: [History_reportQueryInput!]
  image_url_gt: String
  date_published_exists: Boolean
  date_downloaded: DateTime
  description_ne: String
  date_modified: DateTime
  url_lt: String
  description: String
  title_nin: [String]
  inputs_outputs_in: [String]
  submitters_in: [String]
  editor_notes_ne: String
  language_gt: String
  title_lt: String
  url_lte: String
  image_url_gte: String
  date_published: DateTime
  editor_notes_nin: [String]
  modifiedBy_gte: String
  plain_text_lte: String
  title_ne: String
  url: String
  authors_in: [String]
  cloudinary_id_ne: String
  url_exists: Boolean
  image_url_in: [String]
  editor_notes_gte: String
  date_modified_gt: DateTime
  epoch_date_downloaded_lte: Int
  epoch_date_submitted_nin: [Int]
  plain_text_gte: String
  image_url_lt: String
}
input ChecklistRiskUpdateInput {
  likelihood: String
  risk_notes: String
  title_unset: Boolean
  touched_unset: Boolean
  generated: Boolean
  precedents: [ChecklistRiskPrecedentUpdateInput]
  risk_status_unset: Boolean
  tags_unset: Boolean
  severity_unset: Boolean
  generated_unset: Boolean
  precedents_unset: Boolean
  id_unset: Boolean
  tags: [String]
  touched: Boolean
  risk_status: String
  likelihood_unset: Boolean
  id: String
  risk_notes_unset: Boolean
  severity: String
  title: String
}
input History_incidentInsertInput {
  flagged_dissimilar_incidents: [Int]
  reports: [Int]!
  AllegedDeveloperOfAISystem: [String]
  AllegedDeployerOfAISystem: [String]
  editors: [String]!
  title: String!
  editor_similar_incidents: [Int]
  tsne: History_incidentTsneInsertInput
  description: String
  epoch_date_modified: Int
  modifiedBy: String
  editor_notes: String
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  AllegedHarmedOrNearlyHarmedParties: [String]
  date: String!
  embedding: History_incidentEmbeddingInsertInput
  incident_id: Int!
  _id: ObjectId
  editor_dissimilar_incidents: [Int]
}
input IncidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
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
input CandidateQueryInput {
  matching_harm_keywords_nin: [String]
  image_url_lte: String
  classification_similarity: [CandidateClassification_similarityQueryInput]
  matching_entities_in: [String]
  source_domain_lt: String
  similarity_in: [Float]
  url_exists: Boolean
  epoch_date_downloaded_ne: Int
  url_lt: String
  epoch_date_published_nin: [Int]
  date_published_gt: String
  url_gte: String
  image_url_exists: Boolean
  source_domain_in: [String]
  url_in: [String]
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  source_domain_exists: Boolean
  title_exists: Boolean
  plain_text_lt: String
  url: String
  plain_text_nin: [String]
  text_gt: String
  similarity_lte: Float
  text_nin: [String]
  similarity_gte: Float
  authors: [String]
  match_ne: Boolean
  date_downloaded: String
  plain_text_gte: String
  title_in: [String]
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  epoch_date_published_gt: Int
  plain_text_in: [String]
  epoch_date_downloaded_gte: Int
  text_ne: String
  _id_exists: Boolean
  plain_text_ne: String
  epoch_date_published_gte: Int
  epoch_date_published_lte: Int
  _id_in: [ObjectId]
  _id_nin: [ObjectId]
  _id: ObjectId
  authors_nin: [String]
  epoch_date_published_exists: Boolean
  similarity_lt: Float
  date_published_lte: String
  dismissed: Boolean
  image_url_lt: String
  url_ne: String
  text_gte: String
  language: String
  date_published_lt: String
  plain_text_gt: String
  date_downloaded_in: [String]
  title_gte: String
  epoch_date_published_lt: Int
  similarity_exists: Boolean
  date_downloaded_lte: String
  classification_similarity_exists: Boolean
  text_lte: String
  embedding: CandidateEmbeddingQueryInput
  language_nin: [String]
  authors_in: [String]
  date_downloaded_nin: [String]
  language_gt: String
  match_exists: Boolean
  epoch_date_downloaded_lt: Int
  date_downloaded_gte: String
  source_domain_nin: [String]
  epoch_date_downloaded_gt: Int
  epoch_date_downloaded: Int
  image_url_ne: String
  date_downloaded_ne: String
  dismissed_ne: Boolean
  matching_keywords_in: [String]
  date_published_gte: String
  match: Boolean
  _id_lte: ObjectId
  text_lt: String
  date_published_nin: [String]
  epoch_date_downloaded_in: [Int]
  date_published_exists: Boolean
  image_url_in: [String]
  date_downloaded_lt: String
  plain_text: String
  matching_entities_nin: [String]
  similarity_nin: [Float]
  epoch_date_downloaded_nin: [Int]
  epoch_date_published: Int
  _id_gte: ObjectId
  _id_gt: ObjectId
  text_in: [String]
  url_lte: String
  matching_harm_keywords: [String]
  epoch_date_published_ne: Int
  title_ne: String
  date_published_in: [String]
  url_gt: String
  epoch_date_downloaded_exists: Boolean
  matching_harm_keywords_in: [String]
  title_lt: String
  image_url_nin: [String]
  matching_entities: [String]
  plain_text_exists: Boolean
  date_downloaded_gt: String
  title_nin: [String]
  similarity_ne: Float
  source_domain: String
  matching_entities_exists: Boolean
  source_domain_ne: String
  language_ne: String
  language_lt: String
  image_url_gte: String
  title_gt: String
  date_published: String
  matching_harm_keywords_exists: Boolean
  OR: [CandidateQueryInput!]
  AND: [CandidateQueryInput!]
  matching_keywords: [String]
  text_exists: Boolean
  source_domain_gte: String
  dismissed_exists: Boolean
  language_lte: String
  title_lte: String
  plain_text_lte: String
  language_in: [String]
  similarity_gt: Float
  _id_ne: ObjectId
  matching_keywords_exists: Boolean
  date_downloaded_exists: Boolean
  matching_keywords_nin: [String]
  language_exists: Boolean
  similarity: Float
  authors_exists: Boolean
  date_published_ne: String
  text: String
  embedding_exists: Boolean
  source_domain_gt: String
  image_url: String
  image_url_gt: String
  _id_lt: ObjectId
  epoch_date_published_in: [Int]
  epoch_date_downloaded_lte: Int
  url_nin: [String]
  source_domain_lte: String
  language_gte: String
  title: String
}
input TaxaField_listItem_fieldComplete_fromInsertInput {
  all: [String]
  current: [String]
  entities: Boolean
}
input TaxaField_listItem_fieldComplete_fromQueryInput {
  current_in: [String]
  current_nin: [String]
  all: [String]
  entities: Boolean
  entities_ne: Boolean
  all_exists: Boolean
  current: [String]
  entities_exists: Boolean
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all_in: [String]
  current_exists: Boolean
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all_nin: [String]
}
input SubmissionInsertInput {
  developers: SubmissionDevelopersRelationInput
  title: String!
  incident_title: String
  language: String!
  text: String!
  incident_editors: SubmissionIncident_editorsRelationInput
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  source_domain: String!
  date_modified: String!
  cloudinary_id: String
  embedding: SubmissionEmbeddingInsertInput
  tags: [String]!
  harmed_parties: SubmissionHarmed_partiesRelationInput
  url: String!
  _id: ObjectId
  date_submitted: String!
  incident_date: String
  editor_dissimilar_incidents: [Int]
  editor_notes: String
  editor_similar_incidents: [Int]
  deployers: SubmissionDeployersRelationInput
  epoch_date_modified: Int
  authors: [String]!
  plain_text: String
  date_published: String!
  date_downloaded: String!
  image_url: String!
  user: SubmissionUserRelationInput
  description: String
  status: String
  submitters: [String]!
  incident_ids: [Int]
  quiet: Boolean
}
input ClassificationAttributeQueryInput {
  short_name_lte: String
  short_name_gte: String
  short_name: String
  value_json_nin: [String]
  value_json_gt: String
  short_name_in: [String]
  value_json_lte: String
  value_json_lt: String
  short_name_gt: String
  short_name_ne: String
  value_json: String
  short_name_nin: [String]
  short_name_exists: Boolean
  value_json_gte: String
  short_name_lt: String
  value_json_in: [String]
  AND: [ClassificationAttributeQueryInput!]
  OR: [ClassificationAttributeQueryInput!]
  value_json_exists: Boolean
  value_json_ne: String
}
input SubscriptionUserIdRelationInput {
  create: UserInsertInput
  link: String
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
input IncidentEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_reports: [Int]
  from_reports_unset: Boolean
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
  CREATED_AT_DESC
  DATE_MODIFIED_DESC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  NAME_ASC
  _ID_ASC
  CREATED_AT_ASC
  NAME_DESC
  _ID_DESC
  DATE_MODIFIED_ASC
}
input DuplicateQueryInput {
  duplicate_incident_number_ne: Int
  duplicate_incident_number_exists: Boolean
  true_incident_number_exists: Boolean
  duplicate_incident_number_gt: Int
  true_incident_number_gte: Int
  OR: [DuplicateQueryInput!]
  true_incident_number_lt: Int
  AND: [DuplicateQueryInput!]
  duplicate_incident_number_lt: Int
  _id_lte: ObjectId
  true_incident_number_nin: [Int]
  _id_ne: ObjectId
  _id: ObjectId
  _id_gte: ObjectId
  _id_exists: Boolean
  duplicate_incident_number_nin: [Int]
  true_incident_number_gt: Int
  duplicate_incident_number_in: [Int]
  true_incident_number_in: [Int]
  _id_in: [ObjectId]
  duplicate_incident_number_lte: Int
  duplicate_incident_number_gte: Int
  _id_nin: [ObjectId]
  true_incident_number_ne: Int
  true_incident_number: Int
  true_incident_number_lte: Int
  _id_gt: ObjectId
  _id_lt: ObjectId
  duplicate_incident_number: Int
}
input History_incidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}
input IncidentInsertInput {
  incident_id: Int!
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  title: String!
  date: String!
  editors: IncidentEditorsRelationInput!
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  epoch_date_modified: Int
  flagged_dissimilar_incidents: [Int]
  editor_dissimilar_incidents: [Int]
  tsne: IncidentTsneInsertInput
  editor_notes: String
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  editor_similar_incidents: [Int]
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  description: String
  reports: IncidentReportsRelationInput!
  _id: ObjectId
  embedding: IncidentEmbeddingInsertInput
}
input CandidateUpdateInput {
  plain_text_unset: Boolean
  match: Boolean
  epoch_date_downloaded: Int
  dismissed_unset: Boolean
  image_url: String
  date_published: String
  plain_text: String
  source_domain: String
  similarity_unset: Boolean
  text_unset: Boolean
  authors_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  dismissed: Boolean
  _id: ObjectId
  date_published_unset: Boolean
  matching_harm_keywords_unset: Boolean
  matching_entities: [String]
  matching_entities_unset: Boolean
  source_domain_unset: Boolean
  url: String
  title_unset: Boolean
  epoch_date_published_unset: Boolean
  epoch_date_published_inc: Int
  language_unset: Boolean
  similarity: Float
  date_downloaded: String
  title: String
  similarity_inc: Float
  matching_keywords_unset: Boolean
  embedding: CandidateEmbeddingUpdateInput
  image_url_unset: Boolean
  authors: [String]
  epoch_date_published: Int
  embedding_unset: Boolean
  _id_unset: Boolean
  text: String
  classification_similarity_unset: Boolean
  language: String
  matching_harm_keywords: [String]
  match_unset: Boolean
  epoch_date_downloaded_inc: Int
  date_downloaded_unset: Boolean
  url_unset: Boolean
  matching_keywords: [String]
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
enum IncidentSortByInput {
  TITLE_ASC
  TITLE_DESC
  DATE_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_ID_ASC
  EDITOR_NOTES_ASC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_ASC
  _ID_ASC
  _ID_DESC
  DATE_DESC
  INCIDENT_ID_DESC
}
input IncidentAllegedDeveloperOfAISystemRelationInput {
  link: [String]
  create: [EntityInsertInput]
}
input Entity_relationshipObjRelationInput {
  create: EntityInsertInput
  link: String
}
input ReportUpdateInput {
  date_modified: DateTime
  tags: [String]
  report_number_inc: Int
  inputs_outputs_unset: Boolean
  description_unset: Boolean
  is_incident_report_unset: Boolean
  date_submitted_unset: Boolean
  authors_unset: Boolean
  editor_notes_unset: Boolean
  embedding: ReportEmbeddingUpdateInput
  epoch_date_downloaded_unset: Boolean
  epoch_date_modified_inc: Int
  cloudinary_id_unset: Boolean
  cloudinary_id: String
  authors: [String]
  language_unset: Boolean
  embedding_unset: Boolean
  user_unset: Boolean
  description: String
  epoch_date_published_unset: Boolean
  title: String
  epoch_date_modified: Int
  date_published: DateTime
  report_number: Int
  submitters_unset: Boolean
  language: String
  submitters: [String]
  date_modified_unset: Boolean
  date_downloaded: DateTime
  epoch_date_submitted: Int
  url_unset: Boolean
  url: String
  flag_unset: Boolean
  date_submitted: DateTime
  date_downloaded_unset: Boolean
  flag: Boolean
  source_domain_unset: Boolean
  plain_text_unset: Boolean
  title_unset: Boolean
  epoch_date_modified_unset: Boolean
  epoch_date_published_inc: Int
  image_url: String
  epoch_date_submitted_unset: Boolean
  tags_unset: Boolean
  inputs_outputs: [String]
  date_published_unset: Boolean
  _id: ObjectId
  text_unset: Boolean
  quiet_unset: Boolean
  epoch_date_downloaded_inc: Int
  editor_notes: String
  plain_text: String
  epoch_date_published: Int
  _id_unset: Boolean
  quiet: Boolean
  source_domain: String
  user: ReportUserRelationInput
  is_incident_report: Boolean
  report_number_unset: Boolean
  image_url_unset: Boolean
  epoch_date_submitted_inc: Int
  epoch_date_downloaded: Int
  text: String
}
input TaxaField_listComplete_fromInsertInput {
  all: [String]
  current: [String]
}
input ClassificationAttributeInsertInput {
  short_name: String
  value_json: String
}
enum CandidateSortByInput {
  DATE_DOWNLOADED_ASC
  DATE_DOWNLOADED_DESC
  DATE_PUBLISHED_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  PLAIN_TEXT_ASC
  PLAIN_TEXT_DESC
  SOURCE_DOMAIN_DESC
  _ID_ASC
  TITLE_DESC
  EPOCH_DATE_PUBLISHED_DESC
  IMAGE_URL_ASC
  IMAGE_URL_DESC
  TEXT_ASC
  URL_DESC
  DATE_PUBLISHED_ASC
  EPOCH_DATE_PUBLISHED_ASC
  LANGUAGE_DESC
  SOURCE_DOMAIN_ASC
  TEXT_DESC
  _ID_DESC
  LANGUAGE_ASC
  SIMILARITY_ASC
  SIMILARITY_DESC
  TITLE_ASC
  URL_ASC
  EPOCH_DATE_DOWNLOADED_DESC
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
type ClassificationAttribute {
  short_name: String
  value_json: String
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
input PromoteSubmissionToReportInput {
  incident_ids: [Int]
  is_incident_report: Boolean
  submission_id: ObjectId
}
input SubscriptionUpdateInput {
  incident_id: SubscriptionIncident_idRelationInput
  incident_id_unset: Boolean
  entityId: SubscriptionEntityIdRelationInput
  entityId_unset: Boolean
  type: String
  _id_unset: Boolean
  type_unset: Boolean
  _id: ObjectId
  userId: SubscriptionUserIdRelationInput
  userId_unset: Boolean
}
input CandidateInsertInput {
  plain_text: String
  similarity: Float
  dismissed: Boolean
  embedding: CandidateEmbeddingInsertInput
  match: Boolean!
  text: String
  source_domain: String
  epoch_date_downloaded: Int
  title: String
  _id: ObjectId
  authors: [String]
  matching_entities: [String]
  classification_similarity: [CandidateClassification_similarityInsertInput]
  epoch_date_published: Int
  image_url: String
  date_published: String
  url: String!
  language: String
  matching_harm_keywords: [String]
  date_downloaded: String
  matching_keywords: [String]
}
input SubmissionUpdateInput {
  epoch_date_modified_unset: Boolean
  image_url_unset: Boolean
  language: String
  text: String
  language_unset: Boolean
  _id: ObjectId
  developers: SubmissionDevelopersRelationInput
  date_submitted_unset: Boolean
  cloudinary_id: String
  status: String
  user_unset: Boolean
  plain_text: String
  developers_unset: Boolean
  incident_date: String
  date_modified: String
  quiet_unset: Boolean
  date_downloaded_unset: Boolean
  _id_unset: Boolean
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  source_domain_unset: Boolean
  date_modified_unset: Boolean
  authors: [String]
  submitters: [String]
  title: String
  tags_unset: Boolean
  source_domain: String
  editor_similar_incidents: [Int]
  description_unset: Boolean
  editor_notes: String
  status_unset: Boolean
  incident_ids: [Int]
  editor_dissimilar_incidents_unset: Boolean
  user: SubmissionUserRelationInput
  text_unset: Boolean
  epoch_date_modified_inc: Int
  url: String
  embedding_unset: Boolean
  cloudinary_id_unset: Boolean
  date_downloaded: String
  editor_dissimilar_incidents: [Int]
  date_published: String
  deployers_unset: Boolean
  image_url: String
  submitters_unset: Boolean
  incident_title_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  incident_editors: SubmissionIncident_editorsRelationInput
  epoch_date_modified: Int
  editor_notes_unset: Boolean
  quiet: Boolean
  date_submitted: String
  harmed_parties_unset: Boolean
  deployers: SubmissionDeployersRelationInput
  embedding: SubmissionEmbeddingUpdateInput
  incident_ids_unset: Boolean
  date_published_unset: Boolean
  authors_unset: Boolean
  incident_date_unset: Boolean
  incident_title: String
  harmed_parties: SubmissionHarmed_partiesRelationInput
  incident_editors_unset: Boolean
  url_unset: Boolean
  editor_similar_incidents_unset: Boolean
  description: String
  title_unset: Boolean
  tags: [String]
  plain_text_unset: Boolean
}
type IncidentTsne {
  x: Float
  y: Float
}
type TaxaField_listComplete_from {
  all: [String]
  current: [String]
}
input ChecklistRiskQueryInput {
  likelihood_gt: String
  id_ne: String
  id_gt: String
  id_gte: String
  risk_status_ne: String
  tags_nin: [String]
  tags_in: [String]
  risk_status_in: [String]
  risk_status_gt: String
  risk_status_gte: String
  severity_exists: Boolean
  risk_notes_in: [String]
  severity: String
  risk_notes_gt: String
  likelihood_exists: Boolean
  severity_in: [String]
  likelihood_gte: String
  title_gt: String
  risk_notes_gte: String
  severity_lt: String
  title_ne: String
  title_lt: String
  tags: [String]
  severity_ne: String
  risk_notes_exists: Boolean
  likelihood: String
  touched_exists: Boolean
  precedents_exists: Boolean
  severity_nin: [String]
  risk_status_lt: String
  precedents: [ChecklistRiskPrecedentQueryInput]
  touched_ne: Boolean
  id_lte: String
  id_in: [String]
  id_nin: [String]
  severity_lte: String
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  likelihood_lt: String
  title_exists: Boolean
  title: String
  tags_exists: Boolean
  title_gte: String
  risk_notes_nin: [String]
  title_nin: [String]
  generated_ne: Boolean
  likelihood_lte: String
  likelihood_ne: String
  touched: Boolean
  title_lte: String
  risk_notes_ne: String
  title_in: [String]
  id_exists: Boolean
  AND: [ChecklistRiskQueryInput!]
  generated: Boolean
  generated_exists: Boolean
  risk_notes_lte: String
  risk_notes_lt: String
  severity_gt: String
  likelihood_nin: [String]
  risk_status: String
  id: String
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  OR: [ChecklistRiskQueryInput!]
  likelihood_in: [String]
  id_lt: String
  risk_status_exists: Boolean
  risk_status_lte: String
  risk_notes: String
  severity_gte: String
  risk_status_nin: [String]
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
input SubmissionDevelopersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
input SubmissionEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
}
enum ReportSortByInput {
  TEXT_DESC
  DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  PLAIN_TEXT_DESC
  REPORT_NUMBER_ASC
  SOURCE_DOMAIN_DESC
  TEXT_ASC
  TITLE_DESC
  USER_ASC
  _ID_ASC
  DATE_PUBLISHED_ASC
  DATE_PUBLISHED_DESC
  DATE_SUBMITTED_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_DESC
  EDITOR_NOTES_ASC
  IMAGE_URL_DESC
  URL_ASC
  URL_DESC
  USER_DESC
  EPOCH_DATE_PUBLISHED_DESC
  EPOCH_DATE_SUBMITTED_DESC
  IMAGE_URL_ASC
  REPORT_NUMBER_DESC
  CLOUDINARY_ID_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  LANGUAGE_ASC
  _ID_DESC
  DATE_DOWNLOADED_DESC
  DATE_SUBMITTED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_MODIFIED_ASC
  LANGUAGE_DESC
  DATE_DOWNLOADED_ASC
  PLAIN_TEXT_ASC
  SOURCE_DOMAIN_ASC
  TITLE_ASC
}
type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}
input CandidateClassification_similarityInsertInput {
  classification: String
  similarity: Float
}
input History_reportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}
input IncidentReportsRelationInput {
  link: [Int]
  create: [ReportInsertInput]
}
input SubscriptionIncident_idRelationInput {
  link: Int
  create: IncidentInsertInput
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
input TaxaField_listComplete_fromUpdateInput {
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
}
type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}
input History_incidentNlp_similar_incidentQueryInput {
  similarity_lte: Float
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  similarity_nin: [Float]
  similarity_ne: Float
  incident_id_ne: Int
  similarity_exists: Boolean
  incident_id_lte: Int
  similarity_lt: Float
  incident_id_gte: Int
  similarity_gte: Float
  similarity_in: [Float]
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_lt: Int
  incident_id: Int
  incident_id_in: [Int]
  incident_id_nin: [Int]
  similarity_gt: Float
  incident_id_exists: Boolean
  incident_id_gt: Int
  similarity: Float
}
input CandidateEmbeddingQueryInput {
  from_text_hash_gte: String
  from_text_hash_in: [String]
  from_text_hash_lt: String
  vector_in: [Float]
  vector_exists: Boolean
  from_text_hash_exists: Boolean
  from_text_hash_ne: String
  OR: [CandidateEmbeddingQueryInput!]
  from_text_hash_lte: String
  AND: [CandidateEmbeddingQueryInput!]
  vector_nin: [Float]
  vector: [Float]
  from_text_hash_nin: [String]
  from_text_hash_gt: String
  from_text_hash: String
}
enum History_reportSortByInput {
  REPORT_NUMBER_ASC
  CLOUDINARY_ID_DESC
  DATE_SUBMITTED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_SUBMITTED_ASC
  SOURCE_DOMAIN_DESC
  USER_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  TEXT_DESC
  TITLE_DESC
  EPOCH_DATE_MODIFIED_DESC
  LANGUAGE_DESC
  MODIFIEDBY_DESC
  URL_ASC
  URL_DESC
  DATE_MODIFIED_ASC
  EDITOR_NOTES_DESC
  IMAGE_URL_ASC
  IMAGE_URL_DESC
  MODIFIEDBY_ASC
  USER_ASC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_SUBMITTED_DESC
  DATE_MODIFIED_DESC
  DATE_PUBLISHED_DESC
  DATE_SUBMITTED_ASC
  EPOCH_DATE_MODIFIED_ASC
  TITLE_ASC
  _ID_ASC
  CLOUDINARY_ID_ASC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  PLAIN_TEXT_ASC
  SOURCE_DOMAIN_ASC
  TEXT_ASC
  _ID_DESC
  DATE_PUBLISHED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  LANGUAGE_ASC
  PLAIN_TEXT_DESC
  REPORT_NUMBER_DESC
  DATE_DOWNLOADED_DESC
  EDITOR_NOTES_ASC
}
input ChecklistInsertInput {
  date_updated: DateTime
  tags_goals: [String]
  tags_methods: [String]
  date_created: DateTime
  entity_id: String
  risks: [ChecklistRiskInsertInput]
  _id: ObjectId
  tags_other: [String]
  about: String
  name: String
  id: String
  owner_id: String
}
enum History_incidentSortByInput {
  MODIFIEDBY_DESC
  TITLE_ASC
  DATE_DESC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_ID_DESC
  EPOCH_DATE_MODIFIED_ASC
  _ID_ASC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
  EDITOR_NOTES_ASC
  INCIDENT_ID_ASC
  MODIFIEDBY_ASC
  TITLE_DESC
  _ID_DESC
  DATE_ASC
  EDITOR_NOTES_DESC
}
input SubmissionNlp_similar_incidentQueryInput {
  similarity: Float
  similarity_lt: Float
  incident_id_ne: Int
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_gte: Int
  incident_id_lt: Int
  incident_id_exists: Boolean
  similarity_nin: [Float]
  similarity_ne: Float
  incident_id_nin: [Int]
  incident_id_lte: Int
  incident_id_in: [Int]
  similarity_lte: Float
  similarity_gt: Float
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id: Int
  similarity_gte: Float
  similarity_exists: Boolean
  incident_id_gt: Int
  similarity_in: [Float]
}
input ReportEmbeddingQueryInput {
  from_text_hash_nin: [String]
  from_text_hash_gt: String
  from_text_hash_lt: String
  vector_nin: [Float]
  vector_in: [Float]
  OR: [ReportEmbeddingQueryInput!]
  vector: [Float]
  from_text_hash_gte: String
  AND: [ReportEmbeddingQueryInput!]
  from_text_hash_exists: Boolean
  from_text_hash_in: [String]
  from_text_hash_lte: String
  from_text_hash_ne: String
  vector_exists: Boolean
  from_text_hash: String
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
input ClassificationUpdateInput {
  publish_unset: Boolean
  incidents_unset: Boolean
  publish: Boolean
  reports: ClassificationReportsRelationInput
  namespace_unset: Boolean
  _id: ObjectId
  reports_unset: Boolean
  incidents: ClassificationIncidentsRelationInput
  notes: String
  notes_unset: Boolean
  attributes: [ClassificationAttributeUpdateInput]
  attributes_unset: Boolean
  namespace: String
  _id_unset: Boolean
}
input ClassificationAttributeUpdateInput {
  short_name: String
  short_name_unset: Boolean
  value_json: String
  value_json_unset: Boolean
}
input ClassificationQueryInput {
  notes_in: [String]
  notes_lt: String
  publish_exists: Boolean
  _id_nin: [ObjectId]
  namespace_lt: String
  namespace_nin: [String]
  namespace: String
  publish_ne: Boolean
  attributes_in: [ClassificationAttributeQueryInput]
  notes: String
  incidents_in: [IncidentQueryInput]
  notes_ne: String
  AND: [ClassificationQueryInput!]
  _id_in: [ObjectId]
  namespace_ne: String
  reports: [ReportQueryInput]
  namespace_gte: String
  reports_in: [ReportQueryInput]
  reports_exists: Boolean
  namespace_lte: String
  notes_nin: [String]
  _id_ne: ObjectId
  _id_gte: ObjectId
  notes_gt: String
  reports_nin: [ReportQueryInput]
  incidents: [IncidentQueryInput]
  _id_gt: ObjectId
  notes_lte: String
  namespace_gt: String
  namespace_in: [String]
  _id_lte: ObjectId
  incidents_exists: Boolean
  notes_exists: Boolean
  notes_gte: String
  publish: Boolean
  _id_lt: ObjectId
  _id_exists: Boolean
  attributes: [ClassificationAttributeQueryInput]
  _id: ObjectId
  namespace_exists: Boolean
  attributes_nin: [ClassificationAttributeQueryInput]
  incidents_nin: [IncidentQueryInput]
  OR: [ClassificationQueryInput!]
  attributes_exists: Boolean
}
type TaxaDummy_field {
  field_number: String
  short_name: String
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
input CandidateClassification_similarityUpdateInput {
  similarity_inc: Float
  similarity_unset: Boolean
  classification: String
  classification_unset: Boolean
  similarity: Float
}
input History_incidentNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}
input IncidentNlp_similar_incidentQueryInput {
  incident_id_gte: Int
  incident_id: Int
  incident_id_gt: Int
  incident_id_lt: Int
  similarity_lte: Float
  similarity: Float
  similarity_gt: Float
  similarity_nin: [Float]
  similarity_ne: Float
  incident_id_in: [Int]
  incident_id_nin: [Int]
  OR: [IncidentNlp_similar_incidentQueryInput!]
  similarity_gte: Float
  similarity_exists: Boolean
  AND: [IncidentNlp_similar_incidentQueryInput!]
  similarity_lt: Float
  similarity_in: [Float]
  incident_id_exists: Boolean
  incident_id_ne: Int
  incident_id_lte: Int
}
scalar DateTime
type User {
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}
input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}
input ChecklistRiskPrecedentUpdateInput {
  incident_id: Int
  incident_id_unset: Boolean
  description: String
  tags_unset: Boolean
  description_unset: Boolean
  incident_id_inc: Int
  title_unset: Boolean
  tags: [String]
  title: String
}
input TaxaDummy_fieldUpdateInput {
  short_name_unset: Boolean
  field_number: String
  field_number_unset: Boolean
  short_name: String
}
type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}
type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}
input ReportQueryInput {
  epoch_date_downloaded_lte: Int
  description: String
  tags: [String]
  date_published_in: [DateTime]
  flag_exists: Boolean
  date_submitted_gte: DateTime
  editor_notes_nin: [String]
  date_downloaded_in: [DateTime]
  report_number_lte: Int
  description_exists: Boolean
  date_published_lte: DateTime
  url_in: [String]
  user_exists: Boolean
  quiet_exists: Boolean
  image_url_lt: String
  language_lt: String
  date_downloaded_gte: DateTime
  text_exists: Boolean
  epoch_date_modified_in: [Int]
  _id: ObjectId
  epoch_date_published_ne: Int
  date_modified: DateTime
  epoch_date_downloaded_ne: Int
  editor_notes_gt: String
  source_domain_nin: [String]
  source_domain_in: [String]
  date_downloaded: DateTime
  text_in: [String]
  cloudinary_id_nin: [String]
  date_modified_ne: DateTime
  embedding: ReportEmbeddingQueryInput
  epoch_date_downloaded: Int
  epoch_date_published: Int
  epoch_date_downloaded_gt: Int
  description_nin: [String]
  language_nin: [String]
  editor_notes_exists: Boolean
  _id_gte: ObjectId
  text_lte: String
  source_domain_gt: String
  date_published_gte: DateTime
  epoch_date_modified_nin: [Int]
  editor_notes_ne: String
  date_modified_lt: DateTime
  embedding_exists: Boolean
  url_gte: String
  source_domain_lte: String
  title_in: [String]
  epoch_date_published_gte: Int
  quiet_ne: Boolean
  date_published: DateTime
  url_exists: Boolean
  epoch_date_modified_lt: Int
  date_published_gt: DateTime
  image_url_lte: String
  cloudinary_id_lte: String
  url: String
  inputs_outputs_nin: [String]
  _id_lte: ObjectId
  date_published_nin: [DateTime]
  date_modified_nin: [DateTime]
  source_domain_gte: String
  epoch_date_submitted_lt: Int
  plain_text: String
  language_exists: Boolean
  _id_nin: [ObjectId]
  epoch_date_modified_gt: Int
  authors_in: [String]
  date_modified_exists: Boolean
  epoch_date_published_lte: Int
  epoch_date_modified: Int
  title: String
  language_in: [String]
  date_submitted_gt: DateTime
  description_in: [String]
  is_incident_report_exists: Boolean
  user: UserQueryInput
  report_number: Int
  quiet: Boolean
  inputs_outputs_exists: Boolean
  report_number_in: [Int]
  report_number_gt: Int
  title_lt: String
  epoch_date_published_in: [Int]
  report_number_exists: Boolean
  cloudinary_id_in: [String]
  cloudinary_id_gte: String
  _id_in: [ObjectId]
  url_ne: String
  description_ne: String
  text_nin: [String]
  epoch_date_published_exists: Boolean
  _id_exists: Boolean
  date_modified_in: [DateTime]
  editor_notes: String
  _id_gt: ObjectId
  title_exists: Boolean
  epoch_date_downloaded_lt: Int
  plain_text_lt: String
  url_nin: [String]
  report_number_lt: Int
  date_downloaded_ne: DateTime
  date_downloaded_gt: DateTime
  text_lt: String
  submitters_nin: [String]
  source_domain_exists: Boolean
  epoch_date_downloaded_nin: [Int]
  tags_nin: [String]
  report_number_gte: Int
  epoch_date_published_gt: Int
  title_lte: String
  epoch_date_submitted_gte: Int
  date_downloaded_nin: [DateTime]
  epoch_date_submitted_lte: Int
  OR: [ReportQueryInput!]
  _id_lt: ObjectId
  date_published_lt: DateTime
  description_lte: String
  epoch_date_published_nin: [Int]
  editor_notes_gte: String
  is_incident_report_ne: Boolean
  date_downloaded_exists: Boolean
  image_url_nin: [String]
  language_lte: String
  image_url_gt: String
  date_submitted_lte: DateTime
  inputs_outputs: [String]
  plain_text_gt: String
  epoch_date_submitted_ne: Int
  editor_notes_lt: String
  plain_text_nin: [String]
  description_gt: String
  description_lt: String
  epoch_date_downloaded_exists: Boolean
  epoch_date_modified_lte: Int
  language: String
  date_published_exists: Boolean
  title_ne: String
  epoch_date_published_lt: Int
  epoch_date_submitted_exists: Boolean
  tags_in: [String]
  epoch_date_modified_exists: Boolean
  date_downloaded_lte: DateTime
  date_submitted_lt: DateTime
  inputs_outputs_in: [String]
  source_domain_lt: String
  date_modified_gte: DateTime
  epoch_date_submitted: Int
  image_url: String
  text_gt: String
  plain_text_ne: String
  url_gt: String
  _id_ne: ObjectId
  epoch_date_modified_ne: Int
  cloudinary_id_gt: String
  date_modified_lte: DateTime
  cloudinary_id: String
  cloudinary_id_lt: String
  epoch_date_submitted_nin: [Int]
  date_downloaded_lt: DateTime
  is_incident_report: Boolean
  title_gt: String
  submitters_in: [String]
  language_gte: String
  image_url_ne: String
  flag: Boolean
  language_ne: String
  editor_notes_lte: String
  epoch_date_submitted_gt: Int
  submitters: [String]
  epoch_date_modified_gte: Int
  plain_text_lte: String
  epoch_date_downloaded_gte: Int
  flag_ne: Boolean
  date_submitted_exists: Boolean
  title_nin: [String]
  date_modified_gt: DateTime
  cloudinary_id_ne: String
  image_url_gte: String
  editor_notes_in: [String]
  text_ne: String
  tags_exists: Boolean
  submitters_exists: Boolean
  authors_nin: [String]
  epoch_date_downloaded_in: [Int]
  date_submitted: DateTime
  text_gte: String
  url_lt: String
  date_submitted_nin: [DateTime]
  language_gt: String
  source_domain_ne: String
  report_number_nin: [Int]
  date_submitted_ne: DateTime
  date_published_ne: DateTime
  source_domain: String
  image_url_in: [String]
  authors: [String]
  plain_text_exists: Boolean
  image_url_exists: Boolean
  title_gte: String
  text: String
  date_submitted_in: [DateTime]
  cloudinary_id_exists: Boolean
  epoch_date_submitted_in: [Int]
  AND: [ReportQueryInput!]
  report_number_ne: Int
  plain_text_in: [String]
  authors_exists: Boolean
  description_gte: String
  plain_text_gte: String
  url_lte: String
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
enum Entity_relationshipSortByInput {
  PRED_ASC
  _ID_DESC
  CREATED_AT_ASC
  CREATED_AT_DESC
  OBJ_DESC
  SUB_DESC
  _ID_ASC
  OBJ_ASC
  PRED_DESC
  SUB_ASC
}
type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}
enum ClassificationSortByInput {
  _ID_ASC
  _ID_DESC
  NAMESPACE_ASC
  NAMESPACE_DESC
  NOTES_ASC
  NOTES_DESC
}
type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}
enum TaxaSortByInput {
  NAMESPACE_ASC
  NAMESPACE_DESC
  WEIGHT_ASC
  WEIGHT_DESC
  _ID_ASC
  _ID_DESC
  DESCRIPTION_ASC
  DESCRIPTION_DESC
}
enum DuplicateSortByInput {
  _ID_ASC
  _ID_DESC
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
}
input ClassificationInsertInput {
  reports: ClassificationReportsRelationInput!
  _id: ObjectId
  attributes: [ClassificationAttributeInsertInput]
  incidents: ClassificationIncidentsRelationInput!
  namespace: String!
  notes: String
  publish: Boolean
}
type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}
input History_incidentTsneInsertInput {
  x: Float
  y: Float
}
input QuickaddQueryInput {
  source_domain_exists: Boolean
  date_submitted_nin: [String]
  date_submitted_ne: String
  OR: [QuickaddQueryInput!]
  _id_ne: ObjectId
  incident_id_nin: [Long]
  url_gt: String
  source_domain: String
  url_ne: String
  _id_gte: ObjectId
  date_submitted: String
  date_submitted_gt: String
  url_lte: String
  date_submitted_gte: String
  url: String
  incident_id_in: [Long]
  incident_id_lt: Long
  source_domain_lte: String
  url_in: [String]
  incident_id: Long
  date_submitted_lte: String
  AND: [QuickaddQueryInput!]
  _id_lte: ObjectId
  incident_id_ne: Long
  url_nin: [String]
  url_lt: String
  url_exists: Boolean
  _id_nin: [ObjectId]
  source_domain_gte: String
  _id_gt: ObjectId
  date_submitted_lt: String
  incident_id_gt: Long
  _id: ObjectId
  date_submitted_exists: Boolean
  source_domain_nin: [String]
  _id_lt: ObjectId
  _id_exists: Boolean
  url_gte: String
  source_domain_in: [String]
  source_domain_gt: String
  date_submitted_in: [String]
  incident_id_gte: Long
  _id_in: [ObjectId]
  source_domain_lt: String
  incident_id_lte: Long
  incident_id_exists: Boolean
  source_domain_ne: String
}
input History_incidentTsneUpdateInput {
  x: Float
  x_inc: Float
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
}
input ClassificationIncidentsRelationInput {
  link: [Int]
  create: [IncidentInsertInput]
}
input SubmissionNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_unset: Boolean
  incident_id_inc: Int
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}
input ChecklistRiskInsertInput {
  severity: String
  title: String
  id: String
  precedents: [ChecklistRiskPrecedentInsertInput]
  risk_notes: String
  generated: Boolean
  tags: [String]
  touched: Boolean
  likelihood: String
  risk_status: String
}
input SubmissionEmbeddingQueryInput {
  from_text_hash_exists: Boolean
  vector: [Float]
  vector_exists: Boolean
  OR: [SubmissionEmbeddingQueryInput!]
  from_text_hash_lt: String
  vector_in: [Float]
  from_text_hash_nin: [String]
  from_text_hash_gt: String
  from_text_hash_gte: String
  from_text_hash_lte: String
  from_text_hash_ne: String
  AND: [SubmissionEmbeddingQueryInput!]
  vector_nin: [Float]
  from_text_hash: String
  from_text_hash_in: [String]
}
input IncidentTsneQueryInput {
  x: Float
  x_in: [Float]
  y_gt: Float
  y_gte: Float
  y_lte: Float
  y_in: [Float]
  x_gt: Float
  x_lt: Float
  y_nin: [Float]
  y_ne: Float
  y_lt: Float
  OR: [IncidentTsneQueryInput!]
  AND: [IncidentTsneQueryInput!]
  x_gte: Float
  y: Float
  x_exists: Boolean
  x_nin: [Float]
  x_lte: Float
  x_ne: Float
  y_exists: Boolean
}
input ChecklistQueryInput {
  date_created: DateTime
  id_gte: String
  entity_id_lte: String
  entity_id_lt: String
  tags_goals_exists: Boolean
  about_ne: String
  name: String
  date_updated_ne: DateTime
  about_exists: Boolean
  date_created_gt: DateTime
  risks: [ChecklistRiskQueryInput]
  about_gte: String
  date_updated: DateTime
  date_created_lt: DateTime
  entity_id_in: [String]
  tags_other: [String]
  _id_lte: ObjectId
  id_ne: String
  tags_methods_exists: Boolean
  id_lt: String
  owner_id_lt: String
  date_created_ne: DateTime
  entity_id_nin: [String]
  owner_id_gt: String
  _id_lt: ObjectId
  _id_gt: ObjectId
  AND: [ChecklistQueryInput!]
  name_gte: String
  _id_in: [ObjectId]
  id_lte: String
  owner_id_gte: String
  name_nin: [String]
  date_created_exists: Boolean
  id_gt: String
  about_in: [String]
  date_created_in: [DateTime]
  _id_ne: ObjectId
  about_gt: String
  _id_nin: [ObjectId]
  risks_nin: [ChecklistRiskQueryInput]
  tags_goals_in: [String]
  OR: [ChecklistQueryInput!]
  about_nin: [String]
  name_gt: String
  about_lt: String
  id_nin: [String]
  owner_id_exists: Boolean
  about: String
  entity_id: String
  about_lte: String
  date_updated_lte: DateTime
  entity_id_gt: String
  name_ne: String
  date_updated_exists: Boolean
  risks_exists: Boolean
  owner_id_ne: String
  _id_gte: ObjectId
  date_created_lte: DateTime
  date_created_gte: DateTime
  owner_id_nin: [String]
  tags_other_exists: Boolean
  date_updated_gt: DateTime
  id_exists: Boolean
  entity_id_gte: String
  _id: ObjectId
  tags_other_nin: [String]
  date_created_nin: [DateTime]
  name_lte: String
  owner_id_lte: String
  date_updated_nin: [DateTime]
  name_lt: String
  tags_other_in: [String]
  tags_methods_nin: [String]
  owner_id_in: [String]
  id_in: [String]
  tags_methods: [String]
  risks_in: [ChecklistRiskQueryInput]
  id: String
  entity_id_exists: Boolean
  tags_goals: [String]
  entity_id_ne: String
  tags_methods_in: [String]
  name_in: [String]
  date_updated_lt: DateTime
  date_updated_gte: DateTime
  tags_goals_nin: [String]
  name_exists: Boolean
  _id_exists: Boolean
  owner_id: String
  date_updated_in: [DateTime]
}
input IncidentUpdateInput {
  title_unset: Boolean
  editor_similar_incidents_unset: Boolean
  description: String
  flagged_dissimilar_incidents: [Int]
  editors: IncidentEditorsRelationInput
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  AllegedDeveloperOfAISystem_unset: Boolean
  _id_unset: Boolean
  _id: ObjectId
  flagged_dissimilar_incidents_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  epoch_date_modified_inc: Int
  reports_unset: Boolean
  date: String
  editor_similar_incidents: [Int]
  title: String
  AllegedDeployerOfAISystem_unset: Boolean
  editor_dissimilar_incidents_unset: Boolean
  incident_id: Int
  editor_dissimilar_incidents: [Int]
  epoch_date_modified: Int
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  description_unset: Boolean
  reports: IncidentReportsRelationInput
  embedding_unset: Boolean
  tsne_unset: Boolean
  editors_unset: Boolean
  editor_notes_unset: Boolean
  editor_notes: String
  incident_id_inc: Int
  tsne: IncidentTsneUpdateInput
  epoch_date_modified_unset: Boolean
  nlp_similar_incidents_unset: Boolean
  embedding: IncidentEmbeddingUpdateInput
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  incident_id_unset: Boolean
  date_unset: Boolean
}
input DuplicateInsertInput {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}
input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}
input IncidentTsneInsertInput {
  x: Float
  y: Float
}
type AppUser {
  email: String
}
`;
