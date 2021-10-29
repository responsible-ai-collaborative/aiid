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
    placeholder: 'CSET:...',
    label: 'Classifications',
    faIcon: faNewspaper,
    faClasses: 'far fa-newspaper',
    type: 'refinement',
  },
  {
    attribute: 'source_domain',
    placeholder: "Filter Domains ('bbc.com')",
    label: 'Source',
    faIcon: faNewspaper,
    faClasses: 'far fa-newspaper',
    type: 'refinement',
  },
  {
    attribute: 'authors',
    placeholder: "Filter Authors ('Helen...')",
    label: 'Authors',
    faIcon: faIdCard,
    faClasses: 'far fa-id-card',
    type: 'refinement',
  },
  {
    attribute: 'submitters',
    placeholder: "Filter Submitters ('Helen...')",
    label: 'Submitters',
    faIcon: faUserShield,
    faClasses: 'fas fa-user-shield',
    type: 'refinement',
  },
  {
    attribute: 'incident_id',
    placeholder: "Filter incident number ('42')",
    label: 'Incident ID',
    faIcon: faHashtag,
    faClasses: 'fas fa-hashtag',
    type: 'refinement',
  },
  {
    attribute: 'epoch_incident_date',
    placeholder: 'none',
    label: 'Incident Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'range',
  },
  {
    attribute: 'epoch_date_published',
    placeholder: 'none',
    label: 'Published Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'range',
  },
  {
    attribute: 'flag',
    placeholder: 'none',
    label: 'Flagged',
    faIcon: faFlag,
    faClasses: 'far fa-flag',
    type: 'refinement',
  },
];

export default REFINEMENT_LISTS;
