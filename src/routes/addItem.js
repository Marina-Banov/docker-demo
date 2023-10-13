const db = require("../persistence");
const {v4 : uuid} = require("uuid");

module.exports = async (req, res) => {
  let item = {
    id: uuid(),
    name: req.body.name,
    liked: false,
  };
  item = await db.storeItem(item);
  res.send(item);
};
