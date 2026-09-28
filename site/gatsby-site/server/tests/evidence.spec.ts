import { expect, it } from '@jest/globals';
import { createHash } from 'crypto';
import { computeEvidence, normalizeText, TEXT_NORMALIZATION } from '../evidence';

const fetchedAt = new Date('2021-09-14T00:00:00.000Z');

const body = 'The model misidentified the defendant.\n\nThe company disputes the account.';

describe(`Report evidence`, () => {

    it(`Transport differences leave the digest unchanged`, () => {
        const variants = [
            body,
            body.replace(/\n/g, '\r\n'),
            body.replace(/\n/g, '  \n'),
            body.replace('\n\n', '\n\n\n\n'),
            `\n${body}\n\n`,
            body.normalize('NFD'),
        ];

        const digests = new Set(variants.map((variant) => computeEvidence(variant, fetchedAt)!.sha256));

        expect(digests.size).toBe(1);
    });

    it(`A substantive edit changes the digest`, () => {
        const edited = body.replace('disputes', 'confirms');

        expect(computeEvidence(edited, fetchedAt)!.sha256).not.toBe(computeEvidence(body, fetchedAt)!.sha256);
    });

    it(`The digest and length are those of the normalized UTF-8 text`, () => {
        const text = 'Café résumé  \r\n\r\n\r\nEnd';
        const normalized = Buffer.from(normalizeText(text), 'utf8');

        const evidence = computeEvidence(text, fetchedAt)!;

        expect(normalizeText(text)).toBe('Café résumé\n\nEnd');
        expect(evidence.sha256).toBe(createHash('sha256').update(normalized).digest('hex'));
        expect(evidence.length).toBe(normalized.length);
        expect(evidence.normalization).toBe(TEXT_NORMALIZATION);
        expect(evidence.fetched_at).toEqual(fetchedAt);
    });

    it(`The archive link asks for the capture nearest the fetch time`, () => {
        const evidence = computeEvidence(body, new Date('2021-09-14T08:05:09.000Z'), 'http://example.com/story');

        expect(evidence!.archive_url).toBe('https://web.archive.org/web/20210914080509/http://example.com/story');
    });

    it(`No text means no evidence block`, () => {
        expect(computeEvidence('', fetchedAt)).toBeUndefined();
        expect(computeEvidence(undefined, fetchedAt)).toBeUndefined();
        expect(computeEvidence(null, fetchedAt)).toBeUndefined();
    });

    it(`No url, or no valid fetch time, means no archive link`, () => {
        expect(computeEvidence(body, fetchedAt)!.archive_url).toBeUndefined();
        expect(computeEvidence(body, new Date('not a date'), 'http://example.com')!.archive_url).toBeUndefined();
    });
});
