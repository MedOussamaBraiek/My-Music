const express = require('express');
const app = express();
const mongoose = require('mongoose');

//init middleware
app.use(express.json());

//Connect to DB
const db = "mongodb+srv://oussama:oussama@musics.qwuqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true} ,(err)=>{
    if(err) throw err;
    console.log('Database connected...');
})

app.use('/api/user', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/music', require('./routes/music'));

app.listen(5000, 
    ()=>console.log("Server is listening on port 5000.."));