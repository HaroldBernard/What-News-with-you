var db = require("../models");

module.exports = function (app) {
    app.post("/articleSaver/:id", function (req, res) {
        db.Article.findOne({
            _id: req.params.id
        })
        .then(function (saver) {
        var toBeSaved = {}
        toBeSaved.headline = saver.headline
        toBeSaved.title = saver.title,
            toBeSaved.summary = saver.summary,
            toBeSaved.link = saver.link,
            toBeSaved.imageURL = saver.imageURL

        db.Saved.insertMany(toBeSaved)
            .then(function (result) {
                console.log(result)
            })
            .catch(function (err) {
                // If an error occurred, log it
                console.log(err);
            });
        })
    })

    app.get('/saved', function (req, res) {
        db.Saved.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.render("saved", { dbArticle });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    })
}