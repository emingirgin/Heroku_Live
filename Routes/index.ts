import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', page: 'home', displayName: '' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home', page: 'home', displayName: '' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('index', { title: 'About Us', page: 'about', displayName: '' });
});

/* GET Projects page. */
router.get('/products', function(req, res, next) {
  res.render('index', { title: 'Our Projects', page: 'products', displayName: '' });
});

/* GET Services page. */
router.get('/services', function(req, res, next) {
  res.render('index', { title: 'Our Services', page: 'services', displayName: '' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('index', { title: 'Contact Us', page: 'contact', displayName: '' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('index', { title: 'Login', page: 'login', displayName: '' });
});

/* GET Register page. */
router.get('/register', function(req, res, next) {
  res.render('index', { title: 'Register', page: 'register', displayName: '' });
});


/* TEMP ROUTES - CONT LIST RELATED */

/* GET contact list page. */
router.get('/contact-list', function(req, res, next) {
  res.render('index', { title: 'Contact List', page: 'contact-list', displayName: '' });
});

/* GET edit page. */
router.get('/edit', function(req, res, next) {
  res.render('index', { title: 'Edit Contact', page: 'edit', displayName: '' });
});



export default router;