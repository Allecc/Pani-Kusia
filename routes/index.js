var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var mysql = require('mysql');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var Sequelize = require('sequelize');
var sequelize = new Sequelize('appbase','root','', {
							   host: 'localhost', // nazwa hosta
							   port: 3306 // numer portu
							   });

var title = 'Pani Kusia';

var Product = sequelize.define('Product', {
    title: Sequelize.STRING,
	description: Sequelize.TEXT,
    price: Sequelize.FLOAT,
    image: Sequelize.STRING
});

var User = sequelize.define('User', {
	username: Sequelize.STRING,
	password: Sequelize.STRING
});

User.hasMany(Product);

/* GET home page. */
router.get('/', function(req, res) {
		res.render('index', { title: title });
});

router.get('/home')

router.get('/home', function (req, res) {
    res.redirect('/');
});
router.get('/produkty', function (req, res) {
    res.redirect('/#produkty');
});
router.get('/o-sklepie', function (req, res) {
    res.redirect('/#o-sklepie');
});
router.get('/kontakt', function (req, res) {
    res.redirect('/#kontakt');
});

/* Get information from database */
router.get('/load', function(req, res){
	sequelize.sync();
	Product.findAll(
		{raw: true}	// Get JSON
	).then( function (product) {
		res.json(product);
	});
});

router.get('/product/:id', function(req, res){
    Product.findById(Number(req.params.id))
        .then(function (product){
            res.render('product_by_id', { product: product});
        });
});

router.delete('/product/:id', function(req, res){
    Product.findById(Number(req.params.id))
        .then(function (product){
            console.log('Destroyed: ' + product.title);
            product.destroy();
            res.redirect('back');
        });
});


/* Add data to database */
router.post('/add', function(req, res){
    let data = {
        'title': req.body.title,
        'description': req.body.description,
        'price': req.body.price,
        'image': req.body.image
    };

    console.log(data);

    Product
        .build({ title: data.title, description: data.description, price: data.price, image: data.image, status: 0 })
        .save()
        .then(function (returnSaved){})
        .catch(function (error) {
    });

    sequelize.sync();

    res.redirect('/admin');
});

router.get('/test', function(req, res){

    User
        .build({ username: "admin", password: "admin", status: 0})
        .save()
        .then(function (returnSaved){})
        .catch(function (error) {
        });
    sequelize.sync();


    res.redirect('/');
});

// LOGIN
passport.use(new Strategy(
    function(username, password, done) {
        User.findOne({where: { username: username }}).then(function (user, err) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (user.password !== password) { return done(null, false); }
            return done(null, user);
            });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    User.findById(id).then( function (user, err) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/admin' }),
    function(req, res) {
        console.log('rage');
        res.render('admin', { user: req.user});
    });

/* Admin page */
router.get('/admin', function (req, res) {
	res.render('admin', { user: req.user});
});

module.exports = router;
