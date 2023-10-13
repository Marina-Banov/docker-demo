const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const location = "/etc/nos/docker-demo.db";

let db;

function init() {
  const dirName = require("path").dirname(location);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  const items = [
    { id: 1, name: "0 is the coldest possible temperature on the Kelvin scale.", liked: false },
    { id: 2, name: "12 is the number of people who have walked on the Moon.", liked: false },
    { id: 3, name: "18 is the number of levels in hell in the Chinese mythos.", liked: false },
    { id: 4, name: "19 is the final year a person is a teenager.", liked: false },
    { id: 5, name: "37 is the cost in cents of the Whopper Sandwich when Burger King first introduced it in 1957.", liked: false },
    { id: 6, name: "42 is the number of kilometers in a marathon.", liked: false },
    { id: 7, name: "54 is the score in golf colloquially referred to as a perfect round.", liked: false },
    { id: 8, name: "55 is the number of Delegates who attended the United States Constitutional Convention in 1787.", liked: false },
    { id: 9, name: "62 is the number which Sigmund Freud has an irrational fear of.", liked: false },
    { id: 10, name: "206 is the number of bones in the typical adult human body.", liked: false },
  ];

  return new Promise((acc, rej) => {
    db = new sqlite3.Database(location, err => {
      if (err) return rej(err);
      console.log(`Using sqlite database at ${location}`);
      db.exec(
        "CREATE TABLE facts (id varchar(36), name varchar(255), liked boolean, UNIQUE(id));"+
        "INSERT OR IGNORE INTO facts (id, name, liked) VALUES " + [items.map(item => `(${item.id}, "${item.name}", ${item.liked})`)],
        err => {
          if (err) {
            if (err.message === "SQLITE_ERROR: table facts already exists") {
              return acc();
            }
            return rej(err);
          }
          acc();
        },
      );
    });
  });
}

async function teardown() {
  return new Promise((acc, rej) => {
    db.close(err => {
      if (err) rej(err);
      else acc();
    });
  });
}

async function getItems() {
  return new Promise((acc, rej) => {
    db.all("SELECT * FROM facts", (err, rows) => {
      if (err) return rej(err);
      acc(
        rows.map(item =>
          Object.assign({}, item, {
            liked: item.liked === 1,
          }),
        ),
      );
    });
  });
}

async function getItem(id) {
  return new Promise((acc, rej) => {
    db.all("SELECT * FROM facts WHERE id=?", [id], (err, rows) => {
      if (err) return rej(err);
      acc(
        rows.map(item =>
          Object.assign({}, item, {
            liked: item.liked === 1,
          }),
        )[0],
      );
    });
  });
}

async function storeItem(item) {
  return new Promise((acc, rej) => {
    db.run(
      "INSERT INTO facts (id, name, liked) VALUES (?, ?, ?)",
      [item.id, item.name, item.liked ? 1 : 0],
      err => {
        if (err) return rej(err);
        acc(item);
      },
    );
  });
}

async function updateItem(id, item) {
  await new Promise((acc, rej) => {
    db.run(
      "UPDATE facts SET name=?, liked=? WHERE id=?",
      [item.name, item.liked ? 1 : 0, id],
      err => {
        if (err) return rej(err);
        acc();
      },
    );
  });
  return getItem(id);
}

async function removeItem(id) {
  return new Promise((acc, rej) => {
    db.run("DELETE FROM facts WHERE id = ?", [id], err => {
      if (err) return rej(err);
      acc();
    });
  });
}

module.exports = {
  init,
  teardown,
  getItems,
  getItem,
  storeItem,
  updateItem,
  removeItem,
};
