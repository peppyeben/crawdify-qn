const { asyncWrapper } = require("../../middleware");

// app.post("/webhook", (req, res) => {
//     message = req.body;
//     console.log("Received a POST request");
//     console.log("Headers:", req.headers);
//     console.log("Received message:", message);

//     if (!req.body) {
//         return res.sendStatus(400);
//     }

//     const processedData = processData(message);
//     // Emit the data to all connected clients
//     io.emit("streamData", processedData);

//     res.status(200).end("Message received");
// });

function processData(message) {
    return message;
}

const webhookRequest = asyncWrapper(async (req, res) => {
    message = req.body;

    console.log("Received a POST request");
    console.log("Headers:", req.headers);
    console.log("Received message:", message);

    if (!req.body) {
        return res.sendStatus(400);
    }

    const processedData = processData(message);
    // Emit the data to all connected clients
    io.emit("streamData", processedData);

    res.status(200).end("Message received");
});

module.exports = {
    webhookRequest,
};
