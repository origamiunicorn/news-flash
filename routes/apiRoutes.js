const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models")

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

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.delete("/clear", function (req, res) {
        db.Article.deleteMany({}, function (err) {
            if (err) {
                return handleError(err);
            } else {
                res.render("index");
            }
        })
    })
};