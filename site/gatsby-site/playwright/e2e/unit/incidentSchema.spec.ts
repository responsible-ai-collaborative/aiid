import { expect } from '@playwright/test';
import { test } from '../../utils';
import {
  createIncidentSchema,
  legacyEmptyEntityFields,
  schema,
} from '../../../src/components/incidents/incidentSchema';

// SEE: #4094
test.describe('Incident form schema', () => {
  const incident = {
    title: 'Title',
    description: 'Description',
    date: '2020-01-01',
    AllegedDeployerOfAISystem: ['Deployer'],
    AllegedDeveloperOfAISystem: ['Developer'],
    AllegedHarmedOrNearlyHarmedParties: ['Harmed'],
    implicated_systems: ['System'],
    editors: ['editor'],
    editor_notes: '',
  };

  test('A new incident requires Implicated Systems', async () => {
    await expect(schema.isValid({ ...incident, implicated_systems: [] })).resolves.toBe(false);
    await expect(schema.isValid(incident)).resolves.toBe(true);
  });

  test('A legacy incident whose Implicated Systems were blank when opened can be saved with the field blank', async () => {
    const legacy = { ...incident, implicated_systems: [] };

    const optionalEntityFields = legacyEmptyEntityFields(legacy);

    expect(optionalEntityFields).toEqual(['implicated_systems']);

    const editSchema = createIncidentSchema({ optionalEntityFields });

    await expect(editSchema.isValid(legacy)).resolves.toBe(true);

    // Only the fields that were blank are relaxed.
    await expect(editSchema.isValid({ ...legacy, AllegedDeployerOfAISystem: [] })).resolves.toBe(false);
  });

  test('A field that was filled in when opened stays required', async () => {
    const editSchema = createIncidentSchema({ optionalEntityFields: legacyEmptyEntityFields(incident) });

    await expect(editSchema.isValid({ ...incident, implicated_systems: [] })).resolves.toBe(false);
  });

  test('legacyEmptyEntityFields accepts the incident as the API returns it', async () => {
    expect(
      legacyEmptyEntityFields({
        AllegedDeployerOfAISystem: [{ name: 'Deployer' }],
        AllegedDeveloperOfAISystem: null,
        AllegedHarmedOrNearlyHarmedParties: [],
        implicated_systems: undefined,
      })
    ).toEqual(['AllegedDeveloperOfAISystem', 'AllegedHarmedOrNearlyHarmedParties', 'implicated_systems']);
  });
});
