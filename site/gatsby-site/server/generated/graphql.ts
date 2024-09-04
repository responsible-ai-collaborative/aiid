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
  DateTime: { input: any; output: any; }
  Long: { input: any; output: any; }
  ObjectId: { input: any; output: any; }
};

export type AppUser = {
  __typename?: 'AppUser';
  email?: Maybe<Scalars['String']['output']>;
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
  attributes?: Maybe<Array<Maybe<Attribute>>>;
  incidents?: Maybe<Array<Maybe<Incident>>>;
  namespace: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  publish?: Maybe<Scalars['Boolean']['output']>;
  reports?: Maybe<Array<Maybe<Report>>>;
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

export enum ClassificationSortByInput {
  NamespaceAsc = 'NAMESPACE_ASC',
  NamespaceDesc = 'NAMESPACE_DESC',
  NotesAsc = 'NOTES_ASC',
  NotesDesc = 'NOTES_DESC',
  IdAsc = '_ID_ASC',
  IdDesc = '_ID_DESC'
}

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

export type CreateDefaultAdminUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
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
  reports?: Maybe<Array<Maybe<Report>>>;
  title: Scalars['String']['output'];
  tsne?: Maybe<IncidentTsne>;
};

export type IncidentAllegedDeployerOfAiSystemRelationInput = {
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IncidentAllegedDeveloperOfAiSystemRelationInput = {
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type IncidentAllegedHarmedOrNearlyHarmedPartiesRelationInput = {
  link?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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

export type IncidentEmbeddingInsertInput = {
  from_reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
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

export type IncidentEmbeddingUpdateInput = {
  from_reports?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  from_reports_unset?: InputMaybe<Scalars['Boolean']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type IncidentFilterType = {
  AND?: InputMaybe<Array<InputMaybe<IncidentFilterType>>>;
  AllegedDeployerOfAISystem?: InputMaybe<StringFilter>;
  AllegedDeveloperOfAISystem?: InputMaybe<StringFilter>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<StringFilter>;
  NOR?: InputMaybe<Array<InputMaybe<IncidentFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<IncidentFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  date?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  editor_dissimilar_incidents?: InputMaybe<IntFilter>;
  editor_notes?: InputMaybe<StringFilter>;
  editor_similar_incidents?: InputMaybe<IntFilter>;
  editors?: InputMaybe<StringFilter>;
  embedding?: InputMaybe<IncidentEmbeddingObjectFilterType>;
  epoch_date_modified?: InputMaybe<IntFilter>;
  flagged_dissimilar_incidents?: InputMaybe<IntFilter>;
  incident_id?: InputMaybe<IntFilter>;
  nlp_similar_incidents?: InputMaybe<IncidentNlp_Similar_IncidentObjectFilterType>;
  reports?: InputMaybe<IntFilter>;
  title?: InputMaybe<StringFilter>;
  tsne?: InputMaybe<IncidentTsneObjectFilterType>;
};

export type IncidentInsertType = {
  AllegedDeployerOfAISystem?: InputMaybe<IncidentAllegeddeployerofaisystemRelationInput>;
  AllegedDeveloperOfAISystem?: InputMaybe<IncidentAllegeddeveloperofaisystemRelationInput>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<IncidentAllegedharmedornearlyharmedpartiesRelationInput>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  date: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editors?: InputMaybe<IncidentEditorsRelationInput>;
  embedding?: InputMaybe<IncidentEmbeddingInsertType>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  flagged_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
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

export type IncidentNlp_Similar_IncidentInsertInput = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
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

export type IncidentNlp_Similar_IncidentSetListObjectType = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
};

export type IncidentNlp_Similar_IncidentUpdateInput = {
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  incident_id_inc?: InputMaybe<Scalars['Int']['input']>;
  incident_id_unset?: InputMaybe<Scalars['Boolean']['input']>;
  similarity?: InputMaybe<Scalars['Float']['input']>;
  similarity_inc?: InputMaybe<Scalars['Float']['input']>;
  similarity_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type IncidentReportsRelationInput = {
  link: Array<InputMaybe<Scalars['Int']['input']>>;
};

export type IncidentSetType = {
  AllegedDeployerOfAISystem?: InputMaybe<IncidentAllegeddeployerofaisystemRelationInput>;
  AllegedDeveloperOfAISystem?: InputMaybe<IncidentAllegeddeveloperofaisystemRelationInput>;
  AllegedHarmedOrNearlyHarmedParties?: InputMaybe<IncidentAllegedharmedornearlyharmedpartiesRelationInput>;
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  editor_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editor_notes?: InputMaybe<Scalars['String']['input']>;
  editor_similar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  editors?: InputMaybe<IncidentEditorsRelationInput>;
  embedding?: InputMaybe<IncidentEmbeddingSetObjectType>;
  epoch_date_modified?: InputMaybe<Scalars['Int']['input']>;
  flagged_dissimilar_incidents?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  incident_id?: InputMaybe<Scalars['Int']['input']>;
  nlp_similar_incidents?: InputMaybe<Array<InputMaybe<IncidentNlp_Similar_IncidentSetListObjectType>>>;
  reports?: InputMaybe<IncidentReportsRelationInput>;
  title?: InputMaybe<Scalars['String']['input']>;
  tsne?: InputMaybe<IncidentTsneSetObjectType>;
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

export type IncidentSortType = {
  _id?: InputMaybe<SortType>;
  date?: InputMaybe<SortType>;
  description?: InputMaybe<SortType>;
  editor_notes?: InputMaybe<SortType>;
  embedding?: InputMaybe<IncidentEmbeddingSortType>;
  epoch_date_modified?: InputMaybe<SortType>;
  incident_id?: InputMaybe<SortType>;
  title?: InputMaybe<SortType>;
  tsne?: InputMaybe<IncidentTsneSortType>;
};

export type IncidentTsne = {
  __typename?: 'IncidentTsne';
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
};

export type IncidentTsneInsertInput = {
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
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

export type IncidentTsneUpdateInput = {
  x?: InputMaybe<Scalars['Float']['input']>;
  x_inc?: InputMaybe<Scalars['Float']['input']>;
  x_unset?: InputMaybe<Scalars['Boolean']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  y_inc?: InputMaybe<Scalars['Float']['input']>;
  y_unset?: InputMaybe<Scalars['Boolean']['input']>;
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
  createDefaultAdminUser?: Maybe<DefaultAdminUser>;
  createVariant?: Maybe<CreateVariantPayload>;
  deleteManyCandidates?: Maybe<DeleteManyPayload>;
  deleteManyChecklists?: Maybe<DeleteManyPayload>;
  deleteManyDuplicates?: Maybe<DeleteManyPayload>;
  deleteManyHistory_incidents?: Maybe<DeleteManyPayload>;
  deleteManyHistory_reports?: Maybe<DeleteManyPayload>;
  deleteManyNotifications?: Maybe<DeleteManyPayload>;
  deleteManyQuickadds?: Maybe<DeleteManyPayload>;
  deleteManySubscriptions?: Maybe<DeleteManyPayload>;
  deleteOneCandidate?: Maybe<Candidate>;
  deleteOneChecklist?: Maybe<Checklist>;
  deleteOneDuplicate?: Maybe<Duplicate>;
  deleteOneHistory_incident?: Maybe<History_Incident>;
  deleteOneHistory_report?: Maybe<History_Report>;
  deleteOneNotification?: Maybe<Notification>;
  deleteOneQuickadd?: Maybe<Quickadd>;
  deleteOneReport?: Maybe<Report>;
  deleteOneSubmission?: Maybe<Submission>;
  deleteOneSubscription?: Maybe<Subscription>;
  flagIncidentSimilarity?: Maybe<Incident>;
  flagReport?: Maybe<Report>;
  getUser?: Maybe<AppUser>;
  insertManyCandidates?: Maybe<InsertManyPayload>;
  insertManyChecklists?: Maybe<InsertManyPayload>;
  insertManyDuplicates?: Maybe<InsertManyPayload>;
  insertManyHistory_incidents?: Maybe<InsertManyPayload>;
  insertManyHistory_reports?: Maybe<InsertManyPayload>;
  insertManyNotifications?: Maybe<InsertManyPayload>;
  insertManyQuickadds?: Maybe<InsertManyPayload>;
  insertManySubscriptions?: Maybe<InsertManyPayload>;
  insertOneCandidate?: Maybe<Candidate>;
  insertOneChecklist?: Maybe<Checklist>;
  insertOneDuplicate?: Maybe<Duplicate>;
  insertOneHistory_incident?: Maybe<History_Incident>;
  insertOneHistory_report?: Maybe<History_Report>;
  insertOneIncident?: Maybe<Incident>;
  insertOneNotification?: Maybe<Notification>;
  insertOneQuickadd?: Maybe<Quickadd>;
  insertOneReport?: Maybe<Report>;
  insertOneSubmission?: Maybe<Submission>;
  insertOneSubscription?: Maybe<Subscription>;
  linkReportsToIncidents?: Maybe<Array<Maybe<Incident>>>;
  logIncidentHistory?: Maybe<LogIncidentHistoryPayload>;
  logReportHistory?: Maybe<LogReportHistoryPayload>;
  processNotifications?: Maybe<Scalars['Int']['output']>;
  promoteSubmissionToReport: PromoteSubmissionToReportPayload;
  replaceOneCandidate?: Maybe<Candidate>;
  replaceOneChecklist?: Maybe<Checklist>;
  replaceOneDuplicate?: Maybe<Duplicate>;
  replaceOneEntity?: Maybe<Entity>;
  replaceOneHistory_incident?: Maybe<History_Incident>;
  replaceOneHistory_report?: Maybe<History_Report>;
  replaceOneIncident?: Maybe<Incident>;
  replaceOneNotification?: Maybe<Notification>;
  replaceOneSubscription?: Maybe<Subscription>;
  replaceOneUser?: Maybe<User>;
  updateManyCandidates?: Maybe<UpdateManyPayload>;
  updateManyChecklists?: Maybe<UpdateManyPayload>;
  updateManyDuplicates?: Maybe<UpdateManyPayload>;
  updateManyHistory_incidents?: Maybe<UpdateManyPayload>;
  updateManyHistory_reports?: Maybe<UpdateManyPayload>;
  updateManyIncidents?: Maybe<UpdateManyPayload>;
  updateManyNotifications?: Maybe<UpdateManyPayload>;
  updateManyQuickadds?: Maybe<UpdateManyPayload>;
  updateManySubscriptions?: Maybe<UpdateManyPayload>;
  updateOneCandidate?: Maybe<Candidate>;
  updateOneChecklist?: Maybe<Checklist>;
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
  updateOneUser?: Maybe<User>;
  upsertOneCandidate?: Maybe<Candidate>;
  upsertOneChecklist?: Maybe<Checklist>;
  upsertOneClassification?: Maybe<Classification>;
  upsertOneDuplicate?: Maybe<Duplicate>;
  upsertOneEntity?: Maybe<Entity>;
  upsertOneHistory_incident?: Maybe<History_Incident>;
  upsertOneHistory_report?: Maybe<History_Report>;
  upsertOneNotification?: Maybe<Notification>;
  upsertOneQuickadd?: Maybe<Quickadd>;
  upsertOneSubscription?: Maybe<Subscription>;
};


export type MutationCreateDefaultAdminUserArgs = {
  input?: InputMaybe<CreateDefaultAdminUserInput>;
};


export type MutationCreateVariantArgs = {
  input: CreateVariantInput;
};


export type MutationDeleteManyCandidatesArgs = {
  query?: InputMaybe<CandidateQueryInput>;
};


export type MutationDeleteManyChecklistsArgs = {
  query?: InputMaybe<ChecklistQueryInput>;
};


export type MutationDeleteManyDuplicatesArgs = {
  query?: InputMaybe<DuplicateQueryInput>;
};


export type MutationDeleteManyHistory_IncidentsArgs = {
  query?: InputMaybe<History_IncidentQueryInput>;
};


export type MutationDeleteManyHistory_ReportsArgs = {
  query?: InputMaybe<History_ReportQueryInput>;
};


export type MutationDeleteManyNotificationsArgs = {
  query?: InputMaybe<NotificationQueryInput>;
};


export type MutationDeleteManyQuickaddsArgs = {
  filter?: InputMaybe<QuickaddFilterType>;
  pagination?: InputMaybe<PaginationType>;
  sort?: InputMaybe<QuickaddSortType>;
};


export type MutationDeleteManySubscriptionsArgs = {
  query?: InputMaybe<SubscriptionQueryInput>;
};


export type MutationDeleteOneCandidateArgs = {
  query: CandidateQueryInput;
};


export type MutationDeleteOneChecklistArgs = {
  query: ChecklistQueryInput;
};


export type MutationDeleteOneDuplicateArgs = {
  query: DuplicateQueryInput;
};


export type MutationDeleteOneHistory_IncidentArgs = {
  query: History_IncidentQueryInput;
};


export type MutationDeleteOneHistory_ReportArgs = {
  query: History_ReportQueryInput;
};


export type MutationDeleteOneNotificationArgs = {
  query: NotificationQueryInput;
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
  query: SubscriptionQueryInput;
};


export type MutationFlagIncidentSimilarityArgs = {
  dissimilarIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  incidentId: Scalars['Int']['input'];
};


export type MutationFlagReportArgs = {
  input: Scalars['Boolean']['input'];
  report_number: Scalars['Int']['input'];
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


export type MutationInsertManyDuplicatesArgs = {
  data: Array<DuplicateInsertInput>;
};


export type MutationInsertManyHistory_IncidentsArgs = {
  data: Array<History_IncidentInsertInput>;
};


export type MutationInsertManyHistory_ReportsArgs = {
  data: Array<History_ReportInsertInput>;
};


export type MutationInsertManyNotificationsArgs = {
  data: Array<NotificationInsertInput>;
};


export type MutationInsertManyQuickaddsArgs = {
  data: Array<InputMaybe<QuickaddInsertType>>;
};


export type MutationInsertManySubscriptionsArgs = {
  data: Array<SubscriptionInsertInput>;
};


export type MutationInsertOneCandidateArgs = {
  data: CandidateInsertInput;
};


export type MutationInsertOneChecklistArgs = {
  data: ChecklistInsertInput;
};


export type MutationInsertOneDuplicateArgs = {
  data: DuplicateInsertInput;
};


export type MutationInsertOneHistory_IncidentArgs = {
  data: History_IncidentInsertInput;
};


export type MutationInsertOneHistory_ReportArgs = {
  data: History_ReportInsertInput;
};


export type MutationInsertOneIncidentArgs = {
  data: IncidentInsertType;
};


export type MutationInsertOneNotificationArgs = {
  data: NotificationInsertInput;
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


export type MutationInsertOneSubscriptionArgs = {
  data: SubscriptionInsertInput;
};


export type MutationLinkReportsToIncidentsArgs = {
  input: LinkReportsToIncidentsInput;
};


export type MutationLogIncidentHistoryArgs = {
  input?: InputMaybe<History_IncidentInsertInput>;
};


export type MutationLogReportHistoryArgs = {
  input?: InputMaybe<History_ReportInsertInput>;
};


export type MutationPromoteSubmissionToReportArgs = {
  input: PromoteSubmissionToReportInput;
};


export type MutationReplaceOneCandidateArgs = {
  data: CandidateInsertInput;
  query?: InputMaybe<CandidateQueryInput>;
};


export type MutationReplaceOneChecklistArgs = {
  data: ChecklistInsertInput;
  query?: InputMaybe<ChecklistQueryInput>;
};


export type MutationReplaceOneDuplicateArgs = {
  data: DuplicateInsertInput;
  query?: InputMaybe<DuplicateQueryInput>;
};


export type MutationReplaceOneHistory_IncidentArgs = {
  data: History_IncidentInsertInput;
  query?: InputMaybe<History_IncidentQueryInput>;
};


export type MutationReplaceOneHistory_ReportArgs = {
  data: History_ReportInsertInput;
  query?: InputMaybe<History_ReportQueryInput>;
};


export type MutationReplaceOneNotificationArgs = {
  data: NotificationInsertInput;
  query?: InputMaybe<NotificationQueryInput>;
};


export type MutationReplaceOneSubscriptionArgs = {
  data: SubscriptionInsertInput;
  query?: InputMaybe<SubscriptionQueryInput>;
};


export type MutationUpdateManyCandidatesArgs = {
  query?: InputMaybe<CandidateQueryInput>;
  set: CandidateUpdateInput;
};


export type MutationUpdateManyChecklistsArgs = {
  query?: InputMaybe<ChecklistQueryInput>;
  set: ChecklistUpdateInput;
};


export type MutationUpdateManyDuplicatesArgs = {
  query?: InputMaybe<DuplicateQueryInput>;
  set: DuplicateUpdateInput;
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
  filter: IncidentFilterType;
  update: IncidentUpdateType;
};


export type MutationUpdateManyNotificationsArgs = {
  query?: InputMaybe<NotificationQueryInput>;
  set: NotificationUpdateInput;
};


export type MutationUpdateManyQuickaddsArgs = {
  filter: QuickaddFilterType;
  update: QuickaddUpdateType;
};


export type MutationUpdateManySubscriptionsArgs = {
  query?: InputMaybe<SubscriptionQueryInput>;
  set: SubscriptionUpdateInput;
};


export type MutationUpdateOneCandidateArgs = {
  query?: InputMaybe<CandidateQueryInput>;
  set: CandidateUpdateInput;
};


export type MutationUpdateOneChecklistArgs = {
  query?: InputMaybe<ChecklistQueryInput>;
  set: ChecklistUpdateInput;
};


export type MutationUpdateOneDuplicateArgs = {
  query?: InputMaybe<DuplicateQueryInput>;
  set: DuplicateUpdateInput;
};


export type MutationUpdateOneEntityArgs = {
  filter: EntityFilterType;
  update: EntityUpdateType;
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
  filter: IncidentFilterType;
  update: IncidentUpdateType;
};


export type MutationUpdateOneNotificationArgs = {
  query?: InputMaybe<NotificationQueryInput>;
  set: NotificationUpdateInput;
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
  query?: InputMaybe<SubscriptionQueryInput>;
  set: SubscriptionUpdateInput;
};


export type MutationUpdateOneUserArgs = {
  filter: UserFilterType;
  update: UserUpdateType;
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
  filter: ClassificationFilterType;
  update: ClassificationInsertType;
};


export type MutationUpsertOneDuplicateArgs = {
  data: DuplicateInsertInput;
  query?: InputMaybe<DuplicateQueryInput>;
};


export type MutationUpsertOneEntityArgs = {
  filter: EntityFilterType;
  update: EntityInsertType;
};


export type MutationUpsertOneHistory_IncidentArgs = {
  data: History_IncidentInsertInput;
  query?: InputMaybe<History_IncidentQueryInput>;
};


export type MutationUpsertOneHistory_ReportArgs = {
  data: History_ReportInsertInput;
  query?: InputMaybe<History_ReportQueryInput>;
};


export type MutationUpsertOneNotificationArgs = {
  data: NotificationInsertInput;
  query?: InputMaybe<NotificationQueryInput>;
};


export type MutationUpsertOneQuickaddArgs = {
  filter: QuickaddFilterType;
  update: QuickaddInsertType;
};


export type MutationUpsertOneSubscriptionArgs = {
  data: SubscriptionInsertInput;
  query?: InputMaybe<SubscriptionQueryInput>;
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
  candidates: Array<Maybe<Candidate>>;
  checklist?: Maybe<Checklist>;
  checklists: Array<Maybe<Checklist>>;
  classification?: Maybe<Classification>;
  classifications?: Maybe<Array<Maybe<Classification>>>;
  duplicate?: Maybe<Duplicate>;
  duplicates: Array<Maybe<Duplicate>>;
  entities?: Maybe<Array<Maybe<Entity>>>;
  entity?: Maybe<Entity>;
  history_incident?: Maybe<History_Incident>;
  history_incidents: Array<Maybe<History_Incident>>;
  history_report?: Maybe<History_Report>;
  history_reports: Array<Maybe<History_Report>>;
  incident?: Maybe<Incident>;
  incidents?: Maybe<Array<Maybe<Incident>>>;
  notification?: Maybe<Notification>;
  notifications: Array<Maybe<Notification>>;
  quickadd?: Maybe<Quickadd>;
  quickadds?: Maybe<Array<Maybe<Quickadd>>>;
  report?: Maybe<Report>;
  reports?: Maybe<Array<Maybe<Report>>>;
  risks?: Maybe<Array<Maybe<RisksPayloadItem>>>;
  submission?: Maybe<Submission>;
  submissions?: Maybe<Array<Maybe<Submission>>>;
  subscription?: Maybe<Subscription>;
  subscriptions: Array<Maybe<Subscription>>;
  taxa?: Maybe<Taxa>;
  taxas?: Maybe<Array<Maybe<Taxa>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
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
  query?: InputMaybe<DuplicateQueryInput>;
};


export type QueryDuplicatesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<DuplicateQueryInput>;
  sortBy?: InputMaybe<DuplicateSortByInput>;
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
  query?: InputMaybe<NotificationQueryInput>;
};


export type QueryNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<NotificationQueryInput>;
  sortBy?: InputMaybe<NotificationSortByInput>;
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
  query?: InputMaybe<SubscriptionQueryInput>;
};


export type QuerySubscriptionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<SubscriptionQueryInput>;
  sortBy?: InputMaybe<SubscriptionSortByInput>;
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
  translations?: Maybe<ReportTranslations>;
  url: Scalars['String']['output'];
  user?: Maybe<User>;
};


export type ReportTranslationsArgs = {
  input: Scalars['String']['input'];
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

export type ReportEmbeddingInsertType = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type ReportEmbeddingObjectFilterType = {
  from_text_hash?: InputMaybe<StringFilter>;
  opr?: InputMaybe<OprExists>;
  vector?: InputMaybe<FloatFilter>;
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

export type ReportEmbeddingSetObjectType = {
  /** If set to true, the object would be overwriten entirely, including fields that are not specified. Non-null validation rules will apply. Once set to true, any child object will overwriten invariably of the value set to this field. */
  _OVERWRITE?: InputMaybe<Scalars['Boolean']['input']>;
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type ReportEmbeddingSortType = {
  from_text_hash?: InputMaybe<SortType>;
};

export type ReportEmbeddingUpdateInput = {
  from_text_hash?: InputMaybe<Scalars['String']['input']>;
  from_text_hash_unset?: InputMaybe<Scalars['Boolean']['input']>;
  vector?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vector_unset?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ReportFilterType = {
  AND?: InputMaybe<Array<InputMaybe<ReportFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<ReportFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<ReportFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  authors?: InputMaybe<StringFilter>;
  cloudinary_id?: InputMaybe<StringFilter>;
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

export type ReportSortType = {
  _id?: InputMaybe<SortType>;
  cloudinary_id?: InputMaybe<SortType>;
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
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ReportUpdateType = {
  set?: InputMaybe<ReportSetType>;
};

export type ReportUserRelationInput = {
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
  userId: User;
};

export type SubscriptionEntityIdRelationInput = {
  link?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionIncident_IdRelationInput = {
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
  entityId_exists?: InputMaybe<Scalars['Boolean']['input']>;
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
  link?: InputMaybe<Scalars['String']['input']>;
};

export type Taxa = {
  __typename?: 'Taxa';
  _id?: Maybe<Scalars['ObjectId']['output']>;
  complete_entities?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dummy_fields?: Maybe<Array<Maybe<DummyFields>>>;
  field_list?: Maybe<Array<Maybe<FieldList>>>;
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

export type TaxaFilterType = {
  AND?: InputMaybe<Array<InputMaybe<TaxaFilterType>>>;
  NOR?: InputMaybe<Array<InputMaybe<TaxaFilterType>>>;
  OR?: InputMaybe<Array<InputMaybe<TaxaFilterType>>>;
  _id?: InputMaybe<ObjectIdFilter>;
  complete_entities?: InputMaybe<BooleanFilter>;
  description?: InputMaybe<StringFilter>;
  dummy_fields?: InputMaybe<DummyFieldsObjectFilterType>;
  field_list?: InputMaybe<FieldListObjectFilterType>;
  namespace?: InputMaybe<StringFilter>;
  weight?: InputMaybe<IntFilter>;
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

export type TaxaSortType = {
  _id?: InputMaybe<SortType>;
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

export type UserSortType = {
  _id?: InputMaybe<SortType>;
  first_name?: InputMaybe<SortType>;
  last_name?: InputMaybe<SortType>;
  userId?: InputMaybe<SortType>;
};

export type UserUpdateType = {
  set?: InputMaybe<UserSetType>;
};

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
  duplicate: DuplicateInsertInput;
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
  filter: EntityFilterType;
  update: EntityUpdateType;
}>;


export type UpdateEntityMutation = { __typename?: 'Mutation', updateOneEntity?: { __typename?: 'Entity', entity_id: string } | null };

export type FindIncidentQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
}>;


export type FindIncidentQuery = { __typename?: 'Query', incident?: { __typename?: 'Incident', incident_id: number, title: string, description?: string | null, date: string, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, flagged_dissimilar_incidents?: Array<number | null> | null, editor_notes?: string | null, editors: Array<{ __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null>, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', incident_id?: number | null, similarity?: number | null } | null> | null, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null, embedding?: { __typename?: 'IncidentEmbedding', from_reports?: Array<number | null> | null, vector?: Array<number | null> | null } | null } | null };

export type FindIncidentsTableQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
}>;


export type FindIncidentsTableQuery = { __typename?: 'Query', incidents?: Array<{ __typename?: 'Incident', incident_id: number, title: string, description?: string | null, date: string, editors: Array<{ __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null>, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null } | null> | null };

export type FindIncidentEntitiesQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
}>;


export type FindIncidentEntitiesQuery = { __typename?: 'Query', incident?: { __typename?: 'Incident', incident_id: number, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null } | null };

export type FindIncidentsQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
}>;


export type FindIncidentsQuery = { __typename?: 'Query', incidents?: Array<{ __typename?: 'Incident', incident_id: number, title: string, description?: string | null, date: string, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, flagged_dissimilar_incidents?: Array<number | null> | null, editors: Array<{ __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null>, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', incident_id?: number | null, similarity?: number | null } | null> | null, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null, embedding?: { __typename?: 'IncidentEmbedding', from_reports?: Array<number | null> | null, vector?: Array<number | null> | null } | null } | null> | null };

export type FindIncidentsTitlesQueryVariables = Exact<{
  filter?: InputMaybe<IncidentFilterType>;
}>;


export type FindIncidentsTitlesQuery = { __typename?: 'Query', incidents?: Array<{ __typename?: 'Incident', incident_id: number, title: string } | null> | null };

export type UpdateIncidentMutationVariables = Exact<{
  filter: IncidentFilterType;
  update: IncidentUpdateType;
}>;


export type UpdateIncidentMutation = { __typename?: 'Mutation', updateOneIncident?: { __typename?: 'Incident', incident_id: number, title: string, description?: string | null, date: string, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, flagged_dissimilar_incidents?: Array<number | null> | null, editor_notes?: string | null, editors: Array<{ __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null>, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', incident_id?: number | null, similarity?: number | null } | null> | null, reports?: Array<{ __typename?: 'Report', report_number: number } | null> | null, embedding?: { __typename?: 'IncidentEmbedding', from_reports?: Array<number | null> | null, vector?: Array<number | null> | null } | null } | null };

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
}>;


export type FindIncidentFullQuery = { __typename?: 'Query', incident?: { __typename?: 'Incident', incident_id: number, title: string, description?: string | null, date: string, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, flagged_dissimilar_incidents?: Array<number | null> | null, editor_notes?: string | null, epoch_date_modified?: number | null, editors: Array<{ __typename?: 'User', userId: string, first_name?: string | null, last_name?: string | null } | null>, AllegedDeployerOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedDeveloperOfAISystem?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', incident_id?: number | null, similarity?: number | null } | null> | null, reports?: Array<{ __typename?: 'Report', submitters: Array<string | null>, date_published: any, report_number: number, title: string, description?: string | null, url: string, image_url: string, cloudinary_id: string, source_domain: string, text: string, authors: Array<string | null>, epoch_date_submitted: number, language: string, tags: Array<string | null>, inputs_outputs?: Array<string | null> | null } | null> | null, embedding?: { __typename?: 'IncidentEmbedding', from_reports?: Array<number | null> | null, vector?: Array<number | null> | null } | null, tsne?: { __typename?: 'IncidentTsne', x?: number | null, y?: number | null } | null } | null };

export type LogIncidentHistoryMutationVariables = Exact<{
  input: History_IncidentInsertInput;
}>;


export type LogIncidentHistoryMutation = { __typename?: 'Mutation', logIncidentHistory?: { __typename?: 'LogIncidentHistoryPayload', incident_id?: number | null } | null };

export type FindIncidentHistoryQueryVariables = Exact<{
  query?: InputMaybe<History_IncidentQueryInput>;
}>;


export type FindIncidentHistoryQuery = { __typename?: 'Query', history_incidents: Array<{ __typename?: 'History_incident', incident_id: number, AllegedDeployerOfAISystem?: Array<string | null> | null, AllegedDeveloperOfAISystem?: Array<string | null> | null, AllegedHarmedOrNearlyHarmedParties?: Array<string | null> | null, _id?: any | null, date: string, description?: string | null, modifiedBy?: string | null, editor_dissimilar_incidents?: Array<number | null> | null, editor_notes?: string | null, editor_similar_incidents?: Array<number | null> | null, editors: Array<string | null>, epoch_date_modified?: number | null, flagged_dissimilar_incidents?: Array<number | null> | null, reports: Array<number | null>, title: string, embedding?: { __typename?: 'History_incidentEmbedding', from_reports?: Array<number | null> | null, vector?: Array<number | null> | null } | null, nlp_similar_incidents?: Array<{ __typename?: 'History_incidentNlp_similar_incident', incident_id?: number | null, similarity?: number | null } | null> | null, tsne?: { __typename?: 'History_incidentTsne', x?: number | null, y?: number | null } | null } | null> };

export type FlagIncidentSimilarityMutationVariables = Exact<{
  incidentId: Scalars['Int']['input'];
  dissimilarIds?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
}>;


export type FlagIncidentSimilarityMutation = { __typename?: 'Mutation', flagIncidentSimilarity?: { __typename?: 'Incident', incident_id: number, flagged_dissimilar_incidents?: Array<number | null> | null, editors: Array<{ __typename?: 'User', userId: string } | null> } | null };

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
}>;


export type FindReportWithTranslationsQuery = { __typename?: 'Query', report?: { __typename?: 'Report', url: string, title: string, authors: Array<string | null>, submitters: Array<string | null>, date_published: any, date_downloaded: any, date_modified: any, image_url: string, text: string, plain_text: string, tags: Array<string | null>, flag?: boolean | null, report_number: number, editor_notes?: string | null, language: string, is_incident_report?: boolean | null, inputs_outputs?: Array<string | null> | null, quiet?: boolean | null, translations_es?: { __typename?: 'ReportTranslations', title?: string | null, text?: string | null } | null, translations_en?: { __typename?: 'ReportTranslations', title?: string | null, text?: string | null } | null, translations_fr?: { __typename?: 'ReportTranslations', title?: string | null, text?: string | null } | null, translations_ja?: { __typename?: 'ReportTranslations', title?: string | null, text?: string | null } | null } | null };

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

export type LogReportHistoryMutationVariables = Exact<{
  input: History_ReportInsertInput;
}>;


export type LogReportHistoryMutation = { __typename?: 'Mutation', logReportHistory?: { __typename?: 'LogReportHistoryPayload', report_number?: number | null } | null };

export type FindReportHistoryQueryVariables = Exact<{
  query?: InputMaybe<History_ReportQueryInput>;
}>;


export type FindReportHistoryQuery = { __typename?: 'Query', history_reports: Array<{ __typename?: 'History_report', _id?: any | null, authors: Array<string | null>, cloudinary_id: string, date_downloaded: any, date_modified: any, date_published: any, date_submitted: any, description?: string | null, editor_notes?: string | null, epoch_date_downloaded: number, epoch_date_modified: number, epoch_date_published: number, epoch_date_submitted: number, flag?: boolean | null, image_url: string, inputs_outputs?: Array<string | null> | null, is_incident_report?: boolean | null, language: string, modifiedBy?: string | null, plain_text: string, report_number: number, submitters: Array<string | null>, tags: Array<string | null>, text: string, title: string, url: string, source_domain: string, user?: string | null, quiet?: boolean | null, embedding?: { __typename?: 'History_reportEmbedding', from_text_hash?: string | null, vector?: Array<number | null> | null } | null } | null> };

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


export type FindSubmissionsQuery = { __typename?: 'Query', submissions?: Array<{ __typename?: 'Submission', _id?: any | null, cloudinary_id?: string | null, date_downloaded: string, date_modified: string, date_published: string, date_submitted: string, description?: string | null, image_url: string, incident_date?: string | null, incident_ids?: Array<number | null> | null, incident_title?: string | null, language: string, source_domain: string, text: string, title: string, authors: Array<string | null>, submitters: Array<string | null>, url: string, editor_notes?: string | null, tags: Array<string | null>, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, plain_text?: string | null, status?: string | null, quiet?: boolean | null, incident_editors?: Array<{ __typename?: 'User', first_name?: string | null, last_name?: string | null, userId: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', similarity?: number | null, incident_id?: number | null } | null> | null, developers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, deployers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, harmed_parties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, user?: { __typename?: 'User', userId: string } | null } | null> | null };

export type FindSubmissionQueryVariables = Exact<{
  filter: SubmissionFilterType;
}>;


export type FindSubmissionQuery = { __typename?: 'Query', submission?: { __typename?: 'Submission', _id?: any | null, cloudinary_id?: string | null, date_downloaded: string, date_modified: string, date_published: string, date_submitted: string, description?: string | null, image_url: string, incident_date?: string | null, incident_ids?: Array<number | null> | null, incident_title?: string | null, language: string, source_domain: string, text: string, title: string, authors: Array<string | null>, submitters: Array<string | null>, url: string, editor_notes?: string | null, tags: Array<string | null>, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, status?: string | null, quiet?: boolean | null, incident_editors?: Array<{ __typename?: 'User', first_name?: string | null, last_name?: string | null, userId: string } | null> | null, developers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, deployers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, harmed_parties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', similarity?: number | null, incident_id?: number | null } | null> | null } | null };

export type UpdateSubmissionMutationVariables = Exact<{
  filter: SubmissionFilterType;
  update: SubmissionUpdateType;
}>;


export type UpdateSubmissionMutation = { __typename?: 'Mutation', updateOneSubmission?: { __typename?: 'Submission', _id?: any | null, cloudinary_id?: string | null, date_downloaded: string, date_modified: string, date_published: string, date_submitted: string, description?: string | null, image_url: string, incident_date?: string | null, incident_ids?: Array<number | null> | null, incident_title?: string | null, language: string, source_domain: string, text: string, title: string, authors: Array<string | null>, submitters: Array<string | null>, url: string, editor_notes?: string | null, tags: Array<string | null>, editor_similar_incidents?: Array<number | null> | null, editor_dissimilar_incidents?: Array<number | null> | null, incident_editors?: Array<{ __typename?: 'User', first_name?: string | null, last_name?: string | null, userId: string } | null> | null, developers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, deployers?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, harmed_parties?: Array<{ __typename?: 'Entity', entity_id: string, name: string } | null> | null, nlp_similar_incidents?: Array<{ __typename?: 'IncidentNlp_similar_incident', similarity?: number | null, incident_id?: number | null } | null> | null } | null };

export type InsertSubmissionMutationVariables = Exact<{
  data: SubmissionInsertType;
}>;


export type InsertSubmissionMutation = { __typename?: 'Mutation', insertOneSubmission?: { __typename?: 'Submission', _id?: any | null } | null };

export type PromoteSubmissionMutationVariables = Exact<{
  input: PromoteSubmissionToReportInput;
}>;


export type PromoteSubmissionMutation = { __typename?: 'Mutation', promoteSubmissionToReport: { __typename?: 'PromoteSubmissionToReportPayload', incident_ids?: Array<number | null> | null, report_number?: number | null } };

export type UpsertSubscriptionMutationVariables = Exact<{
  query?: InputMaybe<SubscriptionQueryInput>;
  subscription: SubscriptionInsertInput;
}>;


export type UpsertSubscriptionMutation = { __typename?: 'Mutation', upsertOneSubscription?: { __typename?: 'Subscription', _id?: any | null } | null };

export type UpdateSubscriptionMutationVariables = Exact<{
  query?: InputMaybe<SubscriptionQueryInput>;
  set: SubscriptionUpdateInput;
}>;


export type UpdateSubscriptionMutation = { __typename?: 'Mutation', updateOneSubscription?: { __typename?: 'Subscription', _id?: any | null } | null };

export type FindSubscriptionsQueryVariables = Exact<{
  query: SubscriptionQueryInput;
}>;


export type FindSubscriptionsQuery = { __typename?: 'Query', subscriptions: Array<{ __typename?: 'Subscription', userId: { __typename?: 'User', userId: string } } | null> };

export type FindSubscriptionsFullQueryVariables = Exact<{
  query: SubscriptionQueryInput;
}>;


export type FindSubscriptionsFullQuery = { __typename?: 'Query', subscriptions: Array<{ __typename?: 'Subscription', _id?: any | null, type: string, incident_id?: { __typename?: 'Incident', incident_id: number, title: string } | null, entityId?: { __typename?: 'Entity', entity_id: string, name: string } | null, userId: { __typename?: 'User', userId: string } } | null> };

export type DeleteSubscriptionsMutationVariables = Exact<{
  query?: InputMaybe<SubscriptionQueryInput>;
}>;


export type DeleteSubscriptionsMutation = { __typename?: 'Mutation', deleteManySubscriptions?: { __typename?: 'DeleteManyPayload', deletedCount: number } | null };

export type FindUserSubscriptionsQueryVariables = Exact<{
  query: SubscriptionQueryInput;
}>;


export type FindUserSubscriptionsQuery = { __typename?: 'Query', subscriptions: Array<{ __typename?: 'Subscription', _id?: any | null, type: string, incident_id?: { __typename?: 'Incident', incident_id: number, title: string } | null, entityId?: { __typename?: 'Entity', entity_id: string, name: string } | null } | null> };

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


export const FindClassificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindClassifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ClassificationFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"namespace"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"short_name"}},{"kind":"Field","name":{"kind":"Name","value":"value_json"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish"}}]}}]}}]} as unknown as DocumentNode<FindClassificationsQuery, FindClassificationsQueryVariables>;
export const UpsertClassificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertClassification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ClassificationFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ClassificationInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertOneClassification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"namespace"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"short_name"}},{"kind":"Field","name":{"kind":"Name","value":"value_json"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish"}}]}}]}}]} as unknown as DocumentNode<UpsertClassificationMutation, UpsertClassificationMutationVariables>;
export const InsertDuplicateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertDuplicate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duplicate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DuplicateInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertOneDuplicate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duplicate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duplicate_incident_number"}},{"kind":"Field","name":{"kind":"Name","value":"true_incident_number"}}]}}]}}]} as unknown as DocumentNode<InsertDuplicateMutation, InsertDuplicateMutationVariables>;
export const UpsertEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertOneEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpsertEntityMutation, UpsertEntityMutationVariables>;
export const FindEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<FindEntitiesQuery, FindEntitiesQueryVariables>;
export const FindEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}}]}}]}}]} as unknown as DocumentNode<FindEntityQuery, FindEntityQueryVariables>;
export const UpdateEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}}]}}]}}]} as unknown as DocumentNode<UpdateEntityMutation, UpdateEntityMutationVariables>;
export const FindIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncident"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_reports"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}}]}}]}}]} as unknown as DocumentNode<FindIncidentQuery, FindIncidentQueryVariables>;
export const FindIncidentsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentsTableQuery, FindIncidentsTableQueryVariables>;
export const FindIncidentEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentEntities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentEntitiesQuery, FindIncidentEntitiesQueryVariables>;
export const FindIncidentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_reports"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentsQuery, FindIncidentsQueryVariables>;
export const FindIncidentsTitlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentsTitles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<FindIncidentsTitlesQuery, FindIncidentsTitlesQueryVariables>;
export const UpdateIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIncident"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneIncident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_reports"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}}]}}]}}]} as unknown as DocumentNode<UpdateIncidentMutation, UpdateIncidentMutationVariables>;
export const UpdateIncidentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIncidents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateManyIncidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"matchedCount"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedCount"}}]}}]}}]} as unknown as DocumentNode<UpdateIncidentsMutation, UpdateIncidentsMutationVariables>;
export const InsertIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertIncident"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertOneIncident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}}]}}]} as unknown as DocumentNode<InsertIncidentMutation, InsertIncidentMutationVariables>;
export const FindLastIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindLastIncident"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"incident_id"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}},{"kind":"ObjectField","name":{"kind":"Name","value":"skip"},"value":{"kind":"IntValue","value":"0"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}}]}}]} as unknown as DocumentNode<FindLastIncidentQuery, FindLastIncidentQueryVariables>;
export const FindIncidentFullDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentFull"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IncidentFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_reports"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"tsne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentFullQuery, FindIncidentFullQueryVariables>;
export const LogIncidentHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logIncidentHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"History_incidentInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logIncidentHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}}]}}]} as unknown as DocumentNode<LogIncidentHistoryMutation, LogIncidentHistoryMutationVariables>;
export const FindIncidentHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindIncidentHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"History_incidentQueryInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"history_incidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"EnumValue","value":"EPOCH_DATE_MODIFIED_DESC"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeployerOfAISystem"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedDeveloperOfAISystem"}},{"kind":"Field","name":{"kind":"Name","value":"AllegedHarmedOrNearlyHarmedParties"}},{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editors"}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_reports"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"similarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reports"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"tsne"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}}]}}]} as unknown as DocumentNode<FindIncidentHistoryQuery, FindIncidentHistoryQueryVariables>;
export const FlagIncidentSimilarityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FlagIncidentSimilarity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"incidentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dissimilarIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flagIncidentSimilarity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"incidentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"incidentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"dissimilarIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dissimilarIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"flagged_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<FlagIncidentSimilarityMutation, FlagIncidentSimilarityMutationVariables>;
export const AllQuickAddDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllQuickAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QuickaddFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quickadds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}}]}}]}}]} as unknown as DocumentNode<AllQuickAddQuery, AllQuickAddQueryVariables>;
export const DeleteOneQuickAddDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneQuickAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QuickaddFilterType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteManyQuickadds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedCount"}}]}}]}}]} as unknown as DocumentNode<DeleteOneQuickAddMutation, DeleteOneQuickAddMutationVariables>;
export const InsertQuickAddDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertQuickAdd"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QuickaddInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertOneQuickadd"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<InsertQuickAddMutation, InsertQuickAddMutationVariables>;
export const FindReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"is_incident_report"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_text_hash"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}}]}}]}}]} as unknown as DocumentNode<FindReportQuery, FindReportQueryVariables>;
export const FindReportWithTranslationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindReportWithTranslations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"is_incident_report"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}},{"kind":"Field","alias":{"kind":"Name","value":"translations_es"},"name":{"kind":"Name","value":"translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"StringValue","value":"es","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"translations_en"},"name":{"kind":"Name","value":"translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"StringValue","value":"en","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"translations_fr"},"name":{"kind":"Name","value":"translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"StringValue","value":"fr","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"translations_ja"},"name":{"kind":"Name","value":"translations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"StringValue","value":"ja","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]}}]} as unknown as DocumentNode<FindReportWithTranslationsQuery, FindReportWithTranslationsQueryVariables>;
export const UpdateReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}}]}}]}}]} as unknown as DocumentNode<UpdateReportMutation, UpdateReportMutationVariables>;
export const DeleteOneReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOneReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]} as unknown as DocumentNode<DeleteOneReportMutation, DeleteOneReportMutationVariables>;
export const LinkReportsToIncidentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LinkReportsToIncidents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LinkReportsToIncidentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkReportsToIncidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"reports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]}}]} as unknown as DocumentNode<LinkReportsToIncidentsMutation, LinkReportsToIncidentsMutationVariables>;
export const LogReportHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logReportHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"History_reportInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logReportHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]} as unknown as DocumentNode<LogReportHistoryMutation, LogReportHistoryMutationVariables>;
export const FindReportHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindReportHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"History_reportQueryInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"history_reports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"EnumValue","value":"EPOCH_DATE_MODIFIED_DESC"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"embedding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from_text_hash"}},{"kind":"Field","name":{"kind":"Name","value":"vector"}}]}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}},{"kind":"Field","name":{"kind":"Name","value":"is_incident_report"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"modifiedBy"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}}]}}]}}]} as unknown as DocumentNode<FindReportHistoryQuery, FindReportHistoryQueryVariables>;
export const FindReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindReports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}}]}}]}}]} as unknown as DocumentNode<FindReportsQuery, FindReportsQueryVariables>;
export const FindReportsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindReportsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReportFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"report_number"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"inputs_outputs"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"is_incident_report"}}]}}]}}]} as unknown as DocumentNode<FindReportsTableQuery, FindReportsTableQueryVariables>;
export const FlagReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FlagReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"report_number"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flagReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"report_number"},"value":{"kind":"Variable","name":{"kind":"Name","value":"report_number"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"report_number"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"epoch_date_modified"}}]}}]}}]} as unknown as DocumentNode<FlagReportMutation, FlagReportMutationVariables>;
export const DeleteSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ObjectId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOneSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"EQ"},"value":{"kind":"Variable","name":{"kind":"Name","value":"_id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<DeleteSubmissionMutation, DeleteSubmissionMutationVariables>;
export const FindSubmissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindSubmissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"incident_date"}},{"kind":"Field","name":{"kind":"Name","value":"incident_ids"}},{"kind":"Field","name":{"kind":"Name","value":"incident_editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"incident_title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"similarity"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"plain_text"}},{"kind":"Field","name":{"kind":"Name","value":"developers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deployers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"harmed_parties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}}]}}]}}]} as unknown as DocumentNode<FindSubmissionsQuery, FindSubmissionsQueryVariables>;
export const FindSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionFilterType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"incident_date"}},{"kind":"Field","name":{"kind":"Name","value":"incident_ids"}},{"kind":"Field","name":{"kind":"Name","value":"incident_editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"incident_title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"developers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deployers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"harmed_parties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"similarity"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"quiet"}}]}}]}}]} as unknown as DocumentNode<FindSubmissionQuery, FindSubmissionQueryVariables>;
export const UpdateSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionFilterType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionUpdateType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"cloudinary_id"}},{"kind":"Field","name":{"kind":"Name","value":"date_downloaded"}},{"kind":"Field","name":{"kind":"Name","value":"date_modified"}},{"kind":"Field","name":{"kind":"Name","value":"date_published"}},{"kind":"Field","name":{"kind":"Name","value":"date_submitted"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"incident_date"}},{"kind":"Field","name":{"kind":"Name","value":"incident_ids"}},{"kind":"Field","name":{"kind":"Name","value":"incident_editors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"incident_title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"source_domain"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"submitters"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"editor_notes"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"developers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deployers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"harmed_parties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nlp_similar_incidents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"similarity"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editor_similar_incidents"}},{"kind":"Field","name":{"kind":"Name","value":"editor_dissimilar_incidents"}}]}}]}}]} as unknown as DocumentNode<UpdateSubmissionMutation, UpdateSubmissionMutationVariables>;
export const InsertSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmissionInsertType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insertOneSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<InsertSubmissionMutation, InsertSubmissionMutationVariables>;
export const PromoteSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PromoteSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PromoteSubmissionToReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promoteSubmissionToReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_ids"}},{"kind":"Field","name":{"kind":"Name","value":"report_number"}}]}}]}}]} as unknown as DocumentNode<PromoteSubmissionMutation, PromoteSubmissionMutationVariables>;
export const UpsertSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionQueryInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionInsertInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertOneSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscription"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<UpsertSubscriptionMutation, UpsertSubscriptionMutationVariables>;
export const UpdateSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionQueryInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"set"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOneSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"set"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<UpdateSubscriptionMutation, UpdateSubscriptionMutationVariables>;
export const FindSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindSubscriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<FindSubscriptionsQuery, FindSubscriptionsQueryVariables>;
export const FindSubscriptionsFullDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindSubscriptionsFull"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entityId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"userId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<FindSubscriptionsFullQuery, FindSubscriptionsFullQueryVariables>;
export const DeleteSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSubscriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionQueryInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteManySubscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletedCount"}}]}}]}}]} as unknown as DocumentNode<DeleteSubscriptionsMutation, DeleteSubscriptionsMutationVariables>;
export const FindUserSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUserSubscriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubscriptionQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"incident_id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incident_id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"entityId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<FindUserSubscriptionsQuery, FindUserSubscriptionsQueryVariables>;
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