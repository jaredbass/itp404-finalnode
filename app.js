var express = require('express')
var app = express()
var Sequelize = require('sequelize');
var cors = require('cors'); // Cross Origin Resource Sharing
var mysql = require ('mysql');
var bodyParser = require ('body-parser');

var DB_NAME = process.env.DB_NAME;
var DB_USER = process.env.DB_USER;
var DB_PASSWORD = process.env.DB_PASSWORD;

var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
    _socket: '/var/lib/mysql/mysql.sock',
define: {
freezeTableName:true
}
  
});


var Spotify = sequelize.define('mainSpotify', {
songName: {
    type: Sequelize.STRING
  },
artistName:{
type: Sequelize.STRING
}, 
albumName:{
type:Sequelize.STRING}
}, {
  timestamps: false
});
app.use(cors());
app.use(bodyParser());

app.get('/api/music', function (request, response) {
  var promise = Spotify.findAll();
  promise.then(function(spotifies) {
    response.json({
data: spotifies
});
  });
})

app.post('/api/music', function (request, response){
var spotifies = Spotify.build({
songName: request.body.songName,
artistName: request.body.artistName,
albumName: request.body.albumName
});

spotifies.save().then(function(spotifies){
  response.json(spotifies);
});
});

app.delete('/api/music/:id', function(request, response){
 	Spotify.findById(request.params.id).then(function(spotifies){
 		if (spotifies) {
 			spotifies.destroy().then(function(){
 				response.json(spotifies);
 			});
 		}
 		else {
 			response.json({
 				message: 'Song not found'
 			});
 		}
 	});
});


app.listen(process.env.PORT || 3000);