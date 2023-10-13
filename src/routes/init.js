const db = require("../persistence");

module.exports = async function init() {
  return db.init();
}
