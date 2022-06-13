import express from 'express';
import detailController from '../controller/getDetailPlaylistController'
import registerController from '../controller/postPlaylistController'
const { uploadImage } = require("../middleware/uploadImage")
const router = express.Router();

/* [GET] */
router.get('/:userId/:playlistId', detailController);

/* [POST] */
router.post('/', uploadImage, registerController);

module.exports = router;
