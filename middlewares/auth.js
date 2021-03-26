const jwt = require("jsonwebtoken");
const {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/token");
const Article = require("../models/Article")
// Auth Tokens
const isAuthenticated = (req, res, next) => { 
  
  let authorizationHeader = req.headers.authorization || '';
  let token = authorizationHeader.split("Bearer ")[1] 
  try{
    let x = verifyAccessToken(token)
    req.id = x.id 
  }catch(err){
    res.status(401).send({success:false, message:"invalid access token"})
    return
  }
  
    next()
}
const isAuthorized = async (req,res,next) =>{
  
  let {id} = req
  let {slug} = req.params
  let article = await Article.find({slug})
  if(article.length == 0) {
    res.status(404).send({success:false,message:"Article not found"})
    return
  }

  if(id == article[0].author){
    next()
  }else{
    res.status(403).send({success:false,message:"Forbidden access"})

  }



}
module.exports = {isAuthenticated,isAuthorized}