// const express = require('express');
// const router = express.Router();

// const database = require('/seed/database.js');

// function asyncHandler(cb){
//     return async (req,res, next) => {
//         try {
//             await cb(req, res, next);
//         } catch(err) {
//             next(err);
//         }
//     }
// }

// // Send a GET request to /courses to READ a list of courses
// router.get('/courses', asyncHandler(async (req, res)=>{
//     const courses = await database.getcourses();
//     res.json(courses);
// }));

// // Send a GET request to /courses/:id to READ(view) a course
// router.get('/courses/:id', asyncHandler(async (req, res)=>{
//     const course = await database.getCourse(req.params.id);

//     if(course){
//         res.json(course);
//     } else {
//         res.status(404).json({message: "Course not found."});
//     }
// }));

// // Send a GET request to /courses/course/random to READ (view) a random course
// router.get('/courses/course/random', asyncHandler(async(req,res,next) =>{
//     const course = await database.getRandomCourse();
//     res.json(course);
// }));

// //Send a POST request to /courses to  CREATE a new course 
// router.post('/courses', asyncHandler( async (req, res)=>{
//     if(req.body.author && req.body.course){
//         const course = await database.createCourse({
//             course: req.body.course,
//             author: req.body.author
//         });
//         res.status(201).json(course);
//     } else {
//         res.status(400).json({message: "Course and author required."});
//     }
// }));

// // Send a PUT request to /courses/:id to UPDATE (edit) a course
// router.put('/courses/:id', asyncHandler(async(req,res) => {
//     const course = await database.getCourse(req.params.id);
//     if(course){
//         course.course = req.body.course;
//         course.author = req.body.author;

//         await database.updateCourse(course);
//         res.status(204).end();
//     } else {
//         res.status(404).json({message: "Course Not Found"});
//     }
// }));

// // Send a DELETE request to /courses/:id DELETE a course 
// router.delete("/courses/:id", asyncHandler(async(req,res, next) => {
//     const course = await database.getCourse(req.params.id);
//     await database.deleteCourse(course);
//     res.status(204).end();
// }));



// module.exports = router; 