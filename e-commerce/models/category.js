//video 18 :zed category.js  fl models w zed m3aha l admin_categories fl routes
var mongoose=require('mongoose');

//Category schema
var CategorySchema=mongoose.Schema({
    title:{
        type:String,
        required :true
    },
    slug:{
        type:String
    },
    
});
var Category=module.exports=mongoose.model('Category',CategorySchema);