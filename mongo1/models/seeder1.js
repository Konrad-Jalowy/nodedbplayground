const fs = require('fs').promises;
const mongoose = require('mongoose');

require('dotenv').config();

const User = require("./userModel");
const fname = process.argv[2] ?? "users1.json";

const importData = async (users) => {
    try {
      await User.create(users);
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
        const users = JSON.parse(data);
        importData(users);
    } catch (err) {
      console.log('error: ' + err)
    }
  })()