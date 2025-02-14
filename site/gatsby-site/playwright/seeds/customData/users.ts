import { ObjectId } from 'bson';
import { DBUser } from '../../../server/interfaces';

const users: DBUser[] = [
    {
        userId: '6737a6e881955aa4905ccb04',
        first_name: "Test",
        last_name: "User",
        roles: ["admin"],
    },
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd9"),
        userId: "619b47ea5eed5334edfa3bbc",
        roles: ["admin"],
        first_name: "John",
        last_name: "Doe"
    },
    {
        _id: new ObjectId("619b47eb5eed5334edfa3ba9"),
        userId: '67a371b3fc0f0b924a91f636',
        first_name: "Test",
        last_name: "User Editor",
        roles: ["incident_editor"],
    },
]

export default users;