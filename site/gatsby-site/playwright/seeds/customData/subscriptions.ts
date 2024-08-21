import { ObjectId } from 'bson';
import { Subscription } from '../../../server/generated/graphql'

export type DBSubscription = Omit<Subscription, 'entityId' | 'incident_id' | 'userId'>
    & { entityId: string, incident_id: number, userId: string };

const items: DBSubscription[] = [
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd7"),
        entityId: "entity1",
        incident_id: 1,
        type: "entity",
        userId: "user1",
    },
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd9"),
        entityId: "entity1",
        incident_id: 1,
        type: "entity",
        userId: "user1",
    },
]

export default items;