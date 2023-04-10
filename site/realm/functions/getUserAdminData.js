exports = async (source) => {
  
  const userApiResponse = await context.functions.execute('apiRequest', { method: 'GET', path: `/users/${source.userId}`});

  const response = {
    email: userApiResponse.data.email,
    creationDate: new Date(userApiResponse.creation_date * 1000),
    lastAuthenticationDate: new Date(userApiResponse.last_authentication_date * 1000),
    disabled: userApiResponse.disabled,
  }

  return response;
};
