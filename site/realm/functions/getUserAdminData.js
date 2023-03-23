exports = async (source) => {
  
  const userApiResponse = await context.functions.execute('apiRequest', { method: 'GET', path: `/users/${source.userId}`});
  
    // {
    //   "_id": "636eb28b0298163274712524",
    //   "domain_id": "636d9086f74bbcda747d56c5",
    //   "identities": [
    //     {
    //       "id": "636eb28b029816327471251a",
    //       "provider_type": "local-userpass",
    //       "provider_id": "636d9799d2a75aadf15afb4a",
    //       "provider_data": {
    //         "email": "mail@cesarvarela.com"
    //       }
    //     }
    //   ],
    //   "data": {
    //     "email": "mail@cesarvarela.com"
    //   },
    //   "sessions_valid_since": {
    //     "$numberInt": "1668199051"
    //   },
    //   "creation_date": {
    //     "$numberInt": "1668199051"
    //   },
    //   "last_authentication_date": {
    //     "$numberInt": "1678918007"
    //   },
    //   "disabled": false,
    //   "type": "normal"
    // }
  

  const response = {
    email: userApiResponse.data.email,
    creationDate: new Date(userApiResponse.creation_date * 1000),
    lastAuthenticationDate: new Date(userApiResponse.last_authentication_date * 1000),
    disabled: userApiResponse.disabled,
  }

  return response;
};
