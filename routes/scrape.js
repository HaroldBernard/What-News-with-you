// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function(app) {
// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.foxnews.com/sports#").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".article-list article").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.headline = $(element)
                .parent()
                .prev()
                .children("h3")
                .text()
            result.title = $(element)
                .children(".info")
                .children("header")
                .children("h4")
                .children('a')
                .text();
            result.link = $(element)
                .children(".info")
                .children("header")
                .children("h4")
                .children('a')
                .attr('href');
            if (result.link.indexOf("http")) {
                result.link = "https://www.foxnews.com/" + result.link
            }
            result.summary = $(element)
                .children(".info")
                .children(".content")
                .children("p")
                .children('a')
                .text();
            result.imageURL = $(element)
                .children(".m")
                .children("a")
                .children("img")
                .attr('src');
                
                // Create a new Article using the `result` object built from scraping
                db.Article.deleteMany(result)
                .then(function (dbArticle) {
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
                })
        });

        // Send a message to the client
        res.send("Scrape Complete");
    });
});
}