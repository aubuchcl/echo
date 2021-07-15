const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const port = 80;
const fs = require("fs");
const helmet = require("helmet");

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
    console.log(process.env.CYCLE_INSTANCE_IPV6_IP);
    res.status(200);
    res.json(process.env.CYCLE_INSTANCE_IPV6_IP);
    res.end();
  } else if (req.method === "POST") {
    res.status(200);
    // const toStdOut = JSON.stringify(req.body)
    // res.json(req.body);
    // process.stdout.write(toStdOut)
    let x = JSON.stringify(req.body, null, 2);
    fs.writeFileSync("/path", x);
    console.log(x);
    console.log("old");
    console.log(req.body);
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
