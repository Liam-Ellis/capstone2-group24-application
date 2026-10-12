import { test, expect } from '@playwright/test';
const mongoose = require("mongoose")
const {Group} = require ("../../../../models")
const DATABASE_PATH = "mongodb://liam_db_user:LiamPassword@ac-h3febtm-shard-00-00.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-01.17jnurt.mongodb.net:27017,ac-h3febtm-shard-00-02.17jnurt.mongodb.net:27017/?ssl=true&replicaSet=atlas-12gxsl-shard-0&authSource=admin&appName=Capstone24"
mongoose.connect(DATABASE_PATH, {dbName: 'test'});


/**
 * @type {import("playwright-core").APIRequestContext}
 */
let apiContext;

//make sure these tests run one at a time, otherwise the tests editing the db would run at the same time as the tests checking the db.
test.describe.configure({ mode: 'series' }); 



    