const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path =  require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const passport = require('passport');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config(); // 여기부터 사용할 수 있다. => (process.env.COOKIE_SECRET)
const authRouter = require('./routes/auth');
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 데이터베이스 생성 명령 : npx sequelize db:create
sequelize.sync({ force:true }) // 테이블 삭제 후 다시 생성
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });
    
app.use(morgan('dev')); // combined
app.use(express.static(path.join(__dirname, 'public'))); // static resource location
app.use(express.json());                            // json 요청 (req.body 를 ajax json 요청으로 부터)
app.use(express.urlencoded({ extended: false}));    // form 요청 (req.body 폼으로 부터)
app.use(cookieParser(process.env.COOKIE_SECRET));   // 쿠키 전송 처리 { connect.sid=1234592034923840 } 
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));

// passport 는 session 미들웨어 밑에서 생성해야만 한다. !!
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.

// 미들웨어는 next(error) 를 해야지만 다음 미들웨어로 이동한다.
// 404 NOT FOUND
app.use((req, res, next) => { 
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    // 배포 모드 err 를 숨김.
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})