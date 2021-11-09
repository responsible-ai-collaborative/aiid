import {
  faNewspaper,
  faIdCard,
  faUserShield,
  faFlag,
  faHashtag,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import orderBy from 'lodash.orderby';

const transformItems = (items) => orderBy(items, ['count', 'label'], ['desc', 'desc']);

const REFINEMENT_LISTS = [
  {
    attribute: 'classifications',
    placeholder: 'Type Here',
    label: 'Classifications',
    faIcon: faNewspaper,
    faClasses: 'far fa-newspaper',
    type: 'refinement',

    // algolia specific
    showMore: true,
    showMoreLimit: 50,
    transformItems,
  },
  {
    attribute: 'source_domain',
    placeholder: 'Type Here',
    label: 'Source',
    faIcon: faNewspaper,
    faClasses: 'far fa-newspaper',
    type: 'refinement',

    // algolia specific
    showMore: true,
    showMoreLimit: 50,
    transformItems,
  },
  {
    attribute: 'authors',
    placeholder: 'Type Here',
    label: 'Authors',
    faIcon: faIdCard,
    faClasses: 'far fa-id-card',
    type: 'refinement',

    // algolia specific
    showMore: true,
    showMoreLimit: 50,
    transformItems,
  },
  {
    attribute: 'submitters',
    placeholder: 'Type Here',
    label: 'Submitters',
    faIcon: faUserShield,
    faClasses: 'fas fa-user-shield',
    type: 'refinement',

    // algolia specific
    showMore: true,
    showMoreLimit: 50,
    transformItems,
  },
  {
    attribute: 'incident_id',
    placeholder: 'Type Here',
    label: 'Incident ID',
    faIcon: faHashtag,
    faClasses: 'fas fa-hashtag',
    type: 'refinement',

    // algolia specific
    showMore: true,
    showMoreLimit: 50,
    transformItems,
  },
  {
    attribute: 'epoch_incident_date',
    placeholder: 'Type Here',
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
