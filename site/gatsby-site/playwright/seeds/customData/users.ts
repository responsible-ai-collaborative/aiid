import { ObjectId } from 'bson';
import { DBUser } from '../../../server/interfaces';

const users: DBUser[] = [
    {
        userId: 'user1',
        first_name: "Test",
        last_name: "User",
        roles: ["admin"],
    },
    {
        _id: new ObjectId("619b47eb5eed5334edfa3bd9"),
        userId: "619b47ea5eed5334edfa3bbc",
        roles: ["admin"],
        first_name: "Sean",
        last_name: "McGregor"
    },
    {
        _id: new ObjectId("648a4c0eaf3f54bf50f018a4"),
        userId: "648a4c0eaf3f54bf50f018a3",
        roles: ["admin"],
        first_name: "Cesar",
        last_name: "Ito"
    },
]

export default users;