const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true
  },
  cash: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  hobbies: {
    type: [String]
  }
  
}, {timestamps: true}
);



module.exports = mongoose.model('User', userSchema);