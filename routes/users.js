const express = require('express');
const router = express.Router();

function asyncHandler(cb){
  return async (req,res, next) => {
      try {
          await cb(req, res, next);
      } catch(err) {
          next(err);
      }
  }
}
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// Send a GET request to /users to READ a list of users
router.get('/', asyncHandler(async (req, res, next)=>{
  const users = await Database.getUsers();
  res.status(200).json(users);
}));


//Send a POST request to /users to  CREATE a new user 
router.post('/', asyncHandler( async (req, res, next)=>{
  if(req.body.title && req.body.description){
      const user = await Database.createUser({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          emailAddress: req.body.emailAddress,
          password: req.body.password
      });
      res.status(201).json(user);
  } else {
      res.status(400).json({message: "All fields are required."});
  }
}));

module.exports = router;
