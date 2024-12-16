const fs = require('fs').promises;
const mongoose = require('mongoose');

require('dotenv').config();

const Address = require("./addressModel");
const fname = process.argv[2] ?? "addresses1.json";

const importData = async (addrs) => {
    try {
      await Address.create(addrs);
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
        const addrs = JSON.parse(data);
        importData(addrs);
    } catch (err) {
      console.log('error: ' + err)
    }
  })()