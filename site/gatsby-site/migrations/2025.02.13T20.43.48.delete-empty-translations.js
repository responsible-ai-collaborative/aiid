const languages = require('../i18n/config.json');

/**
 *
 * @param {{context: {client: import('mongodb').MongoClient}}} context
 */

exports.up = async ({ context: { client } }) => {
  const db = client.db('translations');

  for (const language of languages) {
    const name = `reports_${language.code}`;

    console.log(`Deleting empty translations from ${name}`);

    const translations = db.collection(name);

    const result = await translations.deleteMany({
      text: '',
    });

    console.log(`Deleted ${result.deletedCount} empty translations for ${language.code}`);
  }
};
