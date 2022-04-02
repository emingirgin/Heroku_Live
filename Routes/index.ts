import express from 'express';
const router = express.Router();

import Contact from "../Models/contact";

/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('index', { title: 'Home', page: 'home', displayName: '' });
});

/* GET home page. */
router.get('/home', function(req, res, next) 
{
  res.render('index', { title: 'Home', page: 'home', displayName: '' });
});

/* GET about page. */
router.get('/about', function(req, res, next) 
{
  res.render('index', { title: 'About Us', page: 'about', displayName: '' });
});

/* GET services page. */
router.get('/services', function(req, res, next) 
{
  res.render('index', { title: 'Our Services', page: 'services', displayName: '' });
});

/* GET products page. */
router.get('/products', function(req, res, next) 
{
  res.render('index', { title: 'Our Products', page: 'products', displayName: '' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) 
{
  res.render('index', { title: 'Contact Us', page: 'contact', displayName: '' });
});

/* GET login page. */
router.get('/login', function(req, res, next) 
{
  res.render('index', { title: 'Login', page: 'login', displayName: '' });
});

/* GET register page. */
router.get('/register', function(req, res, next) 
{
  res.render('index', { title: 'Register', page: 'register', displayName: '' });
});

/* Temporary Routes - Contact-List Related pages */
/* GET contact-list page. */
router.get('/contact-list', function(req, res, next) 
{
  // display contacts from the db
  Contact.find(function(err, contactList)
  {
    if(err)
    {
      console.error("Encountered an Error reading from the Database: " + err.message);
      res.end();
    }

    res.render('index', { title: 'Contact-List', page: 'contact-list', contacts: contactList, displayName: '' });
  })

  
});

/* Displays the Add Page */
router.get('/add', function(req, res, next) 
{
  res.render('index', { title: 'Add', page: 'edit', contact: '', displayName: '' });
});

/* Process add request */
router.post('/add', function(req, res, next)
{
  // instantiate a new Contact object
  let newContact = new Contact({
    "FullName": req.body.FullName,
    "ContactNumber": req.body.ContactNumber,
    "EmailAddress": req.body.EmailAddress,
  });

  // db.contacts.insert(newContact);
  Contact.create(newContact, function(err: Error)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }

    // redirect to the contact-list page
    res.redirect('/contact-list');
  });

});
/* Display the Edit Page with Data */
router.get('/edit/:id', function(req, res, next) 
{
  let id = req.params.id;

  // pass the id to the db and read it in
  Contact.findById(id, {}, {}, function(err, contactToEdit)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }

    // show the edit view with the data
    res.render('index', { title: 'Edit', page: 'edit', contact: contactToEdit, displayName: '' });
  });
});

/* Process the delete request */
router.get('/edit/:id', function(req, res, next) 
{
  let id = req.params.id;
  // instantiate new Contact object
  let updatedContact = new Contact({
    "_id": id,
    "FullName": req.body.FullName,
    "ContactNumber": req.body.ContactNumber,
    "EmailAddress": req.body.EmailAddress,
  });

// db.contacts.update({"_id": id}, the stuff to update)
Contact.updateOne({_id: id}, updatedContact, function(err: ErrorCallback)
{
  if(err)
  {
    console.error(err);
    res.end(err);
  }

  // the contact has been updated in the db -> now go back to the contact-list
  res.redirect('/contact-list');
});
});


/* Process the delete request */
router.get('/delete/:id', function(req, res, next) 
{
  let id = req.params.id;

  // db.contacts.remove({"_id":id})
  Contact.remove({_id: id}, function(err)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }

    // delete was successful -> go back to the contact-list
    res.redirect('/contact-list');
  });
});

export default router;
