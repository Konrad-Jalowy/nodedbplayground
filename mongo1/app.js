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

app.get("/users/withoutempty", async (req, res) => {
    let _users = await User.find({"hobbies": {$exists: true, $ne: []}});
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

app.get("/users/unwind2", async(req, res) => {
    let _users = await User.aggregate([
        {
            $unwind: "$hobbies"
        },
        {
            $match: {
                hobbies: {
                    $in: ['Coding', "SQL"]
                }
            }
        }
    ]);
    return res.json({"users": _users});

});


app.get("/users/unwind3", async(req, res) => {
    let _users = await User.aggregate([
        {
            $unwind: "$hobbies"
        },
        {
            $group: {
                _id: "$hobbies"
            }
        }
    ]);
    return res.json({"hobbies": _users});

});

app.get("/users/unwind4", async(req, res) => {
    let _users = await User.aggregate([
        {
            $unwind: "$hobbies"
        },
        {
            $group: {
                _id: "$hobbies",
                count: {$sum: 1}
            }
        }
    ]);
    return res.json({"hobbies": _users});

});

module.exports = app;