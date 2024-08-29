import { Entity } from '../../../server/generated/graphql'

type DBEntity = Entity;

const entities: DBEntity[] = [
    {
        entity_id: 'entity1',
        name: 'Entity 1',
        created_at: new Date(1609459200000).toISOString(),
        date_modified: new Date(1609459200000).toISOString(),
    },

    {
        entity_id: 'entity2',
        name: 'Entity 2',
        created_at: new Date(1609459200000).toISOString(),
        date_modified: new Date(1609459200000).toISOString(),
    },

    {
        entity_id: 'entity3',
        name: 'Entity 3',
        created_at: new Date(1609459200000).toISOString(),
        date_modified: new Date(1609459200000).toISOString(),
    },
    {
        entity_id: 'starbucks',
        name: 'Starbucks',
        created_at: new Date(1609459200000).toISOString(),
        date_modified: new Date(1609459200000).toISOString(),
    },

    {
        entity_id: 'kronos',
        name: 'Kronos',
        created_at: new Date(1609459200000).toISOString(),
        date_modified: new Date(1609459200000).toISOString(),
    },

    {
        entity_id: 'starbucks-employees',
        name: 'Starbucks Employees',
        created_at: new Date(1609459200000).toISOString(),
        date_modified: new Date(1609459200000).toISOString(),
    },
]

export default entities;