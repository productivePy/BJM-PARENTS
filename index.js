const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "public")));
app.get("/*", (req, res) => {
  var component = req.url.split("/");
  if (
    component[1] == "Home" ||
    "Diary" ||
    "fees" ||
    "ReportCard" ||
    "Attendance" ||
    "timeTable" ||
    "userLogin"
  ) {
    fs.readFile(
      path.join(__dirname, "public", "index.html"),
      "utf8",
      (err, data) => {
        if (err) {
          res.send(404);
        } else {
          res.send(data.replace(`load('Home')`, `load('${component[1]}')`));
        }
      }
    );
  } else {
    res.send(component);
  }
});

server.listen(3000);
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("details", (data) => {
    const headers = { Authorization: `Bearer ${data}` };

    fetch("https://api.eschoolweb.org/parent-home/get-parent-details", {
      headers,
    })
      .then((response) => response.json())
      .then((data) => socket.emit('details', data))
      .catch((error) => socket.emit('details', error));
  });
  socket.on("login", (user, password) => {
    const url = "https://api.eschoolweb.org/login";
    const headers = {
      "Content-Type": "application/json",
      "Academic-Year": "undefined",
      Authorization: "Bearer null",
      Origin: "https://bjmcarmelacademy.eschoolweb.org",
    };

    const data = {
      username: user,
      password: password,
      email: user,
    };

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => socket.emit("login", data.access_token))
      .catch((error) => socket.emit("login", "Login Failed!"));
  });
});
