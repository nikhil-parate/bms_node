const { MongoClient } = require("mongodb");
require("dotenv").config();
const url = process.env.MONGODB_URL;
const dbName = 'BMS';
const client = new MongoClient(url);
const mongo = {
  db: null,
  async connect() {
    await client.connect();
    console.log("connected to mongodb");
    //db will be used for query.
    this.db = client.db(dbName);
    //console.log(this.db);
  },
};
module.exports = mongo;
