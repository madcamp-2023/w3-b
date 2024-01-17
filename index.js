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

//Read (회원조회)
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

//Create (회원가입)
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

//Delete (회원탈퇴)
app.delete("/user", (req, res) => {
    const {userId} = req.query;
    const deleteQuery = 'DELETE FROM users WHERE userId = ?';
    //users table에서 해당 user 삭제
    db.query(deleteQuery, [userId], (err, results) => {
        if(err){
            console.error('Error deleting review: ', err);
            return res.status(500).send('Internal Server Error');
        }
        if(results.affectedRows === 0){
            return res.status(404).json({error: "User not found for the given userId"});
        }

        //reviews table에서 해당 review 삭제
        const deleteReviewQuery = 'DELETE FROM reviews WHERE userId = ?';
        db.query(deleteReviewQuery, [userId], (reviewErr, reviewResults) => {
            if(reviewErr){
                console.error('Error deleting review: ', reviewErr);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Review deleted successfully');
            res.status(200).json({message: 'User deleted successfully'});
        })
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
    const {page} = req.query;
    const number = parseInt(page,10);
    // paper 값 유효성 검사
    if(!number || isNaN(number)){
        return res.status(400).json({error: "Invalid number parameter"});
    }

    // const startId = (number -1) *10 +1;
    // const endId = startId + 9;
    const pageSize = 10;
    const offset = (number -1)*pageSize;
    const selectQuery = 'SELECT id, title, content, DATE_FORMAT(createdDate, "%Y년 %m월 %d일") AS createdDate FROM posts ORDER BY id DESC LIMIT ?, ?';
    // const selectQuery = 'SELECT id, title, content, DATE_FORMAT(createdDate, "%Y년 %m월 %d일") AS createdDate FROM posts WHERE id BETWEEN ? AND ? ORDER BY id DESC';
    db.query(selectQuery, [offset, pageSize], (err, results) => {
        if(err){
            console.error('Error fetching posts: ', err);
            res.status(500).send('Internal Server Error');
        } else{
            const postsArray = results.map(post => ({
                number: post.id,
                title: post.title,
                content: post.content,
                createdDate: post.createdDate
            }));
            res.json(postsArray);
        }
    });
});

//Create
app.post("/review", (req, res) => {
    const{userId, title, content, next, github} = req.body;
    //reviews에 동일한 userId로 이미 등록된 review 있는지 검사
    const checkDuplicateQuery = 'SELECT COUNT (*) AS count FROM reviews WHERE userId = ?';
    db.query(checkDuplicateQuery, [userId], (duplicateErr, duplicateResults) => {
        if(duplicateErr){
            console.error('Error checking duplicate userId: ', duplicateErr);
            return res.status(500).send('Internal Server Error');
        }
        const duplicateCount = duplicateResults[0].count;

        if(duplicateCount > 0){
            return res.status(409).json({error: "User already submitted a review"});
        }
        //users table에 userId로 등록된 name 가져오기
        const getNameQuery = 'SELECT name FROM users WHERE userId = ?';
        db.query(getNameQuery, [userId], (nameErr, nameResults) => {
            if(nameErr){
                console.error('Error fetching name: ', nameErr);
                return res.status(500).send('Internal Server Error');
            }

            if(nameResults.length === 0){
                return res.status(404).json({error: "User not found"});
            }

            const name = nameResults[0].name;

            const insertQuery = 'INSERT INTO reviews (userId, name, title, content, next, github) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(insertQuery, [userId, name, title, content, next, github], (insertErr, insertResults) => {
                if(insertErr){
                    console.error('Error adding review: ', insertErr);
                    return res.status(500).send('Internal Server Error');
                }
                console.log(insertResults);
                res.status(201).json({message: 'Review added successfully'});
            });
        });
    });
});

    
//Read
app.get("/review", (req, res) => {
    const selectQuery = 'SELECT name, title, content, next, github FROM reviews ORDER BY RAND()';
    db.query(selectQuery, (err, results) => {
        if(err){
            console.error('Error fetching review: ', err);
            res.status(500).send('Internal Server Error');
        } else{
            const reviewsArray = results.map(review => ({
                name: review.name,
                title: review.title,
                content: review.content,
                next: review.next,
                github: review.github
            }));
            res.json(reviewsArray);
        }
    });
    
});

//Delete
app.delete("/review", (req, res) => {
    const {userId} = req.query;
    const deleteQuery = 'DELETE FROM reviews WHERE userId = ?';
    db.query(deleteQuery, [userId], (err, results) => {
        if(err){
            console.error('Error deleting review: ', err);
            return res.status(500).send('Internal Server Error');
        }
        if(results.affectedRows === 0){
            return res.status(404).json({error: "Review not found for the given userId"});
        }
        res.status(200).json({message: 'Review deleted successfully'});
    });
});

//Update
app.put("/review", (req, res) => {
    const{userId} = req.query;
    const{name, title, content, next, github} = req.body;

    const checkReviewQuery = 'SELECT * FROM reviews WHERE userId = ?';
    db.query(checkReviewQuery, [userId], (checkErr, checkResults) => {
        if(checkErr){
            console.error('Error checking review existence: ',checkErr);
            return res.status(500).send('Internal Server Error');
        }
        if(checkResults.length === 0){
            return res.status(404).json({error: "Review not found for the given userId"});
        }
        const updateQuery = 'UPDATE reviews SET name = ?, title =?, content = ?, next = ?, github = ? WHERE userId = ?';
        db.query(updateQuery, [name, title, content, next, github, userId], (updateErr, updateResults) => {
            if(updateErr){
                console.error('Error updating reviews: ', updateErr);
                return res.status(500).send('Internal Server Error');
            }
            console.log('updateResults: ', updateResults);
            res.status(200).json({message: 'Review updated successfully'});
        });
    });
});


app.listen(port, function(){
    console.log(`${port} port listen !!`)
});