const path = require('path');

const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const config = require('../config');

const createSnapshotsPage = (createPage, backups = [], excelExports = []) => {
  createPage({
    path: '/research/snapshots',
    component: path.resolve('./src/templates/backups.js'),
    context: { backups, excelExports },
  });
};

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
        forcePathStyle: true,
      });

      resolve(
        S3.send(new ListObjectsV2Command({ Bucket: config.cloudflareR2.bucketName })).then(
          (result) => {
            const allObjects = result.Contents ?? [];

            const excelExports = allObjects
              .filter(
                (obj) => obj.Key.startsWith('AIID_Excel_Export-') && obj.Key.endsWith('.xlsx')
              )
              .sort((a, b) => (a.Key < b.Key ? 1 : a.Key > b.Key ? -1 : 0));

            const backups = allObjects
              .filter((obj) => obj.Key.startsWith('backup-'))
              .sort((a, b) => (a.Key < b.Key ? 1 : a.Key > b.Key ? -1 : 0));

            createSnapshotsPage(createPage, backups, excelExports);
          }
        )
      );
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = createBackupsPage;
