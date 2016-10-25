var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  name : String,
  spotifyID : String,
  chordialID : String,
  friends : [String],
  tracks : [String]
});

module.exports = mongoose.model('User',UserSchema);
