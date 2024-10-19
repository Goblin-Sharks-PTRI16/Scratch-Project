const express = require('express');
const router = express.Router();
const app = require('../server.js');
const goalsController = require('../controllers/goalsController.js');
const userController = require('../controllers/userController.js');

// fetching goals after login
router.get('/', goalsController.getAllGoals, (req, res) => {
    res.status(200).json(res.locals.goals);
})

// for login and querying users table in DB
router.get('/users', userController.getAllUsers, (req, res) => {
    res.status(200).json(res.locals.users);
})

// for logging in (POST request)
router.post('/login', userController.login, (req, res) => {
    res.status(200).json({ success:true, loggedInUser: res.locals.login });
})

// for fetching a specific user's goals (GET)
router.get('/fetchgoal', goalsController.getUserGoals, (req, res) => {
    res.status(200).json(res.locals.userGoal);
})

// for creating a new goal (POST)
router.post('/creategoal', goalsController.createGoal, (req, res) => {
    res.status(200).json(res.locals.newGoal);
})

// delete a goal (DELETE)
router.delete('/deletegoal', goalsController.deleteGoal, (req, res) => {
    res.status(200).json(res.locals.delete)
})

// update a goal (goals data table) (PUT)
router.put('/updategoal', goalsController.updateGoal, (req, res) => {
    res.status(200).json(res.locals.update)
})

// update progress for a goal (progress data table) (POST)
router.post('/updateprogress', goalsController.updateProgress, (req, res) => {
    res.status(200).json(res.locals.progressUpdate)
})

// fetch progress for goal for the Graph component
router.get('/fetchprogress', goalsController.fetchProgress, (req, res) => {
    res.status(200).json(res.locals.fetchedProgress)
})

module.exports = router;