import { getClassificationValue } from 'utils/classifications';

export function isAiHarm(classication) {
  // Incidents meeting CSET’s definition for AI harm:
  //
  //   3.5 AI Harm Level =  AI tangible harm event | AI tangible harm near-miss | AI tangible harm issue
  //
  //   AND/OR
  //
  //   5.5 Annotator’s AI special interest intangible harm assessment = yes

  const tangibleHarm = [
    'AI tangible harm event',
    'AI tangible harm near-miss',
    'AI tangible harm issue',
  ].includes(getClassificationValue(classication, 'AI Harm Level'));

  const intangibleHarm =
    getClassificationValue(
      classication,
      'Annotator’s AI special interest intangible harm assessment'
    ) == 'yes';

  return tangibleHarm || intangibleHarm;
}
