const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');
const router = express.Router();

// 로그인 여부에 따라서 접근할 수 있는 라이터가 다르다. 6장
// POST /auth/join
router.post('/join', isNotLoggedIn, join);
// POST /auth/login
router.post('/login', isNotLoggedIn, login);
// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));
// 미들웨어는 위에 `router.get('/kakao', passport.authenticate('kakao'));` 이 방식이 맞지만
// login 안에 미들웨어 확장 패턴를 사용했다. 6장
//  * 사용 이유는 req, res, next 를 사용하기 위해서.
// app.use(passport.authenticate('kakao')(req, res, next)); // 원래 미들웨어
// app.use((req, res, next) => passport.authenticate('kakao')(req, res, next)); // 미들웨어 확장 패턴 (login)

// 흐름
// /kakao --> 카카오톡 화면 --> /kakao/callback

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?loginError=카카오로그인 실패',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;
