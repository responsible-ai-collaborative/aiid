import { validateOrigin } from '../requestOrigin';

describe('GraphQL request origin validation', () => {
    it.each([
        'https://incidentdatabase.ai',
        'https://staging-aiid.netlify.app',
        'https://incidentdatabase.ai:443',
    ])('accepts the allowed origin %s', (origin) => {
        expect(validateOrigin({ headers: { origin } })).toBeNull();
    });

    it.each([
        'https://incidentdatabase.ai/apps/discover?query=example',
        'https://staging-aiid.netlify.app/cite/1',
    ])('accepts an allowed Referer URL %s when Origin is absent', (referer) => {
        expect(validateOrigin({ headers: { referer } })).toBeNull();
    });

    it.each([
        'https://incidentdatabase.ai.attacker.example',
        'https://staging-aiid.netlify.app.attacker.example',
        'https://incidentdatabase.ai@attacker.example',
        'https://staging-aiid.netlify.app@attacker.example',
        'https://incidentdatabase.ai:444',
        'http://incidentdatabase.ai',
        'https://attacker.example/?https://incidentdatabase.ai',
        'https://attacker.example/#https://incidentdatabase.ai',
        '//incidentdatabase.ai',
        'not a URL',
        'null',
        '',
    ])('rejects an untrusted or invalid URL %j in either header', (value) => {
        for (const header of ['origin', 'referer']) {
            const result = validateOrigin({ headers: { [header]: value } });

            expect(result?.statusCode).toBe(403);
            expect(JSON.parse(result!.body)).toEqual({
                error: 'Forbidden - Invalid origin',
                message: 'API access is restricted to authorized domains',
            });
        }
    });

    it('rejects missing headers', () => {
        expect(validateOrigin({ headers: {} })?.statusCode).toBe(403);
    });

    it('does not let a trusted Referer override an untrusted Origin', () => {
        expect(validateOrigin({ headers: {
            origin: 'https://attacker.example',
            referer: 'https://incidentdatabase.ai/apps/discover',
        } })?.statusCode).toBe(403);
    });

    it('does not let a trusted Referer override a malformed Origin', () => {
        expect(validateOrigin({ headers: {
            origin: 'null',
            referer: 'https://incidentdatabase.ai/apps/discover',
        } })?.statusCode).toBe(403);
    });
});
