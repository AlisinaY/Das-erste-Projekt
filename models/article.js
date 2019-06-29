const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  }
});

const Article = module.exports = mongoose.model("Article", articleSchema);

/*
const article1 = new Article({
  id: 1,
  title: "Article One",
  author: "Alisina",
  body: "This is article one",
});

const article2 = new Article({
  id: 2,
  title: "Artilce Two",
  author: "Alisina",
  body: "This is article two",
});


const articles = [article1, article2];

Article.insertMany(articles, function(err){
  if(err){
    console.log(err);
  } else {
    console.log("Successfully saved to the DB");
  }
});
*/
