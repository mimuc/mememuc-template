//index.js
import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";

const mongod = await MongoMemoryReplSet.create({
  instanceOpts: [{ port: 65535 }],
  replSet: {
    storageEngine: "wiredTiger",
  },
});

const uri = mongod.getUri();

console.log(uri);

await mongoose.connect(uri, {});
