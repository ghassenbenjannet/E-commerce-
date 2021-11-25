var mongoose=require('mongoose');

//utilisateur schema
var UtilisateurSchema=mongoose.Schema({
    nom:{
        type:String,
        required :true
    },
    email:{
        type:String,
        required :true

    },
    nomut:{
        type:String,
        required :true
    },
    mdp:{
        type:String,
        required :true
    },
    admin:{
        type:Number
    }
});

var Utilisateur=module.exports=mongoose.model('utilisateur',UtilisateurSchema);