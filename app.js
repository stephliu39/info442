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

//debugging attempt (posts to events JSON) - stephanie
// const dataDir = path.join(__dirname, 'public/data');
// const eventsFile = path.join(dataDir, 'events.json');

// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir, { recursive: true });
// }

// if (!fs.existsSync(eventsFile)) {
//   fs.writeFileSync(eventsFile, '[]');
// }

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/img'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({storage: storage});
// ^^^^^ debugging attempt (posts to events JSON) - stephanie

// create new event id
function generateUniqueId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

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

// Add user to json file
app.post('/api/addUser', async(req, res) => {
  const { name, email, uid } = req.body;

  if (!name || !email || !uid) {
    return res.status(400).send('Missing required fields');
  }
  
  try {
    let contents = await fs.readFile("public/data/users.json", "utf8");
    contents = JSON.parse(contents);

    contents.users.push({
      name,
      email,
      registered: [],
      following: [],
      uid,
      org: false
    });

    await fs.writeFile("public/data/users.json", JSON.stringify(contents));
    res.type("text").send("User has been created");

  } catch (err) {
    console.log(err);
  }
});

app.post('/api/addEvent', async (req, res) => {
  const { eventID, title, description, date, startTime, endTime, venue, orgId, eventImage } = req.body;

  try {
    let contents = await fs.readFile("public/data/events.json", "utf8");
    contents = JSON.parse(contents);

    contents.users.push({
      eventID,
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      orgId,
      eventImage
    });

    await fs.writeFile("public/data/events.json", JSON.stringify(contents));
    res.type("text").send("Event has been created");
  } catch (err) {
    console.log(err)
  }
});

// add post/event to JSON file
app.post('/api/events', upload.single('eventImage'), async (req, res) => {
  const { title, startTime, endTime, date, venue, description } = req.body;
  const eventImage = req.file ? `/img/${req.file.filename}` : null;

  if (!title || !startTime || !endTime || !date || !venue || !description || !eventImage) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const filePath = path.join(__dirname, 'public/data/events.json');
    const data = await fs.readFile(filePath, 'utf8');
    const events = JSON.parse(data);
    const newEvent = {
      eventID: generateUniqueId(),
      orgID: generateUniqueId(),
      title: title,
      startTime: startTime,
      endTime: endTime,
      date: date,
      venue: venue,
      description: description,
      eventImage: eventImage,
    };
   // events.push(newEvent);
    const updatedData = JSON.stringify(events, null, 2);
    await fs.writeFile(filePath, updatedData, 'utf8');
    res.status(201).send('Event added successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
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