import { classy } from 'utils/classy';
import { faShield, faWarning } from '@fortawesome/free-solid-svg-icons';

const abbreviatedTag = (tag) => tag.replace(/^.*:/g, '');

const risksEqual = (risk1, risk2) => {
  if (risk1.generated != risk2.generated) {
    return false;
  }
  if (risk1.generated && risk2.generated) {
    return risk1.title == risk2.title;
  }
  if (!risk1.generated && !risk1.generated) {
    return risk1.id == risk2.id;
  }
};

const Label = classy('label', 'mb-1 block');

const emptyRisk = () => ({
  id: Math.random().toString(36).slice(-10),
  title: 'Untitled Risk',
  tags: [],
  risk_status: 'Not Mitigated',
  risk_notes: '',
  severity: '',
  likelihood: '',
  precedents: [],
  touched: false,
  generated: true,
  startClosed: false,
});

const removeTypename = (obj) => {
  const replaced = JSON.stringify(obj).replace(/"__typename":"[A-Za-z]*",/g, '');

  return JSON.parse(replaced);
};

const exportJson = (checklist) => {
  const json = JSON.stringify(checklist).replace(/"__typename":"[A-Za-z]*",/g, '');

  const a = document.createElement('a');

  a.setAttribute('href', 'data:text/json,' + json);
  a.setAttribute('download', `${checklist.name} - Risk Checklist.json`);
  a.click();
};

const statusIcon = (status) =>
  ({
    'Not Mitigated': faWarning,
    Mitigated: faShield,
    Prevented: faShield,
    Unclear: faWarning,
    'Not Applicable': faShield,
  }[status] || faWarning);

const statusColor = (status) =>
  ({
    'Not Mitigated': 'red',
    Mitigated: 'blue',
    Prevented: 'green',
    'Not Applicable': 'gray',
    Unclear: 'gray',
  }[status] || 'gray');

const DeleteButton = classy(
  'button',
  `
  text-sm text-center font-medium
  px-5 py-2.5 rounded-lg border

  text-red-700
  border-gray-300

  hover:text-white
  hover:bg-red-800
  hover:border-red-800

  focus:ring-4
  focus:outline-none
  focus:ring-red-300

  dark:border-gray-600
  dark:text-red-500
  dark:hover:text-white
  dark:hover:bg-red-600
  dark:focus:ring-red-900
`
);

export {
  abbreviatedTag,
  Label,
  DeleteButton,
  emptyRisk,
  risksEqual,
  removeTypename,
  statusIcon,
  statusColor,
  exportJson,
};
