import { classy } from 'utils/classy';

const abbreviatedTag = (tag) => tag.replace(/^.*:/g, '');

const Label = classy("label", "mb-1 block")

export { abbreviatedTag, Label };
