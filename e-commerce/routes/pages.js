var express= require('express');
var router =express.Router();

router.get('/',function(req,res){
    res.render('index',{
        title:'Accueil'
    });
});

// Exports
module.exports =router;