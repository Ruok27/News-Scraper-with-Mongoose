//Dependencies
const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
var logger = require("morgan");

//Requires

//go back to this
let db = require("./models");

let PORT = process.env.PORT || 3000;

let server = express();


server.use(logger("dev"));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static("public"));


//might need to get rid of /mongoheadlines which might be the name of the mongo table
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });







server.engine("handlebars", handlebars({ defaultLayout: "main" }));
server.set("view engine", "handlebars");

server.get("/", function (req, res) {


    axios.get("http://www.echojs.com/").then(function (res) {

        let $ = cheerio.load(res.data);
        $("article h2").each(function (i, element) {

            let result = {};

            result.title = $(this).children("a").text();

            result.link = $(this).children.attr("href");

            db.Article.create(result).then(function (dbArticle) {

                console.log(dbArticle);


            }).catch(function (err) {

                console.log(err)


            });



        });




    })

    res.render("index");


})

server.get("/saved", function (req, res) {

    res.render("saved");


})



server.listen(PORT, function () {

    console.log(`Server listening on: http://localhost:${PORT}`)


});



