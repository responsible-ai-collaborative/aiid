import { ObjectId } from 'bson';
import { DBSubscription } from '../../../server/interfaces';

const items: DBSubscription[] = [
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd7"),
        entityId: "entity-1",
        incident_id: undefined,
        type: "entity",
        userId: "6737a6e881955aa4905ccb04",
    },
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd9"),
        entityId: undefined,
        incident_id: 1,
        type: "incident",
        userId: "6737a6e881955aa4905ccb04",
    },
    {
        _id: new ObjectId('60a7c5b7b4f5b8a6d8f9c7e7'),
        entityId: undefined,
        incident_id: 2,
        type: "incident",
        userId: '6737a6e881955aa4905ccb04',
    }
]

export default items;