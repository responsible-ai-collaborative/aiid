import { MongoClient } from 'mongodb';
import { getClient, getCollection, seedFixture } from '../utils';
import {
    ADDITIONAL_SUBDOMAINS_FIELD,
    MULTI_AGENT_SUBDOMAIN,
    PROMPT_VERSION_FIELD,
    down,
    up,
} from '../../../migrations/2026.11.03T12.00.00.add-mit-arcola-fields';

const subdomains = [
    '1.1. Unfair discrimination and misrepresentation',
    '1.2. Exposure to toxic content',
    '7.3. Lack of capability or robustness',
    '7.4. Lack of transparency or interpretability',
    '7.5. AI welfare and rights',
];

/** The MIT taxonomy as the 2025 migration created it, reduced to what this migration touches */
const before = () => ({
    namespace: 'MIT',
    weight: 70,
    automatedClassifications: true,
    description: '[The MIT AI Risk Repository](https://airisk.mit.edu/) contains detailed records of AI-related risks. Its mid-level Domain Taxonomy categorizes risks into 23 specific domains like discrimination, misinformation, malicious use, and human-computer interaction issues.\n\nClassifications using this taxonomy were generated automatically through the work of [Simon Mylius](https://simonmylius.com/incident-classification/introduction).',
    dummy_fields: [],
    field_list: [
        { short_name: 'Risk Domain', long_name: 'Risk Domain', display_type: 'enum', mongo_type: 'string', permitted_values: ['1. Discrimination and Toxicity', '7. AI system safety, failures, and limitations'] },
        {
            short_name: 'Risk Subdomain',
            long_name: 'Risk Subdomain',
            short_description: 'A further 23 subdomains create an accessible and understandable classification of hazards and harms associated with AI',
            long_description: '# 7 AI system safety, failures, and limitations\n\n## 7.5 AI welfare and rights\n\nEthical considerations regarding the treatment of potentially sentient AI entities.',
            display_type: 'enum',
            mongo_type: 'string',
            permitted_values: [...subdomains],
        },
        { short_name: 'Entity', long_name: 'Entity', display_type: 'enum', mongo_type: 'string', permitted_values: ['Human', 'AI', 'Other'] },
        { short_name: 'Timing', long_name: 'Timing', display_type: 'enum', mongo_type: 'string', permitted_values: ['Pre-deployment', 'Post-deployment', 'Other'] },
        { short_name: 'Intent', long_name: 'Intent', display_type: 'enum', mongo_type: 'string', permitted_values: ['Intentional', 'Unintentional', 'Other'] },
    ],
});

const readTaxonomy = () => getCollection('aiidprod', 'taxa').findOne({ namespace: 'MIT' });

describe('Migration: 2026.11.03T12.00.00.add-mit-arcola-fields', () => {

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
        await seedFixture({ aiidprod: { taxa: [before()] } });
    });

    test('adds the sync fields, the multi-agent subdomain and the description paragraph', async () => {

        await up({ context: { client } } as any);

        const taxonomy = (await readTaxonomy())!;

        expect(taxonomy.field_list.map((field: any) => field.short_name)).toEqual([
            'Risk Domain', 'Risk Subdomain', 'Entity', 'Timing', 'Intent', ADDITIONAL_SUBDOMAINS_FIELD, PROMPT_VERSION_FIELD,
        ]);

        const subdomain = taxonomy.field_list.find((field: any) => field.short_name === 'Risk Subdomain');

        expect(subdomain.permitted_values).toEqual([...subdomains, MULTI_AGENT_SUBDOMAIN]);
        expect(subdomain.long_description).toBe(
            '# 7 AI system safety, failures, and limitations\n\n## 7.5 AI welfare and rights\n\nEthical considerations regarding the treatment of potentially sentient AI entities.\n\n## 7.6 Multi-agent risks\n\nRisks from multi-agent interactions, due to incentives (which can lead to conflict or collusion) and/or the structure of the system, such as a loss of control or emergent behaviours arising from the interactions of multiple AI agents.'
        );
        expect(subdomain.short_description).toContain('A further 24 subdomains');

        const additional = taxonomy.field_list.find((field: any) => field.short_name === ADDITIONAL_SUBDOMAINS_FIELD);

        expect(additional).toMatchObject({ display_type: 'multi', mongo_type: 'array', instant_facet: true, public: true, required: false });
        expect(additional.permitted_values).toEqual(subdomain.permitted_values);

        const promptVersion = taxonomy.field_list.find((field: any) => field.short_name === PROMPT_VERSION_FIELD);

        expect(promptVersion).toMatchObject({ display_type: 'string', mongo_type: 'string', instant_facet: false, public: true, required: false, permitted_values: [] });

        expect(taxonomy.description).toContain('24 specific subdomains');
        expect(taxonomy.description).toMatch(/\.\n\nSince November 2026 these classifications are refreshed automatically from the \[Arcola AI\]\(https:\/\/platform\.arcolaai\.com\/\)/);

        // Everything else is untouched
        expect(taxonomy).toMatchObject({ weight: 70, automatedClassifications: true, dummy_fields: [] });
        expect(taxonomy.field_list[0]).toEqual(before().field_list[0]);
    });

    test('is idempotent', async () => {

        await up({ context: { client } } as any);

        const first = await readTaxonomy();

        await up({ context: { client } } as any);

        expect(await readTaxonomy()).toEqual(first);
    });

    test('down restores the taxonomy', async () => {

        const original = await readTaxonomy();

        await up({ context: { client } } as any);
        await down({ context: { client } } as any);

        expect(await readTaxonomy()).toEqual(original);
    });

    test('fails loudly when the MIT taxonomy is missing', async () => {

        await seedFixture({ aiidprod: { taxa: [] } });

        await expect(up({ context: { client } } as any)).rejects.toThrow(/MIT taxonomy is missing/);
    });
});
