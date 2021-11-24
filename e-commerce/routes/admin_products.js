var express= require('express');
var router =express.Router();
var mkdirp=require('mkdirp');
var fs=require('fs-extra');
var resizeImg=require('resize-img');



//Get page model
var Product =require('../models/product');


//Get Category model
var Category =require('../models/category');
const product = require('../models/product');

/*
 * page produits
 */

router.get('/',function(req,res){
    var count ;
    Product.count(function(err,c){
    count=c;
    });
    product.find(function(err,products){
        res.render('admin/products',{
            products:products,
            count:count
            
        });
    });
});


/*
 * ajouter produit
 */

router.get('/add-product', function (req, res) {

    var title = "";
    var desc = "";
    var price = "";

    Category.find(function (err, categories) {
        res.render('admin/add_product', {
            title: title,
            desc: desc,
            categories: categories,
            price: price
        });
    });


});


/*
 * enregistrer ajout produit 
 */

router.post('/add-product',function(req,res){

let imgf = "";
if (req.files && typeof req.files.image !== "undefined"){
        imgf = req.files.image.name;    
}  req.checkBody('title','Nom doit être rempli').notEmpty();
   req.checkBody('desc','Descreption doit être rempli').notEmpty();
   req.checkBody('price','prix doit être établi').isDecimal();
   //req.checkBody('image','Image obligatoire').isImage(imgf);
   
   

   
    var  title=req.body.title; 
    var slug=title.replace(/\s+/g,'-').toLowerCase();
    var  desc=req.body.desc;
    var  price=req.body.price;
    var  category=req.body.category;
  
   var errors=req.validationErrors();
   if(errors){
       Category.find(function (err, categories) {
        res.render('admin/add_product', {
            errors: errors,
            title: title,
            desc: desc,
            categories: categories,
            price: price
        });
    });
   }
   else{
      Product.findOne({slug:slug}, function(err,product){
          if (product){
             req.flash('danger','produit existant, générer un autre');
             Category.find(function (err, categories) {
        res.render('admin/add_product', {
            title: title,
            desc: desc,
            categories: categories,
            price: price
        });
    
   });
          }
          else {
                var pric=parseFloat(price).toFixed(2);
                var product = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    price: pric,
                    category: category,
                    image:imgf
                });

               product.save(function (err) {
                    if (err)
                        return console.log(err);

                    mkdirp('public/product_images/' + product._id, function (err) {
                        return console.log(err);
                    });

                    mkdirp('public/product_images/' + product._id + '/gallery', function (err) {
                        return console.log(err);
                    });

                    mkdirp('public/product_images/' + product._id + '/gallery/thumbs', function (err) {
                        return console.log(err);
                    });

                    if (imgf !== "") {
                        var productImage = req.files.image;
                        var path = 'public/product_images/' + product._id + '/' +imgf;

                        productImage.mv(path, function (err) {
                            return console.log(err);
                        });
                    }

                    req.flash('success', 'Produit bien ajouté');
                    res.redirect('/admin/products');
                });
            }
        });
    }

});

/*
 *  modifier produit
 */

router.get('/edit-product/:id',  function (req, res) {

    var erreurs;

    if (req.session.errors)
        erreurs = req.session.errors;
    req.session.errors = null;

    Category.find(function (erreur, categories) {

        Product.findById(req.params.id, function (erreur, produit) {
            if (erreur) {
                console.log(erreur);
                res.redirect('/admin/products');
            } else {
                var dossgal = 'public/product_images/' + produit._id + '/gallery';
                var dosimg = null;

                fs.readdir(dossgal, function (erreur, fichiers) {
                    if (erreur) {
                        console.log(erreur);
                    } else {
                        dosimg =  fichiers;

                        res.render('admin/edit_product', {
                            title: produit.title,
                            errors: erreurs,
                            desc: produit.desc,
                            categories: categories,
                            category: produit.category.replace(/\s+/g, '-').toLowerCase(),
                            price: parseFloat(produit.price).toFixed(2),
                            image: produit.image,
                            galleryImages: dosimg,
                            id: produit._id
                        });
                    }
                });
            }
        });

    });

});

/*
 * enregistrer edition produit
 */
router.post('/edit-product/:id', function (req, res) {
    let imgf = "";
if (req.files && typeof req.files.image !== "undefined"){
        imgf = req.files.image.name;    
}
   req.checkBody('title','Nom doit être rempli').notEmpty();
   req.checkBody('desc','Descreption doit être rempli').notEmpty();
   req.checkBody('price','prix doit être établi').isDecimal();
   //req.checkBody('image','Image obligatoire').isImage(imgf);
   
    var  title=req.body.title; 
    var slug=title.replace(/\s+/g,'-').toLowerCase();
    var  desc=req.body.desc;
    var  price=req.body.price;
    var  category=req.body.category;
    var  prodimg=req.body.prodimg;
    var id=req.params.id;
    var erreurs=req.validationErrors();
    
    if (erreurs){
        req.session.errors=erreurs;
        res.redirect('admin/products/edit-product'+id);
    }
    else{
        Product.findOne({slug:slug , _id:{'$ne':id}},function(erreur,produit){
            if (erreur) 
                console.log(erreur);
            
            if(produit){
                req.flash('danger','Existant! créer un autre');
                res.redirect('admin/products/edit-product'+id);
            }
            else{
                Product.findById(id,function(erreur,produit){
                    if (erreur)
                        console.log(erreur);
                    
                    produit.title=title;
                    produit.slug=slug;
                    produit.desc=desc;
                    produit.price=parseFloat(produit.price).toFixed(2);
                    produit.category=category;
                    if(imgf !=""){
                        produit.image=imgf
                    }
                       produit.save(function(erreur){
                           if (erreur)
                               console.log(erreur);
                           if(imgf!=""){
                               if (prodimg !=""){
                                   fs.remove('public/product_images'+id+'/'+prodimg, function(erreur){
                                   if (erreur) 
                                       console.log(erreur);
                               });
                           }
                        var productImage = req.files.image;
                        var path = 'public/product_images/' +id + '/' +imgf;

                        productImage.mv(path, function (err) {
                            return console.log(err);
                        });
                    }
                    req.flash('success', 'Produit bien édité');
                    res.redirect('/admin/products/edit-product/' + produit._id);
                });
                    
                });
            }

        });           
    }
});

/*
 * supprimer un produit
 */

router.get('/delete-product/:id',function(req,res){
   var id=req.params.id ;
   var path='public/product_images/'+id;
   
   fs.remove(path, function(erreur){
       if(erreur)
           console.log(erreur);
       else{
           Product.findByIdAndRemove(id, function(erreur){
               console.log(erreur);
           });
           req.flash('success', 'Produit supprimé');
           res.redirect('/admin/products');
       }
       
   });
});

// Exports
module.exports =router;