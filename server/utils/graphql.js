const { fromGlobalId } = require('graphql-relay');

/**
 * Get actual id from relay global id
 * @param  {string} relayId
 * @return {string}
 */
const getActualId = (relayId) => {
  return fromGlobalId(relayId).id;
};

/**
 * Get actual ids from relay global ids
 * @param  {Array<string>} relayIds
 * @return {string}
 */
const getActualIds = (relayIds) => relayIds.map(getActualId);

module.exports = {
  getActualId,
  getActualIds,
};
