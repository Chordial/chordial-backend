var Promise = require('promise');
var SpotifyWebApi = require('spotify-web-api-node');
var User = (require('../models/user.js')).User;
var Track = (require('../models/user.js')).Track;
require('../helpers/helpusers.js')();
var spotifyApi = new SpotifyWebApi({
  clientId : 'c0be0c89a1e241898635418ad5fbbbef',
  clientSecret : '5adebeaaee924c3cad12ed37545a8489',
  redirectUri : 'http://localhost:10010/user/callback'
});

module.exports = {
  authorizeUser: authorizeUser,
  authorizeTesting: authorizeTesting,
  detailMe: detailMe,
  detailFriends: detailFriends,
  addFriend: addFriend,
  myMusic: myMusic,
  deleteMusic: deleteMusic,
  shareCommon: shareCommon,
  getAll: getAll,
  getUser: getUser,
  deleteThemAll: deleteThemAll,
  addTrack: addTrack,
  recommend: recommend
};


 function authorizeTesting(req,res) {
   spotifyApi.authorizationCodeGrant(req.swagger.params.code.value)
   .then(function(data) {
     res.json(data.body.access_token);
   }, function(err) {
     console.log("Something went wrong! " + err);
     res.send(err);
   });
 }

function authorizeUser(req, res) {
  var id , name, chordialID;
  var code = req.swagger.params.code.value; //spotify code
  spotifyApi.authorizationCodeGrant(code)   //trades code
  .then(function(data){
    spotifyApi.setAccessToken(data.body.access_token);  //gets access
    res.json(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
    spotifyApi.getMe()    //Gets information about authorized user
    .then(function(data) {
      if (data.body.display_name === null)  //Spotify user no display name
        name = data.body.id;    //So chordial username is id
      else
        name = data.body.display_name; //Facebook user display name
      id = data.body.id;
      User.findOne({spotifyID:id}, function(err, user) {
        if (err)
            res.send(err);
        if (user === null){    //User not in database
            console.log('making new user');
            user = new User();        //
            user.spotifyID = id;          //
            console.log("id" + id);       //  These lines set up new user
            user.name = name;             //
            user.chordialID = user.id;    //
            user.save(function(err) {     //
              if (err)
                res.send(err);
              console.log('New Chordial User Created?!');
            });       // end of user save function
          }   //end of creating new user
          else {
            //console.log(user);   //displays existing user
          }
        });/*.then(function(){     //End of User.find -> sync top tracks and respond to server
          User.findOne({spotifyID:id}, function(err,user) {
            user.tracks = [];
            spotifyApi.getMyTopTracks({limit:50})
            .then(function(toptracks) {
              toptracks.body.items.forEach(function(track){
                user.tracks.push(track.name);
              });//Populates user tracks with id of top tracks
              user.save(function(err){
                if(err)
                  console.log(err);
              });
            },function(err) {
              console.log('Something went wrong!', err);
            });
          });
          res.json({ message:'200'});   //Send 200 or user ID
        });           // End of User.find.then  */
      }, function(err) {
        console.log('Something went wrong!', err); //Error of getMe .then
    });   //End of getMe .then
  });
} //End of authorization

function detailMe(req,res){
  myUser(spotifyApi, function(err, user) {
    if(err)
      console.log(err);
    res.json(user);
  });
}

function detailFriends(req,res){
  myUser(spotifyApi, function(err, user) {
    if(err)
      console.log(err);
    res.json(user.friends);
  });
}

function addFriend(req,res){
  myUser(spotifyApi, function(err,user) {
    if(err) console.log(err);
    User.findOne({name : req.swagger.params.friendName.value}, function(err2, userF) {
      if(err2) console.log(err2);
      if(userF === null)
        res.json({ message: "Sorry, that user does not exist"});
      else {
        user.friends.push(userF.name);
        user.save(function(err) {
          if(err)
            res.send(err);
          console.log("New friend " + req.swagger.params.friendName.value + " added");
          res.json({ message:'200'});
        });
      }
    });
  });
}
function deleteMusic(req,res){
  myUser(spotifyApi, function (err, user){
    if(err)
      console.log(err);
    user.tracks = [];
    user.save(function(err){
      if(err)
        console.log(err);
      });
    res.json({message:'200'});
    console.log(user.tracks);
    });
  }

  function myMusic(req,res){
    myUser(spotifyApi, function (err, user){
      user.tracks = [];
      spotifyApi.getMyTopTracks({limit:50})
      .then(function(toptracks) {
        console.log(toptracks);
        toptracks.body.items.forEach(function(track){
          console.log(track.id);
          console.log(track.name);
          Track.findOneAndUpdate(
            { trackID: track.id },
            { trackID: track.id, trackName: track.name },
            {new: true , upsert: true},
            function(err, track2) {
              console.log(track2);
              user.tracks.push(track2);
              user.save(function(err){
                if(err)
                  console.log(err);
              });
            });
          });
        res.json({message:'200'});
      });
    });
  }

function recommend(req,res) {
  var recommended = [];
  myUser(spotifyApi , function(err,user) {
    var seeds = user.tracks.map(function(track) {
      return(track.trackID);
    });
    spotifyApi.getRecommendations({seed_songs:[req.swagger.params.songs.value]})
    .then(function(rectracks) {
      console.log(rectracks.body.tracks.length);
      for (var i = 0 ; i < rectracks.body.tracks.length; i++)
      {
        recommended.push(rectracks.body.tracks[i].id);

      };
      res.json(recommended);
    },function(err) {
      console.log('Something went wrong!', err);
    });
  });
}

function shareCommon(req,res){
  var common = [];
  myUser(function(err, user) {
      User.findOne({spotifyID : req.swagger.params.idC.value}, function(err, userF) {
        if(err)
          res.send(err);
        for (var i = 0 ; i < user.tracks.length; i++)
          for (var j = 0; j < userF.tracks.length; j++){
            console.log(user.tracks[i]);
            console.log(user.tracks[j]);
            if((user.tracks[i].toString())===(userF.tracks[j].toString()))
              common.push(user.tracks[i].toString());}
      })
      .then(function(){
        console.log(common);
        res.json(common);
      });
    });
}

function addTrack(req,res){
  User.findOne({spotifyID:req.swagger.params.userName.value})
  .exec(function(err,user) {
    if(err)
      res.send(err);
    user.tracks.push(req.swagger.params.trackName.value);
    user.save(function(err2) {     //
      if (err2)
        res.send(err2);
      console.log('New track '+ req.swagger.params.trackName + ' added to user ' + req.swagger.params.userName.value);
    });       // end of user save function
  });
  res.json({message:'200'});
}

function getAll(req,res){
  User.find().select('-_id').select('-__v').exec(function(err, users) {
      if (err)
          res.send(err);
      res.json(users);
  });
}

function getUser(req,res){
  User.findOne({spotifyID:req.swagger.params.userName.value}).select('-_id').select('-__v')
  .exec(function(err,user) {
    if (err)
      console.log(err);
    res.json(user===null);
  });
}

function deleteThemAll(req,res){
  User.remove({} , function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'Database Successfully cleared'});
  });
}
