const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models")
const mongoose = require("mongoose");

module.exports = function (app) {

    // A GET route for scraping the NPR website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.npr.org/sections/world/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);
            const arr = [];

            // Now, we grab every h2 within an article tag, and do the following:
            $("article.has-image").each(function (i, element) {
                // Save an empty result object
                const result = {};
                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("div", ".item-info-wrap")
                    .children("div")
                    .children("h2", ".title")
                    .children("a")
                    .text();
                result.teaser = $(this)
                    .children("div", ".item-info-wrap")
                    .children("div")
                    .children("p", ".teaser")
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("div", ".item-image")
                    .children("div")
                    .children("a")
                    .attr("href");
                console.log(result);
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });
            // Send a message to the client
            res.send("Scrape Complete");
        });
    });

    // save an article
    app.post("/api/save:id", function (req, res) {
        const str = req.params.id;
        const id = str.replace(":", "");

        db.Article.findById(id, function (err, article) {
            const artTitle = article.title;

            db.Saved.findOne({ title: artTitle }).exec(function (err, savedArt) {
                if (!savedArt) {
                    console.log("Article by that title not found in saved DB.")

                    const artObj = {};
                    artObj.title = article.title;
                    artObj.teaser = article.teaser;
                    artObj.link = article.link;

                    db.Saved.create(artObj)
                        .then(function (dbSaved) {
                            // View the added result in the console
                            console.log("this is the dbSaved", dbSaved);
                        })
                        .catch(function (err) {
                            // If an error occurred, log it
                            console.log(err);
                        })
                } else {
                    console.log("Article by that title found in saved DB.")
                }
            })
            res.send("Article save complete.");
        })
    });

    // grab article by id and populate with notes 
    app.get("/articles/:id", function (req, res) {
        db.Saved.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbSaved) {
                res.json(dbSaved);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // for saving article notes
    app.post("/articles/:id", function (req, res) {

        db.Note.create(req.body)
            .then(function (dbNote) {
                // look for an article to save the note id into
                return db.Saved.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { useFindAndModify: false });
            })
            .then(function (dbSaved) {
                // send article back if successfully updated
                res.render("saved");
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.delete("/clear", function (req, res) {
        db.Article.deleteMany({}, function (err) {
            if (err) {
                res.json(err);
            } else {
                res.render("index");
            }
        })
    });

    app.delete("/clearsav", function (req, res) {
        db.Saved.deleteMany({}, function (err) {
            if (err) {
                res.json(err);
            } else {
                res.render("saved");
            }
        })
    });

    app.delete("/api/delete:id", function (req, res) {
        const str = req.params.id;
        const id = str.replace(":", "");

        db.Saved.deleteOne({ _id: id }, function (err) {
            if (err) {
                res.json(err);
            } else {
                res.render("saved");
            }
        })
    });

    app.delete("/delete/note:id/:parent", function (req, res) {
        const str = req.params.id;
        const id = str.replace(":", "");
        console.log("id string", id);
        const strP = req.params.parent;
        const par = strP.replace(":", "");
        console.log("parent string", par);

        db.Saved.findOneAndUpdate({ _id: par }, { $pull: { note: id } }, { useFindAndModify: false })
            .then(function () {
                db.Note.deleteOne({ _id: id }, function (err) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.render("saved");
                    }
                })
            })
    });
};