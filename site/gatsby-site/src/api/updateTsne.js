const { updateTsneInDatabase } = require('../utils/updateTsne.js');

export default async function updateTsne(req, res) {
  console.log('Running updateTsne');
  try {
    await updateTsneInDatabase();
  } catch (error) {
    res.status(300, { error });
  }
  res.status(204); // No content
}

// This is necessary because of a bug in uglify-js
// that occurs when used with webpack.
//
// <https://github.com/mishoo/UglifyJS/issues/3312>
module.exports = {
  external: {
    'uglify-js': 'uglify-js',
  },
};
