import { MongoClient } from 'mongodb';
import { getClient, getCollection, seedFixture } from '../utils';
import {
    PROMPT_VERSION_FIELD,
    down as downArcolaFields,
    up as upArcolaFields,
} from '../../../migrations/2026.11.03T12.00.00.add-mit-arcola-fields';
import {
    HUMAN_CORRECTED_FIELD,
    PREVIOUS_PROMPT_VERSION_DESCRIPTION,
    PREVIOUS_SYNC_PARAGRAPH,
    PROMPT_VERSION_DESCRIPTION,
    REVISION_FIELD,
    SYNC_PARAGRAPH,
    down,
    up,
} from '../../../migrations/2026.11.08T12.00.00.add-mit-revision-fields';

/** The MIT taxonomy as the 2025 migration created it, reduced to what the two sync migrations touch */
const original = () => ({
    namespace: 'MIT',
    weight: 70,
    automatedClassifications: true,
    description: '[The MIT AI Risk Repository](https://airisk.mit.edu/) contains detailed records of AI-related risks. Its mid-level Domain Taxonomy categorizes risks into 23 specific domains like discrimination, misinformation, malicious use, and human-computer interaction issues.\n\nClassifications using this taxonomy were generated automatically through the work of [Simon Mylius](https://simonmylius.com/incident-classification/introduction).',
    dummy_fields: [],
    field_list: [
        { short_name: 'Risk Domain', long_name: 'Risk Domain', display_type: 'enum', mongo_type: 'string', permitted_values: ['1. Discrimination and Toxicity'] },
        {
            short_name: 'Risk Subdomain',
            long_name: 'Risk Subdomain',
            short_description: 'A further 23 subdomains create an accessible and understandable classification of hazards and harms associated with AI',
            long_description: '## 7.5 AI welfare and rights\n\nEthical considerations.',
            display_type: 'enum',
            mongo_type: 'string',
            permitted_values: ['1.1. Unfair discrimination and misrepresentation', '7.5. AI welfare and rights'],
        },
        { short_name: 'Entity', long_name: 'Entity', display_type: 'enum', mongo_type: 'string', permitted_values: ['Human', 'AI', 'Other'] },
        { short_name: 'Timing', long_name: 'Timing', display_type: 'enum', mongo_type: 'string', permitted_values: ['Pre-deployment', 'Post-deployment', 'Other'] },
        { short_name: 'Intent', long_name: 'Intent', display_type: 'enum', mongo_type: 'string', permitted_values: ['Intentional', 'Unintentional', 'Other'] },
    ],
});

const readTaxonomy = () => getCollection('aiidprod', 'taxa').findOne({ namespace: 'MIT' });

const field = (taxonomy: any, short_name: string) =>
    taxonomy.field_list.find((entry: any) => entry.short_name === short_name);

describe('Migration: 2026.11.08T12.00.00.add-mit-revision-fields', () => {

    let client: MongoClient;

    beforeAll(async () => {
        client = getClient();
    });

    afterAll(async () => {
        // Leave the shared test database as other specs expect it
        await seedFixture({ aiidprod: { taxa: [] } });

        await client.close();
    });

    beforeEach(async () => {
        // The state the previous migration leaves behind
        await seedFixture({ aiidprod: { taxa: [original()] } });

        await upArcolaFields({ context: { client } } as any);
    });

    test('adds the revision fields and describes the revision rule', async () => {

        const before = (await readTaxonomy())!;

        expect(field(before, PROMPT_VERSION_FIELD).long_description).toBe(PREVIOUS_PROMPT_VERSION_DESCRIPTION);
        expect(before.description).toContain(PREVIOUS_SYNC_PARAGRAPH);

        await up({ context: { client } } as any);

        const taxonomy = (await readTaxonomy())!;

        expect(taxonomy.field_list.map((entry: any) => entry.short_name)).toEqual([
            'Risk Domain', 'Risk Subdomain', 'Entity', 'Timing', 'Intent', 'Additional Subdomains', PROMPT_VERSION_FIELD, REVISION_FIELD, HUMAN_CORRECTED_FIELD,
        ]);

        expect(field(taxonomy, REVISION_FIELD)).toMatchObject({
            long_name: REVISION_FIELD,
            display_type: 'int',
            mongo_type: 'int',
            weight: 1,
            instant_facet: false,
            required: false,
            public: true,
            hide_search: true,
            permitted_values: [],
        });
        expect(field(taxonomy, REVISION_FIELD).long_description).toMatch(/1 for the first time the incident was classified, and one higher each time it is re-classified/);

        expect(field(taxonomy, HUMAN_CORRECTED_FIELD)).toMatchObject({
            long_name: HUMAN_CORRECTED_FIELD,
            display_type: 'bool',
            mongo_type: 'bool',
            weight: 1,
            instant_facet: false,
            required: false,
            public: true,
            permitted_values: [],
        });
        expect(field(taxonomy, HUMAN_CORRECTED_FIELD).hide_search).toBeUndefined();

        expect(field(taxonomy, PROMPT_VERSION_FIELD).long_description).toBe(PROMPT_VERSION_DESCRIPTION);

        expect(taxonomy.description).not.toContain(PREVIOUS_SYNC_PARAGRAPH);
        expect(taxonomy.description.endsWith(`.\n\n${SYNC_PARAGRAPH}`)).toBe(true);
        expect(taxonomy.description.match(/Since November 2026/g)).toHaveLength(1);

        // Everything else is untouched
        expect(taxonomy).toMatchObject({ weight: 70, automatedClassifications: true, dummy_fields: [] });
        expect(taxonomy.field_list.slice(0, 7)).toEqual(before.field_list.slice(0, 6).concat([
            { ...field(before, PROMPT_VERSION_FIELD), long_description: PROMPT_VERSION_DESCRIPTION },
        ]));
    });

    test('is idempotent', async () => {

        await up({ context: { client } } as any);

        const first = await readTaxonomy();

        await up({ context: { client } } as any);

        expect(await readTaxonomy()).toEqual(first);
    });

    test('down restores the taxonomy the previous migration left', async () => {

        const before = await readTaxonomy();

        await up({ context: { client } } as any);
        await down({ context: { client } } as any);

        expect(await readTaxonomy()).toEqual(before);
    });

    test('both downs in reverse order restore the taxonomy from before the sync', async () => {

        await up({ context: { client } } as any);
        await down({ context: { client } } as any);
        await downArcolaFields({ context: { client } } as any);

        const { _id, ...taxonomy } = (await readTaxonomy())!;

        expect(taxonomy).toEqual(original());
    });

    test('keeps a description someone edited by hand, adding the paragraph once', async () => {

        await getCollection('aiidprod', 'taxa').updateOne(
            { namespace: 'MIT', 'field_list.short_name': PROMPT_VERSION_FIELD },
            { $set: { description: 'Edited by hand.', 'field_list.$.long_description': 'Edited too.' } },
        );

        await up({ context: { client } } as any);
        await up({ context: { client } } as any);

        const taxonomy = (await readTaxonomy())!;

        expect(taxonomy.description).toBe(`Edited by hand.\n\n${SYNC_PARAGRAPH}`);
        expect(field(taxonomy, PROMPT_VERSION_FIELD).long_description).toBe('Edited too.');
    });

    test('fails loudly when the MIT taxonomy is missing', async () => {

        await seedFixture({ aiidprod: { taxa: [] } });

        await expect(up({ context: { client } } as any)).rejects.toThrow(/MIT taxonomy is missing/);
    });
});
