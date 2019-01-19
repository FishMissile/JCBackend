const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;
const Gamedig = require("gamedig");
const _ = require("lodash");


//Server data
var serverinfo = [
  {
    mapname: "",
    id: 1,
    difficulty: "",
    gamemode: "",
    servername: "",
    currentwave: "",
    maxwaves: "",
  }
];
var playerlist = [];
var state;

var inputIP = "159.65.207.13"


//retrieve server data
/* setInterval(function(){serverQuery()},10000)
function serverQuery(){
Gamedig.query(
  {
    type: "killingfloor2",
    host: inputIP
  },
  function(e, state) {
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
        maxwaves: "",
      }
    ];
    serverinfo[0].mapname = state.map;
    serverinfo[0].gamemode = state.raw.game;
    serverinfo[0].servername = state.name
    serverinfo[0].currentwave = state.raw.rules.CurrentWave
    serverinfo[0].maxwaves = state.raw.rules.NumWaves

    //retrieve players
    for (let index = 0; index < state.players.length; index++) {
      //push players to playerlist
      playerlist.push(state.players[index]);
      //set gql index
      playerlist[index].id = index;
    }

    var info4 = state.raw.rules
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
      serverinfo[0].difficulty = Diff
    }
    console.log(playerlist);
    console.log(serverinfo);
  }
)} */

const Player = new GraphQLObjectType({
  name: "Player",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    score: { type: GraphQLString },
    time: { type: GraphQLString }
  })
});

const Server = new GraphQLObjectType({
  name: "Server",
  fields: () => ({
    id: { type: GraphQLInt },
    mapname: { type: GraphQLString },
    difficulty: { type: GraphQLString },
    gamemode: { type: GraphQLString },
    servername: { type: GraphQLString },
    currentwave: { type: GraphQLInt },
    maxwaves: { type: GraphQLInt }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    server: {
      type: Server,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return _.find(serverinfo, { id: args.id });
        //call the data
      }
    },
    servers: {
      type: new GraphQLList(Server),
      resolve(parents, args) {
        return serverinfo;
      }
    },
    player: {
      type: Player,
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return _.find(playerlist, { id: args.id });
      }
    },
    players: {
      type: new GraphQLList(Player),
      resolve(parents, args) {
        return playerlist;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
