const WebSocket = require("ws");

//create a websocket client
const client = new WebSocket("ws://localhost:9944");

//handling the event when successfully connected to the server
client.on("open", () => {
    console.log("client connected");

    const metaData = '{"user_acc_id": "XXX"}';

    //send a message to the server in 5s delay
    setTimeout(() => {
        client.send(metaData);
    }, 5000);

    //send the message to the server
    // client.send("bye");

    //handling the event when the websocket connection is closed
    client.on("close", (code) => {
        console.log(`Connection closed with code: ${code}`);
    });

    //disconnecting the websocket connection in 10s
    setTimeout(() => { 
        client.close();
    }, 10000);
});

//handling the event when recieving the message from the server
client.on("message", (message) => {
    console.log(`Recieved Message: ${message}`);
});

//handling the event when the connection to the server is unsuccessfull
client.on("error", (error) => {
    console.log(`ERROR: ${error.message}`);
});