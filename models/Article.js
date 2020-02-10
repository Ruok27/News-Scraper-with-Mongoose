let mongoose = require("mongoose");

let Schema = mongoose.Schema;
//revisit this
//js website json change to nytimes later

let ArticleSchema = new Schema({

title:{
type: String,
required: true
},

link:{
type: String,
required: true
},

note:{

type: Schema.Types.ObjectId,
ref: "Note"

}
});


let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;