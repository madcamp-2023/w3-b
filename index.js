// const express = require('express');
// const session = require('express-session');
// const bodyParser = require('body-parser');
// const FileStore = require('session-file-store')(session);

// var authRouter = require('./lib_login/auth');
// var authCheck = require('./lib_login/authCheck.js');
// var template = require('./lib_login/template.js');
// const { Http2ServerRequest } = require('http2');

// const app = express()
// const port = 80

// app.use(bodyParser.urlencoded({extended: false}))
// app.use(session({
//     secret: 'week3',
//     resave: false,
//     saveuninitialized: true,
//     store:new FileStore()
// }))

// app.get('/',(req, res)=>{
//     if(!authCheck.isOwner(req, res)){
//         res.redirect('/auth/login');
//         return false;
//     } else{
//         res.redirect('/main');
//         return false;
//     }
// })

// app.use('/auth', authRouter);

// app.get('/main', (req, res)=>{
//     if (!authCheck.isOwner(req, res)){
//         res.redirect('/auth/login');
//         return false;
//     }
//     var html = template.HTML('Welcome',
//     `<hr>
//     <h2>메인 페이지에 오신 것을 환영합니다.</h2>
//     <p>로그인에 성공하셨습니다.</p>
//     </hr>`,
//     authCheck.statusUI(req, res)
//     )
//     res.send(html);
// })

// app.listen(port, () => {
//     console.log(`${port} listen!!`)
// })

const express = require('express')
const cors = require('cors')
const app = express()

let corsOptions = {
    origin: '*',
    credential: true,
}

app.use(cors(corsOptions))

app.get('/', function(req,res){
    console.log('connect/')
    res.send('Hello world!!')
})

app.listen(3000, function(){
    console.log('3000 port listen !!')
})