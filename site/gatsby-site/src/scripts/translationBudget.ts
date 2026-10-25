/**
 * Google Translate bills every character sent to it (USD 20 per million characters at the
 * time of writing), so each translation run works out how many characters it is about to
 * send and refuses to start above this limit unless `TRANSLATE_MAX_CHARS_PER_RUN` raises it.
 *
 * Two million characters is roughly USD 40, several times a normal day of new reports, and
 * far below the cost of re-translating the whole corpus (about 35 million characters per
 * language), which is what a misconfiguration or a bug would otherwise do unnoticed.
 */
export const DEFAULT_MAX_CHARS_PER_RUN = 2_000_000;

export const USD_PER_MILLION_CHARS = 20;

export const parseMaxCharsPerRun = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null || value === '') {
    return DEFAULT_MAX_CHARS_PER_RUN;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Invalid TRANSLATE_MAX_CHARS_PER_RUN value: [${value}]`);
  }

  return parsed;
};

export const describeChars = (chars: number): string =>
  `${chars.toLocaleString('en-US')} characters (about USD ${(
    (chars / 1_000_000) *
    USD_PER_MILLION_CHARS
  ).toFixed(2)} at USD ${USD_PER_MILLION_CHARS} per million)`;
