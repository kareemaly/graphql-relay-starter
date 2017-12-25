const Q = require('q');
const _ = require('lodash');

function getUniqueIds(array) {
  return _.uniqWith(array, checkEqualIds);
}

/**
 * Get id from mongoose relation
 * @param {Object|string} object Mongoose document or id
 */
function getDocumentId(object) {
  return (object instanceof Object) && object._id ? String(object._id) : String(object);
}

/**
 * Check if two mongoose documents ids are equal
 * @param  {Object} doc1
 * @param  {Object} doc2
 * @return {boolean}
 */
function checkEqualIds(doc1, doc2) {
  return getDocumentId(doc1) === getDocumentId(doc2);
}

module.exports = {
  getUniqueIds,
  getDocumentId,
  checkEqualIds,
};
