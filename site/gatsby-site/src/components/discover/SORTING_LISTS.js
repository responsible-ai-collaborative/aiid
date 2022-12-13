import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const SORTING_LIST = [
  {
    attribute: 'instant_search-en_epoch_incident_date_desc',
    label: 'Incident Date Desc',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
  },
  {
    attribute: 'instant_search-en_epoch_incident_date_asc',
    label: 'Incident Date Asc',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
  },
];

export default SORTING_LIST;
