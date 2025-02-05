import { ObjectId } from "bson";

const users = [
    {
        _id: new ObjectId("6737a6e881955aa4905ccb04"),
        email: "test.user@incidentdatabase.ai",
        emailVerified: new Date("2024-11-15T21:41:04.245Z"),
    },
    {
        _id: new ObjectId("67a371b3fc0f0b924a91f636"),
        email: "test.user.editor@incidentdatabase.ai",
        emailVerified: new Date("2024-11-15T21:41:04.245Z"),
    }
]

export default users;