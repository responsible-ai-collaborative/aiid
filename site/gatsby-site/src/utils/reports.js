import { Operation, diff } from 'json-diff-ts';
import supportedLanguages from '../components/i18n/languages.json';

// Transforms the data from the graphql query into a History_reportInsertInput format
export const transformReportData = (report, user) => {
  const result = {
    ...report,
    __typename: undefined,
  };

  const { embedding, user: reportUser } = report;

  if (reportUser) {
    result.user = reportUser.userId;
  }

  if (embedding) {
    const embeddingData = {
      ...embedding,
      __typename: undefined,
    };

    result.embedding = embeddingData;
  }

  result.modifiedBy = user && user.providerType != 'anon-user' ? user.id : '';

  return result;
};

// Deletes the __typename field from the report object
export const deleteReportTypenames = (report) => {
  delete report.__typename;
  delete report.embedding?.__typename;
  delete report._id;

  return report;
};

const REPORT_FIELDS_TO_COMPARE = {
  url: 'Report Address',
  title: 'Title',
  authors: 'Author CSV',
  submitters: 'Submitter CSV',
  date_published: 'Date Published',
  date_downloaded: 'Date Downloaded',
  cloudinary_id: 'Image',
  text: 'Text',
  language: 'Language',
  tags: 'Tags',
  editor_notes: 'Editor Notes',
  inputs_outputs: 'Inputs / Outputs',
};

export const getReportChanges = (oldVersion, newVersion) => {
  const diffData = diff(oldVersion, newVersion);

  const result = [];

  for (const field of Object.keys(REPORT_FIELDS_TO_COMPARE)) {
    const fieldDiffs = diffData.filter((diff) => diff.key == field);

    if (fieldDiffs && fieldDiffs.length > 0) {
      for (const fieldDiff of fieldDiffs) {
        if (fieldDiff.embeddedKey && fieldDiff.changes) {
          const removed = [];

          const added = [];

          for (const change of fieldDiff.changes) {
            if (change.type == Operation.UPDATE) {
              removed.push(change.oldValue?.trim());
              added.push(change.value?.trim());
            } else if (change.type == Operation.ADD) {
              added.push(change.value?.trim());
            } else if (change.type == Operation.REMOVE) {
              removed.push(change.value?.trim());
            }
          }

          //Remove duplicates
          const removedClean = removed.filter((item) => !added.includes(item));

          const addedClean = added.filter((item) => !removed.includes(item));

          if (addedClean.length > 0 || removedClean.length > 0) {
            result.push({
              field: REPORT_FIELDS_TO_COMPARE[field],
              type: 'list',
              removed: removedClean,
              added: addedClean,
            });
          }
        } else {
          if (fieldDiff.value) {
            if (Array.isArray(fieldDiff.value)) {
              result.push({
                field: REPORT_FIELDS_TO_COMPARE[field],
                type: 'list',
                removed: [],
                added: fieldDiff.value,
              });
            } else if (field == 'language') {
              result.push({
                field: REPORT_FIELDS_TO_COMPARE[field],
                type: 'text',
                oldValue: supportedLanguages.find((l) => l.code == fieldDiff.oldValue)?.name,
                newValue: supportedLanguages.find((l) => l.code == fieldDiff.value)?.name,
              });
            } else if (field == 'cloudinary_id') {
              result.push({
                field: REPORT_FIELDS_TO_COMPARE[field],
                type: 'image',
                oldValue: fieldDiff.oldValue,
                newValue: fieldDiff.value,
              });
            } else if (field == 'text') {
              result.push({
                field: REPORT_FIELDS_TO_COMPARE[field],
                type: 'rich_text',
                oldValue: fieldDiff.oldValue,
                newValue: fieldDiff.value,
              });
            } else {
              result.push({
                field: REPORT_FIELDS_TO_COMPARE[field],
                type: 'text',
                oldValue: fieldDiff.oldValue,
                newValue: fieldDiff.value,
              });
            }
          }
        }
      }
    }
  }

  return result;
};
