const express = require('express');
const { createPost, getAllPosts, getSinglePost } = require('../controller/communityController');

const router = express.Router();

router.post('/create', createPost);
router.get('/', getAllPosts);
router.get('/:id', getSinglePost);

module.exports = router;