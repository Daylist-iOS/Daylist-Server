import express from 'express';
import detailController from '../controller/getDetailPlaylistController'
const router = express.Router();

/* [GET] */
router.get('/:userId/:playlistId', detailController);

module.exports = router;
