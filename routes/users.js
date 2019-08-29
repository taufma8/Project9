const express = require('express');
const router = express.Router();
const {User} = require('../models'); 


// Send a GET request to /users to READ a list of users
router.get('/', (req, res, next)=>{
  User.findAll().then(users => {
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({message: "Sorry, couldn't find this page. Try again."});
    }
  }).catch(err => res.json({message: err.message}));
});

//Send a POST request to /users to  CREATE a new user 
router.post('/', async (req, res, next)=>{
  const user = new User ({
    "firstName": req.body.firstName,
    "lastName": req.body.lastName,
    "emailAddress": req.body.emailAddress,
    "password": req.body.password
    })
  try {
    await user.save();
    res.location(`/${user.id}`);
    res.status(201).end();
  } catch (err) {
    if(err.name === 'SequelizeValidationError') {
      res.status(404).json({message: "Hmm...Something's not right. Please fill out all the required fields."})
    } else {
      res.json({message: err.message});
    }
  }
}); 

module.exports = router;
