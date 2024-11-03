const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 4000;

const validRoutes = require("./routes/index");
const { notFound, errorHandler, errorHandlerMiddleware } = require("./middleware/index");
const connectDB = require("./db/app");

app.use(cors());
app.use(express.json());

app.use("/api/v0/", validRoutes);
app.use(notFound);
app.use(errorHandlerMiddleware);

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("message", (msg) => {
        console.log("Message received:", msg);
        io.emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const start = async () => {
    try {
        await connectDB(process.env.MONGO_DB_CRAWDIFY);

        server.listen(port, () => {
            console.log(`Server listening at port ${port}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        setTimeout(start, 1000);
    }
};

start()
    .then()
    .catch((e) => console.log(e));
