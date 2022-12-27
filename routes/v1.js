const express = require('express');
const { verifyToken, deprecated } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v1');
const router = express.Router();

router.use(deprecated);

router.post('/token', createToken); // req.body.clientSecret
router.get('/test', verifyToken, tokenTest);

router.get('/post/my', verifyToken, getMyPosts);
router.get('/post/hashtag/:title', verifyToken, getPostsByHashtag);

module.exports = router;