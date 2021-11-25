var express= require('express');
var Product=require('../models/product');
var router =express.Router();


//ajout du produit danbs la panier
router.get('/ajout/:product', function (req, res) {

    var slug = req.params.product;

    Product.findOne({slug: slug}, function (msg, one) {
        if (msg)
            console.log(msg);

        if (typeof req.session.panier == "undefined") {
            req.session.panier = [];
            req.session.panier.push({
                qty: 1,
                title: slug,
                image: '/product_images/' + one._id + '/' + one.image,
                price: parseFloat(one.price).toFixed(2)

            });
        } else {
            var v = true;
            var panier = req.session.panier;


            for (var i = 0; i < panier.length; i++) {
                if (panier[i].title == slug) {
                    panier[i].qty++;
                    v = false;
                    break;
                }
            }

            if (v) {
                panier.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(one.price).toFixed(2),
                    image: '/product_images/' + one._id + '/' + one.image
                });
            }
        }

        console.log(req.session.panier);
        req.flash('success', 'Ajouté au panier');
        res.redirect('back');
    });

});
 
 /*
 * consulter panier
 */
router.get('/voir', function (req, res) {

    if (req.session.panier && req.session.panier.length == 0) {
        delete req.session.panier;
        res.redirect('/panier/voir');
    } else {
        res.render('voir', {
            title: 'Mon panier',
            panier: req.session.panier
        });
    }

});
// + - efface
router.get('/maj/:product', function (req, res) {

    var slug = req.params.product;
    var panier = req.session.panier;
    var action = req.query.action;

    for (var i = 0; i < panier.length; i++) {
        if (panier[i].title == slug) {
            switch (action) {
                case "add":
                    panier[i].qty++;
                    break;
                case "remove":
                   panier[i].qty--;
                    if (panier[i].qty < 1)
                        panier.splice(i, 1);
                    break;
                case "clear":
                   panier.splice(i, 1);
                    if (panier.length == 0)
                        delete req.session.panier;
                    break;
                default:
                    console.log('ERROR');
                    break;
            }
            break;
        }
    }

    res.redirect('/panier/voir');

});


// Exports
module.exports =router;