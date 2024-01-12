const express = require('express')
const app = express()

app.get('/', function(req,res){
    console.log('connect/')
    res.send('Hello world!!')
})

app.listen(3000, function(){
    console.log('3000 port listen !!')
})