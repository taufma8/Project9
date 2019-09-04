const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Welcome to Maliha\'s REST API project!' });
});



// [
//   check('firstName')
//     .exists({ checkNull: true, checkFalsy: true })
//     .withMessage('Please provide a value for "firstName"'),
//     check('lastName')
//     .exists({ checkNull: true, checkFalsy: true })
//     .withMessage('Please provide a value for "lastName"'),
//   check('emailAddress')
//     .exists({ checkNull: true, checkFalsy: true })
//     .withMessage('Please provide a value for "emailAddress"'),
//   check('password')
//     .exists({ checkNull: true, checkFalsy: true })
//     .withMessage('Please provide a value for "password"'),
// ], 
module.exports = router;
