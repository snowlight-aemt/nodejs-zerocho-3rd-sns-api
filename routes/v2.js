const express = require('express');
const { verifyToken, apiLimiter, corsWhenDomainMatch } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v2');
const router = express.Router();

router.use(corsWhenDomainMatch);

router.post('/token', apiLimiter, createToken); // req.body.clientSecret
router.get('/test', apiLimiter, verifyToken, tokenTest);

router.get('/post/my', apiLimiter, verifyToken, getMyPosts);
router.get('/post/hashtag/:title', apiLimiter, verifyToken, getPostsByHashtag);

module.exports = router;