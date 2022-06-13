import express from 'express';
import getMainController from '../controller/getMainCalendarListController'
const router = express.Router();

/* [GET] */
router.get('/:userId/:year/:month', getMainController);

module.exports = router;
