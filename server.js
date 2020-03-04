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

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false });







server.engine("handlebars", handlebars({ defaultLayout: "main" }));
server.set("view engine", "handlebars");

server.get("/", function (req, res) {


    db.Article.find({}).lean().then(function (dbResult) {

        const obj = {


            results: dbResult

        }

        res.render("index", obj);

    }).catch(function (err) {

        res.json(err);


    });


});


server.get("/saved", function (req, res) {

    res.render("saved");

   

});



//?
server.get("/scrape", function(req, res) {

    let scrapeResults = [];

    axios.get("http://www.cracked.com/").then(function(response) {
        let $ = cheerio.load(response.data);
        
        $("h3").each(function(i, element) {
            let result = {};
            result.title = $(element).find("a").text();
            result.link = $(element).find("a").attr("href");
            result.description = $(element).find("a").text();

            db.Article.create(result)
            .then(function(dbArticle) {
                // console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });

            scrapeResults.push(result);
        });        
    
        res.send("Articles Scraped");
        location.reload();

        // const hbsObject = {
        //     results: scrapeResults
        // }

        // console.log(hbsObject);
        // res.render("index", hbsObject);
        
    });
    
})



server.get("/clear", function (req, res) {


    db.Article.remove({}).catch(function (err) {

        console.log(err);

    });

    res.send("Gone!");

});



server.get("/article/:id", function (req, res) {



    db.Article.findOne({ _id: req.params.id }).populate("note").lean().then(function (dbArticle) {
        res.json(dbArticle);
    });



});


server.post("/article/:id", function (req, res) {

    db.Note.create(req.body).then(function (dbNote) {

        return
        (
            db.Article.findOneAndUpdate(
                { _id: req.params.id },
                { note: dbNote._id },
                { new: true })

        )

    })

})





server.listen(PORT, function () {

    console.log(`Server listening on: http://localhost:${PORT}`)


});



