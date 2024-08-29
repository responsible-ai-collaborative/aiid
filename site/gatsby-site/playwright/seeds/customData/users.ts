import { ObjectId } from 'bson';
import { User } from '../../../server/generated/graphql'

type DBUser = Omit<User, ''>

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
]

export default users;