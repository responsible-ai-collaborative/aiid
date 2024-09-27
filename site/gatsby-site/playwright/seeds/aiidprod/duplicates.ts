import { ObjectId } from 'bson';
import { Duplicate } from '../../../server/generated/graphql'

export type DBDuplicate = Duplicate;

const items: DBDuplicate[] = [
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd7"),
        duplicate_incident_number: 5,
        true_incident_number: 3,
    },
]

export default items;