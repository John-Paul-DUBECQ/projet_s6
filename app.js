const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const url = process.env.MONGO_URI

const app = express();
app.use(express.static('./public'));

app.get('/index', function (req, res) {
  return res.redirect('../index.html')
})
app.listen('8080');


app.use(express.urlencoded({ extended: true }));
//savoir si un mot est dans le dico
app.get('/search', function (req, res) {
  MongoClient.connect(url, function (err, client) {
    const db = client.db('dictionary');
    const collection = db.collection('words');
    const wordUpperCase = req.query.word.toLowerCase()
    collection.aggregate([
      { $match: { word: wordUpperCase } },
    ]).toArray(function (err, results) {
      if (err) throw err;
      res.send(results);
    });
  });
});

//le number permet de prendre un nombre différent si il est trop petit ou trop grand et que ce soit tjrs le même
function getRandomWordByDate(callback, number) {
  const todayDate = new Date()
  const randomIndex = (todayDate.getMonth() * todayDate.getDate() * 445447 * todayDate.getFullYear() * 1259 * number) % 100169;//nombre suffisamment aléatoire
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

//génère un mot aléatoire basé sur une date
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

const wordsNumber = 336530;//nbr de mots au total
//renvoie un mot aléatoire
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

//enregistrer un score
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
//récupérer le top 10
app.get('/getTopPlayersOfDay', (req, res) => {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(todayDate);
  nextDay.setDate(todayDate.getDate() + 1);//entre aujourd'hui et demain
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