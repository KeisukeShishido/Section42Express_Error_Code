const express = require('express');
const app = express();
const morgan = require('morgan');

const AppError = require('./AppError');

app.use(morgan('tiny'));
app.use((req,res,next) => {
    req.requestTime = Date.now();
    console.log(req.method,req.path);
    next();
})

app.use('/dogs', (req,res,next) => {
    console.log('犬ーー');
    next();
});

const verifyPassword = ((req,res,next) => {
    const {password} = req.query;
    if (password === 'supersecret'){
        return next();
    }
    throw new AppError('パスワードが必要です',401);
    // res.send('パスワードが必要です。');
});

// app.use((req,res,next) => {
//     console.log('初めてのミドルウェア');
//     next();
// });

app.get('/', (req,res) => {
    console.log(`リクエスト時刻：${req.requestTime}`);
    res.send('ホームページ');
});

app.get('/error',(req,res) => {
    hoge.moge();
});

app.get('/dogs', (req,res) => {
    console.log(`リクエスト時刻：${req.requestTime}`);
    res.send('わんわん');
});

app.get('/secret',verifyPassword, (req,res) => {
    res.send('ここは秘密のページです。');
});

app.get('/admin',(req,res) => {
    throw new AppError('管理者しかアクセスできません。',403);
});

app.use((req,res) => {
    res.status(404).send('ページが見つかりません');
});

// app.use((err,req,res,next) => {
//     console.log('************');
//     // res.status(500).send('エラーが発生しました');
//     console.log(err);
//     next(err);
// });

app.use((err,req,res,next) => {
    const {status = 500, message = '何かエラーが起きました' } = err;
    res.status(status).send(message);
});

app.listen(3000,() => {
    console.log('localhost:3000で待受中');
});