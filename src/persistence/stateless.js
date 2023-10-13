const fetch = require("node-fetch");
const {v4: uuid} = require("uuid");
let apiUrl = "http://numbersapi.com"

async function init() {
  return Promise.resolve();
}

async function teardown() {
  return Promise.resolve();
}

async function getItems() {
  const response = await fetch(`${apiUrl}/0,12,18,19,37,42,54,55,62,206?json`);
  const myJson = await response.json();
  return Object.entries(myJson).map((item, i) => ({
    id: i+1,
    name: item[1],
    liked: false,
  }));
}

async function getItem(id) {
  if (isNaN(parseInt(id))) {
    return {};
  }
  const response = await fetch(`${apiUrl}/${parseInt(id)}?json`);
  const myJson = await response.json();
  return Object.entries(myJson).map(item => ({
    id: uuid(),
    name: item[1],
    liked: false,
  }))[0];
}

async function storeItem(item) {
  return await getItem(item.name);
}

async function updateItem(id, item) {
  return Promise.resolve({ id: Number(id), ...item });
}

async function removeItem(id) {
  return Promise.resolve();
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
