import * as fs from "fs-extra";
import axios from "axios";
import { IDBEndpoint } from "../src/types";

const DB_URL = "https://somanyumbani_app:somanyumbani_app@db.somanyumbani.com";

async function main() {
  await populateDB("days");
  await populateDB("sessions");
}

/**
 * Populate database rows from json file. Merges data with existing rows (to not overwrite uploads where available)
 * @param database - suffix name of database to populate (e.g. 'days' will populate 'somanyumbani_days')
 * @param jsonPath - path to file with rows to update. Default will be scripts/data/{database}.json
 */
async function populateDB(database: IDBEndpoint, jsonPath?: string) {
  jsonPath = jsonPath || `scripts/data/${database}.json`;
  const dbDocsHash = await getAllDocsHash(`somanyumbani_${database}`);
  const localRows = fs.readJSONSync(jsonPath);
  localRows.forEach((row: any, index: number) => {
    if (row._id && dbDocsHash[row._id]) {
      localRows[index] = { ...dbDocsHash[row._id], ...row };
    }
  });
  const res = await postBatchDocs(`somanyumbani_${database}`, localRows);
  console.log(`[${database}] - ${localRows.length} rows populated`);
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
