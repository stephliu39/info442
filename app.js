/**
 * This app.js file manages an api for the campus connect website
 * install packages by running these lines in your terminal:
 * npm install express
 * npm install multer
 * npm install -g nodemon
 * if you push, do not push your node_modules folder. add files one by one
 * using: git add filename
 * in the directory, run "nodemon" in the console to start up the app
 */

const express = require("express");
const path = require('path');
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
    let contents = await fs.readFile("public/data/organizations.json", "utf8");
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
    let contents = await fs.readFile("public/data/users.json", "utf8");
    contents = JSON.parse(contents);

    res.type("json").send(contents);
  } catch (err) {
    console.log(err);
  }
});

// returns events in json format
app.get('/api/events', async (req, res) => {
  try {
    let contents = await fs.readFile("public/data/events.json", "utf8");
    contents = JSON.parse(contents);

    res.type("json").send(contents);
  } catch (err) {
    console.log(err);
  }
});

// makes a post request to post a new user into the users.json
app.post('/api/users', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const userId = req.body.uid;  

  try {
    // idk yet
  } catch (err) {
    console.log(err);
  }
});


// When you run nodemon in the console, you can open the website
// by visiting localhost:8000
const portNum = 8000;
// app.use(express.static('public'));
// const PORT = process.env.PORT || portNum;
// app.listen(PORT);

app.use(express.static(path.join(__dirname, 'public')));

// Serve images from the "img" directory
app.use('/img', express.static(path.join(__dirname, 'img')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || portNum;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});