import { classy } from 'utils/classy';

const abbreviatedTag = (tag) => tag.replace(/^.*:/g, '');

// TODO: Handle identity better than just comparing titles.
const risksEqual = (risk1, risk2) => risk1.title == risk2.title;

const Label = classy("label", "mb-1 block")

const emptyRisk = () => ({
  title: 'Untitled Risk',
  query_tags: [],
  risk_status: 'Not mitigated',
  risk_notes: '',
  severity: '',
  likelihood: '',
  precedents: [],
  touched: false,
})

export { abbreviatedTag, Label, emptyRisk, risksEqual };
