import { ObjectId } from 'bson';

interface DBEntityDuplicate {
    _id: ObjectId;
    duplicate_entity_id: string;
    true_entity_id: string;
}

const items: DBEntityDuplicate[] = [
    {
        _id: new ObjectId("64ce00000000000000000001"),
        duplicate_entity_id: 'starbucs-typo',
        true_entity_id: 'starbucks',
    },
];

export default items;