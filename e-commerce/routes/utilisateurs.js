var express= require('express');
var Utilisateur=require('../models/utilisateur');
var router =express.Router();





//utilisateur connexion
router.get('/connect',function(req,res){
    if(res.locals.utilisateur) res.redirect('/');
    res.render('connect',{
        title:'Connexion admin'
    });
});

//Etablir la connexion d'utilisateur
router.post('/connect',function(req,res){
    var nomut = req.body.nomut;
    var mdp = req.body.mdp;
     if (nomut=="admin" && mdp=="admin")
        res.redirect('/admin/pages');
          else
       res.redirect('/utilisateurs/connect');
       req.flash('Failure','Accées réservé pour Admin' );

        
     });
    



// se déconnecter
router.get('/dec', (req, res) => {
  req.logout();
  req.flash('Success', 'Déconnecté');
  res.redirect('/utilisateurs/connect');
});

    


// Exports
module.exports =router;