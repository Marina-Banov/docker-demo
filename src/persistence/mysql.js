const waitPort = require("wait-port");
const index = require("mysql2");

const {
  MYSQL_HOST: HOST,
  MYSQL_USER: USER,
  MYSQL_PASSWORD: PASSWORD,
  MYSQL_DATABASE: DATABASE,
} = process.env;

let pool;

async function init() {
  await waitPort({
    host: HOST,
    port: 3306,
    timeout: 10000,
    waitForDns: true,
  });

  pool = index.createPool({
    connectionLimit: 5,
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    charset: "utf8mb4",
    multipleStatements: true,
  });

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
    pool.query(
    "CREATE TABLE facts (id varchar(36), name varchar(255), liked boolean, unique(id)) DEFAULT CHARSET utf8mb4;" +
    "INSERT IGNORE INTO facts (id, name, liked) VALUES ?;",
    [items.map(item => [item.id, item.name, item.liked])],
    err => {
      if (err) {
        if (err.code === "ER_TABLE_EXISTS_ERROR") {
          return acc();
        }
        return rej(err);
      }
      acc();
    },
    );
  });
}

async function teardown() {
  return new Promise((acc, rej) => {
    pool.end(err => {
      if (err) rej(err);
      else acc();
    });
  });
}

async function getItems() {
  return new Promise((acc, rej) => {
    pool.query("SELECT * FROM facts", (err, rows) => {
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
    pool.query("SELECT * FROM facts WHERE id=?", [id], (err, rows) => {
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
    pool.query(
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
    pool.query(
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
    pool.query("DELETE FROM facts WHERE id = ?", [id], err => {
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
