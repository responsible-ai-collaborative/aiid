import { ObjectId } from 'bson';
import { DBDuplicate } from '../../../server/interfaces';

const items: DBDuplicate[] = [
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd7"),
        duplicate_incident_number: 5,
        true_incident_number: 3,
    },
]

export default items;