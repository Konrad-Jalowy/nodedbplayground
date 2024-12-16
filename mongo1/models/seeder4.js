const fs = require('fs').promises;
const mongoose = require('mongoose');

require('dotenv').config();

const Person = require('./personModel');
const fname = process.argv[2] ?? "users1.json";

const importData = async (ppl) => {
    try {
      await Person.create(ppl);
      console.log(`Data successfully created from json file ${fname}!`);
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };
 
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        
        console.log("seeder running");
        const data = await fs.readFile(`${__dirname}/${fname}`, 'utf-8');
        const ppl = JSON.parse(data);
        importData(ppl);
    } catch (err) {
      console.log('error: ' + err)
    }
  })()