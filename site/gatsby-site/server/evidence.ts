import { createHash } from 'crypto';

/**
 * Names the normalization rule below. A reader re-deriving a digest needs to know which rule
 * produced it, so a change to the rule must come with a new name.
 */
export const TEXT_NORMALIZATION = 'aiid-plain-text-v1';

/**
 * The text AIID stored, reduced to a form that does not depend on how it was transported:
 * Unicode NFC, line endings as "\n", no trailing spaces or tabs on any line, runs of blank
 * lines collapsed to one, and no leading or trailing blank space.
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export interface ReportEvidence {
  sha256: string;
  length: number;
  fetched_at: Date;
  normalization: string;
  archive_url?: string;
}

function waybackTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:T]/g, '').slice(0, 14);
}

/**
 * The evidence block for a report, computed over the text AIID itself stored when the source
 * was fetched, never over the live page. `length` is the byte length of the normalized UTF-8
 * text. `archive_url` asks the Wayback Machine for the capture nearest the fetch time, so the
 * archived copy can be compared with the digest.
 *
 * Returns undefined when there is no text to bind.
 */
export function computeEvidence(
  plainText: string | null | undefined,
  fetchedAt: Date,
  url?: string | null
): ReportEvidence | undefined {
  if (!plainText) {
    return undefined;
  }

  const normalized = Buffer.from(normalizeText(plainText), 'utf8');

  const evidence: ReportEvidence = {
    sha256: createHash('sha256').update(normalized).digest('hex'),
    length: normalized.length,
    fetched_at: fetchedAt,
    normalization: TEXT_NORMALIZATION,
  };

  if (url && !Number.isNaN(fetchedAt.getTime())) {
    evidence.archive_url = `https://web.archive.org/web/${waybackTimestamp(fetchedAt)}/${url}`;
  }

  return evidence;
}
