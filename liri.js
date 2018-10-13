// import modules and packages
const request = require("request");
const fs = require("fs");
const Spotify = require("node-spotify-api");
const moment = require("moment");
const command = process.argv[2];
const argument = process.argv.slice(3).join(" ");

// turn on dotenv to load up environment variables from .env

require("dotenv").config();

const spotifyKeys = require("./keys.js");

// turn on new spotify app

const spotify = new Spotify(spotifyKeys.spotify);



function comQue(prompt, query) {
    switch (prompt) {
        case "concert-this":

            console.log("concert-this");
            var concertThis = function () {

                request(`https://rest.bandsintown.com/artists/${query}/events?app_id=codingbootcamp`, function (error, response, body) {
                    if (!error && response.statusCode === 200) {

                        // console.log(JSON.parse(body));
                        jBody = JSON.parse(body);
                        for (i = 0; i < jBody.length; i++) {
                            console.log(`
======================
Venue Name: ${jBody[i].venue.name}
Location: ${jBody[i].venue.city}, ${jBody[i].venue.region}, ${jBody[i].venue.country}
Event Date: ${moment((jBody[i].datetime).slice(0, 10), "YYYY-MM-DD").format("MM-DD-YYYY")}
======================`);
                        }
                        // Event Date: ${moment(jBody[i].datetime, "MM/DD/YYYY")}
                    } else {
                        console.log("error has occured");
                    }
                })
            };
            concertThis();
            break;
        case "spotify-this-song":

            var spotifyThis = function () {
                if (!query) {
                    query = "The Sign"
                }

                spotify.search({ type: 'track', query: query, limit: 20 }, function (err, data) {

                    if (err) {
                        console.log("spotify error")
                        return false;
                    } else {
                        for (i = 0; i < 20; i++) {
                            console.log(`
==========
Artist(s): ${data.tracks.items[i].artists[0].name}
Song Name: ${data.tracks.items[i].name}
Preview Link: ${data.tracks.items[i].external_urls.spotify}
Album Name: ${data.tracks.items[i].album.name}
==========`)

                        }
                    }
                })
            }
            console.log("spotify-this-song");
            spotifyThis();
            break;
        case "movie-this":
            console.log("movie-this");

            var movieThis = function () {
                if (!query) {
                    query = "Mr. Nobody"
                }
                request(`http://www.omdbapi.com/?t=${query}&y=&plot=short&apikey=trilogy`, function (error, response, body) {

                    // If the request is successful (i.e. if the response status code is 200)
                    if (!error && response.statusCode === 200) {

                        console.log(`Title: ${JSON.parse(body).Title}`);
                        console.log(`Release Year: ${JSON.parse(body).Year}`);
                        console.log(`IMDB Rating: ${JSON.parse(body).imdbRating}`);
                        console.log(`Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}`);
                        console.log(`Country of Production: ${JSON.parse(body).Country}`);
                        console.log(`Language: ${JSON.parse(body).Language}`);
                        console.log(`Plot: ${JSON.parse(body).Plot}`);
                        console.log(`Actors: ${JSON.parse(body).Actors}`);
                    } else {
                        console.log("Uh oh, something went wrong!");
                    }
                })
            };
            movieThis();
            break;
        case "do-what-it-says":
            console.log("do-what-it-says");


            fs.readFile("random.txt", "utf8", function (err, data) {
                if (err) {
                    console.log("error")
                    return
                }


                var queData = data.split(",");
                comQue(queData[0], queData[1]);
            })



            break;
        default:
            console.log("nothing for now")
    }

}

comQue(command, argument);