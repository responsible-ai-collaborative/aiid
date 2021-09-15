exports = async (authEvent) => {

  const mongodb = context.services.get("mongodb-atlas");
  const users = mongodb.db("customData").collection("users");

  const { user } = authEvent;
  const newUser = { userId: user.id, role: 'admin' };

  await users.insertOne(newUser);
};
