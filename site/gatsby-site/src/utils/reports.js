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
