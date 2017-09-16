const express = require('express');
const router = express.Router();
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const nodemailer = require('nodemailer');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('panikusia', 'root', '', {
  dialect: 'mysql',
  host: 'localhost', // nazwa hosta
  port: 3306
});

const User = sequelize.define('User', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

const Details = sequelize.define('Details', {
  name: Sequelize.STRING,
  forname: Sequelize.STRING,
  street: Sequelize.STRING,
  post: Sequelize.STRING,
  city: Sequelize.STRING,
  phone: Sequelize.STRING,
  additional: Sequelize.TEXT
});

const Category = sequelize.define('Category',{
  name: Sequelize.STRING
});

const Product = sequelize.define('Product', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  price: Sequelize.FLOAT,
  image: Sequelize.STRING,
  storage: Sequelize.INTEGER
});

const About = sequelize.define('About', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT
})
sequelize.sync(); //  force sync - if tables doesnt exist sequelize will create them
Product.belongsTo(Category); // products have their categories
Product.belongsToMany(User, {through: 'userProducts'}); // user can have many products in basket

/* Test database connection */
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(err => {
    console.log('Unable to connect to the database!')
  });
/* End database test */

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 's1.ct8.pl',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'allecx@allecx.ct8.pl',
        pass: 'wrwarawr'
    }
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* About endpoints */
// Return about infromation
router.get('/get/about', function(req, res){
});
/* End about endpoints */

/* Categories endpoints */
// Return all categories
router.get('/get/categories', function(req, res){
  Category.findAll()
  .then( category => {
    res.json(category);
  });
});

// add category
router.post('/add/category', function(req, res){
  console.log(req.body)
  Category
    .build(
      req.body
    )
    .save()
    .then(function(returnSaved) {})
    .catch(function(error) {});

    res.status(200).end();
});
/* End categories endpoints */

/* Product endpoints */
// Get all products
router.get('/get/products', function(req, res){
  Product.findAll()
  .then( product => {
    res.json(product);
  });
});

// add product
router.post('/add/product', function(req, res){
  console.log(req.body)
  Product
    .build(
      req.body
    )
    .save()
    .then(function(returnSaved) {})
    .catch(function(error) {});

    res.status(200).end();
});
/* End product endpoints */

/* User endpoints */
router.get('/get/users', function(req, res){
  User.findAll()
  .then( user => {
    res.json(user);
  });
});
/* End user endpoints */














/* Get information from database */
router.get('/load', function(req, res) {
  sequelize.sync()
    .then(() => {
      Product.findAll({
        raw: true
      }).then((product) => {
        res.json(product);
      });
    });
});

router.get('/product/:id', function(req, res) {
  Product.findById(Number(req.params.id))
    .then(function(product) {
      res.render('product_by_id', {
        product: product
      });
    });
});

router.delete('/product/:id', function(req, res) {
  Product.findById(Number(req.params.id))
    .then(function(product) {
      console.log('Destroyed: ' + product.title);
      product.destroy();
      res.redirect('back');
    });
});


/* Add data to database */
router.post('/add', function(req, res) {
  let data = {
    'title': req.body.title,
    'description': req.body.description,
    'price': req.body.price,
    'image': req.body.image
  };

  console.log(data);

  Product
    .build({
      title: data.title,
      description: data.description,
      price: data.price,
      image: data.image,
      status: 0
    })
    .save()
    .then(function(returnSaved) {})
    .catch(function(error) {});

  sequelize.sync();

  res.redirect('/admin');
});

router.post('/send', function(req, res){
  // setup email data with unicode symbols
  var mailOptions = {
      from: req.body.name + ' ' + req.body.email, // sender address
      to: 'allecx@allecx.ct8.pl', // list of receivers
      subject: req.body.emailTitle, // Subject line
      text: req.body.message, // plain text body
      html: req.body.message, // html body
      replyTo: req.body.email // reply field
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  })
  res.redirect('/#contact');
});

router.get('/test', function(req, res) {

  /*  User
      .build({
        username: "admin",
        password: "admin",
        status: 0
      })
      .save()
      .then(function(returnSaved) {})
      .catch(function(error) {});*/
    sequelize.sync()
      .then( () => {
          Product.create({
            title: 'Apple',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '2.99',
            image: 'apple',
            show: 'false'
          });
          Product.create({
            title: 'Cherry',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '15.99',
            image: 'cherry',
            show: 'false'
          });
          Product.create({
            title: 'Coco',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '7.99',
            image: 'Coco',
            show: 'false'
          });
          Product.create({
            title: 'Kiwi',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '7.99',
            image: 'kiwi',
            show: 'false'
          });
          Product.create({
            title: 'Orange',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '5.99',
            image: 'orange',
            show: 'false'
          });
          Product.create({
            title: 'Raspberry',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '6.99',
            image: 'Raspberry',
            show: 'false'
          });
          Product.create({
            title: 'Strawberry',
            description: 'Varius quisque non molestie dolor, nunc nisl dapibus vestibulum at, sodales tincidunt mauris ullamcorper, dapibus pulvinar, in in neque risus odio.',
            price: '9.99',
            image: 'strawberry',
            show: 'false'
          });
      })
      .then( () => {
        User.create({
          username: 'admin',
          password: 'admin'
        })
      });


  res.redirect('/');
});

// LOGIN
passport.use(new Strategy(
  function(username, password, done) {
    User.findOne({
      where: {
        username: username
      }
    }).then(function(user, err) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id).then(function(user, err) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/admin'
  }),
  function(req, res) {
    console.log('rage');
    res.render('admin', {
      user: req.user
    });
  });

/* Admin page */
router.get('/admin', function(req, res) {
  res.render('admin', {});
});

module.exports = router;
