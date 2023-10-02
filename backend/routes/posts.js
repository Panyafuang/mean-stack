const express = require('express');

const postController = require('../controller/post');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();


router.post('', checkAuth, extractFile, postController.createPosts);

router.get('', postController.getPosts);

router.get('/:id', postController.getPost);

router.put('/:id', checkAuth, extractFile, postController.updatePost);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;
