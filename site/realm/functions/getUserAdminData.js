exports = async (source) => {

  const userApiResponse = await context.functions.execute('apiRequest', { method: 'GET', path: `/users/${source.userId}` });

  const response = {
    email: null,
    creationDate: null,
    lastAuthenticationDate: null,
    disabled: null,
  };

  if (userApiResponse.data) {

    response.email = userApiResponse.data.email;
    response.creationDate = new Date(userApiResponse.creation_date * 1000);
    response.lastAuthenticationDate = new Date(userApiResponse.last_authentication_date * 1000);
    response.disabled = userApiResponse.disabled;
  }

  return response;
};
