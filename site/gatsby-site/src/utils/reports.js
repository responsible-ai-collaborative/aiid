// Transforms the data from the graphql query into a History_reportInsertInput format
export const transformReportData = (report, user) => {
  // eslint-disable-next-line no-unused-vars
  const { __typename, embedding, user: reportUser, ...result } = report;

  if (reportUser) {
    result.user = reportUser.userId;
  }

  if (embedding) {
    // eslint-disable-next-line no-unused-vars
    const { __typename, ...embeddingData } = embedding;

    result.embedding = embeddingData;
  }

  // Set the user as the last editor
  if (user && user.customData.first_name && user.customData.last_name) {
    result.editor = `${user.customData.first_name} ${user.customData.last_name}`;
  }

  return result;
};
