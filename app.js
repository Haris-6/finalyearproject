const express = require("express");
const connectToDB = require("./mongoConnection");
const cors = require("cors");  //It allows or restricts resources being requested from different origins. when backend and frontend have diff domain
const app = express();   //Initializes an Express application.
const http = require("http");  //it is used to create an HTTP server or want to add WebSocket or other real-time capabilities
const server = http.createServer(app);  //it is use to connect webserver

const userRoute = require("./routes/user");  // import route handlers from various files:
const loaderRoute = require("./routes/postLoaderAdd");
const inventoryRoute = require("./routes/postInventoryAdd");
const messageRoute = require("./routes/message");
const bookingRoute = require("./routes/booking");
const passwordRoute = require("./routes/password");
const contactUsRoute = require("./routes/contactUs");
const updateProfileRoute = require("./routes/updateProfile");
const totalRecordRoute = require("./routes/getRecords");

const { initializeSocket } = require("./config/socket");  //this function, which likely sets up WebSocket connections.for chat or live update

const port = process.env.PORT || 3001;

app.use(cors());  //Enables CORS for all routes in the application.
app.use(express.urlencoded({ extended: true, limit: "50mb" }));//Parses incoming requests with URL-encoded payloads.
app.use(express.json());//Parses incoming requests with json payloads.

// const io = new Server(server);

app.get("/", (req, res) => {
  res.status(200).json("Hello My Name is Chaudhary haris");
});

// io.on('connection', (socket) => {
//   console.log('A user connected: ', socket);
// });

app.use("/api/v1/user", userRoute);
app.use("/api/v1/loader", loaderRoute);
app.use("/api/v1/inventory", inventoryRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/password", passwordRoute);
app.use("/api/v1/contactus", contactUsRoute);
app.use("/api/v1/profile", updateProfileRoute);
app.use("/api/v1/record", totalRecordRoute);

const startServer = async () => {
  try {
    await connectToDB();
    server.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
    initializeSocket(server); //intialize websocket server
  } catch (err) {
    console.log(`Failed to start server ${err}`);
  }
};

startServer();
