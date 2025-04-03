const express = require('express');
const scheduleController = require('../controllers/schedule');
const scheduleRouter = express.Router();

scheduleRouter.post('/', scheduleController);

module.exports = scheduleRouter;