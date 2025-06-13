/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  Long: { input: any; output: any; }
  /** Mongo object id scalar type */
  ObjectId: { input: any; output: any; }
};

export type Attribute = {
  __typename?: 'Attribute';
  short_name?: Maybe<Scalars['String']['output']>;
  value_json?: Maybe<Scalars['String']['output']>;
};

export type AttributeInsertType = {
  short_name?: InputMaybe<Scalars['String']['input']>;
  value_json?: InputMaybe<Scalars['String']['input']>;
};

export type AttributeObjectFilterType = {
  opr?: InputMaybe<OprExists>;
  short_name?: InputMaybe<StringFilter>;
  value_json?: InputMaybe<StringFilter>;
};

/** Filter type for Boolean scalar */
export type BooleanFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['Boolean']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['Boolean']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['Boolean']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['Boolean']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['Boolean']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['Boolean']['input']>;
  /** DEPRECATED: use NE */
  NEQ?: InputMaybe<Scalars['Boolean']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  /** $not */
  NOT?: InputMaybe<BooleanNotFilter>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  opr?: InputMaybe<Opr>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  value?: InputMaybe<Scalars['Boolean']['input']>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  values?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
};

/** Filter type for $not of Boolean scalar */
export type BooleanNotFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['Boolean']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['Boolean']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['Boolean']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['Boolean']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['Boolean']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['Boolean']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
};

