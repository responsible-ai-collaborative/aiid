exports = async (authEvent) => {

  const mongodb = context.services.get("mongodb-atlas");
  const users = mongodb.db("customData").collection("users");

  const { user } = authEvent;
  const newUser = { userId: user.id, roles: ['subscriber'] };

  try {
    await users.insertOne(newUser);

  } catch (error) {
    error.message = `[On New User event]: ${error.message}`;
    context.functions.execute('logRollbar', { error, data: { newUser, user } });
    throw error;
  }
};
