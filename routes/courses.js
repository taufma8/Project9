const express = require('express');
const router = express.Router();
const { Course, User } = require('../models'); 
const authenticateUser = require('./authentication');
const { check, validationResult } = require('express-validator');

// Filter out the following in the Courses endpoint GET routes.
const filterOut = {
  include: [{
    model: User,
    attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
  }],
  attributes: {exclude: ['createdAt', 'updatedAt']}
}
// Send a GET request to /courses to READ a list of courses (including the user that owns each course)
router.get('/', (req, res, next)=>{
  Course.findAll(filterOut)
  .then(courses => {
    if (courses) {
      res.status(200).json(courses);
    } else {
      res.status(404).json({message: "Sorry, couldn't find this page. Try again."});
    }
  }).catch(err => res.json({message: err.message}));
});

// Send a GET request to /courses/:id to READ(view) a course (including the user that owns the course) for the provided course ID
router.get('/:id', (req, res, next)=>{
  Course.findByPk(req.params.id, filterOut)
  .then(course => {
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({message: "Oops! That ID does not exist. Try again."});
    }
  }).catch(err => res.json({message: err.message}));
});


//Send a POST request to /courses to CREATE a new course, sets the Location header to the URI for the course, and returns no content
router.post('/', [
  // Validations
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
  check('userId')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "userId"')
], authenticateUser, async (req, res, next)=>{
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    const err = new Error(errorMessages);
    err.status = 400;
    next(err);
  } else {

    const course = new Course ({
      userId: req.body.userId,
      title: req.body.title,
      description: req.body.description
      })
    try {
      await course.save();
      res.location(`http://localhost:5000/api/courses/${course.id}`);
      res.status(201).end();
    } catch (err) {
      if(err.name === 'SequelizeValidationError') {
        res.status(400).json({message: "Hmm...Something's not right. Please fill out all the required fields."});
      } else {
        res.json({message: err.message});
      }
    }
  }
}); 

// Send a PUT request to /courses/:id to UPDATE (edit) a course and returns no content
router.put('/:id', [
  // Validations
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
  check('userId')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "userId"')
], authenticateUser, (req, res, next) => {

  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    const err = new Error(errorMessages);
    err.status = 400;
    next(err);  
  } else {
      Course.findByPk(req.params.id)
      .then((course) => {
          if (course) {
            const user = req.currentUser;
            if(user.id === course.userId) {
              course.update(req.body).then(() => res.status(204).json(course));
            } else {
              res.status(403).json({message: 'Sorry, you are not authorized to edit this page.'});
            }
          } else {
            res.status(404).json({message: "Oops! That ID does not exist. Try again."});
          }
      }).catch(err => {
        if(err.name === 'SequelizeValidationError') {
          res.status(400).json({message: "Hmm...Something's not right. Please fill out all the required fields."})
        } else {
          res.json({message: err.message});
        }
        next(err);
      });
  }
});

// Send a DELETE request to /courses/:id DELETE a course and returns no content
router.delete("/:id", authenticateUser, (req, res, next) => {
  const user = req.currentUser;
  Course.findByPk(req.params.id).then((course) => {
      if (course) {
        if(user.id === course.userId) {
          course.destroy().then(() => res.status(204).end());
        } else {
          res.status(403).json({message: 'Sorry, you are not authorized to edit this page.'});
        } 
      } else {
        res.send(404).json({message: "Oops! That ID does not exist. Try again."});
      }
  }).catch(function(err){
    const error = new Error('Server error');
    error.status = 500;
    next(error);
    // res.json({message: err.message});
  });
});

module.exports = router;
