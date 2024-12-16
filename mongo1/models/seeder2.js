const fs = require('fs').promises;
const mongoose = require('mongoose');

require('dotenv').config();

const Room = require("./roomModel");
const fname = process.argv[2] ?? "rooms1.json";

const importData = async (rooms) => {
    try {
      await Room.create(rooms);
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
        const rooms = JSON.parse(data);
        importData(rooms);
    } catch (err) {
      console.log('error: ' + err)
    }
  })()