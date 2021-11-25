var LocalStrategy=require('passport-local').Strategy;
var Utilisateur=require('../models/utilisateur');
var bcrypt=require('bcryptjs');

module.exports=function(a){
    a.use(new LocalStrategy(function(nomut,mdp,val){
        Utilisateur.findOne({nomut:nomut} ,function(msg,utilisateur){
            if(msg)
                console.log(msg);
            if(!utilisateur){
                return val(null,false,{msg:"Nom d'utilisateur incorrect"});
            }
            bcrypt.compare(mdp,utilisateur.mdp,function(msg,oui){
              if(msg) console.log(msg);
              if(oui) return val(null,utilisateur);
              else
                return val(null,false,{msg:"Mot de passe incorrecte"});
              
            });
        });
    }));
    a.serializeUser(function(utilisateur,val){
        val(null,utilisateur.id);
    });
    a.deserializeUser(function(id,val){
        Utilisateur.findById(id,function(msg,utilisateur){
            val(msg,utilisateur);
        });
    });
};
