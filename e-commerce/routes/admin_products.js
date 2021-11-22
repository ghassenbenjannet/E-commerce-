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
 * GRT product index
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
 * GET add product
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
 * POST add product 
 */

router.post('/add-product',function(req,res){
    var imgf=typeof req.files.image!=="undifined" ? req.files.image.name:"";
    
   req.checkBody('title','Nom doit être rempli').notEmpty();
   req.checkBody('desc','Descreption doit être rempli').notEmpty();
   req.checkBody('price','prix doit être établi').isDecimal();
   req.checkBody('image','Image obligatoire').isImage(imgf);
   
   

   
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

                    mkdirp('public/product_images/'+product._id,function(err){
                        return console.log(err);
                    });
                    mkdirp('public/product_images/'+product._id+'/gallery',function(err){
                        return console.log(err);
                    });
                    mkdirp('public/product_images/'+product._id+'/gallery/thumbs',function(err){
                        return console.log(err);
                    });
                    
                    if(imgf!=""){
                        var proimg=req.files.image;
                        var path='public/product_images/'+product._id+'/'+imgf;
                        proimg.mv(path, function(error){
                            return console.log(error);
                            
                        });
                    }

                    req.flash('success', 'Produit bien ajoutée');
                    res.redirect('/admin/products');
                });
            }
        });

   }
   
   
});

/*
 * Post reorder pages
 */

router.post('/reorder-pages',function(req,res){
   var ids = req.body['id[]'];
   var n=0;
   
   for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        n++;

        (function (n) {
            Page.findById(id, function (err, page) {
                page.sorting = n;
                page.save(function (err) {
                    if (err)
                        return console.log(err);
                    
                });
            });
        })(n);
   }
});

/*
 * GET modifier page
 */

router.get('/edit-page/:slug',function(req,res){
   Page.findOne({slug:req.params.slug},function(err,page){
       if(err) 
           return console.log(err);
       
       res.render('admin/edit_page',{
        title: page.title,
        slug: page.slug,
        content: page.content,
        id: page._id
        });
   });
  
});

/*
 * POST edit page
 */
router.post('/edit-page/:slug', function (req, res) {

    req.checkBody('title', 'Nom doit être rempli.').notEmpty();
    req.checkBody('content', 'Contenu doit être rempli').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.body.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    } else {
        Page.findOne({slug: slug,_id: {'$ne': id}}, function (err, page) {
            if (page) {
                req.flash('danger', 'Slug existant, générer un autre');
                res.render('admin/edit_page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {

                Page.findById(id, function (err, page) {
                    if (err)
                        return console.log(err);

                    page.title = title;
                    page.slug = slug;
                    page.content = content;

                    page.save(function (err) {
                        if (err)
                            return console.log(err);

                        req.flash('success', 'Page bien ajoutée');
                        res.redirect('/admin/pages/edit-page/' +page.slug);
                    });

                });


            }
        });
    }

});



/*
 * supprimer une page 
 */

router.get('/delete-page/:id',function(req,res){
   Page.findByIdAndRemove(req.params.id, function(error){
   if(error) return console.log(error);
   
   req.flash('success', 'Page supprimée');
   res.redirect('/admin/pages/');
   });
});

// Exports
module.exports =router;