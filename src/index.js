const express = require("express");
const app = express();
const getItems = require("./routes/getItems");
const addItem = require("./routes/addItem");
const updateItem = require("./routes/updateItem");
const deleteItem = require("./routes/deleteItem");
const init = require("./routes/init")
const shutdown = require("./routes/shutdown")

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(__dirname + "/static"));

app.get("/items", getItems);
app.post("/items", addItem);
app.put("/items/:id", updateItem);
app.delete("/items/:id", deleteItem);

init().then(() => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

const gracefulShutdown = () => {
  shutdown()
  .catch(() => {})
  .then(() => process.exit());
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("SIGUSR2", gracefulShutdown); // Sent by nodemon
