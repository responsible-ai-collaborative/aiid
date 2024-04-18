exports = async (source) => {

  const { user } = context;

  const response = {
    email: null,
    creationDate: null,
    lastAuthenticationDate: null,
    disabled: null,
  };

  if (user.id === source.userId || user.custom_data.roles.includes('admin')) {

    const userApiResponse = await context.functions.execute('apiRequest', { method: 'GET', path: `/users/${source.userId}` });

    if (userApiResponse.data) {

      response.email = userApiResponse.data.email;
      response.creationDate = new Date(userApiResponse.creation_date * 1000);
      response.lastAuthenticationDate = new Date(userApiResponse.last_authentication_date * 1000);
      response.disabled = userApiResponse.disabled;
    }
  }

  return response;
};

if (typeof module === 'object') {
  module.exports = exports;
}