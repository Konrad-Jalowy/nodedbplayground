const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
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
  },
  address: 
   {
      type: mongoose.Schema.ObjectId,
      ref: 'Address'
   }
}, {timestamps: true}
);
personSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'address',
      select: '-__v'
    });
  
    next();
  });


module.exports = mongoose.model('Person', personSchema);