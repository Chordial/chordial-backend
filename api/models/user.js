var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrackSchema = new Schema({
  trackName : String,
  trackID : String
});

var UserSchema = new Schema({
  name : String,
  spotifyID : String,
  chordialID : String,
  friends : [String],
  tracks : [TrackSchema]
  //playLists:[PlayListSchema]
});

var PlayListSchema = new Schema({
  playListName : String,
  playListId : String,
  tracks : [TrackSchema]
});

var QueueSchema = new Schema({
  currentTrackName : String,
  isPaused : Boolean,
  seekTime : Number,
  trackList : [TrackSchema]
});

var SessionSchema = new Schema({
  sessionName : String,
  sessionID : String,
  users : [UserSchema],
  queue : QueueSchema
});

var GroupSchema  = new Schema({
  users : [UserSchema],
  playlist : PlayListSchema
});

var GuestSchema = new Schema({
  guestName : String,
});

module.exports.User = mongoose.model('User',UserSchema);
module.exports.Queue = mongoose.model('Queue',QueueSchema);
module.exports.Track = mongoose.model('Track',TrackSchema);
module.exports.Session = mongoose.model('Session',SessionSchema);
module.exports.Group = mongoose.model('Group',GroupSchema);
