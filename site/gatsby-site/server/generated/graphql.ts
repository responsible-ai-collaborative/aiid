import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  Long: { input: bigint; output: bigint; }
  /** Mongo object id scalar type */
  ObjectId: { input: any; output: any; }
};

export type AppUser = {
  __typename?: 'AppUser';
  email?: Maybe<Scalars['String']['output']>;
};

export type Candidate = {
  __typename?: 'Candidate';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  authors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  classification_similarity?: Maybe<Array<Maybe<CandidateClassification_Similarity>>>;
  date_downloaded?: Maybe<Scalars['String']['output']>;
  date_published?: Maybe<Scalars['String']['output']>;
  dismissed?: Maybe<Scalars['Boolean']['output']>;
  embedding?: Maybe<CandidateEmbedding>;
  epoch_date_downloaded?: Maybe<Scalars['Int']['output']>;
  epoch_date_published?: Maybe<Scalars['Int']['output']>;
  image_url?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  match: Scalars['Boolean']['output'];
  matching_entities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  matching_harm_keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  matching_keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  plain_text?: Maybe<Scalars['String']['output']>;
  similarity?: Maybe<Scalars['Float']['output']>;
  source_domain?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type CandidateClassification_Similarity = {
  __typename?: 'CandidateClassification_similarity';
  classification?: Maybe<Scalars['String']['output']>;
  similarity?: Maybe<Scalars['Float']['output']>;
};

export type CandidateClassification_SimilarityInsertInput = {
  classification?: InputMaybe<Scalars['String']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
};

export type CandidateClassification_SimilarityQueryInput = {
  AND?: InputMaybe<Array<CandidateClassification_SimilarityQueryInput>>;
  OR?: InputMaybe<Array<CandidateClassification_SimilarityQueryInput>>;
  classification?: InputMaybe<Scalars['String']['input']>;
  classification_exists?: InputMaybe<Scalars['Boolean']['input']>;
  classification_gt?: InputMaybe<Scalars['String']['input']>;
  classification_gte?: InputMaybe<Scalars['String']['input']>;
  classification_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  classification_lt?: InputMaybe<Scalars['String']['input']>;
  classification_lte?: InputMaybe<Scalars['String']['input']>;
  classification_ne?: InputMaybe<Scalars['String']['input']>;
  classification_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_exists?: InputMaybe<Scalars['Boolean']['input']>;
  similarity_gt?: InputMaybe<Scalars['Float']['input']>;
  similarity_gte?: InputMaybe<Scalars['Float']['input']>;
  similarity_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  similarity_lt?: InputMaybe<Scalars['Float']['input']>;
  similarity_lte?: InputMaybe<Scalars['Float']['input']>;
  similarity_ne?: InputMaybe<Scalars['Float']['input']>;
  similarity_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type CandidateClassification_SimilarityUpdateInput = {
  classification?: InputMaybe<Scalars['String']['input']>;
  classification_unset?: InputMaybe<Scalars['Boolean']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_inc?: InputMaybe<Scalars['Float']['input']>;
  similarity_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CandidateEmbedding = {
  __typename?: 'CandidateEmbedding';
  from_text_hash?: Maybe<Scalars['String']['output']>;
  vector?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type CandidateEmbeddingInsertInput = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type CandidateEmbeddingQueryInput = {
  AND?: InputMaybe<Array<CandidateEmbeddingQueryInput>>;
  OR?: InputMaybe<Array<CandidateEmbeddingQueryInput>>;
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_exists?: InputMaybe<Scalars['Boolean']['input']>;
  from_text_hash_gt?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_gte?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_text_hash_lt?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_lte?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_ne?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_exists?: InputMaybe<Scalars['Boolean']['input']>;
  vector_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type CandidateEmbeddingUpdateInput = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_unset?: InputMaybe<Scalars['Boolean']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CandidateInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  classification_similarity?: InputMaybe<Array<InputMaybe<CandidateClassification_SimilarityInsertInput>>>;
  date_downloaded?: InputMaybe<Scalars['String']['input']>;
  date_published?: InputMaybe<Scalars['String']['input']>;
  dismissed?: InputMaybe<Scalars['Boolean']['input']>;
  embedding?: InputMaybe<CandidateEmbeddingInsertInput>;
  epoch_date_downloaded?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published?: InputMaybe<Scalars['Int']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  match: Scalars['Boolean']['input'];
  matching_entities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_harm_keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
};

export type CandidateQueryInput = {
  AND?: InputMaybe<Array<CandidateQueryInput>>;
  OR?: InputMaybe<Array<CandidateQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_exists?: InputMaybe<Scalars['Boolean']['input']>;
  authors_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  classification_similarity?: InputMaybe<Array<InputMaybe<CandidateClassification_SimilarityQueryInput>>>;
  classification_similarity_exists?: InputMaybe<Scalars['Boolean']['input']>;
  classification_similarity_in?: InputMaybe<Array<InputMaybe<CandidateClassification_SimilarityQueryInput>>>;
  classification_similarity_nin?: InputMaybe<Array<InputMaybe<CandidateClassification_SimilarityQueryInput>>>;
  date_downloaded?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_downloaded_gt?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_gte?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_downloaded_lt?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_lte?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_ne?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_published?: InputMaybe<Scalars['String']['input']>;
  date_published_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_published_gt?: InputMaybe<Scalars['String']['input']>;
  date_published_gte?: InputMaybe<Scalars['String']['input']>;
  date_published_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_published_lt?: InputMaybe<Scalars['String']['input']>;
  date_published_lte?: InputMaybe<Scalars['String']['input']>;
  date_published_ne?: InputMaybe<Scalars['String']['input']>;
  date_published_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  dismissed?: InputMaybe<Scalars['Boolean']['input']>;
  dismissed_exists?: InputMaybe<Scalars['Boolean']['input']>;
  dismissed_ne?: InputMaybe<Scalars['Boolean']['input']>;
  embedding?: InputMaybe<CandidateEmbeddingQueryInput>;
  embedding_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_downloaded?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_downloaded_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_downloaded_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_published?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_published_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_published_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  image_url_exists?: InputMaybe<Scalars['Boolean']['input']>;
  image_url_gt?: InputMaybe<Scalars['String']['input']>;
  image_url_gte?: InputMaybe<Scalars['String']['input']>;
  image_url_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  image_url_lt?: InputMaybe<Scalars['String']['input']>;
  image_url_lte?: InputMaybe<Scalars['String']['input']>;
  image_url_ne?: InputMaybe<Scalars['String']['input']>;
  image_url_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  language?: InputMaybe<Scalars['String']['input']>;
  language_exists?: InputMaybe<Scalars['Boolean']['input']>;
  language_gt?: InputMaybe<Scalars['String']['input']>;
  language_gte?: InputMaybe<Scalars['String']['input']>;
  language_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  language_lt?: InputMaybe<Scalars['String']['input']>;
  language_lte?: InputMaybe<Scalars['String']['input']>;
  language_ne?: InputMaybe<Scalars['String']['input']>;
  language_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  match?: InputMaybe<Scalars['Boolean']['input']>;
  match_exists?: InputMaybe<Scalars['Boolean']['input']>;
  match_ne?: InputMaybe<Scalars['Boolean']['input']>;
  matching_entities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_entities_exists?: InputMaybe<Scalars['Boolean']['input']>;
  matching_entities_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_entities_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_harm_keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_harm_keywords_exists?: InputMaybe<Scalars['Boolean']['input']>;
  matching_harm_keywords_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_harm_keywords_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_keywords_exists?: InputMaybe<Scalars['Boolean']['input']>;
  matching_keywords_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_keywords_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  plain_text_exists?: InputMaybe<Scalars['Boolean']['input']>;
  plain_text_gt?: InputMaybe<Scalars['String']['input']>;
  plain_text_gte?: InputMaybe<Scalars['String']['input']>;
  plain_text_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plain_text_lt?: InputMaybe<Scalars['String']['input']>;
  plain_text_lte?: InputMaybe<Scalars['String']['input']>;
  plain_text_ne?: InputMaybe<Scalars['String']['input']>;
  plain_text_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_exists?: InputMaybe<Scalars['Boolean']['input']>;
  similarity_gt?: InputMaybe<Scalars['Float']['input']>;
  similarity_gte?: InputMaybe<Scalars['Float']['input']>;
  similarity_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  similarity_lt?: InputMaybe<Scalars['Float']['input']>;
  similarity_lte?: InputMaybe<Scalars['Float']['input']>;
  similarity_ne?: InputMaybe<Scalars['Float']['input']>;
  similarity_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  source_domain_exists?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain_gt?: InputMaybe<Scalars['String']['input']>;
  source_domain_gte?: InputMaybe<Scalars['String']['input']>;
  source_domain_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  source_domain_lt?: InputMaybe<Scalars['String']['input']>;
  source_domain_lte?: InputMaybe<Scalars['String']['input']>;
  source_domain_ne?: InputMaybe<Scalars['String']['input']>;
  source_domain_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
  text_exists?: InputMaybe<Scalars['Boolean']['input']>;
  text_gt?: InputMaybe<Scalars['String']['input']>;
  text_gte?: InputMaybe<Scalars['String']['input']>;
  text_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text_lt?: InputMaybe<Scalars['String']['input']>;
  text_lte?: InputMaybe<Scalars['String']['input']>;
  text_ne?: InputMaybe<Scalars['String']['input']>;
  text_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_ne?: InputMaybe<Scalars['String']['input']>;
  title_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  url?: InputMaybe<Scalars['String']['input']>;
  url_exists?: InputMaybe<Scalars['Boolean']['input']>;
  url_gt?: InputMaybe<Scalars['String']['input']>;
  url_gte?: InputMaybe<Scalars['String']['input']>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  url_lt?: InputMaybe<Scalars['String']['input']>;
  url_lte?: InputMaybe<Scalars['String']['input']>;
  url_ne?: InputMaybe<Scalars['String']['input']>;
  url_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export enum CandidateSortByInput {
  DateDownloadedAsc = 'DATE_DOWNLOADED_ASC',
  DateDownloadedDesc = 'DATE_DOWNLOADED_DESC',
  DatePublishedAsc = 'DATE_PUBLISHED_ASC',
  DatePublishedDesc = 'DATE_PUBLISHED_DESC',
  EpochDateDownloadedAsc = 'EPOCH_DATE_DOWNLOADED_ASC',
  EpochDateDownloadedDesc = 'EPOCH_DATE_DOWNLOADED_DESC',
  EpochDatePublishedAsc = 'EPOCH_DATE_PUBLISHED_ASC',
  EpochDatePublishedDesc = 'EPOCH_DATE_PUBLISHED_DESC',
  ImageUrlAsc = 'IMAGE_URL_ASC',
  ImageUrlDesc = 'IMAGE_URL_DESC',
  LanguageAsc = 'LANGUAGE_ASC',
  LanguageDesc = 'LANGUAGE_DESC',
  PlainTextAsc = 'PLAIN_TEXT_ASC',
  PlainTextDesc = 'PLAIN_TEXT_DESC',
  SimilarityAsc = 'SIMILARITY_ASC',
  SimilarityDesc = 'SIMILARITY_DESC',
  SourceDomainAsc = 'SOURCE_DOMAIN_ASC',
  SourceDomainDesc = 'SOURCE_DOMAIN_DESC',
  TextAsc = 'TEXT_ASC',
  TextDesc = 'TEXT_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type CandidateUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_unset?: InputMaybe<Scalars['Boolean']['input']>;
  classification_similarity?: InputMaybe<Array<InputMaybe<CandidateClassification_SimilarityUpdateInput>>>;
  classification_similarity_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_downloaded?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_published?: InputMaybe<Scalars['String']['input']>;
  date_published_unset?: InputMaybe<Scalars['Boolean']['input']>;
  dismissed?: InputMaybe<Scalars['Boolean']['input']>;
  dismissed_unset?: InputMaybe<Scalars['Boolean']['input']>;
  embedding?: InputMaybe<CandidateEmbeddingUpdateInput>;
  embedding_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_downloaded?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_published?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_unset?: InputMaybe<Scalars['Boolean']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  image_url_unset?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  language_unset?: InputMaybe<Scalars['Boolean']['input']>;
  match?: InputMaybe<Scalars['Boolean']['input']>;
  match_unset?: InputMaybe<Scalars['Boolean']['input']>;
  matching_entities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_entities_unset?: InputMaybe<Scalars['Boolean']['input']>;
  matching_harm_keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_harm_keywords_unset?: InputMaybe<Scalars['Boolean']['input']>;
  matching_keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  matching_keywords_unset?: InputMaybe<Scalars['Boolean']['input']>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  plain_text_unset?: InputMaybe<Scalars['Boolean']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_inc?: InputMaybe<Scalars['Float']['input']>;
  similarity_unset?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  source_domain_unset?: InputMaybe<Scalars['Boolean']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  text_unset?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_unset?: InputMaybe<Scalars['Boolean']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  url_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Checklist = {
  __typename?: 'Checklist';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  about?: Maybe<Scalars['String']['output']>;
  date_created?: Maybe<Scalars['DateTime']['output']>;
  date_updated?: Maybe<Scalars['DateTime']['output']>;
  entity_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  owner_id?: Maybe<Scalars['String']['output']>;
  risks?: Maybe<Array<Maybe<ChecklistRisk>>>;
  tags_goals?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tags_methods?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tags_other?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ChecklistInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  about?: InputMaybe<Scalars['String']['input']>;
  date_created?: InputMaybe<Scalars['DateTime']['input']>;
  date_updated?: InputMaybe<Scalars['DateTime']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  risks?: InputMaybe<Array<InputMaybe<ChecklistRiskInsertInput>>>;
  tags_goals?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_methods?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_other?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ChecklistQueryInput = {
  AND?: InputMaybe<Array<ChecklistQueryInput>>;
  OR?: InputMaybe<Array<ChecklistQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  about?: InputMaybe<Scalars['String']['input']>;
  about_exists?: InputMaybe<Scalars['Boolean']['input']>;
  about_gt?: InputMaybe<Scalars['String']['input']>;
  about_gte?: InputMaybe<Scalars['String']['input']>;
  about_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  about_lt?: InputMaybe<Scalars['String']['input']>;
  about_lte?: InputMaybe<Scalars['String']['input']>;
  about_ne?: InputMaybe<Scalars['String']['input']>;
  about_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_created?: InputMaybe<Scalars['DateTime']['input']>;
  date_created_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_created_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_created_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_created_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_created_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_created_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_created_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_created_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_updated?: InputMaybe<Scalars['DateTime']['input']>;
  date_updated_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_updated_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_updated_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_updated_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_updated_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_updated_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_updated_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_updated_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  entity_id_gt?: InputMaybe<Scalars['String']['input']>;
  entity_id_gte?: InputMaybe<Scalars['String']['input']>;
  entity_id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  entity_id_lt?: InputMaybe<Scalars['String']['input']>;
  entity_id_lte?: InputMaybe<Scalars['String']['input']>;
  entity_id_ne?: InputMaybe<Scalars['String']['input']>;
  entity_id_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_ne?: InputMaybe<Scalars['String']['input']>;
  id_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_ne?: InputMaybe<Scalars['String']['input']>;
  name_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  owner_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  owner_id_gt?: InputMaybe<Scalars['String']['input']>;
  owner_id_gte?: InputMaybe<Scalars['String']['input']>;
  owner_id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  owner_id_lt?: InputMaybe<Scalars['String']['input']>;
  owner_id_lte?: InputMaybe<Scalars['String']['input']>;
  owner_id_ne?: InputMaybe<Scalars['String']['input']>;
  owner_id_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  risks?: InputMaybe<Array<InputMaybe<ChecklistRiskQueryInput>>>;
  risks_exists?: InputMaybe<Scalars['Boolean']['input']>;
  risks_in?: InputMaybe<Array<InputMaybe<ChecklistRiskQueryInput>>>;
  risks_nin?: InputMaybe<Array<InputMaybe<ChecklistRiskQueryInput>>>;
  tags_goals?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_goals_exists?: InputMaybe<Scalars['Boolean']['input']>;
  tags_goals_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_goals_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_methods?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_methods_exists?: InputMaybe<Scalars['Boolean']['input']>;
  tags_methods_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_methods_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_other?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_other_exists?: InputMaybe<Scalars['Boolean']['input']>;
  tags_other_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_other_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ChecklistRisk = {
  __typename?: 'ChecklistRisk';
  generated?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  likelihood?: Maybe<Scalars['String']['output']>;
  precedents?: Maybe<Array<Maybe<ChecklistRiskPrecedent>>>;
  risk_notes?: Maybe<Scalars['String']['output']>;
  risk_status?: Maybe<Scalars['String']['output']>;
  severity?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
  touched?: Maybe<Scalars['Boolean']['output']>;
};

export type ChecklistRiskInsertInput = {
  generated?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  likelihood?: InputMaybe<Scalars['String']['input']>;
  precedents?: InputMaybe<Array<InputMaybe<ChecklistRiskPrecedentInsertInput>>>;
  risk_notes?: InputMaybe<Scalars['String']['input']>;
  risk_status?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  touched?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ChecklistRiskPrecedent = {
  __typename?: 'ChecklistRiskPrecedent';
  description?: Maybe<Scalars['String']['output']>;
  incident_id?: Maybe<Scalars['Int']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ChecklistRiskPrecedentInsertInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ChecklistRiskPrecedentQueryInput = {
  AND?: InputMaybe<Array<ChecklistRiskPrecedentQueryInput>>;
  OR?: InputMaybe<Array<ChecklistRiskPrecedentQueryInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_ne?: InputMaybe<Scalars['String']['input']>;
  description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id_gt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_gte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id_lt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_lte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_ne?: InputMaybe<Scalars['Int']['input']>;
  incident_id_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_exists?: InputMaybe<Scalars['Boolean']['input']>;
  tags_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_ne?: InputMaybe<Scalars['String']['input']>;
  title_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ChecklistRiskPrecedentUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_inc?: InputMaybe<Scalars['Int']['input']>;
  incident_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_unset?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ChecklistRiskQueryInput = {
  AND?: InputMaybe<Array<ChecklistRiskQueryInput>>;
  OR?: InputMaybe<Array<ChecklistRiskQueryInput>>;
  generated?: InputMaybe<Scalars['Boolean']['input']>;
  generated_exists?: InputMaybe<Scalars['Boolean']['input']>;
  generated_ne?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_ne?: InputMaybe<Scalars['String']['input']>;
  id_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  likelihood?: InputMaybe<Scalars['String']['input']>;
  likelihood_exists?: InputMaybe<Scalars['Boolean']['input']>;
  likelihood_gt?: InputMaybe<Scalars['String']['input']>;
  likelihood_gte?: InputMaybe<Scalars['String']['input']>;
  likelihood_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  likelihood_lt?: InputMaybe<Scalars['String']['input']>;
  likelihood_lte?: InputMaybe<Scalars['String']['input']>;
  likelihood_ne?: InputMaybe<Scalars['String']['input']>;
  likelihood_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  precedents?: InputMaybe<Array<InputMaybe<ChecklistRiskPrecedentQueryInput>>>;
  precedents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  precedents_in?: InputMaybe<Array<InputMaybe<ChecklistRiskPrecedentQueryInput>>>;
  precedents_nin?: InputMaybe<Array<InputMaybe<ChecklistRiskPrecedentQueryInput>>>;
  risk_notes?: InputMaybe<Scalars['String']['input']>;
  risk_notes_exists?: InputMaybe<Scalars['Boolean']['input']>;
  risk_notes_gt?: InputMaybe<Scalars['String']['input']>;
  risk_notes_gte?: InputMaybe<Scalars['String']['input']>;
  risk_notes_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  risk_notes_lt?: InputMaybe<Scalars['String']['input']>;
  risk_notes_lte?: InputMaybe<Scalars['String']['input']>;
  risk_notes_ne?: InputMaybe<Scalars['String']['input']>;
  risk_notes_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  risk_status?: InputMaybe<Scalars['String']['input']>;
  risk_status_exists?: InputMaybe<Scalars['Boolean']['input']>;
  risk_status_gt?: InputMaybe<Scalars['String']['input']>;
  risk_status_gte?: InputMaybe<Scalars['String']['input']>;
  risk_status_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  risk_status_lt?: InputMaybe<Scalars['String']['input']>;
  risk_status_lte?: InputMaybe<Scalars['String']['input']>;
  risk_status_ne?: InputMaybe<Scalars['String']['input']>;
  risk_status_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  severity?: InputMaybe<Scalars['String']['input']>;
  severity_exists?: InputMaybe<Scalars['Boolean']['input']>;
  severity_gt?: InputMaybe<Scalars['String']['input']>;
  severity_gte?: InputMaybe<Scalars['String']['input']>;
  severity_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  severity_lt?: InputMaybe<Scalars['String']['input']>;
  severity_lte?: InputMaybe<Scalars['String']['input']>;
  severity_ne?: InputMaybe<Scalars['String']['input']>;
  severity_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_exists?: InputMaybe<Scalars['Boolean']['input']>;
  tags_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_ne?: InputMaybe<Scalars['String']['input']>;
  title_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  touched?: InputMaybe<Scalars['Boolean']['input']>;
  touched_exists?: InputMaybe<Scalars['Boolean']['input']>;
  touched_ne?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ChecklistRiskUpdateInput = {
  generated?: InputMaybe<Scalars['Boolean']['input']>;
  generated_unset?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  likelihood?: InputMaybe<Scalars['String']['input']>;
  likelihood_unset?: InputMaybe<Scalars['Boolean']['input']>;
  precedents?: InputMaybe<Array<InputMaybe<ChecklistRiskPrecedentUpdateInput>>>;
  precedents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  risk_notes?: InputMaybe<Scalars['String']['input']>;
  risk_notes_unset?: InputMaybe<Scalars['Boolean']['input']>;
  risk_status?: InputMaybe<Scalars['String']['input']>;
  risk_status_unset?: InputMaybe<Scalars['Boolean']['input']>;
  severity?: InputMaybe<Scalars['String']['input']>;
  severity_unset?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_unset?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_unset?: InputMaybe<Scalars['Boolean']['input']>;
  touched?: InputMaybe<Scalars['Boolean']['input']>;
  touched_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum ChecklistSortByInput {
  AboutAsc = 'ABOUT_ASC',
  AboutDesc = 'ABOUT_DESC',
  DateCreatedAsc = 'DATE_CREATED_ASC',
  DateCreatedDesc = 'DATE_CREATED_DESC',
  DateUpdatedAsc = 'DATE_UPDATED_ASC',
  DateUpdatedDesc = 'DATE_UPDATED_DESC',
  EntityIdAsc = 'ENTITY_ID_ASC',
  EntityIdDesc = 'ENTITY_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  OwnerIdAsc = 'OWNER_ID_ASC',
  OwnerIdDesc = 'OWNER_ID_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type ChecklistUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  about?: InputMaybe<Scalars['String']['input']>;
  about_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_created?: InputMaybe<Scalars['DateTime']['input']>;
  date_created_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_updated?: InputMaybe<Scalars['DateTime']['input']>;
  date_updated_unset?: InputMaybe<Scalars['Boolean']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_unset?: InputMaybe<Scalars['Boolean']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  owner_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  risks?: InputMaybe<Array<InputMaybe<ChecklistRiskUpdateInput>>>;
  risks_unset?: InputMaybe<Scalars['Boolean']['input']>;
  tags_goals?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_goals_unset?: InputMaybe<Scalars['Boolean']['input']>;
  tags_methods?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_methods_unset?: InputMaybe<Scalars['Boolean']['input']>;
  tags_other?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_other_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Classification = {
  __typename?: 'Classification';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  attributes?: Maybe<Array<Maybe<ClassificationAttribute>>>;
  incidents: Array<Maybe<Incident>>;
  namespace: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  publish?: Maybe<Scalars['Boolean']['output']>;
  reports: Array<Maybe<Report>>;
};

export type ClassificationAttribute = {
  __typename?: 'ClassificationAttribute';
  short_name?: Maybe<Scalars['String']['output']>;
  value_json?: Maybe<Scalars['String']['output']>;
};

export type ClassificationAttributeInsertInput = {
  short_name?: InputMaybe<Scalars['String']['input']>;
  value_json?: InputMaybe<Scalars['String']['input']>;
};

export type ClassificationAttributeQueryInput = {
  AND?: InputMaybe<Array<ClassificationAttributeQueryInput>>;
  OR?: InputMaybe<Array<ClassificationAttributeQueryInput>>;
  short_name?: InputMaybe<Scalars['String']['input']>;
  short_name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  short_name_gt?: InputMaybe<Scalars['String']['input']>;
  short_name_gte?: InputMaybe<Scalars['String']['input']>;
  short_name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  short_name_lt?: InputMaybe<Scalars['String']['input']>;
  short_name_lte?: InputMaybe<Scalars['String']['input']>;
  short_name_ne?: InputMaybe<Scalars['String']['input']>;
  short_name_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  value_json?: InputMaybe<Scalars['String']['input']>;
  value_json_exists?: InputMaybe<Scalars['Boolean']['input']>;
  value_json_gt?: InputMaybe<Scalars['String']['input']>;
  value_json_gte?: InputMaybe<Scalars['String']['input']>;
  value_json_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  value_json_lt?: InputMaybe<Scalars['String']['input']>;
  value_json_lte?: InputMaybe<Scalars['String']['input']>;
  value_json_ne?: InputMaybe<Scalars['String']['input']>;
  value_json_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ClassificationAttributeUpdateInput = {
  short_name?: InputMaybe<Scalars['String']['input']>;
  short_name_unset?: InputMaybe<Scalars['Boolean']['input']>;
  value_json?: InputMaybe<Scalars['String']['input']>;
  value_json_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ClassificationIncidentsRelationInput = {
  create?: InputMaybe<Array<InputMaybe<IncidentInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type ClassificationInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  attributes?: InputMaybe<Array<InputMaybe<ClassificationAttributeInsertInput>>>;
  incidents: ClassificationIncidentsRelationInput;
  namespace: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  publish?: InputMaybe<Scalars['Boolean']['input']>;
  reports: ClassificationReportsRelationInput;
};

export type ClassificationQueryInput = {
  AND?: InputMaybe<Array<ClassificationQueryInput>>;
  OR?: InputMaybe<Array<ClassificationQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  attributes?: InputMaybe<Array<InputMaybe<ClassificationAttributeQueryInput>>>;
  attributes_exists?: InputMaybe<Scalars['Boolean']['input']>;
  attributes_in?: InputMaybe<Array<InputMaybe<ClassificationAttributeQueryInput>>>;
  attributes_nin?: InputMaybe<Array<InputMaybe<ClassificationAttributeQueryInput>>>;
  incidents?: InputMaybe<Array<InputMaybe<IncidentQueryInput>>>;
  incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incidents_in?: InputMaybe<Array<InputMaybe<IncidentQueryInput>>>;
  incidents_nin?: InputMaybe<Array<InputMaybe<IncidentQueryInput>>>;
  namespace?: InputMaybe<Scalars['String']['input']>;
  namespace_exists?: InputMaybe<Scalars['Boolean']['input']>;
  namespace_gt?: InputMaybe<Scalars['String']['input']>;
  namespace_gte?: InputMaybe<Scalars['String']['input']>;
  namespace_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  namespace_lt?: InputMaybe<Scalars['String']['input']>;
  namespace_lte?: InputMaybe<Scalars['String']['input']>;
  namespace_ne?: InputMaybe<Scalars['String']['input']>;
  namespace_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  notes_exists?: InputMaybe<Scalars['Boolean']['input']>;
  notes_gt?: InputMaybe<Scalars['String']['input']>;
  notes_gte?: InputMaybe<Scalars['String']['input']>;
  notes_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notes_lt?: InputMaybe<Scalars['String']['input']>;
  notes_lte?: InputMaybe<Scalars['String']['input']>;
  notes_ne?: InputMaybe<Scalars['String']['input']>;
  notes_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  publish?: InputMaybe<Scalars['Boolean']['input']>;
  publish_exists?: InputMaybe<Scalars['Boolean']['input']>;
  publish_ne?: InputMaybe<Scalars['Boolean']['input']>;
  reports?: InputMaybe<Array<InputMaybe<ReportQueryInput>>>;
  reports_exists?: InputMaybe<Scalars['Boolean']['input']>;
  reports_in?: InputMaybe<Array<InputMaybe<ReportQueryInput>>>;
  reports_nin?: InputMaybe<Array<InputMaybe<ReportQueryInput>>>;
};

export type ClassificationReportsRelationInput = {
  create?: InputMaybe<Array<InputMaybe<ReportInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export enum ClassificationSortByInput {
  NamespaceAsc = 'NAMESPACE_ASC',
  NamespaceDesc = 'NAMESPACE_DESC',
  NotesAsc = 'NOTES_ASC',
  NotesDesc = 'NOTES_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type ClassificationUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  attributes?: InputMaybe<Array<InputMaybe<ClassificationAttributeUpdateInput>>>;
  attributes_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incidents?: InputMaybe<ClassificationIncidentsRelationInput>;
  incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  namespace?: InputMaybe<Scalars['String']['input']>;
  namespace_unset?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  notes_unset?: InputMaybe<Scalars['Boolean']['input']>;
  publish?: InputMaybe<Scalars['Boolean']['input']>;
  publish_unset?: InputMaybe<Scalars['Boolean']['input']>;
  reports?: InputMaybe<ClassificationReportsRelationInput>;
  reports_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateDefaultAdminUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVariantInput = {
  incidentId?: InputMaybe<Scalars['Int']['input']>;
  variant?: InputMaybe<CreateVariantInputVariant>;
};

export type CreateVariantInputVariant = {
  date_published?: InputMaybe<Scalars['String']['input']>;
  inputs_outputs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type CreateVariantPayload = {
  __typename?: 'CreateVariantPayload';
  incident_id?: Maybe<Scalars['Int']['output']>;
  report_number?: Maybe<Scalars['Int']['output']>;
};

export type DefaultAdminUser = {
  __typename?: 'DefaultAdminUser';
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type DeleteManyPayload = {
  __typename?: 'DeleteManyPayload';
  deletedCount: Scalars['Int']['output'];
};

export type Duplicate = {
  __typename?: 'Duplicate';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  duplicate_incident_number?: Maybe<Scalars['Int']['output']>;
  true_incident_number?: Maybe<Scalars['Int']['output']>;
};

export type DuplicateInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  duplicate_incident_number?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number?: InputMaybe<Scalars['Int']['input']>;
};

export type DuplicateQueryInput = {
  AND?: InputMaybe<Array<DuplicateQueryInput>>;
  OR?: InputMaybe<Array<DuplicateQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  duplicate_incident_number?: InputMaybe<Scalars['Int']['input']>;
  duplicate_incident_number_exists?: InputMaybe<Scalars['Boolean']['input']>;
  duplicate_incident_number_gt?: InputMaybe<Scalars['Int']['input']>;
  duplicate_incident_number_gte?: InputMaybe<Scalars['Int']['input']>;
  duplicate_incident_number_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  duplicate_incident_number_lt?: InputMaybe<Scalars['Int']['input']>;
  duplicate_incident_number_lte?: InputMaybe<Scalars['Int']['input']>;
  duplicate_incident_number_ne?: InputMaybe<Scalars['Int']['input']>;
  duplicate_incident_number_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  true_incident_number?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number_exists?: InputMaybe<Scalars['Boolean']['input']>;
  true_incident_number_gt?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number_gte?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  true_incident_number_lt?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number_lte?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number_ne?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export enum DuplicateSortByInput {
  DuplicateIncidentNumberAsc = 'DUPLICATE_INCIDENT_NUMBER_ASC',
  DuplicateIncidentNumberDesc = 'DUPLICATE_INCIDENT_NUMBER_DESC',
  TrueIncidentNumberAsc = 'TRUE_INCIDENT_NUMBER_ASC',
  TrueIncidentNumberDesc = 'TRUE_INCIDENT_NUMBER_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type DuplicateUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  duplicate_incident_number?: InputMaybe<Scalars['Int']['input']>;
  duplicate_incident_number_inc?: InputMaybe<Scalars['Int']['input']>;
  duplicate_incident_number_unset?: InputMaybe<Scalars['Boolean']['input']>;
  true_incident_number?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number_inc?: InputMaybe<Scalars['Int']['input']>;
  true_incident_number_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Entity = {
  __typename?: 'Entity';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  date_modified?: Maybe<Scalars['DateTime']['output']>;
  entity_id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type EntityInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  entity_id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type EntityQueryInput = {
  AND?: InputMaybe<Array<EntityQueryInput>>;
  OR?: InputMaybe<Array<EntityQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_exists?: InputMaybe<Scalars['Boolean']['input']>;
  created_at_gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  created_at_lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_lte?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_ne?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_modified_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_modified_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  entity_id_gt?: InputMaybe<Scalars['String']['input']>;
  entity_id_gte?: InputMaybe<Scalars['String']['input']>;
  entity_id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  entity_id_lt?: InputMaybe<Scalars['String']['input']>;
  entity_id_lte?: InputMaybe<Scalars['String']['input']>;
  entity_id_ne?: InputMaybe<Scalars['String']['input']>;
  entity_id_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_ne?: InputMaybe<Scalars['String']['input']>;
  name_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export enum EntitySortByInput {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DateModifiedAsc = 'DATE_MODIFIED_ASC',
  DateModifiedDesc = 'DATE_MODIFIED_DESC',
  EntityIdAsc = 'ENTITY_ID_ASC',
  EntityIdDesc = 'ENTITY_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type EntityUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  created_at_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_unset?: InputMaybe<Scalars['Boolean']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GetUserInput = {
  userId?: InputMaybe<Scalars['ObjectId']['input']>;
};

export type History_Incident = {
  __typename?: 'History_incident';
  AllegedDeployerOfAISystem?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  AllegedDeveloperOfAISystem?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  AllegedHarmedOrNearlyHarmedParties?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  _id?: Maybe<Scalars['ObjectId']['output']>;
  date: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  editor_dissimilar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editor_notes?: Maybe<Scalars['String']['output']>;
  editor_similar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editors: Array<Maybe<Scalars['String']['output']>>;
  embedding?: Maybe<History_IncidentEmbedding>;
  epoch_date_modified?: Maybe<Scalars['Int']['output']>;
  flagged_dissimilar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  incident_id: Scalars['Int']['output'];
  modifiedBy?: Maybe<Scalars['String']['output']>;
  nlp_similar_incidents?: Maybe<Array<Maybe<History_IncidentNlp_Similar_Incident>>>;
  reports: Array<Maybe<Scalars['Int']['output']>>;
  title: Scalars['String']['output'];
  tsne?: Maybe<History_IncidentTsne>;
};

export type History_IncidentEmbedding = {
  __typename?: 'History_incidentEmbedding';
  from_reports?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  vector?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type History_IncidentEmbeddingInsertInput = {
  from_reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type History_IncidentEmbeddingQueryInput = {
  AND?: InputMaybe<Array<History_IncidentEmbeddingQueryInput>>;
  OR?: InputMaybe<Array<History_IncidentEmbeddingQueryInput>>;
  from_reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  from_reports_exists?: InputMaybe<Scalars['Boolean']['input']>;
  from_reports_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  from_reports_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_exists?: InputMaybe<Scalars['Boolean']['input']>;
  vector_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type History_IncidentEmbeddingUpdateInput = {
  from_reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  from_reports_unset?: InputMaybe<Scalars['Boolean']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type History_IncidentInsertInput = {
  AllegedDeployerOfAISystem?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedDeveloperOfAISystem?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  date: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editors: Array<InputMaybe<Scalars['String']['input']>>;
  embedding?: InputMaybe<History_IncidentEmbeddingInsertInput>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  flagged_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id: Scalars['Int']['input'];
  modifiedBy?: InputMaybe<Scalars['String']['input']>;
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<History_IncidentNlp_Similar_IncidentInsertInput>>>;
  reports: Array<InputMaybe<Scalars['Int']['input']>>;
  title: Scalars['String']['input'];
  tsne?: InputMaybe<History_IncidentTsneInsertInput>;
};

export type History_IncidentNlp_Similar_Incident = {
  __typename?: 'History_incidentNlp_similar_incident';
  incident_id?: Maybe<Scalars['Int']['output']>;
  similarity?: Maybe<Scalars['Float']['output']>;
};

export type History_IncidentNlp_Similar_IncidentInsertInput = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
};

export type History_IncidentNlp_Similar_IncidentQueryInput = {
  AND?: InputMaybe<Array<History_IncidentNlp_Similar_IncidentQueryInput>>;
  OR?: InputMaybe<Array<History_IncidentNlp_Similar_IncidentQueryInput>>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id_gt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_gte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id_lt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_lte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_ne?: InputMaybe<Scalars['Int']['input']>;
  incident_id_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_exists?: InputMaybe<Scalars['Boolean']['input']>;
  similarity_gt?: InputMaybe<Scalars['Float']['input']>;
  similarity_gte?: InputMaybe<Scalars['Float']['input']>;
  similarity_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  similarity_lt?: InputMaybe<Scalars['Float']['input']>;
  similarity_lte?: InputMaybe<Scalars['Float']['input']>;
  similarity_ne?: InputMaybe<Scalars['Float']['input']>;
  similarity_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type History_IncidentNlp_Similar_IncidentUpdateInput = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_inc?: InputMaybe<Scalars['Int']['input']>;
  incident_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_inc?: InputMaybe<Scalars['Float']['input']>;
  similarity_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type History_IncidentQueryInput = {
  AND?: InputMaybe<Array<History_IncidentQueryInput>>;
  AllegedDeployerOfAISystem?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedDeployerOfAISystem_exists?: InputMaybe<Scalars['Boolean']['input']>;
  AllegedDeployerOfAISystem_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedDeployerOfAISystem_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedDeveloperOfAISystem?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedDeveloperOfAISystem_exists?: InputMaybe<Scalars['Boolean']['input']>;
  AllegedDeveloperOfAISystem_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedDeveloperOfAISystem_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedHarmedOrNearlyHarmedParties_exists?: InputMaybe<Scalars['Boolean']['input']>;
  AllegedHarmedOrNearlyHarmedParties_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedHarmedOrNearlyHarmedParties_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  OR?: InputMaybe<Array<History_IncidentQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  date?: InputMaybe<Scalars['String']['input']>;
  date_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_gt?: InputMaybe<Scalars['String']['input']>;
  date_gte?: InputMaybe<Scalars['String']['input']>;
  date_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_lt?: InputMaybe<Scalars['String']['input']>;
  date_lte?: InputMaybe<Scalars['String']['input']>;
  date_ne?: InputMaybe<Scalars['String']['input']>;
  date_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_ne?: InputMaybe<Scalars['String']['input']>;
  description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_dissimilar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_dissimilar_incidents_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_dissimilar_incidents_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_notes_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_notes_gt?: InputMaybe<Scalars['String']['input']>;
  editor_notes_gte?: InputMaybe<Scalars['String']['input']>;
  editor_notes_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_notes_lt?: InputMaybe<Scalars['String']['input']>;
  editor_notes_lte?: InputMaybe<Scalars['String']['input']>;
  editor_notes_ne?: InputMaybe<Scalars['String']['input']>;
  editor_notes_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_similar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_similar_incidents_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_similar_incidents_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editors_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editors_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editors_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  embedding?: InputMaybe<History_IncidentEmbeddingQueryInput>;
  embedding_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_modified_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  flagged_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  flagged_dissimilar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  flagged_dissimilar_incidents_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  flagged_dissimilar_incidents_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id_gt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_gte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id_lt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_lte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_ne?: InputMaybe<Scalars['Int']['input']>;
  incident_id_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  modifiedBy?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_exists?: InputMaybe<Scalars['Boolean']['input']>;
  modifiedBy_gt?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_gte?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  modifiedBy_lt?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_lte?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_ne?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<History_IncidentNlp_Similar_IncidentQueryInput>>>;
  nlp_similar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  nlp_similar_incidents_in?: InputMaybe<Array<InputMaybe<History_IncidentNlp_Similar_IncidentQueryInput>>>;
  nlp_similar_incidents_nin?: InputMaybe<Array<InputMaybe<History_IncidentNlp_Similar_IncidentQueryInput>>>;
  reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  reports_exists?: InputMaybe<Scalars['Boolean']['input']>;
  reports_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  reports_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_ne?: InputMaybe<Scalars['String']['input']>;
  title_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tsne?: InputMaybe<History_IncidentTsneQueryInput>;
  tsne_exists?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum History_IncidentSortByInput {
  DateAsc = 'DATE_ASC',
  DateDesc = 'DATE_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  EditorNotesAsc = 'EDITOR_NOTES_ASC',
  EditorNotesDesc = 'EDITOR_NOTES_DESC',
  EpochDateModifiedAsc = 'EPOCH_DATE_MODIFIED_ASC',
  EpochDateModifiedDesc = 'EPOCH_DATE_MODIFIED_DESC',
  IncidentIdAsc = 'INCIDENT_ID_ASC',
  IncidentIdDesc = 'INCIDENT_ID_DESC',
  ModifiedbyAsc = 'MODIFIEDBY_ASC',
  ModifiedbyDesc = 'MODIFIEDBY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type History_IncidentTsne = {
  __typename?: 'History_incidentTsne';
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
};

export type History_IncidentTsneInsertInput = {
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
};

export type History_IncidentTsneQueryInput = {
  AND?: InputMaybe<Array<History_IncidentTsneQueryInput>>;
  OR?: InputMaybe<Array<History_IncidentTsneQueryInput>>;
  x?: InputMaybe<Scalars['Float']['input']>;
  x_exists?: InputMaybe<Scalars['Boolean']['input']>;
  x_gt?: InputMaybe<Scalars['Float']['input']>;
  x_gte?: InputMaybe<Scalars['Float']['input']>;
  x_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  x_lt?: InputMaybe<Scalars['Float']['input']>;
  x_lte?: InputMaybe<Scalars['Float']['input']>;
  x_ne?: InputMaybe<Scalars['Float']['input']>;
  x_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  y?: InputMaybe<Scalars['Float']['input']>;
  y_exists?: InputMaybe<Scalars['Boolean']['input']>;
  y_gt?: InputMaybe<Scalars['Float']['input']>;
  y_gte?: InputMaybe<Scalars['Float']['input']>;
  y_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  y_lt?: InputMaybe<Scalars['Float']['input']>;
  y_lte?: InputMaybe<Scalars['Float']['input']>;
  y_ne?: InputMaybe<Scalars['Float']['input']>;
  y_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type History_IncidentTsneUpdateInput = {
  x?: InputMaybe<Scalars['Float']['input']>;
  x_inc?: InputMaybe<Scalars['Float']['input']>;
  x_unset?: InputMaybe<Scalars['Boolean']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  y_inc?: InputMaybe<Scalars['Float']['input']>;
  y_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type History_IncidentUpdateInput = {
  AllegedDeployerOfAISystem?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedDeployerOfAISystem_unset?: InputMaybe<Scalars['Boolean']['input']>;
  AllegedDeveloperOfAISystem?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedDeveloperOfAISystem_unset?: InputMaybe<Scalars['Boolean']['input']>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  AllegedHarmedOrNearlyHarmedParties_unset?: InputMaybe<Scalars['Boolean']['input']>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  date_unset?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_dissimilar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_notes_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_similar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editors_unset?: InputMaybe<Scalars['Boolean']['input']>;
  embedding?: InputMaybe<History_IncidentEmbeddingUpdateInput>;
  embedding_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_unset?: InputMaybe<Scalars['Boolean']['input']>;
  flagged_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  flagged_dissimilar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_inc?: InputMaybe<Scalars['Int']['input']>;
  incident_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  modifiedBy?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_unset?: InputMaybe<Scalars['Boolean']['input']>;
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<History_IncidentNlp_Similar_IncidentUpdateInput>>>;
  nlp_similar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  reports_unset?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_unset?: InputMaybe<Scalars['Boolean']['input']>;
  tsne?: InputMaybe<History_IncidentTsneUpdateInput>;
  tsne_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type History_Report = {
  __typename?: 'History_report';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  authors: Array<Maybe<Scalars['String']['output']>>;
  cloudinary_id: Scalars['String']['output'];
  date_downloaded: Scalars['DateTime']['output'];
  date_modified: Scalars['DateTime']['output'];
  date_published: Scalars['DateTime']['output'];
  date_submitted: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  editor_notes?: Maybe<Scalars['String']['output']>;
  embedding?: Maybe<History_ReportEmbedding>;
  epoch_date_downloaded: Scalars['Int']['output'];
  epoch_date_modified: Scalars['Int']['output'];
  epoch_date_published: Scalars['Int']['output'];
  epoch_date_submitted: Scalars['Int']['output'];
  flag?: Maybe<Scalars['Boolean']['output']>;
  image_url: Scalars['String']['output'];
  inputs_outputs?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  is_incident_report?: Maybe<Scalars['Boolean']['output']>;
  language: Scalars['String']['output'];
  modifiedBy?: Maybe<Scalars['String']['output']>;
  plain_text: Scalars['String']['output'];
  quiet?: Maybe<Scalars['Boolean']['output']>;
  report_number: Scalars['Int']['output'];
  source_domain: Scalars['String']['output'];
  submitters: Array<Maybe<Scalars['String']['output']>>;
  tags: Array<Maybe<Scalars['String']['output']>>;
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
  user?: Maybe<Scalars['String']['output']>;
};

export type History_ReportEmbedding = {
  __typename?: 'History_reportEmbedding';
  from_text_hash?: Maybe<Scalars['String']['output']>;
  vector?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type History_ReportEmbeddingInsertInput = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type History_ReportEmbeddingQueryInput = {
  AND?: InputMaybe<Array<History_ReportEmbeddingQueryInput>>;
  OR?: InputMaybe<Array<History_ReportEmbeddingQueryInput>>;
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_exists?: InputMaybe<Scalars['Boolean']['input']>;
  from_text_hash_gt?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_gte?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_text_hash_lt?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_lte?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_ne?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_exists?: InputMaybe<Scalars['Boolean']['input']>;
  vector_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type History_ReportEmbeddingUpdateInput = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_unset?: InputMaybe<Scalars['Boolean']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type History_ReportInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  authors: Array<InputMaybe<Scalars['String']['input']>>;
  cloudinary_id: Scalars['String']['input'];
  date_downloaded: Scalars['DateTime']['input'];
  date_modified: Scalars['DateTime']['input'];
  date_published: Scalars['DateTime']['input'];
  date_submitted: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  embedding?: InputMaybe<History_ReportEmbeddingInsertInput>;
  epoch_date_downloaded: Scalars['Int']['input'];
  epoch_date_modified: Scalars['Int']['input'];
  epoch_date_published: Scalars['Int']['input'];
  epoch_date_submitted: Scalars['Int']['input'];
  flag?: InputMaybe<Scalars['Boolean']['input']>;
  image_url: Scalars['String']['input'];
  inputs_outputs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  is_incident_report?: InputMaybe<Scalars['Boolean']['input']>;
  language: Scalars['String']['input'];
  modifiedBy?: InputMaybe<Scalars['String']['input']>;
  plain_text: Scalars['String']['input'];
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  report_number: Scalars['Int']['input'];
  source_domain: Scalars['String']['input'];
  submitters: Array<InputMaybe<Scalars['String']['input']>>;
  tags: Array<InputMaybe<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
  user?: InputMaybe<Scalars['String']['input']>;
};

export type History_ReportQueryInput = {
  AND?: InputMaybe<Array<History_ReportQueryInput>>;
  OR?: InputMaybe<Array<History_ReportQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_exists?: InputMaybe<Scalars['Boolean']['input']>;
  authors_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cloudinary_id?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  cloudinary_id_gt?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_gte?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cloudinary_id_lt?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_lte?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_ne?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_downloaded?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_downloaded_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_downloaded_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_modified_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_modified_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_published?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_published_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_published_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_submitted?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_submitted_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_submitted_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_ne?: InputMaybe<Scalars['String']['input']>;
  description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_notes_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_notes_gt?: InputMaybe<Scalars['String']['input']>;
  editor_notes_gte?: InputMaybe<Scalars['String']['input']>;
  editor_notes_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_notes_lt?: InputMaybe<Scalars['String']['input']>;
  editor_notes_lte?: InputMaybe<Scalars['String']['input']>;
  editor_notes_ne?: InputMaybe<Scalars['String']['input']>;
  editor_notes_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  embedding?: InputMaybe<History_ReportEmbeddingQueryInput>;
  embedding_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_downloaded?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_downloaded_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_downloaded_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_modified_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_published?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_published_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_published_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_submitted?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_submitted_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_submitted_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  flag?: InputMaybe<Scalars['Boolean']['input']>;
  flag_exists?: InputMaybe<Scalars['Boolean']['input']>;
  flag_ne?: InputMaybe<Scalars['Boolean']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  image_url_exists?: InputMaybe<Scalars['Boolean']['input']>;
  image_url_gt?: InputMaybe<Scalars['String']['input']>;
  image_url_gte?: InputMaybe<Scalars['String']['input']>;
  image_url_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  image_url_lt?: InputMaybe<Scalars['String']['input']>;
  image_url_lte?: InputMaybe<Scalars['String']['input']>;
  image_url_ne?: InputMaybe<Scalars['String']['input']>;
  image_url_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputs_outputs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputs_outputs_exists?: InputMaybe<Scalars['Boolean']['input']>;
  inputs_outputs_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputs_outputs_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  is_incident_report?: InputMaybe<Scalars['Boolean']['input']>;
  is_incident_report_exists?: InputMaybe<Scalars['Boolean']['input']>;
  is_incident_report_ne?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  language_exists?: InputMaybe<Scalars['Boolean']['input']>;
  language_gt?: InputMaybe<Scalars['String']['input']>;
  language_gte?: InputMaybe<Scalars['String']['input']>;
  language_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  language_lt?: InputMaybe<Scalars['String']['input']>;
  language_lte?: InputMaybe<Scalars['String']['input']>;
  language_ne?: InputMaybe<Scalars['String']['input']>;
  language_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  modifiedBy?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_exists?: InputMaybe<Scalars['Boolean']['input']>;
  modifiedBy_gt?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_gte?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  modifiedBy_lt?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_lte?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_ne?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  plain_text_exists?: InputMaybe<Scalars['Boolean']['input']>;
  plain_text_gt?: InputMaybe<Scalars['String']['input']>;
  plain_text_gte?: InputMaybe<Scalars['String']['input']>;
  plain_text_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plain_text_lt?: InputMaybe<Scalars['String']['input']>;
  plain_text_lte?: InputMaybe<Scalars['String']['input']>;
  plain_text_ne?: InputMaybe<Scalars['String']['input']>;
  plain_text_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  quiet_exists?: InputMaybe<Scalars['Boolean']['input']>;
  quiet_ne?: InputMaybe<Scalars['Boolean']['input']>;
  report_number?: InputMaybe<Scalars['Int']['input']>;
  report_number_exists?: InputMaybe<Scalars['Boolean']['input']>;
  report_number_gt?: InputMaybe<Scalars['Int']['input']>;
  report_number_gte?: InputMaybe<Scalars['Int']['input']>;
  report_number_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  report_number_lt?: InputMaybe<Scalars['Int']['input']>;
  report_number_lte?: InputMaybe<Scalars['Int']['input']>;
  report_number_ne?: InputMaybe<Scalars['Int']['input']>;
  report_number_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  source_domain_exists?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain_gt?: InputMaybe<Scalars['String']['input']>;
  source_domain_gte?: InputMaybe<Scalars['String']['input']>;
  source_domain_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  source_domain_lt?: InputMaybe<Scalars['String']['input']>;
  source_domain_lte?: InputMaybe<Scalars['String']['input']>;
  source_domain_ne?: InputMaybe<Scalars['String']['input']>;
  source_domain_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters_exists?: InputMaybe<Scalars['Boolean']['input']>;
  submitters_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_exists?: InputMaybe<Scalars['Boolean']['input']>;
  tags_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
  text_exists?: InputMaybe<Scalars['Boolean']['input']>;
  text_gt?: InputMaybe<Scalars['String']['input']>;
  text_gte?: InputMaybe<Scalars['String']['input']>;
  text_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text_lt?: InputMaybe<Scalars['String']['input']>;
  text_lte?: InputMaybe<Scalars['String']['input']>;
  text_ne?: InputMaybe<Scalars['String']['input']>;
  text_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_ne?: InputMaybe<Scalars['String']['input']>;
  title_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  url?: InputMaybe<Scalars['String']['input']>;
  url_exists?: InputMaybe<Scalars['Boolean']['input']>;
  url_gt?: InputMaybe<Scalars['String']['input']>;
  url_gte?: InputMaybe<Scalars['String']['input']>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  url_lt?: InputMaybe<Scalars['String']['input']>;
  url_lte?: InputMaybe<Scalars['String']['input']>;
  url_ne?: InputMaybe<Scalars['String']['input']>;
  url_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_exists?: InputMaybe<Scalars['Boolean']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_ne?: InputMaybe<Scalars['String']['input']>;
  user_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export enum History_ReportSortByInput {
  CloudinaryIdAsc = 'CLOUDINARY_ID_ASC',
  CloudinaryIdDesc = 'CLOUDINARY_ID_DESC',
  DateDownloadedAsc = 'DATE_DOWNLOADED_ASC',
  DateDownloadedDesc = 'DATE_DOWNLOADED_DESC',
  DateModifiedAsc = 'DATE_MODIFIED_ASC',
  DateModifiedDesc = 'DATE_MODIFIED_DESC',
  DatePublishedAsc = 'DATE_PUBLISHED_ASC',
  DatePublishedDesc = 'DATE_PUBLISHED_DESC',
  DateSubmittedAsc = 'DATE_SUBMITTED_ASC',
  DateSubmittedDesc = 'DATE_SUBMITTED_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  EditorNotesAsc = 'EDITOR_NOTES_ASC',
  EditorNotesDesc = 'EDITOR_NOTES_DESC',
  EpochDateDownloadedAsc = 'EPOCH_DATE_DOWNLOADED_ASC',
  EpochDateDownloadedDesc = 'EPOCH_DATE_DOWNLOADED_DESC',
  EpochDateModifiedAsc = 'EPOCH_DATE_MODIFIED_ASC',
  EpochDateModifiedDesc = 'EPOCH_DATE_MODIFIED_DESC',
  EpochDatePublishedAsc = 'EPOCH_DATE_PUBLISHED_ASC',
  EpochDatePublishedDesc = 'EPOCH_DATE_PUBLISHED_DESC',
  EpochDateSubmittedAsc = 'EPOCH_DATE_SUBMITTED_ASC',
  EpochDateSubmittedDesc = 'EPOCH_DATE_SUBMITTED_DESC',
  ImageUrlAsc = 'IMAGE_URL_ASC',
  ImageUrlDesc = 'IMAGE_URL_DESC',
  LanguageAsc = 'LANGUAGE_ASC',
  LanguageDesc = 'LANGUAGE_DESC',
  ModifiedbyAsc = 'MODIFIEDBY_ASC',
  ModifiedbyDesc = 'MODIFIEDBY_DESC',
  PlainTextAsc = 'PLAIN_TEXT_ASC',
  PlainTextDesc = 'PLAIN_TEXT_DESC',
  ReportNumberAsc = 'REPORT_NUMBER_ASC',
  ReportNumberDesc = 'REPORT_NUMBER_DESC',
  SourceDomainAsc = 'SOURCE_DOMAIN_ASC',
  SourceDomainDesc = 'SOURCE_DOMAIN_DESC',
  TextAsc = 'TEXT_ASC',
  TextDesc = 'TEXT_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC',
  UserAsc = 'USER_ASC',
  UserDesc = 'USER_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type History_ReportUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_unset?: InputMaybe<Scalars['Boolean']['input']>;
  cloudinary_id?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_downloaded?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_published?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_submitted?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_unset?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_notes_unset?: InputMaybe<Scalars['Boolean']['input']>;
  embedding?: InputMaybe<History_ReportEmbeddingUpdateInput>;
  embedding_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_downloaded?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_published?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_submitted?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_unset?: InputMaybe<Scalars['Boolean']['input']>;
  flag?: InputMaybe<Scalars['Boolean']['input']>;
  flag_unset?: InputMaybe<Scalars['Boolean']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  image_url_unset?: InputMaybe<Scalars['Boolean']['input']>;
  inputs_outputs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputs_outputs_unset?: InputMaybe<Scalars['Boolean']['input']>;
  is_incident_report?: InputMaybe<Scalars['Boolean']['input']>;
  is_incident_report_unset?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  language_unset?: InputMaybe<Scalars['Boolean']['input']>;
  modifiedBy?: InputMaybe<Scalars['String']['input']>;
  modifiedBy_unset?: InputMaybe<Scalars['Boolean']['input']>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  plain_text_unset?: InputMaybe<Scalars['Boolean']['input']>;
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  quiet_unset?: InputMaybe<Scalars['Boolean']['input']>;
  report_number?: InputMaybe<Scalars['Int']['input']>;
  report_number_inc?: InputMaybe<Scalars['Int']['input']>;
  report_number_unset?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  source_domain_unset?: InputMaybe<Scalars['Boolean']['input']>;
  submitters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters_unset?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_unset?: InputMaybe<Scalars['Boolean']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  text_unset?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_unset?: InputMaybe<Scalars['Boolean']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  url_unset?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Incident = {
  __typename?: 'Incident';
  AllegedDeployerOfAISystem?: Maybe<Array<Maybe<Entity>>>;
  AllegedDeveloperOfAISystem?: Maybe<Array<Maybe<Entity>>>;
  AllegedHarmedOrNearlyHarmedParties?: Maybe<Array<Maybe<Entity>>>;
  _id?: Maybe<Scalars['ObjectId']['output']>;
  date: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  editor_dissimilar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editor_notes?: Maybe<Scalars['String']['output']>;
  editor_similar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editors: Array<Maybe<User>>;
  embedding?: Maybe<IncidentEmbedding>;
  epoch_date_modified?: Maybe<Scalars['Int']['output']>;
  flagged_dissimilar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  incident_id: Scalars['Int']['output'];
  nlp_similar_incidents?: Maybe<Array<Maybe<IncidentNlp_Similar_Incident>>>;
  reports: Array<Maybe<Report>>;
  title: Scalars['String']['output'];
  tsne?: Maybe<IncidentTsne>;
};

export type IncidentAllegedDeployerOfAiSystemRelationInput = {
  create?: InputMaybe<Array<InputMaybe<EntityInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IncidentAllegedDeveloperOfAiSystemRelationInput = {
  create?: InputMaybe<Array<InputMaybe<EntityInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput = {
  create?: InputMaybe<Array<InputMaybe<EntityInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IncidentEditorsRelationInput = {
  create?: InputMaybe<Array<InputMaybe<UserInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IncidentEmbedding = {
  __typename?: 'IncidentEmbedding';
  from_reports?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  vector?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type IncidentEmbeddingInsertInput = {
  from_reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type IncidentEmbeddingQueryInput = {
  AND?: InputMaybe<Array<IncidentEmbeddingQueryInput>>;
  OR?: InputMaybe<Array<IncidentEmbeddingQueryInput>>;
  from_reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  from_reports_exists?: InputMaybe<Scalars['Boolean']['input']>;
  from_reports_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  from_reports_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_exists?: InputMaybe<Scalars['Boolean']['input']>;
  vector_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type IncidentEmbeddingUpdateInput = {
  from_reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  from_reports_unset?: InputMaybe<Scalars['Boolean']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type IncidentInsertInput = {
  AllegedDeployerOfAISystem?: InputMaybe<IncidentAllegedDeployerOfAiSystemRelationInput>;
  AllegedDeveloperOfAISystem?: InputMaybe<IncidentAllegedDeveloperOfAiSystemRelationInput>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  date: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editors: IncidentEditorsRelationInput;
  embedding?: InputMaybe<IncidentEmbeddingInsertInput>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  flagged_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id: Scalars['Int']['input'];
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<IncidentNlp_Similar_IncidentInsertInput>>>;
  reports: IncidentReportsRelationInput;
  title: Scalars['String']['input'];
  tsne?: InputMaybe<IncidentTsneInsertInput>;
};

export type IncidentNlp_Similar_Incident = {
  __typename?: 'IncidentNlp_similar_incident';
  incident_id?: Maybe<Scalars['Int']['output']>;
  similarity?: Maybe<Scalars['Float']['output']>;
};

export type IncidentNlp_Similar_IncidentInsertInput = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
};

export type IncidentNlp_Similar_IncidentQueryInput = {
  AND?: InputMaybe<Array<IncidentNlp_Similar_IncidentQueryInput>>;
  OR?: InputMaybe<Array<IncidentNlp_Similar_IncidentQueryInput>>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id_gt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_gte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id_lt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_lte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_ne?: InputMaybe<Scalars['Int']['input']>;
  incident_id_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_exists?: InputMaybe<Scalars['Boolean']['input']>;
  similarity_gt?: InputMaybe<Scalars['Float']['input']>;
  similarity_gte?: InputMaybe<Scalars['Float']['input']>;
  similarity_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  similarity_lt?: InputMaybe<Scalars['Float']['input']>;
  similarity_lte?: InputMaybe<Scalars['Float']['input']>;
  similarity_ne?: InputMaybe<Scalars['Float']['input']>;
  similarity_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type IncidentNlp_Similar_IncidentUpdateInput = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_inc?: InputMaybe<Scalars['Int']['input']>;
  incident_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_inc?: InputMaybe<Scalars['Float']['input']>;
  similarity_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type IncidentQueryInput = {
  AND?: InputMaybe<Array<IncidentQueryInput>>;
  AllegedDeployerOfAISystem?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  AllegedDeployerOfAISystem_exists?: InputMaybe<Scalars['Boolean']['input']>;
  AllegedDeployerOfAISystem_in?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  AllegedDeployerOfAISystem_nin?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  AllegedDeveloperOfAISystem?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  AllegedDeveloperOfAISystem_exists?: InputMaybe<Scalars['Boolean']['input']>;
  AllegedDeveloperOfAISystem_in?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  AllegedDeveloperOfAISystem_nin?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  AllegedHarmedOrNearlyHarmedParties_exists?: InputMaybe<Scalars['Boolean']['input']>;
  AllegedHarmedOrNearlyHarmedParties_in?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  AllegedHarmedOrNearlyHarmedParties_nin?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  OR?: InputMaybe<Array<IncidentQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  date?: InputMaybe<Scalars['String']['input']>;
  date_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_gt?: InputMaybe<Scalars['String']['input']>;
  date_gte?: InputMaybe<Scalars['String']['input']>;
  date_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_lt?: InputMaybe<Scalars['String']['input']>;
  date_lte?: InputMaybe<Scalars['String']['input']>;
  date_ne?: InputMaybe<Scalars['String']['input']>;
  date_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_ne?: InputMaybe<Scalars['String']['input']>;
  description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_dissimilar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_dissimilar_incidents_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_dissimilar_incidents_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_notes_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_notes_gt?: InputMaybe<Scalars['String']['input']>;
  editor_notes_gte?: InputMaybe<Scalars['String']['input']>;
  editor_notes_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_notes_lt?: InputMaybe<Scalars['String']['input']>;
  editor_notes_lte?: InputMaybe<Scalars['String']['input']>;
  editor_notes_ne?: InputMaybe<Scalars['String']['input']>;
  editor_notes_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_similar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_similar_incidents_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_similar_incidents_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editors?: InputMaybe<Array<InputMaybe<UserQueryInput>>>;
  editors_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editors_in?: InputMaybe<Array<InputMaybe<UserQueryInput>>>;
  editors_nin?: InputMaybe<Array<InputMaybe<UserQueryInput>>>;
  embedding?: InputMaybe<IncidentEmbeddingQueryInput>;
  embedding_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_modified_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  flagged_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  flagged_dissimilar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  flagged_dissimilar_incidents_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  flagged_dissimilar_incidents_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id_gt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_gte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id_lt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_lte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_ne?: InputMaybe<Scalars['Int']['input']>;
  incident_id_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<IncidentNlp_Similar_IncidentQueryInput>>>;
  nlp_similar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  nlp_similar_incidents_in?: InputMaybe<Array<InputMaybe<IncidentNlp_Similar_IncidentQueryInput>>>;
  nlp_similar_incidents_nin?: InputMaybe<Array<InputMaybe<IncidentNlp_Similar_IncidentQueryInput>>>;
  reports?: InputMaybe<Array<InputMaybe<ReportQueryInput>>>;
  reports_exists?: InputMaybe<Scalars['Boolean']['input']>;
  reports_in?: InputMaybe<Array<InputMaybe<ReportQueryInput>>>;
  reports_nin?: InputMaybe<Array<InputMaybe<ReportQueryInput>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_ne?: InputMaybe<Scalars['String']['input']>;
  title_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tsne?: InputMaybe<IncidentTsneQueryInput>;
  tsne_exists?: InputMaybe<Scalars['Boolean']['input']>;
};

export type IncidentReportsRelationInput = {
  create?: InputMaybe<Array<InputMaybe<ReportInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export enum IncidentSortByInput {
  DateAsc = 'DATE_ASC',
  DateDesc = 'DATE_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  EditorNotesAsc = 'EDITOR_NOTES_ASC',
  EditorNotesDesc = 'EDITOR_NOTES_DESC',
  EpochDateModifiedAsc = 'EPOCH_DATE_MODIFIED_ASC',
  EpochDateModifiedDesc = 'EPOCH_DATE_MODIFIED_DESC',
  IncidentIdAsc = 'INCIDENT_ID_ASC',
  IncidentIdDesc = 'INCIDENT_ID_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type IncidentTsne = {
  __typename?: 'IncidentTsne';
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
};

export type IncidentTsneInsertInput = {
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
};

export type IncidentTsneQueryInput = {
  AND?: InputMaybe<Array<IncidentTsneQueryInput>>;
  OR?: InputMaybe<Array<IncidentTsneQueryInput>>;
  x?: InputMaybe<Scalars['Float']['input']>;
  x_exists?: InputMaybe<Scalars['Boolean']['input']>;
  x_gt?: InputMaybe<Scalars['Float']['input']>;
  x_gte?: InputMaybe<Scalars['Float']['input']>;
  x_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  x_lt?: InputMaybe<Scalars['Float']['input']>;
  x_lte?: InputMaybe<Scalars['Float']['input']>;
  x_ne?: InputMaybe<Scalars['Float']['input']>;
  x_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  y?: InputMaybe<Scalars['Float']['input']>;
  y_exists?: InputMaybe<Scalars['Boolean']['input']>;
  y_gt?: InputMaybe<Scalars['Float']['input']>;
  y_gte?: InputMaybe<Scalars['Float']['input']>;
  y_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  y_lt?: InputMaybe<Scalars['Float']['input']>;
  y_lte?: InputMaybe<Scalars['Float']['input']>;
  y_ne?: InputMaybe<Scalars['Float']['input']>;
  y_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type IncidentTsneUpdateInput = {
  x?: InputMaybe<Scalars['Float']['input']>;
  x_inc?: InputMaybe<Scalars['Float']['input']>;
  x_unset?: InputMaybe<Scalars['Boolean']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  y_inc?: InputMaybe<Scalars['Float']['input']>;
  y_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type IncidentUpdateInput = {
  AllegedDeployerOfAISystem?: InputMaybe<IncidentAllegedDeployerOfAiSystemRelationInput>;
  AllegedDeployerOfAISystem_unset?: InputMaybe<Scalars['Boolean']['input']>;
  AllegedDeveloperOfAISystem?: InputMaybe<IncidentAllegedDeveloperOfAiSystemRelationInput>;
  AllegedDeveloperOfAISystem_unset?: InputMaybe<Scalars['Boolean']['input']>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput>;
  AllegedHarmedOrNearlyHarmedParties_unset?: InputMaybe<Scalars['Boolean']['input']>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  date_unset?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_dissimilar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_notes_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_similar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editors?: InputMaybe<IncidentEditorsRelationInput>;
  editors_unset?: InputMaybe<Scalars['Boolean']['input']>;
  embedding?: InputMaybe<IncidentEmbeddingUpdateInput>;
  embedding_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_unset?: InputMaybe<Scalars['Boolean']['input']>;
  flagged_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  flagged_dissimilar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_inc?: InputMaybe<Scalars['Int']['input']>;
  incident_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<IncidentNlp_Similar_IncidentUpdateInput>>>;
  nlp_similar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  reports?: InputMaybe<IncidentReportsRelationInput>;
  reports_unset?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_unset?: InputMaybe<Scalars['Boolean']['input']>;
  tsne?: InputMaybe<IncidentTsneUpdateInput>;
  tsne_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type InsertManyPayload = {
  __typename?: 'InsertManyPayload';
  insertedIds: Array<Maybe<Scalars['ObjectId']['output']>>;
};

export type LinkReportsToIncidentsInput = {
  incident_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  report_numbers?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type LogIncidentHistoryPayload = {
  __typename?: 'LogIncidentHistoryPayload';
  incident_id?: Maybe<Scalars['Int']['output']>;
};

export type LogReportHistoryPayload = {
  __typename?: 'LogReportHistoryPayload';
  report_number?: Maybe<Scalars['Int']['output']>;
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
  /** Placeholder field to avoid empty mutation type */
  _?: Maybe<Scalars['String']['output']>;
  createDefaultAdminUser?: Maybe<DefaultAdminUser>;
  createVariant?: Maybe<CreateVariantPayload>;
  deleteManyCandidates?: Maybe<DeleteManyPayload>;
  deleteManyChecklists?: Maybe<DeleteManyPayload>;
  deleteManyClassifications?: Maybe<DeleteManyPayload>;
  deleteManyDuplicates?: Maybe<DeleteManyPayload>;
  deleteManyEntities?: Maybe<DeleteManyPayload>;
  deleteManyHistory_incidents?: Maybe<DeleteManyPayload>;
  deleteManyHistory_reports?: Maybe<DeleteManyPayload>;
  deleteManyIncidents?: Maybe<DeleteManyPayload>;
  deleteManyNotifications?: Maybe<DeleteManyPayload>;
  deleteManyQuickadds?: Maybe<DeleteManyPayload>;
  deleteManyReports?: Maybe<DeleteManyPayload>;
  deleteManySubmissions?: Maybe<DeleteManyPayload>;
  deleteManySubscriptions?: Maybe<DeleteManyPayload>;
  deleteManyTaxas?: Maybe<DeleteManyPayload>;
  deleteManyUsers?: Maybe<DeleteManyPayload>;
  deleteOneCandidate?: Maybe<Candidate>;
  deleteOneChecklist?: Maybe<Checklist>;
  deleteOneClassification?: Maybe<Classification>;
  deleteOneDuplicate?: Maybe<Duplicate>;
  deleteOneEntity?: Maybe<Entity>;
  deleteOneHistory_incident?: Maybe<History_Incident>;
  deleteOneHistory_report?: Maybe<History_Report>;
  deleteOneIncident?: Maybe<Incident>;
  deleteOneNotification?: Maybe<Notification>;
  deleteOneQuickadd?: Maybe<Quickadd>;
  deleteOneReport?: Maybe<Report>;
  deleteOneSubmission?: Maybe<Submission>;
  deleteOneSubscription?: Maybe<Subscription>;
  deleteOneTaxa?: Maybe<Taxa>;
  deleteOneUser?: Maybe<User>;
  getUser?: Maybe<AppUser>;
  insertManyCandidates?: Maybe<InsertManyPayload>;
  insertManyChecklists?: Maybe<InsertManyPayload>;
  insertManyClassifications?: Maybe<InsertManyPayload>;
  insertManyDuplicates?: Maybe<InsertManyPayload>;
  insertManyEntities?: Maybe<InsertManyPayload>;
  insertManyHistory_incidents?: Maybe<InsertManyPayload>;
  insertManyHistory_reports?: Maybe<InsertManyPayload>;
  insertManyIncidents?: Maybe<InsertManyPayload>;
  insertManyNotifications?: Maybe<InsertManyPayload>;
  insertManyQuickadds?: Maybe<InsertManyPayload>;
  insertManyReports?: Maybe<InsertManyPayload>;
  insertManySubmissions?: Maybe<InsertManyPayload>;
  insertManySubscriptions?: Maybe<InsertManyPayload>;
  insertManyTaxas?: Maybe<InsertManyPayload>;
  insertManyUsers?: Maybe<InsertManyPayload>;
  insertOneCandidate?: Maybe<Candidate>;
  insertOneChecklist?: Maybe<Checklist>;
  insertOneClassification?: Maybe<Classification>;
  insertOneDuplicate?: Maybe<Duplicate>;
  insertOneEntity?: Maybe<Entity>;
  insertOneHistory_incident?: Maybe<History_Incident>;
  insertOneHistory_report?: Maybe<History_Report>;
  insertOneIncident?: Maybe<Incident>;
  insertOneNotification?: Maybe<Notification>;
  insertOneQuickadd?: Maybe<QuickAdd>;
  insertOneReport?: Maybe<Report>;
  insertOneSubmission?: Maybe<Submission>;
  insertOneSubscription?: Maybe<Subscription>;
  insertOneTaxa?: Maybe<Taxa>;
  insertOneUser?: Maybe<User>;
  linkReportsToIncidents?: Maybe<Array<Maybe<Incident>>>;
  logIncidentHistory?: Maybe<LogIncidentHistoryPayload>;
  logReportHistory?: Maybe<LogReportHistoryPayload>;
  processNotifications?: Maybe<Scalars['Int']['output']>;
  promoteSubmissionToReport?: Maybe<PromoteSubmissionToReportPayload>;
  replaceOneCandidate?: Maybe<Candidate>;
  replaceOneChecklist?: Maybe<Checklist>;
  replaceOneClassification?: Maybe<Classification>;
  replaceOneDuplicate?: Maybe<Duplicate>;
  replaceOneEntity?: Maybe<Entity>;
  replaceOneHistory_incident?: Maybe<History_Incident>;
  replaceOneHistory_report?: Maybe<History_Report>;
  replaceOneIncident?: Maybe<Incident>;
  replaceOneNotification?: Maybe<Notification>;
  replaceOneQuickadd?: Maybe<Quickadd>;
  replaceOneReport?: Maybe<Report>;
  replaceOneSubmission?: Maybe<Submission>;
  replaceOneSubscription?: Maybe<Subscription>;
  replaceOneTaxa?: Maybe<Taxa>;
  replaceOneUser?: Maybe<User>;
  updateManyCandidates?: Maybe<UpdateManyPayload>;
  updateManyChecklists?: Maybe<UpdateManyPayload>;
  updateManyClassifications?: Maybe<UpdateManyPayload>;
  updateManyDuplicates?: Maybe<UpdateManyPayload>;
  updateManyEntities?: Maybe<UpdateManyPayload>;
  updateManyHistory_incidents?: Maybe<UpdateManyPayload>;
  updateManyHistory_reports?: Maybe<UpdateManyPayload>;
  updateManyIncidents?: Maybe<UpdateManyPayload>;
  updateManyNotifications?: Maybe<UpdateManyPayload>;
  updateManyQuickadds?: Maybe<UpdateManyPayload>;
  updateManyReports?: Maybe<UpdateManyPayload>;
  updateManySubmissions?: Maybe<UpdateManyPayload>;
  updateManySubscriptions?: Maybe<UpdateManyPayload>;
  updateManyTaxas?: Maybe<UpdateManyPayload>;
  updateManyUsers?: Maybe<UpdateManyPayload>;
  updateOneCandidate?: Maybe<Candidate>;
  updateOneChecklist?: Maybe<Checklist>;
  updateOneClassification?: Maybe<Classification>;
  updateOneDuplicate?: Maybe<Duplicate>;
  updateOneEntity?: Maybe<Entity>;
  updateOneHistory_incident?: Maybe<History_Incident>;
  updateOneHistory_report?: Maybe<History_Report>;
  updateOneIncident?: Maybe<Incident>;
  updateOneNotification?: Maybe<Notification>;
  updateOneQuickadd?: Maybe<Quickadd>;
  updateOneReport?: Maybe<Report>;
  updateOneReportTranslation?: Maybe<Report>;
  updateOneSubmission?: Maybe<Submission>;
  updateOneSubscription?: Maybe<Subscription>;
  updateOneTaxa?: Maybe<Taxa>;
  updateOneUser?: Maybe<User>;
  upsertOneCandidate?: Maybe<Candidate>;
  upsertOneChecklist?: Maybe<Checklist>;
  upsertOneClassification?: Maybe<Classification>;
  upsertOneDuplicate?: Maybe<Duplicate>;
  upsertOneEntity?: Maybe<Entity>;
  upsertOneHistory_incident?: Maybe<History_Incident>;
  upsertOneHistory_report?: Maybe<History_Report>;
  upsertOneIncident?: Maybe<Incident>;
  upsertOneNotification?: Maybe<Notification>;
  upsertOneQuickadd?: Maybe<Quickadd>;
  upsertOneReport?: Maybe<Report>;
  upsertOneSubmission?: Maybe<Submission>;
  upsertOneSubscription?: Maybe<Subscription>;
  upsertOneTaxa?: Maybe<Taxa>;
  upsertOneUser?: Maybe<User>;
};


export type MutationCreateDefaultAdminUserArgs = {
  input?: InputMaybe<CreateDefaultAdminUserInput>;
};


export type MutationCreateVariantArgs = {
  input?: InputMaybe<CreateVariantInput>;
};


export type MutationDeleteManyCandidatesArgs = {
  query?: InputMaybe<CandidateQueryInput>;
};


export type MutationDeleteManyChecklistsArgs = {
  query?: InputMaybe<ChecklistQueryInput>;
};


export type MutationDeleteManyClassificationsArgs = {
  query?: InputMaybe<ClassificationQueryInput>;
};


export type MutationDeleteManyDuplicatesArgs = {
  query?: InputMaybe<DuplicateQueryInput>;
};


export type MutationDeleteManyEntitiesArgs = {
  query?: InputMaybe<EntityQueryInput>;
};


export type MutationDeleteManyHistory_IncidentsArgs = {
  query?: InputMaybe<History_IncidentQueryInput>;
};


export type MutationDeleteManyHistory_ReportsArgs = {
  query?: InputMaybe<History_ReportQueryInput>;
};


export type MutationDeleteManyIncidentsArgs = {
  query?: InputMaybe<IncidentQueryInput>;
};


export type MutationDeleteManyNotificationsArgs = {
  query?: InputMaybe<NotificationQueryInput>;
};


export type MutationDeleteManyQuickaddsArgs = {
  filter?: InputMaybe<QuickAddFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<QuickAddSortType>;
};


export type MutationDeleteManyReportsArgs = {
  query?: InputMaybe<ReportQueryInput>;
};


export type MutationDeleteManySubmissionsArgs = {
  query?: InputMaybe<SubmissionQueryInput>;
};


export type MutationDeleteManySubscriptionsArgs = {
  query?: InputMaybe<SubscriptionQueryInput>;
};


export type MutationDeleteManyTaxasArgs = {
  query?: InputMaybe<TaxaQueryInput>;
};


export type MutationDeleteManyUsersArgs = {
  query?: InputMaybe<UserQueryInput>;
};


export type MutationDeleteOneCandidateArgs = {
  query: CandidateQueryInput;
};


export type MutationDeleteOneChecklistArgs = {
  query: ChecklistQueryInput;
};


export type MutationDeleteOneClassificationArgs = {
  query: ClassificationQueryInput;
};


export type MutationDeleteOneDuplicateArgs = {
  query: DuplicateQueryInput;
};


export type MutationDeleteOneEntityArgs = {
  query: EntityQueryInput;
};


export type MutationDeleteOneHistory_IncidentArgs = {
  query: History_IncidentQueryInput;
};


export type MutationDeleteOneHistory_ReportArgs = {
  query: History_ReportQueryInput;
};


export type MutationDeleteOneIncidentArgs = {
  query: IncidentQueryInput;
};


export type MutationDeleteOneNotificationArgs = {
  query: NotificationQueryInput;
};


export type MutationDeleteOneReportArgs = {
  query: ReportQueryInput;
};


export type MutationDeleteOneSubmissionArgs = {
  query: SubmissionQueryInput;
};


export type MutationDeleteOneSubscriptionArgs = {
  query: SubscriptionQueryInput;
};


export type MutationDeleteOneTaxaArgs = {
  query: TaxaQueryInput;
};


export type MutationDeleteOneUserArgs = {
  query: UserQueryInput;
};


export type MutationGetUserArgs = {
  input?: InputMaybe<GetUserInput>;
};


export type MutationInsertManyCandidatesArgs = {
  data: Array<CandidateInsertInput>;
};


export type MutationInsertManyChecklistsArgs = {
  data: Array<ChecklistInsertInput>;
};


export type MutationInsertManyClassificationsArgs = {
  data: Array<ClassificationInsertInput>;
};


export type MutationInsertManyDuplicatesArgs = {
  data: Array<DuplicateInsertInput>;
};


export type MutationInsertManyEntitiesArgs = {
  data: Array<EntityInsertInput>;
};


export type MutationInsertManyHistory_IncidentsArgs = {
  data: Array<History_IncidentInsertInput>;
};


export type MutationInsertManyHistory_ReportsArgs = {
  data: Array<History_ReportInsertInput>;
};


export type MutationInsertManyIncidentsArgs = {
  data: Array<IncidentInsertInput>;
};


export type MutationInsertManyNotificationsArgs = {
  data: Array<NotificationInsertInput>;
};


export type MutationInsertManyQuickaddsArgs = {
  data: Array<QuickaddInsertInput>;
};


export type MutationInsertManyReportsArgs = {
  data: Array<ReportInsertInput>;
};


export type MutationInsertManySubmissionsArgs = {
  data: Array<SubmissionInsertInput>;
};


export type MutationInsertManySubscriptionsArgs = {
  data: Array<SubscriptionInsertInput>;
};


export type MutationInsertManyTaxasArgs = {
  data: Array<TaxaInsertInput>;
};


export type MutationInsertManyUsersArgs = {
  data: Array<UserInsertInput>;
};


export type MutationInsertOneCandidateArgs = {
  data: CandidateInsertInput;
};


export type MutationInsertOneChecklistArgs = {
  data: ChecklistInsertInput;
};


export type MutationInsertOneClassificationArgs = {
  data: ClassificationInsertInput;
};


export type MutationInsertOneDuplicateArgs = {
  data: DuplicateInsertInput;
};


export type MutationInsertOneEntityArgs = {
  data: EntityInsertInput;
};


export type MutationInsertOneHistory_IncidentArgs = {
  data: History_IncidentInsertInput;
};


export type MutationInsertOneHistory_ReportArgs = {
  data: History_ReportInsertInput;
};


export type MutationInsertOneIncidentArgs = {
  data: IncidentInsertInput;
};


export type MutationInsertOneNotificationArgs = {
  data: NotificationInsertInput;
};


export type MutationInsertOneQuickaddArgs = {
  data?: InputMaybe<QuickAddInsertType>;
};


export type MutationInsertOneReportArgs = {
  data: ReportInsertInput;
};


export type MutationInsertOneSubmissionArgs = {
  data: SubmissionInsertInput;
};


export type MutationInsertOneSubscriptionArgs = {
  data: SubscriptionInsertInput;
};


export type MutationInsertOneTaxaArgs = {
  data: TaxaInsertInput;
};


export type MutationInsertOneUserArgs = {
  data: UserInsertInput;
};


export type MutationLinkReportsToIncidentsArgs = {
  input?: InputMaybe<LinkReportsToIncidentsInput>;
};


export type MutationLogIncidentHistoryArgs = {
  input?: InputMaybe<History_IncidentInsertInput>;
};


export type MutationLogReportHistoryArgs = {
  input?: InputMaybe<History_ReportInsertInput>;
};


export type MutationPromoteSubmissionToReportArgs = {
  input?: InputMaybe<PromoteSubmissionToReportInput>;
};


export type MutationReplaceOneCandidateArgs = {
  data: CandidateInsertInput;
  query?: InputMaybe<CandidateQueryInput>;
};


export type MutationReplaceOneChecklistArgs = {
  data: ChecklistInsertInput;
  query?: InputMaybe<ChecklistQueryInput>;
};


export type MutationReplaceOneClassificationArgs = {
  data: ClassificationInsertInput;
  query?: InputMaybe<ClassificationQueryInput>;
};


export type MutationReplaceOneDuplicateArgs = {
  data: DuplicateInsertInput;
  query?: InputMaybe<DuplicateQueryInput>;
};


export type MutationReplaceOneEntityArgs = {
  data: EntityInsertInput;
  query?: InputMaybe<EntityQueryInput>;
};


export type MutationReplaceOneHistory_IncidentArgs = {
  data: History_IncidentInsertInput;
  query?: InputMaybe<History_IncidentQueryInput>;
};


export type MutationReplaceOneHistory_ReportArgs = {
  data: History_ReportInsertInput;
  query?: InputMaybe<History_ReportQueryInput>;
};


export type MutationReplaceOneIncidentArgs = {
  data: IncidentInsertInput;
  query?: InputMaybe<IncidentQueryInput>;
};


export type MutationReplaceOneNotificationArgs = {
  data: NotificationInsertInput;
  query?: InputMaybe<NotificationQueryInput>;
};


export type MutationReplaceOneQuickaddArgs = {
  data: QuickaddInsertInput;
};


export type MutationReplaceOneReportArgs = {
  data: ReportInsertInput;
  query?: InputMaybe<ReportQueryInput>;
};


export type MutationReplaceOneSubmissionArgs = {
  data: SubmissionInsertInput;
  query?: InputMaybe<SubmissionQueryInput>;
};


export type MutationReplaceOneSubscriptionArgs = {
  data: SubscriptionInsertInput;
  query?: InputMaybe<SubscriptionQueryInput>;
};


export type MutationReplaceOneTaxaArgs = {
  data: TaxaInsertInput;
  query?: InputMaybe<TaxaQueryInput>;
};


export type MutationReplaceOneUserArgs = {
  data: UserInsertInput;
  query?: InputMaybe<UserQueryInput>;
};


export type MutationUpdateManyCandidatesArgs = {
  query?: InputMaybe<CandidateQueryInput>;
  set: CandidateUpdateInput;
};


export type MutationUpdateManyChecklistsArgs = {
  query?: InputMaybe<ChecklistQueryInput>;
  set: ChecklistUpdateInput;
};


export type MutationUpdateManyClassificationsArgs = {
  query?: InputMaybe<ClassificationQueryInput>;
  set: ClassificationUpdateInput;
};


export type MutationUpdateManyDuplicatesArgs = {
  query?: InputMaybe<DuplicateQueryInput>;
  set: DuplicateUpdateInput;
};


export type MutationUpdateManyEntitiesArgs = {
  query?: InputMaybe<EntityQueryInput>;
  set: EntityUpdateInput;
};


export type MutationUpdateManyHistory_IncidentsArgs = {
  query?: InputMaybe<History_IncidentQueryInput>;
  set: History_IncidentUpdateInput;
};


export type MutationUpdateManyHistory_ReportsArgs = {
  query?: InputMaybe<History_ReportQueryInput>;
  set: History_ReportUpdateInput;
};


export type MutationUpdateManyIncidentsArgs = {
  query?: InputMaybe<IncidentQueryInput>;
  set: IncidentUpdateInput;
};


export type MutationUpdateManyNotificationsArgs = {
  query?: InputMaybe<NotificationQueryInput>;
  set: NotificationUpdateInput;
};


export type MutationUpdateManyQuickaddsArgs = {
  set: QuickaddUpdateInput;
};


export type MutationUpdateManyReportsArgs = {
  query?: InputMaybe<ReportQueryInput>;
  set: ReportUpdateInput;
};


export type MutationUpdateManySubmissionsArgs = {
  query?: InputMaybe<SubmissionQueryInput>;
  set: SubmissionUpdateInput;
};


export type MutationUpdateManySubscriptionsArgs = {
  query?: InputMaybe<SubscriptionQueryInput>;
  set: SubscriptionUpdateInput;
};


export type MutationUpdateManyTaxasArgs = {
  query?: InputMaybe<TaxaQueryInput>;
  set: TaxaUpdateInput;
};


export type MutationUpdateManyUsersArgs = {
  query?: InputMaybe<UserQueryInput>;
  set: UserUpdateInput;
};


export type MutationUpdateOneCandidateArgs = {
  query?: InputMaybe<CandidateQueryInput>;
  set: CandidateUpdateInput;
};


export type MutationUpdateOneChecklistArgs = {
  query?: InputMaybe<ChecklistQueryInput>;
  set: ChecklistUpdateInput;
};


export type MutationUpdateOneClassificationArgs = {
  query?: InputMaybe<ClassificationQueryInput>;
  set: ClassificationUpdateInput;
};


export type MutationUpdateOneDuplicateArgs = {
  query?: InputMaybe<DuplicateQueryInput>;
  set: DuplicateUpdateInput;
};


export type MutationUpdateOneEntityArgs = {
  query?: InputMaybe<EntityQueryInput>;
  set: EntityUpdateInput;
};


export type MutationUpdateOneHistory_IncidentArgs = {
  query?: InputMaybe<History_IncidentQueryInput>;
  set: History_IncidentUpdateInput;
};


export type MutationUpdateOneHistory_ReportArgs = {
  query?: InputMaybe<History_ReportQueryInput>;
  set: History_ReportUpdateInput;
};


export type MutationUpdateOneIncidentArgs = {
  query?: InputMaybe<IncidentQueryInput>;
  set: IncidentUpdateInput;
};


export type MutationUpdateOneNotificationArgs = {
  query?: InputMaybe<NotificationQueryInput>;
  set: NotificationUpdateInput;
};


export type MutationUpdateOneQuickaddArgs = {
  set: QuickaddUpdateInput;
};


export type MutationUpdateOneReportArgs = {
  query?: InputMaybe<ReportQueryInput>;
  set: ReportUpdateInput;
};


export type MutationUpdateOneReportTranslationArgs = {
  input?: InputMaybe<UpdateOneReportTranslationInput>;
};


export type MutationUpdateOneSubmissionArgs = {
  query?: InputMaybe<SubmissionQueryInput>;
  set: SubmissionUpdateInput;
};


export type MutationUpdateOneSubscriptionArgs = {
  query?: InputMaybe<SubscriptionQueryInput>;
  set: SubscriptionUpdateInput;
};


export type MutationUpdateOneTaxaArgs = {
  query?: InputMaybe<TaxaQueryInput>;
  set: TaxaUpdateInput;
};


export type MutationUpdateOneUserArgs = {
  query?: InputMaybe<UserQueryInput>;
  set: UserUpdateInput;
};


export type MutationUpsertOneCandidateArgs = {
  data: CandidateInsertInput;
  query?: InputMaybe<CandidateQueryInput>;
};


export type MutationUpsertOneChecklistArgs = {
  data: ChecklistInsertInput;
  query?: InputMaybe<ChecklistQueryInput>;
};


export type MutationUpsertOneClassificationArgs = {
  data: ClassificationInsertInput;
  query?: InputMaybe<ClassificationQueryInput>;
};


export type MutationUpsertOneDuplicateArgs = {
  data: DuplicateInsertInput;
  query?: InputMaybe<DuplicateQueryInput>;
};


export type MutationUpsertOneEntityArgs = {
  data: EntityInsertInput;
  query?: InputMaybe<EntityQueryInput>;
};


export type MutationUpsertOneHistory_IncidentArgs = {
  data: History_IncidentInsertInput;
  query?: InputMaybe<History_IncidentQueryInput>;
};


export type MutationUpsertOneHistory_ReportArgs = {
  data: History_ReportInsertInput;
  query?: InputMaybe<History_ReportQueryInput>;
};


export type MutationUpsertOneIncidentArgs = {
  data: IncidentInsertInput;
  query?: InputMaybe<IncidentQueryInput>;
};


export type MutationUpsertOneNotificationArgs = {
  data: NotificationInsertInput;
  query?: InputMaybe<NotificationQueryInput>;
};


export type MutationUpsertOneQuickaddArgs = {
  data: QuickaddInsertInput;
};


export type MutationUpsertOneReportArgs = {
  data: ReportInsertInput;
  query?: InputMaybe<ReportQueryInput>;
};


export type MutationUpsertOneSubmissionArgs = {
  data: SubmissionInsertInput;
  query?: InputMaybe<SubmissionQueryInput>;
};


export type MutationUpsertOneSubscriptionArgs = {
  data: SubscriptionInsertInput;
  query?: InputMaybe<SubscriptionQueryInput>;
};


export type MutationUpsertOneTaxaArgs = {
  data: TaxaInsertInput;
  query?: InputMaybe<TaxaQueryInput>;
};


export type MutationUpsertOneUserArgs = {
  data: UserInsertInput;
  query?: InputMaybe<UserQueryInput>;
};

export type Notification = {
  __typename?: 'Notification';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  incident_id?: Maybe<Scalars['Int']['output']>;
  processed?: Maybe<Scalars['Boolean']['output']>;
  sentDate?: Maybe<Scalars['DateTime']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<User>;
};

export type NotificationInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  sentDate?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<NotificationUserIdRelationInput>;
};

export type NotificationQueryInput = {
  AND?: InputMaybe<Array<NotificationQueryInput>>;
  OR?: InputMaybe<Array<NotificationQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id_gt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_gte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id_lt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_lte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_ne?: InputMaybe<Scalars['Int']['input']>;
  incident_id_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  processed_exists?: InputMaybe<Scalars['Boolean']['input']>;
  processed_ne?: InputMaybe<Scalars['Boolean']['input']>;
  sentDate?: InputMaybe<Scalars['DateTime']['input']>;
  sentDate_exists?: InputMaybe<Scalars['Boolean']['input']>;
  sentDate_gt?: InputMaybe<Scalars['DateTime']['input']>;
  sentDate_gte?: InputMaybe<Scalars['DateTime']['input']>;
  sentDate_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  sentDate_lt?: InputMaybe<Scalars['DateTime']['input']>;
  sentDate_lte?: InputMaybe<Scalars['DateTime']['input']>;
  sentDate_ne?: InputMaybe<Scalars['DateTime']['input']>;
  sentDate_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_exists?: InputMaybe<Scalars['Boolean']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_ne?: InputMaybe<Scalars['String']['input']>;
  type_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId?: InputMaybe<UserQueryInput>;
  userId_exists?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum NotificationSortByInput {
  IncidentIdAsc = 'INCIDENT_ID_ASC',
  IncidentIdDesc = 'INCIDENT_ID_DESC',
  SentdateAsc = 'SENTDATE_ASC',
  SentdateDesc = 'SENTDATE_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  UseridAsc = 'USERID_ASC',
  UseridDesc = 'USERID_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type NotificationUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_inc?: InputMaybe<Scalars['Int']['input']>;
  incident_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  processed?: InputMaybe<Scalars['Boolean']['input']>;
  processed_unset?: InputMaybe<Scalars['Boolean']['input']>;
  sentDate?: InputMaybe<Scalars['DateTime']['input']>;
  sentDate_unset?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_unset?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<NotificationUserIdRelationInput>;
  userId_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationUserIdRelationInput = {
  create?: InputMaybe<UserInsertInput>;
  link?: InputMaybe<Scalars['String']['input']>;
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
  All = '$all',
  Eql = '$eq',
  Gt = '$gt',
  Gte = '$gte',
  In = '$in',
  Lt = '$lt',
  Lte = '$lte',
  Ne = '$ne',
  Nin = '$nin'
}

export type PaginationType = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export type PromoteSubmissionToReportInput = {
  incident_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  is_incident_report?: InputMaybe<Scalars['Boolean']['input']>;
  submission_id?: InputMaybe<Scalars['ObjectId']['input']>;
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
  candidates: Array<Maybe<Candidate>>;
  checklist?: Maybe<Checklist>;
  checklists: Array<Maybe<Checklist>>;
  classification?: Maybe<Classification>;
  classifications: Array<Maybe<Classification>>;
  duplicate?: Maybe<Duplicate>;
  duplicates: Array<Maybe<Duplicate>>;
  entities: Array<Maybe<Entity>>;
  entity?: Maybe<Entity>;
  history_incident?: Maybe<History_Incident>;
  history_incidents: Array<Maybe<History_Incident>>;
  history_report?: Maybe<History_Report>;
  history_reports: Array<Maybe<History_Report>>;
  incident?: Maybe<Incident>;
  incidents: Array<Maybe<Incident>>;
  notification?: Maybe<Notification>;
  notifications: Array<Maybe<Notification>>;
  quickadd?: Maybe<Quickadd>;
  quickadds?: Maybe<Array<Maybe<QuickAdd>>>;
  report?: Maybe<Report>;
  reports: Array<Maybe<Report>>;
  risks?: Maybe<Array<Maybe<RisksPayloadItem>>>;
  submission?: Maybe<Submission>;
  submissions: Array<Maybe<Submission>>;
  subscription?: Maybe<Subscription>;
  subscriptions: Array<Maybe<Subscription>>;
  taxa?: Maybe<Taxa>;
  taxas: Array<Maybe<Taxa>>;
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
};


export type QueryCandidateArgs = {
  query?: InputMaybe<CandidateQueryInput>;
};


export type QueryCandidatesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<CandidateQueryInput>;
  sortBy?: InputMaybe<CandidateSortByInput>;
};


export type QueryChecklistArgs = {
  query?: InputMaybe<ChecklistQueryInput>;
};


export type QueryChecklistsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<ChecklistQueryInput>;
  sortBy?: InputMaybe<ChecklistSortByInput>;
};


export type QueryClassificationArgs = {
  query?: InputMaybe<ClassificationQueryInput>;
};


export type QueryClassificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<ClassificationQueryInput>;
  sortBy?: InputMaybe<ClassificationSortByInput>;
};


export type QueryDuplicateArgs = {
  query?: InputMaybe<DuplicateQueryInput>;
};


export type QueryDuplicatesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<DuplicateQueryInput>;
  sortBy?: InputMaybe<DuplicateSortByInput>;
};


export type QueryEntitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<EntityQueryInput>;
  sortBy?: InputMaybe<EntitySortByInput>;
};


export type QueryEntityArgs = {
  query?: InputMaybe<EntityQueryInput>;
};


export type QueryHistory_IncidentArgs = {
  query?: InputMaybe<History_IncidentQueryInput>;
};


export type QueryHistory_IncidentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<History_IncidentQueryInput>;
  sortBy?: InputMaybe<History_IncidentSortByInput>;
};


export type QueryHistory_ReportArgs = {
  query?: InputMaybe<History_ReportQueryInput>;
};


export type QueryHistory_ReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<History_ReportQueryInput>;
  sortBy?: InputMaybe<History_ReportSortByInput>;
};


export type QueryIncidentArgs = {
  query?: InputMaybe<IncidentQueryInput>;
};


export type QueryIncidentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<IncidentQueryInput>;
  sortBy?: InputMaybe<IncidentSortByInput>;
};


export type QueryNotificationArgs = {
  query?: InputMaybe<NotificationQueryInput>;
};


export type QueryNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<NotificationQueryInput>;
  sortBy?: InputMaybe<NotificationSortByInput>;
};


export type QueryQuickaddsArgs = {
  filter?: InputMaybe<QuickAddFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<QuickAddSortType>;
};


export type QueryReportArgs = {
  query?: InputMaybe<ReportQueryInput>;
};


export type QueryReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<ReportQueryInput>;
  sortBy?: InputMaybe<ReportSortByInput>;
};


export type QueryRisksArgs = {
  input?: InputMaybe<RisksInput>;
};


export type QuerySubmissionArgs = {
  query?: InputMaybe<SubmissionQueryInput>;
};


export type QuerySubmissionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<SubmissionQueryInput>;
  sortBy?: InputMaybe<SubmissionSortByInput>;
};


export type QuerySubscriptionArgs = {
  query?: InputMaybe<SubscriptionQueryInput>;
};


export type QuerySubscriptionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<SubscriptionQueryInput>;
  sortBy?: InputMaybe<SubscriptionSortByInput>;
};


export type QueryTaxaArgs = {
  query?: InputMaybe<TaxaQueryInput>;
};


export type QueryTaxasArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<TaxaQueryInput>;
  sortBy?: InputMaybe<TaxaSortByInput>;
};


export type QueryUserArgs = {
  query?: InputMaybe<UserQueryInput>;
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<UserQueryInput>;
  sortBy?: InputMaybe<UserSortByInput>;
};

export type QuickAdd = {
  __typename?: 'QuickAdd';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  date_submitted?: Maybe<Scalars['String']['output']>;
  incident_id?: Maybe<Scalars['Long']['output']>;
  source_domain?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type QuickAddFilterType = {
  AND?: InputMaybe<Array<InputMaybe<QuickAddFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<QuickAddFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<QuickAddFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  date_submitted?: InputMaybe<StringFilter>;
  incident_id?: InputMaybe<LongFilter>;
  source_domain?: InputMaybe<StringFilter>;
  url?: InputMaybe<StringFilter>;
};

export type QuickAddInsertType = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  date_submitted?: InputMaybe<Scalars['String']['input']>;
  incident_id?: InputMaybe<Scalars['Long']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type QuickAddSortType = {
  _id?: InputMaybe<SortType>;
  date_submitted?: InputMaybe<SortType>;
  incident_id?: InputMaybe<SortType>;
  source_domain?: InputMaybe<SortType>;
  url?: InputMaybe<SortType>;
};

export type Quickadd = {
  __typename?: 'Quickadd';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  date_submitted: Scalars['String']['output'];
  incident_id?: Maybe<Scalars['Long']['output']>;
  source_domain?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type QuickaddInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  date_submitted: Scalars['String']['input'];
  incident_id?: InputMaybe<Scalars['Long']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
};

export enum QuickaddSortByInput {
  DateSubmittedAsc = 'DATE_SUBMITTED_ASC',
  DateSubmittedDesc = 'DATE_SUBMITTED_DESC',
  IncidentIdAsc = 'INCIDENT_ID_ASC',
  IncidentIdDesc = 'INCIDENT_ID_DESC',
  SourceDomainAsc = 'SOURCE_DOMAIN_ASC',
  SourceDomainDesc = 'SOURCE_DOMAIN_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type QuickaddUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_submitted?: InputMaybe<Scalars['String']['input']>;
  date_submitted_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id?: InputMaybe<Scalars['Long']['input']>;
  incident_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  source_domain_unset?: InputMaybe<Scalars['Boolean']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  url_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Report = {
  __typename?: 'Report';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  authors: Array<Maybe<Scalars['String']['output']>>;
  cloudinary_id: Scalars['String']['output'];
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
  translations?: Maybe<ReportTranslation>;
  url: Scalars['String']['output'];
  user?: Maybe<User>;
};


export type ReportTranslationsArgs = {
  input?: InputMaybe<Scalars['String']['input']>;
};

export type ReportEmbedding = {
  __typename?: 'ReportEmbedding';
  from_text_hash?: Maybe<Scalars['String']['output']>;
  vector?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type ReportEmbeddingInsertInput = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type ReportEmbeddingQueryInput = {
  AND?: InputMaybe<Array<ReportEmbeddingQueryInput>>;
  OR?: InputMaybe<Array<ReportEmbeddingQueryInput>>;
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_exists?: InputMaybe<Scalars['Boolean']['input']>;
  from_text_hash_gt?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_gte?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_text_hash_lt?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_lte?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_ne?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_exists?: InputMaybe<Scalars['Boolean']['input']>;
  vector_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type ReportEmbeddingUpdateInput = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_unset?: InputMaybe<Scalars['Boolean']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ReportInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  authors: Array<InputMaybe<Scalars['String']['input']>>;
  cloudinary_id: Scalars['String']['input'];
  date_downloaded: Scalars['DateTime']['input'];
  date_modified: Scalars['DateTime']['input'];
  date_published: Scalars['DateTime']['input'];
  date_submitted: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  embedding?: InputMaybe<ReportEmbeddingInsertInput>;
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

export type ReportQueryInput = {
  AND?: InputMaybe<Array<ReportQueryInput>>;
  OR?: InputMaybe<Array<ReportQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_exists?: InputMaybe<Scalars['Boolean']['input']>;
  authors_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cloudinary_id?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  cloudinary_id_gt?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_gte?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cloudinary_id_lt?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_lte?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_ne?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_downloaded?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_downloaded_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_downloaded_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_modified_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_modified_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_published?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_published_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_published_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_submitted?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_submitted_gt?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_gte?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  date_submitted_lt?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_lte?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_ne?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_ne?: InputMaybe<Scalars['String']['input']>;
  description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_notes_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_notes_gt?: InputMaybe<Scalars['String']['input']>;
  editor_notes_gte?: InputMaybe<Scalars['String']['input']>;
  editor_notes_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_notes_lt?: InputMaybe<Scalars['String']['input']>;
  editor_notes_lte?: InputMaybe<Scalars['String']['input']>;
  editor_notes_ne?: InputMaybe<Scalars['String']['input']>;
  editor_notes_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  embedding?: InputMaybe<ReportEmbeddingQueryInput>;
  embedding_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_downloaded?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_downloaded_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_downloaded_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_modified_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_published?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_published_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_published_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_submitted?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_submitted_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_submitted_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  flag?: InputMaybe<Scalars['Boolean']['input']>;
  flag_exists?: InputMaybe<Scalars['Boolean']['input']>;
  flag_ne?: InputMaybe<Scalars['Boolean']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  image_url_exists?: InputMaybe<Scalars['Boolean']['input']>;
  image_url_gt?: InputMaybe<Scalars['String']['input']>;
  image_url_gte?: InputMaybe<Scalars['String']['input']>;
  image_url_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  image_url_lt?: InputMaybe<Scalars['String']['input']>;
  image_url_lte?: InputMaybe<Scalars['String']['input']>;
  image_url_ne?: InputMaybe<Scalars['String']['input']>;
  image_url_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputs_outputs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputs_outputs_exists?: InputMaybe<Scalars['Boolean']['input']>;
  inputs_outputs_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputs_outputs_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  is_incident_report?: InputMaybe<Scalars['Boolean']['input']>;
  is_incident_report_exists?: InputMaybe<Scalars['Boolean']['input']>;
  is_incident_report_ne?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  language_exists?: InputMaybe<Scalars['Boolean']['input']>;
  language_gt?: InputMaybe<Scalars['String']['input']>;
  language_gte?: InputMaybe<Scalars['String']['input']>;
  language_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  language_lt?: InputMaybe<Scalars['String']['input']>;
  language_lte?: InputMaybe<Scalars['String']['input']>;
  language_ne?: InputMaybe<Scalars['String']['input']>;
  language_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  plain_text_exists?: InputMaybe<Scalars['Boolean']['input']>;
  plain_text_gt?: InputMaybe<Scalars['String']['input']>;
  plain_text_gte?: InputMaybe<Scalars['String']['input']>;
  plain_text_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plain_text_lt?: InputMaybe<Scalars['String']['input']>;
  plain_text_lte?: InputMaybe<Scalars['String']['input']>;
  plain_text_ne?: InputMaybe<Scalars['String']['input']>;
  plain_text_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  quiet_exists?: InputMaybe<Scalars['Boolean']['input']>;
  quiet_ne?: InputMaybe<Scalars['Boolean']['input']>;
  report_number?: InputMaybe<Scalars['Int']['input']>;
  report_number_exists?: InputMaybe<Scalars['Boolean']['input']>;
  report_number_gt?: InputMaybe<Scalars['Int']['input']>;
  report_number_gte?: InputMaybe<Scalars['Int']['input']>;
  report_number_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  report_number_lt?: InputMaybe<Scalars['Int']['input']>;
  report_number_lte?: InputMaybe<Scalars['Int']['input']>;
  report_number_ne?: InputMaybe<Scalars['Int']['input']>;
  report_number_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  source_domain_exists?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain_gt?: InputMaybe<Scalars['String']['input']>;
  source_domain_gte?: InputMaybe<Scalars['String']['input']>;
  source_domain_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  source_domain_lt?: InputMaybe<Scalars['String']['input']>;
  source_domain_lte?: InputMaybe<Scalars['String']['input']>;
  source_domain_ne?: InputMaybe<Scalars['String']['input']>;
  source_domain_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters_exists?: InputMaybe<Scalars['Boolean']['input']>;
  submitters_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_exists?: InputMaybe<Scalars['Boolean']['input']>;
  tags_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
  text_exists?: InputMaybe<Scalars['Boolean']['input']>;
  text_gt?: InputMaybe<Scalars['String']['input']>;
  text_gte?: InputMaybe<Scalars['String']['input']>;
  text_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text_lt?: InputMaybe<Scalars['String']['input']>;
  text_lte?: InputMaybe<Scalars['String']['input']>;
  text_ne?: InputMaybe<Scalars['String']['input']>;
  text_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_ne?: InputMaybe<Scalars['String']['input']>;
  title_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  url?: InputMaybe<Scalars['String']['input']>;
  url_exists?: InputMaybe<Scalars['Boolean']['input']>;
  url_gt?: InputMaybe<Scalars['String']['input']>;
  url_gte?: InputMaybe<Scalars['String']['input']>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  url_lt?: InputMaybe<Scalars['String']['input']>;
  url_lte?: InputMaybe<Scalars['String']['input']>;
  url_ne?: InputMaybe<Scalars['String']['input']>;
  url_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  user?: InputMaybe<UserQueryInput>;
  user_exists?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum ReportSortByInput {
  CloudinaryIdAsc = 'CLOUDINARY_ID_ASC',
  CloudinaryIdDesc = 'CLOUDINARY_ID_DESC',
  DateDownloadedAsc = 'DATE_DOWNLOADED_ASC',
  DateDownloadedDesc = 'DATE_DOWNLOADED_DESC',
  DateModifiedAsc = 'DATE_MODIFIED_ASC',
  DateModifiedDesc = 'DATE_MODIFIED_DESC',
  DatePublishedAsc = 'DATE_PUBLISHED_ASC',
  DatePublishedDesc = 'DATE_PUBLISHED_DESC',
  DateSubmittedAsc = 'DATE_SUBMITTED_ASC',
  DateSubmittedDesc = 'DATE_SUBMITTED_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  EditorNotesAsc = 'EDITOR_NOTES_ASC',
  EditorNotesDesc = 'EDITOR_NOTES_DESC',
  EpochDateDownloadedAsc = 'EPOCH_DATE_DOWNLOADED_ASC',
  EpochDateDownloadedDesc = 'EPOCH_DATE_DOWNLOADED_DESC',
  EpochDateModifiedAsc = 'EPOCH_DATE_MODIFIED_ASC',
  EpochDateModifiedDesc = 'EPOCH_DATE_MODIFIED_DESC',
  EpochDatePublishedAsc = 'EPOCH_DATE_PUBLISHED_ASC',
  EpochDatePublishedDesc = 'EPOCH_DATE_PUBLISHED_DESC',
  EpochDateSubmittedAsc = 'EPOCH_DATE_SUBMITTED_ASC',
  EpochDateSubmittedDesc = 'EPOCH_DATE_SUBMITTED_DESC',
  ImageUrlAsc = 'IMAGE_URL_ASC',
  ImageUrlDesc = 'IMAGE_URL_DESC',
  LanguageAsc = 'LANGUAGE_ASC',
  LanguageDesc = 'LANGUAGE_DESC',
  PlainTextAsc = 'PLAIN_TEXT_ASC',
  PlainTextDesc = 'PLAIN_TEXT_DESC',
  ReportNumberAsc = 'REPORT_NUMBER_ASC',
  ReportNumberDesc = 'REPORT_NUMBER_DESC',
  SourceDomainAsc = 'SOURCE_DOMAIN_ASC',
  SourceDomainDesc = 'SOURCE_DOMAIN_DESC',
  TextAsc = 'TEXT_ASC',
  TextDesc = 'TEXT_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC',
  UserAsc = 'USER_ASC',
  UserDesc = 'USER_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type ReportTranslation = {
  __typename?: 'ReportTranslation';
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ReportUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_unset?: InputMaybe<Scalars['Boolean']['input']>;
  cloudinary_id?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_downloaded?: InputMaybe<Scalars['DateTime']['input']>;
  date_downloaded_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_modified?: InputMaybe<Scalars['DateTime']['input']>;
  date_modified_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_published?: InputMaybe<Scalars['DateTime']['input']>;
  date_published_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_submitted?: InputMaybe<Scalars['DateTime']['input']>;
  date_submitted_unset?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_notes_unset?: InputMaybe<Scalars['Boolean']['input']>;
  embedding?: InputMaybe<ReportEmbeddingUpdateInput>;
  embedding_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_downloaded?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_downloaded_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_published?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_published_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_submitted?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_submitted_unset?: InputMaybe<Scalars['Boolean']['input']>;
  flag?: InputMaybe<Scalars['Boolean']['input']>;
  flag_unset?: InputMaybe<Scalars['Boolean']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  image_url_unset?: InputMaybe<Scalars['Boolean']['input']>;
  inputs_outputs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  inputs_outputs_unset?: InputMaybe<Scalars['Boolean']['input']>;
  is_incident_report?: InputMaybe<Scalars['Boolean']['input']>;
  is_incident_report_unset?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  language_unset?: InputMaybe<Scalars['Boolean']['input']>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  plain_text_unset?: InputMaybe<Scalars['Boolean']['input']>;
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  quiet_unset?: InputMaybe<Scalars['Boolean']['input']>;
  report_number?: InputMaybe<Scalars['Int']['input']>;
  report_number_inc?: InputMaybe<Scalars['Int']['input']>;
  report_number_unset?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  source_domain_unset?: InputMaybe<Scalars['Boolean']['input']>;
  submitters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters_unset?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_unset?: InputMaybe<Scalars['Boolean']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  text_unset?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_unset?: InputMaybe<Scalars['Boolean']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  url_unset?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<ReportUserRelationInput>;
  user_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ReportUserRelationInput = {
  create?: InputMaybe<UserInsertInput>;
  link?: InputMaybe<Scalars['String']['input']>;
};

export type RisksInput = {
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type RisksPayloadItem = {
  __typename?: 'RisksPayloadItem';
  precedents?: Maybe<Array<Maybe<RisksPayloadPrecedent>>>;
  tag?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type RisksPayloadPrecedent = {
  __typename?: 'RisksPayloadPrecedent';
  AllegedDeployerOfAISystem?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  AllegedDeveloperOfAISystem?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  AllegedHarmedOrNearlyHarmedParties?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  _id?: Maybe<Scalars['ObjectId']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  editor_dissimilar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editor_notes?: Maybe<Scalars['String']['output']>;
  editor_similar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  editors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  embedding?: Maybe<RisksPayloadPrecedentEmbedding>;
  epoch_date_modified?: Maybe<Scalars['Int']['output']>;
  flagged_dissimilar_incidents?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  incident_id?: Maybe<Scalars['Int']['output']>;
  nlp_similar_incidents?: Maybe<Array<Maybe<RisksPayloadPrecedentNlp_Similar_Incident>>>;
  reports?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  title?: Maybe<Scalars['String']['output']>;
  tsne?: Maybe<RisksPayloadPrecedentTsne>;
};

export type RisksPayloadPrecedentEmbedding = {
  __typename?: 'RisksPayloadPrecedentEmbedding';
  from_reports?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  vector?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type RisksPayloadPrecedentNlp_Similar_Incident = {
  __typename?: 'RisksPayloadPrecedentNlp_similar_incident';
  incident_id?: Maybe<Scalars['Int']['output']>;
  similarity?: Maybe<Scalars['Float']['output']>;
};

export type RisksPayloadPrecedentTsne = {
  __typename?: 'RisksPayloadPrecedentTsne';
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
};

export enum SortType {
  Asc = 1,
  Desc = -1
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
  embedding?: Maybe<SubmissionEmbedding>;
  epoch_date_modified?: Maybe<Scalars['Int']['output']>;
  harmed_parties?: Maybe<Array<Maybe<Entity>>>;
  image_url: Scalars['String']['output'];
  incident_date?: Maybe<Scalars['String']['output']>;
  incident_editors?: Maybe<Array<Maybe<User>>>;
  incident_ids?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  incident_title?: Maybe<Scalars['String']['output']>;
  language: Scalars['String']['output'];
  nlp_similar_incidents?: Maybe<Array<Maybe<SubmissionNlp_Similar_Incident>>>;
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
  create?: InputMaybe<Array<InputMaybe<EntityInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type SubmissionDevelopersRelationInput = {
  create?: InputMaybe<Array<InputMaybe<EntityInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type SubmissionEmbedding = {
  __typename?: 'SubmissionEmbedding';
  from_text_hash?: Maybe<Scalars['String']['output']>;
  vector?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
};

export type SubmissionEmbeddingInsertInput = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type SubmissionEmbeddingQueryInput = {
  AND?: InputMaybe<Array<SubmissionEmbeddingQueryInput>>;
  OR?: InputMaybe<Array<SubmissionEmbeddingQueryInput>>;
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_exists?: InputMaybe<Scalars['Boolean']['input']>;
  from_text_hash_gt?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_gte?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from_text_hash_lt?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_lte?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_ne?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_exists?: InputMaybe<Scalars['Boolean']['input']>;
  vector_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type SubmissionEmbeddingUpdateInput = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_unset?: InputMaybe<Scalars['Boolean']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SubmissionHarmed_PartiesRelationInput = {
  create?: InputMaybe<Array<InputMaybe<EntityInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type SubmissionIncident_EditorsRelationInput = {
  create?: InputMaybe<Array<InputMaybe<UserInsertInput>>>;
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type SubmissionInsertInput = {
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
  embedding?: InputMaybe<SubmissionEmbeddingInsertInput>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  harmed_parties?: InputMaybe<SubmissionHarmed_PartiesRelationInput>;
  image_url: Scalars['String']['input'];
  incident_date?: InputMaybe<Scalars['String']['input']>;
  incident_editors?: InputMaybe<SubmissionIncident_EditorsRelationInput>;
  incident_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_title?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<SubmissionNlp_Similar_IncidentInsertInput>>>;
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

export type SubmissionNlp_Similar_Incident = {
  __typename?: 'SubmissionNlp_similar_incident';
  incident_id?: Maybe<Scalars['Int']['output']>;
  similarity?: Maybe<Scalars['Float']['output']>;
};

export type SubmissionNlp_Similar_IncidentInsertInput = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
};

export type SubmissionNlp_Similar_IncidentQueryInput = {
  AND?: InputMaybe<Array<SubmissionNlp_Similar_IncidentQueryInput>>;
  OR?: InputMaybe<Array<SubmissionNlp_Similar_IncidentQueryInput>>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id_gt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_gte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id_lt?: InputMaybe<Scalars['Int']['input']>;
  incident_id_lte?: InputMaybe<Scalars['Int']['input']>;
  incident_id_ne?: InputMaybe<Scalars['Int']['input']>;
  incident_id_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_exists?: InputMaybe<Scalars['Boolean']['input']>;
  similarity_gt?: InputMaybe<Scalars['Float']['input']>;
  similarity_gte?: InputMaybe<Scalars['Float']['input']>;
  similarity_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  similarity_lt?: InputMaybe<Scalars['Float']['input']>;
  similarity_lte?: InputMaybe<Scalars['Float']['input']>;
  similarity_ne?: InputMaybe<Scalars['Float']['input']>;
  similarity_nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type SubmissionNlp_Similar_IncidentUpdateInput = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_inc?: InputMaybe<Scalars['Int']['input']>;
  incident_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_inc?: InputMaybe<Scalars['Float']['input']>;
  similarity_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SubmissionQueryInput = {
  AND?: InputMaybe<Array<SubmissionQueryInput>>;
  OR?: InputMaybe<Array<SubmissionQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_exists?: InputMaybe<Scalars['Boolean']['input']>;
  authors_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cloudinary_id?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  cloudinary_id_gt?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_gte?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  cloudinary_id_lt?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_lte?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_ne?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_downloaded?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_downloaded_gt?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_gte?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_downloaded_lt?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_lte?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_ne?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_modified?: InputMaybe<Scalars['String']['input']>;
  date_modified_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_modified_gt?: InputMaybe<Scalars['String']['input']>;
  date_modified_gte?: InputMaybe<Scalars['String']['input']>;
  date_modified_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_modified_lt?: InputMaybe<Scalars['String']['input']>;
  date_modified_lte?: InputMaybe<Scalars['String']['input']>;
  date_modified_ne?: InputMaybe<Scalars['String']['input']>;
  date_modified_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_published?: InputMaybe<Scalars['String']['input']>;
  date_published_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_published_gt?: InputMaybe<Scalars['String']['input']>;
  date_published_gte?: InputMaybe<Scalars['String']['input']>;
  date_published_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_published_lt?: InputMaybe<Scalars['String']['input']>;
  date_published_lte?: InputMaybe<Scalars['String']['input']>;
  date_published_ne?: InputMaybe<Scalars['String']['input']>;
  date_published_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_submitted?: InputMaybe<Scalars['String']['input']>;
  date_submitted_exists?: InputMaybe<Scalars['Boolean']['input']>;
  date_submitted_gt?: InputMaybe<Scalars['String']['input']>;
  date_submitted_gte?: InputMaybe<Scalars['String']['input']>;
  date_submitted_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  date_submitted_lt?: InputMaybe<Scalars['String']['input']>;
  date_submitted_lte?: InputMaybe<Scalars['String']['input']>;
  date_submitted_ne?: InputMaybe<Scalars['String']['input']>;
  date_submitted_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  deployers?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  deployers_exists?: InputMaybe<Scalars['Boolean']['input']>;
  deployers_in?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  deployers_nin?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_ne?: InputMaybe<Scalars['String']['input']>;
  description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  developers?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  developers_exists?: InputMaybe<Scalars['Boolean']['input']>;
  developers_in?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  developers_nin?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_dissimilar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_dissimilar_incidents_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_dissimilar_incidents_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_notes_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_notes_gt?: InputMaybe<Scalars['String']['input']>;
  editor_notes_gte?: InputMaybe<Scalars['String']['input']>;
  editor_notes_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_notes_lt?: InputMaybe<Scalars['String']['input']>;
  editor_notes_lte?: InputMaybe<Scalars['String']['input']>;
  editor_notes_ne?: InputMaybe<Scalars['String']['input']>;
  editor_notes_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_similar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  editor_similar_incidents_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_similar_incidents_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  embedding?: InputMaybe<SubmissionEmbeddingQueryInput>;
  embedding_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_exists?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified_gt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_gte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  epoch_date_modified_lt?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_lte?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_ne?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  harmed_parties?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  harmed_parties_exists?: InputMaybe<Scalars['Boolean']['input']>;
  harmed_parties_in?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  harmed_parties_nin?: InputMaybe<Array<InputMaybe<EntityQueryInput>>>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  image_url_exists?: InputMaybe<Scalars['Boolean']['input']>;
  image_url_gt?: InputMaybe<Scalars['String']['input']>;
  image_url_gte?: InputMaybe<Scalars['String']['input']>;
  image_url_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  image_url_lt?: InputMaybe<Scalars['String']['input']>;
  image_url_lte?: InputMaybe<Scalars['String']['input']>;
  image_url_ne?: InputMaybe<Scalars['String']['input']>;
  image_url_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  incident_date?: InputMaybe<Scalars['String']['input']>;
  incident_date_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_date_gt?: InputMaybe<Scalars['String']['input']>;
  incident_date_gte?: InputMaybe<Scalars['String']['input']>;
  incident_date_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  incident_date_lt?: InputMaybe<Scalars['String']['input']>;
  incident_date_lte?: InputMaybe<Scalars['String']['input']>;
  incident_date_ne?: InputMaybe<Scalars['String']['input']>;
  incident_date_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  incident_editors?: InputMaybe<Array<InputMaybe<UserQueryInput>>>;
  incident_editors_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_editors_in?: InputMaybe<Array<InputMaybe<UserQueryInput>>>;
  incident_editors_nin?: InputMaybe<Array<InputMaybe<UserQueryInput>>>;
  incident_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_ids_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_ids_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_ids_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_title?: InputMaybe<Scalars['String']['input']>;
  incident_title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_title_gt?: InputMaybe<Scalars['String']['input']>;
  incident_title_gte?: InputMaybe<Scalars['String']['input']>;
  incident_title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  incident_title_lt?: InputMaybe<Scalars['String']['input']>;
  incident_title_lte?: InputMaybe<Scalars['String']['input']>;
  incident_title_ne?: InputMaybe<Scalars['String']['input']>;
  incident_title_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  language?: InputMaybe<Scalars['String']['input']>;
  language_exists?: InputMaybe<Scalars['Boolean']['input']>;
  language_gt?: InputMaybe<Scalars['String']['input']>;
  language_gte?: InputMaybe<Scalars['String']['input']>;
  language_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  language_lt?: InputMaybe<Scalars['String']['input']>;
  language_lte?: InputMaybe<Scalars['String']['input']>;
  language_ne?: InputMaybe<Scalars['String']['input']>;
  language_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<SubmissionNlp_Similar_IncidentQueryInput>>>;
  nlp_similar_incidents_exists?: InputMaybe<Scalars['Boolean']['input']>;
  nlp_similar_incidents_in?: InputMaybe<Array<InputMaybe<SubmissionNlp_Similar_IncidentQueryInput>>>;
  nlp_similar_incidents_nin?: InputMaybe<Array<InputMaybe<SubmissionNlp_Similar_IncidentQueryInput>>>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  plain_text_exists?: InputMaybe<Scalars['Boolean']['input']>;
  plain_text_gt?: InputMaybe<Scalars['String']['input']>;
  plain_text_gte?: InputMaybe<Scalars['String']['input']>;
  plain_text_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plain_text_lt?: InputMaybe<Scalars['String']['input']>;
  plain_text_lte?: InputMaybe<Scalars['String']['input']>;
  plain_text_ne?: InputMaybe<Scalars['String']['input']>;
  plain_text_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  quiet_exists?: InputMaybe<Scalars['Boolean']['input']>;
  quiet_ne?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  source_domain_exists?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain_gt?: InputMaybe<Scalars['String']['input']>;
  source_domain_gte?: InputMaybe<Scalars['String']['input']>;
  source_domain_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  source_domain_lt?: InputMaybe<Scalars['String']['input']>;
  source_domain_lte?: InputMaybe<Scalars['String']['input']>;
  source_domain_ne?: InputMaybe<Scalars['String']['input']>;
  source_domain_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_exists?: InputMaybe<Scalars['Boolean']['input']>;
  status_gt?: InputMaybe<Scalars['String']['input']>;
  status_gte?: InputMaybe<Scalars['String']['input']>;
  status_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status_lt?: InputMaybe<Scalars['String']['input']>;
  status_lte?: InputMaybe<Scalars['String']['input']>;
  status_ne?: InputMaybe<Scalars['String']['input']>;
  status_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters_exists?: InputMaybe<Scalars['Boolean']['input']>;
  submitters_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_exists?: InputMaybe<Scalars['Boolean']['input']>;
  tags_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
  text_exists?: InputMaybe<Scalars['Boolean']['input']>;
  text_gt?: InputMaybe<Scalars['String']['input']>;
  text_gte?: InputMaybe<Scalars['String']['input']>;
  text_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text_lt?: InputMaybe<Scalars['String']['input']>;
  text_lte?: InputMaybe<Scalars['String']['input']>;
  text_ne?: InputMaybe<Scalars['String']['input']>;
  text_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_exists?: InputMaybe<Scalars['Boolean']['input']>;
  title_gt?: InputMaybe<Scalars['String']['input']>;
  title_gte?: InputMaybe<Scalars['String']['input']>;
  title_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title_lt?: InputMaybe<Scalars['String']['input']>;
  title_lte?: InputMaybe<Scalars['String']['input']>;
  title_ne?: InputMaybe<Scalars['String']['input']>;
  title_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  url?: InputMaybe<Scalars['String']['input']>;
  url_exists?: InputMaybe<Scalars['Boolean']['input']>;
  url_gt?: InputMaybe<Scalars['String']['input']>;
  url_gte?: InputMaybe<Scalars['String']['input']>;
  url_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  url_lt?: InputMaybe<Scalars['String']['input']>;
  url_lte?: InputMaybe<Scalars['String']['input']>;
  url_ne?: InputMaybe<Scalars['String']['input']>;
  url_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  user?: InputMaybe<UserQueryInput>;
  user_exists?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum SubmissionSortByInput {
  CloudinaryIdAsc = 'CLOUDINARY_ID_ASC',
  CloudinaryIdDesc = 'CLOUDINARY_ID_DESC',
  DateDownloadedAsc = 'DATE_DOWNLOADED_ASC',
  DateDownloadedDesc = 'DATE_DOWNLOADED_DESC',
  DateModifiedAsc = 'DATE_MODIFIED_ASC',
  DateModifiedDesc = 'DATE_MODIFIED_DESC',
  DatePublishedAsc = 'DATE_PUBLISHED_ASC',
  DatePublishedDesc = 'DATE_PUBLISHED_DESC',
  DateSubmittedAsc = 'DATE_SUBMITTED_ASC',
  DateSubmittedDesc = 'DATE_SUBMITTED_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  EditorNotesAsc = 'EDITOR_NOTES_ASC',
  EditorNotesDesc = 'EDITOR_NOTES_DESC',
  EpochDateModifiedAsc = 'EPOCH_DATE_MODIFIED_ASC',
  EpochDateModifiedDesc = 'EPOCH_DATE_MODIFIED_DESC',
  ImageUrlAsc = 'IMAGE_URL_ASC',
  ImageUrlDesc = 'IMAGE_URL_DESC',
  IncidentDateAsc = 'INCIDENT_DATE_ASC',
  IncidentDateDesc = 'INCIDENT_DATE_DESC',
  IncidentTitleAsc = 'INCIDENT_TITLE_ASC',
  IncidentTitleDesc = 'INCIDENT_TITLE_DESC',
  LanguageAsc = 'LANGUAGE_ASC',
  LanguageDesc = 'LANGUAGE_DESC',
  PlainTextAsc = 'PLAIN_TEXT_ASC',
  PlainTextDesc = 'PLAIN_TEXT_DESC',
  SourceDomainAsc = 'SOURCE_DOMAIN_ASC',
  SourceDomainDesc = 'SOURCE_DOMAIN_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  TextAsc = 'TEXT_ASC',
  TextDesc = 'TEXT_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC',
  UserAsc = 'USER_ASC',
  UserDesc = 'USER_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type SubmissionUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  authors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  authors_unset?: InputMaybe<Scalars['Boolean']['input']>;
  cloudinary_id?: InputMaybe<Scalars['String']['input']>;
  cloudinary_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_downloaded?: InputMaybe<Scalars['String']['input']>;
  date_downloaded_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_modified?: InputMaybe<Scalars['String']['input']>;
  date_modified_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_published?: InputMaybe<Scalars['String']['input']>;
  date_published_unset?: InputMaybe<Scalars['Boolean']['input']>;
  date_submitted?: InputMaybe<Scalars['String']['input']>;
  date_submitted_unset?: InputMaybe<Scalars['Boolean']['input']>;
  deployers?: InputMaybe<SubmissionDeployersRelationInput>;
  deployers_unset?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  developers?: InputMaybe<SubmissionDevelopersRelationInput>;
  developers_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_dissimilar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_notes_unset?: InputMaybe<Scalars['Boolean']['input']>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_similar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  embedding?: InputMaybe<SubmissionEmbeddingUpdateInput>;
  embedding_unset?: InputMaybe<Scalars['Boolean']['input']>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_inc?: InputMaybe<Scalars['Int']['input']>;
  epoch_date_modified_unset?: InputMaybe<Scalars['Boolean']['input']>;
  harmed_parties?: InputMaybe<SubmissionHarmed_PartiesRelationInput>;
  harmed_parties_unset?: InputMaybe<Scalars['Boolean']['input']>;
  image_url?: InputMaybe<Scalars['String']['input']>;
  image_url_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incident_date?: InputMaybe<Scalars['String']['input']>;
  incident_date_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incident_editors?: InputMaybe<SubmissionIncident_EditorsRelationInput>;
  incident_editors_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incident_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_ids_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incident_title?: InputMaybe<Scalars['String']['input']>;
  incident_title_unset?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  language_unset?: InputMaybe<Scalars['Boolean']['input']>;
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<SubmissionNlp_Similar_IncidentUpdateInput>>>;
  nlp_similar_incidents_unset?: InputMaybe<Scalars['Boolean']['input']>;
  plain_text?: InputMaybe<Scalars['String']['input']>;
  plain_text_unset?: InputMaybe<Scalars['Boolean']['input']>;
  quiet?: InputMaybe<Scalars['Boolean']['input']>;
  quiet_unset?: InputMaybe<Scalars['Boolean']['input']>;
  source_domain?: InputMaybe<Scalars['String']['input']>;
  source_domain_unset?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  status_unset?: InputMaybe<Scalars['Boolean']['input']>;
  submitters?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  submitters_unset?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tags_unset?: InputMaybe<Scalars['Boolean']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  text_unset?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_unset?: InputMaybe<Scalars['Boolean']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  url_unset?: InputMaybe<Scalars['Boolean']['input']>;
  user?: InputMaybe<SubmissionUserRelationInput>;
  user_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SubmissionUserRelationInput = {
  create?: InputMaybe<UserInsertInput>;
  link?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  entityId?: Maybe<Entity>;
  incident_id?: Maybe<Incident>;
  type: Scalars['String']['output'];
  userId: User;
};

export type SubscriptionEntityIdRelationInput = {
  create?: InputMaybe<EntityInsertInput>;
  link?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionIncident_IdRelationInput = {
  create?: InputMaybe<IncidentInsertInput>;
  link?: InputMaybe<Scalars['Int']['input']>;
};

export type SubscriptionInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  entityId?: InputMaybe<SubscriptionEntityIdRelationInput>;
  incident_id?: InputMaybe<SubscriptionIncident_IdRelationInput>;
  type: Scalars['String']['input'];
  userId: SubscriptionUserIdRelationInput;
};

export type SubscriptionQueryInput = {
  AND?: InputMaybe<Array<SubscriptionQueryInput>>;
  OR?: InputMaybe<Array<SubscriptionQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  entityId?: InputMaybe<EntityQueryInput>;
  entityId_exists?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id?: InputMaybe<IncidentQueryInput>;
  incident_id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_exists?: InputMaybe<Scalars['Boolean']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_ne?: InputMaybe<Scalars['String']['input']>;
  type_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId?: InputMaybe<UserQueryInput>;
  userId_exists?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum SubscriptionSortByInput {
  EntityidAsc = 'ENTITYID_ASC',
  EntityidDesc = 'ENTITYID_DESC',
  IncidentIdAsc = 'INCIDENT_ID_ASC',
  IncidentIdDesc = 'INCIDENT_ID_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  UseridAsc = 'USERID_ASC',
  UseridDesc = 'USERID_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type SubscriptionUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  entityId?: InputMaybe<SubscriptionEntityIdRelationInput>;
  entityId_unset?: InputMaybe<Scalars['Boolean']['input']>;
  incident_id?: InputMaybe<SubscriptionIncident_IdRelationInput>;
  incident_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_unset?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<SubscriptionUserIdRelationInput>;
  userId_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SubscriptionUserIdRelationInput = {
  create?: InputMaybe<UserInsertInput>;
  link?: InputMaybe<Scalars['String']['input']>;
};

export type Taxa = {
  __typename?: 'Taxa';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  complete_entities?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dummy_fields?: Maybe<Array<Maybe<TaxaDummy_Field>>>;
  field_list?: Maybe<Array<Maybe<TaxaField_List>>>;
  namespace?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Int']['output']>;
};

export type TaxaDummy_Field = {
  __typename?: 'TaxaDummy_field';
  field_number?: Maybe<Scalars['String']['output']>;
  short_name?: Maybe<Scalars['String']['output']>;
};

export type TaxaDummy_FieldInsertInput = {
  field_number?: InputMaybe<Scalars['String']['input']>;
  short_name?: InputMaybe<Scalars['String']['input']>;
};

export type TaxaDummy_FieldQueryInput = {
  AND?: InputMaybe<Array<TaxaDummy_FieldQueryInput>>;
  OR?: InputMaybe<Array<TaxaDummy_FieldQueryInput>>;
  field_number?: InputMaybe<Scalars['String']['input']>;
  field_number_exists?: InputMaybe<Scalars['Boolean']['input']>;
  field_number_gt?: InputMaybe<Scalars['String']['input']>;
  field_number_gte?: InputMaybe<Scalars['String']['input']>;
  field_number_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  field_number_lt?: InputMaybe<Scalars['String']['input']>;
  field_number_lte?: InputMaybe<Scalars['String']['input']>;
  field_number_ne?: InputMaybe<Scalars['String']['input']>;
  field_number_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  short_name?: InputMaybe<Scalars['String']['input']>;
  short_name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  short_name_gt?: InputMaybe<Scalars['String']['input']>;
  short_name_gte?: InputMaybe<Scalars['String']['input']>;
  short_name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  short_name_lt?: InputMaybe<Scalars['String']['input']>;
  short_name_lte?: InputMaybe<Scalars['String']['input']>;
  short_name_ne?: InputMaybe<Scalars['String']['input']>;
  short_name_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TaxaDummy_FieldUpdateInput = {
  field_number?: InputMaybe<Scalars['String']['input']>;
  field_number_unset?: InputMaybe<Scalars['Boolean']['input']>;
  short_name?: InputMaybe<Scalars['String']['input']>;
  short_name_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TaxaField_List = {
  __typename?: 'TaxaField_list';
  complete_from?: Maybe<TaxaField_ListComplete_From>;
  default?: Maybe<Scalars['String']['output']>;
  display_type?: Maybe<Scalars['String']['output']>;
  field_number?: Maybe<Scalars['String']['output']>;
  hide_search?: Maybe<Scalars['Boolean']['output']>;
  instant_facet?: Maybe<Scalars['Boolean']['output']>;
  item_fields?: Maybe<TaxaField_ListItem_Field>;
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

export type TaxaField_ListComplete_From = {
  __typename?: 'TaxaField_listComplete_from';
  all?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  current?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type TaxaField_ListComplete_FromInsertInput = {
  all?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  current?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TaxaField_ListComplete_FromQueryInput = {
  AND?: InputMaybe<Array<TaxaField_ListComplete_FromQueryInput>>;
  OR?: InputMaybe<Array<TaxaField_ListComplete_FromQueryInput>>;
  all?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  all_exists?: InputMaybe<Scalars['Boolean']['input']>;
  all_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  all_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  current?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  current_exists?: InputMaybe<Scalars['Boolean']['input']>;
  current_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  current_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TaxaField_ListComplete_FromUpdateInput = {
  all?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  all_unset?: InputMaybe<Scalars['Boolean']['input']>;
  current?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  current_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TaxaField_ListInsertInput = {
  complete_from?: InputMaybe<TaxaField_ListComplete_FromInsertInput>;
  default?: InputMaybe<Scalars['String']['input']>;
  display_type?: InputMaybe<Scalars['String']['input']>;
  field_number?: InputMaybe<Scalars['String']['input']>;
  hide_search?: InputMaybe<Scalars['Boolean']['input']>;
  instant_facet?: InputMaybe<Scalars['Boolean']['input']>;
  item_fields?: InputMaybe<TaxaField_ListItem_FieldInsertInput>;
  long_description?: InputMaybe<Scalars['String']['input']>;
  long_name?: InputMaybe<Scalars['String']['input']>;
  mongo_type?: InputMaybe<Scalars['String']['input']>;
  permitted_values?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  public?: InputMaybe<Scalars['Boolean']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  short_description?: InputMaybe<Scalars['String']['input']>;
  short_name?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
};

export type TaxaField_ListItem_Field = {
  __typename?: 'TaxaField_listItem_field';
  complete_from?: Maybe<TaxaField_ListItem_FieldComplete_From>;
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

export type TaxaField_ListItem_FieldComplete_From = {
  __typename?: 'TaxaField_listItem_fieldComplete_from';
  all?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  current?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  entities?: Maybe<Scalars['Boolean']['output']>;
};

export type TaxaField_ListItem_FieldComplete_FromInsertInput = {
  all?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  current?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  entities?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TaxaField_ListItem_FieldComplete_FromQueryInput = {
  AND?: InputMaybe<Array<TaxaField_ListItem_FieldComplete_FromQueryInput>>;
  OR?: InputMaybe<Array<TaxaField_ListItem_FieldComplete_FromQueryInput>>;
  all?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  all_exists?: InputMaybe<Scalars['Boolean']['input']>;
  all_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  all_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  current?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  current_exists?: InputMaybe<Scalars['Boolean']['input']>;
  current_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  current_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  entities?: InputMaybe<Scalars['Boolean']['input']>;
  entities_exists?: InputMaybe<Scalars['Boolean']['input']>;
  entities_ne?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TaxaField_ListItem_FieldComplete_FromUpdateInput = {
  all?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  all_unset?: InputMaybe<Scalars['Boolean']['input']>;
  current?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  current_unset?: InputMaybe<Scalars['Boolean']['input']>;
  entities?: InputMaybe<Scalars['Boolean']['input']>;
  entities_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TaxaField_ListItem_FieldInsertInput = {
  complete_from?: InputMaybe<TaxaField_ListItem_FieldComplete_FromInsertInput>;
  default?: InputMaybe<Scalars['String']['input']>;
  display_type?: InputMaybe<Scalars['String']['input']>;
  field_number?: InputMaybe<Scalars['String']['input']>;
  instant_facet?: InputMaybe<Scalars['Boolean']['input']>;
  long_description?: InputMaybe<Scalars['String']['input']>;
  long_name?: InputMaybe<Scalars['String']['input']>;
  mongo_type?: InputMaybe<Scalars['String']['input']>;
  permitted_values?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  public?: InputMaybe<Scalars['Boolean']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  short_description?: InputMaybe<Scalars['String']['input']>;
  short_name?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
};

export type TaxaField_ListItem_FieldQueryInput = {
  AND?: InputMaybe<Array<TaxaField_ListItem_FieldQueryInput>>;
  OR?: InputMaybe<Array<TaxaField_ListItem_FieldQueryInput>>;
  complete_from?: InputMaybe<TaxaField_ListItem_FieldComplete_FromQueryInput>;
  complete_from_exists?: InputMaybe<Scalars['Boolean']['input']>;
  default?: InputMaybe<Scalars['String']['input']>;
  default_exists?: InputMaybe<Scalars['Boolean']['input']>;
  default_gt?: InputMaybe<Scalars['String']['input']>;
  default_gte?: InputMaybe<Scalars['String']['input']>;
  default_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  default_lt?: InputMaybe<Scalars['String']['input']>;
  default_lte?: InputMaybe<Scalars['String']['input']>;
  default_ne?: InputMaybe<Scalars['String']['input']>;
  default_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  display_type?: InputMaybe<Scalars['String']['input']>;
  display_type_exists?: InputMaybe<Scalars['Boolean']['input']>;
  display_type_gt?: InputMaybe<Scalars['String']['input']>;
  display_type_gte?: InputMaybe<Scalars['String']['input']>;
  display_type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  display_type_lt?: InputMaybe<Scalars['String']['input']>;
  display_type_lte?: InputMaybe<Scalars['String']['input']>;
  display_type_ne?: InputMaybe<Scalars['String']['input']>;
  display_type_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  field_number?: InputMaybe<Scalars['String']['input']>;
  field_number_exists?: InputMaybe<Scalars['Boolean']['input']>;
  field_number_gt?: InputMaybe<Scalars['String']['input']>;
  field_number_gte?: InputMaybe<Scalars['String']['input']>;
  field_number_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  field_number_lt?: InputMaybe<Scalars['String']['input']>;
  field_number_lte?: InputMaybe<Scalars['String']['input']>;
  field_number_ne?: InputMaybe<Scalars['String']['input']>;
  field_number_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  instant_facet?: InputMaybe<Scalars['Boolean']['input']>;
  instant_facet_exists?: InputMaybe<Scalars['Boolean']['input']>;
  instant_facet_ne?: InputMaybe<Scalars['Boolean']['input']>;
  long_description?: InputMaybe<Scalars['String']['input']>;
  long_description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  long_description_gt?: InputMaybe<Scalars['String']['input']>;
  long_description_gte?: InputMaybe<Scalars['String']['input']>;
  long_description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  long_description_lt?: InputMaybe<Scalars['String']['input']>;
  long_description_lte?: InputMaybe<Scalars['String']['input']>;
  long_description_ne?: InputMaybe<Scalars['String']['input']>;
  long_description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  long_name?: InputMaybe<Scalars['String']['input']>;
  long_name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  long_name_gt?: InputMaybe<Scalars['String']['input']>;
  long_name_gte?: InputMaybe<Scalars['String']['input']>;
  long_name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  long_name_lt?: InputMaybe<Scalars['String']['input']>;
  long_name_lte?: InputMaybe<Scalars['String']['input']>;
  long_name_ne?: InputMaybe<Scalars['String']['input']>;
  long_name_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  mongo_type?: InputMaybe<Scalars['String']['input']>;
  mongo_type_exists?: InputMaybe<Scalars['Boolean']['input']>;
  mongo_type_gt?: InputMaybe<Scalars['String']['input']>;
  mongo_type_gte?: InputMaybe<Scalars['String']['input']>;
  mongo_type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  mongo_type_lt?: InputMaybe<Scalars['String']['input']>;
  mongo_type_lte?: InputMaybe<Scalars['String']['input']>;
  mongo_type_ne?: InputMaybe<Scalars['String']['input']>;
  mongo_type_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  permitted_values?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  permitted_values_exists?: InputMaybe<Scalars['Boolean']['input']>;
  permitted_values_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  permitted_values_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  placeholder_exists?: InputMaybe<Scalars['Boolean']['input']>;
  placeholder_gt?: InputMaybe<Scalars['String']['input']>;
  placeholder_gte?: InputMaybe<Scalars['String']['input']>;
  placeholder_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  placeholder_lt?: InputMaybe<Scalars['String']['input']>;
  placeholder_lte?: InputMaybe<Scalars['String']['input']>;
  placeholder_ne?: InputMaybe<Scalars['String']['input']>;
  placeholder_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  public?: InputMaybe<Scalars['Boolean']['input']>;
  public_exists?: InputMaybe<Scalars['Boolean']['input']>;
  public_ne?: InputMaybe<Scalars['Boolean']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  required_exists?: InputMaybe<Scalars['Boolean']['input']>;
  required_ne?: InputMaybe<Scalars['Boolean']['input']>;
  short_description?: InputMaybe<Scalars['String']['input']>;
  short_description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  short_description_gt?: InputMaybe<Scalars['String']['input']>;
  short_description_gte?: InputMaybe<Scalars['String']['input']>;
  short_description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  short_description_lt?: InputMaybe<Scalars['String']['input']>;
  short_description_lte?: InputMaybe<Scalars['String']['input']>;
  short_description_ne?: InputMaybe<Scalars['String']['input']>;
  short_description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  short_name?: InputMaybe<Scalars['String']['input']>;
  short_name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  short_name_gt?: InputMaybe<Scalars['String']['input']>;
  short_name_gte?: InputMaybe<Scalars['String']['input']>;
  short_name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  short_name_lt?: InputMaybe<Scalars['String']['input']>;
  short_name_lte?: InputMaybe<Scalars['String']['input']>;
  short_name_ne?: InputMaybe<Scalars['String']['input']>;
  short_name_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  weight?: InputMaybe<Scalars['Int']['input']>;
  weight_exists?: InputMaybe<Scalars['Boolean']['input']>;
  weight_gt?: InputMaybe<Scalars['Int']['input']>;
  weight_gte?: InputMaybe<Scalars['Int']['input']>;
  weight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  weight_lt?: InputMaybe<Scalars['Int']['input']>;
  weight_lte?: InputMaybe<Scalars['Int']['input']>;
  weight_ne?: InputMaybe<Scalars['Int']['input']>;
  weight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type TaxaField_ListItem_FieldUpdateInput = {
  complete_from?: InputMaybe<TaxaField_ListItem_FieldComplete_FromUpdateInput>;
  complete_from_unset?: InputMaybe<Scalars['Boolean']['input']>;
  default?: InputMaybe<Scalars['String']['input']>;
  default_unset?: InputMaybe<Scalars['Boolean']['input']>;
  display_type?: InputMaybe<Scalars['String']['input']>;
  display_type_unset?: InputMaybe<Scalars['Boolean']['input']>;
  field_number?: InputMaybe<Scalars['String']['input']>;
  field_number_unset?: InputMaybe<Scalars['Boolean']['input']>;
  instant_facet?: InputMaybe<Scalars['Boolean']['input']>;
  instant_facet_unset?: InputMaybe<Scalars['Boolean']['input']>;
  long_description?: InputMaybe<Scalars['String']['input']>;
  long_description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  long_name?: InputMaybe<Scalars['String']['input']>;
  long_name_unset?: InputMaybe<Scalars['Boolean']['input']>;
  mongo_type?: InputMaybe<Scalars['String']['input']>;
  mongo_type_unset?: InputMaybe<Scalars['Boolean']['input']>;
  permitted_values?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  permitted_values_unset?: InputMaybe<Scalars['Boolean']['input']>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  placeholder_unset?: InputMaybe<Scalars['Boolean']['input']>;
  public?: InputMaybe<Scalars['Boolean']['input']>;
  public_unset?: InputMaybe<Scalars['Boolean']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  required_unset?: InputMaybe<Scalars['Boolean']['input']>;
  short_description?: InputMaybe<Scalars['String']['input']>;
  short_description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  short_name?: InputMaybe<Scalars['String']['input']>;
  short_name_unset?: InputMaybe<Scalars['Boolean']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
  weight_inc?: InputMaybe<Scalars['Int']['input']>;
  weight_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TaxaField_ListQueryInput = {
  AND?: InputMaybe<Array<TaxaField_ListQueryInput>>;
  OR?: InputMaybe<Array<TaxaField_ListQueryInput>>;
  complete_from?: InputMaybe<TaxaField_ListComplete_FromQueryInput>;
  complete_from_exists?: InputMaybe<Scalars['Boolean']['input']>;
  default?: InputMaybe<Scalars['String']['input']>;
  default_exists?: InputMaybe<Scalars['Boolean']['input']>;
  default_gt?: InputMaybe<Scalars['String']['input']>;
  default_gte?: InputMaybe<Scalars['String']['input']>;
  default_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  default_lt?: InputMaybe<Scalars['String']['input']>;
  default_lte?: InputMaybe<Scalars['String']['input']>;
  default_ne?: InputMaybe<Scalars['String']['input']>;
  default_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  display_type?: InputMaybe<Scalars['String']['input']>;
  display_type_exists?: InputMaybe<Scalars['Boolean']['input']>;
  display_type_gt?: InputMaybe<Scalars['String']['input']>;
  display_type_gte?: InputMaybe<Scalars['String']['input']>;
  display_type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  display_type_lt?: InputMaybe<Scalars['String']['input']>;
  display_type_lte?: InputMaybe<Scalars['String']['input']>;
  display_type_ne?: InputMaybe<Scalars['String']['input']>;
  display_type_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  field_number?: InputMaybe<Scalars['String']['input']>;
  field_number_exists?: InputMaybe<Scalars['Boolean']['input']>;
  field_number_gt?: InputMaybe<Scalars['String']['input']>;
  field_number_gte?: InputMaybe<Scalars['String']['input']>;
  field_number_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  field_number_lt?: InputMaybe<Scalars['String']['input']>;
  field_number_lte?: InputMaybe<Scalars['String']['input']>;
  field_number_ne?: InputMaybe<Scalars['String']['input']>;
  field_number_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hide_search?: InputMaybe<Scalars['Boolean']['input']>;
  hide_search_exists?: InputMaybe<Scalars['Boolean']['input']>;
  hide_search_ne?: InputMaybe<Scalars['Boolean']['input']>;
  instant_facet?: InputMaybe<Scalars['Boolean']['input']>;
  instant_facet_exists?: InputMaybe<Scalars['Boolean']['input']>;
  instant_facet_ne?: InputMaybe<Scalars['Boolean']['input']>;
  item_fields?: InputMaybe<TaxaField_ListItem_FieldQueryInput>;
  item_fields_exists?: InputMaybe<Scalars['Boolean']['input']>;
  long_description?: InputMaybe<Scalars['String']['input']>;
  long_description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  long_description_gt?: InputMaybe<Scalars['String']['input']>;
  long_description_gte?: InputMaybe<Scalars['String']['input']>;
  long_description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  long_description_lt?: InputMaybe<Scalars['String']['input']>;
  long_description_lte?: InputMaybe<Scalars['String']['input']>;
  long_description_ne?: InputMaybe<Scalars['String']['input']>;
  long_description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  long_name?: InputMaybe<Scalars['String']['input']>;
  long_name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  long_name_gt?: InputMaybe<Scalars['String']['input']>;
  long_name_gte?: InputMaybe<Scalars['String']['input']>;
  long_name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  long_name_lt?: InputMaybe<Scalars['String']['input']>;
  long_name_lte?: InputMaybe<Scalars['String']['input']>;
  long_name_ne?: InputMaybe<Scalars['String']['input']>;
  long_name_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  mongo_type?: InputMaybe<Scalars['String']['input']>;
  mongo_type_exists?: InputMaybe<Scalars['Boolean']['input']>;
  mongo_type_gt?: InputMaybe<Scalars['String']['input']>;
  mongo_type_gte?: InputMaybe<Scalars['String']['input']>;
  mongo_type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  mongo_type_lt?: InputMaybe<Scalars['String']['input']>;
  mongo_type_lte?: InputMaybe<Scalars['String']['input']>;
  mongo_type_ne?: InputMaybe<Scalars['String']['input']>;
  mongo_type_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  permitted_values?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  permitted_values_exists?: InputMaybe<Scalars['Boolean']['input']>;
  permitted_values_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  permitted_values_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  placeholder_exists?: InputMaybe<Scalars['Boolean']['input']>;
  placeholder_gt?: InputMaybe<Scalars['String']['input']>;
  placeholder_gte?: InputMaybe<Scalars['String']['input']>;
  placeholder_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  placeholder_lt?: InputMaybe<Scalars['String']['input']>;
  placeholder_lte?: InputMaybe<Scalars['String']['input']>;
  placeholder_ne?: InputMaybe<Scalars['String']['input']>;
  placeholder_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  public?: InputMaybe<Scalars['Boolean']['input']>;
  public_exists?: InputMaybe<Scalars['Boolean']['input']>;
  public_ne?: InputMaybe<Scalars['Boolean']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  required_exists?: InputMaybe<Scalars['Boolean']['input']>;
  required_ne?: InputMaybe<Scalars['Boolean']['input']>;
  short_description?: InputMaybe<Scalars['String']['input']>;
  short_description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  short_description_gt?: InputMaybe<Scalars['String']['input']>;
  short_description_gte?: InputMaybe<Scalars['String']['input']>;
  short_description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  short_description_lt?: InputMaybe<Scalars['String']['input']>;
  short_description_lte?: InputMaybe<Scalars['String']['input']>;
  short_description_ne?: InputMaybe<Scalars['String']['input']>;
  short_description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  short_name?: InputMaybe<Scalars['String']['input']>;
  short_name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  short_name_gt?: InputMaybe<Scalars['String']['input']>;
  short_name_gte?: InputMaybe<Scalars['String']['input']>;
  short_name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  short_name_lt?: InputMaybe<Scalars['String']['input']>;
  short_name_lte?: InputMaybe<Scalars['String']['input']>;
  short_name_ne?: InputMaybe<Scalars['String']['input']>;
  short_name_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  weight?: InputMaybe<Scalars['Int']['input']>;
  weight_exists?: InputMaybe<Scalars['Boolean']['input']>;
  weight_gt?: InputMaybe<Scalars['Int']['input']>;
  weight_gte?: InputMaybe<Scalars['Int']['input']>;
  weight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  weight_lt?: InputMaybe<Scalars['Int']['input']>;
  weight_lte?: InputMaybe<Scalars['Int']['input']>;
  weight_ne?: InputMaybe<Scalars['Int']['input']>;
  weight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type TaxaField_ListUpdateInput = {
  complete_from?: InputMaybe<TaxaField_ListComplete_FromUpdateInput>;
  complete_from_unset?: InputMaybe<Scalars['Boolean']['input']>;
  default?: InputMaybe<Scalars['String']['input']>;
  default_unset?: InputMaybe<Scalars['Boolean']['input']>;
  display_type?: InputMaybe<Scalars['String']['input']>;
  display_type_unset?: InputMaybe<Scalars['Boolean']['input']>;
  field_number?: InputMaybe<Scalars['String']['input']>;
  field_number_unset?: InputMaybe<Scalars['Boolean']['input']>;
  hide_search?: InputMaybe<Scalars['Boolean']['input']>;
  hide_search_unset?: InputMaybe<Scalars['Boolean']['input']>;
  instant_facet?: InputMaybe<Scalars['Boolean']['input']>;
  instant_facet_unset?: InputMaybe<Scalars['Boolean']['input']>;
  item_fields?: InputMaybe<TaxaField_ListItem_FieldUpdateInput>;
  item_fields_unset?: InputMaybe<Scalars['Boolean']['input']>;
  long_description?: InputMaybe<Scalars['String']['input']>;
  long_description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  long_name?: InputMaybe<Scalars['String']['input']>;
  long_name_unset?: InputMaybe<Scalars['Boolean']['input']>;
  mongo_type?: InputMaybe<Scalars['String']['input']>;
  mongo_type_unset?: InputMaybe<Scalars['Boolean']['input']>;
  permitted_values?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  permitted_values_unset?: InputMaybe<Scalars['Boolean']['input']>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  placeholder_unset?: InputMaybe<Scalars['Boolean']['input']>;
  public?: InputMaybe<Scalars['Boolean']['input']>;
  public_unset?: InputMaybe<Scalars['Boolean']['input']>;
  required?: InputMaybe<Scalars['Boolean']['input']>;
  required_unset?: InputMaybe<Scalars['Boolean']['input']>;
  short_description?: InputMaybe<Scalars['String']['input']>;
  short_description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  short_name?: InputMaybe<Scalars['String']['input']>;
  short_name_unset?: InputMaybe<Scalars['Boolean']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
  weight_inc?: InputMaybe<Scalars['Int']['input']>;
  weight_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TaxaInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  complete_entities?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dummy_fields?: InputMaybe<Array<InputMaybe<TaxaDummy_FieldInsertInput>>>;
  field_list?: InputMaybe<Array<InputMaybe<TaxaField_ListInsertInput>>>;
  namespace?: InputMaybe<Scalars['String']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
};

export type TaxaQueryInput = {
  AND?: InputMaybe<Array<TaxaQueryInput>>;
  OR?: InputMaybe<Array<TaxaQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  complete_entities?: InputMaybe<Scalars['Boolean']['input']>;
  complete_entities_exists?: InputMaybe<Scalars['Boolean']['input']>;
  complete_entities_ne?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_exists?: InputMaybe<Scalars['Boolean']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_ne?: InputMaybe<Scalars['String']['input']>;
  description_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  dummy_fields?: InputMaybe<Array<InputMaybe<TaxaDummy_FieldQueryInput>>>;
  dummy_fields_exists?: InputMaybe<Scalars['Boolean']['input']>;
  dummy_fields_in?: InputMaybe<Array<InputMaybe<TaxaDummy_FieldQueryInput>>>;
  dummy_fields_nin?: InputMaybe<Array<InputMaybe<TaxaDummy_FieldQueryInput>>>;
  field_list?: InputMaybe<Array<InputMaybe<TaxaField_ListQueryInput>>>;
  field_list_exists?: InputMaybe<Scalars['Boolean']['input']>;
  field_list_in?: InputMaybe<Array<InputMaybe<TaxaField_ListQueryInput>>>;
  field_list_nin?: InputMaybe<Array<InputMaybe<TaxaField_ListQueryInput>>>;
  namespace?: InputMaybe<Scalars['String']['input']>;
  namespace_exists?: InputMaybe<Scalars['Boolean']['input']>;
  namespace_gt?: InputMaybe<Scalars['String']['input']>;
  namespace_gte?: InputMaybe<Scalars['String']['input']>;
  namespace_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  namespace_lt?: InputMaybe<Scalars['String']['input']>;
  namespace_lte?: InputMaybe<Scalars['String']['input']>;
  namespace_ne?: InputMaybe<Scalars['String']['input']>;
  namespace_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  weight?: InputMaybe<Scalars['Int']['input']>;
  weight_exists?: InputMaybe<Scalars['Boolean']['input']>;
  weight_gt?: InputMaybe<Scalars['Int']['input']>;
  weight_gte?: InputMaybe<Scalars['Int']['input']>;
  weight_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  weight_lt?: InputMaybe<Scalars['Int']['input']>;
  weight_lte?: InputMaybe<Scalars['Int']['input']>;
  weight_ne?: InputMaybe<Scalars['Int']['input']>;
  weight_nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export enum TaxaSortByInput {
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  NamespaceAsc = 'NAMESPACE_ASC',
  NamespaceDesc = 'NAMESPACE_DESC',
  WeightAsc = 'WEIGHT_ASC',
  WeightDesc = 'WEIGHT_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type TaxaUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  complete_entities?: InputMaybe<Scalars['Boolean']['input']>;
  complete_entities_unset?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_unset?: InputMaybe<Scalars['Boolean']['input']>;
  dummy_fields?: InputMaybe<Array<InputMaybe<TaxaDummy_FieldUpdateInput>>>;
  dummy_fields_unset?: InputMaybe<Scalars['Boolean']['input']>;
  field_list?: InputMaybe<Array<InputMaybe<TaxaField_ListUpdateInput>>>;
  field_list_unset?: InputMaybe<Scalars['Boolean']['input']>;
  namespace?: InputMaybe<Scalars['String']['input']>;
  namespace_unset?: InputMaybe<Scalars['Boolean']['input']>;
  weight?: InputMaybe<Scalars['Int']['input']>;
  weight_inc?: InputMaybe<Scalars['Int']['input']>;
  weight_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateManyPayload = {
  __typename?: 'UpdateManyPayload';
  matchedCount: Scalars['Int']['output'];
  modifiedCount: Scalars['Int']['output'];
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
  creationDate?: Maybe<Scalars['DateTime']['output']>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  lastAuthenticationDate?: Maybe<Scalars['DateTime']['output']>;
};

export type UserInsertInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  roles: Array<InputMaybe<Scalars['String']['input']>>;
  userId: Scalars['String']['input'];
};

export type UserQueryInput = {
  AND?: InputMaybe<Array<UserQueryInput>>;
  OR?: InputMaybe<Array<UserQueryInput>>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_exists?: InputMaybe<Scalars['Boolean']['input']>;
  _id_gt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_gte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_in?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  _id_lt?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_lte?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_ne?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_nin?: InputMaybe<Array<InputMaybe<Scalars['ObjectId']['input']>>>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  first_name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  first_name_gt?: InputMaybe<Scalars['String']['input']>;
  first_name_gte?: InputMaybe<Scalars['String']['input']>;
  first_name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  first_name_lt?: InputMaybe<Scalars['String']['input']>;
  first_name_lte?: InputMaybe<Scalars['String']['input']>;
  first_name_ne?: InputMaybe<Scalars['String']['input']>;
  first_name_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  last_name_exists?: InputMaybe<Scalars['Boolean']['input']>;
  last_name_gt?: InputMaybe<Scalars['String']['input']>;
  last_name_gte?: InputMaybe<Scalars['String']['input']>;
  last_name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last_name_lt?: InputMaybe<Scalars['String']['input']>;
  last_name_lte?: InputMaybe<Scalars['String']['input']>;
  last_name_ne?: InputMaybe<Scalars['String']['input']>;
  last_name_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  roles_exists?: InputMaybe<Scalars['Boolean']['input']>;
  roles_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  roles_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_exists?: InputMaybe<Scalars['Boolean']['input']>;
  userId_gt?: InputMaybe<Scalars['String']['input']>;
  userId_gte?: InputMaybe<Scalars['String']['input']>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  userId_lt?: InputMaybe<Scalars['String']['input']>;
  userId_lte?: InputMaybe<Scalars['String']['input']>;
  userId_ne?: InputMaybe<Scalars['String']['input']>;
  userId_nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export enum UserSortByInput {
  FirstNameAsc = 'FIRST_NAME_ASC',
  FirstNameDesc = 'FIRST_NAME_DESC',
  LastNameAsc = 'LAST_NAME_ASC',
  LastNameDesc = 'LAST_NAME_DESC',
  UseridAsc = 'USERID_ASC',
  UseridDesc = 'USERID_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

export type UserUpdateInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  _id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  first_name_unset?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  last_name_unset?: InputMaybe<Scalars['Boolean']['input']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  roles_unset?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userId_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AppUser: ResolverTypeWrapper<AppUser>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Candidate: ResolverTypeWrapper<Candidate>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  CandidateClassification_similarity: ResolverTypeWrapper<CandidateClassification_Similarity>;
  CandidateClassification_similarityInsertInput: CandidateClassification_SimilarityInsertInput;
  CandidateClassification_similarityQueryInput: CandidateClassification_SimilarityQueryInput;
  CandidateClassification_similarityUpdateInput: CandidateClassification_SimilarityUpdateInput;
  CandidateEmbedding: ResolverTypeWrapper<CandidateEmbedding>;
  CandidateEmbeddingInsertInput: CandidateEmbeddingInsertInput;
  CandidateEmbeddingQueryInput: CandidateEmbeddingQueryInput;
  CandidateEmbeddingUpdateInput: CandidateEmbeddingUpdateInput;
  CandidateInsertInput: CandidateInsertInput;
  CandidateQueryInput: CandidateQueryInput;
  CandidateSortByInput: CandidateSortByInput;
  CandidateUpdateInput: CandidateUpdateInput;
  Checklist: ResolverTypeWrapper<Checklist>;
  ChecklistInsertInput: ChecklistInsertInput;
  ChecklistQueryInput: ChecklistQueryInput;
  ChecklistRisk: ResolverTypeWrapper<ChecklistRisk>;
  ChecklistRiskInsertInput: ChecklistRiskInsertInput;
  ChecklistRiskPrecedent: ResolverTypeWrapper<ChecklistRiskPrecedent>;
  ChecklistRiskPrecedentInsertInput: ChecklistRiskPrecedentInsertInput;
  ChecklistRiskPrecedentQueryInput: ChecklistRiskPrecedentQueryInput;
  ChecklistRiskPrecedentUpdateInput: ChecklistRiskPrecedentUpdateInput;
  ChecklistRiskQueryInput: ChecklistRiskQueryInput;
  ChecklistRiskUpdateInput: ChecklistRiskUpdateInput;
  ChecklistSortByInput: ChecklistSortByInput;
  ChecklistUpdateInput: ChecklistUpdateInput;
  Classification: ResolverTypeWrapper<Classification>;
  ClassificationAttribute: ResolverTypeWrapper<ClassificationAttribute>;
  ClassificationAttributeInsertInput: ClassificationAttributeInsertInput;
  ClassificationAttributeQueryInput: ClassificationAttributeQueryInput;
  ClassificationAttributeUpdateInput: ClassificationAttributeUpdateInput;
  ClassificationIncidentsRelationInput: ClassificationIncidentsRelationInput;
  ClassificationInsertInput: ClassificationInsertInput;
  ClassificationQueryInput: ClassificationQueryInput;
  ClassificationReportsRelationInput: ClassificationReportsRelationInput;
  ClassificationSortByInput: ClassificationSortByInput;
  ClassificationUpdateInput: ClassificationUpdateInput;
  CreateDefaultAdminUserInput: CreateDefaultAdminUserInput;
  CreateVariantInput: CreateVariantInput;
  CreateVariantInputVariant: CreateVariantInputVariant;
  CreateVariantPayload: ResolverTypeWrapper<CreateVariantPayload>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DefaultAdminUser: ResolverTypeWrapper<DefaultAdminUser>;
  DeleteManyPayload: ResolverTypeWrapper<DeleteManyPayload>;
  Duplicate: ResolverTypeWrapper<Duplicate>;
  DuplicateInsertInput: DuplicateInsertInput;
  DuplicateQueryInput: DuplicateQueryInput;
  DuplicateSortByInput: DuplicateSortByInput;
  DuplicateUpdateInput: DuplicateUpdateInput;
  Entity: ResolverTypeWrapper<Entity>;
  EntityInsertInput: EntityInsertInput;
  EntityQueryInput: EntityQueryInput;
  EntitySortByInput: EntitySortByInput;
  EntityUpdateInput: EntityUpdateInput;
  GetUserInput: GetUserInput;
  History_incident: ResolverTypeWrapper<History_Incident>;
  History_incidentEmbedding: ResolverTypeWrapper<History_IncidentEmbedding>;
  History_incidentEmbeddingInsertInput: History_IncidentEmbeddingInsertInput;
  History_incidentEmbeddingQueryInput: History_IncidentEmbeddingQueryInput;
  History_incidentEmbeddingUpdateInput: History_IncidentEmbeddingUpdateInput;
  History_incidentInsertInput: History_IncidentInsertInput;
  History_incidentNlp_similar_incident: ResolverTypeWrapper<History_IncidentNlp_Similar_Incident>;
  History_incidentNlp_similar_incidentInsertInput: History_IncidentNlp_Similar_IncidentInsertInput;
  History_incidentNlp_similar_incidentQueryInput: History_IncidentNlp_Similar_IncidentQueryInput;
  History_incidentNlp_similar_incidentUpdateInput: History_IncidentNlp_Similar_IncidentUpdateInput;
  History_incidentQueryInput: History_IncidentQueryInput;
  History_incidentSortByInput: History_IncidentSortByInput;
  History_incidentTsne: ResolverTypeWrapper<History_IncidentTsne>;
  History_incidentTsneInsertInput: History_IncidentTsneInsertInput;
  History_incidentTsneQueryInput: History_IncidentTsneQueryInput;
  History_incidentTsneUpdateInput: History_IncidentTsneUpdateInput;
  History_incidentUpdateInput: History_IncidentUpdateInput;
  History_report: ResolverTypeWrapper<History_Report>;
  History_reportEmbedding: ResolverTypeWrapper<History_ReportEmbedding>;
  History_reportEmbeddingInsertInput: History_ReportEmbeddingInsertInput;
  History_reportEmbeddingQueryInput: History_ReportEmbeddingQueryInput;
  History_reportEmbeddingUpdateInput: History_ReportEmbeddingUpdateInput;
  History_reportInsertInput: History_ReportInsertInput;
  History_reportQueryInput: History_ReportQueryInput;
  History_reportSortByInput: History_ReportSortByInput;
  History_reportUpdateInput: History_ReportUpdateInput;
  Incident: ResolverTypeWrapper<Incident>;
  IncidentAllegedDeployerOfAISystemRelationInput: IncidentAllegedDeployerOfAiSystemRelationInput;
  IncidentAllegedDeveloperOfAISystemRelationInput: IncidentAllegedDeveloperOfAiSystemRelationInput;
  IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput;
  IncidentEditorsRelationInput: IncidentEditorsRelationInput;
  IncidentEmbedding: ResolverTypeWrapper<IncidentEmbedding>;
  IncidentEmbeddingInsertInput: IncidentEmbeddingInsertInput;
  IncidentEmbeddingQueryInput: IncidentEmbeddingQueryInput;
  IncidentEmbeddingUpdateInput: IncidentEmbeddingUpdateInput;
  IncidentInsertInput: IncidentInsertInput;
  IncidentNlp_similar_incident: ResolverTypeWrapper<IncidentNlp_Similar_Incident>;
  IncidentNlp_similar_incidentInsertInput: IncidentNlp_Similar_IncidentInsertInput;
  IncidentNlp_similar_incidentQueryInput: IncidentNlp_Similar_IncidentQueryInput;
  IncidentNlp_similar_incidentUpdateInput: IncidentNlp_Similar_IncidentUpdateInput;
  IncidentQueryInput: IncidentQueryInput;
  IncidentReportsRelationInput: IncidentReportsRelationInput;
  IncidentSortByInput: IncidentSortByInput;
  IncidentTsne: ResolverTypeWrapper<IncidentTsne>;
  IncidentTsneInsertInput: IncidentTsneInsertInput;
  IncidentTsneQueryInput: IncidentTsneQueryInput;
  IncidentTsneUpdateInput: IncidentTsneUpdateInput;
  IncidentUpdateInput: IncidentUpdateInput;
  InsertManyPayload: ResolverTypeWrapper<InsertManyPayload>;
  LinkReportsToIncidentsInput: LinkReportsToIncidentsInput;
  LogIncidentHistoryPayload: ResolverTypeWrapper<LogIncidentHistoryPayload>;
  LogReportHistoryPayload: ResolverTypeWrapper<LogReportHistoryPayload>;
  Long: ResolverTypeWrapper<Scalars['Long']['output']>;
  LongFilter: LongFilter;
  LongNotFilter: LongNotFilter;
  Mutation: ResolverTypeWrapper<{}>;
  Notification: ResolverTypeWrapper<Notification>;
  NotificationInsertInput: NotificationInsertInput;
  NotificationQueryInput: NotificationQueryInput;
  NotificationSortByInput: NotificationSortByInput;
  NotificationUpdateInput: NotificationUpdateInput;
  NotificationUserIdRelationInput: NotificationUserIdRelationInput;
  ObjectId: ResolverTypeWrapper<Scalars['ObjectId']['output']>;
  ObjectIdFilter: ObjectIdFilter;
  ObjectIdNotFilter: ObjectIdNotFilter;
  Opr: Opr;
  PaginationType: PaginationType;
  PromoteSubmissionToReportInput: PromoteSubmissionToReportInput;
  PromoteSubmissionToReportPayload: ResolverTypeWrapper<PromoteSubmissionToReportPayload>;
  Query: ResolverTypeWrapper<{}>;
  QuickAdd: ResolverTypeWrapper<QuickAdd>;
  QuickAddFilterType: QuickAddFilterType;
  QuickAddInsertType: QuickAddInsertType;
  QuickAddSortType: QuickAddSortType;
  Quickadd: ResolverTypeWrapper<Quickadd>;
  QuickaddInsertInput: QuickaddInsertInput;
  QuickaddSortByInput: QuickaddSortByInput;
  QuickaddUpdateInput: QuickaddUpdateInput;
  Report: ResolverTypeWrapper<Report>;
  ReportEmbedding: ResolverTypeWrapper<ReportEmbedding>;
  ReportEmbeddingInsertInput: ReportEmbeddingInsertInput;
  ReportEmbeddingQueryInput: ReportEmbeddingQueryInput;
  ReportEmbeddingUpdateInput: ReportEmbeddingUpdateInput;
  ReportInsertInput: ReportInsertInput;
  ReportQueryInput: ReportQueryInput;
  ReportSortByInput: ReportSortByInput;
  ReportTranslation: ResolverTypeWrapper<ReportTranslation>;
  ReportUpdateInput: ReportUpdateInput;
  ReportUserRelationInput: ReportUserRelationInput;
  RisksInput: RisksInput;
  RisksPayloadItem: ResolverTypeWrapper<RisksPayloadItem>;
  RisksPayloadPrecedent: ResolverTypeWrapper<RisksPayloadPrecedent>;
  RisksPayloadPrecedentEmbedding: ResolverTypeWrapper<RisksPayloadPrecedentEmbedding>;
  RisksPayloadPrecedentNlp_similar_incident: ResolverTypeWrapper<RisksPayloadPrecedentNlp_Similar_Incident>;
  RisksPayloadPrecedentTsne: ResolverTypeWrapper<RisksPayloadPrecedentTsne>;
  SortType: SortType;
  StringFilter: StringFilter;
  StringNotFilter: StringNotFilter;
  Submission: ResolverTypeWrapper<Submission>;
  SubmissionDeployersRelationInput: SubmissionDeployersRelationInput;
  SubmissionDevelopersRelationInput: SubmissionDevelopersRelationInput;
  SubmissionEmbedding: ResolverTypeWrapper<SubmissionEmbedding>;
  SubmissionEmbeddingInsertInput: SubmissionEmbeddingInsertInput;
  SubmissionEmbeddingQueryInput: SubmissionEmbeddingQueryInput;
  SubmissionEmbeddingUpdateInput: SubmissionEmbeddingUpdateInput;
  SubmissionHarmed_partiesRelationInput: SubmissionHarmed_PartiesRelationInput;
  SubmissionIncident_editorsRelationInput: SubmissionIncident_EditorsRelationInput;
  SubmissionInsertInput: SubmissionInsertInput;
  SubmissionNlp_similar_incident: ResolverTypeWrapper<SubmissionNlp_Similar_Incident>;
  SubmissionNlp_similar_incidentInsertInput: SubmissionNlp_Similar_IncidentInsertInput;
  SubmissionNlp_similar_incidentQueryInput: SubmissionNlp_Similar_IncidentQueryInput;
  SubmissionNlp_similar_incidentUpdateInput: SubmissionNlp_Similar_IncidentUpdateInput;
  SubmissionQueryInput: SubmissionQueryInput;
  SubmissionSortByInput: SubmissionSortByInput;
  SubmissionUpdateInput: SubmissionUpdateInput;
  SubmissionUserRelationInput: SubmissionUserRelationInput;
  Subscription: ResolverTypeWrapper<{}>;
  SubscriptionEntityIdRelationInput: SubscriptionEntityIdRelationInput;
  SubscriptionIncident_idRelationInput: SubscriptionIncident_IdRelationInput;
  SubscriptionInsertInput: SubscriptionInsertInput;
  SubscriptionQueryInput: SubscriptionQueryInput;
  SubscriptionSortByInput: SubscriptionSortByInput;
  SubscriptionUpdateInput: SubscriptionUpdateInput;
  SubscriptionUserIdRelationInput: SubscriptionUserIdRelationInput;
  Taxa: ResolverTypeWrapper<Taxa>;
  TaxaDummy_field: ResolverTypeWrapper<TaxaDummy_Field>;
  TaxaDummy_fieldInsertInput: TaxaDummy_FieldInsertInput;
  TaxaDummy_fieldQueryInput: TaxaDummy_FieldQueryInput;
  TaxaDummy_fieldUpdateInput: TaxaDummy_FieldUpdateInput;
  TaxaField_list: ResolverTypeWrapper<TaxaField_List>;
  TaxaField_listComplete_from: ResolverTypeWrapper<TaxaField_ListComplete_From>;
  TaxaField_listComplete_fromInsertInput: TaxaField_ListComplete_FromInsertInput;
  TaxaField_listComplete_fromQueryInput: TaxaField_ListComplete_FromQueryInput;
  TaxaField_listComplete_fromUpdateInput: TaxaField_ListComplete_FromUpdateInput;
  TaxaField_listInsertInput: TaxaField_ListInsertInput;
  TaxaField_listItem_field: ResolverTypeWrapper<TaxaField_ListItem_Field>;
  TaxaField_listItem_fieldComplete_from: ResolverTypeWrapper<TaxaField_ListItem_FieldComplete_From>;
  TaxaField_listItem_fieldComplete_fromInsertInput: TaxaField_ListItem_FieldComplete_FromInsertInput;
  TaxaField_listItem_fieldComplete_fromQueryInput: TaxaField_ListItem_FieldComplete_FromQueryInput;
  TaxaField_listItem_fieldComplete_fromUpdateInput: TaxaField_ListItem_FieldComplete_FromUpdateInput;
  TaxaField_listItem_fieldInsertInput: TaxaField_ListItem_FieldInsertInput;
  TaxaField_listItem_fieldQueryInput: TaxaField_ListItem_FieldQueryInput;
  TaxaField_listItem_fieldUpdateInput: TaxaField_ListItem_FieldUpdateInput;
  TaxaField_listQueryInput: TaxaField_ListQueryInput;
  TaxaField_listUpdateInput: TaxaField_ListUpdateInput;
  TaxaInsertInput: TaxaInsertInput;
  TaxaQueryInput: TaxaQueryInput;
  TaxaSortByInput: TaxaSortByInput;
  TaxaUpdateInput: TaxaUpdateInput;
  UpdateManyPayload: ResolverTypeWrapper<UpdateManyPayload>;
  UpdateOneReportTranslationInput: UpdateOneReportTranslationInput;
  User: ResolverTypeWrapper<User>;
  UserAdminDatum: ResolverTypeWrapper<UserAdminDatum>;
  UserInsertInput: UserInsertInput;
  UserQueryInput: UserQueryInput;
  UserSortByInput: UserSortByInput;
  UserUpdateInput: UserUpdateInput;
  AdditionalEntityFields: AdditionalEntityFields;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AppUser: AppUser;
  String: Scalars['String']['output'];
  Candidate: Candidate;
  Boolean: Scalars['Boolean']['output'];
  Int: Scalars['Int']['output'];
  Float: Scalars['Float']['output'];
  CandidateClassification_similarity: CandidateClassification_Similarity;
  CandidateClassification_similarityInsertInput: CandidateClassification_SimilarityInsertInput;
  CandidateClassification_similarityQueryInput: CandidateClassification_SimilarityQueryInput;
  CandidateClassification_similarityUpdateInput: CandidateClassification_SimilarityUpdateInput;
  CandidateEmbedding: CandidateEmbedding;
  CandidateEmbeddingInsertInput: CandidateEmbeddingInsertInput;
  CandidateEmbeddingQueryInput: CandidateEmbeddingQueryInput;
  CandidateEmbeddingUpdateInput: CandidateEmbeddingUpdateInput;
  CandidateInsertInput: CandidateInsertInput;
  CandidateQueryInput: CandidateQueryInput;
  CandidateUpdateInput: CandidateUpdateInput;
  Checklist: Checklist;
  ChecklistInsertInput: ChecklistInsertInput;
  ChecklistQueryInput: ChecklistQueryInput;
  ChecklistRisk: ChecklistRisk;
  ChecklistRiskInsertInput: ChecklistRiskInsertInput;
  ChecklistRiskPrecedent: ChecklistRiskPrecedent;
  ChecklistRiskPrecedentInsertInput: ChecklistRiskPrecedentInsertInput;
  ChecklistRiskPrecedentQueryInput: ChecklistRiskPrecedentQueryInput;
  ChecklistRiskPrecedentUpdateInput: ChecklistRiskPrecedentUpdateInput;
  ChecklistRiskQueryInput: ChecklistRiskQueryInput;
  ChecklistRiskUpdateInput: ChecklistRiskUpdateInput;
  ChecklistUpdateInput: ChecklistUpdateInput;
  Classification: Classification;
  ClassificationAttribute: ClassificationAttribute;
  ClassificationAttributeInsertInput: ClassificationAttributeInsertInput;
  ClassificationAttributeQueryInput: ClassificationAttributeQueryInput;
  ClassificationAttributeUpdateInput: ClassificationAttributeUpdateInput;
  ClassificationIncidentsRelationInput: ClassificationIncidentsRelationInput;
  ClassificationInsertInput: ClassificationInsertInput;
  ClassificationQueryInput: ClassificationQueryInput;
  ClassificationReportsRelationInput: ClassificationReportsRelationInput;
  ClassificationUpdateInput: ClassificationUpdateInput;
  CreateDefaultAdminUserInput: CreateDefaultAdminUserInput;
  CreateVariantInput: CreateVariantInput;
  CreateVariantInputVariant: CreateVariantInputVariant;
  CreateVariantPayload: CreateVariantPayload;
  DateTime: Scalars['DateTime']['output'];
  DefaultAdminUser: DefaultAdminUser;
  DeleteManyPayload: DeleteManyPayload;
  Duplicate: Duplicate;
  DuplicateInsertInput: DuplicateInsertInput;
  DuplicateQueryInput: DuplicateQueryInput;
  DuplicateUpdateInput: DuplicateUpdateInput;
  Entity: Entity;
  EntityInsertInput: EntityInsertInput;
  EntityQueryInput: EntityQueryInput;
  EntityUpdateInput: EntityUpdateInput;
  GetUserInput: GetUserInput;
  History_incident: History_Incident;
  History_incidentEmbedding: History_IncidentEmbedding;
  History_incidentEmbeddingInsertInput: History_IncidentEmbeddingInsertInput;
  History_incidentEmbeddingQueryInput: History_IncidentEmbeddingQueryInput;
  History_incidentEmbeddingUpdateInput: History_IncidentEmbeddingUpdateInput;
  History_incidentInsertInput: History_IncidentInsertInput;
  History_incidentNlp_similar_incident: History_IncidentNlp_Similar_Incident;
  History_incidentNlp_similar_incidentInsertInput: History_IncidentNlp_Similar_IncidentInsertInput;
  History_incidentNlp_similar_incidentQueryInput: History_IncidentNlp_Similar_IncidentQueryInput;
  History_incidentNlp_similar_incidentUpdateInput: History_IncidentNlp_Similar_IncidentUpdateInput;
  History_incidentQueryInput: History_IncidentQueryInput;
  History_incidentTsne: History_IncidentTsne;
  History_incidentTsneInsertInput: History_IncidentTsneInsertInput;
  History_incidentTsneQueryInput: History_IncidentTsneQueryInput;
  History_incidentTsneUpdateInput: History_IncidentTsneUpdateInput;
  History_incidentUpdateInput: History_IncidentUpdateInput;
  History_report: History_Report;
  History_reportEmbedding: History_ReportEmbedding;
  History_reportEmbeddingInsertInput: History_ReportEmbeddingInsertInput;
  History_reportEmbeddingQueryInput: History_ReportEmbeddingQueryInput;
  History_reportEmbeddingUpdateInput: History_ReportEmbeddingUpdateInput;
  History_reportInsertInput: History_ReportInsertInput;
  History_reportQueryInput: History_ReportQueryInput;
  History_reportUpdateInput: History_ReportUpdateInput;
  Incident: Incident;
  IncidentAllegedDeployerOfAISystemRelationInput: IncidentAllegedDeployerOfAiSystemRelationInput;
  IncidentAllegedDeveloperOfAISystemRelationInput: IncidentAllegedDeveloperOfAiSystemRelationInput;
  IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput: IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput;
  IncidentEditorsRelationInput: IncidentEditorsRelationInput;
  IncidentEmbedding: IncidentEmbedding;
  IncidentEmbeddingInsertInput: IncidentEmbeddingInsertInput;
  IncidentEmbeddingQueryInput: IncidentEmbeddingQueryInput;
  IncidentEmbeddingUpdateInput: IncidentEmbeddingUpdateInput;
  IncidentInsertInput: IncidentInsertInput;
  IncidentNlp_similar_incident: IncidentNlp_Similar_Incident;
  IncidentNlp_similar_incidentInsertInput: IncidentNlp_Similar_IncidentInsertInput;
  IncidentNlp_similar_incidentQueryInput: IncidentNlp_Similar_IncidentQueryInput;
  IncidentNlp_similar_incidentUpdateInput: IncidentNlp_Similar_IncidentUpdateInput;
  IncidentQueryInput: IncidentQueryInput;
  IncidentReportsRelationInput: IncidentReportsRelationInput;
  IncidentTsne: IncidentTsne;
  IncidentTsneInsertInput: IncidentTsneInsertInput;
  IncidentTsneQueryInput: IncidentTsneQueryInput;
  IncidentTsneUpdateInput: IncidentTsneUpdateInput;
  IncidentUpdateInput: IncidentUpdateInput;
  InsertManyPayload: InsertManyPayload;
  LinkReportsToIncidentsInput: LinkReportsToIncidentsInput;
  LogIncidentHistoryPayload: LogIncidentHistoryPayload;
  LogReportHistoryPayload: LogReportHistoryPayload;
  Long: Scalars['Long']['output'];
  LongFilter: LongFilter;
  LongNotFilter: LongNotFilter;
  Mutation: {};
  Notification: Notification;
  NotificationInsertInput: NotificationInsertInput;
  NotificationQueryInput: NotificationQueryInput;
  NotificationUpdateInput: NotificationUpdateInput;
  NotificationUserIdRelationInput: NotificationUserIdRelationInput;
  ObjectId: Scalars['ObjectId']['output'];
  ObjectIdFilter: ObjectIdFilter;
  ObjectIdNotFilter: ObjectIdNotFilter;
  PaginationType: PaginationType;
  PromoteSubmissionToReportInput: PromoteSubmissionToReportInput;
  PromoteSubmissionToReportPayload: PromoteSubmissionToReportPayload;
  Query: {};
  QuickAdd: QuickAdd;
  QuickAddFilterType: QuickAddFilterType;
  QuickAddInsertType: QuickAddInsertType;
  QuickAddSortType: QuickAddSortType;
  Quickadd: Quickadd;
  QuickaddInsertInput: QuickaddInsertInput;
  QuickaddUpdateInput: QuickaddUpdateInput;
  Report: Report;
  ReportEmbedding: ReportEmbedding;
  ReportEmbeddingInsertInput: ReportEmbeddingInsertInput;
  ReportEmbeddingQueryInput: ReportEmbeddingQueryInput;
  ReportEmbeddingUpdateInput: ReportEmbeddingUpdateInput;
  ReportInsertInput: ReportInsertInput;
  ReportQueryInput: ReportQueryInput;
  ReportTranslation: ReportTranslation;
  ReportUpdateInput: ReportUpdateInput;
  ReportUserRelationInput: ReportUserRelationInput;
  RisksInput: RisksInput;
  RisksPayloadItem: RisksPayloadItem;
  RisksPayloadPrecedent: RisksPayloadPrecedent;
  RisksPayloadPrecedentEmbedding: RisksPayloadPrecedentEmbedding;
  RisksPayloadPrecedentNlp_similar_incident: RisksPayloadPrecedentNlp_Similar_Incident;
  RisksPayloadPrecedentTsne: RisksPayloadPrecedentTsne;
  StringFilter: StringFilter;
  StringNotFilter: StringNotFilter;
  Submission: Submission;
  SubmissionDeployersRelationInput: SubmissionDeployersRelationInput;
  SubmissionDevelopersRelationInput: SubmissionDevelopersRelationInput;
  SubmissionEmbedding: SubmissionEmbedding;
  SubmissionEmbeddingInsertInput: SubmissionEmbeddingInsertInput;
  SubmissionEmbeddingQueryInput: SubmissionEmbeddingQueryInput;
  SubmissionEmbeddingUpdateInput: SubmissionEmbeddingUpdateInput;
  SubmissionHarmed_partiesRelationInput: SubmissionHarmed_PartiesRelationInput;
  SubmissionIncident_editorsRelationInput: SubmissionIncident_EditorsRelationInput;
  SubmissionInsertInput: SubmissionInsertInput;
  SubmissionNlp_similar_incident: SubmissionNlp_Similar_Incident;
  SubmissionNlp_similar_incidentInsertInput: SubmissionNlp_Similar_IncidentInsertInput;
  SubmissionNlp_similar_incidentQueryInput: SubmissionNlp_Similar_IncidentQueryInput;
  SubmissionNlp_similar_incidentUpdateInput: SubmissionNlp_Similar_IncidentUpdateInput;
  SubmissionQueryInput: SubmissionQueryInput;
  SubmissionUpdateInput: SubmissionUpdateInput;
  SubmissionUserRelationInput: SubmissionUserRelationInput;
  Subscription: {};
  SubscriptionEntityIdRelationInput: SubscriptionEntityIdRelationInput;
  SubscriptionIncident_idRelationInput: SubscriptionIncident_IdRelationInput;
  SubscriptionInsertInput: SubscriptionInsertInput;
  SubscriptionQueryInput: SubscriptionQueryInput;
  SubscriptionUpdateInput: SubscriptionUpdateInput;
  SubscriptionUserIdRelationInput: SubscriptionUserIdRelationInput;
  Taxa: Taxa;
  TaxaDummy_field: TaxaDummy_Field;
  TaxaDummy_fieldInsertInput: TaxaDummy_FieldInsertInput;
  TaxaDummy_fieldQueryInput: TaxaDummy_FieldQueryInput;
  TaxaDummy_fieldUpdateInput: TaxaDummy_FieldUpdateInput;
  TaxaField_list: TaxaField_List;
  TaxaField_listComplete_from: TaxaField_ListComplete_From;
  TaxaField_listComplete_fromInsertInput: TaxaField_ListComplete_FromInsertInput;
  TaxaField_listComplete_fromQueryInput: TaxaField_ListComplete_FromQueryInput;
  TaxaField_listComplete_fromUpdateInput: TaxaField_ListComplete_FromUpdateInput;
  TaxaField_listInsertInput: TaxaField_ListInsertInput;
  TaxaField_listItem_field: TaxaField_ListItem_Field;
  TaxaField_listItem_fieldComplete_from: TaxaField_ListItem_FieldComplete_From;
  TaxaField_listItem_fieldComplete_fromInsertInput: TaxaField_ListItem_FieldComplete_FromInsertInput;
  TaxaField_listItem_fieldComplete_fromQueryInput: TaxaField_ListItem_FieldComplete_FromQueryInput;
  TaxaField_listItem_fieldComplete_fromUpdateInput: TaxaField_ListItem_FieldComplete_FromUpdateInput;
  TaxaField_listItem_fieldInsertInput: TaxaField_ListItem_FieldInsertInput;
  TaxaField_listItem_fieldQueryInput: TaxaField_ListItem_FieldQueryInput;
  TaxaField_listItem_fieldUpdateInput: TaxaField_ListItem_FieldUpdateInput;
  TaxaField_listQueryInput: TaxaField_ListQueryInput;
  TaxaField_listUpdateInput: TaxaField_ListUpdateInput;
  TaxaInsertInput: TaxaInsertInput;
  TaxaQueryInput: TaxaQueryInput;
  TaxaUpdateInput: TaxaUpdateInput;
  UpdateManyPayload: UpdateManyPayload;
  UpdateOneReportTranslationInput: UpdateOneReportTranslationInput;
  User: User;
  UserAdminDatum: UserAdminDatum;
  UserInsertInput: UserInsertInput;
  UserQueryInput: UserQueryInput;
  UserUpdateInput: UserUpdateInput;
  AdditionalEntityFields: AdditionalEntityFields;
};

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars['String']['input']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars['String']['input'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars['Boolean']['input']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']['input']>;
};

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = { };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']['input']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars['String']['input'];
};

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AppUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppUser'] = ResolversParentTypes['AppUser']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CandidateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Candidate'] = ResolversParentTypes['Candidate']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  authors?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  classification_similarity?: Resolver<Maybe<Array<Maybe<ResolversTypes['CandidateClassification_similarity']>>>, ParentType, ContextType>;
  date_downloaded?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date_published?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dismissed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  embedding?: Resolver<Maybe<ResolversTypes['CandidateEmbedding']>, ParentType, ContextType>;
  epoch_date_downloaded?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  epoch_date_published?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  image_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  match?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  matching_entities?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  matching_harm_keywords?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  matching_keywords?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  plain_text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  similarity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  source_domain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CandidateClassification_SimilarityResolvers<ContextType = any, ParentType extends ResolversParentTypes['CandidateClassification_similarity'] = ResolversParentTypes['CandidateClassification_similarity']> = {
  classification?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  similarity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CandidateEmbeddingResolvers<ContextType = any, ParentType extends ResolversParentTypes['CandidateEmbedding'] = ResolversParentTypes['CandidateEmbedding']> = {
  from_text_hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vector?: Resolver<Maybe<Array<Maybe<ResolversTypes['Float']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChecklistResolvers<ContextType = any, ParentType extends ResolversParentTypes['Checklist'] = ResolversParentTypes['Checklist']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date_created?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  date_updated?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  entity_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  owner_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  risks?: Resolver<Maybe<Array<Maybe<ResolversTypes['ChecklistRisk']>>>, ParentType, ContextType>;
  tags_goals?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  tags_methods?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  tags_other?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChecklistRiskResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChecklistRisk'] = ResolversParentTypes['ChecklistRisk']> = {
  generated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  likelihood?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  precedents?: Resolver<Maybe<Array<Maybe<ResolversTypes['ChecklistRiskPrecedent']>>>, ParentType, ContextType>;
  risk_notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  risk_status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  severity?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  touched?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChecklistRiskPrecedentResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChecklistRiskPrecedent'] = ResolversParentTypes['ChecklistRiskPrecedent']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  incident_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClassificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Classification'] = ResolversParentTypes['Classification']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  attributes?: Resolver<Maybe<Array<Maybe<ResolversTypes['ClassificationAttribute']>>>, ParentType, ContextType>;
  incidents?: Resolver<Array<Maybe<ResolversTypes['Incident']>>, ParentType, ContextType>;
  namespace?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  publish?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  reports?: Resolver<Array<Maybe<ResolversTypes['Report']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClassificationAttributeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClassificationAttribute'] = ResolversParentTypes['ClassificationAttribute']> = {
  short_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value_json?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateVariantPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateVariantPayload'] = ResolversParentTypes['CreateVariantPayload']> = {
  incident_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  report_number?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DefaultAdminUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['DefaultAdminUser'] = ResolversParentTypes['DefaultAdminUser']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteManyPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeleteManyPayload'] = ResolversParentTypes['DeleteManyPayload']> = {
  deletedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DuplicateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Duplicate'] = ResolversParentTypes['Duplicate']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  duplicate_incident_number?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  true_incident_number?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  date_modified?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  entity_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type History_IncidentResolvers<ContextType = any, ParentType extends ResolversParentTypes['History_incident'] = ResolversParentTypes['History_incident']> = {
  AllegedDeployerOfAISystem?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  AllegedDeveloperOfAISystem?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  AllegedHarmedOrNearlyHarmedParties?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  editor_dissimilar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  editor_notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  editor_similar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  editors?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  embedding?: Resolver<Maybe<ResolversTypes['History_incidentEmbedding']>, ParentType, ContextType>;
  epoch_date_modified?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  flagged_dissimilar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  incident_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  modifiedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nlp_similar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['History_incidentNlp_similar_incident']>>>, ParentType, ContextType>;
  reports?: Resolver<Array<Maybe<ResolversTypes['Int']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tsne?: Resolver<Maybe<ResolversTypes['History_incidentTsne']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type History_IncidentEmbeddingResolvers<ContextType = any, ParentType extends ResolversParentTypes['History_incidentEmbedding'] = ResolversParentTypes['History_incidentEmbedding']> = {
  from_reports?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  vector?: Resolver<Maybe<Array<Maybe<ResolversTypes['Float']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type History_IncidentNlp_Similar_IncidentResolvers<ContextType = any, ParentType extends ResolversParentTypes['History_incidentNlp_similar_incident'] = ResolversParentTypes['History_incidentNlp_similar_incident']> = {
  incident_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  similarity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type History_IncidentTsneResolvers<ContextType = any, ParentType extends ResolversParentTypes['History_incidentTsne'] = ResolversParentTypes['History_incidentTsne']> = {
  x?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  y?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type History_ReportResolvers<ContextType = any, ParentType extends ResolversParentTypes['History_report'] = ResolversParentTypes['History_report']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  authors?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  cloudinary_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date_downloaded?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date_modified?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date_published?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date_submitted?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  editor_notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  embedding?: Resolver<Maybe<ResolversTypes['History_reportEmbedding']>, ParentType, ContextType>;
  epoch_date_downloaded?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  epoch_date_modified?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  epoch_date_published?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  epoch_date_submitted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  flag?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  image_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputs_outputs?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  is_incident_report?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  modifiedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  plain_text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quiet?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  report_number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  source_domain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  submitters?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type History_ReportEmbeddingResolvers<ContextType = any, ParentType extends ResolversParentTypes['History_reportEmbedding'] = ResolversParentTypes['History_reportEmbedding']> = {
  from_text_hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vector?: Resolver<Maybe<Array<Maybe<ResolversTypes['Float']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IncidentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Incident'] = ResolversParentTypes['Incident']> = {
  AllegedDeployerOfAISystem?: Resolver<Maybe<Array<Maybe<ResolversTypes['Entity']>>>, ParentType, ContextType>;
  AllegedDeveloperOfAISystem?: Resolver<Maybe<Array<Maybe<ResolversTypes['Entity']>>>, ParentType, ContextType>;
  AllegedHarmedOrNearlyHarmedParties?: Resolver<Maybe<Array<Maybe<ResolversTypes['Entity']>>>, ParentType, ContextType>;
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  editor_dissimilar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  editor_notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  editor_similar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  editors?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  embedding?: Resolver<Maybe<ResolversTypes['IncidentEmbedding']>, ParentType, ContextType>;
  epoch_date_modified?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  flagged_dissimilar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  incident_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  nlp_similar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['IncidentNlp_similar_incident']>>>, ParentType, ContextType>;
  reports?: Resolver<Array<Maybe<ResolversTypes['Report']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tsne?: Resolver<Maybe<ResolversTypes['IncidentTsne']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IncidentEmbeddingResolvers<ContextType = any, ParentType extends ResolversParentTypes['IncidentEmbedding'] = ResolversParentTypes['IncidentEmbedding']> = {
  from_reports?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  vector?: Resolver<Maybe<Array<Maybe<ResolversTypes['Float']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IncidentNlp_Similar_IncidentResolvers<ContextType = any, ParentType extends ResolversParentTypes['IncidentNlp_similar_incident'] = ResolversParentTypes['IncidentNlp_similar_incident']> = {
  incident_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  similarity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IncidentTsneResolvers<ContextType = any, ParentType extends ResolversParentTypes['IncidentTsne'] = ResolversParentTypes['IncidentTsne']> = {
  x?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  y?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InsertManyPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['InsertManyPayload'] = ResolversParentTypes['InsertManyPayload']> = {
  insertedIds?: Resolver<Array<Maybe<ResolversTypes['ObjectId']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LogIncidentHistoryPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['LogIncidentHistoryPayload'] = ResolversParentTypes['LogIncidentHistoryPayload']> = {
  incident_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LogReportHistoryPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['LogReportHistoryPayload'] = ResolversParentTypes['LogReportHistoryPayload']> = {
  report_number?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createDefaultAdminUser?: Resolver<Maybe<ResolversTypes['DefaultAdminUser']>, ParentType, ContextType, Partial<MutationCreateDefaultAdminUserArgs>>;
  createVariant?: Resolver<Maybe<ResolversTypes['CreateVariantPayload']>, ParentType, ContextType, Partial<MutationCreateVariantArgs>>;
  deleteManyCandidates?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyCandidatesArgs>>;
  deleteManyChecklists?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyChecklistsArgs>>;
  deleteManyClassifications?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyClassificationsArgs>>;
  deleteManyDuplicates?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyDuplicatesArgs>>;
  deleteManyEntities?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyEntitiesArgs>>;
  deleteManyHistory_incidents?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyHistory_IncidentsArgs>>;
  deleteManyHistory_reports?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyHistory_ReportsArgs>>;
  deleteManyIncidents?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyIncidentsArgs>>;
  deleteManyNotifications?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyNotificationsArgs>>;
  deleteManyQuickadds?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyQuickaddsArgs>>;
  deleteManyReports?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyReportsArgs>>;
  deleteManySubmissions?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManySubmissionsArgs>>;
  deleteManySubscriptions?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManySubscriptionsArgs>>;
  deleteManyTaxas?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyTaxasArgs>>;
  deleteManyUsers?: Resolver<Maybe<ResolversTypes['DeleteManyPayload']>, ParentType, ContextType, Partial<MutationDeleteManyUsersArgs>>;
  deleteOneCandidate?: Resolver<Maybe<ResolversTypes['Candidate']>, ParentType, ContextType, RequireFields<MutationDeleteOneCandidateArgs, 'query'>>;
  deleteOneChecklist?: Resolver<Maybe<ResolversTypes['Checklist']>, ParentType, ContextType, RequireFields<MutationDeleteOneChecklistArgs, 'query'>>;
  deleteOneClassification?: Resolver<Maybe<ResolversTypes['Classification']>, ParentType, ContextType, RequireFields<MutationDeleteOneClassificationArgs, 'query'>>;
  deleteOneDuplicate?: Resolver<Maybe<ResolversTypes['Duplicate']>, ParentType, ContextType, RequireFields<MutationDeleteOneDuplicateArgs, 'query'>>;
  deleteOneEntity?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<MutationDeleteOneEntityArgs, 'query'>>;
  deleteOneHistory_incident?: Resolver<Maybe<ResolversTypes['History_incident']>, ParentType, ContextType, RequireFields<MutationDeleteOneHistory_IncidentArgs, 'query'>>;
  deleteOneHistory_report?: Resolver<Maybe<ResolversTypes['History_report']>, ParentType, ContextType, RequireFields<MutationDeleteOneHistory_ReportArgs, 'query'>>;
  deleteOneIncident?: Resolver<Maybe<ResolversTypes['Incident']>, ParentType, ContextType, RequireFields<MutationDeleteOneIncidentArgs, 'query'>>;
  deleteOneNotification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<MutationDeleteOneNotificationArgs, 'query'>>;
  deleteOneQuickadd?: Resolver<Maybe<ResolversTypes['Quickadd']>, ParentType, ContextType>;
  deleteOneReport?: Resolver<Maybe<ResolversTypes['Report']>, ParentType, ContextType, RequireFields<MutationDeleteOneReportArgs, 'query'>>;
  deleteOneSubmission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<MutationDeleteOneSubmissionArgs, 'query'>>;
  deleteOneSubscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType, RequireFields<MutationDeleteOneSubscriptionArgs, 'query'>>;
  deleteOneTaxa?: Resolver<Maybe<ResolversTypes['Taxa']>, ParentType, ContextType, RequireFields<MutationDeleteOneTaxaArgs, 'query'>>;
  deleteOneUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationDeleteOneUserArgs, 'query'>>;
  getUser?: Resolver<Maybe<ResolversTypes['AppUser']>, ParentType, ContextType, Partial<MutationGetUserArgs>>;
  insertManyCandidates?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyCandidatesArgs, 'data'>>;
  insertManyChecklists?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyChecklistsArgs, 'data'>>;
  insertManyClassifications?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyClassificationsArgs, 'data'>>;
  insertManyDuplicates?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyDuplicatesArgs, 'data'>>;
  insertManyEntities?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyEntitiesArgs, 'data'>>;
  insertManyHistory_incidents?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyHistory_IncidentsArgs, 'data'>>;
  insertManyHistory_reports?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyHistory_ReportsArgs, 'data'>>;
  insertManyIncidents?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyIncidentsArgs, 'data'>>;
  insertManyNotifications?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyNotificationsArgs, 'data'>>;
  insertManyQuickadds?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyQuickaddsArgs, 'data'>>;
  insertManyReports?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyReportsArgs, 'data'>>;
  insertManySubmissions?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManySubmissionsArgs, 'data'>>;
  insertManySubscriptions?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManySubscriptionsArgs, 'data'>>;
  insertManyTaxas?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyTaxasArgs, 'data'>>;
  insertManyUsers?: Resolver<Maybe<ResolversTypes['InsertManyPayload']>, ParentType, ContextType, RequireFields<MutationInsertManyUsersArgs, 'data'>>;
  insertOneCandidate?: Resolver<Maybe<ResolversTypes['Candidate']>, ParentType, ContextType, RequireFields<MutationInsertOneCandidateArgs, 'data'>>;
  insertOneChecklist?: Resolver<Maybe<ResolversTypes['Checklist']>, ParentType, ContextType, RequireFields<MutationInsertOneChecklistArgs, 'data'>>;
  insertOneClassification?: Resolver<Maybe<ResolversTypes['Classification']>, ParentType, ContextType, RequireFields<MutationInsertOneClassificationArgs, 'data'>>;
  insertOneDuplicate?: Resolver<Maybe<ResolversTypes['Duplicate']>, ParentType, ContextType, RequireFields<MutationInsertOneDuplicateArgs, 'data'>>;
  insertOneEntity?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<MutationInsertOneEntityArgs, 'data'>>;
  insertOneHistory_incident?: Resolver<Maybe<ResolversTypes['History_incident']>, ParentType, ContextType, RequireFields<MutationInsertOneHistory_IncidentArgs, 'data'>>;
  insertOneHistory_report?: Resolver<Maybe<ResolversTypes['History_report']>, ParentType, ContextType, RequireFields<MutationInsertOneHistory_ReportArgs, 'data'>>;
  insertOneIncident?: Resolver<Maybe<ResolversTypes['Incident']>, ParentType, ContextType, RequireFields<MutationInsertOneIncidentArgs, 'data'>>;
  insertOneNotification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<MutationInsertOneNotificationArgs, 'data'>>;
  insertOneQuickadd?: Resolver<Maybe<ResolversTypes['QuickAdd']>, ParentType, ContextType, Partial<MutationInsertOneQuickaddArgs>>;
  insertOneReport?: Resolver<Maybe<ResolversTypes['Report']>, ParentType, ContextType, RequireFields<MutationInsertOneReportArgs, 'data'>>;
  insertOneSubmission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<MutationInsertOneSubmissionArgs, 'data'>>;
  insertOneSubscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType, RequireFields<MutationInsertOneSubscriptionArgs, 'data'>>;
  insertOneTaxa?: Resolver<Maybe<ResolversTypes['Taxa']>, ParentType, ContextType, RequireFields<MutationInsertOneTaxaArgs, 'data'>>;
  insertOneUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationInsertOneUserArgs, 'data'>>;
  linkReportsToIncidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Incident']>>>, ParentType, ContextType, Partial<MutationLinkReportsToIncidentsArgs>>;
  logIncidentHistory?: Resolver<Maybe<ResolversTypes['LogIncidentHistoryPayload']>, ParentType, ContextType, Partial<MutationLogIncidentHistoryArgs>>;
  logReportHistory?: Resolver<Maybe<ResolversTypes['LogReportHistoryPayload']>, ParentType, ContextType, Partial<MutationLogReportHistoryArgs>>;
  processNotifications?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  promoteSubmissionToReport?: Resolver<Maybe<ResolversTypes['PromoteSubmissionToReportPayload']>, ParentType, ContextType, Partial<MutationPromoteSubmissionToReportArgs>>;
  replaceOneCandidate?: Resolver<Maybe<ResolversTypes['Candidate']>, ParentType, ContextType, RequireFields<MutationReplaceOneCandidateArgs, 'data'>>;
  replaceOneChecklist?: Resolver<Maybe<ResolversTypes['Checklist']>, ParentType, ContextType, RequireFields<MutationReplaceOneChecklistArgs, 'data'>>;
  replaceOneClassification?: Resolver<Maybe<ResolversTypes['Classification']>, ParentType, ContextType, RequireFields<MutationReplaceOneClassificationArgs, 'data'>>;
  replaceOneDuplicate?: Resolver<Maybe<ResolversTypes['Duplicate']>, ParentType, ContextType, RequireFields<MutationReplaceOneDuplicateArgs, 'data'>>;
  replaceOneEntity?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<MutationReplaceOneEntityArgs, 'data'>>;
  replaceOneHistory_incident?: Resolver<Maybe<ResolversTypes['History_incident']>, ParentType, ContextType, RequireFields<MutationReplaceOneHistory_IncidentArgs, 'data'>>;
  replaceOneHistory_report?: Resolver<Maybe<ResolversTypes['History_report']>, ParentType, ContextType, RequireFields<MutationReplaceOneHistory_ReportArgs, 'data'>>;
  replaceOneIncident?: Resolver<Maybe<ResolversTypes['Incident']>, ParentType, ContextType, RequireFields<MutationReplaceOneIncidentArgs, 'data'>>;
  replaceOneNotification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<MutationReplaceOneNotificationArgs, 'data'>>;
  replaceOneQuickadd?: Resolver<Maybe<ResolversTypes['Quickadd']>, ParentType, ContextType, RequireFields<MutationReplaceOneQuickaddArgs, 'data'>>;
  replaceOneReport?: Resolver<Maybe<ResolversTypes['Report']>, ParentType, ContextType, RequireFields<MutationReplaceOneReportArgs, 'data'>>;
  replaceOneSubmission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<MutationReplaceOneSubmissionArgs, 'data'>>;
  replaceOneSubscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType, RequireFields<MutationReplaceOneSubscriptionArgs, 'data'>>;
  replaceOneTaxa?: Resolver<Maybe<ResolversTypes['Taxa']>, ParentType, ContextType, RequireFields<MutationReplaceOneTaxaArgs, 'data'>>;
  replaceOneUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationReplaceOneUserArgs, 'data'>>;
  updateManyCandidates?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyCandidatesArgs, 'set'>>;
  updateManyChecklists?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyChecklistsArgs, 'set'>>;
  updateManyClassifications?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyClassificationsArgs, 'set'>>;
  updateManyDuplicates?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyDuplicatesArgs, 'set'>>;
  updateManyEntities?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyEntitiesArgs, 'set'>>;
  updateManyHistory_incidents?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyHistory_IncidentsArgs, 'set'>>;
  updateManyHistory_reports?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyHistory_ReportsArgs, 'set'>>;
  updateManyIncidents?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyIncidentsArgs, 'set'>>;
  updateManyNotifications?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyNotificationsArgs, 'set'>>;
  updateManyQuickadds?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyQuickaddsArgs, 'set'>>;
  updateManyReports?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyReportsArgs, 'set'>>;
  updateManySubmissions?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManySubmissionsArgs, 'set'>>;
  updateManySubscriptions?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManySubscriptionsArgs, 'set'>>;
  updateManyTaxas?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyTaxasArgs, 'set'>>;
  updateManyUsers?: Resolver<Maybe<ResolversTypes['UpdateManyPayload']>, ParentType, ContextType, RequireFields<MutationUpdateManyUsersArgs, 'set'>>;
  updateOneCandidate?: Resolver<Maybe<ResolversTypes['Candidate']>, ParentType, ContextType, RequireFields<MutationUpdateOneCandidateArgs, 'set'>>;
  updateOneChecklist?: Resolver<Maybe<ResolversTypes['Checklist']>, ParentType, ContextType, RequireFields<MutationUpdateOneChecklistArgs, 'set'>>;
  updateOneClassification?: Resolver<Maybe<ResolversTypes['Classification']>, ParentType, ContextType, RequireFields<MutationUpdateOneClassificationArgs, 'set'>>;
  updateOneDuplicate?: Resolver<Maybe<ResolversTypes['Duplicate']>, ParentType, ContextType, RequireFields<MutationUpdateOneDuplicateArgs, 'set'>>;
  updateOneEntity?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<MutationUpdateOneEntityArgs, 'set'>>;
  updateOneHistory_incident?: Resolver<Maybe<ResolversTypes['History_incident']>, ParentType, ContextType, RequireFields<MutationUpdateOneHistory_IncidentArgs, 'set'>>;
  updateOneHistory_report?: Resolver<Maybe<ResolversTypes['History_report']>, ParentType, ContextType, RequireFields<MutationUpdateOneHistory_ReportArgs, 'set'>>;
  updateOneIncident?: Resolver<Maybe<ResolversTypes['Incident']>, ParentType, ContextType, RequireFields<MutationUpdateOneIncidentArgs, 'set'>>;
  updateOneNotification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<MutationUpdateOneNotificationArgs, 'set'>>;
  updateOneQuickadd?: Resolver<Maybe<ResolversTypes['Quickadd']>, ParentType, ContextType, RequireFields<MutationUpdateOneQuickaddArgs, 'set'>>;
  updateOneReport?: Resolver<Maybe<ResolversTypes['Report']>, ParentType, ContextType, RequireFields<MutationUpdateOneReportArgs, 'set'>>;
  updateOneReportTranslation?: Resolver<Maybe<ResolversTypes['Report']>, ParentType, ContextType, Partial<MutationUpdateOneReportTranslationArgs>>;
  updateOneSubmission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<MutationUpdateOneSubmissionArgs, 'set'>>;
  updateOneSubscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType, RequireFields<MutationUpdateOneSubscriptionArgs, 'set'>>;
  updateOneTaxa?: Resolver<Maybe<ResolversTypes['Taxa']>, ParentType, ContextType, RequireFields<MutationUpdateOneTaxaArgs, 'set'>>;
  updateOneUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateOneUserArgs, 'set'>>;
  upsertOneCandidate?: Resolver<Maybe<ResolversTypes['Candidate']>, ParentType, ContextType, RequireFields<MutationUpsertOneCandidateArgs, 'data'>>;
  upsertOneChecklist?: Resolver<Maybe<ResolversTypes['Checklist']>, ParentType, ContextType, RequireFields<MutationUpsertOneChecklistArgs, 'data'>>;
  upsertOneClassification?: Resolver<Maybe<ResolversTypes['Classification']>, ParentType, ContextType, RequireFields<MutationUpsertOneClassificationArgs, 'data'>>;
  upsertOneDuplicate?: Resolver<Maybe<ResolversTypes['Duplicate']>, ParentType, ContextType, RequireFields<MutationUpsertOneDuplicateArgs, 'data'>>;
  upsertOneEntity?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<MutationUpsertOneEntityArgs, 'data'>>;
  upsertOneHistory_incident?: Resolver<Maybe<ResolversTypes['History_incident']>, ParentType, ContextType, RequireFields<MutationUpsertOneHistory_IncidentArgs, 'data'>>;
  upsertOneHistory_report?: Resolver<Maybe<ResolversTypes['History_report']>, ParentType, ContextType, RequireFields<MutationUpsertOneHistory_ReportArgs, 'data'>>;
  upsertOneIncident?: Resolver<Maybe<ResolversTypes['Incident']>, ParentType, ContextType, RequireFields<MutationUpsertOneIncidentArgs, 'data'>>;
  upsertOneNotification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, RequireFields<MutationUpsertOneNotificationArgs, 'data'>>;
  upsertOneQuickadd?: Resolver<Maybe<ResolversTypes['Quickadd']>, ParentType, ContextType, RequireFields<MutationUpsertOneQuickaddArgs, 'data'>>;
  upsertOneReport?: Resolver<Maybe<ResolversTypes['Report']>, ParentType, ContextType, RequireFields<MutationUpsertOneReportArgs, 'data'>>;
  upsertOneSubmission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, RequireFields<MutationUpsertOneSubmissionArgs, 'data'>>;
  upsertOneSubscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType, RequireFields<MutationUpsertOneSubscriptionArgs, 'data'>>;
  upsertOneTaxa?: Resolver<Maybe<ResolversTypes['Taxa']>, ParentType, ContextType, RequireFields<MutationUpsertOneTaxaArgs, 'data'>>;
  upsertOneUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpsertOneUserArgs, 'data'>>;
};

export type NotificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  incident_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  processed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  sentDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectId'], any> {
  name: 'ObjectId';
}

export type OprResolvers = { ALL: '$all', EQL: '$eq', GT: '$gt', GTE: '$gte', IN: '$in', LT: '$lt', LTE: '$lte', NE: '$ne', NIN: '$nin' };

export type PromoteSubmissionToReportPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['PromoteSubmissionToReportPayload'] = ResolversParentTypes['PromoteSubmissionToReportPayload']> = {
  incident_ids?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  report_number?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  ObjectId?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  candidate?: Resolver<Maybe<ResolversTypes['Candidate']>, ParentType, ContextType, Partial<QueryCandidateArgs>>;
  candidates?: Resolver<Array<Maybe<ResolversTypes['Candidate']>>, ParentType, ContextType, RequireFields<QueryCandidatesArgs, 'limit'>>;
  checklist?: Resolver<Maybe<ResolversTypes['Checklist']>, ParentType, ContextType, Partial<QueryChecklistArgs>>;
  checklists?: Resolver<Array<Maybe<ResolversTypes['Checklist']>>, ParentType, ContextType, RequireFields<QueryChecklistsArgs, 'limit'>>;
  classification?: Resolver<Maybe<ResolversTypes['Classification']>, ParentType, ContextType, Partial<QueryClassificationArgs>>;
  classifications?: Resolver<Array<Maybe<ResolversTypes['Classification']>>, ParentType, ContextType, RequireFields<QueryClassificationsArgs, 'limit'>>;
  duplicate?: Resolver<Maybe<ResolversTypes['Duplicate']>, ParentType, ContextType, Partial<QueryDuplicateArgs>>;
  duplicates?: Resolver<Array<Maybe<ResolversTypes['Duplicate']>>, ParentType, ContextType, RequireFields<QueryDuplicatesArgs, 'limit'>>;
  entities?: Resolver<Array<Maybe<ResolversTypes['Entity']>>, ParentType, ContextType, RequireFields<QueryEntitiesArgs, 'limit'>>;
  entity?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType, Partial<QueryEntityArgs>>;
  history_incident?: Resolver<Maybe<ResolversTypes['History_incident']>, ParentType, ContextType, Partial<QueryHistory_IncidentArgs>>;
  history_incidents?: Resolver<Array<Maybe<ResolversTypes['History_incident']>>, ParentType, ContextType, RequireFields<QueryHistory_IncidentsArgs, 'limit'>>;
  history_report?: Resolver<Maybe<ResolversTypes['History_report']>, ParentType, ContextType, Partial<QueryHistory_ReportArgs>>;
  history_reports?: Resolver<Array<Maybe<ResolversTypes['History_report']>>, ParentType, ContextType, RequireFields<QueryHistory_ReportsArgs, 'limit'>>;
  incident?: Resolver<Maybe<ResolversTypes['Incident']>, ParentType, ContextType, Partial<QueryIncidentArgs>>;
  incidents?: Resolver<Array<Maybe<ResolversTypes['Incident']>>, ParentType, ContextType, RequireFields<QueryIncidentsArgs, 'limit'>>;
  notification?: Resolver<Maybe<ResolversTypes['Notification']>, ParentType, ContextType, Partial<QueryNotificationArgs>>;
  notifications?: Resolver<Array<Maybe<ResolversTypes['Notification']>>, ParentType, ContextType, RequireFields<QueryNotificationsArgs, 'limit'>>;
  quickadd?: Resolver<Maybe<ResolversTypes['Quickadd']>, ParentType, ContextType>;
  quickadds?: Resolver<Maybe<Array<Maybe<ResolversTypes['QuickAdd']>>>, ParentType, ContextType, Partial<QueryQuickaddsArgs>>;
  report?: Resolver<Maybe<ResolversTypes['Report']>, ParentType, ContextType, Partial<QueryReportArgs>>;
  reports?: Resolver<Array<Maybe<ResolversTypes['Report']>>, ParentType, ContextType, RequireFields<QueryReportsArgs, 'limit'>>;
  risks?: Resolver<Maybe<Array<Maybe<ResolversTypes['RisksPayloadItem']>>>, ParentType, ContextType, Partial<QueryRisksArgs>>;
  submission?: Resolver<Maybe<ResolversTypes['Submission']>, ParentType, ContextType, Partial<QuerySubmissionArgs>>;
  submissions?: Resolver<Array<Maybe<ResolversTypes['Submission']>>, ParentType, ContextType, RequireFields<QuerySubmissionsArgs, 'limit'>>;
  subscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType, Partial<QuerySubscriptionArgs>>;
  subscriptions?: Resolver<Array<Maybe<ResolversTypes['Subscription']>>, ParentType, ContextType, RequireFields<QuerySubscriptionsArgs, 'limit'>>;
  taxa?: Resolver<Maybe<ResolversTypes['Taxa']>, ParentType, ContextType, Partial<QueryTaxaArgs>>;
  taxas?: Resolver<Array<Maybe<ResolversTypes['Taxa']>>, ParentType, ContextType, RequireFields<QueryTaxasArgs, 'limit'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUserArgs>>;
  users?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'limit'>>;
};

export type QuickAddResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuickAdd'] = ResolversParentTypes['QuickAdd']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  date_submitted?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  incident_id?: Resolver<Maybe<ResolversTypes['Long']>, ParentType, ContextType>;
  source_domain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QuickaddResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quickadd'] = ResolversParentTypes['Quickadd']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  date_submitted?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  incident_id?: Resolver<Maybe<ResolversTypes['Long']>, ParentType, ContextType>;
  source_domain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReportResolvers<ContextType = any, ParentType extends ResolversParentTypes['Report'] = ResolversParentTypes['Report']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  authors?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  cloudinary_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date_downloaded?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date_modified?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date_published?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date_submitted?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  editor_notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  embedding?: Resolver<Maybe<ResolversTypes['ReportEmbedding']>, ParentType, ContextType>;
  epoch_date_downloaded?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  epoch_date_modified?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  epoch_date_published?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  epoch_date_submitted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  flag?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  image_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputs_outputs?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  is_incident_report?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  plain_text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quiet?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  report_number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  source_domain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  submitters?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Maybe<ResolversTypes['ReportTranslation']>, ParentType, ContextType, Partial<ReportTranslationsArgs>>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReportEmbeddingResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReportEmbedding'] = ResolversParentTypes['ReportEmbedding']> = {
  from_text_hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vector?: Resolver<Maybe<Array<Maybe<ResolversTypes['Float']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReportTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReportTranslation'] = ResolversParentTypes['ReportTranslation']> = {
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RisksPayloadItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['RisksPayloadItem'] = ResolversParentTypes['RisksPayloadItem']> = {
  precedents?: Resolver<Maybe<Array<Maybe<ResolversTypes['RisksPayloadPrecedent']>>>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RisksPayloadPrecedentResolvers<ContextType = any, ParentType extends ResolversParentTypes['RisksPayloadPrecedent'] = ResolversParentTypes['RisksPayloadPrecedent']> = {
  AllegedDeployerOfAISystem?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  AllegedDeveloperOfAISystem?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  AllegedHarmedOrNearlyHarmedParties?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  editor_dissimilar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  editor_notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  editor_similar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  editors?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  embedding?: Resolver<Maybe<ResolversTypes['RisksPayloadPrecedentEmbedding']>, ParentType, ContextType>;
  epoch_date_modified?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  flagged_dissimilar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  incident_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  nlp_similar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['RisksPayloadPrecedentNlp_similar_incident']>>>, ParentType, ContextType>;
  reports?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tsne?: Resolver<Maybe<ResolversTypes['RisksPayloadPrecedentTsne']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RisksPayloadPrecedentEmbeddingResolvers<ContextType = any, ParentType extends ResolversParentTypes['RisksPayloadPrecedentEmbedding'] = ResolversParentTypes['RisksPayloadPrecedentEmbedding']> = {
  from_reports?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  vector?: Resolver<Maybe<Array<Maybe<ResolversTypes['Float']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RisksPayloadPrecedentNlp_Similar_IncidentResolvers<ContextType = any, ParentType extends ResolversParentTypes['RisksPayloadPrecedentNlp_similar_incident'] = ResolversParentTypes['RisksPayloadPrecedentNlp_similar_incident']> = {
  incident_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  similarity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RisksPayloadPrecedentTsneResolvers<ContextType = any, ParentType extends ResolversParentTypes['RisksPayloadPrecedentTsne'] = ResolversParentTypes['RisksPayloadPrecedentTsne']> = {
  x?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  y?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SortTypeResolvers = { ASC: 1, DESC: -1 };

export type SubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Submission'] = ResolversParentTypes['Submission']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  authors?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  cloudinary_id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date_downloaded?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date_modified?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date_published?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date_submitted?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deployers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Entity']>>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  developers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Entity']>>>, ParentType, ContextType>;
  editor_dissimilar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  editor_notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  editor_similar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  embedding?: Resolver<Maybe<ResolversTypes['SubmissionEmbedding']>, ParentType, ContextType>;
  epoch_date_modified?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  harmed_parties?: Resolver<Maybe<Array<Maybe<ResolversTypes['Entity']>>>, ParentType, ContextType>;
  image_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  incident_date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  incident_editors?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  incident_ids?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  incident_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nlp_similar_incidents?: Resolver<Maybe<Array<Maybe<ResolversTypes['SubmissionNlp_similar_incident']>>>, ParentType, ContextType>;
  plain_text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quiet?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  source_domain?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  submitters?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubmissionEmbeddingResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmissionEmbedding'] = ResolversParentTypes['SubmissionEmbedding']> = {
  from_text_hash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vector?: Resolver<Maybe<Array<Maybe<ResolversTypes['Float']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubmissionNlp_Similar_IncidentResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubmissionNlp_similar_incident'] = ResolversParentTypes['SubmissionNlp_similar_incident']> = {
  incident_id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  similarity?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  _id?: SubscriptionResolver<Maybe<ResolversTypes['ObjectId']>, "_id", ParentType, ContextType>;
  entityId?: SubscriptionResolver<Maybe<ResolversTypes['Entity']>, "entityId", ParentType, ContextType>;
  incident_id?: SubscriptionResolver<Maybe<ResolversTypes['Incident']>, "incident_id", ParentType, ContextType>;
  type?: SubscriptionResolver<ResolversTypes['String'], "type", ParentType, ContextType>;
  userId?: SubscriptionResolver<ResolversTypes['User'], "userId", ParentType, ContextType>;
};

export type TaxaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Taxa'] = ResolversParentTypes['Taxa']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  complete_entities?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dummy_fields?: Resolver<Maybe<Array<Maybe<ResolversTypes['TaxaDummy_field']>>>, ParentType, ContextType>;
  field_list?: Resolver<Maybe<Array<Maybe<ResolversTypes['TaxaField_list']>>>, ParentType, ContextType>;
  namespace?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxaDummy_FieldResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxaDummy_field'] = ResolversParentTypes['TaxaDummy_field']> = {
  field_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  short_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxaField_ListResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxaField_list'] = ResolversParentTypes['TaxaField_list']> = {
  complete_from?: Resolver<Maybe<ResolversTypes['TaxaField_listComplete_from']>, ParentType, ContextType>;
  default?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  display_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  field_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hide_search?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  instant_facet?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  item_fields?: Resolver<Maybe<ResolversTypes['TaxaField_listItem_field']>, ParentType, ContextType>;
  long_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  long_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mongo_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permitted_values?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  placeholder?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  public?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  short_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  short_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxaField_ListComplete_FromResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxaField_listComplete_from'] = ResolversParentTypes['TaxaField_listComplete_from']> = {
  all?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  current?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxaField_ListItem_FieldResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxaField_listItem_field'] = ResolversParentTypes['TaxaField_listItem_field']> = {
  complete_from?: Resolver<Maybe<ResolversTypes['TaxaField_listItem_fieldComplete_from']>, ParentType, ContextType>;
  default?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  display_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  field_number?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  instant_facet?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  long_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  long_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mongo_type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permitted_values?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  placeholder?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  public?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  short_description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  short_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxaField_ListItem_FieldComplete_FromResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxaField_listItem_fieldComplete_from'] = ResolversParentTypes['TaxaField_listItem_fieldComplete_from']> = {
  all?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  current?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  entities?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateManyPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateManyPayload'] = ResolversParentTypes['UpdateManyPayload']> = {
  matchedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  modifiedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id?: Resolver<Maybe<ResolversTypes['ObjectId']>, ParentType, ContextType>;
  adminData?: Resolver<Maybe<ResolversTypes['UserAdminDatum']>, ParentType, ContextType>;
  first_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  last_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roles?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserAdminDatumResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserAdminDatum'] = ResolversParentTypes['UserAdminDatum']> = {
  creationDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  disabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastAuthenticationDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AppUser?: AppUserResolvers<ContextType>;
  Candidate?: CandidateResolvers<ContextType>;
  CandidateClassification_similarity?: CandidateClassification_SimilarityResolvers<ContextType>;
  CandidateEmbedding?: CandidateEmbeddingResolvers<ContextType>;
  Checklist?: ChecklistResolvers<ContextType>;
  ChecklistRisk?: ChecklistRiskResolvers<ContextType>;
  ChecklistRiskPrecedent?: ChecklistRiskPrecedentResolvers<ContextType>;
  Classification?: ClassificationResolvers<ContextType>;
  ClassificationAttribute?: ClassificationAttributeResolvers<ContextType>;
  CreateVariantPayload?: CreateVariantPayloadResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DefaultAdminUser?: DefaultAdminUserResolvers<ContextType>;
  DeleteManyPayload?: DeleteManyPayloadResolvers<ContextType>;
  Duplicate?: DuplicateResolvers<ContextType>;
  Entity?: EntityResolvers<ContextType>;
  History_incident?: History_IncidentResolvers<ContextType>;
  History_incidentEmbedding?: History_IncidentEmbeddingResolvers<ContextType>;
  History_incidentNlp_similar_incident?: History_IncidentNlp_Similar_IncidentResolvers<ContextType>;
  History_incidentTsne?: History_IncidentTsneResolvers<ContextType>;
  History_report?: History_ReportResolvers<ContextType>;
  History_reportEmbedding?: History_ReportEmbeddingResolvers<ContextType>;
  Incident?: IncidentResolvers<ContextType>;
  IncidentEmbedding?: IncidentEmbeddingResolvers<ContextType>;
  IncidentNlp_similar_incident?: IncidentNlp_Similar_IncidentResolvers<ContextType>;
  IncidentTsne?: IncidentTsneResolvers<ContextType>;
  InsertManyPayload?: InsertManyPayloadResolvers<ContextType>;
  LogIncidentHistoryPayload?: LogIncidentHistoryPayloadResolvers<ContextType>;
  LogReportHistoryPayload?: LogReportHistoryPayloadResolvers<ContextType>;
  Long?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  ObjectId?: GraphQLScalarType;
  Opr?: OprResolvers;
  PromoteSubmissionToReportPayload?: PromoteSubmissionToReportPayloadResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  QuickAdd?: QuickAddResolvers<ContextType>;
  Quickadd?: QuickaddResolvers<ContextType>;
  Report?: ReportResolvers<ContextType>;
  ReportEmbedding?: ReportEmbeddingResolvers<ContextType>;
  ReportTranslation?: ReportTranslationResolvers<ContextType>;
  RisksPayloadItem?: RisksPayloadItemResolvers<ContextType>;
  RisksPayloadPrecedent?: RisksPayloadPrecedentResolvers<ContextType>;
  RisksPayloadPrecedentEmbedding?: RisksPayloadPrecedentEmbeddingResolvers<ContextType>;
  RisksPayloadPrecedentNlp_similar_incident?: RisksPayloadPrecedentNlp_Similar_IncidentResolvers<ContextType>;
  RisksPayloadPrecedentTsne?: RisksPayloadPrecedentTsneResolvers<ContextType>;
  SortType?: SortTypeResolvers;
  Submission?: SubmissionResolvers<ContextType>;
  SubmissionEmbedding?: SubmissionEmbeddingResolvers<ContextType>;
  SubmissionNlp_similar_incident?: SubmissionNlp_Similar_IncidentResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Taxa?: TaxaResolvers<ContextType>;
  TaxaDummy_field?: TaxaDummy_FieldResolvers<ContextType>;
  TaxaField_list?: TaxaField_ListResolvers<ContextType>;
  TaxaField_listComplete_from?: TaxaField_ListComplete_FromResolvers<ContextType>;
  TaxaField_listItem_field?: TaxaField_ListItem_FieldResolvers<ContextType>;
  TaxaField_listItem_fieldComplete_from?: TaxaField_ListItem_FieldComplete_FromResolvers<ContextType>;
  UpdateManyPayload?: UpdateManyPayloadResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserAdminDatum?: UserAdminDatumResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
};

import { ObjectId } from 'mongodb';