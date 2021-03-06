var Queue = (require('../models/user.js')).Queue;
var User = (require('../models/user.js')).User;
var Session = (require('../models/user.js')).Session;
var Track = (require('../models/user.js')).Track;
//var Recommend = (require('../controllers/user.js'));
require('../helpers/helpusers.js')();
//require('../controllers/users.js')();

module.exports = {
    recommendPlaylist : recommendPlaylist
};

function recommendPlaylist(req, res)
{
  var allSongs = [];
  var dupeSongs = [];
  Session.findOne({sessionID : req.swagger.params.sessionId.value} , function(err, session) {
    if(err)
      console.log(err);
    for (var i = 0; i < session.users.length; i++) {
      for (var j = 0; j < session.users[i].tracks; j++) {
        if (allSongs.indexOf(session.users[i].tracks[j]) == -1)
          allSongs.push(session.users[i].tracks[j]);
        else if (dupeSongs.indexOf(session.users[i].tracks[j]) == -1) {
          dupeSongs.push(session.users[i].tracks[j]);
        }
      }
    }
    if (dupeSongs.length === 0) {
      if(sessions.users.length < 5) {
        for (var k = 0; k < 5; k++) {
          dupeSongs.push(session.users[0].tracks[k]);
        }
      }
      else {
        for(var l = 0; l < 5; l++){
          dupeSongs.push(session.users[l].tracks[l]);
        }
      }
    }
    res.json(recommend(dupeSongs));
  });
}
