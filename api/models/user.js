var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  name : String,
  spotifyID : String,
  friends : [{type : String}]
});

module.exports = mongoose.model('User',UserSchema);
