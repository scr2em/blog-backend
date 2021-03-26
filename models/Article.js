// General Import
// Mongo import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");
const articleSchema = new Schema(
    {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: [true, "Article body can't be empty"],
    },
    photo:{
      type:String,
      default:"https://via.placeholder.com/300x200"
    },
    author: {
      type:  Schema.Types.ObjectId,
      required: [true, "Article author can't be empty"],
      ref:"users"
    },
    tags: {
      type:  Array,
      required: false,
    },
    slug: {
        type:String
    },
    published : {
      type: Boolean,
      default:true
    }
  
  },
  { timestamps: true }
);

articleSchema.index({'$**': 'text'})

articleSchema.pre("save",  function(next) {
    this.slug = slugify(this.title)+ "-" + Math.random().toFixed(5).split(".")[1]
    next()
  });

const Article = mongoose.model("articles", articleSchema);
module.exports = Article;
