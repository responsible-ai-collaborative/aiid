import { ObjectId } from 'bson';
import { DBUser } from '../../../server/interfaces';

const users: DBUser[] = [
    {
        userId: '6737a6e881955aa4905ccb04',
        first_name: "Test",
        last_name: "User",
        roles: ["admin", "incident_editor"],
    },
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd9"),
        userId: "619b47ea5eed5334edfa3bbc",
        roles: ["admin"],
        first_name: "John",
        last_name: "Doe"
    },
    {
        userId: '6732f6z881832sd4905acb05',
        first_name: "Test",
        last_name: "User Editor",
        roles: ["incident_editor"],
    },
]

export default users;