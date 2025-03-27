const path = require('path');

const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const config = require('../config');

const createBackupsPage = (_, createPage) => {
  return new Promise((resolve, reject) => {
    try {
      const S3 = new S3Client({
        region: 'auto',
        endpoint: `https://${config.cloudflareR2.accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: config.cloudflareR2.accessKeyId,
          secretAccessKey: config.cloudflareR2.secretAccessKey,
        },
      });

      resolve(
        S3.send(new ListObjectsV2Command({ Bucket: config.cloudflareR2.bucketName })).then(
          (result) => {
            const backups = result.Contents ?? [];

            backups.sort(function (a, b) {
              if (a.Key < b.Key) {
                return 1;
              }
              if (a.Key > b.Key) {
                return -1;
              }
              return 0;
            });

            createPage({
              path: '/research/snapshots',
              component: path.resolve('./src/templates/backups.js'),
              context: {
                backups,
              },
            });
          }
        )
      );
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = createBackupsPage;
