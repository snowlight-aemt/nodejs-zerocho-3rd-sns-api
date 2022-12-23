const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');
// views/join.html > /auth/join 요청
exports.join = async (req, res, next) => {
    const { nick, email, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
}
// POST /auth/login
// 1. login 이 호출
// 2. 'local' > localStrategy.js 
// 3. 
exports.login = (req, res, next) => {
    // 콜백 함수 localStrategy.js 와 연관.
    // 아래의 소스가 미들웨어 확장 패턴 (req, res, next);
    passport.authenticate('local', (authError, user, info) => {
        if (authError) { // 서버 실패
            console.error(authError); 
            return next(authError);
        }

        if (!user) { // 로직 실패
            return res.redirect(`/?loginError=${info.message}`);
        }

        return req.login(user, (loginError) => { // 로그인 성공
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}

exports.logout = (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    });
}

// 로그인 전
// 1. /auth/login 라우터를 통해 로그인 요청이 들어옴
// 2. 라이터에서 passport.authenticate 메서드 호출
// 3. 로그인 전략(LocalStrategy) 수행
// 4. 로그인 성공 시 사용자 정보 객체와 함계 req.login 호출
// 5. req.login 메서드가 passport.serializeUser 호출
// 6. req.session 에 사용자 아이디만 저장해서 세션 생성
// 7. express-session 에 설정한 대로 브라우저에 connect.sid 세션 쿠키 전송
// 8. 로그인 완료 

// 로그인 후
// 1. 요청이 들어옴(어떠한 요청이든 상관없음)
// 2. 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 password.deserializeuser 메서드 호출
// 3. connect.sid 세션 쿠드를 읽고 세션 객체를 찾아서 req.session 으로 만듧
// 4. req.session 에 저장된 아이디로 데이터베이스에서 사용자 조회
// 5. 조회된 사용자 정보를 req.user 에 저장
// 6. 라우터에서 req.user 객체 사용 가능