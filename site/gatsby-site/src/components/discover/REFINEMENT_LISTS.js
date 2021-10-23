import {
  faNewspaper,
  faIdCard,
  faUserShield,
  faFlag,
  faHashtag,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

const REFINEMENT_LISTS = [
  {
    attribute: 'classifications',
    inputText: 'CSET:...',
    label: 'Classifications',
    faIcon: faNewspaper,
    faClasses: 'far fa-newspaper',
  },
  {
    attribute: 'source_domain',
    inputText: "Filter Domains ('bbc.com')",
    label: 'Source',
    faIcon: faNewspaper,
    faClasses: 'far fa-newspaper',
  },
  {
    attribute: 'authors',
    inputText: "Filter Authors ('Helen...')",
    label: 'Authors',
    faIcon: faIdCard,
    faClasses: 'far fa-id-card',
  },
  {
    attribute: 'submitters',
    inputText: "Filter Submitters ('Helen...')",
    label: 'Submitters',
    faIcon: faUserShield,
    faClasses: 'fas fa-user-shield',
  },
  {
    attribute: 'incident_id',
    inputText: "Filter incident number ('42')",
    label: 'Incident ID',
    faIcon: faHashtag,
    faClasses: 'fas fa-hashtag',
  },
  {
    attribute: 'epoch_incident_date',
    inputText: 'none',
    label: 'Incident Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
  },
  {
    attribute: 'epoch_date_published',
    inputText: 'none',
    label: 'Published Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
  },
  {
    attribute: 'flag',
    inputText: 'none',
    label: 'Flagged',
    faIcon: faFlag,
    faClasses: 'far fa-flag',
  },
];

export default REFINEMENT_LISTS;
