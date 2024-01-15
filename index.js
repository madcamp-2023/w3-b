const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);
const cors = require('cors')
const bcrypt = require('bcrypt');

var db = require('./db.js');
const app = express()
const port = 3001;


let corsOptions = {
    origin: '*',
    credential: true,
}


app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: 'yoonseo',
    resave: false,
    saveUninitialized: true,
    store:new FileStore(),
}));

app.get("/user", (req, res) => {
    const {userId, password} = req.query;
    db.query('SELECT * FROM users WHERE userId = ?', [userId], (err, results) => {
        if(err){
            console.error('Error fetching user: ', err);
        } else{
            if(results.length > 0){
                const user = results[0];
                const passwordMatch = bcrypt.compareSync(password, user.password);

                if(passwordMatch){
                    const responseData = {id: user.id, name: user.name};
                    res.json(responseData);
                } else{
                    res.status(401).json({error: 'Invalid password'});
                }
            } else{
                res.status(404).json({error: 'User not found'});
            }
        }
    });
});

app.post("/user", (req, res) => {
    const {name, userId, password, code} = req.body;

    if(code !== "madcamp-2023-winter"){
        return res.status(400).json();
    }
    //비밀번호 hash 처리
    const hashedPassword = bcrypt.hashSync(password, 10);

    //중복된 userId 확인
    db.query('SELECT * FROM users WHERE userId = ?', [userId], (selectErr, selectResults) => {
        if(selectErr){
            console.error('Error checking duplicate userId: ', selectErr);
            return res.status(500).send('Internal Server Error');
        }

        if(selectResults.length > 0){
            return res.status(400).json({error: "Duplicate userId"});
        }

        //user 테이블에 유저 정보 등록
        db.query('INSERT INTO users (name, userId, password) VALUES (?, ?, ?)', [name, userId, hashedPassword], (err, results) => {
            if (err){
                console.error('Error adding user: ', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.status(201).json({message: 'User added successfully'});
            }
        });
    });
});

//post table 생성 - id(auto increment), title, content, createdData
app.post("/post", (req, res) => {
    const {title, content} = req.body;

    //현재 시간을 MYSQL DATETIME 형식으로 변환
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const insertQuery = 'INSERT INTO posts (title, content, createdDate) VALUES (?, ?, ?)';

    db.query(insertQuery, [title, content, currentDate], (err, results) => {
        if(err){
            console.error('Error adding post: ', err);
            res.status(500).send('Internal Server Error');
        } else{
            console.log('Post added successfully');
            res.status(201).json({message: 'Post added successfully'});
        }
    });
});

app.get("/post", (req, res) => {
    const {number} = req.query;

    //number 값 유효성 검사
    if(!number || isNaN(number)){
        return res.status(400).json({error: "Invalid number parameter"});
    }

    const startId = (number -1) *10 +1;
    const endId = startId + 9;

    const selectQuery = 'SELECT id, title, content, DATE_FORMAT(createdDate, "%Y년 %m월 %d일") AS createdDate FROM posts WHERE id BETWEEN ? AND ?';
    db.query(selectQuery, [startId, endId], (err, results) => {
        if(err){
            console.error('Error fetching posts: ', err);
            res.status(500).send('Internal Server Error');
        } else{
            const postsArray = [];
            for (const post of results){
                postsArray.push({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    createdDate: post.createdDate
                });
            }
            res.json(postsArray);
        }
    });
});


app.listen(port, function(){
    console.log(`${port} port listen !!`)
})