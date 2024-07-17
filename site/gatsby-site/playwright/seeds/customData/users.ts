import { User } from '../../../server/generated/graphql'

type DBUser = Omit<User, ''>

const users: DBUser[] = [
    {
        userId: 'user1',
        first_name: "John",
        last_name: "Doe",
        roles: ["admin"],
    }

]

export default users;