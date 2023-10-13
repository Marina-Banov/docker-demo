const db = require("../persistence");

module.exports = async (req, res) => {
  const item = await db.updateItem(req.params.id, {
    name: req.body.name,
    liked: req.body.liked,
  });
  res.send(item);
};
