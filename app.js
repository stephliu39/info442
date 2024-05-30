/**
 * This app.js file manages an api for the campus connect website
 * install packages by running "npm install {package name}"
 * you only need to install express and multer
 * then run "nodemon" in the console to start up the app
 */

const express = require("express");
const app = express();
const multer = require('multer');
const ERR_MSG = "Something went wrong";
const ERR_CODE = 500;

const fs = require("fs").promises;
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// returns organizations in json format. You can access this using fetch in index.js
app.get('/api/organizations', async (req, res) => {
  try {
    // reads the json file and parses it
    let contents = await fs.readFile("data/organizations.json", "utf8");
    contents = JSON.parse(contents);

    // sends data from the json file in a response
    res.type("json").send(contents);
  } catch (err) {
    console.log(err);
  }
});

// returns users in json format
app.get('/api/users', async (req, res) => {
  try {
    let contents = await fs.readFile("data/users.json", "utf8");
    contents = JSON.parse(contents);
    
    res.type("json").send(contents);
  } catch (err) {
    console.log(err);
  }
});

// returns events in json format
app.get('/api/events', async (req, res) => {
  try {
    let contents = await fs.readFile("data/events.json", "utf8");
    contents = JSON.parse(contents);
    
    res.type("json").send(contents);
  } catch (err) {
    console.log(err);
  }
});

// makes a post request to post a new user into the users.json
app.post('/api/users', async (req, res) => {
  const email = req.body.email;
  const __ = req.body.__;

  try {
    // idk yet
  } catch (err) {
    console.log(err);
  }
});


// When you run nodemon in the console, you can open the website
// by visiting localhost:8000
const portNum = 8000;
app.use(express.static('public'));
const PORT = process.env.PORT || portNum;
app.listen(PORT);