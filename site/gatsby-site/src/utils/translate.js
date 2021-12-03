const { Translate } = require('@google-cloud/translate').v2;

const config = require('../../config');

const translateClient = new Translate({ key: config.google.translateApikey });

async function translate({ payload, to }) {
  if (process.env.TRANSLATE_DRY_RUN === 'false') {
    return translateClient.translate(payload, { to });
  } else {
    return [payload.map((p) => `translated-${to}-${p}`)];
  }
}

module.exports = {
  translate,
};
