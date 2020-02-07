const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");



let server = express();
server.use(express.static("public"));

let PORT = process.env.PORT || 3000;

server.engine("handlebars", handlebars({defaultLayout: "main"}));
server.set("view engine", "handlebars");

server.get("/", function(req, res){

res.render("index");


})



server.listen(PORT, function(){

console.log(`Server listening on: http://localhost:${PORT}`)


});



