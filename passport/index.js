const passport = require('passport');
const local = require('./localStrategy');
// const kakao = require('./kakaoStrategy');
const User = require('../models/user');
const kakao = require('./kakaoStrategy');

// 모듈을 만들어서 app.js 에서 붙치는 작업을 진행하고 있다.
module.exports = () => {
    passport.serializeUser((user, done) => { // user == exUser
        done(null, user.id); // user id만 추출 (메모리 용량 문제 때문에 취소 데이터) 15장에서 공유 메모리
    });
    // 세션 { 12823490(랜덤): 1(user.id) } === {세션 쿠키: 유저 아이디} -> 메모리 저장

    // 세션 쿠키에서 구분한 id 를 가지고 user 객체는 DB 에서 불러서 객체를 만든다.
    passport.deserializeUser((id, done) => { 
        User.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                },
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings',
                }
            ]
        })
            .then((user) => done(null, user)) // req.user
            .catch(err => done(err));
    });

    local();
    kakao();
}

// 1. /auth/login 라우터 - 로그인 요청
// 2. passport 