import gql from "graphql-tag";

export default gql`
enum IncidentSortByInput {
  INCIDENT_ID_ASC
  DATE_ASC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_DESC
  _ID_DESC
  DATE_DESC
  EDITOR_NOTES_DESC
  DESCRIPTION_DESC
  INCIDENT_ID_DESC
  TITLE_ASC
  _ID_ASC
  DESCRIPTION_ASC
  TITLE_DESC
}

type ChecklistRiskPrecedent {
  description: String
  incident_id: Int
  tags: [String]
  title: String
}

input History_reportInsertInput {
  text: String!
  title: String!
  user: String
  epoch_date_downloaded: Int!
  embedding: History_reportEmbeddingInsertInput
  cloudinary_id: String!
  date_downloaded: DateTime!
  quiet: Boolean
  epoch_date_submitted: Int!
  inputs_outputs: [String]
  flag: Boolean
  is_incident_report: Boolean
  _id: ObjectId
  source_domain: String!
  description: String
  submitters: [String]!
  tags: [String]!
  date_modified: DateTime!
  epoch_date_published: Int!
  authors: [String]!
  image_url: String!
  date_published: DateTime!
  language: String!
  plain_text: String!
  editor_notes: String
  modifiedBy: String
  epoch_date_modified: Int!
  date_submitted: DateTime!
  report_number: Int!
  url: String!
}

input CreateVariantInput {
  variant: CreateVariantInputVariant
  incidentId: Int
}

type RisksPayloadPrecedentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input UserQueryInput {
  _id_exists: Boolean
  last_name_in: [String]
  first_name_ne: String
  roles_nin: [String]
  last_name_lt: String
  last_name_gt: String
  first_name_lte: String
  last_name_nin: [String]
  userId: String
  _id_lt: ObjectId
  first_name_in: [String]
  _id_in: [ObjectId]
  userId_lte: String
  last_name_gte: String
  first_name: String
  userId_gte: String
  _id_gte: ObjectId
  first_name_exists: Boolean
  OR: [UserQueryInput!]
  roles_in: [String]
  roles: [String]
  userId_gt: String
  _id_nin: [ObjectId]
  last_name_lte: String
  userId_lt: String
  last_name_ne: String
  userId_nin: [String]
  userId_exists: Boolean
  first_name_nin: [String]
  first_name_gt: String
  _id: ObjectId
  _id_lte: ObjectId
  first_name_gte: String
  last_name: String
  last_name_exists: Boolean
  AND: [UserQueryInput!]
  userId_in: [String]
  userId_ne: String
  _id_gt: ObjectId
  _id_ne: ObjectId
  roles_exists: Boolean
  first_name_lt: String
}

enum EntitySortByInput {
  DATE_MODIFIED_DESC
  NAME_ASC
  _ID_ASC
  CREATED_AT_DESC
  DATE_MODIFIED_ASC
  ENTITY_ID_DESC
  NAME_DESC
  _ID_DESC
  CREATED_AT_ASC
  ENTITY_ID_ASC
}

input TaxaField_listComplete_fromQueryInput {
  current: [String]
  current_exists: Boolean
  current_nin: [String]
  all: [String]
  all_exists: Boolean
  all_in: [String]
  AND: [TaxaField_listComplete_fromQueryInput!]
  OR: [TaxaField_listComplete_fromQueryInput!]
  all_nin: [String]
  current_in: [String]
}

type TaxaField_listItem_fieldComplete_from {
  all: [String]
  current: [String]
  entities: Boolean
}

type DefaultAdminUser {
  message: String
  status: Int
  userId: String
}

input NotificationInsertInput {
  userId: NotificationUserIdRelationInput
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
}

input NotificationUserIdRelationInput {
  create: UserInsertInput
  link: String
}

type History_incidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input ReportInsertInput {
  plain_text: String!
  report_number: Int!
  epoch_date_submitted: Int!
  quiet: Boolean
  epoch_date_published: Int!
  source_domain: String!
  _id: ObjectId
  inputs_outputs: [String]
  date_submitted: DateTime!
  flag: Boolean
  image_url: String!
  description: String
  embedding: ReportEmbeddingInsertInput
  user: ReportUserRelationInput
  text: String!
  date_modified: DateTime!
  submitters: [String]!
  is_incident_report: Boolean
  cloudinary_id: String!
  url: String!
  tags: [String]!
  title: String!
  date_downloaded: DateTime!
  epoch_date_modified: Int!
  editor_notes: String
  date_published: DateTime!
  authors: [String]!
  epoch_date_downloaded: Int!
  language: String!
}

type Subscription {
  _id: ObjectId
  entityId: Entity
  incident_id: Incident
  type: String!
  userId: User!
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
  replaceOneClassification(query: ClassificationQueryInput, data: ClassificationInsertInput!): Classification
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
  updateManyCandidates(query: CandidateQueryInput, set: CandidateUpdateInput!): UpdateManyPayload
  updateManyChecklists(query: ChecklistQueryInput, set: ChecklistUpdateInput!): UpdateManyPayload
  updateManyClassifications(set: ClassificationUpdateInput!, query: ClassificationQueryInput): UpdateManyPayload
  updateManyDuplicates(query: DuplicateQueryInput, set: DuplicateUpdateInput!): UpdateManyPayload
  updateManyEntities(query: EntityQueryInput, set: EntityUpdateInput!): UpdateManyPayload
  updateManyHistory_incidents(set: History_incidentUpdateInput!, query: History_incidentQueryInput): UpdateManyPayload
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
  updateOneClassification(set: ClassificationUpdateInput!, query: ClassificationQueryInput): Classification
  updateOneDuplicate(query: DuplicateQueryInput, set: DuplicateUpdateInput!): Duplicate
  updateOneEntity(query: EntityQueryInput, set: EntityUpdateInput!): Entity
  updateOneHistory_incident(query: History_incidentQueryInput, set: History_incidentUpdateInput!): History_incident
  updateOneHistory_report(query: History_reportQueryInput, set: History_reportUpdateInput!): History_report
  updateOneIncident(query: IncidentQueryInput, set: IncidentUpdateInput!): Incident
  updateOneNotification(set: NotificationUpdateInput!, query: NotificationQueryInput): Notification
  updateOneQuickadd(set: QuickaddUpdateInput!, query: QuickaddQueryInput): Quickadd
  updateOneReport(query: ReportQueryInput, set: ReportUpdateInput!): Report
  updateOneReportTranslation(input: UpdateOneReportTranslationInput): Report
  updateOneSubmission(query: SubmissionQueryInput, set: SubmissionUpdateInput!): Submission
  updateOneSubscription(query: SubscriptionQueryInput, set: SubscriptionUpdateInput!): Subscription
  updateOneTaxa(query: TaxaQueryInput, set: TaxaUpdateInput!): Taxa
  updateOneUser(query: UserQueryInput, set: UserUpdateInput!): User
  upsertOneCandidate(query: CandidateQueryInput, data: CandidateInsertInput!): Candidate
  upsertOneChecklist(query: ChecklistQueryInput, data: ChecklistInsertInput!): Checklist
  upsertOneClassification(data: ClassificationInsertInput!, query: ClassificationQueryInput): Classification
  upsertOneDuplicate(query: DuplicateQueryInput, data: DuplicateInsertInput!): Duplicate
  upsertOneEntity(query: EntityQueryInput, data: EntityInsertInput!): Entity
  upsertOneHistory_incident(query: History_incidentQueryInput, data: History_incidentInsertInput!): History_incident
  upsertOneHistory_report(query: History_reportQueryInput, data: History_reportInsertInput!): History_report
  upsertOneIncident(query: IncidentQueryInput, data: IncidentInsertInput!): Incident
  upsertOneNotification(query: NotificationQueryInput, data: NotificationInsertInput!): Notification
  upsertOneQuickadd(query: QuickaddQueryInput, data: QuickaddInsertInput!): Quickadd
  upsertOneReport(query: ReportQueryInput, data: ReportInsertInput!): Report
  upsertOneSubmission(data: SubmissionInsertInput!, query: SubmissionQueryInput): Submission
  upsertOneSubscription(query: SubscriptionQueryInput, data: SubscriptionInsertInput!): Subscription
  upsertOneTaxa(query: TaxaQueryInput, data: TaxaInsertInput!): Taxa
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
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

input ReportEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
}

enum NotificationSortByInput {
  _ID_ASC
  _ID_DESC
  INCIDENT_ID_ASC
  SENTDATE_DESC
  TYPE_ASC
  TYPE_DESC
  INCIDENT_ID_DESC
  SENTDATE_ASC
  USERID_ASC
  USERID_DESC
}

enum CandidateSortByInput {
  SIMILARITY_ASC
  SOURCE_DOMAIN_ASC
  TEXT_DESC
  _ID_DESC
  DATE_PUBLISHED_ASC
  DATE_PUBLISHED_DESC
  IMAGE_URL_ASC
  LANGUAGE_DESC
  URL_ASC
  URL_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  LANGUAGE_ASC
  TITLE_DESC
  _ID_ASC
  DATE_DOWNLOADED_DESC
  PLAIN_TEXT_ASC
  TEXT_ASC
  TITLE_ASC
  SOURCE_DOMAIN_DESC
  DATE_DOWNLOADED_ASC
  EPOCH_DATE_DOWNLOADED_DESC
  IMAGE_URL_DESC
  PLAIN_TEXT_DESC
  SIMILARITY_DESC
}

type RisksPayloadPrecedentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input ClassificationQueryInput {
  publish_ne: Boolean
  incidents_nin: [IncidentQueryInput]
  namespace_in: [String]
  notes_exists: Boolean
  reports_nin: [ReportQueryInput]
  OR: [ClassificationQueryInput!]
  attributes_in: [ClassificationAttributeQueryInput]
  notes: String
  _id: ObjectId
  AND: [ClassificationQueryInput!]
  attributes_nin: [ClassificationAttributeQueryInput]
  notes_nin: [String]
  _id_in: [ObjectId]
  notes_lt: String
  namespace_ne: String
  incidents_in: [IncidentQueryInput]
  incidents_exists: Boolean
  reports: [ReportQueryInput]
  namespace: String
  _id_lt: ObjectId
  _id_ne: ObjectId
  namespace_nin: [String]
  namespace_lte: String
  notes_in: [String]
  namespace_gte: String
  _id_gt: ObjectId
  _id_gte: ObjectId
  notes_lte: String
  attributes_exists: Boolean
  incidents: [IncidentQueryInput]
  notes_gt: String
  notes_ne: String
  reports_exists: Boolean
  notes_gte: String
  publish_exists: Boolean
  namespace_exists: Boolean
  reports_in: [ReportQueryInput]
  _id_nin: [ObjectId]
  attributes: [ClassificationAttributeQueryInput]
  publish: Boolean
  namespace_gt: String
  _id_exists: Boolean
  _id_lte: ObjectId
  namespace_lt: String
}

input EntityUpdateInput {
  created_at: DateTime
  date_modified: DateTime
  date_modified_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  created_at_unset: Boolean
  entity_id: String
  entity_id_unset: Boolean
  name: String
  name_unset: Boolean
}

input History_reportEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input History_incidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

input ChecklistUpdateInput {
  risks_unset: Boolean
  _id: ObjectId
  _id_unset: Boolean
  date_updated_unset: Boolean
  name_unset: Boolean
  date_created: DateTime
  tags_goals: [String]
  tags_methods_unset: Boolean
  entity_id_unset: Boolean
  name: String
  owner_id: String
  tags_methods: [String]
  id_unset: Boolean
  entity_id: String
  owner_id_unset: Boolean
  risks: [ChecklistRiskUpdateInput]
  tags_other: [String]
  about: String
  tags_goals_unset: Boolean
  tags_other_unset: Boolean
  date_created_unset: Boolean
  date_updated: DateTime
  id: String
  about_unset: Boolean
}

type TaxaField_listComplete_from {
  all: [String]
  current: [String]
}

type Quickadd {
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
  source_domain: String
  url: String!
}

input CandidateEmbeddingQueryInput {
  vector_in: [Float]
  OR: [CandidateEmbeddingQueryInput!]
  from_text_hash_nin: [String]
  vector_exists: Boolean
  from_text_hash: String
  from_text_hash_exists: Boolean
  from_text_hash_lte: String
  from_text_hash_in: [String]
  vector: [Float]
  vector_nin: [Float]
  from_text_hash_gte: String
  from_text_hash_gt: String
  from_text_hash_ne: String
  AND: [CandidateEmbeddingQueryInput!]
  from_text_hash_lt: String
}

input IncidentEmbeddingQueryInput {
  from_reports: [Int]
  from_reports_in: [Int]
  vector: [Float]
  vector_nin: [Float]
  vector_in: [Float]
  AND: [IncidentEmbeddingQueryInput!]
  from_reports_nin: [Int]
  from_reports_exists: Boolean
  vector_exists: Boolean
  OR: [IncidentEmbeddingQueryInput!]
}

input SubscriptionUserIdRelationInput {
  create: UserInsertInput
  link: String
}

input TaxaField_listItem_fieldComplete_fromInsertInput {
  entities: Boolean
  all: [String]
  current: [String]
}

input History_incidentTsneQueryInput {
  x_gte: Float
  y_exists: Boolean
  AND: [History_incidentTsneQueryInput!]
  x_exists: Boolean
  x_in: [Float]
  y_in: [Float]
  x: Float
  x_ne: Float
  x_gt: Float
  y_ne: Float
  x_lte: Float
  y_nin: [Float]
  y: Float
  y_lt: Float
  x_lt: Float
  y_gt: Float
  y_gte: Float
  y_lte: Float
  OR: [History_incidentTsneQueryInput!]
  x_nin: [Float]
}

input TaxaField_listItem_fieldInsertInput {
  mongo_type: String
  weight: Int
  field_number: String
  permitted_values: [String]
  default: String
  instant_facet: Boolean
  short_description: String
  complete_from: TaxaField_listItem_fieldComplete_fromInsertInput
  public: Boolean
  display_type: String
  placeholder: String
  short_name: String
  long_name: String
  long_description: String
  required: Boolean
}

input SubscriptionQueryInput {
  _id_nin: [ObjectId]
  _id_gt: ObjectId
  type_exists: Boolean
  _id_ne: ObjectId
  type: String
  _id_gte: ObjectId
  _id_lt: ObjectId
  _id_exists: Boolean
  incident_id: IncidentQueryInput
  type_gt: String
  type_lt: String
  type_in: [String]
  entityId: EntityQueryInput
  type_nin: [String]
  incident_id_exists: Boolean
  type_ne: String
  AND: [SubscriptionQueryInput!]
  _id_in: [ObjectId]
  type_lte: String
  _id_lte: ObjectId
  userId: UserQueryInput
  userId_exists: Boolean
  type_gte: String
  OR: [SubscriptionQueryInput!]
  _id: ObjectId
  entityId_exists: Boolean
}

input ChecklistQueryInput {
  _id_lte: ObjectId
  about_gte: String
  id_ne: String
  risks_exists: Boolean
  owner_id_gte: String
  entity_id_gt: String
  date_created_gt: DateTime
  date_updated_nin: [DateTime]
  date_created_lte: DateTime
  tags_methods_exists: Boolean
  owner_id_lt: String
  AND: [ChecklistQueryInput!]
  risks_in: [ChecklistRiskQueryInput]
  tags_other_in: [String]
  about_exists: Boolean
  name_in: [String]
  entity_id_exists: Boolean
  owner_id: String
  _id_gt: ObjectId
  owner_id_in: [String]
  tags_other_exists: Boolean
  date_updated_ne: DateTime
  name_gte: String
  tags_methods_nin: [String]
  date_updated_exists: Boolean
  entity_id_nin: [String]
  date_updated_lte: DateTime
  owner_id_lte: String
  id: String
  id_gt: String
  date_updated: DateTime
  entity_id_lt: String
  date_created_in: [DateTime]
  _id_exists: Boolean
  date_created_exists: Boolean
  name_gt: String
  name_lt: String
  about_gt: String
  entity_id_ne: String
  tags_goals_exists: Boolean
  id_in: [String]
  owner_id_exists: Boolean
  tags_goals_in: [String]
  date_updated_gte: DateTime
  date_created: DateTime
  _id_nin: [ObjectId]
  date_created_lt: DateTime
  risks: [ChecklistRiskQueryInput]
  tags_goals: [String]
  about: String
  _id_ne: ObjectId
  tags_methods: [String]
  tags_methods_in: [String]
  tags_other_nin: [String]
  id_lte: String
  date_updated_in: [DateTime]
  id_exists: Boolean
  entity_id_in: [String]
  name_ne: String
  _id_gte: ObjectId
  owner_id_ne: String
  tags_other: [String]
  owner_id_gt: String
  date_updated_gt: DateTime
  risks_nin: [ChecklistRiskQueryInput]
  date_updated_lt: DateTime
  name_lte: String
  _id_lt: ObjectId
  id_gte: String
  id_lt: String
  entity_id_gte: String
  _id: ObjectId
  about_lte: String
  name: String
  date_created_gte: DateTime
  date_created_ne: DateTime
  name_nin: [String]
  about_in: [String]
  owner_id_nin: [String]
  about_ne: String
  about_nin: [String]
  entity_id: String
  date_created_nin: [DateTime]
  id_nin: [String]
  _id_in: [ObjectId]
  name_exists: Boolean
  entity_id_lte: String
  tags_goals_nin: [String]
  about_lt: String
  OR: [ChecklistQueryInput!]
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

input NotificationUpdateInput {
  incident_id_unset: Boolean
  processed_unset: Boolean
  type: String
  incident_id: Int
  incident_id_inc: Int
  sentDate: DateTime
  type_unset: Boolean
  sentDate_unset: Boolean
  userId_unset: Boolean
  _id_unset: Boolean
  userId: NotificationUserIdRelationInput
  _id: ObjectId
  processed: Boolean
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

input History_incidentQueryInput {
  modifiedBy_in: [String]
  description_ne: String
  editors: [String]
  epoch_date_modified_ne: Int
  flagged_dissimilar_incidents_in: [Int]
  description_gte: String
  OR: [History_incidentQueryInput!]
  AllegedDeveloperOfAISystem: [String]
  incident_id: Int
  incident_id_exists: Boolean
  date_lt: String
  incident_id_nin: [Int]
  editor_notes: String
  modifiedBy_ne: String
  title_gt: String
  _id_ne: ObjectId
  _id_gte: ObjectId
  AllegedDeveloperOfAISystem_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_in: [String]
  editor_notes_in: [String]
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  flagged_dissimilar_incidents_nin: [Int]
  title_lt: String
  title_ne: String
  editor_similar_incidents_nin: [Int]
  AllegedDeveloperOfAISystem_nin: [String]
  _id: ObjectId
  flagged_dissimilar_incidents_exists: Boolean
  epoch_date_modified_gte: Int
  _id_exists: Boolean
  editors_in: [String]
  modifiedBy: String
  editor_notes_exists: Boolean
  AllegedDeployerOfAISystem: [String]
  incident_id_ne: Int
  editor_dissimilar_incidents_in: [Int]
  date_in: [String]
  AllegedDeployerOfAISystem_exists: Boolean
  reports_in: [Int]
  description_lte: String
  _id_nin: [ObjectId]
  epoch_date_modified_exists: Boolean
  AllegedDeveloperOfAISystem_in: [String]
  nlp_similar_incidents_exists: Boolean
  editors_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_nin: [String]
  title_in: [String]
  incident_id_lt: Int
  description_gt: String
  nlp_similar_incidents: [History_incidentNlp_similar_incidentQueryInput]
  epoch_date_modified_in: [Int]
  description: String
  reports_nin: [Int]
  _id_in: [ObjectId]
  description_in: [String]
  editor_dissimilar_incidents: [Int]
  modifiedBy_lt: String
  editor_notes_lte: String
  incident_id_gte: Int
  title: String
  title_nin: [String]
  AllegedDeployerOfAISystem_in: [String]
  nlp_similar_incidents_nin: [History_incidentNlp_similar_incidentQueryInput]
  epoch_date_modified_lte: Int
  title_gte: String
  date_ne: String
  editor_similar_incidents_exists: Boolean
  incident_id_in: [Int]
  _id_lte: ObjectId
  reports: [Int]
  incident_id_lte: Int
  epoch_date_modified_lt: Int
  date_gte: String
  editor_dissimilar_incidents_nin: [Int]
  editor_similar_incidents_in: [Int]
  title_lte: String
  date: String
  date_exists: Boolean
  modifiedBy_gt: String
  editor_notes_lt: String
  editor_similar_incidents: [Int]
  _id_lt: ObjectId
  epoch_date_modified_nin: [Int]
  embedding: History_incidentEmbeddingQueryInput
  AND: [History_incidentQueryInput!]
  flagged_dissimilar_incidents: [Int]
  incident_id_gt: Int
  editor_notes_ne: String
  modifiedBy_lte: String
  modifiedBy_exists: Boolean
  modifiedBy_nin: [String]
  _id_gt: ObjectId
  date_gt: String
  editor_notes_nin: [String]
  tsne_exists: Boolean
  date_lte: String
  epoch_date_modified_gt: Int
  editors_nin: [String]
  title_exists: Boolean
  reports_exists: Boolean
  AllegedDeployerOfAISystem_nin: [String]
  editor_notes_gt: String
  AllegedHarmedOrNearlyHarmedParties: [String]
  description_lt: String
  embedding_exists: Boolean
  nlp_similar_incidents_in: [History_incidentNlp_similar_incidentQueryInput]
  tsne: History_incidentTsneQueryInput
  epoch_date_modified: Int
  date_nin: [String]
  description_exists: Boolean
  description_nin: [String]
  editor_notes_gte: String
  editor_dissimilar_incidents_exists: Boolean
  modifiedBy_gte: String
}

input RisksInput {
  tags: [String]
}

input QuickaddInsertInput {
  source_domain: String
  url: String!
  _id: ObjectId
  date_submitted: String!
  incident_id: Long
}

input History_reportEmbeddingQueryInput {
  AND: [History_reportEmbeddingQueryInput!]
  vector_in: [Float]
  vector_exists: Boolean
  from_text_hash_in: [String]
  from_text_hash_ne: String
  from_text_hash: String
  OR: [History_reportEmbeddingQueryInput!]
  from_text_hash_gt: String
  from_text_hash_lt: String
  from_text_hash_gte: String
  from_text_hash_nin: [String]
  from_text_hash_lte: String
  vector_nin: [Float]
  vector: [Float]
  from_text_hash_exists: Boolean
}

type IncidentTsne {
  x: Float
  y: Float
}

input IncidentAllegedDeployerOfAISystemRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input SubmissionIncident_editorsRelationInput {
  link: [String]
  create: [UserInsertInput]
}

input ChecklistRiskPrecedentInsertInput {
  title: String
  description: String
  incident_id: Int
  tags: [String]
}

input QuickaddUpdateInput {
  _id_unset: Boolean
  incident_id_unset: Boolean
  source_domain_unset: Boolean
  url: String
  url_unset: Boolean
  _id: ObjectId
  date_submitted: String
  date_submitted_unset: Boolean
  incident_id: Long
  source_domain: String
}

input TaxaField_listItem_fieldComplete_fromQueryInput {
  all_nin: [String]
  current_in: [String]
  entities_exists: Boolean
  AND: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  OR: [TaxaField_listItem_fieldComplete_fromQueryInput!]
  all_in: [String]
  current: [String]
  entities: Boolean
  all_exists: Boolean
  current_exists: Boolean
  all: [String]
  current_nin: [String]
  entities_ne: Boolean
}

type IncidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input DuplicateQueryInput {
  true_incident_number_exists: Boolean
  duplicate_incident_number_lte: Int
  true_incident_number_gt: Int
  true_incident_number_lte: Int
  _id_ne: ObjectId
  true_incident_number_in: [Int]
  _id_exists: Boolean
  true_incident_number_lt: Int
  true_incident_number_nin: [Int]
  AND: [DuplicateQueryInput!]
  _id_nin: [ObjectId]
  true_incident_number: Int
  _id_gte: ObjectId
  duplicate_incident_number_gt: Int
  _id_lt: ObjectId
  duplicate_incident_number_gte: Int
  duplicate_incident_number_nin: [Int]
  _id_in: [ObjectId]
  true_incident_number_ne: Int
  _id_lte: ObjectId
  duplicate_incident_number_lt: Int
  duplicate_incident_number_ne: Int
  _id: ObjectId
  duplicate_incident_number_exists: Boolean
  _id_gt: ObjectId
  true_incident_number_gte: Int
  OR: [DuplicateQueryInput!]
  duplicate_incident_number: Int
  duplicate_incident_number_in: [Int]
}

input IncidentTsneInsertInput {
  x: Float
  y: Float
}

input IncidentTsneUpdateInput {
  y_unset: Boolean
  x: Float
  x_inc: Float
  x_unset: Boolean
  y: Float
  y_inc: Float
}

type LogReportHistoryPayload {
  report_number: Int
}

input TaxaField_listInsertInput {
  mongo_type: String
  display_type: String
  hide_search: Boolean
  short_name: String
  permitted_values: [String]
  field_number: String
  item_fields: TaxaField_listItem_fieldInsertInput
  default: String
  long_name: String
  long_description: String
  short_description: String
  instant_facet: Boolean
  public: Boolean
  weight: Int
  placeholder: String
  required: Boolean
  complete_from: TaxaField_listComplete_fromInsertInput
}

input TaxaDummy_fieldUpdateInput {
  field_number: String
  field_number_unset: Boolean
  short_name: String
  short_name_unset: Boolean
}

type Entity {
  _id: ObjectId
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
}

input ClassificationReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
}

type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}

input EntityQueryInput {
  date_modified_in: [DateTime]
  created_at_nin: [DateTime]
  _id_in: [ObjectId]
  entity_id_exists: Boolean
  _id_ne: ObjectId
  name_exists: Boolean
  date_modified_ne: DateTime
  date_modified_gt: DateTime
  entity_id: String
  date_modified_nin: [DateTime]
  name: String
  OR: [EntityQueryInput!]
  entity_id_in: [String]
  entity_id_ne: String
  created_at_gte: DateTime
  AND: [EntityQueryInput!]
  _id_lt: ObjectId
  created_at_ne: DateTime
  date_modified_gte: DateTime
  name_gt: String
  name_in: [String]
  date_modified_exists: Boolean
  created_at_in: [DateTime]
  _id_lte: ObjectId
  entity_id_nin: [String]
  entity_id_gt: String
  name_lt: String
  date_modified_lte: DateTime
  _id_gt: ObjectId
  _id: ObjectId
  entity_id_gte: String
  name_nin: [String]
  name_ne: String
  name_lte: String
  _id_nin: [ObjectId]
  _id_exists: Boolean
  created_at_lte: DateTime
  date_modified: DateTime
  date_modified_lt: DateTime
  entity_id_lt: String
  created_at_gt: DateTime
  created_at_exists: Boolean
  entity_id_lte: String
  created_at: DateTime
  name_gte: String
  _id_gte: ObjectId
  created_at_lt: DateTime
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

input CandidateClassification_similarityUpdateInput {
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
  classification: String
  classification_unset: Boolean
}

input TaxaDummy_fieldInsertInput {
  field_number: String
  short_name: String
}

input CandidateQueryInput {
  _id_in: [ObjectId]
  matching_entities_in: [String]
  plain_text_exists: Boolean
  url_gte: String
  similarity_lt: Float
  matching_harm_keywords_exists: Boolean
  date_downloaded_nin: [String]
  epoch_date_downloaded_nin: [Int]
  image_url_gt: String
  language: String
  text_lt: String
  date_downloaded: String
  date_downloaded_lte: String
  epoch_date_downloaded_in: [Int]
  source_domain_nin: [String]
  date_downloaded_lt: String
  _id_gte: ObjectId
  language_gt: String
  match_ne: Boolean
  text: String
  title: String
  text_lte: String
  _id_exists: Boolean
  matching_entities_exists: Boolean
  _id_nin: [ObjectId]
  date_downloaded_ne: String
  date_published: String
  date_downloaded_gt: String
  date_downloaded_exists: Boolean
  _id_ne: ObjectId
  title_nin: [String]
  date_published_exists: Boolean
  image_url_gte: String
  plain_text_lt: String
  epoch_date_published_nin: [Int]
  _id_gt: ObjectId
  title_lte: String
  authors_nin: [String]
  source_domain_exists: Boolean
  classification_similarity_exists: Boolean
  authors_exists: Boolean
  image_url_exists: Boolean
  url_nin: [String]
  source_domain_lt: String
  language_gte: String
  plain_text_in: [String]
  epoch_date_published_in: [Int]
  _id_lte: ObjectId
  title_in: [String]
  epoch_date_downloaded_exists: Boolean
  match: Boolean
  plain_text: String
  source_domain_ne: String
  _id_lt: ObjectId
  classification_similarity_in: [CandidateClassification_similarityQueryInput]
  date_published_lte: String
  matching_keywords: [String]
  _id: ObjectId
  text_gt: String
  epoch_date_downloaded_ne: Int
  date_published_ne: String
  source_domain: String
  plain_text_ne: String
  title_gte: String
  epoch_date_downloaded_lte: Int
  matching_entities_nin: [String]
  language_nin: [String]
  AND: [CandidateQueryInput!]
  plain_text_nin: [String]
  url_ne: String
  source_domain_gt: String
  image_url_lte: String
  date_published_gte: String
  image_url_ne: String
  title_lt: String
  matching_harm_keywords_in: [String]
  epoch_date_downloaded_lt: Int
  authors: [String]
  text_gte: String
  url_lte: String
  similarity: Float
  epoch_date_published_gte: Int
  source_domain_gte: String
  date_downloaded_gte: String
  similarity_nin: [Float]
  url_in: [String]
  source_domain_lte: String
  epoch_date_downloaded_gte: Int
  similarity_gte: Float
  similarity_ne: Float
  date_downloaded_in: [String]
  matching_harm_keywords: [String]
  matching_harm_keywords_nin: [String]
  text_exists: Boolean
  dismissed: Boolean
  epoch_date_downloaded: Int
  epoch_date_published_exists: Boolean
  epoch_date_published: Int
  image_url: String
  image_url_in: [String]
  authors_in: [String]
  matching_entities: [String]
  matching_keywords_exists: Boolean
  epoch_date_published_lt: Int
  matching_keywords_nin: [String]
  date_published_in: [String]
  source_domain_in: [String]
  language_ne: String
  similarity_gt: Float
  plain_text_gte: String
  epoch_date_published_ne: Int
  epoch_date_downloaded_gt: Int
  embedding: CandidateEmbeddingQueryInput
  text_in: [String]
  epoch_date_published_gt: Int
  similarity_lte: Float
  match_exists: Boolean
  language_exists: Boolean
  text_ne: String
  plain_text_lte: String
  embedding_exists: Boolean
  date_published_nin: [String]
  image_url_nin: [String]
  language_in: [String]
  url: String
  date_published_lt: String
  date_published_gt: String
  similarity_exists: Boolean
  dismissed_exists: Boolean
  text_nin: [String]
  image_url_lt: String
  url_lt: String
  language_lt: String
  classification_similarity: [CandidateClassification_similarityQueryInput]
  matching_keywords_in: [String]
  epoch_date_published_lte: Int
  dismissed_ne: Boolean
  classification_similarity_nin: [CandidateClassification_similarityQueryInput]
  language_lte: String
  plain_text_gt: String
  OR: [CandidateQueryInput!]
  url_exists: Boolean
  title_ne: String
  similarity_in: [Float]
  url_gt: String
  title_exists: Boolean
  title_gt: String
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

input CandidateUpdateInput {
  classification_similarity_unset: Boolean
  source_domain_unset: Boolean
  epoch_date_published_unset: Boolean
  match_unset: Boolean
  matching_keywords_unset: Boolean
  matching_harm_keywords_unset: Boolean
  similarity_unset: Boolean
  _id: ObjectId
  title: String
  similarity_inc: Float
  epoch_date_downloaded: Int
  language_unset: Boolean
  date_downloaded: String
  matching_keywords: [String]
  date_published_unset: Boolean
  authors_unset: Boolean
  authors: [String]
  matching_entities_unset: Boolean
  source_domain: String
  language: String
  title_unset: Boolean
  date_published: String
  plain_text: String
  dismissed_unset: Boolean
  embedding_unset: Boolean
  url: String
  text: String
  dismissed: Boolean
  plain_text_unset: Boolean
  match: Boolean
  matching_entities: [String]
  epoch_date_published_inc: Int
  similarity: Float
  date_downloaded_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  matching_harm_keywords: [String]
  classification_similarity: [CandidateClassification_similarityUpdateInput]
  url_unset: Boolean
  image_url: String
  image_url_unset: Boolean
  text_unset: Boolean
  _id_unset: Boolean
  embedding: CandidateEmbeddingUpdateInput
  epoch_date_downloaded_inc: Int
  epoch_date_published: Int
}

input IncidentEmbeddingUpdateInput {
  from_reports: [Int]
  from_reports_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

type ReportEmbedding {
  from_text_hash: String
  vector: [Float]
}

enum ReportSortByInput {
  CLOUDINARY_ID_DESC
  EPOCH_DATE_PUBLISHED_DESC
  EPOCH_DATE_SUBMITTED_DESC
  IMAGE_URL_DESC
  LANGUAGE_ASC
  REPORT_NUMBER_DESC
  TEXT_ASC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_ASC
  DATE_MODIFIED_DESC
  DATE_SUBMITTED_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  IMAGE_URL_ASC
  LANGUAGE_DESC
  DATE_DOWNLOADED_DESC
  PLAIN_TEXT_DESC
  URL_DESC
  USER_ASC
  TITLE_ASC
  DATE_PUBLISHED_DESC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_MODIFIED_DESC
  EPOCH_DATE_SUBMITTED_ASC
  REPORT_NUMBER_ASC
  URL_ASC
  EPOCH_DATE_MODIFIED_ASC
  TEXT_DESC
  CLOUDINARY_ID_ASC
  DATE_SUBMITTED_ASC
  PLAIN_TEXT_ASC
  SOURCE_DOMAIN_ASC
  SOURCE_DOMAIN_DESC
  TITLE_DESC
  USER_DESC
  DATE_PUBLISHED_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  EPOCH_DATE_PUBLISHED_ASC
  _ID_ASC
  _ID_DESC
}

input History_reportQueryInput {
  _id_lt: ObjectId
  tags: [String]
  epoch_date_downloaded_ne: Int
  date_published_ne: DateTime
  date_published_exists: Boolean
  epoch_date_submitted_ne: Int
  epoch_date_published_lte: Int
  inputs_outputs_exists: Boolean
  cloudinary_id_in: [String]
  AND: [History_reportQueryInput!]
  cloudinary_id_lt: String
  epoch_date_modified_ne: Int
  editor_notes_nin: [String]
  epoch_date_modified_exists: Boolean
  url_gt: String
  image_url_lte: String
  epoch_date_downloaded_exists: Boolean
  embedding_exists: Boolean
  date_downloaded_gt: DateTime
  text: String
  title: String
  epoch_date_modified_gte: Int
  epoch_date_submitted_lt: Int
  plain_text_gte: String
  date_downloaded_nin: [DateTime]
  epoch_date_modified_in: [Int]
  date_submitted_ne: DateTime
  epoch_date_downloaded_nin: [Int]
  source_domain: String
  user_ne: String
  image_url_nin: [String]
  _id_gte: ObjectId
  date_modified_exists: Boolean
  url_exists: Boolean
  user_gt: String
  modifiedBy_lt: String
  report_number_gt: Int
  date_downloaded_in: [DateTime]
  language_gt: String
  inputs_outputs_nin: [String]
  user_nin: [String]
  description_lt: String
  epoch_date_submitted_lte: Int
  epoch_date_published: Int
  editor_notes_ne: String
  _id_lte: ObjectId
  quiet_exists: Boolean
  date_published_lt: DateTime
  epoch_date_downloaded_gt: Int
  report_number_exists: Boolean
  source_domain_ne: String
  epoch_date_modified_gt: Int
  text_ne: String
  plain_text_ne: String
  title_lte: String
  plain_text_nin: [String]
  cloudinary_id_lte: String
  source_domain_in: [String]
  date_submitted_lt: DateTime
  epoch_date_submitted: Int
  authors_exists: Boolean
  url_lt: String
  modifiedBy_gt: String
  title_nin: [String]
  image_url_exists: Boolean
  language_nin: [String]
  source_domain_nin: [String]
  date_modified_ne: DateTime
  text_nin: [String]
  modifiedBy_gte: String
  report_number_in: [Int]
  _id_ne: ObjectId
  date_submitted_exists: Boolean
  _id_gt: ObjectId
  cloudinary_id_gt: String
  user_lt: String
  date_published_lte: DateTime
  tags_in: [String]
  plain_text_lt: String
  source_domain_exists: Boolean
  date_submitted_gte: DateTime
  date_downloaded_ne: DateTime
  user_exists: Boolean
  url: String
  is_incident_report_exists: Boolean
  title_ne: String
  modifiedBy: String
  epoch_date_published_ne: Int
  user_gte: String
  submitters_nin: [String]
  OR: [History_reportQueryInput!]
  description_gte: String
  source_domain_gte: String
  _id_exists: Boolean
  text_lte: String
  authors_nin: [String]
  cloudinary_id_gte: String
  description_lte: String
  flag: Boolean
  date_modified_lte: DateTime
  cloudinary_id_ne: String
  date_submitted_in: [DateTime]
  submitters_in: [String]
  text_lt: String
  date_downloaded_lte: DateTime
  date_published_in: [DateTime]
  date_downloaded: DateTime
  report_number_gte: Int
  image_url: String
  description_ne: String
  language_in: [String]
  epoch_date_downloaded_lt: Int
  language: String
  description: String
  date_modified_gte: DateTime
  image_url_gte: String
  image_url_ne: String
  date_downloaded_exists: Boolean
  date_submitted_lte: DateTime
  epoch_date_published_exists: Boolean
  epoch_date_downloaded_gte: Int
  user: String
  date_published_gte: DateTime
  inputs_outputs_in: [String]
  quiet: Boolean
  language_lt: String
  url_in: [String]
  date_modified_lt: DateTime
  is_incident_report_ne: Boolean
  text_exists: Boolean
  epoch_date_modified_nin: [Int]
  language_gte: String
  date_downloaded_lt: DateTime
  date_downloaded_gte: DateTime
  plain_text_gt: String
  epoch_date_submitted_gt: Int
  url_lte: String
  date_submitted_nin: [DateTime]
  text_in: [String]
  epoch_date_submitted_exists: Boolean
  report_number_lte: Int
  modifiedBy_ne: String
  is_incident_report: Boolean
  submitters_exists: Boolean
  epoch_date_modified_lte: Int
  embedding: History_reportEmbeddingQueryInput
  editor_notes_gt: String
  quiet_ne: Boolean
  editor_notes_gte: String
  authors_in: [String]
  plain_text_lte: String
  editor_notes_exists: Boolean
  url_nin: [String]
  authors: [String]
  cloudinary_id: String
  report_number_nin: [Int]
  report_number_lt: Int
  url_ne: String
  title_gt: String
  plain_text: String
  epoch_date_published_gt: Int
  epoch_date_published_in: [Int]
  text_gte: String
  flag_exists: Boolean
  report_number_ne: Int
  date_published_gt: DateTime
  source_domain_gt: String
  description_gt: String
  modifiedBy_in: [String]
  title_gte: String
  epoch_date_submitted_in: [Int]
  epoch_date_submitted_nin: [Int]
  date_submitted_gt: DateTime
  epoch_date_modified_lt: Int
  image_url_gt: String
  _id_in: [ObjectId]
  plain_text_exists: Boolean
  language_exists: Boolean
  editor_notes_lte: String
  epoch_date_published_lt: Int
  date_published_nin: [DateTime]
  modifiedBy_nin: [String]
  epoch_date_downloaded_lte: Int
  title_lt: String
  editor_notes_lt: String
  url_gte: String
  modifiedBy_lte: String
  report_number: Int
  date_submitted: DateTime
  source_domain_lte: String
  date_modified_gt: DateTime
  description_exists: Boolean
  _id_nin: [ObjectId]
  text_gt: String
  epoch_date_published_nin: [Int]
  description_in: [String]
  description_nin: [String]
  editor_notes_in: [String]
  date_published: DateTime
  flag_ne: Boolean
  source_domain_lt: String
  title_in: [String]
  epoch_date_modified: Int
  plain_text_in: [String]
  epoch_date_published_gte: Int
  image_url_lt: String
  cloudinary_id_exists: Boolean
  editor_notes: String
  user_in: [String]
  tags_exists: Boolean
  user_lte: String
  inputs_outputs: [String]
  epoch_date_downloaded_in: [Int]
  date_modified_nin: [DateTime]
  cloudinary_id_nin: [String]
  date_modified: DateTime
  title_exists: Boolean
  modifiedBy_exists: Boolean
  epoch_date_submitted_gte: Int
  language_lte: String
  date_modified_in: [DateTime]
  _id: ObjectId
  submitters: [String]
  epoch_date_downloaded: Int
  tags_nin: [String]
  image_url_in: [String]
  language_ne: String
}

input IncidentInsertInput {
  title: String!
  editor_notes: String
  editor_dissimilar_incidents: [Int]
  tsne: IncidentTsneInsertInput
  description: String
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  nlp_similar_incidents: [IncidentNlp_similar_incidentInsertInput]
  editors: IncidentEditorsRelationInput!
  reports: IncidentReportsRelationInput!
  flagged_dissimilar_incidents: [Int]
  editor_similar_incidents: [Int]
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  _id: ObjectId
  epoch_date_modified: Int
  embedding: IncidentEmbeddingInsertInput
  incident_id: Int!
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  date: String!
}

input IncidentEditorsRelationInput {
  create: [UserInsertInput]
  link: [String]
}

type ReportTranslation {
  text: String
  title: String
}

enum SubscriptionSortByInput {
  TYPE_ASC
  TYPE_DESC
  USERID_ASC
  _ID_ASC
  ENTITYID_ASC
  ENTITYID_DESC
  USERID_DESC
  _ID_DESC
  INCIDENT_ID_ASC
  INCIDENT_ID_DESC
}

enum ChecklistSortByInput {
  DATE_CREATED_DESC
  ID_DESC
  NAME_DESC
  _ID_DESC
  ABOUT_DESC
  ENTITY_ID_ASC
  ENTITY_ID_DESC
  ID_ASC
  _ID_ASC
  DATE_UPDATED_ASC
  DATE_UPDATED_DESC
  OWNER_ID_ASC
  OWNER_ID_DESC
  ABOUT_ASC
  DATE_CREATED_ASC
  NAME_ASC
}

input IncidentNlp_similar_incidentUpdateInput {
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
  similarity_inc: Float
}

input CandidateEmbeddingUpdateInput {
  vector_unset: Boolean
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
}

input IncidentTsneQueryInput {
  y_gte: Float
  x_nin: [Float]
  y_nin: [Float]
  x_in: [Float]
  x_ne: Float
  x_gt: Float
  y_in: [Float]
  OR: [IncidentTsneQueryInput!]
  y_lt: Float
  x: Float
  y_exists: Boolean
  y: Float
  y_lte: Float
  x_gte: Float
  x_lt: Float
  y_gt: Float
  y_ne: Float
  x_exists: Boolean
  x_lte: Float
  AND: [IncidentTsneQueryInput!]
}

input ChecklistRiskPrecedentQueryInput {
  title_nin: [String]
  description_lt: String
  title_gt: String
  description: String
  incident_id_lt: Int
  incident_id_gt: Int
  description_in: [String]
  title_exists: Boolean
  tags_exists: Boolean
  title_lte: String
  title_ne: String
  description_lte: String
  incident_id_lte: Int
  title: String
  description_gt: String
  description_ne: String
  description_nin: [String]
  incident_id_gte: Int
  description_gte: String
  OR: [ChecklistRiskPrecedentQueryInput!]
  tags: [String]
  AND: [ChecklistRiskPrecedentQueryInput!]
  incident_id_exists: Boolean
  tags_nin: [String]
  title_lt: String
  tags_in: [String]
  incident_id_in: [Int]
  incident_id_ne: Int
  incident_id: Int
  incident_id_nin: [Int]
  title_in: [String]
  description_exists: Boolean
  title_gte: String
}

input History_incidentNlp_similar_incidentQueryInput {
  OR: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_lte: Int
  incident_id_in: [Int]
  similarity_gt: Float
  incident_id_gte: Int
  similarity_nin: [Float]
  incident_id_lt: Int
  similarity_lte: Float
  similarity: Float
  incident_id_gt: Int
  similarity_lt: Float
  similarity_ne: Float
  similarity_in: [Float]
  incident_id_exists: Boolean
  similarity_gte: Float
  incident_id: Int
  incident_id_ne: Int
  similarity_exists: Boolean
  AND: [History_incidentNlp_similar_incidentQueryInput!]
  incident_id_nin: [Int]
}

type History_incidentTsne {
  x: Float
  y: Float
}

input History_incidentNlp_similar_incidentUpdateInput {
  similarity_inc: Float
  similarity_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  incident_id_unset: Boolean
  similarity: Float
}

input ChecklistInsertInput {
  about: String
  date_updated: DateTime
  id: String
  tags_other: [String]
  name: String
  risks: [ChecklistRiskInsertInput]
  tags_goals: [String]
  _id: ObjectId
  owner_id: String
  tags_methods: [String]
  date_created: DateTime
  entity_id: String
}

input SubmissionEmbeddingQueryInput {
  from_text_hash_gt: String
  from_text_hash_ne: String
  vector_exists: Boolean
  from_text_hash: String
  from_text_hash_gte: String
  from_text_hash_lt: String
  from_text_hash_in: [String]
  from_text_hash_lte: String
  vector_nin: [Float]
  vector_in: [Float]
  OR: [SubmissionEmbeddingQueryInput!]
  from_text_hash_nin: [String]
  from_text_hash_exists: Boolean
  AND: [SubmissionEmbeddingQueryInput!]
  vector: [Float]
}

input IncidentEmbeddingInsertInput {
  from_reports: [Int]
  vector: [Float]
}

input History_incidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input TaxaField_listQueryInput {
  display_type_in: [String]
  short_name_lt: String
  short_description_gt: String
  required_exists: Boolean
  mongo_type: String
  AND: [TaxaField_listQueryInput!]
  field_number_ne: String
  placeholder_lte: String
  long_name_lt: String
  weight_lte: Int
  default_lte: String
  long_name_gt: String
  display_type_nin: [String]
  weight_ne: Int
  instant_facet_ne: Boolean
  short_description_exists: Boolean
  field_number_gte: String
  field_number_exists: Boolean
  permitted_values_nin: [String]
  weight_nin: [Int]
  placeholder: String
  short_name_gte: String
  mongo_type_in: [String]
  item_fields: TaxaField_listItem_fieldQueryInput
  instant_facet_exists: Boolean
  weight_in: [Int]
  placeholder_nin: [String]
  long_description_in: [String]
  required_ne: Boolean
  mongo_type_gt: String
  default_in: [String]
  display_type_ne: String
  short_name_ne: String
  public_exists: Boolean
  long_name_exists: Boolean
  instant_facet: Boolean
  hide_search_ne: Boolean
  short_description_gte: String
  short_name: String
  field_number_lte: String
  long_description_nin: [String]
  long_name_gte: String
  short_name_nin: [String]
  weight_gt: Int
  public: Boolean
  OR: [TaxaField_listQueryInput!]
  long_description_ne: String
  field_number_in: [String]
  weight_lt: Int
  short_description_lt: String
  long_description_gt: String
  short_name_exists: Boolean
  default_ne: String
  weight_gte: Int
  long_description_exists: Boolean
  default: String
  short_description_ne: String
  long_description: String
  default_gte: String
  long_description_lte: String
  permitted_values_exists: Boolean
  short_description_nin: [String]
  default_exists: Boolean
  short_description_lte: String
  complete_from: TaxaField_listComplete_fromQueryInput
  permitted_values_in: [String]
  mongo_type_gte: String
  long_name_ne: String
  mongo_type_lte: String
  placeholder_ne: String
  placeholder_exists: Boolean
  field_number_gt: String
  long_description_gte: String
  placeholder_gt: String
  permitted_values: [String]
  short_description_in: [String]
  long_description_lt: String
  public_ne: Boolean
  default_lt: String
  default_nin: [String]
  placeholder_in: [String]
  long_name_in: [String]
  display_type_lte: String
  weight_exists: Boolean
  item_fields_exists: Boolean
  display_type_lt: String
  mongo_type_lt: String
  default_gt: String
  display_type_exists: Boolean
  placeholder_gte: String
  short_name_gt: String
  field_number_nin: [String]
  display_type_gte: String
  display_type: String
  field_number_lt: String
  complete_from_exists: Boolean
  long_name_lte: String
  short_name_lte: String
  long_name_nin: [String]
  long_name: String
  required: Boolean
  short_name_in: [String]
  field_number: String
  display_type_gt: String
  weight: Int
  hide_search: Boolean
  mongo_type_nin: [String]
  mongo_type_exists: Boolean
  placeholder_lt: String
  short_description: String
  hide_search_exists: Boolean
  mongo_type_ne: String
}

input UserInsertInput {
  userId: String!
  _id: ObjectId
  first_name: String
  last_name: String
  roles: [String]!
}

input IncidentNlp_similar_incidentInsertInput {
  incident_id: Int
  similarity: Float
}

input ClassificationAttributeUpdateInput {
  value_json_unset: Boolean
  short_name: String
  short_name_unset: Boolean
  value_json: String
}

input SubmissionUpdateInput {
  plain_text_unset: Boolean
  plain_text: String
  developers_unset: Boolean
  date_published: String
  description_unset: Boolean
  incident_title_unset: Boolean
  user_unset: Boolean
  embedding_unset: Boolean
  image_url_unset: Boolean
  date_downloaded: String
  editor_dissimilar_incidents: [Int]
  cloudinary_id: String
  editor_similar_incidents_unset: Boolean
  date_modified_unset: Boolean
  language: String
  nlp_similar_incidents_unset: Boolean
  incident_editors_unset: Boolean
  date_downloaded_unset: Boolean
  status: String
  embedding: SubmissionEmbeddingUpdateInput
  url: String
  editor_similar_incidents: [Int]
  source_domain: String
  text_unset: Boolean
  harmed_parties_unset: Boolean
  url_unset: Boolean
  _id: ObjectId
  title: String
  authors: [String]
  authors_unset: Boolean
  cloudinary_id_unset: Boolean
  language_unset: Boolean
  status_unset: Boolean
  developers: SubmissionDevelopersRelationInput
  user: SubmissionUserRelationInput
  title_unset: Boolean
  incident_date_unset: Boolean
  source_domain_unset: Boolean
  submitters: [String]
  incident_editors: SubmissionIncident_editorsRelationInput
  editor_notes: String
  deployers: SubmissionDeployersRelationInput
  incident_ids: [Int]
  incident_ids_unset: Boolean
  epoch_date_modified: Int
  editor_dissimilar_incidents_unset: Boolean
  epoch_date_modified_inc: Int
  tags_unset: Boolean
  editor_notes_unset: Boolean
  epoch_date_modified_unset: Boolean
  submitters_unset: Boolean
  date_submitted: String
  deployers_unset: Boolean
  image_url: String
  date_published_unset: Boolean
  incident_date: String
  date_submitted_unset: Boolean
  nlp_similar_incidents: [SubmissionNlp_similar_incidentUpdateInput]
  text: String
  incident_title: String
  date_modified: String
  quiet: Boolean
  description: String
  tags: [String]
  quiet_unset: Boolean
  harmed_parties: SubmissionHarmed_partiesRelationInput
  _id_unset: Boolean
}

enum DuplicateSortByInput {
  DUPLICATE_INCIDENT_NUMBER_ASC
  DUPLICATE_INCIDENT_NUMBER_DESC
  TRUE_INCIDENT_NUMBER_ASC
  TRUE_INCIDENT_NUMBER_DESC
  _ID_ASC
  _ID_DESC
}

input CandidateClassification_similarityQueryInput {
  classification_lt: String
  similarity_gt: Float
  OR: [CandidateClassification_similarityQueryInput!]
  classification_ne: String
  similarity_in: [Float]
  similarity_exists: Boolean
  classification_lte: String
  classification_gt: String
  classification_in: [String]
  similarity: Float
  similarity_lte: Float
  classification_gte: String
  similarity_nin: [Float]
  classification_exists: Boolean
  similarity_lt: Float
  similarity_gte: Float
  AND: [CandidateClassification_similarityQueryInput!]
  classification: String
  classification_nin: [String]
  similarity_ne: Float
}

input ReportQueryInput {
  title_exists: Boolean
  report_number_in: [Int]
  flag: Boolean
  epoch_date_submitted_nin: [Int]
  report_number: Int
  date_submitted_nin: [DateTime]
  source_domain_exists: Boolean
  url_lte: String
  date_published: DateTime
  text: String
  embedding: ReportEmbeddingQueryInput
  language_gt: String
  language_lte: String
  epoch_date_published_exists: Boolean
  date_downloaded_lt: DateTime
  flag_ne: Boolean
  cloudinary_id_gt: String
  tags_exists: Boolean
  date_modified_lt: DateTime
  _id_nin: [ObjectId]
  editor_notes_ne: String
  date_submitted_lt: DateTime
  _id_gte: ObjectId
  _id: ObjectId
  epoch_date_downloaded_gt: Int
  epoch_date_published_in: [Int]
  epoch_date_published_lt: Int
  authors_exists: Boolean
  epoch_date_published: Int
  date_published_ne: DateTime
  text_exists: Boolean
  date_modified_gt: DateTime
  inputs_outputs_in: [String]
  epoch_date_submitted: Int
  date_modified_gte: DateTime
  image_url_lte: String
  epoch_date_submitted_exists: Boolean
  description: String
  epoch_date_downloaded_gte: Int
  epoch_date_downloaded_lte: Int
  image_url_exists: Boolean
  text_gt: String
  image_url_in: [String]
  epoch_date_modified_nin: [Int]
  epoch_date_downloaded_exists: Boolean
  date_downloaded: DateTime
  epoch_date_modified_lte: Int
  title_gte: String
  date_downloaded_gte: DateTime
  image_url_ne: String
  tags_in: [String]
  language_lt: String
  title: String
  epoch_date_modified_ne: Int
  editor_notes_exists: Boolean
  report_number_gte: Int
  editor_notes_lte: String
  date_published_gt: DateTime
  epoch_date_published_ne: Int
  epoch_date_submitted_lte: Int
  epoch_date_downloaded: Int
  language_exists: Boolean
  title_nin: [String]
  source_domain_gte: String
  source_domain_lte: String
  date_modified_in: [DateTime]
  epoch_date_modified: Int
  cloudinary_id_lte: String
  _id_lte: ObjectId
  cloudinary_id_nin: [String]
  epoch_date_modified_gte: Int
  url_gt: String
  description_gt: String
  url_nin: [String]
  report_number_lt: Int
  text_gte: String
  inputs_outputs_nin: [String]
  report_number_gt: Int
  user: UserQueryInput
  source_domain_nin: [String]
  OR: [ReportQueryInput!]
  authors_in: [String]
  epoch_date_submitted_ne: Int
  editor_notes_in: [String]
  editor_notes_lt: String
  cloudinary_id_lt: String
  report_number_lte: Int
  epoch_date_published_gt: Int
  tags: [String]
  user_exists: Boolean
  language_in: [String]
  embedding_exists: Boolean
  submitters_nin: [String]
  title_lte: String
  submitters: [String]
  plain_text_gt: String
  plain_text_lte: String
  date_published_in: [DateTime]
  cloudinary_id: String
  tags_nin: [String]
  editor_notes_gte: String
  date_modified: DateTime
  title_ne: String
  date_submitted_gte: DateTime
  date_submitted_gt: DateTime
  date_downloaded_nin: [DateTime]
  language_nin: [String]
  _id_lt: ObjectId
  report_number_ne: Int
  date_submitted_ne: DateTime
  image_url_lt: String
  url_lt: String
  date_submitted_exists: Boolean
  plain_text_nin: [String]
  _id_in: [ObjectId]
  epoch_date_modified_lt: Int
  report_number_exists: Boolean
  flag_exists: Boolean
  epoch_date_downloaded_nin: [Int]
  inputs_outputs_exists: Boolean
  image_url: String
  description_in: [String]
  source_domain_in: [String]
  url_ne: String
  _id_gt: ObjectId
  epoch_date_modified_gt: Int
  text_lt: String
  description_gte: String
  date_downloaded_ne: DateTime
  plain_text: String
  cloudinary_id_in: [String]
  epoch_date_published_gte: Int
  description_exists: Boolean
  date_downloaded_exists: Boolean
  plain_text_in: [String]
  url_exists: Boolean
  plain_text_ne: String
  epoch_date_published_nin: [Int]
  report_number_nin: [Int]
  epoch_date_downloaded_lt: Int
  editor_notes: String
  quiet: Boolean
  cloudinary_id_exists: Boolean
  epoch_date_downloaded_ne: Int
  url: String
  image_url_gte: String
  plain_text_exists: Boolean
  language_ne: String
  epoch_date_submitted_in: [Int]
  editor_notes_gt: String
  is_incident_report_ne: Boolean
  date_submitted_lte: DateTime
  text_in: [String]
  plain_text_lt: String
  image_url_gt: String
  date_submitted: DateTime
  title_in: [String]
  _id_ne: ObjectId
  date_submitted_in: [DateTime]
  submitters_exists: Boolean
  date_modified_ne: DateTime
  epoch_date_submitted_lt: Int
  date_downloaded_lte: DateTime
  description_ne: String
  submitters_in: [String]
  text_lte: String
  language_gte: String
  date_downloaded_gt: DateTime
  AND: [ReportQueryInput!]
  _id_exists: Boolean
  source_domain_gt: String
  epoch_date_downloaded_in: [Int]
  date_published_gte: DateTime
  date_downloaded_in: [DateTime]
  description_lte: String
  title_gt: String
  title_lt: String
  epoch_date_modified_exists: Boolean
  epoch_date_submitted_gt: Int
  inputs_outputs: [String]
  cloudinary_id_gte: String
  epoch_date_submitted_gte: Int
  image_url_nin: [String]
  date_published_lte: DateTime
  text_nin: [String]
  url_gte: String
  authors_nin: [String]
  is_incident_report: Boolean
  is_incident_report_exists: Boolean
  date_modified_lte: DateTime
  description_nin: [String]
  date_modified_nin: [DateTime]
  source_domain_lt: String
  cloudinary_id_ne: String
  date_modified_exists: Boolean
  url_in: [String]
  source_domain_ne: String
  editor_notes_nin: [String]
  source_domain: String
  description_lt: String
  date_published_exists: Boolean
  quiet_exists: Boolean
  language: String
  quiet_ne: Boolean
  epoch_date_modified_in: [Int]
  plain_text_gte: String
  text_ne: String
  epoch_date_published_lte: Int
  date_published_nin: [DateTime]
  date_published_lt: DateTime
  authors: [String]
}

input CreateVariantInputVariant {
  date_published: String
  inputs_outputs: [String]
  submitters: [String]
  text: String
}

input History_reportEmbeddingUpdateInput {
  from_text_hash: String
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
}

input TaxaUpdateInput {
  description: String
  description_unset: Boolean
  field_list: [TaxaField_listUpdateInput]
  weight: Int
  weight_inc: Int
  _id_unset: Boolean
  field_list_unset: Boolean
  _id: ObjectId
  dummy_fields_unset: Boolean
  complete_entities_unset: Boolean
  weight_unset: Boolean
  namespace: String
  complete_entities: Boolean
  namespace_unset: Boolean
  dummy_fields: [TaxaDummy_fieldUpdateInput]
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

input TaxaField_listItem_fieldQueryInput {
  short_name_gt: String
  long_name_gt: String
  weight_exists: Boolean
  weight_lte: Int
  field_number_gte: String
  field_number_exists: Boolean
  long_name_exists: Boolean
  required_exists: Boolean
  short_name_exists: Boolean
  weight: Int
  field_number_gt: String
  mongo_type_ne: String
  default_gte: String
  long_description_lte: String
  short_name_gte: String
  mongo_type_lt: String
  field_number_in: [String]
  long_name_in: [String]
  long_description_gte: String
  long_name_lt: String
  short_description_lt: String
  required_ne: Boolean
  public_ne: Boolean
  display_type_exists: Boolean
  default_exists: Boolean
  long_description_exists: Boolean
  placeholder_gte: String
  weight_gte: Int
  short_name_ne: String
  public: Boolean
  long_name_lte: String
  complete_from_exists: Boolean
  long_description_ne: String
  weight_in: [Int]
  short_name_nin: [String]
  display_type_ne: String
  complete_from: TaxaField_listItem_fieldComplete_fromQueryInput
  default_in: [String]
  long_description: String
  long_name: String
  display_type_lt: String
  permitted_values_in: [String]
  mongo_type_lte: String
  long_name_ne: String
  OR: [TaxaField_listItem_fieldQueryInput!]
  short_description_ne: String
  display_type_lte: String
  short_description: String
  instant_facet_ne: Boolean
  field_number: String
  field_number_ne: String
  default_lte: String
  display_type_nin: [String]
  public_exists: Boolean
  weight_nin: [Int]
  field_number_lte: String
  short_name: String
  instant_facet: Boolean
  short_name_in: [String]
  display_type: String
  default_nin: [String]
  placeholder_lte: String
  placeholder_gt: String
  default: String
  mongo_type: String
  long_name_gte: String
  short_description_gte: String
  short_description_lte: String
  placeholder_exists: Boolean
  long_description_in: [String]
  default_lt: String
  weight_lt: Int
  permitted_values_exists: Boolean
  mongo_type_in: [String]
  placeholder_lt: String
  mongo_type_nin: [String]
  long_description_lt: String
  field_number_lt: String
  permitted_values_nin: [String]
  default_ne: String
  short_description_gt: String
  short_description_nin: [String]
  display_type_gte: String
  weight_ne: Int
  short_name_lte: String
  AND: [TaxaField_listItem_fieldQueryInput!]
  mongo_type_exists: Boolean
  field_number_nin: [String]
  permitted_values: [String]
  placeholder_in: [String]
  weight_gt: Int
  short_description_exists: Boolean
  short_name_lt: String
  placeholder: String
  long_description_gt: String
  short_description_in: [String]
  long_name_nin: [String]
  mongo_type_gt: String
  display_type_gt: String
  placeholder_ne: String
  long_description_nin: [String]
  required: Boolean
  instant_facet_exists: Boolean
  default_gt: String
  mongo_type_gte: String
  display_type_in: [String]
  placeholder_nin: [String]
}

input History_incidentTsneInsertInput {
  x: Float
  y: Float
}

input GetUserInput {
  userId: ObjectId
}

type AppUser {
  email: String
}

input ChecklistRiskInsertInput {
  generated: Boolean
  id: String
  likelihood: String
  risk_status: String
  touched: Boolean
  risk_notes: String
  severity: String
  tags: [String]
  title: String
  precedents: [ChecklistRiskPrecedentInsertInput]
}

input History_incidentTsneUpdateInput {
  x_inc: Float
  x_unset: Boolean
  y: Float
  y_inc: Float
  y_unset: Boolean
  x: Float
}

type SubmissionNlp_similar_incident {
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

input EntityInsertInput {
  created_at: DateTime
  date_modified: DateTime
  entity_id: String!
  name: String!
  _id: ObjectId
}

input CandidateClassification_similarityInsertInput {
  classification: String
  similarity: Float
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

scalar ObjectId

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

input DuplicateInsertInput {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

input CandidateInsertInput {
  dismissed: Boolean
  similarity: Float
  matching_harm_keywords: [String]
  url: String!
  _id: ObjectId
  date_downloaded: String
  match: Boolean!
  title: String
  source_domain: String
  language: String
  classification_similarity: [CandidateClassification_similarityInsertInput]
  authors: [String]
  embedding: CandidateEmbeddingInsertInput
  date_published: String
  text: String
  image_url: String
  epoch_date_downloaded: Int
  plain_text: String
  matching_entities: [String]
  matching_keywords: [String]
  epoch_date_published: Int
}

enum History_incidentSortByInput {
  EDITOR_NOTES_DESC
  TITLE_DESC
  DESCRIPTION_ASC
  EDITOR_NOTES_ASC
  INCIDENT_ID_DESC
  MODIFIEDBY_DESC
  INCIDENT_ID_ASC
  TITLE_ASC
  DATE_ASC
  DESCRIPTION_DESC
  DATE_DESC
  EPOCH_DATE_MODIFIED_ASC
  EPOCH_DATE_MODIFIED_DESC
  MODIFIEDBY_ASC
  _ID_ASC
  _ID_DESC
}

input CreateDefaultAdminUserInput {
  email: String
  password: String
}

input QuickaddQueryInput {
  date_submitted_lt: String
  date_submitted_ne: String
  OR: [QuickaddQueryInput!]
  _id_gt: ObjectId
  source_domain_gte: String
  date_submitted_gte: String
  date_submitted_lte: String
  source_domain_lt: String
  incident_id_nin: [Long]
  date_submitted_gt: String
  source_domain_in: [String]
  url: String
  url_lte: String
  incident_id_gt: Long
  _id_lt: ObjectId
  url_in: [String]
  incident_id_lte: Long
  source_domain_exists: Boolean
  date_submitted_in: [String]
  url_gte: String
  date_submitted_nin: [String]
  source_domain_ne: String
  source_domain_gt: String
  url_exists: Boolean
  url_nin: [String]
  _id_nin: [ObjectId]
  _id_in: [ObjectId]
  date_submitted_exists: Boolean
  incident_id_in: [Long]
  source_domain_nin: [String]
  AND: [QuickaddQueryInput!]
  _id_gte: ObjectId
  _id: ObjectId
  incident_id_exists: Boolean
  date_submitted: String
  url_ne: String
  incident_id: Long
  incident_id_ne: Long
  incident_id_lt: Long
  source_domain_lte: String
  _id_ne: ObjectId
  url_lt: String
  incident_id_gte: Long
  url_gt: String
  _id_exists: Boolean
  source_domain: String
  _id_lte: ObjectId
}

type DeleteManyPayload {
  deletedCount: Int!
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

input IncidentNlp_similar_incidentQueryInput {
  incident_id_in: [Int]
  similarity_lt: Float
  incident_id_lt: Int
  similarity_in: [Float]
  similarity_gt: Float
  similarity_nin: [Float]
  AND: [IncidentNlp_similar_incidentQueryInput!]
  OR: [IncidentNlp_similar_incidentQueryInput!]
  incident_id: Int
  similarity_lte: Float
  similarity_exists: Boolean
  incident_id_gt: Int
  similarity: Float
  incident_id_exists: Boolean
  incident_id_ne: Int
  incident_id_nin: [Int]
  similarity_gte: Float
  similarity_ne: Float
  incident_id_lte: Int
  incident_id_gte: Int
}

type IncidentNlp_similar_incident {
  incident_id: Int
  similarity: Float
}

input IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input SubscriptionInsertInput {
  incident_id: SubscriptionIncident_idRelationInput
  type: String!
  userId: SubscriptionUserIdRelationInput!
  _id: ObjectId
  entityId: SubscriptionEntityIdRelationInput
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

input TaxaDummy_fieldQueryInput {
  field_number: String
  OR: [TaxaDummy_fieldQueryInput!]
  field_number_gte: String
  short_name_lte: String
  field_number_ne: String
  field_number_lte: String
  short_name_gte: String
  short_name_lt: String
  field_number_gt: String
  short_name_gt: String
  field_number_nin: [String]
  field_number_exists: Boolean
  field_number_lt: String
  short_name_exists: Boolean
  AND: [TaxaDummy_fieldQueryInput!]
  short_name_ne: String
  short_name_nin: [String]
  short_name: String
  short_name_in: [String]
  field_number_in: [String]
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

input History_reportUpdateInput {
  description_unset: Boolean
  tags: [String]
  date_submitted: DateTime
  report_number_inc: Int
  url: String
  title: String
  text: String
  is_incident_report: Boolean
  date_downloaded: DateTime
  embedding_unset: Boolean
  epoch_date_downloaded_inc: Int
  tags_unset: Boolean
  modifiedBy: String
  source_domain: String
  quiet: Boolean
  language: String
  epoch_date_downloaded_unset: Boolean
  report_number_unset: Boolean
  epoch_date_published: Int
  plain_text: String
  cloudinary_id: String
  epoch_date_modified_unset: Boolean
  is_incident_report_unset: Boolean
  source_domain_unset: Boolean
  submitters: [String]
  epoch_date_modified: Int
  flag: Boolean
  date_published: DateTime
  epoch_date_downloaded: Int
  user: String
  date_published_unset: Boolean
  _id: ObjectId
  embedding: History_reportEmbeddingUpdateInput
  date_downloaded_unset: Boolean
  editor_notes_unset: Boolean
  flag_unset: Boolean
  authors: [String]
  plain_text_unset: Boolean
  date_submitted_unset: Boolean
  epoch_date_published_inc: Int
  epoch_date_submitted: Int
  modifiedBy_unset: Boolean
  _id_unset: Boolean
  epoch_date_modified_inc: Int
  quiet_unset: Boolean
  submitters_unset: Boolean
  image_url: String
  text_unset: Boolean
  authors_unset: Boolean
  cloudinary_id_unset: Boolean
  epoch_date_published_unset: Boolean
  url_unset: Boolean
  date_modified_unset: Boolean
  epoch_date_submitted_unset: Boolean
  inputs_outputs_unset: Boolean
  description: String
  user_unset: Boolean
  language_unset: Boolean
  title_unset: Boolean
  inputs_outputs: [String]
  epoch_date_submitted_inc: Int
  editor_notes: String
  report_number: Int
  date_modified: DateTime
  image_url_unset: Boolean
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

type InsertManyPayload {
  insertedIds: [ObjectId]!
}

input ReportUpdateInput {
  url_unset: Boolean
  date_downloaded_unset: Boolean
  epoch_date_downloaded_unset: Boolean
  date_downloaded: DateTime
  epoch_date_submitted: Int
  _id: ObjectId
  cloudinary_id_unset: Boolean
  cloudinary_id: String
  text_unset: Boolean
  date_published_unset: Boolean
  url: String
  epoch_date_modified_unset: Boolean
  epoch_date_modified_inc: Int
  date_modified_unset: Boolean
  image_url_unset: Boolean
  authors_unset: Boolean
  epoch_date_modified: Int
  is_incident_report_unset: Boolean
  tags: [String]
  epoch_date_published: Int
  title_unset: Boolean
  _id_unset: Boolean
  flag: Boolean
  plain_text: String
  date_modified: DateTime
  epoch_date_downloaded: Int
  epoch_date_submitted_unset: Boolean
  is_incident_report: Boolean
  date_published: DateTime
  description_unset: Boolean
  date_submitted: DateTime
  epoch_date_published_unset: Boolean
  authors: [String]
  editor_notes_unset: Boolean
  inputs_outputs_unset: Boolean
  embedding_unset: Boolean
  user_unset: Boolean
  report_number: Int
  report_number_inc: Int
  language: String
  inputs_outputs: [String]
  text: String
  user: ReportUserRelationInput
  submitters_unset: Boolean
  tags_unset: Boolean
  embedding: ReportEmbeddingUpdateInput
  source_domain: String
  submitters: [String]
  quiet_unset: Boolean
  report_number_unset: Boolean
  quiet: Boolean
  date_submitted_unset: Boolean
  plain_text_unset: Boolean
  epoch_date_downloaded_inc: Int
  image_url: String
  language_unset: Boolean
  epoch_date_submitted_inc: Int
  description: String
  source_domain_unset: Boolean
  epoch_date_published_inc: Int
  flag_unset: Boolean
  editor_notes: String
  title: String
}

input UserUpdateInput {
  roles_unset: Boolean
  userId: String
  _id_unset: Boolean
  userId_unset: Boolean
  _id: ObjectId
  first_name: String
  first_name_unset: Boolean
  last_name: String
  last_name_unset: Boolean
  roles: [String]
}

type Query {
  candidate(query: CandidateQueryInput): Candidate
  candidates(sortBy: CandidateSortByInput, query: CandidateQueryInput, limit: Int = 100): [Candidate]!
  checklist(query: ChecklistQueryInput): Checklist
  checklists(limit: Int = 100, sortBy: ChecklistSortByInput, query: ChecklistQueryInput): [Checklist]!
  classification(query: ClassificationQueryInput): Classification
  classifications(sortBy: ClassificationSortByInput, query: ClassificationQueryInput, limit: Int = 100): [Classification]!
  duplicate(query: DuplicateQueryInput): Duplicate
  duplicates(query: DuplicateQueryInput, limit: Int = 100, sortBy: DuplicateSortByInput): [Duplicate]!
  entities(query: EntityQueryInput, limit: Int = 100, sortBy: EntitySortByInput): [Entity]!
  entity(query: EntityQueryInput): Entity
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
  submissions(limit: Int = 100, sortBy: SubmissionSortByInput, query: SubmissionQueryInput): [Submission]!
  subscription(query: SubscriptionQueryInput): Subscription
  subscriptions(sortBy: SubscriptionSortByInput, query: SubscriptionQueryInput, limit: Int = 100): [Subscription]!
  taxa(query: TaxaQueryInput): Taxa
  taxas(limit: Int = 100, sortBy: TaxaSortByInput, query: TaxaQueryInput): [Taxa]!
  user(query: UserQueryInput): User
  users(query: UserQueryInput, limit: Int = 100, sortBy: UserSortByInput): [User]!
}

input ReportEmbeddingQueryInput {
  vector_in: [Float]
  AND: [ReportEmbeddingQueryInput!]
  from_text_hash_lte: String
  from_text_hash_lt: String
  from_text_hash_gte: String
  vector: [Float]
  vector_exists: Boolean
  from_text_hash: String
  from_text_hash_nin: [String]
  from_text_hash_gt: String
  from_text_hash_exists: Boolean
  from_text_hash_in: [String]
  vector_nin: [Float]
  OR: [ReportEmbeddingQueryInput!]
  from_text_hash_ne: String
}

input SubmissionNlp_similar_incidentUpdateInput {
  incident_id: Int
  incident_id_unset: Boolean
  incident_id_inc: Int
  similarity: Float
  similarity_inc: Float
  similarity_unset: Boolean
}

input SubmissionEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

type UserAdminDatum {
  creationDate: DateTime
  disabled: Boolean
  email: String
  lastAuthenticationDate: DateTime
}

enum ClassificationSortByInput {
  NOTES_DESC
  _ID_ASC
  _ID_DESC
  NAMESPACE_ASC
  NAMESPACE_DESC
  NOTES_ASC
}

type PromoteSubmissionToReportPayload {
  incident_ids: [Int]
  report_number: Int
}

input ClassificationAttributeInsertInput {
  short_name: String
  value_json: String
}

input History_incidentUpdateInput {
  editor_notes: String
  modifiedBy: String
  title: String
  embedding_unset: Boolean
  editor_similar_incidents: [Int]
  title_unset: Boolean
  tsne: History_incidentTsneUpdateInput
  editor_dissimilar_incidents: [Int]
  _id: ObjectId
  _id_unset: Boolean
  AllegedDeployerOfAISystem_unset: Boolean
  reports_unset: Boolean
  epoch_date_modified_unset: Boolean
  modifiedBy_unset: Boolean
  editor_dissimilar_incidents_unset: Boolean
  editors: [String]
  AllegedDeployerOfAISystem: [String]
  AllegedDeveloperOfAISystem: [String]
  AllegedHarmedOrNearlyHarmedParties: [String]
  editors_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  editor_similar_incidents_unset: Boolean
  date_unset: Boolean
  date: String
  epoch_date_modified_inc: Int
  description_unset: Boolean
  incident_id_unset: Boolean
  nlp_similar_incidents: [History_incidentNlp_similar_incidentUpdateInput]
  flagged_dissimilar_incidents: [Int]
  incident_id: Int
  reports: [Int]
  editor_notes_unset: Boolean
  tsne_unset: Boolean
  flagged_dissimilar_incidents_unset: Boolean
  embedding: History_incidentEmbeddingUpdateInput
  incident_id_inc: Int
  epoch_date_modified: Int
  nlp_similar_incidents_unset: Boolean
  AllegedDeveloperOfAISystem_unset: Boolean
  description: String
}

scalar DateTime

type User {
  _id: ObjectId
  adminData: UserAdminDatum
  first_name: String
  last_name: String
  roles: [String]!
  userId: String!
}

type CandidateEmbedding {
  from_text_hash: String
  vector: [Float]
}

type SubmissionEmbedding {
  from_text_hash: String
  vector: [Float]
}

type History_reportEmbedding {
  from_text_hash: String
  vector: [Float]
}

input SubmissionEmbeddingUpdateInput {
  from_text_hash_unset: Boolean
  vector: [Float]
  vector_unset: Boolean
  from_text_hash: String
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

enum QuickaddSortByInput {
  INCIDENT_ID_DESC
  SOURCE_DOMAIN_DESC
  URL_ASC
  URL_DESC
  _ID_DESC
  DATE_SUBMITTED_ASC
  INCIDENT_ID_ASC
  SOURCE_DOMAIN_ASC
  _ID_ASC
  DATE_SUBMITTED_DESC
}

input TaxaField_listItem_fieldComplete_fromUpdateInput {
  all: [String]
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  entities: Boolean
  entities_unset: Boolean
}

type LogIncidentHistoryPayload {
  incident_id: Int
}

input ClassificationUpdateInput {
  notes_unset: Boolean
  attributes: [ClassificationAttributeUpdateInput]
  reports_unset: Boolean
  incidents: ClassificationIncidentsRelationInput
  publish: Boolean
  incidents_unset: Boolean
  _id: ObjectId
  namespace: String
  _id_unset: Boolean
  attributes_unset: Boolean
  namespace_unset: Boolean
  reports: ClassificationReportsRelationInput
  notes: String
  publish_unset: Boolean
}

input SubmissionHarmed_partiesRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input TaxaField_listComplete_fromInsertInput {
  all: [String]
  current: [String]
}

input IncidentUpdateInput {
  date: String
  AllegedDeployerOfAISystem: IncidentAllegedDeployerOfAISystemRelationInput
  AllegedDeveloperOfAISystem_unset: Boolean
  description_unset: Boolean
  editor_notes: String
  title: String
  editor_similar_incidents_unset: Boolean
  _id: ObjectId
  editors_unset: Boolean
  epoch_date_modified_inc: Int
  description: String
  _id_unset: Boolean
  editor_notes_unset: Boolean
  reports_unset: Boolean
  AllegedDeployerOfAISystem_unset: Boolean
  editors: IncidentEditorsRelationInput
  reports: IncidentReportsRelationInput
  date_unset: Boolean
  incident_id_unset: Boolean
  AllegedDeveloperOfAISystem: IncidentAllegedDeveloperOfAISystemRelationInput
  embedding_unset: Boolean
  flagged_dissimilar_incidents: [Int]
  editor_dissimilar_incidents: [Int]
  tsne: IncidentTsneUpdateInput
  AllegedHarmedOrNearlyHarmedParties: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput
  tsne_unset: Boolean
  embedding: IncidentEmbeddingUpdateInput
  epoch_date_modified_unset: Boolean
  incident_id_inc: Int
  nlp_similar_incidents_unset: Boolean
  editor_dissimilar_incidents_unset: Boolean
  AllegedHarmedOrNearlyHarmedParties_unset: Boolean
  editor_similar_incidents: [Int]
  epoch_date_modified: Int
  incident_id: Int
  flagged_dissimilar_incidents_unset: Boolean
  nlp_similar_incidents: [IncidentNlp_similar_incidentUpdateInput]
  title_unset: Boolean
}

input SubmissionDevelopersRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

type CandidateClassification_similarity {
  classification: String
  similarity: Float
}

enum SubmissionSortByInput {
  DATE_SUBMITTED_DESC
  EDITOR_NOTES_ASC
  URL_DESC
  TEXT_DESC
  _ID_DESC
  INCIDENT_DATE_DESC
  INCIDENT_TITLE_DESC
  LANGUAGE_ASC
  TEXT_ASC
  STATUS_DESC
  DATE_DOWNLOADED_DESC
  DESCRIPTION_ASC
  IMAGE_URL_ASC
  SOURCE_DOMAIN_DESC
  STATUS_ASC
  LANGUAGE_DESC
  CLOUDINARY_ID_ASC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_ASC
  DATE_PUBLISHED_ASC
  IMAGE_URL_DESC
  EPOCH_DATE_MODIFIED_ASC
  TITLE_DESC
  USER_DESC
  DATE_MODIFIED_DESC
  INCIDENT_TITLE_ASC
  URL_ASC
  USER_ASC
  DESCRIPTION_DESC
  EPOCH_DATE_MODIFIED_DESC
  INCIDENT_DATE_ASC
  PLAIN_TEXT_DESC
  SOURCE_DOMAIN_ASC
  PLAIN_TEXT_ASC
  TITLE_ASC
  _ID_ASC
  CLOUDINARY_ID_DESC
  DATE_PUBLISHED_DESC
  DATE_SUBMITTED_ASC
  EDITOR_NOTES_DESC
}

input ChecklistRiskQueryInput {
  precedents_nin: [ChecklistRiskPrecedentQueryInput]
  touched: Boolean
  risk_status_lte: String
  risk_status_in: [String]
  id_lte: String
  risk_status_gt: String
  likelihood_gt: String
  risk_notes_in: [String]
  id_in: [String]
  title_in: [String]
  risk_status_ne: String
  likelihood_gte: String
  generated: Boolean
  likelihood_in: [String]
  tags_nin: [String]
  title_gte: String
  severity_exists: Boolean
  severity_ne: String
  title_nin: [String]
  id_gt: String
  precedents_exists: Boolean
  generated_ne: Boolean
  severity_gt: String
  likelihood_nin: [String]
  likelihood_exists: Boolean
  id_ne: String
  title_lt: String
  title_lte: String
  id_lt: String
  risk_status_nin: [String]
  severity_nin: [String]
  touched_exists: Boolean
  risk_notes_exists: Boolean
  title_ne: String
  likelihood_lt: String
  id_gte: String
  title_exists: Boolean
  AND: [ChecklistRiskQueryInput!]
  title_gt: String
  severity_gte: String
  risk_notes_gt: String
  title: String
  precedents_in: [ChecklistRiskPrecedentQueryInput]
  severity_lt: String
  tags_in: [String]
  generated_exists: Boolean
  likelihood: String
  risk_status_lt: String
  risk_status_gte: String
  severity_lte: String
  risk_notes_nin: [String]
  tags_exists: Boolean
  OR: [ChecklistRiskQueryInput!]
  risk_notes_ne: String
  risk_notes_lt: String
  tags: [String]
  risk_notes_gte: String
  touched_ne: Boolean
  severity: String
  severity_in: [String]
  likelihood_ne: String
  risk_notes_lte: String
  id: String
  risk_status: String
  likelihood_lte: String
  risk_notes: String
  precedents: [ChecklistRiskPrecedentQueryInput]
  id_nin: [String]
  id_exists: Boolean
  risk_status_exists: Boolean
}

type RisksPayloadItem {
  precedents: [RisksPayloadPrecedent]
  tag: String
  tags: [String]
  title: String
}

type RisksPayloadPrecedentTsne {
  x: Float
  y: Float
}

input TaxaField_listComplete_fromUpdateInput {
  all_unset: Boolean
  current: [String]
  current_unset: Boolean
  all: [String]
}

input SubmissionNlp_similar_incidentInsertInput {
  similarity: Float
  incident_id: Int
}

input LinkReportsToIncidentsInput {
  report_numbers: [Int]
  incident_ids: [Int]
}

scalar Long

type ClassificationAttribute {
  short_name: String
  value_json: String
}

input IncidentAllegedDeveloperOfAISystemRelationInput {
  link: [String]
  create: [EntityInsertInput]
}

input NotificationQueryInput {
  incident_id: Int
  type_in: [String]
  _id_ne: ObjectId
  type_lt: String
  type_nin: [String]
  sentDate: DateTime
  sentDate_exists: Boolean
  type_ne: String
  type_gt: String
  incident_id_lt: Int
  incident_id_gte: Int
  sentDate_lte: DateTime
  processed: Boolean
  type_exists: Boolean
  _id_gte: ObjectId
  _id_lte: ObjectId
  sentDate_lt: DateTime
  incident_id_ne: Int
  _id: ObjectId
  sentDate_ne: DateTime
  _id_exists: Boolean
  sentDate_in: [DateTime]
  incident_id_exists: Boolean
  processed_exists: Boolean
  sentDate_gte: DateTime
  type_lte: String
  _id_gt: ObjectId
  sentDate_gt: DateTime
  userId: UserQueryInput
  sentDate_nin: [DateTime]
  _id_in: [ObjectId]
  _id_lt: ObjectId
  userId_exists: Boolean
  OR: [NotificationQueryInput!]
  incident_id_nin: [Int]
  _id_nin: [ObjectId]
  AND: [NotificationQueryInput!]
  incident_id_lte: Int
  incident_id_gt: Int
  processed_ne: Boolean
  type_gte: String
  type: String
  incident_id_in: [Int]
}

input IncidentQueryInput {
  AllegedDeveloperOfAISystem_in: [EntityQueryInput]
  embedding: IncidentEmbeddingQueryInput
  AllegedHarmedOrNearlyHarmedParties_in: [EntityQueryInput]
  _id_in: [ObjectId]
  AllegedDeployerOfAISystem: [EntityQueryInput]
  editor_notes: String
  AND: [IncidentQueryInput!]
  _id_gte: ObjectId
  nlp_similar_incidents: [IncidentNlp_similar_incidentQueryInput]
  date: String
  title_in: [String]
  editor_notes_nin: [String]
  editor_similar_incidents_exists: Boolean
  reports_nin: [ReportQueryInput]
  editor_notes_lt: String
  epoch_date_modified_nin: [Int]
  AllegedDeveloperOfAISystem_exists: Boolean
  AllegedHarmedOrNearlyHarmedParties_exists: Boolean
  description_ne: String
  editor_dissimilar_incidents_in: [Int]
  epoch_date_modified_gte: Int
  incident_id_lte: Int
  editor_dissimilar_incidents_exists: Boolean
  incident_id_nin: [Int]
  editor_notes_exists: Boolean
  AllegedDeployerOfAISystem_nin: [EntityQueryInput]
  title_lt: String
  AllegedDeveloperOfAISystem: [EntityQueryInput]
  description_lt: String
  epoch_date_modified_lt: Int
  date_in: [String]
  flagged_dissimilar_incidents_exists: Boolean
  incident_id_ne: Int
  _id_lte: ObjectId
  date_nin: [String]
  incident_id: Int
  editor_similar_incidents: [Int]
  date_lte: String
  editor_dissimilar_incidents: [Int]
  incident_id_lt: Int
  reports: [ReportQueryInput]
  tsne_exists: Boolean
  date_gte: String
  reports_exists: Boolean
  _id_lt: ObjectId
  date_lt: String
  title: String
  AllegedDeveloperOfAISystem_nin: [EntityQueryInput]
  editor_notes_gte: String
  editor_similar_incidents_nin: [Int]
  description_in: [String]
  incident_id_gte: Int
  _id_ne: ObjectId
  incident_id_gt: Int
  description_exists: Boolean
  epoch_date_modified_lte: Int
  epoch_date_modified: Int
  date_gt: String
  title_gte: String
  date_ne: String
  incident_id_in: [Int]
  date_exists: Boolean
  _id_exists: Boolean
  nlp_similar_incidents_in: [IncidentNlp_similar_incidentQueryInput]
  _id_gt: ObjectId
  title_gt: String
  incident_id_exists: Boolean
  description_gte: String
  title_lte: String
  epoch_date_modified_gt: Int
  title_exists: Boolean
  flagged_dissimilar_incidents: [Int]
  flagged_dissimilar_incidents_nin: [Int]
  editor_notes_lte: String
  AllegedHarmedOrNearlyHarmedParties: [EntityQueryInput]
  description: String
  description_gt: String
  editor_similar_incidents_in: [Int]
  description_nin: [String]
  embedding_exists: Boolean
  description_lte: String
  epoch_date_modified_ne: Int
  editors_nin: [UserQueryInput]
  flagged_dissimilar_incidents_in: [Int]
  editor_notes_in: [String]
  editors_exists: Boolean
  OR: [IncidentQueryInput!]
  title_nin: [String]
  nlp_similar_incidents_nin: [IncidentNlp_similar_incidentQueryInput]
  editor_notes_gt: String
  editors: [UserQueryInput]
  AllegedHarmedOrNearlyHarmedParties_nin: [EntityQueryInput]
  epoch_date_modified_in: [Int]
  editors_in: [UserQueryInput]
  tsne: IncidentTsneQueryInput
  title_ne: String
  AllegedDeployerOfAISystem_in: [EntityQueryInput]
  _id_nin: [ObjectId]
  nlp_similar_incidents_exists: Boolean
  _id: ObjectId
  editor_dissimilar_incidents_nin: [Int]
  reports_in: [ReportQueryInput]
  AllegedDeployerOfAISystem_exists: Boolean
  editor_notes_ne: String
  epoch_date_modified_exists: Boolean
}

input History_incidentEmbeddingQueryInput {
  vector: [Float]
  vector_in: [Float]
  vector_exists: Boolean
  OR: [History_incidentEmbeddingQueryInput!]
  from_reports_exists: Boolean
  AND: [History_incidentEmbeddingQueryInput!]
  from_reports: [Int]
  from_reports_in: [Int]
  from_reports_nin: [Int]
  vector_nin: [Float]
}

input IncidentReportsRelationInput {
  create: [ReportInsertInput]
  link: [Int]
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

input ClassificationIncidentsRelationInput {
  create: [IncidentInsertInput]
  link: [Int]
}

input CandidateEmbeddingInsertInput {
  from_text_hash: String
  vector: [Float]
}

input ChecklistRiskPrecedentUpdateInput {
  title: String
  title_unset: Boolean
  description: String
  incident_id_unset: Boolean
  tags: [String]
  tags_unset: Boolean
  incident_id: Int
  incident_id_inc: Int
  description_unset: Boolean
}

type CreateVariantPayload {
  incident_id: Int
  report_number: Int
}

input History_incidentEmbeddingUpdateInput {
  vector: [Float]
  vector_unset: Boolean
  from_reports: [Int]
  from_reports_unset: Boolean
}

input PromoteSubmissionToReportInput {
  is_incident_report: Boolean
  submission_id: ObjectId
  incident_ids: [Int]
}

input SubmissionNlp_similar_incidentQueryInput {
  AND: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_lte: Int
  similarity_ne: Float
  incident_id_in: [Int]
  incident_id: Int
  incident_id_exists: Boolean
  incident_id_lt: Int
  similarity_lt: Float
  similarity_in: [Float]
  similarity_lte: Float
  similarity: Float
  incident_id_gte: Int
  similarity_nin: [Float]
  OR: [SubmissionNlp_similar_incidentQueryInput!]
  incident_id_ne: Int
  similarity_exists: Boolean
  similarity_gte: Float
  similarity_gt: Float
  incident_id_nin: [Int]
  incident_id_gt: Int
}

input SubmissionUserRelationInput {
  create: UserInsertInput
  link: String
}

input SubmissionDeployersRelationInput {
  create: [EntityInsertInput]
  link: [String]
}

input SubmissionQueryInput {
  nlp_similar_incidents_in: [SubmissionNlp_similar_incidentQueryInput]
  nlp_similar_incidents_nin: [SubmissionNlp_similar_incidentQueryInput]
  deployers_exists: Boolean
  title: String
  status_gte: String
  incident_editors: [UserQueryInput]
  _id_gte: ObjectId
  OR: [SubmissionQueryInput!]
  incident_ids_exists: Boolean
  incident_date_ne: String
  incident_title_lt: String
  date_downloaded_gt: String
  submitters_exists: Boolean
  status_exists: Boolean
  tags_nin: [String]
  date_published_lt: String
  language_gte: String
  epoch_date_modified_gte: Int
  date_downloaded_ne: String
  editor_dissimilar_incidents_in: [Int]
  editor_notes_lt: String
  editor_similar_incidents_in: [Int]
  date_published: String
  plain_text_in: [String]
  quiet_ne: Boolean
  text_gte: String
  incident_title_ne: String
  title_gt: String
  date_modified_lt: String
  title_nin: [String]
  status_in: [String]
  editor_similar_incidents_exists: Boolean
  _id_lte: ObjectId
  status_nin: [String]
  url_gt: String
  date_modified_exists: Boolean
  editor_notes_gte: String
  date_submitted_gte: String
  epoch_date_modified_nin: [Int]
  date_submitted_exists: Boolean
  _id_nin: [ObjectId]
  status_gt: String
  developers_exists: Boolean
  url_in: [String]
  embedding: SubmissionEmbeddingQueryInput
  date_submitted_lt: String
  plain_text_gte: String
  date_published_ne: String
  url_lte: String
  url_exists: Boolean
  date_modified_gte: String
  plain_text: String
  source_domain_ne: String
  image_url_gte: String
  nlp_similar_incidents_exists: Boolean
  source_domain_gte: String
  incident_title_in: [String]
  date_downloaded_lte: String
  submitters: [String]
  date_modified_lte: String
  editor_dissimilar_incidents: [Int]
  date_submitted_ne: String
  incident_date_in: [String]
  language_lte: String
  quiet: Boolean
  editor_dissimilar_incidents_exists: Boolean
  description_lte: String
  text_ne: String
  editor_notes_lte: String
  plain_text_lt: String
  incident_date_lt: String
  source_domain_exists: Boolean
  editor_notes_nin: [String]
  embedding_exists: Boolean
  _id: ObjectId
  nlp_similar_incidents: [SubmissionNlp_similar_incidentQueryInput]
  url: String
  editor_dissimilar_incidents_nin: [Int]
  _id_exists: Boolean
  status_ne: String
  image_url_gt: String
  source_domain_lte: String
  language_in: [String]
  editor_notes_in: [String]
  source_domain_in: [String]
  epoch_date_modified_lt: Int
  plain_text_exists: Boolean
  AND: [SubmissionQueryInput!]
  incident_editors_exists: Boolean
  cloudinary_id: String
  source_domain_gt: String
  user_exists: Boolean
  epoch_date_modified_in: [Int]
  _id_in: [ObjectId]
  authors_nin: [String]
  plain_text_nin: [String]
  date_downloaded_gte: String
  image_url_lte: String
  date_published_nin: [String]
  cloudinary_id_nin: [String]
  deployers: [EntityQueryInput]
  developers_nin: [EntityQueryInput]
  date_published_in: [String]
  date_published_lte: String
  editor_notes_exists: Boolean
  incident_ids_nin: [Int]
  plain_text_ne: String
  url_lt: String
  epoch_date_modified_exists: Boolean
  language_exists: Boolean
  image_url_ne: String
  plain_text_lte: String
  editor_notes_ne: String
  epoch_date_modified_lte: Int
  description_exists: Boolean
  authors: [String]
  status_lt: String
  submitters_nin: [String]
  editor_similar_incidents: [Int]
  url_nin: [String]
  url_ne: String
  _id_ne: ObjectId
  plain_text_gt: String
  deployers_in: [EntityQueryInput]
  deployers_nin: [EntityQueryInput]
  text: String
  incident_title_exists: Boolean
  title_exists: Boolean
  incident_title: String
  date_published_gte: String
  date_modified_ne: String
  editor_notes_gt: String
  authors_in: [String]
  text_lt: String
  incident_ids: [Int]
  incident_date_exists: Boolean
  epoch_date_modified_gt: Int
  developers: [EntityQueryInput]
  harmed_parties: [EntityQueryInput]
  image_url_nin: [String]
  incident_title_gte: String
  incident_title_nin: [String]
  tags_in: [String]
  text_nin: [String]
  date_modified_gt: String
  incident_title_lte: String
  text_lte: String
  editor_notes: String
  date_published_exists: Boolean
  description_gte: String
  status: String
  description_in: [String]
  language_gt: String
  cloudinary_id_exists: Boolean
  authors_exists: Boolean
  cloudinary_id_gt: String
  cloudinary_id_ne: String
  title_lt: String
  incident_title_gt: String
  incident_date: String
  status_lte: String
  description_lt: String
  date_modified_nin: [String]
  tags: [String]
  image_url_in: [String]
  date_downloaded_in: [String]
  language_ne: String
  description_ne: String
  description_nin: [String]
  harmed_parties_in: [EntityQueryInput]
  image_url: String
  tags_exists: Boolean
  harmed_parties_nin: [EntityQueryInput]
  cloudinary_id_gte: String
  text_in: [String]
  date_submitted: String
  epoch_date_modified: Int
  _id_gt: ObjectId
  text_gt: String
  date_downloaded_exists: Boolean
  date_modified: String
  submitters_in: [String]
  date_published_gt: String
  cloudinary_id_lt: String
  incident_date_lte: String
  date_submitted_gt: String
  editor_similar_incidents_nin: [Int]
  incident_date_gte: String
  date_downloaded: String
  date_modified_in: [String]
  epoch_date_modified_ne: Int
  source_domain: String
  language: String
  description: String
  text_exists: Boolean
  date_submitted_nin: [String]
  quiet_exists: Boolean
  date_downloaded_lt: String
  title_in: [String]
  user: UserQueryInput
  cloudinary_id_lte: String
  date_downloaded_nin: [String]
  title_lte: String
  source_domain_nin: [String]
  incident_date_gt: String
  cloudinary_id_in: [String]
  title_ne: String
  title_gte: String
  source_domain_lt: String
  _id_lt: ObjectId
  image_url_lt: String
  language_nin: [String]
  harmed_parties_exists: Boolean
  date_submitted_lte: String
  incident_date_nin: [String]
  description_gt: String
  incident_editors_nin: [UserQueryInput]
  url_gte: String
  image_url_exists: Boolean
  incident_ids_in: [Int]
  developers_in: [EntityQueryInput]
  language_lt: String
  incident_editors_in: [UserQueryInput]
  date_submitted_in: [String]
}

enum History_reportSortByInput {
  _ID_DESC
  CLOUDINARY_ID_DESC
  DATE_PUBLISHED_ASC
  EDITOR_NOTES_DESC
  EPOCH_DATE_DOWNLOADED_DESC
  MODIFIEDBY_DESC
  DATE_PUBLISHED_DESC
  DESCRIPTION_ASC
  IMAGE_URL_ASC
  REPORT_NUMBER_DESC
  EPOCH_DATE_SUBMITTED_ASC
  LANGUAGE_ASC
  PLAIN_TEXT_DESC
  USER_DESC
  DATE_DOWNLOADED_DESC
  DATE_SUBMITTED_DESC
  EPOCH_DATE_MODIFIED_ASC
  MODIFIEDBY_ASC
  URL_ASC
  USER_ASC
  TITLE_ASC
  DATE_DOWNLOADED_ASC
  DATE_MODIFIED_DESC
  EPOCH_DATE_DOWNLOADED_ASC
  EPOCH_DATE_PUBLISHED_ASC
  EPOCH_DATE_SUBMITTED_DESC
  SOURCE_DOMAIN_ASC
  TEXT_DESC
  URL_DESC
  DATE_SUBMITTED_ASC
  EPOCH_DATE_PUBLISHED_DESC
  LANGUAGE_DESC
  TEXT_ASC
  TITLE_DESC
  PLAIN_TEXT_ASC
  _ID_ASC
  CLOUDINARY_ID_ASC
  DATE_MODIFIED_ASC
  DESCRIPTION_DESC
  EDITOR_NOTES_ASC
  EPOCH_DATE_MODIFIED_DESC
  IMAGE_URL_DESC
  REPORT_NUMBER_ASC
  SOURCE_DOMAIN_DESC
}

input SubscriptionIncident_idRelationInput {
  link: Int
  create: IncidentInsertInput
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

input SubscriptionEntityIdRelationInput {
  link: String
  create: EntityInsertInput
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

input TaxaQueryInput {
  namespace_lte: String
  OR: [TaxaQueryInput!]
  weight: Int
  description_ne: String
  _id_gte: ObjectId
  description_lte: String
  namespace_gt: String
  description_lt: String
  weight_gte: Int
  complete_entities_exists: Boolean
  _id_exists: Boolean
  _id_gt: ObjectId
  field_list: [TaxaField_listQueryInput]
  dummy_fields_nin: [TaxaDummy_fieldQueryInput]
  weight_ne: Int
  weight_lt: Int
  _id_in: [ObjectId]
  namespace_exists: Boolean
  description_nin: [String]
  namespace_ne: String
  field_list_nin: [TaxaField_listQueryInput]
  description: String
  _id_nin: [ObjectId]
  complete_entities: Boolean
  _id_lt: ObjectId
  weight_in: [Int]
  weight_lte: Int
  field_list_in: [TaxaField_listQueryInput]
  field_list_exists: Boolean
  namespace_in: [String]
  dummy_fields_in: [TaxaDummy_fieldQueryInput]
  weight_gt: Int
  weight_nin: [Int]
  namespace_nin: [String]
  _id_lte: ObjectId
  description_gte: String
  AND: [TaxaQueryInput!]
  description_exists: Boolean
  namespace_gte: String
  description_gt: String
  dummy_fields: [TaxaDummy_fieldQueryInput]
  namespace: String
  weight_exists: Boolean
  namespace_lt: String
  _id_ne: ObjectId
  description_in: [String]
  complete_entities_ne: Boolean
  _id: ObjectId
  dummy_fields_exists: Boolean
}

input ClassificationAttributeQueryInput {
  short_name_gt: String
  short_name_nin: [String]
  value_json_exists: Boolean
  AND: [ClassificationAttributeQueryInput!]
  OR: [ClassificationAttributeQueryInput!]
  short_name: String
  short_name_ne: String
  value_json_lte: String
  value_json_in: [String]
  value_json_gt: String
  value_json_gte: String
  value_json_lt: String
  value_json_nin: [String]
  short_name_lte: String
  short_name_lt: String
  short_name_gte: String
  value_json: String
  value_json_ne: String
  short_name_exists: Boolean
  short_name_in: [String]
}

input ChecklistRiskUpdateInput {
  precedents_unset: Boolean
  risk_notes: String
  risk_status: String
  touched_unset: Boolean
  likelihood_unset: Boolean
  risk_status_unset: Boolean
  tags_unset: Boolean
  title: String
  id_unset: Boolean
  precedents: [ChecklistRiskPrecedentUpdateInput]
  generated: Boolean
  id: String
  tags: [String]
  touched: Boolean
  likelihood: String
  severity: String
  risk_notes_unset: Boolean
  generated_unset: Boolean
  severity_unset: Boolean
  title_unset: Boolean
}

type Notification {
  _id: ObjectId
  incident_id: Int
  processed: Boolean
  sentDate: DateTime
  type: String
  userId: User
}

type History_incidentEmbedding {
  from_reports: [Int]
  vector: [Float]
}

input TaxaField_listUpdateInput {
  long_name_unset: Boolean
  short_description_unset: Boolean
  short_name_unset: Boolean
  display_type_unset: Boolean
  long_name: String
  long_description: String
  item_fields_unset: Boolean
  permitted_values_unset: Boolean
  hide_search_unset: Boolean
  public_unset: Boolean
  required_unset: Boolean
  instant_facet_unset: Boolean
  placeholder: String
  weight: Int
  mongo_type: String
  permitted_values: [String]
  short_name: String
  complete_from: TaxaField_listComplete_fromUpdateInput
  item_fields: TaxaField_listItem_fieldUpdateInput
  default_unset: Boolean
  display_type: String
  mongo_type_unset: Boolean
  required: Boolean
  weight_unset: Boolean
  complete_from_unset: Boolean
  field_number: String
  public: Boolean
  long_description_unset: Boolean
  placeholder_unset: Boolean
  weight_inc: Int
  default: String
  hide_search: Boolean
  field_number_unset: Boolean
  short_description: String
  instant_facet: Boolean
}

input UpdateOneReportTranslationInput {
  language: String!
  plain_text: String!
  report_number: Int!
  text: String!
  title: String!
}

input ReportEmbeddingInsertInput {
  vector: [Float]
  from_text_hash: String
}

input ReportUserRelationInput {
  create: UserInsertInput
  link: String
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

type Duplicate {
  _id: ObjectId
  duplicate_incident_number: Int
  true_incident_number: Int
}

type TaxaDummy_field {
  field_number: String
  short_name: String
}

input TaxaField_listItem_fieldUpdateInput {
  placeholder_unset: Boolean
  long_name_unset: Boolean
  short_name_unset: Boolean
  instant_facet: Boolean
  long_description: String
  long_description_unset: Boolean
  public: Boolean
  mongo_type: String
  complete_from: TaxaField_listItem_fieldComplete_fromUpdateInput
  required_unset: Boolean
  weight_inc: Int
  complete_from_unset: Boolean
  default_unset: Boolean
  mongo_type_unset: Boolean
  default: String
  field_number: String
  public_unset: Boolean
  display_type: String
  long_name: String
  weight_unset: Boolean
  short_description_unset: Boolean
  short_name: String
  placeholder: String
  field_number_unset: Boolean
  permitted_values: [String]
  display_type_unset: Boolean
  required: Boolean
  weight: Int
  short_description: String
  permitted_values_unset: Boolean
  instant_facet_unset: Boolean
}

input History_incidentInsertInput {
  date: String!
  description: String
  AllegedDeveloperOfAISystem: [String]
  editor_dissimilar_incidents: [Int]
  flagged_dissimilar_incidents: [Int]
  editor_notes: String
  editor_similar_incidents: [Int]
  AllegedDeployerOfAISystem: [String]
  nlp_similar_incidents: [History_incidentNlp_similar_incidentInsertInput]
  modifiedBy: String
  tsne: History_incidentTsneInsertInput
  AllegedHarmedOrNearlyHarmedParties: [String]
  _id: ObjectId
  incident_id: Int!
  reports: [Int]!
  epoch_date_modified: Int
  embedding: History_incidentEmbeddingInsertInput
  editors: [String]!
  title: String!
}

input SubmissionInsertInput {
  date_modified: String!
  nlp_similar_incidents: [SubmissionNlp_similar_incidentInsertInput]
  user: SubmissionUserRelationInput
  language: String!
  submitters: [String]!
  cloudinary_id: String
  date_published: String!
  source_domain: String!
  text: String!
  deployers: SubmissionDeployersRelationInput
  description: String
  _id: ObjectId
  image_url: String!
  incident_ids: [Int]
  harmed_parties: SubmissionHarmed_partiesRelationInput
  quiet: Boolean
  date_submitted: String!
  editor_similar_incidents: [Int]
  incident_date: String
  title: String!
  date_downloaded: String!
  embedding: SubmissionEmbeddingInsertInput
  authors: [String]!
  status: String
  url: String!
  epoch_date_modified: Int
  plain_text: String
  incident_editors: SubmissionIncident_editorsRelationInput
  editor_notes: String
  tags: [String]!
  editor_dissimilar_incidents: [Int]
  developers: SubmissionDevelopersRelationInput
  incident_title: String
}

input SubscriptionUpdateInput {
  entityId: SubscriptionEntityIdRelationInput
  userId_unset: Boolean
  _id: ObjectId
  incident_id: SubscriptionIncident_idRelationInput
  incident_id_unset: Boolean
  entityId_unset: Boolean
  type: String
  type_unset: Boolean
  _id_unset: Boolean
  userId: SubscriptionUserIdRelationInput
}
`;
