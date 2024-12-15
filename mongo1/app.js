const express = require('express');

const app = express();

const User = require("./models/userModel");

app.use(express.json());

app.get('/', (req, res) => {
  res.json({"msg": "hello world"})
});

app.get("/users/all", async (req, res) => {
    let _users = await User.find({});
    return res.json({"users": _users});
});

app.get("/users/unwind1", async(req, res) => {
    let _users = await User.aggregate([
        {
            $unwind: "$hobbies"
        }
    ]);
    return res.json({"users": _users});

});

module.exports = app;