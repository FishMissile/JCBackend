const express = require("express");
const path = require("path");
const app = express();
const request = require('request');
const port = process.env.PORT || 5000;
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const cors = require("cors");
const Gamedig = require("gamedig");


app.use(cors());

app.get('/recent/:key/:id', function (req, res) {
  const recentgames = "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=" + req.params.key + "&steamid=" + req.params.id + "&format=json"
  request(recentgames, function (err, response, body) {
    if (!err && response.statusCode < 400) {
      console.log(body);
      res.send(body);
    } else {
      console.log(response.statusCode)
    }
  });
});

app.get('/info/:key/:id', function (req, res) {
  const info = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + req.params.key + "&steamids=" + req.params.id + "&format=json"
  request(info, function (err, response, body) {
    if (!err && response.statusCode < 400) {
      console.log(body);
      res.send(body);
    } else {
      console.log(response.statusCode)
    }
  });
});

app.get('/games/:key/:id', function (req, res) {
  const games = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + req.params.key + "&steamid=" + req.params.id + "&format=json"
  console.log(games)
  request(games, function (err, response, body) {
    if (!err && response.statusCode < 400) {
      console.log(body);
      res.send(body);
    } else {
      console.log(response.statusCode)
    }
  });
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.js"));
  });
}
app.get("/query/:ip", function (req, res) {
  console.log(req.params.ip);
  var state;
  var inputIP = req.params.ip;
  Gamedig.query(
    {
      type: "killingfloor2",
      host: inputIP
    },
    function (e, state) {
      if (e) console.log("Server is offline");
      else console.log("Query Success!");

      res.send(serverinfo);

    }
  );


});
/* 
app.get("/query/:ip", function (req, res) {
  console.log(req.params.ip);
  var state;
  var inputIP = req.params.ip;
  Gamedig.query(
    {
      type: "killingfloor2",
      host: inputIP
    },
    function (e, state) {
      if (e) console.log("Server is offline");
      else console.log("Query Success!");
      playerlist = [];
      serverinfo = [
        {
          mapname: "",
          id: 1,
          difficulty: "",
          gamemode: "",
          servername: "",
          currentwave: "",
          maxwaves: ""
        },
        playerlist = []
      ];
      serverinfo[0].mapname = state.map;
      serverinfo[0].gamemode = state.raw.game;
      serverinfo[0].servername = state.name;
      serverinfo[0].currentwave = state.raw.rules.CurrentWave;
      serverinfo[0].maxwaves = state.raw.rules.NumWaves;

      //retrieve players
      for (let index = 0; index < state.players.length; index++) {
        //push players to playerlist
        serverinfo[1].push(state.players[index]);
        //set gql index
        serverinfo[1][index].id = index;
      }

      var info4 = state.raw.rules;
      if ((info4 = 0)) {
        var Diff = "Normal";
        serverinfo[0].difficulty = Diff;
      } else if ((info4 = 1)) {
        console.log("Difficulty: Hard");
        var Diff = "Hard";
        serverinfo[0].difficulty = Diff;
      } else if ((info4 = 2)) {
        console.log("Difficulty: Suicidal");
        var Diff = "Suicidal";
        serverinfo[0].difficulty = Diff;
      } else if ((info = 3)) {
        console.log("Difficulty: Hell on Earth");
        var Diff = "Hell on Earth";
        serverinfo[0].difficulty = Diff;
      }
      console.log(playerlist);
      console.log(serverinfo);
      res.send(serverinfo);
    }
  );
}); */
app.listen(port, () => console.log(`serverinfo:`));
