////////////////////////////////  Create the WebSocket Server    ////////////////////////////////


//import the web socket package
const webSocket = require("ws");

const redis = require("redis");

// const redis_url = "35.188.168.176";
// const redis_port = "6379";


const redisOptions = {
    host: "35.188.168.176",
    port: 6379,
    // If your Redis server requires authentication, provide the password here
    // password: "your_password",
};

//create the web socket server
const server = new webSocket.Server({port:9944});

let redisClient;

(async () => {
    redisClient = redis.createClient();
    redisClient.on('error', (error) => console.log(`Redis error: ${error}`));
    await redisClient.connect();
})();

// Event handler for when a client connects to the WebSocket server
server.on("connection", (ws) => {
    //log message print in the console when a new client connects
    console.log("New client connected!");

    //send welcome message to the connected client
    ws.send("Hello from REDIS SERVER");

    //event for server recieve the message from the client
    try {
        ws.on("message", async (message) => {
        // console.log(`message: ${message}`);

        let data = JSON.parse(message);

        let metaData = [
            {user_acc_id: data.user_acc_id},
            {pub_address: data.pub_address},
            {cid: data.cid},
            {d_url: data.d_url},
            {gcs_url: data.gcs_url},
            {bucket_name: data.bucket_name},
            {file_name: data.file_name},
        ];

        const response = { metaData };
        await redisClient.set('metadata', JSON.stringify(response));

        const chashedData = await redisClient.get('metadata');

        if (chashedData) {
            ws.send(`Cached data: ${chashedData}`);
            console.log(`Cached data: ${chashedData}`);
            return;
        } else {
            ws.send(`No metadata found`);
            console.log("No metadata found");
        }

        // ws.send(`your message: ${message}`); //send the responce back to the client
        });
    } catch (error) {
        console.error(`Error getting metadata: ${error}`);
        return res.status(500).json({message: error});
    }
});
