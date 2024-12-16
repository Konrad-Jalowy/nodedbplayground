const mongoose = require('mongoose');

const addrSchema = new mongoose.Schema({
  street: String,
  houseNumber: String,
  city: String,
  zipCode: String
}
);



module.exports = mongoose.model('Address', addrSchema);