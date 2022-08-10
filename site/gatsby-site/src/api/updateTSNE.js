const { updateTsneInDatabase } = require('../utils/updateTsne');

export default async function updateTsne(req, res) {
  console.log('Running updateTsne');
  try {
    await updateTsneInDatabase();
  } catch (error) {
    res.status(300, { error });
  }
  res.status(200);
}
