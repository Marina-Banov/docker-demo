const db = require("../persistence");

module.exports = async function shutdown() {
  return db.teardown();
}
