import { ObjectId } from 'bson';
import { Subscription } from '../../../server/generated/graphql'

export type DBSubscription = Omit<Subscription, 'entityId' | 'incident_id' | 'userId'>
    & { entityId?: string, incident_id?: number, userId?: string };

const items: DBSubscription[] = [
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd7"),
        entityId: "entity-1",
        incident_id: undefined,
        type: "entity",
        userId: "user1",
    },
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd9"),
        entityId: undefined,
        incident_id: 1,
        type: "incident",
        userId: "user1",
    },
    {
        _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e7'),
        entityId: undefined,
        incident_id: 1,
        type: "incident",
        userId: 'user1',
    }
]

export default items;