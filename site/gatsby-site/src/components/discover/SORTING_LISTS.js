import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const SORTING_LIST = [
  {
    name: 'incident-date',
    attribute: 'instant_search-en_epoch_incident_date',
    label: 'Incident Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
  },
  {
    name: 'published-date',
    attribute: 'instant_search-en_epoch_date_published',
    label: 'Published Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
  },
  {
    name: 'submitted-date',
    attribute: 'instant_search-en_epoch_date_submitted',
    label: 'Submitted Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
  },
];

export default SORTING_LIST;
