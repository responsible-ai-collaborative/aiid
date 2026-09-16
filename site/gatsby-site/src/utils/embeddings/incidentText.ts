/** Pure helpers for building deterministic incident embedding inputs. */

export type IncidentTextSource = {
  title?: string | null;
  description?: string | null;
  [key: string]: unknown;
};

export type ReportTextSource = {
  report_number?: number | null;
  plain_text?: string | null;
  text?: string | null;
  [key: string]: unknown;
};

export type TextChunk = {
  text: string;
  startChar: number;
  endChar: number;
};

/** The short incident-level input used for broad semantic retrieval. */
export const buildIncidentOverview = (incident: IncidentTextSource): string => {
  const title = (incident.title || '').trim();
  const description = (incident.description || '').trim();

  return [title && `Title: ${title}`, description && `Description: ${description}`]
    .filter(Boolean)
    .join('\n\n');
};

/** Returns the preferred article body without mutating the report. */
export const getReportBody = (report: ReportTextSource): string =>
  (report.plain_text || report.text || '').trim();

/** Sorts reports so hashes, chunk order, and embeddings stay stable across runs. */
export const sortReports = (reports: readonly ReportTextSource[]): ReportTextSource[] =>
  [...reports].sort((a, b) => (a.report_number ?? 0) - (b.report_number ?? 0));

/**
 * Splits text into bounded, overlapping chunks while preferring natural boundaries.
 * Offsets refer to the supplied text and let a later search result identify its source.
 */
export const chunkTextWithOffsets = (
  text: string,
  maxChars: number,
  overlapChars = 0
): TextChunk[] => {
  if (!Number.isInteger(maxChars) || maxChars <= 0) {
    throw new Error('maxChars must be a positive integer');
  }

  if (!Number.isInteger(overlapChars) || overlapChars < 0 || overlapChars >= maxChars) {
    throw new Error('overlapChars must be a non-negative integer smaller than maxChars');
  }

  if (text.length === 0) return [];

  const chunks: TextChunk[] = [];
  let start = 0;

  while (start < text.length) {
    while (start < text.length && /\s/.test(text[start])) start++;
    if (start >= text.length) break;

    const hardEnd = Math.min(start + maxChars, text.length);
    let end = hardEnd;

    if (hardEnd < text.length) {
      const minimumUsefulBreak = start + Math.floor(maxChars / 2);
      const candidates = [
        text.lastIndexOf('\n\n', hardEnd),
        text.lastIndexOf('\n', hardEnd),
        text.lastIndexOf('. ', hardEnd),
        text.lastIndexOf(' ', hardEnd),
      ].filter((candidate) => candidate >= minimumUsefulBreak);

      if (candidates.length > 0) {
        end = Math.max(...candidates);
        if (text.startsWith('. ', end)) end += 1;
      }
    }

    while (end > start && /\s/.test(text[end - 1])) end--;
    chunks.push({ text: text.slice(start, end), startChar: start, endChar: end });

    if (end >= text.length) break;
    start = Math.max(start + 1, end - overlapChars);
  }

  return chunks;
};
