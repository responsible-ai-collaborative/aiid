import { Entity_Relationship } from '../../../server/generated/graphql'

type DBEntity_Relationship = Omit<Entity_Relationship, 'sub' | 'obj'>
& { sub: string } & {obj: string};

const entity_relationships: DBEntity_Relationship[] = [
  {
    sub: 'entity-2',
    "obj": 'entity-3',
    "is_symmetric": true,
    pred: 'related',
  }
]

export default entity_relationships;