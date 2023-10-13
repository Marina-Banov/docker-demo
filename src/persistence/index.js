if (process.env.MYSQL_HOST) {
  module.exports = require("./mysql");
} else if (process.env.PERSISTENT === "true") {
  module.exports = require("./sqlite");
} else {
  module.exports = require("./stateless");
}
