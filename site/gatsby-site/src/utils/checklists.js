import { classy } from 'utils/classy';

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

function removeTypename(obj) {
  const replaced = JSON.stringify(obj).replace(/"__typename":"[A-Za-z]*",/g, '');

  return JSON.parse(replaced);
}

export { abbreviatedTag, Label, emptyRisk, risksEqual, removeTypename };
