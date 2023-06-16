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
  risk_status: 'Not mitigated',
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

  a.setAttribute('src', 'data:text/json,' + json);
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

export {
  abbreviatedTag,
  Label,
  emptyRisk,
  risksEqual,
  removeTypename,
  statusIcon,
  statusColor,
  exportJson,
};
