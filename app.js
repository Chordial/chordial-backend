
var app = require('express')();
var SwaggerExpress = require('swagger-express-mw');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chordial196');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);
  console.log('Magic happens on port ' + port);
});
