//require mongoose
const mongoose = require('mongoose');
const env = require('./environment');

//define database path
mongoose.connect(env.db_path_deployed || `mongodb://localhost/${env.db_path}`, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true 
});

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