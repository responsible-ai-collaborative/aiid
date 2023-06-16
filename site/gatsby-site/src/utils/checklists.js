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
  }[status] || faWarning);

const statusColor = (status) =>
  ({
    'Not Mitigated': 'text-red-500',
    Mitigated: 'text-blue-500',
    Prevented: 'text-green-500',
  }[status] || 'text-gray-500');

const DeleteButton = classy(
  'button',
  'text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
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
