const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]

  
  
}, {timestamps: true}
);
roomSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'members',
      select: '-__v -createdAt -updatedAt -hobbies'
    });
  
    next();
  });


module.exports = mongoose.model('Room', roomSchema);