const express = require('express');
const { verifyToken } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v1');
const router = express.Router();

router.post('/token', createToken); // req.body.clientSecret
router.get('/test', verifyToken, tokenTest);

router.get('/post/my', verifyToken, getMyPosts);
router.get('/post/hashtag/:title', verifyToken, getPostsByHashtag);

module.exports = router;

// TODO 나의 게시글 리스트
// TODO 해쉬태그 검색 관련 게시글 리스트