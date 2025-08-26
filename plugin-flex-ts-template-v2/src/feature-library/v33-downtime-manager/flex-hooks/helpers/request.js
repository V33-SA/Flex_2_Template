const request = async (path, manager, params) => {
  const body = {
    ...params,
    Token: manager.store.getState().flex.session.ssoTokenPayload.token,
  };

  const options = {
    method: 'POST',
    body: new URLSearchParams(body),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  };

  const { REACT_APP_SERVICE_BASE_URL } = process.env;
  try {
    const response = await fetch(`${REACT_APP_SERVICE_BASE_URL}/${path}`, options);
    if (!response.ok) {
      console.error('Error in request response not ok', response);
      return { statusCode: '500' };
    }
    const data = await response.json();
    console.log('Response from request', data);
    return data;
  } catch (e) {
    console.error('Error in request e', e);
    return { statusCode: '500' };
  }

/*  await fetch(`${REACT_APP_SERVICE_BASE_URL}/${path}`, options)
    .then(async (d) => {
      console.log('Response from request', d);
      return d.json();
    })
    .catch((e) => {
      console.error('Error in request', e);
      return { statusCode: '500' };
    });*/
};

export { request };
