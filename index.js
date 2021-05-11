//initialize the variables
const express = require('express');
const port = 8000;

const app = express();


//start the server
app.listen(port, function(err){
    if(err){
        console.log(`Error in starting the server: ${err}`);
        return;
    }
    console.log(`The server is fired at port: ${port}`);
})