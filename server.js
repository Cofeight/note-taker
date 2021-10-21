const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
let notes = require("./db/db.json");
const uuid = require("./helper/uuid");
const readFromFile = util.promisify(fs.readFile);

//This establishes the express and the port location
const app = express();
const PORT = process.env.PORT || 3000;

//instance.METHOD (PATH, HANDLER)

//Express middleware functions for user inputs
//Uses
    //.urlencoded - Returns middleware that only parses urlencoded bodies
    //.json - Returns middleware that only parses json
    //.static - Serves static files, based on serve-static
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Express route using instance (app) with METHOD(.get)
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    notes = JSON.parse(data);
    res.json(notes);
  });
});

//Express route using instance (app) with METHOD(.post)
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = { title, text, id: uuid() };
  notes.push(newNote);
  const noteString = JSON.stringify(notes);
  fs.writeFile(`./db/db.json`, noteString, (err) =>
    err ? console.error(err) : console.log("success")
  );
  res.status(201).json(newNote);
});

//Express route using instance (app) with METHOD(.delete)
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((remove) => remove.id !== id);
  const noteString = JSON.stringify(notes);
  fs.writeFile(`./db/db.json`, noteString, (err) =>
    err ? console.error(err) : console.log("success")
  );
  res.status(201).json(notes);
});

//Redirects user back to index.html if invalid directory name inputted
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//Binds and listens for any connections to the specified port
app.listen(process.env.PORT || PORT, () => console.log(`tuning in to the sweet sounds of http://localhost:${PORT}`));