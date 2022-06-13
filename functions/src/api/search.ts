import express from 'express';
import searchController from '../controller/searchController'
const router = express.Router();

/* [POST] */
router.post('/:userId', searchController);

module.exports = router;
