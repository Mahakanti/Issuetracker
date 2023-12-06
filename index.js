const PORT = 8000;
const express = require('express');

const app = express();
//const router = require('./route');
const expressLayouts = require('express-ejs-layouts');
//Use the 'express.urlencoded' middleware to parse incoming request bodies with urlencoded payloads
app.use(express.urlencoded({ extended: true }))
// Use the 'express.json' middleware to parse incoming JSON payloads
app.use(express.json())

app.use(express.static('./public'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//use router for  incoming requests
app.use('/', require("./soute/main"));


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
// Start the server and listen on the specified port
app.listen(PORT, ()=>console.log(`connected to server : ${PORT} `) );