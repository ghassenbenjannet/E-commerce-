var express= require('express');
var router =express.Router();


//Get category model
var Category =require('../models/category');


/*
 * GET Categorie
 */

router.get('/',function(req,res){
    Category.find(function(msg,categories){
        if (msg)
            return console.log(msg);
      res.render('admin/categories', {
          categories:categories
      }) ;
   });
});


/*
 * GET add category 
 */

router.get('/add-category',function(req,res){
   var title="";
   
   res.render('admin/add_category',{
       title: title
   });
});


/*
 * POST ajout catégorie
 */

router.post('/add-category',function(req,res){
   req.checkBody('title','Nom doit être rempli').notEmpty();
   
    var  title=req.body.title;
    var  slug=title.replace(/\s+/g,'-').toLowerCase();
    
  
   var msg=req.validationErrors();
   if(msg){
       res.render('admin/add_category',{
       errors: msg,
       title: title
   });
   }
   else{
      Category.findOne({slug:slug}, function(msg,category){
          if (category){
             req.flash('danger','catégorie existante, générer un autre');
             res.render('admin/add_category',{
              title: title,
              slug: slug,
              content: content
   });
          }
          else {
                var cat = new Category({
                    title: title,
                    slug: slug
                });

                cat.save(function (msg) {
                    if (msg)
                        return console.log(msg);
                    Category.find(function (msg,mines){
                        if(msg)
                            console.log(msg);
                        Category.find(function (msg,mines){
                            if(msg)
                                console.log(msg);
                            else{
                                req.app.locals.categories=mines;
                            }
                        });
                    });
                    req.flash('success', 'Catégorie bien ajoutée');
                    res.redirect('/admin/categories');
                });
            }
        });
    }
});


/*
 * GET modifier catégorie
 */

router.get('/edit-category/:id',function(req,res){
   Category.findById(req.params.id,function(msg,category){
       if(msg) 
           return console.log(msg);
       Category.find(function (msg,mines){
       if(msg)
          console.log(msg);
       else{
          req.app.locals.categories=mines;
      }
   });
       
       res.render('admin/edit_category',{
        title: category.title,
        id: category._id
        });
   });
  
});

/*
 * POST modifier catégorie
 */
router.post('/edit-category/:id', function (req, res) {

    req.checkBody('title', 'Nom: champs obligatoire').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var msg = req.validationErrors();

    if (msg) {
        res.render('admin/edit_category', {
            errors: msg,
            title: title,
            id: id
        });
    } else {
        Category.findOne({slug: slug, _id: {'$ne': id}}, function (msg, category) {
            if (category) {
                req.flash('danger', 'Existante! créer une autre');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
            } else {
                Category.findById(id, function (msg, category) {
                    if (msg)
                        return console.log(msg);

                    category.title = title;
                    category.slug = slug;

                    category.save(function (msg) {
                        if (msg)
                            return console.log(msg);

                        Category.find(function (msg, categories) {
                            if (msg) {
                                console.log(msg);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        });

                        req.flash('success', 'Bien modifiée');
                        res.redirect('/admin/categories/edit-category/' + id);
                    });

                });


            }
        });
    }

});

/*
 * GET delete category
 */
router.get('/delete-category/:id', function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (msg) {
        if (msg)
            return console.log(msg);

        Category.find(function (msg, categories) {
            if (msg) {
                console.log(msg);
            } else {
                req.app.locals.categories = categories;
            }
        });

        req.flash('success', 'Supression validée');
        res.redirect('/admin/categories/');
    });
});

// Exports
module.exports =router;