const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const  {isAuthenticated,isAuthorized} = require("../middlewares/auth")


// get all articles 
router.get("/article", async (req, res) => {
   let articles = await Article.find({published: true})
                               .populate("author", "username bio")
                               .sort({ createdAt: -1 })
    
   res.status(200).send({data: articles})

})

// post an article 
router.post("/article",isAuthenticated, async (req, res) => {
    let {id} = req

    
    Article.create({...req.body,author:id} , async function(err, data){
        if(err){
            res.status(500).send({message:err})
        }else{
            res.status(201).send({message:"Article posted succseefully"})
        }

    })
})

// get an article by slug
router.get("/article/:slug", async (req, res) => {
    let {slug} = req.params
    let article = await Article.findOne({slug})
                               .populate("author", "username bio") 

        res.status(200).send({data:article})
    
})


// update an article by slug
router.patch("/article/:slug", isAuthenticated, isAuthorized, async (req, res) => {
    let {slug} = req.params

   Article.updateOne({slug}, req.body , async function (err,data) {

    if(err){

        res.status(500).send({message:"Article didn't get updated"})

    } else{

        let article = await Article.findOne({slug}).populate("author", "username bio")
        res.status(200).send({data:article})
    }


})

                    
})

// delete article by slug
router.delete("/article/:slug",isAuthenticated, isAuthorized, async (req, res) => {
    let {slug} = req.params

    Article.deleteOne({slug}, function (err) {

        if(err) {
            res.status(500).send({message:"Article didn't get deleted"})
        }else{

            res.status(200).send({message:"Article deleted succseefully"})
        }
    });

 
})




module.exports = router;
