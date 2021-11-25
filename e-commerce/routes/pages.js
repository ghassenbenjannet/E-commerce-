var express= require('express');
var Page=require('../models/page');
var router =express.Router();
//get accueil
router.get('/',function(req,res){
    Page.findOne({slug:'acceuil'},function(msg,page){
        if(msg)
            console.log(msg);
        
            res.render('index',{
                title:page.title,
                content:page.content
                
            });
        });
    
});


//appliquer une page
router.get('/:slug',function(req,res){
    var slug=req.params.slug;
    Page.findOne({slug:slug},function(msg,page){
        if(msg)
            console.log(msg);
        if (!page)
            res.redirect('/');
        else{
            res.render('index',{
                title:page.title,
                content:page.content
                
            });
        }
    });
});
    


// Exports
module.exports =router;