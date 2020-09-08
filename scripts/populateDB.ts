import * as fs from "fs-extra";
import axios from "axios";

const DB_URL = "https://somanyumbani_app:somanyumbani_app@db.somanyumbani.com";

async function main() {
  await uploadDailySessions();
  await uploadActivities();
}

async function uploadDailySessions() {
  const database = "somanyumbani_daily_sessions";
  const localJson = "scripts/data/daily_sessions.json";
  const dbDocsHash = await getAllDocsHash(database);
  const localRows = fs.readJSONSync(localJson);
  localRows.forEach((row, index) => {
    if (row._id && dbDocsHash[row._id]) {
      localRows[index] = { ...dbDocsHash[row._id], ...row };
    }
  });
  const res = await postBatchDocs(database, localRows);
  console.log("daily session upload summary:", res);
}
async function uploadActivities() {
  const database = "somanyumbani_activities";
  const localJson = "scripts/data/activities.json";
  const dbDocsHash = await getAllDocsHash(database);
  const localRows = fs.readJSONSync(localJson);
  localRows.forEach((row, index) => {
    if (row._id && dbDocsHash[row._id]) {
      localRows[index] = { ...dbDocsHash[row._id], ...row };
    }
  });
  const res = await postBatchDocs(database, localRows);
  console.log("activity upload summary:", res);
}
/**
 * Retrieve all docs from a couch database
 * @param database database name
 */
async function getAllDocs(database: string) {
  const url = `${DB_URL}/${database}/_all_docs?include_docs=true`;
  const docs = (await axios.get(url)).data.rows.map((r) => r.doc);
  return docs;
}
/**
 * Post multiple docs to a database
 * NOTE - overwrites any existing data
 */
async function postBatchDocs(database: string, docs: any[]) {
  const postUrl = `${DB_URL}/${database}/_bulk_docs`;
  const res = await axios.post(postUrl, { docs });
  return res.data;
}
/**
 * Get all docs and return as a hashmap by `_id`
 */
async function getAllDocsHash(database: string) {
  const docs = await getAllDocs(database);
  const hash = {};
  docs.forEach((doc) => (hash[doc._id] = doc));
  return hash;
}
main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
