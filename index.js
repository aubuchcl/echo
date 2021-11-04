const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const port = 8080;
const fs = require("fs");
const helmet = require("helmet");


const util = require('util');
const exec = util.promisify(require('child_process').exec);

count = 0


app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.raw());
const blob = function (reqq){
  return reqq.blob()
}
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
app.all("/environment", (req, res) => {
  const getEnvironment = `curl --unix-socket /var/run/cycle/api/api.sock http://internal.cycle/v1/environment -H "x-cycle-token: ${process.env.CYCLE_API_TOKEN}"`

  const getEnvVars = async (cmd) => {
    const { stdout, stderr } = await exec(`${cmd}`);
    console.log('stdout:', stdout);
  }
  if (req.method === "GET") {
    res.status(200);
    res.json(getEnvVars(getEnvironment));
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

app.all("/echo", async(req, res) => {
  const curlcommand = `curl --unix-socket /var/run/cycle/api/api.sock http://internal.cycle/v1/environment/scoped-variables -H "x-cycle-token: ${process.env.CYCLE_API_TOKEN}"`

  const getEnvVars = async (cmd) => {
    const { stdout, stderr } = await exec(`${cmd}`);
    console.log('stdout:', stdout);
  }
  if (req.method === "GET") {
    res.status(200);
    res.json(process.env.CYCLE_INSTANCE_IPV6_IP);
    getEnvVars(curlcommand);
    res.end();
  } else if (req.method === "POST") {
    res.status(200);
    console.log("Logging raw body:", req.body);
    console.log("Trying to dump into string:", String(req.body));
    console.log(typeof(req.body))

    // fs.writeFileSync("/path", x);
    // console.log(req)

    console.log(req.is())
    console.log("***\n")
    console.log(req.accepts())
    console.log("***\n")
    console.log(req.acceptsCharsets())
    console.log("***\n")
    console.log(req.acceptsEncodings())
    console.log("***\n")
    console.log(req.acceptsLanguages())
    // console.log(JSON.stringify(req.headers, null, 2));
    console.log("***\n")
    console.log("***\n")
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
