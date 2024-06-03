const express = require("express");
const twilio = require("./Twilio");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("./utils/Jwt");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

io.use((socket, next) => {
  // console.log("Socket middleware");
  if (socket.handshake.query && socket.handshake.query.token) {
    const { token } = socket.handshake.query;
    try {
      const result = jwt.verifyToken(token);
      console.log("Token accepted");
      if (result.username) return next();
    } catch (error) {
      console.log(error);
    }
  }
  next(new Error("authentication error"));
});

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.emit("twilio-token", {
    token: twilio.getAccessTokenForVoice("chirag"),
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
  socket.on("answer-call", (sid) => {
    console.log("Answering call with sid", sid);
    twilio.answerCall(sid);
  });
});

app.get("/test", (req, res) => {
  res.send("Welcome to Twilio");
});

app.post("/check-token", (req, res) => {
  const { token } = req.body;
  let isValid = false;
  try {
    isValid = jwt.verifyToken(token);
  } catch (error) {
    console.log(error);
  }
  res.send({ isValid });
});

app.post("/login", async (req, res) => {
  console.log("Logging in");

  try {
    const { to, username, channel } = req.body;
    const data = await twilio.sendVerifyAsync(to, channel);
    res.send("Sent Code");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/verify", async (req, res) => {
  console.log("Verifing code");

  try {
    const { to, code, username } = req.body;
    const data = await twilio.verifyCodeAsync(to, code);

    if (data.status === "approved") {
      const token = jwt.createJwt(username);
      return res.send({ token });
    } else {
      res.status(401).send("Invalid verification code");
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/call-new", (req, res) => {
  console.log("receive a new call");
  io.emit("call-new", { data: req.body });
  const response = twilio.voiceResponse(
    "Thank you for call!! We will put you on hold until the next attendent is free."
  );
  res.type("text/xml");
  res.send(response.toString());
});

app.post("/call-status-changed", (req, res) => {
  console.log("call status changed", res.body);
  res.send("ok");
});

app.post("/enqueue", (req, res) => {
  const response = twilio.enqueueCall("Customer Service");
  console.log("Enqueuing call");
  io.emit("enqueue", { data: req.body });
  res.type("text/xml");
  res.send(response.toString());
});

app.post("/connect-call", (req, res) => {
  console.log("connecting call");
  const response = twilio.redirectCall("chirag");
  res.type("text/xml");
  res.send(response.toString());
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Listning on PORT ${PORT}`);
});
