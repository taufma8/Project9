const express = require('express');
const router = express.Router();
const { User } = require('../models'); 
const bcryptjs = require('bcryptjs');
const authenticateUser = require('./authentication');

const { check, validationResult } = require('express-validator');

// Send a GET request to /users to READ a list of users
router.get('/', authenticateUser, (req, res, next) => {
  res.status(200).json(req.currentUser);
});
  // User.findAll().then(users => {
  //   if (users) {
  //     res.status(200).json(users);
  //   } else {
  //     res.status(404).json({message: "Sorry, couldn't find this page. Try again."});
  //   }
  // }).catch(err => res.json({message: err.message}));

//Send a POST request to /users to  CREATE a new user 
router.post('/', [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "first name"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "last name"'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"')
    .isEmail()
    .withMessage('Please provide a valid email address for "email"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"')
    .isLength({ min: 8, max: 20 })
    .withMessage('Please provide a "password" that is between 8 and 20 characters in length')
], async (req, res, next)=>{
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    res.status(400).json({ errors: errorMessages });
  } else {

    const user = new User ({
      "firstName": req.body.firstName,
      "lastName": req.body.lastName,
      "emailAddress": req.body.emailAddress,
      "password": bcryptjs.hashSync(req.body.password)
      })
  
    try {
      await user.save();
      res.location(`/${user.id}`);
    // Set the status to 201 Created and end the response.
      res.status(201).end();
    } catch (err) {
      if(err.name === 'SequelizeValidationError') {
        res.status(400).json({message: "Hmm...Something's not right. Please fill out all the required fields."})
      } else {
        res.status(400).json({message: err.message});
      }
    }
  }

  
});
module.exports = router;
