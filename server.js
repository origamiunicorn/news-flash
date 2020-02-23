const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const PORT = 3000;

// Initialize Express
const app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsFlashDB", { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", function () {
    console.log("MongoDB connected successfully.");
    connection.db.listCollections().toArray(function (err, names) {
        if (err) {
            console.log(err);
        } else {
            for (i = 0; i < names.length; i++) {
                console.log(names[i].name);
                if ((names[i].name = "articles")) {
                    console.log("Articles Collection Exists in DB.");
                    mongoose.connection.db.dropCollection(
                        "articles",
                        function (err, res) {
                            console.log("Collection dropped.");
                        }
                    );
                    console.log("Articles Collection No Longer Available.");
                } else {
                    console.log("Collection doesn't exist.");
                }
            }
        }
    });
});

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Routes

require("./routes/htmlRoutes")(app);

require("./routes/apiRoutes")(app);

app.listen(PORT, function () {
    console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
    );
});


module.exports = app;