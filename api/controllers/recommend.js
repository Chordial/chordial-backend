var Queue = (require('../models/user.js')).Queue;
var User = (require('../models/user.js')).User;
var Session = (require('../models/user.js')).Session;
var Track = (require('../models/user.js')).Track;
require('../helpers/helpusers.js')();

module.exports = {
    recommendPlaylist : recommendPlaylist
}

function recommendPlaylist(req, res)
{
  var allSongs = [];
  var dupeSongs = [];
  Session.findOne({sessionID : req.swagger.params.sessionId.value} , function(err, session) {
    if(err)
      console.log(err);
    session.users.forEach(function(user) {
      user.recommend().forEach(function(track) { //don't know how to get recommended tracks
        if (allSongs.indexOf(track) == -1)
          allSongs.push(track);
        else if (dupeSongs.indexOf(track) == -1)) {
          dupeSongs.push(track);
        }
      }
    )
    }
    .then(function(){
      Console.log(dupeSongs);
  return res.json(dupeSongs);
})

}

}
