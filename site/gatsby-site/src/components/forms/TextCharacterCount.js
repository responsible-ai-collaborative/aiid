import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * The longest report text the submission and report forms accept. The yup
 * schemas in `components/submissions/schemas.js`, `SubmissionWizard/StepOne.js`
 * and `IncidentReportForm.js` enforce it; the counter below shows it.
 */
export const TEXT_MAX_CHARACTERS = 50000;

/**
 * Live character count for the report text editor.
 *
 * The editor's own status bar shows words and lines, but the submission limit
 * is a character limit, so the number that decides whether a report can be
 * saved is shown next to the editor as `42,318 / 50,000 characters`. It turns
 * red once the limit is exceeded; the schema error explains the limit itself.
 * SEE: #4102
 */
const TextCharacterCount = ({ text, max = TEXT_MAX_CHARACTERS, className = '' }) => {
  const { t, i18n } = useTranslation(['submit']);

  const count = (text || '').length;

  const over = count > max;

  const format = (n) => n.toLocaleString(i18n.language);

  return (
    <div
      className={`text-sm text-right ${over ? 'text-red-700' : 'text-gray-500'} ${className}`}
      data-cy="text-character-count"
      data-over-limit={over}
      aria-live="polite"
    >
      {t('{{current}} / {{max}} characters', { current: format(count), max: format(max) })}
    </div>
  );
};

export default TextCharacterCount;
