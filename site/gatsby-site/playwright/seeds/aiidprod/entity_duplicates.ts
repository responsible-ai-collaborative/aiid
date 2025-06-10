import { ObjectId } from 'bson';
import { DBEntityDuplicate } from '../../../server/interfaces';

const items: DBEntityDuplicate[] = [
    {
        _id: new ObjectId("64ce00000000000000000001"),
        duplicate_entity_id: 'starbucs-typo',
        true_entity_id: 'starbucks',
    },
];

export default items;