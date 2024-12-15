const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app.js');

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DB connection successful!'));

const port = process.env.SERVER_PORT;

const server = app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}...`);
});
