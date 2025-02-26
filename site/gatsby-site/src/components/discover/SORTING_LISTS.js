import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import config from '../../../config';

/**
 * @property {string} instantKey - This auxiliary field is used to generate the instant search key for each language, and should be removed before creating the final sorting list.
 */
const BASE_SORTING_LIST = [
  {
    default: true,
    name: 'relevance',
    label: 'Relevance',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    division: true,
    instantKey: 'featured',
  },
  {
    name: 'incident-date-desc',
    label: 'Newest Incident Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
    instantKey: 'epoch_incident_date_desc',
  },
  {
    name: 'incident-date-asc',
    label: 'Oldest Incident Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
    division: true,
    instantKey: 'epoch_incident_date_asc',
  },
  {
    name: 'published-date-desc',
    label: 'Newest Published Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
    instantKey: 'epoch_date_published_desc',
  },
  {
    name: 'published-date-asc',
    label: 'Oldest Published Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
    division: true,
    instantKey: 'epoch_date_published_asc',
  },
  {
    name: 'submitted-date-desc',
    label: 'Newest Submitted Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
    instantKey: 'epoch_date_submitted_desc',
  },
  {
    name: 'submitted-date-asc',
    label: 'Oldest Submitted Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
    instantKey: 'epoch_date_submitted_asc',
  },
];

const SORTING_LIST = BASE_SORTING_LIST.map((item) => {
  // Featured items use a hyphen (-) separator while other sorting options use underscore (_)
  // This matches the index naming convention in Algolia
  const newItem = {
    ...item,
    value: `instant_search-en${item.instantKey == 'featured' ? '-' : '_'}${item.instantKey}`,
  };

  config.i18n.availableLanguages.forEach((lang) => {
    newItem[`value_${lang}`] = `instant_search-${lang}${item.instantKey == 'featured' ? '-' : '_'}${
      item.instantKey
    }`;
  });

  // remove auxiliary field
  delete newItem.instantKey;

  return newItem;
});

export default SORTING_LIST;
