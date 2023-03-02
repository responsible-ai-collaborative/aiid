import {
  StringParam,
  createEnumParam,
  withDefault,
  NumberParam,
  BooleanParam,
} from 'use-query-params';

const DisplayModeEnumParam = withDefault(
  createEnumParam(['details', 'compact', 'list']),
  'details'
);

const LanguageEnumParam = withDefault(createEnumParam(['en']), 'en');

const queryConfig = {
  s: StringParam,
  source_domain: StringParam,
  authors: StringParam,
  submitters: StringParam,
  incident_id: StringParam,
  flag: StringParam,
  classifications: StringParam,
  epoch_incident_date_min: StringParam,
  epoch_incident_date_max: StringParam,
  epoch_date_published_min: StringParam,
  epoch_date_published_max: StringParam,
  display: DisplayModeEnumParam,
  page: withDefault(NumberParam, 1),
  hideDuplicates: BooleanParam,
  is_incident_report: withDefault(StringParam, 'true'),
  sortBy: withDefault(StringParam, 'relevance'),
};

export { queryConfig, DisplayModeEnumParam, LanguageEnumParam };
