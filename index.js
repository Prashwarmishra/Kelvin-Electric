//initialize the variables
const express = require('express');
const port = 8000;

const app = express();

//set up middlewares
app.use(express.urlencoded({extended: true}));

//set up database
const db = require('./config/mongoose');

//set up routes
app.use('/', require('./routes'));

//start the server
app.listen(port, function(err){
    if(err){
        console.log(`Error in starting the server: ${err}`);
        return;
    }
    console.log(`The server is fired at port: ${port}`);
})