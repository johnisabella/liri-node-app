//Code to read and set any environment variables with the dotenv package
require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdb = require("omdb");

//Pulls in key values stored in keys.js file
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//----------------------------------------------------------
// Code to initialize request for OMDB API calls.
var request = require('request');

//captures user input in Node and runs corresponding functions
var command = process.argv[2];
switch (command) {
  case "my-tweets":
  twitterFunction();
  break;

  case "spotify-this-song":
  spotifyFunction();
  break;

  case "movie-this":
  omdbFunction();
  break;

  case "do-what-it-says":
  otherFunction();
  break;
}

//---------------------------------------------------------
//Code that calls to the Twitter API
function twitterFunction (){

  var client = new Twitter(keys.twitter);

  var params = {screen_name: 'JohnIsabella', count: 20};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i<tweets.length; i++){
        console.log("Tweet text: " + tweets[i].text + ", Tweet created:" + tweets[i].created_at);
      };
    }
  });
};

//---------------------------------------------------------
//Code that calls to the Spotify API
function spotifyFunction (){

  var song = process.argv[3];
  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: 'track', query: song, limit: "1"}, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }
    // console.log(JSON.stringify(data, null, 2));
    for(var i = 0; i < data.tracks.items.length; i++){
      console.log("Artist: " + data.tracks.items[i].album.artists[0].name);
      console.log("Song Name: " + data.tracks.items[i].name);
      console.log("Spotify Preview Link: "+ data.tracks.items[i].preview_url);
      console.log("Album: " + data.tracks.items[i].album.name);
    }
    //else code
    //Make search query "I Saw the Sign" by Ace of Base
  });
};

//----------------------------------------------------------
//Code that calls to the OMDB API
function omdbFunction (){
  var movieName = process.argv[3];
  if (movieName === undefined) {

  var defaultQueryUrl = "http://www.omdbapi.com/?t=mr+nobody+&y=2009&plot=short&tomatoes=true&apikey=trilogy";
  request(defaultQueryUrl, function(error, response, body) {

    if (!error && response.statusCode === 200) {
    console.log("Movie Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
    console.log("Country(ies): " + JSON.parse(body).Country);
    console.log("Language(s): " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
  }
  });

} else {
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";
  // We then run the request module on a URL with a JSON
  request(queryUrl, function(error, response, body) {

    // If there were no errors and the response code was 200 (i.e. the request was successful)...
    if (!error && response.statusCode === 200) {
      console.log("Movie Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
      console.log("Country(ies): " + JSON.parse(body).Country);
      console.log("Language(s): " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
};
};

//-------------------------------------------------------------
function otherFunction (){
  var fs = require("fs");
  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");
    console.log(dataArr);

    // spotifyFunction () {
    // var command = dataArr[0];
    var song = dataArr[1];
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: song, limit: "1"}, function(err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
        return;
      }
      for(var i = 0; i < data.tracks.items.length; i++){
        console.log("Artist: " + data.tracks.items[i].album.artists[0].name);
        console.log("Song Name: " + data.tracks.items[i].name);
        console.log("Spotify Preview Link: "+ data.tracks.items[i].preview_url);
        console.log("Album: " + data.tracks.items[i].album.name);
      }
    });
  });
};