export type Candidate = {
  __typename?: 'Candidate';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  date_published: Scalars['String']['output'];
  dismissed?: Maybe<Scalars['Boolean']['output']>;
  embedding?: Maybe<CandidateEmbedding>;
  match?: Maybe<Scalars['Boolean']['output']>;
  matching_entities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  matching_harm_keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  matching_keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  plain_text?: Maybe<Scalars['String']['output']>;
  similarity?: Maybe<Scalars['Float']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type CandidateEmbedding = {
  __typename?: 'CandidateEmbedding';
  source?: Maybe<Scalars['String']['output']>;
  vector?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
};

export type CandidateEmbeddingInsertType = {
  source?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type CandidateEmbeddingObjectFilterType = {
  opr?: InputMaybe<OprExists>;
  source?: InputMaybe<StringFilter>;
  vector?: InputMaybe<IntFilter>;
};

export type CandidateEmbeddingSetObjectType = {
  /** If set to true, the object would be overwriten entirely, including fields that are not specified. Non-null validation rules will apply. Once set to true, any child object will overwriten invariably of the value set to this field. */
  _OVERWRITE?: InputMaybe<Scalars['Boolean']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type CandidateEmbeddingSortType = {
  source?: InputMaybe<SortType>;
};

export type CandidateFilterType = {
  AND?: InputMaybe<Array<InputMaybe<CandidateFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<CandidateFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<CandidateFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  date_published?: InputMaybe<StringFilter>;
  dismissed?: InputMaybe<BooleanFilter>;
  embedding?: InputMaybe<CandidateEmbeddingObjectFilterType>;
  match?: InputMaybe<BooleanFilter>;
  matching_entities?: InputMaybe<StringFilter>;
  matching_harm_keywords?: InputMaybe<StringFilter>;
  matching_keywords?: InputMaybe<StringFilter>;
  plain_text?: InputMaybe<StringFilter>;
  similarity?: InputMaybe<FloatFilter>;
  text?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  url?: InputMaybe<StringFilter>;
};

export type CandidateInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  date_published: Scalars['String']['input'];
  dismissed?: InputMaybe<Scalars['Boolean']['input']>;
  embedding?: InputMaybe<CandidateEmbeddingInsertType>;
  match?: InputMaybe<Scalars['Boolean']['input']>;
  matching_entities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_harm_keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type CandidateSetType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  date_published?: InputMaybe<Scalars['String']['input']>;
  dismissed?: InputMaybe<Scalars['Boolean']['input']>;
  embedding?: InputMaybe<CandidateEmbeddingSetObjectType>;
  match?: InputMaybe<Scalars['Boolean']['input']>;
  matching_entities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_harm_keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type CandidateSortType = {
  _id?: InputMaybe<SortType>;
  created_at?: InputMaybe<SortType>;
  date_published?: InputMaybe<SortType>;
  dismissed?: InputMaybe<SortType>;
  embedding?: InputMaybe<CandidateEmbeddingSortType>;
  match?: InputMaybe<SortType>;
  plain_text?: InputMaybe<SortType>;
  similarity?: InputMaybe<SortType>;
  text?: InputMaybe<SortType>;
  title?: InputMaybe<SortType>;
  url?: InputMaybe<SortType>;
};

export type CandidateUpdateType = {
  set?: InputMaybe<CandidateSetType>;
};

export type Checklist = {
  __typename?: 'Checklist';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  about?: Maybe<Scalars['String']['output']>;
  date_created?: Maybe<Scalars['DateTime']['output']>;
  date_updated?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  risks?: Maybe<Array<Maybe<Risks>>>;
  tags_goals?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tags_methods?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tags_other?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ChecklistFilterType = {
  AND?: InputMaybe<Array<InputMaybe<ChecklistFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<ChecklistFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<ChecklistFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  about?: InputMaybe<StringFilter>;
  date_created?: InputMaybe<DateTimeFilter>;
  date_updated?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  owner_id?: InputMaybe<StringFilter>;
  risks?: InputMaybe<RisksObjectFilterType>;
  tags_goals?: InputMaybe<StringFilter>;
  tags_methods?: InputMaybe<StringFilter>;
  tags_other?: InputMaybe<StringFilter>;
};

export type ChecklistInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  about?: InputMaybe<Scalars['String']['input']>;
  date_created?: InputMaybe<Scalars['DateTime']['input']>;
  date_updated?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  risks?: InputMaybe<Array<InputMaybe<RisksInsertType>>>;
  tags_goals?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_methods?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_other?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ChecklistSortType = {
  _id?: InputMaybe<SortType>;
  about?: InputMaybe<SortType>;
  date_created?: InputMaybe<SortType>;
  date_updated?: InputMaybe<SortType>;
  id?: InputMaybe<SortType>;
  name?: InputMaybe<SortType>;
  owner_id?: InputMaybe<SortType>;
};

export type Classification = {
  __typename?: 'Classification';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  attributes?: Maybe<Array<Maybe<Attribute>>>;
  incidents?: Maybe<Array<Maybe<Incident>>>;
  namespace: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  publish?: Maybe<Scalars['Boolean']['output']>;
  reports?: Maybe<Array<Maybe<Report>>>;
};

export type ClassificationFilterType = {
  AND?: InputMaybe<Array<InputMaybe<ClassificationFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<ClassificationFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<ClassificationFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  attributes?: InputMaybe<AttributeObjectFilterType>;
  incidents?: InputMaybe<IntFilter>;
  namespace?: InputMaybe<StringFilter>;
  notes?: InputMaybe<StringFilter>;
  publish?: InputMaybe<BooleanFilter>;
  reports?: InputMaybe<IntFilter>;
};

export type ClassificationIncidentsRelationInput = {
  link: Array<InputMaybe<Scalars['Int']['input']>>;
};

export type ClassificationInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  attributes?: InputMaybe<Array<InputMaybe<AttributeInsertType>>>;
  incidents?: InputMaybe<ClassificationIncidentsRelationInput>;
  namespace: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  publish?: InputMaybe<Scalars['Boolean']['input']>;
  reports?: InputMaybe<ClassificationReportsRelationInput>;
};

export type ClassificationReportsRelationInput = {
  link: Array<InputMaybe<Scalars['Int']['input']>>;
};

export type ClassificationSortType = {
  _id?: InputMaybe<SortType>;
  namespace?: InputMaybe<SortType>;
  notes?: InputMaybe<SortType>;
  publish?: InputMaybe<SortType>;
};

export type CompleteFrom = {
  __typename?: 'CompleteFrom';
  all?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  current?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type CompleteFromObjectFilterType = {
  all?: InputMaybe<StringFilter>;
  current?: InputMaybe<StringFilter>;
  opr?: InputMaybe<OprExists>;
};

/** Input type for creating a variant, including incident ID and variant details. */
export type CreateVariantInput = {
  /** The unique identifier for the incident. */
  incidentId: Scalars['Int']['input'];
  /** Details about the variant. */
  variant?: InputMaybe<CreateVariantInputVariant>;
};

/** Input details for the variant, including publication date, inputs/outputs, submitters, and text. */
export type CreateVariantInputVariant = {
  /** The date when the variant was published. */
  date_published?: InputMaybe<Scalars['String']['input']>;
  /** List of inputs and outputs related to the variant. */
  inputs_outputs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** List of submitters associated with the variant. */
  submitters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** The textual content of the variant. */
  text?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVariantPayload = {
  __typename?: 'CreateVariantPayload';
  /** The unique identifier for the incident. */
  incident_id: Scalars['Int']['output'];
  /** The unique report number associated with the incident. */
  report_number: Scalars['Int']['output'];
};

/** Filter type for DateTime scalar */
export type DateTimeFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['DateTime']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['DateTime']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['DateTime']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['DateTime']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['DateTime']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['DateTime']['input']>;
  /** DEPRECATED: use NE */
  NEQ?: InputMaybe<Scalars['DateTime']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  /** $not */
  NOT?: InputMaybe<DateTimeNotFilter>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  opr?: InputMaybe<Opr>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  value?: InputMaybe<Scalars['DateTime']['input']>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  values?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
};

/** Filter type for $not of DateTime scalar */
export type DateTimeNotFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['DateTime']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['DateTime']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['DateTime']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['DateTime']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['DateTime']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['DateTime']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
};

export type DeleteManyPayload = {
  __typename?: 'DeleteManyPayload';
  deletedCount: Scalars['Int']['output'];
};

export type DummyFields = {
  __typename?: 'DummyFields';
  field_number?: Maybe<Scalars['String']['output']>;
  short_name?: Maybe<Scalars['String']['output']>;
};

export type DummyFieldsObjectFilterType = {
  field_number?: InputMaybe<StringFilter>;
  opr?: InputMaybe<OprExists>;
  short_name?: InputMaybe<StringFilter>;
};

export type Duplicate = {
  __typename?: 'Duplicate';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  duplicate_incident_number?: Maybe<Scalars['Int']['output']>;
  true_incident_number?: Maybe<Scalars['Int']['output']>;
};

export type DuplicateFilterType = {
  AND?: InputMaybe<Array<InputMaybe<DuplicateFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<DuplicateFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<DuplicateFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  duplicate_incident_number?: InputMaybe<IntFilter>;
  true_incident_number?: InputMaybe<IntFilter>;
};

export type DuplicateInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  duplicate_incident_number?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number?: InputMaybe<Scalars['Int']['input']>;
};

export type DuplicateSetType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  duplicate_incident_number?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number?: InputMaybe<Scalars['Int']['input']>;
};

export type DuplicateSortType = {
  _id?: InputMaybe<SortType>;
  duplicate_incident_number?: InputMaybe<SortType>;
  true_incident_number?: InputMaybe<SortType>;
};

export type DuplicateUpdateType = {
  set?: InputMaybe<DuplicateSetType>;
};

export type Embedding = {
  __typename?: 'Embedding';
  from_text_hash?: Maybe<Scalars['String']['output']>;
  vector?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type EmbeddingInsertType = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type EmbeddingObjectFilterType = {
  from_text_hash?: InputMaybe<StringFilter>;
  opr?: InputMaybe<OprExists>;
  vector?: InputMaybe<FloatFilter>;
};

export type EmbeddingSetObjectType = {
  /** If set to true, the object would be overwriten entirely, including fields that are not specified. Non-null validation rules will apply. Once set to true, any child object will overwriten invariably of the value set to this field. */
  _OVERWRITE?: InputMaybe<Scalars['Boolean']['input']>;
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type EmbeddingSortType = {
  from_text_hash?: InputMaybe<SortType>;
};

export type Entity = {
  __typename?: 'Entity';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  date_modified?: Maybe<Scalars['DateTime']['output']>;
  entity_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type EntityDuplicate = {
  __typename?: 'EntityDuplicate';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  duplicate_entity_id: Scalars['String']['output'];
  true_entity_id: Scalars['String']['output'];
};

export type EntityDuplicateFilterType = {
  AND?: InputMaybe<Array<InputMaybe<EntityDuplicateFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<EntityDuplicateFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<EntityDuplicateFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  duplicate_entity_id?: InputMaybe<StringFilter>;
  true_entity_id?: InputMaybe<StringFilter>;
};

export type EntityDuplicateSortType = {
  _id?: InputMaybe<SortType>;
  duplicate_entity_id?: InputMaybe<SortType>;
  true_entity_id?: InputMaybe<SortType>;
};

export type EntityFilterType = {
  AND?: InputMaybe<Array<InputMaybe<EntityFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<EntityFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<EntityFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  date_modified?: InputMaybe<DateTimeFilter>;
  entity_id?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
};

export type EntityInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  entity_id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type EntitySetType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type EntitySortType = {
  _id?: InputMaybe<SortType>;
  created_at?: InputMaybe<SortType>;
  date_modified?: InputMaybe<SortType>;
  entity_id?: InputMaybe<SortType>;
  name?: InputMaybe<SortType>;
};

export type EntityUpdateType = {
  set?: InputMaybe<EntitySetType>;
};

export type Entity_Relationship = {
  __typename?: 'Entity_relationship';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  is_symmetric?: Maybe<Scalars['Boolean']['output']>;
  obj?: Maybe<Entity>;
  pred?: Maybe<Scalars['String']['output']>;
  sub?: Maybe<Entity>;
};

export type Entity_RelationshipFilterType = {
  AND?: InputMaybe<Array<InputMaybe<Entity_RelationshipFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<Entity_RelationshipFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<Entity_RelationshipFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  is_symmetric?: InputMaybe<BooleanFilter>;
  obj?: InputMaybe<StringFilter>;
  pred?: InputMaybe<StringFilter>;
  sub?: InputMaybe<StringFilter>;
};

export type Entity_RelationshipInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  is_symmetric?: InputMaybe<Scalars['Boolean']['input']>;
  obj?: InputMaybe<Entity_RelationshipObjRelationInput>;
  pred?: InputMaybe<Scalars['String']['input']>;
  sub?: InputMaybe<Entity_RelationshipSubRelationInput>;
};

export type Entity_RelationshipObjRelationInput = {
  link?: InputMaybe<Scalars['String']['input']>;
};

export type Entity_RelationshipSetType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  is_symmetric?: InputMaybe<Scalars['Boolean']['input']>;
  obj?: InputMaybe<Entity_RelationshipObjRelationInput>;
  pred?: InputMaybe<Scalars['String']['input']>;
  sub?: InputMaybe<Entity_RelationshipSubRelationInput>;
};

export type Entity_RelationshipSortType = {
  _id?: InputMaybe<SortType>;
  created_at?: InputMaybe<SortType>;
  is_symmetric?: InputMaybe<SortType>;
  pred?: InputMaybe<SortType>;
};

export type Entity_RelationshipSubRelationInput = {
  link?: InputMaybe<Scalars['String']['input']>;
};

export type Entity_RelationshipUpdateType = {
  set?: InputMaybe<Entity_RelationshipSetType>;
};

export type FieldList = {
  __typename?: 'FieldList';
  complete_from?: Maybe<CompleteFrom>;
  default?: Maybe<Scalars['String']['output']>;
  display_type?: Maybe<Scalars['String']['output']>;
  field_number?: Maybe<Scalars['String']['output']>;
  hide_search?: Maybe<Scalars['Boolean']['output']>;
  instant_facet?: Maybe<Scalars['Boolean']['output']>;
  item_fields?: Maybe<ItemFields>;
  long_description?: Maybe<Scalars['String']['output']>;
  long_name?: Maybe<Scalars['String']['output']>;
  mongo_type?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  permitted_values?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  placeholder?: Maybe<Scalars['String']['output']>;
  public?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  short_description?: Maybe<Scalars['String']['output']>;
  short_name?: Maybe<Scalars['String']['output']>;
  subfields?: Maybe<Array<Maybe<Subfield>>>;
  weight?: Maybe<Scalars['Int']['output']>;
};

export type FieldListObjectFilterType = {
  complete_from?: InputMaybe<CompleteFromObjectFilterType>;
  default?: InputMaybe<StringFilter>;
  display_type?: InputMaybe<StringFilter>;
  field_number?: InputMaybe<StringFilter>;
  hide_search?: InputMaybe<BooleanFilter>;
  instant_facet?: InputMaybe<BooleanFilter>;
  item_fields?: InputMaybe<ItemFieldsObjectFilterType>;
  long_description?: InputMaybe<StringFilter>;
  long_name?: InputMaybe<StringFilter>;
  mongo_type?: InputMaybe<StringFilter>;
  notes?: InputMaybe<StringFilter>;
  opr?: InputMaybe<OprExists>;
  permitted_values?: InputMaybe<StringFilter>;
  placeholder?: InputMaybe<StringFilter>;
  public?: InputMaybe<BooleanFilter>;
  required?: InputMaybe<BooleanFilter>;
  short_description?: InputMaybe<StringFilter>;
  short_name?: InputMaybe<StringFilter>;
  subfields?: InputMaybe<SubfieldObjectFilterType>;
  weight?: InputMaybe<IntFilter>;
};

/** Filter type for Float scalar */
export type FloatFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['Float']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['Float']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['Float']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['Float']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['Float']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['Float']['input']>;
  /** DEPRECATED: use NE */
  NEQ?: InputMaybe<Scalars['Float']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  /** $not */
  NOT?: InputMaybe<FloatNotFilter>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  opr?: InputMaybe<Opr>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  value?: InputMaybe<Scalars['Float']['input']>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  values?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

/** Filter type for $not of Float scalar */
export type FloatNotFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['Float']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['Float']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['Float']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['Float']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['Float']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['Float']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type History_Incident = {
  __typename?: 'History_incident';
  AllegedDeployerOfAISystem?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  AllegedDeveloperOfAISystem?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  AllegedHarmedOrNearlyHarmedParties?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  date: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  editor_dissimilar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editor_notes?: Maybe<Scalars['String']['output']>;
  editor_similar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editors: Array<Maybe<Scalars['String']['output']>>;
  embedding?: Maybe<IncidentEmbedding>;
  epoch_date_modified?: Maybe<Scalars['Int']['output']>;
  flagged_dissimilar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  implicated_systems?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  incident_id: Scalars['Int']['output'];
  modifiedBy?: Maybe<Scalars['String']['output']>;
  nlp_similar_incidents?: Maybe<Array<Maybe<IncidentNlp_Similar_Incident>>>;
  reports: Array<Maybe<Scalars['Int']['output']>>;
  title: Scalars['String']['output'];
  tsne?: Maybe<IncidentTsne>;
};

export type History_IncidentFilterType = {
  AND?: InputMaybe<Array<InputMaybe<History_IncidentFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<History_IncidentFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<History_IncidentFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  date?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  editor_dissimilar_incidents?: InputMaybe<IntFilter>;
  editor_notes?: InputMaybe<StringFilter>;
  editor_similar_incidents?: InputMaybe<IntFilter>;
  editors?: InputMaybe<StringFilter>;
  embedding?: InputMaybe<IncidentEmbeddingObjectFilterType>;
  epoch_date_modified?: InputMaybe<IntFilter>;
  flagged_dissimilar_incidents?: InputMaybe<IntFilter>;
  implicated_systems?: InputMaybe<StringFilter>;
  incident_id?: InputMaybe<IntFilter>;
  modifiedBy?: InputMaybe<StringFilter>;
  nlp_similar_incidents?: InputMaybe<IncidentNlp_Similar_IncidentObjectFilterType>;
  reports?: InputMaybe<IntFilter>;
  title?: InputMaybe<StringFilter>;
  tsne?: InputMaybe<IncidentTsneObjectFilterType>;
};

export type History_IncidentSortType = {
  _id?: InputMaybe<SortType>;
  created_at?: InputMaybe<SortType>;
  date?: InputMaybe<SortType>;
  description?: InputMaybe<SortType>;
  editor_notes?: InputMaybe<SortType>;
  embedding?: InputMaybe<IncidentEmbeddingSortType>;
  epoch_date_modified?: InputMaybe<SortType>;
  incident_id?: InputMaybe<SortType>;
  modifiedBy?: InputMaybe<SortType>;
  title?: InputMaybe<SortType>;
  tsne?: InputMaybe<IncidentTsneSortType>;
};

export type History_Report = {
  __typename?: 'History_report';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  authors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  cloudinary_id?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  date_downloaded: Scalars['DateTime']['output'];
  date_modified: Scalars['DateTime']['output'];
  date_published: Scalars['DateTime']['output'];
  date_submitted: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  editor_notes?: Maybe<Scalars['String']['output']>;
  embedding?: Maybe<ReportEmbedding>;
  epoch_date_downloaded?: Maybe<Scalars['Int']['output']>;
  epoch_date_modified?: Maybe<Scalars['Int']['output']>;
  epoch_date_published?: Maybe<Scalars['Int']['output']>;
  epoch_date_submitted?: Maybe<Scalars['Int']['output']>;
  flag?: Maybe<Scalars['Boolean']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  inputs_outputs?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  is_incident_report?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  modifiedBy?: Maybe<Scalars['String']['output']>;
  plain_text?: Maybe<Scalars['String']['output']>;
  quiet?: Maybe<Scalars['Boolean']['output']>;
  report_number?: Maybe<Scalars['Int']['output']>;
  source_domain?: Maybe<Scalars['String']['output']>;
  submitters?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Scalars['String']['output']>;
};

export type History_ReportFilterType = {
  AND?: InputMaybe<Array<InputMaybe<History_ReportFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<History_ReportFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<History_ReportFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  authors?: InputMaybe<StringFilter>;
  cloudinary_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  date_downloaded?: InputMaybe<DateTimeFilter>;
  date_modified?: InputMaybe<DateTimeFilter>;
  date_published?: InputMaybe<DateTimeFilter>;
  date_submitted?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  editor_notes?: InputMaybe<StringFilter>;
  embedding?: InputMaybe<ReportEmbeddingObjectFilterType>;
  epoch_date_downloaded?: InputMaybe<IntFilter>;
  epoch_date_modified?: InputMaybe<IntFilter>;
  epoch_date_published?: InputMaybe<IntFilter>;
  epoch_date_submitted?: InputMaybe<IntFilter>;
  flag?: InputMaybe<BooleanFilter>;
  image_url?: InputMaybe<StringFilter>;
  inputs_outputs?: InputMaybe<StringFilter>;
  is_incident_report?: InputMaybe<BooleanFilter>;
  language?: InputMaybe<StringFilter>;
  modifiedBy?: InputMaybe<StringFilter>;
  plain_text?: InputMaybe<StringFilter>;
  quiet?: InputMaybe<BooleanFilter>;
  report_number?: InputMaybe<IntFilter>;
  source_domain?: InputMaybe<StringFilter>;
  submitters?: InputMaybe<StringFilter>;
  tags?: InputMaybe<StringFilter>;
  text?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  url?: InputMaybe<StringFilter>;
  user?: InputMaybe<StringFilter>;
};

export type History_ReportSortType = {
  _id?: InputMaybe<SortType>;
  cloudinary_id?: InputMaybe<SortType>;
  created_at?: InputMaybe<SortType>;
  date_downloaded?: InputMaybe<SortType>;
  date_modified?: InputMaybe<SortType>;
  date_published?: InputMaybe<SortType>;
  date_submitted?: InputMaybe<SortType>;
  description?: InputMaybe<SortType>;
  editor_notes?: InputMaybe<SortType>;
  embedding?: InputMaybe<ReportEmbeddingSortType>;
  epoch_date_downloaded?: InputMaybe<SortType>;
  epoch_date_modified?: InputMaybe<SortType>;
  epoch_date_published?: InputMaybe<SortType>;
  epoch_date_submitted?: InputMaybe<SortType>;
  flag?: InputMaybe<SortType>;
  image_url?: InputMaybe<SortType>;
  is_incident_report?: InputMaybe<SortType>;
  language?: InputMaybe<SortType>;
  modifiedBy?: InputMaybe<SortType>;
  plain_text?: InputMaybe<SortType>;
  quiet?: InputMaybe<SortType>;
  report_number?: InputMaybe<SortType>;
  source_domain?: InputMaybe<SortType>;
  text?: InputMaybe<SortType>;
  title?: InputMaybe<SortType>;
  url?: InputMaybe<SortType>;
  user?: InputMaybe<SortType>;
};

export type Incident = {
  __typename?: 'Incident';
  AllegedDeployerOfAISystem?: Maybe<Array<Maybe<Entity>>>;
  AllegedDeveloperOfAISystem?: Maybe<Array<Maybe<Entity>>>;
  AllegedHarmedOrNearlyHarmedParties?: Maybe<Array<Maybe<Entity>>>;
  _id?: Maybe<Scalars['ObjectId']['output']>;
  classifications?: Maybe<Array<Maybe<Classification>>>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  date: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  editor_dissimilar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editor_notes: Scalars['String']['output'];
  editor_similar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editors?: Maybe<Array<Maybe<User>>>;
  embedding?: Maybe<IncidentEmbedding>;
  epoch_date_modified?: Maybe<Scalars['Int']['output']>;
  flagged_dissimilar_incidents: Array<Maybe<Scalars['Int']['output']>>;
  implicated_systems?: Maybe<Array<Maybe<Entity>>>;
  incident_id: Scalars['Int']['output'];
  nlp_similar_incidents?: Maybe<Array<Maybe<IncidentNlp_Similar_Incident>>>;
  reports?: Maybe<Array<Maybe<Report>>>;
  title: Scalars['String']['output'];
  translations?: Maybe<Array<Maybe<IncidentTranslations>>>;
  tsne?: Maybe<IncidentTsne>;
};


export type IncidentTranslationsArgs = {
  languages: Array<InputMaybe<Scalars['String']['input']>>;
};

export type IncidentAllegeddeployerofaisystemRelationInput = {
  link: Array<InputMaybe<Scalars['String']['input']>>;
};

export type IncidentAllegeddeveloperofaisystemRelationInput = {
  link: Array<InputMaybe<Scalars['String']['input']>>;
};

export type IncidentAllegedharmedornearlyharmedpartiesRelationInput = {
  link: Array<InputMaybe<Scalars['String']['input']>>;
};

export type IncidentEditorsRelationInput = {
  link: Array<InputMaybe<Scalars['String']['input']>>;
};

export type IncidentEmbedding = {
  __typename?: 'IncidentEmbedding';
  from_reports?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  vector?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type IncidentEmbeddingInsertType = {
  from_reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type IncidentEmbeddingObjectFilterType = {
  from_reports?: InputMaybe<IntFilter>;
  opr?: InputMaybe<OprExists>;
  vector?: InputMaybe<FloatFilter>;
};

export type IncidentEmbeddingSetObjectType = {
  /** If set to true, the object would be overwriten entirely, including fields that are not specified. Non-null validation rules will apply. Once set to true, any child object will overwriten invariably of the value set to this field. */
  _OVERWRITE?: InputMaybe<Scalars['Boolean']['input']>;
  from_reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type IncidentEmbeddingSortType = {
  /** IGNORE. Due to limitations of the package, objects with no sortable fields are not ommited. GraphQL input object types must have at least one field */
  _FICTIVE_SORT?: InputMaybe<SortType>;
};

export type IncidentFilterType = {
  AND?: InputMaybe<Array<InputMaybe<IncidentFilterType>>>;
  AllegedDeployerOfAISystem?: InputMaybe<StringFilter>;
  AllegedDeveloperOfAISystem?: InputMaybe<StringFilter>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<StringFilter>;
  NOR?: InputMaybe<Array<InputMaybe<IncidentFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<IncidentFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  date?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  editor_dissimilar_incidents?: InputMaybe<IntFilter>;
  editor_notes?: InputMaybe<StringFilter>;
  editor_similar_incidents?: InputMaybe<IntFilter>;
  editors?: InputMaybe<StringFilter>;
  embedding?: InputMaybe<IncidentEmbeddingObjectFilterType>;
  epoch_date_modified?: InputMaybe<IntFilter>;
  flagged_dissimilar_incidents?: InputMaybe<IntFilter>;
  implicated_systems?: InputMaybe<StringFilter>;
  incident_id?: InputMaybe<IntFilter>;
  nlp_similar_incidents?: InputMaybe<IncidentNlp_Similar_IncidentObjectFilterType>;
  reports?: InputMaybe<IntFilter>;
  title?: InputMaybe<StringFilter>;
  tsne?: InputMaybe<IncidentTsneObjectFilterType>;
};

export type IncidentImplicated_SystemsRelationInput = {
  link: Array<InputMaybe<Scalars['String']['input']>>;
};

export type IncidentInsertType = {
  AllegedDeployerOfAISystem?: InputMaybe<IncidentAllegeddeployerofaisystemRelationInput>;
  AllegedDeveloperOfAISystem?: InputMaybe<IncidentAllegeddeveloperofaisystemRelationInput>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<IncidentAllegedharmedornearlyharmedpartiesRelationInput>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  date: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes: Scalars['String']['input'];
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editors?: InputMaybe<IncidentEditorsRelationInput>;
  embedding?: InputMaybe<IncidentEmbeddingInsertType>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  flagged_dissimilar_incidents: Array<InputMaybe<Scalars['Int']['input']>>;
  implicated_systems?: InputMaybe<IncidentImplicated_SystemsRelationInput>;
  incident_id: Scalars['Int']['input'];
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<IncidentNlp_Similar_IncidentInsertType>>>;
  reports?: InputMaybe<IncidentReportsRelationInput>;
  title: Scalars['String']['input'];
  tsne?: InputMaybe<IncidentTsneInsertType>;
};

export type IncidentNlp_Similar_Incident = {
  __typename?: 'IncidentNlp_similar_incident';
  incident_id?: Maybe<Scalars['Int']['output']>;
  similarity?: Maybe<Scalars['Float']['output']>;
};

export type IncidentNlp_Similar_IncidentInsertType = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
};

export type IncidentNlp_Similar_IncidentObjectFilterType = {
  incident_id?: InputMaybe<IntFilter>;
  opr?: InputMaybe<OprExists>;
  similarity?: InputMaybe<FloatFilter>;
};

export type IncidentNlp_Similar_IncidentSetListObjectType = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
};

export type IncidentReportsRelationInput = {
  link: Array<InputMaybe<Scalars['Int']['input']>>;
};

export type IncidentSetType = {
  AllegedDeployerOfAISystem?: InputMaybe<IncidentAllegeddeployerofaisystemRelationInput>;
  AllegedDeveloperOfAISystem?: InputMaybe<IncidentAllegeddeveloperofaisystemRelationInput>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<IncidentAllegedharmedornearlyharmedpartiesRelationInput>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editors?: InputMaybe<IncidentEditorsRelationInput>;
  embedding?: InputMaybe<IncidentEmbeddingSetObjectType>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  flagged_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  implicated_systems?: InputMaybe<IncidentImplicated_SystemsRelationInput>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<IncidentNlp_Similar_IncidentSetListObjectType>>>;
  reports?: InputMaybe<IncidentReportsRelationInput>;
  title?: InputMaybe<Scalars['String']['input']>;
  tsne?: InputMaybe<IncidentTsneSetObjectType>;
};

export type IncidentSortType = {
  _id?: InputMaybe<SortType>;
  created_at?: InputMaybe<SortType>;
  date?: InputMaybe<SortType>;
  description?: InputMaybe<SortType>;
  editor_notes?: InputMaybe<SortType>;
  embedding?: InputMaybe<IncidentEmbeddingSortType>;
  epoch_date_modified?: InputMaybe<SortType>;
  incident_id?: InputMaybe<SortType>;
  title?: InputMaybe<SortType>;
  tsne?: InputMaybe<IncidentTsneSortType>;
};

export type IncidentTranslations = {
  __typename?: 'IncidentTranslations';
  description?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type IncidentTsne = {
  __typename?: 'IncidentTsne';
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
};

export type IncidentTsneInsertType = {
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
};

export type IncidentTsneObjectFilterType = {
  opr?: InputMaybe<OprExists>;
  x?: InputMaybe<FloatFilter>;
  y?: InputMaybe<FloatFilter>;
};

export type IncidentTsneSetObjectType = {
  /** If set to true, the object would be overwriten entirely, including fields that are not specified. Non-null validation rules will apply. Once set to true, any child object will overwriten invariably of the value set to this field. */
  _OVERWRITE?: InputMaybe<Scalars['Boolean']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
};

export type IncidentTsneSortType = {
  x?: InputMaybe<SortType>;
  y?: InputMaybe<SortType>;
};

export type IncidentUpdateType = {
  set?: InputMaybe<IncidentSetType>;
};

export type InsertManyPayload = {
  __typename?: 'InsertManyPayload';
  insertedIds: Array<Maybe<Scalars['ObjectId']['output']>>;
};

/** Filter type for Int scalar */
export type IntFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['Int']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['Int']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['Int']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['Int']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['Int']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['Int']['input']>;
  /** DEPRECATED: use NE */
  NEQ?: InputMaybe<Scalars['Int']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** $not */
  NOT?: InputMaybe<IntNotFilter>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  opr?: InputMaybe<Opr>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  value?: InputMaybe<Scalars['Int']['input']>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  values?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

/** Filter type for $not of Int scalar */
export type IntNotFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['Int']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['Int']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['Int']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['Int']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['Int']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['Int']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type ItemFields = {
  __typename?: 'ItemFields';
  complete_from?: Maybe<CompleteFrom>;
  default?: Maybe<Scalars['String']['output']>;
  display_type?: Maybe<Scalars['String']['output']>;
  field_number?: Maybe<Scalars['String']['output']>;
  instant_facet?: Maybe<Scalars['Boolean']['output']>;
  long_description?: Maybe<Scalars['String']['output']>;
  long_name?: Maybe<Scalars['String']['output']>;
  mongo_type?: Maybe<Scalars['String']['output']>;
  permitted_values?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  placeholder?: Maybe<Scalars['String']['output']>;
  public?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  short_description?: Maybe<Scalars['String']['output']>;
  short_name?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Int']['output']>;
};

export type ItemFieldsObjectFilterType = {
  complete_from?: InputMaybe<CompleteFromObjectFilterType>;
  default?: InputMaybe<StringFilter>;
  display_type?: InputMaybe<StringFilter>;
  field_number?: InputMaybe<StringFilter>;
  instant_facet?: InputMaybe<BooleanFilter>;
  long_description?: InputMaybe<StringFilter>;
  long_name?: InputMaybe<StringFilter>;
  mongo_type?: InputMaybe<StringFilter>;
  opr?: InputMaybe<OprExists>;
  permitted_values?: InputMaybe<StringFilter>;
  placeholder?: InputMaybe<StringFilter>;
  public?: InputMaybe<BooleanFilter>;
  required?: InputMaybe<BooleanFilter>;
  short_description?: InputMaybe<StringFilter>;
  short_name?: InputMaybe<StringFilter>;
  weight?: InputMaybe<IntFilter>;
};

export type LinkReportsToIncidentsInput = {
  incident_ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  report_numbers?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Filter type for Long scalar */
export type LongFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['Long']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['Long']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['Long']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['Long']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['Long']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['Long']['input']>;
  /** DEPRECATED: use NE */
  NEQ?: InputMaybe<Scalars['Long']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  /** $not */
  NOT?: InputMaybe<LongNotFilter>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  opr?: InputMaybe<Opr>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  value?: InputMaybe<Scalars['Long']['input']>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  values?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
};

/** Filter type for $not of Long scalar */
export type LongNotFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['Long']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['Long']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['Long']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['Long']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['Long']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['Long']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createVariant?: Maybe<CreateVariantPayload>;
  deleteManyCandidates?: Maybe<DeleteManyPayload>;
  deleteManyDuplicates?: Maybe<DeleteManyPayload>;
  deleteManyQuickadds?: Maybe<DeleteManyPayload>;
  deleteManySubscriptions?: Maybe<DeleteManyPayload>;
  deleteOneCandidate?: Maybe<Candidate>;
  deleteOneChecklist?: Maybe<Checklist>;
  deleteOneDuplicate?: Maybe<Duplicate>;
  deleteOneEntity_relationship?: Maybe<Entity_Relationship>;
  deleteOneQuickadd?: Maybe<Quickadd>;
  deleteOneReport?: Maybe<Report>;
  deleteOneSubmission?: Maybe<Submission>;
  deleteOneSubscription?: Maybe<Subscription>;
  flagIncidentSimilarity?: Maybe<Incident>;
  flagReport?: Maybe<Report>;
  insertManyCandidates?: Maybe<InsertManyPayload>;
  insertManyDuplicates?: Maybe<InsertManyPayload>;
  insertManyQuickadds?: Maybe<InsertManyPayload>;
  insertOneCandidate?: Maybe<Candidate>;
  insertOneChecklist?: Maybe<Checklist>;
  insertOneDuplicate?: Maybe<Duplicate>;
  insertOneIncident?: Maybe<Incident>;
  insertOneQuickadd?: Maybe<Quickadd>;
  insertOneReport?: Maybe<Report>;
  insertOneSubmission?: Maybe<Submission>;
  linkReportsToIncidents?: Maybe<Array<Maybe<Incident>>>;
  mergeEntities: Entity;
  promoteSubmissionToReport: PromoteSubmissionToReportPayload;
  updateEntityAndRelationships: UpdateOneEntityPayload;
  updateManyCandidates?: Maybe<UpdateManyPayload>;
  updateManyDuplicates?: Maybe<UpdateManyPayload>;
  updateManyIncidents?: Maybe<UpdateManyPayload>;
  updateManyQuickadds?: Maybe<UpdateManyPayload>;
  updateOneCandidate?: Maybe<Candidate>;
  updateOneDuplicate?: Maybe<Duplicate>;
  updateOneEntity?: Maybe<Entity>;
  updateOneEntity_relationship?: Maybe<Entity_Relationship>;
  updateOneIncident?: Maybe<Incident>;
  updateOneIncidentTranslation?: Maybe<Incident>;
  updateOneQuickadd?: Maybe<Quickadd>;
  updateOneReport?: Maybe<Report>;
  updateOneReportTranslation?: Maybe<Report>;
  updateOneSubmission?: Maybe<Submission>;
  updateOneSubscription?: Maybe<Subscription>;
  updateOneUser?: Maybe<User>;
  upsertOneCandidate?: Maybe<Candidate>;
  upsertOneChecklist?: Maybe<Checklist>;
  upsertOneClassification?: Maybe<Classification>;
  upsertOneDuplicate?: Maybe<Duplicate>;
  upsertOneEntity?: Maybe<Entity>;
  upsertOneEntity_relationship?: Maybe<Entity_Relationship>;
  upsertOneQuickadd?: Maybe<Quickadd>;
  upsertOneSubscription?: Maybe<Subscription>;
};


export type MutationCreateVariantArgs = {
  input: CreateVariantInput;
};


export type MutationDeleteManyCandidatesArgs = {
  filter?: InputMaybe<CandidateFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<CandidateSortType>;
};


export type MutationDeleteManyDuplicatesArgs = {
  filter?: InputMaybe<DuplicateFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<DuplicateSortType>;
};


export type MutationDeleteManyQuickaddsArgs = {
  filter?: InputMaybe<QuickaddFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<QuickaddSortType>;
};


export type MutationDeleteManySubscriptionsArgs = {
  filter?: InputMaybe<SubscriptionFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<SubscriptionSortType>;
};


export type MutationDeleteOneCandidateArgs = {
  filter?: InputMaybe<CandidateFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<CandidateSortType>;
};


export type MutationDeleteOneChecklistArgs = {
  filter?: InputMaybe<ChecklistFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<ChecklistSortType>;
};


export type MutationDeleteOneDuplicateArgs = {
  filter?: InputMaybe<DuplicateFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<DuplicateSortType>;
};


export type MutationDeleteOneEntity_RelationshipArgs = {
  filter?: InputMaybe<Entity_RelationshipFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<Entity_RelationshipSortType>;
};


export type MutationDeleteOneQuickaddArgs = {
  filter?: InputMaybe<QuickaddFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<QuickaddSortType>;
};


export type MutationDeleteOneReportArgs = {
  filter?: InputMaybe<ReportFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<ReportSortType>;
};


export type MutationDeleteOneSubmissionArgs = {
  filter?: InputMaybe<SubmissionFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<SubmissionSortType>;
};


export type MutationDeleteOneSubscriptionArgs = {
  filter?: InputMaybe<SubscriptionFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<SubscriptionSortType>;
};


export type MutationFlagIncidentSimilarityArgs = {
  dissimilarIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  incidentId: Scalars['Int']['input'];
};


export type MutationFlagReportArgs = {
  input: Scalars['Boolean']['input'];
  report_number: Scalars['Int']['input'];
};


export type MutationInsertManyCandidatesArgs = {
  data: Array<InputMaybe<CandidateInsertType>>;
};


export type MutationInsertManyDuplicatesArgs = {
  data: Array<InputMaybe<DuplicateInsertType>>;
};


export type MutationInsertManyQuickaddsArgs = {
  data: Array<InputMaybe<QuickaddInsertType>>;
};


export type MutationInsertOneCandidateArgs = {
  data: CandidateInsertType;
};


export type MutationInsertOneChecklistArgs = {
  data: ChecklistInsertType;
};


export type MutationInsertOneDuplicateArgs = {
  data: DuplicateInsertType;
};


export type MutationInsertOneIncidentArgs = {
  data: IncidentInsertType;
};


export type MutationInsertOneQuickaddArgs = {
  data: QuickaddInsertType;
};


export type MutationInsertOneReportArgs = {
  data: ReportInsertType;
};


export type MutationInsertOneSubmissionArgs = {
  data: SubmissionInsertType;
};


export type MutationLinkReportsToIncidentsArgs = {
  input: LinkReportsToIncidentsInput;
};


export type MutationMergeEntitiesArgs = {
  keepEntity: Scalars['Int']['input'];
  primaryId: Scalars['String']['input'];
  secondaryId: Scalars['String']['input'];
};


export type MutationPromoteSubmissionToReportArgs = {
  input: PromoteSubmissionToReportInput;
};


export type MutationUpdateEntityAndRelationshipsArgs = {
  input: UpdateOneEntityInput;
};


export type MutationUpdateManyCandidatesArgs = {
  filter: CandidateFilterType;
  update: CandidateUpdateType;
};


export type MutationUpdateManyDuplicatesArgs = {
  filter: DuplicateFilterType;
  update: DuplicateUpdateType;
};


export type MutationUpdateManyIncidentsArgs = {
  filter: IncidentFilterType;
  update: IncidentUpdateType;
};


export type MutationUpdateManyQuickaddsArgs = {
  filter: QuickaddFilterType;
  update: QuickaddUpdateType;
};


export type MutationUpdateOneCandidateArgs = {
  filter: CandidateFilterType;
  update: CandidateUpdateType;
};


export type MutationUpdateOneDuplicateArgs = {
  filter: DuplicateFilterType;
  update: DuplicateUpdateType;
};


export type MutationUpdateOneEntityArgs = {
  filter: EntityFilterType;
  update: EntityUpdateType;
};


export type MutationUpdateOneEntity_RelationshipArgs = {
  filter: Entity_RelationshipFilterType;
  update: Entity_RelationshipUpdateType;
};


export type MutationUpdateOneIncidentArgs = {
  filter: IncidentFilterType;
  update: IncidentUpdateType;
};


export type MutationUpdateOneIncidentTranslationArgs = {
  input: UpdateOneIncidentTranslationInput;
};


export type MutationUpdateOneQuickaddArgs = {
  filter: QuickaddFilterType;
  update: QuickaddUpdateType;
};


export type MutationUpdateOneReportArgs = {
  filter: ReportFilterType;
  update: ReportUpdateType;
};


export type MutationUpdateOneReportTranslationArgs = {
  input: UpdateOneReportTranslationInput;
};


export type MutationUpdateOneSubmissionArgs = {
  filter: SubmissionFilterType;
  update: SubmissionUpdateType;
};


export type MutationUpdateOneSubscriptionArgs = {
  filter: SubscriptionFilterType;
  update: SubscriptionUpdateType;
};


export type MutationUpdateOneUserArgs = {
  filter: UserFilterType;
  update: UserUpdateType;
};


export type MutationUpsertOneCandidateArgs = {
  filter: CandidateFilterType;
  update: CandidateInsertType;
};


export type MutationUpsertOneChecklistArgs = {
  filter: ChecklistFilterType;
  update: ChecklistInsertType;
};


export type MutationUpsertOneClassificationArgs = {
  filter: ClassificationFilterType;
  update: ClassificationInsertType;
};


export type MutationUpsertOneDuplicateArgs = {
  filter: DuplicateFilterType;
  update: DuplicateInsertType;
};


export type MutationUpsertOneEntityArgs = {
  filter: EntityFilterType;
  update: EntityInsertType;
};


export type MutationUpsertOneEntity_RelationshipArgs = {
  filter: Entity_RelationshipFilterType;
  update: Entity_RelationshipInsertType;
};


export type MutationUpsertOneQuickaddArgs = {
  filter: QuickaddFilterType;
  update: QuickaddInsertType;
};


export type MutationUpsertOneSubscriptionArgs = {
  filter: SubscriptionFilterType;
  update: SubscriptionInsertType;
};

export type Notification = {
  __typename?: 'Notification';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  entity_id?: Maybe<Scalars['String']['output']>;
  incident_id?: Maybe<Scalars['Int']['output']>;
  isUpdate?: Maybe<Scalars['Boolean']['output']>;
  processed?: Maybe<Scalars['Boolean']['output']>;
  report_number?: Maybe<Scalars['Int']['output']>;
  sentDate?: Maybe<Scalars['DateTime']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<User>;
};

export type NotificationFilterType = {
  AND?: InputMaybe<Array<InputMaybe<NotificationFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<NotificationFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<NotificationFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  entity_id?: InputMaybe<StringFilter>;
  incident_id?: InputMaybe<IntFilter>;
  isUpdate?: InputMaybe<BooleanFilter>;
  processed?: InputMaybe<BooleanFilter>;
  report_number?: InputMaybe<IntFilter>;
  sentDate?: InputMaybe<DateTimeFilter>;
  type?: InputMaybe<StringFilter>;
  userId?: InputMaybe<StringFilter>;
};

export type NotificationSortType = {
  _id?: InputMaybe<SortType>;
  created_at?: InputMaybe<SortType>;
  entity_id?: InputMaybe<SortType>;
  incident_id?: InputMaybe<SortType>;
  isUpdate?: InputMaybe<SortType>;
  processed?: InputMaybe<SortType>;
  report_number?: InputMaybe<SortType>;
  sentDate?: InputMaybe<SortType>;
  type?: InputMaybe<SortType>;
};

/** Filter type for ObjectId scalar */
export type ObjectIdFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['ObjectId']['input']>;
  /** DEPRECATED: use NE */
  NEQ?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  /** $not */
  NOT?: InputMaybe<ObjectIdNotFilter>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  opr?: InputMaybe<Opr>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  value?: InputMaybe<Scalars['ObjectId']['input']>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  values?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
};

/** Filter type for $not of ObjectId scalar */
export type ObjectIdNotFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['ObjectId']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
};

export enum Opr {
  All = 'ALL',
  Eql = 'EQL',
  Gt = 'GT',
  Gte = 'GTE',
  In = 'IN',
  Lt = 'LT',
  Lte = 'LTE',
  Ne = 'NE',
  Nin = 'NIN'
}

export enum OprExists {
  Exists = 'EXISTS',
  NotExists = 'NOT_EXISTS'
}

export type PaginationType = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export type Precedents = {
  __typename?: 'Precedents';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  incident_id?: Maybe<Scalars['Int']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PrecedentsInsertType = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type PrecedentsObjectFilterType = {
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  incident_id?: InputMaybe<IntFilter>;
  opr?: InputMaybe<OprExists>;
  tags?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type PromoteSubmissionToReportInput = {
  incident_ids: Array<InputMaybe<Scalars['Int']['input']>>;
  is_incident_report?: InputMaybe<Scalars['Boolean']['input']>;
  submission_id: Scalars['ObjectId']['input'];
};

export type PromoteSubmissionToReportPayload = {
  __typename?: 'PromoteSubmissionToReportPayload';
  incident_ids?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  report_number?: Maybe<Scalars['Int']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /** Custom scalar for MongoDB ObjectID */
  ObjectId?: Maybe<Scalars['ObjectId']['output']>;
  candidate?: Maybe<Candidate>;
  candidates?: Maybe<Array<Maybe<Candidate>>>;
  checklist?: Maybe<Checklist>;
  checklists?: Maybe<Array<Maybe<Checklist>>>;
  classification?: Maybe<Classification>;
  classifications?: Maybe<Array<Maybe<Classification>>>;
  duplicate?: Maybe<Duplicate>;
  duplicates?: Maybe<Array<Maybe<Duplicate>>>;
  entities?: Maybe<Array<Maybe<Entity>>>;
  entity?: Maybe<Entity>;
  entityDuplicate?: Maybe<EntityDuplicate>;
  entityDuplicates?: Maybe<Array<Maybe<EntityDuplicate>>>;
  entity_relationship?: Maybe<Entity_Relationship>;
  entity_relationships?: Maybe<Array<Maybe<Entity_Relationship>>>;
  history_incident?: Maybe<History_Incident>;
  history_incidents?: Maybe<Array<Maybe<History_Incident>>>;
  history_report?: Maybe<History_Report>;
  history_reports?: Maybe<Array<Maybe<History_Report>>>;
  incident?: Maybe<Incident>;
  incidents?: Maybe<Array<Maybe<Incident>>>;
  notification?: Maybe<Notification>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
  quickadd?: Maybe<Quickadd>;
  quickadds?: Maybe<Array<Maybe<Quickadd>>>;
  report?: Maybe<Report>;
  reports?: Maybe<Array<Maybe<Report>>>;
  risks?: Maybe<Array<Maybe<Risks>>>;
  similarEntities?: Maybe<SimilarEntitiesResult>;
  submission?: Maybe<Submission>;
  submissions?: Maybe<Array<Maybe<Submission>>>;
  subscription?: Maybe<Subscription>;
  subscriptions?: Maybe<Array<Maybe<Subscription>>>;
  taxa?: Maybe<Taxa>;
  taxas?: Maybe<Array<Maybe<Taxa>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryCandidateArgs = {
  filter?: InputMaybe<CandidateFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<CandidateSortType>;
};


export type QueryCandidatesArgs = {
  filter?: InputMaybe<CandidateFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<CandidateSortType>;
};


export type QueryChecklistArgs = {
  filter?: InputMaybe<ChecklistFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<ChecklistSortType>;
};


export type QueryChecklistsArgs = {
  filter?: InputMaybe<ChecklistFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<ChecklistSortType>;
};


export type QueryClassificationArgs = {
  filter?: InputMaybe<ClassificationFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<ClassificationSortType>;
};


export type QueryClassificationsArgs = {
  filter?: InputMaybe<ClassificationFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<ClassificationSortType>;
};


export type QueryDuplicateArgs = {
  filter?: InputMaybe<DuplicateFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<DuplicateSortType>;
};


export type QueryDuplicatesArgs = {
  filter?: InputMaybe<DuplicateFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<DuplicateSortType>;
};


export type QueryEntitiesArgs = {
  filter?: InputMaybe<EntityFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<EntitySortType>;
};


export type QueryEntityArgs = {
  filter?: InputMaybe<EntityFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<EntitySortType>;
};


export type QueryEntityDuplicateArgs = {
  filter?: InputMaybe<EntityDuplicateFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<EntityDuplicateSortType>;
};


export type QueryEntityDuplicatesArgs = {
  filter?: InputMaybe<EntityDuplicateFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<EntityDuplicateSortType>;
};


export type QueryEntity_RelationshipArgs = {
  filter?: InputMaybe<Entity_RelationshipFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<Entity_RelationshipSortType>;
};


export type QueryEntity_RelationshipsArgs = {
  filter?: InputMaybe<Entity_RelationshipFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<Entity_RelationshipSortType>;
};


export type QueryHistory_IncidentArgs = {
  filter?: InputMaybe<History_IncidentFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<History_IncidentSortType>;
};


export type QueryHistory_IncidentsArgs = {
  filter?: InputMaybe<History_IncidentFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<History_IncidentSortType>;
};


export type QueryHistory_ReportArgs = {
  filter?: InputMaybe<History_ReportFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<History_ReportSortType>;
};


export type QueryHistory_ReportsArgs = {
  filter?: InputMaybe<History_ReportFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<History_ReportSortType>;
};


export type QueryIncidentArgs = {
  filter?: InputMaybe<IncidentFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<IncidentSortType>;
};


export type QueryIncidentsArgs = {
  filter?: InputMaybe<IncidentFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<IncidentSortType>;
};


export type QueryNotificationArgs = {
  filter?: InputMaybe<NotificationFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<NotificationSortType>;
};


export type QueryNotificationsArgs = {
  filter?: InputMaybe<NotificationFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<NotificationSortType>;
};


export type QueryQuickaddArgs = {
  filter?: InputMaybe<QuickaddFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<QuickaddSortType>;
};


export type QueryQuickaddsArgs = {
  filter?: InputMaybe<QuickaddFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<QuickaddSortType>;
};


export type QueryReportArgs = {
  filter?: InputMaybe<ReportFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<ReportSortType>;
};


export type QueryReportsArgs = {
  filter?: InputMaybe<ReportFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<ReportSortType>;
};


export type QueryRisksArgs = {
  input?: InputMaybe<RisksInput>;
};


export type QuerySimilarEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  threshold: Scalars['Int']['input'];
};


export type QuerySubmissionArgs = {
  filter?: InputMaybe<SubmissionFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<SubmissionSortType>;
};


export type QuerySubmissionsArgs = {
  filter?: InputMaybe<SubmissionFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<SubmissionSortType>;
};


export type QuerySubscriptionArgs = {
  filter?: InputMaybe<SubscriptionFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<SubscriptionSortType>;
};


export type QuerySubscriptionsArgs = {
  filter?: InputMaybe<SubscriptionFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<SubscriptionSortType>;
};


export type QueryTaxaArgs = {
  filter?: InputMaybe<TaxaFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<TaxaSortType>;
};


export type QueryTaxasArgs = {
  filter?: InputMaybe<TaxaFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<TaxaSortType>;
};


export type QueryUserArgs = {
  filter?: InputMaybe<UserFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<UserSortType>;
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<UserSortType>;
};

export type Quickadd = {
  __typename?: 'Quickadd';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  date_submitted: Scalars['String']['output'];
  incident_id?: Maybe<Scalars['Int']['output']>;
  source_domain?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type QuickaddFilterType = {
  AND?: InputMaybe<Array<InputMaybe<QuickaddFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<QuickaddFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<QuickaddFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  date_submitted?: InputMaybe<StringFilter>;
  incident_id?: InputMaybe<IntFilter>;
  source_domain?: InputMaybe<StringFilter>;
  url?: InputMaybe<StringFilter>;
};

export type QuickaddInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  date_submitted: Scalars['String']['input'];
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
};

export type QuickaddSetType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  date_submitted?: InputMaybe<Scalars['String']['input']>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type QuickaddSortType = {
  _id?: InputMaybe<SortType>;
  date_submitted?: InputMaybe<SortType>;
  incident_id?: InputMaybe<SortType>;
  source_domain?: InputMaybe<SortType>;
  url?: InputMaybe<SortType>;
};

export type QuickaddUpdateType = {
  set?: InputMaybe<QuickaddSetType>;
};

export type Report = {
  __typename?: 'Report';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  authors: Array<Maybe<Scalars['String']['output']>>;
  cloudinary_id: Scalars['String']['output'];
  created_at?: Maybe<Scalars['DateTime']['output']>;
  date_downloaded: Scalars['DateTime']['output'];
  date_modified: Scalars['DateTime']['output'];
  date_published: Scalars['DateTime']['output'];
  date_submitted: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  editor_notes?: Maybe<Scalars['String']['output']>;
  embedding?: Maybe<ReportEmbedding>;
  epoch_date_downloaded: Scalars['Int']['output'];
  epoch_date_modified: Scalars['Int']['output'];
  epoch_date_published: Scalars['Int']['output'];
  epoch_date_submitted: Scalars['Int']['output'];
  flag?: Maybe<Scalars['Boolean']['output']>;
  image_url: Scalars['String']['output'];
  inputs_outputs?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  is_incident_report?: Maybe<Scalars['Boolean']['output']>;
  language: Scalars['String']['output'];
  plain_text: Scalars['String']['output'];
  quiet?: Maybe<Scalars['Boolean']['output']>;
  report_number: Scalars['Int']['output'];
  source_domain: Scalars['String']['output'];
  submitters: Array<Maybe<Scalars['String']['output']>>;
  tags: Array<Maybe<Scalars['String']['output']>>;
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
  translations?: Maybe<Array<Maybe<ReportTranslations>>>;
  url: Scalars['String']['output'];
  user?: Maybe<User>;
};


export type ReportTranslationsArgs = {
  languages: Array<InputMaybe<Scalars['String']['input']>>;
};

export type ReportEmbedding = {
  __typename?: 'ReportEmbedding';
  from_text_hash?: Maybe<Scalars['String']['output']>;
  vector?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type ReportEmbeddingInsertType = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type ReportEmbeddingObjectFilterType = {
  from_text_hash?: InputMaybe<StringFilter>;
  opr?: InputMaybe<OprExists>;
  vector?: InputMaybe<FloatFilter>;
};

export type ReportEmbeddingSetObjectType = {
  /** If set to true, the object would be overwriten entirely, including fields that are not specified. Non-null validation rules will apply. Once set to true, any child object will overwriten invariably of the value set to this field. */
  _OVERWRITE?: InputMaybe<Scalars['Boolean']['input']>;
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type ReportEmbeddingSortType = {
  from_text_hash?: InputMaybe<SortType>;
};

export type ReportFilterType = {
  AND?: InputMaybe<Array<InputMaybe<ReportFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<ReportFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<ReportFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  authors?: InputMaybe<StringFilter>;
  cloudinary_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  date_downloaded?: InputMaybe<DateTimeFilter>;
  date_modified?: InputMaybe<DateTimeFilter>;
  date_published?: InputMaybe<DateTimeFilter>;
  date_submitted?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  editor_notes?: InputMaybe<StringFilter>;
  embedding?: InputMaybe<ReportEmbeddingObjectFilterType>;
  epoch_date_downloaded?: InputMaybe<IntFilter>;
  epoch_date_modified?: InputMaybe<IntFilter>;
  epoch_date_published?: InputMaybe<IntFilter>;
  epoch_date_submitted?: InputMaybe<IntFilter>;
  flag?: InputMaybe<BooleanFilter>;
  image_url?: InputMaybe<StringFilter>;
  inputs_outputs?: InputMaybe<StringFilter>;
  is_incident_report?: InputMaybe<BooleanFilter>;
  language?: InputMaybe<StringFilter>;
  plain_text?: InputMaybe<StringFilter>;
  quiet?: InputMaybe<BooleanFilter>;
  report_number?: InputMaybe<IntFilter>;
  source_domain?: InputMaybe<StringFilter>;
  submitters?: InputMaybe<StringFilter>;
  tags?: InputMaybe<StringFilter>;
  text?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  url?: InputMaybe<StringFilter>;
  user?: InputMaybe<StringFilter>;
};

export type ReportInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  authors: Array<InputMaybe<Scalars['String']['input']>>;
  cloudinary_id: Scalars['String']['input'];
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded: Scalars['DateTime']['input'];
  date_modified: Scalars['DateTime']['input'];
  date_published: Scalars['DateTime']['input'];
  date_submitted: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  embedding?: InputMaybe<ReportEmbeddingInsertType>;
  epoch_date_downloaded: Scalars['Int']['input'];
  epoch_date_modified: Scalars['Int']['input'];
  epoch_date_published: Scalars['Int']['input'];
  epoch_date_submitted: Scalars['Int']['input'];
  flag?: InputMaybe<Scalars['Boolean']['input']>;
  image_url: Scalars['String']['input'];
  inputs_outputs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  is_incident_report?: InputMaybe<Scalars['Boolean']['input']>;
  language: Scalars['String']['input'];
  plain_text: Scalars['String']['input'];
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  report_number: Scalars['Int']['input'];
  source_domain: Scalars['String']['input'];
  submitters: Array<InputMaybe<Scalars['String']['input']>>;
  tags: Array<InputMaybe<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
  user?: InputMaybe<ReportUserRelationInput>;
};

export type ReportSetType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cloudinary_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  date_published?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  embedding?: InputMaybe<ReportEmbeddingSetObjectType>;
  epoch_date_downloaded?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted?: InputMaybe<Scalars['Int']['input']>;
  flag?: InputMaybe<Scalars['Boolean']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  inputs_outputs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  is_incident_report?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  report_number?: InputMaybe<Scalars['Int']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  submitters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<ReportUserRelationInput>;
};

export type ReportSortType = {
  _id?: InputMaybe<SortType>;
  cloudinary_id?: InputMaybe<SortType>;
  created_at?: InputMaybe<SortType>;
  date_downloaded?: InputMaybe<SortType>;
  date_modified?: InputMaybe<SortType>;
  date_published?: InputMaybe<SortType>;
  date_submitted?: InputMaybe<SortType>;
  description?: InputMaybe<SortType>;
  editor_notes?: InputMaybe<SortType>;
  embedding?: InputMaybe<ReportEmbeddingSortType>;
  epoch_date_downloaded?: InputMaybe<SortType>;
  epoch_date_modified?: InputMaybe<SortType>;
  epoch_date_published?: InputMaybe<SortType>;
  epoch_date_submitted?: InputMaybe<SortType>;
  flag?: InputMaybe<SortType>;
  image_url?: InputMaybe<SortType>;
  is_incident_report?: InputMaybe<SortType>;
  language?: InputMaybe<SortType>;
  plain_text?: InputMaybe<SortType>;
  quiet?: InputMaybe<SortType>;
  report_number?: InputMaybe<SortType>;
  source_domain?: InputMaybe<SortType>;
  text?: InputMaybe<SortType>;
  title?: InputMaybe<SortType>;
  url?: InputMaybe<SortType>;
};

export type ReportTranslations = {
  __typename?: 'ReportTranslations';
  language: Scalars['String']['output'];
  plain_text?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ReportUpdateType = {
  set?: InputMaybe<ReportSetType>;
};

export type ReportUserRelationInput = {
  link?: InputMaybe<Scalars['String']['input']>;
};

export type Risks = {
  __typename?: 'Risks';
  id?: Maybe<Scalars['String']['output']>;
  likelihood?: Maybe<Scalars['String']['output']>;
  precedents?: Maybe<Array<Maybe<Precedents>>>;
  risk_notes?: Maybe<Scalars['String']['output']>;
  risk_status?: Maybe<Scalars['String']['output']>;
  severity?: Maybe<Scalars['String']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
  touched?: Maybe<Scalars['Boolean']['output']>;
};

export type RisksInput = {
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type RisksInsertType = {
  id?: InputMaybe<Scalars['String']['input']>;
  likelihood?: InputMaybe<Scalars['String']['input']>;
  precedents?: InputMaybe<Array<InputMaybe<PrecedentsInsertType>>>;
  risk_notes?: InputMaybe<Scalars['String']['input']>;
  risk_status?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<Scalars['String']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  touched?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RisksObjectFilterType = {
  id?: InputMaybe<StringFilter>;
  likelihood?: InputMaybe<StringFilter>;
  opr?: InputMaybe<OprExists>;
  precedents?: InputMaybe<PrecedentsObjectFilterType>;
  risk_notes?: InputMaybe<StringFilter>;
  risk_status?: InputMaybe<StringFilter>;
  severity?: InputMaybe<StringFilter>;
  tag?: InputMaybe<StringFilter>;
  tags?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  touched?: InputMaybe<BooleanFilter>;
};

export type SimilarEntitiesResult = {
  __typename?: 'SimilarEntitiesResult';
  hasMore: Scalars['Boolean']['output'];
  pairs: Array<Maybe<SimilarEntityPair>>;
};

export type SimilarEntityPair = {
  __typename?: 'SimilarEntityPair';
  entityId1: Scalars['String']['output'];
  entityId2: Scalars['String']['output'];
  entityName1: Scalars['String']['output'];
  entityName2: Scalars['String']['output'];
  similarity: Scalars['Float']['output'];
};

export enum SortType {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** Filter type for String scalar */
export type StringFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['String']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['String']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['String']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['String']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['String']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['String']['input']>;
  /** DEPRECATED: use NE */
  NEQ?: InputMaybe<Scalars['String']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** $not */
  NOT?: InputMaybe<StringNotFilter>;
  /** $options. Modifiers for the $regex expression. Field is ignored on its own */
  OPTIONS?: InputMaybe<Scalars['String']['input']>;
  /** $regex */
  REGEX?: InputMaybe<Scalars['String']['input']>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  opr?: InputMaybe<Opr>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  value?: InputMaybe<Scalars['String']['input']>;
  /** DEPRECATED: Switched to the more intuitive operator fields */
  values?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/** Filter type for $not of String scalar */
export type StringNotFilter = {
  /** $all */
  ALL?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** $eq */
  EQ?: InputMaybe<Scalars['String']['input']>;
  /** $gt */
  GT?: InputMaybe<Scalars['String']['input']>;
  /** $gte */
  GTE?: InputMaybe<Scalars['String']['input']>;
  /** $in */
  IN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** $lt */
  LT?: InputMaybe<Scalars['String']['input']>;
  /** $lte */
  LTE?: InputMaybe<Scalars['String']['input']>;
  /** $ne */
  NE?: InputMaybe<Scalars['String']['input']>;
  /** $nin */
  NIN?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** $options. Modifiers for the $regex expression. Field is ignored on its own */
  OPTIONS?: InputMaybe<Scalars['String']['input']>;
  /** $regex */
  REGEX?: InputMaybe<Scalars['String']['input']>;
};

export type Subfield = {
  __typename?: 'Subfield';
  complete_from?: Maybe<SubfieldCompleteFrom>;
  default?: Maybe<Scalars['String']['output']>;
  display_type?: Maybe<Scalars['String']['output']>;
  field_number?: Maybe<Scalars['String']['output']>;
  hide_search?: Maybe<Scalars['Boolean']['output']>;
  instant_facet?: Maybe<Scalars['Boolean']['output']>;
  long_description?: Maybe<Scalars['String']['output']>;
  long_name?: Maybe<Scalars['String']['output']>;
  mongo_type?: Maybe<Scalars['String']['output']>;
  permitted_values?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  placeholder?: Maybe<Scalars['String']['output']>;
  public?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  short_description?: Maybe<Scalars['String']['output']>;
  short_name?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Int']['output']>;
};

export type SubfieldCompleteFrom = {
  __typename?: 'SubfieldCompleteFrom';
  all?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  current?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  entities?: Maybe<Scalars['Boolean']['output']>;
};

export type SubfieldCompleteFromObjectFilterType = {
  all?: InputMaybe<StringFilter>;
  current?: InputMaybe<StringFilter>;
  entities?: InputMaybe<BooleanFilter>;
  opr?: InputMaybe<OprExists>;
};

export type SubfieldObjectFilterType = {
  complete_from?: InputMaybe<SubfieldCompleteFromObjectFilterType>;
  default?: InputMaybe<StringFilter>;
  display_type?: InputMaybe<StringFilter>;
  field_number?: InputMaybe<StringFilter>;
  hide_search?: InputMaybe<BooleanFilter>;
  instant_facet?: InputMaybe<BooleanFilter>;
  long_description?: InputMaybe<StringFilter>;
  long_name?: InputMaybe<StringFilter>;
  mongo_type?: InputMaybe<StringFilter>;
  opr?: InputMaybe<OprExists>;
  permitted_values?: InputMaybe<StringFilter>;
  placeholder?: InputMaybe<StringFilter>;
  public?: InputMaybe<BooleanFilter>;
  required?: InputMaybe<BooleanFilter>;
  short_description?: InputMaybe<StringFilter>;
  short_name?: InputMaybe<StringFilter>;
  weight?: InputMaybe<IntFilter>;
};

export type Submission = {
  __typename?: 'Submission';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  authors: Array<Maybe<Scalars['String']['output']>>;
  cloudinary_id?: Maybe<Scalars['String']['output']>;
  date_downloaded: Scalars['String']['output'];
  date_modified: Scalars['String']['output'];
  date_published: Scalars['String']['output'];
  date_submitted: Scalars['String']['output'];
  deployers?: Maybe<Array<Maybe<Entity>>>;
  description?: Maybe<Scalars['String']['output']>;
  developers?: Maybe<Array<Maybe<Entity>>>;
  editor_dissimilar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editor_notes?: Maybe<Scalars['String']['output']>;
  editor_similar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  embedding?: Maybe<Embedding>;
  epoch_date_modified?: Maybe<Scalars['Long']['output']>;
  harmed_parties?: Maybe<Array<Maybe<Entity>>>;
  image_url: Scalars['String']['output'];
  implicated_systems?: Maybe<Array<Maybe<Entity>>>;
  incident_date?: Maybe<Scalars['String']['output']>;
  incident_editors?: Maybe<Array<Maybe<User>>>;
  incident_ids?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  incident_title?: Maybe<Scalars['String']['output']>;
  language: Scalars['String']['output'];
  nlp_similar_incidents?: Maybe<Array<Maybe<IncidentNlp_Similar_Incident>>>;
  plain_text?: Maybe<Scalars['String']['output']>;
  quiet?: Maybe<Scalars['Boolean']['output']>;
  source_domain: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  submitters: Array<Maybe<Scalars['String']['output']>>;
  tags: Array<Maybe<Scalars['String']['output']>>;
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type SubmissionDeployersRelationInput = {
  link: Array<InputMaybe<Scalars['String']['input']>>;
};

export type SubmissionDevelopersRelationInput = {
  link: Array<InputMaybe<Scalars['String']['input']>>;
};

export type SubmissionFilterType = {
  AND?: InputMaybe<Array<InputMaybe<SubmissionFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<SubmissionFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<SubmissionFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  authors?: InputMaybe<StringFilter>;
  cloudinary_id?: InputMaybe<StringFilter>;
  date_downloaded?: InputMaybe<StringFilter>;
  date_modified?: InputMaybe<StringFilter>;
  date_published?: InputMaybe<StringFilter>;
  date_submitted?: InputMaybe<StringFilter>;
  deployers?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  developers?: InputMaybe<StringFilter>;
  editor_dissimilar_incidents?: InputMaybe<IntFilter>;
  editor_notes?: InputMaybe<StringFilter>;
  editor_similar_incidents?: InputMaybe<IntFilter>;
  embedding?: InputMaybe<EmbeddingObjectFilterType>;
  epoch_date_modified?: InputMaybe<LongFilter>;
  harmed_parties?: InputMaybe<StringFilter>;
  image_url?: InputMaybe<StringFilter>;
  implicated_systems?: InputMaybe<StringFilter>;
  incident_date?: InputMaybe<StringFilter>;
  incident_editors?: InputMaybe<StringFilter>;
  incident_ids?: InputMaybe<IntFilter>;
  incident_title?: InputMaybe<StringFilter>;
  language?: InputMaybe<StringFilter>;
  nlp_similar_incidents?: InputMaybe<IncidentNlp_Similar_IncidentObjectFilterType>;
  plain_text?: InputMaybe<StringFilter>;
  quiet?: InputMaybe<BooleanFilter>;
  source_domain?: InputMaybe<StringFilter>;
  status?: InputMaybe<StringFilter>;
  submitters?: InputMaybe<StringFilter>;
  tags?: InputMaybe<StringFilter>;
  text?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  url?: InputMaybe<StringFilter>;
  user?: InputMaybe<StringFilter>;
};

export type SubmissionHarmed_PartiesRelationInput = {
  link: Array<InputMaybe<Scalars['String']['input']>>;
};

export type SubmissionImplicated_SystemsRelationInput = {
  link: Array<InputMaybe<Scalars['String']['input']>>;
};

export type SubmissionIncident_EditorsRelationInput = {
  link: Array<InputMaybe<Scalars['String']['input']>>;
};

export type SubmissionInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  authors: Array<InputMaybe<Scalars['String']['input']>>;
  cloudinary_id?: InputMaybe<Scalars['String']['input']>;
  date_downloaded: Scalars['String']['input'];
  date_modified: Scalars['String']['input'];
  date_published: Scalars['String']['input'];
  date_submitted: Scalars['String']['input'];
  deployers?: InputMaybe<SubmissionDeployersRelationInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  developers?: InputMaybe<SubmissionDevelopersRelationInput>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  embedding?: InputMaybe<EmbeddingInsertType>;
  epoch_date_modified?: InputMaybe<Scalars['Long']['input']>;
  harmed_parties?: InputMaybe<SubmissionHarmed_PartiesRelationInput>;
  image_url: Scalars['String']['input'];
  implicated_systems?: InputMaybe<SubmissionImplicated_SystemsRelationInput>;
  incident_date?: InputMaybe<Scalars['String']['input']>;
  incident_editors?: InputMaybe<SubmissionIncident_EditorsRelationInput>;
  incident_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_title?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<IncidentNlp_Similar_IncidentInsertType>>>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  submitters: Array<InputMaybe<Scalars['String']['input']>>;
  tags: Array<InputMaybe<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
  user?: InputMaybe<SubmissionUserRelationInput>;
};

export type SubmissionSetType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cloudinary_id?: InputMaybe<Scalars['String']['input']>;
  date_downloaded?: InputMaybe<Scalars['String']['input']>;
  date_modified?: InputMaybe<Scalars['String']['input']>;
  date_published?: InputMaybe<Scalars['String']['input']>;
  date_submitted?: InputMaybe<Scalars['String']['input']>;
  deployers?: InputMaybe<SubmissionDeployersRelationInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  developers?: InputMaybe<SubmissionDevelopersRelationInput>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  embedding?: InputMaybe<EmbeddingSetObjectType>;
  epoch_date_modified?: InputMaybe<Scalars['Long']['input']>;
  harmed_parties?: InputMaybe<SubmissionHarmed_PartiesRelationInput>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  implicated_systems?: InputMaybe<SubmissionImplicated_SystemsRelationInput>;
  incident_date?: InputMaybe<Scalars['String']['input']>;
  incident_editors?: InputMaybe<SubmissionIncident_EditorsRelationInput>;
  incident_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_title?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<IncidentNlp_Similar_IncidentSetListObjectType>>>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  submitters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<SubmissionUserRelationInput>;
};

export type SubmissionSortType = {
  _id?: InputMaybe<SortType>;
  cloudinary_id?: InputMaybe<SortType>;
  date_downloaded?: InputMaybe<SortType>;
  date_modified?: InputMaybe<SortType>;
  date_published?: InputMaybe<SortType>;
  date_submitted?: InputMaybe<SortType>;
  description?: InputMaybe<SortType>;
  editor_notes?: InputMaybe<SortType>;
  embedding?: InputMaybe<EmbeddingSortType>;
  epoch_date_modified?: InputMaybe<SortType>;
  image_url?: InputMaybe<SortType>;
  incident_date?: InputMaybe<SortType>;
  incident_title?: InputMaybe<SortType>;
  language?: InputMaybe<SortType>;
  plain_text?: InputMaybe<SortType>;
  quiet?: InputMaybe<SortType>;
  source_domain?: InputMaybe<SortType>;
  status?: InputMaybe<SortType>;
  text?: InputMaybe<SortType>;
  title?: InputMaybe<SortType>;
  url?: InputMaybe<SortType>;
};

export type SubmissionUpdateType = {
  set?: InputMaybe<SubmissionSetType>;
};

export type SubmissionUserRelationInput = {
  link?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  entityId?: Maybe<Entity>;
  incident_id?: Maybe<Incident>;
  type: Scalars['String']['output'];
  userId?: Maybe<User>;
};

export type SubscriptionEntityidRelationInput = {
  link?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionFilterType = {
  AND?: InputMaybe<Array<InputMaybe<SubscriptionFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<SubscriptionFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<SubscriptionFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  entityId?: InputMaybe<StringFilter>;
  incident_id?: InputMaybe<IntFilter>;
  type?: InputMaybe<StringFilter>;
  userId?: InputMaybe<StringFilter>;
};

export type SubscriptionIncident_IdRelationInput = {
  link?: InputMaybe<Scalars['Int']['input']>;
};

export type SubscriptionInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  entityId?: InputMaybe<SubscriptionEntityidRelationInput>;
  incident_id?: InputMaybe<SubscriptionIncident_IdRelationInput>;
  type: Scalars['String']['input'];
  userId?: InputMaybe<SubscriptionUseridRelationInput>;
};

export type SubscriptionSetType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  entityId?: InputMaybe<SubscriptionEntityidRelationInput>;
  incident_id?: InputMaybe<SubscriptionIncident_IdRelationInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<SubscriptionUseridRelationInput>;
};

export type SubscriptionSortType = {
  _id?: InputMaybe<SortType>;
  type?: InputMaybe<SortType>;
};

export type SubscriptionUpdateType = {
  set?: InputMaybe<SubscriptionSetType>;
};

export type SubscriptionUseridRelationInput = {
  link?: InputMaybe<Scalars['String']['input']>;
};

export type Taxa = {
  __typename?: 'Taxa';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  automatedClassifications?: Maybe<Scalars['Boolean']['output']>;
  complete_entities?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dummy_fields?: Maybe<Array<Maybe<DummyFields>>>;
  field_list?: Maybe<Array<Maybe<FieldList>>>;
  namespace?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Int']['output']>;
};

export type TaxaFilterType = {
  AND?: InputMaybe<Array<InputMaybe<TaxaFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<TaxaFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<TaxaFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  automatedClassifications?: InputMaybe<BooleanFilter>;
  complete_entities?: InputMaybe<BooleanFilter>;
  description?: InputMaybe<StringFilter>;
  dummy_fields?: InputMaybe<DummyFieldsObjectFilterType>;
  field_list?: InputMaybe<FieldListObjectFilterType>;
  namespace?: InputMaybe<StringFilter>;
  weight?: InputMaybe<IntFilter>;
};

export type TaxaSortType = {
  _id?: InputMaybe<SortType>;
  automatedClassifications?: InputMaybe<SortType>;
  complete_entities?: InputMaybe<SortType>;
  description?: InputMaybe<SortType>;
  namespace?: InputMaybe<SortType>;
  weight?: InputMaybe<SortType>;
};

export type UpdateManyPayload = {
  __typename?: 'UpdateManyPayload';
  matchedCount: Scalars['Int']['output'];
  modifiedCount: Scalars['Int']['output'];
};

export type UpdateOneEntityInput = {
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  entity_id: Scalars['String']['input'];
  entity_relationships_to_add?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  entity_relationships_to_remove?: InputMaybe<Array<InputMaybe<Scalars['JSONObject']['input']>>>;
  name: Scalars['String']['input'];
};

export type UpdateOneEntityPayload = {
  __typename?: 'UpdateOneEntityPayload';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  date_modified?: Maybe<Scalars['DateTime']['output']>;
  entity_id: Scalars['String']['output'];
  entity_relationships_to_add?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  entity_relationships_to_remove?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name: Scalars['String']['output'];
};

export type UpdateOneIncidentTranslationInput = {
  description: Scalars['String']['input'];
  incident_id: Scalars['Int']['input'];
  language: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type UpdateOneReportTranslationInput = {
  language: Scalars['String']['input'];
  plain_text: Scalars['String']['input'];
  report_number: Scalars['Int']['input'];
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  adminData?: Maybe<UserAdminDatum>;
  first_name?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  roles: Array<Maybe<Scalars['String']['output']>>;
  userId: Scalars['String']['output'];
};

export type UserAdminDatum = {
  __typename?: 'UserAdminDatum';
  creationDate: Scalars['DateTime']['output'];
  disabled: Scalars['Boolean']['output'];
  email: Scalars['String']['output'];
  lastAuthenticationDate?: Maybe<Scalars['DateTime']['output']>;
};

export type UserFilterType = {
  AND?: InputMaybe<Array<InputMaybe<UserFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<UserFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<UserFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  first_name?: InputMaybe<StringFilter>;
  last_name?: InputMaybe<StringFilter>;
  roles?: InputMaybe<StringFilter>;
  userId?: InputMaybe<StringFilter>;
};

export type UserSetType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UserSortType = {
  _id?: InputMaybe<SortType>;
  first_name?: InputMaybe<SortType>;
  last_name?: InputMaybe<SortType>;
  userId?: InputMaybe<SortType>;
};

export type UserUpdateType = {
  set?: InputMaybe<UserSetType>;
};

export type FindChecklistsQueryVariables = Exact<{
  filter?: InputMaybe<ChecklistFilterType>;
}>;


export type FindChecklistsQuery = { __typename?: 'Query', checklists?: Array<{ __typename?: 'Checklist', id?: string | null, owner_id?: string | null, date_created?: any | null, date_updated?: any | null, name?: string | null, about?: string | null, tags_goals?: Array<string | null> | null, tags_methods?: Array<string | null> | null, tags_other?: Array<string | null> | null, risks?: Array<{ __typename?: 'Risks', id?: string | null, title?: string | null, risk_status?: string | null, risk_notes?: string | null, severity?: string | null, likelihood?: string | null, touched?: boolean | null, tags?: Array<string | null> | null, precedents?: Array<{ __typename?: 'Precedents', tags?: Array<string | null> | null, incident_id?: number | null, description?: string | null, title?: string | null } | null> | null } | null> | null } | null> | null };

export type FindChecklistQueryVariables = Exact<{
  filter?: InputMaybe<ChecklistFilterType>;
}>;


export type FindChecklistQuery = { __typename?: 'Query', checklist?: { __typename?: 'Checklist', id?: string | null, owner_id?: string | null, date_created?: any | null, date_updated?: any | null, name?: string | null, about?: string | null, tags_goals?: Array<string | null> | null, tags_methods?: Array<string | null> | null, tags_other?: Array<string | null> | null, risks?: Array<{ __typename?: 'Risks', id?: string | null, title?: string | null, risk_status?: string | null, risk_notes?: string | null, severity?: string | null, likelihood?: string | null, touched?: boolean | null, tags?: Array<string | null> | null, precedents?: Array<{ __typename?: 'Precedents', tags?: Array<string | null> | null, incident_id?: number | null, description?: string | null, title?: string | null } | null> | null } | null> | null } | null };

export type UpsertChecklistMutationVariables = Exact<{
  filter: ChecklistFilterType;
  checklist: ChecklistInsertType;
}>;


export type UpsertChecklistMutation = { __typename?: 'Mutation', upsertOneChecklist?: { __typename?: 'Checklist', id?: string | null, owner_id?: string | null, date_created?: any | null, date_updated?: any | null, name?: string | null, about?: string | null, tags_goals?: Array<string | null> | null, tags_methods?: Array<string | null> | null, tags_other?: Array<string | null> | null, risks?: Array<{ __typename?: 'Risks', id?: string | null, title?: string | null, risk_status?: string | null, risk_notes?: string | null, severity?: string | null, likelihood?: string | null, touched?: boolean | null, tags?: Array<string | null> | null, precedents?: Array<{ __typename?: 'Precedents', tags?: Array<string | null> | null, incident_id?: number | null, description?: string | null, title?: string | null } | null> | null } | null> | null } | null };

export type InsertChecklistMutationVariables = Exact<{
  checklist: ChecklistInsertType;
}>;


export type InsertChecklistMutation = { __typename?: 'Mutation', insertOneChecklist?: { __typename?: 'Checklist', id?: string | null, owner_id?: string | null, date_created?: any | null, date_updated?: any | null, name?: string | null, about?: string | null, tags_goals?: Array<string | null> | null, tags_methods?: Array<string | null> | null, tags_other?: Array<string | null> | null, risks?: Array<{ __typename?: 'Risks', id?: string | null, title?: string | null, risk_status?: string | null, risk_notes?: string | null, severity?: string | null, likelihood?: string | null, touched?: boolean | null, tags?: Array<string | null> | null, precedents?: Array<{ __typename?: 'Precedents', tags?: Array<string | null> | null, incident_id?: number | null, description?: string | null, title?: string | null } | null> | null } | null> | null } | null };

export type DeleteOneChecklistMutationVariables = Exact<{
  filter: ChecklistFilterType;
}>;


export type DeleteOneChecklistMutation = { __typename?: 'Mutation', deleteOneChecklist?: { __typename?: 'Checklist', id?: string | null } | null };

export type FindClassificationsQueryVariables = Exact<{
  filter?: InputMaybe<ClassificationFilterType>;
}>;


export type FindClassificationsQuery = { __typename?: 'Query', classifications?: Array<{ __typename?: 'Classification', _id?: any | null, notes?: string | null, namespace: string, publish?: boolean | null, incidents?: Array<{ __typename?: 'Incident', incident_id: number } | null> | null, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null, attributes?: Array<{ __typename?: 'Attribute', short_name?: string | null, value_json?: string | null } | null> | null } | null> | null };

export type UpsertClassificationMutationVariables = Exact<{
  filter: ClassificationFilterType;
  update: ClassificationInsertType;
}>;


export type UpsertClassificationMutation = { __typename?: 'Mutation', upsertOneClassification?: { __typename?: 'Classification', _id?: any | null, notes?: string | null, namespace: string, publish?: boolean | null, incidents?: Array<{ __typename?: 'Incident', incident_id: number } | null> | null, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null, attributes?: Array<{ __typename?: 'Attribute', short_name?: string | null, value_json?: string | null } | null> | null } | null };

export type InsertDuplicateMutationVariables = Exact<{
  duplicate: DuplicateInsertType;
}>;


export type InsertDuplicateMutation = { __typename?: 'Mutation', insertOneDuplicate?: { __typename?: 'Duplicate', duplicate_incident_number?: number | null, true_incident_number?: number | null } | null };

export type UpsertEntityMutationVariables = Exact<{
  filter: EntityFilterType;
  update: EntityInsertType;
}>;


export type UpsertEntityMutation = { __typename?: 'Mutation', upsertOneEntity?: { __typename?: 'Entity', entity_id: string, name: string } | null };

export type FindEntitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type FindEntitiesQuery = { __typename?: 'Query', entities?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null };

export type FindEntityQueryVariables = Exact<{
  filter?: InputMaybe<EntityFilterType>;
}>;


export type FindEntityQuery = { __typename?: 'Query', entity?: { __typename?: 'Entity', entity_id: string, name: string, created_at?: any | null, date_modified?: any | null } | null };

export type UpdateEntityMutationVariables = Exact<{
  input: UpdateOneEntityInput;
}>;


export type UpdateEntityMutation = { __typename?: 'Mutation', updateEntityAndRelationships: { __typename?: 'UpdateOneEntityPayload', entity_id: string } };

export type MergeEntitiesMutationVariables = Exact<{
  primaryId: Scalars['String']['input'];
  secondaryId: Scalars['String']['input'];
  keepEntity: Scalars['Int']['input'];
}>;


export type MergeEntitiesMutation = { __typename?: 'Mutation', mergeEntities: { __typename?: 'Entity', entity_id: string, name: string } };

export type SimilarEntitiesQueryVariables = Exact<{
  threshold: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
}>;


export type SimilarEntitiesQuery = { __typename?: 'Query', similarEntities?: { __typename?: 'SimilarEntitiesResult', hasMore: boolean, pairs: Array<{ __typename?: 'SimilarEntityPair', entityId1: string, entityName1: string, entityId2: string, entityName2: string, similarity: number } | null> } | null };

export type FindEntity_RelationshipsQueryVariables = Exact<{
  filter?: InputMaybe<Entity_RelationshipFilterType>;
}>;


export type FindEntity_RelationshipsQuery = { __typename?: 'Query', entity_relationships?: Array<{ __typename?: 'Entity_relationship', _id?: any | null, created_at?: any | null, pred?: string | null, is_symmetric?: boolean | null, sub?: { __typename?: 'Entity', entity_id: string, name: string } | null, obj?: { __typename?: 'Entity', entity_id: string, name: string } | null } | null> | null };

export type UpdateEntity_RelationshipMutationVariables = Exact<{
  filter: Entity_RelationshipFilterType;
  update: Entity_RelationshipUpdateType;
}>;


export type UpdateEntity_RelationshipMutation = { __typename?: 'Mutation', updateOneEntity_relationship?: { __typename?: 'Entity_relationship', pred?: string | null, sub?: { __typename?: 'Entity', entity_id: string, name: string } | null, obj?: { __typename?: 'Entity', entity_id: string, name: string } | null } | null };

export type UpdateIncidentTranslationMutationVariables = Exact<{
  input: UpdateOneIncidentTranslationInput;
}>;


export type UpdateIncidentTranslationMutation = { __typename?: 'Mutation', updateOneIncidentTranslation?: { __typename?: 'Incident', incident_id: number } | null };

export type FindIncidentQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
}>;


export type FindIncidentQuery = { __typename?: 'Query', incident?: { __typename?: 'Incident', incident_id: number, title: string, description?: string | null, date: string, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, flagged_dissimilar_incidents: Array<number | null>, editor_notes: string, editors?: Array<{ __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null> | null, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, implicated_systems?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', incident_id?: number | null, similarity?: number | null } | null> | null, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null, embedding?: { __typename?: 'IncidentEmbedding', from_reports?: Array<number | null> | null, vector?: Array<number | null> | null } | null } | null };

export type FindIncidentsTableQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
}>;


export type FindIncidentsTableQuery = { __typename?: 'Query', incidents?: Array<{ __typename?: 'Incident', incident_id: number, title: string, description?: string | null, date: string, editors?: Array<{ __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null> | null, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, implicated_systems?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null } | null> | null };

export type FindIncidentEntitiesQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
}>;


export type FindIncidentEntitiesQuery = { __typename?: 'Query', incident?: { __typename?: 'Incident', incident_id: number, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, implicated_systems?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null } | null };

export type FindIncidentsQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
}>;


export type FindIncidentsQuery = { __typename?: 'Query', incidents?: Array<{ __typename?: 'Incident', incident_id: number, title: string, description?: string | null, date: string, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, flagged_dissimilar_incidents: Array<number | null>, editors?: Array<{ __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null> | null, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, implicated_systems?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', incident_id?: number | null, similarity?: number | null } | null> | null, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null, embedding?: { __typename?: 'IncidentEmbedding', from_reports?: Array<number | null> | null, vector?: Array<number | null> | null } | null } | null> | null };

export type FindIncidentsTitlesQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
}>;


export type FindIncidentsTitlesQuery = { __typename?: 'Query', incidents?: Array<{ __typename?: 'Incident', incident_id: number, title: string } | null> | null };

export type UpdateIncidentMutationVariables = Exact<{
  filter: IncidentFilterType;
  update: IncidentUpdateType;
}>;


export type UpdateIncidentMutation = { __typename?: 'Mutation', updateOneIncident?: { __typename?: 'Incident', incident_id: number, title: string, description?: string | null, date: string, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, flagged_dissimilar_incidents: Array<number | null>, editor_notes: string, editors?: Array<{ __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null> | null, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, implicated_systems?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', incident_id?: number | null, similarity?: number | null } | null> | null, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null, embedding?: { __typename?: 'IncidentEmbedding', from_reports?: Array<number | null> | null, vector?: Array<number | null> | null } | null } | null };

export type UpdateIncidentsMutationVariables = Exact<{
  filter: IncidentFilterType;
  update: IncidentUpdateType;
}>;


export type UpdateIncidentsMutation = { __typename?: 'Mutation', updateManyIncidents?: { __typename?: 'UpdateManyPayload', matchedCount: number, modifiedCount: number } | null };

export type InsertIncidentMutationVariables = Exact<{
  data: IncidentInsertType;
}>;


export type InsertIncidentMutation = { __typename?: 'Mutation', insertOneIncident?: { __typename?: 'Incident', incident_id: number } | null };

export type FindLastIncidentQueryVariables = Exact<{ [key: string]: never; }>;


export type FindLastIncidentQuery = { __typename?: 'Query', incidents?: Array<{ __typename?: 'Incident', incident_id: number } | null> | null };

export type FindIncidentFullQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
  translationLanguages: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type FindIncidentFullQuery = { __typename?: 'Query', incident?: { __typename?: 'Incident', incident_id: number, title: string, description?: string | null, date: string, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, flagged_dissimilar_incidents: Array<number | null>, editor_notes: string, epoch_date_modified?: number | null, editors?: Array<{ __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null> | null, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, implicated_systems?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', incident_id?: number | null, similarity?: number | null } | null> | null, reports?: Array<{ __typename?: 'Report', submitters: Array<string | null>, date_published: any, report_number: number, title: string, description?: string | null, url: string, image_url: string, cloudinary_id: string, source_domain: string, text: string, authors: Array<string | null>, epoch_date_submitted: number, language: string, tags: Array<string | null>, inputs_outputs?: Array<string | null> | null } | null> | null, embedding?: { __typename?: 'IncidentEmbedding', from_reports?: Array<number | null> | null, vector?: Array<number | null> | null } | null, tsne?: { __typename?: 'IncidentTsne', x?: number | null, y?: number | null } | null, translations?: Array<{ __typename?: 'IncidentTranslations', description?: string | null, title?: string | null, language?: string | null } | null> | null } | null };

export type FindIncidentHistoryQueryVariables = Exact<{
  filter?: InputMaybe<History_IncidentFilterType>;
}>;


export type FindIncidentHistoryQuery = { __typename?: 'Query', history_incidents?: Array<{ __typename?: 'History_incident', incident_id: number, AllegedDeployerOfAISystem?: Array<string | null> | null, AllegedDeveloperOfAISystem?: Array<string | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<string | null> | null, implicated_systems?: Array<string | null> | null, _id?: any | null, date: string, description?: string | null, modifiedBy?: string | null, editor_dissimilar_incidents?: Array<number | null> | null, editor_notes?: string | null, editor_similar_incidents?: Array<number | null> | null, editors: Array<string | null>, epoch_date_modified?: number | null, flagged_dissimilar_incidents?: Array<number | null> | null, reports: Array<number | null>, title: string, embedding?: { __typename?: 'IncidentEmbedding', from_reports?: Array<number | null> | null, vector?: Array<number | null> | null } | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', incident_id?: number | null, similarity?: number | null } | null> | null, tsne?: { __typename?: 'IncidentTsne', x?: number | null, y?: number | null } | null } | null> | null };

export type FlagIncidentSimilarityMutationVariables = Exact<{
  incidentId: Scalars['Int']['input'];
  dissimilarIds?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
}>;


export type FlagIncidentSimilarityMutation = { __typename?: 'Mutation', flagIncidentSimilarity?: { __typename?: 'Incident', incident_id: number, flagged_dissimilar_incidents: Array<number | null>, editors?: Array<{ __typename?: 'User', userId: string } | null> | null } | null };

export type AllQuickAddQueryVariables = Exact<{
  filter: QuickaddFilterType;
}>;


export type AllQuickAddQuery = { __typename?: 'Query', quickadds?: Array<{ __typename?: 'Quickadd', _id?: any | null, date_submitted: string, url: string, source_domain?: string | null } | null> | null };

export type DeleteOneQuickAddMutationVariables = Exact<{
  filter?: InputMaybe<QuickaddFilterType>;
}>;


export type DeleteOneQuickAddMutation = { __typename?: 'Mutation', deleteManyQuickadds?: { __typename?: 'DeleteManyPayload', deletedCount: number } | null };

export type InsertQuickAddMutationVariables = Exact<{
  data: QuickaddInsertType;
}>;


export type InsertQuickAddMutation = { __typename?: 'Mutation', insertOneQuickadd?: { __typename?: 'Quickadd', _id?: any | null } | null };

export type FindReportQueryVariables = Exact<{
  filter: ReportFilterType;
}>;


export type FindReportQuery = { __typename?: 'Query', report?: { __typename?: 'Report', url: string, title: string, description?: string | null, authors: Array<string | null>, submitters: Array<string | null>, date_published: any, date_downloaded: any, date_modified: any, date_submitted: any, epoch_date_downloaded: number, epoch_date_modified: number, epoch_date_published: number, epoch_date_submitted: number, image_url: string, cloudinary_id: string, text: string, plain_text: string, source_domain: string, tags: Array<string | null>, flag?: boolean | null, report_number: number, editor_notes?: string | null, language: string, is_incident_report?: boolean | null, quiet?: boolean | null, user?: { __typename?: 'User', userId: string } | null, embedding?: { __typename?: 'ReportEmbedding', from_text_hash?: string | null, vector?: Array<number | null> | null } | null } | null };

export type FindReportWithTranslationsQueryVariables = Exact<{
  filter: ReportFilterType;
  translationLanguages: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type FindReportWithTranslationsQuery = { __typename?: 'Query', report?: { __typename?: 'Report', url: string, title: string, authors: Array<string | null>, submitters: Array<string | null>, date_published: any, date_downloaded: any, date_modified: any, image_url: string, text: string, plain_text: string, tags: Array<string | null>, flag?: boolean | null, report_number: number, editor_notes?: string | null, language: string, is_incident_report?: boolean | null, inputs_outputs?: Array<string | null> | null, quiet?: boolean | null, translations?: Array<{ __typename?: 'ReportTranslations', title?: string | null, text?: string | null, language: string } | null> | null } | null };

export type UpdateReportMutationVariables = Exact<{
  filter: ReportFilterType;
  update: ReportUpdateType;
}>;


export type UpdateReportMutation = { __typename?: 'Mutation', updateOneReport?: { __typename?: 'Report', url: string, title: string, authors: Array<string | null>, submitters: Array<string | null>, date_published: any, date_downloaded: any, date_modified: any, epoch_date_published: number, epoch_date_downloaded: number, epoch_date_modified: number, image_url: string, text: string, plain_text: string, tags: Array<string | null>, flag?: boolean | null, report_number: number, editor_notes?: string | null, language: string, quiet?: boolean | null } | null };

export type DeleteOneReportMutationVariables = Exact<{
  filter: ReportFilterType;
}>;


export type DeleteOneReportMutation = { __typename?: 'Mutation', deleteOneReport?: { __typename?: 'Report', report_number: number } | null };

export type LinkReportsToIncidentsMutationVariables = Exact<{
  input: LinkReportsToIncidentsInput;
}>;


export type LinkReportsToIncidentsMutation = { __typename?: 'Mutation', linkReportsToIncidents?: Array<{ __typename?: 'Incident', incident_id: number, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null } | null> | null };

export type FindReportHistoryQueryVariables = Exact<{
  filter?: InputMaybe<History_ReportFilterType>;
}>;


export type FindReportHistoryQuery = { __typename?: 'Query', history_reports?: Array<{ __typename?: 'History_report', _id?: any | null, authors?: Array<string | null> | null, cloudinary_id?: string | null, date_downloaded: any, date_modified: any, date_published: any, date_submitted: any, description?: string | null, editor_notes?: string | null, epoch_date_downloaded?: number | null, epoch_date_modified?: number | null, epoch_date_published?: number | null, epoch_date_submitted?: number | null, flag?: boolean | null, image_url?: string | null, inputs_outputs?: Array<string | null> | null, is_incident_report?: boolean | null, language?: string | null, modifiedBy?: string | null, plain_text?: string | null, report_number?: number | null, submitters?: Array<string | null> | null, tags?: Array<string | null> | null, text?: string | null, title?: string | null, url?: string | null, source_domain?: string | null, user?: string | null, quiet?: boolean | null, embedding?: { __typename?: 'ReportEmbedding', from_text_hash?: string | null, vector?: Array<number | null> | null } | null } | null> | null };

export type FindReportsQueryVariables = Exact<{
  filter: ReportFilterType;
}>;


export type FindReportsQuery = { __typename?: 'Query', reports?: Array<{ __typename?: 'Report', _id?: any | null, submitters: Array<string | null>, date_published: any, report_number: number, title: string, description?: string | null, url: string, image_url: string, cloudinary_id: string, source_domain: string, text: string, authors: Array<string | null>, epoch_date_submitted: number, language: string, tags: Array<string | null>, inputs_outputs?: Array<string | null> | null } | null> | null };

export type FindReportsTableQueryVariables = Exact<{
  filter: ReportFilterType;
}>;


export type FindReportsTableQuery = { __typename?: 'Query', reports?: Array<{ __typename?: 'Report', _id?: any | null, submitters: Array<string | null>, date_published: any, date_downloaded: any, date_submitted: any, date_modified: any, report_number: number, title: string, description?: string | null, url: string, image_url: string, cloudinary_id: string, source_domain: string, text: string, authors: Array<string | null>, epoch_date_submitted: number, language: string, tags: Array<string | null>, inputs_outputs?: Array<string | null> | null, editor_notes?: string | null, is_incident_report?: boolean | null } | null> | null };

export type FlagReportMutationVariables = Exact<{
  report_number: Scalars['Int']['input'];
  input: Scalars['Boolean']['input'];
}>;


export type FlagReportMutation = { __typename?: 'Mutation', flagReport?: { __typename?: 'Report', report_number: number, flag?: boolean | null, date_modified: any, epoch_date_modified: number } | null };

export type DeleteSubmissionMutationVariables = Exact<{
  _id: Scalars['ObjectId']['input'];
}>;


export type DeleteSubmissionMutation = { __typename?: 'Mutation', deleteOneSubmission?: { __typename?: 'Submission', _id?: any | null } | null };

export type FindSubmissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindSubmissionsQuery = { __typename?: 'Query', submissions?: Array<{ __typename?: 'Submission', _id?: any | null, cloudinary_id?: string | null, date_downloaded: string, date_modified: string, date_published: string, date_submitted: string, description?: string | null, image_url: string, incident_date?: string | null, incident_ids?: Array<number | null> | null, incident_title?: string | null, language: string, source_domain: string, text: string, title: string, authors: Array<string | null>, submitters: Array<string | null>, url: string, editor_notes?: string | null, tags: Array<string | null>, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, plain_text?: string | null, status?: string | null, quiet?: boolean | null, incident_editors?: Array<{ __typename?: 'User', first_name?: string | null, last_name?: string | null, userId: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', similarity?: number | null, incident_id?: number | null } | null> | null, developers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, deployers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, harmed_parties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, user?: { __typename?: 'User', userId: string } | null, implicated_systems?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null } | null> | null };

export type FindSubmissionQueryVariables = Exact<{
  filter: SubmissionFilterType;
}>;


export type FindSubmissionQuery = { __typename?: 'Query', submission?: { __typename?: 'Submission', _id?: any | null, cloudinary_id?: string | null, date_downloaded: string, date_modified: string, date_published: string, date_submitted: string, description?: string | null, image_url: string, incident_date?: string | null, incident_ids?: Array<number | null> | null, incident_title?: string | null, language: string, source_domain: string, text: string, title: string, authors: Array<string | null>, submitters: Array<string | null>, url: string, editor_notes?: string | null, tags: Array<string | null>, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, status?: string | null, quiet?: boolean | null, incident_editors?: Array<{ __typename?: 'User', first_name?: string | null, last_name?: string | null, userId: string } | null> | null, developers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, deployers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, harmed_parties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', similarity?: number | null, incident_id?: number | null } | null> | null, implicated_systems?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null } | null };

export type UpdateSubmissionMutationVariables = Exact<{
  filter: SubmissionFilterType;
  update: SubmissionUpdateType;
}>;


export type UpdateSubmissionMutation = { __typename?: 'Mutation', updateOneSubmission?: { __typename?: 'Submission', _id?: any | null, cloudinary_id?: string | null, date_downloaded: string, date_modified: string, date_published: string, date_submitted: string, description?: string | null, image_url: string, incident_date?: string | null, incident_ids?: Array<number | null> | null, incident_title?: string | null, language: string, source_domain: string, text: string, title: string, authors: Array<string | null>, submitters: Array<string | null>, url: string, editor_notes?: string | null, tags: Array<string | null>, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, incident_editors?: Array<{ __typename?: 'User', first_name?: string | null, last_name?: string | null, userId: string } | null> | null, developers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, deployers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, harmed_parties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', similarity?: number | null, incident_id?: number | null } | null> | null, implicated_systems?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null } | null };

export type InsertSubmissionMutationVariables = Exact<{
  data: SubmissionInsertType;
}>;


export type InsertSubmissionMutation = { __typename?: 'Mutation', insertOneSubmission?: { __typename?: 'Submission', _id?: any | null } | null };

export type PromoteSubmissionMutationVariables = Exact<{
  input: PromoteSubmissionToReportInput;
}>;


export type PromoteSubmissionMutation = { __typename?: 'Mutation', promoteSubmissionToReport: { __typename?: 'PromoteSubmissionToReportPayload', incident_ids?: Array<number | null> | null, report_number?: number | null } };

export type UpsertSubscriptionMutationVariables = Exact<{
  filter: SubscriptionFilterType;
  update: SubscriptionInsertType;
}>;


export type UpsertSubscriptionMutation = { __typename?: 'Mutation', upsertOneSubscription?: { __typename?: 'Subscription', _id?: any | null } | null };

export type FindSubscriptionsQueryVariables = Exact<{
  filter: SubscriptionFilterType;
}>;


export type FindSubscriptionsQuery = { __typename?: 'Query', subscriptions?: Array<{ __typename?: 'Subscription', userId?: { __typename?: 'User', userId: string } | null } | null> | null };

export type FindSubscriptionsFullQueryVariables = Exact<{
  filter: SubscriptionFilterType;
}>;


export type FindSubscriptionsFullQuery = { __typename?: 'Query', subscriptions?: Array<{ __typename?: 'Subscription', _id?: any | null, type: string, incident_id?: { __typename?: 'Incident', incident_id: number, title: string } | null, entityId?: { __typename?: 'Entity', entity_id: string, name: string } | null, userId?: { __typename?: 'User', userId: string } | null } | null> | null };

export type DeleteSubscriptionsMutationVariables = Exact<{
  filter: SubscriptionFilterType;
}>;


export type DeleteSubscriptionsMutation = { __typename?: 'Mutation', deleteManySubscriptions?: { __typename?: 'DeleteManyPayload', deletedCount: number } | null };

export type DeleteSubscriptionMutationVariables = Exact<{
  filter: SubscriptionFilterType;
}>;


export type DeleteSubscriptionMutation = { __typename?: 'Mutation', deleteOneSubscription?: { __typename?: 'Subscription', _id?: any | null } | null };

export type FindUserSubscriptionsQueryVariables = Exact<{
  filter: SubscriptionFilterType;
}>;


export type FindUserSubscriptionsQuery = { __typename?: 'Query', subscriptions?: Array<{ __typename?: 'Subscription', _id?: any | null, type: string, incident_id?: { __typename?: 'Incident', incident_id: number, title: string } | null, entityId?: { __typename?: 'Entity', entity_id: string, name: string } | null, userId?: { __typename?: 'User', userId: string } | null } | null> | null };

export type FindUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type FindUsersQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'User', roles: Array<string | null>, userId: string, first_name?: string | null, last_name?: string | null } | null> | null };

export type FindUserQueryVariables = Exact<{
  filter: UserFilterType;
}>;


export type FindUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', roles: Array<string | null>, userId: string, first_name?: string | null, last_name?: string | null, adminData?: { __typename?: 'UserAdminDatum', email: string, disabled: boolean, creationDate: any, lastAuthenticationDate?: any | null } | null } | null };

export type FindUsersByRoleQueryVariables = Exact<{
  role?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type FindUsersByRoleQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'User', roles: Array<string | null>, userId: string, first_name?: string | null, last_name?: string | null } | null> | null };

export type UpdateUserRolesMutationVariables = Exact<{
  roles: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserRolesMutation = { __typename?: 'Mutation', updateOneUser?: { __typename?: 'User', roles: Array<string | null>, userId: string } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  userId?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateOneUser?: { __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null };

export type FindVariantsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindVariantsQuery = { __typename?: 'Query', reports?: Array<{ __typename?: 'Report', submitters: Array<string | null>, date_published: any, report_number: number, title: string, description?: string | null, url: string, image_url: string, cloudinary_id: string, source_domain: string, text: string, plain_text: string, authors: Array<string | null>, epoch_date_downloaded: number, epoch_date_modified: number, epoch_date_published: number, epoch_date_submitted: number, language: string, tags: Array<string | null>, inputs_outputs?: Array<string | null> | null } | null> | null };

export type FindIncidentVariantsQueryVariables = Exact<{
  incident_id: Scalars['Int']['input'];
}>;


export type FindIncidentVariantsQuery = { __typename?: 'Query', incident?: { __typename?: 'Incident', incident_id: number, reports?: Array<{ __typename?: 'Report', report_number: number, title: string, text: string, url: string, source_domain: string, date_published: any, tags: Array<string | null>, inputs_outputs?: Array<string | null> | null } | null> | null } | null };

export type FindVariantQueryVariables = Exact<{
  filter?: InputMaybe<ReportFilterType>;
}>;


export type FindVariantQuery = { __typename?: 'Query', report?: { __typename?: 'Report', report_number: number, title: string, date_published: any, submitters: Array<string | null>, text: string, tags: Array<string | null>, inputs_outputs?: Array<string | null> | null } | null };

export type CreateVariantMutationVariables = Exact<{
  input: CreateVariantInput;
}>;


export type CreateVariantMutation = { __typename?: 'Mutation', createVariant?: { __typename?: 'CreateVariantPayload', incident_id: number, report_number: number } | null };

export type UpdateVariantMutationVariables = Exact<{
  filter: ReportFilterType;
  update: ReportUpdateType;
}>;


export type UpdateVariantMutation = { __typename?: 'Mutation', updateOneReport?: { __typename?: 'Report', url: string, title: string, authors: Array<string | null>, submitters: Array<string | null>, date_published: any, date_downloaded: any, date_modified: any, epoch_date_published: number, epoch_date_downloaded: number, epoch_date_modified: number, image_url: string, text: string, plain_text: string, tags: Array<string | null>, flag?: boolean | null, report_number: number, editor_notes?: string | null, language: string } | null };

export type DeleteOneVariantMutationVariables = Exact<{
  filter: ReportFilterType;
}>;


export type DeleteOneVariantMutation = { __typename?: 'Mutation', deleteOneReport?: { __typename?: 'Report', report_number: number } | null };


export const FindChecklistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findChecklists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ChecklistFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checklists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_created"}},{"kind":"Field","name":{"kind":"Name","value":"date_updated"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"about"}},{"kind":"Field","name":{"kind":"Name","value":"tags_goals"}},{"kind":"Field","name":{"kind":"Name","value":"tags_methods"}},{"kind":"Field","name":{"kind":"Name","value":"tags_other"}},{"kind":"Field","name":{"kind":"Name","value":"risks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"risk_status"}},{"kind":"Field","name":{"kind":"Name","value":"risk_notes"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"likelihood"}},{"kind":"Field","name":{"kind":"Name","value":"touched"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"precedents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindChecklistsQuery, FindChecklistsQueryVariables>;
export const FindChecklistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findChecklist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ChecklistFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checklist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_created"}},{"kind":"Field","name":{"kind":"Name","value":"date_updated"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"about"}},{"kind":"Field","name":{"kind":"Name","value":"tags_goals"}},{"kind":"Field","name":{"kind":"Name","value":"tags_methods"}},{"kind":"Field","name":{"kind":"Name","value":"tags_other"}},{"kind":"Field","name":{"kind":"Name","value":"risks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"risk_status"}},{"kind":"Field","name":{"kind":"Name","value":"risk_notes"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"likelihood"}},{"kind":"Field","name":{"kind":"Name","value":"touched"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"precedents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindChecklistQuery, FindChecklistQueryVariables>;
export const UpsertChecklistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"upsertChecklist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChecklistFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checklist"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChecklistInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertOneChecklist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checklist"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_created"}},{"kind":"Field","name":{"kind":"Name","value":"date_updated"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"about"}},{"kind":"Field","name":{"kind":"Name","value":"tags_goals"}},{"kind":"Field","name":{"kind":"Name","value":"tags_methods"}},{"kind":"Field","name":{"kind":"Name","value":"tags_other"}},{"kind":"Field","name":{"kind":"Name","value":"risks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"risk_status"}},{"kind":"Field","name":{"kind":"Name","value":"risk_notes"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"likelihood"}},{"kind":"Field","name":{"kind":"Name","value":"touched"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"precedents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpsertChecklistMutation, UpsertChecklistMutationVariables>;
export const InsertChecklistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertChecklist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checklist"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChecklistInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertOneChecklist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checklist"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_created"}},{"kind":"Field","name":{"kind":"Name","value":"date_updated"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"about"}},{"kind":"Field","name":{"kind":"Name","value":"tags_goals"}},{"kind":"Field","name":{"kind":"Name","value":"tags_methods"}},{"kind":"Field","name":{"kind":"Name","value":"tags_other"}},{"kind":"Field","name":{"kind":"Name","value":"risks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"risk_status"}},{"kind":"Field","name":{"kind":"Name","value":"risk_notes"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"likelihood"}},{"kind":"Field","name":{"kind":"Name","value":"touched"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"precedents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]} as unknown as DocumentNode<InsertChecklistMutation, InsertChecklistMutationVariables>;
export const DeleteOneChecklistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneChecklist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChecklistFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOneChecklist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteOneChecklistMutation, DeleteOneChecklistMutationVariables>;
export const FindClassificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindClassifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ClassificationFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"namespace"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"short_name"}},{"kind":"Field","name":{"kind":"Name","value":"value_json"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish"}}]}}]}}]} as unknown as DocumentNode<FindClassificationsQuery, FindClassificationsQueryVariables>;
export const UpsertClassificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertClassification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ClassificationFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ClassificationInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertOneClassification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"namespace"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"short_name"}},{"kind":"Field","name":{"kind":"Name","value":"value_json"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish"}}]}}]}}]} as unknown as DocumentNode<UpsertClassificationMutation, UpsertClassificationMutationVariables>;
export const InsertDuplicateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertDuplicate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duplicate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DuplicateInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertOneDuplicate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duplicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duplicate_incident_number"}},{"kind":"Field","name":{"kind":"Name","value":"true_incident_number"}}]}}]}}]} as unknown as DocumentNode<InsertDuplicateMutation, InsertDuplicateMutationVariables>;
export const UpsertEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertOneEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpsertEntityMutation, UpsertEntityMutationVariables>;
export const FindEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<FindEntitiesQuery, FindEntitiesQueryVariables>;
export const FindEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}}]}}]}}]} as unknown as DocumentNode<FindEntityQuery, FindEntityQueryVariables>;
export const UpdateEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOneEntityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEntityAndRelationships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}}]}}]}}]} as unknown as DocumentNode<UpdateEntityMutation, UpdateEntityMutationVariables>;
export const MergeEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MergeEntities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"primaryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secondaryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keepEntity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mergeEntities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"primaryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"primaryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"secondaryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secondaryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"keepEntity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keepEntity"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MergeEntitiesMutation, MergeEntitiesMutationVariables>;
export const SimilarEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SimilarEntities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"threshold"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"similarEntities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"threshold"},"value":{"kind":"Variable","name":{"kind":"Name","value":"threshold"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pairs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entityId1"}},{"kind":"Field","name":{"kind":"Name","value":"entityName1"}},{"kind":"Field","name":{"kind":"Name","value":"entityId2"}},{"kind":"Field","name":{"kind":"Name","value":"entityName2"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}}]}}]}}]} as unknown as DocumentNode<SimilarEntitiesQuery, SimilarEntitiesQueryVariables>;
export const FindEntity_RelationshipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindEntity_relationships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Entity_relationshipFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_relationships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"pred"}},{"kind":"Field","name":{"kind":"Name","value":"sub"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"obj"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"is_symmetric"}}]}}]}}]} as unknown as DocumentNode<FindEntity_RelationshipsQuery, FindEntity_RelationshipsQueryVariables>;
export const UpdateEntity_RelationshipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEntity_relationship"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Entity_relationshipFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Entity_relationshipUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneEntity_relationship"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pred"}},{"kind":"Field","name":{"kind":"Name","value":"sub"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"obj"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEntity_RelationshipMutation, UpdateEntity_RelationshipMutationVariables>;
export const UpdateIncidentTranslationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIncidentTranslation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOneIncidentTranslationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneIncidentTranslation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}}]}}]} as unknown as DocumentNode<UpdateIncidentTranslationMutation, UpdateIncidentTranslationMutationVariables>;
export const FindIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncident"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"implicated_systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_reports"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}}]}}]}}]} as unknown as DocumentNode<FindIncidentQuery, FindIncidentQueryVariables>;
export const FindIncidentsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"implicated_systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentsTableQuery, FindIncidentsTableQueryVariables>;
export const FindIncidentEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentEntities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"implicated_systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentEntitiesQuery, FindIncidentEntitiesQueryVariables>;
export const FindIncidentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"implicated_systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_reports"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentsQuery, FindIncidentsQueryVariables>;
export const FindIncidentsTitlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentsTitles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<FindIncidentsTitlesQuery, FindIncidentsTitlesQueryVariables>;
export const UpdateIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIncident"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneIncident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"implicated_systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_reports"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}}]}}]}}]} as unknown as DocumentNode<UpdateIncidentMutation, UpdateIncidentMutationVariables>;
export const UpdateIncidentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIncidents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateManyIncidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"matchedCount"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedCount"}}]}}]}}]} as unknown as DocumentNode<UpdateIncidentsMutation, UpdateIncidentsMutationVariables>;
export const InsertIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertIncident"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertOneIncident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}}]}}]} as unknown as DocumentNode<InsertIncidentMutation, InsertIncidentMutationVariables>;
export const FindLastIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindLastIncident"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"incident_id"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}},{"kind":"ObjectField","name":{"kind":"Name","value":"skip"},"value":{"kind":"IntValue","value":"0"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}}]}}]} as unknown as DocumentNode<FindLastIncidentQuery, FindLastIncidentQueryVariables>;
export const FindIncidentFullDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentFull"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"translationLanguages"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"implicated_systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_reports"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"tsne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"languages"},"value":{"kind":"Variable","name":{"kind":"Name","value":"translationLanguages"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentFullQuery, FindIncidentFullQueryVariables>;
export const FindIncidentHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"History_incidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"history_incidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"epoch_date_modified"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"}},{"kind":"Field","name":{"kind":"Name","value":"implicated_systems"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editors"}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_reports"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reports"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"tsne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentHistoryQuery, FindIncidentHistoryQueryVariables>;
export const FlagIncidentSimilarityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FlagIncidentSimilarity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"incidentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dissimilarIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flagIncidentSimilarity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"incidentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"incidentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"dissimilarIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dissimilarIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<FlagIncidentSimilarityMutation, FlagIncidentSimilarityMutationVariables>;
export const AllQuickAddDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllQuickAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QuickaddFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quickadds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}}]}}]}}]} as unknown as DocumentNode<AllQuickAddQuery, AllQuickAddQueryVariables>;
export const DeleteOneQuickAddDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneQuickAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QuickaddFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteManyQuickadds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedCount"}}]}}]}}]} as unknown as DocumentNode<DeleteOneQuickAddMutation, DeleteOneQuickAddMutationVariables>;
export const InsertQuickAddDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertQuickAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QuickaddInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertOneQuickadd"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<InsertQuickAddMutation, InsertQuickAddMutationVariables>;
export const FindReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"is_incident_report"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_text_hash"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}}]}}]}}]} as unknown as DocumentNode<FindReportQuery, FindReportQueryVariables>;
export const FindReportWithTranslationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindReportWithTranslations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"translationLanguages"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"is_incident_report"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"languages"},"value":{"kind":"Variable","name":{"kind":"Name","value":"translationLanguages"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]}}]} as unknown as DocumentNode<FindReportWithTranslationsQuery, FindReportWithTranslationsQueryVariables>;
export const UpdateReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}}]}}]}}]} as unknown as DocumentNode<UpdateReportMutation, UpdateReportMutationVariables>;
export const DeleteOneReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOneReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]} as unknown as DocumentNode<DeleteOneReportMutation, DeleteOneReportMutationVariables>;
export const LinkReportsToIncidentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LinkReportsToIncidents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LinkReportsToIncidentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkReportsToIncidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]}}]} as unknown as DocumentNode<LinkReportsToIncidentsMutation, LinkReportsToIncidentsMutationVariables>;
export const FindReportHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindReportHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"History_reportFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"history_reports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"date_modified"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_text_hash"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}},{"kind":"Field","name":{"kind":"Name","value":"is_incident_report"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}}]}}]}}]} as unknown as DocumentNode<FindReportHistoryQuery, FindReportHistoryQueryVariables>;
export const FindReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindReports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}}]}}]}}]} as unknown as DocumentNode<FindReportsQuery, FindReportsQueryVariables>;
export const FindReportsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindReportsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"report_number"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"is_incident_report"}}]}}]}}]} as unknown as DocumentNode<FindReportsTableQuery, FindReportsTableQueryVariables>;
export const FlagReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FlagReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"report_number"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flagReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"report_number"},"value":{"kind":"Variable","name":{"kind":"Name","value":"report_number"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}}]}}]}}]} as unknown as DocumentNode<FlagReportMutation, FlagReportMutationVariables>;
export const DeleteSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ObjectId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOneSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"EQ"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<DeleteSubmissionMutation, DeleteSubmissionMutationVariables>;
export const FindSubmissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindSubmissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"incident_date"}},{"kind":"Field","name":{"kind":"Name","value":"incident_ids"}},{"kind":"Field","name":{"kind":"Name","value":"incident_editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"incident_title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"similarity"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"developers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deployers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"harmed_parties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}},{"kind":"Field","name":{"kind":"Name","value":"implicated_systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<FindSubmissionsQuery, FindSubmissionsQueryVariables>;
export const FindSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"incident_date"}},{"kind":"Field","name":{"kind":"Name","value":"incident_ids"}},{"kind":"Field","name":{"kind":"Name","value":"incident_editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"incident_title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"developers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deployers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"harmed_parties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"similarity"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}},{"kind":"Field","name":{"kind":"Name","value":"implicated_systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<FindSubmissionQuery, FindSubmissionQueryVariables>;
export const UpdateSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"incident_date"}},{"kind":"Field","name":{"kind":"Name","value":"incident_ids"}},{"kind":"Field","name":{"kind":"Name","value":"incident_editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"incident_title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"developers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deployers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"harmed_parties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"similarity"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"implicated_systems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSubmissionMutation, UpdateSubmissionMutationVariables>;
export const InsertSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertOneSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<InsertSubmissionMutation, InsertSubmissionMutationVariables>;
export const PromoteSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PromoteSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PromoteSubmissionToReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promoteSubmissionToReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_ids"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]} as unknown as DocumentNode<PromoteSubmissionMutation, PromoteSubmissionMutationVariables>;
export const UpsertSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertOneSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<UpsertSubscriptionMutation, UpsertSubscriptionMutationVariables>;
export const FindSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindSubscriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<FindSubscriptionsQuery, FindSubscriptionsQueryVariables>;
export const FindSubscriptionsFullDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindSubscriptionsFull"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entityId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"userId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<FindSubscriptionsFullQuery, FindSubscriptionsFullQueryVariables>;
export const DeleteSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSubscriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteManySubscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedCount"}}]}}]}}]} as unknown as DocumentNode<DeleteSubscriptionsMutation, DeleteSubscriptionsMutationVariables>;
export const DeleteSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOneSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<DeleteSubscriptionMutation, DeleteSubscriptionMutationVariables>;
export const FindUserSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUserSubscriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entityId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<FindUserSubscriptionsQuery, FindUserSubscriptionsQueryVariables>;
export const FindUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}}]}}]} as unknown as DocumentNode<FindUsersQuery, FindUsersQueryVariables>;
export const FindUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"adminData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"creationDate"}},{"kind":"Field","name":{"kind":"Name","value":"lastAuthenticationDate"}}]}}]}}]}}]} as unknown as DocumentNode<FindUserQuery, FindUserQueryVariables>;
export const FindUsersByRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUsersByRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"roles"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"IN"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}}]}}]} as unknown as DocumentNode<FindUsersByRoleQuery, FindUsersByRoleQueryVariables>;
export const UpdateUserRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roles"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"EQ"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"roles"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roles"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<UpdateUserRolesMutation, UpdateUserRolesMutationVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first_name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last_name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"EQ"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"first_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first_name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"last_name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last_name"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const FindVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindVariants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"OR"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"EQ"},"value":{"kind":"StringValue","value":"","block":false}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"url"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"EQ"},"value":{"kind":"StringValue","value":"","block":false}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"source_domain"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"EQ"},"value":{"kind":"StringValue","value":"","block":false}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}}]}}]}}]} as unknown as DocumentNode<FindVariantsQuery, FindVariantsQueryVariables>;
export const FindIncidentVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentVariants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"incident_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"incident_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"EQ"},"value":{"kind":"Variable","name":{"kind":"Name","value":"incident_id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentVariantsQuery, FindIncidentVariantsQueryVariables>;
export const FindVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}}]}}]}}]} as unknown as DocumentNode<FindVariantQuery, FindVariantQueryVariables>;
export const CreateVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVariantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]} as unknown as DocumentNode<CreateVariantMutation, CreateVariantMutationVariables>;
export const UpdateVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]} as unknown as DocumentNode<UpdateVariantMutation, UpdateVariantMutationVariables>;
export const DeleteOneVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOneReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]} as unknown as DocumentNode<DeleteOneVariantMutation, DeleteOneVariantMutationVariables>;