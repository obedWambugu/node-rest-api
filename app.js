//import Express
const express = require('express');

//Create an app and configure it to parse requests with JSON payloads
const app = express();
app.use(express.json());

//Make this application a server by getting it to listen for connections
//Connect to a port to listen for incoming requests
const PORT = process.env.PORT || 3000; //allows to choose a cloud platform port or default port

//Set up server to listen at the port
app.listen(PORT, () => {
    console.log('Server listening on PORT:', PORT);
});


//Define a status endpoint
app.get("/status", (request, response) => {
    //define the response we want to send
    const status = {
        "Status": "running"
    };

    response.send(status); //takes JSON object as the argument
});

//Post route using the app.post() function
app.post("/post", (request, response) => {
    //define the request and assign it to the request body
    const { title, content } = request.body;

    //Check whether the request is correct
    if (!title || !content) {
        return response.status(400).json({
            message: "Missing title or content"
        });
    }

    //Log the title
    console.log(`Received post: ${title}`);

    //Produce a response
    response.status(200).json({
        message: "Success"
    });
});

//This block of code associates the "/" route with the index.html file
const path = require('path');

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

//This method retrieves the form data from 
//request.query array, and sends it as a response to the client.
app.get("/process_get", (req, res) => {
    response = {
        first_name: req.query.first_name,
        last_name: req.query.last_name
    }

    console.log(response);
    // res.end(JSON.stringify(response));
    // res.send(response);
    res.json(response);
});

const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.post("/process_post", urlencodedParser, (req, res) => {
    response = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    }

    console.log(response);
    res.json(response);
});

//To list all uses in the user.json file
//We implement a route
const fs = require("fs");

app.get("/users", (req, res) =>{
    fs.readFile(__dirname + "/" + "users.json", "utf8", (err, data) =>{
        if(err) throw err;
        res.end(data);
    });
});

//Get user by id
app.get("/users/:id", (req, res) =>{
    fs.readFile(__dirname + "/" + "users.json", "utf8", (err, data) =>{
        if(err) throw err;
        var users = JSON.parse(data);
        var user = users["user" + req.params.id]
        res.send(user);
    });
});

//Json request has id in it
// app.post("/users", (req, res) =>{
//     fs.readFile(__dirname + "/" + "users.json", "utf8", (err, data) =>{
//         if(err) throw err;
//         var users = JSON.parse(data);
//         var user = req.body;
//         users["user"+user.id] = user
//         res.end( JSON.stringify(users));

//         fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users, null, 2), (err) =>{
//             if(err) throw err;
//         });
//     });

// });

//Post new user with generated id
app.post("/users", (req, res) =>{
    fs.readFile(__dirname + "/" + "users.json", "utf8", (err, data) =>{
        if(err) throw err;
        var users = JSON.parse(data);
        var newUserData = req.body;

        // Get the current max ID
        const ids = Object.values(users).map(u => u.id || 0);
        const newId = (Math.max(...ids, 0)) + 1;

        //create new user
        const newUser = {
            ...newUserData,
            id: newId
        };

        users["user"+ newId] = newUser
        res.end( JSON.stringify(users));

        fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users, null, 2), (err) =>{
            if(err) throw err;
        });
    });

});

//Deleting an user
app.delete("/users/:id", (req, res) =>{
    fs.readFile(__dirname + "/" + "users.json", "utf8", (err, data) =>{
        if(err) throw err;
        var users = JSON.parse(data);
        delete users["user" + req.params.id];
        fs.writeFile(__dirname + "/users.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).send("Failed to delete user.");
            }
            res.status(200).send(`User with id ${req.params.id} deleted successfully.`);
        });
    });
});

//update user
app.put("/users/:id", (req, res) =>{
    fs.readFile(__dirname + "/" + "users.json", "utf8", (err, data) =>{
        if(err) throw err;
        var users = JSON.parse(data);
        users["user" + req.params.id] =req.body
        res.send(users);

        fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users, null, 2), (err) =>{
            if(err) throw err;
        });
    });
});