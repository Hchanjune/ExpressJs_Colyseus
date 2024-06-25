const express = require('express');
const app = express();
const port = 3000;

// 기본 라우트
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// /about 라우트
app.get('/about', (req, res) => {
    res.send('About Page');
});

// /contact 라우트
app.get('/contact', (req, res) => {
    res.send('Contact Page');
});

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
