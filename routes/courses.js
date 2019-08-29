const express = require('express');
const router = express.Router();
const {Course} = require('../models'); 

// Send a GET request to /courses to READ a list of courses
router.get('/', (req, res, next)=>{
  Course.findAll().then(courses => {
    if (courses) {
      res.status(200).json(courses);
    } else {
      res.status(404).json({message: "Sorry, couldn't find this page. Try again."});
    }
  }).catch(err => res.json({message: err.message}));
});

// Send a GET request to /courses/:id to READ(view) a course
router.get('/:id', (req, res, next)=>{
  Course.findByPk(req.params.id)
  .then(course => {
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({message: "Oops! That ID does not exist. Try again."});
    }
  }).catch(err => res.json({message: err.message}));
});


//Send a POST request to /courses to  CREATE a new course 
router.post('/', async (req, res, next)=>{
  const course = new Course ({
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description
    })
  try {
    await course.save();
    res.location(`/${course.id}`);
    res.status(201).end();
  } catch (err) {
    if(err.name === 'SequelizeValidationError') {
      res.status(400).json({message: "Hmm...Something's not right. Please fill out all the required fields."})
    } else{
      res.json({message: err.message});
    }
  }
}); 

// Send a PUT request to /courses/:id to UPDATE (edit) a course
router.put('/:id',(req, res, next) => {
  Course.findByPk(req.params.id)
  .then((course) => {
    if (course) {
      course.update(req.body).then(() => res.status(204).json(course));
    } else {
      res.status(404).json({message: "Oops! That ID does not exist. Try again."});
    }
  }).catch(err => {
    if(err.name === 'SequelizeValidationError') {
      res.status(400).json({message: "Hmm...Something's not right. Please fill out all the required fields."})
    } else{
      res.json({message: err.message});
      }
  });
});

// Send a DELETE request to /courses/:id DELETE a course 
router.delete("/:id", (req, res, next) => {
  Course.findByPk(req.params.id).then((course) => {
    if (course) {
      course.destroy().then(() => res.status(204).end());
    } else {
      res.send(404).json({message: "Oops! That ID does not exist. Try again."});
    }
  }).catch(function(err){
    res.json({message: err.message});
  });
});

module.exports = router;
