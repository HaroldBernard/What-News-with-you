var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan")

// // Our scraping tools
// // Axios is a promised-based http library, similar to jQuery's Ajax method
// // It works on the client and on the server
// var axios = require("axios");
// var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware
app.use(logger("dev"))
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
require("./routes/index")(app);
require("./routes/articles")(app);
require("./routes/notes")(app);
require("./routes/scrape")(app);
require("./routes/saved")(app);


// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/news", { useNewUrlParser: true });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// Start the server
app.listen(PORT, function() {
  console.log("App running on http://localhost:" + PORT + " !");
});