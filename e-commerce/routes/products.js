var express = require('express');
var Category = require('../models/category');
var Product = require('../models/product');
var router = express.Router();
var fs = require('fs-extra');



/*
 * voir tous les produits
 */
router.get('/', function (req, res) {
    Product.find(function (err, products) {
        if (err)
            console.log(err);

        res.render('all_products', {
            title: 'Tous les produits',
            products: products
        });
    });

});


/*
 * voir par catégorie
 */
router.get('/:category', function (req, res) {

    var categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function (err,c) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('par_cat', {
                title: c.title,
                products: products
            });
        });
    });

});

/*
 * voir détails
 */
router.get('/:category/:product', function (req, res) {

    var imgg = null;

    Product.findOne({slug: req.params.product}, function (msg, product) {
        if (msg) {
            console.log(msg);
        } else {
            var gdoc= 'public/product_images/' +product._id + '/gallery';

            fs.readdir(gdoc, function (msg, files) {
                if (msg) {
                    console.log(msg);
                } else {
                    imgg = files;

                    res.render('products', {
                        title: product.title,
                        p: product,
                        galleryImages: imgg
                    });
                }
            });
        }
    });

});



// Exports
module.exports = router;

