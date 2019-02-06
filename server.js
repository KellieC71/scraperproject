var express = require("express");
// var logger = require("morgan");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var databaseURL = "scraper"
var collections = ["scrapedata"];
var PORT = 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/unit18Populater";
// app.use(logger("dev"));
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://ckeabcuitino5:Emmabelle24@ds119755.mlab.com:19755/heroku_1sz06gp2",
  {
    useMongoClient: true
  });
app.get("/scrape", function (req, res) {
  axios.get("https://news.ycombinator.com//").then(function (response) {

    //Where is html created? You're using it here but I don't see where you got html. As of now this doesn't load anything.
    var $ = cheerio.load(response.data);
    $("article h2").each(function (i, element) {
      var result = {};
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      //This wasn't attached to anything so I commented it out to prevent an error.
      // attr("href");

      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
    res.send("complete");
  });
});



// Pretty sure this was also giving you a bug because it's an extra set that you don't need.
// });


//Looks good
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

//Looks good, but I'm not sure if that "note" should be capital. Try both options and see which one works.
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


//Looks good
app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


app.listen(PORT, function () {
  console.log("App running on port 3000");
});

