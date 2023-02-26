const express = require("express");
const mongo = require("mongodb").MongoClient;
const cors = require("cors");
const port = process.env.PORT || 3000;
const Db = process.env.DATABASE_URL;
const DbName = process.env.DATABASE_NAME;

const app = express();

app.use(express.json());

// CORS for Cross Domain Access
// Add whitelisted sites
// () for all
// let corsOptions = {
//   methods: "GET,POST,PUT,DELETE",
//   origin: "https://mustbebuilt.github.io"
// }

// app.use(cors(corsOptions));

var ObjectId = require("mongodb").ObjectId;

// GET ALL
app.get("/api/films", async (req, res) => {
  let allFilms = await filmsCollection.find({}).toArray();
  res.json(allFilms);
});
// GET BY _ID
app.get("/api/films/:filmID", async (req, res) => {
  let filmID = req.params.filmID;
  var o_id = new ObjectId(filmID);
  var oneFilm = await filmsCollection.find({ _id: o_id }).toArray();
  console.dir(oneFilm);
  res.json(oneFilm[0]);
});
// POST TO INSERT
app.post("/api/films", (req, res) => {
  var newFilm = req.body;
  console.dir(newFilm);
  filmsCollection.insertOne(newFilm, function (err, dbResp) {
    if (err) {
      console.error(err);
    }
    console.dir(dbResp);

    if (dbResp.acknowledged) {
      var objectId = newFilm._id;
      res.json({ _id: objectId });
    } else {
      res.json({ not_inserted: 1 });
    }
  });
});
// PUT TO UPDATE
app.put("/api/films/:filmID", (req, res) => {
  let filmID = req.params.filmID;
  let o_id = new ObjectId(filmID);
  let editFilm = req.body;
  let updatedFilm = { $set: editFilm };
  console.dir(editFilm);
  filmsCollection.updateOne({ _id: o_id }, updatedFilm, function (err, dbResp) {
    if (err) {
      console.error(err);
    }
    console.dir(dbResp);

    if (dbResp.modifiedCount == 1) {
      res.json({ updated: 1 });
    } else {
      res.json({ updated: 0 });
    }
  });
});
// DELETE
app.delete("/api/films/:filmID", async (req, res) => {
  let filmID = req.params.filmID;
  let o_id = new ObjectId(filmID);
  filmsCollection.deleteOne({ _id: o_id }, function (err, dbResp) {
    if (err) {
      console.error(err);
    }
    console.dir(dbResp);

    if (dbResp.deletedCount == 1) {
      res.json({ deleted: 1 });
    } else {
      res.json({ deleted: 0 });
    }
  });
});
/////////
// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = Db;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// client.connect((err) => {
//   const collection = client.db(DbName).collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

///////////
// DB config - Setup with MongoDb Atlas
// const mongo_username = "xxxxx";
// const mongo_password = "yyyyy";
// const url = `mongodb+srv://${mongo_username}:${mongo_password}@mycluster01.ica5f.azure.mongodb.net/myMoviesDb?retryWrites=true&w=majority`;
const url = Db;

let db, filmsCollection;

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err);
      return;
    }
    db = client.db(DbName);
    filmsCollection = db.collection("films");
  }
);

app.listen(port, () => console.log("Server ready"));
