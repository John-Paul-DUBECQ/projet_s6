const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://upjv2023:4JMiQkAQp0QCsTXT@ac-z5vtdb2-shard-00-00.twdmswi.mongodb.net:27017,ac-z5vtdb2-shard-00-01.twdmswi.mongodb.net:27017,ac-z5vtdb2-shard-00-02.twdmswi.mongodb.net:27017/?ssl=true&replicaSet=atlas-20zwsr-shard-0&authSource=admin&retryWrites=true&w=majority"


const app = express();
app.use(express.static('./public'));

app.get('/index', function (req, res) {
  return res.redirect('../index.html')
})
app.listen('8080');


app.use(express.urlencoded({ extended: true }));
app.get('/mongodb-data', function (req, res) {
  MongoClient.connect(url, function (err, client) {
    const db = client.db('dictionary');
    const collection = db.collection('words');
    collection.find({}).toArray(function (err, documents) {
      res.send(documents);
    });
  });
});

app.get('/search', function (req, res) {
  MongoClient.connect(url, function (err, client) {
    const db = client.db('dictionary');
    const collection = db.collection('words');
    collection.aggregate([
      { $match: { word: req.query.word } },
    ]).toArray(function (err, results) {
      if (err) throw err;
      res.send(results);
    });
  });
});

function getRandomWordByDate(callback, number) {
  const todayDate = new Date()
  const randomIndex = (todayDate.getMonth() * todayDate.getDate() * 445447 * todayDate.getFullYear() * 1259 * number) % 100169;
  MongoClient.connect(url, function (err, client) {
    const db = client.db('dictionary');
    const collection = db.collection('words');
    collection.find().skip(randomIndex).limit(1).toArray((err, result) => {
      if (err) {
        callback(err, null);
      } else {
        if (result[0].word.length >= 7 && result[0].word.length <=12) { // vérifier la longueur du mot ici
          callback(null, result[0].word);
        } else {
          //on cherche un autre mot au hasard mais ce sera le même pour tous
          getRandomWordByDate(callback, number + 567);
        }
      }
    });
  });
};

app.get('/getRandomWordByDate', (req, res) => {
  getRandomWordByDate((err, word) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.json(word);
    }
  }, 1);
});


const wordsNumber = 336530;

function getRandomWord(callback) {
  MongoClient.connect(url, function (err, client) {
    const db = client.db('dictionary');
    const collection = db.collection('words');
    collection.aggregate([{ $sample: { size: 1 } }]).toArray(
      function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          if (result[0].word.length >= 7 && result[0].word.length <= 12) { // vérifier la longueur du mot ici
            callback(null, result[0].word);
          } else {
            getRandomWord(callback);
          }
        }
      });
  });
}

app.get('/getRandomWord', (req, res) => {
  getRandomWord((err, word) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.json(word);
    }
  });
});


app.get('/search', function (req, res) {
  MongoClient.connect(url, function (err, client) {
    const db = client.db('dictionary');
    const collection = db.collection('words');
    collection.aggregate([
      { $match: { word: req.query.word } },
    ]).toArray(function (err, results) {
      if (err) throw err;
      res.send(results);
    });
  });
});

app.post("/saveRecord", function(req, res) {
  const record = {
    name: req.body.name,
    score: req.body.score,
    date: new Date()
  };
  MongoClient.connect(url, function (err, client) {
    const db = client.db('dictionary');
    db.collection("records").insertOne(record, function(err, result) {
      if (err) {
        console.error("Error saving record:", err);
        res.status(500).send("Error saving record");
      } else {
        console.log("Record saved successfully:", result);
        res.send("Record saved successfully");
      }
    });
  });
});
app.get('/getTopPlayersOfDay', (req, res) => {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(todayDate);
  nextDay.setDate(todayDate.getDate() + 1);
  MongoClient.connect(url, function (err, client) {
    const db = client.db('dictionary');
    const collection = db.collection('records');
    collection.aggregate([
      {
        $match: {
          date: { $gte: todayDate, $lt: nextDay }
        }
      },
      {
        $sort: {
          score: -1
        }
      },
      {
        $limit: 10
      }
    ]).toArray(function (err, result) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.json(result);
      }
    });
  });
});