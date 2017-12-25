function getFullHostname(req) {
  return req.protocol + '://' + req.get('host');
}

function getFullUrl(req) {
  return req.protocol + '://' + req.get('host') + req.originalUrl;
}

const getReferrer = (req) => {
  return req.get('Referrer') || getFullHostname(req);
};

const addQueryParams = (url, query) => {
  const str = [];
  for (let p in query) {
    if (query.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(query[p]));
    }
  }
  return `${url}${url.indexOf('?' ) > -1 ? '&' : '?'}${str.join("&")}`;
};

module.exports = {
  getFullHostname,
  getFullUrl,
  getReferrer,
  addQueryParams,
};
