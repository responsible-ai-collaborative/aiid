import React from 'react';
import { faShield, faWarning } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

const riskStatusFeatures = {
  'Not Mitigated': {
    icon: faWarning,
    color: 'red',
  },
  Mitigated: {
    icon: faShield,
    color: 'blue',
  },
  Prevented: {
    icon: faShield,
    color: 'green',
  },
  Unclear: {
    icon: faWarning,
    color: 'gray',
  },
  'Not Applicable': {
    icons: faShield,
    color: 'gray',
  },
};

const riskStatusValues = Object.keys(riskStatusFeatures);

const checkedRiskStatus = (status) => {
  if (!riskStatusValues.includes(status)) {
    throw new Error(`Unknown risk status: "${status}"`);
  }
  return status;
};

const statusIcon = (status) => riskStatusFeatures[checkedRiskStatus(status)].icon || faWarning;

const statusColor = (status) => riskStatusFeatures[checkedRiskStatus(status)].color || 'gray';

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

const Label = (props) => (
  <label {...{ ...props, className: `mb-1 block ${props.className}` }}>{props.children}</label>
);

const emptyRisk = (properties) => ({
  id: uuidv4(),
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
  ...(properties || {}),
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

const DeleteButton = (props) => (
  <button
    {...{
      ...props,
      className: `
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
  `,
    }}
  >
    {props.children}
  </button>
);

function shouldBeGrouped(tag1, tag2) {
  if (tag1 == tag2) return true;
  if (tag1.slice(0, 3) == ' GMF' && tag2.slice(0, 3) == 'GMF') {
    // Despite the name, this function has nothing to do with the education system.
    const removeKnownPotential = (tag) => tag.replace('GMF:Known', '').replace('GMF:Potential');

    if (removeKnownPotential(tag1) == removeKnownPotential(tag2)) {
      return true;
    }
  }
  return false;
}

export {
  abbreviatedTag,
  Label,
  DeleteButton,
  emptyRisk,
  risksEqual,
  removeTypename,
  riskStatusValues,
  checkedRiskStatus,
  statusIcon,
  statusColor,
  exportJson,
  shouldBeGrouped,
};
