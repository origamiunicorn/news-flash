const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models")

module.exports = function (app) {

    app.get("/", function (req, res) {

        db.Article.find()
            .then(documents => {
                const context = {
                    articlesDocuments: documents.map(document => {
                        return {
                            id: document._id,
                            title: document.title,
                            teaser: document.teaser,
                            photo: document.photo,
                            link: document.link
                        }
                    })
                }
                res.render("index", { title: "Scraped Articles", articlesDocuments: context.articlesDocuments });
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.get("/saved", function (req, res) {

        db.Saved.find()
            .then(documents => {
                const context = {
                    articlesDocuments: documents.map(document => {
                        return {
                            id: document._id,
                            title: document.title,
                            teaser: document.teaser,
                            link: document.link
                        }
                    })
                }
                res.render("saved", { title: "Scraped Articles", articlesDocuments: context.articlesDocuments });
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
};