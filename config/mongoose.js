//require mongoose
const mongoose = require('mongoose');

//define database path
mongoose.connect('mongodb://localhost/kelvin_electric_development', { useNewUrlParser: true, useUnifiedTopology: true });

//set up connection
const db = mongoose.connection;

//handle error
db.on('error', console.error.bind(console, 'Error in connecting to the server'));

//handle connection
db.once('open', function(){
    console.log('Connected to the database: mongodb');
});

//export db
module.exports = db;