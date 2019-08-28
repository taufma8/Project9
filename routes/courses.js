const express = require('express');
const router = express.Router();
const {Course} = require('../models'); 

// Send a GET request to /courses to READ a list of courses
router.get('/', (req, res, next)=>{
  Course.findAll().then(courses => {
    res.status(200).json(courses);
  }).catch(err => {
    res.status(404).json({message: err.message});
  });
});
    // function getCourses(){
    //   return new Promise((resolve, reject) => {
    //     fs.readFile('seed/data.json', (err, data) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         const json = JSON.parse(data);
    //         resolve(json);
    //       }
    //     });
    //   });
    // }
// router.get('/', asyncHandler(async (req, res, next)=>{
//   const courses = await coursesDatabase.getCourses();
//   res.status(200).json(courses);
// }));

// Send a GET request to /courses/:id to READ(view) a course
router.get('/:id', (req, res, next)=>{
  Course.findByPk(req.params.id).then(course => {
    res.status(200).json(course);
  }).catch(err => {
    res.status(404).json({message: err.message});
  });
});

  //   async function getQuote(id){
  //   const quotes = await getQuotes();
  //   return quotes.records.find(record => record.id == id);
  // }
  // const coursesDatabase = await require('../seed/data.json').courses;
  // console.log(req.params.id);
  
  // const oneCourse = coursesDatabase.findByPk(req.params.id);
  // if (req.params.id == coursesDatabase(req.params.id)) {}
 
  // const course = await courses.find(c => c.id === parseInt(req.params.id));
  // if (!course) {
  //   res.status(404).send('This course with the given ID was not found');
  //   res.send(course);
  // }

// router.get('/:id', asyncHandler(async (req, res, next)=>{
//   const course = await coursesDatabase.getCourses(req.params.id);

//   if(course){
//       res.status(200).json(course);
//   } else {
//       res.status(404).json({message: "Course not found."});
//   }
// }));

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
    res.status(404).json({message: err.message});
  }
}); 
// router.post('/:id', asyncHandler( async (req, res, next)=>{
//   const course = await coursesDatabase.createCourse({
//     title: req.body.title,
//     description: req.body.description
//     });
//   res.status(201).json(course).catch(function(err){
//     if(err.name === 'SequelizeValidationError') {
//       res.json({
//         course: Course.build(req.body), 
//         title: "New Course",
//         errors: err.errors
//       });
//     } else {
//       throw err;
//     }
//   }).catch(function(err){
//     res.json({message: err.message, error: err});
//   });
// }));
// router.post('/:course', asyncHandler( async (req, res, next)=>{
//   if(req.body.title && req.body.description){
//       const course = await coursesDatabase.createCourse({
//           title: req.body.title,
//           description: req.body.description
//       });
//       res.status(201).json(course);
//   } else {
//       res.status(400).json({message: "Title and description required."});
//   }
// }));

// Send a PUT request to /courses/:id to UPDATE (edit) a course
router.put('/:id',(req, res, next) => {
  Course.findByPk(req.params.id)
  .then(course => {
    if (course) {
      if (req.params.id === req.body.id) {
        Course.update(req.body).then(() =>
          res.status(204).end())
      }
    }
  }).catch(err => {
    res.status(404).json({message: err.message});
  });
});
// router.put('/:id',(req, res, next) => {
//   Course.findByPk(req.params.id).then(course => {
//   // Course.update(req.params.id).then(course => {
//     if(course) {
//       res.status(204).json(course);
//     } else {
//       res.status(404).json({message: err.message});
//     }
//   }).catch(err => {
//     res.status(500);
//   });
// });
// Send a DELETE request to /courses/:id DELETE a course 
router.delete("/:id", (req, res, next) => {
  const course =  coursesDatabase.getCourse(req.params.id);
   coursesDatabase.deleteCourse(course);
  res.status(204).end();
});

module.exports = router;
