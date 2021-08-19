const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const port = 80;
const fs = require("fs");
const helmet = require("helmet");

const {exec} = require("child_process");




app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://[::]:80");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.all("/echo", (req, res) => {
  if (req.method === "GET") {
    exec(`curl --unix-socket /var/run/cycle/api/api.sock http://internal.cycle/v1/environment/scoped-variables -H "x-cycle-token: ${process.env.CYCLE_API_TOKEN}" `, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
    
    console.log(process.env.CYCLE_INSTANCE_IPV6_IP);
    res.status(200);
    res.json(process.env.CYCLE_INSTANCE_IPV6_IP);
    res.end();
  } else if (req.method === "POST") {
    res.status(200);
    let x = JSON.stringify(req.body, null, 2);
    fs.writeFileSync("/path", x);
    console.log(x);
    console.log(JSON.stringify(req.headers, null, 2));
    console.log(JSON.stringify(req.originalUrl, null, 2));
    res.end();
  } else if (req.method === "PUT") {
    res.status(200);
    res.json({ working: true });
    res.end();
  }
});

//pre-flight requests
app.options("*", function (req, res) {
  res.send(200);
});

server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  /* eslint-disable no-console */
  console.log("Node Endpoints working :)");
});

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
});

module.exports = server;
