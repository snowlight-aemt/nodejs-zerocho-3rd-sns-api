
## CORS
```
    npm i cors
```
## 브라우저에서 요청하는 경우 발생하는 CORS 이슈
주소(도메인 + 포트) 가 다르면 Optional 요청 진행하여 Access-Control-Allow-Origin 이 들어있지 않으면 에러가 발생한다.
* TODO 확인 필요함..;
```javascript
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
//Access to XMLHttpRequest at 'http://localhost:8002/v2/token' from origin 'http://localhost:4000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```
```javascript
res.setHeader('Access-Control-Allow-Headers', 'content-type');
//Access to XMLHttpRequest at 'http://localhost:8002/v2/token' from origin 'http://localhost:4000' has been blocked by CORS policy: Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response.
```

## 10장 스스로 해보기
* 팔로워나 팔로잉 목록을 가져오는 API 만들기 (nodebird-api 에 새로운 라우터 추가)
* 무료인 도메인과 프르미엄 도메인 간에 사용량 제한이 다르게 적용하기 (apiLimiter 를 두개 만들어서 도메인 별로 다르게 적용 9.3.1 절 POST /auth/login 라우터 참고)
* 클라이언트용 비밀키와 서버용 비밀키 를 구분해서 발급하기 (Domain 모델 수정)
* 클라이언트를 위해 API 문서 작성하기(swagger 나 apidoc 사용)

[jwt](https://jwt.io)  
[express-rate-limit](https://www.npmjs.com/package/express-rate-limit)  
[ms 공식 문서](https://github.com/vercel/ms)