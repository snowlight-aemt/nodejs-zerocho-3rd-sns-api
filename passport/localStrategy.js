
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false, // true 면 async (req, email, password, done)
    }, async (email, password, done) => {  // done(서버 실패, 성공 유저, 로직 실패) 
        // done() 함수가 실행되는 순간 
        // controllers/auth.js -> password.authenticate('local', (authError, user, info) => {})
        try {
            const exUser = await User.findOne({ where: { email }});
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser); // 성공 유저
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'}); // 로직 실패
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.'}); // 로직 실패
            }
        } catch (error) {
            console.error(error);
            done(error); // 서버 실패
        }
    }));
};