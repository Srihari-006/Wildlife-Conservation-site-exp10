const { handleRequest } = require('../server');

module.exports = (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const requestedPath = requestUrl.searchParams.get('wildguard_path');

  if (requestedPath && requestedPath.startsWith('/')) {
    requestUrl.searchParams.delete('wildguard_path');
    const query = requestUrl.searchParams.toString();
    req.url = `${requestedPath}${query ? `?${query}` : ''}`;
  }

  return handleRequest(req, res);
};
