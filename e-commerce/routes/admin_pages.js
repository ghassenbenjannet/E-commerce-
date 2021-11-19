var express= require('express');
var router =express.Router();


//Get page model
var Page =require('../models/page');


/*
 * GRT pages index
 */

router.get('/',function(req,res){
   Page.find({}).sort({sorting:1}).exec(function (err,pages){
      res.render('admin/pages', {
          pages:pages
      }) ;
   });
});


/*
 * GET add pages 
 */

router.get('/add-page',function(req,res){
   var title="";
   var slug="";
   var content="";
   res.render('admin/add_page',{
       title: title,
       slug: slug,
       content: content
   });
});


/*
 * POST add pages 
 */

router.post('/add-page',function(req,res){
   req.checkBody('title','Nom doit être rempli').notEmpty();
   req.checkBody('content','Contenu doit être rempli').notEmpty();
   
    var  title=req.body.title;
    var  slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if (slug=="") slug=title.replace(/\s+/g,'-').toLowerCase();
    var  content=req.body.content;
  
   var errors=req.validationErrors();
   if(errors){
       res.render('admin/add_page',{
       errors: errors,
       title: title,
       slug: slug,
       content: content
   });
   }
   else{
      Page.findOne({slug:slug}, function(err,page){
          if (page){
             req.flash('danger','Slug existant, générer un autre');
             res.render('admin/add_page',{
              title: title,
              slug: slug,
              content: content
   });
          }
          else {
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });

                page.save(function (err) {
                    if (err)
                        return console.log(err);

                    Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.pages = pages;
                        }
                    });

                    req.flash('success', 'Page bien ajoutée');
                    res.redirect('/admin/pages');
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