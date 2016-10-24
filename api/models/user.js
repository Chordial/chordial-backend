var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  name : String,
  spotifyID : String,
  chordialID : String,
  friends : [{type : String}]
});

module.exports = mongoose.model('User',UserSchema);
