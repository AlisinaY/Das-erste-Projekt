const express = require("express");
const router = express.Router();
const Article = require("../models/article.js");

   
   // Add Route
   router.get("/add", function(req, res){
     res.render("add_article", {
       title: "Add Article",
     })
   });
   
   router.post("/add", function(req, res){
     req.checkBody("title", "Title is required").notEmpty();
     req.checkBody("author", "Author is required").notEmpty();
     req.checkBody("body", "Body is required").notEmpty();
   
     const errors = req.validationErrors();
   
     if(errors){
       res.render("add_article", {
         title: "Add Article",
         errors: errors,
       })
     } else {
       const article = new Article();
       article.title = req.body.title;
       article.author = req.body.author;
       article.body = req.body.body;
     
       article.save(function(err){
         if(err){
           console.log(err);
         } else {
           req.flash("success", "Article Added");
           res.redirect("/");
         }
       });
      }
   });
   
   // Edit
   router.get("/edit/:id", function(req, res){
     Article.findOne({_id: req.params.id}, function(err, founndArticle){
       if(err){
         console.log(err);
       } else {
         res.render("edit_article", {
           title: "Edit Article",
           article: founndArticle});
       }
     });
    });
   
   
    // Edit Article 
    router.post("/edit/:id", function(req, res){
     const article = {};
     article.title = req.body.title;
     article.author = req.body.author;
     article.body = req.body.body;
   
     const query = {_id: req.params.id};
   
     Article.update(query, article, function(err){
       if(err){
         console.log(err);
       } else {
         req.flash("success", "Updated Article");
         res.redirect("/");
       }
     });
   });
   
   // Delete Article 
   router.delete("/:id", function(req, res){
   
     const query = {_id: req.params.id};
   
     Article.remove(query, function(err){
       if(err){
         console.log(err);
       }
       req.flash("success", "Deleted Article");
       res.send();
     });
   });


   // Single Article 
router.get("/:id", function(req, res){
  const id = {_id:req.params.id};
  Article.findOne(id, function(err, founndArticle){
    if(err){
      console.log(err);
    } else {
      res.render("article", {article: founndArticle});
    }
  });
 });
   

module.exports = router;