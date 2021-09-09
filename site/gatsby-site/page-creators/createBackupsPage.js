const path = require('path');

const createBackupsPage = (graphql, createPage) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          query AllS3Backups {
            allS3Object {
              nodes {
                Size
                LastModified
                Key
              }
            }
          }
        `
      ).then((result) => {
        if (result.errors) {
          console.log(result.errors); // eslint-disable-line no-console
          reject(result.errors);
        }
        const backups = result.data.allS3Object.nodes;

        backups.sort(function (a, b) {
          const bInt = Date.parse(b['LastModified']);

          const aInt = Date.parse(a['LastModified']);

          return bInt - aInt;
        });
        createPage({
          path: '/research/snapshots',
          component: path.resolve('./src/templates/backups.js'),
          context: {
            backups,
          },
        });
      })
    );
  });
};

module.exports = createBackupsPage;
